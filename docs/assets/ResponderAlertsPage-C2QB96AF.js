import{am as n,an as g,ak as r}from"./index-CvhaT9ii.js";const A={danger:{label:"DANGER",colorVar:"var(--danger)",bgVar:"rgba(255,59,48,0.06)",borderVar:"var(--danger)"},warning:{label:"WARNING",colorVar:"var(--warning)",bgVar:"rgba(255,149,0,0.06)",borderVar:"var(--warning)"},info:{label:"INFO",colorVar:"var(--primary)",bgVar:"rgba(0,102,255,0.06)",borderVar:"var(--primary)"},success:{label:"SUCCESS",colorVar:"var(--success)",bgVar:"rgba(0,176,116,0.06)",borderVar:"var(--success)"}},s=({path:e,size:t=16})=>r.jsx("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",style:{display:"inline-block",verticalAlign:"middle",flexShrink:0},dangerouslySetInnerHTML:{__html:e}}),o={bell:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",warn:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17v.01",info:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8h.01M12 12v4",check:"M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4l-10 10.01-3-3.01",clock:"M12 2a10 10 0 1 0 10 10M12 6v6l4 2",broadcast:"M1 6l10.1 7.5L22 6M1 18h22M1 12h4M19 12h4",send:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",filter:"M22 3H2l8 9.46V19l4 2v-8.54L22 3z",checkAll:"M2 12l5 5L22 4M7 12l5 5 5-5"},D=`
.rap-root {
  --primary: #0066FF;
  --success: #00B074;
  --warning: #FF9500;
  --danger:  #FF3B30;
  --bg:      #0d1117;
  --surface: rgba(15,21,33,0.82);
  --border:  rgba(255,255,255,0.07);
  --text:    #eef0f7;
  --text-secondary: rgba(238,240,247,0.55);
  --text-tertiary:  rgba(238,240,247,0.28);
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
  background: rgba(8,12,20,0.93);
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
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.05) 75%);
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

/* ── Mark all read button ── */
.rap-mark-all {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.rap-mark-all:hover {
  border-color: var(--success);
  color: var(--success);
  background: rgba(0,176,116,0.06);
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
  cursor: pointer;
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

/* Unread card — slightly highlighted background */
.rap-card.unread { background: var(--surface); }
.rap-card.unread.cv-red    { background: rgba(255,59,48,0.03); }
.rap-card.unread.cv-amber  { background: rgba(255,149,0,0.03); }
.rap-card.unread.cv-blue   { background: rgba(0,102,255,0.03); }
.rap-card.unread.cv-green  { background: rgba(0,176,116,0.03); }

/* Read card — dimmed */
.rap-card.read { opacity: 0.6; }

.rap-card:hover {
  transform: translateY(-3px);
  opacity: 1 !important;
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

/* Unread dot */
.rap-unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--danger);
  flex-shrink: 0;
  margin-left: auto;
  align-self: center;
  animation: rap-pulse 2s ease infinite;
}

/* Read tick */
.rap-read-tick {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-tertiary);
  margin-left: auto;
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

.rap-field { display: flex; flex-direction: column; gap: 6px; }

.rap-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.rap-input {
  background: rgba(8,12,20,0.93);
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
  background: rgba(8,12,20,0.93);
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
  background: rgba(8,12,20,0.93);
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

.rap-spinner {
  display: inline-block;
  width: 13px; height: 13px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  animation: rap-spin 0.7s linear infinite;
}

@media (max-width: 768px) {
  .rap-title { font-size: 26px; }
  .rap-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .rap-stat-num { font-size: 24px; }
}
`,L="rap_read_alert_ids";function O(){try{const e=localStorage.getItem(L);return new Set(e?JSON.parse(e):[])}catch{return new Set}}function R(e){try{localStorage.setItem(L,JSON.stringify([...e]))}catch{}}function U(e){return e==="danger"?"red":e==="warning"?"amber":e==="success"?"green":"blue"}function Y(e){const t=Math.floor((Date.now()-new Date(e).getTime())/1e3);return t<60?`${t}s ago`:t<3600?`${Math.floor(t/60)}m ago`:t<86400?`${Math.floor(t/3600)}h ago`:new Date(e).toLocaleDateString()}function f({type:e,size:t=14}){return e==="info"?r.jsx(s,{path:o.info,size:t}):e==="success"?r.jsx(s,{path:o.check,size:t}):r.jsx(s,{path:o.warn,size:t})}function h(){return r.jsxs("div",{className:"rap-card-skeleton",children:[r.jsxs("div",{style:{display:"flex",gap:12,alignItems:"flex-start"},children:[r.jsx("div",{className:"rap-skel",style:{width:36,height:36,borderRadius:8,flexShrink:0}}),r.jsxs("div",{style:{flex:1},children:[r.jsx("div",{className:"rap-skel rap-skel-badge",style:{marginBottom:8}}),r.jsx("div",{className:"rap-skel rap-skel-title"})]})]}),r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6},children:[r.jsx("div",{className:"rap-skel rap-skel-line"}),r.jsx("div",{className:"rap-skel rap-skel-line",style:{width:"75%"}})]}),r.jsx("div",{style:{paddingTop:8,borderTop:"1px solid #E5E7EB"},children:r.jsx("div",{className:"rap-skel rap-skel-foot"})})]})}const P=[{value:"danger",label:"Danger",colorClass:"tv-red"},{value:"warning",label:"Warning",colorClass:"tv-amber"},{value:"info",label:"Info",colorClass:"tv-blue"},{value:"success",label:"Success",colorClass:"tv-green"}],W=[{value:"all",label:"All",colorClass:""},{value:"danger",label:"Danger",colorClass:"fv-red"},{value:"warning",label:"Warning",colorClass:"fv-amber"},{value:"info",label:"Info",colorClass:"fv-blue"},{value:"success",label:"Success",colorClass:"fv-green"}];function H(){const[e,t]=n.useState([]),[l,T]=n.useState(!0),[y,k]=n.useState(!1),[F,w]=n.useState(!1),[x,j]=n.useState(""),[b,N]=n.useState(""),[S,z]=n.useState("warning"),[d,_]=n.useState("all"),[p,C]=n.useState(O),E=a=>{if(p.has(a))return;const i=new Set([...p,a]);C(i),R(i)},V=()=>{const a=new Set([...p,...e.map(i=>String(i.id))]);C(a),R(a)},v=async()=>{try{const{data:a}=await g.from("alerts").select("*").order("created_at",{ascending:!1});t(a??[])}finally{T(!1)}};n.useEffect(()=>{v();const a=g.channel("responder-alerts-feed").on("postgres_changes",{event:"*",schema:"public",table:"alerts"},v).subscribe();return()=>{g.removeChannel(a)}},[]);const $=async()=>{if(!(!x.trim()||!b.trim())){k(!0);try{const{data:{user:a}}=await g.auth.getUser();await g.from("alerts").insert({title:x.trim(),message:b.trim(),type:S,created_by:a?.id??null,target_role:"citizen"}),j(""),N(""),z("warning"),w(!0),setTimeout(()=>w(!1),3500),await v()}finally{k(!1)}}},c={total:e.length,danger:e.filter(a=>a.type==="danger").length,warning:e.filter(a=>a.type==="warning").length,info:e.filter(a=>a.type==="info").length,success:e.filter(a=>a.type==="success").length},u=e.filter(a=>!p.has(String(a.id))).length,M=d==="all"?e:e.filter(a=>a.type===d),B=[{label:"Unread",value:l?null:u,colorClass:u>0?"sv-red":"sv-default",icon:r.jsx(s,{path:o.bell,size:18})},{label:"Danger",value:l?null:c.danger,colorClass:"sv-red",icon:r.jsx(s,{path:o.warn,size:18})},{label:"Warning",value:l?null:c.warning,colorClass:"sv-amber",icon:r.jsx(s,{path:o.warn,size:18})},{label:"Info",value:l?null:c.info,colorClass:"sv-blue",icon:r.jsx(s,{path:o.info,size:18})}];return r.jsxs(r.Fragment,{children:[r.jsx("style",{children:D}),r.jsxs("div",{className:"rap-root",children:[r.jsxs("div",{className:"rap-hd",children:[r.jsxs("div",{children:[r.jsx("div",{className:"rap-eyebrow",children:"Field Operations"}),r.jsx("div",{className:"rap-title",children:"Alerts"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[l&&r.jsx("div",{className:"rap-spinner",style:{borderTopColor:"var(--primary)",borderColor:"var(--border)"}}),r.jsxs("div",{className:"rap-live",children:[r.jsx("span",{className:"rap-live-dot"}),"LIVE"]})]})]}),r.jsx("div",{className:"rap-stats",children:B.map(a=>r.jsxs("div",{className:`rap-stat ${a.colorClass}`,children:[r.jsx("div",{className:"rap-stat-icon",children:a.icon}),r.jsx("div",{className:"rap-stat-num",children:a.value===null?r.jsx("div",{className:"rap-skel rap-skel-num"}):a.value}),r.jsx("div",{className:"rap-stat-label",children:a.label})]},a.label))}),r.jsxs("div",{className:"rap-layout",children:[r.jsxs("div",{children:[r.jsxs("div",{className:"rap-filter-bar",children:[r.jsx(s,{path:o.filter,size:13}),W.map(a=>{const i=a.value==="all"?c.total:c[a.value]??0;return r.jsxs("button",{className:`rap-filter-btn ${a.colorClass} ${d===a.value?"active":""}`,onClick:()=>_(a.value),children:[a.label,i>0&&r.jsx("span",{className:"rap-filter-count",children:i})]},a.value)}),u>0&&!l&&r.jsxs("button",{className:"rap-mark-all",onClick:V,children:[r.jsx(s,{path:o.checkAll,size:12}),"Mark all read (",u,")"]})]}),r.jsx("div",{className:"rap-list",children:l?r.jsxs(r.Fragment,{children:[r.jsx(h,{}),r.jsx(h,{}),r.jsx(h,{})]}):M.length===0?r.jsx("div",{className:"rap-empty",children:d==="all"?"No alerts yet":`No ${d} alerts`}):M.map(a=>{const i=A[a.type]??A.info,I=U(a.type),m=p.has(String(a.id));return r.jsxs("div",{className:`rap-card cv-${I} ${m?"read":"unread"}`,onClick:()=>E(String(a.id)),children:[r.jsxs("div",{className:"rap-card-top",children:[r.jsx("div",{className:"rap-card-icon",children:r.jsx(f,{type:a.type,size:16})}),r.jsxs("div",{className:"rap-card-body",children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",flexWrap:"wrap",gap:4,marginBottom:6},children:[r.jsxs("span",{className:`rap-badge bv-${I}`,children:[r.jsx(f,{type:a.type,size:9}),i.label]}),a.target_role&&r.jsxs("span",{className:"rap-card-target",children:["→ ",a.target_role.toUpperCase()]})]}),r.jsx("div",{className:"rap-card-title",children:a.title}),r.jsx("div",{className:"rap-card-msg",children:a.message})]}),m?r.jsx("span",{className:"rap-read-tick",title:"Read",children:r.jsx(s,{path:o.check,size:10})}):r.jsx("span",{className:"rap-unread-dot",title:"Unread"})]}),r.jsxs("div",{className:"rap-card-footer",children:[r.jsxs("span",{className:"rap-card-meta",children:[r.jsx(s,{path:o.clock,size:11}),Y(a.created_at)]}),m&&r.jsx("span",{className:"rap-card-meta",style:{marginLeft:"auto"},children:"Read"})]})]},String(a.id))})})]}),r.jsxs("div",{className:"rap-compose",children:[r.jsxs("div",{className:"rap-compose-hd",children:[r.jsx("div",{className:"rap-compose-icon",children:r.jsx(s,{path:o.broadcast,size:16})}),r.jsxs("div",{children:[r.jsx("div",{className:"rap-compose-title",children:"Broadcast Alert"}),r.jsx("div",{className:"rap-compose-sub",children:"Send to citizens"})]})]}),r.jsxs("div",{className:"rap-field",children:[r.jsx("span",{className:"rap-label",children:"Alert Type"}),r.jsx("div",{className:"rap-type-grid",children:P.map(a=>r.jsxs("div",{className:`rap-type-opt ${a.colorClass} ${S===a.value?"active":""}`,onClick:()=>z(a.value),children:[r.jsx(f,{type:a.value,size:13}),r.jsx("span",{children:a.label})]},a.value))})]}),r.jsxs("div",{className:"rap-field",children:[r.jsx("label",{className:"rap-label",children:"Title"}),r.jsx("input",{className:"rap-input",placeholder:"e.g. Road closed — Rizal Blvd",value:x,onChange:a=>j(a.target.value)})]}),r.jsxs("div",{className:"rap-field",children:[r.jsx("label",{className:"rap-label",children:"Message"}),r.jsx("textarea",{className:"rap-textarea",placeholder:"Describe the situation and any public safety instructions…",value:b,onChange:a=>N(a.target.value)})]}),F&&r.jsxs("div",{className:"rap-success",children:[r.jsx(s,{path:o.check,size:13}),"Alert broadcast successfully"]}),r.jsx("button",{className:"rap-send",disabled:!x.trim()||!b.trim()||y,onClick:$,children:y?r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"rap-spinner"})," Sending…"]}):r.jsxs(r.Fragment,{children:[r.jsx(s,{path:o.send,size:14})," Broadcast Alert"]})})]})]})]})]})}export{H as default};
