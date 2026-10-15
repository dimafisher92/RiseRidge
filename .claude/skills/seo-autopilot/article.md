# New article pipeline

Input: one Content Calendar row (Title, Target keyword, Cluster, Intent, Slug,
Notes). Set its Status to "Writing" at the start.

## 1. Pre-flight
- `grep -ril "keyword: <target>" content/posts` plus the Calendar: if another
  page already targets this keyword or a near-duplicate, stop. Set the row
  Status to "Dropped" with a note, and pick the next Planned row.
- Read `content/facts.md`, 2–3 related existing posts, and the pages you will
  link to.

## 2. Research (WebSearch)
- Search the target keyword and 2–3 variants. Note the top-ranking page types,
  the subtopics they all cover, the questions in "People also ask", and what
  they miss.
- Ask the same question the way a user would ask ChatGPT or Perplexity, and
  note which sources get cited. Our article must be the clearest citable
  answer.
- Collect 3–6 authoritative external sources (Google Search Central docs,
  Shopify docs, official studies) for any statistics you use.

## 3. Write `content/posts/<slug>.md`
Frontmatter:
```yaml
---
title: <≤ 60 chars, includes the keyword naturally; NO "| RiseRidge" suffix>
excerpt: <140–160 chars; used as the meta description>
date: <today>T11:00:00.000Z
category: <one of: SEO Strategy, Technical SEO, Content Marketing, AI & Search, Case Studies, Industry Insights>
keyword: <target keyword>
author:
  name: RiseRidge Team
coverImage: /uploads/<slugwithouthyphens>hero.svg
---
```
Body (markdown, rendered by `src/components/Markdown.tsx` with GFM):
- **Opening:** 2–3 sentences that directly answer the query. No H1 in the body;
  the page renders the title as the H1.
- **Length:** 1,500–2,500 words. Use H2s phrased the way people search
  ("How do I…", "What is…"). Use H3s for steps.
- At least one table or numbered checklist.
- **Proof:** where relevant, one case-study result from `content/facts.md` with
  a link to `/case-studies/`. Clients stay anonymized.
- **Internal links (≥ 3):** to related posts (`/blog/<slug>/`), plus at least one
  of `/rank-on-ai/`, `/seo-checker/`, `/case-studies/`, `/features/`. Use
  descriptive anchors. Keep the trailing slash; the site uses `trailingSlash`.
- **External links:** source links for every statistic.
- End with `## FAQ`, then 3–6 `### Question?` headings, each followed by a
  2–4 sentence answer.
- Close with a short CTA sentence pointing to the free audit or `/seo-checker/`.

## 4. Hero image
Create `public/uploads/<slugwithouthyphens>hero.svg` (1200×675) in the same
style as the existing `public/uploads/*hero.svg` files. Copy the structure of
the most recent one and change the text and motif. No external fonts or images.

## 5. Link it in
Add one contextual link to the new post from 2–3 existing related posts. Edit a
sentence naturally; don't append "Related:" lists.

## 6. QC
- `node scripts/seo/content-lint.mjs content/posts/<slug>.md` must pass.
- Re-read the article against the Quality rules in `SKILL.md`. Cut anything
  generic, and check every number against its source.

## 7. Ship
Commit, push, open the PR, then follow the merge gate and after-merge steps.
Update the Calendar row: Status (PR → Live), PR link, Page URL
`https://riseridge.io/blog/<slug>/`, Word count.
