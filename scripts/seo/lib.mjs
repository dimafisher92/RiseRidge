// Shared helpers for the SEO autopilot scripts. Node 20+, no extra deps
// beyond what the site already installs (gray-matter, node-html-parser).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import matter from 'gray-matter';

// Behind an egress proxy (Claude cloud sessions set HTTPS_PROXY), Node's built-in
// fetch ignores the proxy unless NODE_USE_ENV_PROXY=1 is set at startup (Node >= 22.21).
// Re-run the calling script once with it set, so every script works the same in CI,
// locally and in the routines. No-op when there is no proxy.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, [...process.execArgv, ...process.argv.slice(1)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(r.status ?? 1);
}

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
export const POSTS_DIR = path.join(ROOT, 'content', 'posts');
export const SITE = 'https://riseridge.io';

export const CATEGORIES = [
  'SEO Strategy',
  'Technical SEO',
  'Content Marketing',
  'AI & Search',
  'Case Studies',
  'Industry Insights',
];

export function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

/** Files changed between `base` (merge-base) and HEAD: [{status, file}] */
export function changedFiles(base) {
  const out = git('diff', '--name-status', '--no-renames', `${base}...HEAD`);
  if (!out) return [];
  return out.split('\n').map((line) => {
    const [status, file] = line.split('\t');
    return { status: status[0], file };
  });
}

/** { added, removed } line counts per file between base and HEAD. */
export function numstat(base) {
  const out = git('diff', '--numstat', '--no-renames', `${base}...HEAD`);
  const map = {};
  if (!out) return map;
  for (const line of out.split('\n')) {
    const [a, r, file] = line.split('\t');
    map[file] = { added: a === '-' ? 0 : Number(a), removed: r === '-' ? 0 : Number(r) };
  }
  return map;
}

export function readPost(file) {
  const raw = fs.readFileSync(path.isAbsolute(file) ? file : path.join(ROOT, file), 'utf8');
  const { data, content } = matter(raw);
  return { data, body: content, slug: path.basename(file).replace(/\.md$/, '') };
}

export function allPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => readPost(path.join(POSTS_DIR, f)));
}

export function wordCount(markdown) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`|~-]+/g, ' ');
  return text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

/** Today's date in America/New_York as YYYY-MM-DD. */
export function nyDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** Static page routes under src/app (e.g. "/", "/about"). */
export function appRoutes() {
  const appDir = path.join(ROOT, 'src', 'app');
  const routes = new Set(['/']);
  const walk = (dir, prefix) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      if (name.startsWith('[') || name.startsWith('(') || name.startsWith('_') || name === 'api') continue;
      const full = path.join(dir, name);
      const route = `${prefix}/${name}`;
      if (fs.existsSync(path.join(full, 'page.tsx')) || fs.existsSync(path.join(full, 'route.ts'))) {
        routes.add(route);
      }
      walk(full, route);
    }
  };
  walk(appDir, '');
  routes.add('/sitemap.xml');
  routes.add('/robots.txt');
  return routes;
}

export function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith('--') ? true : v;
}

export function writeJson(file, data) {
  if (!file || file === true) {
    process.stdout.write(JSON.stringify(data, null, 2) + '\n');
    return;
  }
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.error(`wrote ${file}`);
}
