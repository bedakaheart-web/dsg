// Global inbox call handler for Citizens — ensures Responder→Citizen calls ring
// even when CitizenChatPage is not open. Mounted once in CitizenLayout.
import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import { useWebRTC } from "../hooks/useWebRTC";
import CallOverlay from "./CallOverlay";

export default function GlobalCitizenCallHandler({ citizenId }: { citizenId: string }) {
  const [callerName, setCallerName] = useState<string>("Responder");
  const [showOverlay, setShowOverlay] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  const {
    state: callState,
    endCall,
    acceptCall,
    declineCall,
    toggleMute,
    toggleCamera,
    upgradeToVideo,
  } = useWebRTC(citizenId || null, null);

  useEffect(() => {
    const cid = callState.remoteParticipantId;
    if (!cid) { setCallerName("Responder"); return; }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.from("profiles").select("full_name, email").eq("id", cid).single();
        if (!cancelled && data) setCallerName((data as any).full_name || (data as any).email || "Responder");
      } catch { if (!cancelled) setCallerName("Responder"); }
    })();
    return () => { cancelled = true; };
  }, [callState.remoteParticipantId]);

  useEffect(() => {
    if (callState.callState === "ringing" || callState.callState === "active") {
      setShowOverlay(true);
      if (callState.callType) setCallType(callState.callType);
    } else if (callState.callState === "ended" || callState.callState === "declined") {
      const t = setTimeout(() => { setShowOverlay(false); setCallType(null); }, 1200);
      return () => clearTimeout(t);
    } else if (callState.callState === "idle" && showOverlay) {
      if (!callState.localStream && !callState.remoteStream) { setShowOverlay(false); setCallType(null); }
    }
  }, [callState.callState, callState.callType, callState.localStream, callState.remoteStream, showOverlay]);

  const handleAccept = async () => { await acceptCall(); };
  const handleDecline = async () => { await declineCall(); setShowOverlay(false); setCallType(null); };
  const handleEnd = () => {
    if (callState.callState === "ringing") declineCall();
    else endCall();
    setShowOverlay(false);
    setCallType(null);
  };

  if (!showOverlay || !callType) return null;
  if (!callState.remoteParticipantId) return null;

  return (
    <CallOverlay
      state={callState}
      callType={callType}
      remoteName={callerName}
      onMute={toggleMute}
      onCamera={toggleCamera}
      onUpgrade={upgradeToVideo}
      onEnd={handleEnd}
      onAccept={handleAccept}
      onDecline={handleDecline}
      isOnline={true}
    />
  );
}
