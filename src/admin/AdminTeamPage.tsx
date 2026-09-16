import { useEffect, useState, Component, type ReactNode } from "react";
import { supabase } from "../js/supabase";
import AdminChatDrawer from "./components/AdminChatDrawer";

// ─── Section error boundary ───────────────────────────────────────────────
// Isolates crashes in the team grid / chat drawer so one bad render can never
// blank the entire AdminDashboard tree — shows a retryable fallback instead.
class TeamSectionBoundary extends Component<{ children: ReactNode; label: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) {
    console.error(`[TeamSectionBoundary:${this.props.label}]`, err);
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="atp-empty">
          <div className="atp-empty-text">Something went wrong loading {this.props.label}.</div>
          <button className="atp-retry-btn" onClick={() => this.setState({ failed: false })}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  status?: string;
  unit?: string;
  avatar_url?: string | null;
  phone?: string | null;
  joined_at?: string;
  last_seen?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  on_duty:    { label: "On Duty",    color: "#00B074", bg: "rgba(0,176,116,0.08)",  border: "rgba(0,176,116,0.25)"  },
  responding: { label: "Responding", color: "#FF9500", bg: "rgba(255,149,0,0.08)",  border: "rgba(255,149,0,0.25)"  },
  off_duty:   { label: "Off Duty",   color: "#9CA3AF", bg: "rgba(156,163,175,0.08)", border: "rgba(156,163,175,0.25)" },
};

const UNIT_COLORS: Record<string, string> = {
  Alpha:   "#0066FF",
  Bravo:   "#00B074",
  Charlie: "#FF9500",
  Delta:   "#FF3B30",
  HQ:      "#8B5CF6",
};

const ROLE_COLORS: Record<string, string> = {
  admin:     "#8B5CF6",
  responder: "#0066FF",
  commander: "#FF9500",
  medic:     "#00B074",
  scout:     "#FF2D55",
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SvgIcon = ({ path, size = 16 }: { path: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
  >
    <path d={path} />
  </svg>
);

const ICONS = {
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  radio:    "M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5M19.1 4.9C23 8.8 23 15.1 19.1 19",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mail:     "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  filter:   "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  clock:    "M12 2a10 10 0 1 0 10 10M12 6v6l4 2",
  chevDown: "M6 9l6 6 6-6",
  chevUp:   "M18 15l-6-6-6 6",
  retry:    "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  badge:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  settings: "M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24M19.78 19.78l-4.24-4.24m-3.08-3.08l-4.24-4.24",
  trash:    "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2-2H7a2 2 0 0 1-2-2V6h16zM10 11v6M14 11v6",
  chat:     "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
.atp-root {
  --primary: #0066FF;
  --success: #00B074;
  --warning: #FF9500;
  --danger:  #FF3B30;
  --purple:  #8B5CF6;
  --bg:      #0d1117;
  --surface: rgba(15,21,33,0.82);
  --border:  rgba(255,255,255,0.07);
  --text:    #eef0f7;
  --text-secondary: rgba(238,240,247,0.55);
  --text-tertiary:  rgba(238,240,247,0.28);
}

@keyframes atp-fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes atp-slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes atp-pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes atp-spin    { to { transform: rotate(360deg); } }
@keyframes atp-shimmer { from { background-position: -400% 0; } to { background-position: 400% 0; } }
@keyframes atp-expand  { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 300px; } }

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.atp-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  background: rgba(8,12,20,0.93);
  min-height: 100vh;
}

/* ── Header ── */
.atp-hd {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  animation: atp-fadeIn 0.4s ease both;
}

.atp-eyebrow {
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

.atp-eyebrow::before {
  content: '';
  display: block;
  width: 20px;
  height: 2px;
  background: var(--primary);
}

.atp-title {
  font-size: 32px;
  color: var(--text);
  letter-spacing: -0.5px;
  line-height: 1.1;
  font-weight: 700;
}

.atp-subtitle {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 4px;
}

.atp-live {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--success);
  background: rgba(0,176,116,0.06);
  color: var(--success);
  letter-spacing: 0.3px;
  white-space: nowrap;
  font-weight: 600;
}

.atp-live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--success);
  animation: atp-pulse 1.4s ease infinite;
}

/* ── Stat Grid ── */
.atp-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.atp-stat {
  background: rgba(15,21,33,0.82);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  animation: atp-fadeIn 0.5s ease both;
  cursor: default;
}

.atp-stat:nth-child(2) { animation-delay: 0.05s; }
.atp-stat:nth-child(3) { animation-delay: 0.10s; }
.atp-stat:nth-child(4) { animation-delay: 0.15s; }

.atp-stat:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 8px 16px rgba(0,102,255,0.10);
}

.atp-stat::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
}

.atp-stat.sv-default::before { background: var(--text-secondary); }
.atp-stat.sv-green::before   { background: var(--success); }
.atp-stat.sv-amber::before   { background: var(--warning); }
.atp-stat.sv-purple::before  { background: var(--purple); }
.atp-stat.sv-gray::before    { background: var(--text-tertiary); }

.atp-stat-icon { font-size: 20px; margin-bottom: 12px; display: flex; align-items: center; }
.atp-stat.sv-default .atp-stat-icon { color: var(--text-secondary); }
.atp-stat.sv-green   .atp-stat-icon { color: var(--success); }
.atp-stat.sv-amber   .atp-stat-icon { color: var(--warning); }
.atp-stat.sv-purple  .atp-stat-icon { color: var(--purple); }
.atp-stat.sv-gray    .atp-stat-icon { color: var(--text-tertiary); }

.atp-stat-num {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
  font-weight: 700;
  min-height: 32px;
}
.atp-stat.sv-default .atp-stat-num { color: var(--text); }
.atp-stat.sv-green   .atp-stat-num { color: var(--success); }
.atp-stat.sv-amber   .atp-stat-num { color: var(--warning); }
.atp-stat.sv-purple  .atp-stat-num { color: var(--purple); }
.atp-stat.sv-gray    .atp-stat-num { color: var(--text-tertiary); }

.atp-stat-label {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-weight: 500;
}

/* ── Skeleton ── */
.atp-skel {
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 400% 100%;
  animation: atp-shimmer 1.4s ease infinite;
  border-radius: 6px;
}
.atp-skel-num  { height: 32px; width: 48px; margin-bottom: 6px; }
.atp-skel-av   { width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0; }
.atp-skel-name { height: 16px; width: 58%; }
.atp-skel-role { height: 11px; width: 35%; margin-top: 6px; }

/* ── Toolbar ── */
.atp-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.atp-search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.atp-search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
  display: flex;
}

.atp-search {
  background: rgba(15,21,33,0.82);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  padding: 9px 12px 9px 34px;
  font-family: inherit;
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}

.atp-search::placeholder { color: var(--text-tertiary); }
.atp-search:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0,102,255,0.08);
}

.atp-filter-grp {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.atp-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(15,21,33,0.82);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.atp-filter-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text);
}

.atp-filter-btn.active         { background: var(--primary);  border-color: var(--primary);  color: #fff; }
.atp-filter-btn.fv-green.active { background: var(--success);  border-color: var(--success); }
.atp-filter-btn.fv-amber.active { background: var(--warning);  border-color: var(--warning); }
.atp-filter-btn.fv-purple.active { background: var(--purple);  border-color: var(--purple); }
.atp-filter-btn.fv-gray.active  { background: var(--text-secondary); border-color: var(--text-secondary); }

.atp-filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  background: rgba(0,0,0,0.12);
  padding: 0 4px;
}

/* ── Grid ── */
.atp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

@media (max-width: 600px) { .atp-grid { grid-template-columns: 1fr; } }

/* ── Member Card ── */
.atp-card {
  background: rgba(15,21,33,0.82);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.25s;
  animation: atp-slideUp 0.35s ease both;
  position: relative;
  overflow: hidden;
}

.atp-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 3px;
  background: var(--card-accent, var(--primary));
}

.atp-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  border-color: var(--text-tertiary);
}

/* ── Card top ── */
.atp-card-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.atp-avatar {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: var(--av-bg, rgba(0,102,255,0.15));
  border: 1px solid var(--av-border, rgba(0,102,255,0.25));
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.atp-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 9px;
}

.atp-dot {
  position: absolute;
  bottom: -3px; right: -3px;
  width: 11px; height: 11px;
  border-radius: 50%;
  background: var(--dot-color, var(--text-tertiary));
  border: 2.5px solid var(--surface);
}

.atp-dot.is-responding { animation: atp-pulse 1.1s ease-in-out infinite; }

.atp-card-info { flex: 1; min-width: 0; }

.atp-card-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.atp-card-role {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: capitalize;
  margin-top: 3px;
}

.atp-role-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 4px;
  margin-top: 6px;
  background: var(--role-bg);
  border: 1px solid var(--role-border);
  color: var(--role-color);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.atp-unit-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 6px;
  background: var(--unit-bg);
  border: 1px solid var(--unit-border);
  color: var(--unit-color);
  letter-spacing: 0.3px;
}

.atp-status-pill {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

/* ── Contacts ── */
.atp-contacts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

.atp-contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.atp-contact-row a {
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  transition: color 0.15s;
}

.atp-contact-row a:hover { color: var(--primary); }

/* ── Expand button ── */
.atp-expand-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: rgba(8,12,20,0.93);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.atp-expand-btn:hover {
  background: rgba(15,21,33,0.82);
  border-color: var(--primary);
  color: var(--primary);
}

.atp-expand-btn svg { transition: transform 0.2s; }

/* ── Expanded detail ── */
.atp-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  animation: atp-expand 0.22s ease both;
}

.atp-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}

.atp-detail-row:last-child { border-bottom: none; }

.atp-detail-key {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 500;
  white-space: nowrap;
}

.atp-detail-val {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  text-align: right;
}

/* ── Card footer ── */
.atp-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  border-top: 1px solid var(--border);
  padding-top: 10px;
}

.atp-meta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-tertiary);
}

.atp-card-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.atp-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.07);
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.atp-action-btn:hover {
  color: var(--text);
  border-color: var(--text-secondary);
  background: rgba(8,12,20,0.93);
}

.atp-action-btn.chat:hover {
  color: #4A90D9;
  border-color: rgba(74,144,217,0.55);
  background: rgba(74,144,217,0.10);
}

.atp-action-btn.danger:hover {
  color: var(--danger);
  border-color: var(--danger);
  background: rgba(255,59,48,0.08);
}

/* ── Skeleton card ── */
.atp-skel-card {
  background: rgba(15,21,33,0.82);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-left: 3px solid var(--border);
}

/* ── Empty / Error ── */
.atp-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: rgba(15,21,33,0.82);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
}

.atp-empty-icon {
  color: var(--text-tertiary);
  opacity: 0.5;
}

.atp-empty-text {
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.atp-retry-btn {
  margin-top: 4px;
  padding: 8px 20px;
  background: rgba(8,12,20,0.93);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.atp-retry-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(15,21,33,0.82);
}

/* ── Spinner ── */
.atp-spinner {
  display: inline-block;
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  animation: atp-spin 0.7s linear infinite;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .atp-title  { font-size: 26px; }
  .atp-stats  { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .atp-stat-num { font-size: 24px; }
}
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function fmtDate(ts?: string) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function fmtRelative(ts?: string) {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 0)    return "just now";
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return fmtDate(ts);
}

// ── Last-seen display policy (never a blank dash) ──────────────────────────
// • On Duty / Responding → "Active Now" with a green indicator dot.
// • Off Duty + timestamp   → relative time ("2 hours ago" / "Aug 5, 2026").
// • Off Duty + no stamp    → joined-date baseline, else "No recent activity logged".
function lastSeenDisplay(m: { status?: string | null; last_seen?: string | null; joined_at?: string }): {
  text: string; active: boolean;
} {
  const status = (m.status ?? "off_duty").toLowerCase();
  if (status === "on_duty" || status === "responding") {
    return { text: "Active Now", active: true };
  }
  if (m.last_seen) return { text: fmtRelative(m.last_seen), active: false };
  if (m.joined_at) return { text: `Joined ${fmtDate(m.joined_at)}`, active: false };
  return { text: "No recent activity logged", active: false };
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="atp-skel-card">
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div className="atp-skel atp-skel-av" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="atp-skel atp-skel-name" />
          <div className="atp-skel atp-skel-role" />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div className="atp-skel" style={{ height: 12, width: "80%" }} />
        <div className="atp-skel" style={{ height: 12, width: "52%" }} />
      </div>
      <div style={{ height: 34, borderRadius: 8, background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

// ─── Member Card ─────────────────────────────────────────────────────────────

export function MemberCard({ member, index, onToggleDuty, onEdit, onChat, toggling }: {
  member: TeamMember; index: number;
  onToggleDuty: (m: TeamMember) => void;
  onEdit: (m: TeamMember) => void;
  onChat: (m: TeamMember) => void;
  toggling: boolean;
}) {
  // Defensive: a malformed row (null/undefined from the data layer) renders
  // nothing instead of throwing and unmounting the whole dashboard.
  // NOTE: hooks must stay above this guard — an early return before useState
  // breaks hook order across renders ("Rendered fewer hooks than expected").
  const [expanded, setExpanded] = useState(false);
  if (!member || typeof member !== "object") return null;

  const status     = member.status ?? "off_duty";
  const statusMeta = STATUS_META[status] ?? STATUS_META.off_duty;
  const unit       = member.unit ?? "HQ";
  const role       = member.role ?? "responder";
  const unitColor  = UNIT_COLORS[unit] ?? "#0066FF";
  const roleColor  = ROLE_COLORS[role] ?? "#0066FF";

  const avBg     = `${unitColor}18`;
  const avBorder = `${unitColor}35`;
  const roleBg   = `${roleColor}18`;
  const roleBorder = `${roleColor}35`;

  const displayName = member.full_name ?? "Unknown Member";
  const displayRole = member.role ?? "—";
  const seen = lastSeenDisplay(member);

  return (
    <div
      className="atp-card"
      style={{
        animationDelay: `${index * 0.04}s`,
        ["--card-accent" as any]: unitColor,
        ["--av-bg"       as any]: avBg,
        ["--av-border"   as any]: avBorder,
      }}
    >
      {/* ── Top row ── */}
      <div className="atp-card-top">
        <div
          className="atp-avatar"
          style={{
            ["--av-bg"     as any]: avBg,
            ["--av-border" as any]: avBorder,
            color: unitColor,
          }}
        >
          {member.avatar_url
            ? <img src={member.avatar_url} alt={displayName} className="atp-avatar-img" />
            : initials(member.full_name)
          }
          <span
            className={`atp-dot${status === "responding" ? " is-responding" : ""}`}
            style={{ ["--dot-color" as any]: statusMeta.color }}
          />
        </div>

        <div className="atp-card-info">
          <div className="atp-card-name">{displayName}</div>
          <div className="atp-card-role" style={{ textTransform: "capitalize" }}>{displayRole}</div>
          <div>
            <span
              className="atp-role-badge"
              style={{
                ["--role-bg"     as any]: roleBg,
                ["--role-border" as any]: roleBorder,
                ["--role-color"  as any]: roleColor,
              }}
            >
              <SvgIcon path={ICONS.badge} size={8} />
              {role}
            </span>
            <span
              className="atp-unit-tag"
              style={{
                ["--unit-bg"     as any]: avBg,
                ["--unit-border" as any]: avBorder,
                ["--unit-color"  as any]: unitColor,
              }}
            >
              <SvgIcon path={ICONS.shield} size={9} />
              {unit}
            </span>
          </div>
        </div>

        <span
          className="atp-status-pill"
          style={{
            color: statusMeta.color,
            background: statusMeta.bg,
            borderColor: statusMeta.border,
          }}
        >
          {statusMeta.label}
        </span>
      </div>

      {/* ── Contacts ── */}
      {(member.email || member.phone) && (
        <div className="atp-contacts">
          {member.email && (
            <div className="atp-contact-row">
              <SvgIcon path={ICONS.mail} size={12} />
              <a href={`mailto:${member.email}`}>{member.email}</a>
            </div>
          )}
          {member.phone && (
            <div className="atp-contact-row">
              <SvgIcon path={ICONS.phone} size={12} />
              <a href={`tel:${member.phone}`}>{member.phone}</a>
            </div>
          )}
        </div>
      )}

      {/* ── Expand toggle ── */}
      <button className="atp-expand-btn" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Hide details" : "View details"}
        <SvgIcon path={expanded ? ICONS.chevUp : ICONS.chevDown} size={12} />
      </button>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="atp-detail">
          {[
            { key: "Role",      val: displayRole,                       color: roleColor },
            { key: "Unit",      val: unit,                              color: unitColor },
            { key: "Status",    val: statusMeta.label,                  color: statusMeta.color },
          ].map(({ key, val, color }) => (
            <div key={key} className="atp-detail-row">
              <span className="atp-detail-key">{key}</span>
              <span className="atp-detail-val" style={color ? { color } : undefined}>{val}</span>
            </div>
          ))}
          <div className="atp-detail-row">
            <span className="atp-detail-key">Last seen</span>
            <span
              className="atp-detail-val"
              style={seen.active
                ? { color: "#00B074", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }
                : undefined}
            >
              {seen.active && (
                <span className="atp-dot is-responding" style={{ ["--dot-color" as any]: "#00B074" }} />
              )}
              {seen.text}
            </span>
          </div>
        </div>
      )}

      {/* ── Admin Actions ── */}
      <div className="atp-card-foot">
        <span className="atp-meta">
          <SvgIcon path={ICONS.clock} size={11} />
          Joined {fmtDate(member.joined_at)}
        </span>
        <div className="atp-card-actions">
          <button
            onClick={() => onChat(member)}
            className="atp-action-btn chat"
            title="Open Direct Chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button
            className="atp-action-btn"
            title={status === "on_duty" ? "Set off duty" : "Set on duty (Toggle Duty Status)"}
            onClick={() => onToggleDuty(member)}
            disabled={toggling}
          >
            <SvgIcon path={ICONS.activity} size={12} />
          </button>
          <button className="atp-action-btn" title="Edit contact" onClick={() => onEdit(member)}>
            <SvgIcon path={ICONS.settings} size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type FilterKey = "all" | "on_duty" | "responding" | "off_duty";

const FILTER_OPTS: Array<{ key: FilterKey; label: string; colorClass: string }> = [
  { key: "all",        label: "All",        colorClass: ""         },
  { key: "on_duty",    label: "On Duty",    colorClass: "fv-green" },
  { key: "responding", label: "Responding", colorClass: "fv-amber" },
  { key: "off_duty",   label: "Off Duty",   colorClass: "fv-gray"  },
];

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<FilterKey>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);  const [editPhone, setEditPhone] = useState("");
  const [editUnit,  setEditUnit]  = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<string | null>(null);

  // Open the side-chat drawer initialized with this responder selected.
  const openChat = (m: TeamMember) => {
    if (!m || !m.id) return;
    setChatTarget(m.id);
    setChatOpen(true);
  };

  const loadTeam = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, status, unit, avatar_url, phone, joined_at, last_seen")
        .in("role", ["responder", "admin", "commander"])
        .order("full_name", { ascending: true });

      if (err) throw err;
      setMembers(data ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load team.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
    const ch = supabase
      .channel("atp-team-presence")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadTeam)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const counts = {
    total:      members.length,
    on_duty:    members.filter((m) => m.status === "on_duty").length,
    responding: members.filter((m) => m.status === "responding").length,
    off_duty:   members.filter((m) => !m.status || m.status === "off_duty").length,
  };

  // ── Toggle Duty Status (persisted to profiles, optimistic UI) ──
  // Writes last_seen on every toggle so session tracking stays fresh and the
  // Last Seen fallback never has to render a blank dash.
  const toggleDuty = async (m: TeamMember) => {
    if (!m || !m.id) return;
    const next = m.status === "on_duty" ? "off_duty" : "on_duty";
    const stamped = new Date().toISOString();
    setTogglingId(m.id);
    setMembers(prev => prev.map(x => x.id === m.id ? { ...x, status: next, last_seen: stamped } : x));
    try {
      const { error: err } = await supabase.from("profiles").update({ status: next, last_seen: stamped }).eq("id", m.id);
      if (err) throw err;
    } catch (e: any) {
      setError("Duty toggle failed: " + (e?.message ?? "network error"));
      loadTeam();
    } finally {
      setTogglingId(null);
    }
  };

  // ── Edit Contact ──
  const openEdit = (m: TeamMember) => {
    setEditTarget(m);
    setEditPhone(m.phone ?? "");
    setEditUnit(m.unit ?? "");
    setFormError(null);
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    setSaving(true);
    setFormError(null);
    try {
      const { error: err } = await supabase.from("profiles")
        .update({ phone: editPhone.trim() || null, unit: editUnit.trim() || null })
        .eq("id", editTarget.id);
      if (err) throw err;
    } catch (e: any) {
      setFormError("Save failed: " + (e?.message ?? "network error"));
      setSaving(false);
      return;
    }
    setSaving(false);
    setEditTarget(null);
    loadTeam();
  };

  const visible = members.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (m.full_name ?? "").toLowerCase().includes(q) ||
      (m.email     ?? "").toLowerCase().includes(q) ||
      (m.unit      ?? "").toLowerCase().includes(q) ||
      (m.role      ?? "").toLowerCase().includes(q);

    const matchFilter =
      filter === "all" ||
      (filter === "off_duty"
        ? !m.status || m.status === "off_duty"
        : m.status === filter);

    return matchSearch && matchFilter;
  });

  const statCards = [
    { label: "Total Members", value: counts.total,      colorClass: "sv-default", icon: <SvgIcon path={ICONS.users}    size={18} /> },
    { label: "On Duty",       value: counts.on_duty,    colorClass: "sv-green",   icon: <SvgIcon path={ICONS.shield}   size={18} /> },
    { label: "Responding",    value: counts.responding, colorClass: "sv-amber",   icon: <SvgIcon path={ICONS.radio}    size={18} /> },
    { label: "Off Duty",      value: counts.off_duty,   colorClass: "sv-gray",    icon: <SvgIcon path={ICONS.activity} size={18} /> },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="atp-root">

        {/* ── Header ── */}
        <div className="atp-hd">
          <div>
            <div className="atp-eyebrow">Team Management</div>
            <div className="atp-title">Responders & Staff</div>
            <div className="atp-subtitle">Full roster with admin controls</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {loading && <div className="atp-spinner" />}
            <div className="atp-live">
              <span className="atp-live-dot" />
              LIVE ROSTER
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="atp-stats">
          {statCards.map((s) => (
            <div key={s.label} className={`atp-stat ${s.colorClass}`}>
              <div className="atp-stat-icon">{s.icon}</div>
              <div className="atp-stat-num">
                {loading
                  ? <div className="atp-skel atp-skel-num" />
                  : s.value
                }
              </div>
              <div className="atp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="atp-toolbar">
          <div className="atp-search-wrap">
            <span className="atp-search-icon">
              <SvgIcon path={ICONS.search} size={14} />
            </span>
            <input
              className="atp-search"
              placeholder="Search name, email, unit or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="atp-filter-grp">
            <SvgIcon path={ICONS.filter} size={13} />
            {FILTER_OPTS.map((f) => {
              const count = f.key === "all" ? counts.total : counts[f.key] ?? 0;
              return (
                <button
                  key={f.key}
                  className={`atp-filter-btn ${f.colorClass} ${filter === f.key ? "active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  {count > 0 && (
                    <span className="atp-filter-count">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="atp-grid">
          <TeamSectionBoundary label="team roster">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <div className="atp-empty">
              <div className="atp-empty-icon">
                <SvgIcon path={ICONS.activity} size={32} />
              </div>
              <div className="atp-empty-text">{error}</div>
              <button className="atp-retry-btn" onClick={loadTeam}>
                <SvgIcon path={ICONS.retry} size={13} />
                Retry
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="atp-empty">
              <div className="atp-empty-icon">
                <SvgIcon path={ICONS.users} size={36} />
              </div>
              <div className="atp-empty-text">
                {search
                  ? `No results for "${search}"`
                  : "No team members found"}
              </div>
            </div>
          ) : (
            visible.map((m, i) => {
              // Guard: skip malformed rows and always pass deferred handlers
              // (never invoke during render) so one bad record can't crash the grid.
              if (!m || typeof m !== "object" || !m.id) return null;
              return (
                <MemberCard
                  key={m.id}
                  member={m}
                  index={i}
                  onToggleDuty={() => toggleDuty(m)}
                  onEdit={() => openEdit(m)}
                  onChat={() => openChat(m)}
                  toggling={togglingId === m.id}
                />
              );
            })
          )}
          </TeamSectionBoundary>
        </div>

        {/* ── Edit Contact modal ── */}
        {editTarget && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => !saving && setEditTarget(null)}
          >
            <div
              style={{ width: "100%", maxWidth: 420, background: "#0f1623", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 22 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: "#eef0f7", marginBottom: 4 }}>Edit Contact</div>
              <div style={{ fontSize: 12, color: "rgba(238,240,247,0.55)", marginBottom: 14 }}>{editTarget.full_name ?? "Unknown Member"}</div>
              <label style={{ display: "block", fontSize: 11, color: "rgba(238,240,247,0.55)", marginBottom: 4 }}>Phone</label>
              <input
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                placeholder="+63 …"
                style={{ width: "100%", marginBottom: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "#eef0f7", fontSize: 13, outline: "none" }}
              />
              <label style={{ display: "block", fontSize: 11, color: "rgba(238,240,247,0.55)", marginBottom: 4 }}>Unit</label>
              <input
                value={editUnit}
                onChange={e => setEditUnit(e.target.value)}
                placeholder="HQ"
                style={{ width: "100%", marginBottom: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "#eef0f7", fontSize: 13, outline: "none" }}
              />
              {formError && <div style={{ color: "#FF3B30", fontSize: 11, marginBottom: 8 }}>{formError}</div>}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="atp-action-btn" disabled={saving} onClick={() => setEditTarget(null)}>Cancel</button>
                <button className="atp-action-btn" disabled={saving} onClick={saveEdit}>{saving ? "Saving…" : "Save Contact"}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Direct side chat bound to the selected responder ── */}
        <TeamSectionBoundary label="team chat">
          <AdminChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} targetId={chatTarget} />
        </TeamSectionBoundary>

      </div>
    </>
  );


}