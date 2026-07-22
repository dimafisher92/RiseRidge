import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LoginForm } from '@/components/portal/LoginForm';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const configured = isSupabaseConfigured();

  // Set by /auth/callback when an email link can't establish a session.
  const errorCode = searchParams?.error;
  const startMode = errorCode === 'link_expired' ? 'reset' : 'login';
  const errorMessage =
    errorCode === 'link_expired'
      ? 'That reset link has expired or was already used. Reset links work only once and time out quickly — enter your email below to get a fresh one.'
      : errorCode
        ? 'We couldn’t complete that link. Please sign in, or request a new reset link below.'
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="RiseRidge home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-[10px] border border-line bg-panel/40 p-7 shadow-[0_10px_34px_rgba(21,20,15,0.05)]">
          <h1 className="mb-1 font-display text-2xl font-semibold text-ink">Client portal</h1>
          <p className="mb-6 text-sm text-body">Sign in to see your latest SEO results.</p>

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-[#e4c9c9] bg-[#fbf1f1] px-4 py-3 text-sm text-[#8a2f2f]"
            >
              {errorMessage}
            </div>
          )}

          {configured ? (
            <LoginForm startMode={startMode} />
          ) : (
            <p className="text-sm text-body">
              The portal isn&apos;t configured yet. Set the Supabase environment variables
              (see <code className="font-mono text-xs">SETUP-portal.md</code>) to enable sign in.
            </p>
          )}
        </div>

        <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          Need access? Ask your RiseRidge contact.
        </p>
      </div>
    </main>
  );
}
