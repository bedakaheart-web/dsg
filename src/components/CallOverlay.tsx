import { useEffect, useRef } from "react";
import { FaVideoSlash, FaMicrophone, FaVideo, FaPhone, FaPhoneSlash, FaCheck } from "react-icons/fa";
import { WebRTCState, CallType } from "../hooks/useWebRTC";

interface CallOverlayProps {
  state: WebRTCState;
  callType: CallType;
  remoteName: string;
  onMute: () => void;
  onCamera: () => void;
  onUpgrade: () => void;
  onEnd: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  isOnline: boolean;
}

export default function CallOverlay({
  state, callType, remoteName, onMute, onCamera, onUpgrade, onEnd, onAccept, onDecline, isOnline,
}: CallOverlayProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (localVideoRef.current && state.localStream) {
      localVideoRef.current.srcObject = state.localStream;
      localVideoRef.current.play().catch(()=>{});
    }
  }, [state.localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && state.remoteStream) {
      remoteVideoRef.current.srcObject = state.remoteStream;
      remoteVideoRef.current.play().catch(()=>{});
    }
    if (remoteAudioRef.current && state.remoteStream) {
      remoteAudioRef.current.srcObject = state.remoteStream;
      remoteAudioRef.current.play().catch(()=>{});
    }
  }, [state.remoteStream]);

  if (state.callState === "idle") return null;

  // Dynamic calling state: incoming ringing has no localStream yet (callee hasn't accepted)
  const isIncomingRinging = state.callState === "ringing" && !state.localStream;
  const isOutgoingRinging = state.callState === "ringing" && !!state.localStream;
  const isActive = state.callState === "active";
  const canControl = isActive;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif", color: "#eef0f7",
      animation: "fadeIn 0.2s ease",
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "14px",
        marginBottom: "30px", padding: "16px 24px",
        background: "rgba(255,255,255,0.05)", borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "50%",
          background: "rgba(46,204,143,0.15)", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700",
          color: "#2ECC8F", border: "1px solid rgba(46,204,143,0.3)",
        }}>
          {remoteName ? remoteName[0].toUpperCase() : "?"}
        </div>
        <div>
          <div style={{ fontSize: "clamp(14px, 4vw, 16px)", fontWeight: "700" }}>{remoteName}</div>
          <div style={{ fontSize: "11px", color: isIncomingRinging ? "#F5C842" : "rgba(46,204,143,0.8)" }}>
            {isIncomingRinging ? `Incoming ${callType === "video" ? "video" : "audio"} call — answer to connect` : state.callState === "ringing" ? `${callType === "video" ? "Video" : "Audio"} calling...` : state.callState === "active" ? `${callType === "video" ? "Video" : "Audio"} call • connected` : ""}
          </div>
        </div>
      </div>

      {/* Call area - video or audio visualizer */}
      <div style={{
        width: "100%", maxWidth: "700px", aspectRatio: "16/9",
        background: "rgba(255,255,255,0.04)", borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative", overflow: "hidden", marginBottom: "30px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {callType === "video" ? (
          <>
            <video ref={remoteVideoRef} autoPlay playsInline style={{
              width: "100%", height: "100%", objectFit: "cover",
            }} />
            <video ref={localVideoRef} autoPlay playsInline muted style={{
              position: "absolute", bottom: "12px", right: "12px",
              width: "120px", height: "90px", borderRadius: "10px",
              border: "2px solid rgba(255,255,255,0.2)", objectFit: "cover",
            }} />
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "rgba(46,204,143,0.15)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "800",
              color: "#2ECC8F", border: "2px solid rgba(46,204,143,0.3)",
            }}>
              {remoteName ? remoteName[0].toUpperCase() : "?"}
            </div>
            {state.callState === "ringing" && (
              <div style={{ fontSize: "14px", color: "rgba(238,240,247,0.6)", animation: "pulse 1.2s infinite" }}>
                {state.callState === "ringing" ? "Ringing..." : "Connecting..."}
              </div>
            )}
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#2ECC8F", animation: "pulse 1.5s infinite",
            }} />
          </div>
        )}
      </div>

      {/* Hidden audio element ensures voice is heard even when video element is blocked (display:none blocks autoplay in some browsers) */}
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />

      {/* Controls — dynamic: incoming Answer/Decline vs active controls vs outgoing Cancel */}
      <div style={{
        display: "flex", gap: "clamp(12px, 4vw, 16px)", alignItems: "center", justifyContent: "center", flexWrap: "wrap",
      }}>
        {isIncomingRinging ? (
          <>
            <button onClick={onDecline ?? onEnd} style={{
              width: "clamp(56px, 18vw, 72px)", height: "clamp(56px, 18vw, 72px)", borderRadius: "50%", border: "none",
              background: "rgba(239,91,91,0.9)", color: "#fff", fontSize: "clamp(20px, 5vw, 26px)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(239,91,91,0.4)", transition: "transform 0.15s",
            }} title="Decline" aria-label="Decline call">
              <FaPhoneSlash />
            </button>
            <button onClick={onAccept ?? onEnd} style={{
              width: "clamp(64px, 20vw, 80px)", height: "clamp(64px, 20vw, 80px)", borderRadius: "50%", border: "none",
              background: "#2ECC8F", color: "#fff", fontSize: "clamp(22px, 5.5vw, 28px)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(46,204,143,0.5)", animation: "pulse 1.5s infinite", transition: "transform 0.15s",
            }} title="Answer" aria-label="Answer call">
              <FaPhone />
            </button>
          </>
        ) : (
          <>
            {/* Mute */}
            <button onClick={onMute} disabled={!isOnline || !canControl} style={{
              width: "clamp(48px, 14vw, 56px)", height: "clamp(48px, 14vw, 56px)", borderRadius: "50%", border: "none",
              background: state.isMuted ? "rgba(239,91,91,0.2)" : "rgba(255,255,255,0.1)",
              color: state.isMuted ? "#EF5B5B" : "#eef0f7", fontSize: "clamp(18px, 4vw, 20px)",
              cursor: isOnline && canControl ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", touchAction: "manipulation",
            }} title="Mute" aria-label="Mute">
              <FaMicrophone />
            </button>

            {/* Camera (only for video calls) */}
            {callType === "video" && (
              <button onClick={onCamera} disabled={!isOnline || !canControl} style={{
                width: "clamp(48px, 14vw, 56px)", height: "clamp(48px, 14vw, 56px)", borderRadius: "50%", border: "none",
                background: state.isCameraOff ? "rgba(239,91,91,0.2)" : "rgba(255,255,255,0.1)",
                color: state.isCameraOff ? "#EF5B5B" : "#eef0f7", fontSize: "clamp(18px, 4vw, 20px)",
                cursor: isOnline && canControl ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", touchAction: "manipulation",
              }} title="Camera" aria-label="Camera">
                <FaVideo />
              </button>
            )}

            {/* Upgrade audio to video */}
            {callType === "audio" && canControl && (
              <button onClick={onUpgrade} disabled={!isOnline} style={{
                width: "clamp(48px, 14vw, 56px)", height: "clamp(48px, 14vw, 56px)", borderRadius: "50%", border: "none",
                background: "rgba(123,158,255,0.15)", color: "#7B9EFF", fontSize: "clamp(16px, 4vw, 18px)",
                cursor: isOnline ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", touchAction: "manipulation",
              }} title="Upgrade to Video" aria-label="Upgrade to video">
                <FaVideoSlash />
              </button>
            )}

            {/* End / Cancel */}
            <button onClick={onEnd} style={{
              width: "clamp(56px, 16vw, 64px)", height: "clamp(56px, 16vw, 64px)", borderRadius: "50%", border: "none",
              background: "rgba(239,91,91,0.2)", color: "#EF5B5B", fontSize: "clamp(22px, 5vw, 24px)",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", transition: "all 0.2s", touchAction: "manipulation",
            }} title={isOutgoingRinging ? "Cancel call" : "End call"} aria-label="End call">
              <FaPhoneSlash />
            </button>
          </>
        )}
      </div>
      {isIncomingRinging && (
        <div style={{ marginTop: 12, fontSize: 11, color: "rgba(238,240,247,0.5)", textAlign: "center", letterSpacing: "0.06em" }}>
          Tap <span style={{ color: "#2ECC8F", fontWeight: 700 }}>Answer</span> to start conversation
        </div>
      )}
      {isOutgoingRinging && (
        <div style={{ marginTop: 12, fontSize: 11, color: "rgba(238,240,247,0.5)", textAlign: "center" }}>
          Calling… waiting for answer
        </div>
      )}

      {/* Offline notification */}
      {!isOnline && (
        <div style={{
          marginTop: "20px", padding: "10px 20px",
          background: "rgba(239,91,91,0.15)", border: "1px solid rgba(239,91,91,0.3)",
          borderRadius: "8px", fontSize: "13px", color: "#EF5B5B",
        }}>
          You are offline. Call controls are disabled.
        </div>
      )}
    </div>
  );
}
