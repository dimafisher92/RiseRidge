import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Landing point for Supabase invite / password-recovery / magic links.
// Establishes a session, then forwards on to `next`.
//
// Supports both link formats:
//   - PKCE:      ?code=...                (exchangeCodeForSession)
//   - token_hash: ?token_hash=...&type=…  (verifyOtp — survives link prefetch
//                                          and works across devices/browsers)
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const rawNext = searchParams.get('next') ?? '/portal/dashboard/';
  const next = rawNext.startsWith('/') ? rawNext : '/portal/dashboard/';

  const supabase = createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login/?error=auth`);
}
