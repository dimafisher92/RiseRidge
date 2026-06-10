import { parse, type HTMLElement } from 'node-html-parser';
import type { PageData } from './types';
import { SEARCH_ATLAS_MARKERS } from './config';

// Turn raw HTML + final URL into a normalized PageData object for the checks.
export function parsePage(html: string, finalUrl: string): PageData {
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

  const canonical =
    root.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() || null;

  const ogTags = collectMeta(root, 'property', 'og:');
  const twitterTags = collectMeta(root, 'name', 'twitter:');

  // Links: classify internal vs external against the final URL's host.
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

  // JSON-LD: count parseable blocks.
  let jsonLdCount = 0;
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(s.text);
      if (parsed) jsonLdCount += 1;
    } catch {
      // ignore malformed block
    }
  }

  // Visible text for word count + readability proxy.
  const visibleText = extractVisibleText(root);
  const words = visibleText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = visibleText.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;

  const searchAtlasDetected = detectSearchAtlas(html, root);

  return {
    finalUrl,
    isHttps: base.protocol === 'https:',
    title,
    metaDescription,
    h1s,
    h2s,
    canonical,
    ogTags,
    twitterTags,
    robotsMeta,
    hasViewport,
    jsonLdCount,
    internalLinks,
    externalLinks,
    emptyAnchors,
    totalLinks,
    imagesTotal,
    imagesWithAlt,
    wordCount,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    searchAtlasDetected,
  };
}

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
  // Also scan the raw markup for attribute-level markers (e.g. data-otto="...").
  haystacks.push(html.slice(0, 200_000));
  const blob = haystacks.join(' ').toLowerCase();
  return SEARCH_ATLAS_MARKERS.some((marker) => blob.includes(marker));
}

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
