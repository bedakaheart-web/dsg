import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "../js/supabase";

export type CallState = "idle" | "ringing" | "active" | "declined" | "ended";
export type CallType = "audio" | "video";

export interface WebRTCState {
  callState: CallState;
  callType: CallType | null;
  remoteParticipantId: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isUpgradedToVideo: boolean;
}

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

export function useWebRTC(localUserId: string | null, remoteUserId: string | null) {
  const [state, setState] = useState<WebRTCState>({
    callState: "idle",
    callType: null,
    remoteParticipantId: null,
    localStream: null,
    remoteStream: null,
    isMuted: false,
    isCameraOff: false,
    isUpgradedToVideo: false,
  });

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const callTypeRef = useRef<CallType | null>(null);
  const remoteIdRef = useRef<string | null>(remoteUserId);
  const localIdRef = useRef<string | null>(localUserId);
  const stateRef = useRef(state);

  stateRef.current = state;
  remoteIdRef.current = remoteUserId;
  localIdRef.current = localUserId;

  const updateState = useCallback((updates: Partial<WebRTCState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const cleanup = useCallback(async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  const createPeerConnection = useCallback(async (): Promise<RTCPeerConnection> => {
    const pc = new RTCPeerConnection(ICE_CONFIG);
    pcRef.current = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => pc.addTrack(t, localStreamRef.current!));
    }

    pc.ontrack = (event) => {
      updateState({ remoteStream: event.streams[0] || null });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && remoteIdRef.current) {
        channelRef.current?.send({
          type: "broadcast",
          event: "webrtc-signal",
          payload: {
            type: "ice-candidate",
            candidate: event.candidate.toJSON(),
            from: localIdRef.current,
            to: remoteIdRef.current,
            callType: callTypeRef.current,
          },
        });
      }
    };

    return pc;
  }, [updateState]);

  const getLocalStream = useCallback(async (callType: CallType): Promise<MediaStream> => {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: callType === "video",
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStreamRef.current = stream;
    updateState({ localStream: stream });
    return stream;
  }, [updateState]);

  const startCall = useCallback(async (callType: CallType): Promise<boolean> => {
    if (!localUserId || !remoteUserId) return false;

    callTypeRef.current = callType;
    remoteIdRef.current = remoteUserId;
    updateState({ callType, callState: "ringing", remoteParticipantId: remoteUserId });

    try {
      const stream = await getLocalStream(callType);
      const pc = await createPeerConnection();

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      channelRef.current = supabase.channel(`call-${[localUserId, remoteUserId].sort().join("_")}`);

      channelRef.current
        .on("broadcast", { event: "webrtc-signal" }, async (payload) => {
          const p = payload.payload as { type: string; from: string; sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit };
          if (p.from !== remoteUserId) return;
          if (p.type === "offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(p.sdp!));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            channelRef.current?.send({ type: "broadcast", event: "webrtc-signal", payload: { type: "answer", sdp: answer, from: localUserId, to: remoteUserId } });
          } else if (p.type === "answer") {
            await pc.setRemoteDescription(new RTCSessionDescription(p.sdp!));
          } else if (p.type === "ice-candidate") {
            try { await pc.addIceCandidate(new RTCIceCandidate(p.candidate)); } catch {}
          }
        })
        .subscribe();

      channelRef.current.send({
        type: "broadcast",
        event: "webrtc-signal",
        payload: { type: "offer", sdp: pc.localDescription, from: localIdRef.current, to: remoteUserId, callType },
      });

      updateState({});
      return true;
    } catch (err) {
      console.error("[useWebRTC] Failed to start call:", err);
      updateState({ callState: "idle" });
      return false;
    }
  }, [remoteUserId, getLocalStream, createPeerConnection, updateState]);

  const receiveCall = useCallback(async (callType: CallType, fromId: string) => {
    if (!localIdRef.current) return false;
    callTypeRef.current = callType;
    remoteIdRef.current = fromId;
    updateState({ callType, callState: "ringing", remoteParticipantId: fromId });

    try {
      const stream = await getLocalStream(callType);
      const pc = await createPeerConnection();

      channelRef.current = supabase.channel(`call-${[localIdRef.current, fromId].sort().join("_")}`);

      channelRef.current
        .on("broadcast", { event: "webrtc-signal" }, async (payload) => {
          const p = payload.payload as { type: string; from: string; sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit };
          if (p.from !== fromId) return;
          if (p.type === "offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(p.sdp!));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            channelRef.current?.send({ type: "broadcast", event: "webrtc-signal", payload: { type: "answer", sdp: answer, from: localIdRef.current, to: fromId } });
          } else if (p.type === "answer") {
            await pc.setRemoteDescription(new RTCSessionDescription(p.sdp!));
          } else if (p.type === "ice-candidate") {
            try { await pc.addIceCandidate(new RTCIceCandidate(p.candidate)); } catch {}
          }
        })
        .subscribe();

      return true;
    } catch (err) {
      console.error("[useWebRTC] Failed to receive call:", err);
      return false;
    }
  }, [getLocalStream, createPeerConnection, updateState]);

  const acceptCall = useCallback(async () => {
    const pc = pcRef.current;
    const remoteId = remoteIdRef.current;
    const callType = callTypeRef.current || "audio";
    if (!pc || !remoteId) return;
    channelRef.current?.send({
      type: "broadcast",
      event: "webrtc-signal",
      payload: { type: "offer", sdp: pc.localDescription, from: localIdRef.current, to: remoteId, callType },
    });
    updateState({ callState: "active" });
  }, [updateState]);

  const declineCall = useCallback(() => {
    const remoteId = remoteIdRef.current;
    channelRef.current?.send({
      type: "broadcast",
      event: "webrtc-signal",
      payload: { type: "decline", from: localIdRef.current, to: remoteId },
    });
    cleanup();
    updateState({ callState: "declined", callType: null, remoteParticipantId: null });
  }, [cleanup, updateState]);

  const endCall = useCallback(() => {
    const remoteId = remoteIdRef.current;
    channelRef.current?.send({
      type: "broadcast",
      event: "webrtc-signal",
      payload: { type: "end", from: localIdRef.current, to: remoteId },
    });
    cleanup();
    updateState({
      callState: "ended", callType: null, remoteParticipantId: null,
      localStream: null, remoteStream: null,
      isMuted: false, isCameraOff: false, isUpgradedToVideo: false,
    });
  }, [cleanup, updateState]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      updateState({ isMuted: !audioTrack.enabled });
      if (pcRef.current) {
        pcRef.current.getSenders().forEach(s => { if (s.track?.kind === "audio") s.track.enabled = audioTrack.enabled; });
      }
    }
  }, [updateState]);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      updateState({ isCameraOff: !videoTrack.enabled });
      if (pcRef.current) {
        pcRef.current.getSenders().forEach(s => { if (s.track?.kind === "video") s.track.enabled = videoTrack.enabled; });
      }
    }
  }, [updateState]);

  const upgradeToVideo = useCallback(async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const videoTrack = newStream.getVideoTracks()[0];
      if (pcRef.current) {
        const sender = pcRef.current.getSenders().find(s => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(videoTrack);
      }
      if (localStreamRef.current) localStreamRef.current.getVideoTracks().forEach(t => t.stop());
      localStreamRef.current = newStream;
      updateState({ localStream: newStream, isUpgradedToVideo: true });
    } catch (err) {
      console.error("[useWebRTC] Failed to upgrade to video:", err);
    }
  }, [updateState]);

  useEffect(() => {
    if (!localIdRef.current) return;
    const remoteId = remoteIdRef.current;
    if (!remoteId) return;

    const channel = supabase.channel(`call-${[localIdRef.current, remoteId].sort().join("_")}`);
    channel.on("broadcast", { event: "webrtc-signal" }, async (payload) => {
      const p = payload.payload as { type: string; from: string; callType: string };
      if (p.from === localIdRef.current) return;
      if (p.type === "offer" && stateRef.current.callState === "idle") {
        callTypeRef.current = p.callType as CallType;
        remoteIdRef.current = p.from;
        await receiveCall(p.callType as CallType, p.from);
      }
    });
    channel.subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [remoteUserId, receiveCall]);

  useEffect(() => { cleanup(); }, [cleanup]);

  return { state, startCall, receiveCall, acceptCall, declineCall, endCall, toggleMute, toggleCamera, upgradeToVideo };
}
