// src/lib/translateReport.ts
//
// Thin client wrapper around the `translate-report` Supabase Edge Function.
// Report.tsx calls this before inserting into the `reports` table so the
// Google Translate API key never touches the browser.

import { supabase } from "@/lib/supabaseClient"; // adjust to your actual client import

export interface TranslateReportResult {
  translatedText: string;
}

/**
 * Translates `text` from `sourceLang` to English via the translate-report
 * edge function. If the edge function call fails for any reason, this
 * throws — callers should decide whether to block submission or fall back
 * to storing the original text as the "translation" (see Report.tsx below).
 */
export async function translateReportText(
  text: string,
  sourceLang: string
): Promise<string> {
  const { data, error } = await supabase.functions.invoke<TranslateReportResult>(
    "translate-report",
    { body: { text, sourceLang } }
  );

  if (error) {
    throw new Error(`translate-report edge function failed: ${error.message}`);
  }

  if (!data?.translatedText) {
    throw new Error("translate-report edge function returned no translatedText");
  }

  return data.translatedText;
}
