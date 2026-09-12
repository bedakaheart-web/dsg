import{ao as r,ak as a,ae as i}from"./index-CvhaT9ii.js";import{b as s}from"./emergency-Bkead6oY.js";const n=[{id:"mission",icon:"🎯",accent:"#e8372a",accentRgb:"232,55,42",key:"mission"},{id:"vision",icon:"🔭",accent:"#4A90D9",accentRgb:"74,144,217",key:"vision"}],o=[{icon:"📋",key:"contacts"},{icon:"🛡️",key:"guidelines"},{icon:"🚨",key:"reporting"},{icon:"🤝",key:"partners"}];function b(){const{t:e}=r();return a.jsxs(a.Fragment,{children:[a.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #07101d;
          --surface:  rgba(13,27,46,0.72);
          --surface2: rgba(13,27,46,0.88);
          --border:   rgba(0,200,224,0.08);
          --border2:  rgba(0,200,224,0.18);
          --text:     #ddeef8;
          --text2:    rgba(160,200,224,0.65);
          --text3:    rgba(160,200,224,0.30);
          --red:      #e8372a;
          --cyan:     #00c8e0;
          --blue:     #4A90D9;
          --radius:   13px;
        }

        .ab {
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: var(--text);
          background: var(--bg);
          position: relative;
          overflow-x: hidden;
        }

        .ab-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
        .ab-bg-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center; display: block;
          transform-origin: center center;
          animation: bgDrift 30s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes bgDrift {
          0%   { transform: scale(1.08) translate(0px,   0px);   }
          25%  { transform: scale(1.11) translate(-16px, -10px); }
          50%  { transform: scale(1.10) translate(-8px,  -18px); }
          75%  { transform: scale(1.12) translate(14px,  -6px);  }
          100% { transform: scale(1.08) translate(0px,   0px);   }
        }

        .ab-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7,16,29,0.82) 0%,
            rgba(7,16,29,0.68) 40%,
            rgba(7,16,29,0.82) 75%,
            rgba(7,16,29,0.97) 100%
          );
        }
        .ab-bg-atmosphere {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 10% 0%,  rgba(232,55,42,0.09)  0%, transparent 65%),
            radial-gradient(ellipse 55% 60% at 90% 100%, rgba(0,200,224,0.07)  0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 55% 45%,  rgba(13,27,46,0.40)   0%, transparent 60%);
        }
        .ab-bg-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          background-size: 200px; opacity: 0.45; pointer-events: none;
        }

        .ab-wrap {
          position: relative; z-index: 1;
          max-width: 1080px; margin: 0 auto;
          padding: 0 28px 120px;
        }

        .ab-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 0 0;
          animation: fadeUp .5s ease both;
        }
        .ab-logo {
          display: flex; align-items: center; gap: 10px; text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text);
        }
        .ab-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 12px var(--red), 0 0 24px rgba(232,55,42,0.4);
          animation: breathe 2.4s ease infinite;
        }
        @keyframes breathe {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.55; transform:scale(.78); }
        }
        .ab-back {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text3); text-decoration: none;
          border: 1px solid rgba(0,200,224,0.12); border-radius: 8px;
          padding: 8px 16px; transition: all .2s;
          background: rgba(13,27,46,0.60); backdrop-filter: blur(18px);
          display: flex; align-items: center; gap: 6px;
        }
        .ab-back:hover { color: var(--text); border-color: rgba(0,200,224,0.30); }

        .ab-hero {
          margin-top: 72px;
          margin-bottom: 52px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .ab-hero-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--red); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .ab-hero-eyebrow::after {
          content: ''; display: block;
          width: 40px; height: 1px;
          background: var(--red); opacity: 0.5;
        }
        .ab-hero h1 {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(42px, 6vw, 78px);
          font-weight: 700; line-height: 0.95;
          letter-spacing: -0.03em; color: #F8FAFC;
          margin-bottom: 24px;
        }
        .ab-hero h1 .accent {
          color: #A8D8FF;
          -webkit-text-stroke: 0;
        }
        .ab-hero-sub {
          font-family: 'Inter', sans-serif;
          font-size: 16px; font-weight: 300;
          color: rgba(160,200,224,0.60);
          max-width: 520px; line-height: 1.68;
        }
        .ab-meta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--text3);
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 6px 16px; margin-top: 24px;
          backdrop-filter: blur(18px);
        }
        .ab-meta-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 10px var(--red), 0 0 22px rgba(232,55,42,0.35);
          animation: breathe 2.4s ease infinite;
        }

        .ab-intro {
          background: var(--surface);
          border: 1px solid var(--border); border-radius: var(--radius);
          padding: 28px 32px;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          position: relative; overflow: hidden;
        }
        .ab-intro::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--red), var(--cyan), transparent);
        }
        .ab-intro-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--red); margin-bottom: 14px;
        }
        .ab-intro-text {
          font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 300;
          color: var(--text2); line-height: 1.75;
        }
        .ab-intro-text strong { color: var(--text); font-weight: 500; }

        .ab-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--text3); margin-bottom: 14px;
        }

        .ab-pillars {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 13px;
        }

        .ab-pillar {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: 2px solid var(--p-accent);
          border-radius: var(--radius); padding: 26px 24px;
          position: relative; overflow: hidden;
          transition: transform .22s, border-color .22s, box-shadow .22s;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        }
        .ab-pillar::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 0% 0%, var(--p-dim), transparent 70%);
          pointer-events: none;
        }
        .ab-pillar:hover {
          transform: translateY(-3px);
          border-color: var(--p-accent);
          box-shadow: 0 0 20px var(--p-dim), 0 8px 28px rgba(0,0,0,0.4);
        }

        .ab-pillar-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; margin-bottom: 16px;
          position: relative; z-index: 1;
        }
        .ab-pillar-icon { font-size: 26px; line-height: 1; }
        .ab-pillar-tag {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--p-accent); border: 1px solid var(--p-accent);
          border-radius: 3px; padding: 3px 7px; opacity: .75;
        }
        .ab-pillar-title {
          font-family: 'Poppins', sans-serif;
          font-size: 18px; font-weight: 700;
          letter-spacing: -0.02em; color: var(--text);
          margin-bottom: 10px; position: relative; z-index: 1;
        }
        .ab-pillar-body {
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 300;
          color: var(--text2); line-height: 1.7;
          position: relative; z-index: 1;
        }

        .ab-features {
          background: var(--surface);
          border: 1px solid var(--border); border-radius: var(--radius);
          overflow: hidden;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          position: relative;
        }
        .ab-features::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--cyan), transparent);
        }
        .ab-feature {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 20px 28px;
          border-bottom: 1px solid var(--border);
          transition: background .2s;
        }
        .ab-feature:last-child { border-bottom: none; }
        .ab-feature:hover { background: rgba(0,200,224,0.04); }
        .ab-feature-icon { font-size: 20px; line-height: 1; margin-top: 2px; flex-shrink: 0; }
        .ab-feature-label {
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500;
          color: var(--text); margin-bottom: 4px; letter-spacing: -0.005em;
        }
        .ab-feature-detail {
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 300;
          color: var(--text3); line-height: 1.65;
        }

        .ab-cta {
          background: var(--surface);
          border: 1px solid rgba(232,55,42,0.20);
          border-radius: var(--radius); padding: 32px 36px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 24px;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          position: relative; overflow: hidden;
        }
        .ab-cta::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--red), rgba(232,55,42,0.3), transparent);
        }
        .ab-cta-text h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 18px; font-weight: 700;
          letter-spacing: -0.02em; color: var(--text);
          margin-bottom: 6px;
        }
        .ab-cta-text p {
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 300;
          color: var(--text3); line-height: 1.5; max-width: 380px;
        }
        .ab-cta-btn {
          flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, var(--red), #b82010);
          border: none; border-radius: 8px;
          padding: 13px 24px; cursor: pointer; text-decoration: none;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 0 28px rgba(232,55,42,0.28);
          white-space: nowrap;
        }
        .ab-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(232,55,42,0.50);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 760px) {
          .ab-wrap { padding: 0 18px 100px; }
          .ab-hero h1 { font-size: 38px; }
          .ab-hero { margin-top: 48px; margin-bottom: 36px; }
          .ab-pillars { grid-template-columns: 1fr; }
          .ab-cta { flex-direction: column; align-items: flex-start; }
          .ab-intro { padding: 22px 20px; }
          .ab-feature { padding: 16px 20px; }
          .ab-cta { padding: 24px 22px; }
        }

        @media (max-width: 480px) {
          .ab-hero h1 { font-size: 32px; }
        }
      `}),a.jsxs("div",{className:"ab",children:[a.jsxs("div",{className:"ab-bg",children:[a.jsx("img",{src:s,alt:"",className:"ab-bg-img","aria-hidden":"true"}),a.jsx("div",{className:"ab-bg-overlay"}),a.jsx("div",{className:"ab-bg-atmosphere"}),a.jsx("div",{className:"ab-bg-grain"})]}),a.jsxs("div",{className:"ab-wrap",children:[a.jsx("nav",{className:"ab-nav",children:a.jsx(i,{to:"/",className:"ab-logo"})}),a.jsxs("section",{className:"ab-hero",children:[a.jsxs("h1",{children:[e("about.heroTitle")," ",a.jsx("span",{className:"accent",children:"DumaSafeGuide"})]}),a.jsx("p",{className:"ab-hero-sub",children:e("about.heroSub")}),a.jsxs("div",{className:"ab-meta",children:[a.jsx("span",{className:"ab-meta-dot"}),e("about.metaText")]})]}),a.jsx("div",{className:"ab-section",children:a.jsxs("div",{className:"ab-intro",children:[a.jsx("div",{className:"ab-intro-label",children:e("about.introLabel")}),a.jsx("p",{className:"ab-intro-text",children:e("about.introText")})]})}),a.jsxs("div",{className:"ab-section",children:[a.jsx("div",{className:"ab-label",children:e("about.pillarsLabel")}),a.jsx("div",{className:"ab-pillars",children:n.map(t=>a.jsxs("div",{className:"ab-pillar",style:{"--p-accent":t.accent,"--p-dim":`rgba(${t.accentRgb},0.10)`},children:[a.jsxs("div",{className:"ab-pillar-top",children:[a.jsx("span",{className:"ab-pillar-icon",children:t.icon}),a.jsx("span",{className:"ab-pillar-tag",children:e(`about.${t.key}.tag`)})]}),a.jsx("div",{className:"ab-pillar-title",children:e(`about.${t.key}.title`)}),a.jsx("p",{className:"ab-pillar-body",children:e(`about.${t.key}.body`)})]},t.id))})]}),a.jsxs("div",{className:"ab-section",children:[a.jsx("div",{className:"ab-label",children:e("about.featuresLabel")}),a.jsx("div",{className:"ab-features",children:o.map(t=>a.jsxs("div",{className:"ab-feature",children:[a.jsx("span",{className:"ab-feature-icon",children:t.icon}),a.jsxs("div",{children:[a.jsx("div",{className:"ab-feature-label",children:e(`about.features.${t.key}.label`)}),a.jsx("p",{className:"ab-feature-detail",children:e(`about.features.${t.key}.detail`)})]})]},t.key))})]}),a.jsx("div",{className:"ab-section",children:a.jsxs("div",{className:"ab-cta",children:[a.jsxs("div",{className:"ab-cta-text",children:[a.jsx("h3",{children:e("about.cta.title")}),a.jsx("p",{children:e("about.cta.desc")})]}),a.jsxs("a",{href:"/report",className:"ab-cta-btn",children:["🚨 ",e("about.cta.btn")]})]})})]})]})]})}export{b as default};
