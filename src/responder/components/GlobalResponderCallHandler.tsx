// Global inbox call handler for Responders — ensures Citizen→Responder calls ring
// even when neither chat drawer is open. Mounted once in Respondersdashboard.
import { useEffect, useState } from "react";
import { supabase } from "../../js/supabase";
import { useWebRTC } from "../../hooks/useWebRTC";
import CallOverlay from "../../components/CallOverlay";

export default function GlobalResponderCallHandler({ responderId }: { responderId: string }) {
  const [callerName, setCallerName] = useState<string>("Citizen");
  const [showOverlay, setShowOverlay] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  // Global inbox subscription: local = responderId, remote = null (inbox handles any caller)
  // Pair channel not needed for ringing — inbox fallback delivers offer even when pair mismatched.
  const {
    state: callState,
    endCall,
    acceptCall,
    declineCall,
    toggleMute,
    toggleCamera,
    upgradeToVideo,
  } = useWebRTC(responderId || null, null);

  // Fetch caller display name when remote changes
  useEffect(() => {
    const cid = callState.remoteParticipantId;
    if (!cid) {
      setCallerName("Citizen");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.from("profiles").select("full_name, email").eq("id", cid).single();
        if (!cancelled && data) {
          setCallerName((data as any).full_name || (data as any).email || "Citizen");
        }
      } catch {
        if (!cancelled) setCallerName("Citizen");
      }
    })();
    return () => { cancelled = true; };
  }, [callState.remoteParticipantId]);

  // Sync overlay visibility with call state (mirrors ChatBox / ResponderChatDrawer logic)
  useEffect(() => {
    if (callState.callState === "ringing" || callState.callState === "active") {
      setShowOverlay(true);
      if (callState.callType) setCallType(callState.callType);
    } else if (callState.callState === "ended" || callState.callState === "declined") {
      const t = setTimeout(() => {
        setShowOverlay(false);
        setCallType(null);
      }, 1200);
      return () => clearTimeout(t);
    } else if (callState.callState === "idle" && showOverlay) {
      if (!callState.localStream && !callState.remoteStream) {
        setShowOverlay(false);
        setCallType(null);
      }
    }
  }, [callState.callState, callState.callType, callState.localStream, callState.remoteStream, showOverlay]);

  const handleAccept = async () => { await acceptCall(); };
  const handleDecline = async () => { await declineCall(); setShowOverlay(false); setCallType(null); };
  const handleEnd = () => {
    // If still ringing (incoming), decline is more correct, but endCall covers both via inbox.
    if (callState.callState === "ringing") declineCall();
    else endCall();
    setShowOverlay(false);
    setCallType(null);
  };

  if (!showOverlay || !callType) return null;
  // Only render when this global handler is the active call — avoid duplicate overlay when a drawer already shows one.
  // The drawers also show overlays for admin calls; this global one covers citizen calls when drawers are closed.
  // If callState was triggered by admin→responder, the ResponderChatDrawer overlay will also appear — duplicate is okay (one will be visible),
  // but we hide global when no remote (should not happen).
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
