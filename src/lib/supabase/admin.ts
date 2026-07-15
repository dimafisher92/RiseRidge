import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseUrl } from './env';
import type { Database } from './types';

// Service-role client — BYPASSES Row-Level Security. Use ONLY in nodejs API
// routes / cron for privileged operations (invites, cross-client reads, writing
// notifications_log). The `server-only` import above makes importing this into
// any client bundle a build error. Never expose the service-role key via
// NEXT_PUBLIC_* and never import this from a Client Component.
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set — required for admin/portal operations (see SETUP-portal.md).');
  }

  return createSupabaseClient<Database>(getSupabaseUrl(), serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
