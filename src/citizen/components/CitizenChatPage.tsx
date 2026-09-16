// src/citizen/components/CitizenChatPage.tsx
// Chat page for citizens — shows assigned responder chat + on-duty responder list.
// Uses ChatBox for actual messaging and useWebRTC for calling (same infra as responder/admin).

import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { supabase } from "../../js/supabase";
import { useNavigate } from "react-router-dom";
import ChatBox from "../../components/Chatbox";
import { useWebRTC } from "../../hooks/useWebRTC";
import CallOverlay from "../../components/CallOverlay";
import { FaPhone, FaVideo } from "react-icons/fa";

interface ResponderContact {
  id: string;
  full_name: string | null;
  email: string;
  status?: string | null;
}

const isOnDuty = (c: ResponderContact) => c.status === "on_duty" || c.status === "responding";

export default function CitizenChatPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [assignedResponderId, setAssignedResponderId] = useState<string | null>(null);
  const [assignedIncidentId, setAssignedIncidentId] = useState<string | null>(null);
  const [assignedResponderName, setAssignedResponderName] = useState<string>("Responder");
  const [citizenId, setCitizenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noResponder, setNoResponder] = useState(false);

  // On-duty responders list (reused query pattern from AdminChatDrawer.tsx)
  const [responders, setResponders] = useState<ResponderContact[]>([]);
  const [selectedResponderId, setSelectedResponderId] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedResponderName, setSelectedResponderName] = useState<string>("Responder");

  // Calling — citizen ↔ responder, same useWebRTC hook as responder side
  // Signaling channel is call-${sortedIds} so admin↔responder and citizen↔responder don't cross-connect
  const effectiveResponderId = selectedResponderId ?? assignedResponderId;
  const effectiveResponderName = selectedResponderName || assignedResponderName;
  const effectiveIncidentId = selectedIncidentId ?? assignedIncidentId;
  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const {
    state: callState,
    startCall,
    endCall,
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
  useEffect(() => {
    if (callState.callState === "ringing" || callState.callState === "active") {
      setShowCallOverlay(true);
      if (callState.callType) setCallType(callState.callType);
    } else if (callState.callState === "ended" || callState.callState === "declined") {
      const tid = setTimeout(() => {
        setShowCallOverlay(false);
        setCallType(null);
      }, 1200);
      return () => clearTimeout(tid);
    } else if (callState.callState === "idle" && showCallOverlay) {
      if (!callState.localStream && !callState.remoteStream) {
        setShowCallOverlay(false);
        setCallType(null);
      }
    }
  }, [callState.callState, callState.callType, callState.localStream, callState.remoteStream, showCallOverlay]);

  // Initial load: assigned responder + on-duty list
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if ((profile?.role as string)?.toLowerCase() !== "citizen") {
          navigate("/citizen/dashboard");
          return;
        }

        setCitizenId(user.id);

        // a) Still check for assigned responder from active report (pinned)
        const { data: reports } = await supabase
          .from("reports")
          .select("id, responder_id, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        const active = (reports ?? []).find(r =>
          r.responder_id && (r.status === "pending" || r.status === "in-progress")
        );

        let assignedId: string | null = null;
        let assignedInc: string | null = null;
        let assignedName = "Responder";
        if (active?.responder_id) {
          const { data: responder } = await supabase
            .from("profiles")
            .select("id, role, full_name, email")
            .eq("id", active.responder_id)
            .single();

          if ((responder?.role as string)?.toLowerCase() === "responder") {
            assignedId = active.responder_id as string;
            assignedInc = active.id as string;
            assignedName = (responder as any)?.full_name || (responder as any)?.email || "Responder";
            setAssignedResponderId(assignedId);
            setAssignedIncidentId(assignedInc);
            setAssignedResponderName(assignedName);
          }
        }

        // b) ALSO query all on-duty responders (reused pattern from AdminChatDrawer.tsx)
        // Status field on profiles: status = 'on_duty' or 'responding' (same query as admin/responder drawers)
        const { data: onDutyData } = await supabase
          .from("profiles")
          .select("id, full_name, email, status, role")
          .eq("role", "responder")
          .order("full_name", { ascending: true });

        const onDuty = ((onDutyData ?? []) as ResponderContact[]).filter(isOnDuty);
        setResponders(onDuty);

        // c) No hard block: only "nobody available" if zero on-duty AND no assignment
        if (!assignedId && onDuty.length === 0) {
          setNoResponder(true);
        } else {
          setNoResponder(false);
          // Default selection: assigned responder first, else first on-duty
          const initialId = assignedId ?? (onDuty[0]?.id ?? null);
          const initialName = assignedId ? assignedName : (onDuty[0]?.full_name || onDuty[0]?.email || "Responder");
          const initialInc = assignedId ? assignedInc : null;
          setSelectedResponderId(initialId);
          setSelectedResponderName(initialName);
          setSelectedIncidentId(initialInc);
        }
      } catch {
        navigate("/citizen/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Keep responder list live (same as AdminChatDrawer)
  useEffect(() => {
    const ch = supabase
      .channel("citizen-chat-presence")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, async () => {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, email, status, role")
          .eq("role", "responder")
          .order("full_name", { ascending: true });
        const onDuty = ((data ?? []) as ResponderContact[]).filter(isOnDuty);
        setResponders(onDuty);
        // If selected responder went off-duty, keep selection but list will update
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Selecting a responder updates chat thread (incident scoping)
  const handleSelectResponder = (r: ResponderContact) => {
    const isAssigned = r.id === assignedResponderId;
    setSelectedResponderId(r.id);
    setSelectedResponderName(r.full_name || r.email || "Responder");
    setSelectedIncidentId(isAssigned ? assignedIncidentId : null);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "60vh", color: "rgba(238,240,247,0.35)", fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "12px", fontSize: "24px" }}>🔒</div>
          {t("chat.loading", "Loading chat...")}
        </div>
      </div>
    );
  }

  if (noResponder) {
    return (
      <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
        <div style={{
          marginBottom: "16px", padding: "14px 18px",
          backgroundColor: "rgba(15,21,33,0.82)",
          border: "1px solid rgba(239,91,91,0.2)",
          borderRadius: "12px", borderLeft: "3px solid #EF5B5B",
        }}>
          <div style={{ fontSize: "10px", color: "#EF5B5B", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>
            {t("chat.noResponder", "No Responder")}
          </div>
          <div style={{ fontSize: "13px", color: "rgba(238,240,247,0.65)" }}>
            No responders are currently on duty. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  const assignedResponder = assignedResponderId ? responders.find(r => r.id === assignedResponderId) || { id: assignedResponderId, full_name: assignedResponderName, email: "", status: "on_duty" } as ResponderContact : null;
  const otherResponders = responders.filter(r => r.id !== assignedResponderId);
  const showAssignedSection = !!assignedResponderId;

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      {/* Secure channel header — citizen style (green) with per-responder call buttons */}
      <div style={{
        marginBottom: "16px", padding: "14px 18px",
        backgroundColor: "rgba(15,21,33,0.82)",
        border: "1px solid rgba(46,204,143,0.15)",
        borderRadius: "12px", borderLeft: "3px solid #2ECC8F",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", color: "#2ECC8F", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>
            {t("chat.secureChannel", "Secure Channel")}
          </div>
          <div style={{ fontSize: "13px", color: "rgba(238,240,247,0.65)", fontWeight: "500" }}>
            {showAssignedSection
              ? "Your assigned responder is pinned below. You can also message any on-duty responder."
              : t("chat.citizenNote", "Your messages are encrypted and shared only with your assigned responder.")}
          </div>
        </div>
        {effectiveResponderId && (
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button onClick={handleStartAudioCall} title="Audio Call" style={{ background: "rgba(46,204,143,0.12)", border: "1px solid rgba(46,204,143,0.3)", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#2ECC8F", fontSize: "14px", display: "flex", alignItems: "center" }}>
              <FaPhone size={14} />
            </button>
            <button onClick={handleStartVideoCall} title="Video Call" style={{ background: "rgba(46,204,143,0.12)", border: "1px solid rgba(46,204,143,0.3)", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#2ECC8F", fontSize: "14px", display: "flex", alignItems: "center" }}>
              <FaVideo size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Assigned responder — pinned/highlighted */}
      {showAssignedSection && assignedResponder && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", color: "#2ECC8F", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px" }}>
            Your assigned responder
          </div>
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
            <span style={{
              width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0,
              background: "#2ECC8F", boxShadow: "0 0 6px #2ECC8F",
            }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: "13px", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {assignedResponder.full_name || assignedResponder.email || "Responder"} {selectedResponderId === assignedResponder.id ? "✓" : ""}
              </span>
              <span style={{ display: "block", fontSize: "11px", color: "rgba(46,204,143,0.8)" }}>
                Assigned to your active report • Tap to chat
              </span>
            </span>
            <span style={{ fontSize: "10px", color: "#2ECC8F", fontWeight: "700", letterSpacing: "0.06em" }}>PINNED</span>
          </button>
        </div>
      )}

      {/* On-duty responders list — citizen visual style (green accents, not admin blue) */}
      <div style={{
        marginBottom: "16px", backgroundColor: "rgba(15,21,33,0.82)",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden",
      }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", color: "rgba(238,240,247,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "700" }}>
            On-duty responders {responders.length > 0 ? `(${responders.length})` : ""}
          </span>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2ECC8F", boxShadow: "0 0 6px #2ECC8F", display: "inline-block" }} />
        </div>
        <div style={{ maxHeight: "220px", overflowY: "auto" }}>
          {otherResponders.length === 0 && !showAssignedSection ? (
            <div style={{ padding: "16px", fontSize: "12px", color: "rgba(238,240,247,0.4)", textAlign: "center" }}>
              No on-duty responders at the moment.
            </div>
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
                    <span style={{
                      width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0,
                      background: "#2ECC8F", boxShadow: "0 0 6px #2ECC8F",
                    }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "13px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.full_name || r.email || "Responder"}
                      </span>
                      <span style={{ display: "block", fontSize: "11px", color: "rgba(238,240,247,0.45)" }}>
                        On duty • Tap to chat
                      </span>
                    </span>
                    {isSelected && <span style={{ fontSize: "12px", color: "#2ECC8F" }}>✓</span>}
                  </button>
                );
              })}
              {otherResponders.length === 0 && showAssignedSection && (
                <div style={{ padding: "12px 14px", fontSize: "11px", color: "rgba(238,240,247,0.35)", textAlign: "center" }}>
                  No other on-duty responders.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Chat thread — sender_id=citizen, receiver_id=selected responder, same chat_messages table */}
      {effectiveResponderId ? (
        <ChatBox assignedResponderId={effectiveResponderId} incidentId={effectiveIncidentId} userRole="citizen" />
      ) : (
        <div style={{ textAlign: "center", padding: "24px", color: "rgba(238,240,247,0.4)", fontSize: "12px", background: "rgba(15,21,33,0.6)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
          Select a responder above to start chatting.
        </div>
      )}

      {/* Call Overlay — citizen ↔ responder (same useWebRTC infrastructure) */}
      {showCallOverlay && callType && (
        <CallOverlay
          state={callState}
          callType={callType}
          remoteName={effectiveResponderName}
          onMute={toggleMute}
          onCamera={toggleCamera}
          onUpgrade={upgradeToVideo}
          onEnd={handleEndCall}
          isOnline={true}
        />
      )}
    </div>
  );
}
