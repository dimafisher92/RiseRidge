#!/usr/bin/env node
// SearchAtlas data for the autopilot (rankings, OTTO, backlinks, LLM Visibility).
//
// Talks to SearchAtlas's hosted MCP server (https://mcp.searchatlas.com/mcp,
// Streamable HTTP, the same backend the official `searchatlas-mcp-server`
// package proxies to). Auth: SEARCHATLAS_API_KEY (sent as X-API-Key) or
// SEARCHATLAS_TOKEN (sent as Authorization: Bearer).
//
//   node scripts/seo/searchatlas.mjs tools [--grep visib] [--out f]   list tools (name, description, input schema)
//   node scripts/seo/searchatlas.mjs call <tool> '<json args>' [--out f]
//   node scripts/seo/searchatlas.mjs report [--out f]                 run the calls listed in searchatlas.config.json
//   node scripts/seo/searchatlas.mjs ingest --dir <folder> [--out f]  fallback: SearchAtlas CSV exports
//
// Missing credentials -> {"skipped": "..."} and exit 0.
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
const API_URL = process.env.SEARCHATLAS_API_URL || 'https://mcp.searchatlas.com/mcp';

// ---------------------------------------------------------------- MCP client
function authHeaders() {
  if (process.env.SEARCHATLAS_TOKEN) return { authorization: `Bearer ${process.env.SEARCHATLAS_TOKEN.trim()}` };
  if (process.env.SEARCHATLAS_API_KEY) return { 'x-api-key': process.env.SEARCHATLAS_API_KEY.trim() };
  return null;
}

let sessionId;
let nextId = 1;

/** Parse a Streamable-HTTP response (plain JSON or SSE) and return the JSON-RPC message with `id`. */
function parseRpc(text, contentType, id) {
  const messages = [];
  if (contentType.includes('text/event-stream')) {
    for (const event of text.split(/\r?\n\r?\n/)) {
      const data = event
        .split(/\r?\n/)
        .filter((l) => l.startsWith('data:'))
        .map((l) => l.slice(5).trimStart())
        .join('\n');
      if (data) {
        try {
          messages.push(JSON.parse(data));
        } catch {
          /* ignore keep-alives */
        }
      }
    }
  } else if (text.trim()) {
    const j = JSON.parse(text);
    messages.push(...(Array.isArray(j) ? j : [j]));
  }
  return messages.find((m) => m.id === id);
}

async function rpc(method, params, { notify = false } = {}) {
  const id = notify ? undefined : nextId++;
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      ...(sessionId ? { 'mcp-session-id': sessionId } : {}),
      ...authHeaders(),
    },
    body: JSON.stringify({ jsonrpc: '2.0', method, ...(params ? { params } : {}), ...(notify ? {} : { id }) }),
  });
  sessionId = res.headers.get('mcp-session-id') || sessionId;
  const text = await res.text();
  if (!res.ok) throw new Error(`SearchAtlas MCP ${method}: HTTP ${res.status} ${text.slice(0, 300)}`);
  if (notify) return null;
  const msg = parseRpc(text, res.headers.get('content-type') || '', id);
  if (!msg) throw new Error(`SearchAtlas MCP ${method}: no response for id ${id}`);
  if (msg.error) throw new Error(`SearchAtlas MCP ${method}: ${msg.error.message || JSON.stringify(msg.error)}`);
  return msg.result;
}

async function connect() {
  await rpc('initialize', {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'riseridge-seo-autopilot', version: '1.0.0' },
  });
  await rpc('notifications/initialized', undefined, { notify: true });
}

async function listTools() {
  const tools = [];
  let cursor;
  do {
    const r = await rpc('tools/list', cursor ? { cursor } : {});
    tools.push(...(r.tools || []));
    cursor = r.nextCursor;
  } while (cursor);
  return tools;
}

async function callTool(name, args = {}) {
  const r = await rpc('tools/call', { name, arguments: args });
  // Flatten text content; keep structured content when present.
  const text = (r.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = undefined;
  }
  return { isError: Boolean(r.isError), data: r.structuredContent ?? parsed ?? text };
}

// ---------------------------------------------------------------- CSV fallback
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

// ---------------------------------------------------------------- commands
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
  process.exit(0);
}

if (!['tools', 'call', 'report'].includes(cmd)) {
  console.error('Usage: searchatlas.mjs tools [--grep re] | call <tool> <json> | report | ingest --dir <folder>  [--out f]');
  process.exit(1);
}
if (!authHeaders()) {
  writeJson(out, { skipped: 'SEARCHATLAS_API_KEY (or SEARCHATLAS_TOKEN) is not set' });
  process.exit(0);
}

await connect();

if (cmd === 'tools') {
  const grep = arg('grep');
  const re = grep && grep !== true ? new RegExp(String(grep), 'i') : null;
  const tools = (await listTools())
    .filter((t) => !re || re.test(t.name) || re.test(t.description || ''))
    .map((t) => ({ name: t.name, description: (t.description || '').split('\n')[0].slice(0, 200), inputSchema: t.inputSchema }));
  writeJson(out, { count: tools.length, tools });
} else if (cmd === 'call') {
  const name = process.argv[3];
  const rawArgs = process.argv[4] && !process.argv[4].startsWith('--') ? process.argv[4] : '{}';
  writeJson(out, { tool: name, ...(await callTool(name, JSON.parse(rawArgs))) });
} else if (cmd === 'report') {
  const cfg = fs.existsSync(CONFIG) ? JSON.parse(fs.readFileSync(CONFIG, 'utf8')) : {};
  const calls = (cfg.calls || []).filter((c) => c.tool);
  if (calls.length === 0) {
    writeJson(out, {
      skipped: 'No calls configured in scripts/seo/searchatlas.config.json',
      hint: 'Discover tools with `searchatlas.mjs tools --grep "visib|rank|otto|backlink"`, then call them directly or list them under "calls".',
    });
    process.exit(0);
  }
  const result = { source: 'searchatlas-mcp', data: {}, errors: {} };
  for (const c of calls) {
    try {
      const r = await callTool(c.tool, c.args || {});
      if (r.isError) result.errors[c.key || c.tool] = r.data;
      else result.data[c.key || c.tool] = r.data;
    } catch (e) {
      result.errors[c.key || c.tool] = e.message;
    }
  }
  writeJson(out, result);
}
