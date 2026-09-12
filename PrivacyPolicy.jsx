import { Link } from "react-router-dom";
import { useState } from "react";
import emergencyBg from "../assets/emergency.jpg";

const content = {
  en: {
    langLabel: "FIL",
    breadcrumb: ["Resources", "Terms of Service", "Privacy Policy"],
    eyebrow: "Data & Privacy",
    titleLine1: "Privacy",
    titleAccent: "Policy",
    heroSub:
      "DumaSafeGuide values your privacy. We only collect what's necessary to power emergency reporting and community safety services.",
    meta: "Effective Date: January 1, 2025 · Last Updated: June 2025",
    introStrong: "Your data is never sold.",
    introRest:
      "Information collected through DumaSafeGuide is used exclusively to coordinate emergency responses and improve platform safety features. It is not shared with commercial third parties except as required by Philippine law or to support authorized emergency responders.",
    sections: [
      {
        id: "what-we-collect",
        heading: "Information We Collect",
        icon: "📥",
        items: [
          {
            label: "Basic user details for authentication",
            detail:
              "Name, email address, and contact information provided during account registration, used solely to authenticate you on the platform.",
          },
          {
            label: "Emergency reports submitted through the system",
            detail:
              "Location data, incident descriptions, photos, and timestamps attached to any emergency report you file through DumaSafeGuide.",
          },
          {
            label: "Feedback provided voluntarily",
            detail:
              "Ratings, suggestions, or comments you choose to submit to help us improve the platform's responsiveness and usability.",
          },
        ],
      },
      {
        id: "data-usage",
        heading: "Data Usage",
        icon: "⚙️",
        items: [
          {
            label: "Improve system functionality",
            detail:
              "Aggregated, anonymized data helps us identify bottlenecks in report processing and improve response times across barangays.",
          },
          {
            label: "Support emergency responders",
            detail:
              "Relevant incident details are shared with authorized CDRRMO, BFP, and Red Cross personnel to coordinate on-ground response.",
          },
          {
            label: "Enhance public safety awareness",
            detail:
              "Trend data from reported incidents may be published in anonymized form to help the community understand local hazard patterns.",
          },
        ],
      },
      {
        id: "data-rights",
        heading: "Your Rights",
        icon: "✋",
        items: [
          {
            label: "Right to Access",
            detail:
              "You may request a copy of all personal data we hold about you at any time by contacting the platform administrators.",
          },
          {
            label: "Right to Deletion",
            detail:
              "You may request removal of your personal data. Requests will be processed within 30 days, subject to legal retention requirements.",
          },
          {
            label: "Right to Correction",
            detail:
              "If any of your stored information is inaccurate, you may request a correction through your account settings or by contacting us directly.",
          },
        ],
      },
    ],
    noticeStrong: "Questions about your data?",
    noticeRest:
      "Contact DumaSafeGuide administrators at admin@dumasafeguide.ph or reach out through the platform's feedback form. Data deletion requests are processed within 30 days, subject to legal retention obligations under Philippine law.",
    ctaHeading: "Need to report an emergency?",
    ctaSub: "Don't wait — use the incident reporting form to alert local responders immediately.",
    ctaBtn: "Report Now",
  },
  fil: {
    langLabel: "EN",
    breadcrumb: ["Mga Resource", "Mga Tuntunin ng Serbisyo", "Patakaran sa Privacy"],
    eyebrow: "Datos at Privacy",
    titleLine1: "Patakaran sa",
    titleAccent: "Privacy",
    heroSub:
      "Pinahahalagahan ng DumaSafeGuide ang iyong privacy. Kinokolekta lang namin ang kinakailangan para paganahin ang pag-uulat ng emerhensiya at mga serbisyo para sa kaligtasan ng komunidad.",
    meta: "Petsa ng Pagkakaroon ng Bisa: Enero 1, 2025 · Huling Update: Hunyo 2025",
    introStrong: "Hindi kailanman ipinagbibili ang iyong datos.",
    introRest:
      "Ang impormasyong kinokolekta sa pamamagitan ng DumaSafeGuide ay ginagamit lamang para mag-ugnay ng tugon sa emerhensiya at mapabuti ang mga feature ng kaligtasan ng platform. Hindi ito ibinabahagi sa mga komersyal na third party maliban kung hinihingi ng batas ng Pilipinas o para suportahan ang mga awtorisadong tagatugon sa emerhensiya.",
    sections: [
      {
        id: "what-we-collect",
        heading: "Impormasyong Kinokolekta Namin",
        icon: "📥",
        items: [
          {
            label: "Batayang detalye ng user para sa pagpapatunay",
            detail:
              "Pangalan, email address, at impormasyon sa pakikipag-ugnayan na ibinigay sa pagpaparehistro ng account, na ginagamit lamang para patunayan ang iyong pagkakakilanlan sa platform.",
          },
          {
            label: "Mga ulat ng emerhensiya na isinumite sa sistema",
            detail:
              "Datos ng lokasyon, paglalarawan ng insidente, mga larawan, at timestamp na naka-attach sa anumang ulat ng emerhensiya na isinampa mo sa DumaSafeGuide.",
          },
          {
            label: "Feedback na kusang loob na ibinigay",
            detail:
              "Mga rating, mungkahi, o komento na pipiliin mong isumite upang matulungan kaming mapabuti ang pagtugon at usability ng platform.",
          },
        ],
      },
      {
        id: "data-usage",
        heading: "Paggamit ng Datos",
        icon: "⚙️",
        items: [
          {
            label: "Pagpapabuti ng functionality ng sistema",
            detail:
              "Ang naipon at anonymized na datos ay tumutulong sa amin na matukoy ang mga bottleneck sa pagproseso ng ulat at mapabuti ang oras ng pagtugon sa iba't ibang barangay.",
          },
          {
            label: "Suporta sa mga tagatugon sa emerhensiya",
            detail:
              "Ang mga kaugnay na detalye ng insidente ay ibinabahagi sa awtorisadong tauhan ng CDRRMO, BFP, at Red Cross upang mag-ugnay ng tugon sa lugar ng pangyayari.",
          },
          {
            label: "Pagpapahusay ng kamalayan sa kaligtasan ng publiko",
            detail:
              "Ang trend na datos mula sa mga naiulat na insidente ay maaaring ilathala sa anonymized na anyo upang matulungan ang komunidad na maunawaan ang mga lokal na pattern ng panganib.",
          },
        ],
      },
      {
        id: "data-rights",
        heading: "Ang Iyong mga Karapatan",
        icon: "✋",
        items: [
          {
            label: "Karapatang Ma-access",
            detail:
              "Maaari kang humiling ng kopya ng lahat ng personal na datos na hawak namin tungkol sa iyo anumang oras sa pamamagitan ng pakikipag-ugnayan sa mga administrator ng platform.",
          },
          {
            label: "Karapatang Mabura",
            detail:
              "Maaari kang humiling na tanggalin ang iyong personal na datos. Ang mga kahilingan ay ipoproseso sa loob ng 30 araw, alinsunod sa mga legal na kinakailangan sa pagpapanatili.",
          },
          {
            label: "Karapatang Iwasto",
            detail:
              "Kung may hindi tamang impormasyon na naka-imbak, maaari kang humiling ng pagwawasto sa pamamagitan ng mga setting ng iyong account o sa pakikipag-ugnayan sa amin nang direkta.",
          },
        ],
      },
    ],
    noticeStrong: "May katanungan tungkol sa iyong datos?",
    noticeRest:
      "Makipag-ugnayan sa mga administrator ng DumaSafeGuide sa admin@dumasafeguide.ph o sa pamamagitan ng feedback form ng platform. Ang mga kahilingan sa pagbura ng datos ay ipoproseso sa loob ng 30 araw, alinsunod sa mga legal na obligasyon sa pagpapanatili sa ilalim ng batas ng Pilipinas.",
    ctaHeading: "Kailangan mo bang mag-ulat ng emerhensiya?",
    ctaSub: "Huwag nang maghintay pa — gamitin ang incident reporting form upang agad na alertuhan ang mga lokal na tagatugon.",
    ctaBtn: "Mag-ulat Ngayon",
  },
};

export default function PrivacyPolicy() {
  const [lang, setLang] = useState("en");
  const t = content[lang];

  return (
    <>
      <style>{`
        /* ── Fonts: Syne 800 (headings) + DM Sans 300/400/500 (body) — matches About page ── */
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

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
          --green:    #2ECC8F;
          --radius:   13px;
        }

        .pp {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          background: var(--bg);
          position: relative;
          overflow-x: hidden;
        }

        /* ── Background — exact match to About page ── */
        .pp-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
        .pp-bg-img {
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

        .pp-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7,16,29,0.82) 0%,
            rgba(7,16,29,0.68) 40%,
            rgba(7,16,29,0.82) 75%,
            rgba(7,16,29,0.97) 100%
          );
        }
        .pp-bg-atmosphere {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 10% 0%,  rgba(232,55,42,0.09)  0%, transparent 65%),
            radial-gradient(ellipse 55% 60% at 90% 100%, rgba(0,200,224,0.07)  0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 55% 45%,  rgba(13,27,46,0.40)   0%, transparent 60%);
        }
        .pp-bg-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          background-size: 200px; opacity: 0.45; pointer-events: none;
        }

        /* ── Layout ── */
        .pp-wrap {
          position: relative; z-index: 1;
          max-width: 900px; margin: 0 auto;
          padding: 0 28px 120px;
        }

        /* ── Nav ── */
        .pp-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 0 0;
          animation: fadeUp .5s ease both;
        }
        .pp-logo {
          display: flex; align-items: center; gap: 10px; text-decoration: none;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text);
        }
        .pp-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 12px var(--red), 0 0 24px rgba(232,55,42,0.4);
          animation: breathe 2.4s ease infinite;
        }
        @keyframes breathe {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.55; transform:scale(.78); }
        }
        .pp-nav-actions {
          display: flex; align-items: center; gap: 10px;
        }
        .pp-lang-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          color: var(--text2); text-decoration: none;
          border: 1px solid rgba(0,200,224,0.12); border-radius: 8px;
          padding: 8px 14px; cursor: pointer;
          background: rgba(13,27,46,0.60); backdrop-filter: blur(18px);
          display: flex; align-items: center; gap: 6px;
          transition: all .2s;
        }
        .pp-lang-btn:hover { color: var(--text); border-color: rgba(0,200,224,0.30); }
        .pp-lang-btn-globe { font-size: 12px; line-height: 1; }
        .pp-back {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text3); text-decoration: none;
          border: 1px solid rgba(0,200,224,0.12); border-radius: 8px;
          padding: 8px 16px; transition: all .2s;
          background: rgba(13,27,46,0.60); backdrop-filter: blur(18px);
          display: flex; align-items: center; gap: 6px;
        }
        .pp-back:hover { color: var(--text); border-color: rgba(0,200,224,0.30); }

        /* ── Hero ── */
        .pp-hero {
          margin-top: 72px;
          margin-bottom: 52px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .pp-hero-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--red); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .pp-hero-eyebrow::after {
          content: ''; display: block;
          width: 40px; height: 1px;
          background: var(--red); opacity: 0.5;
        }
        .pp-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 6vw, 78px);
          font-weight: 800; line-height: 0.95;
          letter-spacing: -0.03em; color: #F8FAFC;
          margin-bottom: 24px;
        }
        .pp-hero h1 .accent {
          color: #A8D8FF;
          -webkit-text-stroke: 0;
        }
        .pp-hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 300;
          color: rgba(160,200,224,0.60);
          max-width: 520px; line-height: 1.68;
        }
        .pp-meta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--text3);
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 6px 16px; margin-top: 24px;
          backdrop-filter: blur(18px);
        }
        .pp-meta-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 10px var(--red), 0 0 22px rgba(232,55,42,0.35);
          animation: breathe 2.4s ease infinite;
        }

        /* ── Intro card ── */
        .pp-intro {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px 32px; margin-bottom: 32px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 300;
          color: var(--text2); line-height: 1.75;
          animation: fadeUp .55s .08s ease both;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          position: relative; overflow: hidden;
        }
        .pp-intro::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--red), var(--cyan), transparent);
        }
        .pp-intro strong { color: var(--text); font-weight: 500; }

        /* ── Content sections ── */
        .pp-sections { display: flex; flex-direction: column; gap: 16px; }

        .pp-section {
          background: var(--surface);
          border: 1px solid var(--border); border-radius: var(--radius);
          overflow: hidden; position: relative;
          animation: fadeUp .55s ease both;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          scroll-margin-top: 80px;
        }
        .pp-section:nth-child(1) { animation-delay: .10s; }
        .pp-section:nth-child(2) { animation-delay: .16s; }
        .pp-section:nth-child(3) { animation-delay: .22s; }
        .pp-section::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--cyan), transparent);
        }

        .pp-section-head {
          display: flex; align-items: center; gap: 14px;
          padding: 22px 28px;
          border-bottom: 1px solid var(--border);
          background: rgba(0,200,224,0.04);
        }
        .pp-section-icon { font-size: 22px; line-height: 1; }
        .pp-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          letter-spacing: -0.02em; color: var(--text);
        }

        .pp-section-body {
          padding: 20px 28px;
          display: flex; flex-direction: column; gap: 0;
        }

        .pp-item {
          display: flex; gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }
        .pp-item:last-child { border-bottom: none; }
        .pp-item-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--cyan); margin-top: 6px; flex-shrink: 0;
          box-shadow: 0 0 8px rgba(0,200,224,0.4);
        }
        .pp-item-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          color: var(--text); margin-bottom: 5px;
        }
        .pp-item-detail {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 300;
          color: var(--text2); line-height: 1.65;
        }

        /* ── Notice ── */
        .pp-notice {
          margin-top: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          color: var(--text2); line-height: 1.65;
          animation: fadeUp .55s .28s ease both;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        }
        .pp-notice::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--green), transparent);
        }
        .pp-notice strong { color: var(--text); font-weight: 500; }

        /* ── CTA ── */
        .pp-cta {
          margin-top: 16px;
          background: var(--surface);
          border: 1px solid rgba(232,55,42,0.20);
          border-radius: var(--radius);
          padding: 32px 36px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 24px;
          animation: fadeUp .55s .32s ease both;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          position: relative; overflow: hidden;
        }
        .pp-cta::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--red), rgba(232,55,42,0.3), transparent);
        }
        .pp-cta-text h3 {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800;
          letter-spacing: -0.02em; color: var(--text);
          margin-bottom: 6px;
        }
        .pp-cta-text p {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          color: var(--text3); line-height: 1.5; max-width: 380px;
        }
        .pp-cta-btn {
          flex-shrink: 0;
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'DM Sans', sans-serif;
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
        .pp-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(232,55,42,0.50);
        }

        /* ── Breadcrumb ── */
        .pp-breadcrumb {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 400;
          color: var(--text3); margin-bottom: 28px;
          animation: fadeUp .4s ease both;
        }
        .pp-breadcrumb a {
          color: var(--text3); text-decoration: none; transition: color .2s;
        }
        .pp-breadcrumb a:hover { color: var(--cyan); }
        .pp-breadcrumb-sep { opacity: .4; }
        .pp-breadcrumb-current { color: var(--red); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 760px) {
          .pp-wrap { padding: 0 18px 100px; }
          .pp-hero h1 { font-size: 38px; }
          .pp-hero { margin-top: 48px; margin-bottom: 36px; }
          .pp-section-head { padding: 18px 20px; }
          .pp-section-body { padding: 16px 20px; }
          .pp-intro { padding: 20px 20px; }
          .pp-cta { flex-direction: column; align-items: flex-start; padding: 22px 20px; }
          .pp-notice { padding: 20px 20px; }
        }

        @media (max-width: 480px) {
          .pp-hero h1 { font-size: 32px; }
          .pp-section-title { font-size: 15px; }
        }
      `}</style>

      <div className="pp">
        {/* ── Background ── */}
        <div className="pp-bg">
          <img src={emergencyBg} alt="" className="pp-bg-img" aria-hidden="true" />
          <div className="pp-bg-overlay" />
          <div className="pp-bg-atmosphere" />
          <div className="pp-bg-grain" />
        </div>

        <div className="pp-wrap">

          {/* ── Nav ── */}
          <nav className="pp-nav">
            <Link to="/" className="pp-logo">
              <span className="pp-logo-dot" />
              DumaSafeGuide
            </Link>
            <div className="pp-nav-actions">
              <button
                type="button"
                className="pp-lang-btn"
                onClick={() => setLang(lang === "en" ? "fil" : "en")}
                aria-label="Switch language"
              >
                <span className="pp-lang-btn-globe">🌐</span>
                {t.langLabel}
              </button>
            </div>
          </nav>

          {/* ── Hero ── */}
          <section className="pp-hero">
            <div className="pp-breadcrumb">
              <a href="/resources">{t.breadcrumb[0]}</a>
              <span className="pp-breadcrumb-sep">›</span>
              <a href="/terms">{t.breadcrumb[1]}</a>
              <span className="pp-breadcrumb-sep">›</span>
              <span className="pp-breadcrumb-current">{t.breadcrumb[2]}</span>
            </div>

            <div className="pp-hero-eyebrow">{t.eyebrow}</div>
            <h1>
              {t.titleLine1} <span className="accent">{t.titleAccent}</span>
            </h1>
            <p className="pp-hero-sub">{t.heroSub}</p>
            <div className="pp-meta">
              <div className="pp-meta-dot" />
              {t.meta}
            </div>
          </section>

          {/* ── Intro ── */}
          <div className="pp-intro">
            <strong>{t.introStrong}</strong> {t.introRest}
          </div>

          {/* ── Content sections ── */}
          <div className="pp-sections">
            {t.sections.map((section) => (
              <div key={section.id} id={section.id} className="pp-section">
                <div className="pp-section-head">
                  <span className="pp-section-icon">{section.icon}</span>
                  <span className="pp-section-title">{section.heading}</span>
                </div>
                <div className="pp-section-body">
                  {section.items.map((item) => (
                    <div key={item.label} className="pp-item">
                      <div className="pp-item-dot" />
                      <div>
                        <div className="pp-item-label">{item.label}</div>
                        <p className="pp-item-detail">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Notice ── */}
          <div className="pp-notice">
            <strong>{t.noticeStrong}</strong> {t.noticeRest}
          </div>

          {/* ── CTA ── */}
          <div className="pp-cta">
            <div className="pp-cta-text">
              <h3>{t.ctaHeading}</h3>
              <p>{t.ctaSub}</p>
            </div>
            <a href="/report" className="pp-cta-btn">
              <span>🚨</span> {t.ctaBtn}
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
