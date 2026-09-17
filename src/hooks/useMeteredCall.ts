import { useState, useRef, useCallback, useEffect } from "react";

export type MeteredCallState = "idle" | "joining" | "ringing" | "active" | "ended";
export type MeteredCallType = "audio" | "video";

interface MeteredCallStateValue {
  callState: MeteredCallState;
  callType: MeteredCallType | null;
  remoteName: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
}

export function useMeteredCall(roomId: string | null, userName: string | null) {
  const [state, setState] = useState<MeteredCallStateValue>({
    callState: "idle",
    callType: null,
    remoteName: null,
    localStream: null,
    remoteStream: null,
    isMuted: false,
    isCameraOff: false,
  });

  const meetingRef = useRef<any>(null);
  const roomIdRef = useRef<string | null>(roomId);
  const userNameRef = useRef<string | null>(userName);

  roomIdRef.current = roomId;
  userNameRef.current = userName;

  const updateState = useCallback((updates: Partial<MeteredCallStateValue>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const cleanup = useCallback(async () => {
    try {
      if (meetingRef.current) {
        await meetingRef.current.leave();
        meetingRef.current = null;
      }
    } catch (err) {
      console.error("[useMeteredCall] cleanup error:", err);
    }
    updateState({
      callState: "idle", callType: null,
      remoteName: null, localStream: null, remoteStream: null,
      isMuted: false, isCameraOff: false,
    });
  }, [updateState]);

  const joinRoom = useCallback(async (callType: MeteredCallType): Promise<boolean> => {
    if (!roomIdRef.current || !userNameRef.current) {
      console.warn("[useMeteredCall] joinRoom aborted: missing roomId or userName");
      return false;
    }

    const Metered = window.Metered;
    if (!Metered || !Metered.Meeting) {
      console.error("[useMeteredCall] Metered SDK not loaded. Ensure CDN script is present.");
      return false;
    }

    try {
      const meeting = new Metered.Meeting();
      meetingRef.current = meeting;
      updateState({ callState: "joining", callType });

      const domain = import.meta.env.VITE_METERED_DOMAIN || "dumasafeguide.metered.live";
      const roomURL = `${domain}/${roomIdRef.current}`;

      meeting.on("participantJoined", (p: any) => {
        console.log("[useMeteredCall] participantJoined:", p.name);
        updateState({ remoteName: p.name });
      });

      meeting.on("participantLeft", (p: any) => {
        console.log("[useMeteredCall] participantLeft:", p.name);
        updateState({ callState: "ended", remoteName: null });
      });

      meeting.on("streamAdded", (p: any) => {
        console.log("[useMeteredCall] streamAdded");
        updateState({ remoteStream: p.stream || null });
      });

      meeting.on("streamRemoved", () => {
        console.log("[useMeteredCall] streamRemoved");
        updateState({ remoteStream: null });
      });

      await meeting.join({ roomURL, name: userNameRef.current });
      updateState({ callState: "active", remoteName: userNameRef.current });

      if (callType === "video") {
        await meeting.startVideo();
      }
      await meeting.startAudio();

      return true;
    } catch (err) {
      console.error("[useMeteredCall] Failed to join room:", err);
      updateState({ callState: "idle" });
      return false;
    }
  }, [updateState]);

  const toggleMute = useCallback(async () => {
    const meeting = meetingRef.current;
    if (!meeting) return;
    try {
      if (state.isMuted) {
        await meeting.startAudio();
      } else {
        await meeting.stopAudio();
      }
      updateState({ isMuted: !state.isMuted });
    } catch (err) {
      console.error("[useMeteredCall] toggleMute error:", err);
    }
  }, [state.isMuted, updateState]);

  const toggleCamera = useCallback(async () => {
    const meeting = meetingRef.current;
    if (!meeting) return;
    try {
      if (state.isCameraOff) {
        await meeting.startVideo();
      } else {
        await meeting.stopVideo();
      }
      updateState({ isCameraOff: !state.isCameraOff });
    } catch (err) {
      console.error("[useMeteredCall] toggleCamera error:", err);
    }
  }, [state.isCameraOff, updateState]);

  const endCall = useCallback(async () => {
    await cleanup();
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { cleanup(); };
  }, [cleanup]);

  return {
    state,
    joinRoom,
    toggleMute,
    toggleCamera,
    endCall,
    cleanup,
  };
}
