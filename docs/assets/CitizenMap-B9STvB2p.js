import{ao as F,am as n,ak as e}from"./index-CvhaT9ii.js";import{m as B,M as O,T as A,a as L,P as M,L as u,u as E}from"./mapbg-D_jxMMl9.js";delete u.Icon.Default.prototype._getIconUrl;u.Icon.Default.mergeOptions({iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"});const f=[{id:1,category:"emergency",label:"PNP Dumaguete",address:"Camp Leon Kilat, Dumaguete City",phone:"(035) 225-1766",lat:9.31,lng:123.3075},{id:2,category:"emergency",label:"BFP Fire Station",address:"Real St, Dumaguete City",phone:"160",lat:9.3083,lng:123.3061},{id:3,category:"emergency",label:"CDRRMO",address:"City Hall Compound, Dumaguete City",phone:"0936 795 4163",lat:9.3077,lng:123.3054},{id:4,category:"emergency",label:"ONE Rescue (EMS)",address:"Oriental Negros Emergency Rescue Foundation",phone:"(035) 225-9110",lat:9.3068,lng:123.3042},{id:5,category:"emergency",label:"Philippine Coast Guard",address:"Dumaguete Boulevard, Dumaguete City",phone:"(035) 422-6541",lat:9.3095,lng:123.3088},{id:6,category:"emergency",label:"LDRRMO (Provincial)",address:"Dumaguete City (Provincial)",phone:"(035) 422-3636",lat:9.306,lng:123.307},{id:7,category:"hospital",label:"Silliman Univ. Medical Center",address:"V. Aldecoa Sr. Road, Daro, Dumaguete City",phone:"(035) 420-2000",lat:9.3055,lng:123.3028},{id:8,category:"hospital",label:"ACE Dumaguete Doctors Hospital",address:"Claytown Road (North Road), Dumaguete City",phone:"(035) 523-5957",lat:9.314,lng:123.309},{id:9,category:"hospital",label:"Holy Child Hospital",address:"Bp. Epifanio Surban St., Dumaguete City",phone:"(035) 422-9063",lat:9.299,lng:123.304},{id:10,category:"hospital",label:"Negros Oriental Provincial Hosp.",address:"North National Highway, Brgy. Piapi, Dumaguete",phone:"(035) 225-4921",lat:9.318,lng:123.311},{id:11,category:"evacuation",label:"Bagacay Gymnasium",address:"Barangay Bagacay, Dumaguete City",phone:"09652045077",lat:9.302,lng:123.303},{id:12,category:"evacuation",label:"NORSU Main Campus II",address:"Barangay Bajumpandan, Dumaguete City",phone:"09551850601",lat:9.3155,lng:123.304},{id:13,category:"evacuation",label:"Dumaguete City National High",address:"Barangay Calindagan, Dumaguete City",phone:"09457419261",lat:9.301,lng:123.3055},{id:14,category:"evacuation",label:"Taclobo National High School",address:"Barangay Taclobo, Dumaguete City",phone:"(035) 226-3953",lat:9.313,lng:123.3025},{id:15,category:"evacuation",label:"Talay Multi-purpose Center",address:"Barangay Talay, Dumaguete City",phone:"09190834553",lat:9.297,lng:123.301},{id:16,category:"evacuation",label:"City Central Elementary School",address:"Poblacion 1, Dumaguete City",phone:"09264603953",lat:9.3072,lng:123.3058}],b=["emergency","hospital","evacuation"];function z(s,g){window.open(`https://www.google.com/maps/dir/?api=1&destination=${s},${g}`,"_blank")}function H({target:s}){const g=E();return n.useEffect(()=>{s&&g.flyTo(s,17,{duration:1.4,easeLinearity:.25})},[s,g]),null}function G({onBack:s}={}){const{language:g,t:r,tList:Y}=F(),p={emergency:{color:"#e8372a",bg:"rgba(232,55,42,0.12)",border:"rgba(232,55,42,0.35)",icon:"🚨",label:r("map.categories.emergency"),glow:"rgba(232,55,42,0.20)"},hospital:{color:"#4A90D9",bg:"rgba(74,144,217,0.12)",border:"rgba(74,144,217,0.35)",icon:"🏥",label:r("map.categories.hospital"),glow:"rgba(74,144,217,0.20)"},evacuation:{color:"#00c8e0",bg:"rgba(0,200,224,0.12)",border:"rgba(0,200,224,0.35)",icon:"🏫",label:r("map.categories.evacuation"),glow:"rgba(0,200,224,0.20)"}};function C(a,t=!1){const i=p[a],o=t?44:38;return u.divIcon({className:"",html:`<div style="
          width:${o}px;height:${o}px;border-radius:9999px;
          background:${i.color};
          display:flex;align-items:center;justify-content:center;
          font-size:${t?18:15}px;
          border:${t?"3px":"2px"} solid #0d1b2e;
          box-shadow:0 2px 16px rgba(0,0,0,0.50),0 0 0 ${t?"5px":"3px"} ${i.color}55;
          ${t?"transform:scale(1.1)":""}
        ">${i.icon}</div>`,iconSize:[o,o],iconAnchor:[o/2,o/2]})}const[I,D]=n.useState(null),[y,P]=n.useState(""),[d,v]=n.useState(null),[w,S]=n.useState(null),[h,m]=n.useState(!1),k=n.useRef({}),j=n.useRef({});function N(a){S(a.id),D([a.lat,a.lng]),setTimeout(()=>{k.current[a.id]?.openPopup(),j.current[a.id]?.scrollIntoView({behavior:"smooth",block:"center"})},1400)}const x=f.filter(a=>{const t=y.toLowerCase();return(a.label.toLowerCase().includes(t)||a.address.toLowerCase().includes(t))&&(!d||a.category===d)}),R=a=>x.filter(t=>t.category===a),T=a=>f.filter(t=>t.category===a).length;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --page-px: clamp(24px, 6vw, 148px);
        }

        .fl-root {
          height: 100vh;
          font-family: 'Inter', sans-serif;
          color: #ddeef8;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          background: #060f1c;
        }

        .fl-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .fl-bg-img {
          width: 100%; height: 100%; object-fit: cover; object-position: center;
          animation: bgDrift 40s ease-in-out infinite; will-change: transform;
        }
        .fl-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(6,15,28,0.92) 0%, rgba(6,15,28,0.82) 100%);
        }
        @keyframes bgDrift {
          0%,100% { transform: scale(1.06) translate(0,0); }
          33%      { transform: scale(1.09) translate(-12px,-8px); }
          66%      { transform: scale(1.07) translate(10px,-14px); }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .fl-header {
          position: relative; z-index: 10; flex-shrink: 0;
          padding: 20px var(--page-px) 18px;
          background: rgba(6,15,28,0.85);
          border-bottom: 1px solid rgba(0,200,224,0.10);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          display: flex; align-items: center; gap: 20px;
          animation: slideDown 0.5s ease both;
        }

        .fl-header-left { flex: 1; min-width: 0; }
        .fl-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase;
          color: #e8372a; margin-bottom: 6px;
          display: flex; align-items: center; gap: 8px;
        }
        .fl-eyebrow-line { width: 28px; height: 1px; background: #e8372a; opacity: 0.6; }
        .fl-header h1 {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(22px, 3.2vw, 36px);
          font-weight: 700; letter-spacing: -0.025em; line-height: 1;
          color: #F8FAFC;
        }
        .fl-header h1 .accent { color: #A8D8FF; }
        .fl-header-sub {
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 300;
          color: rgba(168,216,255,0.50); margin-top: 6px; line-height: 1.5;
        }
        .fl-header-stats { display: flex; gap: 8px; flex-shrink: 0; }
        .fl-hstat {
          display: flex; flex-direction: column; align-items: center;
          padding: 9px 16px;
          background: rgba(0,200,224,0.05);
          border: 1px solid rgba(0,200,224,0.12);
          border-radius: 10px; min-width: 64px;
        }
        .fl-hstat-val {
          font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700;
          color: #F8FAFC; line-height: 1;
        }
        .fl-hstat-label {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(168,216,255,0.38); margin-top: 4px; text-align: center;
        }

        .fl-filterbar {
          position: relative; z-index: 10; flex-shrink: 0;
          padding: 10px var(--page-px);
          background: rgba(6,15,28,0.78);
          border-bottom: 1px solid rgba(0,200,224,0.07);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          display: flex; align-items: center; gap: 7px;
          overflow-x: auto;
          animation: slideDown 0.5s 0.05s ease both;
        }
        .fl-filterbar::-webkit-scrollbar { display: none; }
        .fl-filter-label {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(168,216,255,0.25); flex-shrink: 0; margin-right: 4px;
        }
        .fl-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.04em;
          border-radius: 20px; padding: 6px 14px;
          cursor: pointer; border: none; flex-shrink: 0;
          transition: all 0.18s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .fl-pill:active { transform: scale(0.95); }
        .fl-pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .fl-stage {
          position: relative; z-index: 1;
          flex: 1;
          display: flex;
          overflow: hidden;
          padding-left: var(--page-px);
          padding-right: var(--page-px);
          animation: fadeIn 0.6s 0.1s ease both;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .fl-sidebar {
          width: 300px;
          flex-shrink: 0;
          display: flex; flex-direction: column;
          background: rgba(8,18,32,0.94);
          border-right: 2px solid rgba(0,200,224,0.18);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          overflow: hidden;
          z-index: 5;
          transition: transform 0.32s cubic-bezier(0.32,0,0.15,1);
          position: relative;
        }

        .fl-search-wrap {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(0,200,224,0.07);
          flex-shrink: 0; position: relative;
        }
        .fl-search-icon {
          position: absolute; left: 26px; top: 50%; transform: translateY(-50%);
          font-size: 13px; opacity: 0.22; pointer-events: none;
        }
        .fl-search-input {
          width: 100%; background: rgba(6,15,28,0.90);
          border: 1px solid rgba(0,200,224,0.10);
          border-radius: 9px; padding: 9px 12px 9px 32px;
          font-family: 'Inter', sans-serif; font-size: 12px; color: #c8e4f4;
          outline: none; caret-color: #00c8e0;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .fl-search-input::placeholder { color: rgba(160,200,224,0.16); }
        .fl-search-input:focus {
          border-color: rgba(0,200,224,0.38);
          box-shadow: 0 0 0 3px rgba(0,200,224,0.07);
          background: rgba(0,200,224,0.02);
        }

        .fl-sidebar-meta {
          padding: 7px 14px 6px;
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(168,216,255,0.22); flex-shrink: 0;
          border-bottom: 1px solid rgba(0,200,224,0.05);
        }
        .fl-sidebar-meta span { color: rgba(168,216,255,0.52); }

        .fl-list {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px 10px 32px;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .fl-list::-webkit-scrollbar { width: 5px; }
        .fl-list::-webkit-scrollbar-track { background: rgba(0,200,224,0.04); border-radius: 4px; }
        .fl-list::-webkit-scrollbar-thumb { background: rgba(0,200,224,0.45); border-radius: 4px; box-shadow: 0 0 6px rgba(0,200,224,0.55); }
        .fl-list::-webkit-scrollbar-thumb:hover { background: rgba(0,200,224,0.72); }

        .fl-sidebar::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 48px;
          background: linear-gradient(to top, rgba(8,18,32,0.92) 0%, transparent 100%);
          pointer-events: none; z-index: 6;
        }

        .fl-scroll-hint {
          position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
          z-index: 7;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(0,200,224,0.70);
          animation: bounceDown 2s ease-in-out infinite;
          pointer-events: none;
        }
        .fl-scroll-hint svg {
          width: 16px; height: 16px; fill: none;
          stroke: rgba(0,200,224,0.80); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
          filter: drop-shadow(0 0 4px rgba(0,200,224,0.60));
        }
        @keyframes bounceDown {
          0%,100% { transform: translateX(-50%) translateY(0); opacity: 0.70; }
          50%      { transform: translateX(-50%) translateY(4px); opacity: 1; }
        }

        .fl-divider {
          width: 3px; flex-shrink: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0,200,224,0.55) 15%, rgba(0,200,224,0.80) 50%, rgba(0,200,224,0.55) 85%, transparent 100%);
          box-shadow: 0 0 10px rgba(0,200,224,0.35), 0 0 20px rgba(0,200,224,0.15);
          position: relative; z-index: 4;
        }

        .fl-cat-section { margin-bottom: 2px; }
        .fl-cat-header {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 8px 7px;
          position: sticky; top: 0; z-index: 10;
          background: rgba(8,18,32,0.97); backdrop-filter: blur(10px);
          border-radius: 8px; margin-bottom: 4px;
        }
        .fl-cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .fl-cat-title {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; flex: 1;
        }
        .fl-cat-badge {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 600; color: rgba(160,200,224,0.32);
          background: rgba(0,200,224,0.04); border: 1px solid rgba(0,200,224,0.09);
          border-radius: 4px; padding: 1px 6px;
        }
        .fl-cat-divider { height: 1px; background: rgba(0,200,224,0.05); margin: 8px 2px; }

        .fl-card {
          background: rgba(13,27,46,0.70);
          border: 1px solid rgba(0,200,224,0.06);
          border-left: 3px solid var(--cat-color);
          border-radius: 10px; padding: 11px 13px;
          margin-bottom: 6px; cursor: pointer;
          transition: transform 0.20s ease, box-shadow 0.20s ease, background 0.20s ease, border-color 0.20s ease;
          position: relative; overflow: hidden;
        }
        .fl-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 5% 0%, var(--cat-glow), transparent 70%);
          opacity: 0; transition: opacity 0.25s ease;
        }
        .fl-card:hover::before, .fl-card.is-selected::before { opacity: 1; }
        .fl-card:hover, .fl-card.is-selected {
          transform: translateX(3px);
          border-color: var(--cat-color);
          background: rgba(13,27,46,0.95);
          box-shadow: 0 3px 14px rgba(0,0,0,0.30), 0 0 10px var(--cat-glow);
        }
        .fl-card.is-selected { border-left-width: 4px; }
        .fl-card-name {
          font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
          color: #e8f4ff; margin-bottom: 3px; line-height: 1.3; position: relative; z-index: 1;
        }
        .fl-card-addr {
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 300; color: rgba(160,200,224,0.32);
          margin-bottom: 7px; line-height: 1.4; position: relative; z-index: 1;
        }
        .fl-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          position: relative; z-index: 1;
        }
        .fl-card-phone {
          font-family: 'Inter', sans-serif;
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 500; text-decoration: none;
          transition: opacity 0.15s;
        }
        .fl-card-phone:hover { opacity: 0.72; }
        .fl-card-nav-btn {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 4px 9px; border-radius: 5px; cursor: pointer;
          background: var(--cat-bg); color: var(--cat-color);
          border: 1px solid var(--cat-border);
          transition: all 0.15s ease; -webkit-tap-highlight-color: transparent;
        }
        .fl-card-nav-btn:hover { background: var(--cat-color); color: #fff; }

        .fl-empty {
          text-align: center; padding: 48px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 300; color: rgba(160,200,224,0.20);
        }
        .fl-empty-icon { font-size: 32px; margin-bottom: 10px; }

        .fl-map-panel {
          flex: 1; position: relative; overflow: hidden;
        }
        .fl-map-panel .leaflet-container {
          width: 100%; height: 100%; background: #0d1b2e;
        }

        .leaflet-popup-content-wrapper {
          background: #ffffff !important; border: none !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10) !important;
          padding: 0 !important; overflow: hidden; color: #1a1a2e !important;
        }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .leaflet-popup-tip { background: #ffffff !important; box-shadow: none !important; }
        .leaflet-popup-close-button {
          color: #9ca3af !important; font-size: 18px !important;
          top: 10px !important; right: 12px !important; z-index: 10;
          width: 24px !important; height: 24px !important;
          line-height: 24px !important; text-align: center !important;
        }
        .leaflet-popup-close-button:hover { color: #374151 !important; }
        .fl-popup-head { padding: 14px 16px 10px; border-bottom: 1px solid #f3f4f6; }
        .fl-popup-cat {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 4px; display: flex; align-items: center; gap: 5px;
        }
        .fl-popup-name {
          font-family: 'Poppins', sans-serif;
          font-size: 14px; font-weight: 700; color: #111827; line-height: 1.3;
        }
        .fl-popup-body { padding: 10px 16px 14px; }
        .fl-popup-row {
          display: flex; align-items: flex-start; gap: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 12px; color: #6b7280; margin-bottom: 5px; line-height: 1.45;
        }
        .fl-popup-phone {
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500; text-decoration: none; transition: opacity 0.15s;
        }
        .fl-popup-phone:hover { opacity: 0.75; }
        .fl-popup-btn {
          width: 100%; margin-top: 10px;
          font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 8px; padding: 10px; cursor: pointer; border: none; color: #fff;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity 0.18s, transform 0.18s;
        }
        .fl-popup-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        .fl-map-legend {
          position: absolute; top: 14px; right: 14px; z-index: 400;
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(0,0,0,0.07); border-radius: 12px;
          padding: 12px 14px; box-shadow: 0 4px 18px rgba(0,0,0,0.13); min-width: 170px;
        }
        .fl-legend-title {
          font-family: 'Inter', sans-serif;
          font-size: 8px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
          color: #9ca3af; margin-bottom: 9px;
        }
        .fl-legend-row {
          display: flex; align-items: center; gap: 7px;
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500; color: #374151; margin-bottom: 6px;
        }
        .fl-legend-row:last-child { margin-bottom: 0; }
        .fl-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .fl-legend-n {
          margin-left: auto; font-size: 9px; color: #9ca3af;
          background: #f3f4f6; border-radius: 4px; padding: 1px 5px;
        }
        .fl-live-badge {
          position: absolute; bottom: 18px; left: 18px; z-index: 400;
          background: rgba(255,255,255,0.97); border: 1px solid rgba(0,0,0,0.07);
          border-radius: 12px; padding: 10px 14px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12); max-width: 220px;
        }
        .fl-live-row { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
        .fl-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #e8372a; flex-shrink: 0;
          animation: livePulse 2.2s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(232,55,42,0.5); }
          50%      { box-shadow: 0 0 0 4px rgba(232,55,42,0); }
        }
        .fl-live-title {
          font-family: 'Poppins', sans-serif;
          font-size: 11px; font-weight: 700; color: #111827;
        }
        .fl-live-sub {
          font-family: 'Inter', sans-serif;
          font-size: 10px; color: #6b7280; line-height: 1.4;
        }

        .fl-sidebar-toggle {
          display: none;
          position: absolute; bottom: 72px; left: 14px; z-index: 600;
          background: #0d1b2e; border: 1px solid rgba(0,200,224,0.28);
          border-radius: 50%; width: 46px; height: 46px;
          align-items: center; justify-content: center;
          cursor: pointer; font-size: 18px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.40); color: #00c8e0;
          transition: transform 0.2s, box-shadow 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .fl-sidebar-toggle:hover { transform: scale(1.08); }

        @media (max-width: 900px) {
          :root { --page-px: 24px; }
          .fl-stage { padding-left: 0; padding-right: 0; }
          .fl-sidebar {
            position: absolute; top: 0; left: 0; bottom: 0;
            width: 84%; max-width: 300px;
            transform: translateX(-105%);
            box-shadow: 4px 0 32px rgba(0,0,0,0.55); z-index: 500;
          }
          .fl-sidebar.is-open { transform: translateX(0); }
          .fl-divider { display: none; }
          .fl-sidebar-toggle { display: flex; }
          .fl-map-panel { width: 100%; }
          .fl-live-badge { max-width: 180px; bottom: 14px; left: 70px; }
          .fl-map-legend { top: 10px; right: 10px; min-width: 150px; }
        }
        @media (max-width: 480px) {
          .fl-header { padding: 12px 16px 10px; gap: 10px; }
          .fl-header h1 { font-size: 18px; }
          .fl-header-sub { display: none; }
          .fl-hstat { padding: 6px 8px; min-width: 46px; }
          .fl-hstat-val { font-size: 15px; }
          .fl-filterbar { padding: 8px 16px; gap: 5px; }
          .fl-pill { font-size: 10px; padding: 5px 9px; }
          .fl-map-legend { display: none; }
          .fl-live-badge { bottom: 10px; left: 66px; padding: 7px 11px; max-width: 160px; }
          .fl-live-title { font-size: 10px; }
          .fl-live-sub { font-size: 9px; }
          .fl-sidebar { width: 90%; }
        }
        @media (max-width: 360px) {
          .fl-header h1 { font-size: 16px; }
          .fl-hstat-val { font-size: 13px; }
          .fl-hstat { min-width: 40px; padding: 5px 6px; }
        }

        .fl-drawer-backdrop {
          display: none; position: absolute; inset: 0; z-index: 499;
          background: rgba(0,0,0,0.52); backdrop-filter: blur(2px);
          -webkit-tap-highlight-color: transparent;
        }
        .fl-drawer-backdrop.is-open { display: block; }
      `}),e.jsxs("div",{className:"fl-root",children:[e.jsxs("div",{className:"fl-bg",children:[e.jsx("img",{src:B,alt:"",className:"fl-bg-img","aria-hidden":"true"}),e.jsx("div",{className:"fl-bg-overlay"})]}),e.jsxs("header",{className:"fl-header",children:[e.jsxs("div",{className:"fl-header-left",children:[e.jsx("div",{className:"fl-eyebrow"}),e.jsxs("h1",{children:[r("map.titleStart")," ",e.jsx("span",{className:"accent",children:r("map.titleAccent")})]}),e.jsx("p",{className:"fl-header-sub",children:r("map.subtitle")})]}),e.jsxs("div",{className:"fl-header-stats",children:[b.map(a=>e.jsxs("div",{className:"fl-hstat",children:[e.jsx("div",{className:"fl-hstat-val",children:T(a)}),e.jsx("div",{className:"fl-hstat-label",children:p[a].icon})]},a)),e.jsxs("div",{className:"fl-hstat",children:[e.jsx("div",{className:"fl-hstat-val",children:f.length}),e.jsx("div",{className:"fl-hstat-label",children:r("map.statTotal")})]})]})]}),e.jsxs("div",{className:"fl-filterbar",children:[e.jsx("span",{className:"fl-filter-label",children:r("map.filterLabel")}),e.jsxs("button",{className:"fl-pill",onClick:()=>v(null),style:{background:d?"rgba(0,200,224,0.03)":"rgba(0,200,224,0.10)",border:`1px solid ${d?"rgba(0,200,224,0.09)":"rgba(0,200,224,0.38)"}`,color:d?"rgba(160,200,224,0.38)":"#00c8e0"},children:[r("map.filterAll")," (",f.length,")"]}),b.map(a=>{const t=p[a],i=d===a;return e.jsxs("button",{className:"fl-pill",onClick:()=>v(i?null:a),style:{background:i?t.bg:"rgba(0,200,224,0.03)",border:`1px solid ${i?t.border:"rgba(0,200,224,0.09)"}`,color:i?t.color:"rgba(160,200,224,0.40)",boxShadow:i?`0 0 12px ${t.glow}`:"none"},children:[e.jsx("span",{className:"fl-pill-dot",style:{background:t.color}}),t.icon," ",t.label]},a)})]}),e.jsxs("div",{className:"fl-stage",children:[e.jsx("div",{className:`fl-drawer-backdrop ${h?"is-open":""}`,onClick:()=>m(!1)}),e.jsxs("aside",{className:`fl-sidebar ${h?"is-open":""}`,children:[e.jsxs("div",{className:"fl-search-wrap",children:[e.jsx("span",{className:"fl-search-icon",children:"🔍"}),e.jsx("input",{type:"text",placeholder:r("map.searchPlaceholder"),value:y,onChange:a=>P(a.target.value),className:"fl-search-input"})]}),e.jsxs("div",{className:"fl-sidebar-meta",children:[r("map.showingPrefix")," ",e.jsx("span",{children:x.length})," ",r("map.showingOf")," ",f.length," ",r("map.showingSuffix")]}),e.jsxs("div",{className:"fl-list",children:[b.map((a,t)=>{const i=p[a],o=R(a);if(o.length===0)return null;const $=a==="emergency"?"#ff8a80":a==="hospital"?"#93c4ef":"#7ce8f5";return e.jsxs("div",{className:"fl-cat-section",children:[t>0&&e.jsx("div",{className:"fl-cat-divider"}),e.jsxs("div",{className:"fl-cat-header",children:[e.jsx("div",{className:"fl-cat-dot",style:{background:i.color}}),e.jsxs("span",{className:"fl-cat-title",style:{color:i.color},children:[i.icon," ",i.label]}),e.jsx("span",{className:"fl-cat-badge",children:o.length})]}),o.map(l=>e.jsxs("div",{ref:c=>{c&&(j.current[l.id]=c)},onClick:()=>{N(l),m(!1)},className:`fl-card ${w===l.id?"is-selected":""}`,style:{"--cat-color":i.color,"--cat-glow":i.glow,"--cat-bg":i.bg,"--cat-border":i.border},children:[e.jsx("div",{className:"fl-card-name",children:l.label}),e.jsxs("div",{className:"fl-card-addr",children:["📍 ",l.address]}),e.jsxs("div",{className:"fl-card-footer",children:[e.jsxs("a",{href:`tel:${l.phone.replace(/[^0-9+]/g,"")}`,className:"fl-card-phone",style:{color:$},onClick:c=>c.stopPropagation(),children:["📞 ",l.phone]}),e.jsxs("button",{className:"fl-card-nav-btn",onClick:c=>{c.stopPropagation(),z(l.lat,l.lng)},children:[r("map.navigateBtn")," →"]})]})]},l.id))]},a)}),x.length===0&&e.jsxs("div",{className:"fl-empty",children:[e.jsx("div",{className:"fl-empty-icon",children:"🔍"}),r("map.emptyTitle")]})]}),e.jsxs("div",{className:"fl-scroll-hint",children:[e.jsx("svg",{viewBox:"0 0 24 24",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})}),r("map.scrollHint","scroll")]})]}),e.jsx("div",{className:"fl-divider"}),e.jsxs("main",{className:"fl-map-panel",children:[e.jsxs(O,{center:[9.3077,123.3054],zoom:14,style:{width:"100%",height:"100%"},zoomControl:!0,children:[e.jsx(A,{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',url:"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}),e.jsx(H,{target:I}),x.map(a=>{const t=p[a.category];return e.jsx(L,{position:[a.lat,a.lng],icon:C(a.category,w===a.id),eventHandlers:{add:i=>{k.current[a.id]=i.target},click:()=>N(a)},children:e.jsx(M,{minWidth:230,maxWidth:280,children:e.jsxs("div",{style:{fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{className:"fl-popup-head",children:[e.jsxs("div",{className:"fl-popup-cat",style:{color:t.color},children:[t.icon," ",t.label]}),e.jsx("div",{className:"fl-popup-name",children:a.label})]}),e.jsxs("div",{className:"fl-popup-body",children:[e.jsxs("div",{className:"fl-popup-row",children:[e.jsx("span",{children:"📍"}),e.jsx("span",{children:a.address})]}),e.jsxs("div",{className:"fl-popup-row",children:[e.jsx("span",{children:"📞"}),e.jsx("a",{href:`tel:${a.phone.replace(/[^0-9+]/g,"")}`,className:"fl-popup-phone",style:{color:t.color},children:a.phone})]}),e.jsxs("button",{onClick:()=>z(a.lat,a.lng),className:"fl-popup-btn",style:{background:t.color},children:["🗺️ ",r("map.getDirections")]})]})]})})},a.id)})]}),e.jsxs("div",{className:"fl-map-legend",children:[e.jsx("div",{className:"fl-legend-title",children:r("map.legendTitle")}),b.map(a=>{const t=p[a],i=x.filter(o=>o.category===a).length;return e.jsxs("div",{className:"fl-legend-row",children:[e.jsx("div",{className:"fl-legend-dot",style:{background:t.color}}),e.jsxs("span",{children:[t.icon," ",t.label]}),e.jsx("span",{className:"fl-legend-n",children:i})]},a)})]}),e.jsxs("div",{className:"fl-live-badge",children:[e.jsxs("div",{className:"fl-live-row",children:[e.jsx("div",{className:"fl-live-dot"}),e.jsx("div",{className:"fl-live-title",children:r("map.liveTitle")})]}),e.jsxs("div",{className:"fl-live-sub",children:[r("map.liveSubPrefix")," ",f.length," ",r("map.liveSubSuffix")]})]}),e.jsx("button",{className:"fl-sidebar-toggle",onClick:()=>m(a=>!a),"aria-label":r("map.toggleList","Toggle facility list"),children:h?"✕":"☰"})]})]})]})]})}export{G as default};
