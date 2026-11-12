import type { Metadata } from 'next';
import { ServicePage, type ServicePageContent } from '@/components/ServicePage';

export const metadata: Metadata = {
  title: 'AI SEO Agency for ChatGPT & AI Overviews',
  description:
    'RiseRidge is an AI SEO agency that gets brands recommended by ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews. Month-to-month, tracked prompt by prompt.',
  alternates: { canonical: '/ai-seo-agency' },
  openGraph: {
    title: 'AI SEO Agency (GEO) | RiseRidge',
    description: 'Get your brand mentioned and cited when buyers ask AI assistants for a recommendation.',
  },
};

const CONTENT: ServicePageContent = {
  path: '/ai-seo-agency',
  breadcrumb: 'AI SEO Agency',
  eyebrow: 'AI SEO · Generative engine optimization',
  title: 'AI SEO agency for brands that want to be',
  titleAccent: 'recommended by AI',
  answer:
    'RiseRidge is an AI SEO agency. We get your brand mentioned and cited when buyers ask ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews for a recommendation, and we keep growing your Google rankings at the same time. Every month you see which prompts mention you, which sources the AI engines cite, and what we changed.',
  primaryCta: 'Get a Free AI Visibility Audit',
  included: [
    {
      title: 'Prompt tracking',
      description:
        'We track the questions your buyers ask AI assistants, such as "best [product] for [use case]", and measure how often each engine mentions and cites you compared with your competitors.',
    },
    {
      title: 'Citation source analysis',
      description:
        'AI answers are built from a handful of sources: listicles, directories, review sites and guides. We find the exact pages cited for your prompts and plan how to get onto them.',
    },
    {
      title: 'Answer-first content',
      description:
        'Pages and articles built around the sub-questions AI breaks a query into, with direct answers up top, comparison tables and FAQs that are easy to quote.',
    },
    {
      title: 'Entity and structured data',
      description:
        'Organization, Service, Product and FAQ schema, consistent facts across your site and profiles, and an llms.txt file, so models describe your business correctly.',
    },
    {
      title: 'Third-party presence',
      description:
        'Directory profiles, inclusion pitches to the roundups AI already cites, and digital PR built on your own data. No paid link schemes.',
    },
    {
      title: 'AI crawler access',
      description:
        'robots.txt rules for GPTBot, OAI-SearchBot, PerplexityBot and other AI crawlers, server-rendered content, fast pages, clean sitemaps, and IndexNow for fast Bing indexing.',
    },
  ],
  steps: [
    {
      title: 'Baseline',
      description:
        'We run your buyer prompts across the AI engines and record your mention rate, the pages they cite, and the competitors they name instead of you.',
    },
    {
      title: 'Fix the foundations',
      description:
        'Crawl access, structured data, entity facts, and the pages AI should cite: service pages, comparisons and FAQs.',
    },
    {
      title: 'Earn the sources',
      description:
        'Get listed and mentioned on the directories, roundups and publications that AI engines cite for your prompts.',
    },
    {
      title: 'Measure and repeat',
      description:
        'Weekly prompt tracking and a monthly report: mention rate, citations, AI referral traffic and organic revenue.',
    },
  ],
  proof: [
    {
      client: 'DTC accessories brand on Shopify',
      period: 'First 40 days of SEO + GEO',
      stats: [
        { value: '$0 → $22.1K', label: 'First-time customer sales from ChatGPT' },
        { value: '43 → 4,387', label: 'Visits from ChatGPT' },
        { value: '#2', label: 'Organic source of new customers, after Google' },
        { value: '$5.03', label: 'Revenue per ChatGPT visit, 2.3x a Google visit' },
      ],
    },
    {
      client: 'DTC travel-bag brand, two Shopify stores',
      period: 'English and Spanish stores',
      stats: [
        { value: '+102%', label: 'Flagship organic revenue' },
        { value: '866 → 34,257', label: 'Rich-snippet (product) impressions' },
      ],
    },
  ],
  fit: [
    'E-commerce and Shopify brands whose buyers ask AI "what\'s the best..." before they buy',
    'Local and professional service businesses that AI assistants shortlist by city',
    'B2B and SaaS companies that need to appear in AI comparisons and "alternatives to" answers',
    'Brands that already rank on Google but are missing from AI answers',
  ],
  guides: [
    { href: '/blog/what-is-generative-engine-optimization/', title: 'What is generative engine optimization (GEO)?' },
    { href: '/blog/check-if-chatgpt-recommends-your-brand/', title: 'How to check if ChatGPT recommends your brand' },
    { href: '/blog/get-cited-in-google-ai-overviews/', title: 'How to get cited in Google AI Overviews' },
    { href: '/blog/get-cited-in-perplexity/', title: 'How to get your brand cited in Perplexity answers' },
    { href: '/blog/query-fan-out-ai-search/', title: 'Query fan-out: why AI turns one keyword into a dozen questions' },
    { href: '/blog/chatgpt-recommendation-experiment/', title: 'Our research: we asked ChatGPT to recommend a lawyer 15 times' },
    { href: '/rank-on-ai/', title: 'Rank on AI: our LLM visibility monitoring' },
  ],
  faqs: [
    {
      question: 'What does an AI SEO agency do?',
      answer:
        'An AI SEO agency, also called a GEO (generative engine optimization) agency, improves how often AI assistants like ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews mention, recommend and cite a brand. The work covers prompt tracking, answer-first content, structured data, consistent entity facts, and presence on the third-party sources those engines cite.',
    },
    {
      question: 'How is AI SEO different from traditional SEO?',
      answer:
        'Traditional SEO earns a position in a list of links. AI search gives one synthesized answer built from a few sources, so the goal is to be one of those sources or to be named in them. The foundations overlap (crawlability, authority, genuinely useful content), which is why we run both together.',
    },
    {
      question: 'How long does it take to show up in ChatGPT or Google AI Overviews?',
      answer:
        'Engines that search the web live, such as ChatGPT search, Perplexity and Google AI Overviews, can reflect changes once new or updated pages are indexed and start being cited. Answers that come from a model\'s training data change only when the model is updated. For one DTC accessories client, weekly visits from ChatGPT went from 16 to 807 the week after product structured data went live. We track your prompts every week so you can see movement prompt by prompt.',
    },
    {
      question: 'How do you measure AI visibility?',
      answer:
        'We track a fixed set of buyer prompts across the AI engines every week and report the share of answers that mention you, which of your pages are cited, which competitors are named, and the AI referral traffic that reaches your site.',
    },
    {
      question: 'Can you guarantee ChatGPT will recommend my brand?',
      answer:
        'No one can honestly guarantee what an AI engine will say. What we guarantee is transparency: you see every tracked prompt, every change we ship and the result. Engagements are month-to-month, so we earn each month with results.',
    },
    {
      question: 'Do you also do traditional SEO?',
      answer:
        'Yes. AI visibility builds on the same foundations as Google rankings, so every engagement includes technical SEO, content and rank tracking. We also run dedicated Shopify SEO and local SEO programs.',
    },
  ],
  cta: {
    heading: 'Find Out What AI Says About Your Brand',
    description:
      'Get a free audit: which of your buyer prompts mention you today, which competitors AI recommends instead, and what to fix first.',
    primaryLabel: 'Get Your Free AI Visibility Audit',
  },
  schema: {
    name: 'AI SEO and Generative Engine Optimization',
    serviceType: 'Generative Engine Optimization',
    description:
      'Prompt tracking, citation analysis, answer-first content, structured data and third-party presence to get brands mentioned and cited by ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews.',
  },
};

export default function AiSeoAgencyPage() {
  return <ServicePage content={CONTENT} />;
}
