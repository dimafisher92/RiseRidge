import { NextResponse } from 'next/server';
import type { LeadPayload } from '@/lib/seo-checker/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function detectDevice(ua: string): string {
  if (/\b(iPad|Tablet)\b/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'Tablet';
  if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) return 'Mobile';
  if (ua) return 'Desktop';
  return '';
}

function detectBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\/|Opera/i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && /Version\//i.test(ua)) return 'Safari';
  return ua ? 'Other' : '';
}

function detectOS(ua: string): string {
  if (/Windows NT/i.test(ua)) return 'Windows';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Linux/i.test(ua)) return 'Linux';
  return ua ? 'Other' : '';
}

// Capture a lead and forward it (with analytics) to the Google Apps Script
// webhook (a Sheet). Lead capture is best-effort: even if the webhook is unset
// or fails, we return 200 so the report still unlocks for the visitor.
export async function POST(req: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
  }

  const name = (body.name ?? '').toString().trim();
  const email = (body.email ?? '').toString().trim();
  const phone = (body.phone ?? '').toString().trim();
  const url = (body.url ?? '').toString().trim();

  if (!name || !EMAIL_RE.test(email) || !phone) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }

  // Prefer the client-reported UA, fall back to the request header.
  const h = req.headers;
  const userAgent = (body.userAgent ?? h.get('user-agent') ?? '').toString();
  const referrer = (body.referrer ?? h.get('referer') ?? '').toString();
  const ip =
    (h.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    h.get('x-real-ip') ||
    '';

  // Geo headers are populated by Vercel's edge network in production.
  const country = h.get('x-vercel-ip-country') ?? '';
  const region = h.get('x-vercel-ip-country-region') ?? '';
  const city = h.get('x-vercel-ip-city')
    ? decodeURIComponent(h.get('x-vercel-ip-city') as string)
    : '';

  // Flat record — column order here matches the Apps Script / Sheet headers.
  const record = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone,
    url,
    score: typeof body.score === 'number' ? body.score : 0,
    device: detectDevice(userAgent),
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent),
    userAgent,
    language: (body.language ?? '').toString(),
    timezone: (body.timezone ?? '').toString(),
    screen: (body.screen ?? '').toString(),
    referrer,
    location: [city, region, country].filter(Boolean).join(', '),
    ip,
  };

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook) {
    console.warn('[seo-checker] GOOGLE_SHEETS_WEBHOOK_URL is not set — lead not persisted:', {
      email: record.email,
      url: record.url,
    });
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    console.error('[seo-checker] Failed to forward lead to webhook:', err);
    // Never block the visitor's unlock on a webhook failure.
    return NextResponse.json({ ok: true, persisted: false });
  }
}
