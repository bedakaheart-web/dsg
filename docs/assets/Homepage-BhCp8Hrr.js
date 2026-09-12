import{ao as L,aq as R,am as r,an as w,ak as e,ad as T,ae as z,W as I,z as Y,y as U,M as X,a9 as Z,L as q,S as W}from"./index-CvhaT9ii.js";const B=""+new URL("homepage.bg-DQ9e-AMY.jpg",import.meta.url).href,_="0x4AAAAAAEeWeQHuqgMoh8cd";function $(){const{t,tList:n}=L(),[s,h]=r.useState(!1),o=n("ticker.alerts");return s?null:e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .hp-runner {
          position: fixed; top: 58px; left: 0; right: 0;
          z-index: 99998; height: 34px;
          background: rgba(5,11,22,0.97);
          border-bottom: 1px solid rgba(232,55,42,0.28);
          border-top: 1px solid rgba(255,255,255,0.04);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex; align-items: center; overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.35);
        }
        .hp-runner::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(232,55,42,0.5), rgba(0,200,224,0.3), transparent);
          animation: runnerGlow 4s ease-in-out infinite;
        }
        @keyframes runnerGlow { 0%,100%{opacity:0.4} 50%{opacity:1} }
        .hp-runner-badge {
          flex-shrink: 0; display: flex; align-items: center; gap: 7px;
          padding: 0 14px 0 16px; height: 100%;
          background: linear-gradient(135deg,rgba(232,55,42,0.22),rgba(232,55,42,0.10));
          border-right: 1px solid rgba(232,55,42,0.30);
          position: relative; z-index: 2;
        }
        .hp-runner-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #e8372a;
          animation: runnerPulse 1.4s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(232,55,42,0.8); flex-shrink: 0;
        }
        @keyframes runnerPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(0.7)} }
        .hp-runner-badge-label {
          font-family: 'Space Mono', monospace; font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase; color: #e8372a; white-space: nowrap;
        }
        .hp-runner-track {
          flex: 1; overflow: hidden; position: relative; height: 100%;
          display: flex; align-items: center;
          mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
        }
        .hp-runner-tape {
          display: flex; align-items: center; white-space: nowrap;
          animation: runnerScroll 38s linear infinite; will-change: transform;
        }
        .hp-runner-tape:hover { animation-play-state: paused; }
        @keyframes runnerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .hp-runner-item {
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 400;
          color: rgba(168,216,255,0.80); padding: 0 40px;
          display: inline-flex; align-items: center; gap: 10px; letter-spacing: 0.01em;
        }
        .hp-runner-sep {
          display: inline-block; width: 4px; height: 4px; border-radius: 50%;
          background: rgba(0,200,224,0.35); margin: 0 8px; flex-shrink: 0;
        }
        .hp-911-badge {
          flex-shrink: 0; display: flex; align-items: center; gap: 7px;
          margin-right: 10px;
          background: rgba(10, 18, 30, 0.88);
          border: 1px solid rgba(232,55,42,0.55);
          border-radius: 20px; padding: 4px 12px 4px 7px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          text-decoration: none; cursor: pointer;
          position: relative;
          animation: ambulanceStrobe 1.8s ease-in-out infinite;
          transition: all 0.2s ease;
        }
        @keyframes ambulanceStrobe {
          0%   { box-shadow: 0 0 8px rgba(232,55,42,0.40), 0 0 20px rgba(232,55,42,0.20), 0 0 40px rgba(232,55,42,0.08); border-color: rgba(232,55,42,0.55); }
          25%  { box-shadow: 0 0 16px rgba(232,55,42,0.90), 0 0 36px rgba(232,55,42,0.55), 0 0 64px rgba(232,55,42,0.25); border-color: rgba(232,55,42,1); }
          50%  { box-shadow: 0 0 6px rgba(232,55,42,0.30), 0 0 14px rgba(232,55,42,0.15), 0 0 28px rgba(232,55,42,0.06); border-color: rgba(232,55,42,0.40); }
          75%  { box-shadow: 0 0 18px rgba(232,55,42,0.95), 0 0 40px rgba(232,55,42,0.60), 0 0 70px rgba(232,55,42,0.28); border-color: rgba(232,55,42,1); }
          100% { box-shadow: 0 0 8px rgba(232,55,42,0.40), 0 0 20px rgba(232,55,42,0.20), 0 0 40px rgba(232,55,42,0.08); border-color: rgba(232,55,42,0.55); }
        }
        .hp-911-badge:hover {
          animation-play-state: paused;
          background: rgba(232,55,42,0.15);
          border-color: rgba(232,55,42,0.90);
          box-shadow: 0 0 24px rgba(232,55,42,0.80), 0 0 48px rgba(232,55,42,0.40), 0 0 80px rgba(232,55,42,0.20);
        }
        .hp-911-icon-dot {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(232,55,42,0.20);
          border: 1px solid rgba(232,55,42,0.50);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          animation: iconPulse 1.8s ease-in-out infinite;
        }
        @keyframes iconPulse {
          0%, 100% { background: rgba(232,55,42,0.20); border-color: rgba(232,55,42,0.50); }
          25%, 75% { background: rgba(232,55,42,0.40); border-color: rgba(232,55,42,0.90); }
          50%       { background: rgba(232,55,42,0.15); border-color: rgba(232,55,42,0.35); }
        }
        .hp-911-icon { width: 11px; height: 11px; color: #ff6b5b; flex-shrink: 0; }
        .hp-911-label {
          font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700;
          color: rgba(255, 120, 100, 0.90); letter-spacing: 0.08em; white-space: nowrap; line-height: 1;
          animation: textFlicker 1.8s ease-in-out infinite;
        }
        @keyframes textFlicker {
          0%, 100% { color: rgba(255,120,100,0.90); }
          25%, 75%  { color: rgba(255,160,140,1); }
          50%       { color: rgba(255,100,80,0.75); }
        }
        .hp-911-divider { width: 1px; height: 10px; background: rgba(232,55,42,0.30); margin: 0 1px; }
        .hp-911-number {
          font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700;
          color: #fff; letter-spacing: 0.04em; white-space: nowrap; line-height: 1;
          text-shadow: 0 0 8px rgba(232,55,42,0.60);
        }
        .hp-runner-mute {
          flex-shrink: 0; padding: 0 12px; height: 100%;
          display: flex; align-items: center;
          border-left: 1px solid rgba(0,200,224,0.10);
          cursor: pointer; background: none;
          border-top: none; border-right: none; border-bottom: none;
          transition: background 0.2s;
        }
        .hp-runner-mute:hover { background: rgba(0,200,224,0.06); }
        .hp-runner-mute svg { width: 13px; height: 13px; color: rgba(168,216,255,0.30); transition: color 0.2s; }
        .hp-runner-mute:hover svg { color: rgba(168,216,255,0.70); }
      `}),e.jsxs("div",{className:"hp-runner",role:"marquee","aria-label":"Emergency alerts ticker",children:[e.jsxs("div",{className:"hp-runner-badge",children:[e.jsx("span",{className:"hp-runner-dot","aria-hidden":"true"}),e.jsx("span",{className:"hp-runner-badge-label",children:t("common.live")})]}),e.jsx("div",{className:"hp-runner-track",children:e.jsx("div",{className:"hp-runner-tape","aria-hidden":"true",children:[...o,...o].map((x,l)=>e.jsxs("span",{className:"hp-runner-item",children:[x,e.jsx("span",{className:"hp-runner-sep"})]},l))})}),e.jsxs("a",{href:"tel:911",className:"hp-911-badge","aria-label":"Call emergency 911",children:[e.jsx("div",{className:"hp-911-icon-dot",children:e.jsx("svg",{className:"hp-911-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e.jsx("path",{d:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"})})}),e.jsx("span",{className:"hp-911-label",children:t("common.emergency")}),e.jsx("span",{className:"hp-911-divider","aria-hidden":"true"}),e.jsx("span",{className:"hp-911-number",children:"911"})]}),e.jsx("button",{className:"hp-runner-mute",onClick:()=>h(!0),type:"button","aria-label":"Dismiss ticker",children:e.jsxs("svg",{viewBox:"0 0 14 14",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round","aria-hidden":"true",children:[e.jsx("line",{x1:"2",y1:"2",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"2",x2:"2",y2:"12"})]})})]})]})}const H=[{icon:e.jsx(X,{size:28}),to:"/map",accent:"#00c8e0",key:"map"},{icon:e.jsx(Z,{size:28}),to:"/directory",accent:"#4A90D9",key:"directory"},{icon:e.jsx(q,{size:28}),to:"/safetytips",accent:"#e8b830",key:"tips"},{icon:e.jsx(W,{size:28}),to:"/resources",accent:"#e8372a",key:"contacts"}],O=[{key:"barangays",value:30,suffix:""},{key:"hourResponse",value:24,suffix:"/7"},{key:"avgResponse",value:5,suffix:"m"}],N={admin:"/admin/dashboard",responder:"/responder/dashboard",citizen:"/citizen/dashboard"};function G(t,n=1800,s=!1){const[h,o]=r.useState(0);return r.useEffect(()=>{if(!s)return;let x=null;const l={id:0},v=g=>{x||(x=g);const c=Math.min((g-x)/n,1),y=1-Math.pow(1-c,3);o(Math.floor(y*t)),c<1?l.id=requestAnimationFrame(v):o(t)};return l.id=requestAnimationFrame(v),()=>cancelAnimationFrame(l.id)},[s,t,n]),h}function K({value:t,label:n,suffix:s,start:h}){const o=G(t,1800,h);return e.jsxs("div",{className:"hp-stat",children:[e.jsxs("div",{className:"hp-stat-value",children:[o,e.jsx("span",{className:"hp-stat-suffix",children:s})]}),e.jsx("div",{className:"hp-stat-label",children:n})]})}function J(){const{t}=L(),n=R(),[s,h]=r.useState(""),[o,x]=r.useState(""),[l,v]=r.useState(!1),[g,c]=r.useState(!1),[y,b]=r.useState(null),[M,P]=r.useState(!1),F=r.useRef(null),[Q,k]=r.useState(null),[S,u]=r.useState(""),A=r.useRef(null),d=r.useRef(null);r.useEffect(()=>{const{data:{subscription:a}}=w.auth.onAuthStateChange(async(p,i)=>{if(p==="INITIAL_SESSION"&&i?.user)try{const{data:m}=await w.from("profiles").select("role").eq("id",i.user.id).single(),f=m?.role?.trim().toLowerCase();f&&N[f]&&n(N[f],{replace:!0})}catch(m){console.error("Error fetching profile on initial session:",m)}});return()=>a.unsubscribe()},[n]),r.useEffect(()=>{const a=new IntersectionObserver(([p])=>{p.isIntersecting&&P(!0)},{threshold:.4});return F.current&&a.observe(F.current),()=>a.disconnect()},[]),r.useEffect(()=>{const a=document.querySelector("script[data-turnstile]"),p=()=>{!window.turnstile||!A.current||d.current||(d.current=window.turnstile.render(A.current,{sitekey:_,theme:"dark",callback:i=>u(i),"expired-callback":()=>u(""),"error-callback":()=>u("")}))};if(window.turnstile)p();else if(a)a.addEventListener("load",p);else{const i=document.createElement("script");i.src="https://challenges.cloudflare.com/turnstile/v0/api.js",i.async=!0,i.defer=!0,i.setAttribute("data-turnstile","true"),i.onload=p,document.body.appendChild(i)}return()=>{window.turnstile&&d.current&&(window.turnstile.remove(d.current),d.current=null)}},[]);const C=async()=>{if(!s||!o){b(t("auth.errMissingFields"));return}if(!S){b(t("auth.errNeedCaptcha"));return}c(!0),b(null);try{const{data:a,error:p}=await w.auth.signInWithPassword({email:s,password:o,options:{captchaToken:S}});if(p||!a.user){b(p?.message||t("auth.errLoginFailed")),c(!1),u(""),window.turnstile&&d.current&&window.turnstile.reset(d.current);return}const{data:i,error:m}=await w.from("profiles").select("role").eq("id",a.user.id).single();if(m||!i?.role){await new Promise(E=>setTimeout(E,1500));const{data:j}=await w.from("profiles").select("role").eq("id",a.user.id).single();if(!j?.role){b(t("auth.errProfileNotReady")),c(!1);return}const D=j.role.trim().toLowerCase();c(!1),await new Promise(E=>setTimeout(E,100)),n(N[D]??"/citizen/dashboard",{replace:!0});return}const f=i.role.trim().toLowerCase();c(!1),await new Promise(j=>setTimeout(j,100)),n(N[f]??"/citizen/dashboard",{replace:!0})}catch(a){b(a.message||t("auth.errLoginFailed")),c(!1),u(""),window.turnstile&&d.current&&window.turnstile.reset(d.current)}};return e.jsxs(e.Fragment,{children:[e.jsx(T,{}),e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        html, body, #root {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          height: auto !important;
          min-height: 100vh;
          width: 100%;
          max-width: 100vw;
        }

        .hp-root *, .hp-root *::before, .hp-root *::after {
          box-sizing: border-box;
        }

        .hp-root {
          min-height: 100vh;
          height: auto;
          font-family: 'Inter', sans-serif;
          color: #ddeef8;
          overflow-x: hidden;
          overflow-y: visible;
          position: relative;
          width: 100%;
          max-width: 100vw;
        }

        .hp-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          will-change: transform;
          transform: translateZ(0);
        }

        .hp-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
          display: block;
          transform-origin: center center;
          animation: bgDrift 30s ease-in-out infinite;
          will-change: transform;
          transform: translateZ(0) scale(1.08);
        }

        .hp-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7, 16, 29, 0.87) 0%,
            rgba(7, 16, 29, 0.72) 40%,
            rgba(7, 16, 29, 0.87) 75%,
            rgba(7, 16, 29, 0.98) 100%
          );
        }

        .hp-bg-atmosphere {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 10% 0%, rgba(232, 55, 42, 0.14) 0%, transparent 65%),
            radial-gradient(ellipse 60% 70% at 90% 100%, rgba(0, 200, 224, 0.10) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 55% 45%, rgba(13, 27, 46, 0.50) 0%, transparent 60%);
          pointer-events: none;
          animation: atmosphereDrift 20s ease-in-out infinite;
        }

        .hp-bg-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          background-size: 200px;
          opacity: 0.45;
          pointer-events: none;
        }

        @keyframes bgDrift {
          0% { transform: translateZ(0) scale(1.08) translate(0px, 0px); }
          25% { transform: translateZ(0) scale(1.11) translate(-12px, -8px); }
          50% { transform: translateZ(0) scale(1.10) translate(-6px, -14px); }
          75% { transform: translateZ(0) scale(1.11) translate(8px, -6px); }
          100% { transform: translateZ(0) scale(1.08) translate(0px, 0px); }
        }

        @keyframes atmosphereDrift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        .hp-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          animation: orbDrift linear infinite;
          will-change: transform;
          transform: translateZ(0);
          filter: blur(60px);
          max-width: 100vw;
        }

        .hp-orb-1 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(232, 55, 42, 0.09) 0%, transparent 70%);
          top: 5%; left: -8%;
          animation-duration: 22s;
        }

        .hp-orb-2 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(0, 200, 224, 0.08) 0%, transparent 70%);
          bottom: 15%; right: -6%;
          animation-duration: 28s;
          animation-delay: -10s;
        }

        .hp-orb-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(74, 144, 217, 0.07) 0%, transparent 70%);
          top: 50%; left: 35%;
          animation-duration: 18s;
          animation-delay: -5s;
        }

        @keyframes orbDrift {
          0% { transform: translateZ(0) translate(0, 0) scale(1); }
          33% { transform: translateZ(0) translate(20px, -30px) scale(1.08); }
          66% { transform: translateZ(0) translate(-16px, 20px) scale(0.95); }
          100% { transform: translateZ(0) translate(0, 0) scale(1); }
        }

        .hp-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px 60px;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .hp-hero {
          margin-top: 24px;
          margin-bottom: 80px;
          display: grid;
          grid-template-columns: 1fr minmax(0, 420px);
          gap: 56px;
          align-items: center;
          animation: fadeUp 0.8s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
          width: 100%;
          box-sizing: border-box;
        }

        .hp-hero-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #e8372a;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideRight 0.6s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hp-hero-eyebrow::after {
          content: '';
          display: block;
          width: 48px;
          height: 1.5px;
          background: linear-gradient(90deg, #e8372a, transparent);
          opacity: 0.7;
        }

        .hp-hero h1 {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(38px, 6.5vw, 84px);
          font-weight: 800;
          line-height: 0.92;
          letter-spacing: -0.03em;
          color: #F8FAFC;
          margin-bottom: 28px;
          animation: slideUp 0.8s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
          word-break: break-word;
          background: linear-gradient(135deg, #F8FAFC 0%, #A8D8FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hp-hero h1 .accent {
          color: #00c8e0;
          background: linear-gradient(135deg, #00c8e0 0%, #A8D8FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hp-hero-sub {
          font-size: 16px;
          font-weight: 400;
          color: rgba(168, 216, 255, 0.75);
          max-width: 420px;
          line-height: 1.75;
          margin-bottom: 40px;
          animation: slideUp 0.8s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hp-hero-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
          color: #fff;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 15px 32px;
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 0 32px rgba(232, 55, 42, 0.32);
          position: relative;
          overflow: hidden;
          animation: slideUp 0.8s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
          max-width: 100%;
          box-sizing: border-box;
          border: none;
          cursor: pointer;
        }

        .hp-hero-cta::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
          transform: skewX(-20deg);
          animation: ctaShimmer 3s ease-in-out infinite;
        }

        @keyframes ctaShimmer {
          0% { left: -100%; }
          40% { left: 140%; }
          100% { left: 140%; }
        }

        .hp-hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 48px rgba(232, 55, 42, 0.60), 0 8px 32px rgba(232, 55, 42, 0.40);
          background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
        }

        .hp-hero-cta:active { transform: translateY(-1px); }

        .hp-hero-cta-arrow {
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .hp-hero-cta:hover .hp-hero-cta-arrow { transform: translateX(6px); }

        .hp-stats {
          display: flex;
          align-items: stretch;
          gap: 0;
          margin-top: 56px;
          border: 1px solid rgba(0, 200, 224, 0.14);
          border-radius: 14px;
          background: rgba(7, 16, 29, 0.60);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0, 200, 224, 0.08);
          animation: slideUp 0.8s 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
          width: 100%;
          box-sizing: border-box;
        }

        .hp-stat {
          flex: 1;
          padding: 24px 18px;
          text-align: center;
          position: relative;
          min-width: 0;
          transition: all 0.3s ease;
        }

        .hp-stat:hover { background: rgba(0, 200, 224, 0.05); }

        .hp-stat + .hp-stat::before {
          content: '';
          position: absolute;
          left: 0; top: 18%; bottom: 18%;
          width: 1px;
          background: rgba(0, 200, 224, 0.12);
        }

        .hp-stat-value {
          font-family: 'Poppins', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #F8FAFC 0%, #A8D8FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hp-stat-suffix {
          font-size: 18px;
          color: #A8D8FF;
          margin-left: 3px;
          font-weight: 600;
        }

        .hp-stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(168, 216, 255, 0.50);
          line-height: 1.4;
        }

        .hp-auth-panel {
          background: rgba(13, 27, 46, 0.85);
          border: 1px solid rgba(0, 200, 224, 0.18);
          border-radius: 18px;
          padding: 36px 32px 32px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 48px rgba(7, 16, 29, 0.6), inset 0 0 48px rgba(0, 200, 224, 0.03);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          animation: slideUp 0.8s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hp-auth-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #e8372a, #00c8e0, transparent);
          border-radius: 18px 18px 0 0;
        }

        .hp-auth-panel::after {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 150px; height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 200, 224, 0.12), transparent 70%);
          pointer-events: none;
          filter: blur(40px);
        }

        .hp-auth-scan {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          border-radius: 18px;
          z-index: 0;
        }

        .hp-auth-scan::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          top: -4px; height: 3px;
          background: linear-gradient(90deg, transparent 0%, rgba(0,200,224,0.20) 40%, rgba(0,200,224,0.40) 50%, rgba(0,200,224,0.20) 60%, transparent 100%);
          animation: scanLine 5s ease-in-out infinite;
          filter: blur(1.5px);
          will-change: top;
        }

        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .hp-auth-watermark {
          position: absolute;
          bottom: -20px; right: -20px;
          font-size: 130px;
          color: rgba(0, 200, 224, 0.03);
          pointer-events: none;
          z-index: 0;
          line-height: 1;
        }

        .hp-auth-panel > *:not(.hp-auth-scan):not(.hp-auth-watermark) {
          position: relative;
          z-index: 1;
        }

        .hp-auth-title {
          font-family: 'Poppins', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #F8FAFC;
          margin-bottom: 6px;
        }

        .hp-auth-subtitle {
          font-size: 13.5px;
          font-weight: 400;
          color: rgba(168, 216, 255, 0.60);
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .hp-auth-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          width: 100%;
        }

        .hp-auth-label {
          font-family: 'Space Mono', monospace;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(168, 216, 255, 0.50);
        }

        .hp-auth-input {
          background: rgba(6, 15, 28, 0.85);
          border: 1px solid rgba(0, 200, 224, 0.14);
          border-radius: 10px;
          padding: 12px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #c8e4f4;
          outline: none;
          caret-color: #00c8e0;
          transition: all 0.25s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .hp-auth-input::placeholder { color: rgba(160, 200, 224, 0.20); }

        .hp-auth-input:focus {
          border-color: rgba(0, 200, 224, 0.45);
          box-shadow: 0 0 0 3.5px rgba(0, 200, 224, 0.08);
          background: rgba(0, 200, 224, 0.03);
        }

        .hp-auth-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
          box-sizing: border-box;
        }

        .hp-auth-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: rgba(168, 216, 255, 0.50);
          cursor: pointer;
          user-select: none;
          transition: color 0.2s;
        }

        .hp-auth-remember:hover { color: rgba(168, 216, 255, 0.70); }

        .hp-auth-remember input[type="checkbox"] {
          accent-color: #e8372a;
          width: 14px; height: 14px;
          cursor: pointer;
          border: 1.5px solid rgba(0, 200, 224, 0.25);
        }

        .hp-auth-forgot {
          font-size: 12.5px;
          font-weight: 600;
          color: #00c8e0;
          text-decoration: none;
          transition: all 0.25s;
        }

        .hp-auth-forgot:hover {
          color: #A8D8FF;
          text-shadow: 0 0 12px rgba(0, 200, 224, 0.35);
        }

        .hp-auth-error {
          font-size: 12px;
          color: #ff7f6b;
          background: rgba(232, 55, 42, 0.12);
          border: 1px solid rgba(232, 55, 42, 0.28);
          border-radius: 10px;
          padding: 11px 14px;
          margin-bottom: 16px;
          line-height: 1.5;
          animation: errShake 0.35s ease;
          width: 100%;
          box-sizing: border-box;
        }

        @keyframes errShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }

        .hp-auth-captcha {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          min-height: 65px;
          width: 100%;
          box-sizing: border-box;
        }

        .hp-auth-btn {
          width: 100%;
          padding: 14px 22px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 0 32px rgba(232, 55, 42, 0.28);
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .hp-auth-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: skewX(-20deg);
          transition: left 0.45s ease;
        }

        .hp-auth-btn:hover:not(:disabled)::after { left: 140%; }

        .hp-auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(232, 55, 42, 0.50);
          background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
        }

        .hp-auth-btn:active:not(:disabled) { transform: translateY(0); }
        .hp-auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .hp-auth-or {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 20px 0;
          width: 100%;
          box-sizing: border-box;
        }

        .hp-auth-or-line {
          flex: 1; height: 1px;
          background: rgba(0, 200, 224, 0.12);
        }

        .hp-auth-or-text {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(168, 216, 255, 0.35);
          white-space: nowrap;
        }

        .hp-auth-create {
          display: block;
          width: 100%;
          padding: 14px;
          border: 1.5px solid rgba(168, 216, 255, 0.30);
          border-radius: 10px;
          background: rgba(168, 216, 255, 0.06);
          color: #A8D8FF;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          box-sizing: border-box;
          cursor: pointer;
        }

        .hp-auth-create:hover {
          background: rgba(168, 216, 255, 0.12);
          border-color: rgba(168, 216, 255, 0.55);
          transform: translateY(-2px);
          box-shadow: 0 0 28px rgba(168, 216, 255, 0.15);
        }

        .hp-auth-create:active { transform: translateY(0); }

        .hp-divider {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 48px;
          animation: fadeUp 0.8s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        .hp-divider-label {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.20em;
          text-transform: uppercase;
          color: rgba(168, 216, 255, 0.40);
          white-space: nowrap;
        }

        .hp-divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(168, 216, 255, 0.20), transparent);
          min-width: 0;
        }

        .hp-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          width: 100%;
          box-sizing: border-box;
        }

        .hp-card {
          position: relative;
          background: rgba(13, 27, 46, 0.70);
          border: 1.5px solid rgba(0, 200, 224, 0.11);
          border-radius: 14px;
          padding: 28px 24px;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          animation: fadeUp 0.7s ease both;
          cursor: pointer;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          min-width: 0;
        }

        .hp-card:nth-child(1) { animation-delay: 0.3s; }
        .hp-card:nth-child(2) { animation-delay: 0.38s; }
        .hp-card:nth-child(3) { animation-delay: 0.46s; }
        .hp-card:nth-child(4) { animation-delay: 0.54s; }

        .hp-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 100% 70% at 10% 0%, var(--accent-alpha), transparent 75%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }

        .hp-card::after {
          content: '';
          position: absolute;
          top: 0; left: 15%; right: 15%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 1px;
          pointer-events: none;
        }

        .hp-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--accent-color);
          background: rgba(13, 27, 46, 0.92);
          box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 40px var(--accent-alpha);
        }

        .hp-card:hover::before { opacity: 1; }
        .hp-card:hover::after { opacity: 1; }
        .hp-card:focus-within { outline: 2px solid var(--accent-color); outline-offset: 2px; }

        .hp-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hp-card-icon {
          width: 52px; height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-color);
          background: var(--accent-alpha);
          border: 1.5px solid var(--accent-color);
          flex-shrink: 0;
          position: relative; z-index: 1;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px var(--accent-alpha);
        }

        .hp-card:hover .hp-card-icon {
          transform: scale(1.12) rotate(3deg);
          box-shadow: 0 0 28px var(--accent-alpha);
        }

        .hp-card-tag {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--accent-color);
          border: 1px solid var(--accent-color);
          border-radius: 4px;
          padding: 3px 8px;
          opacity: 0.75;
          position: relative; z-index: 1;
          transition: all 0.2s ease;
        }

        .hp-card:hover .hp-card-tag { opacity: 1; transform: scale(1.05); }

        .hp-card-title {
          font-family: 'Poppins', sans-serif;
          font-size: 19px;
          font-weight: 700;
          color: #F8FAFC;
          position: relative; z-index: 1;
        }

        .hp-card-desc {
          font-size: 13px;
          font-weight: 400;
          color: rgba(168, 216, 255, 0.62);
          line-height: 1.6;
          position: relative; z-index: 1;
          flex: 1;
        }

        .hp-card-action {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--accent-color);
          position: relative; z-index: 1;
          margin-top: 6px;
          transition: gap 0.25s ease;
        }

        .hp-card:hover .hp-card-action { gap: 12px; }

        .hp-footer-bridge {
          height: 56px;
          background: linear-gradient(to bottom, rgba(4,16,28,0) 0%, rgba(4,16,28,1) 100%);
          pointer-events: none;
          position: relative; z-index: 1;
        }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 860px) {
          .hp-hero { grid-template-columns: 1fr; margin-top: 32px; margin-bottom: 56px; gap: 40px; }
          .hp-auth-panel { order: -1; }
        }

        @media (max-width: 600px) {
          .hp-inner { padding: 0 14px 48px; }
          .hp-hero { margin-top: 16px; margin-bottom: 36px; gap: 24px; }
          .hp-hero h1 { font-size: clamp(34px, 9vw, 52px); margin-bottom: 14px; line-height: 0.95; }
          .hp-hero-sub { font-size: 14px; margin-bottom: 22px; line-height: 1.65; }
          .hp-hero-eyebrow { font-size: 10px; margin-bottom: 14px; }
          .hp-hero-cta { padding: 13px 22px; font-size: 12px; width: 100%; justify-content: center; }
          .hp-auth-panel { padding: 22px 16px 20px; border-radius: 14px; }
          .hp-auth-title { font-size: 20px; }
          .hp-auth-subtitle { font-size: 12.5px; margin-bottom: 20px; }
          .hp-auth-input { padding: 11px 13px; font-size: 13px; }
          .hp-auth-btn { padding: 13px; font-size: 12px; }
          .hp-auth-create { padding: 13px; font-size: 12px; }
          .hp-auth-row { margin-bottom: 18px; }
          .hp-stats { margin-top: 28px; }
          .hp-stat { padding: 14px 8px; }
          .hp-stat-value { font-size: 24px; }
          .hp-stat-suffix { font-size: 14px; }
          .hp-stat-label { font-size: 9px; letter-spacing: 0.04em; }
          .hp-divider { margin-bottom: 24px; }
          .hp-grid { gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hp-card { padding: 18px 14px; gap: 10px; border-radius: 12px; }
          .hp-card-icon { width: 42px; height: 42px; border-radius: 10px; }
          .hp-card-icon svg { width: 20px !important; height: 20px !important; }
          .hp-card-title { font-size: 15px; }
          .hp-card-desc { font-size: 11.5px; }
          .hp-card-tag { font-size: 8px; padding: 2px 6px; }
          .hp-card-action { font-size: 11px; margin-top: 2px; }
        }

        @media (max-width: 400px) {
          .hp-inner { padding: 0 12px 40px; }
          .hp-grid { grid-template-columns: 1fr; }
          .hp-card { padding: 16px 14px; }
          .hp-card-title { font-size: 15px; }
          .hp-card-desc { font-size: 11px; }
          .hp-stat-value { font-size: 20px; }
          .hp-hero h1 { font-size: clamp(30px, 9vw, 46px); }
          .hp-auth-panel { padding: 20px 14px 18px; }
        }
      `}),e.jsx("div",{style:{overflowX:"hidden",overflowY:"visible",width:"100%",maxWidth:"100vw",minHeight:"100vh",height:"auto"},children:e.jsxs("div",{className:"hp-root",children:[e.jsx($,{}),e.jsx("div",{style:{height:"92px",width:"100%",flexShrink:0}}),e.jsxs("div",{className:"hp-bg",children:[e.jsx("img",{src:B,alt:"",className:"hp-bg-img","aria-hidden":"true"}),e.jsx("div",{className:"hp-bg-overlay"}),e.jsx("div",{className:"hp-bg-atmosphere"}),e.jsx("div",{className:"hp-bg-grain"})]}),e.jsx("div",{className:"hp-orb hp-orb-1"}),e.jsx("div",{className:"hp-orb hp-orb-2"}),e.jsx("div",{className:"hp-orb hp-orb-3"}),e.jsxs("div",{className:"hp-inner",children:[e.jsxs("section",{className:"hp-hero",children:[e.jsxs("div",{className:"hp-hero-copy",children:[e.jsxs("h1",{children:[t("hero.titleLine1"),e.jsx("br",{}),e.jsx("span",{className:"accent",children:t("hero.titleAccent")})," ",t("hero.titleRest")]}),e.jsx("p",{className:"hp-hero-sub",children:t("hero.subtitle")}),e.jsxs(z,{to:"/report",className:"hp-hero-cta",children:[t("hero.cta"),e.jsx("span",{className:"hp-hero-cta-arrow",children:"→"})]}),e.jsx("div",{className:"hp-stats",ref:F,children:O.map(a=>e.jsx(K,{value:a.value,label:t(`stats.${a.key}`),suffix:a.suffix,start:M},a.key))})]}),e.jsxs("div",{className:"hp-auth-panel",children:[e.jsx("div",{className:"hp-auth-scan"}),e.jsx("div",{className:"hp-auth-watermark",children:e.jsx(I,{})}),e.jsx("div",{className:"hp-auth-title",children:t("auth.welcomeTitle")}),e.jsx("div",{className:"hp-auth-subtitle",children:t("auth.welcomeSubtitle")}),e.jsxs("div",{className:"hp-auth-field",children:[e.jsx("label",{className:"hp-auth-label",children:t("auth.emailLabel")}),e.jsx("input",{className:"hp-auth-input",type:"email",placeholder:" ",value:s,onChange:a=>h(a.target.value),onFocus:()=>k("email"),onBlur:()=>k(null),autoComplete:"email","aria-label":"Email address"})]}),e.jsxs("div",{className:"hp-auth-field",children:[e.jsx("label",{className:"hp-auth-label",children:t("auth.passwordLabel")}),e.jsxs("div",{style:{position:"relative",width:"100%"},children:[e.jsx("input",{className:"hp-auth-input",type:l?"text":"password",placeholder:"••••••••",value:o,onChange:a=>x(a.target.value),onKeyDown:a=>a.key==="Enter"&&C(),onFocus:()=>k("password"),onBlur:()=>k(null),autoComplete:"current-password",style:{paddingRight:"42px"},"aria-label":"Password"}),e.jsx("button",{type:"button",onClick:()=>v(a=>!a),style:{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",color:"rgba(168,216,255,0.40)",transition:"color 0.2s"},onMouseEnter:a=>a.currentTarget.style.color="#A8D8FF",onMouseLeave:a=>a.currentTarget.style.color="rgba(168,216,255,0.40)","aria-label":l?"Hide password":"Show password",children:l?e.jsx(Y,{size:15}):e.jsx(U,{size:15})})]})]}),e.jsxs("div",{className:"hp-auth-row",children:[e.jsxs("label",{className:"hp-auth-remember",children:[e.jsx("input",{type:"checkbox","aria-label":"Remember me"})," ",t("auth.rememberMe")]}),e.jsx(z,{to:"/forgot-password",className:"hp-auth-forgot",children:t("auth.forgotPassword")})]}),y&&e.jsxs("div",{className:"hp-auth-error",role:"alert","aria-live":"polite",children:["⚠ ",y]}),e.jsx("div",{className:"hp-auth-captcha",ref:A}),e.jsx("button",{className:"hp-auth-btn",onClick:C,disabled:g||!S,"aria-busy":g,children:t(g?"auth.loggingIn":"auth.loginBtn")}),e.jsxs("div",{className:"hp-auth-or",children:[e.jsx("span",{className:"hp-auth-or-line"}),e.jsx("span",{className:"hp-auth-or-text",children:t("auth.noAccount")}),e.jsx("span",{className:"hp-auth-or-line"})]}),e.jsx(z,{to:"/signup",className:"hp-auth-create",children:t("auth.createAccount")})]})]}),e.jsxs("div",{className:"hp-divider",children:[e.jsx("span",{className:"hp-divider-label",children:t("common.quickAccess")}),e.jsx("span",{className:"hp-divider-line"})]}),e.jsx("div",{className:"hp-grid",children:H.map(a=>e.jsxs(z,{to:a.to,className:"hp-card",style:{"--accent-color":a.accent,"--accent-alpha":`${a.accent}20`},children:[e.jsxs("div",{className:"hp-card-header",children:[e.jsx("div",{className:"hp-card-icon","aria-hidden":"true",children:a.icon}),e.jsx("span",{className:"hp-card-tag",children:t(`cards.${a.key}.tag`)})]}),e.jsx("div",{className:"hp-card-title",children:t(`cards.${a.key}.label`)}),e.jsx("div",{className:"hp-card-desc",children:t(`cards.${a.key}.desc`)}),e.jsxs("div",{className:"hp-card-action",children:[t("common.explore")," ",e.jsx("span",{"aria-hidden":"true",children:"→"})]})]},a.to))})]}),e.jsx("div",{className:"hp-footer-bridge"})]})})]})}export{J as default};
