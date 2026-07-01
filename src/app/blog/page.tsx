import type { Metadata } from 'next';
import { client } from '../../../tina/__generated__/client';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { SectionLabel } from '@/components/SectionLabel';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CTASection } from '@/components/CTASection';
import { JsonLd } from '@/components/JsonLd';
import { BlogCard } from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'SEO Blog & Insights | RiseRidge',
  description:
    'Expert insights on AI-powered SEO, content strategy, technical optimization, and search visibility. Written by the RiseRidge team.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'SEO Blog & Insights | RiseRidge',
    description:
      'Expert insights on AI-powered SEO, content strategy, and search visibility from the RiseRidge team.',
  },
};

export default async function BlogPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = [];
  try {
    const result = await client.queries.postConnection({ sort: 'date' });
    posts = (result.data.postConnection.edges ?? [])
      .map((edge) => edge!.node!)
      .reverse();
  } catch {
    // TinaCloud not yet indexed — render empty state
  }

  return (
    <>
      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <AnimatedBackground />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-electric mb-6">
            Insights & Strategy
          </p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-ice">
            The RiseRidge{' '}
            <span className="text-gradient-blue-cyan">SEO Blog</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            AI-powered strategies, technical deep-dives, and industry insights to help
            growth-stage brands dominate organic search.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-24" aria-labelledby="blog-posts-heading">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <SectionLabel number="01" text="Latest Articles" />
            <h2
              id="blog-posts-heading"
              className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ice"
            >
              Fresh From the Team
            </h2>
            <p className="mt-4 text-muted max-w-2xl">
              Actionable guides and industry analysis from our SEO specialists and AI engineers.
            </p>
          </ScrollReveal>

          {posts.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <BlogCard
                  key={post._sys.filename}
                  slug={post._sys.filename}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  category={post.category}
                  authorName={post.author?.name}
                  coverImage={post.coverImage}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-muted text-center">No posts published yet. Check back soon.</p>
          )}
        </div>
      </section>

      <CTASection
        heading="Ready to Dominate Search?"
        description="Let our AI-powered SEO engine do for your business what great content alone can't."
        primaryLabel="Get Your Free Audit"
        secondaryLabel="See Our Results"
        secondaryHref="/case-studies"
      />
    </>
  );
}
