import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  // ✅ Resolution fields now included
  responder_notes: string | null;
  action_notes: string | null;
  resolution_type: string | null;
  resolved_at: string | null;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; label: string; colorClass: string }> = {
  fire:     { icon: "🔥", label: "Fire",     colorClass: "t-fire" },
  accident: { icon: "🚗", label: "Accident", colorClass: "t-accident" },
  flood:    { icon: "🌊", label: "Flood",    colorClass: "t-flood" },
  crime:    { icon: "🚨", label: "Crime",    colorClass: "t-crime" },
  medical:  { icon: "🏥", label: "Medical",  colorClass: "t-medical" },
  other:    { icon: "⚠️", label: "Other",    colorClass: "t-other" },
};

const STATUS_META: Record<string, { label: string; colorClass: string }> = {
  pending:       { label: "PENDING",     colorClass: "s-pending" },
  "in-progress": { label: "IN PROGRESS", colorClass: "s-progress" },
  resolved:      { label: "RESOLVED",    colorClass: "s-resolved" },
};

const AGENCY_CONTACTS: Record<string, { label: string; number: string; icon: string; colorClass: string; note: string }[]> = {
  fire: [
    { label: "BFP Dumaguete",       number: "422-2022", icon: "🔥", colorClass: "ag-red",   note: "Bureau of Fire Protection" },
    { label: "CDRRMO",              number: "422-3008", icon: "🌀", colorClass: "ag-amber", note: "City Disaster Risk Reduction" },
    { label: "PNP Dumaguete",       number: "422-8708", icon: "👮", colorClass: "ag-blue",  note: "Philippine National Police" },
  ],
  flood: [
    { label: "CDRRMO",              number: "422-3008", icon: "🌊", colorClass: "ag-blue",  note: "City Disaster Risk Reduction" },
    { label: "PDRRMO",              number: "422-3006", icon: "🌀", colorClass: "ag-amber", note: "Provincial DRRMO" },
    { label: "PNP Dumaguete",       number: "422-8708", icon: "👮", colorClass: "ag-pink",  note: "Philippine National Police" },
    { label: "LDRRMO",              number: "422-3007", icon: "🏛️", colorClass: "ag-slate", note: "Local DRRMO Office" },
  ],
  medical: [
    { label: "Holy Child Hospital", number: "422-5555", icon: "🏥", colorClass: "ag-green", note: "Primary Hospital" },
    { label: "SUMC Emergency",      number: "422-2691", icon: "🏨", colorClass: "ag-blue",  note: "Silliman University Medical" },
    { label: "PDRRMO",              number: "422-3006", icon: "🚑", colorClass: "ag-amber", note: "Provincial DRRMO Ambulance" },
    { label: "PNP Dumaguete",       number: "422-8708", icon: "👮", colorClass: "ag-pink",  note: "Security escort" },
  ],
  accident: [
    { label: "PNP Dumaguete",       number: "422-8708", icon: "👮", colorClass: "ag-blue",  note: "Philippine National Police" },
    { label: "Holy Child Hospital", number: "422-5555", icon: "🏥", colorClass: "ag-green", note: "Emergency Room" },
    { label: "CDRRMO",              number: "422-3008", icon: "🌀", colorClass: "ag-amber", note: "City Disaster Risk Reduction" },
    { label: "BFP Dumaguete",       number: "422-2022", icon: "🔥", colorClass: "ag-red",   note: "Rescue / Extrication" },
  ],
  crime: [
    { label: "PNP Dumaguete",       number: "422-8708", icon: "👮", colorClass: "ag-blue",  note: "Philippine National Police" },
    { label: "NBI Dumaguete",       number: "422-4126", icon: "🕵️", colorClass: "ag-pink",  note: "National Bureau of Investigation" },
    { label: "CDRRMO",              number: "422-3008", icon: "🌀", colorClass: "ag-amber", note: "Crowd control support" },
  ],
  other: [
    { label: "CDRRMO",              number: "422-3008", icon: "🌀", colorClass: "ag-amber", note: "City Disaster Risk Reduction" },
    { label: "PNP Dumaguete",       number: "422-8708", icon: "👮", colorClass: "ag-blue",  note: "Philippine National Police" },
    { label: "BFP Dumaguete",       number: "422-2022", icon: "🔥", colorClass: "ag-red",   note: "Bureau of Fire Protection" },
    { label: "PDRRMO",              number: "422-3006", icon: "🏥", colorClass: "ag-green", note: "Provincial DRRMO" },
  ],
};

const RESOLUTION_TYPES = [
  { id: "forwarded",      label: "Forwarded to Department",    sub: "Handed off to appropriate agency",  icon: "↗", colorClass: "rt-blue" },
  { id: "follow-up",      label: "Resolved — Needs Follow-Up", sub: "Addressed but monitoring required", icon: "⟳", colorClass: "rt-amber" },
  { id: "fully-resolved", label: "Fully Resolved",             sub: "No additional action needed",       icon: "✓", colorClass: "rt-green" },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SvgIcon = ({ path, size = 16 }: { path: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: path }} />
);

const ICONS = {
  mapPin:       "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  user:         "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  phone:        "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  clock:        "M12 2a10 10 0 1 0 10 10M12 6v6l4 2",
  search:       "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  check:        "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4l-10 10.01-3-3.01",
  note:         "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
  x:            "M18 6L6 18M6 6l12 12",
  image:        "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",
  video:        "M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  externalLink: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",
  route:        "M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 19h6M9 5h6",
  clipboard:    "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const INCIDENTS_STYLES = `
:root {
  --primary:        #0052CC;
  --primary-light:  #4D94FF;
  --success:        #0B6623;
  --success-light:  #2FA232;
  --warning:        #974F0C;
  --warning-light:  #D97706;
  --danger:         #AE2A19;
  --danger-light:   #DC2626;
  --info:           #0369A1;
  --bg-primary:     #FAFBFC;
  --bg-secondary:   #F3F4F6;
  --surface:        #FFFFFF;
  --text-primary:   #111827;
  --text-secondary: #4B5563;
  --text-tertiary:  #9CA3AF;
  --border-light:   #E5E7EB;
  --border-med:     #D1D5DB;
  --error:          #DC2626;
  --success-bg:     #ECFDF5;
  --warning-bg:     #FEF3C7;
  --error-bg:       #FEE2E2;
  --info-bg:        #EFF6FF;
}

@keyframes fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
@keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }
@keyframes spin    { to { transform: rotate(360deg); } }

* { box-sizing: border-box; margin: 0; padding: 0; }

.ri { color: var(--text-primary); background: var(--bg-primary); font-size: 14px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif; }

/* ── Header ── */
.ri-hd { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 24px; }
.ri-eyebrow { font-size: 11px; color: var(--primary); letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.ri-eyebrow::before { content: ''; display: block; width: 18px; height: 2px; background: var(--primary); }
.ri-title { font-size: 36px; color: var(--text-primary); letter-spacing: -0.4px; line-height: 1.1; font-weight: 800; }

/* ── Tabs ── */
.ri-tabs { display: flex; gap: 4px; margin-bottom: 20px; background: var(--surface); border: 1px solid var(--border-light); border-radius: 10px; padding: 6px; width: fit-content; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.ri-tab { font-size: 11px; font-weight: 600; padding: 8px 16px; border-radius: 8px; border: 1px solid transparent; color: var(--text-secondary); background: transparent; cursor: pointer; letter-spacing: 0.3px; transition: all 0.2s; text-transform: uppercase; }
.ri-tab:hover:not(.active) { color: var(--text-primary); background: var(--bg-secondary); }
.ri-tab.active { background: linear-gradient(135deg, var(--primary) 0%, #0052CC 100%); color: white; border-color: transparent; font-weight: 700; box-shadow: 0 2px 6px rgba(0,82,204,0.15); }

/* ── Controls ── */
.ri-controls { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.ri-srch-wrap { position: relative; flex: 1; min-width: 220px; }
.ri-srch-ic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); pointer-events: none; }
.ri-srch { width: 100%; background: var(--surface); border: 1px solid var(--border-light); border-radius: 10px; padding: 10px 12px 10px 38px; font-size: 13px; color: var(--text-primary); outline: none; transition: all 0.2s; }
.ri-srch::placeholder { color: var(--text-tertiary); }
.ri-srch:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0,82,204,0.08); }
.ri-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.ri-chip { font-size: 11px; padding: 7px 13px; border-radius: 8px; border: 1px solid var(--border-light); background: var(--bg-secondary); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; font-weight: 500; text-transform: uppercase; }
.ri-chip:hover:not(.active) { border-color: var(--border-med); color: var(--text-primary); background: var(--surface); }
.ri-chip.active { background: linear-gradient(135deg, var(--primary) 0%, #0052CC 100%); border-color: transparent; color: white; font-weight: 700; box-shadow: 0 2px 6px rgba(0,82,204,0.15); }

/* ── Grid ── */
.ri-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }

/* ── Card ── */
.ri-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: 12px; overflow: hidden; transition: all 0.3s; animation: fadeIn 0.4s ease-out both; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.ri-card:nth-child(2) { animation-delay: 0.05s; }
.ri-card:nth-child(3) { animation-delay: 0.10s; }
.ri-card:hover { transform: translateY(-3px); border-color: var(--primary); box-shadow: 0 6px 16px rgba(0,82,204,0.12); }
.ri-card-bar { height: 2px; }
.ri-card.t-fire     .ri-card-bar { background: var(--danger-light); }
.ri-card.t-accident .ri-card-bar { background: var(--warning-light); }
.ri-card.t-flood    .ri-card-bar { background: var(--primary); }
.ri-card.t-crime    .ri-card-bar { background: var(--danger-light); }
.ri-card.t-medical  .ri-card-bar { background: var(--success-light); }
.ri-card.t-other    .ri-card-bar { background: var(--text-tertiary); }

.ri-card-body { padding: 18px; }
.ri-card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.ri-card-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; flex-wrap: wrap; }
.ri-card.t-fire     .ri-card-label { color: var(--danger-light); }
.ri-card.t-accident .ri-card-label { color: var(--warning-light); }
.ri-card.t-flood    .ri-card-label { color: var(--primary); }
.ri-card.t-crime    .ri-card-label { color: var(--danger-light); }
.ri-card.t-medical  .ri-card-label { color: var(--success-light); }
.ri-card.t-other    .ri-card-label { color: var(--text-tertiary); }
.ri-mine-tag { font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 5px; background: var(--error-bg); color: var(--danger-light); border: 1px solid var(--danger-light); }

/* Status badge */
.ri-badge { font-size: 9px; font-weight: 700; padding: 4px 10px; border-radius: 6px; white-space: nowrap; border: 1px solid; flex-shrink: 0; }
.ri-badge.s-pending  { background: var(--error-bg);   color: var(--danger-light);  border-color: var(--danger-light); }
.ri-badge.s-progress { background: var(--warning-bg); color: var(--warning-light); border-color: var(--warning-light); }
.ri-badge.s-resolved { background: var(--success-bg); color: var(--success-light); border-color: var(--success-light); }

/* ✅ FIXED: Fields — single column to prevent overflow */
.ri-fields { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.ri-fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.ri-field { padding: 10px 12px; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: 10px; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.ri-field-lbl { font-size: 9px; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
.ri-field-val { font-size: 12px; font-weight: 500; color: var(--text-primary); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ri-field-tel { color: var(--success-light); text-decoration: none; font-weight: 700; }
.ri-field-tel:hover { text-decoration: underline; }

.ri-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.6; padding: 11px 13px; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: 10px; margin-bottom: 12px; }

/* ✅ Resolution summary box — shown on resolved cards */
.ri-resolution-box {
  margin-bottom: 14px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--success-light);
  background: var(--success-bg);
}
.ri-resolution-hd {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  background: rgba(11,102,35,0.08);
  border-bottom: 1px solid rgba(11,102,35,0.15);
}
.ri-resolution-hd-label {
  font-size: 9px;
  font-weight: 800;
  color: var(--success);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  flex: 1;
}
.ri-resolution-type-tag {
  font-size: 8px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 5px;
  background: var(--success);
  color: white;
  text-transform: uppercase;
}
.ri-resolution-body {
  padding: 12px 13px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ri-resolution-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ri-resolution-section-lbl {
  font-size: 9px;
  font-weight: 700;
  color: var(--success);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.ri-resolution-section-val {
  font-size: 12px;
  color: var(--text-primary);
  line-height: 1.5;
  font-weight: 400;
}
.ri-resolution-divider { height: 1px; background: rgba(11,102,35,0.12); }
.ri-resolution-footer {
  font-size: 10px;
  color: var(--success);
  font-weight: 600;
  padding: 6px 13px 10px;
}

/* Evidence */
.ri-ev-wrap { border-radius: 10px; overflow: hidden; background: var(--bg-secondary); border: 1px solid var(--border-light); margin-bottom: 14px; }
.ri-ev-img { width: 100%; max-height: 200px; object-fit: cover; display: block; cursor: zoom-in; transition: opacity 0.2s; }
.ri-ev-img:hover { opacity: 0.9; }
.ri-ev-video { width: 100%; max-height: 200px; display: block; background: #000; }
.ri-ev-bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-top: 1px solid var(--border-light); background: var(--bg-secondary); }
.ri-ev-type { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--text-secondary); font-weight: 600; }
.ri-ev-link { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; color: var(--text-secondary); text-decoration: none; transition: color 0.15s; }
.ri-ev-link:hover { color: var(--primary); }

/* Actions */
.ri-actions { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 14px; border-top: 1px solid var(--border-light); }
.ri-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; padding: 7px 14px; border-radius: 8px; cursor: pointer; border: 1px solid; transition: all 0.2s; text-decoration: none; letter-spacing: 0.3px; text-transform: uppercase; white-space: nowrap; }
.ri-btn:hover:not(:disabled) { transform: translateY(-1px); }
.ri-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.ri-btn-claim   { background: var(--error-bg);   border-color: var(--danger-light);  color: var(--danger-light); }
.ri-btn-claim:hover:not(:disabled) { background: rgba(220,38,38,0.15); }
.ri-btn-resolve { background: var(--success-bg); border-color: var(--success-light); color: var(--success-light); }
.ri-btn-resolve:hover:not(:disabled) { background: rgba(11,102,35,0.15); }
.ri-btn-nav     { background: var(--info-bg);    border-color: var(--primary);       color: var(--primary); }
.ri-btn-nav:hover:not(:disabled) { background: rgba(0,82,204,0.15); }

/* ── Lightbox ── */
.ri-lb { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; padding: 24px; cursor: zoom-out; animation: fadeIn 0.2s ease; }
.ri-lb img { max-width: 100%; max-height: 90vh; border-radius: 12px; cursor: default; object-fit: contain; }
.ri-lb-close { position: fixed; top: 20px; right: 24px; font-size: 14px; color: rgba(255,255,255,0.6); cursor: pointer; background: rgba(255,255,255,0.1); border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.ri-lb-close:hover { background: rgba(255,255,255,0.2); color: white; }

/* ── Modal ── */
.ri-modal-bg { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
.ri-modal { background: var(--surface); border: 1px solid var(--border-light); border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; animation: modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both; box-shadow: 0 20px 25px rgba(0,0,0,0.15); scrollbar-width: thin; scrollbar-color: var(--border-light) transparent; }
.ri-modal-hd { padding: 20px 24px; border-bottom: 1px solid var(--border-light); display: flex; align-items: flex-start; gap: 14px; position: relative; background: var(--bg-secondary); }
.ri-modal-icon { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; background: linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%); display: flex; align-items: center; justify-content: center; color: white; }
.ri-modal-title-wrap { flex: 1; }
.ri-modal-title { font-size: 16px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.3px; margin-bottom: 3px; }
.ri-modal-sub { font-size: 10px; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; font-weight: 600; }
.ri-modal-close { background: transparent; border: 1px solid var(--border-light); border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.ri-modal-close:hover { background: var(--bg-secondary); color: var(--text-primary); }
.ri-modal-body { padding: 20px 24px; }

/* Summary strip */
.ri-sum { background: var(--bg-secondary); border: 1px solid var(--border-light); border-left: 3px solid var(--primary); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
.ri-sum.t-fire     { border-left-color: var(--danger-light); }
.ri-sum.t-accident { border-left-color: var(--warning-light); }
.ri-sum.t-flood    { border-left-color: var(--primary); }
.ri-sum.t-crime    { border-left-color: var(--danger-light); }
.ri-sum.t-medical  { border-left-color: var(--success-light); }
.ri-sum.t-other    { border-left-color: var(--text-tertiary); }
.ri-sum-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.ri-sum-lbl { font-size: 9px; font-weight: 700; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; flex-shrink: 0; }
.ri-sum-val { font-size: 12px; font-weight: 600; color: var(--text-primary); text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; }
.ri-sum-type { font-weight: 800; font-size: 12px; text-transform: uppercase; }
.ri-sum.t-fire     .ri-sum-type { color: var(--danger-light); }
.ri-sum.t-accident .ri-sum-type { color: var(--warning-light); }
.ri-sum.t-flood    .ri-sum-type { color: var(--primary); }
.ri-sum.t-crime    .ri-sum-type { color: var(--danger-light); }
.ri-sum.t-medical  .ri-sum-type { color: var(--success-light); }
.ri-sum.t-other    .ri-sum-type { color: var(--text-tertiary); }

/* Section heads */
.ri-sec-hd { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; margin-top: 18px; }
.ri-step { font-size: 9px; font-weight: 700; color: white; background: linear-gradient(135deg, var(--primary) 0%, #0052CC 100%); border-radius: 5px; padding: 4px 8px; flex-shrink: 0; }
.ri-sec-lbl { font-size: 10px; font-weight: 700; color: var(--text-secondary); letter-spacing: 0.4px; text-transform: uppercase; flex: 1; }
.ri-field-err { font-size: 9px; color: var(--danger-light); flex-shrink: 0; font-weight: 700; }

/* Resolution type cards */
.ri-rt-grid { display: flex; flex-direction: column; gap: 8px; }
.ri-rt-card { display: flex; align-items: center; gap: 12px; padding: 13px 14px; border-radius: 10px; cursor: pointer; background: var(--bg-secondary); border: 1px solid var(--border-light); transition: all 0.2s; text-align: left; width: 100%; }
.ri-rt-card:hover { transform: translateX(2px); background: var(--surface); border-color: var(--border-med); }
.ri-rt-card.sel { border-color: var(--primary); background: rgba(0,82,204,0.04); }
.ri-rt-icon { width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
.ri-rt-card.rt-blue  .ri-rt-icon { background: rgba(0,82,204,0.08);  color: var(--primary); }
.ri-rt-card.rt-amber .ri-rt-icon { background: rgba(217,119,6,0.08); color: var(--warning-light); }
.ri-rt-card.rt-green .ri-rt-icon { background: rgba(11,102,35,0.08); color: var(--success-light); }
.ri-rt-text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.ri-rt-label { font-size: 12px; font-weight: 700; color: var(--text-primary); }
.ri-rt-sub { font-size: 10px; color: var(--text-secondary); }
.ri-rt-radio { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border-light); flex-shrink: 0; transition: all 0.2s; }
.ri-rt-card.sel .ri-rt-radio { border-color: var(--primary); background: var(--primary); }

/* Textarea */
.ri-textarea { width: 100%; min-height: 100px; resize: vertical; background: var(--surface); border: 1px solid var(--border-light); border-radius: 10px; padding: 12px 14px; font-size: 13px; color: var(--text-primary); outline: none; line-height: 1.6; transition: all 0.2s; font-family: inherit; }
.ri-textarea::placeholder { color: var(--text-tertiary); }
.ri-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0,82,204,0.08); }
.ri-textarea.err { border-color: var(--danger-light); }
.ri-char { display: flex; justify-content: flex-end; margin-top: 5px; font-size: 10px; color: var(--text-tertiary); }

/* Preview */
.ri-preview { margin-top: 18px; border-radius: 10px; overflow: hidden; border: 1px solid var(--border-light); background: var(--bg-secondary); animation: fadeIn 0.2s ease; }
.ri-preview-hd { padding: 10px 14px; background: var(--surface); border-bottom: 1px solid var(--border-light); }
.ri-preview-hd span { font-size: 9px; color: var(--text-secondary); letter-spacing: 0.4px; text-transform: uppercase; font-weight: 700; }
.ri-preview-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.ri-prev-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.ri-prev-row span:first-child { font-size: 9px; color: var(--text-secondary); text-transform: uppercase; flex-shrink: 0; font-weight: 700; }
.ri-prev-row span:last-child { font-size: 12px; color: var(--text-primary); text-align: right; max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
.ri-prev-div { height: 1px; background: var(--border-light); }
.ri-prev-block { display: flex; flex-direction: column; gap: 4px; }
.ri-prev-block-lbl { font-size: 9px; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; }
.ri-prev-block-val { font-size: 12px; color: var(--text-primary); line-height: 1.5; }

/* Agency */
.ri-ag-sec { margin-top: 24px; }
.ri-ag-hd { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.ri-ag-lbl { font-size: 10px; color: var(--text-secondary); letter-spacing: 0.4px; text-transform: uppercase; font-weight: 700; }
.ri-ag-line { flex: 1; height: 1px; background: var(--border-light); }
.ri-ag-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ri-ag-card { display: flex; align-items: center; gap: 9px; padding: 11px 12px; background: var(--bg-secondary); border: 1px solid var(--border-light); border-left: 3px solid var(--primary); border-radius: 10px; text-decoration: none; transition: all 0.2s; cursor: pointer; }
.ri-ag-card:hover { background: var(--surface); transform: translateY(-1px); }
.ri-ag-card.ag-red   { border-left-color: var(--danger-light); }
.ri-ag-card.ag-amber { border-left-color: var(--warning-light); }
.ri-ag-card.ag-blue  { border-left-color: var(--primary); }
.ri-ag-card.ag-green { border-left-color: var(--success-light); }
.ri-ag-card.ag-pink  { border-left-color: var(--danger-light); }
.ri-ag-card.ag-slate { border-left-color: var(--text-tertiary); }
.ri-ag-icon { width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.ri-ag-card.ag-red   .ri-ag-icon { background: rgba(220,38,38,0.08); }
.ri-ag-card.ag-amber .ri-ag-icon { background: rgba(217,119,6,0.08); }
.ri-ag-card.ag-blue  .ri-ag-icon { background: rgba(0,82,204,0.08); }
.ri-ag-card.ag-green .ri-ag-icon { background: rgba(11,102,35,0.08); }
.ri-ag-card.ag-pink  .ri-ag-icon { background: rgba(220,38,38,0.08); }
.ri-ag-card.ag-slate .ri-ag-icon { background: rgba(156,163,175,0.08); }
.ri-ag-info { flex: 1; min-width: 0; }
.ri-ag-name { font-size: 11px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ri-ag-note { font-size: 8px; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ri-ag-num { font-size: 11px; font-weight: 800; flex-shrink: 0; }
.ri-ag-card.ag-red   .ri-ag-num { color: var(--danger-light); }
.ri-ag-card.ag-amber .ri-ag-num { color: var(--warning-light); }
.ri-ag-card.ag-blue  .ri-ag-num { color: var(--primary); }
.ri-ag-card.ag-green .ri-ag-num { color: var(--success-light); }
.ri-ag-card.ag-pink  .ri-ag-num { color: var(--danger-light); }
.ri-ag-card.ag-slate .ri-ag-num { color: var(--text-tertiary); }

/* Modal footer */
.ri-modal-ft { padding: 14px 24px 20px; display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid var(--border-light); }
.ri-ft-cancel { font-size: 11px; font-weight: 700; padding: 10px 16px; border-radius: 8px; cursor: pointer; background: transparent; border: 1px solid var(--border-light); color: var(--text-secondary); transition: all 0.2s; letter-spacing: 0.3px; text-transform: uppercase; }
.ri-ft-cancel:hover { border-color: var(--border-med); color: var(--text-primary); background: var(--bg-secondary); }
.ri-ft-confirm { font-size: 11px; font-weight: 700; padding: 10px 16px; border-radius: 8px; cursor: pointer; border: 1px solid; transition: all 0.2s; letter-spacing: 0.3px; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
.ri-ft-confirm:hover:not(:disabled) { transform: translateY(-1px); }
.ri-ft-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
.ri-ft-confirm.rt-green { background: linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%); border-color: transparent; color: white; font-weight: 800; }
.ri-ft-confirm.rt-blue  { background: linear-gradient(135deg, var(--primary) 0%, #0052CC 100%);              border-color: transparent; color: white; font-weight: 800; }
.ri-ft-confirm.rt-amber { background: linear-gradient(135deg, var(--warning-light) 0%, #D97706 100%);        border-color: transparent; color: white; font-weight: 800; }

/* Spinner & empty */
.ri-spinner    { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border-light); border-top-color: var(--primary);       animation: spin 0.8s linear infinite; }
.ri-spinner-sm { display: inline-block; width: 13px; height: 13px; border-radius: 50%; border: 2px solid var(--success-light); border-top-color: var(--success); animation: spin 0.7s linear infinite; }
.ri-empty { text-align: center; padding: 56px 24px; font-size: 12px; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; }

@media (max-width: 640px) {
  .ri-ag-grid { grid-template-columns: 1fr; }
  .ri-fields-row { grid-template-columns: 1fr; }
  .ri-grid { grid-template-columns: 1fr; }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelative(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function isVideo(url: string) {
  return /\.(mp4|mov|avi|webm|mkv)/i.test(url);
}

function cls(...args: (string | false | undefined | null)[]): string {
  return args.filter(Boolean).join(" ");
}

// ─── Resolution Modal ─────────────────────────────────────────────────────────

interface ModalProps {
  report: Report;
  responderName: string;
  onCancel: () => void;
  onConfirm: (p: { resolutionType: string; notes: string; actionTaken: string }) => Promise<void>;
  submitting: boolean;
}

function ResolutionModal({ report, responderName, onCancel, onConfirm, submitting }: ModalProps) {
  const [resolutionType, setResolutionType] = useState("");
  const [notes,          setNotes]          = useState("");
  const [actionTaken,    setActionTaken]    = useState("");
  const [touched,        setTouched]        = useState(false);

  const tm         = TYPE_META[report.type] ?? TYPE_META.other;
  const selectedRT = RESOLUTION_TYPES.find((r) => r.id === resolutionType);
  const isValid       = resolutionType !== "" && notes.trim().length >= 10 && actionTaken.trim().length >= 5;
  const showTypeErr   = touched && resolutionType === "";
  const showNotesErr  = touched && notes.trim().length < 10;
  const showActionErr = touched && actionTaken.trim().length < 5;

  const dateTimeStr = new Date().toLocaleString("en-PH", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const agencies    = AGENCY_CONTACTS[report.type] ?? AGENCY_CONTACTS.other;
  const showPreview = notes.trim() || actionTaken.trim() || resolutionType;

  const handleConfirm = () => {
    setTouched(true);
    if (!isValid) return;
    onConfirm({ resolutionType, notes: notes.trim(), actionTaken: actionTaken.trim() });
  };

  return (
    <div className="ri-modal-bg" onClick={onCancel}>
      <div className="ri-modal" onClick={(e) => e.stopPropagation()}>

        <div className="ri-modal-hd">
          <div className="ri-modal-icon"><SvgIcon path={ICONS.note} size={20} /></div>
          <div className="ri-modal-title-wrap">
            <div className="ri-modal-title">Incident Report</div>
            <div className="ri-modal-sub">Complete to resolve</div>
          </div>
          <button className="ri-modal-close" onClick={onCancel}><SvgIcon path={ICONS.x} size={18} /></button>
        </div>

        <div className="ri-modal-body">
          <div className={cls("ri-sum", tm.colorClass)}>
            <div className="ri-sum-row"><span className="ri-sum-lbl">Type</span><span className={cls("ri-sum-val ri-sum-type")}>{tm.icon} {report.type.toUpperCase()}</span></div>
            <div className="ri-sum-row"><span className="ri-sum-lbl">Location</span><span className="ri-sum-val">{report.address || report.location || "Not specified"}</span></div>
            <div className="ri-sum-row"><span className="ri-sum-lbl">Date &amp; Time</span><span className="ri-sum-val">{dateTimeStr}</span></div>
            <div className="ri-sum-row"><span className="ri-sum-lbl">Responder</span><span className="ri-sum-val">{responderName}</span></div>
          </div>

          <div className="ri-sec-hd">
            <span className="ri-step">01</span>
            <span className="ri-sec-lbl">Resolution Status</span>
            {showTypeErr && <span className="ri-field-err">⚠ Select one</span>}
          </div>
          <div className="ri-rt-grid">
            {RESOLUTION_TYPES.map((rt) => (
              <button key={rt.id} type="button" className={cls("ri-rt-card", rt.colorClass, resolutionType === rt.id && "sel")} onClick={() => setResolutionType(rt.id)}>
                <span className="ri-rt-icon">{rt.icon}</span>
                <div className="ri-rt-text"><span className="ri-rt-label">{rt.label}</span><span className="ri-rt-sub">{rt.sub}</span></div>
                <span className="ri-rt-radio" />
              </button>
            ))}
          </div>

          <div className="ri-sec-hd">
            <span className="ri-step">02</span>
            <span className="ri-sec-lbl">Response Notes</span>
            {showNotesErr && <span className="ri-field-err">⚠ Min. 10 chars</span>}
          </div>
          <textarea className={cls("ri-textarea", showNotesErr && "err")} placeholder="Describe situation upon arrival, severity, conditions observed…" value={notes} onChange={(e) => { setNotes(e.target.value); setTouched(false); }} rows={3} />
          <div className="ri-char"><span>{notes.length} characters</span></div>

          <div className="ri-sec-hd">
            <span className="ri-step">03</span>
            <span className="ri-sec-lbl">Action Taken</span>
            {showActionErr && <span className="ri-field-err">⚠ Required</span>}
          </div>
          <textarea className={cls("ri-textarea", showActionErr && "err")} placeholder="e.g. Deployed BFP units, fire extinguished at 14:32 — area secured…" value={actionTaken} onChange={(e) => { setActionTaken(e.target.value); setTouched(false); }} rows={3} />
          <div className="ri-char"><span>{actionTaken.length} characters</span></div>

          {showPreview && (
            <div className="ri-preview">
              <div className="ri-preview-hd"><span>Report Preview</span></div>
              <div className="ri-preview-body">
                <div className="ri-prev-row"><span>Type</span><span>{tm.icon} {report.type.toUpperCase()}</span></div>
                <div className="ri-prev-row"><span>Location</span><span>{report.address || report.location || "—"}</span></div>
                <div className="ri-prev-row"><span>Date &amp; Time</span><span>{dateTimeStr}</span></div>
                <div className="ri-prev-div" />
                {notes.trim() && <div className="ri-prev-block"><span className="ri-prev-block-lbl">Response Notes</span><span className="ri-prev-block-val">{notes.trim()}</span></div>}
                {actionTaken.trim() && <div className="ri-prev-block"><span className="ri-prev-block-lbl">Action Taken</span><span className="ri-prev-block-val">{actionTaken.trim()}</span></div>}
                <div className="ri-prev-div" />
                <div className="ri-prev-row"><span>Status</span><span>{selectedRT ? `${selectedRT.icon} ${selectedRT.label}` : "—"}</span></div>
                <div className="ri-prev-row"><span>Responder</span><span>{responderName}</span></div>
              </div>
            </div>
          )}

          <div className="ri-ag-sec">
            <div className="ri-ag-hd"><span className="ri-ag-lbl">Recommended Agencies</span><span className="ri-ag-line" /></div>
            <div className="ri-ag-grid">
              {agencies.map((ag) => (
                <a key={ag.label} href={`tel:${ag.number}`} className={cls("ri-ag-card", ag.colorClass)}>
                  <div className="ri-ag-icon">{ag.icon}</div>
                  <div className="ri-ag-info"><div className="ri-ag-name">{ag.label}</div>{ag.note && <div className="ri-ag-note">{ag.note}</div>}</div>
                  <div className="ri-ag-num">{ag.number}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="ri-modal-ft">
          <button className="ri-ft-cancel" onClick={onCancel} disabled={submitting}>CANCEL</button>
          <button className={cls("ri-ft-confirm", selectedRT ? selectedRT.colorClass : "rt-green")} onClick={handleConfirm} disabled={submitting}>
            {submitting ? <><span className="ri-spinner-sm" /> SUBMITTING…</> : <><SvgIcon path={ICONS.check} size={14} /> SUBMIT &amp; RESOLVE</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Resolution Summary Box ───────────────────────────────────────────────────

function ResolutionSummary({ report }: { report: Report }) {
  if (report.status !== "resolved") return null;
  if (!report.responder_notes && !report.action_notes) return null;

  const rt = RESOLUTION_TYPES.find((r) => r.id === report.resolution_type);

  return (
    <div className="ri-resolution-box">
      <div className="ri-resolution-hd">
        <SvgIcon path={ICONS.clipboard} size={12} />
        <span className="ri-resolution-hd-label">✓ Resolution Summary</span>
        {rt && <span className="ri-resolution-type-tag">{rt.icon} {rt.label}</span>}
      </div>
      <div className="ri-resolution-body">
        {report.responder_notes && (
          <div className="ri-resolution-section">
            <span className="ri-resolution-section-lbl">Response Notes</span>
            <span className="ri-resolution-section-val">{report.responder_notes}</span>
          </div>
        )}
        {report.responder_notes && report.action_notes && (
          <div className="ri-resolution-divider" />
        )}
        {report.action_notes && (
          <div className="ri-resolution-section">
            <span className="ri-resolution-section-lbl">Action Taken</span>
            <span className="ri-resolution-section-val">{report.action_notes}</span>
          </div>
        )}
      </div>
      {report.resolved_at && (
        <div className="ri-resolution-footer">
          Resolved {formatDateTime(report.resolved_at)}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type TabId = "all" | "mine" | "unassigned";

export default function ResponderIncidentsPage() {
  const [reports,       setReports]       = useState<Report[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [responderId,   setResponderId]   = useState("");
  const [responderName, setResponderName] = useState("Responder");
  const [tab,           setTab]           = useState<TabId>("all");
  const [filterType,    setFilterType]    = useState("all");
  const [search,        setSearch]        = useState("");
  const [claiming,      setClaiming]      = useState<string | null>(null);
  const [lightbox,      setLightbox]      = useState<string | null>(null);
  const [resolveTarget, setResolveTarget] = useState<Report | null>(null);
  const [resolving,     setResolving]     = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setResponderId(user.id);
      const { data: profile } = await supabase
        .from("profiles").select("full_name").eq("id", user.id).single();
      if (profile?.full_name) setResponderName(profile.full_name);
    });
  }, []);

  const loadReports = async () => {
    // ✅ Now fetches resolution fields too
    const { data } = await supabase
      .from("reports")
      .select("id,type,description,location,address,reporter_name,reporter_contact,status,evidence_url,created_at,responder_id,responder_notes,action_notes,resolution_type,resolved_at")
      .order("created_at", { ascending: false });
    setReports(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
    const ch = supabase
      .channel("rinc-reports")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, loadReports)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const claimReport = async (id: string | number) => {
    if (!responderId) return;
    setClaiming(String(id));
    await supabase
      .from("reports")
      .update({ responder_id: responderId, status: "in-progress" })
      .eq("id", id);
    await loadReports();
    setClaiming(null);
  };

  // ✅ Now saves directly to reports table using the correct columns
  const confirmResolve = async (payload: { resolutionType: string; notes: string; actionTaken: string }) => {
    if (!resolveTarget || !responderId) return;
    setResolving(true);
    try {
      await supabase
        .from("reports")
        .update({
          status:          "resolved",
          responder_notes: payload.notes,
          action_notes:    payload.actionTaken,
          resolution_type: payload.resolutionType,
          resolved_by:     responderId,
          resolved_at:     new Date().toISOString(),
        })
        .eq("id", resolveTarget.id)
        .eq("responder_id", responderId);
      await loadReports();
    } finally {
      setResolving(false);
      setResolveTarget(null);
    }
  };

  // Filtering
  let filtered = reports;
  if (tab === "mine")       filtered = filtered.filter((r) => r.responder_id === responderId);
  if (tab === "unassigned") filtered = filtered.filter((r) => !r.responder_id && r.status === "pending");
  if (filterType !== "all") filtered = filtered.filter((r) => r.type === filterType);
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((r) =>
      r.type.includes(q) ||
      (r.address ?? "").toLowerCase().includes(q) ||
      (r.reporter_name ?? "").toLowerCase().includes(q) ||
      (r.description ?? "").toLowerCase().includes(q)
    );
  }

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "all",        label: "ALL INCIDENTS",  count: reports.length },
    { id: "mine",       label: "MY CASES",       count: reports.filter((r) => r.responder_id === responderId).length },
    { id: "unassigned", label: "UNASSIGNED",     count: reports.filter((r) => !r.responder_id && r.status === "pending").length },
  ];
  const typeFilters = ["all", "fire", "accident", "flood", "crime", "medical", "other"];

  return (
    <>
      <style>{INCIDENTS_STYLES}</style>
      <div className="ri">

        {lightbox && (
          <div className="ri-lb" onClick={() => setLightbox(null)}>
            <button className="ri-lb-close" onClick={() => setLightbox(null)}><SvgIcon path={ICONS.x} size={20} /></button>
            <img src={lightbox} alt="Evidence" onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {resolveTarget && (
          <ResolutionModal
            report={resolveTarget}
            responderName={responderName}
            onCancel={() => !resolving && setResolveTarget(null)}
            onConfirm={confirmResolve}
            submitting={resolving}
          />
        )}

        <div className="ri-hd">
          <div>
            <div className="ri-eyebrow">Field Operations</div>
            <div className="ri-title">Incidents</div>
          </div>
          {loading && <div className="ri-spinner" />}
        </div>

        <div className="ri-tabs">
          {tabs.map((t) => (
            <button key={t.id} className={cls("ri-tab", tab === t.id && "active")} onClick={() => setTab(t.id)}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="ri-controls">
          <div className="ri-srch-wrap">
            <span className="ri-srch-ic"><SvgIcon path={ICONS.search} size={16} /></span>
            <input className="ri-srch" placeholder="Search incidents…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="ri-chips">
            {typeFilters.map((t) => (
              <button key={t} className={cls("ri-chip", filterType === t && "active")} onClick={() => setFilterType(t)}>
                {t === "all" ? "All Types" : `${TYPE_META[t]?.icon ?? ""} ${t}`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="ri-empty"><div className="ri-spinner" style={{ margin: "0 auto" }} /></div>
        ) : filtered.length === 0 ? (
          <div className="ri-empty">No incidents found</div>
        ) : (
          <div className="ri-grid">
            {filtered.map((r) => {
              const tm        = TYPE_META[r.type]     ?? TYPE_META.other;
              const sm        = STATUS_META[r.status] ?? STATUS_META.pending;
              const isMine    = r.responder_id === responderId;
              const canClaim  = !r.responder_id && r.status === "pending" && responderId.length > 0;
              const canResolve = isMine && r.status === "in-progress";
              const vid       = r.evidence_url && isVideo(r.evidence_url);

              return (
                <div key={String(r.id)} className={cls("ri-card", tm.colorClass)}>
                  <div className="ri-card-bar" />
                  <div className="ri-card-body">

                    <div className="ri-card-top">
                      <div className="ri-card-label">
                        <span>{tm.icon}</span>
                        <span>{r.type}</span>
                        {isMine && <span className="ri-mine-tag">MINE</span>}
                      </div>
                      <span className={cls("ri-badge", sm.colorClass)}>{sm.label}</span>
                    </div>

                    {/* ✅ FIXED: Stacked layout — Location full width, then 2-col row */}
                    <div className="ri-fields">
                      <div className="ri-field">
                        <span className="ri-field-lbl"><SvgIcon path={ICONS.mapPin} size={10} /> Location</span>
                        <span className="ri-field-val" title={r.address || r.location || "—"}>{r.address || r.location || "—"}</span>
                      </div>
                      <div className="ri-fields-row">
                        <div className="ri-field">
                          <span className="ri-field-lbl"><SvgIcon path={ICONS.user} size={10} /> Reporter</span>
                          <span className="ri-field-val">{r.reporter_name || "Anonymous"}</span>
                        </div>
                        <div className="ri-field">
                          <span className="ri-field-lbl"><SvgIcon path={ICONS.clock} size={10} /> Reported</span>
                          <span className="ri-field-val">{formatRelative(r.created_at)}</span>
                        </div>
                      </div>
                      {r.reporter_contact && (
                        <div className="ri-field">
                          <span className="ri-field-lbl"><SvgIcon path={ICONS.phone} size={10} /> Contact</span>
                          <a href={`tel:${r.reporter_contact}`} className="ri-field-val ri-field-tel">{r.reporter_contact}</a>
                        </div>
                      )}
                    </div>

                    {r.description && <div className="ri-desc">{r.description}</div>}

                    {/* ✅ Resolution summary shown on resolved cards */}
                    <ResolutionSummary report={r} />

                    {r.evidence_url && (
                      <div className="ri-ev-wrap">
                        {vid ? (
                          <video className="ri-ev-video" src={r.evidence_url} controls preload="metadata" />
                        ) : (
                          <img className="ri-ev-img" src={r.evidence_url} alt="Incident evidence" onClick={() => setLightbox(r.evidence_url!)} />
                        )}
                        <div className="ri-ev-bar">
                          <span className="ri-ev-type">
                            {vid ? <SvgIcon path={ICONS.video} size={12} /> : <SvgIcon path={ICONS.image} size={12} />}
                            {vid ? "Video" : "Photo"}
                          </span>
                          <a href={r.evidence_url} target="_blank" rel="noopener noreferrer" className="ri-ev-link">Open <SvgIcon path={ICONS.externalLink} size={10} /></a>
                        </div>
                      </div>
                    )}

                    <div className="ri-actions">
                      {canClaim && (
                        <button className="ri-btn ri-btn-claim" disabled={claiming === String(r.id)} onClick={() => claimReport(r.id)}>
                          {claiming === String(r.id) ? "Claiming…" : "Claim"}
                        </button>
                      )}
                      {canResolve && (
                        <button className="ri-btn ri-btn-resolve" onClick={() => setResolveTarget(r)}>
                          <SvgIcon path={ICONS.check} size={12} /> Resolve
                        </button>
                      )}
                      {r.location && (
                        <a href={`https://www.google.com/maps?q=${r.location}`} target="_blank" rel="noopener noreferrer" className="ri-btn ri-btn-nav">
                          <SvgIcon path={ICONS.route} size={12} /> Navigate
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}