-- Migration: add conversation_id for isolated citizen-responder conversations
-- Deploy via: supabase db push OR paste into SQL Editor (idempotent, safe to re-run)
-- NOTE: Broadcast messages (receiver_id IS NULL) are NOT part of a conversation.
--       Their conversation_id stays NULL and they are not routed through conversations.

-- ── 1) conversations table ────────────────────────────────────────────
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid references auth.users(id) on delete cascade,
  responder_id uuid references auth.users(id) on delete cascade,
  incident_id uuid,
  last_message_at timestamptz default now(),
  last_message_preview text,
  created_at timestamptz default now()
);

alter table public.conversations enable row level security;

drop policy if exists "conversations_select_participant" on public.conversations;
create policy "conversations_select_participant"
  on public.conversations for select
  to authenticated
  using (
    auth.uid() = citizen_id
    or auth.uid() = responder_id
  );

drop policy if exists "conversations_insert_participant" on public.conversations;
create policy "conversations_insert_participant"
  on public.conversations for insert
  to authenticated
  with check (auth.uid() = citizen_id or auth.uid() = responder_id);

-- ── 2) Add conversation_id to chat_messages ─────────────────────────
alter table public.chat_messages add column if not exists conversation_id uuid;

-- Auto-fill conversation_id ONLY for 1-on-1 messages (receiver_id IS NOT NULL).
-- Broadcast messages (receiver_id IS NULL) keep conversation_id = NULL.
create or replace function public.set_chat_message_conversation_id()
returns trigger as $$
declare
  existing_conv uuid;
begin
  -- Broadcast messages stay out of conversations.
  if new.receiver_id is null then
    new.conversation_id := null;
    return new;
  end if;
  if new.conversation_id is not null then
    return new;
  end if;
  -- Look for existing conversation between these participants.
  select c.id into existing_conv
  from public.conversations c
  where (c.citizen_id = new.sender_id and c.responder_id = new.receiver_id)
     or (c.citizen_id = new.receiver_id and c.responder_id = new.sender_id)
     and (c.incident_id is null or c.incident_id = new.incident_id);
  if existing_conv is not null then
    new.conversation_id := existing_conv;
  else
    insert into public.conversations (citizen_id, responder_id, incident_id, last_message_at)
    values (
      least(new.sender_id, new.receiver_id),
      greatest(new.sender_id, new.receiver_id),
      new.incident_id,
      now()
    )
    returning id into existing_conv;
    new.conversation_id := existing_conv;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_set_chat_message_conversation_id on public.chat_messages;
create trigger trg_set_chat_message_conversation_id
  before insert on public.chat_messages
  for each row execute function public.set_chat_message_conversation_id();

-- Index
create index if not exists idx_chat_messages_conversation on public.chat_messages (conversation_id, created_at);

-- Update RLS to include conversation_id access
drop policy if exists "chat_messages_select_conversation_v3" on public.chat_messages;
create policy "chat_messages_select_conversation_v3"
  on public.chat_messages for select
  to authenticated
  using (
    auth.uid() = sender_id
    or auth.uid() = receiver_id
    or auth.uid() = recipient_id
    or coalesce(receiver_id, recipient_id) is null
    or auth.uid() in (
      select c.citizen_id from public.conversations c where c.id = chat_messages.conversation_id
      union
      select c.responder_id from public.conversations c where c.id = chat_messages.conversation_id
    )
  );

-- ── 3) Add conversation_id to messages (HQ broadcast table) ────────
-- Broadcast table messages (receiver_id IS NULL) are NOT citizen-responder
-- conversations. Add the column but do NOT auto-fill it via trigger.
alter table public.messages add column if not exists conversation_id uuid;

-- Index
create index if not exists idx_messages_conversation on public.messages (conversation_id, created_at);

-- Realtime publication
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='chat_messages')
    and not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='conversations') then
    alter publication supabase_realtime add table public.conversations;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='chat_messages') then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
