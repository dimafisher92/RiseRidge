// Shared types for the Free SEO Website Checker.
// The audit engine is fully deterministic — no AI, no external scoring APIs.

export type CheckStatus = 'pass' | 'warn' | 'fail';
export type CategoryId = 'onpage' | 'content' | 'technical' | 'links' | 'aivisibility';
export type ScoreBand = 'low' | 'medium' | 'high';

export interface CheckResult {
  id: string;
  category: CategoryId;
  label: string; // friendly, always visible
  status: CheckStatus;
  earned: number;
  max: number;
  explanation: string; // plain-language meaning (gated/blurred)
  benefit?: string; // present when status !== 'pass' (gated/blurred)
  detail?: string; // observed value, e.g. "58 characters"
}

export interface CategoryScore {
  id: CategoryId;
  label: string;
  score: number; // 0-100
  checks: CheckResult[];
}

export interface AuditResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  overallScore: number; // 0-100
  band: ScoreBand;
  categories: CategoryScore[];
  searchAtlasManaged: boolean;
  summary: string; // gated
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
  message: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  url: string;
  score: number;
  timestamp: string;
}

export interface AiBotsResult {
  allowed: string[];
  blocked: string[];
}

// Normalized representation of the fetched page, produced by parse.ts.
export interface PageData {
  finalUrl: string;
  isHttps: boolean;
  title: string | null;
  metaDescription: string | null;
  h1s: string[];
  h2s: string[];
  h3s: string[];
  canonical: string | null;
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  robotsMeta: string | null;
  hasViewport: boolean;
  jsonLdCount: number;
  jsonLdTypes: string[]; // @type values from all parseable JSON-LD blocks
  internalLinks: number;
  externalLinks: number;
  emptyAnchors: number;
  totalLinks: number;
  imagesTotal: number;
  imagesWithAlt: number;
  wordCount: number;
  avgSentenceLength: number;
  searchAtlasDetected: boolean;
  // AI Visibility fields
  llmsTxtPresent: boolean | null; // null = could not check
  aiBotsResult: AiBotsResult | null; // null = robots.txt not available
  hasFaqSchema: boolean;
  hasHowToSchema: boolean;
  hasAuthorMarkup: boolean;
  entitySchemaTypes: string[]; // detected rich entity types (org, person, product…)
  questionHeadings: number; // H2/H3 containing a '?'
}
