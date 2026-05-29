import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../js/supabase";
import {
  FaHistory,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaExclamationTriangle,
  FaSync,
  FaDownload,
  FaImage,
  FaVideo,
  FaExternalLinkAlt,
  FaPhone,
  FaTag,
  FaClipboardCheck,
} from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HistoryReport {
  id: string | number;
  type: string;
  description: string | null;
  location: string | null;
  address: string | null;
  reporter_name: string | null;
  reporter_contact: string | null;
  status: string;
  evidence_url: string | null;
  created_at: string;
  responder_id: string | null;
  responder_name?: string | null;
  responder_notes: string | null;
  action_notes: string | null;
  action_tags: string[] | null;
  resolution_type: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
}

type StatusFilter = "all" | "resolved" | "in-progress" | "pending";
type TypeFilter   = "all" | "fire" | "flood" | "medical" | "crime" | "accident" | "other";
type SortField    = "created_at" | "type" | "status";
type SortDir      = "desc" | "asc";
type MonthFilter  = "all" | string; // "2026-05", "2026-04", etc.

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; color: string }> = {
  fire:     { icon: "🔥", color: "#FF3B30" },
  accident: { icon: "🚗", color: "#FF9500" },
  flood:    { icon: "🌊", color: "#0066FF" },
  crime:    { icon: "🚨", color: "#FF2D55" },
  medical:  { icon: "🏥", color: "#00B074" },
  other:    { icon: "⚠️", color: "#9CA3AF" },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:       { label: "PENDING",     color: "#FF3B30", bg: "rgba(255,59,48,.10)",   border: "rgba(255,59,48,.28)"  },
  "in-progress": { label: "IN PROGRESS", color: "#FF9500", bg: "rgba(255,149,0,.10)",   border: "rgba(255,149,0,.28)"  },
  resolved:      { label: "RESOLVED",    color: "#00B074", bg: "rgba(0,176,116,.10)",   border: "rgba(0,176,116,.28)"  },
};

const RESOLUTION_META: Record<string, { label: string; icon: string; color: string }> = {
  "fully_resolved":    { label: "Fully Resolved",             icon: "✓",  color: "#00B074" },
  "fully-resolved":    { label: "Fully Resolved",             icon: "✓",  color: "#00B074" },
  "referred":          { label: "Forwarded to Department",    icon: "↗",  color: "#0066FF" },
  "follow_up_needed":  { label: "Needs Follow-Up",            icon: "⟳",  color: "#FF9500" },
  "follow-up":         { label: "Needs Follow-Up",            icon: "⟳",  color: "#FF9500" },
};

const ALL_TYPES: TypeFilter[]    = ["all","fire","flood","medical","crime","accident","other"];
const ALL_STATUS: StatusFilter[] = ["all","resolved","in-progress","pending"];

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLE = `
.hl-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text, #eef0f7);
  --hl-bg:       #0d1117;
  --hl-surface:  rgba(15,21,33,0.82);
  --hl-border:   rgba(255,255,255,0.07);
  --hl-primary:  #0066FF;
  --hl-success:  #00B074;
  --hl-warning:  #FF9500;
  --hl-danger:   #FF3B30;
  --hl-text:     #eef0f7;
  --hl-text-sec: rgba(238,240,247,0.55);
  --hl-text-ter: rgba(238,240,247,0.28);
}

.hl-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
}
.hl-eyebrow {
  font-size: 11px; color: var(--hl-primary); letter-spacing: 0.5px;
  text-transform: uppercase; margin-bottom: 6px; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
}
.hl-eyebrow::before { content: ''; display: block; width: 20px; height: 2px; background: var(--hl-primary); }
.hl-title { font-size: 32px; color: var(--hl-text); letter-spacing: -0.5px; line-height: 1.1; font-weight: 700; }
.hl-subtitle { font-size: 11px; color: var(--hl-text-ter); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.3px; }
.hl-header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.hl-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 16px; }
.hl-search-wrap { flex: 1; min-width: 200px; position: relative; }
.hl-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--hl-text-ter); font-size: 12px; pointer-events: none; }
.hl-search {
  width: 100%; padding: 9px 12px 9px 32px;
  background: var(--hl-surface); border: 1px solid var(--hl-border); border-radius: 8px;
  color: var(--hl-text); font-size: 13px; outline: none; transition: border-color 0.2s; font-family: inherit;
}
.hl-search::placeholder { color: var(--hl-text-ter); }
.hl-search:focus { border-color: var(--hl-primary); }

.hl-filter-group { display: flex; gap: 6px; flex-wrap: wrap; }
.hl-filter-btn {
  padding: 7px 12px; border-radius: 6px; border: 1px solid var(--hl-border);
  background: var(--hl-surface); color: var(--hl-text-sec); font-size: 11px;
  font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  text-transform: uppercase; letter-spacing: 0.3px; font-family: inherit;
}
.hl-filter-btn:hover { border-color: var(--hl-text-sec); color: var(--hl-text); }
.hl-filter-btn.active {
  background: var(--hl-primary); border-color: var(--hl-primary);
  color: #fff; box-shadow: 0 2px 8px rgba(0,102,255,0.25);
}

.hl-icon-btn {
  width: 34px; height: 34px; border-radius: 7px; border: 1px solid var(--hl-border);
  background: var(--hl-surface); color: var(--hl-text-sec); display: flex;
  align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 13px;
}
.hl-icon-btn:hover { background: var(--hl-bg); color: var(--hl-text); border-color: var(--hl-text-sec); }
.hl-icon-btn.spinning svg { animation: hl-spin 0.7s linear infinite; }

@keyframes hl-spin    { to { transform: rotate(360deg); } }
@keyframes hl-fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes hl-pulse   { 0%,100% { opacity:1; } 50%{ opacity:0.4; } }

.hl-stat-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
.hl-mini-stat {
  background: var(--hl-surface); border: 1px solid var(--hl-border); border-radius: 8px;
  padding: 10px 16px; display: flex; align-items: center; gap: 10px; flex: 1; min-width: 120px;
}
.hl-mini-stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.hl-mini-stat-num { font-size: 20px; font-weight: 700; color: var(--hl-text); line-height: 1; }
.hl-mini-stat-label { font-size: 10px; color: var(--hl-text-ter); text-transform: uppercase; letter-spacing: 0.3px; margin-top: 2px; }

.hl-sort-bar {
  display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
  font-size: 11px; color: var(--hl-text-ter); text-transform: uppercase; letter-spacing: 0.3px;
}
.hl-sort-btn {
  display: flex; align-items: center; gap: 4px; padding: 4px 8px;
  border-radius: 5px; border: 1px solid transparent; background: transparent;
  color: var(--hl-text-ter); font-size: 11px; font-weight: 600; cursor: pointer;
  transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.3px; font-family: inherit;
}
.hl-sort-btn:hover { background: var(--hl-surface); border-color: var(--hl-border); color: var(--hl-text-sec); }
.hl-sort-btn.active { color: var(--hl-primary); }

.hl-table-wrap {
  background: var(--hl-surface); border: 1px solid var(--hl-border); border-radius: 12px; overflow: hidden;
}
.hl-table { width: 100%; border-collapse: collapse; }
.hl-table th {
  padding: 11px 14px; text-align: left; font-size: 10px; font-weight: 600;
  color: var(--hl-text-ter); text-transform: uppercase; letter-spacing: 0.5px;
  background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--hl-border); white-space: nowrap;
}
.hl-table td {
  padding: 12px 14px; border-bottom: 1px solid var(--hl-border);
  vertical-align: middle; font-size: 13px; color: var(--hl-text);
}
.hl-table tr:last-child td { border-bottom: none; }
.hl-table tbody tr { transition: background 0.15s; cursor: pointer; animation: hl-fadeIn 0.3s ease-out both; }
.hl-table tbody tr:hover { background: rgba(0,102,255,0.04); }
.hl-table tbody tr.expanded { background: rgba(0,102,255,0.06); }

.hl-type-cell { display: flex; align-items: center; gap: 7px; }
.hl-type-icon-wrap {
  width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center;
  justify-content: center; font-size: 13px; flex-shrink: 0;
  background: rgba(255,255,255,0.04); border: 1px solid var(--hl-border);
}
.hl-type-name { font-weight: 600; text-transform: capitalize; }

.hl-status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.3px;
  padding: 3px 9px; border-radius: 5px; white-space: nowrap; text-transform: uppercase;
}
.hl-status-dot { width: 5px; height: 5px; border-radius: 50%; animation: hl-pulse 2s ease infinite; }

/* ── Expanded row ── */
.hl-expand-row td { padding: 0; border-bottom: 1px solid var(--hl-border); }
.hl-expand-inner {
  padding: 16px 20px; background: rgba(0,0,0,0.25);
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px; animation: hl-fadeIn 0.2s ease-out both;
}
.hl-expand-field {
  display: flex; flex-direction: column; gap: 3px;
  padding: 10px 12px; background: var(--hl-surface); border: 1px solid var(--hl-border);
  border-radius: 8px; min-width: 0;
}
.hl-expand-field-label {
  font-size: 9px; color: var(--hl-text-ter); letter-spacing: 0.15em; text-transform: uppercase;
  display: flex; align-items: center; gap: 4px;
}
.hl-expand-field-val {
  font-size: 13px; color: var(--hl-text); line-height: 1.5;
  overflow-wrap: break-word; word-break: break-word;
}
.hl-expand-desc {
  grid-column: 1 / -1; padding: 10px 12px; background: var(--hl-surface);
  border: 1px solid var(--hl-border); border-radius: 8px;
  font-size: 13px; color: var(--hl-text-sec); line-height: 1.6; overflow-wrap: break-word;
}

/* ── Resolution box ── */
.hl-resolution-box {
  grid-column: 1 / -1; border-radius: 9px; overflow: hidden;
  border: 1px solid var(--hl-success); background: rgba(0,176,116,0.05);
}
.hl-resolution-hd {
  display: flex; align-items: center; gap: 8px; padding: 9px 14px;
  background: rgba(0,176,116,0.08); border-bottom: 1px solid rgba(0,176,116,0.15);
}
.hl-resolution-hd-label { font-size: 10px; font-weight: 700; color: var(--hl-success); text-transform: uppercase; letter-spacing: 0.3px; flex: 1; }
.hl-resolution-type-tag {
  font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 5px;
  background: var(--hl-success); color: #fff; text-transform: uppercase; white-space: nowrap;
}
.hl-resolution-body { padding: 12px 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.hl-resolution-section { display: flex; flex-direction: column; gap: 4px; }
.hl-resolution-section-lbl { font-size: 9px; font-weight: 700; color: var(--hl-success); text-transform: uppercase; letter-spacing: 0.3px; }
.hl-resolution-section-val { font-size: 12px; color: var(--hl-text); line-height: 1.5; overflow-wrap: break-word; }
.hl-resolution-footer { font-size: 10px; color: var(--hl-success); font-weight: 600; padding: 4px 14px 10px; }

/* ── Action tags ── */
.hl-tags-wrap { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
.hl-tag {
  font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 600;
  background: rgba(0,102,255,0.08); color: var(--hl-primary);
  border: 1px solid rgba(0,102,255,0.2);
}

/* ── Evidence ── */
.hl-expand-evidence {
  grid-column: 1 / -1; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.hl-evidence-thumb { max-width: 100px; max-height: 65px; border-radius: 6px; object-fit: cover; border: 1px solid var(--hl-border); }
.hl-evidence-link {
  display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px;
  background: rgba(0,102,255,0.06); border: 1px solid rgba(0,102,255,0.18);
  border-radius: 7px; text-decoration: none; color: var(--hl-primary);
  font-size: 12px; font-weight: 500; transition: background 0.15s;
}
.hl-evidence-link:hover { background: rgba(0,102,255,0.12); }

/* ── Pagination ── */
.hl-pagination {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-top: 1px solid var(--hl-border); flex-wrap: wrap; gap: 10px;
}
.hl-pagination-info { font-size: 11px; color: var(--hl-text-ter); }
.hl-pagination-btns { display: flex; gap: 5px; }
.hl-page-btn {
  width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--hl-border);
  background: var(--hl-surface); color: var(--hl-text-sec); font-size: 12px;
  font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit;
  display: flex; align-items: center; justify-content: center;
}
.hl-page-btn:hover:not(:disabled) { background: var(--hl-bg); border-color: var(--hl-text-sec); color: var(--hl-text); }
.hl-page-btn.active { background: var(--hl-primary); border-color: var(--hl-primary); color: #fff; }
.hl-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.hl-spinner {
  display: inline-block; width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid var(--hl-border); border-top-color: var(--hl-primary);
  animation: hl-spin 0.8s linear infinite;
}
.hl-empty { text-align: center; padding: 56px 24px; font-size: 12px; color: var(--hl-text-ter); text-transform: uppercase; letter-spacing: 0.5px; }
.hl-empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.3; }

.hl-month-select {
  padding: 7px 28px 7px 10px; border-radius: 6px; border: 1px solid var(--hl-border);
  background: var(--hl-surface); color: var(--hl-text-sec); font-size: 11px;
  font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 0.3px;
  font-family: inherit; outline: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(238,240,247,0.28)'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 8px center;
  transition: border-color 0.2s;
}
.hl-month-select:focus, .hl-month-select:hover { border-color: var(--hl-primary); color: var(--hl-text); }
.hl-month-select.active { border-color: var(--hl-primary); color: var(--hl-primary); }

/* Month group header row */
.hl-month-header td {
  padding: 8px 14px 6px; background: rgba(0,102,255,0.04);
  border-bottom: 1px solid var(--hl-border); border-top: 1px solid var(--hl-border);
  font-size: 10px; font-weight: 700; color: var(--hl-primary);
  text-transform: uppercase; letter-spacing: 0.5px; cursor: default;
}
.hl-month-header:hover { background: transparent !important; }
.hl-month-count {
  display: inline-flex; align-items: center; justify-content: center;
  background: rgba(0,102,255,0.12); color: var(--hl-primary);
  font-size: 9px; font-weight: 700; padding: 1px 7px; border-radius: 4px;
  margin-left: 8px; border: 1px solid rgba(0,102,255,0.2);
}

@media (max-width: 768px) {
  .hl-title { font-size: 24px; }
  .hl-table th:nth-child(3), .hl-table td:nth-child(3),
  .hl-table th:nth-child(5), .hl-table td:nth-child(5) { display: none; }
  .hl-expand-inner { grid-template-columns: 1fr; }
  .hl-resolution-body { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .hl-table th:nth-child(4), .hl-table td:nth-child(4) { display: none; }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
    + " " + d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

function formatRelative(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60)     return `${diff}s ago`;
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(ts);
}

function getMonthKey(ts: string): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
}

function isVideo(url: string) {
  return /\.(mp4|mov|avi|webm|mkv)(\?|#|$)/i.test(url);
}

function parseActionTags(raw: string[] | string | null): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  // handle postgres array string like '{"Still ongoing","Casualties"}'
  try {
    const cleaned = String(raw).replace(/^\{|\}$/g, "").split(",").map(s => s.trim().replace(/^"|"$/g, ""));
    return cleaned.filter(Boolean);
  } catch {
    return [];
  }
}

function exportCSV(data: HistoryReport[]) {
  const headers = ["ID","Type","Status","Reporter","Contact","Location","Description","Responder Notes","Action Notes","Resolution Type","Resolved At","Created","Responder"];
  const rows = data.map(r => [
    String(r.id).slice(0, 8),
    r.type,
    r.status,
    r.reporter_name ?? "Anonymous",
    r.reporter_contact ?? "",
    r.address || r.location || "",
    (r.description ?? "").replace(/,/g, ";"),
    (r.responder_notes ?? "").replace(/,/g, ";"),
    (r.action_notes ?? "").replace(/,/g, ";"),
    r.resolution_type ?? "",
    r.resolved_at ? formatDate(r.resolved_at) : "",
    formatDate(r.created_at),
    r.responder_name ?? r.responder_id ?? "",
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `dumasafeguide-history-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

const PAGE_SIZE = 15;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminHistoryLog() {
  const [reports, setReports]       = useState<HistoryReport[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState<StatusFilter>("all");
  const [typeFilter, setType]       = useState<TypeFilter>("all");
  const [sortField, setSortField]   = useState<SortField>("created_at");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");
  const [monthFilter, setMonthFilter] = useState<MonthFilter>("all");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [page, setPage]             = useState(1);

  // ── Load ─────────────────────────────────────────────────────────────────
  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);

    const { data } = await supabase
      .from("reports")
      .select(
        "id,type,description,location,address,reporter_name,reporter_contact," +
        "status,evidence_url,created_at,responder_id," +
        "responder_notes,action_notes,action_tags,resolution_type,resolved_by,resolved_at"
      )
      .order("created_at", { ascending: false });

    if (data) {
      // Batch-load responder names in a single query
      const responderIds = [...new Set(
        (data as HistoryReport[]).filter(r => r.responder_id).map(r => r.responder_id as string)
      )];
      const respMap: Record<string, string> = {};
      if (responderIds.length) {
        const { data: resps } = await supabase
          .from("responders")
          .select("id, name")
          .in("id", responderIds);
        (resps ?? []).forEach((r: { id: string; name: string | null }) => {
          if (r.name) respMap[r.id] = r.name;
        });
      }
      const enriched: HistoryReport[] = (data as HistoryReport[]).map(r => ({
        ...r,
        responder_name: respMap[r.responder_id ?? ""] ?? null,
      }));
      setReports(enriched);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("history-log-reports")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  // ── Derived months for the dropdown ──────────────────────────────────────
  const availableMonths = React.useMemo(() => {
    const keys = [...new Set(reports.map(r => getMonthKey(r.created_at)))];
    return keys.sort((a, b) => b.localeCompare(a)); // newest first
  }, [reports]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const filtered = reports
    .filter(r => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (typeFilter   !== "all" && r.type   !== typeFilter)   return false;
      if (monthFilter  !== "all" && getMonthKey(r.created_at) !== monthFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.type.includes(q) ||
          (r.description ?? "").toLowerCase().includes(q) ||
          (r.address ?? r.location ?? "").toLowerCase().includes(q) ||
          (r.reporter_name ?? "").toLowerCase().includes(q) ||
          (r.responder_notes ?? "").toLowerCase().includes(q) ||
          (r.action_notes ?? "").toLowerCase().includes(q) ||
          String(r.id).toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let va: string | number, vb: string | number;
      if (sortField === "created_at") { va = a.created_at; vb = b.created_at; }
      else if (sortField === "type")  { va = a.type;       vb = b.type;       }
      else                            { va = a.status;     vb = b.status;     }
      if (va < vb) return sortDir === "asc" ? -1 :  1;
      if (va > vb) return sortDir === "asc" ?  1 : -1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Build grouped rows: inject month-header sentinels when sorted by date
  type TableRow = { type: "header"; month: string; count: number } | { type: "data"; report: HistoryReport; idx: number };
  const groupedRows = React.useMemo((): TableRow[] => {
    if (sortField !== "created_at") {
      return paged.map((report, idx) => ({ type: "data", report, idx }));
    }
    const rows: TableRow[] = [];
    let lastMonth = "";
    paged.forEach((report, idx) => {
      const mk = getMonthKey(report.created_at);
      if (mk !== lastMonth) {
        const count = paged.filter(r => getMonthKey(r.created_at) === mk).length;
        rows.push({ type: "header", month: mk, count });
        lastMonth = mk;
      }
      rows.push({ type: "data", report, idx });
    });
    return rows;
  }, [paged, sortField]);

  const counts = {
    total:      reports.length,
    resolved:   reports.filter(r => r.status === "resolved").length,
    inProgress: reports.filter(r => r.status === "in-progress").length,
    pending:    reports.filter(r => r.status === "pending").length,
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === "desc" ? <FaChevronDown size={8} /> : <FaChevronUp size={8} />;
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLE}</style>
      <div className="hl-root">

        {/* Header */}
        <div className="hl-header">
          <div>
            <div className="hl-eyebrow"><FaHistory size={10} /> History Log</div>
            <div className="hl-title">Incident History</div>
            <div className="hl-subtitle">Complete audit trail · Dumaguete City Emergency HQ</div>
          </div>
          <div className="hl-header-actions">
            <button
              className={`hl-icon-btn${refreshing ? " spinning" : ""}`}
              onClick={() => load(true)} title="Refresh"
            >
              <FaSync />
            </button>
            <button className="hl-icon-btn" onClick={() => exportCSV(filtered)} title="Export CSV">
              <FaDownload />
            </button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="hl-stat-row">
          {[
            { label: "Total",       value: counts.total,      color: "#0066FF" },
            { label: "Resolved",    value: counts.resolved,   color: "#00B074" },
            { label: "In Progress", value: counts.inProgress, color: "#FF9500" },
            { label: "Pending",     value: counts.pending,    color: "#FF3B30" },
          ].map(s => (
            <div className="hl-mini-stat" key={s.label}>
              <span className="hl-mini-stat-dot" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}55` }} />
              <div>
                <div className="hl-mini-stat-num">{loading ? "—" : s.value}</div>
                <div className="hl-mini-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="hl-toolbar">
          <div className="hl-search-wrap">
            <FaSearch className="hl-search-icon" />
            <input
              className="hl-search"
              type="text"
              placeholder="Search by type, location, reporter, notes, ID…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="hl-filter-group">
            <span style={{ fontSize: 10, color: "var(--hl-text-ter)", alignSelf: "center", letterSpacing: "0.3px", textTransform: "uppercase" }}>
              <FaFilter size={9} style={{ marginRight: 4 }} />Status
            </span>
            {ALL_STATUS.map(s => (
              <button
                key={s}
                className={`hl-filter-btn${statusFilter === s ? " active" : ""}`}
                onClick={() => { setStatus(s); setPage(1); }}
              >
                {s === "all" ? "All" : s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="hl-filter-group">
            <span style={{ fontSize: 10, color: "var(--hl-text-ter)", alignSelf: "center", letterSpacing: "0.3px", textTransform: "uppercase" }}>Type</span>
            {ALL_TYPES.map(t => (
              <button
                key={t}
                className={`hl-filter-btn${typeFilter === t ? " active" : ""}`}
                onClick={() => { setType(t); setPage(1); }}
              >
                {t === "all" ? "All" : `${TYPE_META[t]?.icon ?? "⚠️"} ${t.charAt(0).toUpperCase() + t.slice(1)}`}
              </button>
            ))}
          </div>
        </div>

        {/* Sort bar */}
        <div className="hl-sort-bar">
          <span>Sort by:</span>
          {(["created_at","type","status"] as SortField[]).map(f => (
            <button
              key={f}
              className={`hl-sort-btn${sortField === f ? " active" : ""}`}
              onClick={() => handleSort(f)}
            >
              {f === "created_at" ? "Date" : f.charAt(0).toUpperCase() + f.slice(1)}
              <SortIcon field={f} />
            </button>
          ))}
          <span style={{ marginLeft: 12, fontSize: 10, color: "var(--hl-text-ter)", textTransform: "uppercase", letterSpacing: "0.3px" }}>
            Month:
          </span>
          <select
            className={`hl-month-select${monthFilter !== "all" ? " active" : ""}`}
            value={monthFilter}
            onChange={e => { setMonthFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Months</option>
            {availableMonths.map(mk => (
              <option key={mk} value={mk}>{formatMonthLabel(mk)}</option>
            ))}
          </select>
          <span style={{ marginLeft: "auto", fontSize: 11 }}>
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="hl-table-wrap">
          {loading ? (
            <div className="hl-empty"><div className="hl-spinner" style={{ margin: "0 auto" }} /></div>
          ) : paged.length === 0 ? (
            <div className="hl-empty">
              <div className="hl-empty-icon">🗂️</div>
              <div>No records found</div>
            </div>
          ) : (
            <table className="hl-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>
                    <button className={`hl-sort-btn${sortField === "status" ? " active" : ""}`} onClick={() => handleSort("status")}>
                      Status <SortIcon field="status" />
                    </button>
                  </th>
                  <th>Location</th>
                  <th>Reporter</th>
                  <th>
                    <button className={`hl-sort-btn${sortField === "created_at" ? " active" : ""}`} onClick={() => handleSort("created_at")}>
                      Reported <SortIcon field="created_at" />
                    </button>
                  </th>
                  <th>Responder</th>
                </tr>
              </thead>
              <tbody>
                {groupedRows.map((row, rowIdx) => {
                  if (row.type === "header") {
                    return (
                      <tr key={`month-${row.month}`} className="hl-month-header">
                        <td colSpan={100}>
                          📅 {formatMonthLabel(row.month)}
                          <span className="hl-month-count">{row.count}</span>
                        </td>
                      </tr>
                    );
                  }

                  const { report: r, idx } = row;
                  const tm    = TYPE_META[r.type]     ?? TYPE_META.other;
                  const sm    = STATUS_META[r.status] ?? STATUS_META.pending;
                  const isOpen = expandedId === r.id;
                  const resMeta = r.resolution_type ? RESOLUTION_META[r.resolution_type] : null;
                  const tags  = parseActionTags(r.action_tags);

                  return (
                    <React.Fragment key={r.id}>
                      <tr
                        className={isOpen ? "expanded" : ""}
                        onClick={() => setExpandedId(isOpen ? null : r.id)}
                        style={{ animationDelay: `${idx * 0.03}s` }}
                      >
                        {/* Type */}
                        <td>
                          <div className="hl-type-cell">
                            <div className="hl-type-icon-wrap">{tm.icon}</div>
                            <span className="hl-type-name" style={{ color: tm.color }}>
                              {r.type.replace(/_/g," ")}
                            </span>
                          </div>
                        </td>
                        {/* Status */}
                        <td>
                          <span className="hl-status-badge" style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}` }}>
                            <span className="hl-status-dot" style={{ background: sm.color }} />
                            {sm.label}
                          </span>
                        </td>
                        {/* Location */}
                        <td style={{ color: "var(--hl-text-sec)", fontSize: 12 }}>
                          {r.address || r.location || <span style={{ color: "var(--hl-text-ter)" }}>—</span>}
                        </td>
                        {/* Reporter */}
                        <td style={{ color: "var(--hl-text-sec)", fontSize: 12 }}>
                          {r.reporter_name || <span style={{ color: "var(--hl-text-ter)" }}>Anonymous</span>}
                        </td>
                        {/* Reported */}
                        <td style={{ color: "var(--hl-text-ter)", fontSize: 11, whiteSpace: "nowrap" }}>
                          {formatRelative(r.created_at)}
                        </td>
                        {/* Responder */}
                        <td style={{ color: "var(--hl-text-sec)", fontSize: 12 }}>
                          {r.responder_name || (r.responder_id
                            ? <span style={{ color: "var(--hl-text-ter)" }}>ID: {String(r.responder_id).slice(0,8)}</span>
                            : <span style={{ color: "var(--hl-text-ter)" }}>Unassigned</span>
                          )}
                        </td>
                      </tr>

                      {/* ── Expanded detail row ── */}
                      {isOpen && (
                        <tr className="hl-expand-row">
                          <td colSpan={100}>
                            <div className="hl-expand-inner">

                              {/* Report ID */}
                              <div className="hl-expand-field">
                                <span className="hl-expand-field-label"><FaHistory size={8} /> Report ID</span>
                                <span className="hl-expand-field-val" style={{ fontFamily: "monospace", fontSize: 11 }}>{String(r.id)}</span>
                              </div>

                              {/* Full Address */}
                              <div className="hl-expand-field">
                                <span className="hl-expand-field-label"><FaMapMarkerAlt size={8} /> Full Address</span>
                                <span className="hl-expand-field-val">{r.address || r.location || "—"}</span>
                              </div>

                              {/* Reporter */}
                              <div className="hl-expand-field">
                                <span className="hl-expand-field-label"><FaUser size={8} /> Reporter</span>
                                <span className="hl-expand-field-val">{r.reporter_name || "Anonymous"}</span>
                              </div>

                              {/* Contact */}
                              {r.reporter_contact && (
                                <div className="hl-expand-field">
                                  <span className="hl-expand-field-label"><FaPhone size={8} /> Contact</span>
                                  <a
                                    href={`tel:${r.reporter_contact}`}
                                    className="hl-expand-field-val"
                                    style={{ color: "var(--hl-success)", textDecoration: "none" }}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    {r.reporter_contact}
                                  </a>
                                </div>
                              )}

                              {/* Reported At */}
                              <div className="hl-expand-field">
                                <span className="hl-expand-field-label"><FaClock size={8} /> Reported At</span>
                                <span className="hl-expand-field-val">{formatDate(r.created_at)}</span>
                              </div>

                              {/* Responder */}
                              <div className="hl-expand-field">
                                <span className="hl-expand-field-label"><FaExclamationTriangle size={8} /> Assigned Responder</span>
                                <span className="hl-expand-field-val">
                                  {r.responder_name || (r.responder_id ? `ID: ${String(r.responder_id).slice(0,8)}` : "Unassigned")}
                                </span>
                              </div>

                              {/* Description */}
                              {r.description && (
                                <div className="hl-expand-desc">{r.description}</div>
                              )}

                              {/* ── Resolution Summary (resolved records only) ── */}
                              {r.status === "resolved" && (r.responder_notes || r.action_notes || r.resolution_type) && (
                                <div className="hl-resolution-box">
                                  <div className="hl-resolution-hd">
                                    <FaClipboardCheck size={11} style={{ color: "var(--hl-success)" }} />
                                    <span className="hl-resolution-hd-label">Resolution Summary</span>
                                    {resMeta && (
                                      <span className="hl-resolution-type-tag" style={{ background: resMeta.color }}>
                                        {resMeta.icon} {resMeta.label}
                                      </span>
                                    )}
                                  </div>
                                  <div className="hl-resolution-body">
                                    {r.responder_notes && (
                                      <div className="hl-resolution-section">
                                        <span className="hl-resolution-section-lbl">Response Notes</span>
                                        <span className="hl-resolution-section-val">{r.responder_notes}</span>
                                      </div>
                                    )}
                                    {r.action_notes && (
                                      <div className="hl-resolution-section">
                                        <span className="hl-resolution-section-lbl">Action Taken</span>
                                        <span className="hl-resolution-section-val">{r.action_notes}</span>
                                      </div>
                                    )}
                                    {tags.length > 0 && (
                                      <div className="hl-resolution-section" style={{ gridColumn: "1 / -1" }}>
                                        <span className="hl-resolution-section-lbl">
                                          <FaTag size={8} style={{ marginRight: 4 }} />Action Tags
                                        </span>
                                        <div className="hl-tags-wrap">
                                          {tags.map((tag, i) => (
                                            <span key={i} className="hl-tag">{tag}</span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {r.resolved_at && (
                                    <div className="hl-resolution-footer">
                                      ✓ Resolved on {formatDate(r.resolved_at)}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Evidence */}
                              {r.evidence_url && (
                                <div className="hl-expand-evidence">
                                  {!isVideo(r.evidence_url) && (
                                    <img src={r.evidence_url} alt="evidence" className="hl-evidence-thumb" />
                                  )}
                                  <a
                                    href={r.evidence_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hl-evidence-link"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    {isVideo(r.evidence_url) ? <FaVideo size={11} /> : <FaImage size={11} />}
                                    View {isVideo(r.evidence_url) ? "Video" : "Photo"} Evidence
                                    <FaExternalLinkAlt size={9} style={{ opacity: 0.5 }} />
                                  </a>
                                </div>
                              )}

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {!loading && filtered.length > PAGE_SIZE && (
            <div className="hl-pagination">
              <span className="hl-pagination-info">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="hl-pagination-btns">
                <button className="hl-page-btn" disabled={safePage === 1} onClick={() => setPage(1)}>«</button>
                <button className="hl-page-btn" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
                  const p = start + i;
                  return (
                    <button key={p} className={`hl-page-btn${p === safePage ? " active" : ""}`} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  );
                })}
                <button className="hl-page-btn" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                <button className="hl-page-btn" disabled={safePage === totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}