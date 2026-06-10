import type { AuditErrorCode } from './types';

const TIMEOUT_MS = 9000;
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB cap
const USER_AGENT =
  'Mozilla/5.0 (compatible; ArcWaveSEOChecker/1.0; +https://arcwave.io/seo-checker)';

export class AuditError extends Error {
  code: AuditErrorCode;
  constructor(code: AuditErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'AuditError';
  }
}

export interface FetchedPage {
  html: string;
  finalUrl: string;
}

// Normalize raw user input into a valid http(s) URL string.
export function normalizeUrl(input: string): string {
  let raw = (input ?? '').trim();
  if (!raw) throw new AuditError('invalid_url', 'Please enter a website address.');

  // Prepend scheme if the user typed a bare domain.
  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new AuditError('invalid_url', "That doesn't look like a valid website address.");
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new AuditError('invalid_url', 'Please enter a website starting with http or https.');
  }
  if (!parsed.hostname.includes('.')) {
    throw new AuditError('invalid_url', "That doesn't look like a valid website address.");
  }

  return parsed.toString();
}

// Fetch the target page HTML with a timeout, realistic headers, content-type
// and size guards. Returns the HTML plus the final (post-redirect) URL.
export async function fetchTargetHtml(input: string): Promise<FetchedPage> {
  const url = normalizeUrl(input);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new AuditError(
        'timeout',
        "This site took too long to respond. It may be slow or temporarily unavailable.",
      );
    }
    throw new AuditError(
      'fetch_failed',
      "We couldn't reach this website. Please double-check the address and try again.",
    );
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 403 || res.status === 429 || res.status === 401) {
    throw new AuditError(
      'blocked',
      'This site blocks automated checks, so we cannot analyze it right now.',
    );
  }
  if (!res.ok) {
    throw new AuditError(
      'fetch_failed',
      `This website returned an error (status ${res.status}). Please try a different page.`,
    );
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('text/html')) {
    throw new AuditError(
      'not_html',
      'This address points to a file or feed, not a web page. Try a normal page URL.',
    );
  }

  const html = await readCapped(res, MAX_BYTES);
  return { html, finalUrl: res.url || url };
}

// Lightweight fetch for small auxiliary files (robots.txt, llms.txt).
// Returns text on success, null on any failure or timeout — never throws.
export async function fetchAuxText(origin: string, path: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const url = new URL(path, origin).toString();
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/plain,*/*' },
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.slice(0, 100_000);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Read the response body up to a byte cap, then stop. Avoids loading huge pages
// fully into memory; the parser only needs the document head + visible body.
async function readCapped(res: Response, maxBytes: number): Promise<string> {
  if (!res.body) {
    return await res.text();
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let received = 0;
  let html = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (received >= maxBytes) {
        await reader.cancel();
        break;
      }
    }
    html += decoder.decode();
  } catch {
    throw new AuditError('fetch_failed', "We couldn't finish reading this website.");
  }
  return html;
}
