-- Record-keeping migration for HQ broadcast rules (already applied in Supabase, DO NOT RUN)
-- Database facts: chat_messages columns: id, legacy_incident_id, sender_id, receiver_id (nullable),
-- sender_role, recipient_role, message, image_url, created_at, incident_id, is_read.
-- There is NO content column and NO recipient_id column.

-- 1) Make receiver_id nullable (broadcasts use receiver_id = null)
alter table public.chat_messages alter column receiver_id drop not null;
alter table public.chat_messages alter column receiver_id drop not null; -- idempotent

-- 2) recipient_role check allowing null/admin/responder/citizen/all and valid_chat_roles
alter table public.chat_messages drop constraint if exists valid_chat_roles;
alter table public.chat_messages add constraint valid_chat_roles check (
  recipient_role is null
  or recipient_role in ('admin','responder','citizen','all')
);
-- Enforce allowed sender -> recipient combos
alter table public.chat_messages drop constraint if exists valid_chat_roles_sender;
alter table public.chat_messages add constraint valid_chat_roles_sender check (
  (sender_role = 'citizen' and recipient_role = 'responder')
  or (sender_role = 'responder' and recipient_role in ('citizen','admin','responder'))
  or (sender_role = 'admin' and recipient_role = 'responder')
);

-- 3) RLS: view own direct or responder broadcast (only responders and admins can read broadcasts, citizens never)
alter table public.chat_messages enable row level security;
drop policy if exists "view own direct or responder broadcast" on public.chat_messages;
create policy "view own direct or responder broadcast"
  on public.chat_messages for select to authenticated
  using (
    auth.uid() = sender_id
    or auth.uid() = receiver_id
    or (
      receiver_id is null
      and exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('responder','admin')
      )
    )
  );

-- 4) RLS: send direct or admin broadcast (only admins can insert broadcast)
drop policy if exists "send direct or admin broadcast" on public.chat_messages;
create policy "send direct or admin broadcast"
  on public.chat_messages for insert to authenticated
  with check (
    auth.uid() = sender_id
    and (
      -- direct message (any allowed sender->recipient)
      (receiver_id is not null)
      or
      -- broadcast: only admin -> responder
      (receiver_id is null and sender_role = 'admin' and recipient_role = 'responder')
    )
  );
