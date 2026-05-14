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
      className="flex flex-col rounded-xl border border-border bg-navy/60 p-8 hover:border-electric/40 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="inline-block rounded-full bg-electric/10 px-3 py-1 font-mono text-xs text-electric uppercase tracking-wider">
          {category}
        </span>
        <time dateTime={date} className="font-mono text-xs text-muted shrink-0">
          {formatDate(date)}
        </time>
      </div>

      <h2 className="mt-5 font-display font-[800] text-xl text-ice leading-snug group-hover:text-electric/90 transition-colors duration-200">
        {title}
      </h2>

      <p className="mt-3 text-sm text-muted leading-relaxed flex-1">
        {excerpt}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        {authorName && (
          <span className="font-mono text-xs text-muted">{authorName}</span>
        )}
        <Link
          href={`/blog/${slug}`}
          className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-electric hover:text-signal transition-colors"
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
