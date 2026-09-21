import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import ResponderChatDrawer from "./components/ResponderChatDrawer";

// ΓöÇΓöÇΓöÇ Types ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

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

// ΓöÇΓöÇΓöÇ Constants ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

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

// ΓöÇΓöÇΓöÇ SVG Icons ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

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
  chat:     "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
};

// ΓöÇΓöÇΓöÇ Styles ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const STYLES = `
.rtp-root {
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

@keyframes rtp-fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes rtp-slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes rtp-pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes rtp-spin    { to { transform: rotate(360deg); } }
@keyframes rtp-shimmer { from { background-position: -400% 0; } to { background-position: 400% 0; } }
@keyframes rtp-expand  { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 300px; } }

.rtp-root, .rtp-root * { box-sizing: border-box; }
.rtp-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  background: transparent;
  min-height: 0;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* ΓöÇΓöÇ Header ΓöÇΓöÇ */
.rtp-hd {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  animation: rtp-fadeIn 0.4s ease both;
}

.rtp-eyebrow {
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

.rtp-eyebrow::before {
  content: '';
  display: block;
  width: 20px;
  height: 2px;
  background: var(--primary);
}

.rtp-title {
  font-size: 32px;
  color: var(--text);
  letter-spacing: -0.5px;
  line-height: 1.1;
  font-weight: 700;
}

.rtp-subtitle {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 4px;
}

.rtp-live {
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

.rtp-live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--success);
  animation: rtp-pulse 1.4s ease infinite;
}

/* ΓöÇΓöÇ Stat Grid ΓöÇΓöÇ */
.rtp-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.rtp-stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  animation: rtp-fadeIn 0.5s ease both;
  cursor: default;
}

.rtp-stat:nth-child(2) { animation-delay: 0.05s; }
.rtp-stat:nth-child(3) { animation-delay: 0.10s; }
.rtp-stat:nth-child(4) { animation-delay: 0.15s; }

.rtp-stat:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 8px 16px rgba(0,102,255,0.10);
}

.rtp-stat::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
}

.rtp-stat.sv-default::before { background: var(--text-secondary); }
.rtp-stat.sv-green::before   { background: var(--success); }
.rtp-stat.sv-amber::before   { background: var(--warning); }
.rtp-stat.sv-gray::before    { background: var(--text-tertiary); }

.rtp-stat-icon { font-size: 20px; margin-bottom: 12px; display: flex; align-items: center; }
.rtp-stat.sv-default .rtp-stat-icon { color: var(--text-secondary); }
.rtp-stat.sv-green   .rtp-stat-icon { color: var(--success); }
.rtp-stat.sv-amber   .rtp-stat-icon { color: var(--warning); }
.rtp-stat.sv-gray    .rtp-stat-icon { color: var(--text-tertiary); }

.rtp-stat-num {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
  font-weight: 700;
  min-height: 32px;
}
.rtp-stat.sv-default .rtp-stat-num { color: var(--text); }
.rtp-stat.sv-green   .rtp-stat-num { color: var(--success); }
.rtp-stat.sv-amber   .rtp-stat-num { color: var(--warning); }
.rtp-stat.sv-gray    .rtp-stat-num { color: var(--text-tertiary); }

.rtp-stat-label {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-weight: 500;
}

/* ΓöÇΓöÇ Skeleton ΓöÇΓöÇ */
.rtp-skel {
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 400% 100%;
  animation: rtp-shimmer 1.4s ease infinite;
  border-radius: 6px;
}
.rtp-skel-num  { height: 32px; width: 48px; margin-bottom: 6px; }
.rtp-skel-av   { width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0; }
.rtp-skel-name { height: 16px; width: 58%; }
.rtp-skel-role { height: 11px; width: 35%; margin-top: 6px; }
.rtp-skel-line { height: 12px; width: 80%; }
.rtp-skel-lsm  { height: 12px; width: 52%; }

/* ΓöÇΓöÇ Toolbar ΓöÇΓöÇ */
.rtp-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.rtp-search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.rtp-search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
  display: flex;
}

.rtp-search {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px 9px 34px;
  font-family: inherit;
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}

.rtp-search::placeholder { color: var(--text-tertiary); }
.rtp-search:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0,102,255,0.08);
}

.rtp-filter-grp {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.rtp-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.rtp-filter-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text);
}

.rtp-filter-btn.active         { background: var(--primary);  border-color: var(--primary);  color: #fff; }
.rtp-filter-btn.fv-green.active { background: var(--success);  border-color: var(--success); }
.rtp-filter-btn.fv-amber.active { background: var(--warning);  border-color: var(--warning); }
.rtp-filter-btn.fv-gray.active  { background: var(--text-secondary); border-color: var(--text-secondary); }

.rtp-filter-count {
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

/* ΓöÇΓöÇ Grid ΓöÇΓöÇ */
.rtp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

@media (max-width: 600px) { .rtp-grid { grid-template-columns: 1fr; } }

/* ΓöÇΓöÇ Member Card ΓöÇΓöÇ */
.rtp-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.25s;
  animation: rtp-slideUp 0.35s ease both;
  position: relative;
  overflow: hidden;
}

.rtp-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 3px;
  background: var(--card-accent, var(--primary));
}

.rtp-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  border-color: var(--text-tertiary);
}

/* ΓöÇΓöÇ Card top ΓöÇΓöÇ */
.rtp-card-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.rtp-avatar {
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

.rtp-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 9px;
}

.rtp-dot {
  position: absolute;
  bottom: -3px; right: -3px;
  width: 11px; height: 11px;
  border-radius: 50%;
  background: var(--dot-color, var(--text-tertiary));
  border: 2.5px solid var(--surface);
}

.rtp-dot.is-responding { animation: rtp-pulse 1.1s ease-in-out infinite; }

.rtp-card-info { flex: 1; min-width: 0; }

.rtp-card-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rtp-card-role {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: capitalize;
  margin-top: 3px;
}

.rtp-unit-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  margin-top: 6px;
  background: var(--unit-bg);
  border: 1px solid var(--unit-border);
  color: var(--unit-color);
  letter-spacing: 0.3px;
}

.rtp-status-pill {
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

/* ΓöÇΓöÇ Contacts ΓöÇΓöÇ */
.rtp-contacts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

.rtp-contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.rtp-contact-row a {
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  transition: color 0.15s;
}

.rtp-contact-row a:hover { color: var(--primary); }

/* ΓöÇΓöÇ Expand button ΓöÇΓöÇ */
.rtp-expand-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: rgba(8,12,20,0.93);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.rtp-expand-btn:hover {
  background: var(--surface);
  border-color: var(--primary);
  color: var(--primary);
}

.rtp-expand-btn svg { transition: transform 0.2s; }

/* ΓöÇΓöÇ Expanded detail ΓöÇΓöÇ */
.rtp-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  animation: rtp-expand 0.22s ease both;
}

.rtp-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}

.rtp-detail-row:last-child { border-bottom: none; }

.rtp-detail-key {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 500;
  white-space: nowrap;
}

.rtp-detail-val {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  text-align: right;
}

/* ΓöÇΓöÇ Card footer ΓöÇΓöÇ */
.rtp-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  border-top: 1px solid var(--border);
  padding-top: 10px;
}

.rtp-meta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-tertiary);
}

/* ΓöÇΓöÇ Skeleton card ΓöÇΓöÇ */
.rtp-skel-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-left: 3px solid var(--border);
}

/* ΓöÇΓöÇ Empty / Error ΓöÇΓöÇ */
.rtp-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.rtp-empty-icon {
  color: var(--text-tertiary);
  opacity: 0.5;
}

.rtp-empty-text {
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.rtp-retry-btn {
  margin-top: 4px;
  padding: 8px 20px;
  background: rgba(8,12,20,0.93);
  border: 1px solid var(--border);
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

.rtp-retry-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--surface);
}

/* ΓöÇΓöÇ Spinner ΓöÇΓöÇ */
.rtp-spinner {
  display: inline-block;
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  animation: rtp-spin 0.7s linear infinite;
}

/* ΓöÇΓöÇ Responsive ΓöÇΓöÇ */
@media (max-width: 768px) {
  .rtp-title  { font-size: 26px; }
  .rtp-stats  { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .rtp-stat-num { font-size: 24px; }
}
`;

// ΓöÇΓöÇΓöÇ Helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

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
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return fmtDate(ts);
}

// ΓöÇΓöÇΓöÇ Skeleton Card ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function SkeletonCard() {
  return (
    <div className="rtp-skel-card">
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div className="rtp-skel rtp-skel-av" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="rtp-skel rtp-skel-name" />
          <div className="rtp-skel rtp-skel-role" />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div className="rtp-skel rtp-skel-line" />
        <div className="rtp-skel rtp-skel-lsm" />
      </div>
      <div style={{ height: 34, borderRadius: 8, background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

// ΓöÇΓöÇΓöÇ Member Card ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

function MemberCard({ member, index, onChat }: {
  member: TeamMember; index: number; onChat: (m: TeamMember) => void;
}) {
  // Hooks first ΓÇö the null guard below must never precede hook calls.
  const [expanded, setExpanded] = useState(false);
  if (!member || typeof member !== "object") return null;

  const status     = member.status ?? "off_duty";
  const statusMeta = STATUS_META[status] ?? STATUS_META.off_duty;
  const unit       = member.unit ?? "HQ";
  const unitColor  = UNIT_COLORS[unit] ?? "#0066FF";

  const avBg     = `${unitColor}18`;
  const avBorder = `${unitColor}35`;

  const displayName = member.full_name ?? "Unknown Member";
  const displayRole = member.role ?? "—";

  return (
    <div
      className="rtp-card"
      style={{
        animationDelay: `${index * 0.04}s`,
        ["--card-accent" as any]: unitColor,
        ["--av-bg"       as any]: avBg,
        ["--av-border"   as any]: avBorder,
      }}
    >
      {/* ΓöÇΓöÇ Top row ΓöÇΓöÇ */}
      <div className="rtp-card-top">
        <div
          className="rtp-avatar"
          style={{
            ["--av-bg"     as any]: avBg,
            ["--av-border" as any]: avBorder,
            color: unitColor,
          }}
        >
          {member.avatar_url
            ? <img src={member.avatar_url} alt={displayName} className="rtp-avatar-img" />
            : initials(member.full_name)
          }
          <span
            className={`rtp-dot${status === "responding" ? " is-responding" : ""}`}
            style={{ ["--dot-color" as any]: statusMeta.color }}
          />
        </div>

        <div className="rtp-card-info">
          <div className="rtp-card-name">{displayName}</div>
          <div className="rtp-card-role" style={{ textTransform: "capitalize" }}>{displayRole}</div>
          <div
            className="rtp-unit-tag"
            style={{
              ["--unit-bg"     as any]: avBg,
              ["--unit-border" as any]: avBorder,
              ["--unit-color"  as any]: unitColor,
            }}
          >
            <SvgIcon path={ICONS.shield} size={9} />
            {unit} Unit
          </div>
        </div>

        <span
          className="rtp-status-pill"
          style={{
            color: statusMeta.color,
            background: statusMeta.bg,
            borderColor: statusMeta.border,
          }}
        >
          {statusMeta.label}
        </span>
      </div>

      {/* ΓöÇΓöÇ Contacts ΓöÇΓöÇ */}
      {(member.email || member.phone) && (
        <div className="rtp-contacts">
          {member.email && (
            <div className="rtp-contact-row">
              <SvgIcon path={ICONS.mail} size={12} />
              <a href={`mailto:${member.email}`}>{member.email}</a>
            </div>
          )}
          {member.phone && (
            <div className="rtp-contact-row">
              <SvgIcon path={ICONS.phone} size={12} />
              <a href={`tel:${member.phone}`}>{member.phone}</a>
            </div>
          )}
        </div>
      )}

      {/* ΓöÇΓöÇ Expand toggle ΓöÇΓöÇ */}
      <button className="rtp-expand-btn" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Hide details" : "View details"}
        <SvgIcon path={expanded ? ICONS.chevUp : ICONS.chevDown} size={12} />
      </button>

      {/* ΓöÇΓöÇ Expanded detail ΓöÇΓöÇ */}
      {expanded && (
        <div className="rtp-detail">
          {[
            { key: "Role",      val: displayRole,                       color: undefined },
            { key: "Unit",      val: unit,                              color: unitColor },
            { key: "Status",    val: statusMeta.label,                  color: statusMeta.color },
            { key: "Last seen", val: fmtRelative(member.last_seen),    color: undefined },
          ].map(({ key, val, color }) => (
            <div key={key} className="rtp-detail-row">
              <span className="rtp-detail-key">{key}</span>
              <span className="rtp-detail-val" style={color ? { color } : undefined}>{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* ΓöÇΓöÇ Footer ΓöÇΓöÇ */}
      <div className="rtp-card-foot">
        <span className="rtp-meta">
          <SvgIcon path={ICONS.clock} size={11} />
          Joined {fmtDate(member.joined_at)}
        </span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button
            title={`Chat with ${member.full_name ?? "teammate"}`}
            aria-label={`Chat with ${member.full_name ?? "teammate"}`}
            onClick={() => onChat(member)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 26, height: 26, borderRadius: 7, cursor: "pointer",
              border: "1px solid rgba(46,204,143,0.4)", background: "rgba(46,204,143,0.10)",
              color: "#2ECC8F", transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(46,204,143,0.22)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(46,204,143,0.10)"; }}
          >
            <SvgIcon path={ICONS.chat} size={13} />
          </button>
        </span>
      </div>
    </div>
  );
}

// ΓöÇΓöÇΓöÇ Main Component ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

type FilterKey = "all" | "on_duty" | "responding" | "off_duty";

const FILTER_OPTS: Array<{ key: FilterKey; label: string; colorClass: string }> = [
  { key: "all",        label: "All",        colorClass: ""         },
  { key: "on_duty",    label: "On Duty",    colorClass: "fv-green" },
  { key: "responding", label: "Responding", colorClass: "fv-amber" },
  { key: "off_duty",   label: "Off Duty",   colorClass: "fv-gray"  },
];

export default function ResponderTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<FilterKey>("all");
  const [meId,    setMeId]    = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<{ id: string; name: string } | null>(null);

  // Open the side-chat drawer initialized with this teammate selected.
  const openChat = (m: TeamMember) => {
    if (!m || !m.id) return;
    // Never open a thread with yourself ΓÇö fall back to the HQ list instead.
    if (m.id !== meId) setChatTarget({ id: m.id, name: m.full_name ?? "Teammate" });
    else setChatTarget(null);
    setChatOpen(true);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setMeId(data.user.id);
    });
  }, []);

  const loadTeam = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, status, unit, avatar_url, phone, joined_at, last_seen")
        .in("role", ["responder", "admin"])
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
      .channel("rtp-team-presence")
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
      <div className="rtp-root">

        {/* ΓöÇΓöÇ Header ΓöÇΓöÇ */}
        <div className="rtp-hd">
          <div>
            <div className="rtp-eyebrow">Field Operations</div>
            <div className="rtp-title">Team</div>
            <div className="rtp-subtitle">Responder roster &amp; live status</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {loading && <div className="rtp-spinner" />}
            <div className="rtp-live">
              <span className="rtp-live-dot" />
              LIVE ROSTER
            </div>
          </div>
        </div>

        {/* ΓöÇΓöÇ Stats ΓöÇΓöÇ */}
        <div className="rtp-stats">
          {statCards.map((s) => (
            <div key={s.label} className={`rtp-stat ${s.colorClass}`}>
              <div className="rtp-stat-icon">{s.icon}</div>
              <div className="rtp-stat-num">
                {loading
                  ? <div className="rtp-skel rtp-skel-num" />
                  : s.value
                }
              </div>
              <div className="rtp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ΓöÇΓöÇ Toolbar ΓöÇΓöÇ */}
        <div className="rtp-toolbar">
          <div className="rtp-search-wrap">
            <span className="rtp-search-icon">
              <SvgIcon path={ICONS.search} size={14} />
            </span>
            <input
              className="rtp-search"
              placeholder="Search name, email, unit or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="rtp-filter-grp">
            <SvgIcon path={ICONS.filter} size={13} />
            {FILTER_OPTS.map((f) => {
              const count = f.key === "all" ? counts.total : counts[f.key] ?? 0;
              return (
                <button
                  key={f.key}
                  className={`rtp-filter-btn ${f.colorClass} ${filter === f.key ? "active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  {count > 0 && (
                    <span className="rtp-filter-count">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ΓöÇΓöÇ Grid ΓöÇΓöÇ */}
        <div className="rtp-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <div className="rtp-empty">
              <div className="rtp-empty-icon">
                <SvgIcon path={ICONS.activity} size={32} />
              </div>
              <div className="rtp-empty-text">{error}</div>
              <button className="rtp-retry-btn" onClick={loadTeam}>
                <SvgIcon path={ICONS.retry} size={13} />
                Retry
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="rtp-empty">
              <div className="rtp-empty-icon">
                <SvgIcon path={ICONS.users} size={36} />
              </div>
              <div className="rtp-empty-text">
                {search
                  ? `No results for "${search}"`
                  : "No team members found"}
              </div>
            </div>
          ) : (
            visible.map((m, i) => {
              if (!m || typeof m !== "object" || !m.id) return null;
              return <MemberCard key={m.id} member={m} index={i} onChat={() => openChat(m)} />;
            })
          )}
        </div>

        {/* ΓöÇΓöÇ Direct side chat bound to the selected teammate ΓöÇΓöÇ */}
        {meId && (
          <ResponderChatDrawer
            responderId={meId}
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            targetId={chatTarget?.id ?? null}
            targetName={chatTarget?.name ?? null}
          />
        )}

      </div>
    </>
  );
}
