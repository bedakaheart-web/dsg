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

    // Mark online in DB immediately so isResponderOnDuty / isCitizenOnline see it via polling
    const markOnline = async () => {
      try {
        const payload: Record<string, unknown> = { is_online: true, last_seen: new Date().toISOString() };
        if (role === "responder") {
          // Ensure responder appears as on_duty for citizen list
          payload.status = "on_duty";
        }
        const { error } = await supabase.from("profiles").update(payload).eq("id", userId);
        if (error && /column .* does not exist/i.test(error.message ?? "")) {
          try { await supabase.from("profiles").update({ last_seen: new Date().toISOString() } as any).eq("id", userId); } catch {}
        }
      } catch {}
    };
    void markOnline();
    const heartbeatInterval = setInterval(() => void markOnline(), 45000);

    // Use GLOBAL presence channel so citizens and responders see each other.
    // Random per-user channels isolated users and caused "No responders" bug.
    const channelName = "dumasafe-global-presence";
    const globalMap: Map<string, { count: number; channel: ReturnType<typeof supabase.channel> }> =
      ((globalThis as any).__dsgHeartbeatChannels ??= new Map());
    const existing = globalMap.get(channelName);
    if (existing) {
      existing.count += 1;
      return () => {
        existing.count -= 1;
        if (existing.count <= 0) {
          existing.channel.unsubscribe();
          supabase.removeChannel(existing.channel);
          globalMap.delete(channelName);
        }
        clearInterval(heartbeatInterval);
      };
    }
    const channel = supabase.channel(channelName, {
      config: { presence: { key: userId } },
    });
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        try { await channel.track({ user_id: userId, role, id: userId }); } catch {}
      }
    });
    globalMap.set(channelName, { count: 1, channel });
    return () => {
      clearInterval(heartbeatInterval);
      const entry = globalMap.get(channelName);
      if (entry) {
        entry.count -= 1;
        if (entry.count <= 0) {
          entry.channel.unsubscribe();
          supabase.removeChannel(entry.channel);
          globalMap.delete(channelName);
        }
      } else {
        channel.unsubscribe();
        supabase.removeChannel(channel);
      }
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
