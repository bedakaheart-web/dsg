// src/components/Footer.tsx
import "./Footer.css";

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaShieldAlt,
  FaMapMarkedAlt,
  FaClipboardList,
  FaLightbulb,
  FaHeart,
  FaPhone,
  FaInfoCircle,
  FaBook,
  FaLock,
  FaFileAlt,
  FaAddressBook,
  FaChevronDown,
} from "react-icons/fa";

import dsgLogo  from "../assets/dsg.logo.png";
import footerBg from "../assets/footer.png";
import { useLanguage } from "../context/LanguageContext";

const FONT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  @keyframes ambulanceStrobe {
    0%   { box-shadow: 0 0 8px rgba(232,55,42,0.40), 0 0 20px rgba(232,55,42,0.20), 0 0 40px rgba(232,55,42,0.08); border-color: rgba(232,55,42,0.55); }
    25%  { box-shadow: 0 0 16px rgba(232,55,42,0.90), 0 0 36px rgba(232,55,42,0.55), 0 0 64px rgba(232,55,42,0.25); border-color: rgba(232,55,42,1); }
    50%  { box-shadow: 0 0 6px rgba(232,55,42,0.30), 0 0 14px rgba(232,55,42,0.15), 0 0 28px rgba(232,55,42,0.06); border-color: rgba(232,55,42,0.40); }
    75%  { box-shadow: 0 0 18px rgba(232,55,42,0.95), 0 0 40px rgba(232,55,42,0.60), 0 0 70px rgba(232,55,42,0.28); border-color: rgba(232,55,42,1); }
    100% { box-shadow: 0 0 8px rgba(232,55,42,0.40), 0 0 20px rgba(232,55,42,0.20), 0 0 40px rgba(232,55,42,0.08); border-color: rgba(232,55,42,0.55); }
  }
  @keyframes iconPulse {
    0%, 100% { background: rgba(232,55,42,0.20); border-color: rgba(232,55,42,0.50); }
    25%, 75%  { background: rgba(232,55,42,0.40); border-color: rgba(232,55,42,0.90); }
    50%       { background: rgba(232,55,42,0.15); border-color: rgba(232,55,42,0.35); }
  }
  @keyframes textFlicker {
    0%, 100% { color: rgba(255,120,100,0.90); }
    25%, 75%  { color: rgba(255,160,140,1); }
    50%       { color: rgba(255,100,80,0.75); }
  }
`;

interface FooterLink {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface Hotline {
  label: string;
  number: string;
  dialNumber: string;
  color: string;
  bg: string;
  pulse?: boolean;
}

const HIDDEN_PATHS = ["/signup"];

export default function Footer() {
  const location = useLocation();
  const year     = new Date().getFullYear();
  const [openCol, setOpenCol] = useState<string | null>(null);
  const { t } = useLanguage();

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  const toggle = (h: string) => setOpenCol(p => p === h ? null : h);

  // ── Nav columns & hotlines built from translations (labels change with language) ──
  const FOOTER_NAV: FooterColumn[] = [
    {
      heading: t("footer.navHeading"),
      links: [
        { label: t("footer.links.safetyMap"),         to: "/map",        icon: <FaMapMarkedAlt size={11} /> },
        { label: t("footer.links.reportIncident"),    to: "/report",     icon: <FaClipboardList size={11} /> },
        { label: t("footer.links.safetyTips"),        to: "/safetytips", icon: <FaLightbulb size={11} /> },
        { label: t("footer.links.emergencyContacts"), to: "/directory",  icon: <FaAddressBook size={11} /> },
      ],
    },
    {
      heading: t("footer.aboutHeading"),
      links: [
        { label: t("footer.links.aboutDsg"),      to: "/about",     icon: <FaInfoCircle size={11} /> },
        { label: t("footer.links.resources"),     to: "/resources", icon: <FaBook size={11} /> },
        { label: t("footer.links.privacyPolicy"), to: "/privacy",   icon: <FaLock size={11} /> },
        { label: t("footer.links.termsOfUse"),    to: "/terms",     icon: <FaFileAlt size={11} /> },
      ],
    },
  ];

  const HOTLINES: Hotline[] = [
    { label: t("footer.hotlineLabels.emergency"), number: "911",  dialNumber: "911",  color: "#FF4444", bg: "rgba(255,68,68,0.10)",  pulse: true },
    { label: t("footer.hotlineLabels.ndrrmc"),    number: "8911", dialNumber: "8911", color: "#F4A261", bg: "rgba(244,162,97,0.10)" },
    { label: t("footer.hotlineLabels.bfpFire"),   number: "160",  dialNumber: "160",  color: "#F39C12", bg: "rgba(243,156,18,0.10)" },
    { label: t("footer.hotlineLabels.pnp"),       number: "117",  dialNumber: "117",  color: "#60B4FF", bg: "rgba(96,180,255,0.10)" },
  ];

  return (
    <footer className="ft">
      <style>{FONT_CSS}</style>

      <div className="ft-scrim" style={{ backgroundImage: `url(${footerBg})` }} />
      <div className="ft-glow-left"  aria-hidden="true" />
      <div className="ft-glow-right" aria-hidden="true" />

      <div className="ft-inner">

        {/* STATUS STRIP */}
        <div className="ft-status-strip">
          <div className="ft-status-left">
            <span className="ft-status-dot" />
            <span className="ft-status-city">Dumaguete City</span>
            <span className="ft-status-sep">·</span>
            <span className="ft-status-text">{t("footer.statusOperational")}</span>
          </div>
          <div className="ft-status-right">
            <FaShieldAlt size={10} color="rgba(0,200,224,0.55)" />
            <span>{t("footer.statusActive")}</span>
          </div>
        </div>

        {/* HOTLINES */}
        <div className="ft-hotlines">
          <div className="ft-hotlines-head">
            <FaPhone size={12} color="#e8372a" />
            <span className="ft-hotlines-label">{t("footer.hotlinesLabel")}</span>
            <span className="ft-hotlines-hint">{t("footer.hotlinesHint")}</span>
          </div>
          <div className="ft-hotlines-row">

            {/* ── Emergency 911 — homepage pill style ── */}
            <a
              href="tel:911"
              title="Call Emergency: 911"
              aria-label="Call Emergency 911"
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(10,18,30,0.88)",
                border: "1px solid rgba(232,55,42,0.55)",
                borderRadius: 20,
                padding: "4px 14px 4px 7px",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                textDecoration: "none",
                cursor: "pointer",
                animation: "ambulanceStrobe 1.8s ease-in-out infinite",
                transition: "all 0.2s ease",
                alignSelf: "center",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.animationPlayState = "paused";
                el.style.background = "rgba(232,55,42,0.15)";
                el.style.borderColor = "rgba(232,55,42,0.90)";
                el.style.boxShadow = "0 0 24px rgba(232,55,42,0.80), 0 0 48px rgba(232,55,42,0.40)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.animationPlayState = "running";
                el.style.background = "rgba(10,18,30,0.88)";
                el.style.borderColor = "rgba(232,55,42,0.55)";
                el.style.boxShadow = "";
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "rgba(232,55,42,0.20)",
                border: "1px solid rgba(232,55,42,0.50)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                animation: "iconPulse 1.8s ease-in-out infinite",
              }}>
                <FaPhone size={9} color="#ff6b5b" />
              </div>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10, fontWeight: 700,
                color: "rgba(255,120,100,0.90)",
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
                lineHeight: 1,
                animation: "textFlicker 1.8s ease-in-out infinite",
              }}>
                {t("footer.emergencyPill")}
              </span>
              <span style={{
                width: 1, height: 10,
                background: "rgba(232,55,42,0.30)",
                margin: "0 1px",
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12, fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                lineHeight: 1,
                textShadow: "0 0 8px rgba(232,55,42,0.60)",
              }}>
                911
              </span>
            </a>

            {/* ── Other hotline cards — unchanged ── */}
            {HOTLINES.filter(h => !h.pulse).map((h) => (
              <a
                key={h.label}
                href={`tel:${h.dialNumber}`}
                className="ft-hotline-card"
                style={{
                  "--hc-color": h.color,
                  "--hc-bg":    h.bg,
                } as React.CSSProperties}
                title={`Call ${h.label}: ${h.number}`}
              >
                <div className="ft-hc-icon-wrap">
                  <FaPhone size={13} />
                </div>
                <div className="ft-hc-body">
                  <span className="ft-hc-num">{h.number}</span>
                  <span className="ft-hc-label">{h.label}</span>
                </div>
              </a>
            ))}

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="ft-main">
          <div className="ft-brand-col">
            <Link to="/" className="ft-brand-lockup">
              <img src={dsgLogo} alt="DumaSafeGuide" className="ft-brand-logo" />
              <span className="ft-brand-name">
                Duma<em>Safe</em><strong>Guide</strong>
              </span>
            </Link>
            <p className="ft-brand-desc">
              {t("footer.brandDesc")}
            </p>
            <div className="ft-brand-badge">
              <span className="ft-badge-dot" />
              {t("footer.brandBadge")}
            </div>
          </div>

          {FOOTER_NAV.map((col) => {
            const isOpen = openCol === col.heading;
            return (
              <div key={col.heading} className={`ft-nav-col${isOpen ? " is-open" : ""}`}>
                <button
                  className="ft-col-toggle"
                  aria-expanded={isOpen}
                  onClick={() => toggle(col.heading)}
                >
                  <span className="ft-col-head">{col.heading}</span>
                  <FaChevronDown size={10} className="ft-col-chevron" />
                </button>
                <ul className="ft-col-links">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="ft-col-link">
                        {l.icon && <span className="ft-link-icon">{l.icon}</span>}
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="ft-rule" />

        <div className="ft-bottom">
          <p className="ft-copy">
            &copy; {year} DumaSafeGuide &mdash; {t("footer.rightsReserved")}
          </p>
          <p className="ft-love">
            {t("footer.builtWithPrefix")} <FaHeart size={10} color="#e8372a" aria-label="love" /> {t("footer.builtWithSuffix")}
          </p>
        </div>

      </div>
    </footer>
  );
}