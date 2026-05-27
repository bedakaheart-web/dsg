// src/citizen/CitizenHistoryPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaFileAlt, FaClock, FaSpinner, FaCheckCircle,
  FaExclamationCircle, FaChevronRight, FaInbox,
  FaMapMarkedAlt, FaLightbulb, FaHistory,
  FaBell, FaBars, FaTimes, FaSignOutAlt, FaArrowLeft,
  FaClipboardCheck, FaUserShield,
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
  location: string | null;
  address: string | null;
  evidence_url: string | null;
  // ── Responder resolution fields ──
  responder_id: string | null;
  responder_notes: string | null;
  action_notes: string | null;
  resolution_type: string | null;
  resolved_at: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; color: string }> = {
  fire:     { icon: "🔥", color: "#FF6B6B" },
  accident: { icon: "🚗", color: "#FFD166" },
  flood:    { icon: "🌊", color: "#7B9EFF" },
  crime:    { icon: "🚨", color: "#FF9F43" },
  medical:  { icon: "🏥", color: "#2ECC8F" },
  other:    { icon: "⚠️", color: "#8fa3be" },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:       { label: "PENDING",     color: "#FFD166", bg: "rgba(255,209,102,.12)", border: "rgba(255,209,102,.3)"  },
  "in-progress": { label: "IN PROGRESS", color: "#7B9EFF", bg: "rgba(123,158,255,.12)", border: "rgba(123,158,255,.3)"  },
  resolved:      { label: "RESOLVED",    color: "#2ECC8F", bg: "rgba(46,204,143,.12)",  border: "rgba(46,204,143,.3)"  },
};

const RESOLUTION_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  "forwarded":      { label: "Forwarded to Department",    icon: "↗", color: "#7B9EFF", bg: "rgba(123,158,255,.12)" },
  "follow-up":      { label: "Resolved — Needs Follow-Up", icon: "⟳", color: "#FFD166", bg: "rgba(255,209,102,.12)" },
  "fully-resolved": { label: "Fully Resolved",             icon: "✓", color: "#2ECC8F", bg: "rgba(46,204,143,.12)"  },
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap');

:root {
  --bg: #080c14; --surface: #0f1521; --surface-2: #161d2e;
  --border: rgba(255,255,255,0.06); --border-2: rgba(255,255,255,0.10);
  --text: #eef0f7; --text-2: rgba(238,240,247,0.55); --text-3: rgba(238,240,247,0.25);
  --green: #2ECC8F; --red: #FF6B6B; --blue: #7B9EFF; --yellow: #FFD166;
  --font-display: 'Cabinet Grotesk', sans-serif;
  --font-body: 'Instrument Sans', sans-serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeIn  { from { opacity: 0; transform: translateY(8px);   } to { opacity: 1; transform: none; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
@keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes spin    { to { transform: rotate(360deg); } }

.ch-portal {
  position: fixed; inset: 0; z-index: 9000; overflow: hidden;
  font-family: var(--font-body); color: var(--text); background: var(--bg);
  background-image: url('${pagesBackground}');
  background-size: cover; background-position: center;
  background-attachment: fixed; background-repeat: no-repeat;
}
.ch-portal::before {
  content: ''; position: fixed; inset: 0;
  background: linear-gradient(160deg, rgba(8,12,20,.92) 0%, rgba(8,12,20,.80) 50%, rgba(8,12,20,.94) 100%);
  pointer-events: none; z-index: 1;
}
.ch-shell { display: flex; height: 100%; width: 100%; position: relative; z-index: 2; }
.ch-overlay { display: none; position: fixed; inset: 0; z-index: 190; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
.ch-overlay.open { display: block; }

.ch-sidebar {
  width: 260px; flex-shrink: 0; background: rgba(15,21,33,.82); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; height: 100%; position: fixed; left: 0; top: 0; z-index: 200;
  overflow: hidden; transition: transform 0.3s ease; backdrop-filter: blur(16px);
}
.ch-logo { padding: 20px 16px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; border-bottom: 1px solid var(--border); }
.ch-logo-img  { width: 40px; height: 40px; object-fit: contain; border-radius: 8px; }
.ch-logo-name { font-size: 15px; font-weight: 700; color: var(--text); white-space: nowrap; font-family: var(--font-display); }
.ch-logo-sub  { font-size: 11px; color: var(--text-3); margin-top: 3px; display: flex; align-items: center; gap: 6px; }
.ch-pip { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: pulse 2s ease infinite; flex-shrink: 0; box-shadow: 0 0 6px var(--green); }
.ch-sidebar-close { display: none; margin-left: auto; flex-shrink: 0; background: transparent; border: 1px solid var(--border); border-radius: 6px; width: 28px; height: 28px; align-items: center; justify-content: center; color: var(--text-3); cursor: pointer; transition: all 0.2s; }
.ch-sidebar-close:hover { background: var(--surface-2); color: var(--text); }
.ch-nav-scroll { flex: 1; overflow-y: auto; padding: 8px 10px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
.ch-nav-label { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: var(--text-3); letter-spacing: 0.5px; text-transform: uppercase; padding: 12px 8px 6px; }
.ch-nav-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.ch-nav-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid transparent; font-size: 13px; font-weight: 500; color: var(--text-2); background: transparent; cursor: pointer; margin-bottom: 2px; text-align: left; transition: all 0.2s; text-decoration: none; }
.ch-nav-btn:hover  { background: rgba(46,204,143,.08); color: var(--text); border-color: var(--border); }
.ch-nav-btn.active { background: linear-gradient(135deg, var(--green) 0%, #24a97a 100%); color: #080c14; border-color: transparent; font-weight: 600; box-shadow: 0 2px 8px rgba(46,204,143,.3); }
.ch-nav-ic { font-size: 15px; flex-shrink: 0; color: var(--text-3); display: flex; align-items: center; transition: color 0.2s; }
.ch-nav-btn.active .ch-nav-ic { color: #080c14; }
.ch-badge { margin-left: auto; background: var(--red); color: white; font-size: 10px; min-width: 20px; height: 20px; border-radius: 10px; padding: 0 6px; display: flex; align-items: center; justify-content: center; font-weight: 600; }
.ch-sidebar-foot { padding: 12px 10px 16px; border-top: 1px solid var(--border); flex-shrink: 0; }
.ch-user-card { display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(8,12,20,.6); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; }
.ch-avatar    { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; background: linear-gradient(135deg, var(--green) 0%, #24a97a 100%); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 11px; color: #080c14; }
.ch-user-name   { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ch-user-status { font-size: 10px; color: var(--green); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.ch-logout-btn  { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px; background: rgba(8,12,20,.6); border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--text-2); cursor: pointer; transition: all 0.2s; }
.ch-logout-btn:hover { background: rgba(255,107,107,.12); color: var(--red); border-color: var(--red); }

.ch-main { margin-left: 260px; flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100vh; overflow-y: auto; overflow-x: hidden; position: relative; z-index: 1; }
.ch-topbar { height: 56px; display: flex; align-items: center; padding: 0 24px; background: rgba(15,21,33,.82); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; gap: 12px; flex-shrink: 0; backdrop-filter: blur(16px); }
.ch-hamburger { display: none; background: rgba(8,12,20,.6); border: 1px solid var(--border); border-radius: 6px; width: 32px; height: 32px; align-items: center; justify-content: center; color: var(--text-3); cursor: pointer; transition: all 0.2s; flex-shrink: 0; font-size: 14px; }
.ch-hamburger:hover { background: var(--surface); border-color: var(--text-2); color: var(--text); }
.ch-crumb { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-3); }
.ch-crumb-sep { color: var(--text-3); }
.ch-crumb-active { color: var(--text); font-weight: 600; }
.ch-crumb-hide { white-space: nowrap; }
.ch-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.ch-clock  { font-size: 12px; font-weight: 500; color: var(--text-2); background: rgba(8,12,20,.6); border: 1px solid var(--border); border-radius: 6px; padding: 6px 12px; white-space: nowrap; }
.ch-icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border); background: transparent; display: flex; align-items: center; justify-content: center; color: var(--text-3); cursor: pointer; font-size: 13px; transition: all 0.2s; }
.ch-icon-btn:hover { background: rgba(46,204,143,.08); color: var(--text); }

.ch-page { flex: 1; padding: 24px; overflow-x: hidden; min-width: 0; }
.ch-page > div { animation: fadeIn 0.4s ease-out both; }
.ch-page-hd { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.ch-eyebrow { font-size: 11px; color: var(--green); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.ch-eyebrow::before { content: ''; display: block; width: 20px; height: 2px; background: var(--green); }
.ch-title    { font-size: 32px; color: var(--text); letter-spacing: -0.5px; line-height: 1.1; font-weight: 900; font-family: var(--font-display); }
.ch-subtitle { font-size: 11px; color: var(--text-3); margin-top: 4px; }

.ch-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
.ch-stat { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; transition: all 0.3s; animation: fadeIn 0.5s ease-out both; backdrop-filter: blur(16px); }
.ch-stat:hover { transform: translateY(-4px); border-color: var(--green); box-shadow: 0 8px 16px rgba(46,204,143,.15); }
.ch-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--card-accent); }
.ch-stat-icon  { font-size: 18px; color: var(--card-accent); margin-bottom: 12px; opacity: 0.85; }
.ch-stat-num   { font-size: 32px; line-height: 1; margin-bottom: 6px; letter-spacing: -0.5px; font-weight: 900; color: var(--card-accent); font-family: var(--font-display); }
.ch-stat-label { font-size: 11px; color: var(--text-2); letter-spacing: 0.3px; text-transform: uppercase; font-weight: 600; }

.ch-panel { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; animation: slideIn 0.5s ease-out both; position: relative; backdrop-filter: blur(16px); }
.ch-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--green); }
.ch-panel-hd { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); background: rgba(8,12,20,.4); }
.ch-panel-title { font-size: 11px; color: var(--text-2); letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600; }
.ch-panel-tag   { font-size: 9px; color: var(--green); border: 1px solid var(--green); border-radius: 4px; padding: 3px 8px; background: rgba(46,204,143,.1); font-weight: 600; }

.ch-list { display: flex; flex-direction: column; }
.ch-row { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-bottom: 1px solid var(--border); text-decoration: none; color: inherit; transition: background 0.15s; cursor: pointer; }
.ch-row:last-child { border-bottom: none; }
.ch-row:hover { background: rgba(46,204,143,.05); }
.ch-row-icon { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 16px; background: rgba(8,12,20,.4); }
.ch-row-body { flex: 1; min-width: 0; }
.ch-row-desc { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
.ch-row-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ch-row-date { font-size: 11px; color: var(--text-3); }
.ch-row-type { font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: capitalize; border-radius: 4px; padding: 2px 8px; }
.ch-row-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ch-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 6px; padding: 4px 10px; border: 1px solid; }
.ch-pill-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.ch-chevron  { color: var(--text-3); font-size: 10px; transition: transform 0.2s; }
.ch-row:hover .ch-chevron { transform: translateX(2px); color: var(--text-2); }

/* ── Detail View ── */
.ch-detail { display: flex; flex-direction: column; gap: 16px; animation: fadeIn 0.4s ease-out both; }
.ch-back-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-3); background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 8px; padding: 8px 14px; cursor: pointer; transition: all 0.2s; text-decoration: none; width: fit-content; margin-bottom: 4px; }
.ch-back-btn:hover { color: var(--text); border-color: var(--border-2); background: rgba(255,255,255,0.06); }

.ch-detail-card { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; backdrop-filter: blur(16px); position: relative; }
.ch-detail-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--card-top); }

.ch-detail-hd { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; background: rgba(8,12,20,.4); }
.ch-detail-type-row { display: flex; align-items: center; gap: 12px; }
.ch-detail-type-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 1px solid var(--border); background: rgba(8,12,20,.5); }
.ch-detail-type-name { font-size: 20px; font-weight: 900; font-family: var(--font-display); text-transform: capitalize; }
.ch-detail-id { font-size: 10px; color: var(--text-3); margin-top: 3px; font-family: monospace; }

.ch-detail-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

.ch-detail-section-title { font-size: 10px; font-weight: 700; color: var(--text-3); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.ch-detail-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.ch-detail-field { display: flex; flex-direction: column; gap: 4px; }
.ch-detail-field-label { font-size: 10px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.4px; }
.ch-detail-field-value { font-size: 13px; color: var(--text); line-height: 1.55; }

.ch-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ── Timeline ── */
.ch-timeline { display: flex; flex-direction: column; gap: 0; }
.ch-tl-item { display: flex; gap: 14px; position: relative; }
.ch-tl-item:not(:last-child)::before { content: ''; position: absolute; left: 15px; top: 32px; bottom: 0; width: 1px; background: var(--border); }
.ch-tl-dot { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid; z-index: 1; }
.ch-tl-dot.pending    { background: rgba(255,209,102,.1);  border-color: #FFD166; color: #FFD166; }
.ch-tl-dot.progress   { background: rgba(123,158,255,.1);  border-color: #7B9EFF; color: #7B9EFF; }
.ch-tl-dot.resolved   { background: rgba(46,204,143,.1);   border-color: #2ECC8F; color: #2ECC8F; }
.ch-tl-dot.inactive   { background: rgba(255,255,255,.03); border-color: var(--border); color: var(--text-3); }
.ch-tl-content { flex: 1; padding-bottom: 20px; }
.ch-tl-label    { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.ch-tl-label.inactive { color: var(--text-3); }
.ch-tl-time     { font-size: 10px; color: var(--text-3); font-family: monospace; margin-bottom: 6px; }
.ch-tl-note     { font-size: 12px; color: var(--text-2); line-height: 1.55; background: rgba(8,12,20,.4); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; }

/* ── Resolution Box ── */
.ch-resolution { border-radius: 12px; overflow: hidden; border: 1px solid rgba(46,204,143,.3); background: rgba(46,204,143,.05); }
.ch-resolution-hd { display: flex; align-items: center; gap: 10px; padding: 14px 18px; background: rgba(46,204,143,.08); border-bottom: 1px solid rgba(46,204,143,.2); }
.ch-resolution-hd-icon { font-size: 16px; }
.ch-resolution-hd-title { font-size: 12px; font-weight: 700; color: #2ECC8F; flex: 1; text-transform: uppercase; letter-spacing: 0.4px; }
.ch-resolution-type-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid; }
.ch-resolution-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.ch-resolution-field { display: flex; flex-direction: column; gap: 6px; }
.ch-resolution-field-label { font-size: 10px; font-weight: 700; color: rgba(46,204,143,.7); text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; gap: 6px; }
.ch-resolution-field-value { font-size: 13px; color: var(--text); line-height: 1.6; background: rgba(8,12,20,.4); border: 1px solid rgba(46,204,143,.15); border-radius: 8px; padding: 12px 14px; }
.ch-resolution-divider { height: 1px; background: rgba(46,204,143,.12); }
.ch-resolution-footer { padding: 10px 18px 14px; font-size: 11px; color: rgba(46,204,143,.6); display: flex; align-items: center; gap: 6px; }

/* ── Evidence ── */
.ch-evidence { border-radius: 10px; overflow: hidden; border: 1px solid var(--border); }
.ch-evidence img  { width: 100%; max-height: 280px; object-fit: cover; display: block; cursor: zoom-in; }
.ch-evidence video { width: 100%; max-height: 280px; display: block; background: #000; }

/* ── Pending/In-Progress notice ── */
.ch-status-notice { display: flex; align-items: flex-start; gap: 14px; border-radius: 10px; padding: 16px 18px; border: 1px solid; }
.ch-status-notice.pending    { background: rgba(255,209,102,.06); border-color: rgba(255,209,102,.25); }
.ch-status-notice.in-progress { background: rgba(123,158,255,.06); border-color: rgba(123,158,255,.25); }
.ch-status-notice-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.ch-status-notice-title { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
.ch-status-notice.pending .ch-status-notice-title    { color: #FFD166; }
.ch-status-notice.in-progress .ch-status-notice-title { color: #7B9EFF; }
.ch-status-notice-text { font-size: 12px; color: var(--text-2); line-height: 1.55; }

/* ── Empty/Loading ── */
.ch-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; gap: 8px; text-align: center; }
.ch-empty-icon  { font-size: 28px; color: var(--text-3); margin-bottom: 4px; opacity: 0.4; }
.ch-empty-title { font-size: 15px; font-weight: 600; color: var(--text-2); font-family: var(--font-display); }
.ch-empty-sub   { font-size: 13px; color: var(--text-3); max-width: 280px; line-height: 1.6; }
.ch-empty-link  { margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--green); text-decoration: none; border: 1px solid var(--green); border-radius: 8px; padding: 8px 16px; background: rgba(46,204,143,.08); display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
.ch-empty-link:hover { background: rgba(46,204,143,.15); }
.ch-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 56px; color: var(--text-3); font-size: 13px; }
.ch-spinner { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--green); animation: spin 0.8s linear infinite; }

@media (max-width: 768px) {
  .ch-sidebar { transform: translateX(-100%); width: min(260px, 90vw); }
  .ch-sidebar.open { transform: translateX(0); }
  .ch-sidebar-close { display: flex; }
  .ch-hamburger { display: flex; }
  .ch-main { margin-left: 0; }
  .ch-topbar { padding: 0 16px; }
  .ch-crumb-hide { display: none; }
  .ch-page { padding: 16px; }
  .ch-title { font-size: 26px; }
  .ch-stat-grid { grid-template-columns: repeat(2, 1fr); }
  .ch-clock { display: none; }
  .ch-detail-grid { grid-template-columns: 1fr; }
}
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}
function fmtDateTime(ts: string) {
  return new Date(ts).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Detail View ─────────────────────────────────────────────────────────────

function ReportDetail({ report, onBack }: { report: Report; onBack: () => void }) {
  const tm  = TYPE_META[report.type?.toLowerCase()]   ?? TYPE_META.other;
  const sm  = STATUS_META[report.status]              ?? STATUS_META.pending;
  const rm  = report.resolution_type ? RESOLUTION_META[report.resolution_type] : null;
  const isVideo = report.evidence_url && /\.(mp4|mov|webm)/i.test(report.evidence_url);

  return (
    <div className="ch-detail">
      <button className="ch-back-btn" onClick={onBack}>
        <FaArrowLeft size={11} /> Back to Reports
      </button>

      {/* Header card */}
      <div
        className="ch-detail-card"
        style={{ "--card-top": tm.color } as React.CSSProperties}
      >
        <div className="ch-detail-hd">
          <div className="ch-detail-type-row">
            <div className="ch-detail-type-icon">{tm.icon}</div>
            <div>
              <div className="ch-detail-type-name" style={{ color: tm.color }}>{report.type}</div>
              <div className="ch-detail-id">ID: {report.id}</div>
            </div>
          </div>
          <span className="ch-pill" style={{ color: sm.color, background: sm.bg, borderColor: sm.border }}>
            <span className="ch-pill-dot" /> {sm.label}
          </span>
        </div>

        <div className="ch-detail-body">

          {/* Description + location */}
          <div>
            <div className="ch-detail-section-title">Report Details</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="ch-detail-field">
                <span className="ch-detail-field-label">Description</span>
                <span className="ch-detail-field-value">{report.description || "No description provided."}</span>
              </div>
              <div className="ch-detail-grid">
                <div className="ch-detail-field">
                  <span className="ch-detail-field-label">Location</span>
                  <span className="ch-detail-field-value">{report.address || report.location || "Not specified"}</span>
                </div>
                <div className="ch-detail-field">
                  <span className="ch-detail-field-label">Filed On</span>
                  <span className="ch-detail-field-value">{fmtDateTime(report.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence */}
          {report.evidence_url && (
            <div>
              <div className="ch-detail-section-title">Evidence</div>
              <div className="ch-evidence">
                {isVideo
                  ? <video src={report.evidence_url} controls preload="metadata" />
                  : <img src={report.evidence_url} alt="Evidence" onClick={() => window.open(report.evidence_url!, "_blank")} />
                }
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <div className="ch-detail-section-title">Report Timeline</div>
            <div className="ch-timeline">

              {/* Step 1: Filed */}
              <div className="ch-tl-item">
                <div className="ch-tl-dot resolved">✓</div>
                <div className="ch-tl-content">
                  <div className="ch-tl-label">Report Filed</div>
                  <div className="ch-tl-time">{fmtDateTime(report.created_at)}</div>
                  <div className="ch-tl-note">Your report was submitted and received by the system.</div>
                </div>
              </div>

              {/* Step 2: Claimed */}
              <div className="ch-tl-item">
                <div className={`ch-tl-dot ${report.responder_id ? "progress" : "inactive"}`}>
                  {report.responder_id ? "👤" : "○"}
                </div>
                <div className="ch-tl-content">
                  <div className={`ch-tl-label ${!report.responder_id ? "inactive" : ""}`}>
                    {report.responder_id ? "Claimed by Responder" : "Awaiting Responder"}
                  </div>
                  {!report.responder_id && (
                    <div className="ch-tl-time">Pending assignment</div>
                  )}
                  {report.responder_id && report.status === "in-progress" && (
                    <div className="ch-tl-note" style={{ borderColor: "rgba(123,158,255,.2)", background: "rgba(123,158,255,.05)" }}>
                      A responder is currently handling your report.
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Resolved */}
              <div className="ch-tl-item">
                <div className={`ch-tl-dot ${report.status === "resolved" ? "resolved" : "inactive"}`}>
                  {report.status === "resolved" ? "✓" : "○"}
                </div>
                <div className="ch-tl-content">
                  <div className={`ch-tl-label ${report.status !== "resolved" ? "inactive" : ""}`}>
                    {report.status === "resolved" ? "Resolved" : "Resolution Pending"}
                  </div>
                  {report.resolved_at && (
                    <div className="ch-tl-time">{fmtDateTime(report.resolved_at)}</div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ── RESOLUTION DETAILS from responder ── */}
          {report.status === "resolved" && (report.responder_notes || report.action_notes) && (
            <div>
              <div className="ch-detail-section-title">Responder Resolution</div>
              <div className="ch-resolution">
                <div className="ch-resolution-hd">
                  <span className="ch-resolution-hd-icon">🛡️</span>
                  <span className="ch-resolution-hd-title">✓ Resolution Summary</span>
                  {rm && (
                    <span
                      className="ch-resolution-type-pill"
                      style={{ color: rm.color, background: rm.bg, borderColor: `${rm.color}40` }}
                    >
                      {rm.icon} {rm.label}
                    </span>
                  )}
                </div>

                <div className="ch-resolution-body">
                  {report.responder_notes && (
                    <div className="ch-resolution-field">
                      <span className="ch-resolution-field-label">
                        <FaUserShield size={10} /> Response Notes
                      </span>
                      <div className="ch-resolution-field-value">{report.responder_notes}</div>
                    </div>
                  )}

                  {report.responder_notes && report.action_notes && (
                    <div className="ch-resolution-divider" />
                  )}

                  {report.action_notes && (
                    <div className="ch-resolution-field">
                      <span className="ch-resolution-field-label">
                        <FaClipboardCheck size={10} /> Action Taken
                      </span>
                      <div className="ch-resolution-field-value">{report.action_notes}</div>
                    </div>
                  )}
                </div>

                {report.resolved_at && (
                  <div className="ch-resolution-footer">
                    🕐 Resolved on {fmtDateTime(report.resolved_at)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status notices for non-resolved */}
          {report.status === "pending" && (
            <div className="ch-status-notice pending">
              <span className="ch-status-notice-icon">⏳</span>
              <div>
                <div className="ch-status-notice-title">Awaiting Responder</div>
                <p className="ch-status-notice-text">Your report has been received and is in the queue. A responder will claim and address it shortly.</p>
              </div>
            </div>
          )}

          {report.status === "in-progress" && (
            <div className="ch-status-notice in-progress">
              <span className="ch-status-notice-icon">🚨</span>
              <div>
                <div className="ch-status-notice-title">Responder On It</div>
                <p className="ch-status-notice-text">A responder has claimed your report and is currently working on it. Check back soon for the resolution update.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CitizenHistoryPage() {
  const navigate     = useNavigate();
  const { id }       = useParams<{ id: string }>();
  const clock        = usePHTClock();

  const [reports,     setReports]     = useState<Report[]>([]);
  const [user,        setUser]        = useState<any>(null);
  const [loading,     setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const fetchReports = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (u) {
        const { data, error } = await supabase
          .from("reports")
          .select("id, description, type, status, created_at, location, address, evidence_url, responder_id, responder_notes, action_notes, resolution_type, resolved_at")
          .eq("user_id", u.id)
          .order("created_at", { ascending: false });
        if (!error) setReports(data || []);
      }
      setLoading(false);
    };
    fetchReports();

    // Real-time updates so citizen sees resolution the moment responder submits
    const ch = supabase
      .channel("ch-reports-live")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "reports" },
        () => fetchReports()
      )
      .subscribe();

    return () => { supabase.removeChannel(ch); };
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

  const selectedReport = id ? reports.find(r => r.id === id) ?? null : null;

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Citizen";
  const initials    = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const statCards = [
    { label: "Total Filed",  value: stats.total,      accent: "#7B9EFF", icon: <FaFileAlt />     },
    { label: "Pending",      value: stats.pending,    accent: "#FFD166", icon: <FaClock />       },
    { label: "In Progress",  value: stats.inProgress, accent: "#FF9F43", icon: <FaSpinner />     },
    { label: "Resolved",     value: stats.resolved,   accent: "#2ECC8F", icon: <FaCheckCircle /> },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="ch-portal">
        <div className="ch-shell">

          <div className={`ch-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

          {/* ── Sidebar ── */}
          <aside className={`ch-sidebar${sidebarOpen ? " open" : ""}`}>
            <div className="ch-logo">
              <img src={dsgLogo} alt="DumaSafeGuide" className="ch-logo-img" />
              <div>
                <div className="ch-logo-name">DumaSafeGuide</div>
                <div className="ch-logo-sub"><span className="ch-pip" />CITIZEN</div>
              </div>
              <button className="ch-sidebar-close" onClick={() => setSidebarOpen(false)}><FaTimes /></button>
            </div>

            <nav className="ch-nav-scroll">
              <div className="ch-nav-label">Portal</div>
              <Link to="/citizen/dashboard" className="ch-nav-btn"><span className="ch-nav-ic"><FaHistory /></span>Overview</Link>

              <div className="ch-nav-label">Actions</div>
              <Link to="/citizen/report"    className="ch-nav-btn"><span className="ch-nav-ic"><FaFileAlt /></span>File Report</Link>
              <Link to="/citizen/history"   className="ch-nav-btn active">
                <span className="ch-nav-ic"><FaHistory /></span>My Reports
                {stats.total > 0 && <span className="ch-badge">{stats.total}</span>}
              </Link>
              <Link to="/citizen/alerts"    className="ch-nav-btn"><span className="ch-nav-ic"><FaBell /></span>Barangay Alerts</Link>
              <Link to="/citizen/map"       className="ch-nav-btn"><span className="ch-nav-ic"><FaMapMarkedAlt /></span>Safety Map</Link>
              <Link to="/citizen/safetytips" className="ch-nav-btn"><span className="ch-nav-ic"><FaLightbulb /></span>Safety Tips</Link>

              <div className="ch-nav-label">Info</div>
              <Link to="/citizen/directory" className="ch-nav-btn"><span className="ch-nav-ic">📋</span>Directory</Link>
              <Link to="/citizen/resources" className="ch-nav-btn"><span className="ch-nav-ic">📚</span>Resources</Link>
            </nav>

            <div className="ch-sidebar-foot">
              <div className="ch-user-card">
                <div className="ch-avatar">{initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="ch-user-name">{displayName}</div>
                  <div className="ch-user-status"><span className="ch-pip" />CITIZEN</div>
                </div>
              </div>
              <button className="ch-logout-btn" onClick={handleLogout}><FaSignOutAlt size={12} /> Sign Out</button>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="ch-main">
            <div className="ch-topbar">
              <button className="ch-hamburger" onClick={() => setSidebarOpen(true)}><FaBars /></button>
              <div className="ch-crumb">
                <span className="ch-crumb-hide">DUMASAFEGUIDE</span>
                <span className="ch-crumb-sep ch-crumb-hide">/</span>
                <span className="ch-crumb-hide">CITIZEN</span>
                <span className="ch-crumb-sep ch-crumb-hide">/</span>
                <span className={selectedReport ? "ch-crumb-hide" : "ch-crumb-active"} style={{ cursor: selectedReport ? "pointer" : "default" }} onClick={() => selectedReport && navigate("/citizen/history")}>My Reports</span>
                {selectedReport && <><span className="ch-crumb-sep">/</span><span className="ch-crumb-active">Report Details</span></>}
              </div>
              <div className="ch-topbar-right">
                <span className="ch-clock">{clock}</span>
                <button className="ch-icon-btn"><FaBell size={13} /></button>
              </div>
            </div>

            <div className="ch-page">
              <div>

                {/* ── Detail view ── */}
                {selectedReport ? (
                  <ReportDetail report={selectedReport} onBack={() => navigate("/citizen/history")} />
                ) : (
                  <>
                    <div className="ch-page-hd">
                      <div>
                        <div className="ch-eyebrow">Citizen Portal</div>
                        <div className="ch-title">My Reports</div>
                        <div className="ch-subtitle">ALL SUBMITTED INCIDENT REPORTS</div>
                      </div>
                    </div>

                    <div className="ch-stat-grid">
                      {statCards.map(c => (
                        <div key={c.label} className="ch-stat" style={{ "--card-accent": c.accent } as React.CSSProperties}>
                          <div className="ch-stat-icon">{c.icon}</div>
                          <div className="ch-stat-num">{loading ? "—" : c.value}</div>
                          <div className="ch-stat-label">{c.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="ch-panel">
                      <div className="ch-panel-hd">
                        <span className="ch-panel-title">All Reports</span>
                        <span className="ch-panel-tag">{loading ? "…" : `${stats.total} TOTAL`}</span>
                      </div>

                      {loading ? (
                        <div className="ch-loading"><div className="ch-spinner" /> Loading reports…</div>
                      ) : reports.length === 0 ? (
                        <div className="ch-empty">
                          <div className="ch-empty-icon"><FaInbox /></div>
                          <div className="ch-empty-title">No reports yet</div>
                          <p className="ch-empty-sub">You haven't submitted any incident reports yet.</p>
                          <Link to="/citizen/report" className="ch-empty-link"><FaFileAlt size={11} /> File a Report</Link>
                        </div>
                      ) : (
                        <div className="ch-list">
                          {reports.map(r => {
                            const tm = TYPE_META[r.type?.toLowerCase()] ?? TYPE_META.other;
                            const sm = STATUS_META[r.status]            ?? STATUS_META.pending;
                            return (
                              <div key={r.id} className="ch-row" onClick={() => navigate(`/citizen/history/${r.id}`)}>
                                <div className="ch-row-icon">{tm.icon}</div>
                                <div className="ch-row-body">
                                  <div className="ch-row-desc" title={r.description}>{r.description || "No description"}</div>
                                  <div className="ch-row-meta">
                                    <span className="ch-row-date">{fmtDate(r.created_at)}</span>
                                    {r.type && (
                                      <span className="ch-row-type" style={{ color: tm.color, background: `${tm.color}12`, border: `1px solid ${tm.color}25` }}>
                                        {r.type}
                                      </span>
                                    )}
                                    {/* Show resolution badge on list if resolved */}
                                    {r.status === "resolved" && r.resolution_type && RESOLUTION_META[r.resolution_type] && (
                                      <span style={{ fontSize: "9px", fontWeight: "700", color: "#2ECC8F", background: "rgba(46,204,143,.1)", border: "1px solid rgba(46,204,143,.2)", borderRadius: "4px", padding: "2px 6px" }}>
                                        {RESOLUTION_META[r.resolution_type].icon} {RESOLUTION_META[r.resolution_type].label}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ch-row-right">
                                  <span className="ch-pill" style={{ color: sm.color, background: sm.bg, borderColor: sm.border }}>
                                    <span className="ch-pill-dot" />{sm.label}
                                  </span>
                                  <FaChevronRight className="ch-chevron" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>A
  );
}