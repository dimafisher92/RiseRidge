'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl } from './env';
import type { Database } from './types';

// Supabase client for Client Components (login form, sign-out). Uses the
// public anon key and browser cookie storage; RLS still applies.
export function createClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
