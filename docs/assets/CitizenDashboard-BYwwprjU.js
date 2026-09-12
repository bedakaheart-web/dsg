import{ao as ge,aq as be,am as i,ak as e,an as k,ar as Be,a as Ie,v as he,a1 as fe,N as Re,r as ve,x as Le,Q as Ae,Z as $e,k as me,Y as ze,A as _e,w as xe,ae as ce,a2 as Pe,K as We}from"./index-CvhaT9ii.js";import{p as ie}from"./pagesbackground-CfzHpFCG.js";import Me from"./CitizenSafetyTips-B0qBmbYJ.js";import Ue from"./CitizenAlertsPage-cZhi7lCc.js";import Ge from"./CitizenMap-B9STvB2p.js";import"./safetytips-0SCFMuiK.js";import"./mapbg-D_jxMMl9.js";const de=[{value:"fire",label:"Fire Incident",icon:"🔥",accent:"#FF6B6B",rgb:"255,107,107"},{value:"accident",label:"Road Accident",icon:"🚗",accent:"#FFD166",rgb:"255,209,102"},{value:"flood",label:"Flood",icon:"🌊",accent:"#7B9EFF",rgb:"123,158,255"},{value:"crime",label:"Crime",icon:"🚨",accent:"#FF9F43",rgb:"255,159,67"},{value:"medical",label:"Medical Emergency",icon:"🏥",accent:"#2ECC8F",rgb:"46,204,143"},{value:"other",label:"Other",icon:"⚠️",accent:"#8fa3be",rgb:"143,163,190"}],He=[{label:"BFP",number:"422-2022",icon:"🔥",color:"#FF6B6B"},{label:"CDRRMO",number:"422-3008",icon:"🌀",color:"#FFD166"},{label:"PNP",number:"422-8708",icon:"👮",color:"#7B9EFF"},{label:"PDRRMO",number:"422-3006",icon:"🏥",color:"#2ECC8F"}],ye=["Incident Type","Reporter Info","Location","Description","Evidence","Submit"],je=`
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cr-root {
    min-height: 100vh;
    font-family: 'Instrument Sans', sans-serif;
    color: #eef0f7;
    position: relative;
    overflow-x: hidden;
    background: #080c14;
  }
  .cr-bg {
    position: fixed; inset: 0; z-index: 0;
    background-size: cover; background-position: center; background-repeat: no-repeat;
  }
  .cr-bg::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(8,12,20,.92) 0%, rgba(8,12,20,.80) 50%, rgba(8,12,20,.94) 100%);
  }
  .cr-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
  .cr-glow-a { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(255,107,107,.06) 0%, transparent 70%); top: -180px; left: -80px; }
  .cr-glow-b { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(46,204,143,.05) 0%, transparent 70%); bottom: -140px; right: -60px; }

  .cr-inner {
    position: relative; z-index: 2;
    max-width: 1100px; margin: 0 auto;
    padding: 0 24px 100px;
  }
  .cr-inner--center {
    display: flex; align-items: center; justify-content: center; min-height: 80vh;
  }

  .cr-hero { margin-top: 12px; margin-bottom: 28px; }
  .cr-hero-tag {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: #FF6B6B; margin-bottom: 16px;
  }
  .cr-hero-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #FF6B6B; box-shadow: 0 0 8px #FF6B6B;
    animation: cr-pulse 2s ease infinite;
  }
  @keyframes cr-pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.75);} }
  .cr-hero-heading {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: clamp(30px, 5vw, 58px);
    font-weight: 900; line-height: 1.0;
    letter-spacing: -.035em; color: #eef0f7; margin-bottom: 12px;
  }
  .cr-hero-heading em { font-style: normal; color: #FF6B6B; }
  .cr-hero-sub {
    font-size: 14px; font-weight: 400;
    color: rgba(238,240,247,.35);
    max-width: 480px; line-height: 1.7;
  }

  .cr-banner {
    display: flex; align-items: center; gap: 14px;
    background: rgba(46,204,143,.06);
    border: 1px solid rgba(46,204,143,.18);
    border-radius: 14px; padding: 14px 18px;
    margin-bottom: 24px;
  }
  .cr-banner-icon { font-size: 22px; flex-shrink: 0; }
  .cr-banner-body { flex: 1; }
  .cr-banner-title {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 13px; font-weight: 800; letter-spacing: -.01em;
    color: #2ECC8F; margin-bottom: 3px;
  }
  .cr-banner-text {
    font-size: 12px; font-weight: 400;
    color: rgba(238,240,247,.32); line-height: 1.5;
  }
  .cr-banner-text strong { color: rgba(46,204,143,.72); font-weight: 600; }
  .cr-banner-btn {
    flex-shrink: 0; display: inline-flex; align-items: center;
    font-size: 12px; font-weight: 600;
    color: #2ECC8F; background: rgba(46,204,143,.10);
    border: 1px solid rgba(46,204,143,.22); border-radius: 8px;
    padding: 8px 14px; white-space: nowrap; cursor: pointer;
    transition: background .18s, transform .18s;
  }
  .cr-banner-btn:hover { background: rgba(46,204,143,.18); transform: translateY(-1px); }

  .cr-steps {
    display: flex; align-items: center;
    background: rgba(15,21,33,.82); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,.07); border-radius: 14px;
    padding: 14px 18px; margin-bottom: 28px;
    overflow-x: auto; scrollbar-width: none; flex-wrap: nowrap;
    -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
    mask-image: linear-gradient(to right, black 85%, transparent 100%);
  }
  .cr-steps::-webkit-scrollbar { display: none; }
  .cr-step { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .cr-step-dot {
    width: 24px; height: 24px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,.10); background: rgba(255,255,255,.03);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 600; color: rgba(238,240,247,.22);
    transition: all .3s; flex-shrink: 0;
  }
  .cr-step--done .cr-step-dot   { background: rgba(46,204,143,.15); border-color: #2ECC8F; color: #2ECC8F; }
  .cr-step--active .cr-step-dot { background: rgba(255,107,107,.15); border-color: #FF6B6B; color: #FF6B6B; box-shadow: 0 0 8px rgba(255,107,107,.28); }
  .cr-step-label {
    font-size: 11px; font-weight: 500; color: rgba(238,240,247,.22);
    white-space: nowrap; transition: color .3s;
  }
  .cr-step--done .cr-step-label   { color: rgba(46,204,143,.55); }
  .cr-step--active .cr-step-label { color: rgba(255,107,107,.80); }
  .cr-step-line { width: 18px; height: 1px; background: rgba(255,255,255,.07); margin: 0 6px; flex-shrink: 0; }

  .cr-layout { display: grid; grid-template-columns: 1fr 290px; gap: 22px; align-items: start; }

  .cr-form { display: flex; flex-direction: column; gap: 14px; }
  .cr-card {
    background: rgba(15,21,33,.82); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,.07); border-radius: 18px;
    padding: 22px 20px; display: flex; flex-direction: column; gap: 16px;
    animation: cr-up .5s ease both;
  }
  .cr-card:nth-child(1){animation-delay:.06s;}
  .cr-card:nth-child(2){animation-delay:.10s;}
  .cr-card:nth-child(3){animation-delay:.14s;}
  .cr-card:nth-child(4){animation-delay:.18s;}
  .cr-card:nth-child(5){animation-delay:.22s;}
  @keyframes cr-up { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }

  .cr-card-label {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 14px; font-weight: 800; letter-spacing: -.02em;
    color: #eef0f7; display: flex; align-items: center; gap: 10px;
  }
  .cr-step-badge {
    font-size: 9.5px; font-weight: 700; letter-spacing: .12em;
    color: rgba(238,240,247,.28);
    border: 1px solid rgba(255,255,255,.10);
    border-radius: 4px; padding: 2px 7px;
  }
  .cr-optional { font-size: 11px; font-weight: 400; color: rgba(238,240,247,.22); margin-left: 4px; }

  .cr-type-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
  .cr-type-btn {
    background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
    border-radius: 12px; padding: 13px 10px;
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    cursor: pointer; transition: transform .2s, border-color .2s, background .2s;
  }
  .cr-type-btn:hover { transform: translateY(-2px); border-color: var(--ta); background: var(--td); }
  .cr-type-btn.active { border-color: var(--ta) !important; background: var(--td) !important; transform: translateY(-2px); box-shadow: 0 0 20px rgba(var(--tr),.18); }
  .cr-type-icon { font-size: 20px; }
  .cr-type-label { font-size: 11px; font-weight: 500; color: rgba(238,240,247,.45); text-align: center; line-height: 1.3; }
  .cr-type-confirm {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 600;
    color: var(--ta); background: var(--td);
    border: 1px solid var(--ta); border-radius: 8px; padding: 8px 14px;
    animation: cr-up .28s ease both;
  }

  .cr-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cr-field { display: flex; flex-direction: column; gap: 7px; }
  .cr-label {
    font-size: 10px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
    color: rgba(238,240,247,.28);
  }
  .cr-input {
    background: rgba(8,12,20,.80); border: 1px solid rgba(255,255,255,.08);
    border-radius: 9px; padding: 11px 13px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px; font-weight: 400; color: #eef0f7;
    outline: none; width: 100%; transition: border-color .18s, background .18s;
    caret-color: #2ECC8F;
  }
  .cr-input::placeholder { color: rgba(238,240,247,.20); }
  .cr-input:focus { border-color: rgba(46,204,143,.40); background: rgba(46,204,143,.03); box-shadow: 0 0 12px rgba(46,204,143,.10); }
  .cr-input--readonly:focus { border-color: rgba(255,255,255,.10); background: rgba(8,12,20,.80); box-shadow: none; }
  .cr-textarea {
    background: rgba(8,12,20,.80); border: 1px solid rgba(255,255,255,.08);
    border-radius: 9px; padding: 11px 13px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px; font-weight: 400; color: #eef0f7;
    outline: none; width: 100%; resize: vertical; line-height: 1.65;
    transition: border-color .18s; caret-color: #2ECC8F;
  }
  .cr-textarea::placeholder { color: rgba(238,240,247,.20); }
  .cr-textarea:focus { border-color: rgba(46,204,143,.40); background: rgba(46,204,143,.03); box-shadow: 0 0 12px rgba(46,204,143,.10); }

  .cr-loc-row { display: flex; align-items: stretch; gap: 8px; }
  .cr-loc-wrap { position: relative; flex: 1; min-width: 0; display: flex; align-items: center; }
  .cr-loc-dot {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(238,240,247,.18); transition: background .3s;
    z-index: 1; pointer-events: none; flex-shrink: 0;
  }
  .cr-loc-dot[data-status="loading"] { background: #FFD166; animation: cr-pulse 1.2s ease infinite; }
  .cr-loc-dot[data-status="ok"]      { background: #2ECC8F; }
  .cr-loc-dot[data-status="error"]   { background: #FF6B6B; }
  .cr-input--loc { padding-left: 30px; width: 100%; }
  .cr-gps-btn {
    flex-shrink: 0; background: rgba(46,204,143,.08);
    border: 1px solid rgba(46,204,143,.18); border-radius: 9px;
    padding: 9px 13px; font-size: 12px; font-weight: 600;
    color: #2ECC8F; cursor: pointer; white-space: nowrap;
    transition: background .18s, border-color .18s;
    min-height: 44px; display: flex; align-items: center;
  }
  .cr-gps-btn:hover { background: rgba(46,204,143,.15); border-color: rgba(46,204,143,.35); }
  .cr-coords-badge {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
    border-radius: 8px; padding: 7px 12px;
  }
  .cr-coords-text { font-size: 11px; color: rgba(238,240,247,.28); font-variant-numeric: tabular-nums; flex: 1; }
  .cr-maps-link {
    font-size: 11px; font-weight: 600; color: #2ECC8F;
    text-decoration: none; white-space: nowrap; transition: opacity .18s;
  }
  .cr-maps-link:hover { opacity: .7; }
  .cr-gps-acquiring {
    display: flex; align-items: center; gap: 9px;
    font-size: 12px; color: rgba(255,209,102,.60); line-height: 1.5;
  }
  .cr-gps-pulse {
    width: 9px; height: 9px; border-radius: 50%; background: #FFD166; flex-shrink: 0;
    animation: cr-pulse 1.1s ease infinite;
  }
  .cr-acc-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .cr-acc-badge {
    font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px;
  }
  .acc-great { background: rgba(46,204,143,.12);  color: #2ECC8F; border: 1px solid rgba(46,204,143,.25); }
  .acc-ok    { background: rgba(255,209,102,.10); color: #FFD166; border: 1px solid rgba(255,209,102,.22); }
  .acc-poor  { background: rgba(255,107,107,.10); color: #FF6B6B; border: 1px solid rgba(255,107,107,.22); }
  .acc-ip    { background: rgba(123,158,255,.10); color: #7B9EFF; border: 1px solid rgba(123,158,255,.22); }
  .cr-acc-tip { font-size: 11px; color: rgba(255,107,107,.55); }
  .cr-hint { font-size: 12px; color: rgba(238,240,247,.25); line-height: 1.5; }
  .cr-hint--warn { font-size: 11px; color: rgba(255,209,102,.55); }

  .cr-dropzone {
    border: 1px dashed rgba(255,255,255,.12); border-radius: 12px;
    padding: 28px 20px; display: flex; flex-direction: column; align-items: center; gap: 6px;
    cursor: pointer; transition: border-color .2s, background .2s; text-align: center;
  }
  .cr-dropzone:hover { border-color: rgba(46,204,143,.30); background: rgba(46,204,143,.03); }
  .cr-dropzone-icon { font-size: 24px; }
  .cr-dropzone-text { font-size: 13px; font-weight: 400; color: rgba(238,240,247,.40); }
  .cr-dropzone-name { font-size: 13px; font-weight: 600; color: #2ECC8F; }
  .cr-dropzone-hint, .cr-dropzone-change { font-size: 11px; color: rgba(238,240,247,.22); }
  .cr-upload-status { font-size: 12px; font-weight: 500; padding: 8px 12px; border-radius: 8px; }
  .cr-upload--uploading { background: rgba(255,209,102,.08); color: #FFD166; border: 1px solid rgba(255,209,102,.20); }
  .cr-upload--done      { background: rgba(46,204,143,.08);  color: #2ECC8F; border: 1px solid rgba(46,204,143,.20); }
  .cr-upload--error     { background: rgba(255,107,107,.08); color: #FF6B6B; border: 1px solid rgba(255,107,107,.20); }

  .cr-disclaimer {
    background: rgba(255,209,102,.04); border: 1px solid rgba(255,209,102,.12);
    border-radius: 14px; padding: 16px 18px;
    display: flex; flex-direction: column; gap: 12px;
    animation: cr-up .5s ease .24s both;
  }
  .cr-disclaimer-header { display: flex; align-items: center; gap: 8px; }
  .cr-disclaimer-title {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
    color: rgba(255,209,102,.75);
  }
  .cr-disclaimer-summary { font-size: 12px; color: rgba(238,240,247,.28); line-height: 1.55; }
  .cr-check-row { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
  .cr-checkbox-hidden { display: none; }
  .cr-checkbox-box {
    width: 18px; height: 18px; flex-shrink: 0;
    border: 1px solid rgba(255,209,102,.30); border-radius: 5px;
    background: rgba(255,209,102,.05);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #FFD166; margin-top: 1px;
    transition: all .2s;
  }
  .cr-check-text {
    font-size: 12px; font-weight: 400; color: rgba(238,240,247,.28); line-height: 1.65;
  }
  .cr-check-text strong { font-weight: 600; color: rgba(255,209,102,.65); }

  .cr-error {
    background: rgba(255,107,107,.08); border: 1px solid rgba(255,107,107,.22);
    border-radius: 10px; padding: 12px 16px;
    font-size: 13px; color: #FF6B6B; animation: cr-up .28s ease both;
  }
  .cr-skip-btn {
    display: inline-block; margin-top: 8px; padding: 7px 14px;
    background: rgba(255,107,107,.12); border: 1px solid rgba(255,107,107,.28);
    border-radius: 7px; font-size: 12px; font-weight: 600;
    color: #FF6B6B; cursor: pointer; transition: background .18s;
  }
  .cr-skip-btn:hover { background: rgba(255,107,107,.20); }

  .cr-submit {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 15px 24px;
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 14px; font-weight: 900; letter-spacing: .04em; text-transform: uppercase;
    color: #080c14; background: #2ECC8F;
    border: none; border-radius: 12px; cursor: pointer;
    transition: opacity .2s, transform .2s, background .2s;
    animation: cr-up .5s ease .28s both;
  }
  .cr-submit:hover:not(:disabled) { background: #38e09e; transform: translateY(-2px); }
  .cr-submit:active:not(:disabled) { transform: translateY(0); background: #27b885; }
  .cr-submit:disabled { opacity: .28; cursor: not-allowed; background: rgba(255,255,255,.06); color: rgba(238,240,247,.28); }
  .cr-submit-arrow { font-size: 17px; transition: transform .2s; }
  .cr-submit:hover:not(:disabled) .cr-submit-arrow { transform: translateX(4px); }
  .cr-spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(8,12,20,.3); border-top-color: #080c14;
    border-radius: 50%; animation: cr-spin .75s linear infinite;
  }
  @keyframes cr-spin { to { transform: rotate(360deg); } }

  .cr-sidebar { display: flex; flex-direction: column; gap: 12px; position: sticky; top: 72px; animation: cr-up .5s ease .08s both; }
  .cr-sidebar-card {
    background: rgba(15,21,33,.82); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,.07); border-radius: 18px;
    padding: 18px 16px; display: flex; flex-direction: column; gap: 10px;
  }
  .cr-sidebar-card--warn  { background: rgba(255,209,102,.04); border-color: rgba(255,209,102,.12); }
  .cr-sidebar-card--info  { background: rgba(123,158,255,.04); border-color: rgba(123,158,255,.12); }
  .cr-sidebar-card--track { background: rgba(46,204,143,.04);  border-color: rgba(46,204,143,.12);  }
  .cr-sidebar-title {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 12px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase;
    color: #eef0f7;
  }
  .cr-sidebar-text { font-size: 12px; font-weight: 400; color: rgba(238,240,247,.28); line-height: 1.65; }
  .cr-track-btn {
    display: inline-flex; align-items: center;
    font-size: 12px; font-weight: 600;
    color: #2ECC8F; background: rgba(46,204,143,.08);
    border: 1px solid rgba(46,204,143,.18); border-radius: 8px;
    padding: 8px 12px; cursor: pointer; width: fit-content;
    transition: background .18s, border-color .18s;
  }
  .cr-track-btn:hover { background: rgba(46,204,143,.15); border-color: rgba(46,204,143,.32); }

  .cr-hotlines { display: flex; flex-direction: column; gap: 8px; }
  .cr-hotline {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px;
    background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); border-radius: 10px;
    text-decoration: none; transition: background .2s, border-color .2s; min-height: 44px;
  }
  .cr-hotline:hover { background: rgba(255,255,255,.06); border-color: var(--hc); }
  .cr-hotline-icon { font-size: 15px; }
  .cr-hotline-info { display: flex; flex-direction: column; flex: 1; }
  .cr-hotline-label { font-size: 9.5px; font-weight: 600; letter-spacing: .10em; text-transform: uppercase; color: rgba(238,240,247,.28); }
  .cr-hotline-number { font-family: 'Cabinet Grotesk', sans-serif; font-size: 14px; font-weight: 800; color: #eef0f7; }
  .cr-hotline-call { font-size: 11px; font-weight: 600; color: var(--hc); opacity: .70; }

  .cr-success {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    padding: 60px 24px; animation: cr-up .5s ease both;
  }
  .cr-success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(46,204,143,.12); border: 1px solid rgba(46,204,143,.28);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; color: #2ECC8F; margin-bottom: 22px;
  }
  .cr-success-title {
    font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 32px; font-weight: 900; letter-spacing: -.03em; color: #eef0f7; margin-bottom: 12px;
  }
  .cr-success-sub {
    font-size: 14px; font-weight: 400; color: rgba(238,240,247,.35);
    max-width: 460px; line-height: 1.68; margin-bottom: 28px;
  }
  .cr-success-cards {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
    width: 100%; max-width: 780px;
  }
  .cr-success-card {
    background: rgba(15,21,33,.82); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,.07); border-radius: 18px;
    padding: 24px 20px; flex: 1; min-width: 260px; max-width: 360px;
    display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;
    animation: cr-up .5s ease .1s both;
  }
  .cr-success-card--track {
    background: rgba(46,204,143,.04);
    border-color: rgba(46,204,143,.18);
    animation-delay: .18s;
  }
  .cr-success-card-icon { font-size: 30px; }
  .cr-success-card-title { font-family: 'Cabinet Grotesk', sans-serif; font-size: 15px; font-weight: 800; color: #eef0f7; }
  .cr-success-card-text { font-size: 12px; color: rgba(238,240,247,.30); line-height: 1.55; }
  .cr-success-btn {
    margin-top: 4px; display: inline-flex; align-items: center;
    font-size: 13px; font-weight: 600;
    color: #2ECC8F; background: rgba(46,204,143,.08);
    border: 1px solid rgba(46,204,143,.22); border-radius: 9px;
    padding: 10px 18px; cursor: pointer; min-height: 40px;
    transition: background .18s, border-color .18s;
  }
  .cr-success-btn:hover { background: rgba(46,204,143,.15); border-color: rgba(46,204,143,.38); }
  .cr-success-btn--track {
    color: #eef0f7; background: #2ECC8F;
    border-color: #2ECC8F;
  }
  .cr-success-btn--track:hover { background: #38e09e; border-color: #38e09e; color: #060a10; }

  @media (max-width: 860px) {
    .cr-layout { grid-template-columns: 1fr; }
    .cr-sidebar { position: static; }
    .cr-hotlines { flex-direction: row; flex-wrap: wrap; }
    .cr-hotline { flex: 1 1 calc(50% - 4px); }
    .cr-inner { padding: 0 16px 80px; }
    .cr-steps { -webkit-mask-image: none; mask-image: none; }
    .cr-success-cards { flex-direction: column; align-items: center; }
    .cr-banner { flex-direction: column; align-items: flex-start; gap: 12px; }
    .cr-banner-btn { width: 100%; justify-content: center; }
  }
  @media (max-width: 560px) {
    .cr-fields { grid-template-columns: 1fr; }
    .cr-type-grid { grid-template-columns: repeat(2,1fr); }
    .cr-hotline { flex: 1 1 100%; }
  }
  @media (max-width: 480px) {
    .cr-loc-row { flex-direction: column; }
    .cr-gps-btn { width: 100%; justify-content: center; }
    .cr-step-label { width: 0; font-size: 0; overflow: hidden; padding: 0; margin: 0; }
    .cr-step-line { width: 10px; margin: 0 2px; }
    .cr-step-dot { width: 28px; height: 28px; font-size: 11px; }
  }
`;async function Ye(){try{if("permissions"in navigator)return(await navigator.permissions.query({name:"geolocation"})).state}catch{}return"unknown"}async function ke(){try{const a=await(await fetch("https://ipapi.co/json/")).json();if(a?.latitude&&a?.longitude)return{lat:String(a.latitude),lng:String(a.longitude)}}catch{}return null}function Oe(u,a){if(!navigator.geolocation){a();return}let d=null,F=null,r=!1;const p=()=>{r||(r=!0,F!==null&&(navigator.geolocation.clearWatch(F),F=null),d?u(d.coords.latitude.toFixed(6),d.coords.longitude.toFixed(6),d.coords.accuracy):a())},v=setTimeout(p,25e3);F=navigator.geolocation.watchPosition(N=>{(!d||N.coords.accuracy<d.coords.accuracy)&&(d=N),N.coords.accuracy<=15&&(clearTimeout(v),p())},N=>{if(N.code===N.PERMISSION_DENIED){clearTimeout(v),p();return}d&&(clearTimeout(v),p())},{enableHighAccuracy:!0,timeout:3e4,maximumAge:0})}function qe({onBack:u,onViewHistory:a,onViewReport:d}={}){const{language:F,t:r,tList:p}=ge(),v=be(),N=r("report.form.refreshGps","📍 Refresh GPS").replace("📍 ",""),X=o=>r(`report.types.${o}`,de.find(n=>n.value===o)?.label??o??""),D=()=>a?a():v("/citizen/history"),L=o=>d?o?d(o):D():v(o?`/citizen/history/${o}`:"/citizen/history"),[T,s]=i.useState(""),[B,H]=i.useState(null),[h,I]=i.useState("idle"),[W,S]=i.useState(null),[x,V]=i.useState(null),[A,z]=i.useState(!1),[g,R]=i.useState(!1),[Y,m]=i.useState(null),[E,$]=i.useState(null),[O,_]=i.useState(null),[K,M]=i.useState("idle"),[P,Z]=i.useState(null),[ee,U]=i.useState(0),[re,J]=i.useState(!1),[t,c]=i.useState(null),[te,y]=i.useState(""),[j,f]=i.useState(""),[w,q]=i.useState(""),ae=i.useRef(null),ne=de.find(o=>o.value===x);async function le(o,n){try{const G=await(await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${o}&lon=${n}&format=jsonv2&addressdetails=1`,{headers:{"Accept-Language":F==="tl"?"fil":"en"}})).json();if(G?.address){const l=G.address,b=[];l.road&&b.push(l.road),l.neighbourhood&&b.push(l.neighbourhood),l.suburb&&b.push(l.suburb),l.village&&b.push(l.village),l.barangay&&b.push(l.barangay),(l.city||l.town||l.municipality)&&b.push(l.city??l.town??l.municipality),(l.state||l.province)&&b.push(l.state??l.province),l.country&&b.push(l.country);const Q=[...new Set(b)];if(Q.length){H(Q.join(", "));return}}if(G?.display_name){H(G.display_name);return}}catch{}H(`Lat ${o}, Lng ${n}`)}async function ue(){if(I("loading"),H(null),Z(null),S(null),await Ye()==="denied"){const n=await ke();n?(s(`${n.lat}, ${n.lng}`),Z(null),S("ip"),I("ok"),await le(n.lat,n.lng)):I("error");return}Oe(async(n,C,G)=>{s(`${n}, ${C}`),Z(G),S("gps"),I("ok"),await le(n,C)},async()=>{const n=await ke();n?(s(`${n.lat}, ${n.lng}`),Z(null),S("ip"),I("ok"),await le(n.lat,n.lng)):I("error")})}i.useEffect(()=>{ue()},[]);function Fe(o){const n=o.target.files?.[0];n?($(n.name),_(n),M("idle")):($(null),_(null))}async function Se(o){M("uploading");const C=o.name.replace(/[^a-zA-Z0-9._-]/g,"_").split(".").pop()??"bin",l=`evidence/${`${Date.now()}_${Math.random().toString(36).slice(2)}.${C}`}`,{error:b}=await k.storage.from("reports-evidence").upload(l,o,{cacheControl:"3600",upsert:!1,contentType:o.type||"application/octet-stream"});if(b){M("error");let oe=`${r("report.uploadFailed","Upload failed")}: ${b.message}`;return b.message?.includes("Bucket not found")?oe=r("report.form.bucketMissing",'Storage bucket "reports-evidence" not found.'):b.message?.includes("policy")?oe=r("report.form.uploadBlocked","Upload blocked by storage security policy."):b.message?.includes("too large")&&(oe=r("report.form.uploadTooLarge","File is too large.")),{url:null,errorMsg:oe}}const{data:Q}=k.storage.from("reports-evidence").getPublicUrl(l);return M("done"),{url:Q?.publicUrl??null,errorMsg:null}}async function Ee(o){if(o.preventDefault(),!A||!x)return;J(!0),c(null);const{data:{user:n}}=await k.auth.getUser();let C=null;if(O){const{url:b,errorMsg:Q}=await Se(O);if(!b){c(Q??r("report.form.evidenceUploadFailed","Evidence upload failed.")),J(!1);return}C=b}const{data:G,error:l}=await k.from("reports").insert({type:x,description:w.trim()||null,location:T||null,address:B||null,reporter_name:te.trim()||null,reporter_contact:j.trim()||null,status:"pending",user_id:n?.id??null,responder_id:null,evidence_url:C}).select("id").single();if(l){c(r("report.form.submitFailed","Failed to submit report. Please try again.")),J(!1);return}J(!1),m(G?.id??null),R(!0)}i.useEffect(()=>{A&&x?U(5):E?U(4):w.trim()?U(3):U(h==="ok"||h!=="idle"?2:x?1:0)},[x,h,E,A,w]);function De(){if(h==="loading")return r("report.acquiringLocation");if(h==="error")return r("report.locationUnavailable");if(h==="ok"){if(B)return B;if(T)return`${r("report.acquiringLocation").replace(r("report.form.acquiringTrimSuffix","— please wait"),"")} (${T})`}return""}function Te(){R(!1),m(null),V(null),q(""),y(""),f(""),$(null),_(null),z(!1),M("idle")}return g?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:je}),e.jsxs("div",{className:"cr-root",children:[e.jsx("div",{className:"cr-bg",style:{backgroundImage:`url(${ie})`}}),e.jsxs("div",{className:"cr-glow",children:[e.jsx("div",{className:"cr-glow-a"}),e.jsx("div",{className:"cr-glow-b"})]}),e.jsx("div",{className:"cr-inner cr-inner--center",children:e.jsxs("div",{className:"cr-success",children:[e.jsx("div",{className:"cr-success-icon",children:"✓"}),e.jsx("h2",{className:"cr-success-title",children:r("report.success.title")}),e.jsx("p",{className:"cr-success-sub",children:r("report.success.sub")}),e.jsxs("div",{className:"cr-success-cards",children:[e.jsxs("div",{className:"cr-success-card",children:[e.jsx("div",{className:"cr-success-card-icon",children:"📝"}),e.jsx("div",{className:"cr-success-card-title",children:r("report.success.cardTitle")}),e.jsx("p",{className:"cr-success-card-text",children:r("report.success.cardText")}),e.jsx("button",{className:"cr-success-btn",onClick:Te,children:r("report.success.cardBtn")})]}),e.jsxs("div",{className:"cr-success-card cr-success-card--track",children:[e.jsx("div",{className:"cr-success-card-icon",children:"📍"}),e.jsx("div",{className:"cr-success-card-title",children:r("report.trackMyReport")}),e.jsx("p",{className:"cr-success-card-text",children:r("report.sidebar.trackText")}),e.jsx("button",{className:"cr-success-btn cr-success-btn--track",onClick:()=>L(Y),children:r("report.trackIncidentReport")})]})]})]})})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("style",{children:je}),e.jsxs("div",{className:"cr-root",children:[e.jsx("div",{className:"cr-bg",style:{backgroundImage:`url(${ie})`}}),e.jsxs("div",{className:"cr-glow",children:[e.jsx("div",{className:"cr-glow-a"}),e.jsx("div",{className:"cr-glow-b"})]}),e.jsxs("div",{className:"cr-inner",children:[e.jsxs("section",{className:"cr-hero",children:[e.jsxs("div",{className:"cr-hero-tag",children:[e.jsx("span",{className:"cr-hero-dot"}),r("report.reportingLiveIncident")]}),e.jsxs("h1",{className:"cr-hero-heading",children:[r("report.heroTitle")," ",e.jsx("em",{children:r("report.heroAccent")})]}),e.jsx("p",{className:"cr-hero-sub",children:r("report.heroSub")})]}),e.jsxs("div",{className:"cr-banner",children:[e.jsx("div",{className:"cr-banner-icon",children:"✅"}),e.jsxs("div",{className:"cr-banner-body",children:[e.jsx("div",{className:"cr-banner-title",children:r("report.bannerTitle")}),e.jsx("p",{className:"cr-banner-text",children:r("report.bannerText")})]}),e.jsx("button",{className:"cr-banner-btn",onClick:D,children:r("report.myReportsBtn")})]}),e.jsx("div",{className:"cr-steps",children:ye.map((o,n)=>{const C=["incidentType","reporterInfo","location","description","evidence","submit"][n];return e.jsxs("div",{className:`cr-step${n<=ee?" cr-step--done":""}${n===ee?" cr-step--active":""}`,children:[e.jsx("div",{className:"cr-step-dot",children:n<ee?"✓":n+1}),e.jsx("span",{className:"cr-step-label",children:r(`report.steps.${C}`)}),n<ye.length-1&&e.jsx("div",{className:"cr-step-line"})]},o)})}),e.jsxs("div",{className:"cr-layout",children:[e.jsxs("form",{className:"cr-form",onSubmit:Ee,noValidate:!0,children:[e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"01"}),r("report.cardLabels.incidentType")]}),e.jsx("div",{className:"cr-type-grid",children:de.map(o=>e.jsxs("button",{type:"button",className:`cr-type-btn${x===o.value?" active":""}`,style:{"--ta":o.accent,"--td":`${o.accent}18`,"--tr":o.rgb},onClick:()=>V(o.value),children:[e.jsx("span",{className:"cr-type-icon",children:o.icon}),e.jsx("span",{className:"cr-type-label",children:r(`report.types.${o.value}`)})]},o.value))}),x&&e.jsxs("div",{className:"cr-type-confirm",style:{"--ta":ne?.accent,"--td":`${ne?.accent}18`},children:[e.jsx("span",{children:ne?.icon}),e.jsx("span",{children:r("report.selected").replace("{type}",X(x))})]})]}),e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"02"}),r("report.cardLabels.reporterInfo")]}),e.jsxs("div",{className:"cr-fields",children:[e.jsxs("div",{className:"cr-field",children:[e.jsxs("label",{className:"cr-label",children:[r("report.form.fullName")," ",e.jsx("span",{className:"cr-optional",children:r("report.form.optional")})]}),e.jsx("input",{className:"cr-input",type:"text",placeholder:r("report.form.namePlaceholder","e.g. Juan dela Cruz"),value:te,onChange:o=>y(o.target.value)})]}),e.jsxs("div",{className:"cr-field",children:[e.jsxs("label",{className:"cr-label",children:[r("report.form.contactNumber")," ",e.jsx("span",{className:"cr-optional",children:r("report.form.optional")})]}),e.jsx("input",{className:"cr-input",type:"tel",placeholder:r("report.form.contactPlaceholder","+63 9XX XXX XXXX"),value:j,onChange:o=>f(o.target.value)})]})]})]}),e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"03"}),r("report.cardLabels.location")]}),e.jsxs("div",{className:"cr-field",children:[e.jsx("label",{className:"cr-label",children:r("report.form.detectedLocation")}),e.jsxs("div",{className:"cr-loc-row",children:[e.jsxs("div",{className:"cr-loc-wrap",children:[e.jsx("span",{className:"cr-loc-dot","data-status":h}),e.jsx("input",{className:"cr-input cr-input--loc cr-input--readonly",type:"text",readOnly:!0,value:De(),placeholder:r("report.form.gpsWaiting","Waiting for GPS…")})]}),e.jsx("button",{type:"button",className:"cr-gps-btn",onClick:ue,children:r("report.form.refreshGps")})]}),h==="ok"&&T&&e.jsxs("div",{className:"cr-coords-badge",children:[e.jsxs("span",{className:"cr-coords-text",children:["🌐 ",T]}),B&&e.jsx("a",{href:`https://www.google.com/maps?q=${T}`,target:"_blank",rel:"noopener noreferrer",className:"cr-maps-link",children:r("report.form.verifyMaps")})]}),h==="loading"&&e.jsxs("div",{className:"cr-gps-acquiring",children:[e.jsx("span",{className:"cr-gps-pulse"}),r("report.searchingGps")]}),h==="error"&&e.jsxs("p",{className:"cr-hint cr-hint--warn",children:["⚠️ ",r("report.locationUnavailable")," ",r("report.form.allowLocationAccess","Allow location access and tap")," ",e.jsx("strong",{children:N}),"."]}),h==="ok"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"cr-acc-badges",children:[W==="gps"&&P!==null&&e.jsxs("span",{className:`cr-acc-badge ${P<=20?"acc-great":P<=100?"acc-ok":"acc-poor"}`,children:[P<=20?r("report.highAccuracy"):P<=100?r("report.mediumAccuracy"):r("report.lowAccuracy")," ","(±",Math.round(P),"m)"]}),W==="ip"&&e.jsx("span",{className:"cr-acc-badge acc-ip",children:r("report.approximateLocation")}),W==="gps"&&P!==null&&P>100&&e.jsx("span",{className:"cr-acc-tip",children:r("report.moveOutdoors")})]}),e.jsxs("p",{className:"cr-hint cr-hint--warn",children:["⚠️ ",r("report.form.locationLooksWrong","If the location looks wrong, tap {refresh} to try again.").replace("{refresh}",N)]})]})]})]}),e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"04"}),r("report.cardLabels.description")]}),e.jsxs("div",{className:"cr-field",children:[e.jsx("label",{className:"cr-label",children:r("report.detailedDescription")}),e.jsx("textarea",{className:"cr-textarea",rows:5,placeholder:r("report.form.descriptionPlaceholder"),value:w,onChange:o=>q(o.target.value),required:!0})]})]}),e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"05"}),r("report.cardLabels.evidence"),e.jsx("span",{className:"cr-optional",children:r("report.form.optional")})]}),e.jsxs("div",{className:"cr-dropzone",onClick:()=>ae.current?.click(),onDragOver:o=>o.preventDefault(),onDrop:o=>{o.preventDefault();const n=o.dataTransfer.files[0];if(n&&ae.current){const C=new DataTransfer;C.items.add(n),ae.current.files=C.files,$(n.name),_(n),M("idle")}},children:[e.jsx("input",{ref:ae,type:"file",accept:"image/*,video/*",style:{display:"none"},onChange:Fe}),E?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"cr-dropzone-icon",children:"📎"}),e.jsx("span",{className:"cr-dropzone-name",children:E}),e.jsx("span",{className:"cr-dropzone-change",children:r("report.form.clickToChange","Click to change")})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"cr-dropzone-icon",children:"📤"}),e.jsx("span",{className:"cr-dropzone-text",children:r("report.form.uploadHint")}),e.jsx("span",{className:"cr-dropzone-hint",children:r("report.photosAccepted")})]})]}),K==="uploading"&&e.jsx("div",{className:"cr-upload-status cr-upload--uploading",children:r("report.uploadingEvidence")}),K==="done"&&e.jsx("div",{className:"cr-upload-status cr-upload--done",children:r("report.evidenceUploaded")}),K==="error"&&e.jsx("div",{className:"cr-upload-status cr-upload--error",children:r("report.uploadFailed")})]}),e.jsxs("div",{className:"cr-disclaimer",children:[e.jsxs("div",{className:"cr-disclaimer-header",children:[e.jsx("span",{style:{fontSize:16},children:"⚖️"}),e.jsx("span",{className:"cr-disclaimer-title",children:r("report.form.legalTitle")})]}),e.jsx("p",{className:"cr-disclaimer-summary",children:r("report.form.legalSummary")}),e.jsxs("label",{className:"cr-check-row",children:[e.jsx("input",{type:"checkbox",className:"cr-checkbox-hidden",checked:A,onChange:o=>z(o.target.checked),required:!0}),e.jsx("div",{className:"cr-checkbox-box",children:A&&"✓"}),e.jsx("span",{className:"cr-check-text",children:r("report.form.legalCheckText")})]})]}),t&&e.jsxs("div",{className:"cr-error",children:[e.jsxs("div",{children:["⚠️ ",t]}),K==="error"&&e.jsx("button",{type:"button",className:"cr-skip-btn",onClick:()=>{_(null),$(null),M("idle"),c(null)},children:r("report.form.removeEvidence","Remove evidence and submit without it →")})]}),e.jsx("button",{type:"submit",className:"cr-submit",disabled:!A||!x||re,children:re?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"cr-spinner"}),e.jsx("span",{children:r("report.form.submitting")})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:r("report.form.submitBtn")}),e.jsx("span",{className:"cr-submit-arrow",children:"→"})]})})]}),e.jsxs("div",{className:"cr-sidebar",children:[e.jsxs("div",{className:"cr-sidebar-card",children:[e.jsx("div",{className:"cr-sidebar-title",children:r("report.sidebar.hotlinesTitle")}),e.jsx("div",{className:"cr-hotlines",children:He.map(o=>e.jsxs("a",{href:`tel:${o.number}`,className:"cr-hotline",style:{"--hc":o.color},children:[e.jsx("span",{className:"cr-hotline-icon",children:o.icon}),e.jsxs("div",{className:"cr-hotline-info",children:[e.jsx("span",{className:"cr-hotline-label",children:o.label}),e.jsx("span",{className:"cr-hotline-number",children:o.number})]}),e.jsx("span",{className:"cr-hotline-call",children:r("report.call")})]},o.number))})]}),e.jsxs("div",{className:"cr-sidebar-card cr-sidebar-card--warn",children:[e.jsxs("div",{className:"cr-sidebar-title",children:["⚠️ ",r("report.sidebar.warnTitle")]}),e.jsx("p",{className:"cr-sidebar-text",children:r("report.sidebar.warnText")})]}),e.jsxs("div",{className:"cr-sidebar-card cr-sidebar-card--info",children:[e.jsxs("div",{className:"cr-sidebar-title",children:["🛡️ ",r("report.sidebar.safetyTitle")]}),e.jsx("p",{className:"cr-sidebar-text",children:r("report.sidebar.safetyText")})]}),e.jsxs("div",{className:"cr-sidebar-card cr-sidebar-card--track",children:[e.jsxs("div",{className:"cr-sidebar-title",children:["📍 ",r("report.sidebar.trackTitle")]}),e.jsx("p",{className:"cr-sidebar-text",children:r("report.sidebar.trackText")}),e.jsx("button",{className:"cr-track-btn",onClick:D,children:r("report.sidebar.trackBtn")})]})]})]})]})]})]})}function Xe({reportId:u,onBack:a,onViewHistory:d}={}){const{language:F,t:r,tList:p}=ge(),v=F==="tl"?"fil-PH":"en-PH",{id:N}=Be(),X=be(),D=u??N,L=()=>a?a():X("/citizen/dashboard"),T=()=>d?d():X("/citizen/history"),[s,B]=i.useState(null),[H,h]=i.useState(!0);i.useEffect(()=>{if(!D)return;(async()=>{const{data:m,error:E}=await k.from("reports").select("*").eq("id",D).single();!E&&m&&B(m),h(!1)})();const Y=k.channel(`report-detail-${Date.now()}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"reports",filter:`id=eq.${D}`},({new:m})=>B(m)).subscribe();return()=>{k.removeChannel(Y)}},[D]);const I={pending:{label:"Pending",color:"#FFD166",bg:"rgba(255,209,102,0.1)",icon:e.jsx(ve,{size:11})},"in-progress":{label:"In Progress",color:"#7B9EFF",bg:"rgba(123,158,255,0.1)",icon:e.jsx(ze,{size:11})},resolved:{label:"Resolved",color:"#2ECC8F",bg:"rgba(46,204,143,0.1)",icon:e.jsx(me,{size:11})}},W={fire:"#FF6B6B",flood:"#7B9EFF",crime:"#FF9F43",medical:"#2ECC8F",accident:"#FFD166"},S=s?I[s.status]??{label:s.status,color:"#eef0f7",bg:"rgba(255,255,255,.06)",icon:e.jsx(he,{size:11})}:null,x=s&&W[s.type?.toLowerCase()]||"#7B9EFF",V=s?.status==="in-progress"?"inProgress":s?.status,A=s?r(`reportDetail.statusLabels.${V}`,S?.label??s.status):"",z=s?r(`report.types.${s.type?.toLowerCase()}`,s.type):"",g=s?(s.responder_notes??s.action_notes??"").trim():"";return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #080c14; --surface: #0f1521; --surface-2: #161d2e;
          --border: rgba(255,255,255,0.06); --border-2: rgba(255,255,255,0.10);
          --text: #eef0f7; --text-2: rgba(238,240,247,0.55); --text-3: rgba(238,240,247,0.25);
          --green: #2ECC8F; --red: #FF6B6B; --blue: #7B9EFF; --yellow: #FFD166;
          --font-display: 'Cabinet Grotesk', sans-serif;
          --font-body: 'Instrument Sans', sans-serif;
          --radius-sm: 8px; --radius-md: 14px; --radius-lg: 20px;
        }
        body { background: var(--bg); }

        .rd { min-height: 100vh; font-family: var(--font-body); color: var(--text); position: relative; overflow-x: hidden; }
        .rd-bg { position: fixed; inset: 0; z-index: 0; background-image: url('${ie}'); background-size: cover; background-position: center; }
        .rd-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(8,12,20,.92) 0%, rgba(8,12,20,.80) 50%, rgba(8,12,20,.94) 100%); }
        .rd-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
        .rd-glow-1 { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(46,204,143,0.07) 0%, transparent 70%); top: -200px; left: -100px; }
        .rd-glow-2 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(123,158,255,0.06) 0%, transparent 70%); bottom: -150px; right: -50px; }
        .rd-noise { position: fixed; inset: 0; opacity: 0.025; pointer-events: none; z-index: 1; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 200px; }
        .rd-inner { position: relative; z-index: 2; max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }

        .rd-nav { display: flex; align-items: center; justify-content: space-between; padding: 24px 0 0; animation: fadeDown .5s ease both; }
        .rd-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
        .rd-logo-text { font-family: var(--font-display); font-size: 16px; font-weight: 800; letter-spacing: -.01em; color: var(--text); }
        .rd-logo-text span { color: var(--green); }
        .rd-back { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 500; color: var(--text-3); text-decoration: none; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 7px 14px; background: rgba(15,21,33,.82); transition: all .2s; backdrop-filter: blur(16px); }
        .rd-back:hover { color: var(--text); border-color: var(--border-2); background: rgba(15,21,33,.95); }

        .rd-hero { margin-top: 40px; margin-bottom: 28px; animation: fadeUp .6s .05s ease both; }
        .rd-hero-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--green); margin-bottom: 14px; }
        .rd-hero-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); animation: pulse 2.2s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.8);} }
        .rd-hero-heading { font-family: var(--font-display); font-size: clamp(22px,3.5vw,34px); font-weight: 900; line-height: 1.1; letter-spacing: -.03em; color: var(--text); margin-bottom: 6px; }
        .rd-hero-sub { font-size: 13px; color: var(--text-3); }

        .rd-section-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .rd-section-label { font-size: 10.5px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--text-3); white-space: nowrap; }
        .rd-section-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border-2), transparent); }

        .rd-card { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 20px; animation: fadeUp .6s .1s ease both; backdrop-filter: blur(16px); }
        .rd-card-top { padding: 22px 24px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .rd-card-top-left { display: flex; align-items: flex-start; gap: 14px; }
        .rd-card-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; }
        .rd-desc { font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--text); line-height: 1.3; letter-spacing: -.015em; }
        .rd-desc-sub { font-size: 12px; color: var(--text-3); margin-top: 4px; }
        .rd-status { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; border-radius: 20px; padding: 5px 12px; flex-shrink: 0; }
        .rd-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        .rd-meta-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 0; }
        @media(max-width:560px){ .rd-meta-grid { grid-template-columns: 1fr; } }
        .rd-meta-item { padding: 16px 24px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; gap: 12px; transition: background .15s; }
        .rd-meta-item:hover { background: rgba(255,255,255,.015); }
        .rd-meta-item:nth-child(even) { border-right: none; }
        .rd-meta-item:nth-last-child(-n+2) { border-bottom: none; }
        @media(max-width:560px){
          .rd-meta-item { border-right: none; }
          .rd-meta-item:last-child { border-bottom: none; }
          .rd-meta-item:nth-last-child(-n+2) { border-bottom: 1px solid var(--border); }
          .rd-meta-item:last-child { border-bottom: none; }
        }
        .rd-meta-icon { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,.04); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-3); font-size: 12px; flex-shrink: 0; margin-top: 1px; }
        .rd-meta-label { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--text-3); margin-bottom: 4px; }
        .rd-meta-value { font-size: 13px; font-weight: 500; color: var(--text-2); line-height: 1.4; }
        .rd-type-tag { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: capitalize; border-radius: 6px; padding: 3px 9px; display: inline-block; }

        .rd-evidence-card { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 20px; animation: fadeUp .6s .15s ease both; backdrop-filter: blur(16px); }
        .rd-evidence-head { padding: 16px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .rd-evidence-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text); }
        .rd-evidence-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 12px; }
        .rd-evidence-img { width: 100%; max-height: 340px; object-fit: cover; border-radius: 10px; border: 1px solid var(--border); }
        .rd-evidence-link { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--blue); text-decoration: none; padding: 7px 12px; background: rgba(123,158,255,.08); border: 1px solid rgba(123,158,255,.18); border-radius: 7px; width: fit-content; transition: background .18s; }
        .rd-evidence-link:hover { background: rgba(123,158,255,.15); }
        .rd-evidence-empty { padding: 32px 22px; text-align: center; }
        .rd-evidence-empty-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,.03); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--text-3); margin: 0 auto 10px; }
        .rd-evidence-empty-text { font-size: 13px; color: var(--text-3); }

        .rd-note-card { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; animation: fadeUp .6s .2s ease both; backdrop-filter: blur(16px); margin-bottom: 20px; }
        .rd-note-head { padding: 16px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .rd-note-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text); }
        .rd-note-badge { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #2ECC8F; background: rgba(46,204,143,.1); border: 1px solid rgba(46,204,143,.22); border-radius: 20px; padding: 3px 9px; }
        .rd-note-body { padding: 20px 22px; display: flex; gap: 14px; }
        .rd-note-timeline { display: flex; flex-direction: column; align-items: center; gap: 0; flex-shrink: 0; }
        .rd-note-dot { width: 8px; height: 8px; border-radius: 50%; background: #2ECC8F; box-shadow: 0 0 8px rgba(46,204,143,.4); flex-shrink: 0; margin-top: 4px; }
        .rd-note-content { flex: 1; }
        .rd-note-time { font-size: 10.5px; font-weight: 600; letter-spacing: .06em; color: var(--text-3); margin-bottom: 7px; text-transform: uppercase; }
        .rd-note-msg { font-size: 14px; color: var(--text-2); line-height: 1.6; }
        .rd-note-empty { padding: 36px 22px; text-align: center; }
        .rd-note-empty-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,.03); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--text-3); margin: 0 auto 10px; }
        .rd-note-empty-title { font-size: 13px; font-weight: 600; color: var(--text-3); margin-bottom: 4px; }
        .rd-note-empty-sub { font-size: 12px; color: var(--text-3); opacity: .7; }

        .rd-timeline-card { background: rgba(15,21,33,.82); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; animation: fadeUp .6s .25s ease both; backdrop-filter: blur(16px); }
        .rd-timeline-head { padding: 16px 22px; border-bottom: 1px solid var(--border); }
        .rd-timeline-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text); }
        .rd-timeline-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 0; }
        .rd-tl-step { display: flex; gap: 14px; padding-bottom: 20px; position: relative; }
        .rd-tl-step:last-child { padding-bottom: 0; }
        .rd-tl-step:not(:last-child)::before { content: ''; position: absolute; left: 11px; top: 22px; bottom: 0; width: 1px; background: linear-gradient(to bottom, rgba(255,255,255,.08), transparent); }
        .rd-tl-dot { width: 22px; height: 22px; border-radius: 50%; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.04); display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; margin-top: 1px; }
        .rd-tl-dot--done   { background: rgba(46,204,143,.15); border-color: #2ECC8F; color: #2ECC8F; }
        .rd-tl-dot--active { background: rgba(123,158,255,.15); border-color: #7B9EFF; color: #7B9EFF; }
        .rd-tl-label { font-size: 13px; font-weight: 600; color: var(--text-2); margin-bottom: 2px; }
        .rd-tl-sub { font-size: 11.5px; color: var(--text-3); }

        .rd-loading { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 100vh; color: var(--text-3); font-size: 13px; position: relative; z-index: 2; }
        .rd-spin { width: 16px; height: 16px; border: 2px solid rgba(46,204,143,.2); border-top-color: var(--green); border-radius: 50%; animation: spin .75s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px); }to{opacity:1;transform:translateY(0);} }
      `}),e.jsxs("div",{className:"rd",children:[e.jsx("div",{className:"rd-bg"}),e.jsxs("div",{className:"rd-glow",children:[e.jsx("div",{className:"rd-glow-1"}),e.jsx("div",{className:"rd-glow-2"})]}),e.jsx("div",{className:"rd-noise"}),H||!s?e.jsxs("div",{className:"rd-loading",children:[e.jsx("div",{className:"rd-spin"}),r("history.loadingReports")]}):e.jsxs("div",{className:"rd-inner",children:[e.jsxs("nav",{className:"rd-nav",children:[e.jsx("button",{onClick:L,className:"rd-logo",style:{background:"none",border:"none",cursor:"pointer"},children:e.jsxs("span",{className:"rd-logo-text",children:["CITI",e.jsx("span",{children:"ZEN"})]})}),e.jsxs("button",{onClick:T,className:"rd-back",style:{background:"rgba(15,21,33,.82)",cursor:"pointer"},children:[e.jsx(Ie,{size:10})," ",r("reportDetail.backToHistory")]})]}),e.jsxs("div",{className:"rd-hero",children:[e.jsxs("div",{className:"rd-hero-tag",children:[e.jsx("span",{className:"rd-hero-tag-dot"}),r("reportDetail.reportDetail")]}),e.jsx("h1",{className:"rd-hero-heading",children:r("reportDetail.incidentReport")}),e.jsxs("p",{className:"rd-hero-sub",children:[r("reportDetail.submitted")," ",new Date(s.created_at).toLocaleDateString(v,{month:"long",day:"numeric",year:"numeric"})]})]}),e.jsxs("div",{className:"rd-section-head",children:[e.jsx("span",{className:"rd-section-label",children:r("reportDetail.reportInfo")}),e.jsx("span",{className:"rd-section-line"})]}),e.jsxs("div",{className:"rd-card",children:[e.jsxs("div",{className:"rd-card-top",children:[e.jsxs("div",{className:"rd-card-top-left",children:[e.jsx("div",{className:"rd-card-icon",style:{background:`${x}12`,border:`1px solid ${x}30`,color:x},children:e.jsx(he,{})}),e.jsxs("div",{children:[e.jsx("div",{className:"rd-desc",children:s.description||r("reportDetail.noDescription")}),e.jsxs("div",{className:"rd-desc-sub",children:["ID: ",s.id]})]})]}),S&&e.jsxs("span",{className:"rd-status",style:{color:S.color,background:S.bg},children:[e.jsx("span",{className:"rd-status-dot"}),A]})]}),e.jsxs("div",{className:"rd-meta-grid",children:[e.jsxs("div",{className:"rd-meta-item",children:[e.jsx("div",{className:"rd-meta-icon",children:e.jsx(fe,{size:11})}),e.jsxs("div",{children:[e.jsx("div",{className:"rd-meta-label",children:r("reportDetail.type")}),e.jsx("div",{className:"rd-meta-value",children:s.type?e.jsx("span",{className:"rd-type-tag",style:{color:x,background:`${x}10`,border:`1px solid ${x}25`},children:z}):"—"})]})]}),e.jsxs("div",{className:"rd-meta-item",children:[e.jsx("div",{className:"rd-meta-icon",children:e.jsx(Re,{size:11})}),e.jsxs("div",{children:[e.jsx("div",{className:"rd-meta-label",children:r("reportDetail.location")}),e.jsx("div",{className:"rd-meta-value",children:s.address||s.location||r("reportDetail.notSpecified")})]})]}),e.jsxs("div",{className:"rd-meta-item",children:[e.jsx("div",{className:"rd-meta-icon",children:e.jsx(ve,{size:11})}),e.jsxs("div",{children:[e.jsx("div",{className:"rd-meta-label",children:r("reportDetail.submitted")}),e.jsx("div",{className:"rd-meta-value",children:new Date(s.created_at).toLocaleString(v,{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})})]})]}),e.jsxs("div",{className:"rd-meta-item",children:[e.jsx("div",{className:"rd-meta-icon",children:e.jsx(fe,{size:11})}),e.jsxs("div",{children:[e.jsx("div",{className:"rd-meta-label",children:r("reportDetail.reporter")}),e.jsx("div",{className:"rd-meta-value",children:s.reporter_name||r("reportDetail.anonymous")})]})]})]})]}),e.jsxs("div",{className:"rd-section-head",style:{marginTop:28},children:[e.jsx("span",{className:"rd-section-label",children:r("reportDetail.reportProgress")}),e.jsx("span",{className:"rd-section-line"})]}),e.jsxs("div",{className:"rd-timeline-card",children:[e.jsx("div",{className:"rd-timeline-head",children:e.jsx("div",{className:"rd-timeline-title",children:r("reportDetail.statusTimeline")})}),e.jsx("div",{className:"rd-timeline-body",children:[{key:"pending",label:r("reportDetail.submittedLabel"),sub:r("reportDetail.submittedSub")},{key:"in-progress",label:r("reportDetail.inProgressLabel"),sub:r("reportDetail.inProgressSub")},{key:"resolved",label:r("reportDetail.resolvedLabel"),sub:r("reportDetail.resolvedSub")}].map((R,Y)=>{const m=["pending","in-progress","resolved"],E=m.indexOf(s.status),$=m.indexOf(R.key),O=$<E,_=$===E;return e.jsxs("div",{className:"rd-tl-step",children:[e.jsx("div",{className:`rd-tl-dot ${O?"rd-tl-dot--done":_?"rd-tl-dot--active":""}`,children:O?"✓":Y+1}),e.jsxs("div",{children:[e.jsx("div",{className:"rd-tl-label",style:{color:_?"#eef0f7":O?"rgba(46,204,143,.7)":"rgba(238,240,247,.25)"},children:R.label}),e.jsx("div",{className:"rd-tl-sub",children:R.sub})]})]},R.key)})})]}),e.jsxs("div",{className:"rd-section-head",style:{marginTop:28},children:[e.jsx("span",{className:"rd-section-label",children:r("reportDetail.evidence")}),e.jsx("span",{className:"rd-section-line"})]}),e.jsxs("div",{className:"rd-evidence-card",children:[e.jsx("div",{className:"rd-evidence-head",children:e.jsx("span",{className:"rd-evidence-title",children:r("reportDetail.uploadedEvidence")})}),s.evidence_url?e.jsxs("div",{className:"rd-evidence-body",children:[/\.(jpe?g|png|gif|webp)$/i.test(s.evidence_url)?e.jsx("img",{src:s.evidence_url,alt:r("reportDetail.evidenceAlt","Evidence"),className:"rd-evidence-img"}):null,e.jsxs("a",{href:s.evidence_url,target:"_blank",rel:"noopener noreferrer",className:"rd-evidence-link",children:[e.jsx(Le,{size:10})," ",r("reportDetail.viewDownloadEvidence")]})]}):e.jsxs("div",{className:"rd-evidence-empty",children:[e.jsx("div",{className:"rd-evidence-empty-icon",children:e.jsx(Ae,{})}),e.jsx("p",{className:"rd-evidence-empty-text",children:r("reportDetail.noEvidence")})]})]}),e.jsxs("div",{className:"rd-section-head",style:{marginTop:28},children:[e.jsx("span",{className:"rd-section-label",children:r("reportDetail.responderUpdates")}),e.jsx("span",{className:"rd-section-line"})]}),e.jsxs("div",{className:"rd-note-card",children:[e.jsxs("div",{className:"rd-note-head",children:[e.jsx("span",{className:"rd-note-title",children:r("reportDetail.responderNotes")}),g&&e.jsx("span",{className:"rd-note-badge",children:r("reportDetail.hasUpdate")})]}),g?e.jsxs("div",{className:"rd-note-body",children:[e.jsx("div",{className:"rd-note-timeline",children:e.jsx("div",{className:"rd-note-dot"})}),e.jsxs("div",{className:"rd-note-content",children:[e.jsx("div",{className:"rd-note-time",children:s.updated_at?new Date(s.updated_at).toLocaleString(v,{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}):r("reportDetail.responderUpdates","Responder update")}),e.jsx("div",{className:"rd-note-msg",children:g})]})]}):e.jsxs("div",{className:"rd-note-empty",children:[e.jsx("div",{className:"rd-note-empty-icon",children:e.jsx($e,{})}),e.jsx("div",{className:"rd-note-empty-title",children:r("reportDetail.noUpdatesYet")}),e.jsx("p",{className:"rd-note-empty-sub",children:r("reportDetail.responderUpdateSub")})]})]})]})]})]})}const Ce="cd_alerts_last_read",we={fire:{icon:"🔥",color:"#FF6B6B"},accident:{icon:"🚗",color:"#F5C842"},flood:{icon:"🌊",color:"#5B8DEF"},crime:{icon:"🚨",color:"#EF5B5B"},medical:{icon:"🏥",color:"#2ECC8F"},other:{icon:"⚠️",color:"rgba(238,240,247,0.4)"}},se={pending:{label:"PENDING",color:"#EF5B5B",bg:"rgba(239,91,91,0.08)",border:"rgba(239,91,91,0.25)"},"in-progress":{label:"IN PROGRESS",color:"#F5C842",bg:"rgba(245,200,66,0.08)",border:"rgba(245,200,66,0.25)"},resolved:{label:"RESOLVED",color:"#2ECC8F",bg:"rgba(46,204,143,0.08)",border:"rgba(46,204,143,0.25)"}},pe={danger:{color:"#EF5B5B",bg:"rgba(239,91,91,0.08)",border:"rgba(239,91,91,0.2)",label:"Danger",icon:e.jsx(xe,{})},warning:{color:"#F5C842",bg:"rgba(245,200,66,0.08)",border:"rgba(245,200,66,0.2)",label:"Warning",icon:e.jsx(xe,{})},info:{color:"#5B8DEF",bg:"rgba(91,141,239,0.08)",border:"rgba(91,141,239,0.2)",label:"Info",icon:e.jsx(We,{})},success:{color:"#2ECC8F",bg:"rgba(46,204,143,0.08)",border:"rgba(46,204,143,0.2)",label:"All Clear",icon:e.jsx(me,{})}};function Ve(u){try{const a=localStorage.getItem(Ce);return a?u.filter(d=>new Date(d.created_at)>new Date(a)).length:u.length}catch{return 0}}function Ne(){try{localStorage.setItem(Ce,new Date().toISOString())}catch{}}function Ke(){const[u,a]=i.useState("");return i.useEffect(()=>{const d=()=>{const r=new Date,p=v=>String(v).padStart(2,"0");a(`${p(r.getHours())}:${p(r.getMinutes())}:${p(r.getSeconds())} PHT`)};d();const F=setInterval(d,1e3);return()=>clearInterval(F)},[]),u}function Ze(){const[u,a]=i.useState(window.innerWidth<768);return i.useEffect(()=>{const d=()=>a(window.innerWidth<768);return window.addEventListener("resize",d),()=>window.removeEventListener("resize",d)},[]),u}function sr(){const{language:u,t:a,tList:d}=ge(),F=u==="tl"?"fil-PH":"en-PH",r=be();Ke();const p=Ze(),v=t=>a(`status.${t==="in-progress"?"inProgress":t}`,se[t]?.label??t),N=t=>a(`alerts.levels.${t}`,pe[t]?.label??t),X=t=>a(`report.types.${t?.toLowerCase()}`,t??""),D=t=>{const c=Math.floor((Date.now()-new Date(t).getTime())/1e3);return c<60?a("timeAgo.second","{n}s ago").replace("{n}",String(c)):c<3600?a("timeAgo.minute","{n}m ago").replace("{n}",String(Math.floor(c/60))):c<86400?a("timeAgo.hour","{n}h ago").replace("{n}",String(Math.floor(c/3600))):new Date(t).toLocaleDateString(F,{month:"short",day:"numeric"})},[L,T]=i.useState([]),[s,B]=i.useState([]),[H,h]=i.useState(new Set),[I,W]=i.useState(0),[S,x]=i.useState(null),[V,A]=i.useState(!0),[z,g]=i.useState(null),[R,Y]=i.useState(null);i.useEffect(()=>{W(Ve(s))},[s]),i.useEffect(()=>{k.auth.getUser().then(({data:y})=>x(y.user)),(async()=>{try{const{data:{user:y}}=await k.auth.getUser();if(!y)return;const{data:j}=await k.from("reports").select("id, description, type, status, created_at").eq("user_id",y.id).order("created_at",{ascending:!1});T(j||[]);const{data:f}=await k.from("alerts").select("*").order("created_at",{ascending:!1}).limit(5);B(f??[])}finally{A(!1)}})();const c=k.channel("cd-reports-live").on("postgres_changes",{event:"*",schema:"public",table:"reports"},({eventType:y,new:j,old:f})=>{T(w=>y==="INSERT"?[j,...w]:y==="UPDATE"?w.map(q=>q.id===j.id?j:q):y==="DELETE"?w.filter(q=>q.id!==f.id):w)}).subscribe(),te=k.channel("cd-alerts-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"alerts"},y=>{const j=y.new;B(f=>f.some(w=>w.id===j.id)?f:[j,...f].slice(0,5)),h(f=>new Set(f).add(j.id)),setTimeout(()=>{h(f=>{const w=new Set(f);return w.delete(j.id),w})},5e3)}).on("postgres_changes",{event:"DELETE",schema:"public",table:"alerts"},y=>{B(j=>j.filter(f=>f.id!==y.old.id))}).subscribe();return()=>{k.removeChannel(c),k.removeChannel(te)}},[]),i.useEffect(()=>{const t=c=>{c.key==="Escape"&&g(null)};return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[]),i.useEffect(()=>(document.body.style.overflow=z?"hidden":"",()=>{document.body.style.overflow=""}),[z]);const m={total:L.length,pending:L.filter(t=>t.status==="pending").length,inProgress:L.filter(t=>t.status==="in-progress").length,resolved:L.filter(t=>t.status==="resolved").length},E=a("dashboard.pendingReports","You have {count} report(s) awaiting review.").split("{count}"),$=`${E[0]??""}<strong>${m.pending}</strong>${E[1]??""}`,_=(S?.user_metadata?.full_name||S?.email?.split("@")[0]||a("history.citizen","Citizen")).split(" ")[0],K=[{label:a("dashboard.statTotalFiled"),value:m.total,accent:"#4A90E2",icon:e.jsx(_e,{})},{label:a("dashboard.statPending"),value:m.pending,accent:"#EF5B5B",icon:e.jsx(xe,{})},{label:a("dashboard.statInProgress"),value:m.inProgress,accent:"#F5C842",icon:e.jsx(ze,{})},{label:a("dashboard.statResolved"),value:m.resolved,accent:"#2ECC8F",icon:e.jsx(me,{})}],M=[{label:a("dashboard.quickActionFileReport"),icon:"📝",modal:"report"},{label:a("dashboard.quickActionSafetyMap"),icon:"🗺️",modal:"map"},{label:a("dashboard.quickActionMyReports"),icon:"📂",to:"/citizen/history"},{label:a("dashboard.quickActionSafetyTips"),icon:"💡",modal:"safetytips"}],P=()=>{Ne(),W(0),g("alerts")},Z=()=>{g("safetytips")},ee=()=>{Ne(),W(0),g("alerts")},U=()=>{g("report")},re=t=>{Y(t),g("reportdetail")},J=()=>{g("map")};return e.jsxs("div",{style:{minHeight:"100vh",backgroundImage:`linear-gradient(rgba(8,12,20,0.93), rgba(8,12,20,0.93)), url(${ie})`,backgroundSize:"cover",backgroundPosition:"center",backgroundAttachment:"fixed",backgroundRepeat:"no-repeat",backgroundColor:"#080c14",color:"#eef0f7",fontFamily:"'Instrument Sans', sans-serif"},children:[e.jsxs("div",{style:{padding:p?"16px 16px 90px":"24px",minHeight:"100vh"},children:[e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsx("div",{style:{fontSize:"10px",color:"#2ECC8F",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:"6px",fontWeight:"700"},children:a("dashboard.portalLabel")}),e.jsx("h1",{style:{fontSize:p?"28px":"38px",fontWeight:"900",marginBottom:"4px",color:"#eef0f7"},children:a("dashboard.welcomeTitle").replace("{name}",_)}),e.jsx("p",{style:{fontSize:"10px",color:"rgba(238,240,247,0.28)",letterSpacing:"0.12em"},children:a("dashboard.dumagueteCity")})]}),m.pending>0&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",backgroundColor:"rgba(245,200,66,0.06)",border:"1px solid rgba(245,200,66,0.2)",borderLeft:"3px solid #F5C842",borderRadius:"8px",padding:"12px 14px",marginBottom:"20px",flexWrap:"wrap"},children:[e.jsx("span",{style:{color:"#F5C842"},children:"⚠️"}),e.jsx("span",{style:{fontSize:"13px",color:"rgba(238,240,247,0.55)",flex:1,minWidth:"120px"},dangerouslySetInnerHTML:{__html:$}}),e.jsx(ce,{to:"/citizen/history",style:{fontSize:"11px",fontWeight:"700",color:"#F5C842",textDecoration:"none",border:"1px solid rgba(245,200,66,0.3)",borderRadius:"6px",padding:"5px 12px"},children:a("dashboard.view")})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:p?"1fr 1fr":"repeat(4, 1fr)",gap:"10px",marginBottom:"16px"},children:K.map(t=>e.jsxs("div",{style:{backgroundColor:"rgba(15,21,33,0.82)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"12px",padding:p?"14px":"20px",borderTop:`2px solid ${t.accent}`},children:[e.jsx("div",{style:{fontSize:"14px",marginBottom:"8px"},children:t.icon}),e.jsx("div",{style:{fontSize:p?"26px":"32px",fontWeight:"900",marginBottom:"4px",color:t.accent},children:V?"—":t.value}),e.jsx("div",{style:{fontSize:"9px",color:"rgba(238,240,247,0.28)",letterSpacing:"0.10em",textTransform:"uppercase",fontWeight:"600"},children:t.label})]},t.label))}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"20px"},children:M.map(t=>"modal"in t&&t.modal?e.jsxs("button",{onClick:()=>g(t.modal),style:{display:"flex",alignItems:"center",gap:"8px",padding:"12px",backgroundColor:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"10px",fontSize:"12px",fontWeight:"600",color:"rgba(238,240,247,0.65)",cursor:"pointer",fontFamily:"inherit",textAlign:"left"},children:[e.jsx("span",{style:{fontSize:"18px"},children:t.icon}),t.label]},t.label):e.jsxs(ce,{to:t.to,style:{display:"flex",alignItems:"center",gap:"8px",padding:"12px",backgroundColor:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"10px",fontSize:"12px",fontWeight:"600",color:"rgba(238,240,247,0.65)",textDecoration:"none"},children:[e.jsx("span",{style:{fontSize:"18px"},children:t.icon}),t.label]},t.to))}),e.jsxs("div",{style:{backgroundColor:"rgba(15,21,33,0.82)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"14px",padding:"16px",marginBottom:"16px"},children:[e.jsx("h2",{style:{fontSize:"10px",color:"rgba(238,240,247,0.28)",letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:"700",marginBottom:"14px"},children:a("dashboard.recentReportsTitle")}),L.length===0?e.jsxs("div",{style:{textAlign:"center",padding:"32px 16px",fontSize:"11px",color:"rgba(238,240,247,0.28)"},children:[e.jsx("p",{children:a("dashboard.noReportsYet")}),e.jsx("button",{onClick:U,style:{marginTop:"10px",fontSize:"11px",fontWeight:"700",color:"#2ECC8F",background:"none",border:"none",cursor:"pointer",display:"inline-block",fontFamily:"inherit"},children:a("dashboard.fileAReport")})]}):L.slice(0,6).map(t=>e.jsx("div",{style:{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",cursor:"pointer"},onClick:()=>re(t.id),children:e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"10px"},children:[e.jsx("div",{style:{width:"34px",height:"34px",minWidth:"34px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",backgroundColor:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"},children:we[t.type?.toLowerCase()]?.icon||"⚠️"}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:"13px",fontWeight:"700",textTransform:"capitalize",marginBottom:"2px",color:we[t.type?.toLowerCase()]?.color||"rgba(238,240,247,0.4)"},children:X(t.type)}),e.jsx("div",{style:{fontSize:"11px",color:"rgba(238,240,247,0.45)",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",marginBottom:"5px"},children:t.description||a("reportDetail.noDescription","No description")}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"},children:[e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:"9px",padding:"2px 7px",borderRadius:"5px",border:"1px solid",backgroundColor:se[t.status]?.bg,color:se[t.status]?.color,borderColor:se[t.status]?.border,fontWeight:"700"},children:["● ",v(t.status)]}),e.jsxs("span",{style:{fontSize:"10px",color:"rgba(238,240,247,0.28)",fontFamily:"monospace"},children:["🕐 ",D(t.created_at)]})]})]})]})},t.id))]}),e.jsxs("div",{style:{backgroundColor:"rgba(15,21,33,0.82)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"14px",padding:"16px"},children:[e.jsx("h2",{style:{fontSize:"10px",color:"rgba(238,240,247,0.28)",letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:"700",marginBottom:"14px"},children:a("dashboard.alertsTitle")}),s.length===0?e.jsxs("div",{style:{textAlign:"center",padding:"32px 16px",fontSize:"11px",color:"rgba(238,240,247,0.28)"},children:[e.jsx("p",{children:a("dashboard.noActiveAlerts")}),e.jsx("p",{style:{fontSize:"10px",marginTop:"8px"},children:a("dashboard.updatesAutomatically")})]}):e.jsxs(e.Fragment,{children:[s.map(t=>{const c=pe[t.type]??pe.info;return e.jsx("div",{style:{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"},children:e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"10px"},children:[e.jsx("div",{style:{width:"34px",height:"34px",minWidth:"34px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",backgroundColor:c.bg,color:c.color,border:`1px solid ${c.border}`},children:c.icon}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontSize:"13px",fontWeight:"700",marginBottom:"2px",color:c.color},children:t.title||a("alerts.alert")}),e.jsx("div",{style:{fontSize:"11px",color:"rgba(238,240,247,0.45)",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",marginBottom:"5px"},children:t.message}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"},children:[e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:"9px",padding:"2px 7px",borderRadius:"5px",border:`1px solid ${c.border}`,backgroundColor:c.bg,color:c.color,fontWeight:"700"},children:["● ",N(t.type)]}),e.jsxs("span",{style:{fontSize:"10px",color:"rgba(238,240,247,0.28)",fontFamily:"monospace",marginLeft:"auto"},children:["🕐 ",D(t.created_at)]})]})]})]})},t.id)}),e.jsx("button",{onClick:P,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",marginTop:"12px",fontSize:"11px",fontWeight:"700",color:"#F5C842",border:"1px solid rgba(245,200,66,0.25)",borderRadius:"8px",padding:"8px 16px",backgroundColor:"rgba(245,200,66,0.04)",width:"100%",cursor:"pointer"},children:a("dashboard.viewAllAlerts")})]})]})]}),p&&e.jsxs("nav",{style:{position:"fixed",bottom:0,left:0,right:0,height:"64px",backgroundColor:"rgba(8,12,20,0.97)",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-around",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"},children:[e.jsxs("button",{onClick:U,style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",background:"none",border:"none",flex:1,fontFamily:"inherit"},children:[e.jsx("span",{style:{fontSize:"20px",lineHeight:1},children:"📝"}),e.jsx("span",{style:{fontSize:"9px",color:"rgba(238,240,247,0.4)",fontWeight:"600",letterSpacing:"0.04em"},children:a("dashboard.bottomNavReport")})]}),e.jsxs(ce,{to:"/citizen/history",style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",textDecoration:"none",flex:1},children:[e.jsx("span",{style:{fontSize:"20px",lineHeight:1},children:"📂"}),e.jsx("span",{style:{fontSize:"9px",color:"rgba(238,240,247,0.4)",fontWeight:"600",letterSpacing:"0.04em"},children:a("dashboard.bottomNavHistory")})]}),e.jsxs("button",{onClick:ee,style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",background:"none",border:"none",position:"relative",flex:1,fontFamily:"inherit"},children:[e.jsx("span",{style:{fontSize:"20px",lineHeight:1},children:"🔔"}),e.jsx("span",{style:{fontSize:"9px",color:"rgba(238,240,247,0.4)",fontWeight:"600",letterSpacing:"0.04em"},children:a("nav.alerts")}),I>0&&e.jsx("span",{style:{position:"absolute",top:"-2px",right:"calc(50% - 18px)",width:"15px",height:"15px",backgroundColor:"#EF5B5B",borderRadius:"50%",fontSize:"8px",fontWeight:"700",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"},children:I})]}),e.jsxs("button",{onClick:J,style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",background:"none",border:"none",flex:1,fontFamily:"inherit"},children:[e.jsx("span",{style:{fontSize:"20px",lineHeight:1},children:"🗺️"}),e.jsx("span",{style:{fontSize:"9px",color:"rgba(238,240,247,0.4)",fontWeight:"600",letterSpacing:"0.04em"},children:a("nav.map")})]}),e.jsxs("button",{onClick:Z,style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",background:"none",border:"none",flex:1,fontFamily:"inherit"},children:[e.jsx("span",{style:{fontSize:"20px",lineHeight:1},children:"💡"}),e.jsx("span",{style:{fontSize:"9px",color:"rgba(238,240,247,0.4)",fontWeight:"600",letterSpacing:"0.04em"},children:a("dashboard.bottomNavTips")})]})]}),z&&e.jsxs("div",{style:{position:"fixed",top:p?"56px":0,left:p?0:"260px",right:0,bottom:p?"64px":0,zIndex:150,overflowY:"auto",background:"#080c14",transform:"translateZ(0)",WebkitTransform:"translateZ(0)"},children:[e.jsx("button",{onClick:()=>g(null),"aria-label":u==="tl"?"Isara":"Close",style:{position:"fixed",top:p?"68px":"16px",right:"16px",zIndex:160,width:"38px",height:"38px",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(15,21,33,0.92)",border:"1px solid rgba(255,255,255,0.14)",color:"#eef0f7",fontSize:"16px",cursor:"pointer",backdropFilter:"blur(12px)"},children:e.jsx(Pe,{})}),z==="safetytips"&&e.jsx(Me,{}),z==="alerts"&&e.jsx(Ue,{}),z==="report"&&e.jsx(qe,{onBack:()=>g(null),onViewHistory:()=>r("/citizen/history"),onViewReport:t=>re(t)}),z==="reportdetail"&&R&&e.jsx(Xe,{reportId:R,onBack:()=>g(null),onViewHistory:()=>r("/citizen/history")}),z==="map"&&e.jsx(Ge,{onBack:()=>g(null)})]})]})}export{sr as default};
