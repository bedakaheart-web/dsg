import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type Incident = {
  id: string;
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
  responder_notes: string | null;
  action_notes: string | null;
  resolution_type: string | null;
  resolved_at: string | null;
};

type Responder = {
  id: string;
  name: string | null;
  email: string | null;
  status: string | null;
  on_duty: boolean | null;
};

// ─── Meta ─────────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; colorClass: string; accentColor: string }> = {
  fire:     { icon: "🔥", colorClass: "t-fire",     accentColor: "#FF3B30" },
  accident: { icon: "🚗", colorClass: "t-accident", accentColor: "#FF9500" },
  flood:    { icon: "🌊", colorClass: "t-flood",    accentColor: "#0066FF" },
  crime:    { icon: "🚨", colorClass: "t-crime",    accentColor: "#FF2D55" },
  medical:  { icon: "🏥", colorClass: "t-medical",  accentColor: "#00B074" },
  other:    { icon: "⚠️", colorClass: "t-other",    accentColor: "#9CA3AF" },
};

const STATUS_META: Record<string, { label: string; colorClass: string }> = {
  pending:       { label: "PENDING",     colorClass: "s-pending"  },
  "in-progress": { label: "IN PROGRESS", colorClass: "s-progress" },
  resolved:      { label: "RESOLVED",    colorClass: "s-resolved" },
};

const RESOLUTION_TYPES = [
  { id: "forwarded",      label: "Forwarded to Department",    icon: "↗" },
  { id: "follow-up",      label: "Resolved — Needs Follow-Up", icon: "⟳" },
  { id: "fully-resolved", label: "Fully Resolved",             icon: "✓" },
];

const STATUS_FILTERS = [
  { key: "pending",     label: "Pending"     },
  { key: "in-progress", label: "In Progress" },
  { key: "resolved",    label: "Resolved"    },
];

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
  return /\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(url);
}

function cls(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(" ");
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SvgIcon = ({ path, size = 16 }: { path: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    dangerouslySetInnerHTML={{ __html: path }} />
);
const ICONS = {
  mapPin:  "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  user:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  phone:   "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  clock:   "M12 2a10 10 0 1 0 10 10M12 6v6l4 2",
  check:   "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4l-10 10.01-3-3.01",
  x:       "M18 6L6 18M6 6l12 12",
  image:   "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",
  video:   "M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  extLink: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",
  users:   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  note:    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLE = `
:root {
  --primary:  #0066FF;
  --success:  #00B074;
  --warning:  #FF9500;
  --danger:   #FF3B30;
  --bg:       #0d1117;
  --surface:  rgba(15,21,33,0.82);
  --border:   rgba(255,255,255,0.07);
  --text:     #eef0f7;
  --text-secondary: rgba(238,240,247,0.55);
  --text-tertiary:  rgba(238,240,247,0.28);
}

@keyframes fadeIn  { from { opacity: 0; transform: translateY(6px);  } to { opacity: 1; transform: none; } }
@keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes blink   { 0%,100% { opacity:1; } 50% { opacity:0.35; } }

* { box-sizing: border-box; margin: 0; padding: 0; }

.ip-root {
  background: rgba(8,12,20,0.93);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  padding: 0;
}

/* ── Header ── */
.ip-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
}
.ip-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--primary); margin-bottom: 6px;
  display: flex; align-items: center; gap: 8px;
}
.ip-eyebrow::before { content: ''; display: block; width: 20px; height: 2px; background: var(--primary); }
.ip-title { font-size: 28px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; margin: 0; }

/* ── Filter pills ── */
.ip-filters {
  display: flex; gap: 4px;
  background: rgba(15,21,33,0.82); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; padding: 5px;
}
.ip-filter-btn {
  padding: 8px 16px; border: 1px solid transparent; border-radius: 8px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;
  cursor: pointer; transition: all 0.2s;
  background: transparent; color: var(--text-secondary);
}
.ip-filter-btn:hover { background: rgba(255,255,255,0.05); color: #eef0f7; border-color: rgba(255,255,255,0.12); }
.ip-filter-btn.active-pending {
  background: linear-gradient(135deg, var(--danger) 0%, #cc2e24 100%);
  color: white; border-color: transparent;
  box-shadow: 0 2px 6px rgba(255,59,48,0.2);
}
.ip-filter-btn.active-in-progress {
  background: linear-gradient(135deg, var(--warning) 0%, #cc7700 100%);
  color: white; border-color: transparent;
  box-shadow: 0 2px 6px rgba(255,149,0,0.2);
}
.ip-filter-btn.active-resolved {
  background: linear-gradient(135deg, var(--success) 0%, #008f5d 100%);
  color: white; border-color: transparent;
  box-shadow: 0 2px 6px rgba(0,176,116,0.2);
}

/* ── Stats ── */
.ip-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
.ip-stat {
  background: rgba(15,21,33,0.82); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px;
  padding: 18px 20px; position: relative; overflow: hidden; transition: all 0.3s;
}
.ip-stat:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
.ip-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
.ip-stat.s-pending::before   { background: var(--danger);  }
.ip-stat.s-progress::before  { background: var(--warning); }
.ip-stat.s-resolved::before  { background: var(--success); }
.ip-stat-label { font-size: 10px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px; }
.ip-stat-value { font-size: 28px; font-weight: 700; line-height: 1; }
.ip-stat.s-pending  .ip-stat-value { color: var(--danger);  }
.ip-stat.s-progress .ip-stat-value { color: var(--warning); }
.ip-stat.s-resolved .ip-stat-value { color: var(--success); }

/* ── Card grid ── */
.ip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }

/* ── Incident card ── */
.ip-card {
  background: rgba(15,21,33,0.82); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px;
  overflow: hidden; transition: all 0.3s; animation: fadeIn 0.4s ease-out both;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.ip-card:nth-child(2) { animation-delay: 0.05s; }
.ip-card:nth-child(3) { animation-delay: 0.10s; }
.ip-card:hover { transform: translateY(-3px); border-color: var(--primary); box-shadow: 0 6px 16px rgba(0,102,255,0.1); }

.ip-card-bar { height: 2px; }
.ip-card.t-fire     .ip-card-bar { background: var(--danger);  }
.ip-card.t-accident .ip-card-bar { background: var(--warning); }
.ip-card.t-flood    .ip-card-bar { background: var(--primary); }
.ip-card.t-crime    .ip-card-bar { background: #FF2D55; }
.ip-card.t-medical  .ip-card-bar { background: var(--success); }
.ip-card.t-other    .ip-card-bar { background: var(--text-tertiary); }

.ip-card-body { padding: 18px; }

/* ── Card top row ── */
.ip-card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.ip-card-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; }
.ip-card.t-fire     .ip-card-label { color: var(--danger);  }
.ip-card.t-accident .ip-card-label { color: var(--warning); }
.ip-card.t-flood    .ip-card-label { color: var(--primary); }
.ip-card.t-crime    .ip-card-label { color: #FF2D55; }
.ip-card.t-medical  .ip-card-label { color: var(--success); }
.ip-card.t-other    .ip-card-label { color: var(--text-tertiary); }

/* Status badge */
.ip-badge {
  font-size: 9px; font-weight: 700; padding: 4px 10px; border-radius: 6px;
  white-space: nowrap; border: 1px solid; flex-shrink: 0;
  display: inline-flex; align-items: center; gap: 5px;
}
.ip-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.ip-badge.s-pending  { background: rgba(255,59,48,.08);   color: var(--danger);  border-color: var(--danger);  }
.ip-badge.s-pending::before  { background: var(--danger); animation: blink 1.4s ease infinite; }
.ip-badge.s-progress { background: rgba(255,149,0,.08);   color: var(--warning); border-color: var(--warning); }
.ip-badge.s-progress::before { background: var(--warning); animation: blink 1.4s ease infinite; }
.ip-badge.s-resolved { background: rgba(0,176,116,.08);   color: var(--success); border-color: var(--success); }
.ip-badge.s-resolved::before { background: var(--success); }

/* ── Fields ── */
.ip-fields { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.ip-fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ip-field {
  padding: 9px 12px; background: var(--bg); border: 1px solid var(--border);
  border-radius: 9px; display: flex; flex-direction: column; gap: 3px; min-width: 0;
}
.ip-field-lbl { font-size: 9px; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
.ip-field-val { font-size: 12px; font-weight: 500; color: var(--text); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ip-field-tel { color: var(--success); text-decoration: none; font-weight: 700; }
.ip-field-tel:hover { text-decoration: underline; }

.ip-desc {
  font-size: 12px; color: var(--text-secondary); line-height: 1.6;
  padding: 10px 12px; background: var(--bg); border: 1px solid var(--border);
  border-radius: 9px; margin-bottom: 12px;
}

/* ── Resolution summary ── */
.ip-resolution-box {
  margin-bottom: 12px; border-radius: 9px; overflow: hidden;
  border: 1px solid var(--success); background: rgba(0,176,116,0.06);
}
.ip-resolution-hd {
  display: flex; align-items: center; gap: 8px; padding: 8px 12px;
  background: rgba(0,176,116,0.08); border-bottom: 1px solid rgba(0,176,116,0.15);
}
.ip-resolution-hd-label { font-size: 9px; font-weight: 700; color: var(--success); text-transform: uppercase; letter-spacing: 0.3px; flex: 1; }
.ip-resolution-type-tag { font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 5px; background: var(--success); color: white; text-transform: uppercase; }
.ip-resolution-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }
.ip-resolution-section { display: flex; flex-direction: column; gap: 3px; }
.ip-resolution-section-lbl { font-size: 9px; font-weight: 700; color: var(--success); text-transform: uppercase; letter-spacing: 0.3px; }
.ip-resolution-section-val { font-size: 12px; color: var(--text); line-height: 1.5; }
.ip-resolution-divider { height: 1px; background: rgba(0,176,116,0.15); }
.ip-resolution-footer { font-size: 10px; color: var(--success); font-weight: 600; padding: 4px 12px 10px; }

/* ── Evidence ── */
.ip-ev-wrap { border-radius: 9px; overflow: hidden; background: var(--bg); border: 1px solid var(--border); margin-bottom: 12px; }
.ip-ev-img { width: 100%; max-height: 180px; object-fit: cover; display: block; cursor: zoom-in; transition: opacity 0.2s; }
.ip-ev-img:hover { opacity: 0.9; }
.ip-ev-video { width: 100%; max-height: 180px; display: block; background: #000; }
.ip-ev-bar { display: flex; align-items: center; justify-content: space-between; padding: 7px 11px; border-top: 1px solid var(--border); background: var(--bg); }
.ip-ev-type { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--text-secondary); font-weight: 600; }
.ip-ev-link { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; color: var(--text-secondary); text-decoration: none; transition: color 0.15s; }
.ip-ev-link:hover { color: var(--primary); }

/* ── Actions ── */
.ip-actions { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 12px; border-top: 1px solid var(--border); }
.ip-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 10px; font-weight: 700; padding: 7px 13px; border-radius: 8px;
  cursor: pointer; border: 1px solid; transition: all 0.2s;
  letter-spacing: 0.3px; text-transform: uppercase; white-space: nowrap;
}
.ip-btn:hover:not(:disabled) { transform: translateY(-1px); }
.ip-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.ip-btn-reassign { background: rgba(0,102,255,.06); border-color: var(--primary);  color: var(--primary);  }
.ip-btn-reassign:hover:not(:disabled) { background: rgba(0,102,255,.12); }
.ip-btn-resolve  { background: rgba(0,176,116,.06); border-color: var(--success); color: var(--success); }
.ip-btn-resolve:hover:not(:disabled) { background: rgba(0,176,116,.12); }

/* ── Lightbox ── */
.ip-lightbox-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(8px);
  z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px;
  animation: fadeIn 0.2s ease;
}
.ip-lightbox { position: relative; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.ip-lightbox img { max-width: 88vw; max-height: 78vh; border-radius: 12px; object-fit: contain; border: 1px solid rgba(255,255,255,0.1); display: block; }
.ip-lightbox video { max-width: 88vw; max-height: 78vh; border-radius: 12px; outline: none; }
.ip-lightbox-close {
  position: absolute; top: -14px; right: -14px; width: 36px; height: 36px;
  border-radius: 50%; background: rgba(255,59,48,0.12); border: 1px solid rgba(255,59,48,0.3);
  color: var(--danger); font-size: 18px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.15s; line-height: 1;
}
.ip-lightbox-close:hover { background: rgba(255,59,48,0.25); }
.ip-lightbox-label { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; text-transform: uppercase; }

/* ── Modal backdrop ── */
.ip-modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 24px;
  animation: fadeIn 0.2s ease;
}
.ip-modal {
  background: rgba(15,21,33,0.82); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px;
  width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto;
  animation: modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  position: relative;
}

/* Modal header */
.ip-modal-hd {
  padding: 20px 24px; border-bottom: 1px solid var(--border);
  display: flex; align-items: flex-start; gap: 14px; background: rgba(8,12,20,0.93);
}
.ip-modal-icon {
  width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%);
  display: flex; align-items: center; justify-content: center; color: white;
}
.ip-modal-icon.ic-green { background: linear-gradient(135deg, var(--success) 0%, #008f5d 100%); }
.ip-modal-title-wrap { flex: 1; }
.ip-modal-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.ip-modal-sub { font-size: 10px; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; font-weight: 600; }
.ip-modal-close {
  background: transparent; border: 1px solid var(--border); border-radius: 8px;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary); cursor: pointer; transition: all 0.2s; flex-shrink: 0;
}
.ip-modal-close:hover { background: var(--bg); color: var(--text); }

.ip-modal-body { padding: 20px 24px; }
.ip-modal-ft { padding: 14px 24px 20px; display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid var(--border); }

.ip-modal-cancel {
  font-size: 11px; font-weight: 700; padding: 10px 16px; border-radius: 8px;
  cursor: pointer; background: transparent; border: 1px solid var(--border);
  color: var(--text-secondary); transition: all 0.2s; letter-spacing: 0.3px; text-transform: uppercase;
}
.ip-modal-cancel:hover { border-color: rgba(255,255,255,0.20); color: #eef0f7; background: rgba(255,255,255,0.05); }

.ip-modal-confirm {
  font-size: 11px; font-weight: 700; padding: 10px 16px; border-radius: 8px;
  cursor: pointer; border: none; transition: all 0.2s; letter-spacing: 0.3px;
  text-transform: uppercase; display: flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%); color: white;
}
.ip-modal-confirm.c-green { background: linear-gradient(135deg, var(--success) 0%, #008f5d 100%); }
.ip-modal-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
.ip-modal-confirm:not(:disabled):hover { transform: translateY(-1px); }

/* ── Responder list (reassign modal) ── */
.ip-responder-list {
  display: flex; flex-direction: column; gap: 8px; max-height: 300px;
  overflow-y: auto; margin-bottom: 16px;
  scrollbar-width: thin; scrollbar-color: var(--border) transparent;
}
.ip-responder-option {
  display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  border-radius: 10px; border: 1px solid var(--border); background: rgba(8,12,20,0.93);
  cursor: pointer; transition: all 0.16s;
}
.ip-responder-option:hover { background: rgba(0,102,255,0.10); border-color: rgba(0,102,255,0.3); }
.ip-responder-option.selected { background: rgba(0,102,255,0.06); border-color: var(--primary); }
.ip-responder-avatar {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: white;
}
.ip-responder-info { flex: 1; min-width: 0; }
.ip-responder-name { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ip-responder-detail { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
.ip-responder-check { font-size: 14px; color: var(--primary); opacity: 0; transition: opacity 0.15s; }
.ip-responder-option.selected .ip-responder-check { opacity: 1; }

/* Incident summary strip in modal */
.ip-modal-strip {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 9px;
  padding: 12px 14px; margin-bottom: 18px; font-size: 12px; color: var(--text-secondary);
  line-height: 1.5;
}
.ip-modal-strip strong { color: var(--text); font-weight: 600; }

/* Resolve confirm */
.ip-resolve-icon { font-size: 36px; text-align: center; margin-bottom: 12px; }

/* Spinner / empty / loading */
.ip-spinner { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--primary); animation: spin 0.8s linear infinite; }
.ip-empty { text-align: center; padding: 56px 24px; font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.3px; }
.ip-loading { text-align: center; padding: 48px; font-size: 13px; color: var(--text-secondary); }
.ip-modal-loading { text-align: center; padding: 32px; font-size: 13px; color: var(--text-secondary); }
.ip-modal-empty { text-align: center; padding: 28px; font-size: 13px; color: var(--text-secondary); }

/* Responder chip on card */
.ip-responder-chip {
  font-size: 10px; padding: 3px 9px; border-radius: 6px; border: 1px solid;
  font-weight: 600;
}
.ip-responder-chip.assigned { background: rgba(0,102,255,.06); color: var(--primary); border-color: var(--primary); }
.ip-responder-chip.unassigned { background: var(--bg); color: var(--text-tertiary); border-color: var(--border); }

@media (max-width: 768px) {
  .ip-stats { grid-template-columns: 1fr; }
  .ip-grid  { grid-template-columns: 1fr; }
  .ip-fields-row { grid-template-columns: 1fr; }
}
`;

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ url, onClose }: { url: string; onClose: () => void }) {
  const vid = isVideo(url);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="ip-lightbox-backdrop" onClick={onClose}>
      <div className="ip-lightbox" onClick={e => e.stopPropagation()}>
        <button className="ip-lightbox-close" onClick={onClose}>×</button>
        {vid ? <video src={url} controls autoPlay playsInline /> : <img src={url} alt="Evidence" />}
        <span className="ip-lightbox-label">{vid ? "🎥 Video Evidence" : "🖼 Photo Evidence"}</span>
      </div>
    </div>
  );
}

// ─── Resolution summary (on resolved cards) ───────────────────────────────────

function ResolutionSummary({ inc }: { inc: Incident }) {
  if (inc.status !== "resolved") return null;
  if (!inc.responder_notes && !inc.action_notes) return null;
  const rt = RESOLUTION_TYPES.find(r => r.id === inc.resolution_type);
  return (
    <div className="ip-resolution-box">
      <div className="ip-resolution-hd">
        <SvgIcon path={ICONS.check} size={11} />
        <span className="ip-resolution-hd-label">Resolution Summary</span>
        {rt && <span className="ip-resolution-type-tag">{rt.icon} {rt.label}</span>}
      </div>
      <div className="ip-resolution-body">
        {inc.responder_notes && (
          <div className="ip-resolution-section">
            <span className="ip-resolution-section-lbl">Response Notes</span>
            <span className="ip-resolution-section-val">{inc.responder_notes}</span>
          </div>
        )}
        {inc.responder_notes && inc.action_notes && <div className="ip-resolution-divider" />}
        {inc.action_notes && (
          <div className="ip-resolution-section">
            <span className="ip-resolution-section-lbl">Action Taken</span>
            <span className="ip-resolution-section-val">{inc.action_notes}</span>
          </div>
        )}
      </div>
      {inc.resolved_at && (
        <div className="ip-resolution-footer">Resolved {formatDateTime(inc.resolved_at)}</div>
      )}
    </div>
  );
}

// ─── Reassign Modal ───────────────────────────────────────────────────────────

function ReassignModal({
  incident, onClose, onConfirm,
}: {
  incident: Incident;
  onClose: () => void;
  onConfirm: (responderId: string) => Promise<void>;
}) {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [loadingR, setLoadingR]     = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(incident.responder_id);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    supabase.from("responders").select("id, name, email, status, on_duty")
      .order("name", { ascending: true })
      .then(({ data }) => { setResponders(data ?? []); setLoadingR(false); });
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const handleConfirm = async () => {
    if (!selectedId) return;
    setSaving(true);
    await onConfirm(selectedId);
    setSaving(false);
    onClose();
  };

  const tm = TYPE_META[incident.type] ?? TYPE_META.other;

  return (
    <div className="ip-modal-backdrop" onClick={e => { if ((e.target as HTMLElement).classList.contains("ip-modal-backdrop")) onClose(); }}>
      <div className="ip-modal">
        <div className="ip-modal-hd">
          <div className="ip-modal-icon">
            <SvgIcon path={ICONS.users} size={20} />
          </div>
          <div className="ip-modal-title-wrap">
            <div className="ip-modal-title">Reassign Incident</div>
            <div className="ip-modal-sub">Select a responder</div>
          </div>
          <button className="ip-modal-close" onClick={onClose}><SvgIcon path={ICONS.x} size={18} /></button>
        </div>

        <div className="ip-modal-body">
          <div className="ip-modal-strip">
            <strong>{tm.icon} {incident.type.toUpperCase()}</strong> · {incident.address || incident.location || "Unknown location"}
            {incident.description && (
              <div style={{ marginTop: 4, color: "var(--text-secondary)" }}>
                {incident.description.slice(0, 80)}{incident.description.length > 80 ? "…" : ""}
              </div>
            )}
          </div>

          {loadingR ? (
            <div className="ip-modal-loading"><div className="ip-spinner" style={{ margin: "0 auto" }} /></div>
          ) : responders.length === 0 ? (
            <div className="ip-modal-empty">No responders found.</div>
          ) : (
            <div className="ip-responder-list">
              {responders.map(r => (
                <div
                  key={r.id}
                  className={cls("ip-responder-option", selectedId === r.id && "selected")}
                  onClick={() => setSelectedId(r.id)}
                >
                  <div className="ip-responder-avatar">{getInitials(r.name)}</div>
                  <div className="ip-responder-info">
                    <div className="ip-responder-name">{r.name ?? "Unnamed"}</div>
                    <div className="ip-responder-detail">
                      {r.on_duty ? "🟢 On Duty" : "⚫ Off Duty"} · {r.email ?? "No email"}
                    </div>
                  </div>
                  <span className="ip-responder-check">✓</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ip-modal-ft">
          <button className="ip-modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className="ip-modal-confirm"
            disabled={!selectedId || saving || loadingR}
            onClick={handleConfirm}
          >
            {saving ? "Assigning…" : "Assign Responder"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Resolve Confirm Modal ────────────────────────────────────────────────────

function ResolveModal({
  incident, onClose, onConfirm,
}: {
  incident: Incident;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const handleConfirm = async () => {
    setSaving(true);
    await onConfirm();
    setSaving(false);
    onClose();
  };

  return (
    <div className="ip-modal-backdrop" onClick={e => { if ((e.target as HTMLElement).classList.contains("ip-modal-backdrop")) onClose(); }}>
      <div className="ip-modal" style={{ maxWidth: 380 }}>
        <div className="ip-modal-hd">
          <div className="ip-modal-icon ic-green">
            <SvgIcon path={ICONS.check} size={20} />
          </div>
          <div className="ip-modal-title-wrap">
            <div className="ip-modal-title">Mark as Resolved?</div>
            <div className="ip-modal-sub">Confirm resolution</div>
          </div>
          <button className="ip-modal-close" onClick={onClose}><SvgIcon path={ICONS.x} size={18} /></button>
        </div>
        <div className="ip-modal-body">
          <div className="ip-modal-strip" style={{ textAlign: "center" }}>
            This will mark the incident as resolved and move it out of the active queue.
            {incident.description && (
              <div style={{ marginTop: 8, color: "var(--primary)", fontStyle: "italic" }}>
                "{incident.description.slice(0, 80)}{incident.description.length > 80 ? "…" : ""}"
              </div>
            )}
          </div>
        </div>
        <div className="ip-modal-ft" style={{ justifyContent: "center" }}>
          <button className="ip-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="ip-modal-confirm c-green" disabled={saving} onClick={handleConfirm}>
            {saving ? "Resolving…" : "Yes, Resolve"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IncidentsPage() {
  const [incidents, setIncidents]         = useState<Incident[]>([]);
  const [filter, setFilter]               = useState("pending");
  const [counts, setCounts]               = useState({ pending: 0, "in-progress": 0, resolved: 0 });
  const [loading, setLoading]             = useState(true);
  const [lightboxUrl, setLightboxUrl]     = useState<string | null>(null);
  const [reassignTarget, setReassignTarget] = useState<Incident | null>(null);
  const [resolveTarget,  setResolveTarget]  = useState<Incident | null>(null);

  const fetchIncidents = async (status: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("reports")
      .select("id,type,description,location,address,reporter_name,reporter_contact,status,evidence_url,created_at,responder_id,responder_notes,action_notes,resolution_type,resolved_at")
      .eq("status", status)
      .order("created_at", { ascending: false });
    setIncidents(data ?? []);
    setLoading(false);
  };

  const fetchCounts = async () => {
    const statuses = ["pending", "in-progress", "resolved"] as const;
    const results  = await Promise.all(
      statuses.map(s => supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", s))
    );
    setCounts({ pending: results[0].count ?? 0, "in-progress": results[1].count ?? 0, resolved: results[2].count ?? 0 });
  };

  useEffect(() => { fetchCounts(); }, []);
  useEffect(() => { fetchIncidents(filter); }, [filter]);

  const handleReassignConfirm = async (responderId: string) => {
    if (!reassignTarget) return;
    await supabase.from("reports")
      .update({ responder_id: responderId, status: "in-progress" })
      .eq("id", reassignTarget.id);
    fetchIncidents(filter);
    fetchCounts();
  };

  const handleResolveConfirm = async () => {
    if (!resolveTarget) return;
    await supabase.from("reports").update({ status: "resolved" }).eq("id", resolveTarget.id);
    fetchIncidents(filter);
    fetchCounts();
  };

  const filterActiveClass: Record<string, string> = {
    "pending":     "active-pending",
    "in-progress": "active-in-progress",
    "resolved":    "active-resolved",
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="ip-root">

        {/* Header */}
        <div className="ip-header">
          <div>
            <div className="ip-eyebrow">Admin Panel</div>
            <h1 className="ip-title">Incidents Oversight</h1>
          </div>
          <div className="ip-filters">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.key}
                className={cls("ip-filter-btn", filter === f.key && filterActiveClass[f.key])}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="ip-stats">
          <div className="ip-stat s-pending">
            <div className="ip-stat-label">Pending</div>
            <div className="ip-stat-value">{counts.pending}</div>
          </div>
          <div className="ip-stat s-progress">
            <div className="ip-stat-label">In Progress</div>
            <div className="ip-stat-value">{counts["in-progress"]}</div>
          </div>
          <div className="ip-stat s-resolved">
            <div className="ip-stat-label">Resolved</div>
            <div className="ip-stat-value">{counts.resolved}</div>
          </div>
        </div>

        {/* Card grid */}
        {loading ? (
          <div className="ip-loading"><div className="ip-spinner" style={{ margin: "0 auto" }} /></div>
        ) : incidents.length === 0 ? (
          <div className="ip-empty">No {filter} incidents found</div>
        ) : (
          <div className="ip-grid">
            {incidents.map(inc => {
              const tm  = TYPE_META[inc.type]     ?? TYPE_META.other;
              const sm  = STATUS_META[inc.status] ?? STATUS_META.pending;
              const vid = inc.evidence_url && isVideo(inc.evidence_url);

              return (
                <div key={inc.id} className={cls("ip-card", tm.colorClass)}>
                  <div className="ip-card-bar" />
                  <div className="ip-card-body">

                    {/* Top row */}
                    <div className="ip-card-top">
                      <div className="ip-card-label">
                        <span>{tm.icon}</span>
                        <span style={{ textTransform: "capitalize" }}>{inc.type}</span>
                      </div>
                      <span className={cls("ip-badge", sm.colorClass)}>{sm.label}</span>
                    </div>

                    {/* Fields */}
                    <div className="ip-fields">
                      <div className="ip-field">
                        <span className="ip-field-lbl"><SvgIcon path={ICONS.mapPin} size={10} /> Location</span>
                        <span className="ip-field-val" title={inc.address || inc.location || "—"}>
                          {inc.address || inc.location || "—"}
                        </span>
                      </div>
                      <div className="ip-fields-row">
                        <div className="ip-field">
                          <span className="ip-field-lbl"><SvgIcon path={ICONS.user} size={10} /> Reporter</span>
                          <span className="ip-field-val">{inc.reporter_name || "Anonymous"}</span>
                        </div>
                        <div className="ip-field">
                          <span className="ip-field-lbl"><SvgIcon path={ICONS.clock} size={10} /> Reported</span>
                          <span className="ip-field-val">{formatRelative(inc.created_at)}</span>
                        </div>
                      </div>
                      {inc.reporter_contact && (
                        <div className="ip-field">
                          <span className="ip-field-lbl"><SvgIcon path={ICONS.phone} size={10} /> Contact</span>
                          <a href={`tel:${inc.reporter_contact}`} className="ip-field-val ip-field-tel">
                            {inc.reporter_contact}
                          </a>
                        </div>
                      )}
                      <div className="ip-field">
                        <span className="ip-field-lbl"><SvgIcon path={ICONS.users} size={10} /> Responder</span>
                        <span className={cls("ip-responder-chip", inc.responder_id ? "assigned" : "unassigned")}>
                          {inc.responder_id ? `ID: ${inc.responder_id.slice(0, 8)}…` : "Unassigned"}
                        </span>
                      </div>
                    </div>

                    {inc.description && <div className="ip-desc">{inc.description}</div>}

                    {/* Resolution summary (resolved cards) */}
                    <ResolutionSummary inc={inc} />

                    {/* Evidence */}
                    {inc.evidence_url && (
                      <div className="ip-ev-wrap">
                        {vid ? (
                          <video className="ip-ev-video" src={inc.evidence_url} controls preload="metadata" />
                        ) : (
                          <img
                            className="ip-ev-img"
                            src={inc.evidence_url}
                            alt="Evidence"
                            onClick={() => setLightboxUrl(inc.evidence_url!)}
                          />
                        )}
                        <div className="ip-ev-bar">
                          <span className="ip-ev-type">
                            {vid ? <SvgIcon path={ICONS.video} size={12} /> : <SvgIcon path={ICONS.image} size={12} />}
                            {vid ? "Video" : "Photo"}
                          </span>
                          <a href={inc.evidence_url} target="_blank" rel="noopener noreferrer" className="ip-ev-link">
                            Open <SvgIcon path={ICONS.extLink} size={10} />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="ip-actions">
                      <button className="ip-btn ip-btn-reassign" onClick={() => setReassignTarget(inc)}>
                        <SvgIcon path={ICONS.users} size={12} /> Reassign
                      </button>
                      {inc.status !== "resolved" && (
                        <button className="ip-btn ip-btn-resolve" onClick={() => setResolveTarget(inc)}>
                          <SvgIcon path={ICONS.check} size={12} /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {lightboxUrl && <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}

      {reassignTarget && (
        <ReassignModal
          incident={reassignTarget}
          onClose={() => setReassignTarget(null)}
          onConfirm={handleReassignConfirm}
        />
      )}

      {resolveTarget && (
        <ResolveModal
          incident={resolveTarget}
          onClose={() => setResolveTarget(null)}
          onConfirm={handleResolveConfirm}
        />
      )}
    </>
  );
}