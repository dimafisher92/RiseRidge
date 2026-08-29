// Cross-client RLS safety check — the gating test before real client data.
// Run AFTER seed-portal.mjs, from a machine that can reach Supabase:
//
//   set -a; source .env.local; set +a
//   node scripts/verify-rls.mjs
//
// Signs in as the demo client and asserts it can read its OWN published report
// but CANNOT read the other client's data; then signs in as admin and asserts
// it can read all. Uses the anon/publishable key so RLS is enforced as the user.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) {
  console.error('Missing env. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

let seed;
try {
  seed = JSON.parse(readFileSync(new URL('./seed-output.json', import.meta.url)));
} catch {
  console.error('scripts/seed-output.json not found — run `node scripts/seed-portal.mjs` first.');
  process.exit(1);
}

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass });
  console.log(`${pass ? '✓ PASS' : '✗ FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

async function asUser({ email, password }) {
  const c = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`sign-in failed for ${email}: ${error.message}`);
  return c;
}

async function main() {
  if (!seed.demoClient.password || !seed.otherClient.password) {
    console.error('Seed output has null passwords (users pre-existed). Re-run seeding on a fresh project, or set passwords via the dashboard, to run this check.');
    process.exit(1);
  }

  // Demo client: can read own report, cannot read the other client's.
  const demo = await asUser(seed.demoClient);
  const ownReports = await demo.from('reports').select('id').eq('client_id', seed.demoClient.clientId);
  check('client reads its own published report', (ownReports.data?.length ?? 0) >= 1, `${ownReports.data?.length ?? 0} rows`);

  const otherReports = await demo.from('reports').select('id').eq('client_id', seed.otherClient.clientId);
  check('client CANNOT read another client’s report', (otherReports.data?.length ?? 0) === 0, `${otherReports.data?.length ?? 0} rows (want 0)`);

  const otherClientRow = await demo.from('clients').select('id').eq('id', seed.otherClient.clientId);
  check('client CANNOT read another client’s account row', (otherClientRow.data?.length ?? 0) === 0, `${otherClientRow.data?.length ?? 0} rows (want 0)`);

  const allReportsAsClient = await demo.from('reports').select('id, client_id');
  const rows = allReportsAsClient.data ?? [];
  const onlyOwn = rows.length >= 1 && rows.every((r) => r.client_id === seed.demoClient.clientId);
  check('client sees ONLY its own reports in an unfiltered query', onlyOwn, `${rows.length} rows, all own: ${rows.every((r) => r.client_id === seed.demoClient.clientId)}`);

  // Admin: can read across clients.
  const admin = await asUser(seed.admin);
  const adminAll = await admin.from('reports').select('id');
  check('admin reads reports across all clients', (adminAll.data?.length ?? 0) >= 2, `${adminAll.data?.length ?? 0} rows`);

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${failed.length === 0 ? 'ALL CHECKS PASSED ✓' : `${failed.length} CHECK(S) FAILED ✗ — do NOT load real client data yet`}`);
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('Verification error:', e.message ?? e);
  process.exit(1);
});
