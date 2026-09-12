import{aq as G,am as o,an as p,ak as e,a as F,ae as v,d as z,e as Y,H as _,B as O,a2 as q,N as H,r as S,w as X,h as V,F as W,a8 as J,ab as K,C as Q,k as Z,Y as ee,o as ae}from"./index-CvhaT9ii.js";import{p as re}from"./pagesbackground-CfzHpFCG.js";const f={fire:{color:"#FF6B6B",bg:"rgba(255,107,107,0.10)",icon:e.jsx(Q,{}),label:"Fire"},flood:{color:"#7B9EFF",bg:"rgba(123,158,255,0.10)",icon:e.jsx(K,{}),label:"Flood"},crime:{color:"#FF9F43",bg:"rgba(255,159,67,0.10)",icon:e.jsx(J,{}),label:"Crime"},medical:{color:"#2ECC8F",bg:"rgba(46,204,143,0.10)",icon:e.jsx(W,{}),label:"Medical"},accident:{color:"#FFD166",bg:"rgba(255,209,102,0.10)",icon:e.jsx(V,{}),label:"Accident"},default:{color:"#A78BFA",bg:"rgba(167,139,250,0.10)",icon:e.jsx(X,{}),label:"Other"}},T={pending:{label:"Pending",color:"#FFD166",bg:"rgba(255,209,102,0.12)",icon:e.jsx(S,{size:10})},"in-progress":{label:"In Progress",color:"#7B9EFF",bg:"rgba(123,158,255,0.12)",icon:e.jsx(ee,{size:10})},resolved:{label:"Resolved",color:"#2ECC8F",bg:"rgba(46,204,143,0.12)",icon:e.jsx(Z,{size:10})}},te=["all","fire","flood","crime","medical","accident"],ie=["all","pending","in-progress","resolved"];function C(n){const i=(Date.now()-new Date(n).getTime())/1e3;return i<60?`${Math.floor(i)}s ago`:i<3600?`${Math.floor(i/60)}m ago`:i<86400?`${Math.floor(i/3600)}h ago`:new Date(n).toLocaleDateString("en-PH",{month:"short",day:"numeric"})}function se(n){return f[n.type?.toLowerCase()]??f.default}function oe(n){return T[n.status]??{label:n.status,color:"#eef0f7",bg:"rgba(255,255,255,0.08)",icon:e.jsx(ae,{size:10})}}function ce(){const n=G(),[i,x]=o.useState([]),[E,A]=o.useState(!0),[m,D]=o.useState(!1),[I,w]=o.useState(new Set),[g,y]=o.useState("all"),[b,j]=o.useState("all"),[k,U]=o.useState(!1),[c,B]=o.useState(!0),[L,R]=o.useState(new Date),[$,N]=o.useState(null);o.useEffect(()=>{p.auth.getUser().then(async({data:{user:a}})=>{if(!a){N(null);return}const{data:t}=await p.from("profiles").select("role").eq("id",a.id).single();N(t?.role??null)})},[]);const M=$==="responder",P=()=>{try{const a=new(window.AudioContext||window.webkitAudioContext),t=a.createOscillator(),r=a.createGain();t.connect(r),r.connect(a.destination),t.frequency.setValueAtTime(880,a.currentTime),t.frequency.exponentialRampToValueAtTime(440,a.currentTime+.3),r.gain.setValueAtTime(.15,a.currentTime),r.gain.exponentialRampToValueAtTime(.001,a.currentTime+.4),t.start(a.currentTime),t.stop(a.currentTime+.4)}catch{}};o.useEffect(()=>{(async()=>{const{data:t,error:r}=await p.from("reports").select("*").order("created_at",{ascending:!1}).limit(100);!r&&t&&x(t),A(!1)})()},[]),o.useEffect(()=>{const a=p.channel("incident-alerts-feed").on("postgres_changes",{event:"*",schema:"public",table:"reports"},t=>{if(R(new Date),t.eventType==="INSERT"){const r=t.new;x(s=>[r,...s]),w(s=>new Set(s).add(r.id)),c&&P(),setTimeout(()=>w(s=>{const l=new Set(s);return l.delete(r.id),l}),4e3)}if(t.eventType==="UPDATE"){const r=t.new;x(s=>s.map(l=>l.id===r.id?r:l))}t.eventType==="DELETE"&&x(r=>r.filter(s=>s.id!==t.old.id))}).subscribe(t=>D(t==="SUBSCRIBED"));return()=>{p.removeChannel(a)}},[c]);const h=i.filter(a=>{const t=g==="all"||a.type?.toLowerCase()===g,r=b==="all"||a.status===b;return t&&r}),d={total:i.length,pending:i.filter(a=>a.status==="pending").length,active:i.filter(a=>a.status==="in-progress").length,resolved:i.filter(a=>a.status==="resolved").length},u=[g!=="all",b!=="all"].filter(Boolean).length;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #080c14;
          --surface:   rgba(15,21,33,0.55);
          --surface-2: rgba(22,29,46,0.65);
          --border:    rgba(255,255,255,0.08);
          --border-2:  rgba(255,255,255,0.14);
          --text:      #eef0f7;
          --text-2:    rgba(238,240,247,0.55);
          --text-3:    rgba(238,240,247,0.30);
          --green:     #2ECC8F;
          --red:       #FF6B6B;
          --blue:      #7B9EFF;
          --yellow:    #FFD166;
          --orange:    #FF9F43;
          --font-d: 'Cabinet Grotesk', sans-serif;
          --font-b: 'Instrument Sans', sans-serif;
          --r-sm: 8px; --r-md: 14px; --r-lg: 20px;
        }

        body { background: var(--bg); }

        /* ── Page shell ── */
        .ia { min-height: 100vh; font-family: var(--font-b); color: var(--text); position: relative; overflow-x: hidden; }

        .ia-bg {
          position: fixed; inset: 0; z-index: 0;
          background-image: url('${re}');
          background-size: cover; background-position: center; background-repeat: no-repeat;
        }
        .ia-bg::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(8,12,20,0.72);
        }

        .ia-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
        .ia-glow-1 { position: absolute; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%); top: -250px; right: -150px; }
        .ia-glow-2 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(123,158,255,0.06) 0%, transparent 70%); bottom: -100px; left: -80px; }
        .ia-noise  { position: fixed; inset: 0; opacity: 0.022; pointer-events: none; z-index: 1; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 200px; }

        .ia-inner { position: relative; z-index: 2; max-width: 980px; margin: 0 auto; padding: 0 24px 80px; }

        /* ── Nav ── */
        .ia-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 0;
          animation: fadeDown 0.5s ease both;
        }

        .ia-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
        .ia-logo-text { font-family: var(--font-d); font-size: 16px; font-weight: 800; letter-spacing: -0.01em; color: var(--text); }
        .ia-logo-text span { color: var(--green); }

        .ia-nav-right { display: flex; align-items: center; gap: 8px; }

        /* ── Back / nav buttons ── */
        .ia-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-b);
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: var(--r-sm);
          padding: 8px 16px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          white-space: nowrap;
          backdrop-filter: blur(8px);
        }
        .ia-back-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.24);
          transform: translateX(-2px);
        }
        .ia-back-btn:active { transform: translateX(-4px); }
        .ia-back-btn svg { flex-shrink: 0; opacity: 0.8; transition: transform 0.15s; }
        .ia-back-btn:hover svg { transform: translateX(-2px); opacity: 1; }

        /* responder dashboard button — accent green tint */
        .ia-back-btn--responder {
          background: rgba(46,204,143,0.08);
          border-color: rgba(46,204,143,0.22);
          color: #2ECC8F;
        }
        .ia-back-btn--responder:hover {
          background: rgba(46,204,143,0.15);
          border-color: rgba(46,204,143,0.4);
          transform: translateX(-2px);
        }

        /* circle arrow */
        .ia-back-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.13);
          color: var(--text-2);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
          backdrop-filter: blur(8px);
          flex-shrink: 0;
        }
        .ia-back-arrow:hover {
          background: rgba(255,255,255,0.11);
          border-color: rgba(255,255,255,0.22);
          color: var(--text);
          transform: translateX(-2px);
        }

        /* mute btn */
        .ia-mute-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 600;
          color: var(--text-3); border: 1px solid var(--border);
          border-radius: var(--r-sm); padding: 8px 13px;
          background: rgba(255,255,255,0.05);
          cursor: pointer; transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .ia-mute-btn:hover { border-color: var(--border-2); color: var(--text); }
        .ia-mute-btn.active { color: var(--yellow); border-color: rgba(255,209,102,0.3); background: rgba(255,209,102,0.06); }

        /* ── Hero ── */
        .ia-hero { margin-top: 32px; margin-bottom: 28px; animation: fadeUp 0.6s 0.05s ease both; }
        .ia-hero-tag { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 14px; }
        .ia-hero-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: pulse 1.8s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        .ia-hero-heading { font-family: var(--font-d); font-size: clamp(26px, 4vw, 42px); font-weight: 900; line-height: 1.08; letter-spacing: -0.03em; color: var(--text); margin-bottom: 8px; }
        .ia-hero-sub { font-size: 13px; color: var(--text-3); display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        .ia-live { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
        .ia-live-dot { width: 7px; height: 7px; border-radius: 50%; }
        .ia-live-dot.on  { background: var(--green); box-shadow: 0 0 8px var(--green); animation: pulse 2s ease infinite; }
        .ia-live-dot.off { background: var(--text-3); }
        .ia-live.on  { color: var(--green); }
        .ia-live.off { color: var(--text-3); }

        /* ── Stats ── */
        .ia-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; animation: fadeUp 0.6s 0.1s ease both; }
        @media (max-width: 640px) { .ia-stats { grid-template-columns: repeat(2, 1fr); } }

        .ia-stat {
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--r-md); padding: 16px 18px;
          position: relative; overflow: hidden; transition: border-color 0.2s;
          backdrop-filter: blur(6px);
        }
        .ia-stat:hover { border-color: var(--border-2); }
        .ia-stat-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-3); margin-bottom: 8px; }
        .ia-stat-value { font-family: var(--font-d); font-size: 30px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; }
        .ia-stat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; }

        /* ── Toolbar ── */
        .ia-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; animation: fadeUp 0.6s 0.13s ease both; }
        .ia-toolbar-left { display: flex; align-items: center; gap: 8px; flex: 1; flex-wrap: wrap; }

        .ia-filter-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600;
          border: 1px solid var(--border); border-radius: var(--r-sm); padding: 7px 13px;
          background: transparent; color: var(--text-3); cursor: pointer; transition: all 0.2s;
          white-space: nowrap; backdrop-filter: blur(6px);
        }
        .ia-filter-btn:hover, .ia-filter-btn.open { border-color: var(--border-2); color: var(--text); background: rgba(255,255,255,0.04); }
        .ia-filter-btn .ia-badge { background: var(--blue); color: #fff; font-size: 10px; border-radius: 4px; padding: 1px 5px; margin-left: 2px; }

        .ia-result-count { font-size: 12px; color: var(--text-3); margin-left: auto; white-space: nowrap; }

        .ia-filter-clear { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--text-3); background: none; border: none; cursor: pointer; padding: 4px 0; transition: color 0.2s; }
        .ia-filter-clear:hover { color: var(--red); }

        /* ── Filter Drawer ── */
        .ia-filter-drawer {
          background: transparent; border: 1px solid var(--border-2);
          border-radius: var(--r-md); padding: 18px 20px; margin-bottom: 18px;
          animation: fadeUp 0.25s ease both; backdrop-filter: blur(10px);
        }
        .ia-filter-row { display: flex; gap: 20px; flex-wrap: wrap; }
        .ia-filter-group { display: flex; flex-direction: column; gap: 8px; }
        .ia-filter-group-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-3); }
        .ia-filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .ia-chip { font-size: 11.5px; font-weight: 600; border-radius: 20px; padding: 5px 13px; border: 1px solid var(--border); background: transparent; color: var(--text-3); cursor: pointer; transition: all 0.18s; text-transform: capitalize; }
        .ia-chip:hover { border-color: var(--border-2); color: var(--text-2); }
        .ia-chip.active { border-color: transparent; color: #fff; }

        /* ── Section head ── */
        .ia-section-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .ia-section-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-3); white-space: nowrap; }
        .ia-section-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border-2), transparent); }

        /* ── Feed ── */
        .ia-feed { display: flex; flex-direction: column; gap: 10px; }

        .ia-card {
          background: transparent;
          border: 1px solid var(--border); border-radius: var(--r-lg);
          display: grid; grid-template-columns: auto 1fr auto;
          overflow: hidden; transition: border-color 0.2s, transform 0.2s, background 0.2s;
          animation: fadeUp 0.4s ease both;
          text-decoration: none; color: inherit;
          backdrop-filter: blur(6px);
        }
        .ia-card:hover { border-color: var(--border-2); transform: translateY(-1px); background: rgba(255,255,255,0.02); }
        .ia-card.is-new { animation: newFlash 4s ease both; }
        @keyframes newFlash {
          0%   { border-color: rgba(46,204,143,0.6); box-shadow: 0 0 24px rgba(46,204,143,0.15); }
          60%  { border-color: rgba(46,204,143,0.2); box-shadow: 0 0 8px rgba(46,204,143,0.05); }
          100% { border-color: var(--border); box-shadow: none; }
        }

        .ia-card-accent { width: 4px; flex-shrink: 0; }

        .ia-card-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
        .ia-card-top { display: flex; align-items: flex-start; gap: 12px; }
        .ia-card-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
        .ia-card-info { flex: 1; min-width: 0; }
        .ia-card-desc { font-family: var(--font-d); font-size: 15px; font-weight: 700; color: var(--text); line-height: 1.3; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ia-card-id   { font-size: 11px; color: var(--text-3); margin-top: 2px; }
        .ia-card-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .ia-card-meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-3); }
        .ia-card-meta-item svg { opacity: 0.6; }

        .ia-card-right { padding: 16px 18px 16px 0; display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; gap: 10px; }
        .ia-status-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; border-radius: 20px; padding: 4px 11px; white-space: nowrap; }
        .ia-type-pill   { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 600; border-radius: 6px; padding: 3px 9px; text-transform: capitalize; }
        .ia-new-badge { font-size: 9.5px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--green); background: rgba(46,204,143,0.12); border: 1px solid rgba(46,204,143,0.25); border-radius: 4px; padding: 2px 7px; }

        /* ── Empty ── */
        .ia-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 80px 24px; background: transparent; border: 1px solid var(--border); border-radius: var(--r-lg); backdrop-filter: blur(6px); }
        .ia-empty-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--text-3); }
        .ia-empty-title { font-family: var(--font-d); font-size: 16px; font-weight: 700; color: var(--text); }
        .ia-empty-sub   { font-size: 13px; color: var(--text-3); text-align: center; max-width: 300px; }

        /* ── Loading ── */
        .ia-loading { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 100vh; color: var(--text-3); font-size: 13px; position: relative; z-index: 2; }
        .ia-spin { width: 16px; height: 16px; border: 2px solid rgba(46,204,143,0.2); border-top-color: var(--green); border-radius: 50%; animation: spin 0.75s linear infinite; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(18px);  } to { opacity:1; transform:translateY(0); } }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}),e.jsxs("div",{className:"ia",children:[e.jsx("div",{className:"ia-bg"}),e.jsxs("div",{className:"ia-glow",children:[e.jsx("div",{className:"ia-glow-1"}),e.jsx("div",{className:"ia-glow-2"})]}),e.jsx("div",{className:"ia-noise"}),E?e.jsxs("div",{className:"ia-loading",children:[e.jsx("div",{className:"ia-spin"}),"Loading incident feed…"]}):e.jsxs("div",{className:"ia-inner",children:[e.jsxs("nav",{className:"ia-nav",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14},children:[e.jsx("button",{className:"ia-back-arrow",onClick:()=>n(-1),title:"Go back","aria-label":"Go back",children:e.jsx(F,{size:13})}),e.jsx(v,{to:"/",className:"ia-logo",children:e.jsxs("span",{className:"ia-logo-text",children:["DUMA",e.jsx("span",{children:"SAFEGUIDE"})]})})]}),e.jsxs("div",{className:"ia-nav-right",children:[e.jsxs("button",{className:`ia-mute-btn${c?" active":""}`,onClick:()=>B(a=>!a),title:c?"Mute alerts":"Unmute alerts",children:[c?e.jsx(z,{size:11}):e.jsx(Y,{size:11}),c?"Alerts On":"Muted"]}),M?e.jsxs(v,{to:"/responder/dashboard",className:"ia-back-btn ia-back-btn--responder",children:[e.jsx(F,{size:12}),"Dashboard"]}):e.jsxs(v,{to:"/",className:"ia-back-btn",children:[e.jsx(_,{size:12}),"Home"]})]})]}),e.jsxs("div",{className:"ia-hero",children:[e.jsxs("div",{className:"ia-hero-tag",children:[e.jsx("span",{className:"ia-hero-tag-dot"}),"Live Incident Feed"]}),e.jsx("h1",{className:"ia-hero-heading",children:"Incident Alerts"}),e.jsxs("div",{className:"ia-hero-sub",children:[e.jsxs("span",{className:`ia-live ${m?"on":"off"}`,children:[e.jsx("span",{className:`ia-live-dot ${m?"on":"off"}`}),m?"Realtime Connected":"Connecting…"]}),e.jsx("span",{children:"·"}),e.jsxs("span",{children:["Last updated ",C(L.toISOString())]}),e.jsx("span",{children:"·"}),e.jsxs("span",{children:[d.total," total reports"]})]})]}),e.jsxs("div",{className:"ia-stats",children:[e.jsxs("div",{className:"ia-stat",children:[e.jsx("div",{className:"ia-stat-label",children:"Total Reports"}),e.jsx("div",{className:"ia-stat-value",style:{color:"var(--text)"},children:d.total}),e.jsx("div",{className:"ia-stat-bar",style:{background:"linear-gradient(90deg,rgba(238,240,247,0.15),transparent)"}})]}),e.jsxs("div",{className:"ia-stat",children:[e.jsx("div",{className:"ia-stat-label",children:"Pending"}),e.jsx("div",{className:"ia-stat-value",style:{color:"var(--yellow)"},children:d.pending}),e.jsx("div",{className:"ia-stat-bar",style:{background:"linear-gradient(90deg,rgba(255,209,102,0.4),transparent)"}})]}),e.jsxs("div",{className:"ia-stat",children:[e.jsx("div",{className:"ia-stat-label",children:"In Progress"}),e.jsx("div",{className:"ia-stat-value",style:{color:"var(--blue)"},children:d.active}),e.jsx("div",{className:"ia-stat-bar",style:{background:"linear-gradient(90deg,rgba(123,158,255,0.4),transparent)"}})]}),e.jsxs("div",{className:"ia-stat",children:[e.jsx("div",{className:"ia-stat-label",children:"Resolved"}),e.jsx("div",{className:"ia-stat-value",style:{color:"var(--green)"},children:d.resolved}),e.jsx("div",{className:"ia-stat-bar",style:{background:"linear-gradient(90deg,rgba(46,204,143,0.4),transparent)"}})]})]}),e.jsxs("div",{className:"ia-toolbar",children:[e.jsxs("div",{className:"ia-toolbar-left",children:[e.jsxs("button",{className:`ia-filter-btn${k?" open":""}`,onClick:()=>U(a=>!a),children:[e.jsx(O,{size:10}),"Filters",u>0&&e.jsx("span",{className:"ia-badge",children:u})]}),u>0&&e.jsxs("button",{className:"ia-filter-clear",onClick:()=>{y("all"),j("all")},children:[e.jsx(q,{size:9})," Clear filters"]})]}),e.jsxs("span",{className:"ia-result-count",children:["Showing ",h.length," of ",i.length]})]}),k&&e.jsx("div",{className:"ia-filter-drawer",children:e.jsxs("div",{className:"ia-filter-row",children:[e.jsxs("div",{className:"ia-filter-group",children:[e.jsx("div",{className:"ia-filter-group-label",children:"Incident Type"}),e.jsx("div",{className:"ia-filter-chips",children:te.map(a=>{const t=a!=="all"?f[a]??f.default:null,r=g===a;return e.jsx("button",{className:`ia-chip${r?" active":""}`,style:r&&t?{background:t.color,borderColor:t.color}:r?{background:"var(--border-2)",borderColor:"var(--border-2)",color:"var(--text)"}:{},onClick:()=>y(a),children:a==="all"?"All Types":t?.label??a},a)})})]}),e.jsxs("div",{className:"ia-filter-group",children:[e.jsx("div",{className:"ia-filter-group-label",children:"Status"}),e.jsx("div",{className:"ia-filter-chips",children:ie.map(a=>{const t=a!=="all"?T[a]:null,r=b===a;return e.jsx("button",{className:`ia-chip${r?" active":""}`,style:r&&t?{background:t.color,borderColor:t.color}:r?{background:"var(--border-2)",borderColor:"var(--border-2)",color:"var(--text)"}:{},onClick:()=>j(a),children:a==="all"?"All Statuses":t?.label??a},a)})})]})]})}),e.jsxs("div",{className:"ia-section-head",children:[e.jsx("span",{className:"ia-section-label",children:"Live Feed"}),e.jsx("span",{className:"ia-section-line"})]}),h.length===0?e.jsxs("div",{className:"ia-empty",children:[e.jsx("div",{className:"ia-empty-icon",children:e.jsx(z,{})}),e.jsx("div",{className:"ia-empty-title",children:"No incidents found"}),e.jsx("p",{className:"ia-empty-sub",children:i.length===0?"No incidents have been reported yet. The feed will update in real-time.":"No incidents match your current filters. Try adjusting or clearing them."})]}):e.jsx("div",{className:"ia-feed",children:h.map((a,t)=>{const r=se(a),s=oe(a),l=I.has(a.id);return e.jsxs("div",{className:`ia-card${l?" is-new":""}`,style:{animationDelay:`${Math.min(t*.04,.4)}s`},children:[e.jsx("div",{className:"ia-card-accent",style:{background:r.color}}),e.jsxs("div",{className:"ia-card-body",children:[e.jsxs("div",{className:"ia-card-top",children:[e.jsx("div",{className:"ia-card-icon",style:{background:r.bg,color:r.color,border:`1px solid ${r.color}25`},children:r.icon}),e.jsxs("div",{className:"ia-card-info",children:[e.jsx("div",{className:"ia-card-desc",children:a.description||"No description provided"}),e.jsxs("div",{className:"ia-card-id",children:["ID: ",a.id]})]})]}),e.jsxs("div",{className:"ia-card-meta",children:[a.location&&e.jsxs("span",{className:"ia-card-meta-item",children:[e.jsx(H,{size:10}),a.location]}),e.jsxs("span",{className:"ia-card-meta-item",children:[e.jsx(S,{size:10}),C(a.created_at)]}),a.category&&a.category!=="General"&&e.jsx("span",{className:"ia-card-meta-item",children:a.category})]})]}),e.jsxs("div",{className:"ia-card-right",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6},children:[e.jsxs("span",{className:"ia-status-pill",style:{color:s.color,background:s.bg},children:[e.jsx("span",{style:{width:5,height:5,borderRadius:"50%",background:"currentColor",display:"inline-block",flexShrink:0}}),s.label]}),e.jsx("span",{className:"ia-type-pill",style:{color:r.color,background:r.bg,border:`1px solid ${r.color}22`},children:r.label})]}),l&&e.jsx("span",{className:"ia-new-badge",children:"NEW"})]})]},a.id)})})]})]})]})}export{ce as default};
