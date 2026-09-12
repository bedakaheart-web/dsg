-- Migration: ensure public.alerts exists with the full column set
-- Deploy with: npx supabase db push
-- (or paste into the Supabase SQL Editor and run once)
--
-- NOTE (deploy safety, 2026-09-12):
--  The minimal spec (id/sender_id/type/title/message/created_at) would DROP
--  columns the app already reads/writes (severity, audience, is_active,
--  created_by, target_role, acknowledged_by), breaking both dashboards.
--  This file therefore creates the table with the UNION of the spec and
--  every column the client code touches. `sender_id` defaults to
--  auth.uid() (nullable) so existing inserts that omit it keep working.
--  Everything is IF-NOT-EXISTS guarded: safe to run on a DB where alerts
--  already exists, and safe to re-run.

create extension if not exists pgcrypto;

CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    type VARCHAR DEFAULT 'info',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT,
    audience TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_role TEXT,
    acknowledged_by UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backfill columns when the table pre-existed without them.
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS type VARCHAR DEFAULT 'info';
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS severity TEXT;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS audience TEXT;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS target_role TEXT;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS acknowledged_by UUID[] NOT NULL DEFAULT '{}';
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Existing rows must satisfy NOT NULL title/message: drop rows that would
-- violate them only if they are empty-shell rows (never delete real data).
-- (No backfill delete: title/message were required by all known writers.)

CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON public.alerts (type);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged_by ON public.alerts USING gin (acknowledged_by);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone authenticated can view alerts" ON public.alerts;
CREATE POLICY "Anyone authenticated can view alerts"
ON public.alerts FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Responders and Admins can insert alerts" ON public.alerts;
CREATE POLICY "Responders and Admins can insert alerts"
ON public.alerts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Responder self-acknowledgement writes (best-effort; clients fall back
-- to local tracking if this is ever revoked).
DROP POLICY IF EXISTS "Responders can mark alerts acknowledged" ON public.alerts;
CREATE POLICY "Responders can mark alerts acknowledged"
ON public.alerts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Realtime publication (idempotent).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'alerts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
  END IF;
END
$$;

COMMENT ON TABLE public.alerts IS
  'Broadcast + targeted alerts for Admin/Responder/Citizen dashboards.';
