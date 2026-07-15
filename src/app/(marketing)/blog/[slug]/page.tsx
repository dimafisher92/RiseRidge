import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs } from '@/lib/blog';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';
import { Markdown } from '@/components/Markdown';

interface Props {
  params: { slug: string };
}

// Only pre-rendered slugs are valid; unknown ones 404 (no runtime fs read).
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | RiseRidge Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: `${post.title} | RiseRidge`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: post.title, href: `/blog/${params.slug}` },
        ]}
      />
      <JsonLd
        type="article"
        article={{
          title: post.title,
          description: post.excerpt,
          url: `/blog/${params.slug}`,
          datePublished: post.date,
          authorName: post.authorName ?? undefined,
          image: post.coverImage || undefined,
          section: post.category ?? undefined,
        }}
      />

      <article>
        {/* Hero header */}
        <section className="relative overflow-hidden pt-32 pb-16">
          <AnimatedBackground />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <span className="inline-block rounded-full bg-electric/10 px-3 py-1 font-mono text-xs text-electric uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="mt-6 font-display font-semibold text-3xl sm:text-4xl md:text-5xl leading-[1.1] text-ice">
              {post.title}
            </h1>
            <p className="mt-5 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap font-mono text-xs text-muted">
              {post.authorName && (
                <>
                  <span>{post.authorName}</span>
                  <span className="text-border">·</span>
                </>
              )}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-border">·</span>
              <span>{estimateReadTime(post.body)}</span>
            </div>
          </div>
        </section>

        {/* Hero image */}
        {post.coverImage && (
          <section className="pb-16">
            <div className="mx-auto max-w-4xl px-6">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-[6px] border border-border bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </section>
        )}

        {/* Body */}
        <section className="pb-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="border-t border-border pt-12">
              {post.body ? (
                <Markdown content={post.body} />
              ) : (
                <p className="text-muted">No content yet.</p>
              )}
            </div>

            {/* Back link */}
            <div className="mt-16 pt-8 border-t border-border">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-electric transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 5 5 12 12 19" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        </section>
      </article>

      <CTASection
        heading="Want Results Like These?"
        description="Let RiseRidge's AI-powered SEO put your business on page one — and keep it there."
        primaryLabel="Get Your Free Audit"
        secondaryLabel="Read More Posts"
        secondaryHref="/blog"
      />
    </>
  );
}
