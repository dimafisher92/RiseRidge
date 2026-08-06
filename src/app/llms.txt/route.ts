import { getAllPosts } from '@/lib/blog';

const baseUrl = 'https://riseridge.io';

// Allow Next.js to statically cache this and revalidate periodically so new
// blog posts surface without a full redeploy.
export const revalidate = 86400; // 24h
export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPosts().map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
  }));

  const blogSection =
    posts.length > 0
      ? posts
          .map(
            (p) =>
              `- [${p.title}](${baseUrl}/blog/${p.slug}): ${p.excerpt}`,
          )
          .join('\n')
      : `- [RiseRidge Blog](${baseUrl}/blog): Guides on SEO, AI search visibility, and technical optimization.`;

  const body = `# RiseRidge

> RiseRidge is an AI-driven SEO agency that engineers organic search growth that compounds. We pair proprietary AI-powered SEO infrastructure with hands-on strategic execution to move businesses from invisible to undeniable — and we prove every gain in the numbers.

RiseRidge helps e-commerce stores, local businesses, startups, and established brands grow organic traffic and revenue through technical SEO, content intelligence, and AI search (LLM) visibility optimization. We track and improve how brands appear across Google as well as AI answer engines like ChatGPT, Claude, Gemini, and Perplexity.

Key facts:
- Service model: senior-only team, month-to-month engagements, no long-term lock-in.
- Differentiators: proprietary AI SEO automation engine, data-driven (not opinion-driven) strategy, full-funnel focus on revenue rather than vanity metrics.
- Proven results include scaling organic revenue to $21K/day in 4 months, 255% year-over-year organic revenue growth, and 969% organic traffic growth in a restricted niche.
- Contact: hello@riseridge.io

## Core Pages

- [Home](${baseUrl}/): AI-driven SEO and measurable organic growth overview.
- [Features](${baseUrl}/features): The full suite of AI-powered SEO tools — automation engine, content intelligence, rank tracking, technical audits, backlink intelligence, LLM visibility monitor, and local SEO.
- [Rank on AI](${baseUrl}/rank-on-ai): How we monitor and improve brand visibility across ChatGPT, Claude, Gemini, and Perplexity (Generative Engine Optimization / LLM SEO).
- [Free SEO Checker](${baseUrl}/seo-checker): A free tool that audits any website's on-page and technical SEO and returns a prioritized report.
- [Case Studies](${baseUrl}/case-studies): Real client results with revenue and traffic outcomes.
- [About](${baseUrl}/about): Who RiseRidge is, our values, and our approach.

## Services

- [AI SEO Automation](${baseUrl}/features): Continuously crawls sites, identifies technical issues, generates optimized fixes, and deploys changes.
- [Content Intelligence](${baseUrl}/features): SEO-optimized content, topic clusters, and editorial planning that builds topical authority.
- [Technical SEO Audits](${baseUrl}/features): Core Web Vitals, crawlability, indexation, and structured data analysis with 24/7 monitoring.
- [Rank Tracking & Analytics](${baseUrl}/features): Real-time keyword position monitoring and competitor tracking.
- [LLM Visibility Monitoring](${baseUrl}/rank-on-ai): Tracks brand visibility, sentiment, and citations across AI answer engines.
- [Local SEO Management](${baseUrl}/features): Google Business Profile optimization and service-area targeting.

## Blog

${blogSection}

## Resources

- [Sitemap](${baseUrl}/sitemap.xml)
- [Free SEO Checker](${baseUrl}/seo-checker)
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
