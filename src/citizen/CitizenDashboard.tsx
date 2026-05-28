// src/citizen/CitizenDashboard.tsx
// ✅ Dark cinematic theme — matches CitizenAlertsPage design language
// ✅ MOBILE RESPONSIVE: bottom nav on mobile, sidebar on desktop

import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileAlt, FaMapMarkedAlt, FaHistory, FaLightbulb,
  FaCheckCircle, FaClock, FaSpinner, FaExclamationTriangle,
  FaBell, FaBars, FaTimes, FaSignOutAlt, FaInfoCircle,
} from "react-icons/fa";
import dsgLogo from "../assets/dsg.logo.png";
import pagesBackground from "../assets/pagesbackground.png";

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

// ─── useIsMobile hook ─────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const clock = usePHTClock();
  const isMobile = useIsMobile();

  const [reports,     setReports]     = useState<Report[]>([]);
  const [alerts,      setAlerts]      = useState<Alert[]>([]);
  const [newAlertIds, setNewAlertIds] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const [user,        setUser]        = useState<User | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Citizen";
  const firstName   = displayName.split(" ")[0];
  const initials    = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const statCards = [
    { label: "Total Filed",  value: stats.total,      accent: "#4A90E2", icon: <FaFileAlt />,            },
    { label: "Pending",      value: stats.pending,    accent: "#EF5B5B", icon: <FaExclamationTriangle />, },
    { label: "In Progress",  value: stats.inProgress, accent: "#F5C842", icon: <FaSpinner />,             },
    { label: "Resolved",     value: stats.resolved,   accent: "#2ECC8F", icon: <FaCheckCircle />,         },
  ];

  const quickActions = [
    { label: "File Report", icon: "📝", to: "/citizen/report"    },
    { label: "Safety Map",  icon: "🗺️",  to: "/citizen/map"       },
    { label: "My Reports",  icon: "📂", to: "/citizen/history"   },
    { label: "Safety Tips", icon: "💡", to: "/citizen/safetytips"},
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

  // ─── Sidebar Nav Content (shared between mobile drawer & desktop sidebar) ───
  const SidebarNav = () => (
    <>
      <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <img src={dsgLogo} alt="DSG" style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
        <div>
          <div style={{ fontSize: "15px", fontWeight: "800", color: "#eef0f7" }}>DumaSafeGuide</div>
          <div style={{ fontSize: "10px", color: "#2ECC8F", marginTop: "2px", fontWeight: "600" }}>● CITIZEN</div>
        </div>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(238,240,247,0.5)", cursor: "pointer", fontSize: "18px", padding: "4px" }}>
            <FaTimes />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px" }}>Portal</div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "#2ECC8F", backgroundColor: "rgba(46,204,143,0.10)", borderLeft: "2px solid #2ECC8F", cursor: "default", marginBottom: "2px" }}>
          <span>🏠</span> Overview
        </div>

        <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px", marginTop: "8px" }}>Actions</div>

        {[
          { to: "/citizen/report",     icon: "📝", label: "File Report" },
          { to: "/citizen/history",    icon: "📂", label: `My Reports (${stats.total})` },
          { to: "/citizen/alerts",     icon: "🔔", label: "Barangay Alerts", badge: unreadCount },
          { to: "/citizen/map",        icon: "🗺️",  label: "Safety Map" },
          { to: "/citizen/safetytips", icon: "💡", label: "Safety Tips" },
        ].map(item => (
          <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", textDecoration: "none", marginBottom: "2px" }}>
            <span>{item.icon}</span>
            {item.label}
            {item.badge && item.badge > 0 && (
              <span style={{ fontSize: "10px", backgroundColor: "#EF5B5B", color: "#fff", borderRadius: "10px", padding: "1px 6px", fontWeight: "700", marginLeft: "auto" }}>{item.badge}</span>
            )}
          </Link>
        ))}

        <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "12px 8px 6px", marginTop: "8px" }}>Info</div>

        {[
          { to: "/citizen/directory", icon: "📋", label: "Directory" },
          { to: "/citizen/resources", icon: "📚", label: "Resources" },
        ].map(item => (
          <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", textDecoration: "none", marginBottom: "2px" }}>
            <span>{item.icon}</span> {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: "12px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "rgba(238,240,247,0.55)", cursor: "pointer" }}>
          🚪 Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundImage: `linear-gradient(rgba(8,12,20,0.93), rgba(8,12,20,0.93)), url(${pagesBackground})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat", backgroundColor: "#080c14", color: "#eef0f7", fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
      {!isMobile && (
        <aside style={{ position: "fixed", left: 0, top: 0, width: "260px", height: "100vh", backgroundColor: "rgba(8,12,20,0.95)", borderRight: "1px solid rgba(255,255,255,0.10)", display: "flex", flexDirection: "column", zIndex: 200 }}>
          <SidebarNav />
        </aside>
      )}

      {/* ── MOBILE DRAWER ── */}
      {isMobile && sidebarOpen && (
        <>
          {/* Backdrop */}
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 299, backdropFilter: "blur(2px)" }} />
          {/* Drawer */}
          <aside style={{ position: "fixed", left: 0, top: 0, width: "280px", height: "100vh", backgroundColor: "rgba(8,12,20,0.98)", borderRight: "1px solid rgba(255,255,255,0.10)", display: "flex", flexDirection: "column", zIndex: 300, animation: "slideIn 0.22s ease" }}>
            <SidebarNav />
          </aside>
          <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
        </>
      )}

      {/* ── MOBILE TOP BAR ── */}
      {isMobile && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "56px", backgroundColor: "rgba(8,12,20,0.97)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 100 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "#eef0f7", cursor: "pointer", fontSize: "18px", padding: "4px", display: "flex", alignItems: "center" }}>
            <FaBars />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={dsgLogo} alt="DSG" style={{ width: "28px", height: "28px", borderRadius: "6px" }} />
            <span style={{ fontSize: "14px", fontWeight: "800", color: "#eef0f7" }}>DumaSafeGuide</span>
          </div>
          <Link to="/citizen/alerts" style={{ position: "relative", color: "rgba(238,240,247,0.7)", textDecoration: "none", fontSize: "18px" }}>
            <FaBell />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "16px", height: "16px", backgroundColor: "#EF5B5B", borderRadius: "50%", fontSize: "9px", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>
            )}
          </Link>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{
        marginLeft: isMobile ? 0 : "260px",
        padding: isMobile ? "72px 16px 90px" : "24px",
        minHeight: "100vh",
      }}>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", color: "#2ECC8F", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px", fontWeight: "700" }}>● Citizen Portal</div>
          <h1 style={{ fontSize: isMobile ? "28px" : "38px", fontWeight: "900", marginBottom: "4px", color: "#eef0f7" }}>
            Welcome, <span style={{ color: "#2ECC8F" }}>{firstName}.</span>
          </h1>
          <p style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.12em" }}>DUMAGUETE CITY COMMUNITY SAFETY</p>
        </div>

        {/* Pending banner */}
        {stats.pending > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.2)", borderLeft: "3px solid #F5C842", borderRadius: "8px", padding: "12px 14px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{ color: "#F5C842" }}>⚠️</span>
            <span style={{ fontSize: "13px", color: "rgba(238,240,247,0.55)", flex: 1, minWidth: "120px" }}>
              You have <strong>{stats.pending}</strong> pending report{stats.pending !== 1 ? "s" : ""} awaiting review.
            </span>
            <Link to="/citizen/history" style={{ fontSize: "11px", fontWeight: "700", color: "#F5C842", textDecoration: "none", border: "1px solid rgba(245,200,66,0.3)", borderRadius: "6px", padding: "5px 12px" }}>View</Link>
          </div>
        )}

        {/* Stats Grid — 2 cols on mobile, 4 on desktop */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
          {statCards.map(c => (
            <div key={c.label} style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: isMobile ? "14px" : "20px", borderTop: `2px solid ${c.accent}` }}>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>{c.icon}</div>
              <div style={{ fontSize: isMobile ? "26px" : "32px", fontWeight: "900", marginBottom: "4px", color: c.accent }}>{loading ? "—" : c.value}</div>
              <div style={{ fontSize: "9px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.10em", textTransform: "uppercase", fontWeight: "600" }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions — 2x2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          {quickActions.map(q => (
            <Link key={q.to} to={q.to} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "rgba(238,240,247,0.65)", textDecoration: "none" }}>
              <span style={{ fontSize: "18px" }}>{q.icon}</span>
              {q.label}
            </Link>
          ))}
        </div>

        {/* Recent Reports */}
        <div style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "14px" }}>My Recent Reports</h2>
          {reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", fontSize: "11px", color: "rgba(238,240,247,0.28)" }}>
              <p>NO REPORTS YET</p>
              <Link to="/citizen/report" style={{ marginTop: "10px", fontSize: "11px", fontWeight: "700", color: "#2ECC8F", textDecoration: "none", display: "inline-block" }}>📝 File a Report</Link>
            </div>
          ) : (
            reports.slice(0, 6).map(r => (
              <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }} onClick={() => navigate(`/citizen/history/${r.id}`)}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "34px", height: "34px", minWidth: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {TYPE_META[r.type?.toLowerCase()]?.icon || "⚠️"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", textTransform: "capitalize", marginBottom: "2px", color: TYPE_META[r.type?.toLowerCase()]?.color || "rgba(238,240,247,0.4)" }}>{r.type}</div>
                    <div style={{ fontSize: "11px", color: "rgba(238,240,247,0.45)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: "5px" }}>{r.description || "No description"}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "9px", padding: "2px 7px", borderRadius: "5px", border: "1px solid", backgroundColor: STATUS_META[r.status]?.bg, color: STATUS_META[r.status]?.color, borderColor: STATUS_META[r.status]?.border, fontWeight: "700" }}>
                        ● {STATUS_META[r.status]?.label}
                      </span>
                      <span style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", fontFamily: "monospace" }}>🕐 {formatRelative(r.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Alerts */}
        <div style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px" }}>
          <h2 style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "14px" }}>Barangay Alerts 🔴 LIVE</h2>
          {alerts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", fontSize: "11px", color: "rgba(238,240,247,0.28)" }}>
              <p>🔔 NO ACTIVE ALERTS</p>
              <p style={{ fontSize: "10px", marginTop: "8px" }}>Updates automatically in real-time.</p>
            </div>
          ) : (
            <>
              {alerts.map(a => {
                const am = ALERT_TYPE_META[a.type] ?? ALERT_TYPE_META.info;
                return (
                  <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", minWidth: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", backgroundColor: am.bg, color: am.color, border: `1px solid ${am.border}` }}>{am.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "2px", color: am.color }}>{a.title || "Alert"}</div>
                        <div style={{ fontSize: "11px", color: "rgba(238,240,247,0.45)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: "5px" }}>{a.message}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "9px", padding: "2px 7px", borderRadius: "5px", border: `1px solid ${am.border}`, backgroundColor: am.bg, color: am.color, fontWeight: "700" }}>● {am.label}</span>
                          <span style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", fontFamily: "monospace", marginLeft: "auto" }}>🕐 {formatRelative(a.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={handleViewAllAlerts} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "12px", fontSize: "11px", fontWeight: "700", color: "#F5C842", border: "1px solid rgba(245,200,66,0.25)", borderRadius: "8px", padding: "8px 16px", backgroundColor: "rgba(245,200,66,0.04)", width: "100%", cursor: "pointer" }}>
                View all alerts →
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "64px", backgroundColor: "rgba(8,12,20,0.97)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom)" }}>
          {[
            { to: "/citizen/report",   icon: "📝", label: "Report"  },
            { to: "/citizen/history",  icon: "📂", label: "History" },
            { to: "/citizen/alerts",   icon: "🔔", label: "Alerts", badge: unreadCount },
            { to: "/citizen/map",      icon: "🗺️",  label: "Map"     },
            { to: "/citizen/safetytips", icon: "💡", label: "Tips"  },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", position: "relative", flex: 1 }}>
              <span style={{ fontSize: "20px", lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: "9px", color: "rgba(238,240,247,0.4)", fontWeight: "600", letterSpacing: "0.04em" }}>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span style={{ position: "absolute", top: "-2px", right: "calc(50% - 18px)", width: "15px", height: "15px", backgroundColor: "#EF5B5B", borderRadius: "50%", fontSize: "8px", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>
      )}

    </div>
  );
}