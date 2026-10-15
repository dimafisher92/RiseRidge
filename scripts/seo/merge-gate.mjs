#!/usr/bin/env node
// Deterministic merge gate for autopilot PRs.
//   node scripts/seo/merge-gate.mjs [base=origin/main]
// Exits 0 when the branch may be auto-merged, 1 otherwise. It checks the path
// allowlist, size limits and the one-merge-per-day rule. CI, Vercel and
// content-lint are checked separately (see .claude/skills/seo-autopilot/SKILL.md).
import { changedFiles, numstat, git, nyDate } from './lib.mjs';

const base = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'origin/main';

// Paths the autopilot may change without a human. Anything else -> human review.
const ALLOW = [
  /^content\/posts\/[a-z0-9-]+\.md$/,
  /^public\/uploads\/[a-z0-9-]+\.(svg|png|jpe?g|webp|avif)$/,
  /^content\/hero-sources\.json$/,
  /^src\/app\/blog\/.+\.tsx?$/,
  /^src\/app\/llms\.txt\/route\.ts$/,
  /^src\/app\/llms-full\.txt\/route\.ts$/,
  /^src\/app\/sitemap\.ts$/,
  /^src\/app\/robots\.ts$/,
  /^src\/app\/(page|layout)\.tsx$/, // metadata-sized edits only (see SRC_LINE_BUDGET)
  /^src\/app\/(about|features|rank-on-ai|seo-checker|case-studies)\/page\.tsx$/,
  /^src\/components\/JsonLd\.tsx$/,
  /^src\/components\/RelatedPosts\.tsx$/,
  /^src\/lib\/blog\.ts$/,
];

// Never auto-merged, even if an ALLOW pattern would match.
const DENY = [
  /^src\/app\/api\//,
  /^src\/app\/portal\//,
  /^src\/app\/admin\//,
  /(^|\/)package(-lock)?\.json$/,
  /^next\.config\./,
  /^tina\//,
  /^\.env/,
  /^\.github\//,
  /^\.claude\//,
  /^scripts\//,
  /^content\/facts\.md$/,
  /supabase/i,
];

const MAX_FILES = 15;
const MAX_NEW_POSTS = 1;
const SRC_LINE_BUDGET = 200; // added+removed lines across src/**
const MAX_MERGES_PER_DAY = Number(process.env.MAX_MERGES_PER_DAY || 1);

const problems = [];
const files = changedFiles(base);
const stats = numstat(base);

if (files.length === 0) problems.push('No changes against base.');
if (files.length > MAX_FILES) problems.push(`Too many files changed (${files.length} > ${MAX_FILES}).`);

let newPosts = 0;
let srcLines = 0;
for (const { status, file } of files) {
  if (DENY.some((re) => re.test(file))) {
    problems.push(`Protected path: ${file}`);
    continue;
  }
  if (!ALLOW.some((re) => re.test(file))) {
    problems.push(`Path not in autopilot allowlist: ${file}`);
    continue;
  }
  if (status === 'D' && /^content\/posts\//.test(file)) problems.push(`Deleting a post is not allowed: ${file}`);
  if (status === 'A' && /^content\/posts\//.test(file)) newPosts++;
  if (file.startsWith('src/')) {
    const s = stats[file] || { added: 0, removed: 0 };
    srcLines += s.added + s.removed;
  }
}
if (newPosts > MAX_NEW_POSTS) problems.push(`More than ${MAX_NEW_POSTS} new post in one PR (${newPosts}).`);
if (srcLines > SRC_LINE_BUDGET) problems.push(`src/ change too large for auto-merge (${srcLines} lines > ${SRC_LINE_BUDGET}).`);

// One autopilot merge per New York day (reverts don't count).
const today = nyDate();
const since = new Date(Date.now() - 36 * 3600 * 1000).toISOString();
const log = git('log', base, `--since=${since}`, '--format=%cI%x09%s');
const mergedToday = log
  ? log.split('\n').filter((l) => {
      const [iso, subject] = l.split('\t');
      return nyDate(new Date(iso)) === today && /^SEO autopilot:/i.test(subject || '');
    }).length
  : 0;
if (mergedToday >= MAX_MERGES_PER_DAY) {
  problems.push(`Daily merge limit reached (${mergedToday}/${MAX_MERGES_PER_DAY} autopilot merges on ${today} ET).`);
}

const result = {
  ok: problems.length === 0,
  base,
  files: files.map((f) => `${f.status} ${f.file}`),
  newPosts,
  srcLines,
  mergedToday,
  problems,
};
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 1);
