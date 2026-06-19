'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  authorName?: string | null;
  index: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogCard({ slug, title, excerpt, date, category, authorName, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      className="flex flex-col rounded-[6px] border border-line bg-white p-8 shadow-[0_10px_34px_rgba(21,20,15,0.05)] hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(21,20,15,0.10)] transition-all duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)] group"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="inline-block rounded-full border border-tag-border bg-tag-bg px-3 py-1 font-mono text-[11px] text-forest uppercase tracking-[0.14em]">
          {category}
        </span>
        <time dateTime={date} className="font-mono text-xs text-subtle shrink-0">
          {formatDate(date)}
        </time>
      </div>

      <h2 className="mt-5 font-display font-semibold text-2xl text-ink leading-snug group-hover:text-forest transition-colors duration-200">
        {title}
      </h2>

      <p className="mt-3 text-sm text-body leading-relaxed flex-1">
        {excerpt}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
        {authorName && (
          <span className="font-mono text-xs text-subtle">{authorName}</span>
        )}
        <Link
          href={`/blog/${slug}`}
          className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-brass hover:text-brass-hover transition-colors"
          aria-label={`Read article: ${title}`}
        >
          Read Article
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}
