'use client';

import Image from 'next/image';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, Bot } from 'lucide-react';
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
        <span className="flex items-center gap-2">
          <Image src="/icon.svg" alt="RiseRidge" width={32} height={32} style={{ height: 28, width: 28 }} />
          <span className="font-display text-lg font-semibold text-gray-900">RISERIDGE</span>
        </span>
        <span className="text-xs text-gray-500">SEO Report · riseridge.io</span>
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
                <Sparkles size={12} /> Optimized by RiseRidge
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
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {result.categories.map((cat) => {
            const isAi = cat.id === 'aivisibility';
            return (
              <div
                key={cat.id}
                className={`rounded-xl border p-4 text-center ${
                  isAi
                    ? 'border-electric/40 bg-electric/5'
                    : 'border-border bg-void/40'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {isAi && <Bot size={10} className="text-electric" />}
                  <p className={`font-mono text-[10px] uppercase tracking-[2px] ${isAi ? 'text-electric' : 'text-muted'}`}>
                    {cat.label}
                  </p>
                </div>
                <p className={`mt-1 font-display font-[800] text-2xl tabular-nums ${catColor(cat.score)}`}>
                  {cat.score}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Findings, grouped by category */}
      <div className="relative mt-6">
        {locked && <LeadGate url={result.finalUrl} score={result.overallScore} onUnlock={onUnlock} />}

        <div className={locked ? 'pointer-events-none' : ''}>
          {result.categories.map((cat) => {
            const isAi = cat.id === 'aivisibility';
            return (
              <section
                key={cat.id}
                className={`mt-6 first:mt-0 ${isAi ? 'rounded-2xl border border-electric/20 bg-electric/5 p-4 sm:p-6' : ''}`}
              >
                <div className="mb-3 flex items-center gap-3">
                  {isAi && <Bot size={16} className="shrink-0 text-electric" />}
                  <h3 className={`font-display font-[800] text-lg ${isAi ? 'text-electric' : 'text-ice'}`}>
                    {cat.label}
                  </h3>
                  {isAi && (
                    <span className="rounded-full border border-electric/40 bg-electric/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-electric">
                      NEW
                    </span>
                  )}
                  <span className="h-px flex-1 bg-border" />
                  <span className={`font-mono text-sm tabular-nums ${catColor(cat.score)}`}>{cat.score}/100</span>
                </div>
                {isAi && (
                  <p className="mb-4 text-xs text-muted">
                    AI search tools like ChatGPT, Perplexity, and Google AI Overview increasingly drive discovery. These checks measure how well your site is positioned to appear in AI-generated answers.
                  </p>
                )}
                <ul className="space-y-3">
                  {cat.checks.map((check) => (
                    <FindingRow key={check.id} check={check} locked={locked} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {!locked && (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-navy/60 p-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-display font-[700] text-ice">Want us to fix these for you?</p>
            <p className="text-sm text-muted">RiseRidge turns this report into ranked pages and real customers.</p>
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
