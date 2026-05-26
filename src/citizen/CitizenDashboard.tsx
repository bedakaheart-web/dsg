// src/citizen/CitizenDashboard.tsx
// ✅ Unified with Admin & Responder dashboard design system
// • NEW: Alerts unread counter — clears once user visits the alerts page

import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileAlt, FaMapMarkedAlt, FaHistory, FaLightbulb,
  FaCheckCircle, FaClock, FaSpinner, FaExclamationTriangle,
  FaBell, FaBars, FaTimes, FaSignOutAlt, FaInfoCircle,
} from "react-icons/fa";
import dsgLogo from "../assets/dsg.logo.png";
import footerBg from "../assets/footer.png";

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
  fire:     { icon: "🔥", color: "#FF3B30" },
  accident: { icon: "🚗", color: "#FF9500" },
  flood:    { icon: "🌊", color: "#0066FF" },
  crime:    { icon: "🚨", color: "#FF2D55" },
  medical:  { icon: "🏥", color: "#00B074" },
  other:    { icon: "⚠️", color: "#9CA3AF" },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:       { label: "PENDING",     color: "#FF3B30", bg: "rgba(255,59,48,.08)",  border: "rgba(255,59,48,.25)"  },
  "in-progress": { label: "IN PROGRESS", color: "#FF9500", bg: "rgba(255,149,0,.08)",  border: "rgba(255,149,0,.25)"  },
  resolved:      { label: "RESOLVED",    color: "#00B074", bg: "rgba(0,176,116,.08)",  border: "rgba(0,176,116,.25)"  },
};

const ALERT_TYPE_META: Record<string, { color: string; bg: string; border: string; label: string; icon: JSX.Element }> = {
  danger:  { color: "#FF3B30", bg: "rgba(255,59,48,0.08)",  border: "rgba(255,59,48,0.2)",  label: "Danger",    icon: <FaExclamationTriangle /> },
  warning: { color: "#FF9500", bg: "rgba(255,149,0,0.08)",  border: "rgba(255,149,0,0.2)",  label: "Warning",   icon: <FaExclamationTriangle /> },
  info:    { color: "#0066FF", bg: "rgba(0,102,255,0.08)",  border: "rgba(0,102,255,0.2)",  label: "Info",      icon: <FaInfoCircle /> },
  success: { color: "#00B074", bg: "rgba(0,176,116,0.08)",  border: "rgba(0,176,116,0.2)",  label: "All Clear", icon: <FaCheckCircle /> },
};

const TYPE_LIST = ["fire", "flood", "medical", "crime", "accident", "other"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUnreadCount(alerts: Alert[]): number {
  try {
    const lastRead = localStorage.getItem(ALERTS_READ_KEY);
    if (!lastRead) return alerts.length;
    return alerts.filter(a => new Date(a.created_at) > new Date(lastRead)).length;
  } catch {
    return 0;
  }
}

function markAlertsRead() {
  try {
    localStorage.setItem(ALERTS_READ_KEY, new Date().toISOString());
  } catch {}
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
:root {
  --primary:        #0066FF;
  --success:        #00B074;
  --warning:        #FF9500;
  --danger:         #FF3B30;
  --bg:             #FAFBFC;
  --surface:        #FFFFFF;
  --border:         #E5E7EB;
  --text:           #1F2937;
  --text-secondary: #6B7280;
  --text-tertiary:  #9CA3AF;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes fadeIn  { from { opacity: 0; transform: translateY(8px);   } to { opacity: 1; transform: none; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
@keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes spin    { to { transform: rotate(360deg); } }

/* ── Portal / shell ── */
.cd-portal {
  position: fixed; inset: 0; z-index: 9000; overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text); background: var(--bg);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

.cd-portal::before {
  content: '';
  position: fixed; inset: 0;
  background: linear-gradient(135deg, rgba(250,251,252,0.85) 0%, rgba(255,255,255,0.9) 50%, rgba(250,251,252,0.85) 100%);
  pointer-events: none; z-index: 1;
}

.cd-shell { display: flex; height: 100%; width: 100%; position: relative; z-index: 2; }

/* ── Mobile overlay ── */
.cd-overlay { display: none; position: fixed; inset: 0; z-index: 190; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
.cd-overlay.open { display: block; }

/* ── Sidebar ── */
.cd-sidebar {
  width: 260px; flex-shrink: 0;
  background: var(--surface); border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  height: 100%; position: fixed; left: 0; top: 0; z-index: 200;
  overflow: hidden; transition: transform 0.3s ease;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
}

.cd-logo {
  padding: 20px 16px; display: flex; align-items: center; gap: 12px;
  flex-shrink: 0; border-bottom: 1px solid var(--border);
}
.cd-logo-img  { width: 40px; height: 40px; object-fit: contain; border-radius: 8px; }
.cd-logo-name { font-size: 15px; font-weight: 700; color: var(--text); white-space: nowrap; }
.cd-logo-sub  { font-size: 11px; color: var(--text-tertiary); margin-top: 3px; display: flex; align-items: center; gap: 6px; }

.cd-pip { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--success); animation: pulse 2s ease infinite; flex-shrink: 0; }

.cd-sidebar-close {
  display: none; margin-left: auto; flex-shrink: 0;
  background: transparent; border: 1px solid var(--border); border-radius: 6px;
  width: 28px; height: 28px; align-items: center; justify-content: center;
  color: var(--text-tertiary); cursor: pointer; transition: all 0.2s;
}
.cd-sidebar-close:hover { background: var(--bg); color: var(--text); border-color: var(--text-secondary); }

/* ── Nav ── */
.cd-nav-scroll { flex: 1; overflow-y: auto; padding: 8px 10px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }

.cd-nav-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 600; color: var(--text-tertiary);
  letter-spacing: 0.5px; text-transform: uppercase; padding: 12px 8px 6px;
}
.cd-nav-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.cd-nav-btn {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 10px 12px; border-radius: 8px; border: 1px solid transparent;
  font-size: 13px; font-weight: 500; color: var(--text-secondary);
  background: transparent; cursor: pointer; margin-bottom: 2px;
  text-align: left; transition: all 0.2s; text-decoration: none;
}
.cd-nav-btn:hover  { background: var(--bg); color: var(--text); border-color: var(--border); }
.cd-nav-btn.active {
  background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%);
  color: white; border-color: transparent; font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,102,255,0.2);
}
.cd-nav-ic { font-size: 15px; flex-shrink: 0; color: var(--text-tertiary); transition: color 0.2s; display: flex; align-items: center; }
.cd-nav-btn.active .cd-nav-ic { color: white; }

.cd-badge { margin-left: auto; background: var(--danger); color: white; font-size: 10px; min-width: 20px; height: 20px; border-radius: 10px; padding: 0 6px; display: flex; align-items: center; justify-content: center; animation: pulse 2s ease infinite; font-weight: 600; }

/* ── Sidebar footer ── */
.cd-sidebar-foot { padding: 12px 10px 16px; border-top: 1px solid var(--border); flex-shrink: 0; }
.cd-user-card { display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; }
.cd-avatar { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 11px; color: white; }
.cd-user-name   { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cd-user-status { font-size: 10px; color: var(--success); display: flex; align-items: center; gap: 5px; margin-top: 2px; }

.cd-logout-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.cd-logout-btn:hover { background: var(--danger); color: white; border-color: var(--danger); }

/* ── Main area ── */
.cd-main {
  margin-left: 260px; flex: 1;
  display: flex; flex-direction: column; position: relative; z-index: 1;
  min-width: 0; height: 100vh; overflow-y: auto; overflow-x: hidden;
  background: var(--bg);
}

.cd-topbar {
  height: 56px; display: flex; align-items: center; padding: 0 24px;
  background: var(--surface); border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100; gap: 12px; flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.cd-hamburger { display: none; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; width: 32px; height: 32px; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; flex-shrink: 0; font-size: 14px; }
.cd-hamburger:hover { background: var(--surface); border-color: var(--text-secondary); color: var(--text); }

.cd-crumb       { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-tertiary); overflow: hidden; min-width: 0; }
.cd-crumb-sep   { color: var(--text-tertiary); flex-shrink: 0; }
.cd-crumb-active{ color: var(--text); font-weight: 600; white-space: nowrap; }
.cd-crumb-hide  { white-space: nowrap; }

.cd-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.cd-clock { font-size: 12px; font-weight: 500; color: var(--text-secondary); background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 6px 12px; white-space: nowrap; }

.cd-notif-wrap { position: relative; }
.cd-icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border); background: transparent; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; font-size: 13px; transition: all 0.2s; }
.cd-icon-btn:hover { background: var(--bg); color: var(--text); border-color: var(--text-secondary); }
.cd-notif-dot { position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; border-radius: 50%; background: var(--danger); border: 1px solid var(--surface); animation: pulse 1.5s ease infinite; }

/* ── Page ── */
.cd-page { flex: 1; padding: 24px; overflow-x: hidden; min-width: 0; }
.cd-page > div { animation: fadeIn 0.4s ease-out both; }

/* ── Page header ── */
.cd-page-hd { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.cd-eyebrow { font-size: 11px; color: var(--primary); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.cd-eyebrow::before { content: ''; display: block; width: 20px; height: 2px; background: var(--primary); }
.cd-title    { font-size: 32px; color: var(--text); letter-spacing: -0.5px; line-height: 1.1; font-weight: 700; }
.cd-subtitle { font-size: 11px; color: var(--text-tertiary); margin-top: 4px; }

.cd-live-tag { display: flex; align-items: center; gap: 6px; font-size: 11px; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--danger); background: rgba(255,59,48,0.06); color: var(--danger); letter-spacing: 0.3px; white-space: nowrap; font-weight: 600; }
.cd-live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--danger); animation: pulse 1.4s ease infinite; }

/* ── Stat Grid ── */
.cd-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }

.cd-stat {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 20px; position: relative; overflow: hidden; transition: all 0.3s;
  cursor: default; animation: fadeIn 0.5s ease-out both;
}
.cd-stat:nth-child(2) { animation-delay: 0.05s; }
.cd-stat:nth-child(3) { animation-delay: 0.10s; }
.cd-stat:nth-child(4) { animation-delay: 0.15s; }
.cd-stat:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: 0 8px 16px rgba(0,102,255,0.1); }
.cd-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--card-accent); }
.cd-stat-icon  { font-size: 18px; color: var(--card-accent); margin-bottom: 12px; opacity: 0.85; }
.cd-stat-num   { font-size: 32px; line-height: 1; margin-bottom: 6px; letter-spacing: -0.5px; font-weight: 700; color: var(--card-accent); }
.cd-stat-label { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; font-weight: 500; }
.cd-stat-delta { position: absolute; top: 12px; right: 12px; font-size: 9px; border: 1px solid var(--card-accent); border-radius: 4px; padding: 2px 6px; color: var(--card-accent); opacity: 0.6; }

/* ── Alert banner (pending reports notice) ── */
.cd-alert {
  display: flex; align-items: center; gap: 14px;
  background: var(--surface); border: 1px solid var(--border);
  border-left: 3px solid var(--warning);
  border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;
  animation: slideIn 0.3s ease-out;
}
.cd-alert-text { font-size: 13px; color: var(--text); flex: 1; }
.cd-alert-text strong { font-weight: 600; color: var(--warning); }
.cd-alert-link {
  font-size: 11px; font-weight: 600; color: var(--warning); text-decoration: none;
  border: 1px solid var(--warning); border-radius: 6px; padding: 5px 12px;
  background: transparent; transition: all 0.2s; white-space: nowrap;
}
.cd-alert-link:hover { background: rgba(255,149,0,0.08); }

/* ── Panels ── */
.cd-panels-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
@media (max-width: 1280px) { .cd-panels-row { grid-template-columns: 1fr 1fr; } }
@media (max-width: 900px)  { .cd-panels-row { grid-template-columns: 1fr; } }

.cd-panel {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 20px; min-width: 0; animation: slideIn 0.5s ease-out both;
  position: relative; overflow: hidden;
}
.cd-panel:nth-child(2) { animation-delay: 0.08s; }
.cd-panel:nth-child(3) { animation-delay: 0.16s; }
.cd-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
.cd-panel.pa-red::before    { background: var(--danger); }
.cd-panel.pa-amber::before  { background: var(--warning); }
.cd-panel.pa-blue::before   { background: var(--primary); }

.cd-panel-hd    { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); gap: 8px; flex-wrap: wrap; }
.cd-panel-title { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600; }
.cd-panel-tag   { font-size: 9px; color: var(--primary); border: 1px solid var(--primary); border-radius: 4px; padding: 3px 8px; background: rgba(0,102,255,0.05); font-weight: 600; }

/* ── Incident items ── */
.cd-inc-item { padding: 14px 0; border-bottom: 1px solid var(--border); }
.cd-inc-item:last-child { border-bottom: none; padding-bottom: 0; }
.cd-inc-row  { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.cd-inc-icon { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 16px; background: var(--bg); }
.cd-inc-body { flex: 1; min-width: 0; }
.cd-inc-type { font-size: 13px; font-weight: 700; text-transform: capitalize; margin-bottom: 4px; }
.cd-inc-loc  { font-size: 12px; color: var(--text-secondary); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-bottom: 6px; }
.cd-pill     { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; padding: 4px 10px; border-radius: 6px; border: 1px solid; font-weight: 600; }
.cd-pill-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; background: currentColor; }
.cd-inc-time { font-size: 10px; color: var(--text-tertiary); margin-top: 6px; }

/* ── Barangay Alert items ── */
.cd-al-item { padding: 12px 0; border-bottom: 1px solid var(--border); }
.cd-al-item:last-child { border-bottom: none; padding-bottom: 0; }
.cd-al-row  { display: flex; align-items: flex-start; gap: 12px; }
.cd-al-icon { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; border: 1px solid; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.cd-al-body { flex: 1; min-width: 0; }
.cd-al-title { font-size: 13px; font-weight: 700; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cd-al-msg  { font-size: 12px; color: var(--text-secondary); line-height: 1.5; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-bottom: 6px; }
.cd-al-foot { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.cd-al-time { font-size: 10px; color: var(--text-tertiary); margin-left: auto; display: flex; align-items: center; gap: 4px; }
.cd-al-new  { font-size: 9px; font-weight: 700; color: var(--success); background: rgba(0,176,116,0.08); border: 1px solid rgba(0,176,116,0.25); border-radius: 20px; padding: 2px 7px; display: inline-flex; align-items: center; gap: 3px; }
.cd-al-new-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--success); animation: pulse 2s ease infinite; }

.cd-view-all {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  margin-top: 14px; font-size: 12px; font-weight: 600; color: var(--warning);
  text-decoration: none; border: 1px solid var(--warning); border-radius: 8px;
  padding: 8px 16px; background: transparent; transition: all 0.2s; width: 100%;
}
.cd-view-all:hover { background: rgba(255,149,0,0.08); }

/* ── Bar chart ── */
.cd-bar-item  { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.cd-bar-item:last-child { margin-bottom: 0; }
.cd-bar-label { font-size: 12px; color: var(--text-secondary); width: 70px; flex-shrink: 0; display: flex; align-items: center; gap: 6px; font-weight: 500; }
.cd-bar-track { flex: 1; height: 5px; border-radius: 3px; background: var(--border); overflow: hidden; }
.cd-bar-fill  { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
.cd-bar-val   { font-size: 12px; color: var(--text-secondary); width: 20px; text-align: right; flex-shrink: 0; font-weight: 500; }

/* ── Quick Actions grid ── */
.cd-qgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
.cd-qbtn  {
  display: flex; align-items: center; gap: 8px; padding: 12px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  cursor: pointer; font-size: 12px; font-weight: 600; color: var(--text-secondary);
  text-align: left; transition: all 0.2s; text-decoration: none;
}
.cd-qbtn:hover { color: var(--text); transform: translateY(-2px); border-color: var(--text-secondary); }
.cd-qbtn-ic { width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 1px solid var(--border); }
.cd-qbtn.qv-red   .cd-qbtn-ic { background: rgba(255,59,48,0.08);  border-color: var(--danger);  color: var(--danger);  }
.cd-qbtn.qv-green .cd-qbtn-ic { background: rgba(0,176,116,0.08);  border-color: var(--success); color: var(--success); }
.cd-qbtn.qv-blue  .cd-qbtn-ic { background: rgba(0,102,255,0.08);  border-color: var(--primary); color: var(--primary); }
.cd-qbtn.qv-amber .cd-qbtn-ic { background: rgba(255,149,0,0.08);  border-color: var(--warning); color: var(--warning); }

.cd-divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }

/* ── Utility ── */
.cd-spinner { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--primary); animation: spin 0.8s linear infinite; }
.cd-empty   { text-align: center; padding: 48px 24px; font-size: 12px; letter-spacing: 0.3px; color: var(--text-secondary); text-transform: uppercase; }
.cd-empty-inner { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.cd-empty-icon  { font-size: 28px; opacity: 0.3; margin-bottom: 4px; }
.cd-empty-link  {
  margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--primary);
  text-decoration: none; border: 1px solid var(--primary); border-radius: 8px;
  padding: 8px 16px; background: transparent; display: inline-flex; align-items: center; gap: 6px;
  transition: all 0.2s;
}
.cd-empty-link:hover { background: rgba(0,102,255,0.06); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .cd-sidebar { transform: translateX(-100%); width: min(260px, 90vw); box-shadow: 4px 0 12px rgba(0,0,0,0.1); }
  .cd-sidebar.open { transform: translateX(0); }
  .cd-sidebar-close { display: flex; }
  .cd-hamburger { display: flex; }
  .cd-main { margin-left: 0; }
  .cd-topbar { padding: 0 16px; }
  .cd-crumb-hide { display: none; }
  .cd-page { padding: 16px; }
  .cd-title { font-size: 26px; }
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

  // Recompute unread count whenever alerts change
  useEffect(() => {
    setUnreadCount(getUnreadCount(alerts));
  }, [alerts]);

  // ── Init ──
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user as any));

    const loadData = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) return;

        // Load reports
        const { data: reportData } = await supabase
          .from("reports")
          .select("id, description, type, status, created_at")
          .eq("user_id", u.id)
          .order("created_at", { ascending: false });
        setReports((reportData as Report[]) || []);

        // Load alerts
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

    // Reports realtime
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

    // Alerts realtime
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

  // ── Stats ──
  const stats = {
    total:      reports.length,
    pending:    reports.filter(r => r.status === "pending").length,
    inProgress: reports.filter(r => r.status === "in-progress").length,
    resolved:   reports.filter(r => r.status === "resolved").length,
  };

  // ── Type breakdown ──
  const typeCounts = reports.reduce((acc, r) => {
    const t = r.type?.toLowerCase() || "other";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const maxCount = Math.max(...TYPE_LIST.map(t => typeCounts[t] ?? 0), 1);

  // ── User display ──
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Citizen";
  const firstName   = displayName.split(" ")[0];
  const initials    = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const statCards = [
    { label: "Total Filed",  value: stats.total,      accent: "#0066FF", icon: <FaFileAlt />,           delta: "ALL TIME" },
    { label: "Pending",      value: stats.pending,    accent: "#FF3B30", icon: <FaExclamationTriangle />, delta: "REVIEW"   },
    { label: "In Progress",  value: stats.inProgress, accent: "#FF9500", icon: <FaSpinner />,            delta: undefined  },
    { label: "Resolved",     value: stats.resolved,   accent: "#00B074", icon: <FaCheckCircle />,        delta: undefined  },
  ];

  const quickActions = [
    { label: "File Report", icon: "📝", to: "/report",          colorClass: "qv-red"   },
    { label: "Safety Map",  icon: "🗺️", to: "/map",             colorClass: "qv-green" },
    { label: "My Reports",  icon: "📂", to: "/citizen/history",  colorClass: "qv-blue"  },
    { label: "Safety Tips", icon: "💡", to: "/safetytips",       colorClass: "qv-amber" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  // Mark alerts as read and navigate
  const handleViewAllAlerts = () => {
    markAlertsRead();
    setUnreadCount(0);
    navigate("/citizen/alerts");
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="cd-portal" style={{ backgroundImage: `url(${footerBg})` }}>
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

              {/* File Report */}
              <Link to="/report" className="cd-nav-btn" onClick={() => setSidebarOpen(false)}>
                <span className="cd-nav-ic"><FaFileAlt /></span>
                <span>File Report</span>
              </Link>

              {/* My Reports */}
              <Link to="/citizen/history" className="cd-nav-btn" onClick={() => setSidebarOpen(false)}>
                <span className="cd-nav-ic"><FaHistory /></span>
                <span>My Reports</span>
                {stats.total > 0 && <span className="cd-badge">{stats.total}</span>}
              </Link>

              {/* Barangay Alerts — badge only shows unread count */}
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

              {/* Safety Map */}
              <Link to="/map" className="cd-nav-btn" onClick={() => setSidebarOpen(false)}>
                <span className="cd-nav-ic"><FaMapMarkedAlt /></span>
                <span>Safety Map</span>
              </Link>

              {/* Safety Tips */}
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
                  {/* Bell navigates to alerts and marks as read */}
                  <button
                    className="cd-icon-btn"
                    aria-label="Notifications"
                    onClick={handleViewAllAlerts}
                  >
                    <FaBell size={13} />
                  </button>
                  {/* Dot only shows when there are unread alerts OR pending reports */}
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
                    <div className="cd-eyebrow">Citizen Portal</div>
                    <div className="cd-title">Welcome, {firstName}.</div>
                    <div className="cd-subtitle">DUMAGUETE CITY COMMUNITY SAFETY</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {loading && <div className="cd-spinner" />}
                    <div className="cd-live-tag"><span className="cd-live-dot" />LIVE</div>
                  </div>
                </div>

                {/* Pending reports banner */}
                {stats.pending > 0 && (
                  <div className="cd-alert">
                    <span className="cd-alert-text">
                      You have <strong>{stats.pending} pending report{stats.pending !== 1 ? "s" : ""}</strong> awaiting responder review.
                    </span>
                    <Link to="/citizen/history" className="cd-alert-link">
                      View reports
                    </Link>
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
                      <span className="cd-panel-tag">REAL-TIME</span>
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
                                <div>
                                  <span className="cd-pill" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>
                                    <span className="cd-pill-dot" />
                                    {sm.label}
                                  </span>
                                </div>
                                <div className="cd-inc-time">{formatRelative(r.created_at)}</div>
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
                          style={{ color: "var(--warning)", borderColor: "var(--warning)", background: "rgba(255,149,0,0.05)" }}
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
                          <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4, textTransform: "none" }}>
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
                                      <span className="cd-pill-dot" />
                                      {am.label}
                                    </span>
                                    {isNew && (
                                      <span className="cd-al-new">
                                        <span className="cd-al-new-dot" />NEW
                                      </span>
                                    )}
                                    <span className="cd-al-time">
                                      <FaClock size={9} />
                                      {formatRelative(a.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {/* Clicking this marks all as read */}
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

                    <div className="cd-panel-title" style={{ marginBottom: 12 }}>Quick Actions</div>
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