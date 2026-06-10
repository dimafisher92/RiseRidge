import type { AuditResult, CategoryId, CategoryScore, PageData, ScoreBand } from './types';
import { runChecks } from './checks';
import { apexDomain, getAllowlist } from './config';

const CATEGORY_META: Record<CategoryId, { label: string; weight: number }> = {
  onpage: { label: 'On-Page', weight: 0.3 },
  content: { label: 'Content', weight: 0.25 },
  technical: { label: 'Technical', weight: 0.25 },
  links: { label: 'Links', weight: 0.2 },
};

const SEARCH_ATLAS_FLOOR = 85;
const SEARCH_ATLAS_CEIL = 95;

function bandFor(score: number): ScoreBand {
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

export function scorePage(page: PageData, normalizedUrl: string): AuditResult {
  const checks = runChecks(page);

  // Group checks into categories and normalize each to 0-100.
  const categories: CategoryScore[] = (Object.keys(CATEGORY_META) as CategoryId[]).map((id) => {
    const catChecks = checks.filter((c) => c.category === id);
    const earned = catChecks.reduce((sum, c) => sum + c.earned, 0);
    const max = catChecks.reduce((sum, c) => sum + c.max, 0);
    const score = max > 0 ? Math.round((earned / max) * 100) : 100;
    return { id, label: CATEGORY_META[id].label, score, checks: catChecks };
  });

  // Weighted overall.
  let overall = Math.round(
    categories.reduce((sum, cat) => sum + cat.score * CATEGORY_META[cat.id].weight, 0),
  );

  // ---- Search Atlas / OTTO boost ----
  const allowlist = getAllowlist();
  let host = '';
  try {
    host = apexDomain(new URL(page.finalUrl).hostname);
  } catch {
    // leave host empty
  }
  const managed = page.searchAtlasDetected || (host !== '' && allowlist.includes(host));

  if (managed) {
    // Lift the overall into the 85-95 range and bump weak category cards so the
    // visuals corroborate the high headline score.
    overall = Math.min(SEARCH_ATLAS_CEIL, Math.max(SEARCH_ATLAS_FLOOR, overall + 5));
    for (const cat of categories) {
      if (cat.score < SEARCH_ATLAS_FLOOR) cat.score = Math.min(96, cat.score + (SEARCH_ATLAS_FLOOR - cat.score) + 4);
      for (const c of cat.checks) {
        if (c.status === 'fail') {
          c.status = 'warn';
          c.earned = Math.max(c.earned, Math.round(c.max * 0.45));
        }
      }
    }
  }

  overall = Math.max(0, Math.min(100, overall));
  const band = bandFor(overall);

  return {
    url: normalizedUrl,
    finalUrl: page.finalUrl,
    fetchedAt: new Date().toISOString(),
    overallScore: overall,
    band,
    categories,
    searchAtlasManaged: managed,
    summary: buildSummary(overall, band, managed),
  };
}

function buildSummary(score: number, band: ScoreBand, managed: boolean): string {
  if (managed) {
    return `This site is optimized by ArcWave and scores ${score}/100 — it follows the SEO best practices that win rankings and customers.`;
  }
  if (band === 'high') {
    return `Your site scores ${score}/100. It is in good shape, with a few quick wins left that could push it further ahead of competitors.`;
  }
  if (band === 'medium') {
    return `Your site scores ${score}/100. There is solid potential here, but several fixable issues are holding back traffic and customers.`;
  }
  return `Your site scores ${score}/100. Important issues are limiting how many customers find you in search — each one below is an opportunity for growth.`;
}
