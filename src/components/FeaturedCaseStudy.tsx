'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { ScrollReveal } from './ScrollReveal';

export interface FeaturedCaseStudySection {
  heading: string;
  body: string;
}

export interface FeaturedCaseStudyMetric {
  value: string;
  label: string;
}

interface FeaturedCaseStudyProps {
  number: string;
  category: string;
  title: string;
  headingId: string;
  intro: string;
  sections: FeaturedCaseStudySection[];
  metrics: FeaturedCaseStudyMetric[];
  /** Evidence blocks — charts, tables, stat grids. */
  children?: ReactNode;
  tone?: 'canvas' | 'panel';
}

export function FeaturedCaseStudy({
  number,
  category,
  title,
  headingId,
  intro,
  sections,
  metrics,
  children,
  tone = 'canvas',
}: FeaturedCaseStudyProps) {
  return (
    <section
      className={`border-t border-line py-24 ${tone === 'panel' ? 'bg-panel/50' : ''}`}
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <SectionLabel number={number} text="Featured Case Study" />
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
            {category}
          </p>
          <h2
            id={headingId}
            className="mt-3 font-display font-semibold text-3xl md:text-[2.6rem] leading-[1.14] text-ink max-w-4xl"
          >
            {title}
          </h2>
          <p className="mt-6 text-base md:text-lg text-body leading-relaxed max-w-3xl">{intro}</p>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, i) => (
            <ScrollReveal key={section.heading} delay={i * 0.12}>
              <div className="h-full rounded-[6px] border border-line bg-white p-7 shadow-[0_10px_34px_rgba(21,20,15,0.05)]">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-brass">
                  {section.heading}
                </h3>
                <p className="mt-3 text-sm text-body leading-relaxed">{section.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 rounded-[6px] bg-forest divide-y sm:divide-y-0 sm:divide-x divide-line-dark overflow-hidden">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="px-6 py-10 text-center"
              >
                <div className="font-display font-semibold text-3xl md:text-4xl text-brass leading-tight break-words">
                  {metric.value}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-on-dark-muted">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {children}
      </div>
    </section>
  );
}

interface EvidenceCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  footnote?: string;
  className?: string;
  children: ReactNode;
}

/** Shared shell for a chart, table, or stat grid inside a featured case study. */
export function EvidenceCard({
  title,
  subtitle,
  badge,
  footnote,
  className = '',
  children,
}: EvidenceCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-[6px] border border-line bg-white p-6 md:p-8 shadow-[0_10px_34px_rgba(21,20,15,0.05)] ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold text-xl text-ink">{title}</h3>
          {subtitle && (
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
              {subtitle}
            </p>
          )}
        </div>
        {badge && (
          <span className="rounded-full border border-tag-border bg-tag-bg px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-forest">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-6 flex-1">{children}</div>

      {footnote && (
        <p className="mt-6 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
          {footnote}
        </p>
      )}
    </div>
  );
}

interface CaseStudyTableProps {
  columns: string[];
  rows: string[][];
  /** Column indexes rendered in the brass accent (delta / change columns). */
  accentColumns?: number[];
  /** Renders the last row as an emphasised total. */
  totalRow?: boolean;
}

export function CaseStudyTable({
  columns,
  rows,
  accentColumns = [],
  totalRow = false,
}: CaseStudyTableProps) {
  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full min-w-[440px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {columns.map((column, i) => (
              <th
                key={column + i}
                scope="col"
                className={`px-2 pb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle ${
                  i === 0 ? '' : 'text-right'
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const isTotal = totalRow && rowIndex === rows.length - 1;
            return (
              <tr
                key={row[0] + rowIndex}
                className={`border-b border-line/70 last:border-0 ${isTotal ? 'bg-panel/60' : ''}`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-2 py-3 text-sm ${cellIndex === 0 ? 'text-body' : 'text-right tabular-nums'} ${
                      accentColumns.includes(cellIndex)
                        ? 'font-mono text-[13px] text-brass'
                        : ''
                    } ${isTotal ? 'font-semibold text-ink' : ''}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CaseStudyStatGrid({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          viewport={{ once: true }}
          className="bg-white px-4 py-8 text-center"
        >
          <div className="font-display font-semibold text-3xl text-forest">{stat.value}</div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
