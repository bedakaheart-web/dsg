// src/hooks/useHeartbeat.ts
// Keeps profiles.is_online / last_seen / status fresh while user is active.
// Used by CitizenLayout and Respondersdashboard to make "who is online"
// visible to the other role in real time.
//
// For responders: sets status='on_duty' + is_online=true while dashboard open,
// heartbeats last_seen every 25s, sets off_duty on unload/logoff (optional).
// For citizens: sets is_online=true + last_seen, heartbeat every 25s.

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

    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    const markOnline = async () => {
      try {
        if (cancelled) return;
        const uid = userIdRef.current;
        const r = roleRef.current;
        if (!uid || !r) return;
        const payload: Record<string, unknown> = {
          last_seen: new Date().toISOString(),
          is_online: true,
        };
        if (r === "responder") {
          payload.status = "on_duty";
        } else {
          // citizen stays without status or set to online marker if column supports it
          // keep existing status but ensure online
        }
        // Try full payload; fallback if columns missing
        const { error } = await supabase.from("profiles").update(payload).eq("id", uid);
        if (error) {
          // Retry with only last_seen if is_online/status columns missing
          const msg = error.message ?? "";
          if (/column .* does not exist|is_online|last_seen/i.test(msg)) {
            try {
              await supabase.from("profiles").update({ last_seen: new Date().toISOString() } as any).eq("id", uid);
            } catch {}
            // Try status fallback for responder
            if (r === "responder" && /status/i.test(msg)) {
              try {
                await supabase.from("profiles").update({ status: "on_duty" } as any).eq("id", uid);
              } catch {}
            }
          }
        }
      } catch {}
    };

    // Immediate mark + periodic
    void markOnline();
    interval = setInterval(() => void markOnline(), 25000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") void markOnline();
    };
    const onFocus = () => void markOnline();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    // Best-effort offline on unload — fire-and-forget via sendBeacon alternative
    const onBeforeUnload = () => {
      const uid = userIdRef.current;
      if (!uid) return;
      try {
        // Use keepalive fetch alternative; supabase update may not complete on unload,
        // but we at least attempt to set is_online false via navigator.sendBeacon if available.
        // Fallback is heartbeat expiry (3 min) on other clients.
        if (typeof navigator.sendBeacon === "function") {
          // Cannot use supabase client in beacon; rely on server heartbeat expiry instead.
        }
      } catch {}
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("beforeunload", onBeforeUnload);
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
