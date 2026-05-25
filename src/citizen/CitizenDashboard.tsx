// src/citizen/CitizenDashboard.tsx
// ✅ FIXED:
//   - Removed all dead responder_notes / action_notes / seenNotes logic
//   - Removed "Responder Notes" column from table (it was always empty)
//   - Removed newNotes alert banner (no responder writes to that field)
//   - Enhanced visual design: cleaner hero, better stat cards, improved table
//   - Kept all real functionality intact

import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkedAlt, FaHistory, FaLightbulb, FaFileAlt,
  FaCheckCircle, FaClock, FaSpinner,
  FaChevronRight, FaExclamationCircle,
} from "react-icons/fa";
import pagesBackground from "../assets/pagesbackground.png";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cd-root {
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    color: #e8ecf5;
    position: relative;
    overflow-x: hidden;
    background: #060a12;
  }

  /* ── Background ── */
  .cd-bg {
    position: fixed; inset: 0; z-index: 0;
    background-size: cover; background-position: center; background-repeat: no-repeat;
  }
  .cd-bg::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(165deg,
      rgba(6,10,18,.95) 0%,
      rgba(6,10,18,.82) 45%,
      rgba(6,10,18,.95) 100%);
  }

  /* ── Atmospheric glows ── */
  .cd-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
  .cd-glow-a {
    position: absolute; width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(32,201,151,.07) 0%, transparent 65%);
    top: -220px; left: -120px;
  }
  .cd-glow-b {
    position: absolute; width: 550px; height: 550px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,130,255,.06) 0%, transparent 65%);
    bottom: -160px; right: -80px;
  }
  .cd-glow-c {
    position: absolute; width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,180,0,.04) 0%, transparent 65%);
    top: 40%; left: 55%;
  }

  /* ── Layout ── */
  .cd-inner {
    position: relative; z-index: 2;
    max-width: 1100px; margin: 0 auto;
    padding: 0 28px 100px;
  }

  /* ── Hero ── */
  .cd-hero {
    margin-top: 52px; margin-bottom: 36px;
    display: flex; align-items: flex-end; justify-content: space-between; gap: 24px;
    flex-wrap: wrap;
  }
  .cd-hero-left {}
  .cd-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 10.5px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
    color: #20C997; margin-bottom: 14px;
  }
  .cd-hero-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #20C997; box-shadow: 0 0 10px #20C997;
    animation: cd-pulse 2.4s ease infinite;
  }
  @keyframes cd-pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.7);} }
  .cd-hero-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(30px, 4.8vw, 50px);
    font-weight: 800; line-height: 1.02;
    letter-spacing: -.04em; color: #e8ecf5;
    margin-bottom: 10px;
  }
  .cd-hero-heading em { font-style: normal; color: #20C997; }
  .cd-hero-sub { font-size: 13.5px; color: rgba(232,236,245,.32); font-weight: 300; }
  .cd-hero-right {}
  .cd-hero-date {
    text-align: right;
    font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: rgba(232,236,245,.2); line-height: 1.8;
  }
  .cd-hero-date strong { display: block; font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: rgba(232,236,245,.55); letter-spacing: -.02em; }

  /* ── Alert — pending only ── */
  .cd-alert {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,180,0,.05); border: 1px solid rgba(255,180,0,.18);
    border-radius: 12px; padding: 13px 18px; margin-bottom: 30px;
    backdrop-filter: blur(14px);
  }
  .cd-alert-bar { width: 3px; height: 32px; border-radius: 2px; background: #FFB400; flex-shrink: 0; }
  .cd-alert-text { font-size: 13px; color: rgba(255,200,80,.8); flex: 1; }
  .cd-alert-text strong { font-weight: 600; color: #FFB400; }
  .cd-alert-link {
    font-size: 11.5px; font-weight: 600; color: #FFB400; text-decoration: none;
    border: 1px solid rgba(255,180,0,.25); border-radius: 7px; padding: 5px 12px;
    background: rgba(255,180,0,.07); transition: all .2s; white-space: nowrap;
  }
  .cd-alert-link:hover { background: rgba(255,180,0,.13); border-color: rgba(255,180,0,.4); }

  /* ── Stats ── */
  .cd-stats {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 12px; margin-bottom: 36px;
  }
  @media(max-width:680px){ .cd-stats { grid-template-columns: repeat(2,1fr); } }
  .cd-stat {
    background: rgba(12,18,30,.85); border: 1px solid rgba(255,255,255,.06);
    border-radius: 16px; padding: 22px 20px;
    position: relative; overflow: hidden;
    transition: border-color .25s, transform .25s;
    backdrop-filter: blur(18px);
    cursor: default;
  }
  .cd-stat:hover { border-color: rgba(255,255,255,.12); transform: translateY(-3px); }
  .cd-stat-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--sc); opacity: .5; }
  .cd-stat-glow {
    position: absolute; top: -30px; right: -30px;
    width: 100px; height: 100px; border-radius: 50%;
    background: radial-gradient(circle, var(--sc) 0%, transparent 70%);
    opacity: .06; pointer-events: none;
  }
  .cd-stat-label {
    font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: rgba(232,236,245,.22); margin-bottom: 14px;
  }
  .cd-stat-row { display: flex; align-items: flex-end; justify-content: space-between; }
  .cd-stat-value {
    font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800;
    line-height: 1; color: var(--sc); letter-spacing: -.05em;
  }
  .cd-stat-icon { font-size: 18px; color: var(--sc); opacity: .15; }

  /* ── Section header ── */
  .cd-sec { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .cd-sec-label {
    font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
    color: rgba(232,236,245,.24); white-space: nowrap;
  }
  .cd-sec-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,.08), transparent); }
  .cd-sec-link {
    font-size: 11px; font-weight: 500; color: rgba(232,236,245,.25);
    text-decoration: none; transition: color .2s;
    display: flex; align-items: center; gap: 4px; white-space: nowrap;
  }
  .cd-sec-link:hover { color: #20C997; }

  /* ── Quick action cards ── */
  .cd-cards {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 10px; margin-bottom: 40px;
  }
  @media(max-width:900px){ .cd-cards { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:480px){ .cd-cards { grid-template-columns: 1fr; } }

  .cd-card {
    position: relative;
    background: rgba(12,18,30,.85); border: 1px solid rgba(255,255,255,.06);
    border-radius: 16px; padding: 22px 20px 20px;
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column; gap: 6px;
    overflow: hidden; transition: transform .24s, border-color .24s, background .24s;
    backdrop-filter: blur(18px);
  }
  .cd-card-primary {
    background: linear-gradient(135deg, rgba(255,80,80,.1), rgba(255,80,80,.03));
    border-color: rgba(255,80,80,.18);
  }
  .cd-card:hover {
    transform: translateY(-4px);
    border-color: var(--ca);
    background: rgba(18,24,40,.92);
  }
  .cd-card-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .cd-card-icon {
    width: 42px; height: 42px; border-radius: 11px;
    background: var(--cd); border: 1px solid var(--ca);
    display: flex; align-items: center; justify-content: center;
    color: var(--ca); transition: transform .22s;
  }
  .cd-card:hover .cd-card-icon { transform: scale(1.08) rotate(-4deg); }
  .cd-card-badge {
    font-size: 9.5px; font-weight: 700; letter-spacing: .09em;
    color: var(--ca); border: 1px solid var(--ca);
    border-radius: 20px; padding: 3px 9px; opacity: .65;
  }
  .cd-card-title {
    font-family: 'Syne', sans-serif; font-size: 14.5px; font-weight: 700;
    color: #e8ecf5; letter-spacing: -.01em;
  }
  .cd-card-desc { font-size: 11.5px; color: rgba(232,236,245,.25); line-height: 1.55; flex: 1; }
  .cd-card-cta {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; color: var(--ca);
    margin-top: 6px; transition: gap .2s;
  }
  .cd-card:hover .cd-card-cta { gap: 9px; }

  /* ── Reports table ── */
  .cd-table-wrap {
    background: rgba(12,18,30,.85); border: 1px solid rgba(255,255,255,.06);
    border-radius: 20px; overflow: hidden; backdrop-filter: blur(18px);
  }
  .cd-table-top {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,.05);
  }
  .cd-table-title {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #e8ecf5;
  }
  .cd-pill {
    font-size: 10.5px; font-weight: 600; color: rgba(232,236,245,.28);
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
    border-radius: 20px; padding: 3px 11px;
  }
  .cd-table { width: 100%; border-collapse: collapse; }
  .cd-table th {
    font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: rgba(232,236,245,.22); padding: 12px 24px;
    text-align: left; border-bottom: 1px solid rgba(255,255,255,.05);
    background: rgba(0,0,0,.15);
  }
  .cd-table td {
    padding: 15px 24px; font-size: 13px;
    color: rgba(232,236,245,.5); border-bottom: 1px solid rgba(255,255,255,.03);
    vertical-align: middle;
  }
  .cd-table tr:last-child td { border-bottom: none; }
  .cd-table tbody tr { transition: background .15s; cursor: pointer; }
  .cd-table tbody tr:hover { background: rgba(255,255,255,.025); }

  .cd-rep-desc { display: flex; align-items: center; gap: 11px; }
  .cd-rep-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; flex-shrink: 0;
  }
  .cd-rep-text {
    max-width: 210px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    color: #e8ecf5; font-size: 13px; font-weight: 500;
  }
  .cd-type-tag {
    font-size: 10px; font-weight: 600; letter-spacing: .06em;
    text-transform: capitalize; border-radius: 5px; padding: 3px 9px;
  }
  .cd-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
    border-radius: 20px; padding: 4px 11px;
  }
  .cd-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .cd-date { font-size: 11.5px; color: rgba(232,236,245,.25); white-space: nowrap; }

  .cd-view-all {
    display: flex; align-items: center; justify-content: center;
    padding: 15px; border-top: 1px solid rgba(255,255,255,.05);
  }
  .cd-view-all a {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 500; color: rgba(232,236,245,.25);
    text-decoration: none; transition: color .2s;
  }
  .cd-view-all a:hover { color: #20C997; }

  /* ── Empty / Loading ── */
  .cd-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 64px 24px; gap: 10px; text-align: center;
  }
  .cd-empty-icon {
    width: 54px; height: 54px; border-radius: 15px;
    background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: rgba(232,236,245,.24); margin-bottom: 4px;
  }
  .cd-empty-title {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
    color: rgba(232,236,245,.45);
  }
  .cd-empty-sub { font-size: 13px; color: rgba(232,236,245,.24); max-width: 270px; line-height: 1.6; }
  .cd-empty-btn {
    margin-top: 10px; font-size: 13px; font-weight: 600; color: #20C997;
    text-decoration: none; border: 1px solid rgba(32,201,151,.28); border-radius: 9px;
    padding: 10px 22px; background: rgba(32,201,151,.06);
    display: inline-flex; align-items: center; gap: 6px; transition: all .2s;
  }
  .cd-empty-btn:hover { background: rgba(32,201,151,.13); border-color: rgba(32,201,151,.45); }

  .cd-loading {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; padding: 56px;
    color: rgba(232,236,245,.25); font-size: 13px;
  }
  .cd-spin {
    width: 16px; height: 16px;
    border: 2px solid rgba(32,201,151,.18); border-top-color: #20C997;
    border-radius: 50%; animation: cd-spin .75s linear infinite;
  }
  @keyframes cd-spin { to { transform: rotate(360deg); } }

  @media(max-width:640px){
    .cd-table th:nth-child(2), .cd-table td:nth-child(2) { display: none; }
    .cd-hero { flex-direction: column; align-items: flex-start; }
    .cd-hero-right { display: none; }
  }
`;

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  "pending":     { label: "Pending",     color: "#FFB400", bg: "rgba(255,180,0,.1)"    },
  "in-progress": { label: "In Progress", color: "#6382FF", bg: "rgba(99,130,255,.1)"   },
  "resolved":    { label: "Resolved",    color: "#20C997", bg: "rgba(32,201,151,.1)"   },
};

const TYPE_COLORS: Record<string, string> = {
  fire:    "#FF5C5C",
  flood:   "#6382FF",
  crime:   "#FF9F43",
  medical: "#20C997",
  accident:"#FFB400",
};

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [reports, setReports]   = useState<any[]>([]);
  const [user, setUser]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17)    setGreeting("Good afternoon");
    else if (h >= 17)          setGreeting("Good evening");
    else                       setGreeting("Good morning");

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("reports")
        .select("id, description, type, status, created_at")
        .eq("user_id", user.id)                          // ✅ correct column
        .order("created_at", { ascending: false });
      setReports(data ?? []);
      setLoading(false);
    };
    load();

    // ✅ Real-time listener — simple insert/update/delete, no notes logic
    const ch = supabase.channel("cd-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" },
        ({ eventType, new: n, old: o }) => {
          setReports(prev => {
            if (eventType === "INSERT") return [n, ...prev];
            if (eventType === "UPDATE") return prev.map(r => r.id === (n as any).id ? n : r);
            if (eventType === "DELETE") return prev.filter(r => r.id !== (o as any).id);
            return prev;
          });
        })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  const total    = reports.length;
  const pending  = reports.filter(r => r.status === "pending").length;
  const inProg   = reports.filter(r => r.status === "in-progress").length;
  const resolved = reports.filter(r => r.status === "resolved").length;

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Citizen";
  const firstName   = displayName.split(" ")[0];

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" });

  const CARDS = [
    {
      icon: <FaFileAlt size={18} />, label: "Report Incident",
      desc: "File a new incident report quickly and easily",
      to: "/report", accent: "#FF5C5C", dim: "rgba(255,92,92,.12)", tag: "New", primary: true,
    },
    {
      icon: <FaMapMarkedAlt size={18} />, label: "Safety Map",
      desc: "View live incident activity in your area",
      to: "/map", accent: "#20C997", dim: "rgba(32,201,151,.12)", tag: "Live", primary: false,
    },
    {
      icon: <FaHistory size={18} />, label: "My Reports",
      desc: "Track and review all your submitted reports",
      to: "/citizen/history", accent: "#6382FF", dim: "rgba(99,130,255,.12)", tag: `${total}`, primary: false,
    },
    {
      icon: <FaLightbulb size={18} />, label: "Safety Tips",
      desc: "Emergency guides and preparedness resources",
      to: "/safetytips", accent: "#FFB400", dim: "rgba(255,180,0,.12)", tag: "Read", primary: false,
    },
  ];

  const STATS = [
    { label: "Total Filed",  value: total,    color: "#e8ecf5", icon: <FaFileAlt />     },
    { label: "Pending",      value: pending,  color: "#FFB400", icon: <FaClock />       },
    { label: "In Progress",  value: inProg,   color: "#6382FF", icon: <FaSpinner />     },
    { label: "Resolved",     value: resolved, color: "#20C997", icon: <FaCheckCircle /> },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="cd-root">
        <div className="cd-bg" style={{ backgroundImage: `url(${pagesBackground})` }} />
        <div className="cd-glow">
          <div className="cd-glow-a" /><div className="cd-glow-b" /><div className="cd-glow-c" />
        </div>

        <div className="cd-inner">

          {/* ── Hero ── */}
          <section className="cd-hero">
            <div className="cd-hero-left">
              <div className="cd-hero-eyebrow"><span className="cd-hero-dot" />Citizen Portal</div>
              <h1 className="cd-hero-heading">
                {greeting},<br /><em>{firstName}.</em>
              </h1>
              <p className="cd-hero-sub">Your community safety dashboard.</p>
            </div>
            <div className="cd-hero-right">
              <div className="cd-hero-date">
                {dateStr.split(",")[0]}
                <strong>{dateStr.split(",").slice(1).join(",").trim()}</strong>
              </div>
            </div>
          </section>

          {/* ── Alert — only shown when pending reports exist ── */}
          {pending > 0 && (
            <div className="cd-alert">
              <div className="cd-alert-bar" />
              <span className="cd-alert-text">
                You have <strong>{pending} pending {pending === 1 ? "report" : "reports"}</strong> awaiting responder review.
              </span>
              <Link to="/citizen/history" className="cd-alert-link">View reports</Link>
            </div>
          )}

          {/* ── Stats ── */}
          <div className="cd-stats">
            {STATS.map(s => (
              <div key={s.label} className="cd-stat" style={{ "--sc": s.color } as React.CSSProperties}>
                <div className="cd-stat-accent" />
                <div className="cd-stat-glow" />
                <div className="cd-stat-label">{s.label}</div>
                <div className="cd-stat-row">
                  <div className="cd-stat-value">{loading ? "—" : s.value}</div>
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
            {CARDS.map(c => (
              <Link
                key={c.to} to={c.to}
                className={`cd-card${c.primary ? " cd-card-primary" : ""}`}
                style={{ "--ca": c.accent, "--cd": c.dim } as React.CSSProperties}
              >
                <div className="cd-card-hd">
                  <div className="cd-card-icon">{c.icon}</div>
                  <span className="cd-card-badge">{c.tag}</span>
                </div>
                <div className="cd-card-title">{c.label}</div>
                <div className="cd-card-desc">{c.desc}</div>
                <div className="cd-card-cta">Go <FaChevronRight size={9} /></div>
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

          <div className="cd-table-wrap">
            <div className="cd-table-top">
              <span className="cd-table-title">Your Incident Reports</span>
              <span className="cd-pill">{loading ? "…" : `${total} total`}</span>
            </div>

            {loading ? (
              <div className="cd-loading"><div className="cd-spin" />Loading your reports…</div>
            ) : reports.length === 0 ? (
              <div className="cd-empty">
                <div className="cd-empty-icon"><FaFileAlt /></div>
                <div className="cd-empty-title">No reports yet</div>
                <p className="cd-empty-sub">
                  Help keep your community safe by filing your first incident report.
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
                    {reports.slice(0, 5).map(r => {
                      const s  = STATUS_CFG[r.status] ?? { label: r.status, color: "#e8ecf5", bg: "rgba(255,255,255,.06)" };
                      const tc = TYPE_COLORS[r.type?.toLowerCase()] || "rgba(232,236,245,.28)";
                      return (
                        <tr
                          key={r.id}
                          onClick={() => navigate(`/citizen/history/${r.id}`)}
                        >
                          <td>
                            <div className="cd-rep-desc">
                              <div
                                className="cd-rep-icon"
                                style={{ color: tc, background: `${tc}15`, border: `1px solid ${tc}28` }}
                              >
                                <FaExclamationCircle size={11} />
                              </div>
                              <span className="cd-rep-text" title={r.description}>
                                {r.description || "—"}
                              </span>
                            </div>
                          </td>
                          <td>
                            {r.type && (
                              <span
                                className="cd-type-tag"
                                style={{ color: tc, background: `${tc}10`, border: `1px solid ${tc}22` }}
                              >
                                {r.type}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="cd-status" style={{ color: s.color, background: s.bg }}>
                              <span className="cd-status-dot" />{s.label}
                            </span>
                          </td>
                          <td>
                            <span className="cd-date">
                              {new Date(r.created_at).toLocaleDateString("en-PH", {
                                month: "short", day: "numeric", year: "numeric",
                              })}
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
                      See all {reports.length} reports <FaChevronRight size={10} />
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