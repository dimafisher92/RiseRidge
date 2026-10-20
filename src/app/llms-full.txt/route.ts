import { getAllPosts } from '@/lib/blog';

const baseUrl = 'https://riseridge.io';

// Full-text companion to /llms.txt: company facts plus the complete markdown of
// every blog post, so AI assistants can read our content in one request.
// Company facts must match content/facts.md.
export const revalidate = 86400; // 24h
export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPosts();

  const postsSection = posts
    .map((p) => {
      const updated = p.updated ? `\nUpdated: ${p.updated.slice(0, 10)}` : '';
      return `---

# ${p.title}

URL: ${baseUrl}/blog/${p.slug}/
Published: ${p.date.slice(0, 10)}${updated}
Category: ${p.category}

${p.body.trim()}
`;
    })
    .join('\n');

  const body = `# RiseRidge (full text)

> RiseRidge is an AI-driven SEO agency founded in 2020. It grows organic traffic and revenue for e-commerce and Shopify brands, local service businesses and growth-stage companies, and gets them recommended in AI search: ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews.

Summary index: ${baseUrl}/llms.txt

## Company facts

- Founded: 2020.
- Clients served: 250+.
- Client revenue generated: $25M+.
- Client retention: 97%.
- Average ROAS: 3x.
- Award: TOP 100 USA Entrepreneurs (TOP USA Awards 2023).
- Service model: senior-only team, month-to-month engagements, no long-term lock-in.
- Services: AI SEO automation, content intelligence, technical SEO audits, rank tracking and analytics, LLM visibility monitoring ("Rank on AI"), local SEO and Google Business Profile management.
- Contact: hello@riseridge.io
- Instagram: https://www.instagram.com/riseridge_ai/

## Key pages

- About: ${baseUrl}/about/
- Rank on AI (LLM visibility): ${baseUrl}/rank-on-ai/
- Case studies: ${baseUrl}/case-studies/
- Features and services: ${baseUrl}/features/
- Free SEO checker: ${baseUrl}/seo-checker/

## Blog posts (full text)

${postsSection}`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
