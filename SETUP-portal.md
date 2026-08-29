# Client Portal — Setup (Phase 1)

The client portal (login → dashboard → reports, plus an internal admin panel) is
built on **Supabase** (Postgres + Auth + Storage). Until the Supabase env vars
are set, the portal shows a "not configured" state and the marketing site is
completely unaffected.

Follow these steps to go live.

## 1. Create a Supabase project

1. Create a project at <https://supabase.com/dashboard>.
2. From **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose)

## 2. Apply the database schema

Run **both** migration files in `supabase/migrations/` in order — `0001_portal_init.sql`
then `0002_flexible_reports.sql` — either:

- **SQL editor:** paste each file's contents and run, in order, or
- **CLI:** `supabase link --project-ref <ref>` then `supabase db push`.

`0002` makes reports flexible: a free-form markdown body + a list of headline
highlights (label + value as text), with period dates optional. Reports are no
longer tied to a fixed set of KPIs.

This creates the tables (`clients`, `profiles`, `reports`, `report_metrics`,
`report_screenshots`, `notifications_log`), the private `report-assets` Storage
bucket, the signup trigger, and **Row-Level Security** on every table.

## 3. Set environment variables

Add to `.env.local` (dev) and to your Vercel project (prod):

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
NEXT_PUBLIC_SITE_URL=https://riseridge.io   # no trailing slash
```

## 4. Configure Auth (Supabase dashboard → Authentication)

- **URL Configuration → Site URL:** `https://riseridge.io`
- **Redirect URLs (allow list):** add `https://riseridge.io/auth/callback/`
  (and `http://localhost:3000/auth/callback/` for local dev). The trailing slash
  matters — the app uses `trailingSlash: true`.
- **Email templates:** the default invite / reset / email-change templates work.
  Optionally brand them. For real sending volume, configure a custom SMTP sender
  under **Project Settings → Auth → SMTP** (the built-in sender is rate-limited).

## 5. Seed the first admin (+ demo data) — scripted

> **Run the scripts from your own machine.** Claude Code's cloud session cannot
> reach Supabase (its egress policy blocks `*.supabase.co` and
> `api.supabase.com`), so the migration, seeding, and verification must be run
> where Supabase is reachable — your laptop or CI.

With the migration applied (step 2) and env set:

```bash
set -a; source .env.local; set +a        # loads NEXT_PUBLIC_SUPABASE_URL, keys
node scripts/seed-portal.mjs             # admin + demo client + client login + report + a 2nd client
node scripts/verify-rls.mjs              # cross-client RLS safety check (gating)
```

`seed-portal.mjs` creates the admin (`dimafisher92@gmail.com`), a **Demo Store**
client with a login (`dimafisher92+demo@gmail.com`) and a published report, and a
second client for the isolation test. It prints temporary passwords and writes
them to `scripts/seed-output.json` (gitignored). Change passwords on first login.

Prefer to do it by hand? Create a user via **Authentication → Users → Add user**,
then in the SQL editor:

```sql
update public.profiles
set role = 'admin', client_id = null
where id = (select id from auth.users where email = 'you@riseridge.io');
```

Sign in at `/login/`. Admins land on the admin workspace (`/portal/admin/`).

## 6. Verify end-to-end

1. **Login / gating:** visit `/portal/dashboard/` while signed out → redirected to
   `/login/`. Sign in as the admin → you reach the admin area. A client user
   hitting `/portal/admin/` is redirected to their dashboard.
2. **Create client + invite:** Admin → **New client**. The invitee gets an email,
   sets a password via the link, and lands on their dashboard.
3. **Upload a report:** Admin → **New report**. Add metric rows (raw numbers only —
   e.g. `73896.7`, `35409.94`), upload the Slack screenshots, write a summary,
   and **Save & publish**.
4. **Client view:** sign in as the client → the dashboard shows the top *positive*
   movers (respecting "higher is better"), an auto-summary, and the latest-report
   panel; the report page shows the metric table, a before/after chart, the
   screenshots (served via short-lived signed URLs), the **Ask in Slack** button,
   and **Save as PDF**.
5. **RLS check (important):** with two client accounts A and B, confirm A cannot
   open B's report URL (it 404s) and never sees B's data.

## Notes

- **Screenshots** live in a **private** bucket and are served only through
  short-lived signed URLs — never public.
- **Service-role key** is used only in server API routes/cron (`src/lib/supabase/admin.ts`,
  fenced with `import 'server-only'`). Never expose it to the browser.
- The portal is excluded from search: `robots.ts` disallows `/portal` and
  `/login`, and portal pages are `noindex`.

## Phase 2 (not yet built)

Email notifications on publish and automated positive-trend alerts are planned
for Phase 2 (Resend + a weekly Vercel Cron). The env placeholders
(`RESEND_API_KEY`, `PORTAL_FROM_EMAIL`, `CRON_SECRET`, `TREND_ALERT_THRESHOLD_PCT`)
are in `.env.example` for when that lands.

## Unrelated but worth doing

`tina/config.ts` currently commits TinaCloud `clientId` / `token` / `indexerToken`
to git. Rotate those in TinaCloud and move them to environment variables — this is
independent of the portal but should be fixed before adding more secrets.
