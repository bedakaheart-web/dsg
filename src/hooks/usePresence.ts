// src/hooks/usePresence.ts
// Centralized presence for citizen ↔ responder communication.
// Single source of truth for "who is online/on-duty" used by both sides.
//
// Tables: profiles { id, role, full_name, email, status, is_online, last_seen }
//   - responder: status = 'on_duty' | 'responding' | 'off_duty', is_online boolean
//   - citizen:   is_online boolean + last_seen (updated via heartbeat)
//   - Falls back gracefully if columns missing (treat missing as offline).
//
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

export function usePresence(pollIntervalMs = 30000): PresenceState {
  const [responders, setResponders] = useState<PresenceContact[]>([]);
  const [citizens, setCitizens] = useState<PresenceContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      // Select with safe columns — if is_online/last_seen missing, supabase returns error,
      // so try full select first then fallback to minimal.
      let data: PresenceContact[] | null = null;
      const attemptFull = await supabase
        .from("profiles")
        .select("id, full_name, email, role, status, is_online, last_seen")
        .order("full_name", { ascending: true })
        .limit(500);
      if (attemptFull.error) {
        const fallback = await supabase
          .from("profiles")
          .select("id, full_name, email, role, status")
          .order("full_name", { ascending: true })
          .limit(500);
        if (!fallback.error) data = (fallback.data ?? []) as PresenceContact[];
        else {
          // Last resort: minimal columns
          const last = await supabase.from("profiles").select("id, email, role").limit(500);
          if (!last.error) data = (last.data ?? []) as PresenceContact[];
        }
      } else {
        data = (attemptFull.data ?? []) as PresenceContact[];
      }
      if (!data) return;
      setResponders(data.filter((c) => (c.role ?? "").toLowerCase() === "responder"));
      setCitizens(data.filter((c) => (c.role ?? "").toLowerCase() === "citizen"));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
    const ch = supabase
      .channel("presence-profiles-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        void fetchAll();
      })
      .subscribe();
    const interval = setInterval(() => void fetchAll(), pollIntervalMs);
    return () => {
      supabase.removeChannel(ch);
      clearInterval(interval);
    };
  }, [fetchAll, pollIntervalMs]);

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
