import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Alert {
  id: string | number;
  title: string;
  message: string;
  type: string;
  created_at: string;
  created_by?: string | null;
  target_role?: string | null;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const ALERT_META: Record<string, { label: string; colorVar: string; bgVar: string; borderVar: string }> = {
  danger:  { label: "DANGER",  colorVar: "var(--danger)",  bgVar: "rgba(255,59,48,0.06)",   borderVar: "var(--danger)"  },
  warning: { label: "WARNING", colorVar: "var(--warning)", bgVar: "rgba(255,149,0,0.06)",   borderVar: "var(--warning)" },
  info:    { label: "INFO",    colorVar: "var(--primary)", bgVar: "rgba(0,102,255,0.06)",   borderVar: "var(--primary)" },
  success: { label: "SUCCESS", colorVar: "var(--success)", bgVar: "rgba(0,176,116,0.06)",   borderVar: "var(--success)" },
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SvgIcon = ({ path, size = 16 }: { path: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    dangerouslySetInnerHTML={{ __html: path }}
  />
);

const ICONS = {
  bell:      "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  warn:      "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17v.01",
  info:      "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8h.01M12 12v4",
  check:     "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4l-10 10.01-3-3.01",
  clock:     "M12 2a10 10 0 1 0 10 10M12 6v6l4 2",
  broadcast: "M1 6l10.1 7.5L22 6M1 18h22M1 12h4M19 12h4",
  send:      "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  filter:    "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
/* ── Variables — match dashboard exactly ── */
.rap-root {
  --primary: #0066FF;
  --success: #00B074;
  --warning: #FF9500;
  --danger:  #FF3B30;
  --bg:      #FAFBFC;
  --surface: #FFFFFF;
  --border:  #E5E7EB;
  --text:    #1F2937;
  --text-secondary: #6B7280;
  --text-tertiary:  #9CA3AF;
}

@keyframes rap-fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes rap-pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes rap-spin    { to { transform: rotate(360deg); } }
@keyframes rap-shimmer {
  from { background-position: -400% 0; }
  to   { background-position:  400% 0; }
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.rap-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
}

/* ── Page Header ── */
.rap-hd {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  animation: rap-fadeIn 0.4s ease both;
}

.rap-eyebrow {
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

.rap-eyebrow::before {
  content: '';
  display: block;
  width: 20px;
  height: 2px;
  background: var(--primary);
}

.rap-title {
  font-size: 32px;
  color: var(--text);
  letter-spacing: -0.5px;
  line-height: 1.1;
  font-weight: 700;
}

.rap-live {
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

.rap-live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--danger);
  animation: rap-pulse 1.4s ease infinite;
}

/* ── Stat Grid ── */
.rap-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.rap-stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  animation: rap-fadeIn 0.5s ease both;
  cursor: default;
}

.rap-stat:nth-child(2) { animation-delay: 0.05s; }
.rap-stat:nth-child(3) { animation-delay: 0.10s; }
.rap-stat:nth-child(4) { animation-delay: 0.15s; }

.rap-stat:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 8px 16px rgba(0,102,255,0.10);
}

.rap-stat::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
}

.rap-stat.sv-red::before    { background: var(--danger); }
.rap-stat.sv-amber::before  { background: var(--warning); }
.rap-stat.sv-blue::before   { background: var(--primary); }
.rap-stat.sv-green::before  { background: var(--success); }
.rap-stat.sv-default::before{ background: var(--text-secondary); }

.rap-stat-icon { font-size: 20px; margin-bottom: 12px; display: flex; align-items: center; }
.rap-stat.sv-red    .rap-stat-icon { color: var(--danger); }
.rap-stat.sv-amber  .rap-stat-icon { color: var(--warning); }
.rap-stat.sv-blue   .rap-stat-icon { color: var(--primary); }
.rap-stat.sv-green  .rap-stat-icon { color: var(--success); }
.rap-stat.sv-default .rap-stat-icon { color: var(--text-secondary); }

.rap-stat-num {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
  font-weight: 700;
  min-height: 32px;
}
.rap-stat.sv-red    .rap-stat-num { color: var(--danger); }
.rap-stat.sv-amber  .rap-stat-num { color: var(--warning); }
.rap-stat.sv-blue   .rap-stat-num { color: var(--primary); }
.rap-stat.sv-green  .rap-stat-num { color: var(--success); }
.rap-stat.sv-default .rap-stat-num { color: var(--text); }

.rap-stat-label {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-weight: 500;
}

/* ── Skeleton ── */
.rap-skel {
  background: linear-gradient(90deg,
    #f0f2f5 25%, #e4e7ec 50%, #f0f2f5 75%
  );
  background-size: 400% 100%;
  animation: rap-shimmer 1.4s ease infinite;
  border-radius: 6px;
}
.rap-skel-num   { height: 32px; width: 48px; margin-bottom: 6px; }
.rap-skel-badge { height: 22px; width: 80px; border-radius: 6px; }
.rap-skel-title { height: 20px; width: 60%; margin: 8px 0; }
.rap-skel-line  { height: 13px; border-radius: 4px; }
.rap-skel-foot  { height: 13px; width: 90px; border-radius: 4px; }

/* ── Layout ── */
.rap-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  align-items: start;
}

@media (max-width: 1050px) {
  .rap-layout { grid-template-columns: 1fr; }
}

/* ── Filter bar ── */
.rap-filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.rap-filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.rap-filter-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text);
}

.rap-filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.rap-filter-btn.active.fv-red    { background: var(--danger);  border-color: var(--danger); }
.rap-filter-btn.active.fv-amber  { background: var(--warning); border-color: var(--warning); }
.rap-filter-btn.active.fv-blue   { background: var(--primary); border-color: var(--primary); }
.rap-filter-btn.active.fv-green  { background: var(--success); border-color: var(--success); }

.rap-filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  background: rgba(0,0,0,0.1);
  padding: 0 4px;
}

/* ── Alert list ── */
.rap-list { display: flex; flex-direction: column; gap: 10px; }

.rap-empty {
  text-align: center;
  padding: 48px 24px;
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

/* ── Alert Card ── */
.rap-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.25s;
  animation: rap-fadeIn 0.3s ease both;
  position: relative;
  overflow: hidden;
  cursor: default;
}

.rap-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 3px;
}

.rap-card.cv-red::before    { background: var(--danger); }
.rap-card.cv-amber::before  { background: var(--warning); }
.rap-card.cv-blue::before   { background: var(--primary); }
.rap-card.cv-green::before  { background: var(--success); }

.rap-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  border-color: var(--text-tertiary);
}

.rap-card.cv-red:hover   { border-color: var(--danger);  box-shadow: 0 8px 20px rgba(255,59,48,0.10); }
.rap-card.cv-amber:hover { border-color: var(--warning); box-shadow: 0 8px 20px rgba(255,149,0,0.10); }
.rap-card.cv-blue:hover  { border-color: var(--primary); box-shadow: 0 8px 20px rgba(0,102,255,0.10); }
.rap-card.cv-green:hover { border-color: var(--success); box-shadow: 0 8px 20px rgba(0,176,116,0.10); }

.rap-card-skeleton {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 3px solid var(--border);
}

.rap-card-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.rap-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
}

.rap-card.cv-red   .rap-card-icon { background: rgba(255,59,48,0.08);  color: var(--danger);  border-color: rgba(255,59,48,0.2); }
.rap-card.cv-amber .rap-card-icon { background: rgba(255,149,0,0.08);  color: var(--warning); border-color: rgba(255,149,0,0.2); }
.rap-card.cv-blue  .rap-card-icon { background: rgba(0,102,255,0.08);  color: var(--primary); border-color: rgba(0,102,255,0.2); }
.rap-card.cv-green .rap-card-icon { background: rgba(0,176,116,0.08);  color: var(--success); border-color: rgba(0,176,116,0.2); }

.rap-card-body { flex: 1; min-width: 0; }

.rap-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid;
  letter-spacing: 0.3px;
  margin-bottom: 6px;
}

.rap-badge.bv-red   { background: rgba(255,59,48,0.08);  color: var(--danger);  border-color: rgba(255,59,48,0.25); }
.rap-badge.bv-amber { background: rgba(255,149,0,0.08);  color: var(--warning); border-color: rgba(255,149,0,0.25); }
.rap-badge.bv-blue  { background: rgba(0,102,255,0.08);  color: var(--primary); border-color: rgba(0,102,255,0.25); }
.rap-badge.bv-green { background: rgba(0,176,116,0.08);  color: var(--success); border-color: rgba(0,176,116,0.25); }

.rap-card-target {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0,102,255,0.06);
  color: var(--primary);
  border: 1px solid rgba(0,102,255,0.18);
  margin-left: 6px;
}

.rap-card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
  margin-bottom: 4px;
}

.rap-card-msg {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.rap-card-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.rap-card-meta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-tertiary);
}

/* ── Compose Panel ── */
.rap-compose {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
}

.rap-compose-hd {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.rap-compose-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
  background: rgba(255,59,48,0.08);
  border: 1px solid rgba(255,59,48,0.20);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--danger);
}

.rap-compose-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.rap-compose-sub {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* ── Form Fields ── */
.rap-field { display: flex; flex-direction: column; gap: 6px; }

.rap-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.rap-input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 13px;
  font-family: inherit;
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}

.rap-input::placeholder { color: var(--text-tertiary); }
.rap-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0,102,255,0.08);
  background: var(--surface);
}

.rap-textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 13px;
  font-family: inherit;
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  resize: vertical;
  min-height: 90px;
  line-height: 1.6;
}

.rap-textarea::placeholder { color: var(--text-tertiary); }
.rap-textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0,102,255,0.08);
  background: var(--surface);
}

/* ── Type selector ── */
.rap-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.rap-type-opt {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 11px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.15s;
  user-select: none;
}

.rap-type-opt:hover:not(.active) {
  border-color: var(--text-secondary);
  color: var(--text);
  background: var(--surface);
}

.rap-type-opt.active.tv-red   { background: rgba(255,59,48,0.08);  border-color: rgba(255,59,48,0.35);  color: var(--danger); }
.rap-type-opt.active.tv-amber { background: rgba(255,149,0,0.08);  border-color: rgba(255,149,0,0.35);  color: var(--warning); }
.rap-type-opt.active.tv-blue  { background: rgba(0,102,255,0.08);  border-color: rgba(0,102,255,0.35);  color: var(--primary); }
.rap-type-opt.active.tv-green { background: rgba(0,176,116,0.08);  border-color: rgba(0,176,116,0.35);  color: var(--success); }

/* ── Success banner ── */
.rap-success {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 14px;
  background: rgba(0,176,116,0.08);
  border: 1px solid rgba(0,176,116,0.25);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--success);
  letter-spacing: 0.3px;
  animation: rap-fadeIn 0.3s ease;
}

/* ── Send button ── */
.rap-send {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  background: var(--danger);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(255,59,48,0.20);
}

.rap-send:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255,59,48,0.30);
  filter: brightness(1.05);
}

.rap-send:active:not(:disabled) { transform: none; }

.rap-send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: var(--border);
  color: var(--text-tertiary);
  box-shadow: none;
}

/* ── Spinner ── */
.rap-spinner {
  display: inline-block;
  width: 13px; height: 13px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  animation: rap-spin 0.7s linear infinite;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .rap-title { font-size: 26px; }
  .rap-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .rap-stat-num { font-size: 24px; }
}
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

type AlertColor = "red" | "amber" | "blue" | "green";

function getAlertColor(type: string): AlertColor {
  if (type === "danger")  return "red";
  if (type === "warning") return "amber";
  if (type === "success") return "green";
  return "blue";
}

function formatRelative(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function AlertIcon({ type, size = 14 }: { type: string; size?: number }) {
  if (type === "info")    return <SvgIcon path={ICONS.info}  size={size} />;
  if (type === "success") return <SvgIcon path={ICONS.check} size={size} />;
  return <SvgIcon path={ICONS.warn} size={size} />;
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rap-card-skeleton">
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div className="rap-skel" style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="rap-skel rap-skel-badge" style={{ marginBottom: 8 }} />
          <div className="rap-skel rap-skel-title" />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div className="rap-skel rap-skel-line" />
        <div className="rap-skel rap-skel-line" style={{ width: "75%" }} />
      </div>
      <div style={{ paddingTop: 8, borderTop: "1px solid #E5E7EB" }}>
        <div className="rap-skel rap-skel-foot" />
      </div>
    </div>
  );
}

// ─── Type options config ──────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { value: "danger",  label: "Danger",  colorClass: "tv-red"   },
  { value: "warning", label: "Warning", colorClass: "tv-amber" },
  { value: "info",    label: "Info",    colorClass: "tv-blue"  },
  { value: "success", label: "Success", colorClass: "tv-green" },
];

const FILTER_OPTIONS = [
  { value: "all",     label: "All",     colorClass: ""         },
  { value: "danger",  label: "Danger",  colorClass: "fv-red"   },
  { value: "warning", label: "Warning", colorClass: "fv-amber" },
  { value: "info",    label: "Info",    colorClass: "fv-blue"  },
  { value: "success", label: "Success", colorClass: "fv-green" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResponderAlertsPage() {
  const [alerts,    setAlerts]    = useState<Alert[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [title,     setTitle]     = useState("");
  const [message,   setMessage]   = useState("");
  const [alertType, setAlertType] = useState("warning");
  const [filter,    setFilter]    = useState("all");

  const loadAlerts = async () => {
    try {
      const { data } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });
      setAlerts(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    const ch = supabase
      .channel("responder-alerts-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, loadAlerts)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("alerts").insert({
        title:       title.trim(),
        message:     message.trim(),
        type:        alertType,
        created_by:  user?.id ?? null,
        target_role: "citizen",
      });
      setTitle("");
      setMessage("");
      setAlertType("warning");
      setSent(true);
      setTimeout(() => setSent(false), 3500);
      await loadAlerts();
    } finally {
      setSending(false);
    }
  };

  const counts = {
    total:   alerts.length,
    danger:  alerts.filter((a) => a.type === "danger").length,
    warning: alerts.filter((a) => a.type === "warning").length,
    info:    alerts.filter((a) => a.type === "info").length,
    success: alerts.filter((a) => a.type === "success").length,
  };

  const filteredAlerts = filter === "all"
    ? alerts
    : alerts.filter((a) => a.type === filter);

  const statCards = [
    { label: "Total Alerts", value: counts.total,   colorClass: "sv-default", icon: <SvgIcon path={ICONS.bell} size={18} /> },
    { label: "Danger",       value: counts.danger,  colorClass: "sv-red",     icon: <SvgIcon path={ICONS.warn} size={18} /> },
    { label: "Warning",      value: counts.warning, colorClass: "sv-amber",   icon: <SvgIcon path={ICONS.warn} size={18} /> },
    { label: "Info",         value: counts.info,    colorClass: "sv-blue",    icon: <SvgIcon path={ICONS.info} size={18} /> },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="rap-root">

        {/* ── Header ── */}
        <div className="rap-hd">
          <div>
            <div className="rap-eyebrow">Field Operations</div>
            <div className="rap-title">Alerts</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {loading && (
              <div className="rap-spinner" style={{ borderTopColor: "var(--primary)", borderColor: "var(--border)" }} />
            )}
            <div className="rap-live">
              <span className="rap-live-dot" />
              LIVE
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="rap-stats">
          {statCards.map((s) => (
            <div key={s.label} className={`rap-stat ${s.colorClass}`}>
              <div className="rap-stat-icon">{s.icon}</div>
              <div className="rap-stat-num">
                {loading
                  ? <div className="rap-skel rap-skel-num" />
                  : s.value
                }
              </div>
              <div className="rap-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Layout ── */}
        <div className="rap-layout">

          {/* ── Left: Alert feed ── */}
          <div>
            {/* Filter bar */}
            <div className="rap-filter-bar">
              <SvgIcon path={ICONS.filter} size={13} />
              {FILTER_OPTIONS.map((f) => {
                const count = f.value === "all" ? counts.total : (counts as any)[f.value] ?? 0;
                return (
                  <button
                    key={f.value}
                    className={`rap-filter-btn ${f.colorClass} ${filter === f.value ? "active" : ""}`}
                    onClick={() => setFilter(f.value)}
                  >
                    {f.label}
                    {count > 0 && (
                      <span className="rap-filter-count">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="rap-list">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredAlerts.length === 0 ? (
                <div className="rap-empty">
                  {filter === "all" ? "No alerts yet" : `No ${filter} alerts`}
                </div>
              ) : (
                filteredAlerts.map((a) => {
                  const meta  = ALERT_META[a.type] ?? ALERT_META.info;
                  const color = getAlertColor(a.type);
                  return (
                    <div key={String(a.id)} className={`rap-card cv-${color}`}>
                      <div className="rap-card-top">
                        <div className="rap-card-icon">
                          <AlertIcon type={a.type} size={16} />
                        </div>
                        <div className="rap-card-body">
                          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                            <span className={`rap-badge bv-${color}`}>
                              <AlertIcon type={a.type} size={9} />
                              {meta.label}
                            </span>
                            {a.target_role && (
                              <span className="rap-card-target">
                                → {a.target_role.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="rap-card-title">{a.title}</div>
                          <div className="rap-card-msg">{a.message}</div>
                        </div>
                      </div>
                      <div className="rap-card-footer">
                        <span className="rap-card-meta">
                          <SvgIcon path={ICONS.clock} size={11} />
                          {formatRelative(a.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Right: Compose panel ── */}
          <div className="rap-compose">
            <div className="rap-compose-hd">
              <div className="rap-compose-icon">
                <SvgIcon path={ICONS.broadcast} size={16} />
              </div>
              <div>
                <div className="rap-compose-title">Broadcast Alert</div>
                <div className="rap-compose-sub">Send to citizens</div>
              </div>
            </div>

            <div className="rap-field">
              <span className="rap-label">Alert Type</span>
              <div className="rap-type-grid">
                {TYPE_OPTIONS.map((t) => (
                  <div
                    key={t.value}
                    className={`rap-type-opt ${t.colorClass} ${alertType === t.value ? "active" : ""}`}
                    onClick={() => setAlertType(t.value)}
                  >
                    <AlertIcon type={t.value} size={13} />
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rap-field">
              <label className="rap-label">Title</label>
              <input
                className="rap-input"
                placeholder="e.g. Road closed — Rizal Blvd"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="rap-field">
              <label className="rap-label">Message</label>
              <textarea
                className="rap-textarea"
                placeholder="Describe the situation and any public safety instructions…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {sent && (
              <div className="rap-success">
                <SvgIcon path={ICONS.check} size={13} />
                Alert broadcast successfully
              </div>
            )}

            <button
              className="rap-send"
              disabled={!title.trim() || !message.trim() || sending}
              onClick={handleSend}
            >
              {sending ? (
                <><span className="rap-spinner" /> Sending…</>
              ) : (
                <><SvgIcon path={ICONS.send} size={14} /> Broadcast Alert</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}