#!/usr/bin/env node
// SearchAtlas data for the weekly plan: rankings, OTTO issues, backlinks, LLM Visibility.
//
// SearchAtlas has no public API reference, so endpoints are NOT hard-coded.
// Two ways to feed data in:
//
// 1) API: fill scripts/seo/searchatlas.config.json with the endpoints from your
//    SearchAtlas account (Settings -> API / ask SearchAtlas support), set
//    SEARCHATLAS_API_KEY, and allow the API host in the cloud environment network.
//      node scripts/seo/searchatlas.mjs report [--out file.json]
//
// 2) Exports: export CSVs from SearchAtlas (Rank Tracker, LLM Visibility, Backlinks,
//    OTTO) into a folder (e.g. a Google Drive folder the weekly routine downloads):
//      node scripts/seo/searchatlas.mjs ingest --dir ./sa-exports [--out file.json]
//
// Missing config/credentials -> {"skipped": "..."} and exit 0.
import fs from 'node:fs';
import path from 'node:path';
import { arg, writeJson, ROOT } from './lib.mjs';

process.on('uncaughtException', (e) => {
  console.log(JSON.stringify({ error: e.message }));
  process.exit(1);
});

const cmd = process.argv[2];
const out = arg('out');
const CONFIG = path.join(ROOT, 'scripts', 'seo', 'searchatlas.config.json');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') row.push(cell), (cell = '');
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell), rows.push(row), (row = []), (cell = '');
    } else cell += c;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  const [header = [], ...data] = rows.filter((r) => r.some((v) => v.trim() !== ''));
  const keys = header.map((h) => h.trim());
  return data.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])));
}

function kind(file) {
  const f = file.toLowerCase();
  if (/llm|ai[-_ ]?visib|visibility|chatgpt|perplexity|gemini/.test(f)) return 'llmVisibility';
  if (/backlink|link/.test(f)) return 'backlinks';
  if (/otto|issue|audit/.test(f)) return 'ottoIssues';
  if (/rank|keyword|position/.test(f)) return 'rankings';
  return 'other';
}

if (cmd === 'ingest') {
  const dir = arg('dir');
  if (!dir || dir === true || !fs.existsSync(dir)) {
    writeJson(out, { skipped: `export folder not found: ${dir}` });
    process.exit(0);
  }
  const result = { source: 'csv-exports', dir, files: {}, data: {} };
  for (const f of fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.csv'))) {
    const k = kind(f);
    const rows = parseCsv(fs.readFileSync(path.join(dir, f), 'utf8').replace(/^﻿/, ''));
    result.files[f] = { kind: k, rows: rows.length, columns: Object.keys(rows[0] || {}) };
    result.data[k] = [...(result.data[k] || []), ...rows];
  }
  writeJson(out, result);
} else if (cmd === 'report') {
  const keyEnv = process.env.SEARCHATLAS_API_KEY;
  const cfg = fs.existsSync(CONFIG) ? JSON.parse(fs.readFileSync(CONFIG, 'utf8')) : {};
  const endpoints = Object.entries(cfg.endpoints || {}).filter(([, v]) => v);
  if (!keyEnv || !cfg.apiBase || endpoints.length === 0) {
    writeJson(out, {
      skipped: !keyEnv ? 'SEARCHATLAS_API_KEY is not set' : 'searchatlas.config.json has no apiBase/endpoints configured',
      hint: 'Fill scripts/seo/searchatlas.config.json or use `ingest --dir` with CSV exports.',
    });
    process.exit(0);
  }
  const headers = { accept: 'application/json' };
  if ((cfg.auth || 'header') === 'bearer') headers.authorization = `Bearer ${keyEnv}`;
  else headers[cfg.authHeader || 'x-api-key'] = keyEnv;
  const result = { source: 'api', apiBase: cfg.apiBase, data: {}, errors: {} };
  for (const [name, p] of endpoints) {
    const url = new URL(p.replace('{domain}', cfg.domain || 'riseridge.io'), cfg.apiBase).toString();
    try {
      const res = await fetch(url, { headers });
      const text = await res.text();
      if (!res.ok) result.errors[name] = `${res.status}: ${text.slice(0, 200)}`;
      else result.data[name] = JSON.parse(text);
    } catch (e) {
      result.errors[name] = String(e.cause?.code || e.message);
    }
  }
  writeJson(out, result);
} else {
  console.error('Usage: searchatlas.mjs report [--out f] | ingest --dir <folder> [--out f]');
  process.exit(1);
}
