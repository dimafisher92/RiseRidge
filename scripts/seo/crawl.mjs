#!/usr/bin/env node
// Technical SEO crawl of the live site (or a local server).
//   node scripts/seo/crawl.mjs [--base https://riseridge.io] [--urls /a/,/b/] [--out file.json]
// Without --urls it crawls every URL in <base>/sitemap.xml. Sitemap URLs are
// rewritten onto --base so a local server can be checked with the prod sitemap.
// Exit 2 = regressions (errors), 0 = OK or warnings only, 3 = site unreachable.
import { parse } from 'node-html-parser';
import { arg, writeJson, SITE } from './lib.mjs';

const base = String(arg('base', SITE)).replace(/\/$/, '');
const out = arg('out');
const urlsArg = arg('urls');
const CONCURRENCY = 4;
const UA = 'RiseRidgeSEOAutopilot/1.0 (+https://riseridge.io)';

async function get(url, method = 'GET', attempt = 1) {
  try {
    const res = await fetch(url, { method, redirect: 'manual', headers: { 'user-agent': UA } });
    const text = method === 'GET' ? await res.text() : '';
    return { status: res.status, location: res.headers.get('location'), text };
  } catch (e) {
    // One retry for transient network errors (e.g. ECONNRESET through the sandbox
    // proxy), so a blip is not reported as a site regression.
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 1500));
      return get(url, method, attempt + 1);
    }
    return { status: 0, error: String(e.cause?.code || e.message), text: '' };
  }
}

const onBase = (u) => {
  const url = new URL(u, base + '/');
  return base + url.pathname + url.search;
};
const canon = (u) => {
  try {
    const url = new URL(u, base + '/');
    return url.pathname.replace(/\/$/, '') || '/';
  } catch {
    return u;
  }
};

const site = { errors: [], warnings: [] };

// --- site-level files ---
const robots = await get(`${base}/robots.txt`);
if (robots.status === 0) {
  writeJson(out, { ok: false, unreachable: true, base, error: robots.error });
  console.error(`Site unreachable: ${base} (${robots.error})`);
  process.exit(3);
}
if (robots.status !== 200) site.errors.push(`robots.txt returned ${robots.status}`);
else if (/User-agent:\s*\*\s*\n(?:[^\n]*\n)*?\s*Disallow:\s*\/\s*$/im.test(robots.text)) site.errors.push('robots.txt disallows / for *');

const llms = await get(`${base}/llms.txt`);
if (llms.status !== 200) site.errors.push(`llms.txt returned ${llms.status}`);

const sm = await get(`${base}/sitemap.xml`);
let sitemapUrls = [];
if (sm.status !== 200) site.errors.push(`sitemap.xml returned ${sm.status}`);
else sitemapUrls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

const targets = urlsArg && urlsArg !== true
  ? String(urlsArg).split(',').map((s) => onBase(s.trim()))
  : sitemapUrls.map(onBase);

// --- per-page checks ---
const pages = [];
const internalLinks = new Map(); // url -> first page that links to it

async function checkPage(startUrl) {
  let url = startUrl;
  let r = await get(url);
  const page = { url: startUrl, status: r.status, errors: [], warnings: [] };
  // Follow up to 3 same-site redirects; a sitemap URL that redirects is itself a problem.
  for (let hop = 0; hop < 3 && r.status >= 300 && r.status < 400 && r.location; hop++) {
    const next = new URL(r.location, url).toString();
    page.warnings.push(`Redirects (${r.status}) to ${next}`);
    url = next;
    r = await get(url);
    page.finalUrl = url;
    page.status = r.status;
  }
  if (r.status !== 200) {
    page.errors.push(`HTTP ${r.status || r.error}`);
    return page;
  }
  const root = parse(r.text);
  const title = root.querySelector('title')?.text.trim() || '';
  const desc = root.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  const robotsMeta = root.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  const h1s = root.querySelectorAll('h1');
  Object.assign(page, { title, description: desc, canonical, h1: h1s.map((h) => h.text.trim()) });

  if (!title) page.errors.push('Missing <title>');
  else if (title.length > 65 || title.length < 25) page.warnings.push(`Title length ${title.length} (25-65)`);
  if (/\|\s*RiseRidge.*\|\s*RiseRidge/i.test(title)) page.warnings.push('Title has a duplicated "| RiseRidge" suffix');
  if (!desc) page.errors.push('Missing meta description');
  else if (desc.length > 165 || desc.length < 70) page.warnings.push(`Description length ${desc.length} (70-165)`);
  if (!canonical) page.errors.push('Missing canonical');
  else if (canon(canonical) !== canon(url)) page.warnings.push(`Canonical points elsewhere: ${canonical}`);
  if (/noindex/i.test(robotsMeta)) page.errors.push(`meta robots: ${robotsMeta}`);
  if (h1s.length !== 1) page.errors.push(`${h1s.length} <h1> elements (expected 1)`);

  const ld = root.querySelectorAll('script[type="application/ld+json"]');
  page.jsonLdTypes = [];
  for (const s of ld) {
    try {
      const j = JSON.parse(s.text);
      for (const item of Array.isArray(j) ? j : [j]) page.jsonLdTypes.push([].concat(item['@type'] || '?').join('+'));
    } catch {
      page.errors.push('Invalid JSON-LD block');
    }
  }
  if (ld.length === 0) page.warnings.push('No JSON-LD');

  const noAlt = root.querySelectorAll('img').filter((img) => img.getAttribute('alt') === undefined);
  if (noAlt.length) page.warnings.push(`${noAlt.length} <img> without alt attribute`);
  const emptyAlt = root.querySelectorAll('img').filter((img) => img.getAttribute('alt') === '' && !img.getAttribute('aria-hidden'));
  if (emptyAlt.length) page.warnings.push(`${emptyAlt.length} <img> with empty alt`);

  for (const a of root.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/i.test(href)) continue;
    let abs;
    try {
      abs = new URL(href, url);
    } catch {
      continue;
    }
    const isInternal = abs.origin === new URL(base).origin || /(^|\.)riseridge\.io$/i.test(abs.hostname);
    if (!isInternal || abs.hostname.startsWith('seo.')) continue;
    const key = onBase(abs.pathname);
    if (!internalLinks.has(key)) internalLinks.set(key, url);
  }
  return page;
}

async function pool(items, fn) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx]);
      }
    }),
  );
  return results;
}

pages.push(...(await pool(targets, checkPage)));

const redirecting = pages.filter((p) => p.finalUrl);
if (redirecting.length) site.warnings.push(`${redirecting.length} crawled/sitemap URLs redirect (sitemap should list final URLs, e.g. with trailing slash)`);

// Broken internal links (only links not already crawled)
const crawled = new Set(pages.flatMap((p) => [canon(p.url), canon(p.finalUrl || p.url)]));
const toCheck = [...internalLinks.keys()].filter((u) => !crawled.has(canon(u))).slice(0, 300);
const linkResults = await pool(toCheck, async (u) => ({ u, r: await get(u, 'HEAD') }));
for (const { u, r } of linkResults) {
  if (r.status >= 400 || r.status === 0) site.errors.push(`Broken internal link ${u} (HTTP ${r.status || r.error}) on ${internalLinks.get(u)}`);
}
for (const p of pages) if (p.status === 200 && p.errors.length === 0 && p.warnings.length === 0) delete p.warnings;

// Duplicate titles / descriptions
const dup = (key) => {
  const m = new Map();
  for (const p of pages) if (p[key]) m.set(p[key], [...(m.get(p[key]) || []), p.url]);
  return [...m.entries()].filter(([, v]) => v.length > 1).map(([k, v]) => ({ [key]: k, urls: v }));
};
const duplicateTitles = dup('title');
const duplicateDescriptions = dup('description');
if (duplicateTitles.length) site.warnings.push(`${duplicateTitles.length} duplicate titles`);
if (duplicateDescriptions.length) site.warnings.push(`${duplicateDescriptions.length} duplicate descriptions`);

const errorPages = pages.filter((p) => p.errors.length);
const result = {
  ok: site.errors.length === 0 && errorPages.length === 0,
  base,
  crawledAt: new Date().toISOString(),
  summary: {
    pages: pages.length,
    pagesWithErrors: errorPages.length,
    pagesWithWarnings: pages.filter((p) => p.warnings?.length).length,
    siteErrors: site.errors.length,
    internalLinksChecked: toCheck.length,
  },
  site,
  duplicateTitles,
  duplicateDescriptions,
  pages,
};
writeJson(out, result);
if (out) console.error(JSON.stringify({ ok: result.ok, ...result.summary, siteErrors: site.errors }, null, 2));
process.exit(result.ok ? 0 : 2);
