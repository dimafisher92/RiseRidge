import { parse, type HTMLElement } from 'node-html-parser';
import type { AiBotsResult, PageData } from './types';
import { SEARCH_ATLAS_MARKERS } from './config';

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'anthropic-ai',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'cohere-ai',
];

interface AuxData {
  robotsTxt?: string | null;
  llmsTxt?: string | null;
}

// Turn raw HTML + final URL into a normalized PageData object for the checks.
export function parsePage(html: string, finalUrl: string, aux: AuxData = {}): PageData {
  const root = parse(html, {
    lowerCaseTagName: true,
    comment: false,
    blockTextElements: { script: true, style: true, noscript: true },
  });

  const base = new URL(finalUrl);

  const title = textOrNull(root.querySelector('title')?.text);
  const metaDescription = metaContent(root, 'name', 'description');
  const robotsMeta = (metaContent(root, 'name', 'robots') ?? '').toLowerCase() || null;
  const hasViewport = Boolean(metaContent(root, 'name', 'viewport'));

  const h1s = root.querySelectorAll('h1').map((el) => cleanText(el.text)).filter(Boolean);
  const h2s = root.querySelectorAll('h2').map((el) => cleanText(el.text)).filter(Boolean);
  const h3s = root.querySelectorAll('h3').map((el) => cleanText(el.text)).filter(Boolean);

  const questionHeadings = [...h2s, ...h3s].filter((t) => t.includes('?')).length;

  const canonical =
    root.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() || null;

  const ogTags = collectMeta(root, 'property', 'og:');
  const twitterTags = collectMeta(root, 'name', 'twitter:');

  // Links: classify internal vs external.
  let internalLinks = 0;
  let externalLinks = 0;
  let emptyAnchors = 0;
  const anchors = root.querySelectorAll('a');
  for (const a of anchors) {
    const href = a.getAttribute('href')?.trim();
    if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('#')) {
      emptyAnchors += 1;
      continue;
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    try {
      const resolved = new URL(href, base);
      if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') continue;
      if (sameApex(resolved.hostname, base.hostname)) internalLinks += 1;
      else externalLinks += 1;
    } catch {
      emptyAnchors += 1;
    }
  }
  const totalLinks = internalLinks + externalLinks;

  // Images + alt coverage.
  const imgs = root.querySelectorAll('img');
  const imagesTotal = imgs.length;
  const imagesWithAlt = imgs.filter((img) => (img.getAttribute('alt') ?? '').trim().length > 0).length;

  // JSON-LD: parse all blocks and collect types.
  let jsonLdCount = 0;
  const jsonLdTypes: string[] = [];
  const entitySchemaTypes: string[] = [];
  let hasFaqSchema = false;
  let hasHowToSchema = false;
  let hasAuthorMarkup = false;

  const ENTITY_TYPES = ['organization', 'localbusiness', 'person', 'product', 'service', 'restaurant', 'medicalorganization', 'event'];

  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    let data: unknown;
    try {
      data = JSON.parse(s.text);
    } catch {
      continue;
    }
    if (!data) continue;
    jsonLdCount += 1;

    const schemas = Array.isArray(data) ? data : [data];
    for (const schema of schemas) {
      if (typeof schema !== 'object' || schema === null) continue;
      const raw = (schema as Record<string, unknown>);
      const typeRaw = raw['@type'];
      const types = Array.isArray(typeRaw)
        ? typeRaw.map(String)
        : typeRaw ? [String(typeRaw)] : [];

      for (const t of types) {
        jsonLdTypes.push(t);
        const tl = t.toLowerCase();
        if (tl === 'faqpage') hasFaqSchema = true;
        if (tl === 'howto') hasHowToSchema = true;
        if (ENTITY_TYPES.includes(tl)) entitySchemaTypes.push(t);
        // Detect author markup in Article/BlogPosting
        if (['article', 'blogposting', 'newsarticle', 'webpage'].includes(tl)) {
          if (raw['author']) hasAuthorMarkup = true;
        }
      }

      // Author can also be a top-level Person schema
      const topType = types[0]?.toLowerCase() ?? '';
      if (topType === 'person' && raw['name']) hasAuthorMarkup = true;
    }
  }

  // Fallback author detection: itemprop="author" or meta name="author"
  if (!hasAuthorMarkup) {
    hasAuthorMarkup =
      root.querySelectorAll('[itemprop="author"]').length > 0 ||
      Boolean(metaContent(root, 'name', 'author'));
  }

  // Visible text for word count + readability proxy.
  const visibleText = extractVisibleText(root);
  const words = visibleText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = visibleText.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;

  const searchAtlasDetected = detectSearchAtlas(html, root);

  // AI Visibility: robots.txt analysis
  const aiBotsResult: AiBotsResult | null = aux.robotsTxt
    ? analyzeRobotsTxt(aux.robotsTxt)
    : null;

  // llms.txt: present if we got any non-empty content back
  const llmsTxtPresent: boolean | null =
    aux.llmsTxt === undefined ? null : aux.llmsTxt !== null && aux.llmsTxt.trim().length > 0;

  return {
    finalUrl,
    isHttps: base.protocol === 'https:',
    title,
    metaDescription,
    h1s,
    h2s,
    h3s,
    canonical,
    ogTags,
    twitterTags,
    robotsMeta,
    hasViewport,
    jsonLdCount,
    jsonLdTypes,
    internalLinks,
    externalLinks,
    emptyAnchors,
    totalLinks,
    imagesTotal,
    imagesWithAlt,
    wordCount,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    searchAtlasDetected,
    llmsTxtPresent,
    aiBotsResult,
    hasFaqSchema,
    hasHowToSchema,
    hasAuthorMarkup,
    entitySchemaTypes,
    questionHeadings,
  };
}

// ---- Robots.txt analysis ----

type RobotsSection = { agents: string[]; disallows: string[]; allows: string[] };

function parseRobotsTxt(text: string): RobotsSection[] {
  const sections: RobotsSection[] = [];
  let current: RobotsSection | null = null;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    const lower = line.toLowerCase();

    if (line === '' || line.startsWith('#')) {
      if (current?.agents.length) {
        sections.push(current);
        current = null;
      }
      continue;
    }

    if (lower.startsWith('user-agent:')) {
      const agent = lower.replace('user-agent:', '').trim();
      if (!current) current = { agents: [], disallows: [], allows: [] };
      current.agents.push(agent);
    } else if (lower.startsWith('disallow:') && current) {
      current.disallows.push(lower.replace('disallow:', '').trim());
    } else if (lower.startsWith('allow:') && current) {
      current.allows.push(lower.replace('allow:', '').trim());
    }
  }
  if (current?.agents.length) sections.push(current);
  return sections;
}

function isBotBlocked(sections: RobotsSection[], botName: string): boolean {
  const bot = botName.toLowerCase();
  const explicit = sections.find((s) => s.agents.includes(bot));
  if (explicit) {
    if (explicit.allows.includes('/')) return false;
    return explicit.disallows.includes('/');
  }
  // Fall back to wildcard
  const wildcard = sections.find((s) => s.agents.includes('*'));
  if (wildcard) {
    if (wildcard.allows.includes('/')) return false;
    return wildcard.disallows.includes('/');
  }
  return false;
}

function analyzeRobotsTxt(robotsTxt: string): AiBotsResult {
  const sections = parseRobotsTxt(robotsTxt);
  const allowed: string[] = [];
  const blocked: string[] = [];
  for (const bot of AI_BOTS) {
    if (isBotBlocked(sections, bot)) blocked.push(bot);
    else allowed.push(bot);
  }
  return { allowed, blocked };
}

// ---- Search Atlas detection ----

function detectSearchAtlas(html: string, root: HTMLElement): boolean {
  const haystacks: string[] = [];
  for (const s of root.querySelectorAll('script')) {
    const src = s.getAttribute('src');
    if (src) haystacks.push(src);
    if (s.text) haystacks.push(s.text);
  }
  for (const m of root.querySelectorAll('meta')) {
    haystacks.push(m.getAttribute('content') ?? '', m.getAttribute('name') ?? '');
  }
  haystacks.push(html.slice(0, 200_000));
  const blob = haystacks.join(' ').toLowerCase();
  return SEARCH_ATLAS_MARKERS.some((marker) => blob.includes(marker));
}

// ---- Helpers ----

function extractVisibleText(root: HTMLElement): string {
  for (const el of root.querySelectorAll('script, style, noscript, template, svg')) {
    el.remove();
  }
  const body = root.querySelector('body') ?? root;
  return cleanText(body.text);
}

function metaContent(root: HTMLElement, attr: string, name: string): string | null {
  const el = root.querySelector(`meta[${attr}="${name}"]`);
  const content = el?.getAttribute('content')?.trim();
  return content && content.length > 0 ? content : null;
}

function collectMeta(root: HTMLElement, attr: string, prefix: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of root.querySelectorAll('meta')) {
    const key = m.getAttribute(attr)?.toLowerCase();
    if (key && key.startsWith(prefix)) {
      const content = m.getAttribute('content')?.trim();
      if (content) out[key] = content;
    }
  }
  return out;
}

function sameApex(a: string, b: string): boolean {
  const norm = (h: string) => h.toLowerCase().replace(/^www\./, '');
  const ax = norm(a).split('.').slice(-2).join('.');
  const bx = norm(b).split('.').slice(-2).join('.');
  return ax === bx;
}

function cleanText(text: string | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim();
}

function textOrNull(text: string | undefined): string | null {
  const t = cleanText(text);
  return t.length > 0 ? t : null;
}
