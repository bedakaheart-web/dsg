// src/responder/components/ResponderCitizenChatDrawer.tsx
//
// Slide-over drawer: responder ↔ assigned citizens via `chat_messages` +
// the `chat-images` storage bucket (same ChatBox as citizen side).
//
// Conversation list = reports claimed by this responder (responder_id = me),
// citizen identity resolved from reports.user_id → profiles.full_name
// (falling back to reports.reporter_name). Citizens stay blocked from
// contacting admins — this drawer only ever addresses citizens.

import { useEffect, useState } from "react";
import { supabase } from "../../js/supabase";
import ChatBox from "../../components/Chatbox";

interface Conversation {
  reportId: string;
  citizenId: string | null;
  citizenName: string;
  type: string;
  status: string;
  created_at: string;
}

const TYPE_ICON: Record<string, string> = {
  fire: "🔥", accident: "🚗", flood: "🌊",
  crime: "🚨", medical: "🏥", other: "⚠️",
};

function useIsNarrow(breakpoint = 720) {
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [showThread, setShowThread] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Load assigned conversations ──────────────────────────────
  useEffect(() => {
    if (!open || !responderId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { data: reports } = await supabase
          .from("reports")
          .select("id, type, status, created_at, reporter_name, user_id")
          .eq("responder_id", responderId)
          .order("created_at", { ascending: false })
          .limit(50);
        const rows = (reports ?? []) as Array<{
          id: string; type: string; status: string; created_at: string;
          reporter_name: string | null; user_id: string | null;
        }>;
        const citizenIds = [...new Set(rows.map(r => r.user_id).filter(Boolean))] as string[];
        let nameMap: Record<string, string> = {};
        if (citizenIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", citizenIds);
          for (const p of (profiles ?? []) as Array<{ id: string; full_name: string | null }>) {
            if (p.full_name) nameMap[p.id] = p.full_name;
          }
        }
        if (cancelled) return;
        setConversations(rows.map(r => ({
          reportId: String(r.id),
          citizenId: r.user_id ? String(r.user_id) : null,
          citizenName: (r.user_id && nameMap[String(r.user_id)]) || r.reporter_name || "Citizen",
          type: r.type,
          status: r.status,
          created_at: r.created_at,
        })));
        // Preselect: deep-linked incident first, else most recent.
        setActiveReportId(prev => {
          if (initialReportId && rows.some(r => String(r.id) === initialReportId)) return initialReportId;
          if (prev && rows.some(r => String(r.id) === prev)) return prev;
          return rows.length ? String(rows[0].id) : null;
        });
        // On narrow, start on conversation list
        if (narrow) setShowThread(false);
      } catch {
        if (!cancelled) setConversations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [open, responderId, initialReportId, narrow]);

  // Deep-link a specific incident (e.g. "Chat Citizen" card button).
  useEffect(() => {
    if (open && initialReportId) setActiveReportId(initialReportId);
    if (open && initialReportId && narrow) setShowThread(true);
  }, [open, initialReportId, narrow]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const active = conversations.find(c => c.reportId === activeReportId) ?? null;
  // Deep-link fallback when the report isn't in the list (e.g. just claimed).
  const citizenId = active?.citizenId ?? initialCitizenId;
  const citizenName = active?.citizenName ?? initialCitizenName ?? "Citizen";
  const incidentId = active?.reportId ?? initialReportId;

  const handleSelectConversation = (c: Conversation) => {
    setActiveReportId(c.reportId);
    if (narrow) setShowThread(true);
  };

  return (
    <>
      <style>{`@keyframes respCitizenSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes respCitizenFade { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 940, background: "rgba(0,0,0,0.5)", animation: "respCitizenFade 0.25s ease" }}
      />
      <aside
        aria-label="Citizen chat"
        style={{
          position: "fixed", top: 0, right: 0, height: "100vh", zIndex: 950,
          width: narrow ? "100vw" : "min(720px, 94vw)", maxWidth: narrow ? "100vw" : 720,
          background: "rgba(13,17,23,0.98)", borderLeft: "1px solid rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "-12px 0 48px rgba(0,0,0,0.6)",
          animation: "respCitizenSlideIn 0.28s ease",
          fontFamily: "'Inter', sans-serif", color: "#eef0f7",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          {narrow && showThread && (
            <button onClick={() => setShowThread(false)} aria-label="Back to conversations" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#eef0f7", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              ◀
            </button>
          )}
          <span style={{ fontSize: 18 }}>💬</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>
              {narrow && showThread ? (citizenName || "Citizen") : "Citizen Chat"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(238,240,247,0.4)" }}>
              {active ? `${TYPE_ICON[active.type] ?? "⚠️"} ${active.type} · ${active.status}` : "Assigned citizens"}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close citizen chat"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#eef0f7", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, flexShrink: 0 }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* Conversation list */}
          <div style={{
            width: narrow ? (showThread ? 0 : "100%") : 220,
            minWidth: narrow ? (showThread ? 0 : "100%") : 220,
            borderRight: narrow ? "none" : "1px solid rgba(255,255,255,0.08)",
            overflowY: "auto", flexShrink: 0,
            display: narrow ? (showThread ? "none" : "flex") : "flex",
            flexDirection: "column",
          }}>
            {loading ? (
              <div style={{ padding: 16, fontSize: 11, color: "rgba(238,240,247,0.35)" }}>Loading…</div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: 16, fontSize: 11, color: "rgba(238,240,247,0.35)" }}>
                No assigned incidents yet. Claim a report to start chatting with its citizen.
              </div>
            ) : (
              conversations.map(c => (
                <button
                  key={c.reportId}
                  onClick={() => handleSelectConversation(c)}
                  style={{
                    display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                    padding: "10px 12px", background: c.reportId === activeReportId ? "rgba(46,204,143,0.10)" : "transparent",
                    border: "none", borderLeft: c.reportId === activeReportId ? "2px solid #2ECC8F" : "2px solid transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#eef0f7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {TYPE_ICON[c.type] ?? "⚠️"} {c.citizenName}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(238,240,247,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                    {c.type} · {c.status}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Thread — on narrow, full-width when showThread is true */}
          <div style={{
            flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
            padding: narrow ? 12 : 12,
          }}>
            {!active && !initialReportId && !showThread ? (
              <div style={{ margin: "auto", fontSize: 12, color: "rgba(238,240,247,0.35)", textAlign: "center", padding: 24 }}>
                Select a conversation to start messaging.
              </div>
            ) : !citizenId ? (
              <div style={{ margin: "auto", fontSize: 12, color: "rgba(238,240,247,0.5)", textAlign: "center", padding: 24 }}>
                This report has no linked citizen account (anonymous report) — chat is unavailable.
              </div>
            ) : (
              <ChatBox
                assignedResponderId={citizenId}
                incidentId={incidentId}
                userRole="responder"
                recipientName={citizenName}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
