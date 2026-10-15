# SEO autopilot scripts

Plain Node (20+) scripts used by the scheduled SEO autopilot
(`.claude/skills/seo-autopilot/`) and by CI. The only dependencies are ones the
site already has: `gray-matter` and `node-html-parser`.

| Script | What it does | Needs |
|---|---|---|
| `content-lint.mjs` | Lints blog posts. Basic checks: frontmatter, links, no H1, cannibalization, first-party numbers vs `content/facts.md`. Strict checks for new or refreshed posts: ≥1500 words, ≥3 internal links incl. a service page, FAQ, keyword, no clichés. | — |
| `merge-gate.mjs` | Decides whether an autopilot PR may be auto-merged: path allowlist/denylist, size limits, max 1 autopilot merge per New York day. | git history of `origin/main` |
| `crawl.mjs` | Technical crawl of a live or local site via its sitemap: status, redirects, title/description, canonical, H1, JSON-LD, alt text, broken internal links, robots.txt, llms.txt. Exit 2 on errors, 3 if unreachable. | network access to the site |
| `gsc.mjs` | Google Search Console: 28-day vs previous report (striking distance, losing pages, low CTR, new queries), per-page queries, sitemap submit. | `GSC_SERVICE_ACCOUNT_JSON` + network to googleapis |
| `searchatlas.mjs` | SearchAtlas rankings, OTTO, backlinks and LLM Visibility, via SearchAtlas's hosted MCP server (`tools`, `call`, `report`), or CSV exports (`ingest --dir`). | `SEARCHATLAS_API_KEY` + network access to `mcp.searchatlas.com` |
| `indexnow.mjs` | Pings IndexNow with changed URLs. Key file: `public/<key>.txt`. | network to api.indexnow.org |

Scripts whose credentials are missing print `{"skipped": "..."}` and exit 0, so
the routines degrade gracefully.

Examples:

```bash
node scripts/seo/content-lint.mjs content/posts/my-new-post.md
node scripts/seo/content-lint.mjs --changed origin/main
node scripts/seo/merge-gate.mjs origin/main
npx next build && npx next start -p 3123 &
node scripts/seo/crawl.mjs --base http://localhost:3123 --out /tmp/crawl.json
node scripts/seo/gsc.mjs report --out /tmp/gsc.json
```
