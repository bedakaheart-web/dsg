import { Link } from "react-router-dom";
import emergencyBg from "../assets/emergency.jpg";
import { useLanguage } from "../context/LanguageContext";

const SECTION_META = [
  { id: "responsibilities", icon: "👤", accent: "#2ECC8F", accentRgb: "46,204,143", key: "responsibilities", clauses: ["accurate", "appropriate", "security"] },
  { id: "privacy", icon: "🔒", accent: "#5B8DEF", accentRgb: "91,141,239", key: "privacy", clauses: ["collect", "retention", "thirdParty"] },
  { id: "ra10175", icon: "📜", accent: "#F5C842", accentRgb: "245,200,66", key: "ra10175", clauses: ["act", "prohibited", "reporting"] },
  { id: "disclaimer", icon: "⚠️", accent: "#EF5B5B", accentRgb: "239,91,91", key: "disclaimer", clauses: ["noGuarantee", "availability", "accuracy"] },
] as const;

export default function TermsOfUse() {
  const { t, isRTL } = useLanguage();

  return (
    <>
      <style>{`
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

        .tos {
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: var(--text);
          background: var(--bg);
          position: relative;
          overflow-x: hidden;
        }

        .tos-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
        .tos-bg-img {
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

        .tos-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7,16,29,0.82) 0%,
            rgba(7,16,29,0.68) 40%,
            rgba(7,16,29,0.82) 75%,
            rgba(7,16,29,0.97) 100%
          );
        }
        .tos-bg-atmosphere {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 10% 0%,  rgba(232,55,42,0.09)  0%, transparent 65%),
            radial-gradient(ellipse 55% 60% at 90% 100%, rgba(0,200,224,0.07)  0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 55% 45%,  rgba(13,27,46,0.40)   0%, transparent 60%);
        }
        .tos-bg-grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          background-size: 200px; opacity: 0.45; pointer-events: none;
        }

        .tos-wrap {
          position: relative; z-index: 1;
          max-width: 1080px; margin: 0 auto;
          padding: 0 28px 120px;
        }

        .tos-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 0 0;
          animation: fadeUp .5s ease both;
        }
        .tos-logo {
          display: flex; align-items: center; gap: 10px; text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text);
        }
        .tos-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 12px var(--red), 0 0 24px rgba(232,55,42,0.4);
          animation: breathe 2.4s ease infinite;
        }
        @keyframes breathe {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.55; transform:scale(.78); }
        }
        .tos-back {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text3); text-decoration: none;
          border: 1px solid rgba(0,200,224,0.12); border-radius: 8px;
          padding: 8px 16px; transition: all .2s;
          background: rgba(13,27,46,0.60); backdrop-filter: blur(18px);
          display: flex; align-items: center; gap: 6px;
        }
        .tos-back:hover { color: var(--text); border-color: rgba(0,200,224,0.30); }

        .tos-hero {
          margin-top: 72px;
          margin-bottom: 52px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .tos-hero-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--red); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .tos-hero-eyebrow::after {
          content: ''; display: block;
          width: 40px; height: 1px;
          background: var(--red); opacity: 0.5;
        }
        .tos-hero h1 {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(42px, 6vw, 78px);
          font-weight: 700; line-height: 0.95;
          letter-spacing: -0.03em; color: #F8FAFC;
          margin-bottom: 24px;
        }
        .tos-hero h1 .accent {
          color: #A8D8FF;
          -webkit-text-stroke: 0;
        }
        .tos-hero-sub {
          font-family: 'Inter', sans-serif;
          font-size: 16px; font-weight: 300;
          color: rgba(160,200,224,0.60);
          max-width: 520px; line-height: 1.68;
        }
        .tos-meta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--text3);
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 6px 16px; margin-top: 24px;
          backdrop-filter: blur(18px);
        }
        .tos-meta-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 10px var(--red), 0 0 22px rgba(232,55,42,0.35);
          animation: breathe 2.4s ease infinite;
        }

        .tos-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: var(--text3); margin-bottom: 14px;
        }

        .tos-section-list { display: flex; flex-direction: column; gap: 13px; }

        .tos-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: 2px solid var(--s-accent);
          border-radius: var(--radius); padding: 26px 28px;
          position: relative; overflow: hidden;
          transition: transform .22s, border-color .22s, box-shadow .22s;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          scroll-margin-top: 80px;
        }
        .tos-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 0% 0%, var(--s-dim), transparent 70%);
          pointer-events: none;
        }
        .tos-card:hover {
          transform: translateY(-3px);
          border-color: var(--s-accent);
          box-shadow: 0 0 20px var(--s-dim), 0 8px 28px rgba(0,0,0,0.4);
        }

        .tos-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; margin-bottom: 16px;
          position: relative; z-index: 1;
        }
        .tos-card-icon { font-size: 26px; line-height: 1; }
        .tos-card-tag {
          font-family: 'Inter', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--s-accent); border: 1px solid var(--s-accent);
          border-radius: 3px; padding: 3px 7px; opacity: .75;
        }
        .tos-card-title {
          font-family: 'Poppins', sans-serif;
          font-size: 18px; font-weight: 700;
          letter-spacing: -0.02em; color: var(--text);
          margin-bottom: 16px; position: relative; z-index: 1;
        }

        .tos-clauses {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 14px;
        }
        .tos-clause-heading {
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          color: var(--text); margin-bottom: 4px;
        }
        .tos-clause-body {
          font-family: 'Inter', sans-serif;
          font-size: 13.5px; font-weight: 300;
          color: var(--text2); line-height: 1.7;
        }

        .tos-cta {
          background: var(--surface);
          border: 1px solid rgba(232,55,42,0.20);
          border-radius: var(--radius); padding: 32px 36px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 24px;
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          position: relative; overflow: hidden;
        }
        .tos-cta::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--red), rgba(232,55,42,0.3), transparent);
        }
        .tos-cta-text h3 {
          font-family: 'Poppins', sans-serif;
          font-size: 18px; font-weight: 700;
          letter-spacing: -0.02em; color: var(--text);
          margin-bottom: 6px;
        }
        .tos-cta-text p {
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 300;
          color: var(--text3); line-height: 1.5; max-width: 380px;
        }
        .tos-cta-btn {
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
        .tos-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(232,55,42,0.50);
        }

        .tos-section { margin-bottom: 40px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 760px) {
          .tos-wrap { padding: 0 18px 100px; }
          .tos-hero h1 { font-size: 38px; }
          .tos-hero { margin-top: 48px; margin-bottom: 36px; }
          .tos-cta { flex-direction: column; align-items: flex-start; padding: 24px 22px; }
          .tos-card { padding: 20px 20px; }
        }

        @media (max-width: 480px) {
          .tos-hero h1 { font-size: 32px; }
        }
      `}</style>

      <div className="tos" dir={isRTL ? "rtl" : "ltr"}>
        <div className="tos-bg">
          <img src={emergencyBg} alt="" className="tos-bg-img" aria-hidden="true" />
          <div className="tos-bg-overlay" />
          <div className="tos-bg-atmosphere" />
          <div className="tos-bg-grain" />
        </div>

        <div className="tos-wrap">

         
          <section className="tos-hero">
            <div className="tos-hero-eyebrow">{t("terms.eyebrow")}</div>
            <h1>
              {t("terms.titleLine1")} <span className="accent">{t("terms.titleAccent")}</span>
            </h1>
            <p className="tos-hero-sub">{t("terms.sub")}</p>
            <div className="tos-meta">
              <span className="tos-meta-dot" />
              {t("terms.meta")}
            </div>
          </section>

          <div className="tos-section">
            <div className="tos-label">{t("terms.sectionsLabel")}</div>
            <div className="tos-section-list">
              {SECTION_META.map((s) => (
                <div
                  key={s.id}
                  id={s.id}
                  className="tos-card"
                  style={{
                    "--s-accent": s.accent,
                    "--s-dim":    `rgba(${s.accentRgb},0.10)`,
                  } as React.CSSProperties}
                >
                  <div className="tos-card-top">
                    <span className="tos-card-icon">{s.icon}</span>
                    <span className="tos-card-tag">{t(`terms.sections.${s.key}.tag`)}</span>
                  </div>
                  <div className="tos-card-title">{t(`terms.sections.${s.key}.title`)}</div>
                  <div className="tos-clauses">
                    {s.clauses.map((c) => (
                      <div key={c}>
                        <div className="tos-clause-heading">{t(`terms.sections.${s.key}.${c}.heading`)}</div>
                        <p className="tos-clause-body">{t(`terms.sections.${s.key}.${c}.body`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tos-section">
            <div className="tos-cta">
              <div className="tos-cta-text">
                <h3>{t("terms.ctaHeading")}</h3>
                <p>{t("terms.ctaSub")}</p>
              </div>
              <Link to="/report" className="tos-cta-btn">🚨 {t("terms.ctaBtn")}</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}