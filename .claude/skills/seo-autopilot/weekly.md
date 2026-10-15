# Weekly Plan (Monday ~06:10 ET, runs before the Daily Run)

Do Step 0 from `SKILL.md`. Merges are not part of this run, so `auto_merge`
does not matter here. If autopilot is OFF, still write the report: reports are
read-only. Skip only the planning writes.

## 1. Collect data (each source is optional; note what was missing)
- **GSC:** `node scripts/seo/gsc.mjs report --out /tmp/gsc.json` gives clicks,
  impressions, CTR and position for the last 28 days vs the previous 28, plus
  top queries, top pages, striking-distance queries (pos 5–20, impressions ≥ 20),
  pages losing clicks, and high-impression/low-CTR pages.
- **SearchAtlas** (hosted MCP via `scripts/seo/searchatlas.mjs`; needs
  `SEARCHATLAS_API_KEY` and network access to `mcp.searchatlas.com`):
  1. `node scripts/seo/searchatlas.mjs tools --grep "visib|llm|rank|keyword|otto|backlink" --out /tmp/sa-tools.json`
     discovers the available tools and their input schemas. The catalogue
     changes, so always discover first.
  2. riseridge.io projects in SearchAtlas (set up 2026-10-15):
     - LLM Visibility: project `0a31b563-2b45-4b61-b56b-f3227373b4cd`
       (`llmv_*` tools);
     - Rank Tracker: project `88687`, "riseridge.io (Google US)", 27 keywords
       (`krt_*` tools).

     Use these IDs directly. If one stops resolving, find it again with
     `llmv_list_projects` / `krt_list_projects`; never create a new project.
  3. Call the relevant tools for riseridge.io with
     `node scripts/seo/searchatlas.mjs call <tool> '<json args>' --out /tmp/sa-<name>.json`:
     - LLM Visibility: mentions/citations per prompt and engine, plus
       competitors cited;
     - Rank Tracker: positions and top-10 count;
     - OTTO issues;
     - new/lost backlinks.

     Use read-only tools only. Never call tools that create, modify, deploy
     or delete anything in SearchAtlas (e.g. OTTO deploy, project create).
  4. If `scripts/seo/searchatlas.config.json` lists `calls`, you can run
     `node scripts/seo/searchatlas.mjs report --out /tmp/sa.json` instead.

  If it prints `skipped` or the host is blocked, use the CSV fallback:
  1. With the Google Drive connector, find the folder
     "RiseRidge SEO / SearchAtlas exports".
  2. Download the CSVs modified in the last 7 days into `/tmp/sa-exports/`.
  3. Run `node scripts/seo/searchatlas.mjs ingest --dir /tmp/sa-exports --out /tmp/sa.json`.

  If neither source has data, leave the SearchAtlas sections empty and keep
  the Needs Human row for SearchAtlas access open.
- **Crawl:** `node scripts/seo/crawl.mjs --base https://riseridge.io --out /tmp/crawl.json`.
- Daily Log rows from the last 7 days, plus the Content Calendar and Backlog
  rows changed this week.

## 2. AI Visibility Log
The tracked prompt set is `docs/ai-visibility-prompts.md`. If SearchAtlas tracks prompts that are not in that file (or misses some), report the mismatch in the Weekly Report and in Needs Human.

Count only the prompts from that file. SearchAtlas can add auto-generated
prompts on its own, and its API cannot delete them. Leave any such prompts
out of the AI Visibility Log and the AI mention rate. Compute the mention rate
yourself as the share of (prompt, engine) pairs, over the prompts in the file,
where RiseRidge is mentioned or cited. The project-level visibility score may
be quoted only when the project's prompts exactly match the file.
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
