-- Migration: citizen <-> responder chat with image attachments (LOCAL ONLY)
-- Table: public.chat_messages
--   1-on-1 thread = rows where (sender_id, recipient_id) = (A,B) or (B,A)
--   Citizen threads are additionally scoped by incident_id (= reports.id).
--   Citizen -> responder only. Citizen -> admin is blocked at UI + query level.
--   Responder <-> admin threads use incident_id NULL.
--
-- Storage: `chat-images` bucket (public read, authenticated write of own folder).
--
-- DO NOT run `supabase db push` from automation. Apply manually via the
-- Supabase SQL Editor or `supabase db push` on your own machine.

create extension if not exists pgcrypto;

create table if not exists public.chat_messages (
  id           uuid        primary key default gen_random_uuid(),
  sender_id    uuid        not null references auth.users(id) on delete cascade,
  recipient_id uuid        references auth.users(id) on delete cascade,
  -- Active report context for citizen threads (matches reports.id).
  -- NULL for responder <-> admin threads.
  incident_id  uuid,
  content      text        not null default '',
  image_url    text,
  created_at   timestamptz not null default now(),
  constraint chat_messages_body_check
    check (char_length(content) > 0 or image_url is not null)
);

create index if not exists idx_chat_messages_thread
  on public.chat_messages (sender_id, recipient_id, created_at desc);
create index if not exists idx_chat_messages_incident
  on public.chat_messages (incident_id, created_at desc);
create index if not exists idx_chat_messages_recipient
  on public.chat_messages (recipient_id, created_at desc);

alter table public.chat_messages enable row level security;

-- Participants read their own threads.
drop policy if exists "chat_messages_select_participant" on public.chat_messages;
create policy "chat_messages_select_participant"
  on public.chat_messages for select
  to authenticated
  using (
    auth.uid() = sender_id
    or auth.uid() = recipient_id
  );

-- Senders insert only as themselves.
drop policy if exists "chat_messages_insert_self" on public.chat_messages;
create policy "chat_messages_insert_self"
  on public.chat_messages for insert
  to authenticated
  with check (auth.uid() = sender_id);

-- Realtime publication (idempotent).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end
$$;

-- Storage bucket for chat image attachments (public read).
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

-- Public read of chat images (inline rendering in bubbles).
drop policy if exists "chat-images public read" on storage.objects;
create policy "chat-images public read"
  on storage.objects for select
  to public
  using (bucket_id = 'chat-images');

-- Authenticated users upload into their own folder (<uid>/...).
drop policy if exists "chat-images upload own folder" on storage.objects;
create policy "chat-images upload own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owners can replace / remove their own uploads.
drop policy if exists "chat-images update own" on storage.objects;
create policy "chat-images update own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "chat-images delete own" on storage.objects;
create policy "chat-images delete own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'chat-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

comment on table public.chat_messages is
  'Citizen <-> responder chat (incident-scoped) + responder <-> admin chat. image_url points at the chat-images bucket.';
comment on column public.chat_messages.incident_id is
  'Active report id (reports.id) for citizen threads; NULL for responder <-> admin threads.';
