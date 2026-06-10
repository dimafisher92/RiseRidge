import { NextResponse } from 'next/server';
import type { LeadPayload } from '@/lib/seo-checker/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Capture a lead and forward it to the Google Apps Script webhook (a Sheet).
// Lead capture is best-effort: even if the webhook is unset or fails, we return
// 200 so the report still unlocks for the visitor.
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

  const lead: LeadPayload = {
    name,
    email,
    phone,
    url,
    score: typeof body.score === 'number' ? body.score : 0,
    timestamp: new Date().toISOString(),
  };

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook) {
    console.warn('[seo-checker] GOOGLE_SHEETS_WEBHOOK_URL is not set — lead not persisted:', {
      email: lead.email,
      url: lead.url,
    });
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
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
