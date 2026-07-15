import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';

export type ClientUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
};

// Lists the auth users attached to a client, resolving emails via the auth
// admin API (emails aren't stored in `profiles`). Admin-only; uses the
// service-role client, so callers MUST have already verified admin role.
export async function listClientUsers(clientId: string): Promise<ClientUser[]> {
  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, role')
    .eq('client_id', clientId);

  if (!profiles || profiles.length === 0) return [];

  return Promise.all(
    profiles.map(async (p) => {
      const { data } = await admin.auth.admin.getUserById(p.id as string);
      return {
        id: p.id as string,
        email: data.user?.email ?? null,
        full_name: (p.full_name as string | null) ?? null,
        role: (p.role as string) ?? 'client',
      };
    }),
  );
}
