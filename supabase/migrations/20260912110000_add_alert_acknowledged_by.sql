-- Migration: per-responder alert acknowledgements
-- Deploy with: supabase db push
-- (or paste into the Supabase SQL editor and run once)
--
-- Adds alerts.acknowledged_by (array of profiles.id that acknowledged).
-- Client updates best-effort; local read/ack tracking remains the fallback
-- if RLS denies the write.

alter table alerts
  add column if not exists acknowledged_by uuid[] not null default '{}';

create index if not exists idx_alerts_acknowledged_by
  on alerts using gin (acknowledged_by);

comment on column alerts.acknowledged_by is
  'IDs of responders who acknowledged this alert (appended client-side).';
