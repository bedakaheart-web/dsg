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

import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [presenceMap, setPresenceMap] = useState<Record<string, any>>({});
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
  // Use unique channel per hook instance to avoid "cannot add postgres_changes after subscribe" when
  // multiple components mount usePresence simultaneously (e.g. hot-reload, multiple drawers).
  useEffect(() => {
    void fetchAll();
    const ch = supabase
      .channel(`presence-profiles-live-${Math.random().toString(36).slice(2, 9)}`)
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
  // Previous bug: per-user random channel names isolated users. Also need to handle
  // multiple hooks on same client sharing the same channel without duplicate subscribe errors,
  // and make presence actually affect online status (Sherena bug: DB is_online false).
  useEffect(() => {
    if (!enabled || !userId || !role) return;
    const channelName = "dumasafe-global-presence";
    type Entry = { count: number; channel: ReturnType<typeof supabase.channel>; state: Record<string, any>; listeners: Set<(s: Record<string, any>) => void> };
    const globalMap: Map<string, Entry> = ((globalThis as any).__dsgPresenceChannels ??= new Map());
    const globalState: { value: Record<string, any>; listeners: Set<(s: Record<string, any>) => void> } =
      ((globalThis as any).__dsgPresenceState ??= { value: {}, listeners: new Set() });
    const existing = globalMap.get(channelName);
    if (existing) {
      existing.count += 1;
      const cb = (s: Record<string, any>) => setPresenceMap(s);
      existing.listeners.add(cb);
      globalState.listeners.add(cb);
      // Sync current global state immediately
      try { setPresenceMap(existing.state); } catch {}
      try { setPresenceMap(globalState.value); } catch {}
      return () => {
        existing.listeners.delete(cb);
        globalState.listeners.delete(cb);
        existing.count -= 1;
        if (existing.count <= 0) {
          existing.channel.unsubscribe();
          supabase.removeChannel(existing.channel);
          globalMap.delete(channelName);
        }
      };
    }
    const channel = supabase.channel(channelName, {
      config: { presence: { key: userId } },
    });
    const entry: Entry = { count: 1, channel, state: {}, listeners: new Set() };
    const cbSelf = (s: Record<string, any>) => setPresenceMap(s);
    entry.listeners.add(cbSelf);
    globalState.listeners.add(cbSelf);
    const broadcastState = () => {
      try {
        const state = channel.presenceState() as Record<string, any>;
        entry.state = state;
        globalState.value = state;
        setPresenceMap(state);
        entry.listeners.forEach(fn => { try { fn(state); } catch {} });
        globalState.listeners.forEach(fn => { try { fn(state); } catch {} });
      } catch {}
      void fetchAll();
    };
    // All .on() must be registered BEFORE subscribe()
    channel.on("presence", { event: "sync" }, broadcastState);
    channel.on("presence", { event: "join" }, broadcastState);
    channel.on("presence", { event: "leave" }, broadcastState);
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        try { await channel.track({ user_id: userId, role, id: userId }); } catch {}
        setTimeout(() => broadcastState(), 400);
      }
    });
    globalMap.set(channelName, entry);
    return () => {
      entry.listeners.delete(cbSelf);
      globalState.listeners.delete(cbSelf);
      entry.count -= 1;
      if (entry.count <= 0) {
        entry.channel.unsubscribe();
        supabase.removeChannel(entry.channel);
        globalMap.delete(channelName);
      }
    };
  }, [userId, role, enabled, fetchAll]);

  // Presence augments DB: user is online if either DB says online OR they are in Realtime Presence
  // This fixes Sherena bug where DB is_online=false and last_seen stale but presence shows online
  const presenceIds = useMemo(() => {
    try {
      const flat = Object.values(presenceMap).flat() as any[];
      return new Set(flat.map((c: any) => (c.id || c.user_id) as string).filter(Boolean));
    } catch {
      return new Set<string>();
    }
  }, [presenceMap]);

  const onlineResponders = useMemo(() => responders.filter(c => isResponderOnDuty(c) || presenceIds.has(c.id)), [responders, presenceIds]);
  const onlineCitizens = useMemo(() => citizens.filter(c => isCitizenOnline(c) || presenceIds.has(c.id)), [citizens, presenceIds]);

  return {
    onlineResponders,
    onlineCitizens,
    allResponders: responders,
    allCitizens: citizens,
    loading,
    refresh: fetchAll,
  };
}
