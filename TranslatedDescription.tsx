// src/components/TranslatedDescription.tsx
//
// Shared display component for Dispatch.tsx, IncidentsPage.tsx, and
// ResponderAlertsPage.tsx. Shows the English translation by default with
// a toggle to reveal the original submitted text, plus a "Google
// Translate" label so staff know it's machine-translated, not certified.

import { useState } from "react";

interface TranslatedDescriptionProps {
  description: string;
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
    return <p className={className}>{description}</p>;
  }

  const langLabel = LANG_LABELS[descriptionLang] ?? descriptionLang;

  return (
    <div className={className}>
      <p>{showOriginal ? description : descriptionTranslated}</p>
      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
        <span title="Machine-translated by Google Translate, not a certified translation">
          Google Translate · original: {langLabel}
        </span>
        <button
          type="button"
          onClick={() => setShowOriginal((v) => !v)}
          className="underline hover:text-gray-700"
        >
          {showOriginal ? "Show translated (English)" : "Show original"}
        </button>
      </div>
    </div>
  );
}
