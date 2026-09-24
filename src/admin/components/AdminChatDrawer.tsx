// src/admin/components/AdminChatDrawer.tsx
//
// Collapsible real-time side-chat for the Admin Command Dashboard.
// Tabs: 1-on-1 team chat with on-duty/all responders (+ unread badges) and a
// team broadcast channel. Listens on `public:messages` so incoming rows append
// without refresh; sends are optimistic with Enter-to-send and auto-scroll.

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../js/supabase";
import {
  fetchUnreadCounts,
  setBroadcastLastSeen,
  useRealtimeChat,
  type ChatMessage,
} from "../../hooks/useRealtimeChat";
import { useWebRTC } from "../../hooks/useWebRTC";
import CallOverlay from "../../components/CallOverlay";
import { FaPhone, FaVideo } from "react-icons/fa";

// Full-screen drawer on phones so chat controls stay usable <768px.
function useIsNarrow(breakpoint = 768) {
    const [narrow, setNarrow] = useState(
      typeof window !== "undefined" ? window.innerWidth < breakpoint : false
    );
    useEffect(() => {
      const onResize = () => setNarrow(window.innerWidth < breakpoint);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [breakpoint]);
    return narrow;
  }

interface Contact {
  id: string;
  full_name: string | null;
  email: string;
  status?: string | null;
  last_seen?: string | null;
}

const isOnDuty = (c: Contact) => c.status === "on_duty" || c.status === "responding";

function fmtTime(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Bubble({ m, mine }: { m: ChatMessage; mine: boolean }) {  const failed = m.id.startsWith("temp-");
  return (
    <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 8 }}>
      <div
        style={{
          maxWidth: "82%", padding: "8px 12px", borderRadius: 10, fontSize: 13, lineHeight: 1.5,
          background: mine ? "rgba(0,102,255,0.18)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${mine ? "rgba(0,102,255,0.35)" : "rgba(255,255,255,0.1)"}`,
          color: "#eef0f7", overflowWrap: "break-word", opacity: failed ? 0.6 : 1,
        }}
      >
        <div>{m.message}</div>
        <div style={{ fontSize: 9, opacity: 0.5, marginTop: 3, textAlign: "right" }}>
          {failed ? "sending…" : fmtTime(m.created_at)}
        </div>
      </div>
    </div>
  );
}

export default function AdminChatDrawer({ open, onClose, targetId = null }: {
  open: boolean; onClose: () => void; targetId?: string | null;
}) {
  const [me, setMe] = useState("");
  const fullScreen = useIsNarrow();
  const [tab, setTab] = useState<"team" | "broadcast">("team");
  const [dutyFilter, setDutyFilter] = useState<"on" | "all">("on");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState<{ bySender: Record<string, number>; broadcast: number }>({ bySender: {}, broadcast: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Unique channel IDs per drawer instance — prevents postgres_changes after subscribe()
  // collisions when multiple drawers (or admin + responder) mount with same static name.
  const channelIdRef = useRef<string>(`acd-${Math.random().toString(36).slice(2, 9)}`);

  const broadcastMode = tab === "broadcast";
  const { messages, loading, sending, error: chatError, send, markRead } = useRealtimeChat(
    me || null, broadcastMode ? null : activeId, { broadcast: broadcastMode }
  );

  // ── Calling (admin ↔ responder) — same useWebRTC/TURN as citizen↔responder ──
  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const {
    state: callState,
    startCall,
    endCall,
    acceptCall,
    declineCall,
    toggleMute,
    toggleCamera,
    upgradeToVideo,
  } = useWebRTC(me || null, broadcastMode ? null : activeId);

  const handleStartAudioCall = async () => {
    setCallType("audio");
    setShowCallOverlay(true);
    await startCall("audio");
  };
  const handleStartVideoCall = async () => {
    setCallType("video");
    setShowCallOverlay(true);
    await startCall("video");
  };
  const handleEndCall = () => {
    endCall();
    setShowCallOverlay(false);
    setCallType(null);
  };
  const handleAcceptCall = async () => { await acceptCall(); };
  const handleDeclineCall = async () => { await declineCall(); setShowCallOverlay(false); setCallType(null); };
  // Sync overlay with remote signaling (incoming call, remote hangup)
  useEffect(() => {
    if (callState.callState === "ringing" || callState.callState === "active") {
      setShowCallOverlay(true);
      if (callState.callType) setCallType(callState.callType);
    } else if (callState.callState === "ended" || callState.callState === "declined") {
      const t = setTimeout(() => {
        setShowCallOverlay(false);
        setCallType(null);
      }, 1200);
      return () => clearTimeout(t);
    } else if (callState.callState === "idle" && showCallOverlay) {
      if (!callState.localStream && !callState.remoteStream) {
        setShowCallOverlay(false);
        setCallType(null);
      }
    }
  }, [callState.callState, callState.callType, callState.localStream, callState.remoteStream, showCallOverlay]);

  // ── Identity + contacts ──────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setMe(data.user.id);
    });
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id,full_name,email,status,last_seen")
        .eq("role", "responder")
        .order("full_name", { ascending: true });
      setContacts((data ?? []) as Contact[]);
    };
    void load();
    // Unique channel per drawer instance — all .on() BEFORE .subscribe()
    const ch = supabase
      .channel(`admin-chat-presence-${channelIdRef.current}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // ── Unread badges: refresh on mount, on any new message, after reading ──
  const refreshUnread = async (uid: string) => {
    if (!uid) return;
    setUnread(await fetchUnreadCounts(uid));
  };
  useEffect(() => {
    if (!me) return;
    void refreshUnread(me);
    // Unique channel per instance — also fix stale table name: use chat_messages
    const ch = supabase
      .channel(`admin-chat-unread-${channelIdRef.current}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () => {
        void refreshUnread(me);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  // ── Open thread → mark read + refresh badges ─────────────────────────────
  const openThread = async (id: string | null, nextTab: "team" | "broadcast") => {
    setTab(nextTab);
    setActiveId(id);
    setDraft("");
    if (!me) return;
    if (nextTab === "broadcast") {
      setBroadcastLastSeen(me);
      await refreshUnread(me);
    }
  };
  useEffect(() => {
    if (!open || !me) return;
    if (broadcastMode) {
      setBroadcastLastSeen(me);
      void refreshUnread(me);
    } else if (activeId) {
      void markRead().then(() => refreshUnread(me));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeId, broadcastMode]);

  // ── Auto-scroll to bottom on every new message ──────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, activeId, tab]);

  const submit = async () => {
    if (!draft.trim()) return;
    const text = draft;
    setDraft("");
    const ok = await send(text);
    if (!ok) {
      // useRealtimeChat already logged the full Supabase error object; also surface here for admin visibility
      console.error("[AdminChatDrawer] broadcast/1:1 send failed", { broadcast: broadcastMode, text });
    }
  };

  const visibleContacts = contacts.filter(c => dutyFilter === "all" || isOnDuty(c));
  const activeContact = contacts.find(c => c.id === activeId) ?? null;

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while chat drawer is open on mobile
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Deep-link a specific responder thread (e.g. Message button on a team
  // card): whenever targetId is provided, jump straight into that 1-on-1.
  useEffect(() => {
    if (targetId) {
      setTab("team");
      setActiveId(targetId);
      setDraft("");
    }
  }, [targetId, open]);

  if (!open && !(showCallOverlay && callType)) return null;

  return (
    <>
      <style>{`@keyframes adminChatSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes adminChatFade { from { opacity: 0; } to { opacity: 1; } }`}</style>
      {/* Backdrop overlay — click outside closes */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 940, background: "rgba(0,0,0,0.5)", animation: "adminChatFade 0.25s ease" }}
      />
      <aside
        aria-label="Admin team chat"
        style={{
          position: "fixed", top: 0, right: 0, height: "100vh", zIndex: 950,
          width: fullScreen ? "100vw" : "min(384px, 92vw)", maxWidth: fullScreen ? "100vw" : 384,
          background: "rgba(13,17,23,0.98)", borderLeft: "1px solid rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "-12px 0 48px rgba(0,0,0,0.6)",
          animation: "adminChatSlideIn 0.28s ease",
        }}
      >
          {/* Header */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#eef0f7", flex: 1 }}>Side Chat</span>
            <button onClick={() => openThread(null, "team")} title="Team chats"
              style={pillStyle(tab === "team")}>Team</button>
            <button onClick={() => openThread(null, "broadcast")} title="Team broadcast channel"
              style={pillStyle(tab === "broadcast")}>
              Broadcast{unread.broadcast > 0 && ` (${unread.broadcast})`}
            </button>
            <button onClick={onClose} aria-label="Close chat"
              style={{ background: "none", border: "none", color: "rgba(238,240,247,0.5)", fontSize: 18, cursor: "pointer" }}>×</button>
          </div>

          {(!broadcastMode && !activeId) ? (
            <>
              {/* Duty filter */}
              <div style={{ padding: "8px 12px", display: "flex", gap: 6, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {(["on", "all"] as const).map(f => (
                  <button key={f} onClick={() => setDutyFilter(f)} style={pillStyle(dutyFilter === f)}>
                    {f === "on" ? "On Duty" : "All"}
                  </button>
                ))}
              </div>
              {/* Contact list */}
              <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
                {visibleContacts.length === 0 && (
                  <div style={{ fontSize: 12, color: "rgba(238,240,247,0.4)", textAlign: "center", padding: 24 }}>
                    No responders {dutyFilter === "on" ? "on duty" : "found"}
                  </div>
                )}
                {visibleContacts.map(c => {
                  const n = unread.bySender[c.id] ?? 0;
                  return (
                    <button key={c.id} onClick={() => openThread(c.id, "team")}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                        padding: "9px 10px", borderRadius: 9, border: "1px solid transparent",
                        background: "transparent", cursor: "pointer", color: "#eef0f7", marginBottom: 2,
                      }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                        background: isOnDuty(c) ? "#00B074" : "rgba(238,240,247,0.25)",
                        boxShadow: isOnDuty(c) ? "0 0 6px #00B074" : "none",
                      }} />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {c.full_name || "Responder"}
                        </span>
                        <span style={{ display: "block", fontSize: 10, color: "rgba(238,240,247,0.4)" }}>
                          {isOnDuty(c) ? "On duty" : "Off duty"}
                        </span>
                      </span>
                      {n > 0 && (
                        <span style={{ minWidth: 20, height: 20, borderRadius: 10, background: "#FF3B30", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
                          {n > 99 ? "99+" : n}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Thread header */}
              <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => (broadcastMode ? onClose() : setActiveId(null))}
                  style={{ background: "none", border: "none", color: "#4A90D9", cursor: "pointer", fontSize: 14 }}>←</button>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#eef0f7", flex: 1 }}>
                  {broadcastMode ? "📢 Team Broadcast" : (activeContact?.full_name || "Responder")}
                </span>
                {!broadcastMode && activeId && (
                  <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                    <button onClick={handleStartAudioCall} title="Audio Call" style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#4A90D9", fontSize: 12, display: "flex", alignItems: "center" }}>
                      <FaPhone size={12} />
                    </button>
                    <button onClick={handleStartVideoCall} title="Video Call" style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#4A90D9", fontSize: 12, display: "flex", alignItems: "center" }}>
                      <FaVideo size={12} />
                    </button>
                  </div>
                )}
              </div>
              {/* Error banner — show Supabase error to admin (broadcast with receiver_id=null) */}
              {chatError && (
                <div role="alert" style={{ margin: "8px 12px 0", padding: "8px 10px", borderRadius: 8, background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.25)", color: "#FF3B30", fontSize: 12, lineHeight: 1.5 }}>
                  {chatError}
                </div>
              )}
              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
                {loading ? (
                  <div style={{ fontSize: 12, color: "rgba(238,240,247,0.4)", textAlign: "center", padding: 20 }}>Loading…</div>
                ) : messages.length === 0 ? (
                  <div style={{ fontSize: 12, color: "rgba(238,240,247,0.4)", textAlign: "center", padding: 20 }}>
                    {broadcastMode ? "No broadcasts yet. Announcements here reach the whole team." : "No messages yet. Say hello 👋"}
                  </div>
                ) : (
                  messages.map(m => <Bubble key={m.id} m={m} mine={m.sender_id === me} />)
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Composer */}
              <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 8 }}>
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submit(); } }}
                  placeholder={broadcastMode ? "Broadcast to team…" : "Message…"}
                  maxLength={1000}
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "#eef0f7", fontSize: 13, outline: "none" }}
                />
                <button onClick={() => void submit()} disabled={!draft.trim()}
                  style={{ background: "rgba(0,102,255,0.18)", border: "1px solid rgba(0,102,255,0.4)", color: "#4A90D9", borderRadius: 8, padding: "0 16px", fontWeight: 700, cursor: "pointer", opacity: draft.trim() ? 1 : 0.5 }}>
                  Send
                </button>
              </div>
            </>
          )}
        {/* Call Overlay — admin↔responder (same infra as citizen↔responder) */}
        {showCallOverlay && callType && (
          <CallOverlay
            state={callState}
            callType={callType}
            remoteName={activeContact?.full_name || "Responder"}
            onMute={toggleMute}
            onCamera={toggleCamera}
            onUpgrade={upgradeToVideo}
            onEnd={handleEndCall}
            onAccept={handleAcceptCall}
            onDecline={handleDeclineCall}
            isOnline={callState.callState === "active" ? true : !!activeContact}
          />
        )}
      </aside>
    </>
  );
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "rgba(0,102,255,0.18)" : "transparent",
    border: "1px solid rgba(0,102,255,0.35)",
    color: active ? "#4A90D9" : "rgba(238,240,247,0.5)",
    borderRadius: 14, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer",
  };
}
