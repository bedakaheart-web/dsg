// src/hooks/usePresence.ts
// Centralized presence for citizen ↔ responder communication.
// Single source of truth for "who is online/on-duty" used by both sides.
//
// Uses hybrid approach:
//  - Primary: DB polling + postgres_changes (profiles is_online/last_seen/status)
//    ensures citizens see responders even if Realtime Presence is flaky.
//  - Secondary: Supabase Realtime Presence on a GLOBAL channel
//    (dumasafe-global-presence) triggers immediate refetch on join/leave/sync.
//    Previous version used per-user random channel names which isolated users
//    and caused citizens to see "No responders" even when responders were on_duty.
// Provides:
//   - onlineResponders: ResponderContact[] with is_online/status
//   - onlineCitizens: CitizenContact[] with is_online
//   - refresh() to re-fetch
//   - realtime subscription keeping lists live
//   - helper isResponderOnDuty(c), isCitizenOnline(c)

import { useCallback, useEffect, useState } from "react";
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
  const [responders, setResponders] = useState<PresenceContact[]>([]);
  const [citizens, setCitizens] = useState<PresenceContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      let data: PresenceContact[] | null = null;
      const attemptFull = await supabase
        .from("profiles")
        .select("id, full_name, email, role, status, is_online, last_seen")
        .in("role", ["responder", "citizen"])
        .order("full_name", { ascending: true })
        .limit(500);
      if (attemptFull.error) {
        const fallback = await supabase
          .from("profiles")
          .select("id, full_name, email, role, status")
          .in("role", ["responder", "citizen"])
          .order("full_name", { ascending: true })
          .limit(500);
        if (!fallback.error) data = (fallback.data ?? []) as PresenceContact[];
      } else {
        data = (attemptFull.data ?? []) as PresenceContact[];
      }
      if (!data) return;
      setResponders(data.filter((c) => (c.role ?? "").toLowerCase() === "responder"));
      setCitizens(data.filter((c) => (c.role ?? "").toLowerCase() === "citizen"));
    } catch {
      // ignore - keep previous data
    } finally {
      setLoading(false);
    }
  }, []);

  // Primary: DB polling + postgres_changes - ensures list is correct even if Presence is down
  useEffect(() => {
    void fetchAll();
    const ch = supabase
      .channel("presence-profiles-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        void fetchAll();
      })
      .subscribe();
    const interval = setInterval(() => void fetchAll(), 30000);
    return () => {
      supabase.removeChannel(ch);
      clearInterval(interval);
    };
  }, [fetchAll]);

  // Secondary: Global Realtime Presence - single shared channel so citizens and responders see each other
  // Previous bug: per-user random channel names (dumasafe-presence-${random}) isolated users
  useEffect(() => {
    if (!enabled || !userId || !role) return;
    const channel = supabase.channel("dumasafe-global-presence", {
      config: { presence: { key: userId } },
    });
    // Track minimal payload; full profile comes from fetchAll triggered on sync
    channel.track({ user_id: userId, role, id: userId });
    const triggerFetch = () => void fetchAll();
    channel.on("presence", { event: "sync" }, triggerFetch);
    channel.on("presence", { event: "join" }, triggerFetch);
    channel.on("presence", { event: "leave" }, triggerFetch);
    channel.subscribe();
    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [userId, role, enabled, fetchAll]);

  const onlineResponders = responders.filter(isResponderOnDuty);
  const onlineCitizens = citizens.filter(isCitizenOnline);

  return {
    onlineResponders,
    onlineCitizens,
    allResponders: responders,
    allCitizens: citizens,
    loading,
    refresh: fetchAll,
  };
}
