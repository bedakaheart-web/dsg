import { useEffect, useRef, useState } from "react";
import { Marker, Polyline } from "react-leaflet";
import { supabase } from "../js/supabase";
import { TranslatedDescription } from "../components/TranslatedDescription";
import DispatchMap, { INCIDENT_HEX, MapFollow, incidentPin, unitPin } from "../components/dispatch/DispatchMap";
import { HQ_POS, formatDistance, formatEta, hasCoords, haversineKm, interpolateRoute, parseCoords, routeLengthKm } from "../components/dispatch/geo";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Report {
  id: string | number;
  type: string;
  description: string | null;
  description_lang: string | null;
  description_translated: string | null;
  location: string | null;
  address: string | null;
  reporter_name: string | null;
  reporter_contact: string | null;
  status: string;
  evidence_url: string | null;
  created_at: string;
  responder_id: string | null;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; label: string; colorClass: string }> = {
  fire:     { icon: "🔥", label: "Fire",     colorClass: "type-fire" },
  accident: { icon: "🚗", label: "Accident", colorClass: "type-accident" },
  flood:    { icon: "🌊", label: "Flood",    colorClass: "type-flood" },
  crime:    { icon: "🚨", label: "Crime",    colorClass: "type-crime" },
  medical:  { icon: "🏥", label: "Medical",  colorClass: "type-medical" },
  other:    { icon: "⚠️", label: "Other",    colorClass: "type-other" },
};

const STATUS_META: Record<string, { label: string; colorClass: string }> = {
  pending:       { label: "Pending",     colorClass: "status-pending" },
  "in-progress": { label: "In Progress", colorClass: "status-in-progress" },
  resolved:      { label: "Resolved",    colorClass: "status-resolved" },
};

// (Incident hex colors live in src/components/dispatch/DispatchMap.tsx as
// INCIDENT_HEX — shared with AdminDispatch.)

// ─── Unified Dispatch Styles ──────────────────────────────────────────────────

const DISPATCH_STYLES = `
:root {
  /* Core Colors - Professional Light Theme */
  --primary:        #0052CC;
  --primary-light:  #4D94FF;
  --success:        #0B6623;
  --success-light:  #2FA232;
  --warning:        #974F0C;
  --warning-light:  #D97706;
  --danger:         #AE2A19;
  --danger-light:   #DC2626;
  --info:           #0369A1;

  /* Backgrounds */
  --bg-primary:     #0d1117;
  --bg-secondary:   rgba(15,21,33,0.82);
  --surface:        rgba(15,21,33,0.82);
  
  /* Text */
  --text-primary:   #eef0f7;
  --text-secondary: rgba(238,240,247,0.55);
  --text-tertiary:  rgba(238,240,247,0.28);
  
  /* Borders & Accents */
  --border-light:   rgba(255,255,255,0.07);
  --border-med:     rgba(255,255,255,0.12);
  --border-dark:    rgba(255,255,255,0.20);
  
  /* Semantic */
  --error:          #DC2626;
  --success-bg:     rgba(46,204,143,0.08);
  --warning-bg:     rgba(245,200,66,0.08);
  --error-bg:       rgba(239,91,91,0.08);
  --info-bg:        rgba(91,141,239,0.08);
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
@keyframes spin { to { transform: rotate(360deg); } }

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif; }

/* ── Container ── */
.dp {
  font-family: inherit;
  color: var(--text-primary);
  min-height: 100vh;
  background: rgba(8,12,20,0.93);
  padding: 28px;
  font-size: 14px;
  line-height: 1.5;
}

/* ── Header ── */
.dp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 28px;
}

.dp-eyebrow {
  font-size: 11px;
  color: var(--primary);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dp-eyebrow::before {
  content: '';
  display: block;
  width: 18px;
  height: 2px;
  background: var(--primary);
}

.dp-title {
  font-size: 36px;
  color: var(--text-primary);
  letter-spacing: -0.4px;
  line-height: 1.1;
  font-weight: 800;
}

.dp-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.dp-live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 7px 13px;
  border-radius: 8px;
  border: 1px solid var(--danger-light);
  background: var(--error-bg);
  color: var(--danger-light);
  letter-spacing: 0.4px;
  white-space: nowrap;
  font-weight: 700;
}

.dp-live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--danger-light);
  animation: pulse 1.4s ease infinite;
}

/* ── Filter bar ── */
.dp-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.dp-filter-label {
  font-size: 10px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  font-weight: 700;
}

.dp-filter-sep {
  width: 1px;
  height: 20px;
  background: var(--border-light);
  margin: 0 4px;
  flex-shrink: 0;
}

.dp-filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.dp-chip {
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid var(--border-light);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  transition: all 0.2s;
  white-space: nowrap;
  user-select: none;
  letter-spacing: 0.3px;
  font-weight: 500;
}

.dp-chip:hover {
  border-color: var(--border-med);
  color: var(--text-primary);
  background: var(--surface);
}

.dp-chip.active {
  background: linear-gradient(135deg, var(--primary) 0%, #0052CC 100%);
  border-color: transparent;
  color: white;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 82, 204, 0.2);
}

.dp-chip-count {
  display: inline-block;
  margin-left: 5px;
  font-size: 8px;
  opacity: 0.65;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 3px;
  padding: 2px 5px;
  font-weight: 700;
}

/* ── Layout ── */
.dp-body {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;
  align-items: start;
}

@media (max-width: 1140px) {
  .dp-body { grid-template-columns: 1fr; }
}

/* ── Panels ── */
.dp-panel {
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  animation: slideIn 0.5s ease-out both;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.dp-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

.dp-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.dp-panel-title {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.dp-count-pill {
  font-size: 9px;
  padding: 4px 10px;
  border-radius: 6px;
  background: linear-gradient(135deg, var(--primary) 0%, #0052CC 100%);
  border: none;
  color: white;
  letter-spacing: 0.3px;
  font-weight: 700;
}

/* ── Map ── */
.dp-map-wrap { width: 100%; height: 540px; position: relative; border-radius: 8px; overflow: hidden; }
.dp-map-wrap .leaflet-container { width: 100%; height: 100%; background: #0d1117; touch-action: pan-x pan-y; }

/* ── Telemetry HUD (overlay shell ignores pointer; controls re-enable it) ── */
.dp-hud { position: absolute; top: 12px; left: 12px; right: 12px; z-index: 600; display: flex; justify-content: flex-start; pointer-events: none; }
.dp-hud-card {
  pointer-events: none; max-width: 420px;
  background: rgba(13,17,23,0.88); border: 1px solid var(--border-med);
  border-radius: 10px; padding: 10px 12px; backdrop-filter: blur(8px);
  display: flex; flex-direction: column; gap: 6px;
}
.dp-hud-badge {
  display: inline-flex; align-items: center; gap: 7px; align-self: flex-start;
  font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
  color: #4D94FF; background: rgba(0,102,255,0.12); border: 1px solid rgba(0,102,255,0.4);
  border-radius: 20px; padding: 4px 11px;
}
.dp-hud-badge.arrived { color: #2FA232; background: rgba(47,162,50,0.12); border-color: rgba(47,162,50,0.45); }
.dp-hud-badge.idle { color: var(--text-secondary); background: rgba(255,255,255,0.04); border-color: var(--border-med); }
.dp-hud-pulse { width: 8px; height: 8px; border-radius: 50%; background: currentColor; animation: pulse 1.6s ease infinite; flex-shrink: 0; }
.dp-hud-pulse.idle { animation: none; opacity: 0.5; }
.dp-hud-meta { font-size: 12px; font-weight: 700; color: var(--text-primary); }
.dp-hud-sub { font-size: 10.5px; color: var(--text-tertiary); }
.dp-hud-actions { display: flex; gap: 6px; flex-wrap: wrap; pointer-events: auto; }
.dp-hud-btn {
  font-family: inherit; font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
  padding: 7px 12px; border-radius: 7px; cursor: pointer;
  background: rgba(255,255,255,0.05); border: 1px solid var(--border-med); color: var(--text-primary);
  transition: all .15s; min-height: 34px;
}
.dp-hud-btn:hover { border-color: var(--primary-light); }
.dp-hud-btn.primary { background: rgba(0,102,255,0.15); border-color: rgba(0,102,255,0.5); color: #4D94FF; }
.dp-hud-btn.on { border-color: rgba(47,162,50,0.55); color: #2FA232; }
.dp-hud-btn.danger { border-color: rgba(220,38,38,0.5); color: #DC2626; }

.dp-map-overlay {
  position: absolute;
  bottom: 14px;
  left: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10;
  pointer-events: none;
}

.dp-map-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  backdrop-filter: blur(10px);
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.dp-map-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 540px;
  gap: 10px;
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  background: var(--bg-secondary);
  border-radius: 8px;
}

/* ── Queue ── */
.dp-queue {
  max-height: 576px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-light) transparent;
}

.dp-queue::-webkit-scrollbar { width: 4px; }
.dp-queue::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 2px;
}

/* ── Cards ── */
.dp-card {
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-light);
  position: relative;
  transition: all 0.2s;
  animation: fadeIn 0.3s ease-out both;
}

.dp-card::after {
  content: '';
  position: absolute;
  left: 0; top: 8px; bottom: 8px;
  width: 2px;
  border-radius: 0 1px 1px 0;
  transform: scaleY(0);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.dp-card:hover { background: var(--bg-secondary); }
.dp-card:hover::after,
.dp-card.selected::after { transform: scaleY(1); }
.dp-card.selected { background: rgba(0, 82, 204, 0.04); }
.dp-card:last-child { border-bottom: none; }

/* Card accent colors by type */
.dp-card.type-fire::after      { background: var(--danger-light); }
.dp-card.type-accident::after   { background: var(--warning-light); }
.dp-card.type-flood::after      { background: var(--primary); }
.dp-card.type-crime::after      { background: var(--danger-light); }
.dp-card.type-medical::after    { background: var(--success-light); }
.dp-card.type-other::after      { background: var(--text-tertiary); }

.dp-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  gap: 8px;
}

.dp-card-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  flex: 1;
  min-width: 0;
}

.dp-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  border: 1px solid var(--border-light);
}

/* Type-specific icon bg */
.dp-card.type-fire     .dp-card-icon { background: rgba(220, 38, 38, 0.08); }
.dp-card.type-accident .dp-card-icon { background: rgba(217, 119, 6, 0.08); }
.dp-card.type-flood    .dp-card-icon { background: rgba(0, 82, 204, 0.08); }
.dp-card.type-crime    .dp-card-icon { background: rgba(220, 38, 38, 0.08); }
.dp-card.type-medical  .dp-card-icon { background: rgba(11, 102, 35, 0.08); }
.dp-card.type-other    .dp-card-icon { background: rgba(156, 163, 175, 0.08); }

/* Type-specific label color */
.dp-card.type-fire     .dp-card-type-label { color: var(--danger-light); }
.dp-card.type-accident .dp-card-type-label { color: var(--warning-light); }
.dp-card.type-flood    .dp-card-type-label { color: var(--primary); }
.dp-card.type-crime    .dp-card-type-label { color: var(--danger-light); }
.dp-card.type-medical  .dp-card-type-label { color: var(--success-light); }
.dp-card.type-other    .dp-card-type-label { color: var(--text-tertiary); }

/* ── Status badges ── */
.dp-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.3px;
  font-weight: 700;
}

.dp-status-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.dp-status.status-pending {
  background: var(--error-bg);
  color: var(--danger-light);
  border-color: var(--danger-light);
}

.dp-status.status-pending .dp-status-dot { background: var(--danger-light); }

.dp-status.status-in-progress {
  background: var(--warning-bg);
  color: var(--warning-light);
  border-color: var(--warning-light);
}

.dp-status.status-in-progress .dp-status-dot { background: var(--warning-light); }

.dp-status.status-resolved {
  background: var(--success-bg);
  color: var(--success-light);
  border-color: var(--success-light);
}

.dp-status.status-resolved .dp-status-dot { background: var(--success-light); }

/* ── Meta & tags ── */
.dp-card-addr {
  font-size: 11px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.dp-card-desc {
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-secondary);
  font-style: italic;
  border-left: 2px solid var(--border-light);
  padding-left: 10px;
  margin: 6px 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dp-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  margin-bottom: 8px;
}

.dp-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 5px;
  border: 1px solid var(--border-light);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-weight: 500;
}

.dp-tag-tel {
  color: var(--success-light);
  border-color: var(--success-light);
  background: var(--success-bg);
  text-decoration: none;
  cursor: pointer;
  font-weight: 700;
}

.dp-tag-tel:hover { background: rgba(11, 102, 35, 0.15); }

/* ── Action buttons ── */
.dp-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.dp-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 6px 11px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  text-transform: uppercase;
}

.dp-btn:hover { transform: translateY(-1px); }

.dp-btn-claim {
  background: var(--error-bg);
  border-color: var(--danger-light);
  color: var(--danger-light);
}

.dp-btn-claim:hover {
  background: rgba(220, 38, 38, 0.15);
  border-color: var(--danger-light);
}

.dp-btn-resolve {
  background: var(--success-bg);
  border-color: var(--success-light);
  color: var(--success-light);
}

.dp-btn-resolve:hover {
  background: rgba(11, 102, 35, 0.15);
  border-color: var(--success-light);
}

.dp-btn-nav {
  background: var(--info-bg);
  border-color: var(--primary);
  color: var(--primary);
}

.dp-btn-nav:hover {
  background: rgba(0, 82, 204, 0.15);
  border-color: var(--primary);
}

/* ── Utility ── */
.dp-spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border-light);
  border-top-color: var(--primary);
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

.dp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-align: center;
  text-transform: uppercase;
}

.dp-empty-icon { font-size: 28px; opacity: 0.2; }

.dp-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .dp { padding: 16px; }
  .dp-title { font-size: 28px; }
  .dp-body { grid-template-columns: 1fr; }
  .dp-filters { flex-direction: column; align-items: flex-start; }
  .dp-filter-group { width: 100%; }
  /* Queue stacks below the map; shorter map keeps touch gestures smooth. */
  .dp-map-wrap { height: 380px; }
  .dp-hud-card { max-width: 100%; }
  .dp-hud-actions .dp-hud-btn { min-height: 40px; }
}
`;

// ─── SVG Icons (lightweight) ──────────────────────────────────────────────

const Icon = {
  MapPin: () => (
    <svg className="dp-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Clock: () => (
    <svg className="dp-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  User: () => (
    <svg className="dp-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Phone: () => (
    <svg className="dp-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  Bolt: () => (
    <svg className="dp-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Check: () => (
    <svg className="dp-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Route: () => (
    <svg className="dp-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="3"/><path d="M9 19h8.5c.4 0 .9-.2 1.2-.5l2.7-2.7c.3-.3.5-.7.6-1.1V5"/><path d="M18 5a3 3 0 0 0-3-3H9L6 5"/><circle cx="18" cy="5" r="3"/>
    </svg>
  ),
  File: () => (
    <svg className="dp-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  Filter: () => (
    <svg className="dp-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Layers: () => (
    <svg className="dp-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  Radar: () => (
    <svg className="dp-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6a6 6 0 0 0 0 12"/><path d="M12 10a2 2 0 0 0 0 4"/><line x1="12" y1="2" x2="12" y2="12"/>
    </svg>
  ),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelative(ts: string): string {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

// (parseCoords/hasCoords/haversineKm/interpolateRoute/routeLengthKm/HQ_POS
// live in src/components/dispatch/geo.ts — shared with AdminDispatch.)

interface OsrmRoute {
  path: [number, number][];
  distanceM: number;
  durationS: number;
}

// Real road geometry from the free OSRM demo server. Returns null on any
// failure (offline, no route, timeout) so callers fall back to the direct
// interpolated path instead of breaking the dispatch flow.
async function fetchOsrmRoute(from: [number, number], to: [number, number]): Promise<OsrmRoute | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}` +
      `?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const json = await res.json();
    const route = json?.routes?.[0];
    const coords: Array<[number, number]> | undefined = route?.geometry?.coordinates;
    if (!route || !Array.isArray(coords) || coords.length < 2) return null;
    return {
      path: coords.map(([lng, lat]) => [lat, lng] as [number, number]),
      distanceM: typeof route.distance === "number" ? route.distance : 0,
      durationS: typeof route.duration === "number" ? route.duration : 0,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function cls(...args: (string | false | undefined | null)[]): string {
  return args.filter(Boolean).join(" ");
}

// (MapFollow/unitIcon/incidentIcon live in src/components/dispatch/DispatchMap.tsx —
// shared with AdminDispatch so markers and follow behavior match exactly.)

// ─── Live map view (Leaflet) + telemetry HUD ────────────────────────────────

interface MapViewProps {
  reports: Report[];
  selectedReport: Report | null;
  markerPos: [number, number] | null;
  unitHeading: number | null;
  unitSpeed: number | null;
  dispatchPath: [number, number][];
  dispatchReportId: string | null;
  arrived: boolean;
  remainingKm: number;
  etaMin: number;
  routeViaRoad: boolean | null;
  routing: boolean;
  follow: boolean;
  recenterTick: number;
  gpsOn: boolean;
  dutyActive: boolean;
  gpsError: string | null;
  onSelect: (id: string | null) => void;
  onDispatch: (reportId: string, dest: [number, number]) => void;
  onCancelDispatch: () => void;
  onArrived: () => void;
  onRecenter: () => void;
  onToggleFollow: () => void;
  onToggleGps: () => void;
}

function DispatchMapView(props: MapViewProps) {
  const {
    reports, selectedReport, markerPos, unitHeading, unitSpeed,
    dispatchPath, dispatchReportId, arrived, remainingKm, etaMin,
    routeViaRoad, routing,
    follow, recenterTick, gpsOn, dutyActive, gpsError,
    onSelect, onDispatch, onCancelDispatch, onArrived,
    onRecenter, onToggleFollow, onToggleGps,
  } = props;

  const selCoords = selectedReport ? parseCoords(selectedReport.location) : null;
  const center: [number, number] = selCoords ?? markerPos ?? HQ_POS;
  const dispatching = dispatchPath.length > 1;
  const withCoords = reports.filter(r => parseCoords(r.location) !== null);

  return (
    <DispatchMap
      center={center}
      hud={
        <div className="dp-hud-card">
          {dispatching ? (
            <>
              <span className={`dp-hud-badge${arrived ? " arrived" : ""}`}>
                <span className="dp-hud-pulse" />
                {arrived
                  ? `On Scene — Incident #${String(dispatchReportId).slice(0, 8)}`
                  : `En Route to Incident #${String(dispatchReportId).slice(0, 8)}`}
              </span>
              {!arrived && (
                <span className="dp-hud-meta">
                  Distance Remaining: {formatDistance(remainingKm)}
                  {" · "}Estimated Arrival: {formatEta(etaMin)}
                  {unitSpeed != null && unitSpeed > 0 ? ` · ${(unitSpeed * 3.6).toFixed(0)} km/h` : ""}
                </span>
              )}
              <span className="dp-hud-sub">
                {routing ? "Finding road route…" : routeViaRoad ? "Road route · OSRM" : routeViaRoad === false ? "Direct path (routing unavailable)" : "Direct path"}
                {" · "}Follow {follow ? "On" : "Off"}
              </span>
              <div className="dp-hud-actions">
                {!arrived && <button className="dp-hud-btn" onClick={onArrived}>Mark Arrived at Scene</button>}
                <button className="dp-hud-btn" onClick={onRecenter}>Recenter Map</button>
                <button className="dp-hud-btn" onClick={onToggleFollow}>{follow ? "Follow: On" : "Follow: Off"}</button>
                <button className="dp-hud-btn danger" onClick={onCancelDispatch}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <span className="dp-hud-badge idle">
                <span className="dp-hud-pulse idle" />
                {selectedReport ? `Incident #${String(selectedReport.id).slice(0, 8)} selected` : "Unit idle — select an incident"}
              </span>
              {selCoords && (
                <div className="dp-hud-actions">
                  <button className="dp-hud-btn primary" onClick={() => onDispatch(String(selectedReport!.id), selCoords)}>
                    Dispatch to Incident
                  </button>
                </div>
              )}
              <div className="dp-hud-actions">
                <button className={`dp-hud-btn${gpsOn ? " on" : ""}`} onClick={onToggleGps}>
                  Live GPS Broadcast: {gpsOn ? "On" : "Off"}
                </button>
              </div>
              <span className="dp-hud-sub">
                {dutyActive ? (gpsOn ? (markerPos ? "Broadcasting position" : "Waiting for GPS fix…") : "GPS broadcast paused") : "Go on duty to broadcast"}
                {gpsError ? ` · ${gpsError}` : ""}
              </span>
            </>
          )}
        </div>
      }
    >
      <MapFollow pos={markerPos} follow={follow && dispatching} recenterTick={recenterTick} />
      {dispatching && (
        <Polyline positions={dispatchPath} pathOptions={{ color: "#0066FF", weight: 4, opacity: 0.8, dashArray: "8 6" }} />
      )}
      {withCoords.map(r => {
        const pos = parseCoords(r.location)!;
        const isSel = selectedReport && String(r.id) === String(selectedReport.id);
        return (
          <Marker
            key={String(r.id)}
            position={pos}
            icon={incidentPin(INCIDENT_HEX[r.type] ?? INCIDENT_HEX.other, !!isSel)}
            eventHandlers={{ click: () => onSelect(isSel ? null : String(r.id)) }}
          />
        );
      })}
      {markerPos && (
        <Marker position={markerPos} icon={unitPin(unitHeading)} zIndexOffset={1000} />
      )}
    </DispatchMap>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dispatch() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [responderId, setResponderId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ── Live unit tracking ─────────────────────────────────────────────────
  const [unitPos, setUnitPos] = useState<[number, number] | null>(null);
  const [unitHeading, setUnitHeading] = useState<number | null>(null);
  const [unitSpeed, setUnitSpeed] = useState<number | null>(null);
  const [dutyActive, setDutyActive] = useState(false);
  const [gpsOn, setGpsOn] = useState(true);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const lastBroadcast = useRef<{ at: number; pos: [number, number] }>({ at: 0, pos: HQ_POS });

  // ── Dispatch simulation ────────────────────────────────────────────────
  const [dispatchPath, setDispatchPath] = useState<[number, number][]>([]);
  const [dispatchT, setDispatchT] = useState(0); // meters travelled along path
  const [dispatchReportId, setDispatchReportId] = useState<string | null>(null);
  const [routeMeta, setRouteMeta] = useState<{ viaRoad: boolean; totalM: number; durationS: number } | null>(null);
  const [routing, setRouting] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [follow, setFollow] = useState(true);
  const [recenterTick, setRecenterTick] = useState(0);
  const dispatchIdRef = useRef<string | null>(null);

  const SIM_SPEED_MPS = 20; // simulated unit speed along the route
  const ETA_SPEED_KMH = 30; // urban-average speed used for the ETA readout

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setResponderId(user.id);
        supabase.from("profiles").select("status").eq("id", user.id).single().then(({ data }) => {
          const s = (data as { status?: string } | null)?.status;
          setDutyActive(s === "on_duty" || s === "responding");
        });
      }
    });
  }, []);

  // ── Live device geolocation broadcast (task-spec pattern) ──────────────
  // Tracks only while the responder is on duty/responding and the GPS toggle
  // is on. Writes are throttled (moved >15 m or 20 s elapsed) and failures
  // (e.g. denied permission, missing columns) degrade to local-only tracking.
  useEffect(() => {
    if (!dutyActive || !gpsOn) return;
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported on this device.");
      return;
    }
    setGpsError(null);
    const writeLocation = async (latitude: number, longitude: number, heading: number | null, speed: number | null) => {
      if (!responderId) return;
      const last = lastBroadcast.current;
      const movedM = haversineKm(last.pos, [latitude, longitude]) * 1000;
      if (Date.now() - last.at < 20000 && movedM < 15) return;
      lastBroadcast.current = { at: Date.now(), pos: [latitude, longitude] };
      try {
        await supabase.from("profiles").update({
          last_lat: latitude,
          last_lng: longitude,
          last_heading: heading,
          last_speed: speed,
          location_updated_at: new Date().toISOString(),
        }).eq("id", responderId);
      } catch (err) {
        console.warn("Geolocation broadcast error:", err);
      }
    };
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading, speed } = pos.coords;
        setUnitPos([latitude, longitude]);
        setUnitHeading(heading);
        setUnitSpeed(speed);
        void writeLocation(latitude, longitude, heading, speed);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setGpsError(err.code === err.PERMISSION_DENIED ? "Location permission denied." : "Location unavailable.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [dutyActive, gpsOn, responderId]);

  // ── Dispatch simulator loop (requestAnimationFrame) ────────────────────
  const pathLengthM = dispatchPath.length > 1 ? routeLengthKm(dispatchPath) * 1000 : 0;
  useEffect(() => {
    if (dispatchPath.length < 2 || arrived) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1);
      last = now;
      setDispatchT(prev => {
        const next = prev + dt * SIM_SPEED_MPS;
        if (next >= pathLengthM) {
          setArrived(true);
          return pathLengthM;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dispatchPath, arrived, pathLengthM]);

  // Interpolated unit position along the simulated route.
  const simPos: [number, number] | null = (() => {
    if (dispatchPath.length < 2) return null;
    let remaining = Math.min(dispatchT, pathLengthM);
    for (let i = 1; i < dispatchPath.length; i++) {
      const segM = haversineKm(dispatchPath[i - 1], dispatchPath[i]) * 1000;
      if (remaining <= segM) {
        const f = segM === 0 ? 0 : remaining / segM;
        return [
          dispatchPath[i - 1][0] + (dispatchPath[i][0] - dispatchPath[i - 1][0]) * f,
          dispatchPath[i - 1][1] + (dispatchPath[i][1] - dispatchPath[i - 1][1]) * f,
        ];
      }
      remaining -= segM;
    }
    return dispatchPath[dispatchPath.length - 1];
  })();

  // Live marker = simulated position while dispatching, else the GPS fix.
  const markerPos = simPos ?? unitPos;
  const remainingM = simPos ? Math.max(0, pathLengthM - Math.min(dispatchT, pathLengthM)) : 0;
  const remainingKm = remainingM / 1000;

  // Dynamic ETA: live GPS speed wins; else OSRM duration scaled by remaining
  // fraction; else urban-average fallback. All in minutes.
  const etaMin = (() => {
    if (!simPos || arrived) return 0;
    if (unitSpeed != null && unitSpeed > 1) return remainingM / unitSpeed / 60;
    if (routeMeta && routeMeta.durationS > 0 && routeMeta.totalM > 0) {
      return (routeMeta.durationS * (remainingM / routeMeta.totalM)) / 60;
    }
    return (remainingKm / ETA_SPEED_KMH) * 60;
  })();

  const startDispatch = async (reportId: string, dest: [number, number]) => {
    const from = unitPos ?? HQ_POS;
    dispatchIdRef.current = reportId;
    // Show the run immediately on the direct path, then upgrade to road
    // geometry once OSRM responds (progress preserved proportionally).
    setDispatchPath(interpolateRoute(from, dest));
    setDispatchT(0);
    setDispatchReportId(reportId);
    setRouteMeta(null);
    setRouting(true);
    setArrived(false);
    setFollow(true);
    const osrm = await fetchOsrmRoute(from, dest);
    // Abandoned/cancelled while routing — don't clobber the newer state.
    if (dispatchIdRef.current !== reportId) return;
    if (osrm && osrm.path.length > 1) {
      const totalM = Math.max(osrm.distanceM, 1);
      setDispatchPath(osrm.path);
      setRouteMeta({ viaRoad: true, totalM, durationS: osrm.durationS });
      setDispatchT(t => Math.min(t, totalM));
    } else {
      const straightM = Math.max(routeLengthKm(interpolateRoute(from, dest)) * 1000, 1);
      setRouteMeta({ viaRoad: false, totalM: straightM, durationS: 0 });
    }
    setRouting(false);
  };

  const cancelDispatch = () => {
    dispatchIdRef.current = null;
    setDispatchPath([]);
    setDispatchT(0);
    setDispatchReportId(null);
    setRouteMeta(null);
    setRouting(false);
    setArrived(false);
  };

  // Changing selection mid-dispatch retires the old run.
  useEffect(() => {
    if (dispatchReportId && dispatchReportId !== selectedId) cancelDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const loadReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    setReports(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
    const ch = supabase
      .channel("dispatch-reports")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, loadReports)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const claimReport = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase
      .from("reports")
      .update({ responder_id: responderId, status: "in-progress" })
      .eq("id", id);
    loadReports();
  };

  const resolveReport = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase
      .from("reports")
      .update({ status: "resolved" })
      .eq("id", id);
    loadReports();
  };

  const filtered = reports.filter((r) => {
    const statusOk = filterStatus === "all" || r.status === filterStatus;
    const typeOk = filterType === "all" || r.type === filterType;
    return statusOk && typeOk;
  });

  const countByStatus = (s: string) =>
    s === "all" ? reports.length : reports.filter((r) => r.status === s).length;
  const countByType = (t: string) =>
    t === "all" ? reports.length : reports.filter((r) => r.type === t).length;

  const selectedReport = selectedId
    ? reports.find((r) => String(r.id) === selectedId) ?? null
    : null;

  const statusFilters = ["all", "pending", "in-progress", "resolved"];
  const typeFilters = ["all", "fire", "accident", "flood", "crime", "medical", "other"];

  return (
    <>
      <style>{DISPATCH_STYLES}</style>
      <div className="dp">
        {/* Header */}
        <div className="dp-header">
          <div>
            <div className="dp-eyebrow">Field Operations</div>
            <div className="dp-title">Dispatch Center</div>
          </div>
          <div className="dp-header-right">
            {loading && <div className="dp-spinner" />}
            <div className="dp-live-badge">
              <span className="dp-live-dot" />
              LIVE COMMAND FEED
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="dp-filters">
          <span className="dp-filter-label">
            <Icon.Filter />
            Status
          </span>
          <div className="dp-filter-group">
            {statusFilters.map((s) => (
              <button
                key={s}
                className={cls("dp-chip", filterStatus === s && "active")}
                onClick={() => setFilterStatus(s)}
              >
                {s === "all" ? "All" : STATUS_META[s]?.label ?? s}
                <span className="dp-chip-count">{countByStatus(s)}</span>
              </button>
            ))}
          </div>
          <div className="dp-filter-sep" />
          <span className="dp-filter-label">Type</span>
          <div className="dp-filter-group">
            {typeFilters.map((t) => (
              <button
                key={t}
                className={cls("dp-chip", filterType === t && "active")}
                onClick={() => setFilterType(t)}
              >
                {t === "all" ? "All" : `${TYPE_META[t]?.icon} ${TYPE_META[t]?.label}`}
                <span className="dp-chip-count">{countByType(t)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main body */}
        <div className="dp-body">
          {/* Map panel — live Leaflet tracking (replaces the static embed) */}
          <div className="dp-panel">
            <div className="dp-panel-header">
              <span className="dp-panel-title">
                <Icon.Radar />
                Live Incident Map
              </span>
              <span className="dp-count-pill">{filtered.length} Active</span>
            </div>

            <DispatchMapView
              reports={filtered}
              selectedReport={selectedReport}
              markerPos={markerPos}
              unitHeading={unitHeading}
              dispatchPath={dispatchPath}
              dispatchReportId={dispatchReportId}
              arrived={arrived}
              remainingKm={remainingKm}
              etaMin={etaMin}
              routeViaRoad={routeMeta?.viaRoad ?? null}
              routing={routing}
              follow={follow}
              recenterTick={recenterTick}
              gpsOn={gpsOn}
              dutyActive={dutyActive}
              gpsError={gpsError}
              unitSpeed={unitSpeed}
              onSelect={(id) => setSelectedId(id)}
              onDispatch={startDispatch}
              onCancelDispatch={cancelDispatch}
              onArrived={() => setArrived(true)}
              onRecenter={() => { setFollow(true); setRecenterTick(t => t + 1); }}
              onToggleFollow={() => setFollow(f => !f)}
              onToggleGps={() => setGpsOn(g => !g)}
            />
          </div>

          {/* Queue panel */}
          <div className="dp-panel">
            <div className="dp-panel-header">
              <span className="dp-panel-title">
                <Icon.Layers />
                Incident Queue
              </span>
              <span className="dp-count-pill">{filtered.length}</span>
            </div>

            <div className="dp-queue" ref={listRef}>
              {loading ? (
                <div className="dp-empty">
                  <div className="dp-spinner" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="dp-empty">
                  <span className="dp-empty-icon">📭</span>
                  No Incidents
                </div>
              ) : (
                filtered.map((r) => {
                  const tm = TYPE_META[r.type] ?? TYPE_META.other;
                  const sm = STATUS_META[r.status] ?? STATUS_META.pending;
                  const isMine = r.responder_id === responderId;
                  const isSel = String(r.id) === selectedId;
                  const unclaimed = !r.responder_id && r.status === "pending";

                  return (
                    <div
                      key={String(r.id)}
                      className={cls("dp-card", tm.colorClass, isSel && "selected")}
                      onClick={() => setSelectedId(isSel ? null : String(r.id))}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setSelectedId(isSel ? null : String(r.id))
                      }
                      aria-pressed={isSel}
                    >
                      {/* Type + Status row */}
                      <div className="dp-card-top">
                        <div className="dp-card-type">
                          <span className="dp-card-icon">{tm.icon}</span>
                          <span className="dp-card-type-label">{tm.label}</span>
                        </div>
                        <div className={cls("dp-status", sm.colorClass)}>
                          <span className="dp-status-dot" />
                          {sm.label}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="dp-card-addr">
                        <Icon.MapPin />
                        {r.address || r.location || "No location"}
                      </div>

                      {/* Description */}
                      {r.description && (
                        <TranslatedDescription
                          description={r.description}
                          descriptionLang={r.description_lang}
                          descriptionTranslated={r.description_translated}
                          className="dp-card-desc"
                        />
                      )}

                      {/* Meta chips */}
                      <div className="dp-meta">
                        <span className="dp-tag">
                          <Icon.Clock />
                          {formatRelative(r.created_at)}
                        </span>
                        {r.reporter_name && (
                          <span className="dp-tag">
                            <Icon.User />
                            {r.reporter_name}
                          </span>
                        )}
                        {r.reporter_contact && (
                          <a
                            href={`tel:${r.reporter_contact}`}
                            className="dp-tag dp-tag-tel"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icon.Phone />
                            {r.reporter_contact}
                          </a>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="dp-actions">
                        {unclaimed && (
                          <button
                            className="dp-btn dp-btn-claim"
                            onClick={(e) => claimReport(r.id, e)}
                          >
                            <Icon.Bolt />
                            Claim
                          </button>
                        )}
                        {(() => {
                          const dest = parseCoords(r.location);
                          const activeHere = dispatchReportId === String(r.id) && dispatchPath.length > 1;
                          if (!dest || r.status === "resolved") return null;
                          return activeHere ? (
                            <button
                              className="dp-btn dp-btn-nav"
                              onClick={(e) => { e.stopPropagation(); cancelDispatch(); }}
                            >
                              <Icon.Route />
                              Cancel Dispatch
                            </button>
                          ) : (
                            <button
                              className="dp-btn dp-btn-claim"
                              onClick={(e) => { e.stopPropagation(); setSelectedId(String(r.id)); startDispatch(String(r.id), dest); }}
                            >
                              <Icon.Route />
                              Dispatch
                            </button>
                          );
                        })()}
                        {isMine && r.status === "in-progress" && (
                          <button
                            className="dp-btn dp-btn-resolve"
                            onClick={(e) => resolveReport(r.id, e)}
                          >
                            <Icon.Check />
                            Resolve
                          </button>
                        )}
                        {hasCoords(r.location) && (
                          <a
                            href={`https://www.google.com/maps?q=${r.location}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dp-btn dp-btn-nav"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icon.Route />
                            Navigate
                          </a>
                        )}
                        {r.evidence_url && (
                          <a
                            href={r.evidence_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dp-btn dp-btn-nav"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icon.File />
                            Evidence
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}