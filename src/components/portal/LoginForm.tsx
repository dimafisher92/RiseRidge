'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Mode = 'login' | 'reset';

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setError('Incorrect email or password.');
        return;
      }
      // Full navigation so middleware + server components pick up the new cookie.
      router.replace('/portal/dashboard/');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!email.trim()) {
      setError('Enter your email to receive a reset link.');
      return;
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback/?next=/portal/dashboard/`;
      await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      // Always show the same message regardless of whether the email exists.
      setNotice('If an account exists for that email, a reset link is on its way.');
    } catch {
      setNotice('If an account exists for that email, a reset link is on its way.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={mode === 'login' ? handleLogin : handleReset}
      className="w-full space-y-4"
      noValidate
    >
      <div className="flex items-center gap-2 text-brass-text">
        <Lock className="h-4 w-4" aria-hidden />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
          {mode === 'login' ? 'Client sign in' : 'Reset password'}
        </span>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-subtle focus:border-forest focus:outline-none"
          placeholder="you@company.com"
        />
      </div>

      {mode === 'login' && (
        <div>
          <label htmlFor="password" className="mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-subtle focus:border-forest focus:outline-none"
            placeholder="••••••••"
          />
        </div>
      )}

      {error && <p className="text-sm text-[#a23b3b]">{error}</p>}
      {notice && <p className="text-sm text-forest">{notice}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-on-dark transition-colors hover:bg-forest-hover disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {mode === 'login' ? 'Sign in' : 'Send reset link'}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === 'login' ? 'reset' : 'login');
          setError(null);
          setNotice(null);
        }}
        className="w-full text-center font-mono text-[11px] uppercase tracking-[0.14em] text-subtle underline-offset-4 hover:text-brass hover:underline"
      >
        {mode === 'login' ? 'Forgot your password?' : 'Back to sign in'}
      </button>
    </form>
  );
}
