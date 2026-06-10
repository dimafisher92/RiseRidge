'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';
import type { AuditResult, AuditErrorResponse } from '@/lib/seo-checker/types';
import { AuditLoader } from './AuditLoader';
import { AuditReport } from './AuditReport';

type Phase = 'idle' | 'loading' | 'result' | 'error';

export function SeoChecker() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [url, setUrl] = useState('');
  const [submittedUrl, setSubmittedUrl] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [locked, setLocked] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = url.trim();
    if (!value) return;

    setSubmittedUrl(value);
    setPhase('loading');
    setError(null);
    setResult(null);
    setLocked(true);

    // Ensure the loader is visible long enough to feel like real work.
    const started = Date.now();
    try {
      const res = await fetch('/api/seo-checker/audit/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value }),
      });

      const elapsed = Date.now() - started;
      if (elapsed < 2600) await new Promise((r) => setTimeout(r, 2600 - elapsed));

      if (!res.ok) {
        const err = (await res.json()) as AuditErrorResponse;
        setError(err.message ?? 'We could not analyze this site.');
        setPhase('error');
        return;
      }

      const data = (await res.json()) as AuditResult;
      setResult(data);
      setPhase('result');
    } catch {
      setError('Something went wrong. Please check the address and try again.');
      setPhase('error');
    }
  }

  function reset() {
    setPhase('idle');
    setResult(null);
    setLocked(true);
    setError(null);
    setUrl('');
  }

  return (
    <div className="relative mx-auto w-full max-w-4xl px-6">
      {/* URL input — hidden once we have a result so the report takes over */}
      {phase !== 'result' && (
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your website (e.g. yourbusiness.com)"
              disabled={phase === 'loading'}
              className="w-full rounded-lg border border-border bg-surface/70 py-4 pl-11 pr-4 text-ice placeholder:text-muted focus:border-electric focus:outline-none disabled:opacity-60"
              aria-label="Website address"
            />
          </div>
          <button
            type="submit"
            disabled={phase === 'loading' || !url.trim()}
            className="rounded-lg bg-electric px-8 py-4 font-body font-medium text-white transition-all duration-300 hover:bg-signal hover:glow-blue disabled:opacity-60"
          >
            {phase === 'loading' ? 'Analyzing…' : 'Check my SEO'}
          </button>
        </form>
      )}

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <AuditLoader url={submittedUrl} />
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-xl rounded-2xl border border-[#FF5470]/40 bg-[#FF5470]/5 p-6 text-center"
            >
              <AlertCircle size={28} className="mx-auto text-[#FF5470]" />
              <p className="mt-3 text-ice">{error}</p>
              <button
                onClick={reset}
                className="mt-5 rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-ice transition-colors hover:border-electric hover:text-electric"
              >
                Try again
              </button>
            </motion.div>
          )}

          {phase === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <AuditReport
                result={result}
                locked={locked}
                onUnlock={() => setLocked(false)}
                onReset={reset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
