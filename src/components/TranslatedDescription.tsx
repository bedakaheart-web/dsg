// src/components/TranslatedDescription.tsx
//
// Shared display component for Dispatch.tsx, IncidentsPage.tsx, and
// RespondersDashboard.tsx. Shows the English translation by default with
// a toggle to reveal the original submitted text, plus a "Google
// Translate" label so staff know it's machine-translated, not certified.
//
// When a `className` is supplied it is applied to the outer wrapper element
// so the caller's box / clamp / border styling still renders. When no class
// is supplied a plain <p> is rendered instead (no extra wrapper).

import { useState } from "react";

interface TranslatedDescriptionProps {
  description: string | null;
  descriptionLang: string | null;
  descriptionTranslated: string | null;
  className?: string;
}

const LANG_LABELS: Record<string, string> = {
  en: "English",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  tl: "Tagalog",
  ceb: "Cebuano",
};

const STYLES = `
  .td-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
    font-size: 11px;
    color: var(--text3, rgba(160,200,224,0.55));
    line-height: 1.5;
  }
  .td-toggle {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--cyan, #00c8e0);
    font-size: 11px;
    text-decoration: underline;
    padding: 0;
    font-family: inherit;
  }
  .td-toggle:hover { opacity: 0.75; }
`;

export function TranslatedDescription({
  description,
  descriptionLang,
  descriptionTranslated,
  className,
}: TranslatedDescriptionProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const isTranslated =
    !!descriptionLang && descriptionLang !== "en" && !!descriptionTranslated;

  // Already English, or no translation available — just show the text,
  // no toggle needed.
  if (!isTranslated) {
    return className ? (
      <div className={className}><p>{description}</p></div>
    ) : (
      <p>{description}</p>
    );
  }

  const langLabel = LANG_LABELS[descriptionLang] ?? descriptionLang;

  const body = (
    <>
      <p>{showOriginal ? description : descriptionTranslated}</p>
      <div className="td-meta">
        <span title="Machine-translated by MyMemory, not a certified translation">
          Machine-translated · original: {langLabel}
        </span>
        <button
          type="button"
          className="td-toggle"
          onClick={() => setShowOriginal((v) => !v)}
        >
          {showOriginal ? "Show translated (English)" : "Show original"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      {className ? <div className={className}>{body}</div> : body}
    </>
  );
}