import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LoginForm } from '@/components/portal/LoginForm';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  const configured = isSupabaseConfigured();

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

          {configured ? (
            <LoginForm />
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
