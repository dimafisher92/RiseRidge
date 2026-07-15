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

Run the migration in `supabase/migrations/0001_portal_init.sql`, either:

- **SQL editor:** paste the file contents and run, or
- **CLI:** `supabase link --project-ref <ref>` then `supabase db push`.

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

## 5. Seed the first admin

Invites create **client** users by default. To make yourself an admin:

1. Create a user for yourself — easiest via **Authentication → Users → Add user**
   (set a password), or sign yourself an invite.
2. In the SQL editor, promote that user:

   ```sql
   update public.profiles
   set role = 'admin', client_id = null
   where id = (select id from auth.users where email = 'you@riseridge.io');
   ```

3. Sign in at `/login/`. Admins land on the admin workspace (`/portal/admin/`).

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
