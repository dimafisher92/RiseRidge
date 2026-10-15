# Monthly Strategy (1st of the month, ~07:10 ET)

Do Step 0 from `SKILL.md` first.

## 1. Review
- Read the last 4 Weekly Reports, the AI Visibility Log trend and the 90-day
  GSC numbers (`node scripts/seo/gsc.mjs report --days 90 --out /tmp/gsc90.json`).
- **Cluster coverage map:** for each cluster below, count live posts, refreshed
  posts, internal links between them, total clicks and AI mentions. A cluster
  is "thin" if it has fewer than 5 posts or no pillar page.

| Cluster | Pillar / anchor | Commercial page |
|---|---|---|
| AI search / GEO | ai-search-visibility-guide | /rank-on-ai |
| Shopify / e-commerce | shopify-seo-checklist | (proposed /shopify-seo) |
| Local SEO | google-business-profile-optimization | (proposed /local-seo) |
| Technical SEO | technical-seo-audit-checklist | /seo-checker |
| Industry guides | law-firm-seo-ai-search, local-seo-auto-repair-shops | — |
| Commercial / comparisons | how-to-choose-an-seo-agency | /case-studies |

## 2. Write the "Monthly Strategy <Month YYYY>" page under the HQ page
Sections:
- KPI trend vs last month and the 3-month trend.
- What worked: the posts, refreshes and fixes with the biggest gains.
- Cluster coverage map: table, plus the thin clusters to fill.
- AI visibility: the share of prompts where we're mentioned, by engine, and the
  sources that beat us.
- Next month: about 12 new topics and 8 refresh candidates (also added to
  Content Calendar and Backlog as Idea/Backlog).
- Template proposals: new page types (service, case-study, industry, location
  pages) with a rationale. Add each one as an SEO Backlog row, Type
  "Template", Auto-eligible ☐. Optionally open a draft PR for human review.
  Never merge these.
- `facts.md` and prompt-set updates needed: as Needs Human rows (Kind "Fact
  check" / "Decision").

## 3. Log
Add a Daily Log row with Routine "Monthly" and a link to the strategy page.
