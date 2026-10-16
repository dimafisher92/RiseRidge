#!/usr/bin/env node
// Microsoft Clarity UX signals for the autopilot (Clarity Data Export API).
//
//   node scripts/seo/clarity.mjs report [--days 1|2|3] [--out f]
//
// Calls GET https://www.clarity.ms/export-data/api/v1/project-live-insights
// three times (by URL, by Channel, by Source). The API only covers the last
// 1-3 days and allows few calls per project per day, so the Daily Run takes one
// snapshot a day and the Weekly Plan aggregates the snapshots (see weekly.md).
// Auth: CLARITY_API_TOKEN (Clarity -> Settings -> Data Export -> API token).
// Missing token -> {"skipped": "..."} and exit 0.
//
// Output:
//   pages:    one row per site path with the merged metrics (sessions, scroll depth,
//             engagement time, dead/rage/quickback/error clicks, script errors)
//   channels: sessions per Channel;  sources: sessions per Source
//   aiReferrals: sessions whose Source/Channel is an AI assistant (ChatGPT, Perplexity, ...)
//   raw:      the untouched API responses, so nothing is lost if the shape changes
import { arg, writeJson } from './lib.mjs';

process.on('uncaughtException', (e) => {
  console.log(JSON.stringify({ error: e.message }));
  process.exit(1);
});

const API = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';
const AI_SOURCE = /chatgpt|openai|perplexity|copilot|gemini|bard|claude|anthropic|deepseek|you\.com|phind|\bai\b|aiplatform/i;
const out = arg('out');
const days = Number(arg('days', 1));

if (process.argv[2] !== 'report') {
  console.error('Usage: clarity.mjs report [--days 1|2|3] [--out f]');
  process.exit(1);
}
if (![1, 2, 3].includes(days)) throw new Error('--days must be 1, 2 or 3');
const token = process.env.CLARITY_API_TOKEN?.trim();
if (!token) {
  writeJson(out, { skipped: 'CLARITY_API_TOKEN is not set' });
  process.exit(0);
}

async function insights(dimension) {
  const res = await fetch(`${API}?numOfDays=${days}&dimension1=${encodeURIComponent(dimension)}`, {
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Clarity ${dimension}: HTTP ${res.status} ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

/** Merge metric blocks [{metricName, information:[{<dim>: v, ...numbers}]}] into rows keyed by the dimension value. */
function merge(blocks, dimension) {
  const rows = new Map();
  for (const block of Array.isArray(blocks) ? blocks : []) {
    const metric = String(block.metricName || 'metric').replace(/\s+/g, '');
    for (const info of block.information || []) {
      const keyField = Object.keys(info).find((k) => k.toLowerCase() === dimension.toLowerCase());
      const key = keyField ? String(info[keyField]) : '(all)';
      const row = rows.get(key) || { [dimension]: key };
      for (const [k, v] of Object.entries(info)) {
        if (k === keyField) continue;
        const n = typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v)) ? Number(v) : v;
        row[`${metric}.${k}`] = n;
      }
      rows.set(key, row);
    }
  }
  return [...rows.values()];
}

const sessionsOf = (row) =>
  Number(Object.entries(row).find(([k]) => /^Traffic\.totalSessionCount$/i.test(k))?.[1] ?? 0);

function toPath(u) {
  try {
    const url = new URL(u, 'https://riseridge.io');
    if (!/(^|\.)riseridge\.io$/.test(url.hostname)) return null;
    let p = url.pathname || '/';
    if (!p.endsWith('/')) p += '/';
    return p;
  } catch {
    return null;
  }
}

const result = { source: 'clarity', days, fetchedAt: new Date().toISOString(), pages: [], channels: [], sources: [], aiReferrals: { sessions: 0, bySource: {} }, errors: {}, raw: {} };

for (const dim of ['URL', 'Channel', 'Source']) {
  try {
    const data = await insights(dim);
    result.raw[dim] = data;
    const rows = merge(data, dim);
    if (dim === 'URL') {
      // Collapse query strings / host variants onto one path: sessions are summed,
      // the other (average-type) metrics come from the variant with the most sessions.
      const byPath = new Map();
      for (const r of rows) {
        const p = toPath(r.URL);
        if (!p) continue;
        const prev = byPath.get(p);
        const total = sessionsOf(r) + (prev ? sessionsOf(prev) : 0);
        const base = !prev || sessionsOf(r) > sessionsOf(prev) ? r : prev;
        byPath.set(p, { ...base, path: p, 'Traffic.totalSessionCount': total });
      }
      result.pages = [...byPath.values()].sort((a, b) => sessionsOf(b) - sessionsOf(a));
    } else {
      const list = rows
        .map((r) => ({ [dim.toLowerCase()]: r[dim], sessions: sessionsOf(r), ...r }))
        .sort((a, b) => b.sessions - a.sessions);
      result[dim === 'Channel' ? 'channels' : 'sources'] = list;
    }
  } catch (e) {
    result.errors[dim] = e.message;
  }
}
// AI referrals: from Source when available, else from Channel (never both, to avoid double counting).
const [aiDim, aiRows] = result.sources.length ? ['source', result.sources] : ['channel', result.channels];
for (const r of aiRows) {
  if (!AI_SOURCE.test(String(r[aiDim]))) continue;
  result.aiReferrals.bySource[r[aiDim]] = (result.aiReferrals.bySource[r[aiDim]] || 0) + r.sessions;
  result.aiReferrals.sessions += r.sessions;
}
writeJson(out, result);
