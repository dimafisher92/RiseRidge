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

## 1b. Clarity snapshot (always, read-only)

Microsoft Clarity (project `yykkk76y86`) records behaviour on riseridge.io. Its
export API only covers the last 1–3 days, so the history is built here, one
snapshot per run:

```bash
node scripts/seo/clarity.mjs report --days <3 on Monday, else 1> --out /tmp/clarity.json
```

- If it prints `skipped` or an HTTP error, write nothing and note "Clarity: not
  run (<reason>)" in the Daily Log. For a missing token or a blocked
  `www.clarity.ms`, keep or refresh the matching Needs Human row. Never call it
  more than once per run: the API allows only a few calls per project per day.
- Otherwise add rows to **UX Signals (Clarity)**, with Date = today and
  Window days = the `--days` value:
  - one row per page in `pages` that has ≥ 3 sessions (Page = the path).
    Map the merged fields: `Traffic.totalSessionCount` → Sessions,
    `Traffic.totalBotSessionCount` → Bot sessions,
    `ScrollDepth.averageScrollDepth` → Avg scroll depth %,
    `EngagementTime.activeTime` / `.totalTime` → Active / Total time s,
    and the `subTotal` (or count) field of `DeadClickCount`, `RageClickCount`,
    `QuickbackClick`, `ErrorClickCount` and `ScriptErrorCount` → the matching
    columns. If a field name differs, use the closest one and say which in
    Notes. Never invent a value: leave it empty instead.
  - one row with Page "(site)": total sessions, AI referral sessions
    (`aiReferrals.sessions`), and Channels as "Channel: sessions" for the top 6
    channels plus the AI sources by name.
- **Same-day triggers** (only these act today, everything else waits for the
  Weekly Plan):
  - Script errors > 0 or error clicks on a page → SEO Backlog row (Type
    Technical, Source "Clarity", P1), deduplicated against open rows.
  - Rage clicks ≥ 3 on one page → SEO Backlog row (Type On-page, Source
    "Clarity", P2) naming the page. The fix needs a human to watch the
    recordings, so leave Auto-eligible off.

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
