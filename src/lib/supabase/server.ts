import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl } from './env';
import type { Database } from './types';

// Supabase client for Server Components, Route Handlers, and Server Actions.
// Reads the session from cookies and enforces RLS as the logged-in user.
//
// Note (Next 14): `cookies()` is synchronous. In a Server Component the cookie
// store is read-only, so `setAll` may throw — that's expected and safe to
// swallow because middleware (updateSession) refreshes the auth cookie.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — ignore; middleware handles refresh.
        }
      },
    },
  });
}
