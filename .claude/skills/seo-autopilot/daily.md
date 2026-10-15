# Daily Run (Mon–Fri, ~06:50 ET)

Do Step 0 from `SKILL.md` first (settings and kill-switch).

## 1. Health check (always)

```bash
node scripts/seo/crawl.mjs --base https://riseridge.io --out /tmp/crawl.json
```

- If the site is unreachable from the sandbox (network policy), record Health
  check "Not run", make sure the "Cloud environment: allow network domains"
  Needs Human row is still Open, and continue with step 2.
- **Regression** means: a sitemap URL returns 4xx/5xx, a canonical or
  H1 is missing on a page that had one, JSON-LD stops parsing, robots.txt
  blocks `/`, or sitemap.xml/llms.txt is unreachable. A regression becomes
  today's work instead of step 2. If it cannot be fixed within the allowed
  paths, add a P0 Needs Human row.
- Warnings (title/description length, missing alt, thin pages) become SEO
  Backlog rows (Source "Crawl"), unless an open row already covers them.

## 2. Pick today's work

Use the New York date:
- **Mon / Wed / Fri** → take the first Content Calendar row with Type "New",
  Status "Planned" and the earliest Slot date ≤ today, then follow `article.md`.
  If there is none, fall back to Tue/Thu behaviour.
- **Tue / Thu** → take the top SEO Backlog row with Auto-eligible ✓ and Status
  "Next" or "Backlog". Order by Priority (P0 first), then Status "Next" before
  "Backlog", then Effort (S first). Follow `refresh.md`.

One unit of work per day. A whole article, or one backlog task, is one PR.

## 3. Ship it

Follow the Merge gate and After-merge steps in `SKILL.md`.

## 4. Log it

Follow Logging in `SKILL.md`.
