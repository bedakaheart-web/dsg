// src/hooks/useHeartbeat.ts
// Tracks the current user's presence via Supabase Realtime Presence channel.
// This replaces the old setInterval-based polling that was throttled on mobile.
// The channel.track() call announces presence on mount and the presence
// channel automatically removes the user when the WebSocket disconnects.
//
// For responders: tracks status='on_duty' + role='responder'
// For citizens: tracks role='citizen'
// Used by CitizenLayout and Respondersdashboard to make "who is online"
// visible to the other role in real time.

import { useEffect, useRef } from "react";
import { supabase } from "../js/supabase";

type HeartbeatRole = "citizen" | "responder";

export function useHeartbeat(userId: string | null, role: HeartbeatRole | null, enabled = true) {
  const userIdRef = useRef(userId);
  const roleRef = useRef(role);
  userIdRef.current = userId;
  roleRef.current = role;

  useEffect(() => {
    if (!enabled || !userId || !role) return;

    // Track presence on the shared presence channel.
    // Supabase Realtime Presence automatically removes this user
    // when the WebSocket disconnects (e.g., tab backgrounded, network lost).
    const channel = supabase.channel("dumasafe-presence", {
      config: { presence: { key: userId } },
    });
    channel.track({ user_id: userId, role });

    return () => {
      channel.unsubscribe();
    };
  }, [userId, role, enabled]);
}

export async function markOffline(userId: string, role: HeartbeatRole | null) {
  try {
    const payload: Record<string, unknown> = { is_online: false, last_seen: new Date().toISOString() };
    if (role === "responder") payload.status = "off_duty";
    const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
    if (error && /column .* does not exist/i.test(error.message ?? "")) {
      try {
        await supabase.from("profiles").update({ last_seen: new Date().toISOString() } as any).eq("id", userId);
      } catch {}
    }
  } catch {}
}
