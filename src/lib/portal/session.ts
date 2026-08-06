import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { Client, Profile } from '@/lib/supabase/types';

export type SessionContext = {
  userId: string;
  email: string | null;
  profile: Profile;
  client: Client | null;
};

// Resolves the logged-in user's profile and (for clients) their client record.
// Returns null when there is no valid session/profile.
export async function getSessionContext(): Promise<SessionContext | null> {
  // Before Supabase is configured, there is no session — avoid throwing on the
  // missing env vars so portal pages can render a graceful "not configured" state.
  if (!isSupabaseConfigured()) return null;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile) return null;

  let client: Client | null = null;
  if (profile.client_id) {
    const { data } = await supabase.from('clients').select('*').eq('id', profile.client_id).single();
    client = data ?? null;
  }

  return { userId: user.id, email: user.email ?? null, profile, client };
}

// Page guard: any authenticated portal user.
export async function requireSession(): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (!ctx) redirect('/login/');
  return ctx;
}

// Page guard: admins only.
export async function requireAdmin(): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (!ctx) redirect('/login/');
  if (ctx.profile.role !== 'admin') redirect('/portal/dashboard/');
  return ctx;
}
