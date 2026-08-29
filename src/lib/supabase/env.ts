// Centralised, validated access to Supabase environment variables.
// Throwing here (rather than passing undefined into the SDK) gives a clear
// message when the portal is deployed before Supabase is configured.

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set — configure Supabase (see SETUP-portal.md).');
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set — configure Supabase (see SETUP-portal.md).');
  return key;
}

// True only when both public vars are present, so UI can degrade gracefully
// (e.g. show a "portal not yet configured" state instead of crashing).
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
