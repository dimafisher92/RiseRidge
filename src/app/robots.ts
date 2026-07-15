import type { MetadataRoute } from 'next';

const baseUrl = 'https://riseridge.io';

// AI / LLM crawlers we explicitly welcome so RiseRidge can be cited and
// surfaced inside AI answer engines (ChatGPT, Claude, Gemini, Perplexity, etc.).
const aiCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'cohere-ai',
  'Bytespider',
  'CCBot',
  'Meta-ExternalAgent',
  'DuckAssistBot',
  'YouBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/portal', '/login'],
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
