// src/citizen/CitizenDashboard.tsx
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../js/supabase";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaCheckCircle, FaClock, FaSpinner, FaExclamationTriangle,
  FaTimes, FaInfoCircle,
} from "react-icons/fa";
import pagesBackground from "../assets/pagesbackground.png";

import CitizenSafetyTips from "./CitizenSafetyTips";
import CitizenAlertsPage from "./CitizenAlertsPage";
import CitizenReport from "./CitizenReport";
import CitizenReportDetail from "./CitizenReportDetail";
import CitizenMap from "./CitizenMap";

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

type ModalView = null | "safetytips" | "alerts" | "report" | "reportdetail" | "map";

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function CitizenDashboard() {
  // Consumes the active Navbar/Header language — any selector change re-renders
  // this component and re-evaluates every t() call and language-aware helper below.
  const { language, t, tList } = useLanguage();
  void tList;
  const locale = language === "tl" ? "fil-PH" : "en-PH";
  const navigate = useNavigate();
  const clock = usePHTClock();
  const isMobile = useIsMobile();

  // Language-aware status-pill text (status.* in the dictionary, English fallback).
  const statusLabel = (s: string) =>
    t(`status.${s === "in-progress" ? "inProgress" : s}`, STATUS_META[s]?.label ?? s);
  // Language-aware alert-level badge text.
  const levelLabel = (level: string) =>
    t(`alerts.levels.${level}`, ALERT_TYPE_META[level]?.label ?? level);
  // Language-aware report-type name (report.types.* in the dictionary).
  const typeLabel = (type: string | undefined) =>
    t(`report.types.${type?.toLowerCase()}`, type ?? "");
  // Language-aware relative timestamp — computed every render, never cached.
  const formatRelativeLocal = (ts: string) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 60)    return t("timeAgo.second", "{n}s ago").replace("{n}", String(diff));
    if (diff < 3600)  return t("timeAgo.minute", "{n}m ago").replace("{n}", String(Math.floor(diff / 60)));
    if (diff < 86400) return t("timeAgo.hour", "{n}h ago").replace("{n}", String(Math.floor(diff / 3600)));
    return new Date(ts).toLocaleDateString(locale, { month: "short", day: "numeric" });
  };

  const [reports,     setReports]     = useState<Report[]>([]);
  const [alerts,      setAlerts]      = useState<Alert[]>([]);
  const [newAlertIds, setNewAlertIds] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const [user,        setUser]        = useState<User | null>(null);
  const [loading,     setLoading]     = useState(true);

  const [modalView, setModalView] = useState<ModalView>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalView(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalView ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalView]);

  const stats = {
    total:      reports.length,
    pending:    reports.filter(r => r.status === "pending").length,
    inProgress: reports.filter(r => r.status === "in-progress").length,
    resolved:   reports.filter(r => r.status === "resolved").length,
  };

  // Split on the {count} placeholder instead of English words so the <strong>
  // emphasis works in every language (Tagalog word order differs from English).
  const pendingParts = t("dashboard.pendingReports", "You have {count} report(s) awaiting review.").split("{count}");
  const pendingHtml = `${pendingParts[0] ?? ""}<strong>${stats.pending}</strong>${pendingParts[1] ?? ""}`;

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || t("history.citizen", "Citizen");
  const firstName   = displayName.split(" ")[0];

  const statCards = [
    { label: t("dashboard.statTotalFiled"),  value: stats.total,      accent: "#4A90E2", icon: <FaFileAlt />,            },
    { label: t("dashboard.statPending"),      value: stats.pending,    accent: "#EF5B5B", icon: <FaExclamationTriangle />, },
    { label: t("dashboard.statInProgress"),  value: stats.inProgress, accent: "#F5C842", icon: <FaSpinner />,             },
    { label: t("dashboard.statResolved"),     value: stats.resolved,   accent: "#2ECC8F", icon: <FaCheckCircle />,         },
  ];

  const quickActions = [
    { label: t("dashboard.quickActionFileReport"), icon: "📝", modal: "report" as const },
    { label: t("dashboard.quickActionSafetyMap"),  icon: "🗺️",  modal: "map" as const },
    { label: t("dashboard.quickActionMyReports"),  icon: "📂", to: "/citizen/history"   },
    { label: t("dashboard.quickActionSafetyTips"), icon: "💡", modal: "safetytips" as const },
  ];

  const handleViewAllAlerts = () => {
    markAlertsRead();
    setUnreadCount(0);
    setModalView("alerts");
  };

  const openSafetyTips = () => {
    setModalView("safetytips");
  };

  const openAlerts = () => {
    markAlertsRead();
    setUnreadCount(0);
    setModalView("alerts");
  };

  const openFileReport = () => {
    setModalView("report");
  };

  const openReportDetail = (id: string) => {
    setSelectedReportId(id);
    setModalView("reportdetail");
  };

  const openMap = () => {
    setModalView("map");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundImage: `linear-gradient(rgba(8,12,20,0.93), rgba(8,12,20,0.93)), url(${pagesBackground})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat", backgroundColor: "#080c14", color: "#eef0f7", fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* Sidebar + mobile nav are provided by the persistent CitizenLayout. */}

      <div style={{
        padding: isMobile ? "16px 16px 90px" : "24px",
        minHeight: "100vh",
      }}>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", color: "#2ECC8F", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "6px", fontWeight: "700" }}>{t("dashboard.portalLabel")}</div>
          <h1 style={{ fontSize: isMobile ? "28px" : "38px", fontWeight: "900", marginBottom: "4px", color: "#eef0f7" }}>
            {t("dashboard.welcomeTitle").replace("{name}", firstName)}
          </h1>
          <p style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.12em" }}>{t("dashboard.dumagueteCity")}</p>
        </div>

        {stats.pending > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.2)", borderLeft: "3px solid #F5C842", borderRadius: "8px", padding: "12px 14px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{ color: "#F5C842" }}>⚠️</span>
            <span
              style={{ fontSize: "13px", color: "rgba(238,240,247,0.55)", flex: 1, minWidth: "120px" }}
              dangerouslySetInnerHTML={{ __html: pendingHtml }}
            />
            <Link to="/citizen/history" style={{ fontSize: "11px", fontWeight: "700", color: "#F5C842", textDecoration: "none", border: "1px solid rgba(245,200,66,0.3)", borderRadius: "6px", padding: "5px 12px" }}>{t("dashboard.view")}</Link>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
          {statCards.map(c => (
            <div key={c.label} style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: isMobile ? "14px" : "20px", borderTop: `2px solid ${c.accent}` }}>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>{c.icon}</div>
              <div style={{ fontSize: isMobile ? "26px" : "32px", fontWeight: "900", marginBottom: "4px", color: c.accent }}>{loading ? "—" : c.value}</div>
              <div style={{ fontSize: "9px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.10em", textTransform: "uppercase", fontWeight: "600" }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          {quickActions.map(q =>
            "modal" in q && q.modal ? (
              <button
                key={q.label}
                onClick={() => setModalView(q.modal)}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "rgba(238,240,247,0.65)", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
              >
                <span style={{ fontSize: "18px" }}>{q.icon}</span>
                {q.label}
              </button>
            ) : (
              <Link key={q.to} to={q.to as string} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "rgba(238,240,247,0.65)", textDecoration: "none" }}>
                <span style={{ fontSize: "18px" }}>{q.icon}</span>
                {q.label}
              </Link>
            )
          )}
        </div>

        <div style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "14px" }}>{t("dashboard.recentReportsTitle")}</h2>
          {reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", fontSize: "11px", color: "rgba(238,240,247,0.28)" }}>
              <p>{t("dashboard.noReportsYet")}</p>
              <button
                onClick={openFileReport}
                style={{ marginTop: "10px", fontSize: "11px", fontWeight: "700", color: "#2ECC8F", background: "none", border: "none", cursor: "pointer", display: "inline-block", fontFamily: "inherit" }}
              >
                {t("dashboard.fileAReport")}
              </button>
            </div>
          ) : (
            reports.slice(0, 6).map(r => (
              <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }} onClick={() => openReportDetail(r.id)}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "34px", height: "34px", minWidth: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {TYPE_META[r.type?.toLowerCase()]?.icon || "⚠️"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", textTransform: "capitalize", marginBottom: "2px", color: TYPE_META[r.type?.toLowerCase()]?.color || "rgba(238,240,247,0.4)" }}>{typeLabel(r.type)}</div>
                    <div style={{ fontSize: "11px", color: "rgba(238,240,247,0.45)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: "5px" }}>{r.description || t("reportDetail.noDescription", "No description")}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "9px", padding: "2px 7px", borderRadius: "5px", border: "1px solid", backgroundColor: STATUS_META[r.status]?.bg, color: STATUS_META[r.status]?.color, borderColor: STATUS_META[r.status]?.border, fontWeight: "700" }}>
                        ● {statusLabel(r.status)}
                      </span>
                      <span style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", fontFamily: "monospace" }}>🕐 {formatRelativeLocal(r.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ backgroundColor: "rgba(15,21,33,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px" }}>
          <h2 style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: "700", marginBottom: "14px" }}>{t("dashboard.alertsTitle")}</h2>
          {alerts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", fontSize: "11px", color: "rgba(238,240,247,0.28)" }}>
              <p>{t("dashboard.noActiveAlerts")}</p>
              <p style={{ fontSize: "10px", marginTop: "8px" }}>{t("dashboard.updatesAutomatically")}</p>
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
                        <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "2px", color: am.color }}>{a.title || t("alerts.alert")}</div>
                        <div style={{ fontSize: "11px", color: "rgba(238,240,247,0.45)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: "5px" }}>{a.message}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "9px", padding: "2px 7px", borderRadius: "5px", border: `1px solid ${am.border}`, backgroundColor: am.bg, color: am.color, fontWeight: "700" }}>● {levelLabel(a.type)}</span>
                          <span style={{ fontSize: "10px", color: "rgba(238,240,247,0.28)", fontFamily: "monospace", marginLeft: "auto" }}>🕐 {formatRelativeLocal(a.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={handleViewAllAlerts} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "12px", fontSize: "11px", fontWeight: "700", color: "#F5C842", border: "1px solid rgba(245,200,66,0.25)", borderRadius: "8px", padding: "8px 16px", backgroundColor: "rgba(245,200,66,0.04)", width: "100%", cursor: "pointer" }}>
                {t("dashboard.viewAllAlerts")}
              </button>
            </>
          )}
        </div>
      </div>

      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "64px", backgroundColor: "rgba(8,12,20,0.97)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom)" }}>
          <button onClick={openFileReport} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "none", border: "none", flex: 1, fontFamily: "inherit" }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>📝</span>
            <span style={{ fontSize: "9px", color: "rgba(238,240,247,0.4)", fontWeight: "600", letterSpacing: "0.04em" }}>{t("dashboard.bottomNavReport")}</span>
          </button>
          <Link to="/citizen/history" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", flex: 1 }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>📂</span>
            <span style={{ fontSize: "9px", color: "rgba(238,240,247,0.4)", fontWeight: "600", letterSpacing: "0.04em" }}>{t("dashboard.bottomNavHistory")}</span>
          </Link>
          <button onClick={openAlerts} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "none", border: "none", position: "relative", flex: 1, fontFamily: "inherit" }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>🔔</span>
            <span style={{ fontSize: "9px", color: "rgba(238,240,247,0.4)", fontWeight: "600", letterSpacing: "0.04em" }}>{t("nav.alerts")}</span>
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: "-2px", right: "calc(50% - 18px)", width: "15px", height: "15px", backgroundColor: "#EF5B5B", borderRadius: "50%", fontSize: "8px", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>
            )}
          </button>
          <button onClick={openMap} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "none", border: "none", flex: 1, fontFamily: "inherit" }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>🗺️</span>
            <span style={{ fontSize: "9px", color: "rgba(238,240,247,0.4)", fontWeight: "600", letterSpacing: "0.04em" }}>{t("nav.map")}</span>
          </button>
          <button onClick={openSafetyTips} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", background: "none", border: "none", flex: 1, fontFamily: "inherit" }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>💡</span>
            <span style={{ fontSize: "9px", color: "rgba(238,240,247,0.4)", fontWeight: "600", letterSpacing: "0.04em" }}>{t("dashboard.bottomNavTips")}</span>
          </button>
        </nav>
      )}

      {modalView && (
        <div
          style={{
            position: "fixed",
            top: isMobile ? "56px" : 0,
            left: isMobile ? 0 : "260px",
            right: 0,
            bottom: isMobile ? "64px" : 0,
            zIndex: 150,
            overflowY: "auto",
            background: "#080c14",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
          }}
        >
          <button
            onClick={() => setModalView(null)}
            aria-label={language === "tl" ? "Isara" : "Close"}
            style={{
              position: "fixed",
              top: isMobile ? "68px" : "16px",
              right: "16px",
              zIndex: 160,
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(15,21,33,0.92)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#eef0f7",
              fontSize: "16px",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
            }}
          >
            <FaTimes />
          </button>

          {modalView === "safetytips" && <CitizenSafetyTips />}
          {modalView === "alerts" && <CitizenAlertsPage />}

          {modalView === "report" && (
            <CitizenReport
              onBack={() => setModalView(null)}
              onViewHistory={() => navigate("/citizen/history")}
              onViewReport={(id) => openReportDetail(id)}
            />
          )}

          {modalView === "reportdetail" && selectedReportId && (
            <CitizenReportDetail
              reportId={selectedReportId}
              onBack={() => setModalView(null)}
              onViewHistory={() => navigate("/citizen/history")}
            />
          )}

          {modalView === "map" && (
            <CitizenMap onBack={() => setModalView(null)} />
          )}
        </div>
      )}

    </div>
  );
}
