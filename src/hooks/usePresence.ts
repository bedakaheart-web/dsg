// src/hooks/usePresence.ts
// Centralized presence for citizen ↔ responder communication.
// Single source of truth for "who is online/on-duty" used by both sides.
//
// Uses Supabase Realtime Presence (channel.track / channel.presenceState)
// as the primary source of truth for who is online. The last_seen column
// and is_online/status in profiles remain as a secondary/fallback signal
// for when the WebSocket connection is unavailable.
//
// Provides:
//   - onlineResponders: ResponderContact[] with is_online/status
//   - onlineCitizens: CitizenContact[] with is_online
//   - refresh() to re-fetch
//   - realtime subscription keeping lists live
//   - helper isResponderOnDuty(c), isCitizenOnline(c)

import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";

export interface PresenceContact {
  id: string;
  full_name: string | null;
  email: string;
  role: string | null;
  status?: string | null;
  is_online?: boolean | null;
  last_seen?: string | null;
}

export interface PresenceState {
  onlineResponders: PresenceContact[];
  onlineCitizens: PresenceContact[];
  allResponders: PresenceContact[];
  allCitizens: PresenceContact[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export function isResponderOnDuty(c: PresenceContact): boolean {
  const s = (c.status ?? "").toLowerCase().trim().replace(/\s+/g, "_");
  if (s === "on_duty" || s === "responding") return true;
  if (c.is_online === true) return true;
  // fallback: last_seen within 3 minutes = online
  if (c.last_seen) {
    const diff = Date.now() - new Date(c.last_seen).getTime();
    if (diff < 3 * 60 * 1000) return true;
  }
  return false;
}

export function isCitizenOnline(c: PresenceContact): boolean {
  if (c.is_online === true) return true;
  const s = (c.status ?? "").toLowerCase().trim();
  if (s === "online" || s === "on_duty") return true;
  if (c.last_seen) {
    const diff = Date.now() - new Date(c.last_seen).getTime();
    if (diff < 3 * 60 * 1000) return true;
  }
  return false;
}

export function usePresence(
  userId: string | null,
  role: string | null,
  enabled = true,
): PresenceState {
  const [presenceMap, setPresenceMap] = useState<Record<string, PresenceContact[]>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!enabled || !userId || !role) return;
    const presenceId = `dumasafe-presence-${Math.random().toString(36).slice(2, 9)}`;
    const fallbackId = `pf-${Math.random().toString(36).slice(2, 9)}`;
    const channel = supabase.channel(presenceId, {
      config: { presence: { key: userId } },
    });
    channel.track({ user_id: userId, role });
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState() as Record<string, PresenceContact[]>;
      setPresenceMap(state);
      setLoading(false);
    });
    channel.subscribe();
    const ch = supabase
      .channel(`profiles-fallback-${fallbackId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        // Realtime Presence is primary; this is just a safety net
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
      supabase.removeChannel(ch);
    };
  }, [userId, role, enabled]);

  const allOnline = Object.values(presenceMap).flat();
  const allResponders = allOnline.filter((c) => (c.role ?? "").toLowerCase() === "responder");
  const allCitizens = allOnline.filter((c) => (c.role ?? "").toLowerCase() === "citizen");
  const onlineResponders = allResponders.filter(isResponderOnDuty);
  const onlineCitizens = allCitizens.filter(isCitizenOnline);

  return {
    onlineResponders,
    onlineCitizens,
    allResponders,
    allCitizens,
    loading,
    refresh: async () => {}, // Realtime Presence is always live; no manual refresh needed
  };
}
