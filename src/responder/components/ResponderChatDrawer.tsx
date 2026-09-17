// src/responder/components/ResponderChatDrawer.tsx
//
// Collapsible real-time side-chat for the Responder Dashboard. Mirrors the
// admin drawer: 1-on-1 threads are directed at the HQ admin context (the
// responder picks an admin from the HQ list), broadcasts from HQ are
// read-only here with sound + badge alerts on arrival.

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../js/supabase";
import {
  fetchUnreadCounts,
  setBroadcastLastSeen,
  useRealtimeChat,
  type ChatMessage,
} from "../../hooks/useRealtimeChat";
import { useMeteredCall } from "../../hooks/useMeteredCall";
import MeteredCallOverlay from "../../components/MeteredCallOverlay";
import { FaPhone, FaVideo } from "react-icons/fa";

// Full-screen drawer on phones so chat controls stay usable <480px.
function useIsNarrow(breakpoint = 480) {
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
}

function playPing() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = new Ctx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Audio unavailable (e.g. autoplay policy) — badge still alerts visually.
  }
}

function fmtTime(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Bubble({ m, mine }: { m: ChatMessage; mine: boolean }) {
  const failed = m.id.startsWith("temp-");
  return (
    <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 8 }}>
      <div
        style={{
          maxWidth: "82%", padding: "8px 12px", borderRadius: 10, fontSize: 13, lineHeight: 1.5,
          background: mine ? "rgba(46,204,143,0.16)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${mine ? "rgba(46,204,143,0.35)" : "rgba(255,255,255,0.1)"}`,
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

export default function ResponderChatDrawer({ responderId, open, onClose, targetId = null, targetName = null, responderName = "Responder" }: {
    responderId: string; open: boolean; onClose: () => void; targetId?: string | null; targetName?: string | null; responderName?: string;
}) {
  const me = responderId;
  const fullScreen = useIsNarrow();
  const [tab, setTab] = useState<"hq" | "broadcast">("hq");
  const [admins, setAdmins] = useState<Contact[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState<{ bySender: Record<string, number>; broadcast: number }>({ bySender: {}, broadcast: 0 });
  const [flashBroadcast, setFlashBroadcast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const broadcastMode = tab === "broadcast";
  const { messages, loading, send, markRead } = useRealtimeChat(
    me || null, broadcastMode ? null : activeId, { broadcast: broadcastMode }
  );

  // ── Calling (responder ↔ admin HQ) — Metered SDK ──
  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const {
    state: callState,
    joinRoom,
    toggleMute,
    toggleCamera,
    endCall,
  } = useMeteredCall(
    broadcastMode ? null : activeId,
    responderName
  );

  const handleStartAudioCall = async () => {
    setCallType("audio");
    setShowCallOverlay(true);
    await joinRoom("audio");
  };
  const handleStartVideoCall = async () => {
    setCallType("video");
    setShowCallOverlay(true);
    await joinRoom("video");
  };
  const handleEndCall = () => {
    endCall();
    setShowCallOverlay(false);
    setCallType(null);
  };
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
      setShowCallOverlay(false);
      setCallType(null);
    }
  }, [callState.callState, callState.callType, showCallOverlay]);

  // ── HQ admin list ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id,full_name,email,status")
        .eq("role", "admin")
        .order("full_name", { ascending: true });
      setAdmins((data ?? []) as Contact[]);
    };
    void load();
    const ch = supabase
      .channel("resp-chat-presence")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // ── Unread badges ────────────────────────────────────────────────────────
  const refreshUnread = async () => {
    if (!me) return;
    setUnread(await fetchUnreadCounts(me));
  };
  useEffect(() => {
    if (!me) return;
    void refreshUnread();
    const ch = supabase
      .channel("resp-chat-unread")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const m = payload.new as ChatMessage;
        const incoming = m.sender_id !== me && (m.receiver_id === me || m.receiver_id === null);
        if (incoming) {
          void refreshUnread();
          // Sound + visual alert for HQ broadcasts (and loud 1-on-1s while closed).
          if (m.receiver_id === null) {
            playPing();
            setFlashBroadcast(true);
            setTimeout(() => setFlashBroadcast(false), 6000);
          } else if (!open) {
            playPing();
          }
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  // ── Open thread → mark read + refresh ────────────────────────────────────
  const openThread = async (id: string | null, nextTab: "hq" | "broadcast") => {
    setTab(nextTab);
    setActiveId(id);
    setDraft("");
    if (!me) return;
    if (nextTab === "broadcast") {
      setBroadcastLastSeen(me);
      setFlashBroadcast(false);
      await refreshUnread();
    }
  };
  useEffect(() => {
    if (!open || !me) return;
    if (broadcastMode) {
      setBroadcastLastSeen(me);
      setFlashBroadcast(false);
      void refreshUnread();
    } else if (activeId) {
      void markRead().then(() => refreshUnread());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeId, broadcastMode]);

  // ── Auto-scroll to bottom on every new message ──────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, activeId, tab]);

  const submit = async () => {
    if (broadcastMode || !draft.trim()) return;
    const text = draft;
    setDraft("");
    await send(text);
  };

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Deep-link a specific teammate thread (e.g. Message button on a team
  // card): whenever targetId is provided, jump straight into that 1-on-1.
  // Note: useRealtimeChat resolves any id pair, so teammates outside the HQ
  // admin list still open a working thread (header falls back to "Teammate").
  useEffect(() => {
    if (targetId) {
      setTab("hq");
      setActiveId(targetId);
      setDraft("");
    }
  }, [targetId, open]);

  if (!open) return null;

  return (
    <>
      <style>{`@keyframes respChatSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes respChatFade { from { opacity: 0; } to { opacity: 1; } }`}</style>
      {/* Backdrop overlay — click outside closes */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 940, background: "rgba(0,0,0,0.5)", animation: "respChatFade 0.25s ease" }}
      />
      <aside
        aria-label="Responder HQ chat"
        style={{
          position: "fixed", top: 0, right: 0, height: "100vh", zIndex: 950,
          width: fullScreen ? "100vw" : "min(384px, 92vw)", maxWidth: fullScreen ? "100vw" : 384,
          background: "rgba(13,17,23,0.98)", borderLeft: flashBroadcast ? "1px solid rgba(239,91,91,0.55)" : "1px solid rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "-12px 0 48px rgba(0,0,0,0.6)",
          animation: "respChatSlideIn 0.28s ease",
        }}
      >
          {/* Header */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#eef0f7", flex: 1 }}>HQ Chat</span>
            <button onClick={() => openThread(null, "hq")} title="HQ contacts" style={pillStyle(tab === "hq")}>HQ</button>
            <button onClick={() => openThread(null, "broadcast")} title="HQ broadcasts"
              style={flashBroadcast
                ? { ...pillStyle(true), borderColor: "#FF3B30", color: "#FF3B30" }
                : pillStyle(tab === "broadcast")}>
              Broadcasts{unread.broadcast > 0 && ` (${unread.broadcast})`}
            </button>
            <button onClick={onClose} aria-label="Close chat"
              style={{ background: "none", border: "none", color: "rgba(238,240,247,0.5)", fontSize: 18, cursor: "pointer" }}>×</button>
          </div>

          {(!broadcastMode && !activeId) ? (
            /* HQ contact list */
            <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
              {admins.length === 0 && (
                <div style={{ fontSize: 12, color: "rgba(238,240,247,0.4)", textAlign: "center", padding: 24 }}>
                  No HQ admins found
                </div>
              )}
              {admins.map(a => {
                const n = unread.bySender[a.id] ?? 0;
                const online = a.status === "on_duty" || a.status === "responding";
                return (
                  <button key={a.id} onClick={() => openThread(a.id, "hq")}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                      padding: "9px 10px", borderRadius: 9, border: "1px solid transparent",
                      background: "transparent", cursor: "pointer", color: "#eef0f7", marginBottom: 2,
                    }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                      background: online ? "#00B074" : "rgba(238,240,247,0.25)",
                      boxShadow: online ? "0 0 6px #00B074" : "none",
                    }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.full_name || "HQ Admin"}
                      </span>
                      <span style={{ display: "block", fontSize: 10, color: "rgba(238,240,247,0.4)" }}>
                        Command HQ
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
          ) : (
            <>
              {/* Thread header */}
              <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => (broadcastMode ? onClose() : setActiveId(null))}
                  style={{ background: "none", border: "none", color: "#2ECC8F", cursor: "pointer", fontSize: 14 }}>←</button>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#eef0f7", flex: 1 }}>
                  {broadcastMode ? "📢 HQ Broadcasts" : (admins.find(a => a.id === activeId)?.full_name || targetName || "HQ Admin")}
                </span>
                {!broadcastMode && activeId && (
                  <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                    <button onClick={handleStartAudioCall} title="Audio Call" style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#2ECC8F", fontSize: 12, display: "flex", alignItems: "center" }}>
                      <FaPhone size={12} />
                    </button>
                    <button onClick={handleStartVideoCall} title="Video Call" style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#2ECC8F", fontSize: 12, display: "flex", alignItems: "center" }}>
                      <FaVideo size={12} />
                    </button>
                  </div>
                )}
              </div>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
                {loading ? (
                  <div style={{ fontSize: 12, color: "rgba(238,240,247,0.4)", textAlign: "center", padding: 20 }}>Loading…</div>
                ) : messages.length === 0 ? (
                  <div style={{ fontSize: 12, color: "rgba(238,240,247,0.4)", textAlign: "center", padding: 20 }}>
                    {broadcastMode ? "No broadcasts from HQ yet." : "No messages yet. Say hello 👋"}
                  </div>
                ) : (
                  messages.map(m => <Bubble key={m.id} m={m} mine={m.sender_id === me} />)
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Composer (1-on-1 only — broadcasts are HQ announcements) */}
              {!broadcastMode ? (
                <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 8 }}>
                  <input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submit(); } }}
                    placeholder="Message HQ…"
                    maxLength={1000}
                    style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "#eef0f7", fontSize: 13, outline: "none" }}
                  />
                  <button onClick={() => void submit()} disabled={!draft.trim()}
                    style={{ background: "rgba(46,204,143,0.16)", border: "1px solid rgba(46,204,143,0.4)", color: "#2ECC8F", borderRadius: 8, padding: "0 16px", fontWeight: 700, cursor: "pointer", opacity: draft.trim() ? 1 : 0.5 }}>
                    Send
                  </button>
                </div>
              ) : (
                <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "rgba(238,240,247,0.4)", textAlign: "center" }}>
                  Broadcasts are HQ announcements — reply via direct HQ chat.
                </div>
              )}
            </>
          )}
        {/* Call Overlay — responder↔admin via Metered SDK */}
        {showCallOverlay && callType && (
          <MeteredCallOverlay
            state={callState}
            callType={callType}
            remoteName={admins.find(a => a.id === activeId)?.full_name || targetName || "HQ Admin"}
            onMute={toggleMute}
            onCamera={toggleCamera}
            onEnd={handleEndCall}
            isOnline={true}
          />
        )}
      </aside>
    </>
  );
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "rgba(46,204,143,0.16)" : "transparent",
    border: "1px solid rgba(46,204,143,0.35)",
    color: active ? "#2ECC8F" : "rgba(238,240,247,0.5)",
    borderRadius: 14, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer",
  };
}
