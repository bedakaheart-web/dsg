// src/hooks/useRealtimeChat.ts
//
// Shared real-time side-chat primitive for the Admin Command Dashboard and
// the Responder Dashboard. One hook instance = one visible thread:
//
//   useRealtimeChat(currentUserId, targetUserId, { incidentId?, broadcast? })
//
// - 1-on-1 thread: targetUserId set, broadcast=false.
// - Broadcast thread: broadcast=true (targetUserId ignored, receiver_id NULL).
//
// Behaviour: loads history, subscribes to INSERTs on `messages` via the
// `public:messages` channel, appends matching rows (deduplicated against
// optimistic sends), sends with optimistic UI, and marks incoming messages
// read when the thread is open.

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../js/supabase";

export interface ChatMessage {
  id: string;
  legacy_incident_id?: string | null;
  sender_id: string;
  receiver_id: string | null;
  sender_role?: string | null;
  recipient_role?: string | null;
  message: string;
  image_url?: string | null;
  created_at: string;
  incident_id: number | string | null;
  is_read: boolean;
}

interface UseRealtimeChatOptions {
  incidentId?: string | null;
  broadcast?: boolean;
}

function sameThread(
  m: Pick<ChatMessage, "sender_id" | "receiver_id" | "incident_id">,
  me: string,
  target: string | null,
  broadcast: boolean,
  incidentId: string | null | undefined,
): boolean {
  if (String(incidentId ?? "") !== String(m.incident_id ?? "")) return false;
  if (broadcast) return m.receiver_id === null;
  if (!target) return false;
  const pair =
    (m.sender_id === me && m.receiver_id === target) ||
    (m.sender_id === target && m.receiver_id === me);
  return pair;
}

export function useRealtimeChat(
  currentUserId: string | null,
  targetUserId: string | null,
  opts: UseRealtimeChatOptions = {},
) {
  const { incidentId = null, broadcast = false } = opts;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const threadKey = `${currentUserId ?? ""}|${targetUserId ?? ""}|${broadcast ? "b" : "d"}|${incidentId ?? ""}`;
  const threadRef = useRef({ currentUserId, targetUserId, broadcast, incidentId });
  threadRef.current = { currentUserId, targetUserId, broadcast, incidentId };
  // Unique channel per hook instance — prevents "cannot add postgres_changes
  // callbacks after subscribe()" when multiple useRealtimeChat instances mount
  // with the same static name. Supabase reuses channels by name, so a static
  // "chat-messages-realtime" collides when a second instance calls .on() after
  // the first already called .subscribe(). Mirrors the fix already applied in
  // src/components/Chatbox.tsx (a7ca257).
  const channelIdRef = useRef<string>(`urc-${Math.random().toString(36).slice(2, 9)}`);

  const markRead = useCallback(async () => {
    const t = threadRef.current;
    if (!t.currentUserId || t.broadcast || !t.targetUserId) return;
    // Clear red badge: mark incoming 1-1 messages as read (real column is receiver_id, text is message)
    try {
      await supabase
        .from("chat_messages")
        .update({ is_read: true } as any)
        .eq("receiver_id", t.currentUserId)
        .eq("sender_id", t.targetUserId)
        .eq("is_read", false);
    } catch {}
  }, []);

  // ── History ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!currentUserId || (!broadcast && !targetUserId)) {
        setMessages([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      let query = supabase.from("chat_messages").select("*").order("created_at", { ascending: true }).limit(200);
      if (broadcast) {
        query = query.is("receiver_id", null);
      } else {
        query = query.or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${targetUserId}),` +
          `and(sender_id.eq.${targetUserId},receiver_id.eq.${currentUserId})`
        );
      }
      if (incidentId) query = query.eq("incident_id", incidentId);
      else query = query.is("incident_id", null);
      const { data, error: err } = await query;
      if (cancelled) return;
      if (err) {
        // Missing `messages` table (migration not pushed yet) surfaces as a
        // 404/PGRST error — treat as an empty thread instead of an error
        // banner so the drawer stays usable; everything else still reports.
        const missing =
          (err as { code?: string }).code === "PGRST205" ||
          /does not exist|not found|404/i.test(err.message ?? "");
        if (missing) {
          console.warn(
            "[useRealtimeChat] `messages` table unavailable — run `supabase db push` (20260912_create_side_chat_messages)."
          );
        } else {
          setError("Couldn't load messages: " + err.message);
        }
      } else {
        setMessages(
          ((data ?? []) as ChatMessage[]).filter(m => String(m.incident_id ?? "") === String(incidentId ?? ""))
        );
      }
      setLoading(false);
      void markRead();
    };
    void load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadKey]);

  // ── Realtime INSERT subscription ─────────────────────────────────────────
  // Returns the unsubscribe + a notifier hook so drawers can bump unread
  // badges / play alerts for messages outside the open thread.
  const [lastEvent, setLastEvent] = useState<{ msg: ChatMessage; at: number } | null>(null);

  useEffect(() => {
    if (!currentUserId) return;
    // Use a unique channel name per hook instance so concurrent mounts (e.g.
    // Team page's ResponderChatDrawer + other drawers/ChatBox) never collide on
    // the same "chat-messages-realtime" topic. All .on() are registered BEFORE
    // .subscribe() in a single chain as required by Supabase realtime.
    const channelName = `chat-messages-realtime-${channelIdRef.current}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const m = payload.new as ChatMessage;
          const t = threadRef.current;
          setLastEvent({ msg: m, at: Date.now() });
          if (sameThread(m, t.currentUserId!, t.targetUserId, t.broadcast, t.incidentId)) {
            setMessages(prev => (prev.some(x => x.id === m.id) ? prev : [...prev, m]));
            void markRead();
          }
        }
      )
      // .on() is always chained BEFORE .subscribe(); only warn on real errors —
      // CLOSED is expected when Realtime is disabled or channel is removed, not an error.
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[useRealtimeChat] public:messages status:", status);
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, [currentUserId, markRead]);

  // ── Send (optimistic) ────────────────────────────────────────────────────
  // Inserts into chat_messages must populate sender_role/recipient_role
  // (NOT NULL constraint). Roles are derived from the same source of truth
  // used elsewhere in the app: the `profiles.role` column (fallback to auth
  // metadata), matching the pattern in src/components/Chatbox.tsx.
  const send = useCallback(async (text: string): Promise<boolean> => {
    const t = threadRef.current;
    const body = text.trim();
    if (!t.currentUserId || !body || (!t.broadcast && !t.targetUserId)) return false;
    setSending(true);
    setError(null);

    // ── Resolve roles from profiles (source of truth) ─────────────────────
    let myRole: string | null = null;
    let theirRole: string | null = null;
    try {
      const { data: meProf } = await supabase.from("profiles").select("role").eq("id", t.currentUserId).single();
      if (meProf?.role) myRole = (meProf.role as string).toLowerCase();
    } catch {}
    if (!myRole) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const metaRole = (user?.user_metadata as any)?.role;
        if (metaRole) myRole = String(metaRole).toLowerCase();
      } catch {}
    }
    // Fallback to 'citizen' to avoid NOT NULL violation if profiles lookup fails
    // (should never happen in normal operation — profiles always has a role).
    if (!myRole) myRole = "citizen";

    if (!t.broadcast && t.targetUserId) {
      try {
        const { data: themProf } = await supabase.from("profiles").select("role").eq("id", t.targetUserId).single();
        if (themProf?.role) theirRole = (themProf.role as string).toLowerCase();
      } catch {}
      // If recipient profile not found (e.g. deleted user), fall back to null
      // only to be coerced below; for NOT NULL we keep a generic value.
      if (!theirRole) theirRole = "citizen";
    } else if (t.broadcast) {
      // Broadcast: fixed roles per DB rules (admin -> responder, receiver_id = null)
      // RLS only allows admins to insert broadcast; direct-message inserts stay unchanged
      myRole = "admin";
      theirRole = "responder";
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimistic: ChatMessage = {
      id: tempId,
      sender_id: t.currentUserId,
      receiver_id: t.broadcast ? null : t.targetUserId,
      sender_role: myRole,
      recipient_role: theirRole,
      incident_id: t.incidentId ?? null,
      message: body,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages(prev => [...prev, optimistic]);
    // Real columns per supabase/migrations (20260920000000_centralized_presence_and_chat_fix.sql & 20260912100000_create_side_chat_messages.sql):
    // chat_messages = id, sender_id, receiver_id (NULL = broadcast), incident_id, message, sender_role, recipient_role, is_read, created_at
    // ResponderChatDrawer reads m.message, broadcast is receiver_id=null
    const insertPayload: Record<string, any> = {
      sender_id: optimistic.sender_id,
      receiver_id: optimistic.receiver_id, // null for broadcast (receiver_id = null)
      sender_role: myRole,
      recipient_role: theirRole,
      incident_id: optimistic.incident_id,
      message: body,
    };
    const { data, error: err } = await supabase
      .from("chat_messages")
      .insert(insertPayload as any)
      .select()
      .single();
    setSending(false);
    if (err || !data) {
      // Log full Supabase error object for debugging broadcasts (receiver_id=null)
      console.error("[useRealtimeChat] chat_messages insert failed:", err, { payload: insertPayload, broadcast: t.broadcast });
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setError("Send failed: " + (err?.message ?? "unknown error"));
      return false;
    }
    setMessages(prev => prev.map(m => (m.id === tempId ? (data as ChatMessage) : m)));
    return true;
  }, []);

  return { messages, loading, sending, error, send, markRead, lastEvent, threadKey };
}

// ── Unread-count helper shared by both drawers ─────────────────────────────
// 1-on-1 unread comes from the server `is_read` flag (per-receiver rows).
// Broadcasts are a SINGLE row per message, so per-user read state can't live
// in `is_read` — instead each client stores its own "broadcasts seen through"
// timestamp in localStorage, and unread = broadcasts newer than that mark
// sent by someone else. Call on mount, on every realtime INSERT, and after
// opening a thread (post markRead).
export function getBroadcastLastSeen(userId: string): string {
  try {
    return localStorage.getItem(`dsg_broadcast_seen_${userId}`) ?? new Date(0).toISOString();
  } catch {
    return new Date(0).toISOString();
  }
}

export function setBroadcastLastSeen(userId: string, iso = new Date().toISOString()): void {
  try {
    localStorage.setItem(`dsg_broadcast_seen_${userId}`, iso);
  } catch {
    // private mode — ignore
  }
}

export async function fetchUnreadCounts(
  currentUserId: string,
): Promise<{ bySender: Record<string, number>; broadcast: number }> {
  const bySender: Record<string, number> = {};
  // Real column is receiver_id and text is message (ResponderChatDrawer reads m.message)
  const { data: rows, error: rowsErr } = await (supabase.from("chat_messages").select("sender_id,receiver_id").eq("receiver_id", currentUserId).eq("is_read", false).limit(500) as any);
  if (rowsErr) {
    console.error("[useRealtimeChat] fetchUnreadCounts failed:", rowsErr);
  }
  for (const row of ((rows ?? []) as Array<{ sender_id: string }>)) {
    bySender[row.sender_id] = (bySender[row.sender_id] ?? 0) + 1;
  }
  const { count } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .is("receiver_id", null)
    .neq("sender_id", currentUserId)
    .gt("created_at", getBroadcastLastSeen(currentUserId));
  return { bySender, broadcast: count ?? 0 };
}
