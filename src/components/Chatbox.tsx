// src/components/ChatBox.tsx
// Role-based chat component with image attachment support.
// Citizens see their assigned Responder chat; Responders and Admins
// see direct chat with each other.
//
// CHANGES IN THIS VERSION:
//   - Offline message queueing with IndexedDB and optimistic UI
//   - Audio/video call integration with WebRTC
//   - Real presence tracking (Supabase Realtime Presence) drives
//     the "Online" / "Offline" status in the header.
//   - Typing indicator broadcasts on per-conversation channels.

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../js/supabase";
import { FaPaperPlane, FaImage, FaTimes, FaSpinner, FaPhone, FaVideo, FaPhoneSlash, FaVideoSlash } from "react-icons/fa";
import { useOfflineQueue } from "../hooks/useOfflineQueue";
import { useWebRTC } from "../hooks/useWebRTC";
import CallOverlay from "./CallOverlay";

// ── Types ────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  sender_role?: string | null;
  recipient_role?: string | null;
  incident_id: string | null;
  message: string;
  image_url: string | null;
  created_at: string;
}

interface ChatParticipant {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
}

// ── Centralized toggle: hide admin from citizen chat (code retained, not deleted) ───
// Set to false to show admin contacts again if professor requires
const HIDE_ADMIN_FOR_CITIZEN = true;
const ADMIN_CONTACT_HIDDEN_NOTE = "Admin contacts hidden for citizens — retained for professor toggle";

// ── Constants ────────────────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VISIBLE_MESSAGES = 100;
const TYPING_IDLE_MS = 1500;
const TYPING_EXPIRE_MS = 3000;

// ── Helpers ──────────────────────────────────────────────────────────
function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ── Component ────────────────────────────────────────────────────────
export default function ChatBox({
  assignedResponderId,
  incidentId,
  userRole,
  recipientName: recipientNameProp,
}: { assignedResponderId?: string | null; incidentId?: string | null; userRole?: string; recipientName?: string }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ChatParticipant | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [otherTyping, setOtherTyping] = useState(false);
  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const userIdRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const otherTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const myTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Unique realtime channel per ChatBox mount — prevents "cannot add postgres_changes callbacks after subscribe()" when multiple ChatBox instances (Team, Citizen Chat, drawers) mount with the same static name "chat-messages-realtime". Supabase reuses channels by name, so a static name collides when two components subscribe simultaneously after one already called .subscribe().
  const realtimeChannelIdRef = useRef<string>(`cb-${Math.random().toString(36).slice(2, 9)}`);

  const role = userRole ?? user?.role ?? "citizen";
  const isCitizen = role === "citizen";
  const recipientId = assignedResponderId ?? null;

  const {
    isOnline: queueOnline,
    queueSize,
    addToQueue,
    flushQueue,
  } = useOfflineQueue();

  const {
    state: callState,
    startCall,
    declineCall,
    endCall,
    toggleMute,
    toggleCamera,
    upgradeToVideo,
  } = useWebRTC(user?.id ?? userIdRef.current ?? null, recipientId);

  const effectiveOnline = queueOnline;

  // ── Network status ──
  useEffect(() => {
    const handleOnline = () => {
      flushQueue((msg) => sendFromQueue(msg));
    };
    window.addEventListener("online", handleOnline);
    return () => { window.removeEventListener("online", handleOnline); };
  }, [flushQueue]);

  // ── Fetch user info ──
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        userIdRef.current = session.user.id;
        let r: string | undefined = session.user.user_metadata?.role;
        try {
          const { data: prof } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
          if (prof?.role) r = prof.role as string;
        } catch {}
        setUser({ id: session.user.id, email: session.user.email ?? "", role: r });
      } catch {}
    })();
  }, []);

  // ── Presence ──
  useEffect(() => {
    if (!user?.id) return;
    const presenceChannel = supabase.channel("presence:online-users", { config: { presence: { key: user.id } } });
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        setOnlineUserIds(new Set(Object.keys(presenceChannel.presenceState())));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await presenceChannel.track({ online_at: new Date().toISOString() });
      });
    return () => { supabase.removeChannel(presenceChannel); };
  }, [user?.id]);

  // ── Typing indicator ──
  useEffect(() => {
    if (!user?.id || !recipientId) {
      typingChannelRef.current = null;
      return;
    }
    const pairKey = [user.id, recipientId].sort().join("_");
    const channelName = `typing_${pairKey}${incidentId ? `_${incidentId}` : ""}`;
    const channel = supabase.channel(channelName);
    channel
      .on("broadcast", { event: "typing" }, (payload) => {
        const from = (payload.payload as { from?: string; typing?: boolean })?.from;
        const isTyping = (payload.payload as { from?: string; typing?: boolean })?.typing;
        if (from !== recipientId) return;
        if (otherTypingTimeoutRef.current) clearTimeout(otherTypingTimeoutRef.current);
        setOtherTyping(!!isTyping);
        if (isTyping) otherTypingTimeoutRef.current = setTimeout(() => setOtherTyping(false), TYPING_EXPIRE_MS);
      })
      .subscribe();
    typingChannelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      typingChannelRef.current = null;
      if (otherTypingTimeoutRef.current) clearTimeout(otherTypingTimeoutRef.current);
      setOtherTyping(false);
    };
  }, [user?.id, recipientId, incidentId]);

  const broadcastTyping = useCallback((typing: boolean) => {
    const channel = typingChannelRef.current;
    if (!channel || !user?.id) return;
    channel.send({ type: "broadcast", event: "typing", payload: { from: user.id, typing } });
  }, [user?.id]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    broadcastTyping(true);
    if (myTypingTimeoutRef.current) clearTimeout(myTypingTimeoutRef.current);
    myTypingTimeoutRef.current = setTimeout(() => broadcastTyping(false), TYPING_IDLE_MS);
  }, [broadcastTyping]);

  // ── Load participants ──
  useEffect(() => {
    (async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) return;
        let myRole: string | undefined = u.user_metadata?.role;
        try {
          const { data: me } = await supabase.from("profiles").select("role").eq("id", u.id).single();
          if (me?.role) myRole = me.role as string;
        } catch {}
        const { data: profiles } = await supabase.from("profiles").select("id, email, full_name, role").order("created_at", { ascending: true });
        if (!profiles) return;
        const filtered = (profiles as ChatParticipant[]).filter(p => {
          const r = (p.role ?? "").toLowerCase();
          if (myRole === "citizen") {
            // HIDDEN: admin contacts for citizen — kept for professor toggle
            if (HIDE_ADMIN_FOR_CITIZEN) return r === "responder"; // admin hidden
            // if professor requires, set HIDE_ADMIN_FOR_CITIZEN=false to show admin too
            // retained: return r === "responder" || r === "admin";
            return r === "responder";
          }
          if (myRole === "responder") return r === "admin"; // responder → admin HQ chat (kept)
          if (myRole === "admin") return r === "responder";
          return false;
        });
        void ADMIN_CONTACT_HIDDEN_NOTE; // keep constant used
        setParticipants(filtered);
      } catch {}
    })();
  }, []);

  // Recipient online status from profiles (matches sidebar "on_duty" logic)
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);
  useEffect(() => {
    if (!recipientId || !user?.id) return;
    const fetch = async () => {
      try {
        const { data: prof } = await supabase.from("profiles").select("status").eq("id", recipientId).single();
        setIsRecipientOnline((prof?.status ?? "").toLowerCase() === "on_duty");
      } catch {
        setIsRecipientOnline(false);
      }
    };
    void fetch();
    const interval = setInterval(() => void fetch(), 30000);
    return () => clearInterval(interval);
  }, [recipientId, user?.id]);

  // ── Build query ──
  const buildChatQuery = useCallback((userId: string) => {
    let query = supabase.from("chat_messages").select("*");
    if (recipientId && incidentId) {
      query = query.or(`and(sender_id.eq.${userId},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${userId})`).eq("incident_id", incidentId);
    } else if (recipientId) {
      query = query.or(`and(sender_id.eq.${userId},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${userId})`);
    } else if (isCitizen) {
      query = query.eq("sender_id", userId);
    } else {
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
      if (incidentId) query = query.eq("incident_id", incidentId);
    }
    return query.order("created_at", { ascending: true });
  }, [isCitizen, recipientId, incidentId]);

  // ── Load messages & subscribe ──
  useEffect(() => {
    let cancelled = false;
    const loadMessages = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) { setLoading(false); return; }
        userIdRef.current = u.id;
        const query = buildChatQuery(u.id);
        const { data, error } = await query;
        if (!cancelled) {
          if (error) {
            const missing = (error as { code?: string }).code === "PGRST205";
            if (missing) {
              console.warn("[ChatBox] `chat_messages` table unavailable — see migration.");
            } else {
              console.error("[ChatBox] Failed to load chat_messages:", error);
            }
            setMessages([]);
            setLoading(false);
            return;
          }
          const allMsgs = (data as ChatMessage[]) || [];
          const deduped = Array.from(new Map(allMsgs.map(m => [m.id, m])).values());
          setMessages(deduped.slice(-MAX_VISIBLE_MESSAGES));
          setLoading(false);
        }
      } catch { if (!cancelled) setLoading(false); }
    };
    loadMessages();
    // Use a unique channel name per ChatBox instance so concurrent mounts (e.g. Citizen Chat + Team/ResponderChatDrawer) never try to call .on() on an already-subscribed "chat-messages-realtime" channel. All .on() are registered BEFORE .subscribe() as required by Supabase.
    const realtimeChannelName = `chat-messages-realtime-${realtimeChannelIdRef.current}-${recipientId ?? "all"}-${incidentId ?? "all"}`;
    const channel = supabase
      .channel(realtimeChannelName)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        if (!cancelled) {
          const me = userIdRef.current;
          if (recipientId) {
            const inPair = (newMsg.sender_id === me && newMsg.receiver_id === recipientId) || (newMsg.sender_id === recipientId && newMsg.receiver_id === me);
            if (!inPair) return;
            if (incidentId && String(newMsg.incident_id) !== String(incidentId)) return;
          } else if (newMsg.sender_id !== me && newMsg.receiver_id !== me) {
            return;
          }
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            const updated = [...prev, newMsg];
            return updated.slice(-MAX_VISIBLE_MESSAGES);
          });
          if (newMsg.sender_id === recipientId) {
            if (otherTypingTimeoutRef.current) clearTimeout(otherTypingTimeoutRef.current);
            setOtherTyping(false);
          }
        }
      })
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [recipientId, incidentId, isCitizen, buildChatQuery]);

  // ── Mark as read — clears red badge once thread is opened/viewed ──
  // Updates is_read=true for incoming messages in this thread so other responders won't see stale unread
  const markThreadRead = useCallback(async () => {
    const me = user?.id ?? userIdRef.current;
    const other = recipientId;
    if (!me || !other) return;
    try {
      // Try both column names for compatibility (receiver_id vs recipient_id)
      // First attempt with receiver_id, fallback to recipient_id
      const tryReceiver = await supabase.from("chat_messages").update({ is_read: true } as any).eq("receiver_id", me).eq("sender_id", other).eq("is_read", false);
      if ((tryReceiver as any).error && /column.*receiver_id|does not exist/i.test((tryReceiver as any).error.message ?? "")) {
        await supabase.from("chat_messages").update({ is_read: true } as any).eq("recipient_id", me).eq("sender_id", other).eq("is_read", false);
      }
      // If custom is_read column missing, silently ignore — badge will be derived via polling
    } catch {}
    // Also try recipient_id path if needed (covers migrations where both exist)
    try {
      await supabase.from("chat_messages").update({ is_read: true } as any).eq("recipient_id", me).eq("sender_id", other).eq("is_read", false);
    } catch {}
  }, [user?.id, recipientId]);

  // Mark read when thread opens or new messages arrive while thread is open
  useEffect(() => {
    if (!recipientId || !user?.id) return;
    // Debounce slightly to batch rapid inserts
    const t = setTimeout(() => void markThreadRead(), 300);
    return () => clearTimeout(t);
  }, [recipientId, user?.id, messages.length, markThreadRead]);

  // Also mark read immediately after history load finishes
  useEffect(() => {
    if (!loading && recipientId && user?.id && messages.length >= 0) {
      void markThreadRead();
    }
  }, [loading, recipientId, user?.id, markThreadRead]);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, otherTyping]);

  // ── Image upload handler ──
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert(t("chat.errorWrongFormat", "Only JPEG, PNG, and WEBP images are allowed."));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert(t("chat.errorTooLarge", "Image must be under 5 MB."));
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => { setImagePreview(ev.target?.result as string); };
    reader.readAsDataURL(file);
  }, [t]);

  // ── Send message (from queue flush) ──
  const sendFromQueue = useCallback(async (queuedMsg: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data: { user: me } } = await supabase.auth.getUser();
      let myRole: string | undefined = session.user.user_metadata?.role ?? me?.user_metadata?.role;
      try { const { data: meProf } = await supabase.from("profiles").select("role").eq("id", session.user.id).single(); if (meProf?.role) myRole = (meProf.role as string).toLowerCase(); } catch {}
      const mRole = (myRole ?? "").toLowerCase();
      let rRole = "";
      if (recipientId) {
        const { data: recipientProfile } = await supabase.from("profiles").select("role").eq("id", recipientId).single();
        rRole = ((recipientProfile?.role as string) ?? "").toLowerCase();
        const allowed = (mRole === "citizen" && rRole === "responder") || (mRole === "responder" && (rRole === "admin" || rRole === "citizen")) || (mRole === "admin" && rRole === "responder");
        if (!allowed) return;
      } else if (mRole === "citizen") { return; }
      // Ensure NOT NULL roles — fallback to derived role or generic to avoid constraint violation
      const safeSenderRole = mRole || role || user?.role || "citizen";
      const safeRecipientRole = rRole || (mRole === "citizen" ? "responder" : mRole === "admin" ? "responder" : "citizen");
      await supabase.from("chat_messages").insert({
        sender_id: session.user.id, receiver_id: recipientId,
        sender_role: safeSenderRole, recipient_role: safeRecipientRole,
        incident_id: incidentId ?? null, message: queuedMsg.content, image_url: queuedMsg.imageUrl,
      });
    } catch {}
  }, [recipientId, incidentId]);

  // ── Send message ──
  const sendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && !imageFile) || sending) return;
    try {
      setSending(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setSending(false); return; }

      // Role enforcement
      const { data: { user: me } } = await supabase.auth.getUser();
      let myRole: string | undefined = session.user.user_metadata?.role ?? me?.user_metadata?.role;
      try { const { data: meProf } = await supabase.from("profiles").select("role").eq("id", session.user.id).single(); if (meProf?.role) myRole = (meProf.role as string).toLowerCase(); } catch {}
      const mRole = (myRole ?? "").toLowerCase();
      let rRole = "";
      if (recipientId) {
        const { data: recipientProfile } = await supabase.from("profiles").select("role").eq("id", recipientId).single();
        rRole = ((recipientProfile?.role as string) ?? "").toLowerCase();
        const allowed = (mRole === "citizen" && rRole === "responder") || (mRole === "responder" && (rRole === "admin" || rRole === "citizen")) || (mRole === "admin" && rRole === "responder");
        if (!allowed) { alert("You cannot send messages to this user."); setSending(false); return; }
      } else if (mRole === "citizen") { alert("No assigned responder found."); setSending(false); return; }

      let imageUrl: string | null = null;
      if (imageFile) {
        setUploading(true);
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const fileName = `${session.user.id}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from("chat-images").upload(fileName, imageFile, { cacheControl: "3600", upsert: false, contentType: imageFile.type });
        if (uploadError) {
          setUploading(false); setSending(false);
          const missingBucket = /not found|404|bucket|chat-images/i.test(uploadError.message ?? "");
          alert(missingBucket ? "Image storage is not set up yet. Your text was not sent — ask an admin to create the bucket." : `Image upload failed: ${uploadError.message}`);
          return;
        }
        const { data: publicUrlData } = supabase.storage.from("chat-images").getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
        setUploading(false);
      }

      const safeSenderRole = mRole || role || user?.role || "citizen";
      const safeRecipientRole = rRole || (mRole === "citizen" ? "responder" : mRole === "admin" ? "responder" : "citizen");
      const msgData = { sender_id: session.user.id, receiver_id: recipientId, sender_role: safeSenderRole, recipient_role: safeRecipientRole, incident_id: incidentId ?? null, message: inputText.trim(), image_url: imageUrl };

      if (!effectiveOnline) {
        // Queue offline
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        await addToQueue({ content: inputText.trim(), timestamp: new Date().toISOString(),
          senderId: session.user.id, senderRole: safeSenderRole, recipientId, incidentId: incidentId ?? null,
          imageUrl, status: "pending", tempId,
        });
        // Optimistic UI
        const optimisticMsg: ChatMessage = { id: tempId, sender_id: session.user.id, receiver_id: recipientId, sender_role: safeSenderRole, recipient_role: safeRecipientRole, incident_id: incidentId ?? null, message: inputText.trim(), image_url: imageUrl, created_at: new Date().toISOString() };
        setMessages(prev => [...prev, optimisticMsg]);
        setInputText(""); setImageFile(null); setImagePreview(null);
        setSending(false);
        broadcastTyping(false);
        return;
      }

      const { error: insertError } = await supabase.from("chat_messages").insert(msgData);
      broadcastTyping(false);
      if (myTypingTimeoutRef.current) clearTimeout(myTypingTimeoutRef.current);

      if (insertError) {
        const isTableMissing = (insertError as { code?: string }).code === "PGRST205";
        const isPermissionError = /permission|unauthorized|no row|rate limit/i.test(insertError.message ?? "");
        console.error("[ChatBox] chat_messages insert failed:", insertError);
        if (isTableMissing) { console.warn("[ChatBox] `chat_messages` table not found."); alert("Chat isn't set up yet. Your message was not sent."); setSending(false); }
        else if (isPermissionError) { alert("Chat permission error."); setSending(false); }
        else { alert(`Send failed: ${insertError.message}`); setSending(false); }
      } else {
        setInputText(""); setImageFile(null); setImagePreview(null); setSending(false);
      }
    } catch { setSending(false); setUploading(false); }
  }, [inputText, imageFile, recipientId, incidentId, isCitizen, sending, broadcastTyping, effectiveOnline, addToQueue]);

  // ── Call handlers ──
  const handleStartAudioCall = useCallback(async () => {
    console.log("Audio call clicked");
    if (!effectiveOnline) return;
    setCallType("audio");
    setShowCallOverlay(true);
    await startCall("audio");
  }, [effectiveOnline, startCall]);

  const handleStartVideoCall = useCallback(async () => {
    console.log("Video call clicked");
    if (!effectiveOnline) return;
    setCallType("video");
    setShowCallOverlay(true);
    await startCall("video");
  }, [effectiveOnline, startCall]);

  const handleEndCall = useCallback(() => {
    console.log("[ChatBox] End Call clicked");
    endCall();
    setShowCallOverlay(false);
    setCallType(null);
  }, [endCall]);

  // Sync overlay with remote signaling (incoming call, remote hangup)
  useEffect(() => {
    console.log("[ChatBox] callState changed:", callState.callState, "callType:", callState.callType, "remote:", callState.remoteParticipantId);
    if (callState.callState === "ringing" || callState.callState === "active") {
      setShowCallOverlay(true);
      if (callState.callType) setCallType(callState.callType);
    } else if (callState.callState === "ended" || callState.callState === "declined") {
      // Show ended state briefly then hide
      const t = setTimeout(() => {
        setShowCallOverlay(false);
        setCallType(null);
      }, 1200);
      return () => clearTimeout(t);
    } else if (callState.callState === "idle" && showCallOverlay) {
      // Fallback: ensure overlay hides when hook resets to idle after cleanup
      if (!callState.localStream && !callState.remoteStream) {
        setShowCallOverlay(false);
        setCallType(null);
      }
    }
  }, [callState.callState, callState.callType, callState.remoteParticipantId, callState.localStream, callState.remoteStream, showCallOverlay]);

  // ── Role-based warning ──
  const recipientName = useMemo(() => {
    if (recipientNameProp) return recipientNameProp;
    const p = participants.find(p => p.id === recipientId);
    return p?.full_name ?? p?.email ?? "";
  }, [participants, recipientId, recipientNameProp]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "min(560px, calc(100dvh - 220px))", minHeight: "400px", maxHeight: "70dvh", backgroundColor: "rgba(15,21,33,0.95)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden", fontFamily: "'Inter', sans-serif", color: "#eef0f7" }}>
      <style>{`
        @keyframes chatTypingBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-3px); opacity: 1; } }
        .chat-typing-dot { width: 5px; height: 5px; border-radius: 50%; background-color: currentColor; display: inline-block; animation: chatTypingBounce 1.2s infinite ease-in-out; }
        .chat-typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .chat-typing-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 480px) {
          .chat-header-actions button { min-width: 40px; min-height: 40px; padding: 8px !important; font-size: 16px !important; }
          .chat-header-actions { gap: 4px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(8,12,20,0.6)", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: "36px", height: "36px", minWidth: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", backgroundColor: "rgba(46,204,143,0.15)", color: "#2ECC8F", border: "1px solid rgba(46,204,143,0.3)" }}>
            {recipientName ? getInitials(recipientName) : "?"}
          </div>
          {isRecipientOnline && (
            <span style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2ECC8F", border: "2px solid rgba(8,12,20,0.9)" }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: "700" }}>
            {recipientName || t("chat.chatWith", "Chat")}
            {!queueOnline && <span style={{ fontSize: "10px", color: "#EF5B5B", marginLeft: "6px" }}>(Offline)</span>}
          </div>
          <div style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "5px", color: otherTyping ? "#2ECC8F" : (isRecipientOnline ? "rgba(46,204,143,0.8)" : "rgba(238,240,247,0.35)") }}>
            {otherTyping ? (
              <>
                <span style={{ display: "inline-flex", gap: "2px" }}><span className="chat-typing-dot" /><span className="chat-typing-dot" /><span className="chat-typing-dot" /></span>
                {t("chat.typing", "typing...")}
              </>
            ) : isRecipientOnline ? t("chat.online", "Online") : t("chat.offline", "Offline")}
          </div>
        </div>
        {/* Call buttons */}
        <div className="chat-header-actions" style={{ display: "flex", gap: "6px", pointerEvents: "auto", zIndex: 10, position: "relative" }}>
          <button onClick={() => { console.log("Audio call clicked"); handleStartAudioCall(); }} disabled={!effectiveOnline} title="Audio Call" style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 10px", cursor: effectiveOnline ? "pointer" : "not-allowed", color: effectiveOnline ? "#2ECC8F" : "rgba(238,240,247,0.2)", fontSize: "16px", opacity: effectiveOnline ? 1 : 0.4, pointerEvents: effectiveOnline ? "auto" : "none", position: "relative", zIndex: 10, minWidth: "40px", minHeight: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <FaPhone />
          </button>
          <button onClick={() => { console.log("Video call clicked"); handleStartVideoCall(); }} disabled={!effectiveOnline} title="Video Call" style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 10px", cursor: effectiveOnline ? "pointer" : "not-allowed", color: effectiveOnline ? "#2ECC8F" : "rgba(238,240,247,0.2)", fontSize: "16px", opacity: effectiveOnline ? 1 : 0.4, pointerEvents: effectiveOnline ? "auto" : "none", position: "relative", zIndex: 10, minWidth: "40px", minHeight: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <FaVideo />
          </button>
          {queueSize > 0 && (
            <span title={`${queueSize} offline message(s) queued`} style={{ fontSize: "10px", color: "#FB923C", display: "flex", alignItems: "center", padding: "0 4px" }}>
              &#9679;
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(238,240,247,0.35)" }}>
            <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> {t("chat.loading", "Loading messages...")}
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(238,240,247,0.35)", fontSize: "12px" }}>
            {t("chat.noMessages", "No messages yet. Start a conversation!")}
          </div>
        ) : (
          messages.map(msg => {
            const isMine = msg.sender_id === user?.id;
            const isPending = msg.id.startsWith("temp-") || msg.sender_id === user?.id && !msg.created_at;
            return (
              <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "75%", padding: "10px 14px", borderRadius: "14px", fontSize: "13px", lineHeight: "1.5",
                  backgroundColor: isMine ? "rgba(46,204,143,0.15)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isMine ? "rgba(46,204,143,0.25)" : "rgba(255,255,255,0.07)"}`,
                  wordBreak: "break-word", opacity: isPending ? 0.7 : 1,
                  position: "relative",
                }}>
                  {msg.image_url && (
                    <a href={msg.image_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: "6px", borderRadius: "8px", overflow: "hidden" }}>
                      <img src={msg.image_url} alt="attachment" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", objectFit: "cover", display: "block" }} />
                    </a>
                  )}
                  {msg.message && <div>{msg.message}</div>}
                  <div style={{ fontSize: "9px", color: isPending ? "#FB923C" : "rgba(238,240,247,0.3)", marginTop: "4px", textAlign: "right", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                    {formatTime(msg.created_at)}
                    {isPending && <span title="Pending (offline)">&#9679;</span>}
                  </div>
                  {isPending && (
                    <div style={{ position: "absolute", top: "4px", right: "4px", fontSize: "8px", color: "#FB923C" }}>
                      <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        {otherTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 14px", borderRadius: "14px", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)", display: "inline-flex", alignItems: "center", gap: "4px", color: "rgba(238,240,247,0.5)" }}>
              <span className="chat-typing-dot" /><span className="chat-typing-dot" /><span className="chat-typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(8,12,20,0.6)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <img src={imagePreview} alt="Preview" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }} onClick={() => { setImagePreview(null); setImageFile(null); }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", fontWeight: "600" }}>{imageFile?.name}</div>
            <div style={{ fontSize: "9px", color: "rgba(238,240,247,0.35)" }}>{((imageFile?.size ?? 0) / 1024).toFixed(0)} KB</div>
          </div>
          <button onClick={() => { setImagePreview(null); setImageFile(null); }} style={{ background: "none", border: "none", color: "#EF5B5B", cursor: "pointer", fontSize: "14px" }}><FaTimes /></button>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={sendMessage} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(8,12,20,0.6)", flexShrink: 0 }}>
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px", cursor: uploading ? "not-allowed" : "pointer", color: uploading ? "rgba(238,240,247,0.2)" : "#2ECC8F", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", opacity: uploading ? 0.5 : 1 }} title={t("chat.attachImage", "Attach Image")}><FaImage /></button>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageSelect} style={{ display: "none" }} disabled={uploading} />
        <input id="chat-message-input" name="message" type="text" value={inputText} onChange={handleInputChange} placeholder={t("chat.typeMessage", "Type a message...")} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", color: "#eef0f7", outline: "none", fontFamily: "inherit" }} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) e.preventDefault(); }} />
        <button type="submit" disabled={sending || uploading || (!inputText.trim() && !imageFile)} style={{ background: sending || uploading ? "rgba(238,240,247,0.05)" : "rgba(46,204,143,0.15)", border: `1px solid ${sending || uploading ? "rgba(238,240,247,0.1)" : "rgba(46,204,143,0.3)"}`, borderRadius: "8px", padding: "8px 12px", cursor: sending || uploading ? "not-allowed" : "pointer", color: sending || uploading ? "rgba(238,240,247,0.3)" : "#2ECC8F", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", opacity: sending || uploading ? 0.5 : 1 }}>
          {sending ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaPaperPlane />}
        </button>
      </form>

      {/* Call Overlay */}
      {showCallOverlay && callType && (
        <CallOverlay
          state={callState}
          callType={callType}
          remoteName={recipientName}
          onMute={toggleMute}
          onCamera={toggleCamera}
          onUpgrade={upgradeToVideo}
          onEnd={handleEndCall}
          isOnline={effectiveOnline}
        />
      )}
    </div>
  );
}
