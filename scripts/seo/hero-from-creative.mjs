#!/usr/bin/env node
// Blog hero (and optional in-body figures) from a RiseRidge SMM creative, i.e. a
// designed Instagram slide attached to a ClickUp task in "RiseRidge SMM Design".
//
//   node scripts/seo/hero-from-creative.mjs --src <url|file> --slug <post-slug> --task <clickup task url>
//   node scripts/seo/hero-from-creative.mjs --src <url|file> --slug <post-slug> --figure 1
//
// Hero: writes public/uploads/<slugwithouthyphens>hero.jpg at 1200x675. A ~16:9
// source fills the frame. Any other shape is scaled to the full height and centred
// on a blurred copy of itself, so the 16:9 blog frame (object-cover) never crops
// its text and the sides blend with the slide's own colours. The
// slug -> ClickUp task pair is recorded in content/hero-sources.json, and a task
// that already supplied another post's hero is refused (no reused heroes).
//
// Figure: writes public/uploads/<slugwithouthyphens>-fig-<n>.jpg, max 1200 px wide,
// for embedding inside the article. Not recorded.
//
// Needs ImageMagick (`convert`) and, for URLs, network access to the
// ClickUp attachment host (t9012376385.p.clickup-attachments.com).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, arg, writeJson, nyDate } from './lib.mjs';

process.on('uncaughtException', (e) => {
  console.log(JSON.stringify({ error: e.message }));
  process.exit(1);
});

const src = arg('src');
const slug = arg('slug');
const task = arg('task');
const figure = arg('figure');
if (!src || src === true || !slug || slug === true || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: hero-from-creative.mjs --src <url|file> --slug <post-slug> (--task <clickup url> | --figure <n>)');
  process.exit(1);
}
if (!figure && (!task || task === true)) throw new Error('--task <clickup task url> is required for a hero');

const LEDGER = path.join(ROOT, 'content', 'hero-sources.json');
const base = slug.replace(/-/g, '');
const outRel = figure ? `/uploads/${base}-fig-${figure}.jpg` : `/uploads/${base}hero.jpg`;
const out = path.join(ROOT, 'public', outRel);

const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : {};
if (!figure) {
  const taskId = taskKey(task);
  const usedBy = Object.entries(ledger).find(([s, v]) => s !== slug && taskKey(v.clickupTask) === taskId);
  if (usedBy) throw new Error(`ClickUp task ${taskId} already supplied the hero for "${usedBy[0]}"; pick another creative`);
}

// Fetch or copy the source into a temp file.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hero-'));
const input = path.join(tmp, 'src');
if (/^https?:\/\//.test(src)) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status} ${src}`);
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`Not an image (${type}): ${src}`);
  fs.writeFileSync(input, Buffer.from(await res.arrayBuffer()));
} else {
  if (!fs.existsSync(src)) throw new Error(`File not found: ${src}`);
  fs.copyFileSync(src, input);
}

const im = (...a) => execFileSync('convert', a, { encoding: 'utf8' }).trim();
const [w, h] = im(input, '-format', '%w %h', 'info:').split(' ').map(Number);
if (!w || !h) throw new Error('Could not read image size');

fs.mkdirSync(path.dirname(out), { recursive: true });
if (figure) {
  im(input, '-resize', '1200x>', '-strip', '-interlace', 'Plane', '-quality', '82', out);
} else {
  const enc = ['-strip', '-interlace', 'Plane', '-quality', '82', out];
  if (Math.abs(w / h / (16 / 9) - 1) <= 0.03) {
    // Already ~16:9 (e.g. a generated hero): fill the frame, losing at most a few pixels.
    im(input, '-resize', '1200x675^', '-gravity', 'center', '-extent', '1200x675', ...enc);
  } else {
    // Square / 4:5 / 9:16 slide (or a very wide one): fit it whole, then fill the
    // empty bands by stretching the slide's own outermost pixels outward (lightly
    // blurred), so flat colours, gradients and photos continue without a seam.
    const fit = path.join(tmp, 'fit.png');
    im(input, '-resize', '1200x675', fit);
    const [fw, fh] = im(fit, '-format', '%w %h', 'info:').split(' ').map(Number);
    const tall = fw < 1200;
    const gap = tall ? 1200 - fw : 675 - fh;
    const [a, b] = [Math.floor(gap / 2), Math.ceil(gap / 2)];
    const band = (gravity, size) =>
      ['(', fit, '-gravity', gravity, '-crop', tall ? '2x0+0+0' : '0x2+0+0', '+repage',
        '-resize', tall ? `${size}x${fh}!` : `${fw}x${size}!`, '-blur', '0x6', ')'];
    im(...band(tall ? 'West' : 'North', a), fit, ...band(tall ? 'East' : 'South', b),
      tall ? '+append' : '-append', '-resize', '1200x675!', ...enc);
  }
  ledger[slug] = { clickupTask: task, source: path.basename(src.split('?')[0]), date: nyDate() };
  const sorted = Object.fromEntries(Object.keys(ledger).sort().map((k) => [k, ledger[k]]));
  fs.writeFileSync(LEDGER, JSON.stringify(sorted, null, 2) + '\n');
}
fs.rmSync(tmp, { recursive: true, force: true });

const [ow, oh] = im(out, '-format', '%w %h', 'info:').split(' ').map(Number);
writeJson(arg('out'), {
  ok: true,
  file: `public${outRel}`,
  coverImage: figure ? undefined : outRel,
  size: `${ow}x${oh}`,
  bytes: fs.statSync(out).size,
  source: `${w}x${h}`,
});

function taskKey(u) {
  return String(u || '').match(/\/t\/(?:\d+\/)?([a-z0-9]+)/i)?.[1] || String(u || '');
}
