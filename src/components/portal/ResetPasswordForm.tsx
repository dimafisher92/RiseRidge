'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const inputCls =
  'w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-subtle focus:border-forest focus:outline-none';

export function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // The callback route establishes a recovery session (via code or token_hash)
  // before redirecting here, so the cookie is already set. As a fallback for
  // hash-based recovery links, the browser client fires PASSWORD_RECOVERY once
  // it parses the URL fragment.
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setHasSession(true);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setHasSession(!!data.session);
      setReady(true);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Those passwords don’t match.');
      return;
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError('Could not update the password — the reset link may have expired. Request a new one.');
        return;
      }
      setDone(true);
      setTimeout(() => {
        router.replace('/portal/dashboard/');
        router.refresh();
      }, 900);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return <p className="text-sm text-forest">Password updated — taking you to your dashboard…</p>;
  }

  // No recovery session — the link was invalid, already used, or expired.
  if (ready && !hasSession) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-body">
          This reset link is invalid or has expired. Reset links can only be used once and time out
          quickly.
        </p>
        <Link
          href="/login/"
          className="inline-flex items-center justify-center rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4" noValidate>
      <div className="flex items-center gap-2 text-brass-text">
        <Lock className="h-4 w-4" aria-hidden />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em]">Set a new password</span>
      </div>

      <div>
        <label htmlFor="new-password" className="mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="mb-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          Confirm password
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputCls}
          placeholder="Re-enter your new password"
        />
      </div>

      {error && <p className="text-sm text-[#a23b3b]">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !ready}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-hover disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Update password
      </button>
    </form>
  );
}
