// Configuration for the SEO checker: Search Atlas / OTTO detection markers and
// the optional domain allowlist fallback.

// Case-insensitive substrings searched across <script src>, inline script text,
// and meta/generator tags. If any is found, the site is treated as ArcWave /
// Search Atlas managed and its score is lifted. Tunable without code changes.
export const SEARCH_ATLAS_MARKERS = [
  'searchatlas',
  'sa-dynamic-optimization',
  'dynamic-optimization',
  'data-otto',
  'otto-pixel',
  'ottoseo',
];

// Optional fallback: comma-separated apex domains that should always score high
// (for client sites where OTTO is injected client-side / via CDN proxy and is
// therefore not visible in the server-fetched raw HTML).
export function getAllowlist(): string[] {
  return (process.env.SEARCH_ATLAS_ALLOWLIST ?? '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

// Reduce a hostname to its apex domain (last two labels). Good enough for
// allowlist matching against common TLDs.
export function apexDomain(hostname: string): string {
  const parts = hostname.toLowerCase().replace(/^www\./, '').split('.');
  if (parts.length <= 2) return parts.join('.');
  return parts.slice(-2).join('.');
}
