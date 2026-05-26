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
import dsgLogo from "../assets/dsg.logo.png";
import footerBg from "../assets/citizendashboard.jpg";

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

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap');

  :root {
    --primary:   #4A90E2;
    --success:   #2ECC8F;
    --warning:   #F5C842;
    --danger:    #EF5B5B;
    --info:      #5B8DEF;
    --bg:        #080c14;
    --surface:   rgba(15,21,33,0.82);
    --border:    rgba(255,255,255,0.07);
    --border-h:  rgba(255,255,255,0.13);
    --text:      #eef0f7;
    --text-2:    rgba(238,240,247,0.55);
    --text-3:    rgba(238,240,247,0.28);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeIn   { from { opacity: 0; transform: translateY(8px);   } to { opacity: 1; transform: none; } }
  @keyframes slideIn  { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
  @keyframes pulse    { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes caFade   { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

  /* ── Portal shell ── */
  .cd-portal {
    position: fixed; inset: 0; z-index: 9000; overflow: hidden;
    font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--text);
    background: var(--bg);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
  }
  .cd-portal::before {
    content: '';
    position: fixed; inset: 0;
    background: linear-gradient(160deg, rgba(8,12,20,0.93) 0%, rgba(8,12,20,0.82) 50%, rgba(8,12,20,0.93) 100%);
    pointer-events: none; z-index: 1;
  }

  /* Ambient glows */
  .cd-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
  .cd-glow-a { position: absolute; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(46,204,143,0.07) 0%, transparent 70%); top: -200px; left: -100px; }
  .cd-glow-b { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(74,144,226,0.05) 0%, transparent 70%); bottom: -160px; right: -80px; }

  .cd-shell { display: flex; height: 100%; width: 100%; position: relative; z-index: 2; }

  /* ── Mobile overlay ── */
  .cd-overlay { display: none; position: fixed; inset: 0; z-index: 190; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); }
  .cd-overlay.open { display: block; }

  /* ── Sidebar ── */
  .cd-sidebar {
    width: 260px; flex-shrink: 0;
    background: rgba(8,12,20,0.88);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    height: 100%; position: fixed; left: 0; top: 0; z-index: 200;
    overflow: hidden; transition: transform 0.3s ease;
    backdrop-filter: blur(20px);
  }

  .cd-logo {
    padding: 20px 16px; display: flex; align-items: center; gap: 12px;
    flex-shrink: 0; border-bottom: 1px solid var(--border);
  }
  .cd-logo-img {
    width: 40px; height: 40px; object-fit: contain; border-radius: 8px;
    /* White glow effect on logo */
    filter: drop-shadow(0 0 8px rgba(255,255,255,0.6)) drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 0 40px rgba(255,255,255,0.15));
    transition: filter 0.3s ease;
  }
  .cd-logo-img:hover {
    filter: drop-shadow(0 0 12px rgba(255,255,255,0.9)) drop-shadow(0 0 28px rgba(255,255,255,0.5)) drop-shadow(0 0 50px rgba(255,255,255,0.25));
  }
  .cd-logo-name {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 15px; font-weight: 800; color: var(--text);
    white-space: nowrap; letter-spacing: -0.02em;
  }
  .cd-logo-sub { font-size: 10px; color: var(--success); margin-top: 2px; display: flex; align-items: center; gap: 5px; font-weight: 600; letter-spacing: 0.1em; }

  .cd-pip { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--success); box-shadow: 0 0 6px var(--success); animation: pulse 2s ease infinite; flex-shrink: 0; }

  .cd-sidebar-close {
    display: none; margin-left: auto; flex-shrink: 0;
    background: transparent; border: 1px solid var(--border); border-radius: 6px;
    width: 28px; height: 28px; align-items: center; justify-content: center;
    color: var(--text-3); cursor: pointer; transition: all 0.2s;
  }
  .cd-sidebar-close:hover { background: rgba(255,255,255,0.06); color: var(--text); border-color: var(--border-h); }

  /* ── Nav ── */
  .cd-nav-scroll { flex: 1; overflow-y: auto; padding: 8px 10px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }

  .cd-nav-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 700; color: var(--text-3);
    letter-spacing: 0.14em; text-transform: uppercase; padding: 12px 8px 6px;
  }
  .cd-nav-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .cd-nav-btn {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 10px 12px; border-radius: 8px; border: 1px solid transparent;
    font-size: 13px; font-weight: 500; color: var(--text-2);
    background: transparent; cursor: pointer; margin-bottom: 2px;
    text-align: left; transition: all 0.2s; text-decoration: none;
    font-family: 'Instrument Sans', sans-serif;
  }
  .cd-nav-btn:hover  { background: rgba(255,255,255,0.04); color: var(--text); border-color: var(--border); }
  .cd-nav-btn.active {
    background: linear-gradient(135deg, rgba(46,204,143,0.15) 0%, rgba(46,204,143,0.06) 100%);
    color: var(--success); border-color: rgba(46,204,143,0.25); font-weight: 600;
    box-shadow: 0 2px 12px rgba(46,204,143,0.08);
  }
  .cd-nav-ic { font-size: 14px; flex-shrink: 0; color: var(--text-3); transition: color 0.2s; display: flex; align-items: center; }
  .cd-nav-btn.active .cd-nav-ic { color: var(--success); }

  .cd-badge { margin-left: auto; background: var(--danger); color: white; font-size: 10px; min-width: 20px; height: 20px; border-radius: 10px; padding: 0 5px; display: flex; align-items: center; justify-content: center; animation: pulse 2s ease infinite; font-weight: 700; box-shadow: 0 0 8px rgba(239,91,91,0.4); }

  /* ── Sidebar footer ── */
  .cd-sidebar-foot { padding: 12px 10px 16px; border-top: 1px solid var(--border); flex-shrink: 0; }
  .cd-user-card { display: flex; align-items: center; gap: 10px; padding: 11px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; }
  .cd-avatar { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; background: linear-gradient(135deg, var(--primary), #2563EB); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; color: white; }
  .cd-user-name   { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cd-user-status { font-size: 10px; color: var(--success); display: flex; align-items: center; gap: 5px; margin-top: 2px; font-weight: 600; letter-spacing: 0.08em; }

  .cd-logout-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--text-2); cursor: pointer; transition: all 0.2s; font-family: 'Instrument Sans', sans-serif; }
  .cd-logout-btn:hover { background: rgba(239,91,91,0.1); color: var(--danger); border-color: rgba(239,91,91,0.3); }

  /* ── Main area ── */
  .cd-main {
    margin-left: 260px; flex: 1;
    display: flex; flex-direction: column;
    min-width: 0; height: 100vh; overflow-y: auto; overflow-x: hidden;
    background: transparent;
  }

  .cd-topbar {
    height: 52px; display: flex; align-items: center; padding: 0 24px;
    background: rgba(8,12,20,0.75);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100; gap: 12px; flex-shrink: 0;
    backdrop-filter: blur(16px);
  }

  .cd-hamburger { display: none; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 6px; width: 32px; height: 32px; align-items: center; justify-content: center; color: var(--text-2); cursor: pointer; transition: all 0.2s; flex-shrink: 0; font-size: 14px; }
  .cd-hamburger:hover { background: rgba(255,255,255,0.08); color: var(--text); border-color: var(--border-h); }

  .cd-crumb       { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--text-3); overflow: hidden; min-width: 0; letter-spacing: 0.06em; }
  .cd-crumb-sep   { color: var(--text-3); flex-shrink: 0; }
  .cd-crumb-active{ color: var(--text); font-weight: 600; white-space: nowrap; }
  .cd-crumb-hide  { white-space: nowrap; }

  .cd-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .cd-clock { font-size: 11px; font-weight: 600; color: var(--text-2); background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 6px; padding: 5px 12px; white-space: nowrap; font-family: monospace; }

  .cd-notif-wrap { position: relative; }
  .cd-icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border); background: transparent; display: flex; align-items: center; justify-content: center; color: var(--text-2); cursor: pointer; font-size: 13px; transition: all 0.2s; }
  .cd-icon-btn:hover { background: rgba(255,255,255,0.06); color: var(--text); border-color: var(--border-h); }
  .cd-notif-dot { position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; border-radius: 50%; background: var(--danger); border: 1px solid rgba(8,12,20,1); animation: pulse 1.5s ease infinite; box-shadow: 0 0 6px rgba(239,91,91,0.6); }

  /* ── Page ── */
  .cd-page { flex: 1; padding: 24px; overflow-x: hidden; min-width: 0; }
  .cd-page > div { animation: fadeIn 0.4s ease-out both; }

  /* ── Page header ── */
  .cd-page-hd { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
  .cd-eyebrow { font-size: 10px; color: var(--success); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
  .cd-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); box-shadow: 0 0 8px var(--success); animation: pulse 2.2s ease infinite; }
  .cd-title {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: clamp(26px, 3.5vw, 38px);
    color: var(--text); letter-spacing: -0.035em; line-height: 1.05; font-weight: 900;
  }
  .cd-title em { font-style: normal; color: var(--success); }
  .cd-subtitle { font-size: 10px; color: var(--text-3); margin-top: 4px; letter-spacing: 0.12em; }

  .cd-live-tag { display: flex; align-items: center; gap: 6px; font-size: 10px; padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(239,91,91,0.3); background: rgba(239,91,91,0.06); color: var(--danger); letter-spacing: 0.08em; white-space: nowrap; font-weight: 700; }
  .cd-live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--danger); box-shadow: 0 0 6px var(--danger); animation: pulse 1.4s ease infinite; }

  /* ── Pending alert banner ── */
  .cd-alert {
    display: flex; align-items: center; gap: 14px;
    background: rgba(245,200,66,0.06); border: 1px solid rgba(245,200,66,0.2);
    border-left: 3px solid var(--warning);
    border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;
    animation: slideIn 0.3s ease-out; backdrop-filter: blur(16px);
  }
  .cd-alert-text { font-size: 13px; color: var(--text-2); flex: 1; }
  .cd-alert-text strong { font-weight: 700; color: var(--warning); }
  .cd-alert-link {
    font-size: 11px; font-weight: 700; color: var(--warning); text-decoration: none;
    border: 1px solid rgba(245,200,66,0.3); border-radius: 6px; padding: 5px 12px;
    background: transparent; transition: all 0.2s; white-space: nowrap;
    letter-spacing: 0.04em;
  }
  .cd-alert-link:hover { background: rgba(245,200,66,0.1); border-color: rgba(245,200,66,0.5); }

  /* ── Stat Grid ── */
  .cd-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }

  .cd-stat {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px; position: relative; overflow: hidden;
    transition: all 0.3s; cursor: default; animation: caFade 0.5s ease-out both;
    backdrop-filter: blur(16px);
  }
  .cd-stat:nth-child(2) { animation-delay: 0.05s; }
  .cd-stat:nth-child(3) { animation-delay: 0.10s; }
  .cd-stat:nth-child(4) { animation-delay: 0.15s; }
  .cd-stat:hover { transform: translateY(-3px); border-color: var(--border-h); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .cd-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--card-accent); }
  .cd-stat-icon  { font-size: 16px; margin-bottom: 12px; opacity: 0.8; }
  .cd-stat-num   { font-family: 'Cabinet Grotesk', sans-serif; font-size: 32px; line-height: 1; margin-bottom: 6px; letter-spacing: -0.03em; font-weight: 900; color: var(--card-accent); }
  .cd-stat-label { font-size: 10px; color: var(--text-3); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; }
  .cd-stat-delta { position: absolute; top: 12px; right: 12px; font-size: 8px; border: 1px solid var(--border); border-radius: 4px; padding: 2px 6px; color: var(--text-3); font-weight: 600; letter-spacing: 0.08em; }

  /* ── Panels ── */
  .cd-panels-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  @media (max-width: 1280px) { .cd-panels-row { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 900px)  { .cd-panels-row { grid-template-columns: 1fr; } }

  .cd-panel {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 20px; min-width: 0; animation: caFade 0.5s ease-out both;
    position: relative; overflow: hidden; backdrop-filter: blur(16px);
  }
  .cd-panel:nth-child(2) { animation-delay: 0.08s; }
  .cd-panel:nth-child(3) { animation-delay: 0.16s; }
  .cd-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .cd-panel.pa-red::before    { background: var(--danger); }
  .cd-panel.pa-amber::before  { background: var(--warning); }
  .cd-panel.pa-blue::before   { background: var(--info); }

  .cd-panel-hd    { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); gap: 8px; flex-wrap: wrap; }
  .cd-panel-title { font-size: 10px; color: var(--text-3); letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; }
  .cd-panel-tag   { font-size: 9px; color: var(--info); border: 1px solid rgba(91,141,239,0.3); border-radius: 4px; padding: 3px 8px; background: rgba(91,141,239,0.06); font-weight: 700; letter-spacing: 0.06em; }

  /* ── Incident items ── */
  .cd-inc-item { padding: 12px 0; border-bottom: 1px solid var(--border); }
  .cd-inc-item:last-child { border-bottom: none; padding-bottom: 0; }
  .cd-inc-row  { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
  .cd-inc-icon { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 15px; background: rgba(255,255,255,0.03); }
  .cd-inc-body { flex: 1; min-width: 0; }
  .cd-inc-type { font-size: 13px; font-weight: 700; text-transform: capitalize; margin-bottom: 3px; }
  .cd-inc-loc  { font-size: 11px; color: var(--text-2); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-bottom: 6px; }
  .cd-pill     { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; padding: 3px 8px; border-radius: 5px; border: 1px solid; font-weight: 700; letter-spacing: 0.06em; }
  .cd-pill-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; background: currentColor; }
  .cd-inc-time { font-size: 10px; color: var(--text-3); margin-top: 5px; font-family: monospace; }

  /* ── Barangay Alert items ── */
  .cd-al-item { padding: 12px 0; border-bottom: 1px solid var(--border); }
  .cd-al-item:last-child { border-bottom: none; padding-bottom: 0; }
  .cd-al-row  { display: flex; align-items: flex-start; gap: 12px; }
  .cd-al-icon { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; border: 1px solid; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .cd-al-body { flex: 1; min-width: 0; }
  .cd-al-title { font-size: 13px; font-weight: 700; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cd-al-msg  { font-size: 11px; color: var(--text-2); line-height: 1.5; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-bottom: 5px; }
  .cd-al-foot { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .cd-al-time { font-size: 10px; color: var(--text-3); margin-left: auto; display: flex; align-items: center; gap: 4px; font-family: monospace; }
  .cd-al-new  { font-size: 9px; font-weight: 700; color: var(--success); background: rgba(46,204,143,0.08); border: 1px solid rgba(46,204,143,0.25); border-radius: 20px; padding: 2px 7px; display: inline-flex; align-items: center; gap: 3px; }
  .cd-al-new-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--success); box-shadow: 0 0 5px var(--success); animation: pulse 2s ease infinite; }

  .cd-view-all {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-top: 14px; font-size: 11px; font-weight: 700; color: var(--warning);
    text-decoration: none; border: 1px solid rgba(245,200,66,0.25); border-radius: 8px;
    padding: 8px 16px; background: rgba(245,200,66,0.04); transition: all 0.2s; width: 100%;
    cursor: pointer; font-family: 'Instrument Sans', sans-serif; letter-spacing: 0.06em;
  }
  .cd-view-all:hover { background: rgba(245,200,66,0.1); border-color: rgba(245,200,66,0.45); }

  /* ── Bar chart ── */
  .cd-bar-item  { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .cd-bar-item:last-child { margin-bottom: 0; }
  .cd-bar-label { font-size: 11px; color: var(--text-2); width: 72px; flex-shrink: 0; display: flex; align-items: center; gap: 5px; font-weight: 500; }
  .cd-bar-track { flex: 1; height: 4px; border-radius: 3px; background: rgba(255,255,255,0.06); overflow: hidden; }
  .cd-bar-fill  { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
  .cd-bar-val   { font-size: 11px; color: var(--text-3); width: 20px; text-align: right; flex-shrink: 0; font-weight: 600; }

  /* ── Quick Actions ── */
  .cd-qgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
  .cd-qbtn  {
    display: flex; align-items: center; gap: 8px; padding: 11px 12px;
    background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 8px;
    cursor: pointer; font-size: 12px; font-weight: 600; color: var(--text-2);
    text-align: left; transition: all 0.2s; text-decoration: none;
    font-family: 'Instrument Sans', sans-serif;
  }
  .cd-qbtn:hover { color: var(--text); transform: translateY(-2px); border-color: var(--border-h); background: rgba(255,255,255,0.06); }
  .cd-qbtn-ic { width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 1px solid var(--border); }
  .cd-qbtn.qv-red   .cd-qbtn-ic { background: rgba(239,91,91,0.08);  border-color: rgba(239,91,91,0.3);  color: var(--danger);  }
  .cd-qbtn.qv-green .cd-qbtn-ic { background: rgba(46,204,143,0.08); border-color: rgba(46,204,143,0.3); color: var(--success); }
  .cd-qbtn.qv-blue  .cd-qbtn-ic { background: rgba(91,141,239,0.08); border-color: rgba(91,141,239,0.3); color: var(--info);    }
  .cd-qbtn.qv-amber .cd-qbtn-ic { background: rgba(245,200,66,0.08); border-color: rgba(245,200,66,0.3); color: var(--warning); }

  .cd-divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }

  /* ── Utility ── */
  .cd-spinner { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--success); animation: spin 0.8s linear infinite; }
  .cd-empty   { text-align: center; padding: 40px 24px; font-size: 11px; letter-spacing: 0.1em; color: var(--text-3); text-transform: uppercase; }
  .cd-empty-inner { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .cd-empty-icon  { font-size: 26px; opacity: 0.3; margin-bottom: 4px; }
  .cd-empty-link  {
    margin-top: 12px; font-size: 11px; font-weight: 700; color: var(--success);
    text-decoration: none; border: 1px solid rgba(46,204,143,0.3); border-radius: 8px;
    padding: 8px 16px; background: transparent; display: inline-flex; align-items: center; gap: 6px;
    transition: all 0.2s; letter-spacing: 0.06em;
  }
  .cd-empty-link:hover { background: rgba(46,204,143,0.08); border-color: rgba(46,204,143,0.5); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .cd-sidebar { transform: translateX(-100%); width: min(260px, 90vw); box-shadow: 4px 0 24px rgba(0,0,0,0.5); }
    .cd-sidebar.open { transform: translateX(0); }
    .cd-sidebar-close { display: flex; }
    .cd-hamburger { display: flex; }
    .cd-main { margin-left: 0; }
    .cd-topbar { padding: 0 16px; }
    .cd-crumb-hide { display: none; }
    .cd-page { padding: 16px; }
    .cd-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .cd-stat-num { font-size: 24px; }
    .cd-qgrid { grid-template-columns: 1fr; }
    .cd-clock { font-size: 11px; padding: 4px 8px; }
  }
  @media (max-width: 420px) {
    .cd-page { padding: 14px 12px; }
    .cd-clock { display: none; }
  }
`;

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

  const quickActions = [
    { label: "File Report", icon: "📝", to: "/report",          colorClass: "qv-red"   },
    { label: "Safety Map",  icon: "🗺️",  to: "/map",             colorClass: "qv-green" },
    { label: "My Reports",  icon: "📂", to: "/citizen/history",  colorClass: "qv-blue"  },
    { label: "Safety Tips", icon: "💡", to: "/safetytips",       colorClass: "qv-amber" },
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
    <>
      <style>{STYLES}</style>
      <div
        className="cd-portal"
        style={{ backgroundImage: `url(${footerBg})` }}
      >
        {/* Ambient glows */}
        <div className="cd-glow">
          <div className="cd-glow-a" />
          <div className="cd-glow-b" />
        </div>

        <div className="cd-shell">

          {/* Mobile overlay */}
          <div
            className={`cd-overlay${sidebarOpen ? " open" : ""}`}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* ── Sidebar ── */}
          <aside className={`cd-sidebar${sidebarOpen ? " open" : ""}`} aria-label="Navigation">
            <div className="cd-logo">
              <img src={dsgLogo} alt="DumaSafeGuide" className="cd-logo-img" />
              <div>
                <div className="cd-logo-name">DumaSafeGuide</div>
                <div className="cd-logo-sub"><span className="cd-pip" />CITIZEN</div>
              </div>
              <button className="cd-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            <nav className="cd-nav-scroll">
              <div className="cd-nav-label">Portal</div>

              <button
                className={`cd-nav-btn${activeNav === "overview" ? " active" : ""}`}
                onClick={() => { setActiveNav("overview"); setSidebarOpen(false); }}
              >
                <span className="cd-nav-ic"><FaHistory /></span>
                Overview
              </button>

              <div className="cd-nav-label">Actions</div>

              <Link to="/report" className="cd-nav-btn" onClick={() => setSidebarOpen(false)}>
                <span className="cd-nav-ic"><FaFileAlt /></span>
                <span>File Report</span>
              </Link>

              <Link to="/citizen/history" className="cd-nav-btn" onClick={() => setSidebarOpen(false)}>
                <span className="cd-nav-ic"><FaHistory /></span>
                <span>My Reports</span>
                {stats.total > 0 && <span className="cd-badge">{stats.total}</span>}
              </Link>

              <Link
                to="/citizen/alerts"
                className="cd-nav-btn"
                onClick={() => {
                  markAlertsRead();
                  setUnreadCount(0);
                  setSidebarOpen(false);
                }}
              >
                <span className="cd-nav-ic"><FaBell /></span>
                <span>Barangay Alerts</span>
                {unreadCount > 0 && <span className="cd-badge">{unreadCount}</span>}
              </Link>

              <Link to="/map" className="cd-nav-btn" onClick={() => setSidebarOpen(false)}>
                <span className="cd-nav-ic"><FaMapMarkedAlt /></span>
                <span>Safety Map</span>
              </Link>

              <Link to="/safetytips" className="cd-nav-btn" onClick={() => setSidebarOpen(false)}>
                <span className="cd-nav-ic"><FaLightbulb /></span>
                <span>Safety Tips</span>
              </Link>
            </nav>

            <div className="cd-sidebar-foot">
              <div className="cd-user-card">
                <div className="cd-avatar">{initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="cd-user-name">{displayName}</div>
                  <div className="cd-user-status"><span className="cd-pip" />CITIZEN</div>
                </div>
              </div>
              <button className="cd-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt size={12} /> Sign Out
              </button>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="cd-main">

            {/* Topbar */}
            <div className="cd-topbar">
              <button
                className="cd-hamburger"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
              >
                <FaBars />
              </button>

              <div className="cd-crumb">
                <span className="cd-crumb-hide">DUMASAFEGUIDE</span>
                <span className="cd-crumb-sep cd-crumb-hide">/</span>
                <span className="cd-crumb-hide">CITIZEN</span>
                <span className="cd-crumb-sep cd-crumb-hide">/</span>
                <span className="cd-crumb-active">Overview</span>
              </div>

              <div className="cd-topbar-right">
                <span className="cd-clock">{clock}</span>
                <div className="cd-notif-wrap">
                  <button
                    className="cd-icon-btn"
                    aria-label="Notifications"
                    onClick={handleViewAllAlerts}
                  >
                    <FaBell size={13} />
                  </button>
                  {(stats.pending > 0 || unreadCount > 0) && <span className="cd-notif-dot" />}
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="cd-page">
              <div>

                {/* Page header */}
                <div className="cd-page-hd">
                  <div>
                    <div className="cd-eyebrow">
                      <span className="cd-eyebrow-dot" />
                      Citizen Portal
                    </div>
                    <div className="cd-title">Welcome, <em>{firstName}.</em></div>
                    <div className="cd-subtitle">DUMAGUETE CITY COMMUNITY SAFETY</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {loading && <div className="cd-spinner" />}
                    <div className="cd-live-tag"><span className="cd-live-dot" />LIVE</div>
                  </div>
                </div>

                {/* Pending banner */}
                {stats.pending > 0 && (
                  <div className="cd-alert">
                    <FaExclamationTriangle style={{ color: "var(--warning)", flexShrink: 0 }} />
                    <span className="cd-alert-text">
                      You have <strong>{stats.pending} pending report{stats.pending !== 1 ? "s" : ""}</strong> awaiting responder review.
                    </span>
                    <Link to="/citizen/history" className="cd-alert-link">View reports</Link>
                  </div>
                )}

                {/* Stat cards */}
                <div className="cd-stat-grid">
                  {statCards.map(c => (
                    <div
                      key={c.label}
                      className="cd-stat"
                      style={{ "--card-accent": c.accent } as React.CSSProperties}
                    >
                      <div className="cd-stat-icon">{c.icon}</div>
                      <div className="cd-stat-num">{loading ? "—" : c.value}</div>
                      <div className="cd-stat-label">{c.label}</div>
                      {c.delta && <span className="cd-stat-delta">{c.delta}</span>}
                    </div>
                  ))}
                </div>

                {/* Three-panel layout */}
                <div className="cd-panels-row">

                  {/* Panel 1: Recent Reports */}
                  <div className="cd-panel pa-red" style={{ maxHeight: 480, overflowY: "auto" }}>
                    <div className="cd-panel-hd">
                      <span className="cd-panel-title">My Recent Reports</span>
                      <span className="cd-panel-tag" style={{ color: "var(--danger)", borderColor: "rgba(239,91,91,0.3)", background: "rgba(239,91,91,0.06)" }}>REAL-TIME</span>
                    </div>

                    {loading ? (
                      <div className="cd-empty"><div className="cd-spinner" style={{ margin: "0 auto" }} /></div>
                    ) : reports.length === 0 ? (
                      <div className="cd-empty">
                        <div className="cd-empty-inner">
                          <div className="cd-empty-icon">📋</div>
                          <div>NO REPORTS YET</div>
                          <Link to="/report" className="cd-empty-link">
                            <FaFileAlt size={11} /> File a Report
                          </Link>
                        </div>
                      </div>
                    ) : (
                      reports.slice(0, 6).map(r => {
                        const tm = TYPE_META[r.type?.toLowerCase()] ?? TYPE_META.other;
                        const sm = STATUS_META[r.status] ?? STATUS_META.pending;
                        return (
                          <div
                            key={r.id}
                            className="cd-inc-item"
                            onClick={() => navigate(`/citizen/history/${r.id}`)}
                          >
                            <div className="cd-inc-row">
                              <div className="cd-inc-icon">{tm.icon}</div>
                              <div className="cd-inc-body">
                                <div className="cd-inc-type" style={{ color: tm.color }}>{r.type}</div>
                                <div className="cd-inc-loc">📄 {r.description || "No description"}</div>
                                <span className="cd-pill" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>
                                  <span className="cd-pill-dot" />
                                  {sm.label}
                                </span>
                                <div className="cd-inc-time"><FaClock size={8} style={{ marginRight: 3 }} />{formatRelative(r.created_at)}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Panel 2: Barangay Alerts */}
                  <div className="cd-panel pa-amber" style={{ maxHeight: 480, overflowY: "auto" }}>
                    <div className="cd-panel-hd">
                      <span className="cd-panel-title">Barangay Alerts</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="cd-live-tag" style={{ fontSize: 9, padding: "3px 8px" }}>
                          <span className="cd-live-dot" />LIVE
                        </div>
                        <span
                          className="cd-panel-tag"
                          style={{ color: "var(--warning)", borderColor: "rgba(245,200,66,0.3)", background: "rgba(245,200,66,0.06)" }}
                        >
                          {unreadCount > 0 ? `${unreadCount} UNREAD` : "ALL READ"}
                        </span>
                      </div>
                    </div>

                    {loading ? (
                      <div className="cd-empty"><div className="cd-spinner" style={{ margin: "0 auto" }} /></div>
                    ) : alerts.length === 0 ? (
                      <div className="cd-empty">
                        <div className="cd-empty-inner">
                          <div className="cd-empty-icon">🔔</div>
                          <div>NO ACTIVE ALERTS</div>
                          <p style={{ fontSize: 10, color: "var(--text-3)", marginTop: 4, textTransform: "none", letterSpacing: "0.04em" }}>
                            Updates automatically in real-time.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {alerts.map(a => {
                          const am = ALERT_TYPE_META[a.type] ?? ALERT_TYPE_META.info;
                          const isNew = newAlertIds.has(a.id);
                          return (
                            <div key={a.id} className="cd-al-item">
                              <div className="cd-al-row">
                                <div className="cd-al-icon" style={{ background: am.bg, color: am.color, borderColor: am.border }}>
                                  {am.icon}
                                </div>
                                <div className="cd-al-body">
                                  <div className="cd-al-title" style={{ color: am.color }}>{a.title || "Alert"}</div>
                                  <div className="cd-al-msg">{a.message}</div>
                                  <div className="cd-al-foot">
                                    <span className="cd-pill" style={{ background: am.bg, color: am.color, borderColor: am.border }}>
                                      <span className="cd-pill-dot" />{am.label}
                                    </span>
                                    {isNew && (
                                      <span className="cd-al-new">
                                        <span className="cd-al-new-dot" />NEW
                                      </span>
                                    )}
                                    <span className="cd-al-time">
                                      <FaClock size={8} />{formatRelative(a.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <button className="cd-view-all" onClick={handleViewAllAlerts}>
                          View all alerts →
                        </button>
                      </>
                    )}
                  </div>

                  {/* Panel 3: Breakdown + Quick Actions */}
                  <div className="cd-panel pa-blue">
                    <div className="cd-panel-hd">
                      <span className="cd-panel-title">Incident Breakdown</span>
                      <span className="cd-panel-tag">BY TYPE</span>
                    </div>

                    {TYPE_LIST.map(t => {
                      const tm = TYPE_META[t] ?? TYPE_META.other;
                      const count = typeCounts[t] ?? 0;
                      return (
                        <div key={t} className="cd-bar-item">
                          <span className="cd-bar-label">
                            <span>{tm.icon}</span>
                            <span style={{ textTransform: "capitalize" }}>{t}</span>
                          </span>
                          <div className="cd-bar-track">
                            <div className="cd-bar-fill" style={{ width: `${(count / maxCount) * 100}%`, background: tm.color }} />
                          </div>
                          <span className="cd-bar-val">{count}</span>
                        </div>
                      );
                    })}

                    <hr className="cd-divider" />

                    <div className="cd-panel-title" style={{ marginBottom: 10 }}>Quick Actions</div>
                    <div className="cd-qgrid">
                      {quickActions.map(q => (
                        <Link key={q.to} to={q.to} className={`cd-qbtn ${q.colorClass}`}>
                          <span className="cd-qbtn-ic">{q.icon}</span>
                          {q.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}