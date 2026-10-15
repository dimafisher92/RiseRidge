#!/usr/bin/env node
// Content quality + facts linter for blog posts.
//   node scripts/seo/content-lint.mjs content/posts/foo.md [more.md]
//   node scripts/seo/content-lint.mjs --changed origin/main   (posts changed vs base)
//   node scripts/seo/content-lint.mjs --all                    (basic checks on every post)
//
// Strict rules apply to new posts and to refreshed posts (`updated` set/changed).
// Other edits (e.g. adding a link to an old post) get the basic checks only.
// Exit 1 on any error. Warnings never fail.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, CATEGORIES, allPosts, readPost, wordCount, appRoutes, changedFiles, git, arg } from './lib.mjs';

const MIN_WORDS = Number(process.env.MIN_WORDS_NEW_POST || 1500);
const SERVICE_PATHS = ['/rank-on-ai', '/seo-checker', '/case-studies', '/features'];
const BANNED = [
  "in today's fast-paced",
  'in the ever-evolving',
  'ever-changing landscape',
  'digital landscape',
  'unlock the power',
  'unleash',
  'game-changer',
  'game changer',
  'delve into',
  "let's dive in",
  'dive deep into',
  'navigating the complexities',
  'in conclusion,',
  'it is important to note',
  "it's important to note",
  'a testament to',
  'look no further',
  'revolutionize',
  'supercharge',
  'embark on',
  'tapestry',
];
const FIRST_PARTY = /\b(riseridge|our clients?|we helped|we've helped|we grew|we drove|we increased|our case stud|our results|for one of our)\b/i;

// ---------- collect targets ----------
let targets = []; // { file, strict }
const allMode = process.argv.includes('--all');
const changedBase = arg('changed');
if (allMode) {
  targets = allPosts().map((p) => ({ file: `content/posts/${p.slug}.md`, strict: false }));
} else if (changedBase) {
  for (const { status, file } of changedFiles(changedBase)) {
    if (!/^content\/posts\/.+\.md$/.test(file) || status === 'D') continue;
    let strict = status === 'A';
    if (!strict) {
      const now = readPost(file).data.updated;
      let before;
      try {
        before = (git('show', `${changedBase}:${file}`).match(/^updated:\s*(.+)$/m) || [])[1];
      } catch {
        before = undefined;
      }
      strict = Boolean(now) && String(before ?? '').trim() !== toIso(now);
    }
    targets.push({ file, strict });
  }
} else {
  targets = process.argv.slice(2).filter((a) => a.endsWith('.md')).map((file) => ({ file, strict: true }));
}

function toIso(v) {
  return v instanceof Date ? v.toISOString() : String(v).trim();
}

// ---------- shared context ----------
const routes = appRoutes();
const posts = allPosts();
const postSlugs = new Set(posts.map((p) => p.slug));
const keywordOwners = new Map();
for (const p of posts) {
  if (!p.data.keyword) continue;
  const k = String(p.data.keyword).toLowerCase().trim();
  keywordOwners.set(k, [...(keywordOwners.get(k) || []), p.slug]);
}
const factNumbers = numbersIn(fs.readFileSync(path.join(ROOT, 'content', 'facts.md'), 'utf8'));

function numbersIn(text) {
  const set = new Set();
  for (const m of text.matchAll(/\d[\d,]*(?:\.\d+)?/g)) set.add(m[0].replace(/,/g, ''));
  return set;
}

function normalizePath(href) {
  let p = href.replace(/^https?:\/\/(www\.)?riseridge\.io/i, '');
  p = p.split('#')[0].split('?')[0];
  if (p.length > 1) p = p.replace(/\/$/, '');
  return p || '/';
}

// ---------- lint ----------
let errorCount = 0;
const report = [];
for (const { file, strict } of targets) {
  const errors = [];
  const warnings = [];
  const abs = path.isAbsolute(file) ? file : path.join(ROOT, file);
  if (!fs.existsSync(abs)) {
    report.push({ file, errors: ['File not found'], warnings });
    errorCount++;
    continue;
  }
  const { data, body, slug } = readPost(file);

  // Frontmatter
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push(`Slug "${slug}" must be lowercase-hyphenated.`);
  for (const k of ['title', 'excerpt', 'date', 'category', 'coverImage']) if (!data[k]) errors.push(`Missing frontmatter: ${k}`);
  if (!data.author?.name) errors.push('Missing frontmatter: author.name');
  if (data.category && !CATEGORIES.includes(data.category)) errors.push(`Category "${data.category}" not in ${CATEGORIES.join(', ')}`);
  if (data.date && Number.isNaN(new Date(data.date).getTime())) errors.push('date is not a valid date');
  if (data.updated && Number.isNaN(new Date(data.updated).getTime())) errors.push('updated is not a valid date');
  const title = String(data.title || '');
  if (/\|\s*riseridge/i.test(title)) errors.push('Title must not include "| RiseRidge" (the layout adds it).');
  if (title.length > 70) (strict ? errors : warnings).push(`Title is ${title.length} chars (max 70; aim for <= 60).`);
  const excerpt = String(data.excerpt || '');
  if (excerpt && (excerpt.length < 70 || excerpt.length > 170)) (strict ? errors : warnings).push(`Excerpt is ${excerpt.length} chars (70-170).`);
  if (data.coverImage) {
    const img = path.join(ROOT, 'public', String(data.coverImage).replace(/^\//, ''));
    if (!fs.existsSync(img)) errors.push(`coverImage not found: public${data.coverImage}`);
  }
  if (data.keyword) {
    const owners = keywordOwners.get(String(data.keyword).toLowerCase().trim()) || [];
    const others = owners.filter((s) => s !== slug);
    if (others.length) errors.push(`Keyword "${data.keyword}" already targeted by: ${others.join(', ')} (cannibalization).`);
  } else if (strict) {
    errors.push('Missing frontmatter: keyword (one primary keyword per page).');
  }

  // Body structure
  if (/^#\s/m.test(body)) errors.push('Body must not contain an H1 ("# "); the page renders the title as H1.');
  const words = wordCount(body);
  if (strict && words < MIN_WORDS) errors.push(`Only ${words} words (min ${MIN_WORDS} for new/refreshed posts).`);

  // Links
  const links = [...body.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => m[1]);
  const internal = links.filter((h) => h.startsWith('/') || /^https?:\/\/(www\.)?riseridge\.io/i.test(h));
  const external = links.filter((h) => /^https?:\/\//i.test(h) && !internal.includes(h));
  for (const href of internal) {
    const p = normalizePath(href);
    const m = p.match(/^\/blog\/([^/]+)$/);
    if (m) {
      if (!postSlugs.has(m[1])) errors.push(`Broken internal link: ${href} (no post "${m[1]}")`);
    } else if (!routes.has(p) && !p.startsWith('/uploads/')) {
      errors.push(`Broken internal link: ${href} (no route "${p}")`);
    }
  }
  const selfLinks = internal.filter((h) => normalizePath(h) === `/blog/${slug}`);
  if (selfLinks.length) warnings.push('Post links to itself.');
  if (strict) {
    const uniqueInternal = new Set(internal.map(normalizePath).filter((p) => p !== `/blog/${slug}`));
    if (uniqueInternal.size < 3) errors.push(`Only ${uniqueInternal.size} unique internal links (min 3).`);
    if (![...uniqueInternal].some((p) => SERVICE_PATHS.includes(p))) errors.push(`Needs at least one link to ${SERVICE_PATHS.join(' / ')}.`);
    const faq = body.split(/^##\s+(?:FAQ|Frequently Asked Questions)\s*$/im);
    if (faq.length < 2) errors.push('Missing "## FAQ" section.');
    else {
      const qs = (faq[1].split(/^##\s/m)[0].match(/^###\s+.+\?\s*$/gm) || []).length;
      if (qs < 3) errors.push(`FAQ has ${qs} questions (min 3, as "### Question?").`);
    }
    if (external.length === 0) warnings.push('No external source links. Every external statistic needs a source.');
  }

  // Style
  const lower = body.toLowerCase();
  for (const phrase of BANNED) if (lower.includes(phrase)) (strict ? errors : warnings).push(`Cliché phrase: "${phrase}"`);
  if (strict && (body.match(/—/g) || []).length > Math.max(6, words / 150)) warnings.push('Heavy em-dash use; vary sentence structure.');

  // Facts: numbers in sentences about RiseRidge / our clients must be in content/facts.md
  const prose = body.replace(/```[\s\S]*?```/g, ' ').replace(/\]\([^)]*\)/g, ']');
  for (const sentence of prose.split(/(?<=[.!?])\s+|\n+/)) {
    if (!FIRST_PARTY.test(sentence)) continue;
    for (const m of sentence.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
      const n = m[0].replace(/,/g, '');
      if (/^(19|20)\d\d$/.test(n)) continue; // years
      if (Number(n) <= 10 && !/[%x$]/.test(sentence.slice(m.index - 1, m.index + m[0].length + 1))) continue; // small counts ("3 steps")
      if (!factNumbers.has(n)) errors.push(`Unverified first-party number "${m[0]}" in: "${sentence.trim().slice(0, 140)}" (not in content/facts.md)`);
    }
  }

  if (errors.length) errorCount++;
  report.push({ file, strict, words, internalLinks: internal.length, externalLinks: external.length, errors, warnings });
}

console.log(JSON.stringify({ ok: errorCount === 0, checked: report.length, report }, null, 2));
process.exit(errorCount === 0 ? 0 : 1);
