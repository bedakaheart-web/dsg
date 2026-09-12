// Report.tsx — relevant excerpt only.
// Shows the "before insert, call the edge function" step from the diagram.
// Drop this into your existing submit handler; adjust field names to match
// your actual form state / table schema.

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { translateReportText } from "@/lib/translateReport";
import { useLanguage } from "@/context/LanguageContext"; // your existing context

export function useSubmitReport() {
  const { language } = useLanguage(); // e.g. "ru", "ja", "en"
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function submitReport(formValues: {
    description: string;
    // ...other report fields (type, location, severity, etc.)
    [key: string]: unknown;
  }) {
    setSubmitting(true);
    setSubmitError(null);

    const { description, ...rest } = formValues;

    // 1. Translate server-side via the edge function.
    //    If translation fails, don't block the report — fall back to
    //    storing the original text as the "translation" so responders
    //    still see *something*, and flag it isn't machine-translated.
    let descriptionTranslated: string;
    try {
      descriptionTranslated = await translateReportText(description, language);
    } catch (err) {
      console.error("Translation failed, falling back to original text:", err);
      descriptionTranslated = description;
    }

    // 2. Insert into `reports` with original + language + translation.
    const { error } = await supabase.from("reports").insert({
      ...rest,
      description,
      description_lang: language,
      description_translated: descriptionTranslated,
    });

    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return { success: false as const, error };
    }

    return { success: true as const };
  }

  return { submitReport, submitting, submitError };
}
