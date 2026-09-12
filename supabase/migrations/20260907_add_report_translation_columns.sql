-- Migration: add translation columns to reports
-- Deploy with: supabase db push
-- (or paste into the Supabase SQL editor and run once)

alter table reports
  add column if not exists description_lang text,
  add column if not exists description_translated text;

-- Constrain description_lang to ISO 639-1-ish codes we actually support.
-- Done in a plpgsql block so it is idempotent on Postgres versions that
-- don't support "add constraint if not exists".
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'reports_description_lang_check'
  ) then
    alter table reports
      add constraint reports_description_lang_check
      check (
        description_lang is null
        or description_lang in ('en', 'ru', 'ja', 'ko', 'zh', 'ar', 'tl', 'ceb')
      );
  end if;
end
$$;

-- Backfill existing rows: treat any existing description as English source
-- with no translation needed. Safe to run even if the table is empty.
update reports
set
  description_lang = coalesce(description_lang, 'en'),
  description_translated = coalesce(description_translated, description)
where description_lang is null;

-- Helpful index if you ever filter/search on language (e.g. dashboards
-- that show "reports submitted in non-English languages")
create index if not exists idx_reports_description_lang
  on reports (description_lang);

comment on column reports.description_lang is
  'ISO language code of the original submitted description, e.g. "ru", "ja". Set client-side from LanguageContext.';
comment on column reports.description_translated is
  'English translation of description, produced server-side by the translate-report edge function (MyMemory). Falls back to original text when source is already English or translation fails.';