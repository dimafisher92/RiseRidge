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
coverImage: /uploads/<slugwithouthyphens>hero.jpg   # .svg only for the fallback in step 4
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

## 4. Hero image: our SMM creative first
The hero must be one of RiseRidge's own designed creatives whenever a suitable
one exists (sources and IDs in `SKILL.md` → "SMM creatives").

1. **Find candidates.** Query the Notion SMM Content Calendar for rows with
   Format Carousel or Static and Status Scheduled or Published. Compare their
   Post Concept and Hook with the article's keyword and angle. Keep the rows
   whose topic genuinely matches. A loose "it's also about AI" match is not
   enough.
2. **Skip used ones.** Drop any row whose ClickUp task is already in
   `content/hero-sources.json`.
3. **Get the file.** With the ClickUp connector, read the best match's task in
   list "RiseRidge SMM Design" (`include: ["attachments", "custom_fields"]`).
   Take the cover slide: the first slide (named `_01`, `_s1`, `_01-01` or `_s-01`;
   prefer .jpg over .png; for a Reel, the `_cover` image), else the first image
   in the "IG Media JSON" field. Its URL is
   `https://t9012376385.p.clickup-attachments.com/t9012376385/<attachment id without extension>/<title>`.
   Use the creative only if its ClickUp status is "completed" or "published".
4. **Build the hero:**
   `node scripts/seo/hero-from-creative.mjs --src <url> --slug <slug> --task <clickup task url>`.
   This writes `public/uploads/<slugwithouthyphens>hero.jpg` (1200×675, slide
   centred on its own background colour, so nothing gets cropped) and records
   the slug in `content/hero-sources.json`. Set `coverImage` to the path it
   prints, and commit both files.
5. **Optional figures.** If 1–2 later slides of the same carousel illustrate a
   section (a checklist, a comparison), you may embed them with
   `--figure 1` / `--figure 2` and `![<descriptive alt text>](/uploads/<slugwithouthyphens>-fig-1.jpg)`.
   The figure must match the paragraph it sits in. Any number on a slide follows
   the same facts rules as text.
6. **Record it.** Put the ClickUp task link in the PR body and in the Calendar
   row Notes ("Hero: <link>").

**Fallback** (no matching creative, ClickUp connector missing, or the
attachment host blocked): create `public/uploads/<slugwithouthyphens>hero.svg`
(1200×675) in the style of the existing `public/uploads/*hero.svg` files. Copy
the structure of the most recent one and change the text and motif. No external
fonts or images. Note "Hero: SVG fallback (<reason>)" in the Daily Log. If the
reason is access, add the Needs Human row as in "When blocked".

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
