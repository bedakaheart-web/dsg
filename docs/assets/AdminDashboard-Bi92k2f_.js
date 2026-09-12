import{am as i,an as g,ak as e,w as he,d as ae,a8 as ee,a9 as re,f as De,k as ye,a5 as Ie,q as ie,n as $e,l as Pe,ac as ea,ab as aa,C as ra,D as ta,P as sa,h as ia,U as oa,W as na,O as la,K as da,T as ca,a7 as Se,V as Oe,$ as pa,z as xa,y as ha,a4 as ga,a3 as ua,t as ma,ag as ue,G as ve,_ as ba,s as fa,B as va,N as Ue,a6 as Ye,R as He,r as je,p as ya,a1 as ja,aa as Ve,I as qe,x as Ge,aq as wa,ai as Na,ah as ka,a2 as za,X as Fa,c as Sa,a0 as Ca,i as We}from"./index-CvhaT9ii.js";import{T as Ea}from"./TranslatedDescription-BzvG2PoB.js";const _a=[{id:"all-typhoon",label:"Typhoon Advisory",message:"🌀 TYPHOON ADVISORY: Signal No. raised for Dumaguete City area. Citizens: secure your homes and prepare emergency kits. Avoid going outside. Responders: report to command center for deployment briefing.",audience:"all",severity:"critical",icon:e.jsx(ea,{})},{id:"all-flood",label:"Flood Warning",message:"🌊 FLOOD WARNING: Rising water levels have been detected in low-lying areas of the barangay. All residents near waterways must evacuate immediately to higher ground. Avoid crossing flooded roads. Responders deploy to affected zones.",audience:"all",severity:"critical",icon:e.jsx(aa,{})},{id:"all-fire",label:"Fire Incident Alert",message:"🔥 FIRE ALERT: An active fire incident is currently being responded to in the barangay. Citizens in the vicinity: stay indoors, close windows, and avoid the area. BFP and responders are on scene.",audience:"all",severity:"critical",icon:e.jsx(ra,{})},{id:"all-earthquake",label:"Earthquake Advisory",message:"⚠ EARTHQUAKE ADVISORY: A seismic event has been detected. Citizens: check for structural damage, stay away from damaged buildings, and do not use elevators. Watch for aftershocks. Responders: conduct damage assessment immediately.",audience:"all",severity:"critical",icon:e.jsx(ta,{})},{id:"all-landslide",label:"Landslide Warning",message:"⛰ LANDSLIDE WARNING: Risk of landslides in hilly and mountainous areas due to heavy rainfall. Residents in elevated or slope-adjacent areas must evacuate to safe zones immediately. Avoid roads near hillsides.",audience:"all",severity:"critical",icon:e.jsx(sa,{})},{id:"all-roadaccident",label:"Road Accident Alert",message:"🚗 ROAD ACCIDENT ALERT: A major road accident has been reported. Emergency responders are on scene. Citizens: avoid the affected road and follow alternate routes. Clear the way for emergency vehicles.",audience:"all",severity:"warning",icon:e.jsx(ia,{})},{id:"all-others",label:"General Emergency",message:"⚠ EMERGENCY NOTICE: An emergency situation has been reported in your area. Please remain calm, stay indoors, and follow instructions from barangay officials and emergency responders. Further updates to follow.",audience:"all",severity:"warning",icon:e.jsx(oa,{})},{id:"rsp-deploy",label:"Deploy to Scene",message:"ALL RESPONDERS: An incident has been reported. Please deploy to the designated location immediately and await further instructions from the command center.",audience:"responder",severity:"critical",icon:e.jsx(ee,{})},{id:"rsp-standby",label:"Standby Alert",message:"RESPONDERS: Please remain on standby. A potential emergency situation is developing. Check your equipment and await deployment orders.",audience:"responder",severity:"warning",icon:e.jsx(na,{})},{id:"rsp-debrief",label:"Post-Incident Debrief",message:"RESPONDERS: Incident has been resolved. Please return to base and submit your incident report within 24 hours. A debrief session will be scheduled.",audience:"responder",severity:"info",icon:e.jsx(ie,{})},{id:"rsp-shift",label:"Shift Change Notice",message:"RESPONDERS: Duty shift change in 30 minutes. On-duty team, please prepare handover notes. Incoming team, report to command center for briefing.",audience:"responder",severity:"info",icon:e.jsx(ee,{})},{id:"cit-evacuate",label:"Evacuation Order",message:"⚠ EVACUATION NOTICE: Residents in affected areas are advised to evacuate immediately. Proceed to the nearest designated evacuation center. Bring essential documents and supplies.",audience:"citizen",severity:"critical",icon:e.jsx(he,{})},{id:"cit-medical",label:"Medical Emergency",message:"🚑 MEDICAL ADVISORY: Emergency medical services are responding to an incident nearby. Please clear the road for emergency vehicles and avoid the affected area.",audience:"citizen",severity:"warning",icon:e.jsx(la,{})},{id:"cit-allclear",label:"All Clear Notice",message:"✅ ALL CLEAR: The situation has been resolved. Residents may resume normal activities. Thank you for your cooperation and patience during this emergency.",audience:"citizen",severity:"info",icon:e.jsx(ye,{})},{id:"cit-update",label:"Situation Update",message:"ℹ SITUATION UPDATE: Emergency responders are actively managing the ongoing incident. Please remain calm, stay indoors, and monitor official channels for further updates.",audience:"citizen",severity:"info",icon:e.jsx(da,{})},{id:"all-drill",label:"Emergency Drill",message:"📢 EMERGENCY DRILL NOTICE: A city-wide emergency response drill will be conducted. This is only a test. Responders please follow drill protocols. Citizens, no action required.",audience:"all",severity:"info",icon:e.jsx(De,{})}],Aa=`
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

@keyframes alFadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; } }
@keyframes alSpin   { to { transform:rotate(360deg); } }
@keyframes pulse    { 0%,100%{opacity:1;} 50%{opacity:0.5;} }

* { box-sizing: border-box; margin:0; padding:0; }

.al-root {
  background: rgba(8,12,20,0.93);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  width: 100%; min-width: 0;
}

/* ── Page header ── */
.al-header {
  display: flex; align-items: flex-end;
  justify-content: space-between; flex-wrap: wrap;
  gap: 14px; margin-bottom: 24px;
}
.al-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--primary); margin-bottom: 6px;
  display: flex; align-items: center; gap: 8px;
}
.al-eyebrow::before { content:''; display:block; width:20px; height:2px; background:var(--primary); }
.al-title { font-size: 28px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; margin:0 0 4px; }
.al-subtitle { font-size: 13px; color: var(--text-secondary); margin:0; }

/* ── Layout ── */
.al-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  align-items: start;
  width: 100%; min-width: 0;
}
.al-left { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

/* ── Error banner ── */
.al-error-banner {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-radius: 9px; margin-bottom: 16px;
  background: rgba(255,59,48,.06); border: 1px solid rgba(255,59,48,.25);
  font-size: 13px; color: var(--danger);
}

/* ── Compose card ── */
.al-compose {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px; min-width: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.al-compose-title {
  font-size: 13px; font-weight: 700; color: var(--text);
  margin: 0 0 18px; display: flex; align-items: center; gap: 8px;
}
.al-compose-title-icon {
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255,59,48,.08); border: 1px solid rgba(255,59,48,.2);
  display: flex; align-items: center; justify-content: center; color: var(--danger); flex-shrink: 0;
}

/* ── Field ── */
.al-field { margin-bottom: 14px; }
.al-field:last-of-type { margin-bottom: 0; }
.al-label {
  display: block; font-size: 10px; font-weight: 600;
  letter-spacing: 0.4px; text-transform: uppercase;
  color: var(--text-secondary); margin-bottom: 8px;
}

/* ── Audience buttons ── */
.al-audience-group { display: flex; gap: 6px; flex-wrap: wrap; }
.al-audience-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border);
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all .17s; background: var(--bg); color: var(--text-secondary);
  white-space: nowrap;
}
.al-audience-btn:hover { border-color: var(--text-secondary); color: var(--text); background: var(--surface); }
.al-audience-btn--responder.active { background: rgba(0,102,255,.08);  border-color: var(--primary); color: var(--primary); }
.al-audience-btn--citizen.active   { background: rgba(0,176,116,.08);  border-color: var(--success); color: var(--success); }
.al-audience-btn--all.active       { background: rgba(255,149,0,.08);  border-color: var(--warning); color: var(--warning); }

/* ── Severity buttons ── */
.al-severity-group { display: flex; gap: 6px; }
.al-severity-btn {
  flex: 1; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border);
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;
  cursor: pointer; transition: all .17s; background: var(--bg); color: var(--text-secondary); text-align: center;
}
.al-severity-btn:hover { border-color: var(--text-secondary); color: var(--text); background: var(--surface); }
.al-severity-btn--info.active     { background: rgba(0,102,255,.08);  border-color: var(--primary); color: var(--primary); font-weight: 800; }
.al-severity-btn--warning.active  { background: rgba(255,149,0,.08);  border-color: var(--warning); color: var(--warning); font-weight: 800; }
.al-severity-btn--critical.active { background: rgba(255,59,48,.08);  border-color: var(--danger);  color: var(--danger);  font-weight: 800; }

/* ── Inputs ── */
.al-input {
  width: 100%; padding: 10px 13px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 9px;
  font-family: inherit; font-size: 13px; color: var(--text);
  outline: none; transition: border-color .17s; box-sizing: border-box;
}
.al-input::placeholder { color: var(--text-tertiary); }
.al-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0,102,255,.08); }

.al-textarea {
  width: 100%; padding: 11px 13px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 9px;
  resize: vertical; min-height: 100px; max-height: 220px;
  font-family: inherit; font-size: 13px; color: var(--text);
  outline: none; line-height: 1.6; transition: border-color .17s; box-sizing: border-box;
}
.al-textarea::placeholder { color: var(--text-tertiary); }
.al-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0,102,255,.08); }
.al-charcount { font-size: 10px; color: var(--text-tertiary); margin-top: 5px; text-align: right; }

/* ── Send button ── */
.al-send-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 12px;
  background: linear-gradient(135deg, var(--danger) 0%, #cc2e24 100%);
  border: none; border-radius: 9px;
  font-size: 13px; font-weight: 700; letter-spacing: 0.3px;
  color: #fff; cursor: pointer; transition: all .18s;
  box-shadow: 0 4px 12px rgba(255,59,48,.2); margin-top: 16px;
}
.al-send-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,59,48,.3); }
.al-send-btn:disabled { opacity: .5; cursor: not-allowed; }

/* ── Toast ── */
.al-toast {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-radius: 9px; margin-top: 12px;
  background: rgba(0,176,116,.08); border: 1px solid rgba(0,176,116,.25);
  font-size: 13px; color: var(--success);
  animation: alFadeIn .3s ease;
}

/* ── Log section ── */
.al-log-title {
  font-size: 11px; font-weight: 600; letter-spacing: 0.4px;
  text-transform: uppercase; color: var(--text-secondary); margin-bottom: 10px;
}
.al-log-list {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.al-log-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px; border-bottom: 1px solid var(--border);
  transition: background .15s;
}
.al-log-row:last-child { border-bottom: none; }
.al-log-row:hover { background: rgba(255,255,255,0.03); }
.al-log-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.al-log-content { flex: 1; min-width: 0; }
.al-log-title-text {
  font-size: 13px; font-weight: 600; color: var(--text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px;
}
.al-log-msg {
  font-size: 12px; color: var(--text-secondary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px;
}
.al-log-meta {
  display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
  font-size: 10px; color: var(--text-tertiary);
}
.al-log-empty {
  padding: 32px; text-align: center; font-size: 13px; color: var(--text-tertiary);
}
.al-log-delete {
  flex-shrink: 0; background: rgba(255,59,48,.06); border: 1px solid rgba(255,59,48,.2);
  border-radius: 6px; color: var(--danger); cursor: pointer;
  padding: 6px 8px; font-size: 11px;
  display: flex; align-items: center; transition: background .15s; align-self: center;
}
.al-log-delete:hover { background: rgba(255,59,48,.14); }

/* ── Shared tags ── */
.al-tpl-sev {
  font-size: 9px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase;
  padding: 2px 7px; border-radius: 4px; white-space: nowrap; border: 1px solid;
}
.al-tpl-audience {
  font-size: 9px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase;
  padding: 2px 7px; border-radius: 4px; white-space: nowrap; border: 1px solid;
}
.al-sev-info     { background: rgba(0,102,255,.08);  color: var(--primary); border-color: rgba(0,102,255,.2);  }
.al-sev-warning  { background: rgba(255,149,0,.08);  color: var(--warning); border-color: rgba(255,149,0,.2);  }
.al-sev-critical { background: rgba(255,59,48,.08);  color: var(--danger);  border-color: rgba(255,59,48,.2);  }
.al-aud-responder { background: rgba(0,102,255,.08); color: var(--primary); border-color: rgba(0,102,255,.2); }
.al-aud-citizen   { background: rgba(0,176,116,.08); color: var(--success); border-color: rgba(0,176,116,.2); }
.al-aud-all       { background: rgba(255,149,0,.08); color: var(--warning); border-color: rgba(255,149,0,.2); }

/* ── Spinner ── */
.al-spinner {
  display: inline-block; width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  animation: alSpin .7s linear infinite;
}

/* ── Templates panel ── */
.al-templates {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04); min-width: 0;
}
.al-templates-header {
  padding: 14px 16px 12px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  cursor: default; user-select: none;
}
.al-templates-header-left { display: flex; align-items: center; gap: 8px; }
.al-templates-title {
  font-size: 13px; font-weight: 700; color: var(--text);
  display: flex; align-items: center; gap: 7px;
}
.al-templates-title-icon {
  width: 24px; height: 24px; border-radius: 6px;
  background: rgba(255,149,0,.08); border: 1px solid rgba(255,149,0,.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--warning); flex-shrink: 0;
}
.al-templates-sub { font-size: 11px; color: var(--text-tertiary); }
.al-templates-toggle {
  display: none; background: none; border: none; color: var(--text-tertiary);
  cursor: pointer; font-size: 13px; padding: 2px; transition: color .15s;
}
.al-templates-toggle:hover { color: var(--text); }

/* Filter pills */
.al-tpl-filter {
  display: flex; gap: 4px; padding: 10px 12px 6px; flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
}
.al-tpl-pill {
  padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border);
  font-size: 10px; font-weight: 600; cursor: pointer; transition: all .15s;
  background: var(--bg); color: var(--text-secondary);
}
.al-tpl-pill:hover { border-color: var(--text-secondary); color: var(--text); }
.al-tpl-pill--all.active       { background: var(--bg); border-color: var(--text); color: var(--text); }
.al-tpl-pill--responder.active { background: rgba(0,102,255,.08); border-color: var(--primary); color: var(--primary); }
.al-tpl-pill--citizen.active   { background: rgba(0,176,116,.08); border-color: var(--success); color: var(--success); }
.al-tpl-pill--broadcast.active { background: rgba(255,149,0,.08); border-color: var(--warning); color: var(--warning); }

/* Template list */
.al-tpl-list {
  padding: 6px 8px 10px; max-height: 520px; overflow-y: auto;
  scrollbar-width: thin; scrollbar-color: var(--border) transparent;
}
.al-tpl-list::-webkit-scrollbar { width: 3px; }
.al-tpl-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.al-tpl-card {
  padding: 11px 12px; border-radius: 9px;
  border: 1px solid transparent; cursor: pointer;
  transition: all .16s; margin-bottom: 4px; background: rgba(8,12,20,0.93);
}
.al-tpl-card:last-child { margin-bottom: 0; }
.al-tpl-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); transform: translateX(2px); }
.al-tpl-card-top {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 5px; flex-wrap: wrap;
}
.al-tpl-icon {
  width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 11px;
  border: 1px solid;
}
.al-tpl-icon--responder { background: rgba(0,102,255,.08); color: var(--primary); border-color: rgba(0,102,255,.2); }
.al-tpl-icon--citizen   { background: rgba(0,176,116,.08); color: var(--success); border-color: rgba(0,176,116,.2); }
.al-tpl-icon--all       { background: rgba(255,149,0,.08); color: var(--warning); border-color: rgba(255,149,0,.2); }
.al-tpl-label {
  font-size: 12px; font-weight: 700; color: var(--text); flex: 1;
  min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.al-tpl-preview {
  font-size: 11px; color: var(--text-tertiary); line-height: 1.5;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ════ RESPONSIVE ════ */
@media (max-width: 960px) {
  .al-layout { grid-template-columns: 1fr; }
  .al-tpl-list { max-height: 320px; }
  .al-templates-toggle { display: flex; align-items: center; }
  .al-templates-header { cursor: pointer; }
}
@media (max-width: 640px) {
  .al-title { font-size: 24px; }
  .al-compose { padding: 16px; }
  .al-audience-group { gap: 5px; }
  .al-audience-btn { padding: 7px 10px; font-size: 11px; }
  .al-severity-group { gap: 4px; }
  .al-severity-btn { font-size: 10px; padding: 7px 4px; }
  .al-send-btn { padding: 11px; }
  .al-textarea { min-height: 90px; }
  .al-tpl-list { max-height: 260px; }
}
@media (max-width: 380px) {
  .al-severity-group { flex-direction: column; }
  .al-severity-btn { flex: unset; }
}
`,Ra={info:"#0066FF",warning:"#FF9500",critical:"#FF3B30"},me={responder:"Responders",citizen:"Citizens",all:"All"};function Ma(){const[a,r]=i.useState([]),[d,f]=i.useState(!0),[u,m]=i.useState(!1),[v,h]=i.useState(!1),[y,N]=i.useState(null),[k,F]=i.useState("all"),[S,j]=i.useState("info"),[t,x]=i.useState(""),[b,c]=i.useState(""),[w,l]=i.useState("all"),[E,_]=i.useState(!0);i.useEffect(()=>{(async()=>{const{data:T,error:z}=await g.from("alerts").select("*").order("created_at",{ascending:!1}).limit(30);z?N("Failed to load alerts: "+z.message):r(T??[]),f(!1)})();const W=g.channel("admin-alerts-log").on("postgres_changes",{event:"INSERT",schema:"public",table:"alerts"},T=>{r(z=>z.some(P=>P.id===T.new.id)?z:[T.new,...z])}).on("postgres_changes",{event:"DELETE",schema:"public",table:"alerts"},T=>{r(z=>z.filter(P=>P.id!==T.old.id))}).subscribe();return()=>{g.removeChannel(W)}},[]);const $=n=>{c(n.message),x(n.label),F(n.audience),j(n.severity),N(null),window.innerWidth<=960&&_(!1)},te=async()=>{if(!b.trim())return;m(!0),N(null);const n={title:t.trim()||"Alert",message:b.trim(),audience:k,severity:S,is_active:!0},{data:W,error:T}=await g.from("alerts").insert(n).select().single();if(T){N("Failed to send alert: "+T.message),m(!1);return}W&&r(z=>z.some(P=>P.id===W.id)?z:[W,...z]),m(!1),h(!0),x(""),c(""),setTimeout(()=>h(!1),3500)},q=async n=>{await g.from("alerts").delete().eq("id",n),r(W=>W.filter(T=>T.id!==n))},G=_a.filter(n=>w==="all"?!0:w==="broadcast"?n.audience==="all":n.audience===w),U=n=>n?new Date(n).toLocaleString("en-PH",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"—";return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:Aa}),e.jsxs("div",{className:"al-root",children:[e.jsx("div",{className:"al-header",children:e.jsxs("div",{children:[e.jsx("div",{className:"al-eyebrow",children:"Communications"}),e.jsx("h2",{className:"al-title",children:"Alerts & Broadcasts"}),e.jsx("p",{className:"al-subtitle",children:"Send targeted alerts to responders, citizens, or broadcast to all"})]})}),y&&e.jsxs("div",{className:"al-error-banner",children:[e.jsx(he,{size:12})," ",y]}),e.jsxs("div",{className:"al-layout",children:[e.jsxs("div",{className:"al-left",children:[e.jsxs("div",{className:"al-compose",children:[e.jsxs("div",{className:"al-compose-title",children:[e.jsx("div",{className:"al-compose-title-icon",children:e.jsx(ae,{size:12})}),"Compose Alert"]}),e.jsxs("div",{className:"al-field",children:[e.jsx("label",{className:"al-label",children:"Send To"}),e.jsx("div",{className:"al-audience-group",children:["responder","citizen","all"].map(n=>e.jsxs("button",{className:`al-audience-btn al-audience-btn--${n}${k===n?" active":""}`,onClick:()=>F(n),children:[n==="responder"&&e.jsx(ee,{size:11}),n==="citizen"&&e.jsx(re,{size:11}),n==="all"&&e.jsx(De,{size:11}),me[n]]},n))})]}),e.jsxs("div",{className:"al-field",children:[e.jsx("label",{className:"al-label",children:"Severity"}),e.jsx("div",{className:"al-severity-group",children:["info","warning","critical"].map(n=>e.jsx("button",{className:`al-severity-btn al-severity-btn--${n}${S===n?" active":""}`,onClick:()=>j(n),children:n},n))})]}),e.jsxs("div",{className:"al-field",children:[e.jsx("label",{className:"al-label",children:"Alert Title"}),e.jsx("input",{className:"al-input",placeholder:"e.g. Evacuation Order — Barangay 3",value:t,onChange:n=>x(n.target.value)})]}),e.jsxs("div",{className:"al-field",children:[e.jsx("label",{className:"al-label",children:"Message"}),e.jsx("textarea",{className:"al-textarea",placeholder:"Type your alert message here, or pick a template →",value:b,onChange:n=>c(n.target.value)}),e.jsxs("div",{className:"al-charcount",children:[b.length," characters"]})]}),e.jsx("button",{className:"al-send-btn",onClick:te,disabled:u||!b.trim(),children:u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"al-spinner"})," Sending…"]}):e.jsxs(e.Fragment,{children:[e.jsx(ae,{size:12})," Send Alert"]})}),v&&e.jsxs("div",{className:"al-toast",children:[e.jsx(ye,{size:13})," Alert sent successfully!"]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"al-log-title",children:["Recent Alerts (",a.length,")"]}),e.jsx("div",{className:"al-log-list",children:d?e.jsx("div",{className:"al-log-empty",children:"Loading…"}):a.length===0?e.jsx("div",{className:"al-log-empty",children:"No alerts sent yet"}):a.map(n=>e.jsxs("div",{className:"al-log-row",children:[e.jsx("div",{className:"al-log-dot",style:{background:Ra[n.severity]??"#0066FF"}}),e.jsxs("div",{className:"al-log-content",children:[e.jsx("div",{className:"al-log-title-text",children:n.title||"Alert"}),e.jsx("div",{className:"al-log-msg",children:n.message}),e.jsxs("div",{className:"al-log-meta",children:[e.jsx("span",{className:`al-tpl-audience al-aud-${n.audience??"all"}`,children:me[n.audience??"all"]}),e.jsx("span",{className:`al-tpl-sev al-sev-${n.severity??"info"}`,children:n.severity??"info"}),e.jsx("span",{children:U(n.created_at)})]})]}),e.jsx("button",{className:"al-log-delete",title:"Delete alert",onClick:()=>q(n.id),children:e.jsx(Ie,{size:10})})]},n.id))})]})]}),e.jsxs("div",{className:"al-templates",children:[e.jsxs("div",{className:"al-templates-header",onClick:()=>{window.innerWidth<=960&&_(n=>!n)},children:[e.jsxs("div",{className:"al-templates-header-left",children:[e.jsxs("div",{className:"al-templates-title",children:[e.jsx("div",{className:"al-templates-title-icon",children:e.jsx(ie,{size:11})}),"Templates"]}),e.jsxs("div",{className:"al-templates-sub",children:[G.length," available"]})]}),e.jsx("button",{className:"al-templates-toggle","aria-label":E?"Collapse":"Expand",onClick:n=>{n.stopPropagation(),_(W=>!W)},children:E?e.jsx($e,{size:12}):e.jsx(Pe,{size:12})})]}),E&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"al-tpl-filter",children:["all","responder","citizen","broadcast"].map(n=>e.jsx("button",{className:`al-tpl-pill al-tpl-pill--${n}${w===n?" active":""}`,onClick:()=>l(n),children:n==="broadcast"?"📢 All":n.charAt(0).toUpperCase()+n.slice(1)},n))}),e.jsx("div",{className:"al-tpl-list",children:G.map(n=>e.jsxs("div",{className:"al-tpl-card",onClick:()=>$(n),title:"Click to load into composer",children:[e.jsxs("div",{className:"al-tpl-card-top",children:[e.jsx("div",{className:`al-tpl-icon al-tpl-icon--${n.audience}`,children:n.icon}),e.jsx("div",{className:"al-tpl-label",children:n.label}),e.jsx("span",{className:`al-tpl-audience al-aud-${n.audience}`,children:me[n.audience]}),e.jsx("span",{className:`al-tpl-sev al-sev-${n.severity}`,children:n.severity})]}),e.jsx("div",{className:"al-tpl-preview",children:n.message})]},n.id))})]})]})]})]})]})}const pe={fire:{icon:"🔥",colorClass:"t-fire",accentColor:"#FF3B30"},accident:{icon:"🚗",colorClass:"t-accident",accentColor:"#FF9500"},flood:{icon:"🌊",colorClass:"t-flood",accentColor:"#0066FF"},crime:{icon:"🚨",colorClass:"t-crime",accentColor:"#FF2D55"},medical:{icon:"🏥",colorClass:"t-medical",accentColor:"#00B074"},other:{icon:"⚠️",colorClass:"t-other",accentColor:"#9CA3AF"}},Ce={pending:{label:"PENDING",colorClass:"s-pending"},"in-progress":{label:"IN PROGRESS",colorClass:"s-progress"},resolved:{label:"RESOLVED",colorClass:"s-resolved"}},Ta=[{id:"forwarded",label:"Forwarded to Department",icon:"↗"},{id:"follow-up",label:"Resolved — Needs Follow-Up",icon:"⟳"},{id:"fully-resolved",label:"Fully Resolved",icon:"✓"}],La=[{key:"pending",label:"Pending"},{key:"in-progress",label:"In Progress"},{key:"resolved",label:"Resolved"}];function Ba(a){const r=Math.floor((Date.now()-new Date(a).getTime())/1e3);return r<60?`${r}s ago`:r<3600?`${Math.floor(r/60)}m ago`:r<86400?`${Math.floor(r/3600)}h ago`:new Date(a).toLocaleDateString()}function Da(a){return new Date(a).toLocaleString("en-PH",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}function Qe(a){return/\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(a)}function se(...a){return a.filter(Boolean).join(" ")}function Ia(a){return a?a.split(" ").map(r=>r[0]).join("").slice(0,2).toUpperCase():"?"}const H=({path:a,size:r=16})=>e.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",dangerouslySetInnerHTML:{__html:a}}),V={mapPin:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",user:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",clock:"M12 2a10 10 0 1 0 10 10M12 6v6l4 2",check:"M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4l-10 10.01-3-3.01",x:"M18 6L6 18M6 6l12 12",image:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",video:"M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",extLink:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"},$a=`
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
`;function Pa({url:a,onClose:r}){const d=Qe(a);return i.useEffect(()=>{const f=u=>{u.key==="Escape"&&r()};return document.addEventListener("keydown",f),()=>document.removeEventListener("keydown",f)},[r]),e.jsx("div",{className:"ip-lightbox-backdrop",onClick:r,children:e.jsxs("div",{className:"ip-lightbox",onClick:f=>f.stopPropagation(),children:[e.jsx("button",{className:"ip-lightbox-close",onClick:r,children:"×"}),d?e.jsx("video",{src:a,controls:!0,autoPlay:!0,playsInline:!0}):e.jsx("img",{src:a,alt:"Evidence"}),e.jsx("span",{className:"ip-lightbox-label",children:d?"🎥 Video Evidence":"🖼 Photo Evidence"})]})})}function Oa({inc:a}){if(a.status!=="resolved"||!a.responder_notes&&!a.action_notes)return null;const r=Ta.find(d=>d.id===a.resolution_type);return e.jsxs("div",{className:"ip-resolution-box",children:[e.jsxs("div",{className:"ip-resolution-hd",children:[e.jsx(H,{path:V.check,size:11}),e.jsx("span",{className:"ip-resolution-hd-label",children:"Resolution Summary"}),r&&e.jsxs("span",{className:"ip-resolution-type-tag",children:[r.icon," ",r.label]})]}),e.jsxs("div",{className:"ip-resolution-body",children:[a.responder_notes&&e.jsxs("div",{className:"ip-resolution-section",children:[e.jsx("span",{className:"ip-resolution-section-lbl",children:"Response Notes"}),e.jsx("span",{className:"ip-resolution-section-val",children:a.responder_notes})]}),a.responder_notes&&a.action_notes&&e.jsx("div",{className:"ip-resolution-divider"}),a.action_notes&&e.jsxs("div",{className:"ip-resolution-section",children:[e.jsx("span",{className:"ip-resolution-section-lbl",children:"Action Taken"}),e.jsx("span",{className:"ip-resolution-section-val",children:a.action_notes})]})]}),a.resolved_at&&e.jsxs("div",{className:"ip-resolution-footer",children:["Resolved ",Da(a.resolved_at)]})]})}function Ua({incident:a,onClose:r,onConfirm:d}){const[f,u]=i.useState([]),[m,v]=i.useState(!0),[h,y]=i.useState(a.responder_id),[N,k]=i.useState(!1);i.useEffect(()=>{g.from("responders").select("id, name, email, status, on_duty").order("name",{ascending:!0}).then(({data:j})=>{u(j??[]),v(!1)})},[]),i.useEffect(()=>{const j=t=>{t.key==="Escape"&&r()};return document.addEventListener("keydown",j),()=>document.removeEventListener("keydown",j)},[r]);const F=async()=>{h&&(k(!0),await d(h),k(!1),r())},S=pe[a.type]??pe.other;return e.jsx("div",{className:"ip-modal-backdrop",onClick:j=>{j.target.classList.contains("ip-modal-backdrop")&&r()},children:e.jsxs("div",{className:"ip-modal",children:[e.jsxs("div",{className:"ip-modal-hd",children:[e.jsx("div",{className:"ip-modal-icon",children:e.jsx(H,{path:V.users,size:20})}),e.jsxs("div",{className:"ip-modal-title-wrap",children:[e.jsx("div",{className:"ip-modal-title",children:"Reassign Incident"}),e.jsx("div",{className:"ip-modal-sub",children:"Select a responder"})]}),e.jsx("button",{className:"ip-modal-close",onClick:r,children:e.jsx(H,{path:V.x,size:18})})]}),e.jsxs("div",{className:"ip-modal-body",children:[e.jsxs("div",{className:"ip-modal-strip",children:[e.jsxs("strong",{children:[S.icon," ",a.type.toUpperCase()]})," · ",a.address||a.location||"Unknown location",a.description&&e.jsxs("div",{style:{marginTop:4,color:"var(--text-secondary)"},children:[a.description.slice(0,80),a.description.length>80?"…":""]})]}),m?e.jsx("div",{className:"ip-modal-loading",children:e.jsx("div",{className:"ip-spinner",style:{margin:"0 auto"}})}):f.length===0?e.jsx("div",{className:"ip-modal-empty",children:"No responders found."}):e.jsx("div",{className:"ip-responder-list",children:f.map(j=>e.jsxs("div",{className:se("ip-responder-option",h===j.id&&"selected"),onClick:()=>y(j.id),children:[e.jsx("div",{className:"ip-responder-avatar",children:Ia(j.name)}),e.jsxs("div",{className:"ip-responder-info",children:[e.jsx("div",{className:"ip-responder-name",children:j.name??"Unnamed"}),e.jsxs("div",{className:"ip-responder-detail",children:[j.on_duty?"🟢 On Duty":"⚫ Off Duty"," · ",j.email??"No email"]})]}),e.jsx("span",{className:"ip-responder-check",children:"✓"})]},j.id))})]}),e.jsxs("div",{className:"ip-modal-ft",children:[e.jsx("button",{className:"ip-modal-cancel",onClick:r,children:"Cancel"}),e.jsx("button",{className:"ip-modal-confirm",disabled:!h||N||m,onClick:F,children:N?"Assigning…":"Assign Responder"})]})]})})}function Ya({incident:a,onClose:r,onConfirm:d}){const[f,u]=i.useState(!1);i.useEffect(()=>{const v=h=>{h.key==="Escape"&&r()};return document.addEventListener("keydown",v),()=>document.removeEventListener("keydown",v)},[r]);const m=async()=>{u(!0),await d(),u(!1),r()};return e.jsx("div",{className:"ip-modal-backdrop",onClick:v=>{v.target.classList.contains("ip-modal-backdrop")&&r()},children:e.jsxs("div",{className:"ip-modal",style:{maxWidth:380},children:[e.jsxs("div",{className:"ip-modal-hd",children:[e.jsx("div",{className:"ip-modal-icon ic-green",children:e.jsx(H,{path:V.check,size:20})}),e.jsxs("div",{className:"ip-modal-title-wrap",children:[e.jsx("div",{className:"ip-modal-title",children:"Mark as Resolved?"}),e.jsx("div",{className:"ip-modal-sub",children:"Confirm resolution"})]}),e.jsx("button",{className:"ip-modal-close",onClick:r,children:e.jsx(H,{path:V.x,size:18})})]}),e.jsx("div",{className:"ip-modal-body",children:e.jsxs("div",{className:"ip-modal-strip",style:{textAlign:"center"},children:["This will mark the incident as resolved and move it out of the active queue.",a.description&&e.jsxs("div",{style:{marginTop:8,color:"var(--primary)",fontStyle:"italic"},children:['"',a.description.slice(0,80),a.description.length>80?"…":"",'"']})]})}),e.jsxs("div",{className:"ip-modal-ft",style:{justifyContent:"center"},children:[e.jsx("button",{className:"ip-modal-cancel",onClick:r,children:"Cancel"}),e.jsx("button",{className:"ip-modal-confirm c-green",disabled:f,onClick:m,children:f?"Resolving…":"Yes, Resolve"})]})]})})}function Ha(){const[a,r]=i.useState([]),[d,f]=i.useState("pending"),[u,m]=i.useState({pending:0,"in-progress":0,resolved:0}),[v,h]=i.useState(!0),[y,N]=i.useState(null),[k,F]=i.useState(null),[S,j]=i.useState(null),t=async l=>{h(!0);const{data:E}=await g.from("reports").select("id,type,description,description_lang,description_translated,location,address,reporter_name,reporter_contact,status,evidence_url,created_at,responder_id,responder_notes,action_notes,resolution_type,resolved_at").eq("status",l).order("created_at",{ascending:!1});r(E??[]),h(!1)},x=async()=>{const l=["pending","in-progress","resolved"],E=await Promise.all(l.map(_=>g.from("reports").select("id",{count:"exact",head:!0}).eq("status",_)));m({pending:E[0].count??0,"in-progress":E[1].count??0,resolved:E[2].count??0})};i.useEffect(()=>{x()},[]),i.useEffect(()=>{t(d)},[d]);const b=async l=>{k&&(await g.from("reports").update({responder_id:l,status:"in-progress"}).eq("id",k.id),t(d),x())},c=async()=>{S&&(await g.from("reports").update({status:"resolved"}).eq("id",S.id),t(d),x())},w={pending:"active-pending","in-progress":"active-in-progress",resolved:"active-resolved"};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:$a}),e.jsxs("div",{className:"ip-root",children:[e.jsxs("div",{className:"ip-header",children:[e.jsxs("div",{children:[e.jsx("div",{className:"ip-eyebrow",children:"Admin Panel"}),e.jsx("h1",{className:"ip-title",children:"Incidents Oversight"})]}),e.jsx("div",{className:"ip-filters",children:La.map(l=>e.jsx("button",{className:se("ip-filter-btn",d===l.key&&w[l.key]),onClick:()=>f(l.key),children:l.label},l.key))})]}),e.jsxs("div",{className:"ip-stats",children:[e.jsxs("div",{className:"ip-stat s-pending",children:[e.jsx("div",{className:"ip-stat-label",children:"Pending"}),e.jsx("div",{className:"ip-stat-value",children:u.pending})]}),e.jsxs("div",{className:"ip-stat s-progress",children:[e.jsx("div",{className:"ip-stat-label",children:"In Progress"}),e.jsx("div",{className:"ip-stat-value",children:u["in-progress"]})]}),e.jsxs("div",{className:"ip-stat s-resolved",children:[e.jsx("div",{className:"ip-stat-label",children:"Resolved"}),e.jsx("div",{className:"ip-stat-value",children:u.resolved})]})]}),v?e.jsx("div",{className:"ip-loading",children:e.jsx("div",{className:"ip-spinner",style:{margin:"0 auto"}})}):a.length===0?e.jsxs("div",{className:"ip-empty",children:["No ",d," incidents found"]}):e.jsx("div",{className:"ip-grid",children:a.map(l=>{const E=pe[l.type]??pe.other,_=Ce[l.status]??Ce.pending,$=l.evidence_url&&Qe(l.evidence_url);return e.jsxs("div",{className:se("ip-card",E.colorClass),children:[e.jsx("div",{className:"ip-card-bar"}),e.jsxs("div",{className:"ip-card-body",children:[e.jsxs("div",{className:"ip-card-top",children:[e.jsxs("div",{className:"ip-card-label",children:[e.jsx("span",{children:E.icon}),e.jsx("span",{style:{textTransform:"capitalize"},children:l.type})]}),e.jsx("span",{className:se("ip-badge",_.colorClass),children:_.label})]}),e.jsxs("div",{className:"ip-fields",children:[e.jsxs("div",{className:"ip-field",children:[e.jsxs("span",{className:"ip-field-lbl",children:[e.jsx(H,{path:V.mapPin,size:10})," Location"]}),e.jsx("span",{className:"ip-field-val",title:l.address||l.location||"—",children:l.address||l.location||"—"})]}),e.jsxs("div",{className:"ip-fields-row",children:[e.jsxs("div",{className:"ip-field",children:[e.jsxs("span",{className:"ip-field-lbl",children:[e.jsx(H,{path:V.user,size:10})," Reporter"]}),e.jsx("span",{className:"ip-field-val",children:l.reporter_name||"Anonymous"})]}),e.jsxs("div",{className:"ip-field",children:[e.jsxs("span",{className:"ip-field-lbl",children:[e.jsx(H,{path:V.clock,size:10})," Reported"]}),e.jsx("span",{className:"ip-field-val",children:Ba(l.created_at)})]})]}),l.reporter_contact&&e.jsxs("div",{className:"ip-field",children:[e.jsxs("span",{className:"ip-field-lbl",children:[e.jsx(H,{path:V.phone,size:10})," Contact"]}),e.jsx("a",{href:`tel:${l.reporter_contact}`,className:"ip-field-val ip-field-tel",children:l.reporter_contact})]}),e.jsxs("div",{className:"ip-field",children:[e.jsxs("span",{className:"ip-field-lbl",children:[e.jsx(H,{path:V.users,size:10})," Responder"]}),e.jsx("span",{className:se("ip-responder-chip",l.responder_id?"assigned":"unassigned"),children:l.responder_id?`ID: ${l.responder_id.slice(0,8)}…`:"Unassigned"})]})]}),l.description&&e.jsx(Ea,{description:l.description,descriptionLang:l.description_lang,descriptionTranslated:l.description_translated,className:"ip-desc"}),e.jsx(Oa,{inc:l}),l.evidence_url&&e.jsxs("div",{className:"ip-ev-wrap",children:[$?e.jsx("video",{className:"ip-ev-video",src:l.evidence_url,controls:!0,preload:"metadata"}):e.jsx("img",{className:"ip-ev-img",src:l.evidence_url,alt:"Evidence",onClick:()=>N(l.evidence_url)}),e.jsxs("div",{className:"ip-ev-bar",children:[e.jsxs("span",{className:"ip-ev-type",children:[$?e.jsx(H,{path:V.video,size:12}):e.jsx(H,{path:V.image,size:12}),$?"Video":"Photo"]}),e.jsxs("a",{href:l.evidence_url,target:"_blank",rel:"noopener noreferrer",className:"ip-ev-link",children:["Open ",e.jsx(H,{path:V.extLink,size:10})]})]})]}),e.jsxs("div",{className:"ip-actions",children:[e.jsxs("button",{className:"ip-btn ip-btn-reassign",onClick:()=>F(l),children:[e.jsx(H,{path:V.users,size:12})," Reassign"]}),l.status!=="resolved"&&e.jsxs("button",{className:"ip-btn ip-btn-resolve",onClick:()=>j(l),children:[e.jsx(H,{path:V.check,size:12})," Resolve"]})]})]})]},l.id)})})]}),y&&e.jsx(Pa,{url:y,onClose:()=>N(null)}),k&&e.jsx(Ua,{incident:k,onClose:()=>F(null),onConfirm:b}),S&&e.jsx(Ya,{incident:S,onClose:()=>j(null),onConfirm:c})]})}const Va=`
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

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes ia-fadeIn  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: none; } }
@keyframes ia-slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
@keyframes ia-pulse   { 0%,100% { opacity:1; } 50% { opacity:0.6; } }

.ia-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  min-height: 100vh;
}

/* ── Header ── */
.ia-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
  animation: ia-fadeIn 0.4s ease both;
}

.ia-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--primary); margin-bottom: 6px;
  display: flex; align-items: center; gap: 8px;
}

.ia-eyebrow::before {
  content: ''; display: block; width: 20px; height: 2px;
  background: var(--primary);
}

.ia-title {
  font-size: 32px; font-weight: 700; letter-spacing: -0.5px;
  color: var(--text); line-height: 1.1; margin: 0 0 4px;
}

.ia-subtitle {
  font-size: 12px; color: var(--text-tertiary); margin: 0;
}

/* ── Stat grid ── */
.ia-stats {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px; margin-bottom: 24px;
}

.ia-stat {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px; position: relative; overflow: hidden;
  transition: all 0.3s; cursor: default; animation: ia-fadeIn 0.5s ease-out both;
}

.ia-stat:nth-child(2) { animation-delay: 0.05s; }
.ia-stat:nth-child(3) { animation-delay: 0.10s; }
.ia-stat:nth-child(4) { animation-delay: 0.15s; }

.ia-stat:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 8px 16px rgba(0,102,255,0.10);
}

.ia-stat::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--is-color);
}

.ia-stat-num {
  font-size: 32px; line-height: 1; margin-bottom: 6px;
  letter-spacing: -0.5px; font-weight: 700; color: var(--is-color);
}

.ia-stat-label {
  font-size: 11px; color: var(--text-secondary);
  letter-spacing: 0.3px; text-transform: uppercase; font-weight: 500;
}

.ia-stat-pct {
  font-size: 10.5px; color: var(--text-tertiary); margin-top: 6px;
}

/* ── Grid layout ── */
.ia-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}

@media (max-width: 1024px) { .ia-grid { grid-template-columns: 1fr; } }

.ia-panel {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px; position: relative; overflow: hidden;
  animation: ia-slideIn 0.5s ease-out both;
}

.ia-panel:nth-child(2) { animation-delay: 0.1s; }
.ia-panel:nth-child(3) { animation-delay: 0.15s; }
.ia-panel:nth-child(4) { animation-delay: 0.2s; }

.ia-panel-full { grid-column: 1 / -1; }

.ia-panel-title {
  font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--text-secondary);
  margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border);
}

/* ── Horizontal bar chart ── */
.ia-hbar-row {
  display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
}

.ia-hbar-row:last-child { margin-bottom: 0; }

.ia-hbar-label {
  font-size: 12px; color: var(--text-secondary); width: 80px;
  flex-shrink: 0; font-weight: 500;
}

.ia-hbar-track {
  flex: 1; height: 6px; border-radius: 3px;
  background: var(--border); overflow: hidden;
}

.ia-hbar-fill {
  height: 100%; border-radius: 3px; background: var(--hb-color);
  transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
}

.ia-hbar-val {
  font-size: 12px; font-weight: 600; color: var(--hb-color);
  width: 24px; text-align: right; flex-shrink: 0;
}

/* ── Vertical bar chart ── */
.ia-vbar-wrap {
  display: flex; align-items: flex-end; gap: 8px;
  height: 160px; padding-bottom: 20px; position: relative;
}

.ia-vbar-col {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 6px; height: 100%; justify-content: flex-end;
}

.ia-vbar-bar {
  width: 100%; border-radius: 6px 6px 0 0; background: var(--vb-color);
  min-height: 3px; transition: height 0.5s cubic-bezier(0.4,0,0.2,1);
  position: relative;
}

.ia-vbar-bar:hover::after {
  content: attr(data-val);
  position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
  background: rgba(15,21,33,0.95); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px; padding: 4px 8px;
  font-size: 11px; font-weight: 600; color: #fff;
  white-space: nowrap; pointer-events: none; margin-bottom: 6px;
}

.ia-vbar-xlabel {
  font-size: 11px; color: var(--text-secondary); text-align: center;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  max-width: 100%; font-weight: 500;
}

/* ── Donut chart ── */
.ia-donut-wrap {
  display: flex; align-items: center; gap: 28px;
}

.ia-donut-ring {
  width: 120px; height: 120px; flex-shrink: 0;
}

.ia-donut-legend {
  display: flex; flex-direction: column; gap: 12px; flex: 1;
}

.ia-donut-legend-item {
  display: flex; align-items: center; gap: 10px;
}

.ia-donut-legend-dot {
  width: 8px; height: 8px; border-radius: 3px; flex-shrink: 0;
}

.ia-donut-legend-label {
  font-size: 12px; color: var(--text-secondary); flex: 1; font-weight: 500;
}

.ia-donut-legend-val {
  font-size: 13px; font-weight: 600; color: var(--text);
}

/* ── Resolution rate ── */
.ia-res-rate-wrap {
  display: flex; align-items: center; gap: 24px;
}

.ia-res-rate-num {
  font-size: 48px; font-weight: 700; line-height: 1;
  color: var(--success);
}

.ia-res-rate-label {
  font-size: 12px; color: var(--text-secondary); line-height: 1.6;
}

.ia-res-bar-track {
  margin-top: 16px; height: 8px; border-radius: 4px;
  background: var(--border); overflow: hidden;
}

.ia-res-bar-fill {
  height: 100%; border-radius: 4px; background: var(--success);
  transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
}

/* ── Empty state ── */
.ia-empty {
  font-size: 12px; letter-spacing: 0.3px;
  color: var(--text-secondary); text-transform: uppercase; margin: 0;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .ia-title { font-size: 26px; }
  .ia-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .ia-stat-num { font-size: 24px; }
  .ia-donut-wrap { flex-direction: column; gap: 16px; }
  .ia-vbar-wrap { height: 120px; }
}

@media (max-width: 420px) {
  .ia-stats { grid-template-columns: 1fr; }
}
`,qa=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],Ee={fire:"#FF3B30",flood:"#0066FF",crime:"#FF2D55",medical:"#00B074",accident:"#FF9500",other:"#9CA3AF"};function Ga(){const[a,r]=i.useState([]);i.useEffect(()=>{(async()=>{const{data:w}=await g.from("reports").select("*").order("created_at",{ascending:!0});r(w||[])})()},[]);const d=a.length,f=a.filter(c=>c.status==="pending").length,u=a.filter(c=>c.status==="in-progress").length,m=a.filter(c=>c.status==="resolved").length,v=d>0?Math.round(m/d*100):0,h=new Date,y=Array.from({length:6},(c,w)=>{const l=new Date(h.getFullYear(),h.getMonth()-(5-w),1),E=a.filter(_=>{const $=new Date(_.created_at);return $.getFullYear()===l.getFullYear()&&$.getMonth()===l.getMonth()}).length;return{label:qa[l.getMonth()],count:E}}),N=Math.max(...y.map(c=>c.count),1),k={};a.forEach(c=>{const w=(c.type||"other").toLowerCase();k[w]=(k[w]||0)+1});const F=Object.entries(k).sort((c,w)=>w[1]-c[1]),S=Math.max(...F.map(c=>c[1]),1),j=[{label:"Resolved",count:m,color:"#00B074"},{label:"In Progress",count:u,color:"#FF9500"},{label:"Pending",count:f,color:"#FF3B30"}],t=50,x=2*Math.PI*t;let b=0;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:Va}),e.jsxs("div",{className:"ia-root",children:[e.jsx("div",{className:"ia-header",children:e.jsxs("div",{children:[e.jsx("div",{className:"ia-eyebrow",children:"Management"}),e.jsx("h1",{className:"ia-title",children:"Analytics"}),e.jsx("p",{className:"ia-subtitle",children:"Incident data & statistical insights"})]})}),e.jsx("div",{className:"ia-stats",children:[{label:"Total Reports",value:d,color:"#0066FF"},{label:"Pending",value:f,color:"#FF3B30"},{label:"In Progress",value:u,color:"#FF9500"},{label:"Resolved",value:m,color:"#00B074"}].map(c=>e.jsxs("div",{className:"ia-stat",style:{"--is-color":c.color},children:[e.jsx("div",{className:"ia-stat-num",children:c.value}),e.jsx("div",{className:"ia-stat-label",children:c.label})]},c.label))}),e.jsxs("div",{className:"ia-grid",children:[e.jsxs("div",{className:"ia-panel ia-panel-full",children:[e.jsx("div",{className:"ia-panel-title",children:"Monthly Incident Trend (Last 6 Months)"}),e.jsx("div",{className:"ia-vbar-wrap",children:y.map(c=>e.jsxs("div",{className:"ia-vbar-col",children:[e.jsx("div",{className:"ia-vbar-bar","data-val":c.count,style:{height:`${Math.round(c.count/N*100)}%`,"--vb-color":"#0066FF"}}),e.jsx("span",{className:"ia-vbar-xlabel",children:c.label})]},c.label))})]}),e.jsxs("div",{className:"ia-panel",children:[e.jsx("div",{className:"ia-panel-title",children:"Incidents by Type"}),F.length===0?e.jsx("p",{className:"ia-empty",children:"No data yet."}):F.map(([c,w])=>e.jsxs("div",{className:"ia-hbar-row",children:[e.jsx("span",{className:"ia-hbar-label",children:c.charAt(0).toUpperCase()+c.slice(1)}),e.jsx("div",{className:"ia-hbar-track",children:e.jsx("div",{className:"ia-hbar-fill",style:{width:`${Math.round(w/S*100)}%`,"--hb-color":Ee[c]??"#9CA3AF"}})}),e.jsx("span",{className:"ia-hbar-val",style:{"--hb-color":Ee[c]??"#9CA3AF"},children:w})]},c))]}),e.jsxs("div",{className:"ia-panel",children:[e.jsx("div",{className:"ia-panel-title",children:"Status Distribution"}),e.jsxs("div",{className:"ia-donut-wrap",children:[e.jsxs("svg",{className:"ia-donut-ring",viewBox:"0 0 120 120",children:[e.jsx("circle",{cx:"60",cy:"60",r:t,fill:"none",stroke:"var(--border)",strokeWidth:"14"}),d===0?null:j.map(c=>{const w=c.count/d*x,l=x-w,E=e.jsx("circle",{cx:"60",cy:"60",r:t,fill:"none",stroke:c.color,strokeWidth:"14",strokeDasharray:`${w} ${l}`,strokeDashoffset:-b,strokeLinecap:"round",transform:"rotate(-90 60 60)",style:{opacity:.9}},c.label);return b+=w,E}),e.jsx("text",{x:"60",y:"56",textAnchor:"middle",fill:"#eef0f7",fontSize:"20",fontWeight:"700",fontFamily:"inherit",children:d}),e.jsx("text",{x:"60",y:"71",textAnchor:"middle",fill:"rgba(238,240,247,0.28)",fontSize:"10",fontFamily:"inherit",children:"TOTAL"})]}),e.jsx("div",{className:"ia-donut-legend",children:j.map(c=>e.jsxs("div",{className:"ia-donut-legend-item",children:[e.jsx("div",{className:"ia-donut-legend-dot",style:{background:c.color}}),e.jsx("span",{className:"ia-donut-legend-label",children:c.label}),e.jsx("span",{className:"ia-donut-legend-val",children:c.count})]},c.label))})]})]}),e.jsxs("div",{className:"ia-panel ia-panel-full",children:[e.jsx("div",{className:"ia-panel-title",children:"Resolution Rate"}),e.jsxs("div",{className:"ia-res-rate-wrap",children:[e.jsxs("div",{className:"ia-res-rate-num",children:[v,"%"]}),e.jsxs("div",{className:"ia-res-rate-label",children:["of all reported incidents",e.jsx("br",{}),"have been resolved"]})]}),e.jsx("div",{className:"ia-res-bar-track",children:e.jsx("div",{className:"ia-res-bar-fill",style:{width:`${v}%`}})})]})]})]})]})}const Wa=`
  .rp-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--text, #1F2937);
  }
  .rp-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap;
    gap: 14px; margin-bottom: 24px;
  }
  .rp-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: .5px;
    text-transform: uppercase; color: var(--primary, #0066FF);
    display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
  }
  .rp-eyebrow::before {
    content: ''; display: block; width: 20px; height: 2px;
    background: var(--primary, #0066FF);
  }
  .rp-title {
    font-size: 28px; font-weight: 700; color: var(--text, #1F2937);
    letter-spacing: -.5px; margin: 0 0 4px; line-height: 1.1;
  }
  .rp-subtitle {
    font-size: 11px; color: var(--text-tertiary, #9CA3AF);
    margin: 0; letter-spacing: .3px;
  }
  .rp-add-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px;
    background: linear-gradient(135deg, #0066FF 0%, #0052cc 100%);
    border: none; border-radius: 8px;
    font-family: inherit;
    font-size: 13px; font-weight: 600;
    color: #fff; cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,102,255,.2);
    transition: all .18s; white-space: nowrap;
  }
  .rp-add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0,102,255,.3);
  }

  /* Stats */
  .rp-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px; margin-bottom: 24px;
  }
  .rp-stat {
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 12px; padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: all .3s; cursor: default;
  }
  .rp-stat:hover {
    transform: translateY(-3px);
    border-color: var(--s-accent);
    box-shadow: 0 6px 16px rgba(0,0,0,.06);
  }
  .rp-stat::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: var(--s-accent);
  }
  .rp-stat-num {
    font-size: 28px; font-weight: 700;
    color: var(--s-accent); line-height: 1; margin-bottom: 4px;
  }
  .rp-stat-label {
    font-size: 11px; color: var(--text-secondary, #6B7280);
    letter-spacing: .3px; text-transform: uppercase; font-weight: 500;
  }

  /* Tabs */
  .rp-tabs {
    display: flex; gap: 4px;
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 10px; padding: 4px;
    width: fit-content; margin-bottom: 14px;
  }
  .rp-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 7px; border: 1px solid transparent;
    font-family: inherit;
    font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .17s;
    background: transparent; color: var(--text-secondary, #6B7280);
  }
  .rp-tab:hover {
    color: var(--text, #1F2937);
    background: var(--surface, #fff);
    border-color: var(--border, #E5E7EB);
  }
  .rp-tab.active {
    background: linear-gradient(135deg, #0066FF 0%, #0052cc 100%);
    color: #fff; border-color: transparent; font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,102,255,.2);
  }
  .rp-tab-count {
    background: rgba(0,0,0,.06);
    border-radius: 6px; padding: 1px 7px;
    font-size: 10px; font-weight: 700;
    color: var(--text-secondary, #6B7280);
  }
  .rp-tab.active .rp-tab-count {
    background: rgba(255,255,255,.2);
    color: rgba(255,255,255,.9);
  }

  /* Duty filter */
  .rp-duty-filter { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
  .rp-duty-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 20px; border: 1px solid;
    font-family: inherit;
    font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all .17s; background: transparent;
  }
  .rp-duty-pill--all {
    border-color: var(--border, #E5E7EB);
    color: var(--text-secondary, #6B7280);
  }
  .rp-duty-pill--all.active,
  .rp-duty-pill--all:hover {
    background: var(--bg, #FAFBFC);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text, #1F2937);
  }
  .rp-duty-pill--on { border-color: rgba(0,176,116,.25); color: #00B074; }
  .rp-duty-pill--on.active, .rp-duty-pill--on:hover {
    background: rgba(0,176,116,.06); border-color: #00B074;
  }
  .rp-duty-pill--off { border-color: var(--border, #E5E7EB); color: var(--text-tertiary, #9CA3AF); }
  .rp-duty-pill--off.active, .rp-duty-pill--off:hover {
    background: var(--bg, #FAFBFC);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text-secondary, #6B7280);
  }
  .rp-duty-dot { width: 6px; height: 6px; border-radius: 50%; }

  /* Toolbar */
  .rp-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
  .rp-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 320px; }
  .rp-search-icon {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: var(--text-tertiary, #9CA3AF); font-size: 12px; pointer-events: none;
  }
  .rp-search {
    width: 100%; padding: 8px 12px 8px 32px;
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px;
    font-family: inherit;
    font-size: 13px; color: var(--text, #1F2937);
    outline: none; transition: border-color .17s;
    box-sizing: border-box;
  }
  .rp-search::placeholder { color: var(--text-tertiary, #9CA3AF); }
  .rp-search:focus { border-color: var(--primary, #0066FF); box-shadow: 0 0 0 3px rgba(0,102,255,.08); }
  .rp-refresh-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px;
    font-family: inherit;
    font-size: 13px; color: var(--text-secondary, #6B7280);
    cursor: pointer; transition: all .17s;
  }
  .rp-refresh-btn:hover {
    background: var(--bg, #FAFBFC);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text, #1F2937);
  }
  .rp-refresh-btn.spinning svg { animation: rpSpin .7s linear infinite; }
  @keyframes rpSpin { to { transform: rotate(360deg); } }

  /* Notice */
  .rp-notice {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 11px 14px;
    background: rgba(0,102,255,.04);
    border: 1px solid rgba(0,102,255,.14);
    border-radius: 8px; margin-bottom: 16px;
    font-size: 12.5px; color: var(--text-secondary, #6B7280); line-height: 1.6;
  }
  .rp-notice-icon { color: var(--primary, #0066FF); margin-top: 2px; flex-shrink: 0; }

  /* Table */
  .rp-table-wrap {
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 12px; overflow: hidden;
    overflow-x: auto;
  }
  .rp-table { width: 100%; border-collapse: collapse; }
  .rp-table thead tr { border-bottom: 1px solid var(--border, #E5E7EB); background: var(--bg, #FAFBFC); }
  .rp-table th {
    padding: 11px 16px;
    font-size: 10px; font-weight: 600;
    letter-spacing: .5px; text-transform: uppercase;
    color: var(--text-tertiary, #9CA3AF); text-align: left;
    white-space: nowrap;
  }
  .rp-table td {
    padding: 13px 16px;
    font-size: 13px; color: var(--text-secondary, #6B7280);
    border-bottom: 1px solid var(--border, #E5E7EB);
    vertical-align: middle;
  }
  .rp-table tbody tr:last-child td { border-bottom: none; }
  .rp-table tbody tr:hover td { background: var(--bg, #FAFBFC); }

  /* Avatar */
  .rp-avatar {
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 11px; flex-shrink: 0;
    font-family: inherit;
  }
  .rp-avatar-responder {
    background: rgba(0,102,255,.1);
    color: var(--primary, #0066FF);
    border: 1px solid rgba(0,102,255,.18);
  }
  .rp-avatar-citizen {
    background: rgba(0,176,116,.1);
    color: #00B074;
    border: 1px solid rgba(0,176,116,.18);
  }
  .rp-name-cell { display: flex; align-items: center; gap: 10px; }
  .rp-name { font-weight: 600; color: var(--text, #1F2937); font-size: 13px; }
  .rp-source-tag {
    display: inline-flex; align-items: center; gap: 3px;
    padding: 2px 7px; border-radius: 4px;
    font-size: 9px; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase;
  }
  .rp-tag-auth {
    background: rgba(0,176,116,.08);
    border: 1px solid rgba(0,176,116,.18);
    color: #00B074;
  }
  .rp-tag-manual {
    background: rgba(255,149,0,.08);
    border: 1px solid rgba(255,149,0,.2);
    color: #FF9500;
  }

  /* Badges */
  .rp-status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 8px; border-radius: 4px;
    font-size: 10px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .06em;
  }
  .rp-status-active {
    background: rgba(0,176,116,.08);
    border: 1px solid rgba(0,176,116,.2);
    color: #00B074;
  }
  .rp-status-inactive {
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    color: var(--text-tertiary, #9CA3AF);
  }
  .rp-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .rp-duty-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 8px; border-radius: 4px;
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .06em;
  }
  .rp-duty-badge--on {
    background: rgba(0,176,116,.08);
    border: 1px solid rgba(0,176,116,.2);
    color: #00B074;
  }
  .rp-duty-badge--off {
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    color: var(--text-tertiary, #9CA3AF);
  }
  .rp-duty-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Last seen */
  .rp-lastseen { font-size: 12px; color: var(--text-secondary, #6B7280); white-space: nowrap; }
  .rp-lastseen--none { color: var(--text-tertiary, #9CA3AF); font-style: italic; }

  /* Action buttons */
  .rp-duty-toggle {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 6px; border: 1px solid;
    font-family: inherit; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all .16s;
  }
  .rp-duty-toggle--on {
    background: rgba(0,176,116,.06);
    border-color: rgba(0,176,116,.2);
    color: #00B074;
  }
  .rp-duty-toggle--on:hover {
    background: rgba(0,176,116,.12);
    border-color: #00B074;
  }
  .rp-duty-toggle--off {
    background: var(--bg, #FAFBFC);
    border-color: var(--border, #E5E7EB);
    color: var(--text-secondary, #6B7280);
  }
  .rp-duty-toggle--off:hover {
    background: var(--surface, #fff);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text, #1F2937);
  }
  .rp-action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .rp-btn-edit, .rp-btn-remove {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 6px; border: 1px solid;
    font-family: inherit; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all .16s;
  }
  .rp-btn-edit {
    background: rgba(0,102,255,.06);
    border-color: rgba(0,102,255,.18);
    color: var(--primary, #0066FF);
  }
  .rp-btn-edit:hover {
    background: rgba(0,102,255,.12);
    border-color: var(--primary, #0066FF);
  }
  .rp-btn-remove {
    background: rgba(255,59,48,.05);
    border-color: rgba(255,59,48,.18);
    color: var(--danger, #FF3B30);
  }
  .rp-btn-remove:hover {
    background: rgba(255,59,48,.1);
    border-color: var(--danger, #FF3B30);
  }

  /* Empty state */
  .rp-empty { text-align: center; padding: 52px 20px; color: var(--text-tertiary, #9CA3AF); }
  .rp-empty-icon { font-size: 28px; margin-bottom: 12px; opacity: .35; }
  .rp-empty-text { font-size: 13px; }

  /* Modal overlay */
  .rp-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.35);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .rp-modal {
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 16px; padding: 28px;
    width: 100%; max-width: 440px;
    box-shadow: 0 12px 40px rgba(0,0,0,.1);
    animation: rpModalIn .2s ease;
  }
  @keyframes rpModalIn {
    from { opacity: 0; transform: translateY(8px) scale(.98); }
    to   { opacity: 1; transform: none; }
  }
  .rp-modal-title {
    font-size: 18px; font-weight: 700;
    color: var(--text, #1F2937); margin: 0 0 5px;
  }
  .rp-modal-sub {
    font-size: 13px; color: var(--text-secondary, #6B7280);
    margin: 0 0 20px; line-height: 1.6;
  }

  /* Auth account toggle */
  .rp-auth-toggle {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px;
    background: rgba(0,102,255,.04);
    border: 1px solid rgba(0,102,255,.14);
    border-radius: 8px; margin-bottom: 16px; cursor: pointer;
    transition: background .17s;
  }
  .rp-auth-toggle:hover { background: rgba(0,102,255,.07); }
  .rp-auth-toggle-left { display: flex; flex-direction: column; gap: 2px; }
  .rp-auth-toggle-label { font-size: 13px; font-weight: 600; color: var(--primary, #0066FF); }
  .rp-auth-toggle-sub { font-size: 11px; color: var(--text-tertiary, #9CA3AF); }
  .rp-auth-switch {
    width: 36px; height: 20px; border-radius: 10px;
    background: var(--border, #E5E7EB);
    border: 1px solid var(--border, #E5E7EB);
    position: relative; transition: background .2s; flex-shrink: 0;
  }
  .rp-auth-switch.on { background: var(--primary, #0066FF); border-color: var(--primary, #0066FF); }
  .rp-auth-switch::after {
    content: ''; position: absolute;
    top: 2px; left: 2px;
    width: 14px; height: 14px; border-radius: 50%;
    background: #fff; transition: transform .2s;
    box-shadow: 0 1px 3px rgba(0,0,0,.15);
  }
  .rp-auth-switch.on::after { transform: translateX(16px); }

  /* Auth section */
  .rp-auth-section {
    background: rgba(0,102,255,.03);
    border: 1px solid rgba(0,102,255,.1);
    border-radius: 8px; padding: 14px;
    margin-bottom: 4px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .rp-auth-section-label {
    font-size: 9px; font-weight: 700; letter-spacing: .18em;
    text-transform: uppercase; color: rgba(0,102,255,.5);
    margin-bottom: 2px;
  }

  /* Fields */
  .rp-field { margin-bottom: 14px; }
  .rp-field-row { display: flex; gap: 12px; margin-bottom: 14px; }
  .rp-field-row .rp-field { flex: 1; margin-bottom: 0; min-width: 0; }
  .rp-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--text-secondary, #6B7280);
    margin-bottom: 6px;
  }
  .rp-input {
    width: 100%; padding: 9px 12px;
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px; font-family: inherit;
    font-size: 13px; color: var(--text, #1F2937);
    outline: none; transition: border-color .17s, box-shadow .17s;
    box-sizing: border-box;
  }
  .rp-input::placeholder { color: var(--text-tertiary, #9CA3AF); }
  .rp-input:focus {
    border-color: var(--primary, #0066FF);
    box-shadow: 0 0 0 3px rgba(0,102,255,.08);
    background: var(--surface, #fff);
  }
  .rp-input-wrap { position: relative; }
  .rp-pw-toggle {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none;
    color: var(--text-tertiary, #9CA3AF);
    cursor: pointer; padding: 2px; display: flex; align-items: center;
  }
  .rp-pw-toggle:hover { color: var(--text-secondary, #6B7280); }
  .rp-select {
    width: 100%; padding: 9px 12px;
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px; font-family: inherit;
    font-size: 13px; color: var(--text, #1F2937);
    outline: none; cursor: pointer; box-sizing: border-box;
  }
  .rp-select:focus {
    border-color: var(--primary, #0066FF);
    box-shadow: 0 0 0 3px rgba(0,102,255,.08);
  }

  /* Banners */
  .rp-modal-error {
    padding: 10px 14px;
    background: rgba(255,59,48,.05);
    border: 1px solid rgba(255,59,48,.18);
    border-radius: 8px; font-size: 12px;
    color: var(--danger, #FF3B30);
    margin-bottom: 14px; line-height: 1.5;
  }
  .rp-modal-success {
    padding: 10px 14px;
    background: rgba(0,176,116,.06);
    border: 1px solid rgba(0,176,116,.2);
    border-radius: 8px; font-size: 12px;
    color: #00B074;
    margin-bottom: 14px; line-height: 1.5;
  }

  /* Modal actions */
  .rp-modal-actions { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end; }
  .rp-modal-save {
    padding: 10px 20px;
    background: linear-gradient(135deg, #0066FF 0%, #0052cc 100%);
    border: none; border-radius: 8px; font-family: inherit;
    font-size: 13px; font-weight: 700; color: #fff; cursor: pointer;
    transition: all .17s; box-shadow: 0 2px 8px rgba(0,102,255,.2);
    display: flex; align-items: center; gap: 8px;
  }
  .rp-modal-save:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0,102,255,.3);
  }
  .rp-modal-save:disabled { opacity: .5; cursor: not-allowed; }
  .rp-modal-cancel {
    padding: 10px 16px;
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px; font-family: inherit;
    font-size: 13px; font-weight: 500;
    color: var(--text-secondary, #6B7280);
    cursor: pointer; transition: all .17s;
  }
  .rp-modal-cancel:hover {
    background: var(--surface, #fff);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text, #1F2937);
  }
  .rp-spinner {
    display: inline-block; width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    animation: rpSpin .7s linear infinite;
  }
`;function _e(a){return a&&a.split(" ").map(r=>r[0]??"").join("").slice(0,2).toUpperCase()||"??"}function Ae(a){if(!a)return null;const r=new Date(a);return isNaN(r.getTime())?null:r.toLocaleString("en-PH",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit",second:"2-digit"})}function Qa(){const[a,r]=i.useState("responders"),[d,f]=i.useState("all"),[u,m]=i.useState([]),[v,h]=i.useState([]),[y,N]=i.useState([]),[k,F]=i.useState(!0),[S,j]=i.useState(!1),[t,x]=i.useState(""),[b,c]=i.useState(null),[w,l]=i.useState(!1),[E,_]=i.useState(!0),[$,te]=i.useState(!1),[q,G]=i.useState(!1),[U,n]=i.useState(null),[W,T]=i.useState(null),[z,P]=i.useState({firstName:"",lastName:"",email:"",password:""}),[s,C]=i.useState(!1),[p,A]=i.useState(null),[B,R]=i.useState({name:"",email:"",on_duty:!0}),O=async(o=!1)=>{o?j(!0):F(!0);const{data:Y,error:M}=await g.from("profiles").select("id, full_name, email, role, created_at, last_seen");M&&console.error("profiles fetch error:",M.message);const Q=Y??[];m(Q.filter(L=>L.role==="responder").map(L=>({...L,source:"auth"}))),h(Q.filter(L=>L.role==="citizen"||!L.role).map(L=>({...L,source:"auth"})));const{data:J}=await g.from("responders").select("*");N((J??[]).map(L=>({...L,on_duty:L.on_duty??!1,source:"manual"}))),F(!1),j(!1)};i.useEffect(()=>{O();const o=g.channel("rp-live-last-seen").on("postgres_changes",{event:"*",schema:"public",table:"profiles"},()=>O(!0)).on("postgres_changes",{event:"*",schema:"public",table:"responders"},()=>O(!0)).subscribe();return()=>{g.removeChannel(o)}},[]);const K=async()=>{const o=z.firstName.trim(),Y=z.lastName.trim(),M=`${o} ${Y}`.trim();if(!o||!Y||!z.email.trim()){n("First name, last name, and email are required.");return}if(E&&z.password.length<6){n("Password must be at least 6 characters.");return}if(G(!0),n(null),T(null),E){const{data:J,error:L}=await g.functions.invoke("admin-create-responder",{body:{email:z.email.trim(),password:z.password,fullName:M}});if(L||J?.error){n(`Auth account error: ${J?.error||L?.message}`),G(!1);return}}const{error:Q}=await g.from("responders").insert({name:M,email:z.email.trim(),status:"active",on_duty:!1});if(Q){n(`Responder record error: ${Q.message}`),G(!1);return}T(E?`✓ Responder added. A confirmation email was sent to ${z.email} — they must click the link before they can log in.`:`✓ Responder record added for ${M}`),G(!1),P({firstName:"",lastName:"",email:"",password:""}),_(!0),O(!0),setTimeout(()=>{l(!1),T(null)},E?3e3:1500)},ne=async()=>{p&&(await g.from("responders").update({name:B.name,email:B.email,on_duty:B.on_duty}).eq("id",p.id),C(!1),A(null),O(!0))},X=async o=>{confirm("Remove this responder?")&&(await g.from("responders").delete().eq("id",o),N(Y=>Y.filter(M=>M.id!==o)))},ge=async o=>{c(o.id);const Y=!o.on_duty;await g.from("responders").update({on_duty:Y}).eq("id",o.id),N(M=>M.map(Q=>Q.id===o.id?{...Q,on_duty:Y}:Q)),c(null)},le=t.toLowerCase(),de=[...u,...y],we=de.filter(o=>{const Y="full_name"in o?o.full_name??"":o.name??"",M=o.email??"",Q=Y.toLowerCase().includes(le)||M.toLowerCase().includes(le);return d!=="all"&&"on_duty"in o&&(d==="on"&&!o.on_duty||d==="off"&&o.on_duty)?!1:Q}),Ne=v.filter(o=>(o.full_name??"").toLowerCase().includes(le)||(o.email??"").toLowerCase().includes(le)),ke=y.filter(o=>o.on_duty).length,ze=y.filter(o=>!o.on_duty).length,Je=[{label:"Total Responders",value:de.length,accent:"#0066FF"},{label:"On Duty",value:ke,accent:"#00B074"},{label:"Off Duty",value:ze,accent:"#FF9500"},{label:"Auth Accounts",value:u.length,accent:"#FF9500"},{label:"Citizens",value:v.length,accent:"#6B7280"}],Ke=(o,Y)=>{const M="full_name"in o,Q=M?o.full_name??"Unknown":o.name??"Unknown",J=M?"active":o.status,L=M?!0:o.on_duty,Fe=Ae(o.last_seen);return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"rp-name-cell",children:[e.jsx("div",{className:"rp-avatar rp-avatar-responder",children:_e(Q)}),e.jsxs("div",{children:[e.jsx("div",{className:"rp-name",children:Q||"—"}),e.jsx("span",{className:`rp-source-tag ${M?"rp-tag-auth":"rp-tag-manual"}`,children:M?"✓ Signed Up":"Manual"})]})]})}),e.jsx("td",{style:{fontSize:12},children:o.email||"—"}),e.jsx("td",{children:e.jsxs("span",{className:`rp-status-badge ${J==="active"?"rp-status-active":"rp-status-inactive"}`,children:[e.jsx("span",{className:"rp-status-dot"}),J||"active"]})}),e.jsx("td",{children:e.jsxs("span",{className:`rp-duty-badge ${L?"rp-duty-badge--on":"rp-duty-badge--off"}`,children:[e.jsx("span",{className:"rp-duty-badge-dot"}),L?"On Duty":"Off Duty"]})}),e.jsx("td",{children:Fe?e.jsx("span",{className:"rp-lastseen",children:Fe}):e.jsx("span",{className:"rp-lastseen rp-lastseen--none",children:"Never"})}),e.jsx("td",{children:M?e.jsx("span",{style:{fontSize:11,color:"var(--text-tertiary, #9CA3AF)"},children:"Auth-managed"}):e.jsxs("div",{className:"rp-action-btns",children:[e.jsxs("button",{className:`rp-duty-toggle ${L?"rp-duty-toggle--on":"rp-duty-toggle--off"}`,onClick:()=>ge(o),disabled:b===o.id,children:[L?e.jsx(ga,{size:11}):e.jsx(ua,{size:11}),b===o.id?"…":L?"On Duty":"Off Duty"]}),e.jsxs("button",{className:"rp-btn-edit",onClick:()=>{A(o),R({name:o.name??"",email:o.email,on_duty:o.on_duty}),C(!0)},children:[e.jsx(ma,{size:10})," Edit"]}),e.jsxs("button",{className:"rp-btn-remove",onClick:()=>X(o.id),children:[e.jsx(Ie,{size:10})," Remove"]})]})})]},o.id??Y)},Ze=(o,Y)=>{const M=Ae(o.last_seen);return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"rp-name-cell",children:[e.jsx("div",{className:"rp-avatar rp-avatar-citizen",children:_e(o.full_name)}),e.jsxs("div",{children:[e.jsx("div",{className:"rp-name",children:o.full_name||"—"}),e.jsx("span",{className:"rp-source-tag rp-tag-auth",children:"✓ Registered"})]})]})}),e.jsx("td",{style:{fontSize:12},children:o.email||"—"}),e.jsx("td",{children:e.jsxs("span",{className:"rp-status-badge rp-status-active",children:[e.jsx("span",{className:"rp-status-dot"})," Active"]})}),e.jsx("td",{children:e.jsxs("span",{className:"rp-duty-badge rp-duty-badge--on",children:[e.jsx("span",{className:"rp-duty-badge-dot"})," Registered"]})}),e.jsx("td",{children:M?e.jsx("span",{className:"rp-lastseen",children:M}):e.jsx("span",{className:"rp-lastseen rp-lastseen--none",children:"Never"})}),e.jsx("td",{style:{fontSize:12,color:"var(--text-tertiary, #9CA3AF)"},children:o.created_at?new Date(o.created_at).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"}):"—"})]},o.id??Y)};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:Wa}),e.jsxs("div",{className:"rp-root",children:[e.jsxs("div",{className:"rp-header",children:[e.jsxs("div",{children:[e.jsx("div",{className:"rp-eyebrow",children:"Personnel Management"}),e.jsx("h2",{className:"rp-title",children:"Responders & Citizens"}),e.jsx("p",{className:"rp-subtitle",children:"All registered accounts and manually-added responders"})]}),e.jsxs("button",{className:"rp-add-btn",onClick:()=>{P({firstName:"",lastName:"",email:"",password:""}),n(null),T(null),l(!0)},children:[e.jsx(ca,{size:11})," Add Responder"]})]}),e.jsx("div",{className:"rp-stats",children:Je.map(o=>e.jsxs("div",{className:"rp-stat",style:{"--s-accent":o.accent},children:[e.jsx("div",{className:"rp-stat-num",children:k?"—":o.value}),e.jsx("div",{className:"rp-stat-label",children:o.label})]},o.label))}),e.jsxs("div",{className:"rp-tabs",children:[e.jsxs("button",{className:`rp-tab${a==="responders"?" active":""}`,onClick:()=>{r("responders"),f("all")},children:[e.jsx(ee,{size:11})," Responders",e.jsx("span",{className:"rp-tab-count",children:de.length})]}),e.jsxs("button",{className:`rp-tab${a==="citizens"?" active":""}`,onClick:()=>r("citizens"),children:[e.jsx(Se,{size:11})," Citizens",e.jsx("span",{className:"rp-tab-count",children:v.length})]})]}),a==="responders"&&e.jsxs("div",{className:"rp-duty-filter",children:[e.jsxs("button",{className:`rp-duty-pill rp-duty-pill--all${d==="all"?" active":""}`,onClick:()=>f("all"),children:["All (",de.length,")"]}),e.jsxs("button",{className:`rp-duty-pill rp-duty-pill--on${d==="on"?" active":""}`,onClick:()=>f("on"),children:[e.jsx("span",{className:"rp-duty-dot",style:{background:"#00B074"}}),"On Duty (",ke,")"]}),e.jsxs("button",{className:`rp-duty-pill rp-duty-pill--off${d==="off"?" active":""}`,onClick:()=>f("off"),children:[e.jsx("span",{className:"rp-duty-dot",style:{background:"#9CA3AF"}}),"Off Duty (",ze,")"]})]}),e.jsxs("div",{className:"rp-notice",children:[e.jsx(ee,{className:"rp-notice-icon",size:13}),e.jsxs("span",{children:[e.jsx("strong",{style:{color:"var(--primary, #0066FF)"},children:"Auth accounts"})," are from your"," ",e.jsx("code",{style:{fontFamily:"monospace",fontSize:11,background:"rgba(0,0,0,.05)",padding:"1px 5px",borderRadius:4},children:"profiles"})," table."," ",e.jsx("strong",{style:{color:"#FF9500"},children:"Manual entries"})," are from the"," ",e.jsx("code",{style:{fontFamily:"monospace",fontSize:11,background:"rgba(0,0,0,.05)",padding:"1px 5px",borderRadius:4},children:"responders"})," table. Use ",e.jsx("strong",{style:{color:"#00B074"},children:"Add Responder"})," to create both at once."]})]}),e.jsxs("div",{className:"rp-toolbar",children:[e.jsxs("div",{className:"rp-search-wrap",children:[e.jsx(Oe,{className:"rp-search-icon"}),e.jsx("input",{className:"rp-search",placeholder:`Search ${a}…`,value:t,onChange:o=>x(o.target.value)})]}),e.jsxs("button",{className:`rp-refresh-btn${S?" spinning":""}`,onClick:()=>O(!0),children:[e.jsx(pa,{size:11})," Refresh"]})]}),k?e.jsx("div",{style:{textAlign:"center",padding:"48px 0"},children:e.jsx("div",{style:{display:"inline-block",width:24,height:24,borderRadius:"50%",border:"2px solid var(--border, #E5E7EB)",borderTopColor:"var(--primary, #0066FF)",animation:"rpSpin .8s linear infinite"}})}):e.jsx("div",{className:"rp-table-wrap",children:e.jsxs("table",{className:"rp-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Duty"}),e.jsx("th",{children:"Last Seen"}),e.jsx("th",{children:a==="citizens"?"Joined":"Actions"})]})}),e.jsxs("tbody",{children:[a==="responders"&&(we.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsxs("div",{className:"rp-empty",children:[e.jsx("div",{className:"rp-empty-icon",children:e.jsx(re,{})}),e.jsx("div",{className:"rp-empty-text",children:"No responders found"})]})})}):we.map(Ke)),a==="citizens"&&(Ne.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsxs("div",{className:"rp-empty",children:[e.jsx("div",{className:"rp-empty-icon",children:e.jsx(Se,{})}),e.jsx("div",{className:"rp-empty-text",children:"No citizens found"})]})})}):Ne.map(Ze))]})]})}),w&&e.jsx("div",{className:"rp-overlay",onClick:()=>l(!1),children:e.jsxs("div",{className:"rp-modal",onClick:o=>o.stopPropagation(),children:[e.jsx("h3",{className:"rp-modal-title",children:"Add Responder"}),e.jsxs("p",{className:"rp-modal-sub",children:["Create a login account and add them to the responders list in one step.",E&&" They'll receive a confirmation email and must verify it before they can sign in."]}),e.jsxs("div",{className:"rp-auth-toggle",onClick:()=>_(o=>!o),children:[e.jsxs("div",{className:"rp-auth-toggle-left",children:[e.jsx("span",{className:"rp-auth-toggle-label",children:"Create Login Account"}),e.jsx("span",{className:"rp-auth-toggle-sub",children:"Lets the responder log in with email & password"})]}),e.jsx("div",{className:`rp-auth-switch${E?" on":""}`})]}),e.jsxs("div",{className:"rp-field-row",children:[e.jsxs("div",{className:"rp-field",children:[e.jsx("label",{className:"rp-label",children:"First Name"}),e.jsx("input",{className:"rp-input",placeholder:"e.g. Juan",value:z.firstName,onChange:o=>P({...z,firstName:o.target.value})})]}),e.jsxs("div",{className:"rp-field",children:[e.jsx("label",{className:"rp-label",children:"Last Name"}),e.jsx("input",{className:"rp-input",placeholder:"e.g. dela Cruz",value:z.lastName,onChange:o=>P({...z,lastName:o.target.value})})]})]}),e.jsxs("div",{className:"rp-field",children:[e.jsx("label",{className:"rp-label",children:"Email"}),e.jsx("input",{className:"rp-input",type:"email",placeholder:"e.g. juan@bfp.gov.ph",value:z.email,onChange:o=>P({...z,email:o.target.value})})]}),E&&e.jsxs("div",{className:"rp-auth-section",children:[e.jsx("div",{className:"rp-auth-section-label",children:"Login Credentials"}),e.jsxs("div",{className:"rp-field",style:{marginBottom:0},children:[e.jsx("label",{className:"rp-label",children:"Password"}),e.jsxs("div",{className:"rp-input-wrap",children:[e.jsx("input",{className:"rp-input",type:$?"text":"password",placeholder:"Min. 6 characters",value:z.password,onChange:o=>P({...z,password:o.target.value}),style:{paddingRight:38}}),e.jsx("button",{className:"rp-pw-toggle",type:"button",onClick:()=>te(o=>!o),children:$?e.jsx(xa,{size:13}):e.jsx(ha,{size:13})})]})]})]}),e.jsxs("div",{className:"rp-notice",style:{marginTop:14,marginBottom:0},children:[e.jsx(ee,{className:"rp-notice-icon",size:12}),e.jsxs("span",{children:["Duty status is set automatically — responders are tagged"," ",e.jsx("strong",{style:{color:"#00B074"},children:"On Duty"})," when they log in and"," ",e.jsx("strong",{style:{color:"var(--text-tertiary, #9CA3AF)"},children:"Off Duty"})," when they log out."]})]}),U&&e.jsxs("div",{className:"rp-modal-error",style:{marginTop:14},children:["⚠ ",U]}),W&&e.jsx("div",{className:"rp-modal-success",style:{marginTop:14},children:W}),e.jsxs("div",{className:"rp-modal-actions",children:[e.jsx("button",{className:"rp-modal-cancel",onClick:()=>l(!1),children:"Cancel"}),e.jsxs("button",{className:"rp-modal-save",onClick:K,disabled:q,children:[q&&e.jsx("span",{className:"rp-spinner"}),q?"Saving…":"Add Responder"]})]})]})}),s&&e.jsx("div",{className:"rp-overlay",onClick:()=>C(!1),children:e.jsxs("div",{className:"rp-modal",onClick:o=>o.stopPropagation(),children:[e.jsx("h3",{className:"rp-modal-title",children:"Edit Responder"}),e.jsx("p",{className:"rp-modal-sub",children:"Update the details for this manual entry."}),e.jsxs("div",{className:"rp-field",children:[e.jsx("label",{className:"rp-label",children:"Full Name"}),e.jsx("input",{className:"rp-input",value:B.name,onChange:o=>R({...B,name:o.target.value})})]}),e.jsxs("div",{className:"rp-field",children:[e.jsx("label",{className:"rp-label",children:"Email"}),e.jsx("input",{className:"rp-input",type:"email",value:B.email,onChange:o=>R({...B,email:o.target.value})})]}),e.jsxs("div",{className:"rp-field",children:[e.jsx("label",{className:"rp-label",children:"Duty Status"}),e.jsxs("select",{className:"rp-select",value:B.on_duty?"on":"off",onChange:o=>R({...B,on_duty:o.target.value==="on"}),children:[e.jsx("option",{value:"on",children:"On Duty"}),e.jsx("option",{value:"off",children:"Off Duty"})]})]}),e.jsxs("div",{className:"rp-modal-actions",children:[e.jsx("button",{className:"rp-modal-cancel",onClick:()=>C(!1),children:"Cancel"}),e.jsx("button",{className:"rp-modal-save",onClick:ne,children:"Update"})]})]})})]})]})}const Re={on_duty:{label:"On Duty",color:"#00B074",bg:"rgba(0,176,116,0.08)",border:"rgba(0,176,116,0.25)"},responding:{label:"Responding",color:"#FF9500",bg:"rgba(255,149,0,0.08)",border:"rgba(255,149,0,0.25)"},off_duty:{label:"Off Duty",color:"#9CA3AF",bg:"rgba(156,163,175,0.08)",border:"rgba(156,163,175,0.25)"}},Xa={Alpha:"#0066FF",Bravo:"#00B074",Charlie:"#FF9500",Delta:"#FF3B30",HQ:"#8B5CF6"},Ja={admin:"#8B5CF6",responder:"#0066FF",commander:"#FF9500",medic:"#00B074",scout:"#FF2D55"},I=({path:a,size:r=16})=>e.jsx("svg",{width:r,height:r,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",style:{display:"inline-block",verticalAlign:"middle",flexShrink:0},dangerouslySetInnerHTML:{__html:a}}),D={users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",radio:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5M19.1 4.9C23 8.8 23 15.1 19.1 19",activity:"M22 12h-4l-3 9L9 3l-3 9H2",phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",mail:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",search:"M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",filter:"M22 3H2l8 9.46V19l4 2v-8.54L22 3z",clock:"M12 2a10 10 0 1 0 10 10M12 6v6l4 2",chevDown:"M6 9l6 6 6-6",chevUp:"M18 15l-6-6-6 6",retry:"M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",badge:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",settings:"M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24M19.78 19.78l-4.24-4.24m-3.08-3.08l-4.24-4.24",trash:"M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h16zM10 11v6M14 11v6"},Ka=`
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
`;function Za(a){return a?a.split(" ").slice(0,2).map(r=>r[0]?.toUpperCase()??"").join(""):"?"}function Xe(a){return a?new Date(a).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"}):"—"}function er(a){if(!a)return"—";const r=Math.floor((Date.now()-new Date(a).getTime())/1e3);return r<60?`${r}s ago`:r<3600?`${Math.floor(r/60)}m ago`:r<86400?`${Math.floor(r/3600)}h ago`:Xe(a)}function ar(){return e.jsxs("div",{className:"atp-skel-card",children:[e.jsxs("div",{style:{display:"flex",gap:12,alignItems:"flex-start"},children:[e.jsx("div",{className:"atp-skel atp-skel-av"}),e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:6},children:[e.jsx("div",{className:"atp-skel atp-skel-name"}),e.jsx("div",{className:"atp-skel atp-skel-role"})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6},children:[e.jsx("div",{className:"atp-skel",style:{height:12,width:"80%"}}),e.jsx("div",{className:"atp-skel",style:{height:12,width:"52%"}})]}),e.jsx("div",{style:{height:34,borderRadius:8,background:"rgba(255,255,255,0.05)"}})]})}function rr({member:a,index:r}){const[d,f]=i.useState(!1),u=a.status??"off_duty",m=Re[u]??Re.off_duty,v=a.unit??"HQ",h=a.role??"responder",y=Xa[v]??"#0066FF",N=Ja[h]??"#0066FF",k=`${y}18`,F=`${y}35`,S=`${N}18`,j=`${N}35`,t=a.full_name??"Unknown Member",x=a.role??"—";return e.jsxs("div",{className:"atp-card",style:{animationDelay:`${r*.04}s`,"--card-accent":y,"--av-bg":k,"--av-border":F},children:[e.jsxs("div",{className:"atp-card-top",children:[e.jsxs("div",{className:"atp-avatar",style:{"--av-bg":k,"--av-border":F,color:y},children:[a.avatar_url?e.jsx("img",{src:a.avatar_url,alt:t,className:"atp-avatar-img"}):Za(a.full_name),e.jsx("span",{className:`atp-dot${u==="responding"?" is-responding":""}`,style:{"--dot-color":m.color}})]}),e.jsxs("div",{className:"atp-card-info",children:[e.jsx("div",{className:"atp-card-name",children:t}),e.jsx("div",{className:"atp-card-role",style:{textTransform:"capitalize"},children:x}),e.jsxs("div",{children:[e.jsxs("span",{className:"atp-role-badge",style:{"--role-bg":S,"--role-border":j,"--role-color":N},children:[e.jsx(I,{path:D.badge,size:8}),h]}),e.jsxs("span",{className:"atp-unit-tag",style:{"--unit-bg":k,"--unit-border":F,"--unit-color":y},children:[e.jsx(I,{path:D.shield,size:9}),v]})]})]}),e.jsx("span",{className:"atp-status-pill",style:{color:m.color,background:m.bg,borderColor:m.border},children:m.label})]}),(a.email||a.phone)&&e.jsxs("div",{className:"atp-contacts",children:[a.email&&e.jsxs("div",{className:"atp-contact-row",children:[e.jsx(I,{path:D.mail,size:12}),e.jsx("a",{href:`mailto:${a.email}`,children:a.email})]}),a.phone&&e.jsxs("div",{className:"atp-contact-row",children:[e.jsx(I,{path:D.phone,size:12}),e.jsx("a",{href:`tel:${a.phone}`,children:a.phone})]})]}),e.jsxs("button",{className:"atp-expand-btn",onClick:()=>f(b=>!b),children:[d?"Hide details":"View details",e.jsx(I,{path:d?D.chevUp:D.chevDown,size:12})]}),d&&e.jsx("div",{className:"atp-detail",children:[{key:"Role",val:x,color:N},{key:"Unit",val:v,color:y},{key:"Status",val:m.label,color:m.color},{key:"Last seen",val:er(a.last_seen),color:void 0}].map(({key:b,val:c,color:w})=>e.jsxs("div",{className:"atp-detail-row",children:[e.jsx("span",{className:"atp-detail-key",children:b}),e.jsx("span",{className:"atp-detail-val",style:w?{color:w}:void 0,children:c})]},b))}),e.jsxs("div",{className:"atp-card-foot",children:[e.jsxs("span",{className:"atp-meta",children:[e.jsx(I,{path:D.clock,size:11}),"Joined ",Xe(a.joined_at)]}),e.jsxs("div",{className:"atp-card-actions",children:[e.jsx("button",{className:"atp-action-btn",title:"Edit member",onClick:()=>console.log("Edit",a.id),children:e.jsx(I,{path:D.settings,size:12})}),e.jsx("button",{className:"atp-action-btn danger",title:"Remove member",onClick:()=>console.log("Delete",a.id),children:e.jsx(I,{path:D.trash,size:12})})]})]})]})}const tr=[{key:"all",label:"All",colorClass:""},{key:"on_duty",label:"On Duty",colorClass:"fv-green"},{key:"responding",label:"Responding",colorClass:"fv-amber"},{key:"off_duty",label:"Off Duty",colorClass:"fv-gray"}];function sr(){const[a,r]=i.useState([]),[d,f]=i.useState(!0),[u,m]=i.useState(null),[v,h]=i.useState(""),[y,N]=i.useState("all"),k=async()=>{try{m(null);const{data:t,error:x}=await g.from("profiles").select("id, full_name, email, role, status, unit, avatar_url, phone, joined_at, last_seen").in("role",["responder","admin","commander"]).order("full_name",{ascending:!0});if(x)throw x;r(t??[])}catch(t){m(t?.message??"Failed to load team.")}finally{f(!1)}};i.useEffect(()=>{k();const t=g.channel("atp-team-presence").on("postgres_changes",{event:"*",schema:"public",table:"profiles"},k).subscribe();return()=>{g.removeChannel(t)}},[]);const F={total:a.length,on_duty:a.filter(t=>t.status==="on_duty").length,responding:a.filter(t=>t.status==="responding").length,off_duty:a.filter(t=>!t.status||t.status==="off_duty").length},S=a.filter(t=>{const x=v.toLowerCase(),b=!x||(t.full_name??"").toLowerCase().includes(x)||(t.email??"").toLowerCase().includes(x)||(t.unit??"").toLowerCase().includes(x)||(t.role??"").toLowerCase().includes(x),c=y==="all"||(y==="off_duty"?!t.status||t.status==="off_duty":t.status===y);return b&&c}),j=[{label:"Total Members",value:F.total,colorClass:"sv-default",icon:e.jsx(I,{path:D.users,size:18})},{label:"On Duty",value:F.on_duty,colorClass:"sv-green",icon:e.jsx(I,{path:D.shield,size:18})},{label:"Responding",value:F.responding,colorClass:"sv-amber",icon:e.jsx(I,{path:D.radio,size:18})},{label:"Off Duty",value:F.off_duty,colorClass:"sv-gray",icon:e.jsx(I,{path:D.activity,size:18})}];return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:Ka}),e.jsxs("div",{className:"atp-root",children:[e.jsxs("div",{className:"atp-hd",children:[e.jsxs("div",{children:[e.jsx("div",{className:"atp-eyebrow",children:"Team Management"}),e.jsx("div",{className:"atp-title",children:"Responders & Staff"}),e.jsx("div",{className:"atp-subtitle",children:"Full roster with admin controls"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[d&&e.jsx("div",{className:"atp-spinner"}),e.jsxs("div",{className:"atp-live",children:[e.jsx("span",{className:"atp-live-dot"}),"LIVE ROSTER"]})]})]}),e.jsx("div",{className:"atp-stats",children:j.map(t=>e.jsxs("div",{className:`atp-stat ${t.colorClass}`,children:[e.jsx("div",{className:"atp-stat-icon",children:t.icon}),e.jsx("div",{className:"atp-stat-num",children:d?e.jsx("div",{className:"atp-skel atp-skel-num"}):t.value}),e.jsx("div",{className:"atp-stat-label",children:t.label})]},t.label))}),e.jsxs("div",{className:"atp-toolbar",children:[e.jsxs("div",{className:"atp-search-wrap",children:[e.jsx("span",{className:"atp-search-icon",children:e.jsx(I,{path:D.search,size:14})}),e.jsx("input",{className:"atp-search",placeholder:"Search name, email, unit or role…",value:v,onChange:t=>h(t.target.value)})]}),e.jsxs("div",{className:"atp-filter-grp",children:[e.jsx(I,{path:D.filter,size:13}),tr.map(t=>{const x=t.key==="all"?F.total:F[t.key]??0;return e.jsxs("button",{className:`atp-filter-btn ${t.colorClass} ${y===t.key?"active":""}`,onClick:()=>N(t.key),children:[t.label,x>0&&e.jsx("span",{className:"atp-filter-count",children:x})]},t.key)})]})]}),e.jsx("div",{className:"atp-grid",children:d?Array.from({length:6}).map((t,x)=>e.jsx(ar,{},x)):u?e.jsxs("div",{className:"atp-empty",children:[e.jsx("div",{className:"atp-empty-icon",children:e.jsx(I,{path:D.activity,size:32})}),e.jsx("div",{className:"atp-empty-text",children:u}),e.jsxs("button",{className:"atp-retry-btn",onClick:k,children:[e.jsx(I,{path:D.retry,size:13}),"Retry"]})]}):S.length===0?e.jsxs("div",{className:"atp-empty",children:[e.jsx("div",{className:"atp-empty-icon",children:e.jsx(I,{path:D.users,size:36})}),e.jsx("div",{className:"atp-empty-text",children:v?`No results for "${v}"`:"No team members found"})]}):S.map((t,x)=>e.jsx(rr,{member:t,index:x},t.id))})]})]})}const be={fire:{icon:"🔥",color:"#FF3B30"},accident:{icon:"🚗",color:"#FF9500"},flood:{icon:"🌊",color:"#0066FF"},crime:{icon:"🚨",color:"#FF2D55"},medical:{icon:"🏥",color:"#00B074"},other:{icon:"⚠️",color:"#9CA3AF"}},Me={pending:{label:"PENDING",color:"#FF3B30",bg:"rgba(255,59,48,.10)",border:"rgba(255,59,48,.28)"},"in-progress":{label:"IN PROGRESS",color:"#FF9500",bg:"rgba(255,149,0,.10)",border:"rgba(255,149,0,.28)"},resolved:{label:"RESOLVED",color:"#00B074",bg:"rgba(0,176,116,.10)",border:"rgba(0,176,116,.28)"}},ir={fully_resolved:{label:"Fully Resolved",icon:"✓",color:"#00B074"},"fully-resolved":{label:"Fully Resolved",icon:"✓",color:"#00B074"},referred:{label:"Forwarded to Department",icon:"↗",color:"#0066FF"},follow_up_needed:{label:"Needs Follow-Up",icon:"⟳",color:"#FF9500"},"follow-up":{label:"Needs Follow-Up",icon:"⟳",color:"#FF9500"}},or=["all","fire","flood","medical","crime","accident","other"],nr=["all","resolved","in-progress","pending"],lr=`
.hl-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text, #eef0f7);
  --hl-bg:       #0d1117;
  --hl-surface:  rgba(15,21,33,0.82);
  --hl-border:   rgba(255,255,255,0.07);
  --hl-primary:  #0066FF;
  --hl-success:  #00B074;
  --hl-warning:  #FF9500;
  --hl-danger:   #FF3B30;
  --hl-text:     #eef0f7;
  --hl-text-sec: rgba(238,240,247,0.55);
  --hl-text-ter: rgba(238,240,247,0.28);
}

.hl-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
}
.hl-eyebrow {
  font-size: 11px; color: var(--hl-primary); letter-spacing: 0.5px;
  text-transform: uppercase; margin-bottom: 6px; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
}
.hl-eyebrow::before { content: ''; display: block; width: 20px; height: 2px; background: var(--hl-primary); }
.hl-title { font-size: 32px; color: var(--hl-text); letter-spacing: -0.5px; line-height: 1.1; font-weight: 700; }
.hl-subtitle { font-size: 11px; color: var(--hl-text-ter); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.3px; }
.hl-header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.hl-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 16px; }
.hl-search-wrap { flex: 1; min-width: 200px; position: relative; }
.hl-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--hl-text-ter); font-size: 12px; pointer-events: none; }
.hl-search {
  width: 100%; padding: 9px 12px 9px 32px;
  background: var(--hl-surface); border: 1px solid var(--hl-border); border-radius: 8px;
  color: var(--hl-text); font-size: 13px; outline: none; transition: border-color 0.2s; font-family: inherit;
}
.hl-search::placeholder { color: var(--hl-text-ter); }
.hl-search:focus { border-color: var(--hl-primary); }

.hl-filter-group { display: flex; gap: 6px; flex-wrap: wrap; }
.hl-filter-btn {
  padding: 7px 12px; border-radius: 6px; border: 1px solid var(--hl-border);
  background: var(--hl-surface); color: var(--hl-text-sec); font-size: 11px;
  font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  text-transform: uppercase; letter-spacing: 0.3px; font-family: inherit;
}
.hl-filter-btn:hover { border-color: var(--hl-text-sec); color: var(--hl-text); }
.hl-filter-btn.active {
  background: var(--hl-primary); border-color: var(--hl-primary);
  color: #fff; box-shadow: 0 2px 8px rgba(0,102,255,0.25);
}

.hl-icon-btn {
  width: 34px; height: 34px; border-radius: 7px; border: 1px solid var(--hl-border);
  background: var(--hl-surface); color: var(--hl-text-sec); display: flex;
  align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; font-size: 13px;
}
.hl-icon-btn:hover { background: var(--hl-bg); color: var(--hl-text); border-color: var(--hl-text-sec); }
.hl-icon-btn.spinning svg { animation: hl-spin 0.7s linear infinite; }

@keyframes hl-spin    { to { transform: rotate(360deg); } }
@keyframes hl-fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes hl-pulse   { 0%,100% { opacity:1; } 50%{ opacity:0.4; } }

.hl-stat-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
.hl-mini-stat {
  background: var(--hl-surface); border: 1px solid var(--hl-border); border-radius: 8px;
  padding: 10px 16px; display: flex; align-items: center; gap: 10px; flex: 1; min-width: 120px;
}
.hl-mini-stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.hl-mini-stat-num { font-size: 20px; font-weight: 700; color: var(--hl-text); line-height: 1; }
.hl-mini-stat-label { font-size: 10px; color: var(--hl-text-ter); text-transform: uppercase; letter-spacing: 0.3px; margin-top: 2px; }

.hl-sort-bar {
  display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
  font-size: 11px; color: var(--hl-text-ter); text-transform: uppercase; letter-spacing: 0.3px;
}
.hl-sort-btn {
  display: flex; align-items: center; gap: 4px; padding: 4px 8px;
  border-radius: 5px; border: 1px solid transparent; background: transparent;
  color: var(--hl-text-ter); font-size: 11px; font-weight: 600; cursor: pointer;
  transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.3px; font-family: inherit;
}
.hl-sort-btn:hover { background: var(--hl-surface); border-color: var(--hl-border); color: var(--hl-text-sec); }
.hl-sort-btn.active { color: var(--hl-primary); }

.hl-table-wrap {
  background: var(--hl-surface); border: 1px solid var(--hl-border); border-radius: 12px; overflow: hidden;
}
.hl-table { width: 100%; border-collapse: collapse; }
.hl-table th {
  padding: 11px 14px; text-align: left; font-size: 10px; font-weight: 600;
  color: var(--hl-text-ter); text-transform: uppercase; letter-spacing: 0.5px;
  background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--hl-border); white-space: nowrap;
}
.hl-table td {
  padding: 12px 14px; border-bottom: 1px solid var(--hl-border);
  vertical-align: middle; font-size: 13px; color: var(--hl-text);
}
.hl-table tr:last-child td { border-bottom: none; }
.hl-table tbody tr { transition: background 0.15s; cursor: pointer; animation: hl-fadeIn 0.3s ease-out both; }
.hl-table tbody tr:hover { background: rgba(0,102,255,0.04); }
.hl-table tbody tr.expanded { background: rgba(0,102,255,0.06); }

.hl-type-cell { display: flex; align-items: center; gap: 7px; }
.hl-type-icon-wrap {
  width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center;
  justify-content: center; font-size: 13px; flex-shrink: 0;
  background: rgba(255,255,255,0.04); border: 1px solid var(--hl-border);
}
.hl-type-name { font-weight: 600; text-transform: capitalize; }

.hl-status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.3px;
  padding: 3px 9px; border-radius: 5px; white-space: nowrap; text-transform: uppercase;
}
.hl-status-dot { width: 5px; height: 5px; border-radius: 50%; animation: hl-pulse 2s ease infinite; }

/* ── Expanded row ── */
.hl-expand-row td { padding: 0; border-bottom: 1px solid var(--hl-border); }
.hl-expand-inner {
  padding: 16px 20px; background: rgba(0,0,0,0.25);
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px; animation: hl-fadeIn 0.2s ease-out both;
}
.hl-expand-field {
  display: flex; flex-direction: column; gap: 3px;
  padding: 10px 12px; background: var(--hl-surface); border: 1px solid var(--hl-border);
  border-radius: 8px; min-width: 0;
}
.hl-expand-field-label {
  font-size: 9px; color: var(--hl-text-ter); letter-spacing: 0.15em; text-transform: uppercase;
  display: flex; align-items: center; gap: 4px;
}
.hl-expand-field-val {
  font-size: 13px; color: var(--hl-text); line-height: 1.5;
  overflow-wrap: break-word; word-break: break-word;
}
.hl-expand-desc {
  grid-column: 1 / -1; padding: 10px 12px; background: var(--hl-surface);
  border: 1px solid var(--hl-border); border-radius: 8px;
  font-size: 13px; color: var(--hl-text-sec); line-height: 1.6; overflow-wrap: break-word;
}

/* ── Resolution box ── */
.hl-resolution-box {
  grid-column: 1 / -1; border-radius: 9px; overflow: hidden;
  border: 1px solid var(--hl-success); background: rgba(0,176,116,0.05);
}
.hl-resolution-hd {
  display: flex; align-items: center; gap: 8px; padding: 9px 14px;
  background: rgba(0,176,116,0.08); border-bottom: 1px solid rgba(0,176,116,0.15);
}
.hl-resolution-hd-label { font-size: 10px; font-weight: 700; color: var(--hl-success); text-transform: uppercase; letter-spacing: 0.3px; flex: 1; }
.hl-resolution-type-tag {
  font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 5px;
  background: var(--hl-success); color: #fff; text-transform: uppercase; white-space: nowrap;
}
.hl-resolution-body { padding: 12px 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.hl-resolution-section { display: flex; flex-direction: column; gap: 4px; }
.hl-resolution-section-lbl { font-size: 9px; font-weight: 700; color: var(--hl-success); text-transform: uppercase; letter-spacing: 0.3px; }
.hl-resolution-section-val { font-size: 12px; color: var(--hl-text); line-height: 1.5; overflow-wrap: break-word; }
.hl-resolution-footer { font-size: 10px; color: var(--hl-success); font-weight: 600; padding: 4px 14px 10px; }

/* ── Action tags ── */
.hl-tags-wrap { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
.hl-tag {
  font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 600;
  background: rgba(0,102,255,0.08); color: var(--hl-primary);
  border: 1px solid rgba(0,102,255,0.2);
}

/* ── Evidence ── */
.hl-expand-evidence {
  grid-column: 1 / -1; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.hl-evidence-thumb { max-width: 100px; max-height: 65px; border-radius: 6px; object-fit: cover; border: 1px solid var(--hl-border); }
.hl-evidence-link {
  display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px;
  background: rgba(0,102,255,0.06); border: 1px solid rgba(0,102,255,0.18);
  border-radius: 7px; text-decoration: none; color: var(--hl-primary);
  font-size: 12px; font-weight: 500; transition: background 0.15s;
}
.hl-evidence-link:hover { background: rgba(0,102,255,0.12); }

/* ── Pagination ── */
.hl-pagination {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-top: 1px solid var(--hl-border); flex-wrap: wrap; gap: 10px;
}
.hl-pagination-info { font-size: 11px; color: var(--hl-text-ter); }
.hl-pagination-btns { display: flex; gap: 5px; }
.hl-page-btn {
  width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--hl-border);
  background: var(--hl-surface); color: var(--hl-text-sec); font-size: 12px;
  font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit;
  display: flex; align-items: center; justify-content: center;
}
.hl-page-btn:hover:not(:disabled) { background: var(--hl-bg); border-color: var(--hl-text-sec); color: var(--hl-text); }
.hl-page-btn.active { background: var(--hl-primary); border-color: var(--hl-primary); color: #fff; }
.hl-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.hl-spinner {
  display: inline-block; width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid var(--hl-border); border-top-color: var(--hl-primary);
  animation: hl-spin 0.8s linear infinite;
}
.hl-empty { text-align: center; padding: 56px 24px; font-size: 12px; color: var(--hl-text-ter); text-transform: uppercase; letter-spacing: 0.5px; }
.hl-empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.3; }

.hl-month-select {
  padding: 7px 28px 7px 10px; border-radius: 6px; border: 1px solid var(--hl-border);
  background: var(--hl-surface); color: var(--hl-text-sec); font-size: 11px;
  font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 0.3px;
  font-family: inherit; outline: none; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(238,240,247,0.28)'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 8px center;
  transition: border-color 0.2s;
}
.hl-month-select:focus, .hl-month-select:hover { border-color: var(--hl-primary); color: var(--hl-text); }
.hl-month-select.active { border-color: var(--hl-primary); color: var(--hl-primary); }

/* Month group header row */
.hl-month-header td {
  padding: 8px 14px 6px; background: rgba(0,102,255,0.04);
  border-bottom: 1px solid var(--hl-border); border-top: 1px solid var(--hl-border);
  font-size: 10px; font-weight: 700; color: var(--hl-primary);
  text-transform: uppercase; letter-spacing: 0.5px; cursor: default;
}
.hl-month-header:hover { background: transparent !important; }
.hl-month-count {
  display: inline-flex; align-items: center; justify-content: center;
  background: rgba(0,102,255,0.12); color: var(--hl-primary);
  font-size: 9px; font-weight: 700; padding: 1px 7px; border-radius: 4px;
  margin-left: 8px; border: 1px solid rgba(0,102,255,0.2);
}

@media (max-width: 768px) {
  .hl-title { font-size: 24px; }
  .hl-table th:nth-child(3), .hl-table td:nth-child(3),
  .hl-table th:nth-child(5), .hl-table td:nth-child(5) { display: none; }
  .hl-expand-inner { grid-template-columns: 1fr; }
  .hl-resolution-body { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .hl-table th:nth-child(4), .hl-table td:nth-child(4) { display: none; }
}
`;function oe(a){const r=new Date(a);return r.toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"})+" "+r.toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"})}function dr(a){const r=Math.floor((Date.now()-new Date(a).getTime())/1e3);return r<60?`${r}s ago`:r<3600?`${Math.floor(r/60)}m ago`:r<86400?`${Math.floor(r/3600)}h ago`:r<604800?`${Math.floor(r/86400)}d ago`:oe(a)}function ce(a){const r=new Date(a);return`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}`}function Te(a){const[r,d]=a.split("-");return new Date(Number(r),Number(d)-1,1).toLocaleDateString("en-PH",{month:"long",year:"numeric"})}function fe(a){return/\.(mp4|mov|avi|webm|mkv)(\?|#|$)/i.test(a)}function cr(a){if(!a)return[];if(Array.isArray(a))return a;try{return String(a).replace(/^\{|\}$/g,"").split(",").map(d=>d.trim().replace(/^"|"$/g,"")).filter(Boolean)}catch{return[]}}function pr(a){const r=["ID","Type","Status","Reporter","Contact","Location","Description","Responder Notes","Action Notes","Resolution Type","Resolved At","Created","Responder"],d=a.map(h=>[String(h.id).slice(0,8),h.type,h.status,h.reporter_name??"Anonymous",h.reporter_contact??"",h.address||h.location||"",(h.description??"").replace(/,/g,";"),(h.responder_notes??"").replace(/,/g,";"),(h.action_notes??"").replace(/,/g,";"),h.resolution_type??"",h.resolved_at?oe(h.resolved_at):"",oe(h.created_at),h.responder_name??h.responder_id??""]),f=[r,...d].map(h=>h.join(",")).join(`
`),u=new Blob([f],{type:"text/csv"}),m=URL.createObjectURL(u),v=document.createElement("a");v.href=m,v.download=`dumasafeguide-history-${Date.now()}.csv`,v.click(),URL.revokeObjectURL(m)}const Z=15;function xr(){const[a,r]=i.useState([]),[d,f]=i.useState(!0),[u,m]=i.useState(!1),[v,h]=i.useState(""),[y,N]=i.useState("all"),[k,F]=i.useState("all"),[S,j]=i.useState("created_at"),[t,x]=i.useState("desc"),[b,c]=i.useState("all"),[w,l]=i.useState(null),[E,_]=i.useState(1),$=i.useCallback(async(s=!1)=>{s&&m(!0);const{data:C}=await g.from("reports").select("id,type,description,location,address,reporter_name,reporter_contact,status,evidence_url,created_at,responder_id,responder_notes,action_notes,action_tags,resolution_type,resolved_by,resolved_at").order("created_at",{ascending:!1});if(C){const p=[...new Set(C.map(R=>R.responder_id).filter(R=>R!=null))],A={};if(p.length){const{data:R}=await g.from("responders").select("id, name").in("id",p);(R??[]).forEach(O=>{O.name&&(A[O.id]=O.name)})}const B=(C??[]).map(R=>({...R,responder_name:A[R.responder_id??""]??null}));r(B)}f(!1),m(!1)},[]);i.useEffect(()=>{$();const s=g.channel("history-log-reports").on("postgres_changes",{event:"*",schema:"public",table:"reports"},()=>$()).subscribe();return()=>{g.removeChannel(s)}},[$]);const te=ue.useMemo(()=>[...new Set(a.map(C=>ce(C.created_at)))].sort((C,p)=>p.localeCompare(C)),[a]),q=a.filter(s=>{if(y!=="all"&&s.status!==y||k!=="all"&&s.type!==k||b!=="all"&&ce(s.created_at)!==b)return!1;if(v){const C=v.toLowerCase();return s.type.includes(C)||(s.description??"").toLowerCase().includes(C)||(s.address??s.location??"").toLowerCase().includes(C)||(s.reporter_name??"").toLowerCase().includes(C)||(s.responder_notes??"").toLowerCase().includes(C)||(s.action_notes??"").toLowerCase().includes(C)||String(s.id).toLowerCase().includes(C)}return!0}).sort((s,C)=>{let p,A;return S==="created_at"?(p=s.created_at,A=C.created_at):S==="type"?(p=s.type,A=C.type):(p=s.status,A=C.status),p<A?t==="asc"?-1:1:p>A?t==="asc"?1:-1:0}),G=Math.max(1,Math.ceil(q.length/Z)),U=Math.min(E,G),n=q.slice((U-1)*Z,U*Z),W=ue.useMemo(()=>{if(S!=="created_at")return n.map((p,A)=>({type:"data",report:p,idx:A}));const s=[];let C="";return n.forEach((p,A)=>{const B=ce(p.created_at);if(B!==C){const R=n.filter(O=>ce(O.created_at)===B).length;s.push({type:"header",month:B,count:R}),C=B}s.push({type:"data",report:p,idx:A})}),s},[n,S]),T={total:a.length,resolved:a.filter(s=>s.status==="resolved").length,inProgress:a.filter(s=>s.status==="in-progress").length,pending:a.filter(s=>s.status==="pending").length},z=s=>{S===s?x(C=>C==="asc"?"desc":"asc"):(j(s),x("desc")),_(1)},P=({field:s})=>S!==s?null:t==="desc"?e.jsx(Pe,{size:8}):e.jsx($e,{size:8});return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:lr}),e.jsxs("div",{className:"hl-root",children:[e.jsxs("div",{className:"hl-header",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"hl-eyebrow",children:[e.jsx(ve,{size:10})," History Log"]}),e.jsx("div",{className:"hl-title",children:"Incident History"}),e.jsx("div",{className:"hl-subtitle",children:"Complete audit trail · Dumaguete City Emergency HQ"})]}),e.jsxs("div",{className:"hl-header-actions",children:[e.jsx("button",{className:`hl-icon-btn${u?" spinning":""}`,onClick:()=>$(!0),title:"Refresh",children:e.jsx(ba,{})}),e.jsx("button",{className:"hl-icon-btn",onClick:()=>pr(q),title:"Export CSV",children:e.jsx(fa,{})})]})]}),e.jsx("div",{className:"hl-stat-row",children:[{label:"Total",value:T.total,color:"#0066FF"},{label:"Resolved",value:T.resolved,color:"#00B074"},{label:"In Progress",value:T.inProgress,color:"#FF9500"},{label:"Pending",value:T.pending,color:"#FF3B30"}].map(s=>e.jsxs("div",{className:"hl-mini-stat",children:[e.jsx("span",{className:"hl-mini-stat-dot",style:{background:s.color,boxShadow:`0 0 6px ${s.color}55`}}),e.jsxs("div",{children:[e.jsx("div",{className:"hl-mini-stat-num",children:d?"—":s.value}),e.jsx("div",{className:"hl-mini-stat-label",children:s.label})]})]},s.label))}),e.jsxs("div",{className:"hl-toolbar",children:[e.jsxs("div",{className:"hl-search-wrap",children:[e.jsx(Oe,{className:"hl-search-icon"}),e.jsx("input",{className:"hl-search",type:"text",placeholder:"Search by type, location, reporter, notes, ID…",value:v,onChange:s=>{h(s.target.value),_(1)}})]}),e.jsxs("div",{className:"hl-filter-group",children:[e.jsxs("span",{style:{fontSize:10,color:"var(--hl-text-ter)",alignSelf:"center",letterSpacing:"0.3px",textTransform:"uppercase"},children:[e.jsx(va,{size:9,style:{marginRight:4}}),"Status"]}),nr.map(s=>e.jsx("button",{className:`hl-filter-btn${y===s?" active":""}`,onClick:()=>{N(s),_(1)},children:s==="all"?"All":s==="in-progress"?"In Progress":s.charAt(0).toUpperCase()+s.slice(1)},s))]}),e.jsxs("div",{className:"hl-filter-group",children:[e.jsx("span",{style:{fontSize:10,color:"var(--hl-text-ter)",alignSelf:"center",letterSpacing:"0.3px",textTransform:"uppercase"},children:"Type"}),or.map(s=>e.jsx("button",{className:`hl-filter-btn${k===s?" active":""}`,onClick:()=>{F(s),_(1)},children:s==="all"?"All":`${be[s]?.icon??"⚠️"} ${s.charAt(0).toUpperCase()+s.slice(1)}`},s))]})]}),e.jsxs("div",{className:"hl-sort-bar",children:[e.jsx("span",{children:"Sort by:"}),["created_at","type","status"].map(s=>e.jsxs("button",{className:`hl-sort-btn${S===s?" active":""}`,onClick:()=>z(s),children:[s==="created_at"?"Date":s.charAt(0).toUpperCase()+s.slice(1),e.jsx(P,{field:s})]},s)),e.jsx("span",{style:{marginLeft:12,fontSize:10,color:"var(--hl-text-ter)",textTransform:"uppercase",letterSpacing:"0.3px"},children:"Month:"}),e.jsxs("select",{className:`hl-month-select${b!=="all"?" active":""}`,value:b,onChange:s=>{c(s.target.value),_(1)},children:[e.jsx("option",{value:"all",children:"All Months"}),te.map(s=>e.jsx("option",{value:s,children:Te(s)},s))]}),e.jsxs("span",{style:{marginLeft:"auto",fontSize:11},children:[q.length," record",q.length!==1?"s":""]})]}),e.jsxs("div",{className:"hl-table-wrap",children:[d?e.jsx("div",{className:"hl-empty",children:e.jsx("div",{className:"hl-spinner",style:{margin:"0 auto"}})}):n.length===0?e.jsxs("div",{className:"hl-empty",children:[e.jsx("div",{className:"hl-empty-icon",children:"🗂️"}),e.jsx("div",{children:"No records found"})]}):e.jsxs("table",{className:"hl-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Type"}),e.jsx("th",{children:e.jsxs("button",{className:`hl-sort-btn${S==="status"?" active":""}`,onClick:()=>z("status"),children:["Status ",e.jsx(P,{field:"status"})]})}),e.jsx("th",{children:"Location"}),e.jsx("th",{children:"Reporter"}),e.jsx("th",{children:e.jsxs("button",{className:`hl-sort-btn${S==="created_at"?" active":""}`,onClick:()=>z("created_at"),children:["Reported ",e.jsx(P,{field:"created_at"})]})}),e.jsx("th",{children:"Responder"})]})}),e.jsx("tbody",{children:W.map((s,C)=>{if(s.type==="header")return e.jsx("tr",{className:"hl-month-header",children:e.jsxs("td",{colSpan:100,children:["📅 ",Te(s.month),e.jsx("span",{className:"hl-month-count",children:s.count})]})},`month-${s.month}`);const{report:p,idx:A}=s,B=be[p.type]??be.other,R=Me[p.status]??Me.pending,O=w===p.id,K=p.resolution_type?ir[p.resolution_type]:null,ne=cr(p.action_tags);return e.jsxs(ue.Fragment,{children:[e.jsxs("tr",{className:O?"expanded":"",onClick:()=>l(O?null:p.id),style:{animationDelay:`${A*.03}s`},children:[e.jsx("td",{children:e.jsxs("div",{className:"hl-type-cell",children:[e.jsx("div",{className:"hl-type-icon-wrap",children:B.icon}),e.jsx("span",{className:"hl-type-name",style:{color:B.color},children:p.type.replace(/_/g," ")})]})}),e.jsx("td",{children:e.jsxs("span",{className:"hl-status-badge",style:{background:R.bg,color:R.color,border:`1px solid ${R.border}`},children:[e.jsx("span",{className:"hl-status-dot",style:{background:R.color}}),R.label]})}),e.jsx("td",{style:{color:"var(--hl-text-sec)",fontSize:12},children:p.address||p.location||e.jsx("span",{style:{color:"var(--hl-text-ter)"},children:"—"})}),e.jsx("td",{style:{color:"var(--hl-text-sec)",fontSize:12},children:p.reporter_name||e.jsx("span",{style:{color:"var(--hl-text-ter)"},children:"Anonymous"})}),e.jsx("td",{style:{color:"var(--hl-text-ter)",fontSize:11,whiteSpace:"nowrap"},children:dr(p.created_at)}),e.jsx("td",{style:{color:"var(--hl-text-sec)",fontSize:12},children:p.responder_name||(p.responder_id?e.jsxs("span",{style:{color:"var(--hl-text-ter)"},children:["ID: ",String(p.responder_id).slice(0,8)]}):e.jsx("span",{style:{color:"var(--hl-text-ter)"},children:"Unassigned"}))})]}),O&&e.jsx("tr",{className:"hl-expand-row",children:e.jsx("td",{colSpan:100,children:e.jsxs("div",{className:"hl-expand-inner",children:[e.jsxs("div",{className:"hl-expand-field",children:[e.jsxs("span",{className:"hl-expand-field-label",children:[e.jsx(ve,{size:8})," Report ID"]}),e.jsx("span",{className:"hl-expand-field-val",style:{fontFamily:"monospace",fontSize:11},children:String(p.id)})]}),e.jsxs("div",{className:"hl-expand-field",children:[e.jsxs("span",{className:"hl-expand-field-label",children:[e.jsx(Ue,{size:8})," Full Address"]}),e.jsx("span",{className:"hl-expand-field-val",children:p.address||p.location||"—"})]}),e.jsxs("div",{className:"hl-expand-field",children:[e.jsxs("span",{className:"hl-expand-field-label",children:[e.jsx(Ye,{size:8})," Reporter"]}),e.jsx("span",{className:"hl-expand-field-val",children:p.reporter_name||"Anonymous"})]}),p.reporter_contact&&e.jsxs("div",{className:"hl-expand-field",children:[e.jsxs("span",{className:"hl-expand-field-label",children:[e.jsx(He,{size:8})," Contact"]}),e.jsx("a",{href:`tel:${p.reporter_contact}`,className:"hl-expand-field-val",style:{color:"var(--hl-success)",textDecoration:"none"},onClick:X=>X.stopPropagation(),children:p.reporter_contact})]}),e.jsxs("div",{className:"hl-expand-field",children:[e.jsxs("span",{className:"hl-expand-field-label",children:[e.jsx(je,{size:8})," Reported At"]}),e.jsx("span",{className:"hl-expand-field-val",children:oe(p.created_at)})]}),e.jsxs("div",{className:"hl-expand-field",children:[e.jsxs("span",{className:"hl-expand-field-label",children:[e.jsx(he,{size:8})," Assigned Responder"]}),e.jsx("span",{className:"hl-expand-field-val",children:p.responder_name||(p.responder_id?`ID: ${String(p.responder_id).slice(0,8)}`:"Unassigned")})]}),p.description&&e.jsx("div",{className:"hl-expand-desc",children:p.description}),p.status==="resolved"&&(p.responder_notes||p.action_notes||p.resolution_type)&&e.jsxs("div",{className:"hl-resolution-box",children:[e.jsxs("div",{className:"hl-resolution-hd",children:[e.jsx(ya,{size:11,style:{color:"var(--hl-success)"}}),e.jsx("span",{className:"hl-resolution-hd-label",children:"Resolution Summary"}),K&&e.jsxs("span",{className:"hl-resolution-type-tag",style:{background:K.color},children:[K.icon," ",K.label]})]}),e.jsxs("div",{className:"hl-resolution-body",children:[p.responder_notes&&e.jsxs("div",{className:"hl-resolution-section",children:[e.jsx("span",{className:"hl-resolution-section-lbl",children:"Response Notes"}),e.jsx("span",{className:"hl-resolution-section-val",children:p.responder_notes})]}),p.action_notes&&e.jsxs("div",{className:"hl-resolution-section",children:[e.jsx("span",{className:"hl-resolution-section-lbl",children:"Action Taken"}),e.jsx("span",{className:"hl-resolution-section-val",children:p.action_notes})]}),ne.length>0&&e.jsxs("div",{className:"hl-resolution-section",style:{gridColumn:"1 / -1"},children:[e.jsxs("span",{className:"hl-resolution-section-lbl",children:[e.jsx(ja,{size:8,style:{marginRight:4}}),"Action Tags"]}),e.jsx("div",{className:"hl-tags-wrap",children:ne.map((X,ge)=>e.jsx("span",{className:"hl-tag",children:X},ge))})]})]}),p.resolved_at&&e.jsxs("div",{className:"hl-resolution-footer",children:["✓ Resolved on ",oe(p.resolved_at)]})]}),p.evidence_url&&e.jsxs("div",{className:"hl-expand-evidence",children:[!fe(p.evidence_url)&&e.jsx("img",{src:p.evidence_url,alt:"evidence",className:"hl-evidence-thumb"}),e.jsxs("a",{href:p.evidence_url,target:"_blank",rel:"noopener noreferrer",className:"hl-evidence-link",onClick:X=>X.stopPropagation(),children:[fe(p.evidence_url)?e.jsx(Ve,{size:11}):e.jsx(qe,{size:11}),"View ",fe(p.evidence_url)?"Video":"Photo"," Evidence",e.jsx(Ge,{size:9,style:{opacity:.5}})]})]})]})})})]},p.id)})})]}),!d&&q.length>Z&&e.jsxs("div",{className:"hl-pagination",children:[e.jsxs("span",{className:"hl-pagination-info",children:["Showing ",(U-1)*Z+1,"–",Math.min(U*Z,q.length)," of ",q.length]}),e.jsxs("div",{className:"hl-pagination-btns",children:[e.jsx("button",{className:"hl-page-btn",disabled:U===1,onClick:()=>_(1),children:"«"}),e.jsx("button",{className:"hl-page-btn",disabled:U===1,onClick:()=>_(s=>s-1),children:"‹"}),Array.from({length:Math.min(5,G)},(s,C)=>{const A=Math.max(1,Math.min(U-2,G-4))+C;return e.jsx("button",{className:`hl-page-btn${A===U?" active":""}`,onClick:()=>_(A),children:A},A)}),e.jsx("button",{className:"hl-page-btn",disabled:U===G,onClick:()=>_(s=>s+1),children:"›"}),e.jsx("button",{className:"hl-page-btn",disabled:U===G,onClick:()=>_(G),children:"»"})]})]})]})]})]})}const Le=[{id:"overview",label:"Overview",icon:e.jsx(Ca,{}),group:"Command"},{id:"incidents",label:"Incidents",icon:e.jsx(ie,{}),group:"Command"},{id:"alerts",label:"Alerts",icon:e.jsx(ae,{}),group:"Command"},{id:"responders",label:"Responders",icon:e.jsx(re,{}),group:"Management"},{id:"team",label:"Team",icon:e.jsx(re,{}),group:"Management"},{id:"analytics",label:"Analytics",icon:e.jsx(We,{}),group:"Management"},{id:"history",label:"History Log",icon:e.jsx(ve,{}),group:"Management"}],xe={fire:{icon:"🔥",color:"#FF3B30"},accident:{icon:"🚗",color:"#FF9500"},flood:{icon:"🌊",color:"#0066FF"},crime:{icon:"🚨",color:"#FF2D55"},medical:{icon:"🏥",color:"#00B074"},other:{icon:"⚠️",color:"#9CA3AF"}},Be={pending:{label:"PENDING",color:"#FF3B30",bg:"rgba(255,59,48,.08)",border:"rgba(255,59,48,.25)"},"in-progress":{label:"IN PROG",color:"#FF9500",bg:"rgba(255,149,0,.08)",border:"rgba(255,149,0,.25)"},resolved:{label:"RESOLVED",color:"#00B074",bg:"rgba(0,176,116,.08)",border:"rgba(0,176,116,.25)"}},hr=`
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

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes fadeIn  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: none; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
@keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
@keyframes spin    { to { transform: rotate(360deg); } }

/* ── Portal / shell ── */
.hud-portal {
  position: fixed; inset: 0; z-index: 9000; overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text); background: var(--bg);
  background-image: url('${Na}');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

.hud-portal::before {
  content: '';
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, rgba(8,12,20,0.93), rgba(8,12,20,0.93));
  pointer-events: none;
  z-index: 1;
}

.hud { display: flex; height: 100%; width: 100%; position: relative; z-index: 2; }

/* ── Mobile overlay ── */
.hud-sidebar-overlay {
  display: none; position: fixed; inset: 0; z-index: 190;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
}
.hud-sidebar-overlay.open { display: block; }

/* ── Sidebar ── */
.hud-sidebar {
  width: 260px; flex-shrink: 0;
  background: var(--surface); border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  height: 100%; position: fixed; left: 0; top: 0; z-index: 200;
  overflow: hidden; transition: transform 0.3s ease;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
}

.hud-logo {
  padding: 20px 16px; display: flex; align-items: center; gap: 12px;
  flex-shrink: 0; border-bottom: 1px solid var(--border);
}
.hud-logo-img-wrap { position: relative; width: 40px; height: 40px; flex-shrink: 0; }
.hud-logo-img { width: 40px; height: 40px; object-fit: contain; border-radius: 8px; }
.hud-logo-glow  { display: none; }
.hud-logo-ring  { display: none; }
.hud-logo-text-wrap { flex: 1; min-width: 0; }
.hud-logo-name {
  font-size: 15px; font-weight: 700; color: var(--text);
  white-space: nowrap; display: block;
  background: none; -webkit-background-clip: unset; -webkit-text-fill-color: unset;
  background-clip: unset; filter: none; letter-spacing: normal;
}
.hud-logo-sub {
  font-size: 11px; color: var(--text-tertiary);
  margin-top: 3px; display: flex; align-items: center; gap: 6px;
  font-family: inherit; letter-spacing: normal; text-transform: none;
}

.hud-sidebar-close {
  display: none; margin-left: auto;
  background: transparent; border: 1px solid var(--border); border-radius: 6px;
  width: 28px; height: 28px; align-items: center; justify-content: center;
  color: var(--text-tertiary); cursor: pointer; transition: all 0.2s; flex-shrink: 0;
}
.hud-sidebar-close:hover { background: var(--bg); color: var(--text); border-color: var(--text-secondary); }

.hud-status-pip {
  display: inline-block; width: 5px; height: 5px; border-radius: 50%;
  background: var(--success); animation: pulse 2s ease infinite; flex-shrink: 0;
}

/* ── Nav ── */
.hud-nav-scroll {
  flex: 1; overflow-y: auto; padding: 8px 10px;
  scrollbar-width: thin; scrollbar-color: var(--border) transparent;
}
.hud-nav-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 600; color: var(--text-tertiary);
  letter-spacing: 0.5px; text-transform: uppercase; padding: 12px 8px 6px;
}
.hud-nav-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.hud-nav-item {
  display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px;
  border-radius: 8px; border: 1px solid transparent;
  font-size: 13px; font-weight: 500; color: var(--text-secondary);
  background: transparent; cursor: pointer; margin-bottom: 2px;
  text-align: left; transition: all 0.2s; position: relative; overflow: visible;
}
.hud-nav-item:hover { background: var(--bg); color: var(--text); border-color: var(--border); }
.hud-nav-item.active {
  background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%);
  color: white; border-color: transparent; font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,102,255,0.2);
}
.hud-nav-item.active::before { display: none; }
.hud-nav-ic { font-size: 15px; flex-shrink: 0; color: var(--text-tertiary); transition: color 0.2s; display: flex; align-items: center; }
.hud-nav-item.active .hud-nav-ic { color: white; }

.hud-badge {
  margin-left: auto; background: var(--danger); color: white;
  font-size: 10px; min-width: 20px; height: 20px; border-radius: 10px;
  padding: 0 6px; display: flex; align-items: center; justify-content: center;
  animation: pulse 2s ease infinite; font-weight: 600;
}

/* ── Sidebar footer ── */
.hud-sidebar-footer { padding: 12px 10px 16px; border-top: 1px solid var(--border); flex-shrink: 0; }
.hud-user-card {
  display: flex; align-items: center; gap: 10px; padding: 12px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px;
}
.hud-avatar {
  width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--primary) 0%, #0052cc 100%);
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 11px; color: white;
  font-family: inherit; border: none;
}
.hud-user-name { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hud-user-status {
  font-size: 10px; color: var(--success);
  display: flex; align-items: center; gap: 5px; margin-top: 2px;
  font-family: inherit; letter-spacing: normal; text-transform: none;
}
.hud-logout-btn {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
}
.hud-logout-btn:hover { background: var(--danger); color: white; border-color: var(--danger); }

/* ── Main area ── */
.hud-main {
  margin-left: 260px; flex: 1;
  display: flex; flex-direction: column; position: relative; z-index: 1;
  min-width: 0; height: 100vh; overflow-y: auto; overflow-x: hidden;
}

.hud-topbar {
  height: 56px; display: flex; align-items: center; padding: 0 24px;
  background: var(--surface); border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100; gap: 12px; flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.hud-topbar::after { display: none; }

.hud-hamburger {
  display: none; background: var(--bg); border: 1px solid var(--border); border-radius: 6px;
  width: 32px; height: 32px; align-items: center; justify-content: center;
  color: var(--text-secondary); cursor: pointer; transition: all 0.2s; flex-shrink: 0; font-size: 14px;
}
.hud-hamburger:hover { background: var(--surface); border-color: var(--text-secondary); color: var(--text); }

.hud-crumb-trail {
  display: flex; align-items: center; gap: 7px;
  font-size: 12px; color: var(--text-tertiary);
  font-family: inherit; letter-spacing: normal; overflow: hidden; min-width: 0;
}
.hud-crumb-active { color: var(--text); font-weight: 600; white-space: nowrap; }
.hud-crumb-sep { color: var(--text-tertiary); flex-shrink: 0; }
.hud-crumb-hide-mobile {}

.hud-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.hud-topbar-time {
  font-size: 12px; font-weight: 500; color: var(--text-secondary);
  background: var(--bg); border: 1px solid var(--border); border-radius: 6px;
  padding: 6px 12px; white-space: nowrap; font-family: inherit; letter-spacing: normal;
}
.hud-topbar-btn {
  width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border);
  background: transparent; display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary); cursor: pointer; font-size: 13px; transition: all 0.2s; flex-shrink: 0;
}
.hud-topbar-btn:hover { background: var(--bg); color: var(--text); border-color: var(--text-secondary); }
.hud-notif-wrap { position: relative; }
.hud-notif-dot {
  position: absolute; top: 6px; right: 6px; width: 6px; height: 6px; border-radius: 50%;
  background: var(--danger); border: 1px solid var(--surface); animation: pulse 1.5s ease infinite;
}

/* ── Page content ── */
.hud-page { flex: 1; padding: 24px; overflow-x: hidden; min-width: 0; }

/* ── Overview header ── */
.hud-page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
}
.hud-eyebrow {
  font-size: 11px; color: var(--primary); letter-spacing: 0.5px;
  text-transform: uppercase; margin-bottom: 6px; font-weight: 600;
  display: flex; align-items: center; gap: 8px; font-family: inherit;
}
.hud-eyebrow::before { content: ''; display: block; width: 20px; height: 2px; background: var(--primary); }
.hud-title { font-size: 32px; color: var(--text); letter-spacing: -0.5px; line-height: 1.1; font-weight: 700; font-family: inherit; }
.hud-subtitle { font-size: 11px; color: var(--text-tertiary); margin-top: 4px; font-family: inherit; letter-spacing: normal; }
.hud-live-tag {
  display: flex; align-items: center; gap: 6px; font-size: 11px; padding: 6px 12px;
  border-radius: 6px; border: 1px solid var(--danger);
  background: rgba(255,59,48,0.06); color: var(--danger); letter-spacing: 0.3px;
  white-space: nowrap; font-weight: 600; font-family: inherit;
}
.hud-live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--danger); animation: pulse 1.4s ease infinite; }

/* ── Stat cards ── */
.hud-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
.hud-stat {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 20px; position: relative; overflow: hidden; transition: all 0.3s; cursor: default;
  animation: fadeIn 0.5s ease-out both; backdrop-filter: none;
}
.hud-stat:nth-child(2) { animation-delay: 0.05s; }
.hud-stat:nth-child(3) { animation-delay: 0.10s; }
.hud-stat:nth-child(4) { animation-delay: 0.15s; }
.hud-stat:nth-child(5) { animation-delay: 0.20s; }
.hud-stat:nth-child(6) { animation-delay: 0.25s; }
.hud-stat:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: 0 8px 16px rgba(0,102,255,0.1); }
.hud-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--card-accent); }
.hud-stat-icon { font-size: 18px; color: var(--card-accent); margin-bottom: 12px; opacity: 0.85; }
.hud-stat-num { font-size: 32px; line-height: 1; margin-bottom: 6px; letter-spacing: -0.5px; font-weight: 700; color: var(--card-accent); font-family: inherit; }
.hud-stat-label { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.3px; text-transform: uppercase; font-weight: 500; font-family: inherit; }
.hud-stat-delta { position: absolute; top: 12px; right: 12px; font-size: 9px; border: 1px solid var(--card-accent); border-radius: 4px; padding: 2px 6px; color: var(--card-accent); opacity: 0.6; font-family: inherit; }

/* ── Panels ── */
.hud-panels-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.hud-panel {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 20px; min-width: 0; backdrop-filter: none; animation: slideIn 0.5s ease-out both;
}
.hud-panel:nth-child(2) { animation-delay: 0.1s; }
.hud-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.hud-panel-title { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600; font-family: inherit; }
.hud-panel-tag { font-size: 9px; color: var(--primary); border: 1px solid var(--primary); border-radius: 4px; padding: 3px 8px; background: rgba(0,102,255,0.05); font-weight: 600; white-space: nowrap; }

/* ── Incident cards ── */
.hud-inc-full {
  display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px;
  padding: 14px; background: var(--bg); border: 1px solid var(--border);
  border-radius: 10px;
}
.hud-inc-full:last-child { margin-bottom: 0; }
.hud-inc-full-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.hud-inc-full-title { font-size: 15px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-family: inherit; }
.hud-inc-full-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.hud-inc-field { display: flex; flex-direction: column; gap: 3px; padding: 8px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 7px; min-width: 0; }
.hud-inc-field-label { font-size: 9px; color: var(--text-tertiary); letter-spacing: 0.1em; text-transform: uppercase; font-family: inherit; }
.hud-inc-field-val { font-size: 12.5px; color: var(--text); line-height: 1.4; overflow-wrap: break-word; word-break: break-word; }
.hud-inc-desc { font-size: 12.5px; color: var(--text-secondary); line-height: 1.6; padding: 8px 10px; background: var(--surface); border-radius: 6px; border: 1px solid var(--border); overflow-wrap: break-word; }
.hud-inc-evidence-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.hud-inc-evidence-large {
  display: flex; align-items: center; gap: 8px; padding: 8px 12px;
  background: rgba(0,102,255,0.05); border: 1px solid rgba(0,102,255,0.18);
  border-radius: 8px; text-decoration: none; color: var(--primary);
  font-size: 12px; transition: background 0.15s; width: fit-content; max-width: 100%;
}
.hud-inc-evidence-large:hover { background: rgba(0,102,255,0.1); }
.hud-inc-evidence-img { max-width: 120px; max-height: 80px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border); }

.hud-inc-badge {
  font-size: 9px; padding: 3px 9px; border-radius: 4px;
  background: var(--ib-bg); color: var(--ib-text); border: 1px solid var(--ib-border);
  white-space: nowrap; font-weight: 600;
}

/* ── Bar chart ── */
.hud-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.hud-bar-row:last-child { margin-bottom: 0; }
.hud-bar-label { font-size: 12px; color: var(--text-secondary); width: 72px; flex-shrink: 0; display: flex; align-items: center; gap: 5px; font-weight: 500; }
.hud-bar-track { flex: 1; height: 5px; border-radius: 3px; background: var(--border); overflow: hidden; min-width: 0; }
.hud-bar-fill { height: 100%; border-radius: 3px; background: var(--bar-color); transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
.hud-bar-val { font-size: 12px; color: var(--text-secondary); width: 22px; text-align: right; flex-shrink: 0; font-weight: 500; }

/* ── Quick nav ── */
.hud-qnav { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.hud-qbtn {
  display: flex; align-items: center; gap: 8px; padding: 12px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  cursor: pointer; font-size: 12px; font-weight: 600; color: var(--text-secondary);
  text-align: left; transition: all 0.2s; position: relative;
}
.hud-qbtn::before { display: none; }
.hud-qbtn:hover { color: var(--text); transform: translateY(-2px); border-color: var(--text-secondary); }
.hud-qbtn-icon { width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 1px solid var(--qbtn-border); background: var(--qbtn-bg); color: var(--qbtn-color); }

/* ── Spinner / empty ── */
.hud-spinner { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--primary); animation: spin 0.8s linear infinite; }
.hud-empty { text-align: center; padding: 48px 24px; font-size: 12px; letter-spacing: 0.3px; color: var(--text-secondary); text-transform: uppercase; }

/* ── Sub-page resets ── */
.hud-page .al-root, .hud-page .ia-root, .hud-page .inc-root, .hud-page .rp-root, .hud-page .atp-root, .hud-page .hl-root { min-height: unset; padding: 0; }

/* ════════════ RESPONSIVE ════════════ */
@media (max-width: 1024px) {
  .hud-panels-row { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .hud-sidebar { transform: translateX(-100%); width: min(260px, 90vw); box-shadow: 4px 0 12px rgba(0,0,0,0.1); }
  .hud-sidebar.open { transform: translateX(0); }
  .hud-sidebar-close { display: flex; }
  .hud-hamburger { display: flex; }
  .hud-main { margin-left: 0; }
  .hud-topbar { padding: 0 16px; }
  .hud-crumb-hide-mobile { display: none; }
  .hud-topbar-time { font-size: 11px; padding: 4px 8px; }
  .hud-page { padding: 16px; }
  .hud-title { font-size: 26px; }
  .hud-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .hud-stat-num { font-size: 24px; }
  .hud-inc-full-grid { grid-template-columns: 1fr; }
  .hud-qnav { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 420px) {
  .hud-qnav { grid-template-columns: 1fr; }
  .hud-topbar-time { display: none; }
  .hud-page { padding: 14px 12px; }
}
`;function gr(){const[a,r]=i.useState("");return i.useEffect(()=>{const d=()=>{const u=new Date;r(`${String(u.getHours()).padStart(2,"0")}:${String(u.getMinutes()).padStart(2,"0")}:${String(u.getSeconds()).padStart(2,"0")} PHT`)};d();const f=setInterval(d,1e3);return()=>clearInterval(f)},[]),a}function ur(a){const r=Math.floor((Date.now()-new Date(a).getTime())/1e3);return r<60?`${r}s ago`:r<3600?`${Math.floor(r/60)}m ago`:r<86400?`${Math.floor(r/3600)}h ago`:new Date(a).toLocaleDateString()}function mr(a){return/\.(mp4|mov|avi|webm|mkv)/i.test(a)}function br({r:a}){const r=xe[a.type]??xe.other,d=Be[a.status]??Be.pending,f=a.reporter_contact,u=a.evidence_url,m=u&&mr(a.evidence_url);return e.jsxs("div",{className:"hud-inc-full",children:[e.jsxs("div",{className:"hud-inc-full-header",children:[e.jsxs("div",{className:"hud-inc-full-title",children:[e.jsx("span",{children:r.icon}),e.jsx("span",{style:{color:r.color,textTransform:"capitalize"},children:a.type.replace(/_/g," ")}),e.jsxs("span",{style:{fontSize:9,opacity:.4,fontWeight:400},children:["#",String(a.id).slice(0,8)]})]}),e.jsx("span",{className:"hud-inc-badge",style:{"--ib-bg":d.bg,"--ib-text":d.color,"--ib-border":d.border},children:d.label})]}),e.jsxs("div",{className:"hud-inc-full-grid",children:[e.jsxs("div",{className:"hud-inc-field",children:[e.jsxs("span",{className:"hud-inc-field-label",children:[e.jsx(Ue,{size:8,style:{marginRight:3}}),"Location"]}),e.jsx("span",{className:"hud-inc-field-val",children:a.address||a.location||"—"})]}),e.jsxs("div",{className:"hud-inc-field",children:[e.jsxs("span",{className:"hud-inc-field-label",children:[e.jsx(Ye,{size:8,style:{marginRight:3}}),"Reporter"]}),e.jsx("span",{className:"hud-inc-field-val",children:a.reporter_name||"Anonymous"})]}),f&&e.jsxs("div",{className:"hud-inc-field",children:[e.jsxs("span",{className:"hud-inc-field-label",children:[e.jsx(He,{size:8,style:{marginRight:3}}),"Contact"]}),e.jsx("a",{href:`tel:${a.reporter_contact}`,className:"hud-inc-field-val",style:{color:"var(--success)",textDecoration:"none"},children:a.reporter_contact})]}),e.jsxs("div",{className:"hud-inc-field",children:[e.jsxs("span",{className:"hud-inc-field-label",children:[e.jsx(je,{size:8,style:{marginRight:3}}),"Reported"]}),e.jsx("span",{className:"hud-inc-field-val",children:ur(a.created_at)})]})]}),a.description&&e.jsx("div",{className:"hud-inc-desc",children:a.description}),u&&e.jsxs("div",{className:"hud-inc-evidence-row",children:[!m&&e.jsx("img",{src:a.evidence_url,alt:"evidence",className:"hud-inc-evidence-img"}),e.jsxs("a",{href:a.evidence_url,target:"_blank",rel:"noopener noreferrer",className:"hud-inc-evidence-large",children:[m?e.jsx(Ve,{size:12}):e.jsx(qe,{size:12}),"View ",m?"Video":"Photo"," Evidence",e.jsx(Ge,{size:9,style:{opacity:.5}})]})]})]})}function fr({onNavigate:a}){const[r,d]=i.useState({total:0,pending:0,inProgress:0,resolved:0,responders:0,alerts:0}),[f,u]=i.useState([]),[m,v]=i.useState({}),[h,y]=i.useState(!0),N=async()=>{const[t,x,b]=await Promise.all([g.from("reports").select("id,type,description,location,address,reporter_name,reporter_contact,status,evidence_url,created_at,responder_id").order("created_at",{ascending:!1}),g.from("responders").select("id"),g.from("alerts").select("id")]),c=t.data??[],w={};c.forEach(l=>{w[l.type]=(w[l.type]??0)+1}),d({total:c.length,pending:c.filter(l=>l.status==="pending").length,inProgress:c.filter(l=>l.status==="in-progress").length,resolved:c.filter(l=>l.status==="resolved").length,responders:(x.data??[]).length,alerts:(b.data??[]).length}),u(c.slice(0,5)),v(w),y(!1)};i.useEffect(()=>{N();const t=g.channel("overview-reports").on("postgres_changes",{event:"*",schema:"public",table:"reports"},N).subscribe();return()=>{g.removeChannel(t)}},[]);const k=[{label:"Total Reports",value:r.total,accent:"#0066FF",icon:e.jsx(ie,{}),delta:"ALL TIME"},{label:"Pending",value:r.pending,accent:"#FF3B30",icon:e.jsx(he,{}),delta:"URGENT"},{label:"In Progress",value:r.inProgress,accent:"#FF9500",icon:e.jsx(je,{}),delta:void 0},{label:"Resolved",value:r.resolved,accent:"#00B074",icon:e.jsx(ye,{}),delta:void 0},{label:"Responders",value:r.responders,accent:"#00B074",icon:e.jsx(re,{}),delta:"ACTIVE"},{label:"Alerts Sent",value:r.alerts,accent:"#FF3B30",icon:e.jsx(ae,{}),delta:"TOTAL"}],F=["fire","flood","medical","crime","accident","other"],S=Math.max(...F.map(t=>m[t]??0),1),j=[{id:"incidents",label:"Incidents",icon:e.jsx(ie,{}),color:"#0066FF",bg:"rgba(0,102,255,.08)",border:"rgba(0,102,255,.2)"},{id:"alerts",label:"Alerts",icon:e.jsx(ae,{}),color:"#FF3B30",bg:"rgba(255,59,48,.08)",border:"rgba(255,59,48,.2)"},{id:"team",label:"Team",icon:e.jsx(re,{}),color:"#00B074",bg:"rgba(0,176,116,.08)",border:"rgba(0,176,116,.2)"},{id:"analytics",label:"Analytics",icon:e.jsx(We,{}),color:"#FF9500",bg:"rgba(255,149,0,.08)",border:"rgba(255,149,0,.2)"}];return e.jsxs("div",{children:[e.jsxs("div",{className:"hud-page-header",children:[e.jsxs("div",{children:[e.jsx("div",{className:"hud-eyebrow",children:"Admin Panel"}),e.jsx("div",{className:"hud-title",children:"Command Overview"}),e.jsx("div",{className:"hud-subtitle",children:"DUMAGUETE CITY EMERGENCY HQ"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[h&&e.jsx("div",{className:"hud-spinner"}),e.jsxs("div",{className:"hud-live-tag",children:[e.jsx("span",{className:"hud-live-dot"}),"LIVE FEED"]})]})]}),e.jsx("div",{className:"hud-stat-grid",children:k.map(t=>e.jsxs("div",{className:"hud-stat",style:{"--card-accent":t.accent},children:[e.jsx("div",{className:"hud-stat-icon",children:t.icon}),e.jsx("div",{className:"hud-stat-num",children:h?"—":t.value}),e.jsx("div",{className:"hud-stat-label",children:t.label}),t.delta&&e.jsx("span",{className:"hud-stat-delta",children:t.delta})]},t.label))}),e.jsxs("div",{className:"hud-panels-row",children:[e.jsxs("div",{className:"hud-panel",style:{overflow:"auto",maxHeight:520},children:[e.jsxs("div",{className:"hud-panel-head",children:[e.jsx("span",{className:"hud-panel-title",children:"Live Incident Feed"}),e.jsx("span",{className:"hud-panel-tag",children:"REAL-TIME"})]}),h?e.jsx("div",{className:"hud-empty",children:e.jsx("div",{className:"hud-spinner",style:{margin:"0 auto"}})}):f.length===0?e.jsx("div",{className:"hud-empty",children:"No reports yet"}):f.map(t=>e.jsx(br,{r:t},String(t.id)))]}),e.jsxs("div",{className:"hud-panel",children:[e.jsxs("div",{className:"hud-panel-head",children:[e.jsx("span",{className:"hud-panel-title",children:"Incident Types"}),e.jsx("span",{className:"hud-panel-tag",children:"ALL TIME"})]}),F.map(t=>{const x=xe[t]??xe.other,b=m[t]??0;return e.jsxs("div",{className:"hud-bar-row",children:[e.jsxs("span",{className:"hud-bar-label",children:[e.jsx("span",{children:x.icon}),e.jsx("span",{style:{textTransform:"capitalize"},children:t})]}),e.jsx("div",{className:"hud-bar-track",children:e.jsx("div",{className:"hud-bar-fill",style:{width:`${b/S*100}%`,"--bar-color":x.color}})}),e.jsx("span",{className:"hud-bar-val",children:b})]},t)}),e.jsxs("div",{style:{borderTop:"1px solid var(--border)",marginTop:16,paddingTop:14},children:[e.jsx("div",{className:"hud-panel-title",style:{marginBottom:11},children:"Quick Actions"}),e.jsx("div",{className:"hud-qnav",children:j.map(t=>e.jsxs("button",{className:"hud-qbtn",style:{"--qbtn-color":t.color,"--qbtn-bg":t.bg,"--qbtn-border":t.border},onClick:()=>a(t.id),children:[e.jsx("span",{className:"hud-qbtn-icon",children:t.icon}),t.label]},t.id))})]})]})]})]})}function jr(){const a=wa(),r=gr(),[d,f]=i.useState("overview"),[u,m]=i.useState(0),[v,h]=i.useState("Admin"),[y,N]=i.useState(!1),k=x=>{f(x),N(!1)};i.useEffect(()=>{const x=b=>{b.key==="Escape"&&N(!1)};return window.addEventListener("keydown",x),()=>window.removeEventListener("keydown",x)},[]),i.useEffect(()=>(document.body.style.overflow=y?"hidden":"",()=>{document.body.style.overflow=""}),[y]),i.useEffect(()=>{const x=async()=>{const{data:{user:c}}=await g.auth.getUser();if(c){const{data:l}=await g.from("profiles").select("full_name").eq("id",c.id).single();l?.full_name&&h(l.full_name),await g.from("profiles").update({status:"on_duty",last_seen:new Date().toISOString()}).eq("id",c.id),await g.from("responders").update({status:"on_duty"}).eq("email",c.email)}const{data:w}=await g.from("reports").select("id").eq("status","pending");m((w??[]).length)};x();const b=g.channel("dashboard-pending").on("postgres_changes",{event:"*",schema:"public",table:"reports"},x).subscribe();return()=>{g.removeChannel(b)}},[]);const F=async()=>{const{data:{user:x}}=await g.auth.getUser();x&&(await g.from("profiles").update({status:"off_duty",last_seen:new Date().toISOString()}).eq("id",x.id),await g.from("responders").update({status:"off_duty"}).eq("email",x.email)),await g.auth.signOut(),a("/login",{replace:!0})},S=v.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase(),j={overview:"Overview",incidents:"Incidents",alerts:"Alerts",responders:"Responders",team:"Team",analytics:"Analytics",history:"History Log"},t=[{label:"Command",items:Le.filter(x=>x.group==="Command")},{label:"Management",items:Le.filter(x=>x.group==="Management")}];return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:hr}),e.jsx("div",{className:"hud-portal",children:e.jsxs("div",{className:"hud",children:[e.jsx("div",{className:`hud-sidebar-overlay${y?" open":""}`,onClick:()=>N(!1),"aria-hidden":"true"}),e.jsxs("aside",{className:`hud-sidebar${y?" open":""}`,"aria-label":"Navigation",children:[e.jsxs("div",{className:"hud-logo",children:[e.jsx("div",{className:"hud-logo-img-wrap",children:e.jsx("img",{src:ka,alt:"DSG Logo",className:"hud-logo-img"})}),e.jsxs("div",{className:"hud-logo-text-wrap",children:[e.jsx("div",{className:"hud-logo-name",children:"DumaSafeGuide"}),e.jsxs("div",{className:"hud-logo-sub",children:[e.jsx("span",{className:"hud-status-pip"}),"ADMIN"]})]}),e.jsx("button",{className:"hud-sidebar-close",onClick:()=>N(!1),"aria-label":"Close navigation",children:e.jsx(za,{})})]}),e.jsx("nav",{className:"hud-nav-scroll",children:t.map(x=>e.jsxs("div",{children:[e.jsx("div",{className:"hud-nav-label",children:x.label}),x.items.map(b=>e.jsxs("button",{className:`hud-nav-item${d===b.id?" active":""}`,onClick:()=>k(b.id),children:[e.jsx("span",{className:"hud-nav-ic",children:b.icon}),e.jsx("span",{children:b.label}),b.id==="incidents"&&u>0&&e.jsx("span",{className:"hud-badge",children:u})]},b.id))]},x.label))}),e.jsxs("div",{className:"hud-sidebar-footer",children:[e.jsxs("div",{className:"hud-user-card",children:[e.jsx("div",{className:"hud-avatar",children:S}),e.jsxs("div",{style:{minWidth:0},children:[e.jsx("div",{className:"hud-user-name",children:v}),e.jsxs("div",{className:"hud-user-status",children:[e.jsx("span",{className:"hud-status-pip"}),"SYS ONLINE"]})]})]}),e.jsxs("button",{className:"hud-logout-btn",onClick:F,children:[e.jsx(Fa,{size:12})," Sign Out"]})]})]}),e.jsxs("div",{className:"hud-main",children:[e.jsxs("div",{className:"hud-topbar",children:[e.jsx("button",{className:"hud-hamburger",onClick:()=>N(!0),"aria-label":"Open navigation","aria-expanded":y,children:e.jsx(Sa,{})}),e.jsxs("div",{className:"hud-crumb-trail",children:[e.jsx("span",{className:"hud-crumb-hide-mobile",children:"DUMASAFEGUIDE"}),e.jsx("span",{className:"hud-crumb-sep hud-crumb-hide-mobile",children:"/"}),e.jsx("span",{className:"hud-crumb-hide-mobile",children:"ADMIN"}),e.jsx("span",{className:"hud-crumb-sep hud-crumb-hide-mobile",children:"/"}),e.jsx("span",{className:"hud-crumb-active",children:j[d]})]}),e.jsxs("div",{className:"hud-topbar-right",children:[e.jsx("span",{className:"hud-topbar-time",children:r}),e.jsxs("div",{className:"hud-notif-wrap",children:[e.jsx("button",{className:"hud-topbar-btn","aria-label":"Notifications",children:e.jsx(ae,{size:13})}),u>0&&e.jsx("span",{className:"hud-notif-dot"})]})]})]}),e.jsxs("div",{className:"hud-page",children:[d==="overview"&&e.jsx(fr,{onNavigate:k}),d==="incidents"&&e.jsx(Ha,{}),d==="alerts"&&e.jsx(Ma,{}),d==="responders"&&e.jsx(Qa,{}),d==="team"&&e.jsx(sr,{}),d==="analytics"&&e.jsx(Ga,{}),d==="history"&&e.jsx(xr,{})]})]})]})})]})}export{jr as default};
