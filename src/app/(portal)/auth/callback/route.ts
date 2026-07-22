import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Landing point for Supabase invite / password-recovery / magic links.
// Establishes a session, then forwards on to `next`.
//
// Supports both link formats:
//   - token_hash: ?token_hash=...&type=…  (verifyOtp — PREFERRED: needs no PKCE
//                 code_verifier, so it works across devices/browsers and
//                 survives a mail client opening the link before the user does)
//   - PKCE:       ?code=...               (exchangeCodeForSession — same-browser
//                 magic links only)
//
// The Supabase email templates must point here with the token_hash format, e.g.
//   {{ .SiteURL }}/auth/callback/?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password/
// The default `{{ .ConfirmationURL }}` uses the PKCE code flow, which fails for
// recovery emails opened on another device or after a link scanner burns the
// one-time token — that's what sent users to /login/?error=auth. See
// SETUP-portal.md → "Configure Auth".
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const rawNext = searchParams.get('next') ?? '/portal/dashboard/';
  const next = rawNext.startsWith('/') ? rawNext : '/portal/dashboard/';

  // Supabase can redirect here with the failure already decided (expired /
  // already-used link, or one burned by a mail scanner). It arrives as a query
  // param — don't bother trying to verify in that case.
  const providerError = searchParams.get('error_code') ?? searchParams.get('error');

  const supabase = createClient();

  if (!providerError) {
    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    } else {
      // No credential in the link at all — someone hit the route directly.
      return NextResponse.redirect(`${origin}/login/?error=auth`);
    }
  }

  // A credential was present but the provider bounced an error or verification
  // failed. This route only ever handles single-use email links, so the real
  // cause is practically always an expired / already-used / wrong-device link.
  // Flag it so the sign-in page can explain and offer a fresh one.
  return NextResponse.redirect(`${origin}/login/?error=link_expired`);
}
