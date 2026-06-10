import type { CategoryId, CheckResult, CheckStatus, PageData } from './types';
import { copyFor } from './copy';

// Helper to assemble a CheckResult with its business-language copy. For a pass,
// the visible explanation is the reassuring `pass` copy and no benefit is shown.
// For warn/fail, the explanation is the `issue` copy plus a benefit sentence.
function build(
  id: string,
  category: CategoryId,
  status: CheckStatus,
  earned: number,
  max: number,
  detail?: string,
): CheckResult {
  const copy = copyFor(id);
  const isPass = status === 'pass';
  return {
    id,
    category,
    label: copy.label,
    status,
    earned,
    max,
    explanation: isPass ? copy.pass : copy.issue,
    benefit: isPass ? undefined : copy.benefit,
    detail,
  };
}

// Partial-credit picker: pass -> full, warn -> 40%, fail -> 0.
function pts(max: number, status: CheckStatus): number {
  if (status === 'pass') return max;
  if (status === 'warn') return Math.round(max * 0.4);
  return 0;
}

export function runChecks(page: PageData): CheckResult[] {
  return [
    // ---- On-Page ----
    checkTitle(page),
    checkMetaDescription(page),
    checkH1(page),
    checkSubheadings(page),
    checkCanonical(page),
    // ---- Content ----
    checkWordCount(page),
    checkImageAlt(page),
    checkReadability(page),
    // ---- Technical ----
    checkHttps(page),
    checkIndexable(page),
    checkViewport(page),
    checkSocialCards(page),
    checkStructuredData(page),
    // ---- Links ----
    checkInternalLinks(page),
    checkOutboundLinks(page),
    checkLinkQuality(page),
    // ---- AI Visibility ----
    checkAiRobots(page),
    checkLlmsTxt(page),
    checkFaqSchema(page),
    checkAuthorMarkup(page),
    checkEntityClarity(page),
  ];
}

function checkTitle(p: PageData): CheckResult {
  const len = p.title?.length ?? 0;
  let status: CheckStatus;
  if (!p.title) status = 'fail';
  else if (len >= 35 && len <= 65) status = 'pass';
  else if (len >= 25 || len <= 80) status = 'warn';
  else status = 'fail';
  const max = 8;
  const preview = p.title ? `"${p.title.slice(0, 52)}${len > 52 ? '…' : ''}"` : '';
  return build('title-tag', 'onpage', status, pts(max, status), max,
    p.title ? `${len} chars — ${preview}` : 'No title found');
}

function checkMetaDescription(p: PageData): CheckResult {
  const len = p.metaDescription?.length ?? 0;
  let status: CheckStatus;
  if (!p.metaDescription) status = 'fail';
  else if (len >= 100 && len <= 160) status = 'pass';
  else if (len >= 70 || len <= 185) status = 'warn';
  else status = 'fail';
  const max = 7;
  const preview = p.metaDescription ? `"${p.metaDescription.slice(0, 55)}${len > 55 ? '…' : ''}"` : '';
  return build('meta-description', 'onpage', status, pts(max, status), max,
    p.metaDescription ? `${len} chars — ${preview}` : 'No description found');
}

function checkH1(p: PageData): CheckResult {
  let status: CheckStatus;
  if (p.h1s.length === 1) status = 'pass';
  else if (p.h1s.length === 0) status = 'fail';
  else status = 'warn';
  const max = 6;
  return build('h1-heading', 'onpage', status, pts(max, status), max,
    `${p.h1s.length} main heading${p.h1s.length === 1 ? '' : 's'}`);
}

function checkSubheadings(p: PageData): CheckResult {
  const status: CheckStatus = p.h2s.length >= 2 ? 'pass' : p.h2s.length === 1 ? 'warn' : 'fail';
  const max = 4;
  return build('subheadings', 'onpage', status, pts(max, status), max,
    `${p.h2s.length} subheadings`);
}

function checkCanonical(p: PageData): CheckResult {
  const status: CheckStatus = p.canonical ? 'pass' : 'fail';
  const max = 5;
  return build('canonical', 'onpage', status, pts(max, status), max,
    p.canonical ? 'Present' : 'Missing');
}

function checkWordCount(p: PageData): CheckResult {
  let status: CheckStatus;
  if (p.wordCount >= 400) status = 'pass';
  else if (p.wordCount >= 200) status = 'warn';
  else status = 'fail';
  const max = 8;
  return build('word-count', 'content', status, pts(max, status), max,
    `${p.wordCount} words`);
}

function checkImageAlt(p: PageData): CheckResult {
  const max = 6;
  if (p.imagesTotal === 0) {
    // No images: nothing to fix — treat as pass with full credit.
    return build('image-alt', 'content', 'pass', max, max, 'No images on page');
  }
  const coverage = p.imagesWithAlt / p.imagesTotal;
  let status: CheckStatus;
  if (coverage >= 0.8) status = 'pass';
  else if (coverage >= 0.4) status = 'warn';
  else status = 'fail';
  // Scale earned points by coverage for finer signal, floored by status band.
  const earned = Math.max(pts(max, status), Math.round(max * coverage));
  return build('image-alt', 'content', status, Math.min(max, earned), max,
    `${p.imagesWithAlt} of ${p.imagesTotal} images described`);
}

function checkReadability(p: PageData): CheckResult {
  const max = 5;
  if (p.wordCount < 50) {
    // Too little text to judge — don't penalize.
    return build('readability', 'content', 'pass', max, max, 'Not enough text to assess');
  }
  const avg = p.avgSentenceLength;
  let status: CheckStatus;
  if (avg > 0 && avg <= 22) status = 'pass';
  else if (avg <= 28) status = 'warn';
  else status = 'fail';
  return build('readability', 'content', status, pts(max, status), max,
    `${avg} words per sentence on average`);
}

function checkHttps(p: PageData): CheckResult {
  const status: CheckStatus = p.isHttps ? 'pass' : 'fail';
  const max = 6;
  return build('https', 'technical', status, pts(max, status), max,
    p.isHttps ? 'Secure (HTTPS)' : 'Not secure');
}

function checkIndexable(p: PageData): CheckResult {
  const noindex = (p.robotsMeta ?? '').includes('noindex');
  const status: CheckStatus = noindex ? 'fail' : 'pass';
  const max = 7;
  return build('indexable', 'technical', status, pts(max, status), max,
    noindex ? 'Blocked from search (noindex)' : 'Open to search');
}

function checkViewport(p: PageData): CheckResult {
  const status: CheckStatus = p.hasViewport ? 'pass' : 'fail';
  const max = 4;
  return build('viewport', 'technical', status, pts(max, status), max,
    p.hasViewport ? 'Mobile-ready' : 'No mobile viewport');
}

function checkSocialCards(p: PageData): CheckResult {
  const hasOgCore = Boolean(p.ogTags['og:title'] && p.ogTags['og:description'] && p.ogTags['og:image']);
  const hasTwitter = Object.keys(p.twitterTags).length > 0;
  let status: CheckStatus;
  if (hasOgCore && hasTwitter) status = 'pass';
  else if (hasOgCore || hasTwitter || p.ogTags['og:image']) status = 'warn';
  else status = 'fail';
  const missing: string[] = [];
  if (!p.ogTags['og:title']) missing.push('og:title');
  if (!p.ogTags['og:description']) missing.push('og:description');
  if (!p.ogTags['og:image']) missing.push('og:image');
  if (!hasTwitter) missing.push('twitter card');
  const max = 6;
  const detail = missing.length === 0
    ? 'Open Graph + Twitter card complete'
    : missing.length === 4 ? 'No share preview tags found'
    : `Missing: ${missing.join(', ')}`;
  return build('social-cards', 'technical', status, pts(max, status), max, detail);
}

function checkStructuredData(p: PageData): CheckResult {
  const status: CheckStatus = p.jsonLdCount > 0 ? 'pass' : 'fail';
  const max = 2;
  const uniqueTypes = Array.from(new Set(p.jsonLdTypes)).slice(0, 3);
  const typeStr = uniqueTypes.length > 0 ? ` (${uniqueTypes.join(', ')})` : '';
  const detail = p.jsonLdCount > 0
    ? `${p.jsonLdCount} schema block${p.jsonLdCount > 1 ? 's' : ''}${typeStr}`
    : 'No structured data';
  return build('structured-data', 'technical', status, pts(max, status), max, detail);
}

function checkInternalLinks(p: PageData): CheckResult {
  let status: CheckStatus;
  if (p.internalLinks >= 3) status = 'pass';
  else if (p.internalLinks >= 1) status = 'warn';
  else status = 'fail';
  const max = 8;
  return build('internal-links', 'links', status, pts(max, status), max,
    `${p.internalLinks} internal, ${p.externalLinks} external`);
}

function checkOutboundLinks(p: PageData): CheckResult {
  const status: CheckStatus = p.externalLinks >= 1 ? 'pass' : 'warn';
  const max = 6;
  return build('outbound-links', 'links', status, pts(max, status), max,
    `${p.externalLinks} outbound links`);
}

function checkLinkQuality(p: PageData): CheckResult {
  const tooMany = p.totalLinks > 300;
  const tooManyEmpty = p.totalLinks > 0 && p.emptyAnchors / Math.max(1, p.totalLinks + p.emptyAnchors) > 0.25;
  let status: CheckStatus;
  if (!tooMany && !tooManyEmpty) status = 'pass';
  else if (tooMany && tooManyEmpty) status = 'fail';
  else status = 'warn';
  const max = 6;
  return build('link-quality', 'links', status, pts(max, status), max,
    `${p.totalLinks} links, ${p.emptyAnchors} empty`);
}

// ---- AI Visibility ----

function checkAiRobots(p: PageData): CheckResult {
  const max = 8;
  if (p.aiBotsResult === null) {
    return build('ai-robots-access', 'aivisibility', 'warn', Math.round(max * 0.4), max,
      'robots.txt unavailable');
  }
  const { blocked, allowed } = p.aiBotsResult;
  if (blocked.length === 0) {
    return build('ai-robots-access', 'aivisibility', 'pass', max, max,
      `${allowed.length} AI crawlers permitted`);
  }
  const status: CheckStatus = blocked.length >= 4 ? 'fail' : 'warn';
  const top = blocked.slice(0, 3).join(', ');
  const extra = blocked.length > 3 ? ` +${blocked.length - 3} more` : '';
  return build('ai-robots-access', 'aivisibility', status, pts(max, status), max,
    `Blocked: ${top}${extra}`);
}

function checkLlmsTxt(p: PageData): CheckResult {
  const max = 6;
  if (p.llmsTxtPresent === null) {
    return build('ai-llms-txt', 'aivisibility', 'warn', Math.round(max * 0.4), max,
      'Could not verify');
  }
  const status: CheckStatus = p.llmsTxtPresent ? 'pass' : 'fail';
  return build('ai-llms-txt', 'aivisibility', status, pts(max, status), max,
    p.llmsTxtPresent ? 'llms.txt found' : 'No llms.txt file');
}

function checkFaqSchema(p: PageData): CheckResult {
  const max = 7;
  if (p.hasFaqSchema || p.hasHowToSchema) {
    const type = p.hasFaqSchema ? 'FAQPage' : 'HowTo';
    return build('ai-faq-schema', 'aivisibility', 'pass', max, max, `${type} schema found`);
  }
  if (p.questionHeadings > 0) {
    return build('ai-faq-schema', 'aivisibility', 'warn', pts(max, 'warn'), max,
      `${p.questionHeadings} question heading${p.questionHeadings > 1 ? 's' : ''}, no FAQ schema`);
  }
  return build('ai-faq-schema', 'aivisibility', 'fail', 0, max, 'No Q&A structured data');
}

function checkAuthorMarkup(p: PageData): CheckResult {
  const max = 6;
  const status: CheckStatus = p.hasAuthorMarkup ? 'pass' : 'fail';
  return build('ai-author-markup', 'aivisibility', status, pts(max, status), max,
    p.hasAuthorMarkup ? 'Author attribution found' : 'No author attribution found');
}

function checkEntityClarity(p: PageData): CheckResult {
  const max = 8;
  if (p.entitySchemaTypes.length > 0) {
    const types = Array.from(new Set(p.entitySchemaTypes)).slice(0, 2).join(', ');
    return build('ai-entity-clarity', 'aivisibility', 'pass', max, max,
      `Entity: ${types}`);
  }
  if (p.jsonLdCount > 0) {
    return build('ai-entity-clarity', 'aivisibility', 'warn', pts(max, 'warn'), max,
      `${p.jsonLdCount} schema block${p.jsonLdCount > 1 ? 's' : ''}, no entity type`);
  }
  return build('ai-entity-clarity', 'aivisibility', 'fail', 0, max,
    'No business entity schema');
}
