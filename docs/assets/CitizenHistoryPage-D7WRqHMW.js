import{ao as E,aq as B,ar as A,am as n,an as N,ak as e,A as S,r as U,Y as H,k as O,d as Y,J as G,ae as M,m as X,a as J,a8 as V,p as q}from"./index-CvhaT9ii.js";import{p as K}from"./pagesbackground-CfzHpFCG.js";function R(t){try{const i=localStorage.getItem(`read_reports_${t}`);return i?new Set(JSON.parse(i)):new Set}catch{return new Set}}function W(t,i){try{const d=R(t);d.add(i),localStorage.setItem(`read_reports_${t}`,JSON.stringify([...d]))}catch{}}const F={fire:{icon:"🔥",color:"#FF6B6B"},accident:{icon:"🚗",color:"#FFD166"},flood:{icon:"🌊",color:"#7B9EFF"},crime:{icon:"🚨",color:"#FF9F43"},medical:{icon:"🏥",color:"#2ECC8F"},other:{icon:"⚠️",color:"#8fa3be"}},y={pending:{label:"PENDING",color:"#FFD166",bg:"rgba(255,209,102,.12)",border:"rgba(255,209,102,.3)"},"in-progress":{label:"IN PROGRESS",color:"#7B9EFF",bg:"rgba(123,158,255,.12)",border:"rgba(123,158,255,.3)"},resolved:{label:"RESOLVED",color:"#2ECC8F",bg:"rgba(46,204,143,.12)",border:"rgba(46,204,143,.3)"}},w={forwarded:{label:"Forwarded to Department",icon:"↗",color:"#7B9EFF",bg:"rgba(123,158,255,.12)"},"follow-up":{label:"Resolved — Needs Follow-Up",icon:"⟳",color:"#FFD166",bg:"rgba(255,209,102,.12)"},"fully-resolved":{label:"Fully Resolved",icon:"✓",color:"#2ECC8F",bg:"rgba(46,204,143,.12)"}},Q=`
@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap');

:root {
  --bg: #080c14; --surface: #0f1521; --surface-2: #161d2e;
  --border: rgba(255,255,255,0.06); --border-2: rgba(255,255,255,0.10);
  --text: #eef0f7; --text-2: rgba(238,240,247,0.55); --text-3: rgba(238,240,247,0.25);
  --green: #2ECC8F; --red: #FF6B6B; --blue: #7B9EFF; --yellow: #FFD166;
  --font-display: 'Cabinet Grotesk', sans-serif;
  --font-body: 'Instrument Sans', sans-serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@keyframes fadeIn  { from { opacity: 0; transform: translateY(8px);   } to { opacity: 1; transform: none; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
@keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes spin    { to { transform: rotate(360deg); } }

.ch-portal {
  position: relative; min-height: 100vh; z-index: 0; overflow: hidden;
  font-family: var(--font-body); color: var(--text); background: var(--bg);
  background-image: url('${K}');
  background-size: cover; background-position: center;
  background-attachment: fixed; background-repeat: no-repeat;
}
.ch-portal::before {
  content: ''; position: fixed; inset: 0;
  background: linear-gradient(160deg, rgba(8,12,20,.92) 0%, rgba(8,12,20,.80) 50%, rgba(8,12,20,.94) 100%);
  pointer-events: none; z-index: 1;
}
.ch-shell { display: flex; height: 100%; width: 100%; position: relative; z-index: 2; }
.ch-overlay { display: none; position: fixed; inset: 0; z-index: 190; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
.ch-overlay.open { display: block; }

.ch-sidebar {
  width: 260px; flex-shrink: 0; background: rgba(15,21,33,.82); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; height: 100%; position: fixed; left: 0; top: 0; z-index: 200;
  overflow: hidden; transition: transform 0.3s ease; backdrop-filter: blur(16px);
}
.ch-logo { padding: 20px 16px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; border-bottom: 1px solid var(--border); }
.ch-logo-img  { width: 40px; height: 40px; object-fit: contain; border-radius: 8px; }
.ch-logo-name { font-size: 15px; font-weight: 700; color: var(--text); white-space: nowrap; font-family: var(--font-display); }
.ch-logo-sub  { font-size: 11px; color: var(--text-3); margin-top: 3px; display: flex; align-items: center; gap: 6px; }
.ch-pip { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: pulse 2s ease infinite; flex-shrink: 0; box-shadow: 0 0 6px var(--green); }
.ch-sidebar-close { display: none; margin-left: auto; flex-shrink: 0; background: transparent; border: 1px solid var(--border); border-radius: 6px; width: 28px; height: 28px; align-items: center; justify-content: center; color: var(--text-3); cursor: pointer; transition: all 0.2s; }
.ch-sidebar-close:hover { background: var(--surface-2); color: var(--text); }
.ch-nav-scroll { flex: 1; overflow-y: auto; padding: 8px 10px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
.ch-nav-label { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: var(--text-3); letter-spacing: 0.5px; text-transform: uppercase; padding: 12px 8px 6px; }
.ch-nav-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.ch-nav-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid transparent; font-size: 13px; font-weight: 500; color: var(--text-2); background: transparent; cursor: pointer; margin-bottom: 2px; text-align: left; transition: all 0.2s; text-decoration: none; }
.ch-nav-btn:hover  { background: rgba(46,204,143,.08); color: var(--text); border-color: var(--border); }
.ch-nav-btn.active { background: linear-gradient(135deg, var(--green) 0%, #24a97a 100%); color: #080c14; border-color: transparent; font-weight: 600; box-shadow: 0 2px 8px rgba(46,204,143,.3); }
.ch-nav-ic { font-size: 15px; flex-shrink: 0; color: var(--text-3); display: flex; align-items: center; transition: color 0.2s; }
.ch-nav-btn.active .ch-nav-ic { color: #080c14; }
.ch-badge { margin-left: auto; background: var(--red); color: white; font-size: 10px; min-width: 20px; height: 20px; border-radius: 10px; padding: 0 6px; display: flex; align-items: center; justify-content: center; font-weight: 600; }
.ch-sidebar-foot { padding: 12px 10px 16px; border-top: 1px solid var(--border); flex-shrink: 0; }
.ch-user-card { display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(8,12,20,.6); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; }
.ch-avatar    { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; background: linear-gradient(135deg, var(--green) 0%, #24a97a 100%); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 11px; color: #080c14; }
.ch-user-name   { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ch-user-status { font-size: 10px; color: var(--green); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.ch-logout-btn  { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px; background: rgba(8,12,20,.6); border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--text-2); cursor: pointer; transition: all 0.2s; }
.ch-logout-btn:hover { background: rgba(255,107,107,.12); color: var(--red); border-color: var(--red); }

.ch-main { flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 100vh; overflow-x: hidden; position: relative; z-index: 1; }
.ch-topbar { height: 56px; display: flex; align-items: center; padding: 0 24px; background: rgba(15,21,33,.82); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; gap: 12px; flex-shrink: 0; backdrop-filter: blur(16px); }
.ch-hamburger { display: none; background: rgba(8,12,20,.6); border: 1px solid var(--border); border-radius: 6px; width: 32px; height: 32px; align-items: center; justify-content: center; color: var(--text-3); cursor: pointer; transition: all 0.2s; flex-shrink: 0; font-size: 14px; }
.ch-hamburger:hover { background: var(--surface); border-color: var(--text-2); color: var(--text); }
.ch-crumb { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-3); }
.ch-crumb-sep { color: var(--text-3); }
.ch-crumb-active { color: var(--text); font-weight: 600; }
.ch-crumb-hide { white-space: nowrap; }
.ch-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.ch-clock  { font-size: 12px; font-weight: 500; color: var(--text-2); background: rgba(8,12,20,.6); border: 1px solid var(--border); border-radius: 6px; padding: 6px 12px; white-space: nowrap; }
.ch-icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border); background: transparent; display: flex; align-items: center; justify-content: center; color: var(--text-3); cursor: pointer; font-size: 13px; transition: all 0.2s; }
.ch-icon-btn:hover { background: rgba(46,204,143,.08); color: var(--text); }

.ch-page { flex: 1; padding: 24px; overflow-x: hidden; min-width: 0; }
.ch-page > div { animation: fadeIn 0.4s ease-out both; }
.ch-page-hd { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.ch-eyebrow { font-size: 11px; color: var(--green); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.ch-eyebrow::before { content: ''; display: block; width: 20px; height: 2px; background: var(--green); }
.ch-title    { font-size: 32px; color: var(--text); letter-spacing: -0.5px; line-height: 1.1; font-weight: 900; font-family: var(--font-display); }
.ch-subtitle { font-size: 11px; color: var(--text-3); margin-top: 4px; }

.ch-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
.ch-stat { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; transition: all 0.3s; animation: fadeIn 0.5s ease-out both; backdrop-filter: blur(16px); }
.ch-stat:hover { transform: translateY(-4px); border-color: var(--green); box-shadow: 0 8px 16px rgba(46,204,143,.15); }
.ch-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--card-accent); }
.ch-stat-icon  { font-size: 18px; color: var(--card-accent); margin-bottom: 12px; opacity: 0.85; }
.ch-stat-num   { font-size: 32px; line-height: 1; margin-bottom: 6px; letter-spacing: -0.5px; font-weight: 900; color: var(--card-accent); font-family: var(--font-display); }
.ch-stat-label { font-size: 11px; color: var(--text-2); letter-spacing: 0.3px; text-transform: uppercase; font-weight: 600; }

.ch-panel { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; animation: slideIn 0.5s ease-out both; position: relative; backdrop-filter: blur(16px); }
.ch-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--green); }
.ch-panel-hd { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); background: rgba(8,12,20,.4); }
.ch-panel-title { font-size: 11px; color: var(--text-2); letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600; }
.ch-panel-tag   { font-size: 9px; color: var(--green); border: 1px solid var(--green); border-radius: 4px; padding: 3px 8px; background: rgba(46,204,143,.1); font-weight: 600; }

.ch-list { display: flex; flex-direction: column; }
.ch-row { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-bottom: 1px solid var(--border); text-decoration: none; color: inherit; transition: background 0.15s; cursor: pointer; position: relative; }
.ch-row:last-child { border-bottom: none; }
.ch-row:hover { background: rgba(46,204,143,.05); }
.ch-row.unread { background: rgba(46,204,143,.03); }
.ch-row.unread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--green); border-radius: 0 2px 2px 0; }
.ch-row-icon { width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 16px; background: rgba(8,12,20,.4); }
.ch-row-body { flex: 1; min-width: 0; }
.ch-row-desc { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
.ch-row.unread .ch-row-desc { color: #fff; }
.ch-row-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ch-row-date { font-size: 11px; color: var(--text-3); }
.ch-row-type { font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: capitalize; border-radius: 4px; padding: 2px 8px; }
.ch-row-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ch-unread-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); flex-shrink: 0; }
.ch-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 6px; padding: 4px 10px; border: 1px solid; }
.ch-pill-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.ch-chevron  { color: var(--text-3); font-size: 10px; transition: transform 0.2s; }
.ch-row:hover .ch-chevron { transform: translateX(2px); color: var(--text-2); }

/* ── Detail View ── */
.ch-detail { display: flex; flex-direction: column; gap: 16px; animation: fadeIn 0.4s ease-out both; }
.ch-back-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-3); background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 8px; padding: 8px 14px; cursor: pointer; transition: all 0.2s; text-decoration: none; width: fit-content; margin-bottom: 4px; }
.ch-back-btn:hover { color: var(--text); border-color: var(--border-2); background: rgba(255,255,255,0.06); }
.ch-detail-card { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; backdrop-filter: blur(16px); position: relative; }
.ch-detail-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--card-top); }
.ch-detail-hd { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; background: rgba(8,12,20,.4); }
.ch-detail-type-row { display: flex; align-items: center; gap: 12px; }
.ch-detail-type-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 1px solid var(--border); background: rgba(8,12,20,.5); }
.ch-detail-type-name { font-size: 20px; font-weight: 900; font-family: var(--font-display); text-transform: capitalize; }
.ch-detail-id { font-size: 10px; color: var(--text-3); margin-top: 3px; font-family: monospace; }
.ch-detail-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.ch-detail-section-title { font-size: 10px; font-weight: 700; color: var(--text-3); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.ch-detail-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.ch-detail-field { display: flex; flex-direction: column; gap: 4px; }
.ch-detail-field-label { font-size: 10px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.4px; }
.ch-detail-field-value { font-size: 13px; color: var(--text); line-height: 1.55; }
.ch-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ── Timeline ── */
.ch-timeline { display: flex; flex-direction: column; gap: 0; }
.ch-tl-item { display: flex; gap: 14px; position: relative; }
.ch-tl-item:not(:last-child)::before { content: ''; position: absolute; left: 15px; top: 32px; bottom: 0; width: 1px; background: var(--border); }
.ch-tl-dot { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid; z-index: 1; }
.ch-tl-dot.pending  { background: rgba(255,209,102,.1);  border-color: #FFD166; color: #FFD166; }
.ch-tl-dot.progress { background: rgba(123,158,255,.1);  border-color: #7B9EFF; color: #7B9EFF; }
.ch-tl-dot.resolved { background: rgba(46,204,143,.1);   border-color: #2ECC8F; color: #2ECC8F; }
.ch-tl-dot.inactive { background: rgba(255,255,255,.03); border-color: var(--border); color: var(--text-3); }
.ch-tl-content { flex: 1; padding-bottom: 20px; }
.ch-tl-label { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.ch-tl-label.inactive { color: var(--text-3); }
.ch-tl-time  { font-size: 10px; color: var(--text-3); font-family: monospace; margin-bottom: 6px; }
.ch-tl-note  { font-size: 12px; color: var(--text-2); line-height: 1.55; background: rgba(8,12,20,.4); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; }

/* ── Resolution Box ── */
.ch-resolution { border-radius: 12px; overflow: hidden; border: 1px solid rgba(46,204,143,.3); background: rgba(46,204,143,.05); }
.ch-resolution-hd { display: flex; align-items: center; gap: 10px; padding: 14px 18px; background: rgba(46,204,143,.08); border-bottom: 1px solid rgba(46,204,143,.2); }
.ch-resolution-hd-icon { font-size: 16px; }
.ch-resolution-hd-title { font-size: 12px; font-weight: 700; color: #2ECC8F; flex: 1; text-transform: uppercase; letter-spacing: 0.4px; }
.ch-resolution-type-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid; }
.ch-resolution-body { padding: 18px; display: flex; flex-direction: column; gap: 16px; }
.ch-resolution-field { display: flex; flex-direction: column; gap: 8px; }
.ch-resolution-field-label { font-size: 10px; font-weight: 700; color: rgba(46,204,143,.7); text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; gap: 6px; }
.ch-resolution-field-value { font-size: 13px; color: var(--text); line-height: 1.7; background: rgba(8,12,20,.5); border: 1px solid rgba(46,204,143,.15); border-radius: 10px; padding: 14px 16px; }
.ch-resolution-field-value.empty { color: var(--text-3); font-style: italic; }
.ch-resolution-divider { height: 1px; background: rgba(46,204,143,.12); }
.ch-resolution-footer { padding: 10px 18px 14px; font-size: 11px; color: rgba(46,204,143,.6); display: flex; align-items: center; gap: 6px; }

/* ── Evidence ── */
.ch-evidence { border-radius: 10px; overflow: hidden; border: 1px solid var(--border); }
.ch-evidence img   { width: 100%; max-height: 280px; object-fit: cover; display: block; cursor: zoom-in; }
.ch-evidence video { width: 100%; max-height: 280px; display: block; background: #000; }

/* ── Notices ── */
.ch-status-notice { display: flex; align-items: flex-start; gap: 14px; border-radius: 10px; padding: 16px 18px; border: 1px solid; }
.ch-status-notice.pending     { background: rgba(255,209,102,.06); border-color: rgba(255,209,102,.25); }
.ch-status-notice.in-progress { background: rgba(123,158,255,.06); border-color: rgba(123,158,255,.25); }
.ch-status-notice-icon  { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.ch-status-notice-title { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
.ch-status-notice.pending     .ch-status-notice-title { color: #FFD166; }
.ch-status-notice.in-progress .ch-status-notice-title { color: #7B9EFF; }
.ch-status-notice-text { font-size: 12px; color: var(--text-2); line-height: 1.55; }

/* ── Empty / Loading ── */
.ch-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; gap: 8px; text-align: center; }
.ch-empty-icon  { font-size: 28px; color: var(--text-3); margin-bottom: 4px; opacity: 0.4; }
.ch-empty-title { font-size: 15px; font-weight: 600; color: var(--text-2); font-family: var(--font-display); }
.ch-empty-sub   { font-size: 13px; color: var(--text-3); max-width: 280px; line-height: 1.6; }
.ch-empty-link  { margin-top: 12px; font-size: 12px; font-weight: 600; color: var(--green); text-decoration: none; border: 1px solid var(--green); border-radius: 8px; padding: 8px 16px; background: rgba(46,204,143,.08); display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
.ch-empty-link:hover { background: rgba(46,204,143,.15); }
.ch-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 56px; color: var(--text-3); font-size: 13px; }
.ch-spinner { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--green); animation: spin 0.8s linear infinite; }

@media (max-width: 768px) {
  .ch-sidebar { transform: translateX(-100%); width: min(260px, 90vw); }
  .ch-sidebar.open { transform: translateX(0); }
  .ch-sidebar-close { display: flex; }
  .ch-hamburger { display: flex; }
  .ch-main { margin-left: 0; }
  .ch-topbar { padding: 0 16px; }
  .ch-crumb-hide { display: none; }
  .ch-page { padding: 16px; }
  .ch-title { font-size: 26px; }
  .ch-stat-grid { grid-template-columns: repeat(2, 1fr); }
  .ch-clock { display: none; }
  .ch-detail-grid { grid-template-columns: 1fr; }
}
`;function Z(){const[t,i]=n.useState("");return n.useEffect(()=>{const d=()=>{const p=new Date,o=x=>String(x).padStart(2,"0");i(`${o(p.getHours())}:${o(p.getMinutes())}:${o(p.getSeconds())} PHT`)};d();const a=setInterval(d,1e3);return()=>clearInterval(a)},[]),t}function ee(t,i="en-PH"){return new Date(t).toLocaleDateString(i,{month:"short",day:"numeric",year:"numeric"})}function z(t,i="en-PH"){return new Date(t).toLocaleString(i,{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}function I(t){return t==="follow-up"?"followUp":t==="fully-resolved"?"fullyResolved":"forwarded"}function te({report:t,onBack:i}){const{language:d,t:a,tList:p}=E(),o=d==="tl"?"fil-PH":"en-PH",x=F[t.type?.toLowerCase()]??F.other,s=y[t.status]??y.pending,D=a(`status.${t.status==="in-progress"?"inProgress":t.status}`,s.label),l=a(`report.types.${t.type?.toLowerCase()}`,t.type),_=t.resolution_type?a(`reportDetail.resolutionLabels.${I(t.resolution_type)}`,w[t.resolution_type]?.label??t.resolution_type):"",c=t.resolution_type?w[t.resolution_type]:null,C=t.evidence_url&&/\.(mp4|mov|webm)/i.test(t.evidence_url),f=["forwarded","follow-up","fully-resolved"],j=(t.responder_notes??"").trim(),g=(t.action_notes??"").trim(),h=f.includes(j)?"":j,m=f.includes(g)?"":g;return e.jsxs("div",{className:"ch-detail",children:[e.jsxs("button",{className:"ch-back-btn",onClick:i,children:[e.jsx(J,{size:11})," ",a("reportDetail.backToHistory")]}),e.jsxs("div",{className:"ch-detail-card",style:{"--card-top":x.color},children:[e.jsxs("div",{className:"ch-detail-hd",children:[e.jsxs("div",{className:"ch-detail-type-row",children:[e.jsx("div",{className:"ch-detail-type-icon",children:x.icon}),e.jsxs("div",{children:[e.jsx("div",{className:"ch-detail-type-name",style:{color:x.color},children:l}),e.jsxs("div",{className:"ch-detail-id",children:["ID: ",t.id]})]})]}),e.jsxs("span",{className:"ch-pill",style:{color:s.color,background:s.bg,borderColor:s.border},children:[e.jsx("span",{className:"ch-pill-dot"})," ",D]})]}),e.jsxs("div",{className:"ch-detail-body",children:[e.jsxs("div",{children:[e.jsx("div",{className:"ch-detail-section-title",children:a("reportDetail.reportDetails")}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{className:"ch-detail-field",children:[e.jsx("span",{className:"ch-detail-field-label",children:a("reportDetail.description")}),e.jsx("span",{className:"ch-detail-field-value",children:t.description||a("reportDetail.noDescription")})]}),e.jsxs("div",{className:"ch-detail-grid",children:[e.jsxs("div",{className:"ch-detail-field",children:[e.jsx("span",{className:"ch-detail-field-label",children:a("reportDetail.location")}),e.jsx("span",{className:"ch-detail-field-value",children:t.address||t.location||a("reportDetail.notSpecified")})]}),e.jsxs("div",{className:"ch-detail-field",children:[e.jsx("span",{className:"ch-detail-field-label",children:a("reportDetail.submitted")}),e.jsx("span",{className:"ch-detail-field-value",children:z(t.created_at,o)})]})]})]})]}),t.evidence_url&&e.jsxs("div",{children:[e.jsx("div",{className:"ch-detail-section-title",children:a("reportDetail.evidence")}),e.jsx("div",{className:"ch-evidence",children:C?e.jsx("video",{src:t.evidence_url,controls:!0,preload:"metadata"}):e.jsx("img",{src:t.evidence_url,alt:a("reportDetail.evidenceAlt","Evidence"),onClick:()=>window.open(t.evidence_url,"_blank")})})]}),e.jsxs("div",{children:[e.jsx("div",{className:"ch-detail-section-title",children:a("reportDetail.statusTimeline")}),e.jsxs("div",{className:"ch-timeline",children:[e.jsxs("div",{className:"ch-tl-item",children:[e.jsx("div",{className:"ch-tl-dot resolved",children:"✓"}),e.jsxs("div",{className:"ch-tl-content",children:[e.jsx("div",{className:"ch-tl-label",children:a("reportDetail.reportFiled")}),e.jsx("div",{className:"ch-tl-time",children:z(t.created_at,o)}),e.jsx("div",{className:"ch-tl-note",children:a("reportDetail.reportFiledSub")})]})]}),e.jsxs("div",{className:"ch-tl-item",children:[e.jsx("div",{className:`ch-tl-dot ${t.responder_id?"progress":"inactive"}`,children:t.responder_id?"👤":"○"}),e.jsxs("div",{className:"ch-tl-content",children:[e.jsx("div",{className:`ch-tl-label ${t.responder_id?"":"inactive"}`,children:t.responder_id?a("reportDetail.claimedByResponder"):a("reportDetail.awaitingResponder")}),!t.responder_id&&e.jsx("div",{className:"ch-tl-time",children:a("reportDetail.awaitingResponderSub")}),t.responder_id&&t.status==="in-progress"&&e.jsx("div",{className:"ch-tl-note",style:{borderColor:"rgba(123,158,255,.2)",background:"rgba(123,158,255,.05)"},children:a("reportDetail.responderOnItSub")})]})]}),e.jsxs("div",{className:"ch-tl-item",children:[e.jsx("div",{className:`ch-tl-dot ${t.status==="resolved"?"resolved":"inactive"}`,children:t.status==="resolved"?"✓":"○"}),e.jsxs("div",{className:"ch-tl-content",children:[e.jsx("div",{className:`ch-tl-label ${t.status!=="resolved"?"inactive":""}`,children:t.status==="resolved"?a("reportDetail.statusResolved"):a("reportDetail.resolutionPending")}),t.resolved_at&&e.jsx("div",{className:"ch-tl-time",children:z(t.resolved_at,o)})]})]})]})]}),t.status==="resolved"&&e.jsxs("div",{children:[e.jsx("div",{className:"ch-detail-section-title",children:a("reportDetail.responderUpdates")}),e.jsxs("div",{className:"ch-resolution",children:[e.jsxs("div",{className:"ch-resolution-hd",children:[e.jsx("span",{className:"ch-resolution-hd-icon",children:"🛡️"}),e.jsx("span",{className:"ch-resolution-hd-title",children:a("reportDetail.resolutionSummary")}),c&&e.jsxs("span",{className:"ch-resolution-type-pill",style:{color:c.color,background:c.bg,borderColor:`${c.color}40`},children:[c.icon," ",_]})]}),e.jsxs("div",{className:"ch-resolution-body",children:[e.jsxs("div",{className:"ch-resolution-field",children:[e.jsxs("span",{className:"ch-resolution-field-label",children:[e.jsx(V,{size:10})," ",a("reportDetail.responseNotes")]}),e.jsx("div",{className:`ch-resolution-field-value ${h?"":"empty"}`,children:h||a("reportDetail.noNotesProvided")})]}),e.jsx("div",{className:"ch-resolution-divider"}),e.jsxs("div",{className:"ch-resolution-field",children:[e.jsxs("span",{className:"ch-resolution-field-label",children:[e.jsx(q,{size:10})," ",a("reportDetail.actionTaken")]}),e.jsx("div",{className:`ch-resolution-field-value ${m?"":"empty"}`,children:m||a("reportDetail.noActionDetails")})]})]}),t.resolved_at&&e.jsxs("div",{className:"ch-resolution-footer",children:["🕐 ",a("reportDetail.resolvedOn").replace("{date}",z(t.resolved_at,o))]})]})]}),t.status==="pending"&&e.jsxs("div",{className:"ch-status-notice pending",children:[e.jsx("span",{className:"ch-status-notice-icon",children:"⏳"}),e.jsxs("div",{children:[e.jsx("div",{className:"ch-status-notice-title",children:a("reportDetail.awaitingResponder")}),e.jsx("p",{className:"ch-status-notice-text",children:a("reportDetail.awaitingResponderSub")})]})]}),t.status==="in-progress"&&e.jsxs("div",{className:"ch-status-notice in-progress",children:[e.jsx("span",{className:"ch-status-notice-icon",children:"🚨"}),e.jsxs("div",{children:[e.jsx("div",{className:"ch-status-notice-title",children:a("reportDetail.responderOnIt")}),e.jsx("p",{className:"ch-status-notice-text",children:a("reportDetail.responderOnItSub")})]})]})]})]})]})}function ie(){const{language:t,t:i,tList:d}=E(),a=t==="tl"?"fil-PH":"en-PH",p=B(),{id:o}=A(),x=Z(),[s,D]=n.useState([]),[l,_]=n.useState(""),[c,C]=n.useState(!0),[f,j]=n.useState(new Set),g=n.useCallback(r=>{j(R(r))},[]);n.useEffect(()=>{N.auth.getUser().then(({data:r})=>{r.user&&(_(r.user.id),g(r.user.id))})},[g]),n.useEffect(()=>{if(!l)return;const r=async()=>{const{data:v,error:k}=await N.from("reports").select("id, description, type, status, created_at, location, address, evidence_url, responder_id, responder_notes, action_notes, resolution_type, resolved_at").eq("user_id",l).order("created_at",{ascending:!1});k||D(v||[]),C(!1)};r();const u=N.channel("ch-reports-live").on("postgres_changes",{event:"UPDATE",schema:"public",table:"reports"},r).subscribe();return()=>{N.removeChannel(u)}},[l]),n.useEffect(()=>{o&&l&&(W(l,o),g(l))},[o,l,g]);const h={total:s.length,pending:s.filter(r=>r.status==="pending").length,inProgress:s.filter(r=>r.status==="in-progress").length,resolved:s.filter(r=>r.status==="resolved").length},m=s.filter(r=>!f.has(String(r.id))).length,b=o?s.find(r=>String(r.id)===String(o))??null:null,$=r=>i(`status.${r==="in-progress"?"inProgress":r}`,y[r]?.label??r),P=r=>i(`report.types.${r?.toLowerCase()}`,r??""),L=r=>r?i(`reportDetail.resolutionLabels.${I(r)}`,w[r]?.label??r):"",T=[{label:i("dashboard.statTotalFiled"),value:h.total,accent:"#7B9EFF",icon:e.jsx(S,{})},{label:i("dashboard.statPending"),value:h.pending,accent:"#FFD166",icon:e.jsx(U,{})},{label:i("dashboard.statInProgress"),value:h.inProgress,accent:"#FF9F43",icon:e.jsx(H,{})},{label:i("dashboard.statResolved"),value:h.resolved,accent:"#2ECC8F",icon:e.jsx(O,{})}];return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:Q}),e.jsx("div",{className:"ch-portal",children:e.jsx("div",{className:"ch-shell",children:e.jsxs("div",{className:"ch-main",children:[e.jsxs("div",{className:"ch-topbar",children:[e.jsxs("div",{className:"ch-crumb",children:[e.jsx("span",{className:"ch-crumb-hide",children:"DUMASAFEGUIDE"}),e.jsx("span",{className:"ch-crumb-sep ch-crumb-hide",children:"/"}),e.jsx("span",{className:"ch-crumb-hide",children:i("history.citizen")}),e.jsx("span",{className:"ch-crumb-sep ch-crumb-hide",children:"/"}),e.jsx("span",{className:b?"ch-crumb-hide":"ch-crumb-active",style:{cursor:b?"pointer":"default"},onClick:()=>b&&p("/citizen/history"),children:i("history.pageTitle")}),b&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"ch-crumb-sep",children:"/"}),e.jsx("span",{className:"ch-crumb-active",children:i("reportDetail.reportDetail")})]})]}),e.jsxs("div",{className:"ch-topbar-right",children:[e.jsx("span",{className:"ch-clock",children:x}),e.jsx("button",{className:"ch-icon-btn",children:e.jsx(Y,{size:13})})]})]}),e.jsx("div",{className:"ch-page",children:e.jsx("div",{children:b?e.jsx(te,{report:b,onBack:()=>p("/citizen/history")}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"ch-page-hd",children:e.jsxs("div",{children:[e.jsx("div",{className:"ch-eyebrow",children:i("dashboard.citizenPortal")}),e.jsx("div",{className:"ch-title",children:i("history.pageTitle")}),e.jsx("div",{className:"ch-subtitle",children:i("history.subtitle")})]})}),e.jsx("div",{className:"ch-stat-grid",children:T.map(r=>e.jsxs("div",{className:"ch-stat",style:{"--card-accent":r.accent},children:[e.jsx("div",{className:"ch-stat-icon",children:r.icon}),e.jsx("div",{className:"ch-stat-num",children:c?"—":r.value}),e.jsx("div",{className:"ch-stat-label",children:r.label})]},r.label))}),e.jsxs("div",{className:"ch-panel",children:[e.jsxs("div",{className:"ch-panel-hd",children:[e.jsx("span",{className:"ch-panel-title",children:i("history.allReports")}),e.jsx("span",{className:"ch-panel-tag",children:c?"…":m>0?`${m} ${i("history.totalLabel")}`:`${h.total} ${i("history.totalLabel")}`})]}),c?e.jsxs("div",{className:"ch-loading",children:[e.jsx("div",{className:"ch-spinner"})," ",i("history.loadingReports")]}):s.length===0?e.jsxs("div",{className:"ch-empty",children:[e.jsx("div",{className:"ch-empty-icon",children:e.jsx(G,{})}),e.jsx("div",{className:"ch-empty-title",children:i("history.noReportsYet")}),e.jsx("p",{className:"ch-empty-sub",children:i("history.noReportsSub")}),e.jsxs(M,{to:"/citizen/report",className:"ch-empty-link",children:[e.jsx(S,{size:11})," ",i("history.fileAReport")]})]}):e.jsx("div",{className:"ch-list",children:s.map(r=>{const u=F[r.type?.toLowerCase()]??F.other,v=y[r.status]??y.pending,k=!f.has(String(r.id));return e.jsxs("div",{className:`ch-row${k?" unread":""}`,onClick:()=>p(`/citizen/history/${r.id}`),children:[e.jsx("div",{className:"ch-row-icon",children:u.icon}),e.jsxs("div",{className:"ch-row-body",children:[e.jsx("div",{className:"ch-row-desc",title:r.description,children:r.description||i("reportDetail.noDescription")}),e.jsxs("div",{className:"ch-row-meta",children:[e.jsx("span",{className:"ch-row-date",children:ee(r.created_at,a)}),r.type&&e.jsx("span",{className:"ch-row-type",style:{color:u.color,background:`${u.color}12`,border:`1px solid ${u.color}25`},children:P(r.type)}),r.status==="resolved"&&r.resolution_type&&w[r.resolution_type]&&e.jsxs("span",{style:{fontSize:"9px",fontWeight:"700",color:"#2ECC8F",background:"rgba(46,204,143,.1)",border:"1px solid rgba(46,204,143,.2)",borderRadius:"4px",padding:"2px 6px"},children:[w[r.resolution_type].icon," ",L(r.resolution_type)]})]})]}),e.jsxs("div",{className:"ch-row-right",children:[k&&e.jsx("span",{className:"ch-unread-dot"}),e.jsxs("span",{className:"ch-pill",style:{color:v.color,background:v.bg,borderColor:v.border},children:[e.jsx("span",{className:"ch-pill-dot"}),$(r.status)]}),e.jsx(X,{className:"ch-chevron"})]})]},r.id)})})]})]})})})]})})})]})}export{ie as default};
