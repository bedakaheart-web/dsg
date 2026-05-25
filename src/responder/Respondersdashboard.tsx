import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../js/supabase";

import Dispatch from "./Dispatch";
import ResponderAlertsPage from "./Responderalertspage";
import ResponderIncidentsPage from "./IncidentsPage";
import ResponderTeamPage from "./Responderteam";
import dsgLogo from "../assets/dsg.logo.png";

// ─── Types & Constants ────────────────────────────────────────────────────────

type ViewId = "overview" | "incidents" | "alerts" | "dispatch" | "team";

interface Report {
  id: string | number;
  type: string;
  description: string | null;
  location: string | null;
  address: string | null;
  reporter_name: string | null;
  reporter_contact: string | null;
  status: string;
  evidence_url: string | null;
  created_at: string;
  responder_id: string | null;
}

const TYPE_META: Record<string, { icon: string; colorClass: string }> = {
  fire:     { icon: "🔥", colorClass: "tc-fire" },
  accident: { icon: "🚗", colorClass: "tc-accident" },
  flood:    { icon: "🌊", colorClass: "tc-flood" },
  crime:    { icon: "🚨", colorClass: "tc-crime" },
  medical:  { icon: "🏥", colorClass: "tc-medical" },
  other:    { icon: "⚠️", colorClass: "tc-other" },
};

const STATUS_META: Record<string, { label: string; colorClass: string }> = {
  pending:       { label: "PENDING", colorClass: "sc-pending" },
  "in-progress": { label: "IN PROGRESS", colorClass: "sc-progress" },
  resolved:      { label: "RESOLVED", colorClass: "sc-resolved" },
};

const NAV_ITEMS: Array<{ id: ViewId; label: string; group: "Operations" | "Team" }> = [
  { id: "overview",  label: "Overview",  group: "Operations" },
  { id: "dispatch",  label: "Dispatch",  group: "Operations" },
  { id: "incidents", label: "Incidents", group: "Operations" },
  { id: "alerts",    label: "Alerts",    group: "Operations" },
  { id: "team",      label: "Team",      group: "Team" },
];

// ─── Lightweight SVG Icons ────────────────────────────────────────────────────

const SvgIcon = ({ path, size = 16 }: { path: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: path }} />
);

const ICONS = {
  shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  radar:     "M12 2a10 10 0 1 0 10 10M12 6a6 6 0 0 0 0 12M12 10a2 2 0 0 0 0 4M12 2v10",
  clipboard: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 2h8v4H8z",
  bell:      "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  users:     "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  gauge:     "M12 2a10 10 0 1 0 10 10M12 12l4.5-4.5M12 12a1.5 1.5 0 0 1-1.5-1.5",
  menu:      "M3 12h18M3 6h18M3 18h18",
  x:         "M18 6L6 18M6 6l12 12",
  mapPin:    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  user:      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  signOut:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  check:     "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4l-10 10.01-3-3.01",
  warn:      "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17v.01",
  clock:     "M12 2a10 10 0 1 0 10 10M12 6v6l4 2",
};

function NavIcon({ id }: { id: ViewId }) {
  const iconMap: Record<ViewId, string> = {
    overview: ICONS.gauge,
    dispatch: ICONS.radar,
    incidents: ICONS.clipboard,
    alerts: ICONS.bell,
    team: ICONS.users,
  };
  return <SvgIcon path={iconMap[id]} size={16} />;
}

// ─── Optimized Styles ─────────────────────────────────────────────────────────

const STYLES = `
:root {
  --primary: #0066FF;
  --success: #00B074;
  --warning: #FF9500;
  --danger: #FF3B30;
  --bg: #FAFBFC;
  --surface: #FFFFFF;
  --border: #E5E7EB;
  --text: #1F2937;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Portal ─── */
.rd-portal {
  position: fixed;
  inset: 0;
  z-index: 9000;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  background: var(--bg);
}

.rd-shell {
  display: flex;
  height: 100%;
  width: 100%;
}

/* ─── Sidebar ─── */
.rd-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 190;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.rd-overlay.open { display: block; }

.rd-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 200;
}

.rd-logo {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border);
}

.rd-logo-ring {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.rd-logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
}

.rd-logo-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}

.rd-logo-sub {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.rd-pip {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--success);
  animation: pulse 2s ease infinite;
  flex-shrink: 0;
}

.rd-sidebar-close {
  display: none;
  margin-left: auto;
  flex-shrink: 0;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
}

.rd-sidebar-close:hover {
  background: var(--bg);
  color: var(--text);
  border-color: var(--text-secondary);
}

/* Navigation */
.rd-nav-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px 10px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.rd-nav-group {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 12px 8px 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rd-nav-group::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.rd-nav-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  margin-bottom: 2px;
  text-align: left;
  transition: all 0.2s;
  position: relative;
}

.rd-nav-btn:hover {
  background: var(--bg);
  color: var(--text);
  border-color: var(--border);
}

.rd-nav-btn.active {
  background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%);
  color: white;
  border-color: transparent;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 102, 255, 0.2);
}

.rd-nav-btn.active.team-nav {
  background: linear-gradient(135deg, var(--success) 0%, #00945a 100%);
  box-shadow: 0 2px 8px rgba(0, 176, 116, 0.2);
}

.rd-nav-ic {
  font-size: 16px;
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.rd-nav-btn.active .rd-nav-ic {
  color: white;
}

.rd-badge {
  margin-left: auto;
  background: var(--danger);
  color: white;
  font-size: 10px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease infinite;
  font-weight: 600;
}

.rd-badge-blue {
  margin-left: auto;
  background: var(--primary);
  color: white;
  font-size: 10px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* Sidebar Footer */
.rd-sidebar-foot {
  padding: 12px 10px 16px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.rd-user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 8px;
}

.rd-avatar {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 11px;
  color: white;
}

.rd-user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rd-user-role {
  font-size: 10px;
  color: var(--success);
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}

.rd-logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.rd-logout-btn:hover {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
}

/* ─── Main Area ─── */
.rd-main {
  margin-left: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

/* Topbar */
.rd-topbar {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 100;
  gap: 12px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.rd-hamburger {
  display: none;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.rd-hamburger:hover {
  background: var(--surface);
  border-color: var(--text-secondary);
  color: var(--text);
}

.rd-crumb {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.rd-crumb-sep { color: var(--text-tertiary); }

.rd-crumb-active {
  color: var(--text);
  font-weight: 600;
}

.rd-topbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.rd-clock {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 12px;
  white-space: nowrap;
}

.rd-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  position: relative;
}

.rd-icon-btn:hover {
  background: var(--bg);
  color: var(--text);
  border-color: var(--text-secondary);
}

.rd-notif-wrap { position: relative; }

.rd-notif-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--danger);
  border: 1px solid var(--surface);
  animation: pulse 1.5s ease infinite;
}

/* Page Content */
.rd-page {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.rd-page > div { animation: fadeIn 0.4s ease-out both; }

/* ─── Overview Section ─── */
.rd-ov-hd {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.rd-eyebrow {
  font-size: 11px;
  color: var(--primary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rd-eyebrow::before {
  content: '';
  display: block;
  width: 20px;
  height: 2px;
  background: var(--primary);
}

.rd-title {
  font-size: 32px;
  color: var(--text);
  letter-spacing: -0.5px;
  line-height: 1.1;
  font-weight: 700;
}

.rd-live {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--danger);
  background: rgba(255, 59, 48, 0.06);
  color: var(--danger);
  letter-spacing: 0.3px;
  white-space: nowrap;
  font-weight: 600;
}

.rd-live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--danger);
  animation: pulse 1.4s ease infinite;
}

/* Stat Grid */
.rd-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.rd-stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  cursor: default;
  animation: fadeIn 0.5s ease-out both;
}

.rd-stat:nth-child(2) { animation-delay: 0.05s; }
.rd-stat:nth-child(3) { animation-delay: 0.1s; }
.rd-stat:nth-child(4) { animation-delay: 0.15s; }

.rd-stat:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 8px 16px rgba(0, 102, 255, 0.1);
}

.rd-stat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
}

.rd-stat-icon {
  font-size: 20px;
  margin-bottom: 12px;
  opacity: 0.8;
}

.rd-stat-num {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
  font-weight: 700;
}

.rd-stat-label {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-weight: 500;
}

.rd-stat-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 9px;
  border: 1px solid currentColor;
  border-radius: 4px;
  padding: 2px 6px;
  opacity: 0.5;
}

.rd-stat.sv-red::before { background: var(--danger); }
.rd-stat.sv-red .rd-stat-num,
.rd-stat.sv-red .rd-stat-icon,
.rd-stat.sv-red .rd-stat-tag { color: var(--danger); }

.rd-stat.sv-amber::before { background: var(--warning); }
.rd-stat.sv-amber .rd-stat-num,
.rd-stat.sv-amber .rd-stat-icon,
.rd-stat.sv-amber .rd-stat-tag { color: var(--warning); }

.rd-stat.sv-blue::before { background: var(--primary); }
.rd-stat.sv-blue .rd-stat-num,
.rd-stat.sv-blue .rd-stat-icon,
.rd-stat.sv-blue .rd-stat-tag { color: var(--primary); }

.rd-stat.sv-green::before { background: var(--success); }
.rd-stat.sv-green .rd-stat-num,
.rd-stat.sv-green .rd-stat-icon,
.rd-stat.sv-green .rd-stat-tag { color: var(--success); }

/* Panels */
.rd-panels-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 1120px) { .rd-panels-row { grid-template-columns: 1fr; } }

.rd-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  min-width: 0;
  animation: slideIn 0.5s ease-out both;
}

.rd-panel:nth-child(2) { animation-delay: 0.1s; }

.rd-panel-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.rd-panel-title {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 600;
}

.rd-panel-tag {
  font-size: 9px;
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 4px;
  padding: 3px 8px;
  background: rgba(0, 102, 255, 0.05);
  font-weight: 600;
}

.rd-panel.pa-red::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--danger);
}

.rd-panel.pa-blue::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
}

/* Incident List */
.rd-inc-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.rd-inc-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.rd-inc-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.rd-inc-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.rd-inc-icon.tc-fire { background: rgba(255, 59, 48, 0.08); }
.rd-inc-icon.tc-accident { background: rgba(255, 149, 0, 0.08); }
.rd-inc-icon.tc-flood { background: rgba(0, 102, 255, 0.08); }
.rd-inc-icon.tc-crime { background: rgba(255, 45, 85, 0.08); }
.rd-inc-icon.tc-medical { background: rgba(0, 176, 116, 0.08); }
.rd-inc-icon.tc-other { background: rgba(155, 155, 155, 0.08); }

.rd-inc-body { flex: 1; min-width: 0; }

.rd-inc-type {
  font-size: 13px;
  font-weight: 700;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.rd-inc-type.tc-fire { color: var(--danger); }
.rd-inc-type.tc-accident { color: var(--warning); }
.rd-inc-type.tc-flood { color: var(--primary); }
.rd-inc-type.tc-crime { color: #FF2D55; }
.rd-inc-type.tc-medical { color: var(--success); }
.rd-inc-type.tc-other { color: #9B9B9B; }

.rd-inc-loc {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rd-inc-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.rd-pill {
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: 5px;
}

.rd-pill-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
}

.rd-pill.sc-pending {
  background: rgba(255, 59, 48, 0.08);
  color: var(--danger);
  border-color: var(--danger);
}

.rd-pill.sc-pending .rd-pill-dot { background: var(--danger); }

.rd-pill.sc-progress {
  background: rgba(255, 149, 0, 0.08);
  color: var(--warning);
  border-color: var(--warning);
}

.rd-pill.sc-progress .rd-pill-dot { background: var(--warning); }

.rd-pill.sc-resolved {
  background: rgba(0, 176, 116, 0.08);
  color: var(--success);
  border-color: var(--success);
}

.rd-pill.sc-resolved .rd-pill-dot { background: var(--success); }

.rd-pill-neutral {
  background: var(--bg);
  color: var(--text-secondary);
  border-color: var(--border);
}

.rd-inc-time {
  font-size: 10px;
  color: var(--text-tertiary);
  margin-top: 6px;
}

/* Bar Chart */
.rd-bar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.rd-bar-item:last-child { margin-bottom: 0; }

.rd-bar-label {
  font-size: 12px;
  color: var(--text-secondary);
  width: 70px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.rd-bar-track {
  flex: 1;
  height: 5px;
  border-radius: 3px;
  background: var(--border);
  overflow: hidden;
}

.rd-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.rd-bar-fill.tc-fire { background: var(--danger); }
.rd-bar-fill.tc-accident { background: var(--warning); }
.rd-bar-fill.tc-flood { background: var(--primary); }
.rd-bar-fill.tc-crime { background: #FF2D55; }
.rd-bar-fill.tc-medical { background: var(--success); }
.rd-bar-fill.tc-other { background: #9B9B9B; }

.rd-bar-val {
  font-size: 12px;
  color: var(--text-secondary);
  width: 20px;
  text-align: right;
  flex-shrink: 0;
  font-weight: 500;
}

/* Quick Actions */
.rd-qgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 14px;
}

.rd-qbtn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
  transition: all 0.2s;
}

.rd-qbtn:hover {
  color: var(--text);
  transform: translateY(-2px);
  border-color: var(--text-secondary);
}

.rd-qbtn-ic {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 1px solid var(--border);
}

.rd-qbtn.qv-red .rd-qbtn-ic { background: rgba(255, 59, 48, 0.08); border-color: var(--danger); color: var(--danger); }
.rd-qbtn.qv-blue .rd-qbtn-ic { background: rgba(0, 102, 255, 0.08); border-color: var(--primary); color: var(--primary); }
.rd-qbtn.qv-amber .rd-qbtn-ic { background: rgba(255, 149, 0, 0.08); border-color: var(--warning); color: var(--warning); }
.rd-qbtn.qv-green .rd-qbtn-ic { background: rgba(0, 176, 116, 0.08); border-color: var(--success); color: var(--success); }

.rd-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 14px 0;
}

/* Utilities */
.rd-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  animation: spin 0.8s linear infinite;
}

.rd-empty {
  text-align: center;
  padding: 48px 24px;
  font-size: 12px;
  letter-spacing: 0.3px;
  color: var(--text-secondary);
  text-transform: uppercase;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .rd-sidebar {
    transform: translateX(-100%);
    width: min(260px, 90vw);
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  }

  .rd-sidebar.open { transform: translateX(0); }
  .rd-sidebar-close { display: flex; }
  .rd-hamburger { display: flex; }
  .rd-main { margin-left: 0; }
  .rd-topbar { padding: 0 16px; }
  .rd-crumb-hide { display: none; }
  .rd-clock { display: none; }
  .rd-page { padding: 16px; }
  .rd-title { font-size: 26px; }
  .rd-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .rd-stat-num { font-size: 24px; }
  .rd-qgrid { grid-template-columns: 1fr; }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function usePHTClock(): string {
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

function formatRelative(ts: string): string {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function cls(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(" ");
}

// ─── Overview Panel ───────────────────────────────────────────────────────────

interface OverviewPanelProps {
  onNavigate: (v: ViewId) => void;
  responderId: string;
}

function OverviewPanel({ onNavigate, responderId }: OverviewPanelProps) {
  const [stats, setStats] = useState({ assigned: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!responderId) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("id,type,description,location,address,reporter_name,reporter_contact,status,evidence_url,created_at,responder_id")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Overview loadData error:", error.message);
        return;
      }

      const rows: Report[] = data ?? [];
      const mine = rows.filter((r) => r.responder_id === responderId);
      const counts: Record<string, number> = {};
      mine.forEach((r) => { counts[r.type] = (counts[r.type] ?? 0) + 1; });

      setStats({
        assigned: mine.length,
        pending: rows.filter((r) => r.status === "pending" && !r.responder_id).length,
        inProgress: mine.filter((r) => r.status === "in-progress").length,
        resolved: mine.filter((r) => r.status === "resolved").length,
      });
      setMyReports(mine.slice(0, 6));
      setTypeCounts(counts);
    } finally {
      setLoading(false);
    }
  }, [responderId]);

  useEffect(() => {
    loadData();
    const ch = supabase
      .channel("resp-overview")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, loadData)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [loadData]);

  const typeList = ["fire", "flood", "medical", "crime", "accident", "other"] as const;
  const maxCount = Math.max(...typeList.map((t) => typeCounts[t] ?? 0), 1);

  const statCards = [
    { label: "My Assignments", value: stats.assigned, colorClass: "sv-red", tag: "TOTAL", icon: "🛡️" },
    { label: "Unassigned", value: stats.pending, colorClass: "sv-amber", tag: "OPEN", icon: "⚠️" },
    { label: "In Progress", value: stats.inProgress, colorClass: "sv-blue", tag: undefined, icon: "⏱️" },
    { label: "Resolved", value: stats.resolved, colorClass: "sv-green", tag: undefined, icon: "✓" },
  ];

  const quickNav = [
    { id: "dispatch" as ViewId, label: "Dispatch", colorClass: "qv-red", icon: "📡" },
    { id: "incidents" as ViewId, label: "Incidents", colorClass: "qv-blue", icon: "📋" },
    { id: "alerts" as ViewId, label: "Alerts", colorClass: "qv-amber", icon: "🔔" },
    { id: "team" as ViewId, label: "Team", colorClass: "qv-green", icon: "👥" },
  ];

  return (
    <div>
      <div className="rd-ov-hd">
        <div>
          <div className="rd-eyebrow">Responder Panel</div>
          <div className="rd-title">Dashboard</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {loading && <div className="rd-spinner" />}
          <div className="rd-live"><span className="rd-live-dot" />LIVE</div>
        </div>
      </div>

      <div className="rd-stat-grid">
        {statCards.map((c) => (
          <div key={c.label} className={cls("rd-stat", c.colorClass)}>
            <div className="rd-stat-icon">{c.icon}</div>
            <div className="rd-stat-num">{loading ? "—" : c.value}</div>
            <div className="rd-stat-label">{c.label}</div>
            {c.tag && <span className="rd-stat-tag">{c.tag}</span>}
          </div>
        ))}
      </div>

      <div className="rd-panels-row">
        <div className="rd-panel pa-red" style={{ maxHeight: 480, overflowY: "auto" }}>
          <div className="rd-panel-hd">
            <span className="rd-panel-title">My Assignments</span>
            <span className="rd-panel-tag">ASSIGNED</span>
          </div>
          {loading ? (
            <div className="rd-empty"><div className="rd-spinner" style={{ margin: "0 auto" }} /></div>
          ) : myReports.length === 0 ? (
            <div className="rd-empty">NO ASSIGNMENTS</div>
          ) : (
            myReports.map((r) => {
              const tm = TYPE_META[r.type] ?? TYPE_META.other;
              const sm = STATUS_META[r.status] ?? STATUS_META.pending;
              return (
                <div key={String(r.id)} className="rd-inc-item">
                  <div className="rd-inc-row">
                    <div className={cls("rd-inc-icon", tm.colorClass)}>{tm.icon}</div>
                    <div className="rd-inc-body">
                      <div className={cls("rd-inc-type", tm.colorClass)}>{r.type}</div>
                      <div className="rd-inc-loc">
                        📍 {r.address || r.location || "—"}
                      </div>
                      <div className="rd-inc-pills">
                        <span className={cls("rd-pill", sm.colorClass)}>
                          <span className="rd-pill-dot" />
                          {sm.label}
                        </span>
                        {r.reporter_name && (
                          <span className="rd-pill rd-pill-neutral">
                            👤 {r.reporter_name}
                          </span>
                        )}
                      </div>
                      <div className="rd-inc-time">{formatRelative(r.created_at)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="rd-panel pa-blue">
          <div className="rd-panel-hd">
            <span className="rd-panel-title">Incident Breakdown</span>
            <span className="rd-panel-tag">BY TYPE</span>
          </div>
          {typeList.map((t) => {
            const tm = TYPE_META[t] ?? TYPE_META.other;
            const count = typeCounts[t] ?? 0;
            return (
              <div key={t} className="rd-bar-item">
                <span className="rd-bar-label">
                  <span>{tm.icon}</span>
                  <span style={{ textTransform: "capitalize" }}>{t}</span>
                </span>
                <div className="rd-bar-track">
                  <div
                    className={cls("rd-bar-fill", tm.colorClass)}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="rd-bar-val">{count}</span>
              </div>
            );
          })}

          <hr className="rd-divider" />
          <div className="rd-panel-title" style={{ marginBottom: 12 }}>Quick Actions</div>
          <div className="rd-qgrid">
            {quickNav.map((q) => (
              <button
                key={q.id}
                className={cls("rd-qbtn", q.colorClass)}
                onClick={() => onNavigate(q.id)}
              >
                <span className={cls("rd-qbtn-ic")}>{q.icon}</span>
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function RespondersDashboard() {
  const navigate = useNavigate();
  const clock = usePHTClock();

  const [view, setView] = useState<ViewId>("overview");
  const [pendingCount, setPendingCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [responderName, setResponderName] = useState("Responder");
  const [responderId, setResponderId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const handleNavigate = (v: ViewId) => {
    setView(v);
    setSidebarOpen(false);
    if (v === "alerts") setAlertCount(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setResponderId(user.id);
          const { data: profile } = await supabase
            .from("profiles").select("full_name").eq("id", user.id).single();
          if (profile?.full_name) setResponderName(profile.full_name);
        }

        const { data: rptData } = await supabase
          .from("reports").select("id").eq("status", "pending").is("responder_id", null);
        setPendingCount((rptData ?? []).length);

        const { data: alData } = await supabase
          .from("alerts").select("id").order("created_at", { ascending: false }).limit(50);
        setAlertCount((alData ?? []).length);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setAuthReady(true);
      }
    };

    load();

    const ch = supabase
      .channel("resp-pending")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const initials = responderName
    ? responderName.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase()
    : "?";

  const PAGE_TITLE: Record<ViewId, string> = {
    overview: "Overview", dispatch: "Dispatch",
    incidents: "Incidents", alerts: "Alerts", team: "Team",
  };

  const navGroups: Array<{ label: string; items: typeof NAV_ITEMS }> = [
    { label: "Operations", items: NAV_ITEMS.filter((n) => n.group === "Operations") },
    { label: "Team", items: NAV_ITEMS.filter((n) => n.group === "Team") },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="rd-portal">
        <div className={cls("rd-overlay", sidebarOpen && "open")} onClick={() => setSidebarOpen(false)} />

        <div className="rd-shell">
          {/* Sidebar */}
          <aside className={cls("rd-sidebar", sidebarOpen && "open")} aria-label="Navigation">
            <div className="rd-logo">
              <div className="rd-logo-ring">
                <img src={dsgLogo} alt="DumaSafeGuide" className="rd-logo-img" />
              </div>
              <div>
                <div className="rd-logo-name">DumaSafeGuide</div>
                <div className="rd-logo-sub"><span className="rd-pip" />RESPONDER</div>
              </div>
              <button className="rd-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close">
                <SvgIcon path={ICONS.x} />
              </button>
            </div>

            <nav className="rd-nav-scroll">
              {navGroups.map((g) => (
                <div key={g.label}>
                  <div className="rd-nav-group">{g.label}</div>
                  {g.items.map((item) => (
                    <button
                      key={item.id}
                      className={cls(
                        "rd-nav-btn",
                        view === item.id && "active",
                        item.id === "team" && "team-nav"
                      )}
                      onClick={() => handleNavigate(item.id)}
                    >
                      <span className="rd-nav-ic"><NavIcon id={item.id} /></span>
                      <span>{item.label}</span>
                      {item.id === "incidents" && pendingCount > 0 && (
                        <span className="rd-badge">{pendingCount}</span>
                      )}
                      {item.id === "alerts" && alertCount > 0 && view !== "alerts" && (
                        <span className="rd-badge-blue">{alertCount}</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </nav>

            <div className="rd-sidebar-foot">
              <div className="rd-user-card">
                <div className="rd-avatar">{initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="rd-user-name">{responderName}</div>
                  <div className="rd-user-role"><span className="rd-pip" />ON DUTY</div>
                </div>
              </div>
              <button className="rd-logout-btn" onClick={handleLogout}>
                <SvgIcon path={ICONS.signOut} /> Sign Out
              </button>
            </div>
          </aside>

          {/* Main */}
          <div className="rd-main">
            <header className="rd-topbar">
              <button className="rd-hamburger" onClick={() => setSidebarOpen(true)}>
                <SvgIcon path={ICONS.menu} />
              </button>

              <div className="rd-crumb">
                <span className="rd-crumb-hide">DUMASAFEGUIDE</span>
                <span className="rd-crumb-sep rd-crumb-hide">/</span>
                <span className="rd-crumb-hide">RESPONDER</span>
                <span className="rd-crumb-sep rd-crumb-hide">/</span>
                <span className="rd-crumb-active">{PAGE_TITLE[view]}</span>
              </div>

              <div className="rd-topbar-right">
                <span className="rd-clock">{clock}</span>
                <div className="rd-notif-wrap">
                  <button className="rd-icon-btn" onClick={() => handleNavigate("alerts")}>
                    <SvgIcon path={ICONS.bell} />
                  </button>
                  {alertCount > 0 && view !== "alerts" && <span className="rd-notif-dot" />}
                </div>
              </div>
            </header>

            <main className="rd-page">
              {view === "overview" && !authReady && (
                <div className="rd-empty">
                  <div className="rd-spinner" style={{ margin: "0 auto" }} />
                </div>
              )}
              {view === "overview" && authReady && (
                <OverviewPanel onNavigate={handleNavigate} responderId={responderId} />
              )}
              {view === "dispatch" && <Dispatch />}
              {view === "incidents" && <ResponderIncidentsPage />}
              {view === "alerts" && <ResponderAlertsPage />}
              {view === "team" && <ResponderTeamPage />}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}