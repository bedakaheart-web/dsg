// supabase/functions/translate-report/index.ts
//
// Uses MyMemory Translation API — no API key, no billing account required.
// Free tier: 5,000 words/day per IP (anonymous), or 50,000/day if you
// register a contact email (set MYMEMORY_CONTACT_EMAIL as a secret to
// raise your limit — this is optional).
//
// Deploy with: supabase functions deploy translate-report
// Optional:    supabase secrets set MYMEMORY_CONTACT_EMAIL=you@example.com

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const CONTACT_EMAIL = Deno.env.get("MYMEMORY_CONTACT_EMAIL"); // optional, raises rate limit

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // tighten to your domain in production
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { text, sourceLang } = await req.json();

    if (!text || !sourceLang) {
      return new Response(
        JSON.stringify({ error: "text and sourceLang are required" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // Already English — skip the API call entirely
    if (sourceLang === "en") {
      return new Response(
        JSON.stringify({ translatedText: text }),
        { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const langPair = `${sourceLang}|en`;
    const params = new URLSearchParams({
      q: text,
      langpair: langPair,
    });
    if (CONTACT_EMAIL) {
      params.set("de", CONTACT_EMAIL);
    }

    const res = await fetch(
      `https://api.mymemory.translated.net/get?${params.toString()}`
    );

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({ error: `MyMemory API error: ${errText}` }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();

    // MyMemory returns responseStatus as a string or number depending on
    // the error path, so check loosely and validate the actual field.
    const translatedText: string | null = data?.responseData?.translatedText ?? null;

    if (!translatedText) {
      return new Response(
        JSON.stringify({ error: "No translation returned", raw: data }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // MyMemory sometimes echoes back an error message as "translatedText"
    // instead of failing the HTTP status (e.g. quota exceeded). Catch the
    // common case so callers don't silently store an error string.
    if (translatedText.startsWith("MYMEMORY WARNING") || translatedText.includes("QUOTA")) {
      return new Response(
        JSON.stringify({ error: translatedText }),
        { status: 429, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ translatedText }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
