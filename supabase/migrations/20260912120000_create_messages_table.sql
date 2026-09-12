-- Migration: real-time side-chat messages table (canonical spec)
-- Deploy with: npx supabase db push
-- (or paste into the Supabase SQL Editor and run once)
--
-- NOTE (deploy safety, 2026-09-12):
--  1. The app tracks incidents in `reports` — there is no `public.incidents`
--     table in this project, so a hard `REFERENCES public.incidents(id)`
--     would abort the whole migration. `incident_id` is therefore created
--     as a plain nullable UUID, with the FK added conditionally below only
--     if `public.incidents` ever appears.
--  2. Policy creation is DROP-IF-EXISTS guarded and the realtime
--     publication add is membership-checked, so this file is safe to run
--     alongside supabase/migrations/20260912_create_side_chat_messages.sql
--     (which already provisions an equivalent table/policies keyed to
--     profiles(id)) in any order, and safe to re-run.

-- Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    incident_id UUID,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional FK: only attached if public.incidents exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'incidents'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'messages_incident_id_fkey'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_incident_id_fkey
      FOREIGN KEY (incident_id) REFERENCES public.incidents(id) ON DELETE SET NULL;
  END IF;
END
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view messages sent by or to them (or broadcast messages where receiver_id is NULL)
DROP POLICY IF EXISTS "Users can view their own direct or broadcast messages" ON public.messages;
CREATE POLICY "Users can view their own direct or broadcast messages"
ON public.messages FOR SELECT
TO authenticated
USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id OR
    receiver_id IS NULL
);

-- Policy: Allow authenticated users to insert their own messages
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
CREATE POLICY "Users can insert messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Receivers mark their incoming messages read (needed by the drawers'
-- mark-as-read updates; harmless alongside the sibling migration).
DROP POLICY IF EXISTS "Users can mark received messages read" ON public.messages;
CREATE POLICY "Users can mark received messages read"
ON public.messages FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- Enable Realtime Publication on messages table (idempotent).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END
$$;

COMMENT ON TABLE public.messages IS
  'Side-chat between Admin HQ and responders. receiver_id NULL = team broadcast.';
COMMENT ON COLUMN public.messages.incident_id IS
  'Optional context id (matches reports.id); FK attached only if public.incidents exists.';
