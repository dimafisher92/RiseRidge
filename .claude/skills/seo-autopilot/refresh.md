# Backlog task / refresh pipeline

Input: one SEO Backlog row. Set its Status to "In progress".

## Refresh of an existing post (Type "Refresh")
1. If GSC is available, run `node scripts/seo/gsc.mjs page /blog/<slug>/` and use
   the page's top queries to choose sections to add. Queries in positions
   5–20 are the best opportunities.
   Also read the page's last 14 days in **UX Signals (Clarity)**. Low scroll
   depth means the answer sits too low: move the direct answer and the key
   table above the fold. A high quickback share means the page misses the
   query's intent: reshape the intro and H2s around the GSC queries. Note the
   before-numbers in the PR body, so the next weekly report can compare.
2. Keep the slug, the `date` and the core angle. Set `updated: <today>` and add
   a `keyword` if it is missing (check for duplicates first).
3. Expand to ≥ 1,500 words with substantive sections, not padding. Update
   outdated years and claims, add a table or checklist where useful, add
   ≥ 3 internal links and an `## FAQ` section.
4. If `coverImage` is still an `.svg`, look for a matching SMM creative as in
   `article.md` step 4. If you find one, switch the hero to the new `.jpg`.
   Leave the old `.svg` file in place.
5. Run `node scripts/seo/content-lint.mjs content/posts/<slug>.md`. A refresh
   must pass the same rules as a new post.

## Internal-link task (Type "Internal links")
Add contextual links only. Don't rewrite unrelated text.

## Technical / On-page / GEO task
- Make the smallest change that fully solves the task described in Details and
  Files.
- Stay inside the merge-gate allowlist (see `scripts/seo/merge-gate.mjs`). If
  the task needs files outside it, still open the PR, but expect it to go to
  Needs Human. Say so in the PR body.
- Verify locally: run `npx next build` and `npx next start -p 3123`, then
  `node scripts/seo/crawl.mjs --base http://localhost:3123 --urls <affected paths>`.
  Show before/after in the PR body.

## Ship
Follow the merge gate and after-merge steps in `SKILL.md`. Update the Backlog
row: Status Done (or PR open), PR link.
