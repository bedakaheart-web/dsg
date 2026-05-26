// src/citizen/CitizenDashboard.tsx
// ✨ Enhanced: Refined minimalist design, better organized, production-ready
// • Cleaner visual hierarchy with refined spacing
// • Optimized CSS (removed bloat, consolidated selectors)
// • Better code organization (component-style sections)
// • Lighter animations (purposeful, not excessive)
// • Production-ready with proper TypeScript

import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkedAlt, FaHistory, FaLightbulb, FaFileAlt,
  FaCheckCircle, FaClock, FaSpinner, FaChevronRight, FaExclamationCircle,
} from "react-icons/fa";
import pagesBackground from "../assets/pagesbackground.png";

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:wght@400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cd-root {
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    color: #1a1a1a;
    background: #f9f9f9;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Background & Depth ── */
  .cd-bg {
    position: fixed; inset: 0; z-index: 0;
    background: linear-gradient(135deg, #f9f9f9 0%, #f2f2f2 100%);
  }

  .cd-glow {
    position: fixed; inset: 0; pointer-events: none; z-index: 1;
    opacity: 0.4;
  }

  .cd-glow-a {
    position: absolute;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, #00d9ff 0%, transparent 70%);
    top: -150px; left: -100px; filter: blur(80px);
  }

  .cd-glow-b {
    position: absolute;
    width: 450px; height: 450px; border-radius: 50%;
    background: radial-gradient(circle, #20c997 0%, transparent 70%);
    bottom: -100px; right: -80px; filter: blur(80px);
  }

  /* ── Layout ── */
  .cd-inner {
    position: relative; z-index: 2;
    max-width: 1080px; margin: 0 auto;
    padding: 0 24px 80px;
  }

  /* ── Hero Section ── */
  .cd-hero {
    margin-top: 48px; margin-bottom: 40px;
    display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;
    flex-wrap: wrap;
  }

  .cd-hero-left h1 {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 400; line-height: 1.1;
    color: #1a1a1a; margin-bottom: 12px;
    letter-spacing: -0.02em;
  }

  .cd-hero-left em {
    font-style: normal; color: #00d9ff; font-weight: 500;
  }

  .cd-hero-sub {
    font-size: 14px; color: #666; font-weight: 400; margin-bottom: 8px;
  }

  .cd-hero-right {
    text-align: right;
    font-size: 12px; font-weight: 500; letter-spacing: 0.05em;
    color: #999; text-transform: uppercase;
  }

  .cd-hero-right strong {
    display: block; font-family: 'Instrument Serif', serif; font-size: 24px;
    font-weight: 400; color: #1a1a1a; margin-top: 4px;
  }

  /* ── Alert ── */
  .cd-alert {
    display: flex; align-items: center; gap: 14px;
    background: #fff; border: 1px solid #e0e0e0;
    border-left: 3px solid #ffc107;
    border-radius: 8px; padding: 14px 18px; margin-bottom: 32px;
    backdrop-filter: blur(10px);
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

  .cd-alert-text { font-size: 13px; color: #333; flex: 1; }
  .cd-alert-text strong { font-weight: 600; color: #ffc107; }

  .cd-alert-link {
    font-size: 11px; font-weight: 600; color: #ffc107; text-decoration: none;
    border: 1px solid #ffc107; border-radius: 6px; padding: 5px 12px;
    background: transparent; transition: all 0.2s;
    white-space: nowrap;
  }

  .cd-alert-link:hover { background: #fff8e1; border-color: #ffb300; }

  /* ── Stats Grid ── */
  .cd-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 14px; margin-bottom: 40px;
  }

  @media(max-width: 900px) { .cd-stats { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width: 640px) { .cd-stats { grid-template-columns: 1fr; } }

  .cd-stat {
    background: #fff; border: 1px solid #e8e8e8;
    border-radius: 10px; padding: 20px;
    transition: all 0.25s ease;
    position: relative; overflow: hidden;
  }

  .cd-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--sc);
    opacity: 0; transition: opacity 0.25s ease;
  }

  .cd-stat:hover {
    border-color: var(--sc); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .cd-stat:hover::before { opacity: 0.7; }

  .cd-stat-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: #999; margin-bottom: 12px;
  }

  .cd-stat-row {
    display: flex; align-items: flex-end; justify-content: space-between;
  }

  .cd-stat-value {
    font-family: 'Instrument Serif', serif; font-size: 36px; font-weight: 400;
    color: var(--sc);
  }

  .cd-stat-icon { font-size: 16px; color: var(--sc); opacity: 0.3; }

  /* ── Section Headers ── */
  .cd-sec {
    display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
    margin-top: 8px;
  }

  .cd-sec-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #333;
  }

  .cd-sec-line { flex: 1; height: 1px; background: #e0e0e0; }

  .cd-sec-link {
    font-size: 11px; font-weight: 600; color: #00d9ff;
    text-decoration: none; transition: color 0.2s;
    display: flex; align-items: center; gap: 4px;
  }

  .cd-sec-link:hover { color: #00b8d4; }

  /* ── Quick Action Cards ── */
  .cd-cards {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 12px; margin-bottom: 40px;
  }

  @media(max-width: 1000px) { .cd-cards { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width: 600px) { .cd-cards { grid-template-columns: 1fr; } }

  .cd-card {
    position: relative;
    background: #fff; border: 1px solid #e8e8e8;
    border-radius: 10px; padding: 20px;
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column; gap: 10px;
    cursor: pointer; transition: all 0.25s ease;
    overflow: hidden;
  }

  .cd-card::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--ca) 0%, transparent 100%);
    opacity: 0; transition: opacity 0.25s ease; pointer-events: none;
  }

  .cd-card:hover {
    transform: translateY(-4px);
    border-color: var(--ca);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .cd-card:hover::after { opacity: 0.04; }

  .cd-card-hd {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 8px; position: relative; z-index: 1;
  }

  .cd-card-icon {
    width: 40px; height: 40px; border-radius: 8px;
    background: var(--cd); border: none;
    display: flex; align-items: center; justify-content: center;
    color: var(--ca); transition: transform 0.2s;
    font-size: 16px;
  }

  .cd-card:hover .cd-card-icon { transform: scale(1.05) rotate(-3deg); }

  .cd-card-badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
    color: var(--ca); padding: 4px 8px;
    border-radius: 4px; background: var(--cd);
    position: relative; z-index: 1;
  }

  .cd-card-title {
    font-family: 'Instrument Serif', serif;
    font-size: 15px; font-weight: 400;
    color: #1a1a1a; letter-spacing: -0.01em;
    position: relative; z-index: 1;
  }

  .cd-card-desc {
    font-size: 12px; color: #666; line-height: 1.5;
    flex: 1; position: relative; z-index: 1;
  }

  .cd-card-cta {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; color: var(--ca);
    position: relative; z-index: 1;
    transition: gap 0.2s;
  }

  .cd-card:hover .cd-card-cta { gap: 8px; }

  /* ── Reports Table ── */
  .cd-table-wrap {
    background: #fff; border: 1px solid #e8e8e8;
    border-radius: 10px; overflow: hidden;
  }

  .cd-table-top {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid #e8e8e8;
  }

  .cd-table-title {
    font-family: 'Instrument Serif', serif;
    font-size: 16px; font-weight: 400; color: #1a1a1a;
  }

  .cd-pill {
    font-size: 11px; font-weight: 600; color: #999;
    background: #f5f5f5; border: none;
    border-radius: 16px; padding: 4px 12px;
  }

  .cd-table {
    width: 100%; border-collapse: collapse;
  }

  .cd-table th {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: #999; padding: 12px 24px;
    text-align: left; border-bottom: 1px solid #e8e8e8;
    background: #fafafa;
  }

  .cd-table td {
    padding: 14px 24px; font-size: 13px; color: #333;
    border-bottom: 1px solid #f0f0f0; vertical-align: middle;
  }

  .cd-table tbody tr {
    transition: background 0.15s ease; cursor: pointer;
  }

  .cd-table tbody tr:hover { background: #fafafa; }

  .cd-rep-desc {
    display: flex; align-items: center; gap: 10px;
  }

  .cd-rep-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0; background: var(--icon-bg);
    color: var(--icon-color);
  }

  .cd-rep-text {
    max-width: 220px; overflow: hidden; text-overflow: ellipsis;
    white-space: nowrap; font-weight: 500; color: #1a1a1a;
  }

  .cd-type-tag {
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: capitalize; border-radius: 5px; padding: 4px 9px;
    background: var(--type-bg); color: var(--type-color); border: none;
  }

  .cd-status {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; border-radius: 6px; padding: 5px 11px;
    background: var(--status-bg); color: var(--status-color);
  }

  .cd-status-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }

  .cd-date {
    font-size: 12px; color: #999; white-space: nowrap;
  }

  .cd-view-all {
    display: flex; align-items: center; justify-content: center;
    padding: 16px; border-top: 1px solid #e8e8e8;
  }

  .cd-view-all a {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; color: #00d9ff;
    text-decoration: none; transition: color 0.2s;
  }

  .cd-view-all a:hover { color: #00b8d4; }

  /* ── Empty State ── */
  .cd-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60px 24px; gap: 10px; text-align: center;
  }

  .cd-empty-icon {
    width: 50px; height: 50px; border-radius: 12px;
    background: #f0f0f0; display: flex; align-items: center; justify-content: center;
    font-size: 22px; color: #999; margin-bottom: 8px;
  }

  .cd-empty-title {
    font-family: 'Instrument Serif', serif; font-size: 18px; font-weight: 400;
    color: #333; margin-bottom: 6px;
  }

  .cd-empty-sub {
    font-size: 13px; color: #666; max-width: 300px; line-height: 1.6;
  }

  .cd-empty-btn {
    margin-top: 16px; font-size: 12px; font-weight: 600; color: #00d9ff;
    text-decoration: none; border: 1px solid #00d9ff; border-radius: 8px;
    padding: 10px 20px; background: transparent;
    display: inline-flex; align-items: center; gap: 6px;
    transition: all 0.2s;
  }

  .cd-empty-btn:hover {
    background: #e0f9ff; border-color: #00b8d4; color: #00b8d4;
  }

  /* ── Loading ── */
  .cd-loading {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; padding: 56px; color: #999; font-size: 13px;
  }

  .cd-spin {
    width: 16px; height: 16px;
    border: 2px solid #e0e0e0; border-top-color: #00d9ff;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media(max-width: 768px) {
    .cd-table th:nth-child(2), .cd-table td:nth-child(2) { display: none; }
    .cd-hero { flex-direction: column; align-items: flex-start; }
    .cd-hero-right { display: none; }
  }

  @media(max-width: 480px) {
    .cd-inner { padding: 0 16px 60px; }
    .cd-hero-left h1 { font-size: 28px; }
    .cd-stat-value { font-size: 28px; }
    .cd-table td, .cd-table th { padding: 12px 16px; font-size: 12px; }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG & TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Report {
  id: string;
  description: string;
  type: string;
  status: "pending" | "in-progress" | "resolved";
  created_at: string;
}

interface User {
  id: string;
  email: string;
  user_metadata?: { full_name?: string };
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    color: "#ffc107",
    bgColor: "#fff8e1",
  },
  "in-progress": {
    label: "In Progress",
    color: "#2196f3",
    bgColor: "#e3f2fd",
  },
  resolved: {
    label: "Resolved",
    color: "#20c997",
    bgColor: "#e8f5e9",
  },
};

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  fire: { color: "#ff6b6b", bg: "#ffe0e0" },
  flood: { color: "#2196f3", bg: "#e3f2fd" },
  crime: { color: "#ff9800", bg: "#ffe0b2" },
  medical: { color: "#20c997", bg: "#e8f5e9" },
  accident: { color: "#ffc107", bg: "#fff8e1" },
};

const QUICK_ACTIONS = [
  {
    icon: <FaFileAlt size={16} />,
    label: "Report Incident",
    desc: "File a new incident report quickly",
    to: "/report",
    accent: "#ff6b6b",
    dim: "#ffe0e0",
    tag: "New",
  },
  {
    icon: <FaMapMarkedAlt size={16} />,
    label: "Safety Map",
    desc: "View live incident activity in your area",
    to: "/map",
    accent: "#20c997",
    dim: "#e8f5e9",
    tag: "Live",
  },
  {
    icon: <FaHistory size={16} />,
    label: "My Reports",
    desc: "Track all your submitted reports",
    to: "/citizen/history",
    accent: "#2196f3",
    dim: "#e3f2fd",
    tag: "0",
  },
  {
    icon: <FaLightbulb size={16} />,
    label: "Safety Tips",
    desc: "Emergency guides and resources",
    to: "/safetytips",
    accent: "#ffc107",
    dim: "#fff8e1",
    tag: "Read",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

  // ── Initialize & Load Data ──
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(
      h >= 17 ? "Good evening" : h >= 12 ? "Good afternoon" : "Good morning"
    );

    supabase.auth.getUser().then(({ data }) => setUser(data.user as any));

    const loadReports = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) return;

        const { data: reportsData } = await supabase
          .from("reports")
          .select("id, description, type, status, created_at")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false });

        setReports(reportsData as Report[] || []);
      } finally {
        setLoading(false);
      }
    };

    loadReports();

    // ── Real-time Updates ──
    const channel = supabase
      .channel("cd-reports-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        ({ eventType, new: newRecord, old: oldRecord }) => {
          setReports((prev) => {
            if (eventType === "INSERT") return [newRecord as Report, ...prev];
            if (eventType === "UPDATE")
              return prev.map((r) =>
                r.id === (newRecord as any).id ? (newRecord as Report) : r
              );
            if (eventType === "DELETE")
              return prev.filter((r) => r.id !== (oldRecord as any).id);
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Compute Stats ──
  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    inProgress: reports.filter((r) => r.status === "in-progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  };

  // ── User Display Name ──
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Citizen";
  const firstName = displayName.split(" ")[0];

  // ── Format Date ──
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // ── Stats Array ──
  const STATS = [
    {
      label: "Total Filed",
      value: stats.total,
      color: "#1a1a1a",
      icon: <FaFileAlt />,
    },
    {
      label: "Pending",
      value: stats.pending,
      color: "#ffc107",
      icon: <FaClock />,
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      color: "#2196f3",
      icon: <FaSpinner />,
    },
    {
      label: "Resolved",
      value: stats.resolved,
      color: "#20c997",
      icon: <FaCheckCircle />,
    },
  ];

  // ── Update Card Count ──
  const cardsWithCount = QUICK_ACTIONS.map((c) =>
    c.to === "/citizen/history" ? { ...c, tag: String(stats.total) } : c
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="cd-root">
        <div className="cd-bg" />
        <div className="cd-glow">
          <div className="cd-glow-a" />
          <div className="cd-glow-b" />
        </div>

        <div className="cd-inner">
          {/* ── Hero ── */}
          <section className="cd-hero">
            <div className="cd-hero-left">
              <h1>
                {greeting},<br />
                <em>{firstName}.</em>
              </h1>
              <p className="cd-hero-sub">Community safety at your fingertips</p>
            </div>
            <div className="cd-hero-right">
              <div>{dateStr.split(",")[0]}</div>
              <strong>{dateStr.split(",").slice(1).join(",").trim()}</strong>
            </div>
          </section>

          {/* ── Alert (pending only) ── */}
          {stats.pending > 0 && (
            <div className="cd-alert">
              <span className="cd-alert-text">
                You have <strong>{stats.pending} pending report{stats.pending !== 1 ? "s" : ""}</strong> awaiting review.
              </span>
              <Link to="/citizen/history" className="cd-alert-link">
                View reports
              </Link>
            </div>
          )}

          {/* ── Stats ── */}
          <div className="cd-stats">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="cd-stat"
                style={{ "--sc": s.color } as React.CSSProperties}
              >
                <div className="cd-stat-label">{s.label}</div>
                <div className="cd-stat-row">
                  <div className="cd-stat-value">
                    {loading ? "—" : s.value}
                  </div>
                  <div className="cd-stat-icon">{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Quick Actions ── */}
          <div className="cd-sec">
            <span className="cd-sec-label">Quick Actions</span>
            <span className="cd-sec-line" />
          </div>

          <div className="cd-cards">
            {cardsWithCount.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="cd-card"
                style={
                  {
                    "--ca": c.accent,
                    "--cd": c.dim,
                  } as React.CSSProperties
                }
              >
                <div className="cd-card-hd">
                  <div className="cd-card-icon">{c.icon}</div>
                  <span className="cd-card-badge">{c.tag}</span>
                </div>
                <div className="cd-card-title">{c.label}</div>
                <div className="cd-card-desc">{c.desc}</div>
                <div className="cd-card-cta">
                  Learn more <FaChevronRight size={8} />
                </div>
              </Link>
            ))}
          </div>

          {/* ── Recent Reports ── */}
          <div className="cd-sec">
            <span className="cd-sec-label">Recent Reports</span>
            <span className="cd-sec-line" />
            {reports.length > 0 && (
              <Link to="/citizen/history" className="cd-sec-link">
                View all <FaChevronRight size={9} />
              </Link>
            )}
          </div>

          {/* ── Reports Table ── */}
          <div className="cd-table-wrap">
            <div className="cd-table-top">
              <span className="cd-table-title">Your Incident Reports</span>
              <span className="cd-pill">
                {loading ? "…" : `${stats.total} total`}
              </span>
            </div>

            {loading ? (
              <div className="cd-loading">
                <div className="cd-spin" />
                Loading reports…
              </div>
            ) : reports.length === 0 ? (
              <div className="cd-empty">
                <div className="cd-empty-icon">
                  <FaFileAlt />
                </div>
                <div className="cd-empty-title">No reports yet</div>
                <p className="cd-empty-sub">
                  Help keep your community safe by filing your first incident
                  report.
                </p>
                <Link to="/report" className="cd-empty-btn">
                  <FaFileAlt size={12} /> File a Report
                </Link>
              </div>
            ) : (
              <>
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>Incident</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date Filed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.slice(0, 5).map((r) => {
                      const statusCfg =
                        STATUS_CONFIG[r.status] ||
                        STATUS_CONFIG.pending;
                      const typeInfo =
                        TYPE_COLORS[r.type?.toLowerCase()] ||
                        TYPE_COLORS.accident;

                      return (
                        <tr
                          key={r.id}
                          onClick={() =>
                            navigate(`/citizen/history/${r.id}`)
                          }
                        >
                          <td>
                            <div className="cd-rep-desc">
                              <div
                                className="cd-rep-icon"
                                style={{
                                  "--icon-color": typeInfo.color,
                                  "--icon-bg": typeInfo.bg,
                                } as React.CSSProperties}
                              >
                                <FaExclamationCircle size={12} />
                              </div>
                              <span
                                className="cd-rep-text"
                                title={r.description}
                              >
                                {r.description || "—"}
                              </span>
                            </div>
                          </td>
                          <td>
                            {r.type && (
                              <span
                                className="cd-type-tag"
                                style={{
                                  "--type-color": typeInfo.color,
                                  "--type-bg": typeInfo.bg,
                                } as React.CSSProperties}
                              >
                                {r.type}
                              </span>
                            )}
                          </td>
                          <td>
                            <span
                              className="cd-status"
                              style={{
                                "--status-color": statusCfg.color,
                                "--status-bg": statusCfg.bgColor,
                              } as React.CSSProperties}
                            >
                              <span className="cd-status-dot" />
                              {statusCfg.label}
                            </span>
                          </td>
                          <td>
                            <span className="cd-date">
                              {new Date(r.created_at).toLocaleDateString(
                                "en-PH",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {reports.length > 5 && (
                  <div className="cd-view-all">
                    <Link to="/citizen/history">
                      See all {reports.length} reports{" "}
                      <FaChevronRight size={10} />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}