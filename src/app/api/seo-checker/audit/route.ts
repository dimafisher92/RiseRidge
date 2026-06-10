import { NextResponse } from 'next/server';
import { AuditError, fetchAuxText, fetchTargetHtml, normalizeUrl } from '@/lib/seo-checker/fetchPage';
import { parsePage } from '@/lib/seo-checker/parse';
import { scorePage } from '@/lib/seo-checker/scoring';
import type { AuditErrorResponse } from '@/lib/seo-checker/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let url: string;
  try {
    const body = await req.json();
    url = normalizeUrl(typeof body?.url === 'string' ? body.url : '');
  } catch (err) {
    const message =
      err instanceof AuditError ? err.message : "That doesn't look like a valid website address.";
    return NextResponse.json<AuditErrorResponse>(
      { error: 'invalid_url', message },
      { status: 400 },
    );
  }

  try {
    // Fetch the target page + robots.txt + llms.txt in parallel. The aux fetches
    // have their own 3s timeouts and never throw — failures just return null.
    const origin = new URL(url).origin;
    const [mainResult, robotsResult, llmsResult] = await Promise.allSettled([
      fetchTargetHtml(url),
      fetchAuxText(origin, '/robots.txt'),
      fetchAuxText(origin, '/llms.txt'),
    ]);

    if (mainResult.status === 'rejected') throw mainResult.reason;

    const { html, finalUrl } = mainResult.value;
    const robotsTxt = robotsResult.status === 'fulfilled' ? robotsResult.value : null;
    const llmsTxt = llmsResult.status === 'fulfilled' ? llmsResult.value : null;

    const page = parsePage(html, finalUrl, { robotsTxt, llmsTxt });
    const result = scorePage(page, url);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AuditError) {
      const status = err.code === 'blocked' ? 502 : 422;
      return NextResponse.json<AuditErrorResponse>(
        { error: err.code, message: err.message },
        { status },
      );
    }
    return NextResponse.json<AuditErrorResponse>(
      {
        error: 'fetch_failed',
        message: 'Something went wrong while analyzing this site. Please try again.',
      },
      { status: 500 },
    );
  }
}
