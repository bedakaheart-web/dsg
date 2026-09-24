// src/citizen/components/CitizenChatPage.tsx
// Centralized citizen ↔ responder communication — citizens see all online/on-duty responders
// and can chat / audio / video call any of them. Previous version already supported this
// but relied on a one-off fetch; this version uses the shared usePresence hook so the
// list stays live, shows presence accurately, and the thread is incident_id-aware
// (centralized chat uses incident_id = null when no active report links the pair).

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { supabase } from "../../js/supabase";
import { useNavigate } from "react-router-dom";
import ChatBox from "../../components/Chatbox";
import { useWebRTC } from "../../hooks/useWebRTC";
import CallOverlay from "../../components/CallOverlay";
import { FaPhone, FaVideo, FaSearch } from "react-icons/fa";
import { usePresence, isResponderOnDuty } from "../../hooks/usePresence";

// 🔒 CENTRALIZED: admin hidden from citizen chat per professor toggle — code retained below
// Set to false to show admin contacts again if required by professor
const HIDE_ADMIN_FOR_CITIZEN = true;

interface ResponderContact {
  id: string;
  full_name: string | null;
  email: string;
  status?: string | null;
  is_online?: boolean | null;
  last_seen?: string | null;
}

export default function CitizenChatPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [assignedResponderId, setAssignedResponderId] = useState<string | null>(null);
  const [assignedIncidentId, setAssignedIncidentId] = useState<string | null>(null);
  const [assignedResponderName, setAssignedResponderName] = useState<string>("Responder");
  const [citizenId, setCitizenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noResponder, setNoResponder] = useState(false);
  const [allReports, setAllReports] = useState<any[]>([]);
  const [selectedResponderId, setSelectedResponderId] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedResponderName, setSelectedResponderName] = useState<string>("Responder");
  const [search, setSearch] = useState("");
  const [roleMismatch, setRoleMismatch] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { onlineResponders, allResponders } = usePresence(citizenId, "citizen", !!citizenId);
  // Use presence-derived online list as source of truth — fallback to manual filter for safety
  const responders: ResponderContact[] = useMemo(() => {
    if (onlineResponders.length > 0) return onlineResponders as ResponderContact[];
    return (allResponders.filter(isResponderOnDuty) as ResponderContact[]);
  }, [onlineResponders, allResponders]);

  const effectiveResponderId = selectedResponderId ?? assignedResponderId;
  const effectiveResponderName = selectedResponderName || assignedResponderName;
  const effectiveIncidentId = selectedIncidentId ?? assignedIncidentId;
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
  } = useWebRTC(citizenId, effectiveResponderId);
  const handleStartAudioCall = async () => {
    if (!effectiveResponderId) return;
    setCallType("audio");
    setShowCallOverlay(true);
    await startCall("audio");
  };
  const handleStartVideoCall = async () => {
    if (!effectiveResponderId) return;
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
  useEffect(() => {
    if (callState.callState === "ringing" || callState.callState === "active") {
      setShowCallOverlay(true);
      if (callState.callType) setCallType(callState.callType);
    } else if (callState.callState === "ended" || callState.callState === "declined") {
      const tid = setTimeout(() => { setShowCallOverlay(false); setCallType(null); }, 1200);
      return () => clearTimeout(tid);
    } else if (callState.callState === "idle" && showCallOverlay) {
      if (!callState.localStream && !callState.remoteStream) { setShowCallOverlay(false); setCallType(null); }
    }
  }, [callState.callState, callState.callType, callState.localStream, callState.remoteStream, showCallOverlay]);

  // Initial load: assigned responder from active report (pinned)
  // NOTE: ProtectedRoute already guarantees only citizens reach this page.
  // We keep a soft guard but don't hard-navigate to /citizen/dashboard when
  // the user is a responder — that would loop inside a citizen-only layout
  // and appear as a black screen. Instead we show an inline unauthorized
  // message and let ProtectedRoute handle the redirect if needed.
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        const r = (profile?.role as string)?.toLowerCase().trim() ?? "";
        if (r && r !== "citizen") {
          // Don't navigate to /citizen/dashboard (still citizen-only and would
          // flash a black/empty layout for responders). Show inline message and
          // let ProtectedRoute redirect on next render if needed.
          setRoleMismatch(true);
          setCitizenId(user.id);
          setLoading(false);
          return;
        }
        setCitizenId(user.id);
        const { data: reports } = await supabase
          .from("reports")
          .select("id, responder_id, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        setAllReports(reports ?? []);
        const active = (reports ?? []).find(r => r.responder_id && (r.status === "pending" || r.status === "in-progress"));
        let assignedId: string | null = null;
        let assignedInc: string | null = null;
        let assignedName = "Responder";
        if (active?.responder_id) {
          const { data: responder } = await supabase.from("profiles").select("id, role, full_name, email").eq("id", active.responder_id).single();
          if ((responder?.role as string)?.toLowerCase() === "responder") {
            assignedId = active.responder_id as string;
            assignedInc = active.id as string;
            assignedName = (responder as any)?.full_name || (responder as any)?.email || "Responder";
            setAssignedResponderId(assignedId);
            setAssignedIncidentId(assignedInc);
            setAssignedResponderName(assignedName);
          }
        }
        // Don't decide noResponder here based on stale presence — let the
        // presence-driven effect below set it once onlineResponders have loaded.
        setNoResponder(false);
      } catch (e: any) {
        const msg = String(e?.message ?? e ?? '');
        if (/Invalid Refresh Token|Refresh Token Not Found/i.test(msg)) {
          setAuthError('Session expired. Please sign in again.');
          try { await supabase.auth.signOut(); } catch {}
          try {
            Object.keys(localStorage).forEach(k => {
              if (k.startsWith('sb-') && k.includes('-auth-token')) localStorage.removeItem(k);
            });
          } catch {}
        } else {
          // Don't navigate to /login inside citizen layout (causes black flash) — show inline error
          setAuthError('Could not load chat. Please refresh or sign in again.');
        }
      } finally { setLoading(false); }
    })();
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-select initial responder when presence loads
  useEffect(() => {
    if (loading) return;
    if (selectedResponderId) return;
    if (assignedResponderId) {
      setSelectedResponderId(assignedResponderId);
      setSelectedResponderName(assignedResponderName);
      setSelectedIncidentId(assignedIncidentId);
      setNoResponder(false);
      return;
    }
    if (responders.length > 0) {
      const r = responders[0];
      setSelectedResponderId(r.id);
      setSelectedResponderName(r.full_name || r.email || "Responder");
      const linked = allReports.find(rep => String(rep.responder_id) === String(r.id));
      setSelectedIncidentId(linked ? String(linked.id) : null);
      setNoResponder(false);
    } else if (!assignedResponderId) {
      setNoResponder(true);
    }
  }, [loading, responders, assignedResponderId, assignedResponderName, assignedIncidentId, selectedResponderId, allReports]);

  // Keep responder selection stable when online list changes — don't auto-switch away
  useEffect(() => {
    if (selectedResponderId && !responders.some(r => r.id === selectedResponderId) && assignedResponderId !== selectedResponderId) {
      // selected went offline — keep it but show offline indicator; don't clear
    }
  }, [responders, selectedResponderId, assignedResponderId]);

  const markCitizenRead = async (otherId: string | null) => {
    const me = citizenId;
    if (!me || !otherId) return;
    // Real column is receiver_id (broadcast = receiver_id null) and text is message
    try { await (supabase.from("chat_messages").update({ is_read: true } as any).eq("receiver_id", me).eq("sender_id", otherId).eq("is_read", false) as any); } catch {}
  };

  // Clear badge when citizen opens a responder thread (so other responders won't see stale unread)
  useEffect(() => {
    if (effectiveResponderId) void markCitizenRead(effectiveResponderId);
  }, [effectiveResponderId]);

  const handleSelectResponder = (r: ResponderContact) => {
    setSelectedResponderId(r.id);
    setSelectedResponderName(r.full_name || r.email || "Responder");
    const linked = allReports.find(rep => String(rep.responder_id) === String(r.id));
    if (linked) setSelectedIncidentId(String(linked.id));
    else if (r.id === assignedResponderId) setSelectedIncidentId(assignedIncidentId);
    else setSelectedIncidentId(null);
    void markCitizenRead(r.id);
  };

  const filteredResponders = useMemo(() => {
    if (!search.trim()) return responders;
    const q = search.toLowerCase();
    return responders.filter(r => (r.full_name ?? "").toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
  }, [responders, search]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "rgba(238,240,247,0.35)", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center" }}><div style={{ marginBottom: "12px", fontSize: "24px" }}>🔒</div>{t("chat.loading", "Loading chat...")}</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px", margin: "40px auto", background: "rgba(15,21,33,0.82)", border: "1px solid rgba(239,91,91,0.2)", borderRadius: "12px", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#eef0f7", marginBottom: "8px" }}>{authError}</div>
        <div style={{ fontSize: "12px", color: "rgba(238,240,247,0.55)", marginBottom: "16px" }}>
          Your session has expired or is invalid (Invalid Refresh Token). Please clear and sign in again.
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={() => {
              try {
                Object.keys(localStorage).forEach(k => { if (k.startsWith('sb-')) localStorage.removeItem(k); });
                sessionStorage.clear();
              } catch {}
              window.location.hash = '#/login';
              window.location.reload();
            }}
            style={{ background: "#2ECC8F", border: "none", color: "#0a1a14", borderRadius: "8px", padding: "10px 18px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
          >
            Clear & Go to Login
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#eef0f7", borderRadius: "8px", padding: "10px 18px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (roleMismatch) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px", margin: "40px auto", background: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</div>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#eef0f7", marginBottom: "8px" }}>Responder account — citizen chat is for citizens</div>
        <div style={{ fontSize: "12px", color: "rgba(238,240,247,0.55)", marginBottom: "16px" }}>
          You are logged in as a <strong>responder</strong>. Citizen Chat is only available to citizen accounts.
          Use <strong>Citizen Chat</strong> in your Responder Dashboard to message citizens who are online.
        </div>
        <button
          onClick={() => navigate("/responder/dashboard")}
          style={{ background: "rgba(46,204,143,0.16)", border: "1px solid rgba(46,204,143,0.35)", color: "#2ECC8F", borderRadius: "8px", padding: "10px 18px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
        >
          Go to Responder Dashboard
        </button>
      </div>
    );
  }

  if (noResponder && responders.length === 0) {
    return (
      <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ marginBottom: "16px", padding: "14px 18px", backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(239,91,91,0.2)", borderRadius: "12px", borderLeft: "3px solid #EF5B5B" }}>
          <div style={{ fontSize: "10px", color: "#EF5B5B", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>{t("chat.noResponder", "No Responder")}</div>
          <div style={{ fontSize: "13px", color: "rgba(238,240,247,0.65)" }}>No responders are currently on duty. Your message will be queued and the next available responder will assist you. Please try again shortly.</div>
        </div>
        {/* Still allow queuing — show chat disabled but with responders list empty */}
      </div>
    );
  }

  const assignedResponder = assignedResponderId
    ? filteredResponders.find(r => r.id === assignedResponderId) || ({ id: assignedResponderId, full_name: assignedResponderName, email: "", status: "on_duty", is_online: true } as ResponderContact)
    : null;
  const otherResponders = filteredResponders.filter(r => r.id !== assignedResponderId);
  const showAssignedSection = !!assignedResponderId;

  return (
    <div style={{ padding: "clamp(12px,3vw,20px)", maxWidth: "min(700px, calc(100vw - 24px))", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <div style={{
        marginBottom: "16px", padding: "14px 18px",
        backgroundColor: "rgba(15,21,33,0.82)",
        border: "1px solid rgba(46,204,143,0.15)",
        borderRadius: "12px", borderLeft: "3px solid #2ECC8F",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", color: "#2ECC8F", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>{t("chat.secureChannel", "Secure Channel")}</div>
          <div style={{ fontSize: "13px", color: "rgba(238,240,247,0.65)", fontWeight: "500" }}>
            Centralized: message any on-duty responder — chat, audio, or video. Responders online are highlighted and will respond to assist you.
          </div>
        </div>
        {effectiveResponderId && (
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button onClick={handleStartAudioCall} title="Audio Call — responder will be notified" style={{ background: "rgba(46,204,143,0.12)", border: "1px solid rgba(46,204,143,0.3)", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#2ECC8F", fontSize: "14px", display: "flex", alignItems: "center" }}><FaPhone size={14} /></button>
            <button onClick={handleStartVideoCall} title="Video Call — responder will be notified" style={{ background: "rgba(46,204,143,0.12)", border: "1px solid rgba(46,204,143,0.3)", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#2ECC8F", fontSize: "14px", display: "flex", alignItems: "center" }}><FaVideo size={14} /></button>
          </div>
        )}
      </div>

      {showAssignedSection && assignedResponder && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", color: "#2ECC8F", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px" }}>Your assigned responder</div>
          <button
            onClick={() => handleSelectResponder(assignedResponder)}
            style={{
              display: "flex", alignItems: "center", gap: "12px", width: "100%", textAlign: "left",
              padding: "12px 14px", borderRadius: "12px",
              background: selectedResponderId === assignedResponder.id ? "rgba(46,204,143,0.10)" : "rgba(15,21,33,0.82)",
              border: `1px solid ${selectedResponderId === assignedResponder.id ? "rgba(46,204,143,0.35)" : "rgba(46,204,143,0.18)"}`,
              borderLeft: "3px solid #2ECC8F",
              cursor: "pointer", color: "#eef0f7",
            }}
          >
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, background: "#2ECC8F", boxShadow: "0 0 6px #2ECC8F" }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: "13px", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{assignedResponder.full_name || assignedResponder.email || "Responder"} {selectedResponderId === assignedResponder.id ? "✓" : ""}</span>
              <span style={{ display: "block", fontSize: "11px", color: "rgba(46,204,143,0.8)" }}>Assigned to your active report • Tap to chat • Will take action to assist</span>
            </span>
            <span style={{ fontSize: "10px", color: "#2ECC8F", fontWeight: "700", letterSpacing: "0.06em" }}>PINNED</span>
          </button>
        </div>
      )}

      <div style={{ marginBottom: "16px", backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "10px", color: "rgba(238,240,247,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "700", flex: 1 }}>
            On-duty responders {responders.length > 0 ? `(${responders.length})` : ""}
          </span>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2ECC8F", boxShadow: "0 0 6px #2ECC8F", display: "inline-block" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <FaSearch size={10} style={{ position: "absolute", left: 8, color: "rgba(238,240,247,0.35)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search responder" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px 6px 24px", fontSize: 11, color: "#eef0f7", outline: "none", width: 130 }} />
          </div>
        </div>
        {/* HIDDEN: Admin contacts for citizen — code retained, hidden via flag (set HIDE_ADMIN_FOR_CITIZEN=false to show) */}
        {!HIDE_ADMIN_FOR_CITIZEN && (
          <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: "10px", color: "rgba(238,240,247,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Admin contacts (hidden in production)</div>
            <div style={{ fontSize: "11px", color: "rgba(238,240,247,0.35)" }}>Admin list would appear here when HIDE_ADMIN_FOR_CITIZEN=false</div>
          </div>
        )}
        <div style={{ maxHeight: "220px", overflowY: "auto" }}>
          {filteredResponders.length === 0 && !showAssignedSection ? (
            <div style={{ padding: "16px", fontSize: "12px", color: "rgba(238,240,247,0.4)", textAlign: "center" }}>No responders match — they appear here when on duty and online. Your report is still visible to dispatch.</div>
          ) : (
            <>
              {otherResponders.map(r => {
                const isSelected = selectedResponderId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectResponder(r)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px", width: "100%", textAlign: "left",
                      padding: "10px 14px", cursor: "pointer", color: "#eef0f7",
                      background: isSelected ? "rgba(46,204,143,0.08)" : "transparent",
                      border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
                      borderLeft: isSelected ? "2px solid #2ECC8F" : "2px solid transparent",
                    }}
                  >
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, background: "#2ECC8F", boxShadow: "0 0 6px #2ECC8F" }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "13px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.full_name || r.email || "Responder"}</span>
                      <span style={{ display: "block", fontSize: "11px", color: "rgba(238,240,247,0.45)" }}>On duty • Chat · Audio · Video • Will respond</span>
                    </span>
                    {isSelected && <span style={{ fontSize: "12px", color: "#2ECC8F" }}>✓</span>}
                  </button>
                );
              })}
              {otherResponders.length === 0 && showAssignedSection && filteredResponders.length > 0 && (
                <div style={{ padding: "12px 14px", fontSize: "11px", color: "rgba(238,240,247,0.35)", textAlign: "center" }}>No other on-duty responders. Your assigned responder is pinned above.</div>
              )}
            </>
          )}
        </div>
      </div>

      {effectiveResponderId ? (
        <ChatBox assignedResponderId={effectiveResponderId} incidentId={effectiveIncidentId} userRole="citizen" />
      ) : (
        <div style={{ textAlign: "center", padding: "24px", color: "rgba(238,240,247,0.4)", fontSize: "12px", background: "rgba(15,21,33,0.6)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
          Select a responder above to start chatting — audio and video calls are available.
        </div>
      )}

      {showCallOverlay && callType && (
        <CallOverlay
          state={callState}
          callType={callType}
          remoteName={effectiveResponderName}
          onMute={toggleMute}
          onCamera={toggleCamera}
          onUpgrade={upgradeToVideo}
          onEnd={handleEndCall}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
          isOnline={true}
        />
      )}
    </div>
  );
}
