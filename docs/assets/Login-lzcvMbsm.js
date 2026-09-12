import{aq as B,ao as M,am as t,ak as e,ah as W,j as q,ae as E,z as X,y as H,b as K,an as l}from"./index-CvhaT9ii.js";import{d as P}from"./directorybg-Chf2hGEo.js";const O="0x4AAAAAAEeWeQHuqgMoh8cd",_=`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .lg-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    opacity: 0.12;
    pointer-events: none;
  }

  .lg-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(0,200,224,0.10) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(232,55,42,0.08) 0%, transparent 50%);
    animation: atmosphereDrift 25s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes atmosphereDrift {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.02); }
  }

  .lg-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 11.5px; font-weight: 600;
    color: rgba(168, 216, 255, 0.45);
    text-decoration: none;
    transition: color .2s ease;
    margin-bottom: 28px;
    position: relative; z-index: 1;
    width: fit-content;
    animation: slideUp .5s .05s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-back:hover { color: #00c8e0; }

  .lg-back-arrow {
    font-size: 13px;
    transition: transform .2s ease;
    line-height: 1;
  }

  .lg-back:hover .lg-back-arrow { transform: translateX(-3px); }

  .lg-page {
    position: relative; z-index: 1;
    width: 100%; max-width: 1080px;
    display: grid;
    grid-template-columns: 1.1fr 440px;
    gap: 0;
    background: rgba(13, 27, 46, 0.72);
    border-radius: 24px;
    border: 1px solid rgba(0, 200, 224, 0.18);
    box-shadow:
      0 0 80px rgba(0, 200, 224, 0.10),
      0 25px 80px rgba(7, 16, 29, 0.65),
      inset 0 1px 0 rgba(0, 200, 224, 0.08);
    overflow: hidden;
    min-height: 620px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    animation: pageSlideUp .7s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes pageSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .lg-brand-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px 56px;
    background: linear-gradient(135deg, rgba(10,37,64,0.88) 0%, rgba(13,27,46,0.82) 50%, rgba(5,26,36,0.88) 100%);
    overflow: hidden;
  }

  .lg-brand-panel-bg {
    position: absolute; inset: 0; z-index: 0;
    background-size: cover; background-position: center;
    opacity: 0.02;
  }

  .lg-brand-panel::after {
    content: '';
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 90% 110% at 50% -10%, rgba(0,200,224,0.10) 0%, transparent 60%);
  }

  .lg-panel-geo {
    position: absolute; z-index: 1;
    bottom: -100px; right: -100px;
    width: 360px; height: 360px;
    border-radius: 50%;
    border: 60px solid rgba(0, 200, 224, 0.06);
    box-shadow: 0 0 60px rgba(0, 200, 224, 0.08);
    animation: geoPulse 8s ease-in-out infinite;
  }

  .lg-panel-geo-2 {
    position: absolute; z-index: 1;
    top: -60px; left: -60px;
    width: 240px; height: 240px;
    border-radius: 50%;
    border: 40px solid rgba(232, 55, 42, 0.04);
    animation: geoPulse 10s 1s ease-in-out infinite reverse;
  }

  @keyframes geoPulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.15); opacity: 0.9; }
  }

  .lg-brand-top { position: relative; z-index: 2; }

  .lg-brand-logo {
    display: flex; align-items: center; gap: 14px; margin-bottom: 64px;
    animation: slideDown .6s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .lg-brand-logo-img {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, rgba(0,200,224,0.18), rgba(232,55,42,0.12));
    border: 1.5px solid rgba(0, 200, 224, 0.25);
    border-radius: 14px; padding: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 24px rgba(0, 200, 224, 0.12);
    transition: all .3s ease;
  }

  .lg-brand-logo:hover .lg-brand-logo-img {
    transform: scale(1.08) rotate(-4deg);
    box-shadow: 0 0 32px rgba(0, 200, 224, 0.18);
  }

  .lg-brand-logo-img img { width: 100%; height: 100%; object-fit: contain; }

  .lg-brand-logo-name {
    font-family: 'Poppins', sans-serif;
    font-size: 17px; font-weight: 700;
    color: #f8fafc; letter-spacing: -0.02em;
  }

  .lg-brand-logo-name span { color: #00c8e0; }

  .lg-brand-headline {
    font-family: 'Poppins', sans-serif;
    font-size: 36px; font-weight: 700;
    color: #f8fafc; line-height: 1.08;
    letter-spacing: -0.025em;
    margin-bottom: 20px;
    animation: slideUp .7s .1s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .lg-brand-headline .accent { color: #00c8e0; }

  .lg-brand-desc {
    font-family: 'Inter', sans-serif;
    font-size: 14.5px; font-weight: 400;
    color: rgba(200, 228, 244, 0.52);
    line-height: 1.8; max-width: 340px;
    animation: slideUp .7s .15s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-brand-bottom { position: relative; z-index: 2; }

  .lg-brand-stats {
    display: flex; gap: 36px; margin-bottom: 32px;
    animation: slideUp .7s .25s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-brand-stat-val {
    font-family: 'Poppins', sans-serif;
    font-size: 28px; font-weight: 700;
    color: #f8fafc; line-height: 1;
    margin-bottom: 5px;
  }

  .lg-brand-stat-val em { color: #00c8e0; font-style: normal; }

  .lg-brand-stat-label {
    font-family: 'Inter', sans-serif;
    font-size: 10.5px; font-weight: 600;
    color: rgba(168, 216, 255, 0.38);
    text-transform: uppercase; letter-spacing: .12em;
  }

  .lg-brand-divider {
    height: 1px; background: linear-gradient(90deg, rgba(0, 200, 224, 0.12), transparent);
    margin-bottom: 26px;
  }

  .lg-brand-badge {
    display: inline-flex; align-items: center; gap: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 12px; color: rgba(168, 216, 255, 0.50);
    animation: slideUp .7s .35s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-brand-badge-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #00c8e0; flex-shrink: 0;
    box-shadow: 0 0 10px rgba(0, 200, 224, 0.80);
    animation: lg-pulse 2.2s ease-in-out infinite;
  }

  @keyframes lg-pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.75)} }

  .lg-form-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 56px 48px;
    background: rgba(13, 27, 46, 0.72);
    border-left: 1px solid rgba(0, 200, 224, 0.12);
    position: relative;
  }

  .lg-form-panel::before {
    content: '';
    position: absolute; top: -150px; right: -150px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(0, 200, 224, 0.06), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    filter: blur(40px);
  }

  .lg-form-header {
    margin-bottom: 36px;
    position: relative; z-index: 1;
    animation: slideUp .6s .1s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-form-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 10px; font-weight: 800;
    letter-spacing: .18em; text-transform: uppercase;
    color: #00c8e0; margin-bottom: 14px;
    display: flex; align-items: center; gap: 9px;
  }

  .lg-form-eyebrow::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: #00c8e0; opacity: 0.7;
    animation: lg-pulse 2.2s ease-in-out infinite;
  }

  .lg-form-title {
    font-family: 'Poppins', sans-serif;
    font-size: 28px; font-weight: 700;
    color: #f8fafc; letter-spacing: -0.025em;
    margin-bottom: 7px;
  }

  .lg-form-sub {
    font-family: 'Inter', sans-serif;
    font-size: 13.5px; font-weight: 400;
    color: rgba(168, 216, 255, 0.52);
  }

  .lg-rule {
    height: 1px; background: linear-gradient(90deg, rgba(0, 200, 224, 0.10), transparent);
    margin-bottom: 32px;
    position: relative; z-index: 1;
  }

  .lg-error {
    display: flex; align-items: flex-start; gap: 11px;
    background: rgba(232, 55, 42, 0.12);
    border: 1px solid rgba(232, 55, 42, 0.28);
    border-radius: 12px;
    padding: 13px 15px;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: #ff7f6b;
    margin-bottom: 20px;
    animation: errorShake .35s ease;
    position: relative; z-index: 1;
  }

  @keyframes errorShake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-6px)}
    40%{transform:translateX(6px)}
    60%{transform:translateX(-4px)}
    80%{transform:translateX(4px)}
  }

  .lg-field {
    margin-bottom: 20px;
    position: relative; z-index: 1;
    animation: slideUp .5s ease both;
  }

  .lg-field:nth-child(3) { animation-delay: .2s; }
  .lg-field:nth-child(4) { animation-delay: .25s; }

  .lg-label {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 700;
    color: rgba(168, 216, 255, 0.64);
    margin-bottom: 9px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .lg-field-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(0, 200, 224, 0.35);
    pointer-events: none;
    display: flex; align-items: center;
    transition: color .25s ease;
  }

  .lg-input-wrap:focus-within .lg-field-icon { color: rgba(0, 200, 224, 0.65); }

  .lg-input {
    width: 100%;
    background: rgba(13, 27, 46, 0.88);
    border: 1.5px solid rgba(0, 200, 224, 0.16);
    border-radius: 11px;
    padding: 13px 16px 13px 42px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #f8fafc;
    outline: none;
    transition: all .25s ease;
  }

  .lg-input::placeholder { color: rgba(168, 216, 255, 0.22); }

  .lg-input:focus {
    border-color: rgba(0, 200, 224, 0.42);
    background: rgba(0, 200, 224, 0.04);
    box-shadow: 0 0 0 4px rgba(0, 200, 224, 0.08), inset 0 0 0 1px rgba(0, 200, 224, 0.06);
  }

  .lg-input.has-eye { padding-right: 44px; }

  .lg-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 0;
    color: rgba(0, 200, 224, 0.35);
    display: flex; align-items: center;
    transition: color .25s ease;
  }

  .lg-eye:hover { color: rgba(0, 200, 224, 0.70); }

  .lg-helper-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px; margin-top: 8px;
    position: relative; z-index: 1;
    animation: slideUp .5s .3s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-remember {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    color: rgba(168, 216, 255, 0.55);
    cursor: pointer; user-select: none;
    transition: color .2s ease;
  }

  .lg-remember:hover { color: rgba(168, 216, 255, 0.75); }

  .lg-remember input[type="checkbox"] {
    accent-color: #00c8e0; cursor: pointer;
    width: 16px; height: 16px;
    border: 1.5px solid rgba(0, 200, 224, 0.32);
    border-radius: 4px; transition: all .2s ease;
  }

  .lg-remember input[type="checkbox"]:hover { border-color: rgba(0, 200, 224, 0.50); }

  .lg-forgot {
    font-family: 'Inter', sans-serif;
    font-size: 12.5px; font-weight: 700;
    color: #00c8e0; text-decoration: none;
    transition: all .25s ease;
  }

  .lg-forgot:hover {
    color: #a8d8ff;
    text-shadow: 0 0 14px rgba(0, 200, 224, 0.35);
    letter-spacing: 0.5px;
  }

  .lg-captcha-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    min-height: 65px;
    position: relative; z-index: 1;
  }

  .lg-btn {
    width: 100%;
    padding: 15px 22px;
    font-family: 'Poppins', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
    color: #fff;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .25s ease;
    margin-bottom: 24px;
    box-shadow: 0 0 32px rgba(232, 55, 42, 0.32), 0 0 0 1px rgba(232, 55, 42, 0.22);
    position: relative; z-index: 1;
    overflow: hidden;
    animation: slideUp .5s .35s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-btn::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
    transform: skewX(-20deg);
    transition: left 0.45s ease;
  }

  .lg-btn:hover:not(:disabled)::before { left: 140%; }

  .lg-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(232, 55, 42, 0.55), 0 6px 24px rgba(232, 55, 42, 0.35);
  }

  .lg-btn:active:not(:disabled) { transform: translateY(0); }
  .lg-btn:disabled { opacity: .5; cursor: not-allowed; }

  .lg-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.22); border-top-color: #fff;
    animation: lg-spin .65s linear infinite; flex-shrink: 0;
  }

  @keyframes lg-spin { to { transform: rotate(360deg); } }

  .lg-form-footer {
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: rgba(168, 216, 255, 0.50);
    padding-top: 22px;
    border-top: 1px solid rgba(0, 200, 224, 0.10);
    position: relative; z-index: 1;
    animation: slideUp .5s .4s cubic-bezier(.22,1,.36,1) both;
  }

  .lg-form-footer a {
    color: #00c8e0; font-weight: 700;
    text-decoration: none; transition: all .25s ease;
  }

  .lg-form-footer a:hover {
    color: #a8d8ff;
    text-shadow: 0 0 14px rgba(0, 200, 224, 0.35);
    letter-spacing: 0.5px;
  }

  .lg-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 28px 0;
    animation: slideUp .6s cubic-bezier(.22,1,.36,1) both;
    position: relative; z-index: 1;
  }

  .lg-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(0, 200, 224, 0.18);
    border: 2px solid rgba(0, 200, 224, 0.40);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin-bottom: 18px;
    box-shadow: 0 0 32px rgba(0, 200, 224, 0.25);
    animation: successPop .5s .1s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes successPop {
    from { transform: scale(.5) rotate(-15deg); opacity: 0; }
    to { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .lg-success-title {
    font-family: 'Poppins', sans-serif;
    font-size: 24px; font-weight: 700; color: #f8fafc; margin-bottom: 10px;
  }

  .lg-success-sub {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: rgba(168, 216, 255, 0.60);
    line-height: 1.7;
  }

  .lg-checking {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; padding: 60px 0;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px; color: rgba(168, 216, 255, 0.55);
    position: relative; z-index: 1;
  }

  .lg-check-spin {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2.5px solid rgba(0, 200, 224, 0.20); border-top-color: #00c8e0;
    animation: lg-spin .7s linear infinite;
  }

  @media (max-width: 920px) {
    .lg-page {
      grid-template-columns: 1fr;
      max-width: 500px;
      border-radius: 20px;
    }
    .lg-brand-panel { display: none; }
    .lg-form-panel { border-left: none; border-radius: 20px; }
  }

  @media (max-width: 480px) {
    .lg-root { padding: 16px; align-items: flex-start; padding-top: 32px; }
    .lg-page { min-height: auto; border-radius: 16px; }
    .lg-form-panel { padding: 36px 26px; }
    .lg-form-title { font-size: 24px; }
    .lg-input { padding: 11px 14px 11px 38px; font-size: 13px; }
    .lg-btn { padding: 13px 18px; font-size: 12px; margin-bottom: 18px; }
    .lg-form-footer { font-size: 12px; }
    .lg-back { font-size: 11px; }
  }

  @media (max-width: 360px) {
    .lg-form-panel { padding: 28px 18px; }
    .lg-form-title { font-size: 22px; }
    .lg-input { font-size: 12px; }
  }
`,C={admin:"/admin/dashboard",responder:"/responder/dashboard",citizen:"/citizen/dashboard"};function G(){return e.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}),e.jsx("path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"})]})}function $(){return e.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]})}function J(){const m=B(),{t:r}=M(),[h,L]=t.useState(""),[y,R]=t.useState(""),[U,A]=t.useState(!1),[w,D]=t.useState(!1),[v,d]=t.useState(!1),[T,I]=t.useState(!1),[j,g]=t.useState(""),[k,x]=t.useState(!0),[z,b]=t.useState(""),u=t.useRef(null),o=t.useRef(null),c=t.useRef(!0);t.useEffect(()=>(c.current=!0,()=>{c.current=!1}),[]),t.useEffect(()=>{let a=!1;return(async()=>{try{const{data:{session:n}}=await l.auth.getSession();if(!n?.user){a||x(!1);return}const{data:{user:i},error:S}=await l.auth.getUser();if(S||!i){await l.auth.signOut(),a||x(!1);return}const{data:p}=await l.from("profiles").select("role").eq("id",i.id).single(),f=p?.role?.trim().toLowerCase()??"";a||(x(!1),m(C[f]??"/citizen/dashboard",{replace:!0}))}catch{a||x(!1)}})(),()=>{a=!0}},[m]),t.useEffect(()=>{if(k||!u.current)return;let a=!1;const s=()=>{a||!u.current||o.current||window.turnstile&&(o.current=window.turnstile.render(u.current,{sitekey:O,theme:"dark",callback:n=>b(n),"expired-callback":()=>b(""),"error-callback":()=>b("")}))};if(window.turnstile)s();else{const n=document.querySelector("script[data-turnstile]");if(n)window.turnstile?s():n.addEventListener("load",s,{once:!0});else{const i=document.createElement("script");i.src="https://challenges.cloudflare.com/turnstile/v0/api.js",i.async=!0,i.defer=!0,i.setAttribute("data-turnstile","true"),i.addEventListener("load",s,{once:!0}),document.body.appendChild(i)}}return()=>{a=!0,window.turnstile&&o.current&&(window.turnstile.remove(o.current),o.current=null)}},[k]);const Y=()=>{b(""),window.turnstile&&o.current&&window.turnstile.reset(o.current)},N=async()=>{if(g(""),!h.trim()||!y.trim()){g(r("login.errors.missingFields","Please fill in all required fields."));return}if(!z){g(r("login.errors.needCaptcha","Please complete the CAPTCHA check."));return}d(!0);const{data:a,error:s}=await l.auth.signInWithPassword({email:h.trim(),password:y,options:{captchaToken:z}});if(s||!a?.user){const f=(s?.message?.toLowerCase()||"").includes("email not confirmed");g(f?r("login.errors.unconfirmedEmail","Please verify your email before signing in."):r("login.errors.loginFailed","Invalid email or password.")),d(!1),Y();return}const{data:n,error:i}=await l.from("profiles").select("role").eq("id",a.user.id).single();if(i||!n?.role){if(await new Promise(F=>setTimeout(F,1500)),!c.current)return;const{data:p}=await l.from("profiles").select("role").eq("id",a.user.id).single();if(!c.current)return;if(!p?.role){g(r("login.errors.profileNotReady","User profile is taking longer than expected. Please try again.")),d(!1);return}const f=p.role.trim().toLowerCase();I(!0),d(!1),setTimeout(()=>{c.current&&m(C[f]??"/citizen/dashboard",{replace:!0})},900);return}const S=n.role.trim().toLowerCase();I(!0),d(!1),setTimeout(()=>{c.current&&m(C[S]??"/citizen/dashboard",{replace:!0})},900)};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:_}),e.jsx("div",{className:"lg-root",style:{"--bg-image":`url(${P})`},children:e.jsxs("div",{className:"lg-page",children:[e.jsxs("div",{className:"lg-brand-panel",children:[e.jsx("div",{className:"lg-brand-panel-bg",style:{backgroundImage:`url(${P})`}}),e.jsx("div",{className:"lg-panel-geo"}),e.jsx("div",{className:"lg-panel-geo-2"}),e.jsxs("div",{className:"lg-brand-top",children:[e.jsxs("div",{className:"lg-brand-logo",children:[e.jsx("div",{className:"lg-brand-logo-img",children:e.jsx("img",{src:W,alt:"DumaSafeGuide"})}),e.jsxs("div",{className:"lg-brand-logo-name",children:["Duma",e.jsx("span",{children:"SafeGuide"})]})]}),e.jsxs("div",{className:"lg-brand-headline",children:[r("login.headline1","Empowering"),e.jsx("br",{}),e.jsx("span",{className:"accent",children:r("login.headlineAccent","Dumaguete")}),e.jsx("br",{}),r("login.headline2","Safety Together.")]}),e.jsx("p",{className:"lg-brand-desc",children:r("login.desc","Real-time emergency monitoring and citizen response platform.")})]}),e.jsxs("div",{className:"lg-brand-bottom",children:[e.jsxs("div",{className:"lg-brand-stats",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"lg-brand-stat-val",children:["30",e.jsx("em",{children:"+"})]}),e.jsx("div",{className:"lg-brand-stat-label",children:r("login.stats.barangays","Barangays Covered")})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"lg-brand-stat-val",children:[e.jsx("em",{children:"24"}),"/7"]}),e.jsx("div",{className:"lg-brand-stat-label",children:r("login.stats.monitoring","Monitoring Status")})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"lg-brand-stat-val",children:["<",e.jsx("em",{children:"5m"})]}),e.jsx("div",{className:"lg-brand-stat-label",children:r("login.stats.avgResponse","Average Response Time")})]})]}),e.jsx("div",{className:"lg-brand-divider"}),e.jsxs("div",{className:"lg-brand-badge",children:[e.jsx("span",{className:"lg-brand-badge-dot"}),r("login.badge","Official City Emergency Portal")]})]})]}),e.jsx("div",{className:"lg-form-panel",children:k?e.jsxs("div",{className:"lg-checking",children:[e.jsx("span",{className:"lg-check-spin"}),r("login.checkingSession","Checking session...")]}):T?e.jsxs("div",{className:"lg-success",children:[e.jsx("div",{className:"lg-success-icon",children:e.jsx(q,{size:32,color:"#00c8e0"})}),e.jsx("div",{className:"lg-success-title",children:r("login.success.title","Welcome Back!")}),e.jsx("div",{className:"lg-success-sub",children:r("login.success.sub","Redirecting to your dashboard...")})]}):e.jsxs("div",{children:[e.jsxs(E,{to:"/",className:"lg-back",children:[e.jsx("span",{className:"lg-back-arrow",children:"←"}),r("login.backToHome","Back to Home")]}),e.jsxs("div",{className:"lg-form-header",children:[e.jsx("div",{className:"lg-form-eyebrow",children:r("login.formEyebrow","Secure Portal")}),e.jsx("div",{className:"lg-form-title",children:r("login.formTitle","Welcome Back")}),e.jsx("div",{className:"lg-form-sub",children:r("login.formSub","Enter your credentials to access your account")})]}),e.jsx("div",{className:"lg-rule"}),j&&e.jsxs("div",{className:"lg-error",children:[e.jsx("span",{children:"⚠"}),e.jsx("span",{children:j})]},j),e.jsxs("div",{className:"lg-field",children:[e.jsx("label",{className:"lg-label",children:r("login.labels.email","Email Address")}),e.jsxs("div",{className:"lg-input-wrap",children:[e.jsx("span",{className:"lg-field-icon",children:e.jsx(G,{})}),e.jsx("input",{className:"lg-input",type:"email",placeholder:" ",value:h,onChange:a=>L(a.target.value),onKeyDown:a=>{a.key==="Enter"&&(a.preventDefault(),N())},autoComplete:"email",autoFocus:!0})]})]}),e.jsxs("div",{className:"lg-field",children:[e.jsx("label",{className:"lg-label",children:r("login.labels.password","Password")}),e.jsxs("div",{className:"lg-input-wrap",children:[e.jsx("span",{className:"lg-field-icon",children:e.jsx($,{})}),e.jsx("input",{className:"lg-input has-eye",type:w?"text":"password",placeholder:"••••••••",value:y,onChange:a=>R(a.target.value),onKeyDown:a=>{a.key==="Enter"&&(a.preventDefault(),N())},autoComplete:"current-password"}),e.jsx("button",{type:"button",className:"lg-eye",onClick:()=>D(a=>!a),tabIndex:-1,"aria-label":w?"Hide password":"Show password",children:w?e.jsx(X,{size:14}):e.jsx(H,{size:14})})]})]}),e.jsxs("div",{className:"lg-helper-row",children:[e.jsxs("label",{className:"lg-remember",children:[e.jsx("input",{type:"checkbox",checked:U,onChange:a=>A(a.target.checked)}),r("login.rememberMe","Remember Me")]}),e.jsx(E,{to:"/forgot-password",className:"lg-forgot",children:r("login.forgotPassword","Forgot Password?")})]}),e.jsx("div",{className:"lg-captcha-wrap",ref:u}),e.jsxs("button",{className:"lg-btn",onClick:N,disabled:v||!z,type:"button",children:[v&&e.jsx("span",{className:"lg-spinner"}),v?r("login.submitting","Signing In..."):e.jsxs(e.Fragment,{children:[r("login.submitBtn","Sign In"),e.jsx(K,{size:11})]})]}),e.jsxs("div",{className:"lg-form-footer",children:[r("login.footerNoAccount","Don't have an account? "),e.jsx(E,{to:"/signup",children:r("login.footerCreateAccount","Register Here")})]})]})})]})})]})}export{J as default};
