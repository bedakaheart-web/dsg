// src/citizen/CitizenDashboard.tsx
// ✅ Dark cinematic theme — matches CitizenAlertsPage design language
// • Dumaguete Boulevard background with dark overlay
// • Real DSG logo with white glow effect
// • Frosted glass panels, green accent system

import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileAlt, FaMapMarkedAlt, FaHistory, FaLightbulb,
  FaCheckCircle, FaClock, FaSpinner, FaExclamationTriangle,
  FaBell, FaBars, FaTimes, FaSignOutAlt, FaInfoCircle,
} from "react-icons/fa";
import dsgLogo from "../assets/dsg_logo.png";
import pagesBackground from "../assets/pagesbackground.jpg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Report {
  id: string;
  description: string;
  type: string;
  status: "pending" | "in-progress" | "resolved";
  created_at: string;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  user_metadata?: { full_name?: string };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALERTS_READ_KEY = "cd_alerts_last_read";

const TYPE_META: Record<string, { icon: string; color: string }> = {
  fire:     { icon: "🔥", color: "#FF6B6B" },
  accident: { icon: "🚗", color: "#F5C842" },
  flood:    { icon: "🌊", color: "#5B8DEF" },
  crime:    { icon: "🚨", color: "#EF5B5B" },
  medical:  { icon: "🏥", color: "#2ECC8F" },
  other:    { icon: "⚠️", color: "rgba(238,240,247,0.4)" },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:       { label: "PENDING",     color: "#EF5B5B", bg: "rgba(239,91,91,0.08)",  border: "rgba(239,91,91,0.25)"  },
  "in-progress": { label: "IN PROGRESS", color: "#F5C842", bg: "rgba(245,200,66,0.08)", border: "rgba(245,200,66,0.25)" },
  resolved:      { label: "RESOLVED",    color: "#2ECC8F", bg: "rgba(46,204,143,0.08)", border: "rgba(46,204,143,0.25)" },
};

const ALERT_TYPE_META: Record<string, { color: string; bg: string; border: string; label: string; icon: JSX.Element }> = {
  danger:  { color: "#EF5B5B", bg: "rgba(239,91,91,0.08)",  border: "rgba(239,91,91,0.2)",  label: "Danger",    icon: <FaExclamationTriangle /> },
  warning: { color: "#F5C842", bg: "rgba(245,200,66,0.08)", border: "rgba(245,200,66,0.2)", label: "Warning",   icon: <FaExclamationTriangle /> },
  info:    { color: "#5B8DEF", bg: "rgba(91,141,239,0.08)", border: "rgba(91,141,239,0.2)", label: "Info",      icon: <FaInfoCircle /> },
  success: { color: "#2ECC8F", bg: "rgba(46,204,143,0.08)", border: "rgba(46,204,143,0.2)", label: "All Clear", icon: <FaCheckCircle /> },
};

const TYPE_LIST = ["fire", "flood", "medical", "crime", "accident", "other"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUnreadCount(alerts: Alert[]): number {
  try {
    const lastRead = localStorage.getItem(ALERTS_READ_KEY);
    if (!lastRead) return alerts.length;
    return alerts.filter(a => new Date(a.created_at) > new Date(lastRead)).length;
  } catch { return 0; }
}

function markAlertsRead() {
  try { localStorage.setItem(ALERTS_READ_KEY, new Date().toISOString()); } catch {}
}

// ─── Clock hook ───────────────────────────────────────────────────────────────

function usePHTClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const p = (v: number) => String(v).padStart(2, "0");
      setTime(`${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())} PHT`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatRelative(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const clock = usePHTClock();

  const [reports,     setReports]     = useState<Report[]>([]);
  const [alerts,      setAlerts]      = useState<Alert[]>([]);
  const [newAlertIds, setNewAlertIds] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const [user,        setUser]        = useState<User | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav,   setActiveNav]   = useState("overview");

  useEffect(() => {
    setUnreadCount(getUnreadCount(alerts));
  }, [alerts]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user as any));

    const loadData = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) return;

        const { data: reportData } = await supabase
          .from("reports")
          .select("id, description, type, status, created_at")
          .eq("user_id", u.id)
          .order("created_at", { ascending: false });
        setReports((reportData as Report[]) || []);

        const { data: alertData } = await supabase
          .from("alerts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
        setAlerts((alertData as Alert[]) ?? []);

      } finally {
        setLoading(false);
      }
    };

    loadData();

    const reportChannel = supabase
      .channel("cd-reports-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" },
        ({ eventType, new: nr, old: or }) => {
          setReports(prev => {
            if (eventType === "INSERT") return [nr as Report, ...prev];
            if (eventType === "UPDATE") return prev.map(r => r.id === (nr as any).id ? nr as Report : r);
            if (eventType === "DELETE") return prev.filter(r => r.id !== (or as any).id);
            return prev;
          });
        }
      )
      .subscribe();

    const alertChannel = supabase
      .channel("cd-alerts-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => {
          const a = payload.new as Alert;
          setAlerts(prev => {
            if (prev.some(x => x.id === a.id)) return prev;
            return [a, ...prev].slice(0, 5);
          });
          setNewAlertIds(prev => new Set(prev).add(a.id));
          setTimeout(() => {
            setNewAlertIds(prev => { const n = new Set(prev); n.delete(a.id); return n; });
          }, 5000);
        }
      )
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "alerts" },
        (payload) => {
          setAlerts(prev => prev.filter(a => a.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reportChannel);
      supabase.removeChannel(alertChannel);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const stats = {
    total:      reports.length,
    pending:    reports.filter(r => r.status === "pending").length,
    inProgress: reports.filter(r => r.status === "in-progress").length,
    resolved:   reports.filter(r => r.status === "resolved").length,
  };

  const typeCounts = reports.reduce((acc, r) => {
    const t = r.type?.toLowerCase() || "other";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const maxCount = Math.max(...TYPE_LIST.map(t => typeCounts[t] ?? 0), 1);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Citizen";
  const firstName   = displayName.split(" ")[0];
  const initials    = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const statCards = [
    { label: "Total Filed",  value: stats.total,      accent: "#4A90E2", icon: <FaFileAlt />,            delta: "ALL TIME" },
    { label: "Pending",      value: stats.pending,    accent: "#EF5B5B", icon: <FaExclamationTriangle />, delta: "REVIEW"   },
    { label: "In Progress",  value: stats.inProgress, accent: "#F5C842", icon: <FaSpinner />,             delta: undefined  },
    { label: "Resolved",     value: stats.resolved,   accent: "#2ECC8F", icon: <FaCheckCircle />,         delta: undefined  },
  ];

  // ✅ FIXED: All routes now use /citizen/ prefix
  const quickActions = [
    { label: "File Report", icon: "📝", to: "/citizen/report",      colorClass: "qv-red"   },
    { label: "Safety Map",  icon: "🗺️",  to: "/citizen/map",         colorClass: "qv-green" },
    { label: "My Reports",  icon: "📂", to: "/citizen/history",      colorClass: "qv-blue"  },
    { label: "Safety Tips", icon: "💡", to: "/citizen/safetytips",   colorClass: "qv-amber" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const handleViewAllAlerts = () => {
    markAlertsRead();
    setUnreadCount(0);
    navigate("/citizen/alerts");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundImage: `linear-gradient(rgba(8,12,20,0.93), rgba(8,12,20,0.93)), url(${pagesBackground})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat", backgroundColor: "#080c14", color: "#eef0f7", fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ position: "fixed", left: 0, top: 0, width: "260px", height: "100vh", backgroundColor: "rgba(8,12,20,0.88)", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", zIndex: 200 }}>
        <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <img src={dsgLogo} alt="DSG" style={{ width: "40px", height: "40px", borderRadius: "8px", filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))" }} />
          <div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#eef0f7" }}>DumaSafeGuide</div>
            <div style={{ fontSize: "10px", color: "#2ECC8F", marginTop: "2px", fontWeight: "600" }}>● CITIZEN</div>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
  <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px" }}>Portal</div>

  {/* Active: Overview */}
  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "#2ECC8F", backgroundColor: "rgba(46,204,143,0.10)", borderLeft: "2px solid #2ECC8F", cursor: "default", marginBottom: "2px" }}>
    <span>🏠</span> Overview
  </div>

  <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px", marginTop: "8px" }}>Actions</div>

  <Link to="/citizen/report"     style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", textDecoration: "none", marginBottom: "2px" }}>
    <span>📝</span> File Report
  </Link>
  <Link to="/citizen/history"    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", textDecoration: "none", marginBottom: "2px" }}>
    <span>📂</span> My Reports ({stats.total})
  </Link>
  <Link to="/citizen/alerts"     style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", textDecoration: "none", marginBottom: "2px" }}>
    <span>🔔</span> Barangay Alerts {unreadCount > 0 && <span style={{ fontSize: "10px", backgroundColor: "#EF5B5B", color: "#fff", borderRadius: "10px", padding: "1px 6px", fontWeight: "700" }}>{unreadCount}</span>}
  </Link>
  <Link to="/citizen/map"        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", textDecoration: "none", marginBottom: "2px" }}>
    <span>🗺️</span> Safety Map
  </Link>
  <Link to="/citizen/safetytips" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", textDecoration: "none", marginBottom: "2px" }}>
    <span>💡</span> Safety Tips
  </Link>

  <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px", marginTop: "8px" }}>Info</div>

  <Link to="/citizen/directory"  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", textDecoration: "none", marginBottom: "2px" }}>
    <span>📋</span> Directory
  </Link>
  <Link to="/citizen/resources"  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", textDecoration: "none", marginBottom: "2px" }}>
    <span>📚</span> Resources
  </Link>
</nav>

        <div style={{ padding: "12px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", cursor: "pointer", transition: "all 0.2s" }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ marginLeft: "260px", padding: "24px", minHeight: "100vh" }}>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "10px", color: "#2ECC8F", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px", fontWeight: "700" }}>● Citizen Portal</div>
          <h1 style={{ fontSize: "38px", fontWeight: "900", marginBottom: "4px", color: "#eef0f7" }}>Welcome, <span style={{ color: "#2ECC8F" }}>{firstName}.</span></h1>
          <p style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.12em" }}>DUMAGUETE CITY COMMUNITY SAFETY</p>
        </div>

        {stats.pending > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px", backgroundColor: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.2)", borderLeft: "3px solid #F5C842", borderRadius: "8px", padding: "14px 18px", marginBottom: "24px" }}>
            <span style={{ color: "#F5C842" }}>⚠️</span>
            <span style={{ fontSize: "13px", color: "rgba(238,240,247,0.55)", flex: 1 }}>You have <strong>{stats.pending}</strong> pending report{stats.pending !== 1 ? "s" : ""} awaiting review.</span>
            <Link to="/citizen/history" style={{ fontSize: "11px", fontWeight: "700", color: "#F5C842", textDecoration: "none", border: "1px solid rgba(245,200,66,0.3)", borderRadius: "6px", padding: "5px 12px", backgroundColor: "transparent" }}>View reports</Link>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          {statCards.map(c => (
            <div key={c.label} style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", borderTop: `2px solid ${c.accent}`, transition: "all 0.3s" }}>
              <div style={{ fontSize: "16px", marginBottom: "12px" }}>{c.icon}</div>
              <div style={{ fontSize: "32px", fontWeight: "900", marginBottom: "6px", color: c.accent }}>{loading ? "—" : c.value}</div>
              <div style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "600" }}>{c.label}</div>
              {c.delta && <span style={{ position: "absolute", top: "12px", right: "12px", fontSize: "8px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px", padding: "2px 6px", color: "rgba(238,240,247,0.28)", fontWeight: "600" }}>{c.delta}</span>}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "20px" }}>
          {quickActions.map(q => (
            <Link key={q.to} to={q.to} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "rgba(238,240,247,0.55)", textDecoration: "none", transition: "all 0.2s" }}>
              <span style={{ fontSize: "16px" }}>{q.icon}</span>
              {q.label}
            </Link>
          ))}
        </div>

        {/* Reports List */}
        <div style={{ marginTop: "24px", backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
          <h2 style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "16px" }}>My Recent Reports</h2>
          {reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 24px", fontSize: "11px", color: "rgba(238,240,247,0.28)" }}>
              <p>NO REPORTS YET</p>
              <Link to="/citizen/report" style={{ marginTop: "12px", fontSize: "11px", fontWeight: "700", color: "#2ECC8F", textDecoration: "none", display: "inline-block" }}>📝 File a Report</Link>
            </div>
          ) : (
            reports.slice(0, 6).map(r => (
              <div key={r.id} style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }} onClick={() => navigate(`/citizen/history/${r.id}`)}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>{TYPE_META[r.type?.toLowerCase()]?.icon || "⚠️"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", textTransform: "capitalize", marginBottom: "3px", color: TYPE_META[r.type?.toLowerCase()]?.color || "rgba(238,240,247,0.4)" }}>{r.type}</div>
                    <div style={{ fontSize: "11px", color: "rgba(238,240,247,0.55)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: "6px" }}>📄 {r.description || "No description"}</div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "9px", padding: "3px 8px", borderRadius: "5px", border: "1px solid", backgroundColor: STATUS_META[r.status]?.bg, color: STATUS_META[r.status]?.color, borderColor: STATUS_META[r.status]?.border, fontWeight: "700" }}>
                      ● {STATUS_META[r.status]?.label}
                    </span>
                    <div style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", marginTop: "5px", fontFamily: "monospace" }}>🕐 {formatRelative(r.created_at)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Alerts Section */}
        <div style={{ marginTop: "24px", backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
          <h2 style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "16px" }}>Barangay Alerts 🔴 LIVE</h2>
          {alerts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 24px", fontSize: "11px", color: "rgba(238,240,247,0.28)" }}>
              <p>🔔 NO ACTIVE ALERTS</p>
              <p style={{ fontSize: "10px", marginTop: "8px", textTransform: "none" }}>Updates automatically in real-time.</p>
            </div>
          ) : (
            <>
              {alerts.map(a => {
                const am = ALERT_TYPE_META[a.type] ?? ALERT_TYPE_META.info;
                return (
                  <div key={a.id} style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", backgroundColor: am.bg, color: am.color, border: `1px solid ${am.border}` }}>{am.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "3px", color: am.color }}>{a.title || "Alert"}</div>
                        <div style={{ fontSize: "11px", color: "rgba(238,240,247,0.55)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: "5px" }}>{a.message}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "9px", padding: "3px 8px", borderRadius: "5px", border: `1px solid ${am.border}`, backgroundColor: am.bg, color: am.color, fontWeight: "700" }}>● {am.label}</span>
                          <span style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", marginLeft: "auto", fontFamily: "monospace" }}>🕐 {formatRelative(a.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={handleViewAllAlerts} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "14px", fontSize: "11px", fontWeight: "700", color: "#F5C842", textDecoration: "none", border: "1px solid rgba(245,200,66,0.25)", borderRadius: "8px", padding: "8px 16px", backgroundColor: "rgba(245,200,66,0.04)", width: "100%", cursor: "pointer" }}>
                View all alerts →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}