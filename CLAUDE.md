# RiseRidge website — repo rules

Marketing site for **riseridge.io** (AI-driven SEO agency). Next.js 14 App Router, Tailwind, TinaCMS for the blog editor, deployed on Vercel.

## Branches and deploys
- `main` is production. Vercel deploys `main` to riseridge.io. Every change goes through a PR into `main`.
- Never push directly to `main`, never force-push it, never rewrite its history.
- Old `claude/*` branches are historical. Do not base new work on them.

## Commands
- `npm run lint` (Next ESLint), `npx tsc --noEmit -p .` (typecheck), `npx next build` (build without TinaCloud).
- `npm run dev` runs Tina + Next locally. `npx next dev` runs Next alone.
- SEO tooling lives in `scripts/seo/` (Node 20+, no extra deps). See `scripts/seo/README.md`.

## Content
- Blog posts are markdown in `content/posts/<slug>.md`. Filename = slug = URL `/blog/<slug>/`. Never rename an existing slug.
- Frontmatter: `title`, `excerpt`, `date`, `category` (one of the 6 in `tina/config.ts`), `author.name`, `coverImage`. Optional: `keyword` (one primary keyword per page, unique across posts), `updated` (ISO date of last substantive update).
- Hero images: `public/uploads/<slug-without-hyphens>hero.svg`, 1200×675, brand colors.
- `src/lib/blog.ts` reads posts at build time. Sitemap, llms.txt and the blog index pick up new posts automatically.
- Language: US English. Audience: US e-commerce/Shopify brands, local businesses, growth-stage companies.

## Facts and claims (hard rule)
- Claims about RiseRidge or its clients (numbers, results, awards, years) must come from `content/facts.md`. Never invent stats, clients, testimonials, reviews or ratings.
- Never add AggregateRating/Review schema.
- External statistics need an inline link to the source.
- Case-study clients are anonymized. Never name them.

## SEO autopilot
Scheduled Claude sessions run `.claude/skills/seo-autopilot/` (daily/weekly/monthly). Read `SKILL.md` there before doing autopilot work.
