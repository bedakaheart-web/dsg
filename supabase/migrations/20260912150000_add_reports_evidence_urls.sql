-- Migration: multi-file evidence URLs on reports
-- Deploy with: npx supabase db push
-- (or paste into the Supabase SQL Editor and run once)
--
-- The report form now attaches multiple evidence files (uploads + camera
-- captures). All public URLs persist in evidence_urls; evidence_url keeps
-- the first URL so every existing reader keeps working unchanged.

ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS evidence_urls text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN reports.evidence_urls IS
  'All evidence file public URLs for the report; evidence_url mirrors element [1] for backward compatibility.';
