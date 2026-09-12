// src/components/CameraCaptureModal.tsx
//
// Lightweight live-camera capture dialog for incident evidence.
// Streams the device camera (MediaDevices API), captures a frame to canvas,
// and returns it as a JPEG File. Front/rear toggle via facingMode.

import { useCallback, useEffect, useRef, useState } from "react";

interface CameraCaptureModalProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraCaptureModal({ onCapture, onClose }: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      stopStream();
      setStarting(true);
      setError(null);
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera is not supported on this device or browser.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => { /* autoplay guard */ });
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(
            e?.name === "NotAllowedError"
              ? "Camera access was denied. Allow camera permission and try again."
              : (e?.message || "Could not start the camera.")
          );
        }
      } finally {
        if (!cancelled) setStarting(false);
      }
    };
    void start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [facingMode, stopStream]);

  // Stop tracks if the modal unmounts while a stream is live.
  useEffect(() => () => stopStream(), [stopStream]);

  const takeSnap = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
        onClose();
      },
      "image/jpeg",
      0.85
    );
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 520, background: "#0f1623", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 16 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#eef0f7" }}>📷 Capture Evidence</span>
          <button onClick={onClose} aria-label="Close camera"
            style={{ background: "none", border: "none", color: "rgba(238,240,247,0.6)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "#000", minHeight: 240 }}>
          <video ref={videoRef} playsInline muted autoPlay
            style={{ width: "100%", maxHeight: "52vh", display: "block", objectFit: "cover" }} />
          {starting && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(238,240,247,0.6)", fontSize: 13 }}>
              Starting camera…
            </div>
          )}
        </div>

        {error && <div style={{ color: "#FF3B30", fontSize: 12, marginTop: 10 }}>{error}</div>}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={() => setFacingMode(f => (f === "user" ? "environment" : "user"))}
            style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#eef0f7", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            🔄 Switch Camera ({facingMode === "user" ? "Front" : "Rear"})
          </button>
          <button
            onClick={takeSnap}
            disabled={starting || !!error}
            style={{ flex: 2, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(46,204,143,0.4)", background: "rgba(46,204,143,0.12)", color: "#2ECC8F", fontSize: 12, fontWeight: 800, cursor: "pointer", opacity: starting || error ? 0.5 : 1 }}
          >
            📸 Take Snap
          </button>
        </div>
      </div>
    </div>
  );
}
