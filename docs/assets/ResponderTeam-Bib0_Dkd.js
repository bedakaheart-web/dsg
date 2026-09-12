import{am as f,an as y,ak as t}from"./index-CvhaT9ii.js";const w={on_duty:{label:"On Duty",color:"#00B074",bg:"rgba(0,176,116,0.08)",border:"rgba(0,176,116,0.25)"},responding:{label:"Responding",color:"#FF9500",bg:"rgba(255,149,0,0.08)",border:"rgba(255,149,0,0.25)"},off_duty:{label:"Off Duty",color:"#9CA3AF",bg:"rgba(156,163,175,0.08)",border:"rgba(156,163,175,0.25)"}},z={Alpha:"#0066FF",Bravo:"#00B074",Charlie:"#FF9500",Delta:"#FF3B30",HQ:"#8B5CF6"},i=({path:e,size:a=16})=>t.jsx("svg",{width:a,height:a,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",style:{display:"inline-block",verticalAlign:"middle",flexShrink:0},dangerouslySetInnerHTML:{__html:e}}),o={users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",radio:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5M19.1 4.9C23 8.8 23 15.1 19.1 19",activity:"M22 12h-4l-3 9L9 3l-3 9H2",phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",mail:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",search:"M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",filter:"M22 3H2l8 9.46V19l4 2v-8.54L22 3z",clock:"M12 2a10 10 0 1 0 10 10M12 6v6l4 2",chevDown:"M6 9l6 6 6-6",chevUp:"M18 15l-6-6-6 6",retry:"M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"},C=`
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

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.rtp-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  background: rgba(8,12,20,0.93);
  min-height: 100vh;
}

/* ── Header ── */
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

/* ── Stat Grid ── */
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

/* ── Skeleton ── */
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

/* ── Toolbar ── */
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

/* ── Grid ── */
.rtp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

@media (max-width: 600px) { .rtp-grid { grid-template-columns: 1fr; } }

/* ── Member Card ── */
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

/* ── Card top ── */
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

/* ── Contacts ── */
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

/* ── Expand button ── */
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

/* ── Expanded detail ── */
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

/* ── Card footer ── */
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

/* ── Skeleton card ── */
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

/* ── Empty / Error ── */
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

/* ── Spinner ── */
.rtp-spinner {
  display: inline-block;
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  animation: rtp-spin 0.7s linear infinite;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .rtp-title  { font-size: 26px; }
  .rtp-stats  { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .rtp-stat-num { font-size: 24px; }
}
`;function M(e){return e?e.split(" ").slice(0,2).map(a=>a[0]?.toUpperCase()??"").join(""):"?"}function k(e){return e?new Date(e).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"}):"—"}function _(e){if(!e)return"—";const a=Math.floor((Date.now()-new Date(e).getTime())/1e3);return a<60?`${a}s ago`:a<3600?`${Math.floor(a/60)}m ago`:a<86400?`${Math.floor(a/3600)}h ago`:k(e)}function S(){return t.jsxs("div",{className:"rtp-skel-card",children:[t.jsxs("div",{style:{display:"flex",gap:12,alignItems:"flex-start"},children:[t.jsx("div",{className:"rtp-skel rtp-skel-av"}),t.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:6},children:[t.jsx("div",{className:"rtp-skel rtp-skel-name"}),t.jsx("div",{className:"rtp-skel rtp-skel-role"})]})]}),t.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6},children:[t.jsx("div",{className:"rtp-skel rtp-skel-line"}),t.jsx("div",{className:"rtp-skel rtp-skel-lsm"})]}),t.jsx("div",{style:{height:34,borderRadius:8,background:"rgba(255,255,255,0.05)"}})]})}function F({member:e,index:a}){const[x,v]=f.useState(!1),u=e.status??"off_duty",n=w[u]??w.off_duty,p=e.unit??"HQ",d=z[p]??"#0066FF",c=`${d}18`,m=`${d}35`,h=e.full_name??"Unknown Member",l=e.role??"—";return t.jsxs("div",{className:"rtp-card",style:{animationDelay:`${a*.04}s`,"--card-accent":d,"--av-bg":c,"--av-border":m},children:[t.jsxs("div",{className:"rtp-card-top",children:[t.jsxs("div",{className:"rtp-avatar",style:{"--av-bg":c,"--av-border":m,color:d},children:[e.avatar_url?t.jsx("img",{src:e.avatar_url,alt:h,className:"rtp-avatar-img"}):M(e.full_name),t.jsx("span",{className:`rtp-dot${u==="responding"?" is-responding":""}`,style:{"--dot-color":n.color}})]}),t.jsxs("div",{className:"rtp-card-info",children:[t.jsx("div",{className:"rtp-card-name",children:h}),t.jsx("div",{className:"rtp-card-role",style:{textTransform:"capitalize"},children:l}),t.jsxs("div",{className:"rtp-unit-tag",style:{"--unit-bg":c,"--unit-border":m,"--unit-color":d},children:[t.jsx(i,{path:o.shield,size:9}),p," Unit"]})]}),t.jsx("span",{className:"rtp-status-pill",style:{color:n.color,background:n.bg,borderColor:n.border},children:n.label})]}),(e.email||e.phone)&&t.jsxs("div",{className:"rtp-contacts",children:[e.email&&t.jsxs("div",{className:"rtp-contact-row",children:[t.jsx(i,{path:o.mail,size:12}),t.jsx("a",{href:`mailto:${e.email}`,children:e.email})]}),e.phone&&t.jsxs("div",{className:"rtp-contact-row",children:[t.jsx(i,{path:o.phone,size:12}),t.jsx("a",{href:`tel:${e.phone}`,children:e.phone})]})]}),t.jsxs("button",{className:"rtp-expand-btn",onClick:()=>v(g=>!g),children:[x?"Hide details":"View details",t.jsx(i,{path:x?o.chevUp:o.chevDown,size:12})]}),x&&t.jsx("div",{className:"rtp-detail",children:[{key:"Role",val:l,color:void 0},{key:"Unit",val:p,color:d},{key:"Status",val:n.label,color:n.color},{key:"Last seen",val:_(e.last_seen),color:void 0}].map(({key:g,val:b,color:r})=>t.jsxs("div",{className:"rtp-detail-row",children:[t.jsx("span",{className:"rtp-detail-key",children:g}),t.jsx("span",{className:"rtp-detail-val",style:r?{color:r}:void 0,children:b})]},g))}),t.jsx("div",{className:"rtp-card-foot",children:t.jsxs("span",{className:"rtp-meta",children:[t.jsx(i,{path:o.clock,size:11}),"Joined ",k(e.joined_at)]})})]})}const L=[{key:"all",label:"All",colorClass:""},{key:"on_duty",label:"On Duty",colorClass:"fv-green"},{key:"responding",label:"Responding",colorClass:"fv-amber"},{key:"off_duty",label:"Off Duty",colorClass:"fv-gray"}];function R(){const[e,a]=f.useState([]),[x,v]=f.useState(!0),[u,n]=f.useState(null),[p,d]=f.useState(""),[c,m]=f.useState("all"),h=async()=>{try{n(null);const{data:r,error:s}=await y.from("profiles").select("id, full_name, email, role, status, unit, avatar_url, phone, joined_at, last_seen").in("role",["responder","admin"]).order("full_name",{ascending:!0});if(s)throw s;a(r??[])}catch(r){n(r?.message??"Failed to load team.")}finally{v(!1)}};f.useEffect(()=>{h();const r=y.channel("rtp-team-presence").on("postgres_changes",{event:"*",schema:"public",table:"profiles"},h).subscribe();return()=>{y.removeChannel(r)}},[]);const l={total:e.length,on_duty:e.filter(r=>r.status==="on_duty").length,responding:e.filter(r=>r.status==="responding").length,off_duty:e.filter(r=>!r.status||r.status==="off_duty").length},g=e.filter(r=>{const s=p.toLowerCase(),j=!s||(r.full_name??"").toLowerCase().includes(s)||(r.email??"").toLowerCase().includes(s)||(r.unit??"").toLowerCase().includes(s)||(r.role??"").toLowerCase().includes(s),N=c==="all"||(c==="off_duty"?!r.status||r.status==="off_duty":r.status===c);return j&&N}),b=[{label:"Total Members",value:l.total,colorClass:"sv-default",icon:t.jsx(i,{path:o.users,size:18})},{label:"On Duty",value:l.on_duty,colorClass:"sv-green",icon:t.jsx(i,{path:o.shield,size:18})},{label:"Responding",value:l.responding,colorClass:"sv-amber",icon:t.jsx(i,{path:o.radio,size:18})},{label:"Off Duty",value:l.off_duty,colorClass:"sv-gray",icon:t.jsx(i,{path:o.activity,size:18})}];return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:C}),t.jsxs("div",{className:"rtp-root",children:[t.jsxs("div",{className:"rtp-hd",children:[t.jsxs("div",{children:[t.jsx("div",{className:"rtp-eyebrow",children:"Field Operations"}),t.jsx("div",{className:"rtp-title",children:"Team"}),t.jsx("div",{className:"rtp-subtitle",children:"Responder roster & live status"})]}),t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[x&&t.jsx("div",{className:"rtp-spinner"}),t.jsxs("div",{className:"rtp-live",children:[t.jsx("span",{className:"rtp-live-dot"}),"LIVE ROSTER"]})]})]}),t.jsx("div",{className:"rtp-stats",children:b.map(r=>t.jsxs("div",{className:`rtp-stat ${r.colorClass}`,children:[t.jsx("div",{className:"rtp-stat-icon",children:r.icon}),t.jsx("div",{className:"rtp-stat-num",children:x?t.jsx("div",{className:"rtp-skel rtp-skel-num"}):r.value}),t.jsx("div",{className:"rtp-stat-label",children:r.label})]},r.label))}),t.jsxs("div",{className:"rtp-toolbar",children:[t.jsxs("div",{className:"rtp-search-wrap",children:[t.jsx("span",{className:"rtp-search-icon",children:t.jsx(i,{path:o.search,size:14})}),t.jsx("input",{className:"rtp-search",placeholder:"Search name, email, unit or role…",value:p,onChange:r=>d(r.target.value)})]}),t.jsxs("div",{className:"rtp-filter-grp",children:[t.jsx(i,{path:o.filter,size:13}),L.map(r=>{const s=r.key==="all"?l.total:l[r.key]??0;return t.jsxs("button",{className:`rtp-filter-btn ${r.colorClass} ${c===r.key?"active":""}`,onClick:()=>m(r.key),children:[r.label,s>0&&t.jsx("span",{className:"rtp-filter-count",children:s})]},r.key)})]})]}),t.jsx("div",{className:"rtp-grid",children:x?Array.from({length:6}).map((r,s)=>t.jsx(S,{},s)):u?t.jsxs("div",{className:"rtp-empty",children:[t.jsx("div",{className:"rtp-empty-icon",children:t.jsx(i,{path:o.activity,size:32})}),t.jsx("div",{className:"rtp-empty-text",children:u}),t.jsxs("button",{className:"rtp-retry-btn",onClick:h,children:[t.jsx(i,{path:o.retry,size:13}),"Retry"]})]}):g.length===0?t.jsxs("div",{className:"rtp-empty",children:[t.jsx("div",{className:"rtp-empty-icon",children:t.jsx(i,{path:o.users,size:36})}),t.jsx("div",{className:"rtp-empty-text",children:p?`No results for "${p}"`:"No team members found"})]}):g.map((r,s)=>t.jsx(F,{member:r,index:s},r.id))})]})]})}export{R as default};
