'use client';

import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

interface LeadGateProps {
  url: string;
  score: number;
  onUnlock: () => void;
}

// Inline overlay (not a portal) that sits over the blurred report. Collects
// name/email/phone, posts to the lead route, then unlocks the report. Unlocks
// even if the webhook fails — lead capture is best-effort, UX is never blocked.
export function LeadGate({ url, score, onUnlock }: LeadGateProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your name, email and phone.');
      return;
    }

    setSubmitting(true);
    try {
      await fetch('/api/seo-checker/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, url, score }),
      });
    } catch {
      // best-effort; ignore network errors and unlock anyway
    } finally {
      setSubmitting(false);
      onUnlock();
    }
  }

  return (
    <div className="no-print absolute inset-0 z-20 flex items-start justify-center px-4 pt-16 md:pt-24">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface/95 p-6 shadow-2xl backdrop-blur-md md:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-electric/10 text-electric">
          <Lock size={22} />
        </div>
        <h3 className="text-center font-display font-semibold text-xl text-ice">
          Unlock your full SEO report
        </h3>
        <p className="mt-2 text-center text-sm text-muted">
          See your score and exactly what to fix — plus what each fix means for your business.
          Enter your details to reveal the full results instantly.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
            required
            className="w-full rounded-lg border border-border bg-void/60 px-4 py-3 text-sm text-ice placeholder:text-muted focus:border-electric focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-border bg-void/60 px-4 py-3 text-sm text-ice placeholder:text-muted focus:border-electric focus:outline-none"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            autoComplete="tel"
            required
            className="w-full rounded-lg border border-border bg-void/60 px-4 py-3 text-sm text-ice placeholder:text-muted focus:border-electric focus:outline-none"
          />

          {error && <p className="text-sm text-[#FF5470]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-electric px-6 py-3.5 font-body font-medium text-white transition-all duration-300 hover:bg-signal hover:glow-blue disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Revealing…
              </>
            ) : (
              'Reveal my full report'
            )}
          </button>
          <p className="text-center text-[11px] text-muted">
            We&apos;ll only use your details to share your results and how we can help. No spam.
          </p>
        </form>
      </div>
    </div>
  );
}
