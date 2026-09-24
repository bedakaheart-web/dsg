import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "../js/supabase";
import { getIceServers } from "../lib/webrtc";

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

  const fullCleanup = useCallback(async () => {
    await cleanup();
    updateState({
      callState: "idle",
      callType: null,
      remoteParticipantId: null,
      localStream: null,
      remoteStream: null,
      isMuted: false,
      isCameraOff: false,
      isUpgradedToVideo: false,
    });
  }, [cleanup, updateState]);

  const createPeerConnection = useCallback(async (): Promise<RTCPeerConnection> => {
    const iceServers = await getIceServers();
    const pc = new RTCPeerConnection({ iceServers });
    pcRef.current = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => pc.addTrack(t, localStreamRef.current!));
    }

    pc.ontrack = (event) => {
      updateState({ remoteStream: event.streams[0] || null });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && remoteIdRef.current) {
        const icePayload = {
          type: "ice-candidate",
          candidate: event.candidate.toJSON(),
          from: localIdRef.current,
          to: remoteIdRef.current,
          callType: callTypeRef.current,
        } as const;
        channelRef.current?.send({ type: "broadcast", event: "webrtc-signal", payload: icePayload });
        try {
          const inboxCh = supabase.channel(`call-inbox-${remoteIdRef.current}`);
          inboxCh.subscribe();
          setTimeout(() => { inboxCh.send({ type: "broadcast", event: "webrtc-signal", payload: icePayload }); setTimeout(() => supabase.removeChannel(inboxCh), 1500); }, 200);
        } catch {}
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        updateState({ callState: "active" });
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
    if (!localIdRef.current) {
      return false;
    }
    callTypeRef.current = callType;
    updateState({ callType, callState: "ringing", remoteParticipantId: remoteIdRef.current });
    try {
      const stream = await getLocalStream(callType);
      const pc = await createPeerConnection();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const offerPayload = { type: "offer", sdp: pc.localDescription, from: localIdRef.current, to: remoteIdRef.current, callType } as const;
      const ch = channelRef.current;
      if (ch) {
        try { await ch.send({ type: "broadcast", event: "webrtc-signal", payload: offerPayload }); } catch (e) { /* non-fatal */ }
      }
      try {
        const inboxChannel = supabase.channel(`call-inbox-${localIdRef.current}`);
        await new Promise<void>((resolve) => {
          inboxChannel.subscribe((status) => { if (status === "SUBSCRIBED") resolve(); });
          setTimeout(() => resolve(), 800);
        });
        await inboxChannel.send({ type: "broadcast", event: "webrtc-signal", payload: offerPayload });
        setTimeout(() => supabase.removeChannel(inboxChannel), 2500);
      } catch (e) { /* non-fatal */ }
      return true;
    } catch (err) {
      updateState({ callState: "idle" });
      return false;
    }
  }, [getLocalStream, createPeerConnection, updateState]);

  const receiveCall = useCallback(async (callType: CallType, fromId: string, offerSdp?: RTCSessionDescriptionInit) => {
    if (!localIdRef.current) return false;
    callTypeRef.current = callType;
    remoteIdRef.current = fromId;
    updateState({ callType, callState: "ringing", remoteParticipantId: fromId });
    try {
      const stream = await getLocalStream(callType);
      const pc = await createPeerConnection();
      if (offerSdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(offerSdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        const answerPayload = { type: "answer", sdp: answer, from: localIdRef.current, to: fromId } as const;
        try {
          await supabase.channel(`call-inbox-${fromId}`).send({ type: "broadcast", event: "webrtc-signal", payload: answerPayload });
        } catch {}
        try {
          const inboxCh = supabase.channel(`call-inbox-${fromId}`);
          inboxCh.subscribe();
          setTimeout(() => { inboxCh.send({ type: "broadcast", event: "webrtc-signal", payload: answerPayload }); setTimeout(() => supabase.removeChannel(inboxCh), 2000); }, 200);
        } catch {}
      }
      return true;
    } catch (err) {
      return false;
    }
  }, [getLocalStream, createPeerConnection, updateState]);

  const acceptCall = useCallback(async () => {
    const pc = pcRef.current;
    const remoteId = remoteIdRef.current;
    if (!pc || !remoteId) return;
    if (pc.localDescription) {
      updateState({ callState: "active" });
      return;
    }
    updateState({ callState: "active" });
  }, [updateState]);

  const declineCall = useCallback(async () => {
    const remoteId = remoteIdRef.current;
    const declinePayload = { type: "decline", from: localIdRef.current, to: remoteId } as const;
    const endedPayload = { type: "call-ended", from: localIdRef.current, to: remoteId } as const;
    channelRef.current?.send({ type: "broadcast", event: "webrtc-signal", payload: declinePayload });
    channelRef.current?.send({ type: "broadcast", event: "webrtc-signal", payload: endedPayload });
    if (remoteId) {
      const inboxCh = supabase.channel(`call-inbox-${remoteId}`);
      inboxCh.subscribe();
      setTimeout(() => {
        inboxCh.send({ type: "broadcast", event: "webrtc-signal", payload: declinePayload });
        inboxCh.send({ type: "broadcast", event: "webrtc-signal", payload: endedPayload });
        setTimeout(() => supabase.removeChannel(inboxCh), 1500);
      }, 200);
    }
    await cleanup();
    updateState({ callState: "declined", callType: null, remoteParticipantId: null, localStream: null, remoteStream: null });
    setTimeout(() => updateState({ callState: "idle" }), 1500);
  }, [cleanup, updateState]);

  const endCall = useCallback(async () => {
    const remoteId = remoteIdRef.current;
    const endedPayload = { type: "call-ended", from: localIdRef.current, to: remoteId } as const;
    const endPayload = { type: "end", from: localIdRef.current, to: remoteId } as const;
    channelRef.current?.send({ type: "broadcast", event: "webrtc-signal", payload: endedPayload });
    channelRef.current?.send({ type: "broadcast", event: "webrtc-signal", payload: endPayload });
    if (remoteId) {
      const inboxCh = supabase.channel(`call-inbox-${remoteId}`);
      inboxCh.subscribe();
      setTimeout(() => {
        inboxCh.send({ type: "broadcast", event: "webrtc-signal", payload: endedPayload });
        inboxCh.send({ type: "broadcast", event: "webrtc-signal", payload: endPayload });
        setTimeout(() => supabase.removeChannel(inboxCh), 1500);
      }, 200);
    }
    await fullCleanup();
    updateState({
      callState: "ended", callType: null, remoteParticipantId: null,
      localStream: null, remoteStream: null,
      isMuted: false, isCameraOff: false, isUpgradedToVideo: false,
    });
    setTimeout(() => updateState({ callState: "idle" }), 1200);
  }, [fullCleanup, updateState]);

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

  // Persistent signaling channel — subscribes exactly once when both ids are known.
  // This ensures caller and callee are on the EXACT SAME topic: call-<sorted-ids>
  // and that SUBSCRIBED completes BEFORE any offer is sent (caller waits on already-subscribed channel).
  // NOTE: Remote may be null for global inbox handlers (e.g. GlobalCitizenCallHandler) — that's expected, skip pair channel silently.
  useEffect(() => {
    const localId = localUserId;
    const remoteId = remoteUserId;
    if (!localId || !remoteId) {
      // No warning for expected inbox-only mode (remote null) — avoids spam
      return;
    }
const channelName = `call-${[localId, remoteId].sort().join("_")}`;
    const channel = supabase.channel(channelName);
    channel.on("broadcast", { event: "webrtc-signal" }, async (payload) => {
      const p = payload.payload as {
        type: string;
        from: string;
        to?: string;
        sdp?: RTCSessionDescriptionInit;
        candidate?: RTCIceCandidateInit;
        callType?: CallType;
      };
      if (p.from === localId) return;
      if (p.to && p.to !== localId) return;
      const pc = pcRef.current;
      if (p.type === "offer") {
        if (stateRef.current.callState !== "idle") return;
        callTypeRef.current = (p.callType as CallType) || "audio";
        remoteIdRef.current = p.from;
        await receiveCall((p.callType as CallType) || "audio", p.from, p.sdp);
      } else if (p.type === "answer") {
        if (pc && p.sdp) {
          try { await pc.setRemoteDescription(new RTCSessionDescription(p.sdp)); } catch (e) { /* non-fatal */ }
          updateState({ callState: "active" });
        }
      } else if (p.type === "ice-candidate") {
        if (pc && p.candidate) {
          try { await pc.addIceCandidate(new RTCIceCandidate(p.candidate)); } catch (e) { /* non-fatal */ }
        }
      } else if (p.type === "decline") {
        if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
        if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
        updateState({ callState: "declined", callType: null, remoteParticipantId: null, localStream: null, remoteStream: null });
        setTimeout(() => updateState({ callState: "idle" }), 1500);
      } else if (p.type === "end" || p.type === "call-ended") {
        if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
        if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
        updateState({
          callState: "ended", callType: null, remoteParticipantId: null,
          localStream: null, remoteStream: null,
          isMuted: false, isCameraOff: false, isUpgradedToVideo: false,
        });
        setTimeout(() => updateState({ callState: "idle" }), 1200);
      }
    });
    channel.subscribe();
    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      if (channelRef.current === channel) channelRef.current = null;
    };
  }, [localUserId, remoteUserId, receiveCall, updateState]);

  // Global inbox: app-wide incoming call listener (deduped per localId to avoid duplicate channels / CLOSED)
  // Subscribes to call-inbox-${localUserId} regardless of remoteId, so ringing
  // works even when no chat drawer is open. Shared across multiple useWebRTC instances via ref-count.
  const inboxRefCount = (globalThis as any).__inboxRefCount ?? ((globalThis as any).__inboxRefCount = new Map<string, { count: number; channel: ReturnType<typeof supabase.channel> }>());
  useEffect(() => {
    const localId = localUserId;
    if (!localId) return;
    const inboxName = `call-inbox-${localId}`;
    // Reuse existing inbox channel if already subscribed for this localId (prevents duplicate subscribe / CLOSED)
    const existing = inboxRefCount.get(localId);
    if (existing) {
      existing.count += 1;
      return () => {
        existing.count -= 1;
        if (existing.count <= 0) {
          supabase.removeChannel(existing.channel);
          inboxRefCount.delete(localId);
        }
      };
    }
    const inbox = supabase.channel(inboxName);
    inbox.on("broadcast", { event: "webrtc-signal" }, async (payload) => {
      const p = payload.payload as {
        type: string;
        from: string;
        to?: string;
        sdp?: RTCSessionDescriptionInit;
        candidate?: RTCIceCandidateInit;
        callType?: CallType;
      };
      if (p.to && p.to !== localId) return;
      if (p.from === localId) return;
      const pc = pcRef.current;
      if (p.type === "offer") {
        if (stateRef.current.callState !== "idle") {
          return;
        }
        // Ensure pair channel exists for subsequent answer/ICE: set remote and trigger pair subscription
        remoteIdRef.current = p.from;
        callTypeRef.current = (p.callType as CallType) || "audio";
        await receiveCall((p.callType as CallType) || "audio", p.from, p.sdp);
      } else if (p.type === "answer") {
        if (pc && p.sdp) {
          try { await pc.setRemoteDescription(new RTCSessionDescription(p.sdp)); } catch (e) { console.error("[useWebRTC] inbox setRemoteDescription answer failed:", e); }
          updateState({ callState: "active" });
        }
      } else if (p.type === "ice-candidate") {
        if (pc && p.candidate) {
          try { await pc.addIceCandidate(new RTCIceCandidate(p.candidate)); } catch (e) { console.warn("[useWebRTC] inbox addIceCandidate failed:", e); }
        }
      } else if (p.type === "decline") {
        if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
        if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
        updateState({ callState: "declined", callType: null, remoteParticipantId: null, localStream: null, remoteStream: null });
        setTimeout(() => updateState({ callState: "idle" }), 1500);
      } else if (p.type === "end" || p.type === "call-ended") {
        if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
        if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
        updateState({ callState: "ended", callType: null, remoteParticipantId: null, localStream: null, remoteStream: null, isMuted: false, isCameraOff: false, isUpgradedToVideo: false });
        setTimeout(() => updateState({ callState: "idle" }), 1200);
      }
    });
    inbox.subscribe();
    inboxRefCount.set(localId, { count: 1, channel: inbox });
    return () => {
      const entry = inboxRefCount.get(localId);
      if (entry) {
        entry.count -= 1;
        if (entry.count <= 0) {
          supabase.removeChannel(entry.channel);
          inboxRefCount.delete(localId);
        }
      } else {
        supabase.removeChannel(inbox);
      }
    };
  }, [localUserId, receiveCall, updateState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { cleanup(); };
  }, [cleanup]);

  return { state, startCall, receiveCall, acceptCall, declineCall, endCall, toggleMute, toggleCamera, upgradeToVideo, fullCleanup };
}
