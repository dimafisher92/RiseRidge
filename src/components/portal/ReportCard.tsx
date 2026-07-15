import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Report-history list item — the BlogCard shell adapted for reports.
export function ReportCard({
  id,
  title,
  periodLabel,
  highlight,
  isLatest = false,
}: {
  id: string;
  title: string;
  periodLabel: string;
  highlight?: string | null;
  isLatest?: boolean;
}) {
  return (
    <Link
      href={`/portal/reports/${id}/`}
      className="group block rounded-[10px] border border-line bg-white p-6 shadow-[0_8px_28px_rgba(21,20,15,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(21,20,15,0.08)]"
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{periodLabel}</span>
        {isLatest && (
          <span className="rounded-full border border-tag-border bg-tag-bg px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-forest">
            Latest
          </span>
        )}
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold text-ink">{title}</h3>
      {highlight && <p className="mt-1 text-sm text-body">{highlight}</p>}
      <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-brass">
        View report
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
