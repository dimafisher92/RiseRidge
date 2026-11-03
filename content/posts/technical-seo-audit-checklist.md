---
title: Technical SEO Audit Checklist for 2026
excerpt: A prioritized technical SEO audit checklist for 2026 covering crawlability, indexation, Core Web Vitals, schema and AI crawler access, with fixes in the order to do them.
date: 2025-02-18T09:00:00.000Z
updated: 2026-11-03T11:00:00.000Z
category: Technical SEO
keyword: technical seo audit checklist
author:
  name: RiseRidge Team
coverImage: /uploads/technicalseoauditchecklisthero.jpg
---

A technical SEO audit checklist is an ordered list of checks that confirm search engines can crawl, render, index and understand your site, and that pages load fast enough to keep visitors. Work through it in order: crawl and indexation first, then duplicates, architecture, structured data and speed. A page that Google cannot index earns nothing, no matter how good the copy is.

This checklist is built for site owners and marketers who want a repeatable audit, whether you run it by hand in an afternoon or with a tool. Each section says what to check, how to spot the problem, and what to do about it.

## How do I run a technical SEO audit?

Start with a full crawl of the site, then compare it against what Google reports. You need three data sources:

1. **A crawler** (Screaming Frog, Sitebulb or a similar tool) to list every URL, status code, canonical, title and H1.
2. **Google Search Console** for the Pages (indexing) report, sitemaps, Core Web Vitals and manual actions.
3. **Server or CDN logs**, if you can get them, to see what Googlebot and other bots actually request.

Export the crawl, then work down the sections below. Fix problems in priority order, not in the order the tool lists them. A tool may show 400 warnings; usually 10 of them hold back most of your traffic.

### Audit priority at a glance

| Priority | Area | Typical impact if broken |
|---|---|---|
| 1 | Crawl access (robots.txt, status codes, sitemap) | Pages are not discovered at all |
| 2 | Indexation (noindex, canonicals, duplicates) | Pages are found but not shown in results |
| 3 | Site architecture and internal links | Important pages get little authority |
| 4 | Structured data | Fewer eligible rich results and weaker entity signals |
| 5 | Core Web Vitals and speed | Slower pages lose visitors and can lose ranking ties |
| 6 | AI crawler access and llms.txt | Less chance of being cited in AI answers |

## Can search engines crawl my site?

Crawlability is the first gate. Check these items:

- **robots.txt.** Open `yourdomain.com/robots.txt` and confirm it does not block `/`, your CSS or JavaScript, or key sections. Blocking rendering files stops Google from seeing the page the way a visitor does. Google's [robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro) explains the syntax.
- **Status codes.** Every URL in your sitemap should return 200. Fix 404s, remove or redirect 5xx errors, and replace redirect chains (A to B to C) with a single 301 to the final URL.
- **XML sitemap.** It should list only canonical, indexable, 200-status URLs, be referenced in robots.txt and be submitted in Search Console. Remove noindex pages and redirected URLs from it.
- **Crawl budget.** Google says crawl budget matters mainly for very large sites or sites that change constantly, as described in its [crawl budget guide](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget). For most sites, the practical fix is the same as above: fewer redirect chains, fewer duplicate parameter URLs and no thin pages generated at scale.

## Are my pages actually indexed?

Open the Pages report in Search Console and read the "Why pages aren't indexed" list. The reasons that deserve action:

- **Crawled, currently not indexed.** Google visited and decided the page was not worth keeping. Improve the content, add internal links to it, or merge it into a stronger page.
- **Discovered, currently not indexed.** Google knows the URL but has not crawled it. Usually a sign of weak internal linking or a bloated site.
- **Excluded by noindex.** Confirm each of these is intentional. A leftover noindex from a staging site is a classic launch mistake.
- **Duplicate without user-selected canonical.** Google chose a different URL than you would have. Set the canonical yourself.

Use the URL Inspection tool on your five most important pages and confirm Google sees the same content a visitor does.

## How do I fix duplicate content and canonical tags?

Duplicates split ranking signals across several URLs. The common sources:

- `www` and non-`www` versions
- `http` and `https` versions
- Trailing slash and no trailing slash
- URL parameters such as `?sort=price` or `?ref=banner`
- Printer-friendly or AMP versions
- Product variants with near-identical text

The fix has two parts. First, pick one preferred version of each URL and 301-redirect the others to it. Second, add a self-referencing `rel="canonical"` tag to every indexable page, so parameter and tracking variants point back to the clean URL. Google's guide to [consolidating duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) covers the methods and their limits.

One outdated item still appears on many checklists: `rel="prev"` and `rel="next"` for paginated series. Google confirmed in 2019 that it no longer uses them as an indexing signal, so give each paginated page a unique, crawlable URL and a self-referencing canonical instead.

## What should my site architecture look like?

Shallow architecture helps both users and crawlers. Aim for every important page to be reachable within three clicks of the homepage. Pages buried six levels deep receive little internal authority and are crawled less often.

**Internal linking audit, in order:**

1. List orphan pages (no internal links pointing to them) and either link to them or remove them.
2. Fix internal links that return 404 or redirect.
3. Make sure your money pages (services, categories, key guides) receive the most internal links.
4. Replace vague anchors like "click here" with descriptive ones.
5. Link related posts to each other in the body text, not only in a footer block.

For example, a store owner auditing a Shopify site would check that collection pages are linked from the main navigation and that product pages are not orphaned by filters. Our [Shopify SEO checklist](/blog/shopify-seo-checklist/) covers the platform-specific version of this step. Local businesses should also keep their site consistent with their [Google Business Profile](/blog/google-business-profile-optimization/).

## Which structured data should I implement?

Structured data (schema markup, usually JSON-LD) labels what a page is about so search engines can interpret it and, for some types, show rich results. Match the schema to the page type:

| Site type | Schema types to consider |
|---|---|
| E-commerce | Product, Offer, BreadcrumbList |
| Blog or publisher | Article, BreadcrumbList |
| Local business | LocalBusiness, OpeningHoursSpecification |
| SaaS or agency | Organization, WebSite, SoftwareApplication |
| Pages with a real FAQ section | FAQPage |

Rules to follow:

- Mark up only what is visible on the page.
- Never add review or rating markup for reviews you do not actually hold and display.
- Validate with Google's Rich Results Test and watch the Enhancements reports in Search Console for new errors.
- Keep one canonical set of Organization details (name, logo, contact) and reuse it everywhere.

## How do I check Core Web Vitals and page speed?

Core Web Vitals are Google's field-measured page experience metrics. The current thresholds, documented on [web.dev](https://web.dev/articles/vitals), are:

| Metric | What it measures | Good |
|---|---|---|
| Largest Contentful Paint (LCP) | Time until the main content renders | 2.5 seconds or less |
| Interaction to Next Paint (INP) | Responsiveness to taps and clicks | 200 ms or less |
| Cumulative Layout Shift (CLS) | Visual stability during load | 0.1 or less |

INP replaced First Input Delay as the responsiveness metric in March 2024, so a checklist that still lists FID is out of date.

**Common fixes by metric:**

- **LCP:** preload the hero image, compress it, serve a modern format (WebP or AVIF), use a CDN and remove render-blocking scripts.
- **INP:** cut JavaScript execution time, break up long tasks and delay third-party scripts such as chat widgets and tag managers.
- **CLS:** set width and height on images and embeds, reserve space for ads and banners, and avoid inserting content above what is already on screen.

Check the field data in Search Console first, because it reflects real visitors. Use PageSpeed Insights or Lighthouse to find the cause on a specific URL. Beyond the three metrics, enable Brotli or Gzip compression, set sensible cache headers, minify CSS and JavaScript, and lazy-load images below the fold.

## Are AI crawlers allowed to read my site?

AI answer engines now send visitors and citations, and they can only cite what they can fetch. Add these checks to the audit:

- Review robots.txt for rules that block AI crawlers such as GPTBot, ClaudeBot, PerplexityBot or Google-Extended. Block them only if that is a deliberate choice.
- Make sure key content renders without requiring JavaScript, since many crawlers do not execute it.
- Consider publishing an `llms.txt` file that points to your most useful pages. Our [llms.txt explainer](/blog/llms-txt-explained/) covers what it does and does not do.
- Put the direct answer high on the page, with clear headings, so it is easy to quote.

For the wider picture, see our [AI search visibility guide](/blog/ai-search-visibility-guide/), and use the [Rank on AI](/rank-on-ai/) tool to see whether ChatGPT, Claude, Gemini and Perplexity mention your brand today.

## What does a technical audit look like in practice?

In one RiseRidge engagement with a mobile auto-glass shop in Charlotte, NC, the technical audit surfaced 114 faults in the first 90 days. Fixing them (alongside rewriting 10 pages and labelling 39 images) moved the site health score from 0 to 91 out of 100 and the average Google position from 15.5 to 10.1. The details are on our [case studies](/case-studies/) page. The lesson is the order of work: clear the crawl and indexation blockers first, because everything else depends on them.

## How often should I repeat a technical audit?

Run a full audit at least twice a year and after any redesign, migration, platform change or large content release. Between full audits, monitor the signals that break silently:

- New 404s and 5xx errors
- Pages dropping out of the index
- Changes to robots.txt, canonicals or noindex tags after deployments
- Core Web Vitals moving from "good" to "needs improvement"
- Structured data errors in Search Console

Automated monitoring is worth having for this, because a single bad deployment can undo months of work. You can run a free first pass with our [SEO checker](/seo-checker/).

## FAQ

### What is a technical SEO audit?

A technical SEO audit is a systematic review of the factors that affect how search engines crawl, render and index your site, including robots.txt, sitemaps, canonicals, site speed, structured data and mobile usability. It finds the blockers that stop good content from ranking.

### How long does a technical SEO audit take?

A small site of a few hundred pages can be audited by hand in one to two days. Larger sites take longer because of log analysis and template-level checks. Crawling tools and automation shorten the data-gathering stage, but someone still has to prioritize and verify the fixes.

### What are the most important technical SEO factors?

Crawlability and indexation come first, since nothing else matters if pages are blocked or excluded. After that, duplicate content control, internal linking, page speed (Core Web Vitals), mobile usability and structured data have the largest effect for most sites.

### Do Core Web Vitals affect rankings?

Google lists page experience, including Core Web Vitals, among the signals its ranking systems use, but relevance and content quality usually outweigh them. Treat speed as a way to keep visitors and win close ties, and fix poor scores before they become an obstacle.

### Which tools do I need for a technical SEO audit?

At minimum: Google Search Console, a site crawler, PageSpeed Insights and the Rich Results Test. Server logs and a rank tracker add useful context. Our free [SEO checker](/seo-checker/) is a quick starting point.

Ready to see what is holding your site back? Run the free [SEO checker](/seo-checker/) or ask us for a full audit.
