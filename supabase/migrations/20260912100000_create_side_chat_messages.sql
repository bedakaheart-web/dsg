-- Migration: real-time admin <-> responder side chat
-- Deploy with: supabase db push
-- (or paste into the Supabase SQL editor and run once)
--
-- Table: public.messages
--   1-on-1 thread  = rows where (sender,receiver) = (A,B) or (B,A)
--   broadcast       = rows where receiver_id IS NULL (readable by every
--                     authenticated user, e.g. HQ announcements)

create extension if not exists pgcrypto;

create table if not exists messages (
  id          uuid        primary key default gen_random_uuid(),
  sender_id   uuid        not null references profiles(id) on delete cascade,
  receiver_id uuid        references profiles(id) on delete cascade,
  -- Optional incident context. No FK: the app tracks incidents in the
  -- `reports` table (there is no `incidents` table); clients join/filter
  -- on this column directly. Add a FK later if an incidents table appears.
  incident_id uuid,
  message     text        not null check (char_length(message) > 0),
  created_at  timestamptz not null default now(),
  is_read     boolean     not null default false
);

create index if not exists idx_messages_thread
  on messages (sender_id, receiver_id, created_at desc);
create index if not exists idx_messages_receiver
  on messages (receiver_id, created_at desc) where receiver_id is null;
create index if not exists idx_messages_unread
  on messages (receiver_id, sender_id) where is_read = false;

alter table messages enable row level security;

-- Authenticated users read messages they sent, were sent, or broadcasts.
drop policy if exists "messages_select_participant" on messages;
create policy "messages_select_participant"
  on messages for select
  to authenticated
  using (
    auth.uid() = sender_id
    or auth.uid() = receiver_id
    or receiver_id is null
  );

-- Authenticated users insert only as themselves.
drop policy if exists "messages_insert_self" on messages;
create policy "messages_insert_self"
  on messages for insert
  to authenticated
  with check (auth.uid() = sender_id);

-- Receivers mark their incoming messages read.
drop policy if exists "messages_update_read" on messages;
create policy "messages_update_read"
  on messages for update
  to authenticated
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);

-- Realtime publication (idempotent).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table messages;
  end if;
end
$$;

comment on table messages is
  'Side-chat between Admin HQ and responders. receiver_id NULL = team broadcast.';
comment on column messages.incident_id is
  'Optional context id (matches reports.id); no FK constraint.';
