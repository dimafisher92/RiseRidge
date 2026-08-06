import { createClient } from '@/lib/supabase/server';

// RLS-scoped reads: a client can only fetch its own row; admins can fetch any.

export async function getClientById(clientId: string) {
  const supabase = createClient();
  const { data } = await supabase.from('clients').select('*').eq('id', clientId).maybeSingle();
  return data ?? null;
}

export async function listClients() {
  const supabase = createClient();
  const { data } = await supabase.from('clients').select('*').order('name', { ascending: true });
  return data ?? [];
}
