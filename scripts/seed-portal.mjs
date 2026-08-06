// One-time portal seeding. Run from a machine that can reach Supabase
// (this repo's cloud session cannot — Supabase egress is blocked by policy):
//
//   1) Apply supabase/migrations/0001_portal_init.sql in the Supabase SQL editor.
//   2) Set env (or `source .env.local`): NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   3) node scripts/seed-portal.mjs
//
// Creates: an admin, a demo client + client login + published report, and a
// second client (for the cross-client RLS check). Idempotent. Writes generated
// credentials to scripts/seed-output.json (gitignored) for verify-rls.mjs.

import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import { writeFileSync } from 'node:fs';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. `set -a; source .env.local; set +a`).');
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
const tempPassword = () => crypto.randomBytes(9).toString('base64url') + 'aA1!';

async function findUserByEmail(email) {
  // Fresh projects are small; page through until found.
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 200) break;
  }
  return null;
}

async function ensureUser(email, meta) {
  const password = tempPassword();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: meta,
  });
  if (!error) return { id: data.user.id, password, created: true };

  const existing = await findUserByEmail(email);
  if (!existing) throw error;
  await admin.auth.admin.updateUserById(existing.id, { user_metadata: meta });
  return { id: existing.id, password: null, created: false };
}

async function ensureProfile(id, role, clientId, fullName) {
  const { error } = await admin
    .from('profiles')
    .upsert({ id, role, client_id: clientId, full_name: fullName }, { onConflict: 'id' });
  if (error) throw error;
}

async function ensureClient(name, slug, slackUrl = null) {
  const { data, error } = await admin
    .from('clients')
    .upsert({ name, slug, slack_channel_url: slackUrl }, { onConflict: 'slug' })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

async function ensureReport(clientId, title, metrics) {
  const { data: existing } = await admin
    .from('reports')
    .select('id')
    .eq('client_id', clientId)
    .eq('title', title)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: report, error } = await admin
    .from('reports')
    .insert({
      client_id: clientId,
      title,
      summary:
        'Organic search delivered strong gains this period — revenue and sessions both climbed while bounce rate fell.',
      period_start: '2026-04-15',
      period_end: '2026-07-14',
      compare_start: '2026-01-14',
      compare_end: '2026-04-14',
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single();
  if (error) throw error;

  const rows = metrics.map((m, i) => ({ ...m, report_id: report.id, sort_order: i }));
  const { error: mErr } = await admin.from('report_metrics').insert(rows);
  if (mErr) throw mErr;
  return report.id;
}

const demoMetrics = [
  { key: 'organic_revenue', label: 'Organic revenue', current_value: 73896.7, prior_value: 35409.94, unit: 'currency', higher_is_better: true, decimals: 2 },
  { key: 'organic_sessions', label: 'Organic sessions', current_value: 11343, prior_value: 6515, unit: 'number', higher_is_better: true, decimals: 0 },
  { key: 'conversion_rate', label: 'Conversion rate', current_value: 5.78, prior_value: 4.83, unit: 'percent', higher_is_better: true, decimals: 2 },
  { key: 'bounce_rate', label: 'Bounce rate', current_value: 38.2, prior_value: 47.6, unit: 'percent', higher_is_better: false, decimals: 1 },
];

const acmeMetrics = [
  { key: 'organic_revenue', label: 'Organic revenue', current_value: 21700, prior_value: 12600, unit: 'currency', higher_is_better: true, decimals: 0 },
  { key: 'organic_clicks', label: 'Organic clicks', current_value: 1149, prior_value: 397, unit: 'number', higher_is_better: true, decimals: 0 },
];

async function main() {
  console.log('Seeding portal on', url);

  const adminUser = await ensureUser('dimafisher92@gmail.com', { role: 'admin', full_name: 'RiseRidge Admin' });
  await ensureProfile(adminUser.id, 'admin', null, 'RiseRidge Admin');
  console.log('✓ admin:', 'dimafisher92@gmail.com', adminUser.created ? `(password: ${adminUser.password})` : '(existing — unchanged)');

  const demo = await ensureClient('Demo Store', 'demo-store', null);
  const demoUser = await ensureUser('dimafisher92+demo@gmail.com', { role: 'client', client_id: demo.id, full_name: 'Demo Client' });
  await ensureProfile(demoUser.id, 'client', demo.id, 'Demo Client');
  const demoReportId = await ensureReport(demo.id, 'Q2 2026 Performance', demoMetrics);
  console.log('✓ demo client + user:', 'dimafisher92+demo@gmail.com', demoUser.created ? `(password: ${demoUser.password})` : '(existing — unchanged)');

  const acme = await ensureClient('Acme Test', 'acme-test', null);
  const acmeUser = await ensureUser('dimafisher92+demo2@gmail.com', { role: 'client', client_id: acme.id, full_name: 'Acme Client' });
  await ensureProfile(acmeUser.id, 'client', acme.id, 'Acme Client');
  await ensureReport(acme.id, 'Q2 2026 Performance', acmeMetrics);
  console.log('✓ second client + user (for RLS test):', 'dimafisher92+demo2@gmail.com', acmeUser.created ? `(password: ${acmeUser.password})` : '(existing — unchanged)');

  const out = {
    admin: { email: 'dimafisher92@gmail.com', password: adminUser.password },
    demoClient: { email: 'dimafisher92+demo@gmail.com', password: demoUser.password, clientId: demo.id, reportId: demoReportId },
    otherClient: { email: 'dimafisher92+demo2@gmail.com', password: acmeUser.password, clientId: acme.id },
  };
  writeFileSync(new URL('./seed-output.json', import.meta.url), JSON.stringify(out, null, 2));

  console.log('\nDone. Credentials written to scripts/seed-output.json (gitignored).');
  console.log('Sign in at /login/ with the admin, or the demo client to see the dashboard.');
  console.log('If a user already existed, its password was left unchanged — use “Forgot password”.');
  console.log('\nNext: node scripts/verify-rls.mjs   (confirms clients cannot see each other’s data)');
}

main().catch((e) => {
  console.error('Seeding failed:', e.message ?? e);
  process.exit(1);
});
