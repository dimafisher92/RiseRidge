// Shared types for the Free SEO Website Checker.
// The audit engine is fully deterministic — no AI, no external scoring APIs.

export type CheckStatus = 'pass' | 'warn' | 'fail';
export type CategoryId = 'onpage' | 'content' | 'technical' | 'links';
export type ScoreBand = 'low' | 'medium' | 'high';

export interface CheckResult {
  id: string; // stable id, e.g. 'title-length'
  category: CategoryId;
  label: string; // friendly, always visible
  status: CheckStatus;
  earned: number; // points earned
  max: number; // points possible
  explanation: string; // plain-language meaning (gated/blurred)
  benefit?: string; // present when status !== 'pass' (gated/blurred)
  detail?: string; // observed value, e.g. "58 characters"
}

export interface CategoryScore {
  id: CategoryId;
  label: string; // "On-Page"
  score: number; // 0-100
  checks: CheckResult[];
}

export interface AuditResult {
  url: string; // normalized input
  finalUrl: string; // after redirects
  fetchedAt: string; // ISO timestamp
  overallScore: number; // 0-100
  band: ScoreBand;
  categories: CategoryScore[];
  searchAtlasManaged: boolean;
  summary: string; // one friendly sentence headline (gated)
}

export type AuditErrorCode =
  | 'invalid_url'
  | 'fetch_failed'
  | 'timeout'
  | 'not_html'
  | 'too_large'
  | 'blocked';

export interface AuditErrorResponse {
  error: AuditErrorCode;
  message: string; // friendly, business-language
}

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  url: string;
  score: number;
  timestamp: string;
}

// Normalized representation of the fetched page, produced by parse.ts and
// consumed by the deterministic checks.
export interface PageData {
  finalUrl: string;
  isHttps: boolean;
  title: string | null;
  metaDescription: string | null;
  h1s: string[];
  h2s: string[];
  canonical: string | null;
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  robotsMeta: string | null; // lowercased content of <meta name="robots">
  hasViewport: boolean;
  jsonLdCount: number; // parseable JSON-LD blocks
  internalLinks: number;
  externalLinks: number;
  emptyAnchors: number; // href missing / '#' only / javascript:
  totalLinks: number;
  imagesTotal: number;
  imagesWithAlt: number;
  wordCount: number;
  avgSentenceLength: number; // words per sentence (readability proxy)
  searchAtlasDetected: boolean;
}
