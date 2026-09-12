import{am as d,an as l,ak as e}from"./index-CvhaT9ii.js";import{T as R}from"./TranslatedDescription-BzvG2PoB.js";const p={fire:{icon:"🔥",label:"Fire",colorClass:"type-fire"},accident:{icon:"🚗",label:"Accident",colorClass:"type-accident"},flood:{icon:"🌊",label:"Flood",colorClass:"type-flood"},crime:{icon:"🚨",label:"Crime",colorClass:"type-crime"},medical:{icon:"🏥",label:"Medical",colorClass:"type-medical"},other:{icon:"⚠️",label:"Other",colorClass:"type-other"}},u={pending:{label:"Pending",colorClass:"status-pending"},"in-progress":{label:"In Progress",colorClass:"status-in-progress"},resolved:{label:"Resolved",colorClass:"status-resolved"}},D=`
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
.dp-map-wrap iframe { width:100%; height:100%; border:0; display:block; }

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
}
`,s={MapPin:()=>e.jsxs("svg",{className:"dp-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"}),e.jsx("circle",{cx:"12",cy:"10",r:"3"})]}),Clock:()=>e.jsxs("svg",{className:"dp-icon",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]}),User:()=>e.jsxs("svg",{className:"dp-icon",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]}),Phone:()=>e.jsx("svg",{className:"dp-icon",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"})}),Bolt:()=>e.jsx("svg",{className:"dp-icon",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"})}),Check:()=>e.jsxs("svg",{className:"dp-icon",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),Route:()=>e.jsxs("svg",{className:"dp-icon",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"6",cy:"19",r:"3"}),e.jsx("path",{d:"M9 19h8.5c.4 0 .9-.2 1.2-.5l2.7-2.7c.3-.3.5-.7.6-1.1V5"}),e.jsx("path",{d:"M18 5a3 3 0 0 0-3-3H9L6 5"}),e.jsx("circle",{cx:"18",cy:"5",r:"3"})]}),File:()=>e.jsxs("svg",{className:"dp-icon",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"})]}),Filter:()=>e.jsx("svg",{className:"dp-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"})}),Layers:()=>e.jsxs("svg",{className:"dp-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polygon",{points:"12 2 2 7 12 12 22 7 12 2"}),e.jsx("polyline",{points:"2 17 12 22 22 17"}),e.jsx("polyline",{points:"2 12 12 17 22 12"})]}),Radar:()=>e.jsxs("svg",{className:"dp-icon",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M12 2a10 10 0 1 0 10 10"}),e.jsx("path",{d:"M12 6a6 6 0 0 0 0 12"}),e.jsx("path",{d:"M12 10a2 2 0 0 0 0 4"}),e.jsx("line",{x1:"12",y1:"2",x2:"12",y2:"12"})]})};function E(a){const o=Math.floor((Date.now()-new Date(a).getTime())/1e3);return o<60?`${o}s ago`:o<3600?`${Math.floor(o/60)}m ago`:o<86400?`${Math.floor(o/3600)}h ago`:new Date(a).toLocaleDateString()}function W(a){if(!a)return!1;const o=a.split(",").map(c=>parseFloat(c.trim()));return o.length===2&&!isNaN(o[0])&&!isNaN(o[1])}function m(...a){return a.filter(Boolean).join(" ")}function $(){const[a,o]=d.useState([]),[c,N]=d.useState(!0),[k,C]=d.useState(""),[f,L]=d.useState("all"),[v,z]=d.useState("all"),[y,j]=d.useState(null),S=d.useRef(null);d.useEffect(()=>{l.auth.getUser().then(({data:{user:r}})=>{r&&C(r.id)})},[]);const g=async()=>{const{data:r}=await l.from("reports").select("*").order("created_at",{ascending:!1});o(r??[]),N(!1)};d.useEffect(()=>{g();const r=l.channel("dispatch-reports").on("postgres_changes",{event:"*",schema:"public",table:"reports"},g).subscribe();return()=>{l.removeChannel(r)}},[]);const M=async(r,t)=>{t.stopPropagation(),await l.from("reports").update({responder_id:k,status:"in-progress"}).eq("id",r),g()},F=async(r,t)=>{t.stopPropagation(),await l.from("reports").update({status:"resolved"}).eq("id",r),g()},x=a.filter(r=>{const t=f==="all"||r.status===f,h=v==="all"||r.type===v;return t&&h}),B=r=>r==="all"?a.length:a.filter(t=>t.status===r).length,_=r=>r==="all"?a.length:a.filter(t=>t.type===r).length,n=y?a.find(r=>String(r.id)===y)??null:null,w=n?.location?`https://www.google.com/maps?q=${encodeURIComponent(n.location)}&z=16&output=embed`:"https://www.google.com/maps?q=Dumaguete+City&z=13&output=embed",I=["all","pending","in-progress","resolved"],T=["all","fire","accident","flood","crime","medical","other"];return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:D}),e.jsxs("div",{className:"dp",children:[e.jsxs("div",{className:"dp-header",children:[e.jsxs("div",{children:[e.jsx("div",{className:"dp-eyebrow",children:"Field Operations"}),e.jsx("div",{className:"dp-title",children:"Dispatch Center"})]}),e.jsxs("div",{className:"dp-header-right",children:[c&&e.jsx("div",{className:"dp-spinner"}),e.jsxs("div",{className:"dp-live-badge",children:[e.jsx("span",{className:"dp-live-dot"}),"LIVE FEED"]})]})]}),e.jsxs("div",{className:"dp-filters",children:[e.jsxs("span",{className:"dp-filter-label",children:[e.jsx(s.Filter,{}),"Status"]}),e.jsx("div",{className:"dp-filter-group",children:I.map(r=>e.jsxs("button",{className:m("dp-chip",f===r&&"active"),onClick:()=>L(r),children:[r==="all"?"All":u[r]?.label??r,e.jsx("span",{className:"dp-chip-count",children:B(r)})]},r))}),e.jsx("div",{className:"dp-filter-sep"}),e.jsx("span",{className:"dp-filter-label",children:"Type"}),e.jsx("div",{className:"dp-filter-group",children:T.map(r=>e.jsxs("button",{className:m("dp-chip",v===r&&"active"),onClick:()=>z(r),children:[r==="all"?"All":`${p[r]?.icon} ${p[r]?.label}`,e.jsx("span",{className:"dp-chip-count",children:_(r)})]},r))})]}),e.jsxs("div",{className:"dp-body",children:[e.jsxs("div",{className:"dp-panel",children:[e.jsxs("div",{className:"dp-panel-header",children:[e.jsxs("span",{className:"dp-panel-title",children:[e.jsx(s.Radar,{}),"Live Incident Map"]}),e.jsxs("span",{className:"dp-count-pill",children:[x.length," Active"]})]}),!n||n.location?e.jsxs("div",{className:"dp-map-wrap",children:[e.jsx("iframe",{title:"Incident map",src:w,loading:"lazy",allowFullScreen:!0},w),n&&e.jsxs("div",{className:"dp-map-overlay",children:[e.jsxs("span",{className:"dp-map-tag",children:[e.jsx(s.MapPin,{}),n.address||n.location]}),e.jsxs("span",{className:"dp-map-tag",children:[p[n.type]?.icon," ",n.type.toUpperCase()," —"," ",u[n.status]?.label]})]})]}):e.jsxs("div",{className:"dp-map-empty",children:[e.jsx(s.MapPin,{}),"No location data available"]})]}),e.jsxs("div",{className:"dp-panel",children:[e.jsxs("div",{className:"dp-panel-header",children:[e.jsxs("span",{className:"dp-panel-title",children:[e.jsx(s.Layers,{}),"Incident Queue"]}),e.jsx("span",{className:"dp-count-pill",children:x.length})]}),e.jsx("div",{className:"dp-queue",ref:S,children:c?e.jsx("div",{className:"dp-empty",children:e.jsx("div",{className:"dp-spinner"})}):x.length===0?e.jsxs("div",{className:"dp-empty",children:[e.jsx("span",{className:"dp-empty-icon",children:"📭"}),"No Incidents"]}):x.map(r=>{const t=p[r.type]??p.other,h=u[r.status]??u.pending,A=r.responder_id===k,b=String(r.id)===y,P=!r.responder_id&&r.status==="pending";return e.jsxs("div",{className:m("dp-card",t.colorClass,b&&"selected"),onClick:()=>j(b?null:String(r.id)),role:"button",tabIndex:0,onKeyDown:i=>i.key==="Enter"&&j(b?null:String(r.id)),"aria-pressed":b,children:[e.jsxs("div",{className:"dp-card-top",children:[e.jsxs("div",{className:"dp-card-type",children:[e.jsx("span",{className:"dp-card-icon",children:t.icon}),e.jsx("span",{className:"dp-card-type-label",children:t.label})]}),e.jsxs("div",{className:m("dp-status",h.colorClass),children:[e.jsx("span",{className:"dp-status-dot"}),h.label]})]}),e.jsxs("div",{className:"dp-card-addr",children:[e.jsx(s.MapPin,{}),r.address||r.location||"No location"]}),r.description&&e.jsx(R,{description:r.description,descriptionLang:r.description_lang,descriptionTranslated:r.description_translated,className:"dp-card-desc"}),e.jsxs("div",{className:"dp-meta",children:[e.jsxs("span",{className:"dp-tag",children:[e.jsx(s.Clock,{}),E(r.created_at)]}),r.reporter_name&&e.jsxs("span",{className:"dp-tag",children:[e.jsx(s.User,{}),r.reporter_name]}),r.reporter_contact&&e.jsxs("a",{href:`tel:${r.reporter_contact}`,className:"dp-tag dp-tag-tel",onClick:i=>i.stopPropagation(),children:[e.jsx(s.Phone,{}),r.reporter_contact]})]}),e.jsxs("div",{className:"dp-actions",children:[P&&e.jsxs("button",{className:"dp-btn dp-btn-claim",onClick:i=>M(r.id,i),children:[e.jsx(s.Bolt,{}),"Claim"]}),A&&r.status==="in-progress"&&e.jsxs("button",{className:"dp-btn dp-btn-resolve",onClick:i=>F(r.id,i),children:[e.jsx(s.Check,{}),"Resolve"]}),W(r.location)&&e.jsxs("a",{href:`https://www.google.com/maps?q=${r.location}`,target:"_blank",rel:"noopener noreferrer",className:"dp-btn dp-btn-nav",onClick:i=>i.stopPropagation(),children:[e.jsx(s.Route,{}),"Navigate"]}),r.evidence_url&&e.jsxs("a",{href:r.evidence_url,target:"_blank",rel:"noopener noreferrer",className:"dp-btn dp-btn-nav",onClick:i=>i.stopPropagation(),children:[e.jsx(s.File,{}),"Evidence"]})]})]},String(r.id))})})]})]})]})]})}export{$ as default};
