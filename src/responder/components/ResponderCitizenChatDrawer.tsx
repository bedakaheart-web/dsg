// src/responder/components/ResponderCitizenChatDrawer.tsx
// Centralized responder ↔ citizen communication drawer.
// Shows: assigned citizens, inbound messages from any citizen, and all online citizens.
// Lets responder chat / audio / video call any citizen who is online.
// Previous version only listed reports where responder_id = me — citizens who sent
// a direct message to an unassigned responder were invisible. This version merges
// three sources into one deduplicated contact list and tracks presence + unread.

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../js/supabase";
import ChatBox from "../../components/Chatbox";
import { useWebRTC } from "../../hooks/useWebRTC";
import CallOverlay from "../../components/CallOverlay";
import { FaPhone, FaVideo, FaSearch } from "react-icons/fa";
import { isCitizenOnline, usePresence } from "../../hooks/usePresence";

interface Conversation {
  reportId: string | null;
  citizenId: string | null;
  citizenName: string;
  type: string;
  status: string;
  created_at: string;
  source: "assigned" | "messaged" | "online";
  isOnline: boolean;
  lastMessageAt?: string;
  unread?: number;
}

const TYPE_ICON: Record<string, string> = {
  fire: "🔥", accident: "🚗", flood: "🌊",
  crime: "🚨", medical: "🏥", other: "⚠️",
};

function useIsNarrow(breakpoint = 480) {
  const [narrow, setNarrow] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return narrow;
}

export default function ResponderCitizenChatDrawer({
  responderId, open, onClose,
  initialReportId = null, initialCitizenId = null, initialCitizenName = null,
}: {
  responderId: string; open: boolean; onClose: () => void;
  initialReportId?: string | null; initialCitizenId?: string | null; initialCitizenName?: string | null;
}) {
  const narrow = useIsNarrow();
  const { allCitizens, onlineCitizens } = usePresence();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeCitizenId, setActiveCitizenId] = useState<string | null>(null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [showThread, setShowThread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "online" | "assigned" | "requests">("all");
  const [search, setSearch] = useState("");
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

  // calling — responder ↔ selected citizen (centralized, incident_id handled per thread)
  const effectiveCitizenId = activeCitizenId ?? initialCitizenId;
  const effectiveReportId = activeReportId ?? initialReportId;
  const effectiveName = useMemo(() => {
    const c = conversations.find(x => x.citizenId === effectiveCitizenId);
    return c?.citizenName ?? initialCitizenName ?? "Citizen";
  }, [conversations, effectiveCitizenId, initialCitizenName]);
  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const {
    state: callState,
    startCall,
    endCall,
    toggleMute,
    toggleCamera,
    upgradeToVideo,
  } = useWebRTC(responderId || null, effectiveCitizenId ?? null);

  const handleStartAudio = async () => { if (!effectiveCitizenId) return; setCallType("audio"); setShowCallOverlay(true); await startCall("audio"); };
  const handleStartVideo = async () => { if (!effectiveCitizenId) return; setCallType("video"); setShowCallOverlay(true); await startCall("video"); };
  const handleEndCall = () => { endCall(); setShowCallOverlay(false); setCallType(null); };
  useEffect(() => {
    if (callState.callState === "ringing" || callState.callState === "active") { setShowCallOverlay(true); if (callState.callType) setCallType(callState.callType); }
    else if (callState.callState === "ended" || callState.callState === "declined") { const t = setTimeout(() => { setShowCallOverlay(false); setCallType(null); }, 1200); return () => clearTimeout(t); }
    else if (callState.callState === "idle" && showCallOverlay && !callState.localStream && !callState.remoteStream) { setShowCallOverlay(false); setCallType(null); }
  }, [callState.callState, callState.callType, callState.localStream, callState.remoteStream, showCallOverlay]);

  // ── Load centralized contact list ──────────────────────────────
  useEffect(() => {
    if (!open || !responderId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        // 1) Assigned reports (responder_id = me) — as before
        const { data: reports } = await supabase
          .from("reports")
          .select("id, type, status, created_at, reporter_name, user_id")
          .eq("responder_id", responderId)
          .order("created_at", { ascending: false })
          .limit(50);
        const rows = (reports ?? []) as Array<{ id: string; type: string; status: string; created_at: string; reporter_name: string | null; user_id: string | null }>;

        // 2) Recent inbound chat partners (distinct sender_ids who messaged me) — central queue
        // Robust to schema variance: receiver_id vs recipient_id, message vs content
        let messagedIds: string[] = [];
        let lastMsgMap: Record<string, string> = {};
        try {
          let msgs: Array<{ sender_id: string; created_at: string }> | null = null;
          // Try both column names in one query; if that fails, try each alone
          const tryBoth = await supabase
            .from("chat_messages")
            .select("sender_id, created_at, receiver_id, recipient_id")
            .or(`receiver_id.eq.${responderId},recipient_id.eq.${responderId}`)
            .order("created_at", { ascending: false })
            .limit(200);
          if (!tryBoth.error) msgs = tryBoth.data as any;
          else {
            const tryReceiver = await supabase.from("chat_messages").select("sender_id, created_at").eq("receiver_id", responderId).order("created_at", { ascending: false }).limit(200);
            if (!tryReceiver.error) msgs = tryReceiver.data as any;
            else {
              const tryRecipient = await supabase.from("chat_messages").select("sender_id, created_at").eq("recipient_id", responderId).order("created_at", { ascending: false }).limit(200);
              if (!tryRecipient.error) msgs = tryRecipient.data as any;
            }
          }
          for (const m of (msgs ?? [])) {
            const sid = (m as any).sender_id as string;
            if (!sid || sid === responderId) continue;
            if (!lastMsgMap[sid]) lastMsgMap[sid] = (m as any).created_at;
            if (!messagedIds.includes(sid)) messagedIds.push(sid);
          }
        } catch {}

        // 3) Collect unique citizenIds: assigned + messaged + online (centralized — only online citizens visible, not every citizen)
        const allIdsSet = new Set<string>();
        rows.forEach(r => { if (r.user_id) allIdsSet.add(String(r.user_id)); });
        messagedIds.forEach(id => allIdsSet.add(id));
        onlineCitizens.forEach(c => allIdsSet.add(c.id));
        const allIds = [...allIdsSet];

        let nameMap: Record<string, { name: string; isOnline: boolean; last_seen?: string | null; status?: string | null }> = {};
        if (allIds.length > 0) {
          try {
            const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, is_online, last_seen, status").in("id", allIds.slice(0, 200));
            for (const p of (profiles ?? []) as Array<{ id: string; full_name: string | null; email: string; is_online?: boolean | null; last_seen?: string | null; status?: string | null }>) {
              const online = isCitizenOnline({ id: p.id, full_name: p.full_name, email: p.email, role: "citizen", is_online: p.is_online, last_seen: p.last_seen, status: p.status });
              nameMap[p.id] = { name: p.full_name || p.email || "Citizen", isOnline: online, last_seen: p.last_seen, status: p.status };
            }
          } catch {}
        }

        // Build deduped map by citizenId
        const citizenEntry: Record<string, Conversation> = {};
        // assigned first
        for (const r of rows) {
          const uid = r.user_id ? String(r.user_id) : null;
          if (!uid) continue;
          if (!citizenEntry[uid] || new Date(r.created_at) > new Date(citizenEntry[uid].created_at)) {
            citizenEntry[uid] = {
              reportId: String(r.id),
              citizenId: uid,
              citizenName: nameMap[uid]?.name || r.reporter_name || "Citizen",
              type: r.type,
              status: r.status,
              created_at: r.created_at,
              source: "assigned",
              isOnline: nameMap[uid]?.isOnline ?? false,
              lastMessageAt: lastMsgMap[uid],
            };
          }
        }
        // messaged adds / upgrades
        for (const sid of messagedIds) {
          if (citizenEntry[sid]) {
            citizenEntry[sid].lastMessageAt = lastMsgMap[sid];
            if (citizenEntry[sid].source !== "assigned") citizenEntry[sid].source = "messaged";
            continue;
          }
          citizenEntry[sid] = {
            reportId: null,
            citizenId: sid,
            citizenName: nameMap[sid]?.name || "Citizen",
            type: "other",
            status: "request",
            created_at: lastMsgMap[sid] ?? new Date().toISOString(),
            source: "messaged",
            isOnline: nameMap[sid]?.isOnline ?? false,
            lastMessageAt: lastMsgMap[sid],
          };
        }
        // online citizens not yet in map (only online, not every citizen)
        for (const c of onlineCitizens) {
          if (citizenEntry[c.id]) continue;
          const nm = nameMap[c.id]?.name || c.full_name || c.email || "Citizen";
          citizenEntry[c.id] = {
            reportId: null,
            citizenId: c.id,
            citizenName: nm,
            type: "other",
            status: "online",
            created_at: new Date().toISOString(),
            source: "online",
            isOnline: true,
          };
        }

        let list = Object.values(citizenEntry);
        // Sort: online first, then assigned, then by lastMessage/created
        list.sort((a, b) => {
          if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
          if (a.source === "assigned" && b.source !== "assigned") return -1;
          if (b.source === "assigned" && a.source !== "assigned") return 1;
          const ta = a.lastMessageAt ?? a.created_at;
          const tb = b.lastMessageAt ?? b.created_at;
          return new Date(tb).getTime() - new Date(ta).getTime();
        });

        if (cancelled) return;
        setConversations(list);

        // unread counts per citizen from chat_messages where sender = citizen, receiver = me, is_read=false
        try {
          let unreadRows: Array<{ sender_id: string }> | null = null;
          const tryBothUnread = await supabase.from("chat_messages").select("sender_id").or(`receiver_id.eq.${responderId},recipient_id.eq.${responderId}`).eq("is_read", false).limit(500);
          if (!tryBothUnread.error) unreadRows = tryBothUnread.data as any;
          else {
            const tryR = await supabase.from("chat_messages").select("sender_id").eq("receiver_id", responderId).eq("is_read", false).limit(500);
            if (!tryR.error) unreadRows = tryR.data as any;
            else {
              const tryRc = await supabase.from("chat_messages").select("sender_id").eq("recipient_id", responderId).eq("is_read", false).limit(500);
              if (!tryRc.error) unreadRows = tryRc.data as any;
            }
          }
          const um: Record<string, number> = {};
          for (const r of (unreadRows ?? [])) {
            if (r.sender_id && r.sender_id !== responderId) um[r.sender_id] = (um[r.sender_id] ?? 0) + 1;
          }
          setUnreadMap(um);
          setConversations(prev => prev.map(c => ({ ...c, unread: c.citizenId ? (um[c.citizenId] ?? 0) : 0 })));
        } catch {}

        // Preselect logic
        const targetCitizen = initialCitizenId ?? (initialReportId ? list.find(x => x.reportId === initialReportId)?.citizenId ?? null : null);
        if (targetCitizen && list.some(x => x.citizenId === targetCitizen)) {
          setActiveCitizenId(targetCitizen);
          setActiveReportId(list.find(x => x.citizenId === targetCitizen)?.reportId ?? initialReportId);
        } else if (list.length && !activeCitizenId) {
          setActiveCitizenId(list[0].citizenId);
          setActiveReportId(list[0].reportId);
        }
        if (narrow) setShowThread(false);
      } catch {
        if (!cancelled) setConversations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    // live updates: refresh on new chat_messages and profile changes
    const ch = supabase
      .channel(`resp-citizen-central-${responderId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => void load())
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => void load())
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [open, responderId, initialReportId, initialCitizenId, allCitizens]);

  useEffect(() => {
    if (open && initialCitizenId) { setActiveCitizenId(initialCitizenId); setActiveReportId(initialReportId); }
    if (open && initialCitizenId && narrow) setShowThread(true);
    if (open && initialReportId && !initialCitizenId) {
      const hit = conversations.find(c => c.reportId === initialReportId);
      if (hit?.citizenId) setActiveCitizenId(hit.citizenId);
    }
  }, [open, initialCitizenId, initialReportId, narrow, conversations]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // ✅ ALL hooks first — must be before any early return (Rules of Hooks)
  const filtered = useMemo(() => {
    let list = conversations;
    if (filter === "online") list = list.filter(c => c.isOnline);
    else if (filter === "assigned") list = list.filter(c => c.source === "assigned");
    else if (filter === "requests") list = list.filter(c => c.source === "messaged" && c.status === "request");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.citizenName.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
    }
    return list;
  }, [conversations, filter, search]);

  // ✅ early return only after every hook
  if (!open) return null;

  const active = conversations.find(c => c.citizenId === activeCitizenId) ?? null;
  const citizenId = active?.citizenId ?? initialCitizenId;
  const citizenName = active?.citizenName ?? initialCitizenName ?? "Citizen";
  const incidentId = active?.reportId ?? initialReportId ?? null;

  const totalUnread = Object.values(unreadMap).reduce((a, b) => a + b, 0);
  const onlineCount = onlineCitizens.length;

  // Mark red badge as cleared once conversation is opened/read
  const markDrawerRead = async (otherId: string | null) => {
    if (!otherId || !responderId) return;
    try {
      await supabase.from("chat_messages").update({ is_read: true } as any).eq("receiver_id", responderId).eq("sender_id", otherId).eq("is_read", false);
    } catch {}
    try { await supabase.from("chat_messages").update({ is_read: true } as any).eq("recipient_id" as any, responderId).eq("sender_id", otherId).eq("is_read", false); } catch {}
    setUnreadMap(prev => ({ ...prev, [otherId]: 0 }));
    setConversations(prev => prev.map(c => c.citizenId === otherId ? { ...c, unread: 0 } : c));
  };

  // Auto-clear badge when active thread changes or while drawer stays open
  useEffect(() => {
    if (open && activeCitizenId) void markDrawerRead(activeCitizenId);
  }, [open, activeCitizenId]);

  const handleSelect = (c: Conversation) => {
    setActiveCitizenId(c.citizenId);
    setActiveReportId(c.reportId);
    if (narrow) setShowThread(true);
    void markDrawerRead(c.citizenId);
  };

  return (
    <>
      <style>{`@keyframes respCitizenSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes respCitizenFade { from { opacity: 0; } to { opacity: 1; } }
.resp-citizen-thread-flex > div { flex: 1 !important; height: 100% !important; min-height: 0 !important; max-height: 100% !important; }`}</style>
      <div onClick={onClose} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 940, background: "rgba(0,0,0,0.5)", animation: "respCitizenFade 0.25s ease" }} />
      <aside aria-label="Citizen chat" style={{
        position: "fixed", top: 0, right: 0, height: "100vh", zIndex: 950,
        width: narrow ? "100vw" : "min(720px, 94vw)", maxWidth: narrow ? "100vw" : 720,
        background: "rgba(13,17,23,0.98)", borderLeft: "1px solid rgba(255,255,255,0.1)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "-12px 0 48px rgba(0,0,0,0.6)",
        animation: "respCitizenSlideIn 0.28s ease",
        fontFamily: "'Inter', sans-serif", color: "#eef0f7",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          {narrow && showThread && (
            <button onClick={() => setShowThread(false)} aria-label="Back to conversations" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#eef0f7", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>◀</button>
          )}
          <span style={{ fontSize: 18 }}>💬</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>{narrow && showThread ? (citizenName || "Citizen") : "Citizen Chat (Centralized)"}</div>
            <div style={{ fontSize: 10, color: "rgba(238,240,247,0.4)" }}>
              {loading ? "Loading…" : `${onlineCount} online citizens • ${totalUnread > 0 ? `${totalUnread} unread` : "Central queue"}`}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close citizen chat" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#eef0f7", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, flexShrink: 0 }}>✕</button>
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", gap: 6, padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "center", flexWrap: "wrap", flexShrink: 0 }}>
          {(["all", "online", "assigned", "requests"] as const).map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} style={{
              padding: "6px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: filter === tab ? "rgba(46,204,143,0.16)" : "rgba(255,255,255,0.05)",
              color: filter === tab ? "#2ECC8F" : "rgba(238,240,247,0.55)",
              border: `1px solid ${filter === tab ? "rgba(46,204,143,0.35)" : "rgba(255,255,255,0.08)"}`,
              textTransform: "capitalize",
            }}>
              {tab === "all" ? `All (${conversations.length})` : tab === "online" ? `Online (${onlineCount})` : tab === "assigned" ? `Assigned (${conversations.filter(c => c.source === "assigned").length})` : `Requests (${conversations.filter(c => c.source === "messaged").length})`}
            </button>
          ))}
          <span style={{ flex: 1 }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <FaSearch size={10} style={{ position: "absolute", left: 8, color: "rgba(238,240,247,0.35)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search citizen" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 8px 6px 24px", fontSize: 11, color: "#eef0f7", outline: "none", width: 130 }} />
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", minHeight: 0, minWidth: 0, overflow: "hidden" }}>
          <div style={{
            width: narrow ? (showThread ? 0 : "100%") : 240,
            minWidth: narrow ? (showThread ? 0 : "100%") : 240,
            borderRight: narrow ? "none" : "1px solid rgba(255,255,255,0.08)",
            overflowY: "auto", flexShrink: 0,
            display: narrow ? (showThread ? "none" : "flex") : "flex",
            flexDirection: "column", minHeight: 0,
          }}>
            {loading ? (
              <div style={{ padding: 16, fontSize: 11, color: "rgba(238,240,247,0.35)" }}>Loading…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 16, fontSize: 11, color: "rgba(238,240,247,0.35)", textAlign: "center" }}>
                {filter === "requests" ? "No new requests — citizens appear here when they message you directly." : filter === "online" ? "No online citizens at the moment." : "No citizens found."}
              </div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.citizenId}
                  onClick={() => handleSelect(c)}
                  style={{
                    display: "flex", width: "100%", textAlign: "left", cursor: "pointer",
                    padding: "10px 12px", gap: 10, alignItems: "center",
                    background: c.citizenId === activeCitizenId ? "rgba(46,204,143,0.10)" : "transparent",
                    border: "none", borderLeft: c.citizenId === activeCitizenId ? "2px solid #2ECC8F" : "2px solid transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "inherit",
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: c.isOnline ? "#2ECC8F" : "rgba(238,240,247,0.18)", boxShadow: c.isOnline ? "0 0 6px #2ECC8F" : "none" }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#eef0f7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {TYPE_ICON[c.type] ?? "👤"} {c.citizenName}
                      {c.source === "assigned" && <span style={{ marginLeft: 6, fontSize: 9, color: "#2ECC8F", border: "1px solid rgba(46,204,143,0.3)", borderRadius: 4, padding: "1px 4px" }}>ASSIGNED</span>}
                    </span>
                    <span style={{ display: "block", fontSize: 9, color: "rgba(238,240,247,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                      {c.isOnline ? "● Online" : "○ Offline"} · {c.type} · {c.status}
                    </span>
                  </span>
                  {(c.unread ?? 0) > 0 && (
                    <span style={{ minWidth: 18, height: 18, borderRadius: 9, background: "#EF5B5B", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{c.unread! > 99 ? "99+" : c.unread}</span>
                  )}
                </button>
              ))
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0, display: narrow ? (showThread ? "flex" : "none") : "flex", flexDirection: "column", padding: 12, overflow: "hidden", minHeight: 0 }}>
            {!citizenId ? (
              <div style={{ margin: "auto", fontSize: 12, color: "rgba(238,240,247,0.35)", textAlign: "center", padding: 24 }}>
                Select a citizen to start messaging. Centralized queue: any online citizen can message any on-duty responder.
              </div>
            ) : (
              <>
                {/* Thread header with call buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 8, background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{citizenName}</span>
                  <button onClick={handleStartAudio} title="Audio call" style={{ background: "rgba(46,204,143,0.12)", border: "1px solid rgba(46,204,143,0.3)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#2ECC8F", display: "flex", alignItems: "center" }}><FaPhone size={12} /></button>
                  <button onClick={handleStartVideo} title="Video call" style={{ background: "rgba(46,204,143,0.12)", border: "1px solid rgba(46,204,143,0.3)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#2ECC8F", display: "flex", alignItems: "center" }}><FaVideo size={12} /></button>
                </div>
                {active?.source === "messaged" && (
                  <div style={{ marginBottom: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.2)", fontSize: 11, color: "rgba(238,240,247,0.7)" }}>
                    New request — citizen sent a direct message. Respond to assist or claim their report.
                  </div>
                )}
                <div className="resp-citizen-thread-flex" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
                  <ChatBox assignedResponderId={citizenId} incidentId={incidentId} userRole="responder" recipientName={citizenName} />
                </div>
              </>
            )}
          </div>
        </div>

        {showCallOverlay && callType && (
          <CallOverlay state={callState} callType={callType} remoteName={effectiveName} onMute={toggleMute} onCamera={toggleCamera} onUpgrade={upgradeToVideo} onEnd={handleEndCall} isOnline={true} />
        )}
      </aside>
    </>
  );
}
