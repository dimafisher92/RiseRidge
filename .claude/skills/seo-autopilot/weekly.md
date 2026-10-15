# Weekly Plan (Monday ~06:10 ET, runs before the Daily Run)

Do Step 0 from `SKILL.md`. Merges are not part of this run, so `auto_merge`
does not matter here. If autopilot is OFF, still write the report: reports are
read-only. Skip only the planning writes.

## 1. Collect data (each source is optional; note what was missing)
- **GSC:** `node scripts/seo/gsc.mjs report --out /tmp/gsc.json` gives clicks,
  impressions, CTR and position for the last 28 days vs the previous 28, plus
  top queries, top pages, striking-distance queries (pos 5–20, impressions ≥ 20),
  pages losing clicks, and high-impression/low-CTR pages.
- **SearchAtlas:** `node scripts/seo/searchatlas.mjs report --out /tmp/sa.json`
  gives keyword rankings, top-10 count, OTTO issues, new/lost backlinks, and
  **LLM Visibility** (per prompt and engine: mentioned yes/no, position, cited
  URL, competitors).
- **Crawl:** `node scripts/seo/crawl.mjs --base https://riseridge.io --out /tmp/crawl.json`.
- Daily Log rows from the last 7 days, plus the Content Calendar and Backlog
  rows changed this week.

## 2. AI Visibility Log
Add one row per (prompt, engine) from the SearchAtlas LLM Visibility data, with
Week = this Monday. If SearchAtlas has no LLM data, skip this step and add a
Needs Human row. Never estimate results yourself.

## 3. Weekly Report
Create a Weekly Reports row titled "Week of <Monday>" and fill the numeric
properties from data that exists, leaving the rest empty. The page body has
these sections:
1. **Headline:** 3 bullets, the most important movements.
2. **KPIs table:** this week vs last week vs 4 weeks ago (clicks, impressions,
   avg position, top-10 keywords, AI mention rate, posts published/refreshed).
3. **Shipped:** links to the PRs and pages from the Daily Log.
4. **Winners / losers:** pages and queries.
5. **AI visibility:** prompts where we're cited, prompts where competitors are
   cited instead, and why (which page/source won).
6. **Plan for this week:** see step 4.
7. **Needs human:** open items, oldest first.

## 4. Plan the week
- Make sure the next 7 days have 3 "New" Content Calendar rows (Mon/Wed/Fri),
  each with Status "Planned". Adjust or add rows by this priority:
  1. a striking-distance query that has no dedicated page;
  2. a prompt where competitors get cited and we have no matching page;
  3. a cluster gap (see `monthly.md` clusters);
  4. the pre-planned calendar.

  Every new row needs a unique Target keyword, Cluster, Intent, Slug and Notes
  (links to include, the angle, the proof point).
- Mark 2 SEO Backlog rows as "Next" for Tue/Thu. Prefer: pages losing clicks
  (refresh), low CTR with high impressions (rewrite title/excerpt), then the
  existing P0/P1 items.
- Add new Backlog rows from crawl warnings and OTTO issues (Source "Crawl" /
  "SearchAtlas"), deduplicated against open rows.

## 5. Off-site drafts (Needs Human, max 3 per week)
These need a human, so draft them ready to use, for example:
- a directory profile text (Clutch, G2, GoodFirms, DesignRush);
- a pitch to the author of a "best AI SEO agencies" listicle that AI engines
  cite;
- a helpful Reddit or Quora answer for a question where a competitor is cited;
- a guest-post or HARO/Qwoted pitch.

Put the full draft in "Draft / details" and the target URL in Link. Use facts
from `content/facts.md` only.

## 6. Log
Add a Daily Log row with Routine "Weekly", Outcome "No-op" (no PR), and a
Summary linking the report.
