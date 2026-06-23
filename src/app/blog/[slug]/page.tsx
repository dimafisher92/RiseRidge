import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '../../../../tina/__generated__/client';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';
import { TinaRichText } from '@/components/TinaRichText';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const result = await client.queries.postConnection();
    return (result.data.postConnection.edges ?? []).map((edge) => ({
      slug: edge!.node!._sys.filename,
    }));
  } catch {
    // TinaCloud not yet indexed — pages will be generated on-demand at runtime
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const result = await client.queries.post({
      relativePath: `${params.slug}.md`,
    });
    const post = result.data.post;
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
  } catch {
    return {};
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function estimateReadTime(body: unknown): string {
  const text = JSON.stringify(body ?? '');
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default async function BlogPostPage({ params }: Props) {
  let post;
  try {
    const result = await client.queries.post({
      relativePath: `${params.slug}.md`,
    });
    post = result.data.post;
  } catch {
    notFound();
  }

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
          authorName: post.author?.name ?? undefined,
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
              {post.author?.name && (
                <>
                  <span>{post.author.name}</span>
                  <span className="text-border">·</span>
                </>
              )}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-border">·</span>
              <span>{estimateReadTime(post.body)}</span>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="pb-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="border-t border-border pt-12">
              {post.body ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <TinaRichText content={post.body as any} />
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
