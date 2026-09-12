import{ao as be,aq as xe,am as c,ak as e,an as P}from"./index-CvhaT9ii.js";import{p as se}from"./pagesbackground-CfzHpFCG.js";const M=[{value:"fire",label:"Fire Incident",icon:"🔥",accent:"#FF6B6B",rgb:"255,107,107"},{value:"accident",label:"Road Accident",icon:"🚗",accent:"#FFD166",rgb:"255,209,102"},{value:"flood",label:"Flood",icon:"🌊",accent:"#7B9EFF",rgb:"123,158,255"},{value:"crime",label:"Crime",icon:"🚨",accent:"#FF9F43",rgb:"255,159,67"},{value:"medical",label:"Medical Emergency",icon:"🏥",accent:"#2ECC8F",rgb:"46,204,143"},{value:"other",label:"Other",icon:"⚠️",accent:"#8fa3be",rgb:"143,163,190"}],ue=[{label:"BFP",number:"422-2022",icon:"🔥",color:"#FF6B6B"},{label:"CDRRMO",number:"422-3008",icon:"🌀",color:"#FFD166"},{label:"PNP",number:"422-8708",icon:"👮",color:"#7B9EFF"},{label:"PDRRMO",number:"422-3006",icon:"🏥",color:"#2ECC8F"}],te=["Incident Type","Reporter Info","Location","Description","Evidence","Submit"],ce=`
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

  /* ── Hero ── */
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

  /* ── Logged-in status banner ── */
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

  /* ── Steps ── */
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

  /* ── Layout ── */
  .cr-layout { display: grid; grid-template-columns: 1fr 290px; gap: 22px; align-items: start; }

  /* ── Form ── */
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

  /* Type grid */
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

  /* Fields */
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

  /* Location */
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

  /* Dropzone */
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

  /* Disclaimer */
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

  /* Error banner */
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

  /* Submit */
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

  /* ── Sidebar ── */
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

  /* ── Success ── */
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

  /* Responsive */
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
`;async function me(){try{if("permissions"in navigator)return(await navigator.permissions.query({name:"geolocation"})).state}catch{}return"unknown"}async function oe(){try{const r=await(await fetch("https://ipapi.co/json/")).json();if(r?.latitude&&r?.longitude)return{lat:String(r.latitude),lng:String(r.longitude)}}catch{}return null}function fe(j,r){if(!navigator.geolocation){r();return}let g=null,b=null,w=!1;const f=()=>{w||(w=!0,b!==null&&(navigator.geolocation.clearWatch(b),b=null),g?j(g.coords.latitude.toFixed(6),g.coords.longitude.toFixed(6),g.coords.accuracy):r())},l=setTimeout(f,25e3);b=navigator.geolocation.watchPosition(d=>{(!g||d.coords.accuracy<g.coords.accuracy)&&(g=d),d.coords.accuracy<=15&&(clearTimeout(l),f())},d=>{if(d.code===d.PERMISSION_DENIED){clearTimeout(l),f();return}g&&(clearTimeout(l),f())},{enableHighAccuracy:!0,timeout:3e4,maximumAge:0})}function ye(){const{language:j,t:r,tList:g}=be(),b=xe(),w=r("report.form.refreshGps","📍 Refresh GPS").replace("📍 ",""),f=a=>r(`report.types.${a}`,M.find(s=>s.value===a)?.label??a??""),[l,d]=c.useState(""),[z,C]=c.useState(null),[n,h]=c.useState("idle"),[R,S]=c.useState(null),[p,U]=c.useState(null),[k,O]=c.useState(!1),[ie,X]=c.useState(!1),[Y,H]=c.useState(null),[E,N]=c.useState(null),[W,F]=c.useState(null),[B,m]=c.useState("idle"),[u,T]=c.useState(null),[A,y]=c.useState(0),[V,$]=c.useState(!1),[J,L]=c.useState(null),[K,Z]=c.useState(""),[Q,ee]=c.useState(""),[D,re]=c.useState(""),I=c.useRef(null),_=M.find(a=>a.value===p);async function q(a,s){try{const x=await(await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${a}&lon=${s}&format=jsonv2&addressdetails=1`,{headers:{"Accept-Language":j==="tl"?"fil":"en"}})).json();if(x?.address){const t=x.address,o=[];t.road&&o.push(t.road),t.neighbourhood&&o.push(t.neighbourhood),t.suburb&&o.push(t.suburb),t.village&&o.push(t.village),t.barangay&&o.push(t.barangay),(t.city||t.town||t.municipality)&&o.push(t.city??t.town??t.municipality),(t.state||t.province)&&o.push(t.state??t.province),t.country&&o.push(t.country);const v=[...new Set(o)];if(v.length){C(v.join(", "));return}}if(x?.display_name){C(x.display_name);return}}catch{}C(`Lat ${a}, Lng ${s}`)}async function ae(){if(h("loading"),C(null),T(null),S(null),await me()==="denied"){const s=await oe();s?(d(`${s.lat}, ${s.lng}`),T(null),S("ip"),h("ok"),await q(s.lat,s.lng)):h("error");return}fe(async(s,i,x)=>{d(`${s}, ${i}`),T(x),S("gps"),h("ok"),await q(s,i)},async()=>{const s=await oe();s?(d(`${s.lat}, ${s.lng}`),T(null),S("ip"),h("ok"),await q(s.lat,s.lng)):h("error")})}c.useEffect(()=>{ae()},[]);function ne(a){const s=a.target.files?.[0];s?(N(s.name),F(s),m("idle")):(N(null),F(null))}async function le(a){m("uploading");const i=a.name.replace(/[^a-zA-Z0-9._-]/g,"_").split(".").pop()??"bin",t=`evidence/${`${Date.now()}_${Math.random().toString(36).slice(2)}.${i}`}`,{error:o}=await P.storage.from("reports-evidence").upload(t,a,{cacheControl:"3600",upsert:!1,contentType:a.type||"application/octet-stream"});if(o){m("error");let G=`${r("report.uploadFailed","Upload failed")}: ${o.message}`;return o.message?.includes("Bucket not found")?G=r("report.form.bucketMissing",'Storage bucket "reports-evidence" not found.'):o.message?.includes("policy")?G=r("report.form.uploadBlocked","Upload blocked by storage security policy."):o.message?.includes("too large")&&(G=r("report.form.uploadTooLarge","File is too large.")),{url:null,errorMsg:G}}const{data:v}=P.storage.from("reports-evidence").getPublicUrl(t);return m("done"),{url:v?.publicUrl??null,errorMsg:null}}async function de(a){if(a.preventDefault(),!k||!p)return;$(!0),L(null);const{data:{user:s}}=await P.auth.getUser();let i=null;if(W){const{url:o,errorMsg:v}=await le(W);if(!o){L(v??r("report.form.evidenceUploadFailed","Evidence upload failed.")),$(!1);return}i=o}const{data:x,error:t}=await P.from("reports").insert({type:p,description:D.trim()||null,location:l||null,address:z||null,reporter_name:K.trim()||null,reporter_contact:Q.trim()||null,status:"pending",user_id:s?.id??null,responder_id:null,evidence_url:i}).select("id").single();if(t){L(r("report.form.submitFailed","Failed to submit report. Please try again.")),$(!1);return}$(!1),H(x?.id??null),X(!0)}c.useEffect(()=>{k&&p?y(5):E?y(4):D.trim()?y(3):y(n==="ok"||n!=="idle"?2:p?1:0)},[p,n,E,k,D]);function pe(){if(n==="loading")return r("report.acquiringLocation");if(n==="error")return r("report.locationUnavailable");if(n==="ok"){if(z)return z;if(l)return`${r("report.acquiringLocation").replace(r("report.form.acquiringTrimSuffix","— please wait"),"")} (${l})`}return""}function ge(){X(!1),H(null),U(null),re(""),Z(""),ee(""),N(null),F(null),O(!1),m("idle")}return ie?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:ce}),e.jsxs("div",{className:"cr-root",children:[e.jsx("div",{className:"cr-bg",style:{backgroundImage:`url(${se})`}}),e.jsxs("div",{className:"cr-glow",children:[e.jsx("div",{className:"cr-glow-a"}),e.jsx("div",{className:"cr-glow-b"})]}),e.jsx("div",{className:"cr-inner cr-inner--center",children:e.jsxs("div",{className:"cr-success",children:[e.jsx("div",{className:"cr-success-icon",children:"✓"}),e.jsx("h2",{className:"cr-success-title",children:r("report.success.title")}),e.jsx("p",{className:"cr-success-sub",children:r("report.success.sub")}),e.jsxs("div",{className:"cr-success-cards",children:[e.jsxs("div",{className:"cr-success-card",children:[e.jsx("div",{className:"cr-success-card-icon",children:"📝"}),e.jsx("div",{className:"cr-success-card-title",children:r("report.success.cardTitle")}),e.jsx("p",{className:"cr-success-card-text",children:r("report.success.cardText")}),e.jsx("button",{className:"cr-success-btn",onClick:ge,children:r("report.success.cardBtn")})]}),e.jsxs("div",{className:"cr-success-card cr-success-card--track",children:[e.jsx("div",{className:"cr-success-card-icon",children:"📍"}),e.jsx("div",{className:"cr-success-card-title",children:r("report.trackMyReport")}),e.jsx("p",{className:"cr-success-card-text",children:r("report.sidebar.trackText")}),e.jsx("button",{className:"cr-success-btn cr-success-btn--track",onClick:()=>b(Y?`/citizen/history/${Y}`:"/citizen/history"),children:r("report.trackIncidentReport")})]})]})]})})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("style",{children:ce}),e.jsxs("div",{className:"cr-root",children:[e.jsx("div",{className:"cr-bg",style:{backgroundImage:`url(${se})`}}),e.jsxs("div",{className:"cr-glow",children:[e.jsx("div",{className:"cr-glow-a"}),e.jsx("div",{className:"cr-glow-b"})]}),e.jsxs("div",{className:"cr-inner",children:[e.jsxs("section",{className:"cr-hero",children:[e.jsxs("div",{className:"cr-hero-tag",children:[e.jsx("span",{className:"cr-hero-dot"}),r("report.reportingLiveIncident")]}),e.jsxs("h1",{className:"cr-hero-heading",children:[r("report.heroTitle")," ",e.jsx("em",{children:r("report.heroAccent")})]}),e.jsx("p",{className:"cr-hero-sub",children:r("report.heroSub")})]}),e.jsxs("div",{className:"cr-banner",children:[e.jsx("div",{className:"cr-banner-icon",children:"✅"}),e.jsxs("div",{className:"cr-banner-body",children:[e.jsx("div",{className:"cr-banner-title",children:r("report.bannerTitle")}),e.jsx("p",{className:"cr-banner-text",children:r("report.bannerText")})]}),e.jsx("button",{className:"cr-banner-btn",onClick:()=>b("/citizen/history"),children:r("report.myReportsBtn")})]}),e.jsx("div",{className:"cr-steps",children:te.map((a,s)=>{const i=["incidentType","reporterInfo","location","description","evidence","submit"][s];return e.jsxs("div",{className:`cr-step${s<=A?" cr-step--done":""}${s===A?" cr-step--active":""}`,children:[e.jsx("div",{className:"cr-step-dot",children:s<A?"✓":s+1}),e.jsx("span",{className:"cr-step-label",children:r(`report.steps.${i}`)}),s<te.length-1&&e.jsx("div",{className:"cr-step-line"})]},a)})}),e.jsxs("div",{className:"cr-layout",children:[e.jsxs("form",{className:"cr-form",onSubmit:de,noValidate:!0,children:[e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"01"}),r("report.cardLabels.incidentType")]}),e.jsx("div",{className:"cr-type-grid",children:M.map(a=>e.jsxs("button",{type:"button",className:`cr-type-btn${p===a.value?" active":""}`,style:{"--ta":a.accent,"--td":`${a.accent}18`,"--tr":a.rgb},onClick:()=>U(a.value),children:[e.jsx("span",{className:"cr-type-icon",children:a.icon}),e.jsx("span",{className:"cr-type-label",children:r(`report.types.${a.value}`)})]},a.value))}),p&&e.jsxs("div",{className:"cr-type-confirm",style:{"--ta":_?.accent,"--td":`${_?.accent}18`},children:[e.jsx("span",{children:_?.icon}),e.jsx("span",{children:r("report.selected").replace("{type}",f(p))})]})]}),e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"02"}),r("report.cardLabels.reporterInfo")]}),e.jsxs("div",{className:"cr-fields",children:[e.jsxs("div",{className:"cr-field",children:[e.jsxs("label",{className:"cr-label",children:[r("report.form.fullName")," ",e.jsx("span",{className:"cr-optional",children:r("report.form.optional")})]}),e.jsx("input",{className:"cr-input",type:"text",placeholder:r("report.form.namePlaceholder","e.g. Juan dela Cruz"),value:K,onChange:a=>Z(a.target.value)})]}),e.jsxs("div",{className:"cr-field",children:[e.jsxs("label",{className:"cr-label",children:[r("report.form.contactNumber")," ",e.jsx("span",{className:"cr-optional",children:r("report.form.optional")})]}),e.jsx("input",{className:"cr-input",type:"tel",placeholder:r("report.form.contactPlaceholder","+63 9XX XXX XXXX"),value:Q,onChange:a=>ee(a.target.value)})]})]})]}),e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"03"}),r("report.cardLabels.location")]}),e.jsxs("div",{className:"cr-field",children:[e.jsx("label",{className:"cr-label",children:r("report.form.detectedLocation")}),e.jsxs("div",{className:"cr-loc-row",children:[e.jsxs("div",{className:"cr-loc-wrap",children:[e.jsx("span",{className:"cr-loc-dot","data-status":n}),e.jsx("input",{className:"cr-input cr-input--loc cr-input--readonly",type:"text",readOnly:!0,value:pe(),placeholder:r("report.form.gpsWaiting","Waiting for GPS…")})]}),e.jsx("button",{type:"button",className:"cr-gps-btn",onClick:ae,children:r("report.form.refreshGps")})]}),n==="ok"&&l&&e.jsxs("div",{className:"cr-coords-badge",children:[e.jsxs("span",{className:"cr-coords-text",children:["🌐 ",l]}),z&&e.jsx("a",{href:`https://www.google.com/maps?q=${l}`,target:"_blank",rel:"noopener noreferrer",className:"cr-maps-link",children:r("report.form.verifyMaps")})]}),n==="loading"&&e.jsxs("div",{className:"cr-gps-acquiring",children:[e.jsx("span",{className:"cr-gps-pulse"}),r("report.searchingGps")]}),n==="error"&&e.jsxs("p",{className:"cr-hint cr-hint--warn",children:["⚠️ ",r("report.locationUnavailable")," ",r("report.form.allowLocationAccess","Allow location access and tap")," ",e.jsx("strong",{children:w}),"."]}),n==="ok"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"cr-acc-badges",children:[R==="gps"&&u!==null&&e.jsxs("span",{className:`cr-acc-badge ${u<=20?"acc-great":u<=100?"acc-ok":"acc-poor"}`,children:[u<=20?r("report.highAccuracy"):u<=100?r("report.mediumAccuracy"):r("report.lowAccuracy")," ","(±",Math.round(u),"m)"]}),R==="ip"&&e.jsx("span",{className:"cr-acc-badge acc-ip",children:r("report.approximateLocation")}),R==="gps"&&u!==null&&u>100&&e.jsx("span",{className:"cr-acc-tip",children:r("report.moveOutdoors")})]}),e.jsxs("p",{className:"cr-hint cr-hint--warn",children:["⚠️ ",r("report.form.locationLooksWrong","If the location looks wrong, tap {refresh} to try again.").replace("{refresh}",w)]})]})]})]}),e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"04"}),r("report.cardLabels.description")]}),e.jsxs("div",{className:"cr-field",children:[e.jsx("label",{className:"cr-label",children:r("report.detailedDescription")}),e.jsx("textarea",{className:"cr-textarea",rows:5,placeholder:r("report.form.descriptionPlaceholder"),value:D,onChange:a=>re(a.target.value),required:!0})]})]}),e.jsxs("div",{className:"cr-card",children:[e.jsxs("div",{className:"cr-card-label",children:[e.jsx("span",{className:"cr-step-badge",children:"05"}),r("report.cardLabels.evidence"),e.jsx("span",{className:"cr-optional",children:r("report.form.optional")})]}),e.jsxs("div",{className:"cr-dropzone",onClick:()=>I.current?.click(),onDragOver:a=>a.preventDefault(),onDrop:a=>{a.preventDefault();const s=a.dataTransfer.files[0];if(s&&I.current){const i=new DataTransfer;i.items.add(s),I.current.files=i.files,N(s.name),F(s),m("idle")}},children:[e.jsx("input",{ref:I,type:"file",accept:"image/*,video/*",style:{display:"none"},onChange:ne}),E?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"cr-dropzone-icon",children:"📎"}),e.jsx("span",{className:"cr-dropzone-name",children:E}),e.jsx("span",{className:"cr-dropzone-change",children:r("report.form.clickToChange","Click to change")})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"cr-dropzone-icon",children:"📤"}),e.jsx("span",{className:"cr-dropzone-text",children:r("report.form.uploadHint")}),e.jsx("span",{className:"cr-dropzone-hint",children:r("report.photosAccepted")})]})]}),B==="uploading"&&e.jsx("div",{className:"cr-upload-status cr-upload--uploading",children:r("report.uploadingEvidence")}),B==="done"&&e.jsx("div",{className:"cr-upload-status cr-upload--done",children:r("report.evidenceUploaded")}),B==="error"&&e.jsx("div",{className:"cr-upload-status cr-upload--error",children:r("report.uploadFailed")})]}),e.jsxs("div",{className:"cr-disclaimer",children:[e.jsxs("div",{className:"cr-disclaimer-header",children:[e.jsx("span",{style:{fontSize:16},children:"⚖️"}),e.jsx("span",{className:"cr-disclaimer-title",children:r("report.form.legalTitle")})]}),e.jsx("p",{className:"cr-disclaimer-summary",children:r("report.form.legalSummary")}),e.jsxs("label",{className:"cr-check-row",children:[e.jsx("input",{type:"checkbox",className:"cr-checkbox-hidden",checked:k,onChange:a=>O(a.target.checked),required:!0}),e.jsx("div",{className:"cr-checkbox-box",children:k&&"✓"}),e.jsx("span",{className:"cr-check-text",children:r("report.form.legalCheckText")})]})]}),J&&e.jsxs("div",{className:"cr-error",children:[e.jsxs("div",{children:["⚠️ ",J]}),B==="error"&&e.jsx("button",{type:"button",className:"cr-skip-btn",onClick:()=>{F(null),N(null),m("idle"),L(null)},children:r("report.form.removeEvidence","Remove evidence and submit without it →")})]}),e.jsx("button",{type:"submit",className:"cr-submit",disabled:!k||!p||V,children:V?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"cr-spinner"}),e.jsx("span",{children:r("report.form.submitting")})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:r("report.form.submitBtn")}),e.jsx("span",{className:"cr-submit-arrow",children:"→"})]})})]}),e.jsxs("div",{className:"cr-sidebar",children:[e.jsxs("div",{className:"cr-sidebar-card",children:[e.jsx("div",{className:"cr-sidebar-title",children:r("report.sidebar.hotlinesTitle")}),e.jsx("div",{className:"cr-hotlines",children:ue.map(a=>e.jsxs("a",{href:`tel:${a.number}`,className:"cr-hotline",style:{"--hc":a.color},children:[e.jsx("span",{className:"cr-hotline-icon",children:a.icon}),e.jsxs("div",{className:"cr-hotline-info",children:[e.jsx("span",{className:"cr-hotline-label",children:a.label}),e.jsx("span",{className:"cr-hotline-number",children:a.number})]}),e.jsx("span",{className:"cr-hotline-call",children:r("report.call")})]},a.number))})]}),e.jsxs("div",{className:"cr-sidebar-card cr-sidebar-card--warn",children:[e.jsxs("div",{className:"cr-sidebar-title",children:["⚠️ ",r("report.sidebar.warnTitle")]}),e.jsx("p",{className:"cr-sidebar-text",children:r("report.sidebar.warnText")})]}),e.jsxs("div",{className:"cr-sidebar-card cr-sidebar-card--info",children:[e.jsxs("div",{className:"cr-sidebar-title",children:["🛡️ ",r("report.sidebar.safetyTitle")]}),e.jsx("p",{className:"cr-sidebar-text",children:r("report.sidebar.safetyText")})]}),e.jsxs("div",{className:"cr-sidebar-card cr-sidebar-card--track",children:[e.jsxs("div",{className:"cr-sidebar-title",children:["📍 ",r("report.sidebar.trackTitle")]}),e.jsx("p",{className:"cr-sidebar-text",children:r("report.sidebar.trackText")}),e.jsx("button",{className:"cr-track-btn",onClick:()=>b("/citizen/history"),children:r("report.sidebar.trackBtn")})]})]})]})]})]})]})}export{ye as default};
