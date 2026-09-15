import { useEffect, useRef } from "react";
import { FaVideoSlash, FaMicrophone, FaVideo, FaPhoneSlash } from "react-icons/fa";
import { WebRTCState, CallType } from "../hooks/useWebRTC";

interface CallOverlayProps {
  state: WebRTCState;
  callType: CallType;
  remoteName: string;
  onMute: () => void;
  onCamera: () => void;
  onUpgrade: () => void;
  onEnd: () => void;
  isOnline: boolean;
}

export default function CallOverlay({
  state, callType, remoteName, onMute, onCamera, onUpgrade, onEnd, isOnline,
}: CallOverlayProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && state.localStream) {
      localVideoRef.current.srcObject = state.localStream;
    }
  }, [state.localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && state.remoteStream) {
      remoteVideoRef.current.srcObject = state.remoteStream;
    }
  }, [state.remoteStream]);

  if (state.callState === "idle") return null;

  const isActive = state.callState === "active" || state.callState === "ringing";

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
          <div style={{ fontSize: "16px", fontWeight: "700" }}>{remoteName}</div>
          <div style={{ fontSize: "11px", color: "rgba(46,204,143,0.8)" }}>
            {state.callState === "ringing" ? `${callType === "video" ? "Video" : "Audio"} calling...` : state.callState === "active" ? `${callType === "video" ? "Video" : "Audio"} call` : ""}
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

      {/* Controls */}
      <div style={{
        display: "flex", gap: "16px", alignItems: "center",
      }}>
        {/* Mute */}
        <button onClick={onMute} disabled={!isOnline || !isActive} style={{
          width: "56px", height: "56px", borderRadius: "50%", border: "none",
          background: state.isMuted ? "rgba(239,91,91,0.2)" : "rgba(255,255,255,0.1)",
          color: state.isMuted ? "#EF5B5B" : "#eef0f7", fontSize: "20px",
          cursor: isOnline && isActive ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }} title="Mute">
          <FaMicrophone />
        </button>

        {/* Camera (only for video calls) */}
        {callType === "video" && (
          <button onClick={onCamera} disabled={!isOnline || !isActive} style={{
            width: "56px", height: "56px", borderRadius: "50%", border: "none",
            background: state.isCameraOff ? "rgba(239,91,91,0.2)" : "rgba(255,255,255,0.1)",
            color: state.isCameraOff ? "#EF5B5B" : "#eef0f7", fontSize: "20px",
            cursor: isOnline && isActive ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }} title="Camera">
            <FaVideo />
          </button>
        )}

        {/* Upgrade audio to video */}
        {callType === "audio" && isActive && (
          <button onClick={onUpgrade} disabled={!isOnline} style={{
            width: "56px", height: "56px", borderRadius: "50%", border: "none",
            background: "rgba(123,158,255,0.15)", color: "#7B9EFF", fontSize: "18px",
            cursor: isOnline ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }} title="Upgrade to Video">
            <FaVideoSlash />
          </button>
        )}

        {/* End call */}
        <button onClick={onEnd} style={{
          width: "64px", height: "64px", borderRadius: "50%", border: "none",
          background: "rgba(239,91,91,0.2)", color: "#EF5B5B", fontSize: "24px",
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", transition: "all 0.2s",
        }} title="End Call">
          <FaPhoneSlash />
        </button>
      </div>

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
