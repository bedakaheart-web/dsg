// HistoryLogPage.tsx
// Drop this file alongside your other admin page components.
// It reads from the existing `reports` and `alerts` tables in Supabase.

import { useEffect, useState, useMemo } from "react";
import { supabase } from "../js/supabase";
import {
  FaHistory,
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBell,
  FaClipboardList,
  FaChevronLeft,
  FaChevronRight,
  FaSync,
  FaShieldAlt,
  FaSearch,
} from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HistoryEntry {
  id: string;
  kind: "incident" | "alert" | "action";
  type: string;
  title: string;
  description: string | null;
  location: string | null;
  actor: string | null;
  status: string;
  created_at: string;
  raw?: Record<string, unknown>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TYPE_META: Record<string, { icon: string; color: string }> = {
  fire:     { icon: "🔥", color: "#FF3B30" },
  accident: { icon: "🚗", color: "#FF9500" },
  flood:    { icon: "🌊", color: "#0066FF" },
  crime:    { icon: "🚨", color: "#FF2D55" },
  medical:  { icon: "🏥", color: "#00B074" },
  other:    { icon: "⚠️", color: "#9CA3AF" },
  alert:    { icon: "🔔", color: "#FF9500" },
  action:   { icon: "🛡️", color: "#0066FF" },
};

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:     { label: "PENDING",     color: "#FF3B30", bg: "rgba(255,59,48,.10)",  border: "rgba(255,59,48,.28)"  },
  "in-progress":{ label: "IN PROGRESS",color: "#FF9500", bg: "rgba(255,149,0,.10)", border: "rgba(255,149,0,.28)"  },
  resolved:    { label: "RESOLVED",    color: "#00B074", bg: "rgba(0,176,116,.10)",  border: "rgba(0,176,116,.28)"  },
  sent:        { label: "SENT",        color: "#FF9500", bg: "rgba(255,149,0,.10)",  border: "rgba(255,149,0,.28)"  },
  logged:      { label: "LOGGED",      color: "#0066FF", bg: "rgba(0,102,255,.10)",  border: "rgba(0,102,255,.28)"  },
};

const PER_PAGE = 12;

// ─── Styles ───────────────────────────────────────────────────────────────────

const HL_STYLE = `
.hl-root { animation: hlFadeIn 0.4s ease-out both; }
@keyframes hlFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }

/* ── Page header ── */
.hl-page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
}
.hl-eyebrow {
  font-size: 11px; color: var(--primary); letter-spacing: 0.5px;
  text-transform: uppercase; margin-bottom: 6px; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
}
.hl-eyebrow::before { content:''; display:block; width:20px; height:2px; background:var(--primary); }
.hl-title { font-size: 32px; color: var(--text); letter-spacing: -0.5px; line-height: 1.1; font-weight: 700; }
.hl-subtitle { font-size: 11px; color: var(--text-tertiary); margin-top: 4px; }

/* ── Summary stat cards ── */
.hl-stat-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px; margin-bottom: 24px;
}
.hl-stat {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 18px 16px; position: relative;
  overflow: hidden; transition: all 0.25s; cursor: default;
  animation: hlFadeIn 0.5s ease-out both;
}
.hl-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--hl-accent); }
.hl-stat:hover { transform: translateY(-3px); border-color: var(--hl-accent); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
.hl-stat-icon  { font-size: 16px; color: var(--hl-accent); margin-bottom: 10px; opacity: 0.85; }
.hl-stat-num   { font-size: 28px; font-weight: 700; line-height: 1; letter-spacing: -0.5px; color: var(--hl-accent); margin-bottom: 4px; }
.hl-stat-label { font-size: 10px; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; font-weight: 500; }

/* ── Controls bar ── */
.hl-controls {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  margin-bottom: 20px; padding: 14px 16px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
}
.hl-ctrl-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex: 1; min-width: 0; }
.hl-ctrl-icon { color: var(--text-tertiary); font-size: 12px; flex-shrink: 0; }

.hl-select {
  background: var(--bg); border: 1px solid var(--border); border-radius: 7px;
  color: var(--text); font-size: 12px; padding: 7px 10px; outline: none;
  cursor: pointer; transition: border-color 0.15s; font-family: inherit;
}
.hl-select:focus { border-color: var(--primary); }

.hl-search-wrap { position: relative; flex: 1; min-width: 160px; max-width: 260px; }
.hl-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); font-size: 11px; pointer-events: none; }
.hl-search {
  width: 100%; background: var(--bg); border: 1px solid var(--border);
  border-radius: 7px; color: var(--text); font-size: 12px;
  padding: 7px 10px 7px 28px; outline: none; transition: border-color 0.15s;
  font-family: inherit;
}
.hl-search:focus { border-color: var(--primary); }
.hl-search::placeholder { color: var(--text-tertiary); }

.hl-filter-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.hl-tab {
  padding: 6px 13px; border-radius: 6px; font-size: 11px; font-weight: 600;
  border: 1px solid var(--border); background: var(--bg);
  color: var(--text-secondary); cursor: pointer; transition: all 0.15s;
  font-family: inherit; white-space: nowrap;
}
.hl-tab:hover { color: var(--text); border-color: var(--text-secondary); }
.hl-tab.active { background: rgba(0,102,255,0.12); border-color: rgba(0,102,255,0.4); color: var(--primary); }

.hl-refresh-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 13px; border-radius: 7px; font-size: 11px; font-weight: 600;
  border: 1px solid var(--border); background: var(--bg);
  color: var(--text-secondary); cursor: pointer; transition: all 0.15s;
  font-family: inherit; flex-shrink: 0;
}
.hl-refresh-btn:hover { color: var(--primary); border-color: var(--primary); }
.hl-refresh-btn.spinning svg { animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Month section ── */
.hl-month-section { margin-bottom: 8px; }
.hl-month-divider {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 0 10px;
  font-size: 11px; font-weight: 700; color: var(--text-secondary);
  letter-spacing: 0.07em; text-transform: uppercase;
}
.hl-month-divider::after { content:''; flex:1; height:1px; background:var(--border); }
.hl-month-badge {
  font-size: 10px; background: var(--surface); border: 1px solid var(--border);
  color: var(--text-tertiary); border-radius: 10px; padding: 1px 9px; font-weight: 600;
}

/* ── Entry rows ── */
.hl-entries { display: flex; flex-direction: column; gap: 3px; }
.hl-entry {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 11px 14px; border-radius: 9px;
  border: 1px solid transparent; transition: all 0.15s; cursor: default;
  animation: hlFadeIn 0.3s ease-out both;
}
.hl-entry:hover { background: var(--surface); border-color: var(--border); }

.hl-entry-icon {
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0; margin-top: 1px;
  background: var(--hl-icon-bg);
}
.hl-entry-body { flex: 1; min-width: 0; }
.hl-entry-top {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 2px;
}
.hl-entry-type   { font-size: 13px; font-weight: 700; color: var(--hl-type-color); }
.hl-entry-id     { font-size: 11px; color: var(--text-tertiary); }
.hl-entry-desc   {
  font-size: 12px; color: var(--text-secondary); margin-bottom: 5px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 540px;
}
.hl-entry-meta   { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.hl-meta-chip    {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: var(--text-tertiary);
}
.hl-meta-chip svg { opacity: 0.65; }

.hl-status-badge {
  font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 4px;
  letter-spacing: 0.04em; flex-shrink: 0;
  color: var(--hl-sb-color); background: var(--hl-sb-bg); border: 1px solid var(--hl-sb-border);
}

/* ── Empty / loading ── */
.hl-empty {
  text-align: center; padding: 56px 24px;
  font-size: 12px; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.3px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
}
.hl-spinner {
  display: inline-block; width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--border); border-top-color: var(--primary);
  animation: spin 0.8s linear infinite; margin-bottom: 12px;
}

/* ── Pagination ── */
.hl-pagination {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px;
  padding: 14px 0 4px; border-top: 1px solid var(--border); margin-top: 12px;
}
.hl-pg-info { font-size: 11px; color: var(--text-secondary); }
.hl-pg-btns { display: flex; gap: 4px; flex-wrap: wrap; }
.hl-pg-btn {
  background: var(--bg); border: 1px solid var(--border);
  color: var(--text-secondary); font-size: 11px;
  padding: 6px 12px; border-radius: 6px; cursor: pointer;
  transition: all 0.15s; font-family: inherit; font-weight: 500;
  display: flex; align-items: center; gap: 4px;
}
.hl-pg-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
.hl-pg-btn:disabled { opacity: 0.35; cursor: default; }
.hl-pg-btn.active { background: rgba(0,102,255,0.12); border-color: rgba(0,102,255,0.4); color: var(--primary); font-weight: 700; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .hl-title { font-size: 26px; }
  .hl-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .hl-stat-num { font-size: 22px; }
  .hl-entry-desc { max-width: 240px; }
  .hl-controls { gap: 8px; }
}
@media (max-width: 480px) {
  .hl-stat-grid { grid-template-columns: repeat(2, 1fr); }
  .hl-entry-meta { gap: 8px; }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad2(n: number) { return String(n).padStart(2, "0"); }

function formatDate(ts: string) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}

function formatTime(ts: string) {
  const d = new Date(ts);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function getYearMonth(ts: string) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

function buildAvailableMonths(entries: HistoryEntry[]) {
  const set = new Set<string>();
  entries.forEach(e => set.add(getYearMonth(e.created_at)));
  return Array.from(set).sort((a, b) => b.localeCompare(a));
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.logged;
  return (
    <span
      className="hl-status-badge"
      style={{
        "--hl-sb-color":  s.color,
        "--hl-sb-bg":     s.bg,
        "--hl-sb-border": s.border,
      } as React.CSSProperties}
    >
      {s.label}
    </span>
  );
}

// ─── Single Entry Row ─────────────────────────────────────────────────────────

function EntryRow({ entry }: { entry: HistoryEntry }) {
  const tm = TYPE_META[entry.type] ?? TYPE_META.other;
  const shortId = `#${String(entry.id).slice(0, 8).toUpperCase()}`;

  return (
    <div
      className="hl-entry"
      style={{
        "--hl-icon-bg":     `${tm.color}18`,
        "--hl-type-color":  tm.color,
      } as React.CSSProperties}
    >
      <div className="hl-entry-icon" aria-hidden="true">{tm.icon}</div>

      <div className="hl-entry-body">
        <div className="hl-entry-top">
          <span className="hl-entry-type" style={{ textTransform: "capitalize" }}>
            {entry.title}
          </span>
          <span className="hl-entry-id">{shortId}</span>
          <StatusBadge status={entry.status} />
        </div>

        {entry.description && (
          <div className="hl-entry-desc">{entry.description}</div>
        )}

        <div className="hl-entry-meta">
          {entry.location && (
            <span className="hl-meta-chip">
              <FaMapMarkerAlt size={10} />
              {entry.location}
            </span>
          )}
          <span className="hl-meta-chip">
            <FaClock size={10} />
            {formatDate(entry.created_at)}&nbsp;&nbsp;{formatTime(entry.created_at)}
          </span>
          {entry.actor && (
            <span className="hl-meta-chip">
              <FaUser size={10} />
              {entry.actor}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HistoryLogPage() {
  const [allEntries, setAllEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [spinning, setSpinning]     = useState(false);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [filterKind,    setFilterKind]    = useState<"all" | "incident" | "alert" | "action">("all");
  const [search,        setSearch]        = useState("");
  const [page,          setPage]          = useState(1);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = async (showSpinner = false) => {
    if (showSpinner) setSpinning(true);
    else setLoading(true);

    const [reportsRes, alertsRes] = await Promise.all([
      supabase
        .from("reports")
        .select("id, type, description, location, address, reporter_name, status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("alerts")
        .select("id, title, message, created_at, sent_by")
        .order("created_at", { ascending: false }),
    ]);

    const entries: HistoryEntry[] = [];

    // Reports → incidents + resolved actions
    (reportsRes.data ?? []).forEach((r: Record<string, unknown>) => {
      entries.push({
        id:          String(r.id),
        kind:        "incident",
        type:        String(r.type ?? "other"),
        title:       String(r.type ?? "Other").replace(/_/g, " "),
        description: (r.description as string | null) ?? null,
        location:    (r.address as string | null) ?? (r.location as string | null) ?? null,
        actor:       (r.reporter_name as string | null) ?? null,
        status:      String(r.status ?? "pending"),
        created_at:  String(r.created_at),
        raw:         r,
      });
    });

    // Alerts
    (alertsRes.data ?? []).forEach((a: Record<string, unknown>) => {
      entries.push({
        id:          String(a.id),
        kind:        "alert",
        type:        "alert",
        title:       (a.title as string | null) ?? "Alert Sent",
        description: (a.message as string | null) ?? null,
        location:    null,
        actor:       (a.sent_by as string | null) ?? "admin",
        status:      "sent",
        created_at:  String(a.created_at),
        raw:         a,
      });
    });

    // Sort newest first
    entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setAllEntries(entries);
    setLoading(false);
    setSpinning(false);
  };

  useEffect(() => {
    fetchAll();

    // Real-time subscriptions
    const ch = supabase
      .channel("historylog-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => fetchAll(true))
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts"  }, () => fetchAll(true))
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [selectedMonth, filterKind, search]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const availableMonths = useMemo(() => buildAvailableMonths(allEntries), [allEntries]);

  const filtered = useMemo(() => {
    let list = allEntries;

    if (selectedMonth !== "all") {
      list = list.filter(e => getYearMonth(e.created_at) === selectedMonth);
    }
    if (filterKind !== "all") {
      list = list.filter(e => e.kind === filterKind);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.description ?? "").toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q) ||
        (e.actor ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [allEntries, selectedMonth, filterKind, search]);

  // Summary stats — always over the current month/all filter (ignore kind)
  const statsBase = useMemo(() => {
    if (selectedMonth === "all") return allEntries;
    return allEntries.filter(e => getYearMonth(e.created_at) === selectedMonth);
  }, [allEntries, selectedMonth]);

  const stats = useMemo(() => ({
    total:      statsBase.length,
    incidents:  statsBase.filter(e => e.kind === "incident").length,
    resolved:   statsBase.filter(e => e.status === "resolved").length,
    pending:    statsBase.filter(e => e.status === "pending").length,
    alerts:     statsBase.filter(e => e.kind === "alert").length,
  }), [statsBase]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageSlice  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // Group current page by month
  const grouped = useMemo(() => {
    const map: Record<string, HistoryEntry[]> = {};
    pageSlice.forEach(e => {
      const ym = getYearMonth(e.created_at);
      if (!map[ym]) map[ym] = [];
      map[ym].push(e);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [pageSlice]);

  // Pagination page numbers
  const pgRange = () => {
    const span = 5;
    let start = Math.max(1, safePage - Math.floor(span / 2));
    let end   = Math.min(totalPages, start + span - 1);
    if (end - start < span - 1) start = Math.max(1, end - span + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const statCards = [
    { label: "Total Entries", value: stats.total,     accent: "#0066FF", icon: <FaHistory size={14} />         },
    { label: "Incidents",     value: stats.incidents,  accent: "#FF3B30", icon: <FaClipboardList size={14} />   },
    { label: "Resolved",      value: stats.resolved,   accent: "#00B074", icon: <FaCheckCircle size={14} />     },
    { label: "Pending",       value: stats.pending,    accent: "#FF9500", icon: <FaExclamationTriangle size={14}/> },
    { label: "Alerts Sent",   value: stats.alerts,     accent: "#FF2D55", icon: <FaBell size={14} />            },
  ];

  const filterTabs: { key: typeof filterKind; label: string }[] = [
    { key: "all",      label: "All"       },
    { key: "incident", label: "Incidents" },
    { key: "alert",    label: "Alerts"    },
    { key: "action",   label: "Actions"   },
  ];

  return (
    <>
      <style>{HL_STYLE}</style>

      <div className="hl-root">
        {/* ── Page Header ── */}
        <div className="hl-page-header">
          <div>
            <div className="hl-eyebrow">Admin Panel</div>
            <div className="hl-title">History Log</div>
            <div className="hl-subtitle">DUMAGUETE CITY EMERGENCY HQ — MONTHLY RECORDS</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {loading && <div className="hl-spinner" />}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-secondary)" }}>
              <FaShieldAlt size={11} style={{ color: "var(--primary)" }} />
              <span style={{ fontWeight: 600, color: "var(--primary)" }}>
                {selectedMonth === "all" ? "All Time" : monthLabel(selectedMonth)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Summary Stats ── */}
        <div className="hl-stat-grid">
          {statCards.map((c, i) => (
            <div
              key={c.label}
              className="hl-stat"
              style={{ "--hl-accent": c.accent, animationDelay: `${i * 0.05}s` } as React.CSSProperties}
            >
              <div className="hl-stat-icon">{c.icon}</div>
              <div className="hl-stat-num">{loading ? "—" : c.value}</div>
              <div className="hl-stat-label">{c.label}</div>
            </div>
          ))}
        </div>

        {/* ── Controls ── */}
        <div className="hl-controls">
          <div className="hl-ctrl-group">
            <FaCalendarAlt className="hl-ctrl-icon" size={12} />
            <select
              className="hl-select"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            >
              <option value="all">All Months</option>
              {availableMonths.map(ym => (
                <option key={ym} value={ym}>{monthLabel(ym)}</option>
              ))}
            </select>

            <FaFilter className="hl-ctrl-icon" size={11} style={{ marginLeft: 4 }} />
            <div className="hl-filter-tabs">
              {filterTabs.map(t => (
                <button
                  key={t.key}
                  className={`hl-tab${filterKind === t.key ? " active" : ""}`}
                  onClick={() => setFilterKind(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="hl-search-wrap">
              <FaSearch className="hl-search-icon" size={10} />
              <input
                className="hl-search"
                type="text"
                placeholder="Search entries…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button
              className={`hl-refresh-btn${spinning ? " spinning" : ""}`}
              onClick={() => fetchAll(true)}
              title="Refresh log"
            >
              <FaSync size={11} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ── Log Entries ── */}
        {loading ? (
          <div className="hl-empty">
            <div className="hl-spinner" style={{ margin: "0 auto 12px" }} />
            <div>Loading history…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="hl-empty">
            <FaHistory size={28} style={{ opacity: 0.2, marginBottom: 12 }} />
            <div>No entries found for the selected filters</div>
          </div>
        ) : (
          grouped.map(([ym, entries]) => (
            <div key={ym} className="hl-month-section">
              <div className="hl-month-divider">
                {monthLabel(ym)}
                <span className="hl-month-badge">{entries.length}</span>
              </div>
              <div className="hl-entries">
                {entries.map(e => <EntryRow key={`${e.kind}-${e.id}`} entry={e} />)}
              </div>
            </div>
          ))
        )}

        {/* ── Pagination ── */}
        {!loading && filtered.length > 0 && (
          <div className="hl-pagination">
            <span className="hl-pg-info">
              Showing {(safePage - 1) * PER_PAGE + 1}–
              {Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length} entries
            </span>
            <div className="hl-pg-btns">
              <button
                className="hl-pg-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                <FaChevronLeft size={9} /> Prev
              </button>
              {pgRange().map(p => (
                <button
                  key={p}
                  className={`hl-pg-btn${p === safePage ? " active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="hl-pg-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >
                Next <FaChevronRight size={9} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}