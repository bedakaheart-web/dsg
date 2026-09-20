-- Migration: centralized citizen <-> responder presence + chat compatibility
-- Deploy via: supabase db push  OR  paste into SQL Editor (idempotent, safe to re-run)
-- Combines presence columns + chat_messages column aliases so citizen→responder
-- chat works regardless of which prior migration created the table.

-- ── 1) Presence columns on profiles ──────────────────────────────────────────
alter table public.profiles add column if not exists is_online boolean default false;
alter table public.profiles add column if not exists last_seen timestamptz;
alter table public.profiles add column if not exists status text default 'off_duty';

create index if not exists idx_profiles_is_online on public.profiles (is_online) where is_online = true;
create index if not exists idx_profiles_last_seen on public.profiles (last_seen desc);
create index if not exists idx_profiles_role_status on public.profiles (role, status);

comment on column public.profiles.is_online is 'Heartbeat flag — true while user tab is open (updated every ~25s).';
comment on column public.profiles.last_seen is 'Last heartbeat timestamp — used to derive online when is_online column unavailable.';
comment on column public.profiles.status is 'Duty status: on_duty | responding | off_duty | online';

-- ── 2) chat_messages compatibility ───────────────────────────────────────────
-- Prior migrations disagree on column names:
--   20260915000000 uses recipient_id + content (+ no sender_role/recipient_role/is_read)
--   ChatBox / useRealtimeChat use receiver_id + message + sender_role + recipient_role + is_read
-- This patch ensures BOTH spellings exist as the same logical column and that all
-- required columns exist, so inserts from ChatBox always succeed.
--
-- Strategy: add missing columns, then add compatibility views/aliases via triggers
-- that keep recipient_id <-> receiver_id and content <-> message in sync.

-- Ensure table exists (may not if older migration not yet pushed)
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Add all expected columns if missing (idempotent)
alter table public.chat_messages add column if not exists receiver_id uuid references auth.users(id) on delete cascade;
alter table public.chat_messages add column if not exists recipient_id uuid references auth.users(id) on delete cascade;
alter table public.chat_messages add column if not exists incident_id uuid;
alter table public.chat_messages add column if not exists message text;
alter table public.chat_messages add column if not exists content text;
alter table public.chat_messages add column if not exists image_url text;
alter table public.chat_messages add column if not exists sender_role text;
alter table public.chat_messages add column if not exists recipient_role text;
alter table public.chat_messages add column if not exists is_read boolean not null default false;

-- Relax NOT NULL on content/message — at least one must be non-empty but each individually nullable
alter table public.chat_messages drop constraint if exists chat_messages_body_check;
-- Recreate as: message or content or image_url must be present
do $$ begin
  alter table public.chat_messages add constraint chat_messages_body_check
    check (char_length(coalesce(message,'') ) > 0 or char_length(coalesce(content,'') ) > 0 or image_url is not null);
exception when duplicate_object then null;
end $$;

-- Indexes for centralized queries
create index if not exists idx_chat_messages_sender_receiver on public.chat_messages (sender_id, receiver_id, created_at desc);
create index if not exists idx_chat_messages_recipient_idx on public.chat_messages (recipient_id, created_at desc);
create index if not exists idx_chat_messages_receiver_idx on public.chat_messages (receiver_id, created_at desc);
create index if not exists idx_chat_messages_incident_chat on public.chat_messages (incident_id, created_at desc);

-- RLS: already enabled by earlier migration; ensure policies cover both columns
alter table public.chat_messages enable row level security;

drop policy if exists "chat_messages_select_participant_v2" on public.chat_messages;
create policy "chat_messages_select_participant_v2"
  on public.chat_messages for select to authenticated
  using (
    auth.uid() = sender_id
    or auth.uid() = receiver_id
    or auth.uid() = recipient_id
    or coalesce(receiver_id, recipient_id) is null
  );

drop policy if exists "chat_messages_insert_self_v2" on public.chat_messages;
create policy "chat_messages_insert_self_v2"
  on public.chat_messages for insert to authenticated
  with check (auth.uid() = sender_id);

drop policy if exists "chat_messages_update_read_v2" on public.chat_messages;
create policy "chat_messages_update_read_v2"
  on public.chat_messages for update to authenticated
  using (auth.uid() = coalesce(receiver_id, recipient_id))
  with check (auth.uid() = coalesce(receiver_id, recipient_id));

-- Keep legacy policies if they still exist (idempotent)
do $$ begin
  drop policy if exists "chat_messages_select_participant" on public.chat_messages;
  drop policy if exists "chat_messages_insert_self" on public.chat_messages;
exception when undefined_object then null;
end $$;

-- Sync trigger: keep recipient_id/receiver_id and content/message mirrored
create or replace function public.sync_chat_messages_aliases()
returns trigger as $$
begin
  -- mirror receiver <-> recipient
  if new.receiver_id is not null and new.recipient_id is null then
    new.recipient_id := new.receiver_id;
  elsif new.recipient_id is not null and new.receiver_id is null then
    new.receiver_id := new.recipient_id;
  end if;
  -- mirror message <-> content
  if new.message is not null and new.content is null then
    new.content := new.message;
  elsif new.content is not null and new.message is null then
    new.message := new.content;
  end if;
  -- ensure at least one role pair when inserted without roles
  if new.sender_role is null then new.sender_role := 'citizen'; end if;
  if new.recipient_role is null then new.recipient_role := 'responder'; end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_sync_chat_messages_aliases on public.chat_messages;
create trigger trg_sync_chat_messages_aliases
  before insert or update on public.chat_messages
  for each row execute function public.sync_chat_messages_aliases();

-- Realtime idempotent
do $$ begin
  if not exists (
    select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='chat_messages'
  ) then alter publication supabase_realtime add table public.chat_messages; end if;
end $$;

comment on table public.chat_messages is 'Centralized citizen<->responder + responder<->admin chat. receiver_id/recipient_id and message/content are aliases; realtime enabled.';

-- ── 3) Ensure messages table (HQ broadcast) has is_read etc (no-op if exists) ──
-- Already handled by 20260912120000_create_messages_table.sql
