import{ao as $,am as c,an as f,ak as e,e as B,r as D,k as _,K as I,w as v}from"./index-CvhaT9ii.js";import{p as R}from"./pagesbackground-CfzHpFCG.js";const u={danger:{color:"#EF5B5B",bg:"rgba(239,91,91,0.08)",border:"rgba(239,91,91,0.2)",icon:e.jsx(v,{}),label:"Danger"},warning:{color:"#F5C842",bg:"rgba(245,200,66,0.08)",border:"rgba(245,200,66,0.2)",icon:e.jsx(v,{}),label:"Warning"},info:{color:"#5B8DEF",bg:"rgba(91,141,239,0.08)",border:"rgba(91,141,239,0.2)",icon:e.jsx(I,{}),label:"Info"},success:{color:"#2ECC8F",bg:"rgba(46,204,143,0.08)",border:"rgba(46,204,143,0.2)",icon:e.jsx(_,{}),label:"All Clear"}},P={danger:"Danger",warning:"Warning",info:"Info",success:"All Clear"},G={"Earthquake Advisory":"earthquake","General Emergency":"general","Typhoon Advisory":"typhoon"},j={earthquake:{es:{title:"Advertencia de terremoto",message:"⚠️Advertencia de terremoto: se detectó actividad sísmica. Revise daños estructurales, aléjese de edificios dañados, no use ascensores y esté atento a réplicas."},ilo:{title:"Pakaammo iti Gingined",message:"⚠️Pakaammo iti gingined: adda namataan a panaggingined. Kitaen ti didigra ti pasdek, umadayo kadagiti nadadael a bilding, saan nga agusar iti elevator, ken agannad kadagiti aftershocks."}},general:{es:{title:"Emergencia general",message:"⚠️Aviso de emergencia: se reportó una emergencia en su zona. Mantenga la calma, permanezca dentro y siga a los oficiales del barangay y rescatistas."},ilo:{title:"Sapasap nga Emerhensiya",message:"⚠️Pakaammo ti emerhensiya: adda nai-report nga emerhensiya iti lugaryo. Kalma lang, agtalinaed iti uneg, ken suroten dagiti opisial ti barangay ken responder."}},typhoon:{es:{title:"Advertencia de tifón",message:"🌀Advertencia de tifón: se emitió un aviso de tifón para Dumaguete. Asegure su casa y prepárese."},ilo:{title:"Pakaammo iti Bagyo",message:"🌀Pakaammo iti bagyo: adda babala ti bagyo para iti Siudad ti Dumaguete. Siguraduen ti balay ken agsagana."}}};function M(){try{const i=new(window.AudioContext||window.webkitAudioContext),r=i.createOscillator(),d=i.createGain();r.connect(d),d.connect(i.destination),r.frequency.setValueAtTime(660,i.currentTime),r.frequency.exponentialRampToValueAtTime(330,i.currentTime+.3),d.gain.setValueAtTime(.12,i.currentTime),d.gain.exponentialRampToValueAtTime(.001,i.currentTime+.4),r.start(),r.stop(i.currentTime+.4)}catch{}}const q=`
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ca-root {
    min-height: 100vh;
    font-family: 'Instrument Sans', sans-serif;
    color: #eef0f7;
    position: relative;
    overflow-x: hidden;
    background: #080c14;
  }
  .ca-bg {
    position: fixed; inset: 0; z-index: 0;
    background-size: cover; background-position: center; background-repeat: no-repeat;
  }
  .ca-bg::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(8,12,20,.92) 0%, rgba(8,12,20,.82) 50%, rgba(8,12,20,.92) 100%);
  }
  .ca-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
  .ca-glow-a { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(46,204,143,.08) 0%, transparent 70%); top: -180px; left: -80px; }
  .ca-glow-b { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(123,158,255,.06) 0%, transparent 70%); bottom: -140px; right: -60px; }

  .ca-inner { position: relative; z-index: 2; max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }

  /* Hero */
  .ca-hero { margin-top: 20px; margin-bottom: 32px; }
  .ca-hero-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #2ECC8F; margin-bottom: 16px; }
  .ca-hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #2ECC8F; box-shadow: 0 0 8px #2ECC8F; animation: ca-pulse 2.2s ease infinite; }
  @keyframes ca-pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.75);} }
  .ca-hero-heading { font-family: 'Cabinet Grotesk', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 900; line-height: 1.05; letter-spacing: -.035em; color: #eef0f7; margin-bottom: 8px; }
  .ca-hero-heading em { font-style: normal; color: #2ECC8F; }
  .ca-hero-sub { font-size: 14px; color: rgba(238,240,247,.35); display: inline-flex; align-items: center; gap: 7px; }

  /* Live dot */
  .ca-live-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .ca-live-dot.on  { background: #2ECC8F; box-shadow: 0 0 8px #2ECC8F; animation: ca-pulse 2s ease infinite; }
  .ca-live-dot.off { background: rgba(238,240,247,.2); }

  /* Section head */
  .ca-sec { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .ca-sec-label { font-size: 10.5px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: rgba(238,240,247,.28); white-space: nowrap; }
  .ca-sec-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,.1), transparent); }
  .ca-sec-count { font-size: 11px; font-weight: 600; color: rgba(238,240,247,.3); background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 20px; padding: 3px 10px; white-space: nowrap; }

  /* Filters */
  .ca-filters { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
  .ca-pill { padding: 5px 14px; border-radius: 20px; border: 1px solid; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; cursor: pointer; transition: all .15s; background: transparent; font-family: 'Instrument Sans', sans-serif; }
  .ca-pill--all     { border-color: rgba(255,255,255,.1);    color: rgba(238,240,247,.35); }
  .ca-pill--all.on  { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.2); color: #fff; }
  .ca-pill--danger  { border-color: rgba(239,91,91,.2);  color: rgba(239,91,91,.5); }
  .ca-pill--danger.on  { background: rgba(239,91,91,.1); border-color: rgba(239,91,91,.45); color: #EF5B5B; }
  .ca-pill--warning { border-color: rgba(245,200,66,.2); color: rgba(245,200,66,.5); }
  .ca-pill--warning.on { background: rgba(245,200,66,.1); border-color: rgba(245,200,66,.45); color: #F5C842; }
  .ca-pill--info    { border-color: rgba(91,141,239,.2); color: rgba(91,141,239,.5); }
  .ca-pill--info.on { background: rgba(91,141,239,.1); border-color: rgba(91,141,239,.45); color: #5B8DEF; }

  /* Alert cards */
  .ca-list { display: flex; flex-direction: column; gap: 12px; }
  .ca-card {
    background: rgba(15,21,33,.82); border: 1px solid rgba(255,255,255,.07);
    border-left: 3px solid var(--ca-color);
    border-radius: 14px; overflow: hidden;
    transition: border-color .18s, transform .18s;
    animation: caFade .35s ease both;
    backdrop-filter: blur(16px);
  }
  .ca-card:hover { border-color: rgba(255,255,255,.13); transform: translateY(-2px); }
  @keyframes caFade { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }
  .ca-card.is-new { animation: caNew 5s ease both; }
  @keyframes caNew {
    0%   { border-color: rgba(46,204,143,.5); box-shadow: 0 0 22px rgba(46,204,143,.1); }
    60%  { border-color: rgba(46,204,143,.15); }
    100% { border-color: rgba(255,255,255,.07); box-shadow: none; }
  }

  .ca-card-body { padding: 18px 20px; }
  .ca-card-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px; }
  .ca-card-icon { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; }
  .ca-card-info { flex: 1; min-width: 0; }
  .ca-card-title { font-family: 'Cabinet Grotesk', sans-serif; font-size: 15px; font-weight: 800; color: #eef0f7; letter-spacing: -.01em; margin-bottom: 6px; }
  .ca-card-msg { font-size: 13px; color: rgba(238,240,247,.55); line-height: 1.6; }
  .ca-card-footer { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding-top: 12px; border-top: 1px solid rgba(255,255,255,.05); margin-top: 12px; }
  .ca-tag { font-size: 9.5px; font-family: monospace; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 3px 9px; border-radius: 5px; }
  .ca-time { font-size: 11px; font-family: monospace; color: rgba(238,240,247,.28); margin-left: auto; display: flex; align-items: center; gap: 5px; }
  .ca-new-badge {
    font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
    color: #2ECC8F; background: rgba(46,204,143,.1); border: 1px solid rgba(46,204,143,.25);
    border-radius: 20px; padding: 2px 8px;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .ca-new-badge-dot { width: 4px; height: 4px; border-radius: 50%; background: #2ECC8F; box-shadow: 0 0 5px #2ECC8F; animation: ca-pulse 2s ease infinite; }

  /* Empty */
  .ca-empty {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 64px 24px; text-align: center;
    background: rgba(15,21,33,.82); border: 1px dashed rgba(255,255,255,.07);
    border-radius: 20px; backdrop-filter: blur(16px);
  }
  .ca-empty-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); display: flex; align-items: center; justify-content: center; font-size: 20px; color: rgba(238,240,247,.2); }
  .ca-empty-title { font-family: 'Cabinet Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: rgba(238,240,247,.35); }
  .ca-empty-sub { font-size: 13px; color: rgba(238,240,247,.2); max-width: 290px; line-height: 1.6; }

  /* Loading */
  .ca-loading { display: flex; align-items: center; gap: 10px; padding: 64px; justify-content: center; font-size: 13px; color: rgba(238,240,247,.3); background: rgba(15,21,33,.82); border: 1px solid rgba(255,255,255,.07); border-radius: 20px; backdrop-filter: blur(16px); }
  .ca-spin { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.1); border-top-color: #2ECC8F; animation: caSpin .75s linear infinite; display: inline-block; flex-shrink: 0; }
  @keyframes caSpin { to{transform:rotate(360deg);} }
`;function Y(){const{language:i,t:r,tList:d}=$(),A=i==="tl"?"fil-PH":"en-PH",m=a=>r(`alerts.levels.${a}`,P[a]??u[a]?.label??a),N=a=>{const n=(Date.now()-new Date(a).getTime())/1e3;return n<60?r("timeAgo.second","{n}s ago").replace("{n}",String(Math.floor(n))):n<3600?r("timeAgo.minute","{n}m ago").replace("{n}",String(Math.floor(n/60))):n<86400?r("timeAgo.hour","{n}h ago").replace("{n}",String(Math.floor(n/3600))):new Date(a).toLocaleDateString(A,{month:"short",day:"numeric",year:"numeric"})},h=a=>G[(a.title??"").trim()]??null,C=a=>{const n=h(a);if(n){const t=j[n]?.[i];return t?t.title:r(`alerts.types.${n}.title`,a.title)}return a.title||r("alerts.alert","Alert")},E=a=>{const n=h(a);if(n){const t=j[n]?.[i];return t?t.message:r(`alerts.items.${n}.message`,a.message??"")}return a.message??""},[l,b]=c.useState([]),[S,z]=c.useState(!0),[y,F]=c.useState(!1),[g,T]=c.useState("all"),[L,w]=c.useState(new Set);c.useEffect(()=>{(async()=>{const{data:t,error:s}=await f.from("alerts").select("*").order("created_at",{ascending:!1}).limit(50);s&&console.error("CitizenAlerts load error:",s),b(t??[]),z(!1)})();const n=f.channel("citizen-alerts-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"alerts"},t=>{const s=t.new;b(o=>o.some(p=>p.id===s.id)?o:[s,...o]),w(o=>new Set(o).add(s.id)),M(),setTimeout(()=>{w(o=>{const p=new Set(o);return p.delete(s.id),p})},5e3)}).on("postgres_changes",{event:"DELETE",schema:"public",table:"alerts"},t=>{b(s=>s.filter(o=>o.id!==t.old.id))}).subscribe(t=>F(t==="SUBSCRIBED"));return()=>{f.removeChannel(n)}},[]);const x=g==="all"?l:l.filter(a=>a.type===g),k={all:l.length,danger:l.filter(a=>a.type==="danger").length,warning:l.filter(a=>a.type==="warning").length,info:l.filter(a=>a.type==="info").length};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:q}),e.jsxs("div",{className:"ca-root",children:[e.jsx("div",{className:"ca-bg",style:{backgroundImage:`url(${R})`}}),e.jsxs("div",{className:"ca-glow",children:[e.jsx("div",{className:"ca-glow-a"}),e.jsx("div",{className:"ca-glow-b"})]}),e.jsxs("div",{className:"ca-inner",children:[e.jsxs("section",{className:"ca-hero",children:[e.jsxs("div",{className:"ca-hero-tag",children:[e.jsx("span",{className:"ca-hero-dot"}),r("alerts.citizenPortal")]}),e.jsx("h1",{className:"ca-hero-heading",children:r("alerts.barangayAlerts","Barangay Alerts")}),e.jsxs("p",{className:"ca-hero-sub",children:[e.jsx("span",{className:`ca-live-dot ${y?"on":"off"}`}),r(y?"alerts.live":"alerts.connecting")]})]}),e.jsx("div",{className:"ca-filters",children:["all","danger","warning","info"].map(a=>e.jsx("button",{className:`ca-pill ca-pill--${a}${g===a?" on":""}`,onClick:()=>T(a),children:a==="all"?`${r("alerts.allAlerts","All Alerts")} (${k.all})`:`${m(a)} (${k[a]})`},a))}),e.jsxs("div",{className:"ca-sec",children:[e.jsx("span",{className:"ca-sec-label",children:g==="all"?r("alerts.allAlerts","All Alerts"):`${m(g)} ${r("alerts.alert","Alert")}`}),e.jsx("span",{className:"ca-sec-line"}),e.jsxs("span",{className:"ca-sec-count",children:[x.length," ",r("alerts.total")]})]}),S?e.jsxs("div",{className:"ca-loading",children:[e.jsx("span",{className:"ca-spin"})," ",r("alerts.loadingAlerts")]}):x.length===0?e.jsxs("div",{className:"ca-empty",children:[e.jsx("div",{className:"ca-empty-icon",children:e.jsx(B,{})}),e.jsx("div",{className:"ca-empty-title",children:r("alerts.noActiveAlerts")}),e.jsx("p",{className:"ca-empty-sub",children:l.length===0?r("alerts.noAlertsYet"):r("alerts.noAlertsMatch")})]}):e.jsx("div",{className:"ca-list",children:x.map((a,n)=>{const t=u[a.type]??u.info,s=L.has(a.id);return e.jsx("div",{className:`ca-card${s?" is-new":""}`,style:{"--ca-color":t.color,animationDelay:`${Math.min(n*.05,.5)}s`},children:e.jsxs("div",{className:"ca-card-body",children:[e.jsxs("div",{className:"ca-card-top",children:[e.jsx("div",{className:"ca-card-icon",style:{background:t.bg,color:t.color,border:`1px solid ${t.border}`},children:t.icon}),e.jsxs("div",{className:"ca-card-info",children:[e.jsx("div",{className:"ca-card-title",children:C(a)}),e.jsx("div",{className:"ca-card-msg",children:E(a)})]})]}),e.jsxs("div",{className:"ca-card-footer",children:[e.jsx("span",{className:"ca-tag",style:{background:t.bg,color:t.color,border:`1px solid ${t.border}`},children:m(a.type)}),s&&e.jsxs("span",{className:"ca-new-badge",children:[e.jsx("span",{className:"ca-new-badge-dot"}),r("alerts.isNew")]}),e.jsxs("span",{className:"ca-time",children:[e.jsx(D,{size:9}),N(a.created_at)]})]})]})},a.id)})})]})]})]})}export{Y as default};
