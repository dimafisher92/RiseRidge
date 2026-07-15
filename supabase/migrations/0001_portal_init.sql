-- ============================================================================
-- RiseRidge Client Portal — initial schema, RLS, and storage policies
-- ----------------------------------------------------------------------------
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- RLS is enabled on every table with default-deny; clients can only read their
-- own PUBLISHED reports, and only admins can write. See SETUP-portal.md.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.clients (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  slack_channel_url text,
  status            text not null default 'active' check (status in ('active','paused')),
  notify_opt_out    boolean not null default false,
  created_at        timestamptz not null default now()
);

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'client' check (role in ('client','admin')),
  client_id  uuid references public.clients(id) on delete set null,
  full_name  text,
  created_at timestamptz not null default now()
);
create index if not exists profiles_client_id_idx on public.profiles(client_id);

create table if not exists public.reports (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references public.clients(id) on delete cascade,
  title         text not null,
  summary       text,
  period_start  date not null,
  period_end    date not null,
  compare_start date,
  compare_end   date,
  status        text not null default 'draft' check (status in ('draft','published')),
  published_at  timestamptz,
  created_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index if not exists reports_client_period_idx on public.reports(client_id, period_end desc);

create table if not exists public.report_metrics (
  id               uuid primary key default gen_random_uuid(),
  report_id        uuid not null references public.reports(id) on delete cascade,
  key              text not null,
  label            text not null,
  current_value    numeric not null,
  prior_value      numeric,
  unit             text not null default 'number' check (unit in ('number','currency','percent','duration_s')),
  higher_is_better boolean not null default true,
  decimals         smallint not null default 0,
  sort_order       smallint not null default 0,
  created_at       timestamptz not null default now(),
  unique (report_id, key)
);
create index if not exists report_metrics_report_idx on public.report_metrics(report_id);

create table if not exists public.report_screenshots (
  id           uuid primary key default gen_random_uuid(),
  report_id    uuid not null references public.reports(id) on delete cascade,
  storage_path text not null,
  caption      text,
  sort_order   smallint not null default 0,
  width        int,
  height       int,
  created_at   timestamptz not null default now()
);
create index if not exists report_screenshots_report_idx on public.report_screenshots(report_id);

create table if not exists public.notifications_log (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients(id) on delete cascade,
  kind       text not null check (kind in ('new_report','trend_alert')),
  report_id  uuid references public.reports(id) on delete set null,
  metric_key text,
  dedupe_key text not null unique,
  sent_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER so they bypass RLS and avoid recursion
-- when policies reference profiles). Named `portal_*` to avoid clashing with
-- Postgres' reserved `current_role`.
-- ---------------------------------------------------------------------------

create or replace function public.portal_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.portal_client_id()
returns uuid language sql stable security definer set search_path = public as $$
  select client_id from public.profiles where id = auth.uid()
$$;

-- Create a profile automatically on signup. Invite metadata (role, client_id,
-- full_name) is passed via auth admin invite and lands in raw_user_meta_data.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, client_id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    nullif(new.raw_user_meta_data->>'client_id', '')::uuid,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------

alter table public.clients            enable row level security;
alter table public.profiles           enable row level security;
alter table public.reports            enable row level security;
alter table public.report_metrics     enable row level security;
alter table public.report_screenshots enable row level security;
alter table public.notifications_log  enable row level security;

-- clients: a client sees only its own row; admins see/manage all.
drop policy if exists clients_select on public.clients;
create policy clients_select on public.clients for select to authenticated
  using (public.portal_role() = 'admin' or id = public.portal_client_id());
drop policy if exists clients_write on public.clients;
create policy clients_write on public.clients for all to authenticated
  using (public.portal_role() = 'admin') with check (public.portal_role() = 'admin');

-- profiles: a user sees its own row; admins see/manage all.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.portal_role() = 'admin');
drop policy if exists profiles_write on public.profiles;
create policy profiles_write on public.profiles for all to authenticated
  using (public.portal_role() = 'admin') with check (public.portal_role() = 'admin');

-- reports: clients read only their own PUBLISHED reports; admins full access.
drop policy if exists reports_select on public.reports;
create policy reports_select on public.reports for select to authenticated
  using (
    public.portal_role() = 'admin'
    or (client_id = public.portal_client_id() and status = 'published')
  );
drop policy if exists reports_write on public.reports;
create policy reports_write on public.reports for all to authenticated
  using (public.portal_role() = 'admin') with check (public.portal_role() = 'admin');

-- report_metrics / report_screenshots: visible when the parent report is.
drop policy if exists report_metrics_select on public.report_metrics;
create policy report_metrics_select on public.report_metrics for select to authenticated
  using (
    public.portal_role() = 'admin'
    or report_id in (
      select id from public.reports
      where client_id = public.portal_client_id() and status = 'published'
    )
  );
drop policy if exists report_metrics_write on public.report_metrics;
create policy report_metrics_write on public.report_metrics for all to authenticated
  using (public.portal_role() = 'admin') with check (public.portal_role() = 'admin');

drop policy if exists report_screenshots_select on public.report_screenshots;
create policy report_screenshots_select on public.report_screenshots for select to authenticated
  using (
    public.portal_role() = 'admin'
    or report_id in (
      select id from public.reports
      where client_id = public.portal_client_id() and status = 'published'
    )
  );
drop policy if exists report_screenshots_write on public.report_screenshots;
create policy report_screenshots_write on public.report_screenshots for all to authenticated
  using (public.portal_role() = 'admin') with check (public.portal_role() = 'admin');

-- notifications_log: admins may read; all writes happen via the service role
-- (which bypasses RLS), so no client-facing write policy exists.
drop policy if exists notifications_log_select on public.notifications_log;
create policy notifications_log_select on public.notifications_log for select to authenticated
  using (public.portal_role() = 'admin');

-- ---------------------------------------------------------------------------
-- Storage: private bucket for report screenshots.
-- Path convention: reports/<client_id>/<report_id>/<file>
-- Downloads go through short-lived signed URLs generated server-side; these
-- policies are defense-in-depth.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('report-assets', 'report-assets', false)
on conflict (id) do nothing;

drop policy if exists report_assets_select on storage.objects;
create policy report_assets_select on storage.objects for select to authenticated
  using (
    bucket_id = 'report-assets'
    and (
      public.portal_role() = 'admin'
      or (storage.foldername(name))[2] = public.portal_client_id()::text
    )
  );

drop policy if exists report_assets_write on storage.objects;
create policy report_assets_write on storage.objects for all to authenticated
  using (bucket_id = 'report-assets' and public.portal_role() = 'admin')
  with check (bucket_id = 'report-assets' and public.portal_role() = 'admin');
