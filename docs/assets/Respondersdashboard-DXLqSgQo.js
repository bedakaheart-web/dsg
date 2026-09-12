import{aq as B,am as s,ag as F,an as l,ak as r,ah as O}from"./index-CvhaT9ii.js";import{T as Y}from"./TranslatedDescription-BzvG2PoB.js";import G from"./Dispatch-XYoRlhOL.js";import H from"./ResponderAlertsPage-C2QB96AF.js";import U from"./IncidentsPage-w_wK2anJ.js";import $ from"./ResponderTeam-Bib0_Dkd.js";const u={fire:{icon:"🔥",colorClass:"tc-fire"},accident:{icon:"🚗",colorClass:"tc-accident"},flood:{icon:"🌊",colorClass:"tc-flood"},crime:{icon:"🚨",colorClass:"tc-crime"},medical:{icon:"🏥",colorClass:"tc-medical"},other:{icon:"⚠️",colorClass:"tc-other"}},q={pending:{label:"PENDING",colorClass:"sc-pending"},"in-progress":{label:"IN PROGRESS",colorClass:"sc-progress"},resolved:{label:"RESOLVED",colorClass:"sc-resolved"}},P=[{id:"overview",label:"Overview",group:"Operations"},{id:"dispatch",label:"Dispatch",group:"Operations"},{id:"incidents",label:"Incidents",group:"Operations"},{id:"alerts",label:"Alerts",group:"Operations"},{id:"team",label:"Team",group:"Team"}],A=["fire","flood","medical","crime","accident","other"],m={radar:"M12 2a10 10 0 1 0 10 10M12 6a6 6 0 0 0 0 12M12 10a2 2 0 0 0 0 4M12 2v10",clipboard:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 2h8v4H8z",bell:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",gauge:"M12 2a10 10 0 1 0 10 10M12 12l4.5-4.5M12 12a1.5 1.5 0 0 1-1.5-1.5",menu:"M3 12h18M3 6h18M3 18h18",x:"M18 6L6 18M6 6l12 12",signOut:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"},V={overview:m.gauge,dispatch:m.radar,incidents:m.clipboard,alerts:m.bell,team:m.users},z=({path:c,size:i=16})=>r.jsx("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",dangerouslySetInnerHTML:{__html:c}}),W=`
:root {
  --primary:        #0066FF;
  --success:        #00B074;
  --warning:        #FF9500;
  --danger:         #FF3B30;
  --bg:             #0d1117;
  --surface:        rgba(15,21,33,0.82);
  --border:         rgba(255,255,255,0.07);
  --text:           #eef0f7;
  --text-secondary: rgba(238,240,247,0.55);
  --text-tertiary:  rgba(238,240,247,0.28);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes fadeIn  { from { opacity: 0; transform: translateY(8px);   } to { opacity: 1; transform: none; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
@keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes spin    { to { transform: rotate(360deg); } }

.rd-portal {
  position: fixed; inset: 0; z-index: 9000; overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text); background: var(--bg);
}

.rd-bg {
  position: absolute; inset: 0; z-index: 0;
  background-size: cover; background-position: center; background-repeat: no-repeat; pointer-events: none;
}
.rd-bg::after { content: ''; position: absolute; inset: 0; background: rgba(8,12,20,0.93); }

.rd-shell { display: flex; height: 100%; width: 100%; position: relative; z-index: 1; }

.rd-overlay { display: none; position: fixed; inset: 0; z-index: 190; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
.rd-overlay.open { display: block; }

/* ── Sidebar ── */
.rd-sidebar {
  width: 260px; flex-shrink: 0;
  background: var(--surface); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; height: 100%; overflow: hidden;
  transition: transform 0.3s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  position: absolute; left: 0; top: 0; z-index: 200;
}

.rd-logo {
  padding: 20px 16px; display: flex; align-items: center; gap: 12px;
  flex-shrink: 0; border-bottom: 1px solid var(--border);
}
.rd-logo-img  { width: 40px; height: 40px; object-fit: contain; border-radius: 8px; }
.rd-logo-name { font-size: 15px; font-weight: 700; color: var(--text); white-space: nowrap; }
.rd-logo-sub  { font-size: 11px; color: var(--text-tertiary); margin-top: 3px; display: flex; align-items: center; gap: 6px; }

.rd-pip { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--success); animation: pulse 2s ease infinite; flex-shrink: 0; }

.rd-sidebar-close {
  display: none; margin-left: auto; flex-shrink: 0;
  background: transparent; border: 1px solid var(--border); border-radius: 6px;
  width: 28px; height: 28px; align-items: center; justify-content: center;
  color: var(--text-tertiary); cursor: pointer; transition: all 0.2s;
}
.rd-sidebar-close:hover { background: var(--bg); color: var(--text); border-color: var(--text-secondary); }

.rd-nav-scroll { flex: 1; overflow-y: auto; padding: 8px 10px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }

.rd-nav-group {
  font-size: 11px; font-weight: 600; color: var(--text-tertiary);
  letter-spacing: 0.5px; text-transform: uppercase;
  padding: 12px 8px 6px; display: flex; align-items: center; gap: 8px;
}
.rd-nav-group::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.rd-nav-btn {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 10px 12px; border-radius: 8px; border: 1px solid transparent;
  font-size: 13px; font-weight: 500; color: var(--text-secondary);
  background: transparent; cursor: pointer; margin-bottom: 2px;
  text-align: left; transition: all 0.2s; position: relative;
}
.rd-nav-btn:hover        { background: var(--bg); color: var(--text); border-color: var(--border); }
.rd-nav-btn.active       { background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%); color: white; border-color: transparent; font-weight: 600; box-shadow: 0 2px 8px rgba(0,102,255,0.2); }
.rd-nav-btn.active.team-nav { background: linear-gradient(135deg, var(--success) 0%, #00945a 100%); box-shadow: 0 2px 8px rgba(0,176,116,0.2); }

.rd-nav-ic { font-size: 16px; flex-shrink: 0; color: var(--text-tertiary); transition: color 0.2s; display: flex; align-items: center; }
.rd-nav-btn.active .rd-nav-ic { color: white; }

.rd-badge      { margin-left: auto; background: var(--danger);  color: white; font-size: 10px; min-width: 20px; height: 20px; border-radius: 10px; padding: 0 6px; display: flex; align-items: center; justify-content: center; animation: pulse 2s ease infinite; font-weight: 600; }
.rd-badge-blue { margin-left: auto; background: var(--primary); color: white; font-size: 10px; min-width: 20px; height: 20px; border-radius: 10px; padding: 0 6px; display: flex; align-items: center; justify-content: center; font-weight: 600; }

.rd-sidebar-foot { padding: 12px 10px 16px; border-top: 1px solid var(--border); flex-shrink: 0; }

.rd-user-card { display: flex; align-items: center; gap: 10px; padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; }
.rd-avatar    { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 11px; color: white; }
.rd-user-name { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rd-user-role { font-size: 10px; color: var(--success); display: flex; align-items: center; gap: 5px; margin-top: 2px; }

.rd-logout-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.rd-logout-btn:hover { background: var(--danger); color: white; border-color: var(--danger); }

/* ── Main ── */
.rd-main { margin-left: 260px; flex: 1; display: flex; flex-direction: column; position: relative; z-index: 1; height: 100%; min-width: 0; overflow: hidden; background: transparent; }

.rd-topbar { height: 56px; display: flex; align-items: center; padding: 0 24px; background: var(--surface); border-bottom: 1px solid var(--border); position: relative; z-index: 100; gap: 12px; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }

.rd-hamburger { display: none; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; width: 32px; height: 32px; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.rd-hamburger:hover { background: var(--surface); border-color: var(--text-secondary); color: var(--text); }

.rd-crumb        { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-tertiary); }
.rd-crumb-sep    { color: var(--text-tertiary); }
.rd-crumb-active { color: var(--text); font-weight: 600; }

.rd-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

.rd-clock    { font-size: 12px; font-weight: 500; color: var(--text-secondary); background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 6px 12px; white-space: nowrap; }
.rd-icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border); background: transparent; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; font-size: 16px; transition: all 0.2s; position: relative; }
.rd-icon-btn:hover { background: var(--bg); color: var(--text); border-color: var(--text-secondary); }

.rd-notif-wrap { position: relative; }
.rd-notif-dot  { position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; border-radius: 50%; background: var(--danger); border: 1px solid var(--surface); animation: pulse 1.5s ease infinite; }

.rd-page { flex: 1; padding: 24px; overflow-y: auto; overflow-x: hidden; min-width: 0; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
.rd-page > div { animation: fadeIn 0.4s ease-out both; }

/* ── Overview ── */
.rd-ov-hd { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }

.rd-eyebrow { font-size: 11px; color: var(--primary); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.rd-eyebrow::before { content: ''; display: block; width: 20px; height: 2px; background: var(--primary); }

.rd-title { font-size: 32px; color: var(--text); letter-spacing: -0.5px; line-height: 1.1; font-weight: 700; }

.rd-live     { display: flex; align-items: center; gap: 6px; font-size: 11px; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--danger); background: rgba(255,59,48,0.06); color: var(--danger); letter-spacing: 0.3px; white-space: nowrap; font-weight: 600; }
.rd-live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--danger); animation: pulse 1.4s ease infinite; }

/* ── Stat Grid ── */
.rd-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }

.rd-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; transition: all 0.3s; cursor: default; animation: fadeIn 0.5s ease-out both; }
.rd-stat:nth-child(2) { animation-delay: 0.05s; }
.rd-stat:nth-child(3) { animation-delay: 0.10s; }
.rd-stat:nth-child(4) { animation-delay: 0.15s; }
.rd-stat:hover            { transform: translateY(-4px); border-color: var(--primary); box-shadow: 0 8px 16px rgba(0,102,255,0.1); }
.rd-stat.rd-stat-clickable { cursor: pointer; }
.rd-stat.rd-stat-clickable:hover { transform: translateY(-4px) scale(1.01); }
.rd-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }

.rd-stat-icon  { font-size: 20px; margin-bottom: 12px; opacity: 0.8; }
.rd-stat-num   { font-size: 32px; line-height: 1; margin-bottom: 6px; letter-spacing: -0.5px; font-weight: 700; }
.rd-stat-label { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; font-weight: 500; }
.rd-stat-tag   { position: absolute; top: 12px; right: 12px; font-size: 9px; border: 1px solid currentColor; border-radius: 4px; padding: 2px 6px; opacity: 0.5; }

.rd-stat.sv-red   ::before, .rd-stat.sv-red   .rd-stat-num, .rd-stat.sv-red   .rd-stat-icon, .rd-stat.sv-red   .rd-stat-tag { color: var(--danger);  }
.rd-stat.sv-amber .rd-stat-num, .rd-stat.sv-amber .rd-stat-icon, .rd-stat.sv-amber .rd-stat-tag { color: var(--warning); }
.rd-stat.sv-blue  .rd-stat-num, .rd-stat.sv-blue  .rd-stat-icon, .rd-stat.sv-blue  .rd-stat-tag { color: var(--primary); }
.rd-stat.sv-green .rd-stat-num, .rd-stat.sv-green .rd-stat-icon, .rd-stat.sv-green .rd-stat-tag { color: var(--success); }
.rd-stat.sv-red::before   { background: var(--danger);  }
.rd-stat.sv-amber::before { background: var(--warning); }
.rd-stat.sv-blue::before  { background: var(--primary); }
.rd-stat.sv-green::before { background: var(--success); }

/* ── Panels ── */
.rd-panels-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 1120px) { .rd-panels-row { grid-template-columns: 1fr; } }

.rd-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; min-width: 0; animation: slideIn 0.5s ease-out both; }
.rd-panel:nth-child(2) { animation-delay: 0.1s; }
.rd-panel.pa-red::before  { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--danger);  }
.rd-panel.pa-blue::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--primary); }

.rd-panel-hd    { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.rd-panel-title { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600; }
.rd-panel-tag   { font-size: 9px; color: var(--primary); border: 1px solid var(--primary); border-radius: 4px; padding: 3px 8px; background: rgba(0,102,255,0.05); font-weight: 600; }

/* ── Incident Items ── */
.rd-inc-item { padding: 14px 0; border-bottom: 1px solid var(--border); }
.rd-inc-item:last-child { border-bottom: none; padding-bottom: 0; }
.rd-inc-row  { display: flex; align-items: flex-start; gap: 12px; }

.rd-inc-icon { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 16px; }
.rd-inc-icon.tc-fire     { background: rgba(255, 59, 48,  0.08); }
.rd-inc-icon.tc-accident { background: rgba(255,149,  0,  0.08); }
.rd-inc-icon.tc-flood    { background: rgba(  0,102,255,  0.08); }
.rd-inc-icon.tc-crime    { background: rgba(255, 45, 85,  0.08); }
.rd-inc-icon.tc-medical  { background: rgba(  0,176,116,  0.08); }
.rd-inc-icon.tc-other    { background: rgba(155,155,155,  0.08); }

.rd-inc-body { flex: 1; min-width: 0; }
.rd-inc-type { font-size: 13px; font-weight: 700; text-transform: capitalize; display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.rd-inc-type.tc-fire     { color: var(--danger);  }
.rd-inc-type.tc-accident { color: var(--warning); }
.rd-inc-type.tc-flood    { color: var(--primary); }
.rd-inc-type.tc-crime    { color: #FF2D55;         }
.rd-inc-type.tc-medical  { color: var(--success); }
.rd-inc-type.tc-other    { color: #9B9B9B;         }

.rd-inc-loc   { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.rd-inc-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.rd-inc-time  { font-size: 10px; color: var(--text-tertiary); margin-top: 6px; }

.rd-pill     { font-size: 10px; padding: 4px 10px; border-radius: 6px; border: 1px solid; display: flex; align-items: center; gap: 5px; }
.rd-pill-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }
.rd-pill.sc-pending  { background: rgba(255,59, 48,0.08); color: var(--danger);  border-color: var(--danger);  }
.rd-pill.sc-progress { background: rgba(255,149, 0,0.08); color: var(--warning); border-color: var(--warning); }
.rd-pill.sc-resolved { background: rgba(  0,176,116,0.08); color: var(--success); border-color: var(--success); }
.rd-pill.sc-pending  .rd-pill-dot { background: var(--danger);  }
.rd-pill.sc-progress .rd-pill-dot { background: var(--warning); }
.rd-pill.sc-resolved .rd-pill-dot { background: var(--success); }
.rd-pill-neutral { background: var(--bg); color: var(--text-secondary); border-color: var(--border); }

/* ── Bar Chart ── */
.rd-bar-item  { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.rd-bar-item:last-child { margin-bottom: 0; }
.rd-bar-label { font-size: 12px; color: var(--text-secondary); width: 70px; flex-shrink: 0; display: flex; align-items: center; gap: 6px; font-weight: 500; }
.rd-bar-track { flex: 1; height: 5px; border-radius: 3px; background: var(--border); overflow: hidden; }
.rd-bar-fill  { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
.rd-bar-fill.tc-fire     { background: var(--danger);  }
.rd-bar-fill.tc-accident { background: var(--warning); }
.rd-bar-fill.tc-flood    { background: var(--primary); }
.rd-bar-fill.tc-crime    { background: #FF2D55;         }
.rd-bar-fill.tc-medical  { background: var(--success); }
.rd-bar-fill.tc-other    { background: #9B9B9B;         }
.rd-bar-val { font-size: 12px; color: var(--text-secondary); width: 20px; text-align: right; flex-shrink: 0; font-weight: 500; }

/* ── Quick Actions ── */
.rd-qgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
.rd-qbtn  { display: flex; align-items: center; gap: 8px; padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-align: left; transition: all 0.2s; }
.rd-qbtn:hover { color: var(--text); transform: translateY(-2px); border-color: var(--text-secondary); }
.rd-qbtn-ic { width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 1px solid var(--border); }
.rd-qbtn.qv-red   .rd-qbtn-ic { background: rgba(255, 59,48,0.08);  border-color: var(--danger);  color: var(--danger);  }
.rd-qbtn.qv-blue  .rd-qbtn-ic { background: rgba(  0,102,255,0.08); border-color: var(--primary); color: var(--primary); }
.rd-qbtn.qv-amber .rd-qbtn-ic { background: rgba(255,149, 0,0.08);  border-color: var(--warning); color: var(--warning); }
.rd-qbtn.qv-green .rd-qbtn-ic { background: rgba(  0,176,116,0.08); border-color: var(--success); color: var(--success); }

.rd-divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }

/* ── Utility ── */
.rd-spinner { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--primary); animation: spin 0.8s linear infinite; }
.rd-empty   { text-align: center; padding: 48px 24px; font-size: 12px; letter-spacing: 0.3px; color: var(--text-secondary); text-transform: uppercase; }

/* ── Modal ── */
.rd-modal-backdrop { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 24px; }
.rd-modal          { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 520px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 24px 48px rgba(0,0,0,0.2); animation: fadeIn 0.2s ease-out; }
.rd-modal-hd       { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.rd-modal-title    { font-size: 15px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }
.rd-modal-badge    { font-size: 11px; font-weight: 700; background: var(--primary); color: white; border-radius: 20px; padding: 2px 10px; }
.rd-modal-close    { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-tertiary); transition: all 0.2s; font-size: 16px; }
.rd-modal-close:hover { background: var(--bg); color: var(--text); }
.rd-modal-body     { flex: 1; overflow-y: auto; padding: 8px 20px 20px; scrollbar-width: thin; }
.rd-modal-item     { padding: 14px 0; border-bottom: 1px solid var(--border); }
.rd-modal-item:last-child { border-bottom: none; }
.rd-modal-row      { display: flex; align-items: flex-start; gap: 12px; }
.rd-modal-icon           { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid var(--border); }
.rd-modal-icon.tc-fire     { background: rgba(255, 59, 48,  0.08); }
.rd-modal-icon.tc-accident { background: rgba(255,149,  0,  0.08); }
.rd-modal-icon.tc-flood    { background: rgba(  0,102,255,  0.08); }
.rd-modal-icon.tc-crime    { background: rgba(255, 45, 85,  0.08); }
.rd-modal-icon.tc-medical  { background: rgba(  0,176,116,  0.08); }
.rd-modal-icon.tc-other    { background: rgba(155,155,155,  0.08); }
.rd-modal-info     { flex: 1; min-width: 0; }
.rd-modal-type     { font-size: 14px; font-weight: 700; text-transform: capitalize; margin-bottom: 3px; }
.rd-modal-loc      { font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; display: flex; align-items: center; gap: 4px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.rd-modal-desc     { font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rd-modal-meta     { display: flex; flex-direction: column; gap: 3px; margin-top: 4px; }
.rd-modal-reporter { font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; }
.rd-modal-time     { font-size: 11px; color: var(--text-tertiary); margin-top: 4px; }
.rd-modal-empty    { text-align: center; padding: 40px 20px; color: var(--text-secondary); font-size: 13px; }

.rd-resolve-btn {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 10px; padding: 7px 14px;
  background: rgba(0,176,116,0.08); color: var(--success);
  border: 1px solid var(--success); border-radius: 7px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.rd-resolve-btn:hover:not(:disabled) { background: var(--success); color: white; }
.rd-resolve-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .rd-sidebar { transform: translateX(-100%); width: min(260px, 90vw); box-shadow: 4px 0 12px rgba(0,0,0,0.1); }
  .rd-sidebar.open { transform: translateX(0); }
  .rd-sidebar-close { display: flex; }
  .rd-hamburger { display: flex; }
  .rd-main { margin-left: 0; background: var(--bg); }
  .rd-topbar { padding: 0 16px; }
  .rd-crumb-hide, .rd-clock { display: none; }
  .rd-page { padding: 16px; }
  .rd-title { font-size: 26px; }
  .rd-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .rd-stat-num { font-size: 24px; }
  .rd-qgrid { grid-template-columns: 1fr; }
}
`;function X(){const[c,i]=s.useState("");return s.useEffect(()=>{const o=()=>{const x=new Date,v=g=>String(g).padStart(2,"0");i(`${v(x.getHours())}:${v(x.getMinutes())}:${v(x.getSeconds())} PHT`)};o();const f=setInterval(o,1e3);return()=>clearInterval(f)},[]),c}function L(c){const i=Math.floor((Date.now()-new Date(c).getTime())/1e3);return i<60?`${i}s ago`:i<3600?`${Math.floor(i/60)}m ago`:i<86400?`${Math.floor(i/3600)}h ago`:new Date(c).toLocaleDateString()}function p(...c){return c.filter(Boolean).join(" ")}function Q({onNavigate:c,responderId:i}){const[o,f]=s.useState({assigned:0,pending:0,inProgress:0,resolved:0}),[x,v]=s.useState([]),[g,C]=s.useState([]),[y,w]=s.useState(!1),[_,E]=s.useState({}),[b,h]=s.useState(!0),[k,M]=s.useState(new Set),I=async e=>{const a=String(e);M(t=>new Set(t).add(a));try{const{error:t}=await l.from("reports").update({status:"resolved"}).eq("id",e);t&&console.error("Resolve error:",t.message)}finally{M(t=>{const n=new Set(t);return n.delete(a),n})}},j=s.useCallback(async()=>{if(!i){h(!1);return}try{const{data:e,error:a}=await l.from("reports").select("id,type,description,description_lang,description_translated,location,address,reporter_name,reporter_contact,status,evidence_url,created_at,responder_id").order("created_at",{ascending:!1});if(a){console.error("Overview loadData error:",a.message);return}const t=e??[],n=t.filter(d=>d.responder_id===i),S={};n.forEach(d=>{S[d.type]=(S[d.type]??0)+1}),f({assigned:n.length,pending:t.filter(d=>d.status==="pending"&&!d.responder_id).length,inProgress:n.filter(d=>d.status==="in-progress").length,resolved:n.filter(d=>d.status==="resolved").length}),v(n.slice(0,6)),C(n.filter(d=>d.status==="in-progress")),E(S)}finally{h(!1)}},[i]);s.useEffect(()=>{j();const e=l.channel("resp-overview").on("postgres_changes",{event:"*",schema:"public",table:"reports"},j).subscribe();return()=>{l.removeChannel(e)}},[j]);const N=Math.max(...A.map(e=>_[e]??0),1),R=[{label:"My Assignments",value:o.assigned,colorClass:"sv-red",tag:"TOTAL",icon:"🛡️",nav:"incidents",modal:!1},{label:"Unassigned",value:o.pending,colorClass:"sv-amber",tag:"OPEN",icon:"⚠️",nav:"incidents",modal:!1},{label:"In Progress",value:o.inProgress,colorClass:"sv-blue",tag:void 0,icon:"⏱️",nav:void 0,modal:!0},{label:"Resolved",value:o.resolved,colorClass:"sv-green",tag:void 0,icon:"✓",nav:"incidents",modal:!1}],T=[{id:"dispatch",label:"Dispatch",colorClass:"qv-red",icon:"📡"},{id:"incidents",label:"Incidents",colorClass:"qv-blue",icon:"📋"},{id:"alerts",label:"Alerts",colorClass:"qv-amber",icon:"🔔"},{id:"team",label:"Team",colorClass:"qv-green",icon:"👥"}];return r.jsxs("div",{children:[r.jsxs("div",{className:"rd-ov-hd",children:[r.jsxs("div",{children:[r.jsx("div",{className:"rd-eyebrow",children:"Responder Panel"}),r.jsx("div",{className:"rd-title",children:"Dashboard"})]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[b&&r.jsx("div",{className:"rd-spinner"}),r.jsxs("div",{className:"rd-live",children:[r.jsx("span",{className:"rd-live-dot"}),"LIVE"]})]})]}),r.jsx("div",{className:"rd-stat-grid",children:R.map(e=>r.jsxs("div",{className:p("rd-stat",e.colorClass,(e.modal||e.nav)&&"rd-stat-clickable"),onClick:()=>e.modal?w(!0):e.nav&&c(e.nav),children:[r.jsx("div",{className:"rd-stat-icon",children:e.icon}),r.jsx("div",{className:"rd-stat-num",children:b?"—":e.value}),r.jsx("div",{className:"rd-stat-label",children:e.label}),e.tag&&r.jsx("span",{className:"rd-stat-tag",children:e.tag})]},e.label))}),r.jsxs("div",{className:"rd-panels-row",children:[r.jsxs("div",{className:"rd-panel pa-red",style:{maxHeight:480,overflowY:"auto"},children:[r.jsxs("div",{className:"rd-panel-hd",children:[r.jsx("span",{className:"rd-panel-title",children:"My Assignments"}),r.jsx("span",{className:"rd-panel-tag",children:"ASSIGNED"})]}),b?r.jsx("div",{className:"rd-empty",children:r.jsx("div",{className:"rd-spinner",style:{margin:"0 auto"}})}):x.length===0?r.jsx("div",{className:"rd-empty",children:"NO ASSIGNMENTS"}):x.map(e=>{const a=u[e.type]??u.other,t=q[e.status]??q.pending;return r.jsx("div",{className:"rd-inc-item",children:r.jsxs("div",{className:"rd-inc-row",children:[r.jsx("div",{className:p("rd-inc-icon",a.colorClass),children:a.icon}),r.jsxs("div",{className:"rd-inc-body",children:[r.jsx("div",{className:p("rd-inc-type",a.colorClass),children:e.type}),r.jsxs("div",{className:"rd-inc-loc",children:["📍 ",e.address||e.location||"—"]}),r.jsxs("div",{className:"rd-inc-pills",children:[r.jsxs("span",{className:p("rd-pill",t.colorClass),children:[r.jsx("span",{className:"rd-pill-dot"}),t.label]}),e.reporter_name&&r.jsxs("span",{className:"rd-pill rd-pill-neutral",children:["👤 ",e.reporter_name]})]}),r.jsx("div",{className:"rd-inc-time",children:L(e.created_at)})]})]})},String(e.id))})]}),r.jsxs("div",{className:"rd-panel pa-blue",children:[r.jsxs("div",{className:"rd-panel-hd",children:[r.jsx("span",{className:"rd-panel-title",children:"Incident Breakdown"}),r.jsx("span",{className:"rd-panel-tag",children:"BY TYPE"})]}),A.map(e=>{const a=u[e]??u.other,t=_[e]??0;return r.jsxs("div",{className:"rd-bar-item",children:[r.jsxs("span",{className:"rd-bar-label",children:[r.jsx("span",{children:a.icon}),r.jsx("span",{style:{textTransform:"capitalize"},children:e})]}),r.jsx("div",{className:"rd-bar-track",children:r.jsx("div",{className:p("rd-bar-fill",a.colorClass),style:{width:`${t/N*100}%`}})}),r.jsx("span",{className:"rd-bar-val",children:t})]},e)}),r.jsx("hr",{className:"rd-divider"}),r.jsx("div",{className:"rd-panel-title",style:{marginBottom:12},children:"Quick Actions"}),r.jsx("div",{className:"rd-qgrid",children:T.map(e=>r.jsxs("button",{className:p("rd-qbtn",e.colorClass),onClick:()=>c(e.id),children:[r.jsx("span",{className:"rd-qbtn-ic",children:e.icon}),e.label]},e.id))})]})]}),y&&r.jsx("div",{className:"rd-modal-backdrop",onClick:()=>w(!1),children:r.jsxs("div",{className:"rd-modal",onClick:e=>e.stopPropagation(),children:[r.jsxs("div",{className:"rd-modal-hd",children:[r.jsxs("div",{className:"rd-modal-title",children:["⏱️ In Progress Incidents",r.jsx("span",{className:"rd-modal-badge",children:g.length})]}),r.jsx("button",{className:"rd-modal-close",onClick:()=>w(!1),children:"✕"})]}),r.jsx("div",{className:"rd-modal-body",children:g.length===0?r.jsx("div",{className:"rd-modal-empty",children:"No in-progress incidents"}):g.map(e=>{const a=u[e.type]??u.other;return r.jsx("div",{className:"rd-modal-item",children:r.jsxs("div",{className:"rd-modal-row",children:[r.jsx("div",{className:p("rd-modal-icon",a.colorClass),children:a.icon}),r.jsxs("div",{className:"rd-modal-info",children:[r.jsx("div",{className:p("rd-modal-type",a.colorClass),children:e.type}),r.jsxs("div",{className:"rd-modal-loc",children:["📍 ",e.address||e.location||"No location"]}),e.description&&r.jsx(Y,{description:e.description,descriptionLang:e.description_lang,descriptionTranslated:e.description_translated,className:"rd-modal-desc"}),r.jsxs("div",{className:"rd-modal-meta",children:[e.reporter_name&&r.jsxs("span",{className:"rd-modal-reporter",children:["👤 ",e.reporter_name]}),e.reporter_contact&&r.jsxs("span",{className:"rd-modal-reporter",children:["📞 ",e.reporter_contact]})]}),r.jsx("div",{className:"rd-modal-time",children:L(e.created_at)}),r.jsx("button",{className:"rd-resolve-btn",disabled:k.has(String(e.id)),onClick:()=>I(e.id),children:k.has(String(e.id))?r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"rd-spinner",style:{width:12,height:12,borderWidth:1.5}})," Resolving…"]}):r.jsx(r.Fragment,{children:"✓ Mark as Resolved"})})]})]})},String(e.id))})})]})})]})}const K={overview:"Overview",dispatch:"Dispatch",incidents:"Incidents",alerts:"Alerts",team:"Team"};function sr(){const c=B(),i=X(),[o,f]=s.useState("overview"),[x,v]=s.useState(0),[g,C]=s.useState(0),[y,w]=s.useState("Responder"),[_,E]=s.useState(""),[b,h]=s.useState(!1),[k,M]=s.useState(!1),I=F.useRef(localStorage.getItem("dsg_alerts_last_seen")??new Date(0).toISOString()),j=()=>{const a=new Date().toISOString();I.current=a,localStorage.setItem("dsg_alerts_last_seen",a),C(0)},N=a=>{f(a),h(!1),a==="alerts"&&j()};s.useEffect(()=>{const a=t=>{t.key==="Escape"&&h(!1)};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[]),s.useEffect(()=>(document.body.style.overflow=b?"hidden":"",()=>{document.body.style.overflow=""}),[b]),s.useEffect(()=>{const a=async()=>{try{const{data:{user:n}}=await l.auth.getUser();if(n){E(n.id),await l.from("profiles").update({status:"on_duty",is_online:!0}).eq("id",n.id);const{data:D}=await l.from("profiles").select("full_name").eq("id",n.id).single();D?.full_name&&w(D.full_name)}const{data:S}=await l.from("reports").select("id").eq("status","pending").is("responder_id",null);v((S??[]).length);const{data:d}=await l.from("alerts").select("id").gt("created_at",I.current).order("created_at",{ascending:!1}).limit(50);C((d??[]).length)}catch(n){console.error("Dashboard load error:",n)}finally{M(!0)}};a();const t=l.channel("resp-pending").on("postgres_changes",{event:"*",schema:"public",table:"reports"},a).on("postgres_changes",{event:"*",schema:"public",table:"alerts"},a).subscribe();return()=>{l.removeChannel(t)}},[]);const R=async()=>{try{const{data:{user:a}}=await l.auth.getUser();a&&await l.from("profiles").update({status:"off_duty",is_online:!1}).eq("id",a.id)}catch(a){console.error("Logout status update error:",a)}await l.auth.signOut(),c("/login",{replace:!0})},T=y?y.split(" ").map(a=>a[0]??"").join("").slice(0,2).toUpperCase():"?",e=[{label:"Operations",items:P.filter(a=>a.group==="Operations")},{label:"Team",items:P.filter(a=>a.group==="Team")}];return r.jsxs(r.Fragment,{children:[r.jsx("style",{children:W}),r.jsxs("div",{className:"rd-portal",children:[r.jsx("div",{className:"rd-bg",style:{backgroundImage:`url(${O})`}}),r.jsx("div",{className:p("rd-overlay",b&&"open"),onClick:()=>h(!1)}),r.jsxs("div",{className:"rd-shell",children:[r.jsxs("aside",{className:p("rd-sidebar",b&&"open"),"aria-label":"Navigation",children:[r.jsxs("div",{className:"rd-logo",children:[r.jsx("img",{src:O,alt:"DumaSafeGuide",className:"rd-logo-img"}),r.jsxs("div",{children:[r.jsx("div",{className:"rd-logo-name",children:"DumaSafeGuide"}),r.jsxs("div",{className:"rd-logo-sub",children:[r.jsx("span",{className:"rd-pip"}),"RESPONDER"]})]}),r.jsx("button",{className:"rd-sidebar-close",onClick:()=>h(!1),"aria-label":"Close sidebar",children:r.jsx(z,{path:m.x})})]}),r.jsx("nav",{className:"rd-nav-scroll",children:e.map(a=>r.jsxs("div",{children:[r.jsx("div",{className:"rd-nav-group",children:a.label}),a.items.map(t=>r.jsxs("button",{className:p("rd-nav-btn",o===t.id&&"active",t.id==="team"&&"team-nav"),onClick:()=>N(t.id),children:[r.jsx("span",{className:"rd-nav-ic",children:r.jsx(z,{path:V[t.id],size:16})}),r.jsx("span",{children:t.label}),t.id==="incidents"&&x>0&&r.jsx("span",{className:"rd-badge",children:x}),t.id==="alerts"&&g>0&&o!=="alerts"&&r.jsx("span",{className:"rd-badge-blue",children:g})]},t.id))]},a.label))}),r.jsxs("div",{className:"rd-sidebar-foot",children:[r.jsxs("div",{className:"rd-user-card",children:[r.jsx("div",{className:"rd-avatar",children:T}),r.jsxs("div",{style:{minWidth:0},children:[r.jsx("div",{className:"rd-user-name",children:y}),r.jsxs("div",{className:"rd-user-role",children:[r.jsx("span",{className:"rd-pip"}),"ON DUTY"]})]})]}),r.jsxs("button",{className:"rd-logout-btn",onClick:R,children:[r.jsx(z,{path:m.signOut})," Sign Out"]})]})]}),r.jsxs("div",{className:"rd-main",children:[r.jsxs("header",{className:"rd-topbar",children:[r.jsx("button",{className:"rd-hamburger",onClick:()=>h(!0),"aria-label":"Open navigation",children:r.jsx(z,{path:m.menu})}),r.jsxs("div",{className:"rd-crumb",children:[r.jsx("span",{className:"rd-crumb-hide",children:"DUMASAFEGUIDE"}),r.jsx("span",{className:"rd-crumb-sep rd-crumb-hide",children:"/"}),r.jsx("span",{className:"rd-crumb-hide",children:"RESPONDER"}),r.jsx("span",{className:"rd-crumb-sep rd-crumb-hide",children:"/"}),r.jsx("span",{className:"rd-crumb-active",children:K[o]})]}),r.jsxs("div",{className:"rd-topbar-right",children:[r.jsx("span",{className:"rd-clock",children:i}),r.jsxs("div",{className:"rd-notif-wrap",children:[r.jsx("button",{className:"rd-icon-btn",onClick:()=>N("alerts"),"aria-label":"Alerts",children:r.jsx(z,{path:m.bell})}),g>0&&o!=="alerts"&&r.jsx("span",{className:"rd-notif-dot"})]})]})]}),r.jsxs("main",{className:"rd-page",children:[o==="overview"&&!k&&r.jsx("div",{className:"rd-empty",children:r.jsx("div",{className:"rd-spinner",style:{margin:"0 auto"}})}),o==="overview"&&k&&r.jsx(Q,{onNavigate:N,responderId:_}),o==="dispatch"&&r.jsx(G,{}),o==="incidents"&&r.jsx(U,{}),o==="alerts"&&r.jsx(H,{}),o==="team"&&r.jsx($,{})]})]})]})]})]})}export{sr as default};
