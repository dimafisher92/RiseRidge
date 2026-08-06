-- ============================================================================
-- Flexible reports
-- ----------------------------------------------------------------------------
-- Client reports vary week to week (different sections, different KPIs), so we
-- store a free-form markdown `body` plus a flexible list of headline
-- `report_highlights` (label + value as text, no fixed KPI schema). The old
-- fixed-schema `report_metrics` table stays for optional before/after tables
-- but is no longer required. Period dates become optional too.
--
-- Additive & idempotent — safe to run after 0001 whether or not data exists.
-- ============================================================================

alter table public.reports add column if not exists body text;
alter table public.reports alter column period_start drop not null;
alter table public.reports alter column period_end drop not null;

create table if not exists public.report_highlights (
  id         uuid primary key default gen_random_uuid(),
  report_id  uuid not null references public.reports(id) on delete cascade,
  label      text not null,                 -- e.g. "Total Impressions"
  value      text not null,                 -- free text, e.g. "35,100" / "$336,249" / "1.4"
  note       text,                          -- optional context, e.g. "+149% vs prior"
  positive   boolean not null default true, -- styles the tile as an up/good movement
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists report_highlights_report_idx on public.report_highlights(report_id);

alter table public.report_highlights enable row level security;

-- Visible when the parent report is visible to the caller (published + own, or admin).
drop policy if exists report_highlights_select on public.report_highlights;
create policy report_highlights_select on public.report_highlights for select to authenticated
  using (
    public.portal_role() = 'admin'
    or report_id in (
      select id from public.reports
      where client_id = public.portal_client_id() and status = 'published'
    )
  );

drop policy if exists report_highlights_write on public.report_highlights;
create policy report_highlights_write on public.report_highlights for all to authenticated
  using (public.portal_role() = 'admin') with check (public.portal_role() = 'admin');
