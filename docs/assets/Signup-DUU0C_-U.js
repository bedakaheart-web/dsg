import{ao as O,am as n,ak as e,j as $,ae as y,b as G,z as L,y as E,an as j}from"./index-CvhaT9ii.js";import{d as A}from"./directorybg-Chf2hGEo.js";import{d as M}from"./dsg_logo-y5lwJ5SV.js";const V="0x4AAAAAAEeWeQHuqgMoh8cd",q=new Set(["mailinator.com","tempmail.com","temp-mail.org","10minutemail.com","guerrillamail.com","guerrillamail.info","guerrillamail.biz","guerrillamail.de","yopmail.com","throwawaymail.com","sharklasers.com","trashmail.com","getnada.com","maildrop.cc","fakeinbox.com","mintemail.com","dispostable.com","mailnesia.com","tempinbox.com","moakt.com","emailondeck.com","spamgourmet.com","mytemp.email","tempr.email","burnermail.io","mailcatch.com","mohmal.com","0-mail.com","discard.email","throwam.com"]);function v(s){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)}function K(s){const a=s.split("@")[1]?.toLowerCase().trim();return a?q.has(a):!1}const D=`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

  html, body {
    overflow-x: hidden !important;
    width: 100%;
    max-width: 100vw;
    margin: 0; padding: 0;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .su-root {
    min-height: 100vh;
    display: flex;
    font-family: 'Inter', sans-serif;
    color: #ddeef8;
    overflow-x: hidden;
    position: relative;
    width: 100%;
    max-width: 100vw;
    /* FIXED: dark base so background image never bleeds through as white */
    background: #07101d;
  }

  /* Layer 1 — background photo at reduced opacity */
  .su-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    /* FIXED: raised from 0.12 → 0.22 so the image is visible but not washed out */
    opacity: 0.22;
    pointer-events: none;
  }

  /* Layer 2 — dark gradient overlay that dims the whole page */
  .su-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background:
      linear-gradient(180deg, rgba(7,16,29,0.78) 0%, rgba(7,16,29,0.68) 50%, rgba(7,16,29,0.82) 100%),
      radial-gradient(circle at 20% 20%, rgba(0,200,224,0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(232,55,42,0.06) 0%, transparent 50%);
    animation: atmosphereDrift 25s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes atmosphereDrift {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  /* ── Left Panel ── */
  .su-left {
    position: relative;
    width: 45%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 52px;
    overflow: hidden;
    flex-shrink: 0;
    z-index: 1;
    /* FIXED: unified surface opacity to match About page */
    background: rgba(13, 27, 46, 0.72);
  }

  .su-left-bg {
    position: absolute; inset: 0; z-index: 0;
    background-size: cover; background-position: center;
    opacity: 0.02;
  }

  .su-left-bg::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(7,16,29,0.72) 0%, rgba(7,16,29,0.58) 50%, rgba(7,16,29,0.70) 100%);
  }

  .su-left-lines {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,200,224,0.015) 3px, rgba(0,200,224,0.015) 4px);
  }

  .su-left-glow-a {
    position: absolute; z-index: 1; pointer-events: none;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,55,42,0.10) 0%, transparent 65%);
    top: -180px; left: -160px;
    filter: blur(40px);
    animation: glowPulse 8s ease-in-out infinite;
  }

  .su-left-glow-b {
    position: absolute; z-index: 1; pointer-events: none;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,224,0.08) 0%, transparent 65%);
    bottom: -100px; right: -80px;
    filter: blur(40px);
    animation: glowPulse 10s 2s ease-in-out infinite;
  }

  @keyframes glowPulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.1); opacity: 0.9; }
  }

  .su-left::after {
    content: '';
    position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
    background: linear-gradient(180deg, transparent 0%, rgba(0,200,224,0.25) 20%, rgba(0,200,224,0.40) 50%, rgba(0,200,224,0.25) 80%, transparent 100%);
    z-index: 3;
  }

  .su-left-content { position: relative; z-index: 2; }

  .su-brand-row {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 60px;
    animation: slideDown .6s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .su-logo-ring {
    width: 44px; height: 44px; border-radius: 12px;
    background: transparent;
    border: none;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform .3s ease;
    overflow: hidden;
  }

  .su-brand-row:hover .su-logo-ring { transform: scale(1.08) rotate(-5deg); }

  .su-brand-name {
    font-family: 'Poppins', sans-serif;
    font-size: 18px; font-weight: 700;
    color: #F8FAFC; letter-spacing: -0.02em;
  }

  .su-brand-name span { color: #00c8e0; }

  .su-hero {
    padding-bottom: 40px;
    animation: slideUp .7s .1s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .su-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 12px; border-radius: 99px;
    background: rgba(0,200,224,0.10);
    border: 1px solid rgba(0,200,224,0.25);
    font-family: 'Inter', sans-serif;
    font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    color: rgba(0,200,224,0.80);
    margin-bottom: 20px;
  }

  .su-hero-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #00c8e0;
    animation: su-pulse 2s ease-in-out infinite;
  }

  @keyframes su-pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)} }

  .su-hero-title {
    font-family: 'Poppins', sans-serif;
    font-size: 36px; font-weight: 700;
    color: #F8FAFC; line-height: 1.08; letter-spacing: -0.025em;
    margin-bottom: 18px;
  }

  .su-hero-title .c { color: #00c8e0; }
  .su-hero-title .r { color: #e8372a; }

  .su-hero-desc {
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 400;
    color: rgba(168,216,255,0.45); line-height: 1.8;
    max-width: 340px; margin-bottom: 36px;
  }

  .su-steps { display: flex; flex-direction: column; gap: 14px; max-width: 340px; }

  .su-step {
    display: flex; align-items: flex-start; gap: 13px;
    padding: 16px 18px; border-radius: 12px;
    /* FIXED: unified step card opacity to match About page surface */
    background: rgba(13, 27, 46, 0.72);
    border: 1px solid rgba(0,200,224,0.12);
    backdrop-filter: blur(12px);
    transition: all .3s ease;
    animation: slideUp .5s ease both;
  }

  .su-step:nth-child(1) { animation-delay: .2s; }
  .su-step:nth-child(2) { animation-delay: .3s; }
  .su-step:nth-child(3) { animation-delay: .4s; }

  .su-step:hover {
    background: rgba(13, 27, 46, 0.88);
    border-color: rgba(0,200,224,0.22);
    transform: translateX(4px);
    box-shadow: 0 8px 24px rgba(0,200,224,0.08);
  }

  .su-step-num {
    width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
    background: rgba(0,200,224,0.12);
    border: 1px solid rgba(0,200,224,0.30);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700; color: #00c8e0;
    margin-top: 1px;
  }

  .su-step-title {
    font-family: 'Inter', sans-serif;
    font-size: 12.5px; font-weight: 600; color: rgba(168,216,255,0.85); margin-bottom: 3px; letter-spacing: -0.01em;
  }
  .su-step-desc  {
    font-family: 'Inter', sans-serif;
    font-size: 11.5px; color: rgba(168,216,255,0.35); line-height: 1.5;
  }

  .su-left-footer {
    position: relative; z-index: 2;
    animation: slideUp .7s .5s cubic-bezier(.22,1,.36,1) both;
  }

  .su-cert-badge {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 10px 14px; border-radius: 10px;
    /* FIXED: unified badge opacity to match About page surface */
    background: rgba(13, 27, 46, 0.72);
    border: 1px solid rgba(0,200,224,0.15);
    backdrop-filter: blur(12px);
    transition: all .3s ease;
  }

  .su-cert-badge:hover {
    background: rgba(13, 27, 46, 0.88);
    border-color: rgba(0,200,224,0.30);
    box-shadow: 0 8px 24px rgba(0,200,224,0.08);
  }

  .su-cert-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #2ecc8f; flex-shrink: 0;
    box-shadow: 0 0 8px rgba(46,204,143,0.7);
    animation: su-pulse 2.5s ease-in-out infinite;
  }

  .su-cert-text {
    font-family: 'Inter', sans-serif;
    font-size: 11.5px; color: rgba(168,216,255,0.50);
  }
  .su-cert-text strong { color: rgba(168,216,255,0.80); font-weight: 600; }

  /* ── Right Panel ── */
  .su-right {
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    /* FIXED: unified surface opacity to match About page */
    background: rgba(13, 27, 46, 0.72);
    position: relative;
    overflow-y: auto;
    z-index: 1;
    min-width: 0;
  }

  .su-right::before {
    content: ''; position: absolute; top: -200px; right: -200px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,200,224,0.05) 0%, transparent 65%);
    pointer-events: none;
    filter: blur(40px);
  }

  .su-form-wrap {
    width: 100%; max-width: 460px;
    position: relative; z-index: 1;
    animation: slideUp .6s cubic-bezier(.22,1,.36,1) both;
  }

  .su-back {
    display: inline-flex; align-items: center; gap: 7px;
    margin-bottom: 32px;
    font-family: 'Inter', sans-serif;
    font-size: 11.5px; font-weight: 600;
    color: rgba(168,216,255,0.45); text-decoration: none;
    transition: all .3s ease;
  }

  .su-back:hover { color: #00c8e0; gap: 10px; }
  .su-back svg   { transition: transform .3s ease; }
  .su-back:hover svg { transform: translateX(-4px); }

  .su-form-accent {
    width: 48px; height: 3px; border-radius: 99px;
    background: linear-gradient(90deg, #e8372a 0%, #00c8e0 100%);
    margin-bottom: 20px;
    animation: slideRight .7s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideRight {
    from { width: 0; opacity: 0; }
    to { width: 48px; opacity: 1; }
  }

  .su-form-title {
    font-family: 'Poppins', sans-serif;
    font-size: 28px; font-weight: 700;
    color: #F8FAFC; letter-spacing: -0.025em; margin-bottom: 6px;
    animation: slideUp .6s .1s cubic-bezier(.22,1,.36,1) both;
  }

  .su-form-sub {
    font-family: 'Inter', sans-serif;
    font-size: 13.5px; font-weight: 400;
    color: rgba(168,216,255,0.45); margin-bottom: 28px;
    animation: slideUp .6s .15s cubic-bezier(.22,1,.36,1) both;
  }

  .su-error {
    display: flex; align-items: flex-start; gap: 11px;
    background: rgba(232,55,42,0.10);
    border: 1px solid rgba(232,55,42,0.28);
    border-radius: 12px; padding: 13px 15px;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px; color: #ff8877; margin-bottom: 18px;
    animation: errorShake .35s ease;
    width: 100%; box-sizing: border-box;
  }

  @keyframes errorShake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-6px)}
    40%{transform:translateX(6px)}
    60%{transform:translateX(-4px)}
    80%{transform:translateX(4px)}
  }

  .su-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .su-field { margin-bottom: 15px; animation: slideUp .5s ease both; width: 100%; }
  .su-field:nth-child(1) { animation-delay: .2s; }
  .su-field:nth-child(2) { animation-delay: .25s; }
  .su-field:nth-child(3) { animation-delay: .3s; }
  .su-field:nth-child(4) { animation-delay: .35s; }
  .su-field:nth-child(5) { animation-delay: .4s; }

  .su-label {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: .04em;
    text-transform: uppercase; color: rgba(168,216,255,0.64); margin-bottom: 9px;
  }

  .su-input-wrap { position: relative; width: 100%; }

  .su-field-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(0,200,224,0.30); pointer-events: none;
    display: flex; align-items: center;
    transition: color .3s ease;
  }

  .su-input-wrap:focus-within .su-field-icon { color: rgba(0,200,224,0.60); }

  .su-input, .su-select {
    width: 100%;
    /* FIXED: unified input background to match About page surface */
    background: rgba(13, 27, 46, 0.88);
    border: 1.5px solid rgba(0,200,224,0.16);
    border-radius: 11px;
    padding: 13px 16px 13px 42px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #F8FAFC;
    outline: none;
    caret-color: #00c8e0;
    transition: all .25s ease;
    box-sizing: border-box;
  }

  .su-input::placeholder { color: rgba(168,216,255,0.22); }

  .su-input:focus, .su-select:focus {
    border-color: rgba(0,200,224,0.42);
    background: rgba(0,200,224,0.04);
    box-shadow: 0 0 0 4px rgba(0,200,224,0.08), inset 0 0 0 1px rgba(0,200,224,0.06);
  }

  .su-input.has-eye { padding-right: 44px; }

  .su-select {
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(0,200,224,0.35)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 13px center; background-size: 16px;
    padding-right: 40px;
    /* FIXED: keep unified bg even on select */
    background-color: rgba(13, 27, 46, 0.88);
  }

  .su-select option { background: #0a1525; color: #F8FAFC; }

  .su-eye {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 0;
    color: rgba(0,200,224,0.35);
    display: flex; align-items: center;
    transition: color .2s;
  }

  .su-eye:hover { color: rgba(0,200,224,0.70); }

  .su-pw-hint {
    font-family: 'Inter', sans-serif;
    font-size: 11px; color: rgba(168,216,255,0.22);
    margin-top: 5px; padding-left: 2px; font-weight: 400;
  }

  .su-captcha-wrap {
    margin: 18px 0 6px;
    display: flex;
    justify-content: center;
    min-height: 65px;
  }

  .su-btn {
    width: 100%; padding: 15px 22px;
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: .10em; text-transform: uppercase;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
    color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .25s ease;
    margin-top: 10px; margin-bottom: 20px;
    position: relative; overflow: hidden;
    box-shadow: 0 0 32px rgba(232,55,42,0.32), 0 0 0 1px rgba(232,55,42,0.22);
    box-sizing: border-box;
  }

  .su-btn::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
    transform: skewX(-20deg); transition: left .45s ease;
  }

  .su-btn:hover:not(:disabled)::before { left: 140%; }
  .su-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(232,55,42,0.55), 0 6px 24px rgba(232,55,42,0.35);
    background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
  }
  .su-btn:active:not(:disabled) { transform: translateY(0); }
  .su-btn:disabled { opacity: .5; cursor: not-allowed; }

  .su-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.22); border-top-color: #fff;
    animation: su-spin .65s linear infinite; flex-shrink: 0;
  }

  @keyframes su-spin { to { transform: rotate(360deg); } }

  .su-form-footer {
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 13px; color: rgba(168,216,255,0.50);
    padding-top: 22px;
    border-top: 1px solid rgba(0,200,224,0.10);
  }
  .su-form-footer a { color: #00c8e0; text-decoration: none; font-weight: 700; transition: all .2s ease; }
  .su-form-footer a:hover {
    color: #a8d8ff;
    text-shadow: 0 0 14px rgba(0,200,224,0.35);
    letter-spacing: 0.5px;
  }

  /* ── Success State ── */
  .su-success {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 40px 0;
    animation: slideUp .6s cubic-bezier(.22,1,.36,1) both;
  }

  .su-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(0,200,224,0.18);
    border: 2px solid rgba(0,200,224,0.40);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin-bottom: 18px;
    box-shadow: 0 0 32px rgba(0,200,224,0.25);
    animation: successPop .5s .1s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes successPop {
    from { transform: scale(.5) rotate(-15deg); opacity: 0; }
    to   { transform: scale(1)  rotate(0deg);  opacity: 1; }
  }

  .su-success-title {
    font-family: 'Poppins', sans-serif;
    font-size: 24px; font-weight: 700; color: #F8FAFC; margin-bottom: 10px;
  }
  .su-success-msg {
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 400; color: rgba(168,216,255,0.60); line-height: 1.7; margin-bottom: 8px; max-width: 340px;
  }
  .su-success-msg strong { color: #00c8e0; font-weight: 600; }
  .su-success-note {
    font-family: 'Inter', sans-serif;
    font-size: 12px; color: rgba(168,216,255,0.28); margin-bottom: 28px; font-style: italic;
  }
  .su-success-div   { width: 100%; height: 1px; background: rgba(0,200,224,0.12); margin-bottom: 24px; }

  .su-success-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 9px;
    width: 100%; padding: 15px;
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: .10em; text-transform: uppercase;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #e8372a 0%, #f04438 100%);
    color: #fff; cursor: pointer; text-decoration: none;
    transition: all .25s ease;
    box-shadow: 0 0 32px rgba(232,55,42,0.32), 0 0 0 1px rgba(232,55,42,0.22);
    position: relative; overflow: hidden;
    box-sizing: border-box;
  }

  .su-success-btn::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
    transform: skewX(-20deg); transition: left .45s ease;
  }

  .su-success-btn:hover::before { left: 140%; }
  .su-success-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(232,55,42,0.55), 0 6px 24px rgba(232,55,42,0.35);
    background: linear-gradient(135deg, #f04438 0%, #f85a47 100%);
  }

  /* ══════════════════════════════════════
     TABLET — stack vertically
     ══════════════════════════════════════ */
  @media (max-width: 920px) {
    .su-root {
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .su-left {
      width: 100%;
      min-height: auto;
      padding: 28px 28px 24px;
      flex-shrink: 0;
    }

    .su-left::after { display: none; }

    .su-brand-row { margin-bottom: 20px; }

    .su-hero { padding-bottom: 0; }
    .su-hero-title { font-size: 26px; }
    .su-hero-desc { display: none; }
    .su-steps { display: none; }
    .su-left-footer { margin-top: 16px; }

    .su-right {
      min-height: auto;
      flex: 1;
      padding: 32px 28px 56px;
      justify-content: flex-start;
    }

    .su-form-wrap { max-width: 100%; }
  }

  /* ══════════════════════════════════════
     MOBILE — OnePlus Nord ~412px
     ══════════════════════════════════════ */
  @media (max-width: 600px) {
    .su-root { flex-direction: column; }

    .su-left {
      width: 100%;
      min-height: auto;
      padding: 0;
      flex-shrink: 0;
    }

    .su-mobile-header {
      display: flex !important;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      /* FIXED: unified mobile header opacity */
      background: rgba(13, 27, 46, 0.95);
      border-bottom: 1px solid rgba(0,200,224,0.14);
      position: relative;
      z-index: 2;
      width: 100%;
      box-sizing: border-box;
    }

    .su-brand-row  { display: none; }
    .su-hero       { display: none; }
    .su-left-footer { display: none; }
    .su-left-lines  { display: none; }
    .su-left-glow-a { display: none; }
    .su-left-glow-b { display: none; }
    .su-left-bg     { display: none; }
    .su-left::after { display: none; }

    .su-right {
      flex: 1;
      min-height: auto;
      padding: 24px 16px 48px;
      justify-content: flex-start;
      background: transparent;
    }

    .su-right::before { display: none; }

    .su-form-wrap {
      max-width: 100%;
      width: 100%;
    }

    .su-back { margin-bottom: 20px; font-size: 11px; }

    .su-form-accent { margin-bottom: 14px; }

    .su-form-title { font-size: 22px; margin-bottom: 4px; }

    .su-form-sub { font-size: 12.5px; margin-bottom: 20px; }

    .su-row-2 { grid-template-columns: 1fr; gap: 0; }

    .su-field { margin-bottom: 13px; }

    .su-input, .su-select {
      padding: 11px 14px 11px 36px;
      font-size: 13px;
      border-radius: 10px;
    }

    .su-label { font-size: 10px; margin-bottom: 6px; }

    .su-btn {
      padding: 13px 18px;
      font-size: 12px;
      margin-top: 8px;
      margin-bottom: 16px;
      border-radius: 10px;
    }

    .su-pw-hint { font-size: 10.5px; }

    .su-error {
      font-size: 12px;
      padding: 11px 13px;
      border-radius: 10px;
    }

    .su-form-footer { font-size: 12.5px; }

    .su-success-icon { width: 60px; height: 60px; font-size: 26px; }
    .su-success-title { font-size: 20px; }
    .su-success-msg { font-size: 13px; }
  }

  @media (max-width: 400px) {
    .su-right { padding: 20px 14px 44px; }
    .su-form-title { font-size: 20px; }
    .su-btn { padding: 12px 16px; }
    .su-input, .su-select { font-size: 12.5px; padding: 10px 13px 10px 34px; }
  }
`,Q=["Bagacay","Bajumpandan","Balugo","Banilad","Bantayan","Batinguel","Buñao","Cadawinonan","Calindagan","Camanjac","Candau-ay","Cantil-e","Daro","Looc","Lumabangan","Mangnao","Motong","Piapi","Poblacion 1","Poblacion 2","Poblacion 3","Poblacion 4","Poblacion 5","Poblacion 6","Poblacion 7","Poblacion 8","Pulantubig","Tabuctubig","Taclobo","Talay"].sort();function B(){return e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}function J(){return e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"}),e.jsx("circle",{cx:"12",cy:"10",r:"3"})]})}function Z(){return e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.06 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.1a16 16 0 0 0 5.45 5.45l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"})})}function ee(){return e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}),e.jsx("path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"})]})}function T(){return e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]})}function se({t:s}){return e.jsxs("div",{className:"su-mobile-header",style:{display:"none"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[e.jsx("img",{src:M,alt:"DSG Logo",style:{width:36,height:36,objectFit:"contain"}}),e.jsxs("div",{style:{fontFamily:"'Poppins', sans-serif",fontSize:16,fontWeight:700,color:"#F8FAFC",letterSpacing:"-0.02em"},children:["Duma",e.jsx("span",{style:{color:"#00c8e0"},children:"SafeGuide"})]})]}),e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 10px",borderRadius:99,background:"rgba(0,200,224,0.10)",border:"1px solid rgba(0,200,224,0.22)",fontFamily:"'Inter', sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.10em",textTransform:"uppercase",color:"rgba(0,200,224,0.85)"},children:[e.jsx("span",{style:{width:5,height:5,borderRadius:"50%",background:"#00c8e0",display:"inline-block"}}),s("signup.mobileBadge")]})]})}function X({t:s}){return e.jsxs("div",{className:"su-left",children:[e.jsx("div",{className:"su-left-bg"}),e.jsx("div",{className:"su-left-lines"}),e.jsx("div",{className:"su-left-glow-a"}),e.jsx("div",{className:"su-left-glow-b"}),e.jsx(se,{t:s}),e.jsx("div",{className:"su-left-content",children:e.jsxs("div",{className:"su-brand-row",children:[e.jsx("div",{className:"su-logo-ring",children:e.jsx("img",{src:M,alt:"DumaSafeGuide Logo",style:{width:44,height:44,objectFit:"contain"}})}),e.jsxs("div",{className:"su-brand-name",children:["Duma",e.jsx("span",{children:"SafeGuide"})]})]})}),e.jsxs("div",{className:"su-hero su-left-content",children:[e.jsxs("div",{className:"su-hero-eyebrow",children:[e.jsx("span",{className:"su-hero-dot"}),s("signup.eyebrow")]}),e.jsxs("h1",{className:"su-hero-title",children:[s("signup.heroLine1"),e.jsx("br",{}),e.jsx("span",{className:"c",children:s("signup.heroAccent1")}),e.jsx("br",{}),e.jsx("span",{className:"r",children:s("signup.heroAccent2")})]}),e.jsx("p",{className:"su-hero-desc",children:s("signup.heroDesc")}),e.jsxs("div",{className:"su-steps",children:[e.jsxs("div",{className:"su-step",children:[e.jsx("div",{className:"su-step-num",children:"1"}),e.jsxs("div",{children:[e.jsx("div",{className:"su-step-title",children:s("signup.steps.create.title")}),e.jsx("div",{className:"su-step-desc",children:s("signup.steps.create.desc")})]})]}),e.jsxs("div",{className:"su-step",children:[e.jsx("div",{className:"su-step-num",children:"2"}),e.jsxs("div",{children:[e.jsx("div",{className:"su-step-title",children:s("signup.steps.access.title")}),e.jsx("div",{className:"su-step-desc",children:s("signup.steps.access.desc")})]})]}),e.jsxs("div",{className:"su-step",children:[e.jsx("div",{className:"su-step-num",children:"3"}),e.jsxs("div",{children:[e.jsx("div",{className:"su-step-title",children:s("signup.steps.report.title")}),e.jsx("div",{className:"su-step-desc",children:s("signup.steps.report.desc")})]})]})]})]}),e.jsx("div",{className:"su-left-footer",children:e.jsxs("div",{className:"su-cert-badge",children:[e.jsx("span",{className:"su-cert-dot"}),e.jsxs("span",{className:"su-cert-text",children:[e.jsx("strong",{children:s("signup.certBold")})," ",s("signup.certRest")]})]})})]})}function ne(){const{t:s}=O(),[a,R]=n.useState({firstName:"",lastName:"",email:"",phone:"",barangay:"",password:"",confirmPassword:""}),[m,U]=n.useState(!1),[x,W]=n.useState(!1),[f,k]=n.useState(!1),[h,o]=n.useState(""),[Y,N]=n.useState(!1),[b,p]=n.useState(""),[z,H]=n.useState(!1),w=n.useRef(null),l=n.useRef(null);n.useEffect(()=>{const t=document.querySelector("script[data-turnstile]"),r=()=>{!window.turnstile||!w.current||l.current||(l.current=window.turnstile.render(w.current,{sitekey:V,theme:"dark",callback:i=>p(i),"expired-callback":()=>p(""),"error-callback":()=>p("")}))};if(window.turnstile)r();else if(t)t.addEventListener("load",r);else{const i=document.createElement("script");i.src="https://challenges.cloudflare.com/turnstile/v0/api.js",i.async=!0,i.defer=!0,i.setAttribute("data-turnstile","true"),i.onload=r,document.body.appendChild(i)}return()=>{window.turnstile&&l.current&&(window.turnstile.remove(l.current),l.current=null)}},[]);const c=t=>{R(r=>({...r,[t.target.name]:t.target.value}))},_=async t=>{t.preventDefault(),o("");const{firstName:r,lastName:i,email:u,phone:I,barangay:C,password:g,confirmPassword:F}=a;if(!r||!i||!u||!I||!C||!g||!F){o(s("signup.errors.missingFields"));return}if(!v(u)){o(s("signup.errors.invalidEmail"));return}if(K(u)){o(s("signup.errors.disposableEmail"));return}if(g!==F){o(s("signup.errors.passwordMismatch"));return}if(g.length<6){o(s("signup.errors.passwordTooShort"));return}if(!b){o(s("signup.errors.needCaptcha"));return}k(!0);try{const d=`${r.trim()} ${i.trim()}`.trim(),{data:S,error:P}=await j.auth.signUp({email:u,password:g,options:{captchaToken:b,emailRedirectTo:`${window.location.origin}/dashboard/citizen`,data:{first_name:r.trim(),last_name:i.trim(),full_name:d,phone_number:I,barangay:C}}});if(P)throw P;if(!S.user)throw new Error(s("signup.errors.unexpected"));await j.auth.signOut(),N(!0)}catch(d){if(d.message?.toLowerCase().includes("duplicate")||d.message?.toLowerCase().includes("already")||d.code==="23505"){await j.auth.signOut(),N(!0);return}o(d.message||s("signup.errors.unexpected")),p(""),window.turnstile&&l.current&&window.turnstile.reset(l.current)}finally{k(!1)}};return Y?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:D}),e.jsxs("div",{className:"su-root",style:{"--bg-image":`url(${A})`},children:[e.jsx(X,{t:s}),e.jsx("div",{className:"su-right",children:e.jsx("div",{className:"su-form-wrap",children:e.jsxs("div",{className:"su-success",children:[e.jsx("div",{className:"su-success-icon",children:e.jsx($,{})}),e.jsx("div",{className:"su-success-title",children:s("signup.success.title")}),e.jsxs("p",{className:"su-success-msg",children:[e.jsx("strong",{children:s("signup.success.msgIntro")}),e.jsx("br",{}),s("signup.success.msgBody")]}),e.jsx("p",{className:"su-success-note",children:s("signup.success.note")}),e.jsx("div",{className:"su-success-div"}),e.jsxs(y,{to:"/login",className:"su-success-btn",children:[e.jsx(G,{size:12,style:{marginRight:"2px"}}),s("signup.success.goToSignIn")]})]})})})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("style",{children:D}),e.jsxs("div",{className:"su-root",style:{"--bg-image":`url(${A})`},children:[e.jsx(X,{t:s}),e.jsx("div",{className:"su-right",children:e.jsxs("div",{className:"su-form-wrap",children:[e.jsxs(y,{to:"/",className:"su-back",children:[e.jsx("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M19 12H5M12 5l-7 7 7 7"})}),s("signup.backToHome")]}),e.jsx("div",{className:"su-form-accent"}),e.jsx("div",{className:"su-form-title",children:s("signup.formTitle")}),e.jsx("div",{className:"su-form-sub",children:s("signup.formSub")}),h&&e.jsxs("div",{className:"su-error",children:[e.jsx("span",{children:"⚠"}),e.jsx("span",{children:h})]},h),e.jsxs("form",{onSubmit:_,noValidate:!0,children:[e.jsxs("div",{className:"su-row-2",children:[e.jsxs("div",{className:"su-field",children:[e.jsx("label",{className:"su-label",children:s("signup.labels.firstName")}),e.jsxs("div",{className:"su-input-wrap",children:[e.jsx("span",{className:"su-field-icon",children:e.jsx(B,{})}),e.jsx("input",{className:"su-input",name:"firstName",type:"text",placeholder:s("signup.placeholders.firstName"),value:a.firstName,onChange:c})]})]}),e.jsxs("div",{className:"su-field",children:[e.jsx("label",{className:"su-label",children:s("signup.labels.lastName")}),e.jsxs("div",{className:"su-input-wrap",children:[e.jsx("span",{className:"su-field-icon",children:e.jsx(B,{})}),e.jsx("input",{className:"su-input",name:"lastName",type:"text",placeholder:s("signup.placeholders.lastName"),value:a.lastName,onChange:c})]})]})]}),e.jsxs("div",{className:"su-row-2",children:[e.jsxs("div",{className:"su-field",children:[e.jsx("label",{className:"su-label",children:s("signup.labels.barangay")}),e.jsxs("div",{className:"su-input-wrap",children:[e.jsx("span",{className:"su-field-icon",children:e.jsx(J,{})}),e.jsxs("select",{className:"su-select",name:"barangay",value:a.barangay,onChange:c,children:[e.jsx("option",{value:"",disabled:!0,children:s("signup.placeholders.selectLocation")}),Q.map(t=>e.jsx("option",{value:t,children:t},t))]})]})]}),e.jsxs("div",{className:"su-field",children:[e.jsx("label",{className:"su-label",children:s("signup.labels.phone")}),e.jsxs("div",{className:"su-input-wrap",children:[e.jsx("span",{className:"su-field-icon",children:e.jsx(Z,{})}),e.jsx("input",{className:"su-input",name:"phone",type:"tel",placeholder:s("signup.placeholders.phone"),value:a.phone,onChange:c})]})]})]}),e.jsxs("div",{className:"su-field",children:[e.jsx("label",{className:"su-label",children:s("signup.labels.email")}),e.jsxs("div",{className:"su-input-wrap",children:[e.jsx("span",{className:"su-field-icon",children:e.jsx(ee,{})}),e.jsx("input",{className:"su-input",name:"email",type:"email",placeholder:" ",value:a.email,onChange:c,onBlur:()=>H(!0)})]}),z&&a.email&&!v(a.email)&&e.jsx("p",{style:{fontSize:11.5,marginTop:6,color:"#ff8877"},children:s("signup.emailInvalid")}),!(z&&a.email&&!v(a.email))&&e.jsx("p",{style:{fontSize:11,marginTop:6,color:"rgba(168,216,255,0.35)"},children:s("signup.emailHint")})]}),e.jsxs("div",{className:"su-row-2",children:[e.jsxs("div",{className:"su-field",children:[e.jsx("label",{className:"su-label",children:s("signup.labels.password")}),e.jsxs("div",{className:"su-input-wrap",children:[e.jsx("span",{className:"su-field-icon",children:e.jsx(T,{})}),e.jsx("input",{className:"su-input has-eye",name:"password",type:m?"text":"password",placeholder:"••••••••",value:a.password,onChange:c}),e.jsx("button",{type:"button",className:"su-eye",onClick:()=>U(!m),tabIndex:-1,children:m?e.jsx(L,{size:14}):e.jsx(E,{size:14})})]})]}),e.jsxs("div",{className:"su-field",children:[e.jsx("label",{className:"su-label",children:s("signup.labels.confirmPassword")}),e.jsxs("div",{className:"su-input-wrap",children:[e.jsx("span",{className:"su-field-icon",children:e.jsx(T,{})}),e.jsx("input",{className:"su-input has-eye",name:"confirmPassword",type:x?"text":"password",placeholder:"••••••••",value:a.confirmPassword,onChange:c}),e.jsx("button",{type:"button",className:"su-eye",onClick:()=>W(!x),tabIndex:-1,children:x?e.jsx(L,{size:14}):e.jsx(E,{size:14})})]})]})]}),e.jsx("p",{className:"su-pw-hint",children:s("signup.pwHint")}),e.jsx("div",{className:"su-captcha-wrap",ref:w}),e.jsxs("button",{className:"su-btn",type:"submit",disabled:f||!b,children:[f&&e.jsx("span",{className:"su-spinner"}),s(f?"signup.submitting":"signup.submitBtn")]})]}),e.jsxs("div",{className:"su-form-footer",children:[s("signup.footerHaveAccount")," ",e.jsx(y,{to:"/login",children:s("signup.footerSignIn")})]})]})})]})]})}export{ne as default};
