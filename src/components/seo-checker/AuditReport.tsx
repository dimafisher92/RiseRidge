'use client';

import Image from 'next/image';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import type { AuditResult, CheckResult, CheckStatus } from '@/lib/seo-checker/types';
import { ScoreGauge } from './ScoreGauge';
import { LeadGate } from './LeadGate';
import { PdfButton } from './PdfReport';

const STATUS_ICON: Record<CheckStatus, React.ReactNode> = {
  pass: <CheckCircle2 size={18} className="text-success" />,
  warn: <AlertTriangle size={18} className="text-gold" />,
  fail: <XCircle size={18} className="text-[#FF5470]" />,
};

function catColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 50) return 'text-gold';
  return 'text-[#FF5470]';
}

interface AuditReportProps {
  result: AuditResult;
  locked: boolean;
  onUnlock: () => void;
  onReset: () => void;
}

export function AuditReport({ result, locked, onUnlock, onReset }: AuditReportProps) {
  const displayHost = safeHost(result.finalUrl);

  return (
    <div className="print-report relative mx-auto max-w-4xl">
      {/* Print-only header (logo) — hidden on screen, shown in the PDF */}
      <div className="print-only mb-6 hidden items-center justify-between border-b border-gray-200 pb-4">
        <Image src="/logos/logo-horizontal.png" alt="ArcWave" width={1040} height={128} style={{ height: 32, width: 'auto' }} />
        <span className="text-xs text-gray-500">SEO Report · arcwave.io</span>
      </div>
      {/* Print-only diagonal watermark */}
      <div className="print-watermark" aria-hidden="true" />

      {/* Header: gauge + summary */}
      <div className="rounded-2xl border border-border bg-surface/60 p-6 md:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-10">
          <ScoreGauge score={result.overallScore} blurred={locked} />
          <div className="flex-1 text-center md:text-left">
            <p className="font-mono text-[11px] uppercase tracking-[3px] text-electric">
              SEO Health Score
            </p>
            <h2 className="mt-1 break-all font-display font-[800] text-2xl text-ice">
              {displayHost}
            </h2>

            {result.searchAtlasManaged && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-success">
                <Sparkles size={12} /> Optimized by ArcWave
              </span>
            )}

            <p className={`mt-3 text-sm text-muted ${locked ? 'select-none blur-sm' : ''}`}>
              {locked
                ? 'Your detailed summary is ready — unlock the report below to read it and see exactly what to improve.'
                : result.summary}
            </p>
          </div>
        </div>

        {/* Category sub-scores */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {result.categories.map((cat) => (
            <div key={cat.id} className="rounded-xl border border-border bg-void/40 p-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[2px] text-muted">{cat.label}</p>
              <p className={`mt-1 font-display font-[800] text-2xl tabular-nums ${catColor(cat.score)}`}>
                {cat.score}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Findings, grouped by category */}
      <div className="relative mt-6">
        {locked && <LeadGate url={result.finalUrl} score={result.overallScore} onUnlock={onUnlock} />}

        <div className={locked ? 'pointer-events-none' : ''}>
          {result.categories.map((cat) => (
            <section key={cat.id} className="mt-6 first:mt-0">
              <div className="mb-3 flex items-center gap-3">
                <h3 className="font-display font-[800] text-lg text-ice">{cat.label}</h3>
                <span className="h-px flex-1 bg-border" />
                <span className={`font-mono text-sm tabular-nums ${catColor(cat.score)}`}>{cat.score}/100</span>
              </div>
              <ul className="space-y-3">
                {cat.checks.map((check) => (
                  <FindingRow key={check.id} check={check} locked={locked} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* Actions */}
      {!locked && (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-navy/60 p-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-display font-[700] text-ice">Want us to fix these for you?</p>
            <p className="text-sm text-muted">ArcWave turns this report into ranked pages and real customers.</p>
          </div>
          <div className="flex items-center gap-3">
            <PdfButton />
            <button
              onClick={onReset}
              className="no-print inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-ice"
            >
              Check another site
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FindingRow({ check, locked }: { check: CheckResult; locked: boolean }) {
  return (
    <li className="rounded-xl border border-border bg-surface/40 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{STATUS_ICON[check.status]}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-body font-medium text-ice">{check.label}</span>
            {check.detail && (
              <span className="font-mono text-xs text-muted">{check.detail}</span>
            )}
          </div>
          {/* Gated/blurred valuable text */}
          <div className={locked ? 'select-none blur-sm' : ''}>
            <p className="mt-1.5 text-sm text-muted">{check.explanation}</p>
            {check.benefit && (
              <p className="mt-2 text-sm font-medium text-electric">{check.benefit}</p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function safeHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
