// src/citizen/CitizenHistory.tsx
// ✅ FIXED:
//   - Query now uses .eq("user_id", ...) — matches Dashboard, returns correct reports
//   - Route link now uses /citizen/history/:id — matches CitizenReportDetail route
//   - Removed dead citizen_id column reference
//   - Enhanced design: Syne + DM Sans, cleaner cards, better empty state

import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import { Link } from "react-router-dom";
import {
  FaFileAlt, FaClock, FaSpinner, FaCheckCircle,
  FaExclamationCircle, FaChevronRight, FaInbox,
} from "react-icons/fa";
import pagesBackground from "../assets/pagesbackground.png";

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; tip: string }> = {
  "pending":     { label: "Pending",     color: "#FFB400", bg: "rgba(255,180,0,0.1)",   tip: "Awaiting responder review"                    },
  "in-progress": { label: "In Progress", color: "#6382FF", bg: "rgba(99,130,255,0.1)",  tip: "A responder is currently handling this report" },
  "resolved":    { label: "Resolved",    color: "#20C997", bg: "rgba(32,201,151,0.1)",  tip: "This report has been resolved"                 },
};

const TYPE_COLORS: Record<string, string> = {
  fire:    "#FF5C5C",
  flood:   "#6382FF",
  crime:   "#FF9F43",
  medical: "#20C997",
  accident:"#FFB400",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ch {
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    color: #e8ecf5;
    position: relative;
    overflow-x: hidden;
    background: #060a12;
  }

  /* Background */
  .ch-bg {
    position: fixed; inset: 0; z-index: 0;
    background-size: cover; background-position: center;
  }
  .ch-bg::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(165deg, rgba(6,10,18,.95) 0%, rgba(6,10,18,.82) 45%, rgba(6,10,18,.95) 100%);
  }
  .ch-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
  .ch-glow-1 { position: absolute; width: 650px; height: 650px; border-radius: 50%; background: radial-gradient(circle, rgba(32,201,151,.06) 0%, transparent 65%); top: -220px; left: -120px; }
  .ch-glow-2 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,130,255,.05) 0%, transparent 65%); bottom: -150px; right: -70px; }

  .ch-inner { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; padding: 0 28px 100px; }

  /* Nav */
  .ch-nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 0 0; }
  .ch-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
  .ch-logo-text { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: -.01em; color: #e8ecf5; }
  .ch-logo-text span { color: #20C997; }
  .ch-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 12px; font-weight: 500; color: rgba(232,236,245,.35);
    text-decoration: none; border: 1px solid rgba(255,255,255,.07);
    border-radius: 8px; padding: 8px 15px;
    background: rgba(12,18,30,.85); transition: all .2s;
    backdrop-filter: blur(12px);
  }
  .ch-back:hover { color: #e8ecf5; border-color: rgba(255,255,255,.15); background: rgba(18,25,42,.9); }

  /* Hero */
  .ch-hero { margin-top: 50px; margin-bottom: 34px; }
  .ch-hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 10.5px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
    color: #20C997; margin-bottom: 14px;
  }
  .ch-hero-tag-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #20C997; box-shadow: 0 0 9px #20C997;
    animation: ch-pulse 2.4s ease infinite;
  }
  @keyframes ch-pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.7);} }
  .ch-hero-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 800; line-height: 1.04;
    letter-spacing: -.04em; color: #e8ecf5; margin-bottom: 8px;
  }
  .ch-hero-heading em { font-style: normal; color: #20C997; }
  .ch-hero-sub { font-size: 13.5px; color: rgba(232,236,245,.3); font-weight: 300; }

  /* Stats */
  .ch-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 34px; }
  @media(max-width:680px){ .ch-stats { grid-template-columns: repeat(2,1fr); } }
  .ch-stat {
    background: rgba(12,18,30,.85); border: 1px solid rgba(255,255,255,.06);
    border-radius: 16px; padding: 22px 20px;
    position: relative; overflow: hidden;
    transition: border-color .25s, transform .25s;
    backdrop-filter: blur(18px);
  }
  .ch-stat:hover { border-color: rgba(255,255,255,.12); transform: translateY(-3px); }
  .ch-stat-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--sc); opacity: .5; }
  .ch-stat-glow { position: absolute; top: -30px; right: -30px; width: 90px; height: 90px; border-radius: 50%; background: radial-gradient(circle, var(--sc) 0%, transparent 70%); opacity: .06; pointer-events: none; }
  .ch-stat-label { font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: rgba(232,236,245,.22); margin-bottom: 14px; }
  .ch-stat-row { display: flex; align-items: flex-end; justify-content: space-between; }
  .ch-stat-value { font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800; line-height: 1; color: var(--sc); letter-spacing: -.05em; }
  .ch-stat-icon { font-size: 18px; color: var(--sc); opacity: .15; }

  /* Section head */
  .ch-sec { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
  .ch-sec-label { font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: rgba(232,236,245,.22); white-space: nowrap; }
  .ch-sec-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,.08), transparent); }
  .ch-sec-count {
    font-size: 10.5px; font-weight: 600; color: rgba(232,236,245,.28);
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
    border-radius: 20px; padding: 3px 11px; white-space: nowrap;
  }

  /* Report list */
  .ch-list { display: flex; flex-direction: column; gap: 8px; }

  .ch-card {
    background: rgba(12,18,30,.85); border: 1px solid rgba(255,255,255,.06);
    border-radius: 14px; overflow: hidden;
    text-decoration: none; color: inherit;
    display: flex; align-items: stretch;
    transition: border-color .22s, transform .22s, background .22s;
    backdrop-filter: blur(18px);
  }
  .ch-card:hover { border-color: rgba(255,255,255,.13); transform: translateX(4px); background: rgba(18,25,42,.9); }
  .ch-card-accent { width: 3px; flex-shrink: 0; background: var(--cc); opacity: .55; }
  .ch-card-body { display: flex; align-items: center; gap: 14px; padding: 16px 20px; flex: 1; min-width: 0; }
  .ch-card-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }
  .ch-card-info { flex: 1; min-width: 0; }
  .ch-card-desc {
    font-family: 'Syne', sans-serif; font-size: 13.5px; font-weight: 700;
    color: #e8ecf5; letter-spacing: -.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px;
  }
  .ch-card-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ch-card-date { font-size: 11px; color: rgba(232,236,245,.25); }
  .ch-card-type {
    font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: capitalize;
    border-radius: 5px; padding: 2px 8px;
  }
  .ch-card-right { display: flex; align-items: center; gap: 12px; padding-right: 20px; flex-shrink: 0; }
  .ch-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10.5px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
    border-radius: 20px; padding: 4px 11px; cursor: help;
  }
  .ch-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .ch-chevron { color: rgba(232,236,245,.2); font-size: 10px; transition: color .2s, transform .2s; }
  .ch-card:hover .ch-chevron { color: rgba(232,236,245,.5); transform: translateX(2px); }

  /* Empty */
  .ch-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 72px 24px; gap: 10px; text-align: center;
    background: rgba(12,18,30,.85); border: 1px solid rgba(255,255,255,.06);
    border-radius: 20px; backdrop-filter: blur(18px);
  }
  .ch-empty-icon {
    width: 58px; height: 58px; border-radius: 16px;
    background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; color: rgba(232,236,245,.22); margin-bottom: 4px;
  }
  .ch-empty-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: rgba(232,236,245,.45); }
  .ch-empty-sub { font-size: 13px; color: rgba(232,236,245,.22); max-width: 280px; line-height: 1.65; }
  .ch-empty-btn {
    margin-top: 8px; font-size: 13px; font-weight: 600; color: #20C997;
    text-decoration: none; border: 1px solid rgba(32,201,151,.28); border-radius: 9px;
    padding: 10px 22px; background: rgba(32,201,151,.06);
    display: inline-flex; align-items: center; gap: 7px; transition: all .2s;
  }
  .ch-empty-btn:hover { background: rgba(32,201,151,.13); border-color: rgba(32,201,151,.45); }

  /* Loading */
  .ch-loading {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; padding: 72px;
    color: rgba(232,236,245,.25); font-size: 13px;
    background: rgba(12,18,30,.85); border: 1px solid rgba(255,255,255,.06);
    border-radius: 20px; backdrop-filter: blur(18px);
  }
  .ch-spin {
    width: 16px; height: 16px;
    border: 2px solid rgba(32,201,151,.18); border-top-color: #20C997;
    border-radius: 50%; animation: ch-spin .75s linear infinite;
  }
  @keyframes ch-spin { to { transform: rotate(360deg); } }

  @media(max-width:600px){
    .ch-card-type { display: none; }
    .ch-card-right { gap: 8px; padding-right: 14px; }
  }
`;

export default function CitizenHistory() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .eq("user_id", user.id)                        // ✅ FIXED: was citizen_id — now matches Dashboard
          .order("created_at", { ascending: false });
        if (!error) setReports(data || []);
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  const total    = reports.length;
  const pending  = reports.filter(r => r.status === "pending").length;
  const inProg   = reports.filter(r => r.status === "in-progress").length;
  const resolved = reports.filter(r => r.status === "resolved").length;

  return (
    <>
      <style>{CSS}</style>
      <div className="ch">
        <div className="ch-bg" style={{ backgroundImage: `url(${pagesBackground})` }} />
        <div className="ch-glow"><div className="ch-glow-1" /><div className="ch-glow-2" /></div>

        <div className="ch-inner">

          {/* Nav */}
          <nav className="ch-nav">
            <Link to="/" className="ch-logo">
              <span className="ch-logo-text">CITI<span>ZEN</span></span>
            </Link>
            <Link to="/citizen/dashboard" className="ch-back">← Dashboard</Link>
          </nav>

          {/* Hero */}
          <section className="ch-hero">
            <div className="ch-hero-tag"><span className="ch-hero-tag-dot" />My Reports</div>
            <h1 className="ch-hero-heading">Report <em>History</em></h1>
            <p className="ch-hero-sub">Every incident you've submitted, in one place.</p>
          </section>

          {/* Stats */}
          <div className="ch-stats">
            {[
              { label: "Total Filed",  value: total,    color: "#e8ecf5", icon: <FaFileAlt />     },
              { label: "Pending",      value: pending,  color: "#FFB400", icon: <FaClock />       },
              { label: "In Progress",  value: inProg,   color: "#6382FF", icon: <FaSpinner />     },
              { label: "Resolved",     value: resolved, color: "#20C997", icon: <FaCheckCircle /> },
            ].map(s => (
              <div key={s.label} className="ch-stat" style={{ "--sc": s.color } as React.CSSProperties}>
                <div className="ch-stat-bar" />
                <div className="ch-stat-glow" />
                <div className="ch-stat-label">{s.label}</div>
                <div className="ch-stat-row">
                  <div className="ch-stat-value">{s.value}</div>
                  <div className="ch-stat-icon">{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Section head */}
          <div className="ch-sec">
            <span className="ch-sec-label">All Reports</span>
            <span className="ch-sec-line" />
            <span className="ch-sec-count">{total} total</span>
          </div>

          {/* List */}
          {loading ? (
            <div className="ch-loading"><div className="ch-spin" />Loading your reports…</div>
          ) : reports.length === 0 ? (
            <div className="ch-empty">
              <div className="ch-empty-icon"><FaInbox /></div>
              <div className="ch-empty-title">No reports yet</div>
              <p className="ch-empty-sub">
                You haven't submitted any incident reports. Help keep your community safe by filing one.
              </p>
              <Link to="/report" className="ch-empty-btn">
                <FaFileAlt size={12} /> File a Report
              </Link>
            </div>
          ) : (
            <div className="ch-list">
              {reports.map(report => {
                const s = STATUS_CFG[report.status] ?? {
                  label: report.status, color: "rgba(232,236,245,.5)",
                  bg: "rgba(255,255,255,.06)", tip: "",
                };
                const tc = TYPE_COLORS[report.type?.toLowerCase()] || "rgba(232,236,245,.28)";
                return (
                  <Link
                    key={report.id}
                    to={`/citizen/history/${report.id}`}   // ✅ FIXED: matches CitizenReportDetail route
                    className="ch-card"
                    style={{ "--cc": s.color } as React.CSSProperties}
                  >
                    <div className="ch-card-accent" />
                    <div className="ch-card-body">
                      <div
                        className="ch-card-icon"
                        style={{ background: `${tc}12`, border: `1px solid ${tc}25`, color: tc }}
                      >
                        <FaExclamationCircle />
                      </div>
                      <div className="ch-card-info">
                        <div className="ch-card-desc" title={report.description}>
                          {report.description || "No description"}
                        </div>
                        <div className="ch-card-meta">
                          <span className="ch-card-date">
                            {new Date(report.created_at).toLocaleDateString("en-PH", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                          {report.type && (
                            <span
                              className="ch-card-type"
                              style={{ color: tc, background: `${tc}10`, border: `1px solid ${tc}22` }}
                            >
                              {report.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ch-card-right">
                      <span
                        className="ch-status"
                        style={{ color: s.color, background: s.bg }}
                        title={s.tip}
                      >
                        <span className="ch-status-dot" />{s.label}
                      </span>
                      <FaChevronRight className="ch-chevron" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}