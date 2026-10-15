#!/usr/bin/env node
// Google Search Console client (service account, no extra deps).
//   node scripts/seo/gsc.mjs report [--days 28] [--out file.json]
//   node scripts/seo/gsc.mjs page /blog/slug/ [--days 28]
//   node scripts/seo/gsc.mjs submit-sitemap
//   node scripts/seo/gsc.mjs sites                      (list properties the account can see)
//
// Env:
//   GSC_SERVICE_ACCOUNT_JSON  service-account key JSON (whole file contents, one line)
//   GSC_SITE_URL              optional; default tries sc-domain:riseridge.io then https://riseridge.io/
// Missing credentials -> prints {"skipped": "..."} and exits 0, so routines degrade gracefully.
import crypto from 'node:crypto';
import { arg, writeJson, SITE } from './lib.mjs';

process.on('uncaughtException', (e) => {
  console.log(JSON.stringify({ error: e.message }));
  process.exit(1);
});

const cmd = process.argv[2];
const out = arg('out');
const days = Number(arg('days', 28));

const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
if (!raw) {
  writeJson(out, { skipped: 'GSC_SERVICE_ACCOUNT_JSON is not set' });
  process.exit(0);
}
const key = JSON.parse(raw);

const b64url = (buf) => Buffer.from(buf).toString('base64url');
async function token() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const sig = crypto.createSign('RSA-SHA256').update(`${header}.${claim}`).sign(key.private_key);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${b64url(sig)}`,
    }),
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

const access = await token();
const API = 'https://www.googleapis.com/webmasters/v3';
async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${access}`, 'content-type': 'application/json', ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw Object.assign(new Error(`GSC ${res.status} ${path}: ${text.slice(0, 300)}`), { status: res.status });
  return text ? JSON.parse(text) : {};
}

async function resolveSite() {
  const candidates = process.env.GSC_SITE_URL ? [process.env.GSC_SITE_URL] : ['sc-domain:riseridge.io', `${SITE}/`];
  const { siteEntry = [] } = await api('/sites');
  for (const c of candidates) if (siteEntry.some((s) => s.siteUrl === c)) return c;
  throw new Error(`Service account cannot see any of ${candidates.join(', ')}. Visible: ${siteEntry.map((s) => s.siteUrl).join(', ') || 'none'}`);
}

const ymd = (d) => d.toISOString().slice(0, 10);
function range(offsetDays, len) {
  // GSC data lags ~2-3 days; end 3 days ago.
  const end = new Date(Date.now() - (3 + offsetDays) * 864e5);
  const start = new Date(end.getTime() - (len - 1) * 864e5);
  return { startDate: ymd(start), endDate: ymd(end) };
}

async function query(site, body) {
  const r = await api(`/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
    method: 'POST',
    body: JSON.stringify({ rowLimit: 1000, dataState: 'final', ...body }),
  });
  return r.rows || [];
}

const totals = (rows) => {
  const t = rows.reduce((a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions, pw: a.pw + r.position * r.impressions }), { clicks: 0, impressions: 0, pw: 0 });
  return { clicks: t.clicks, impressions: t.impressions, ctr: t.impressions ? +(t.clicks / t.impressions).toFixed(4) : 0, position: t.impressions ? +(t.pw / t.impressions).toFixed(2) : null };
};
const row = (r, dim) => ({ [dim]: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: +r.ctr.toFixed(4), position: +r.position.toFixed(1) });

if (cmd === 'sites') {
  writeJson(out, await api('/sites'));
} else if (cmd === 'submit-sitemap') {
  const site = await resolveSite();
  const feed = `${SITE}/sitemap.xml`;
  await api(`/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(feed)}`, { method: 'PUT' });
  writeJson(out, { ok: true, site, submitted: feed });
} else if (cmd === 'page') {
  const pagePath = process.argv[3];
  const site = await resolveSite();
  const url = new URL(pagePath, `${SITE}/`).toString();
  const rows = await query(site, {
    ...range(0, days),
    dimensions: ['query'],
    dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: url }] }],
  });
  writeJson(out, { site, url, ...range(0, days), totals: totals(rows), queries: rows.map((r) => row(r, 'query')).sort((a, b) => b.impressions - a.impressions).slice(0, 100) });
} else if (cmd === 'report') {
  const site = await resolveSite();
  const cur = range(0, days);
  const prev = range(days, days);
  const [qCur, qPrev, pCur, pPrev] = await Promise.all([
    query(site, { ...cur, dimensions: ['query'] }),
    query(site, { ...prev, dimensions: ['query'] }),
    query(site, { ...cur, dimensions: ['page'] }),
    query(site, { ...prev, dimensions: ['page'] }),
  ]);
  const prevPages = new Map(pPrev.map((r) => [r.keys[0], r]));
  const prevQueries = new Set(qPrev.map((r) => r.keys[0]));
  const pages = pCur.map((r) => {
    const p = prevPages.get(r.keys[0]);
    return { ...row(r, 'page'), prevClicks: p?.clicks ?? 0, deltaClicks: r.clicks - (p?.clicks ?? 0) };
  });
  writeJson(out, {
    site,
    current: cur,
    previous: prev,
    totals: { current: totals(pCur), previous: totals(pPrev) },
    topQueries: qCur.map((r) => row(r, 'query')).sort((a, b) => b.clicks - a.clicks).slice(0, 50),
    topPages: [...pages].sort((a, b) => b.clicks - a.clicks).slice(0, 30),
    strikingDistance: qCur.filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 20).map((r) => row(r, 'query')).sort((a, b) => b.impressions - a.impressions).slice(0, 50),
    losingPages: pages.filter((p) => p.deltaClicks < 0).sort((a, b) => a.deltaClicks - b.deltaClicks).slice(0, 20),
    lowCtrPages: pages.filter((p) => p.impressions >= 200 && p.ctr < 0.01 && p.position <= 15).sort((a, b) => b.impressions - a.impressions).slice(0, 20),
    newQueries: qCur.filter((r) => !prevQueries.has(r.keys[0]) && r.impressions >= 10).map((r) => row(r, 'query')).slice(0, 50),
  });
} else {
  console.error('Usage: gsc.mjs report|page <path>|submit-sitemap|sites [--days N] [--out file]');
  process.exit(1);
}
