// src/components/LanguageSelectModal.tsx
//
// Shows a full-screen language picker the very first time someone
// visits (before they can use the rest of the site). Once a language
// is chosen it's remembered (localStorage), so this won't show again
// on that device — but LanguageSwitcherBadge (below) lets them change
// it any time afterwards.
//
// Handles RTL languages (Arabic): the modal/menu mirror their layout
// via the `dir` attribute so text and alignment read correctly.

import { useState } from "react";
import { useLanguage, LANGUAGE_OPTIONS, Language, RTL_LANGUAGES } from "../context/LanguageContext";
import { FaGlobeAsia } from "react-icons/fa";

export function LanguageSelectModal() {
  const { hasChosenLanguage, setLanguage, t } = useLanguage();
  const [visible, setVisible] = useState(!hasChosenLanguage);

  if (!visible) return null;

  const choose = (lang: Language) => {
    setLanguage(lang);
    setVisible(false);
  };

  return (
    <>
      <style>{`
        .lsm-overlay {
          position: fixed; inset: 0; z-index: 100000;
          background: rgba(4, 10, 20, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: lsmFadeIn 0.35s ease both;
        }
        @keyframes lsmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .lsm-card {
          width: 100%; max-width: 420px;
          max-height: 88vh;
          display: flex; flex-direction: column;
          background: rgba(13, 27, 46, 0.96);
          border: 1px solid rgba(0, 200, 224, 0.20);
          border-radius: 18px;
          padding: 32px 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 48px rgba(0,200,224,0.08);
          text-align: center;
          animation: lsmSlideUp 0.4s 0.05s cubic-bezier(0.22,1,0.36,1) both;
          font-family: 'Inter', sans-serif;
        }
        @keyframes lsmSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .lsm-icon {
          width: 56px; height: 56px; margin: 0 auto 18px; flex-shrink: 0;
          border-radius: 50%;
          background: rgba(0, 200, 224, 0.12);
          border: 1.5px solid rgba(0, 200, 224, 0.35);
          display: flex; align-items: center; justify-content: center;
          color: #00c8e0; font-size: 22px;
        }
        .lsm-heading {
          font-family: 'Poppins', sans-serif;
          font-size: 21px; font-weight: 800; color: #F8FAFC;
          margin-bottom: 8px; flex-shrink: 0;
        }
        .lsm-sub {
          font-size: 13.5px; color: rgba(168,216,255,0.65);
          margin-bottom: 22px; line-height: 1.6; flex-shrink: 0;
        }
        .lsm-options {
          display: flex; flex-direction: column; gap: 10px;
          overflow-y: auto;
          padding-right: 4px;
          margin-right: -4px;
        }
        .lsm-options::-webkit-scrollbar { width: 6px; }
        .lsm-options::-webkit-scrollbar-thumb { background: rgba(0,200,224,0.25); border-radius: 3px; }
        .lsm-option {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 14px 18px;
          background: rgba(6, 15, 28, 0.85);
          border: 1.5px solid rgba(0, 200, 224, 0.16);
          border-radius: 12px;
          color: #ddeef8; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 14.5px; font-weight: 600;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .lsm-option:hover {
          border-color: rgba(0, 200, 224, 0.55);
          background: rgba(0, 200, 224, 0.08);
          transform: translateY(-2px);
        }
        .lsm-option-native {
          font-size: 12px; font-weight: 400; color: rgba(168,216,255,0.45);
        }
      `}</style>
      <div className="lsm-overlay" role="dialog" aria-modal="true" aria-label="Select your language">
        <div className="lsm-card">
          <div className="lsm-icon" aria-hidden="true">
            <FaGlobeAsia />
          </div>
          <div className="lsm-heading">{t("languageModal.heading")}</div>
          <div className="lsm-sub">{t("languageModal.subheading")}</div>
          <div className="lsm-options">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                type="button"
                className="lsm-option"
                dir={RTL_LANGUAGES.includes(opt.code) ? "rtl" : "ltr"}
                onClick={() => choose(opt.code)}
              >
                <span>{opt.label}</span>
                <span className="lsm-option-native">{opt.native}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Small persistent switcher so users can change their mind later ──
// Drop this anywhere in your navbar/header (not just the homepage).
export function LanguageSwitcherBadge() {
  const { language, setLanguage, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        .lsb-wrap { position: relative; }
        .lsb-trigger {
          display: flex; align-items: center; gap: 6px;
          background: rgba(0,200,224,0.08);
          border: 1px solid rgba(0,200,224,0.25);
          border-radius: 20px; padding: 6px 12px;
          color: #A8D8FF; font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: 'Inter', sans-serif;
        }
        .lsb-trigger:hover { background: rgba(0,200,224,0.16); }
        .lsb-menu {
          position: absolute; top: calc(100% + 8px);
          background: rgba(13,27,46,0.98);
          border: 1px solid rgba(0,200,224,0.2);
          border-radius: 10px; padding: 6px;
          min-width: 180px; max-height: 320px; overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }
        .lsb-menu.align-right { right: 0; }
        .lsb-menu.align-left { left: 0; }
        .lsb-item {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          width: 100%; text-align: left;
          padding: 8px 10px; border-radius: 6px; border: none;
          background: transparent; color: #ddeef8; font-size: 13px;
          cursor: pointer; font-family: 'Inter', sans-serif;
        }
        .lsb-item:hover { background: rgba(0,200,224,0.1); }
        .lsb-item.active { color: #00c8e0; font-weight: 700; }
        .lsb-item-native { font-size: 11px; color: rgba(168,216,255,0.4); }
      `}</style>
      <div className="lsb-wrap">
        <button type="button" className="lsb-trigger" onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open}>
          <FaGlobeAsia size={12} aria-hidden="true" />
          {LANGUAGE_OPTIONS.find((o) => o.code === language)?.label ?? "Language"}
        </button>
        {open && (
          <div className={`lsb-menu ${isRTL ? "align-left" : "align-right"}`} role="menu">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                type="button"
                role="menuitem"
                dir={RTL_LANGUAGES.includes(opt.code) ? "rtl" : "ltr"}
                className={`lsb-item${opt.code === language ? " active" : ""}`}
                onClick={() => {
                  setLanguage(opt.code);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                <span className="lsb-item-native">{opt.native}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
