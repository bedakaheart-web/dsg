-- Migration: automated incident report routing and department assignment
-- Deploy with: supabase db push (or paste into SQL Editor)
-- LOCAL ONLY

-- Add department_id to reports table
alter table reports
  add column if not exists department_id uuid,
  add column if not exists department text;

-- Add department to profiles table for responders/admins
alter table profiles
  add column if not exists department text;

-- Create department reference table
create table if not exists public.departments (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  code        text        not null unique,
  description text,
  created_at  timestamptz not null default now()
);

-- Insert standard departments
insert into public.departments (id, name, code, description) values
  (gen_random_uuid(), 'Fire Department',              'fire',    'Bureau of Fire Protection (BFP) and fire response'),
  (gen_random_uuid(), 'Health / EMS',                 'medical', 'Emergency Medical Services and health facilities'),
  (gen_random_uuid(), 'Police / Security',            'crime',   'Philippine National Police and local security'),
  (gen_random_uuid(), 'DRRM',                         'flood',   'Disaster Risk Reduction Management office'),
  (gen_random_uuid(), 'Central Dispatch / Admin',     'other',   'Central dispatch and administrative office')
on conflict do nothing;

-- Backfill department_id on existing reports based on type
update reports set
  department_id = (select id from public.departments d where d.code = reports.type),
  department    = reports.type
where department_id is null;

-- Set department on new reports via trigger
create or replace function public.set_report_department()
returns trigger as $$
begin
  if new.department is null then
    new.department := new.type;
  end if;
  if new.department_id is null then
    new.department_id := (select id from public.departments d where d.code = new.type);
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trigger_set_report_department on public.reports;
create trigger trigger_set_report_department
  before insert or update on public.reports
  for each row
  execute function public.set_report_department();

-- Indexes for department-based filtering
create index if not exists idx_reports_department_id
  on public.reports (department_id, created_at desc);

create index if not exists idx_reports_department_status
  on public.reports (department_id, status);

-- Enable realtime for department-based notifications
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'reports'
  ) then
    alter publication supabase_realtime add table public.reports;
  end if;
end
$$;

-- Realtime channel for department-specific notifications
create or replace function public.notify_department()
returns trigger as $$
begin
  -- Publish to a channel specific to the department
  perform pg_notify(
    'department-' || COALESCE(new.department, 'other'),
    json_build_object(
      'event', 'new-report',
      'report_id', new.id,
      'department', COALESCE(new.department, 'other'),
      'type', new.type,
      'status', new.status,
      'created_at', new.created_at
    )::text
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trigger_notify_department on public.reports;
create trigger trigger_notify_department
  after insert on public.reports
  for each row
  execute function public.notify_department();

comment on table public.reports is
  'Incident reports. department_id auto-assigned based on type via trigger.';
comment on column public.reports.department_id is
  'UUID reference to the department table. Auto-set based on report type.';
comment on column public.reports.department is
  'Department code string matching the incident type (fire, medical, crime, flood, other).';
