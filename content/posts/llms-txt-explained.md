---
title: 'llms.txt Explained: What It Is and Do You Need One?'
excerpt: 'llms.txt is a proposed Markdown file that points AI tools to your best pages. Here is what it contains, who reads it today, and whether your site needs one.'
date: 2026-10-26T11:00:00.000Z
category: AI & Search
keyword: llms.txt
author:
  name: RiseRidge Team
coverImage: /uploads/llmstxtexplainedhero.jpg
---

llms.txt is a proposed plain-text file, written in Markdown and placed at `yoursite.com/llms.txt`, that gives AI tools a short, curated map of your most useful pages. It is not an official web standard, and Google has said that no AI system currently uses it. Adding one is cheap, but it should not be where your AI search effort goes first.

This guide covers what the file contains, how it differs from robots.txt and your sitemap, what the major search companies have said about it, and a practical rule for deciding whether to publish one.

## What Is llms.txt?

llms.txt is a file proposed in 2024 by Jeremy Howard of Answer.AI. The [llms.txt proposal](https://llmstxt.org/) describes a Markdown file at the root of a site that tells a language model what the site is and where its best content lives, in a format that is easy for both people and machines to read.

The reasoning behind it is simple. A language model has a limited context window, and a typical web page is full of navigation, scripts and layout code. Converting a whole site to clean text is hard to do reliably. A short file that lists the important pages, each with a one-line description, skips that work.

The proposal targets *inference-time* use: an AI assistant or agent that is already working on a task, such as answering a question about your product or writing code against your documentation, fetches the file and follows the links. It is not meant to control training or indexing.

## What Goes Inside an llms.txt File?

The proposal defines a small structure, in this order:

1. **An H1 heading** with the name of the site or project. This is the only required part.
2. **A blockquote** with a short summary of what the site is.
3. **Optional paragraphs** with extra context, written as plain text.
4. **H2 sections** that each hold a list of links. Every item is a Markdown link, optionally followed by a colon and a short note.
5. **An "Optional" H2 section** for secondary links that a tool can skip when it needs a shorter context.

A minimal example for a small business site looks like this:

```markdown
 # Example Plumbing Co.

> Licensed residential plumber serving Austin, Texas. Repairs, water heaters and emergency call-outs.

## Services

- [Water heater installation](https://example.com/water-heaters/): Tank and tankless options, pricing factors, timeline
- [Emergency plumbing](https://example.com/emergency/): Hours, coverage area, what to do before we arrive

## Guides

- [How to shut off your main water valve](https://example.com/guides/main-valve/): Step-by-step with photos

## Optional

- [About us](https://example.com/about/)
```

Notice what the example leaves out: no keyword lists, no marketing adjectives and no links to every page. The value of the file comes from selection, so a short list of pages you would be happy for an assistant to quote is better than a full URL dump, which is what your sitemap already provides.

You can see a live, working version on this site at [riseridge.io/llms.txt](/llms.txt). Some sites also publish a longer companion file, often called `llms-full.txt`, that holds the full text of key pages. That is a community convention rather than part of the proposal, and ours is at [riseridge.io/llms-full.txt](/llms-full.txt).

## How Is llms.txt Different From robots.txt and a Sitemap?

The three files do different jobs, and llms.txt replaces neither of the others.

| File | Format | Audience | What it does |
|---|---|---|---|
| robots.txt | Plain-text rules | Crawlers | Allows or blocks crawling of paths. See [Google's robots.txt guide](https://developers.google.com/search/docs/crawling-indexing/robots/intro). |
| sitemap.xml | XML list of URLs | Search engines | Lists every URL you want discovered, with optional dates. |
| llms.txt | Markdown | AI tools at answer time | Highlights a short, described set of your best pages. |

The "robots.txt for AI" shorthand is catchy but misleading. robots.txt controls access. llms.txt controls nothing: it only suggests where to look. If you want to block or allow an AI crawler, that still happens in robots.txt.

## Do ChatGPT, Google and Perplexity Use llms.txt?

As of this writing, there is no public confirmation from a major AI search product that it reads llms.txt to decide what to cite.

- **Google:** Search Advocate John Mueller wrote that [no AI system currently uses llms.txt](https://www.seroundtable.com/google-ai-llms-txt-39607.html), and later described the file as [purely speculative for now](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/). Google's own page on [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) says there are no extra requirements for appearing in AI Overviews or AI Mode beyond being indexed and eligible to show a snippet.
- **Other AI engines:** OpenAI, Anthropic and Perplexity publish documentation for their crawlers, but we have not found any of them committing to llms.txt as a ranking or citation input. That absence could change, so check their current docs before relying on it.

The honest reading is that llms.txt is a bet on how AI tools may work, not a lever with measured results. One place it has real traction is developer documentation, where coding assistants and agents can be pointed at a project's docs on purpose. For a marketing site or a local business, that use case is rare.

## Do You Need an llms.txt File?

Use this decision rule:

- **Publish one if** you run documentation, an API, a knowledge base or a product with many pages that agents may be asked to work with. Also publish one if you can generate the file automatically from your CMS, so it costs nothing to maintain.
- **Skip it for now if** you have a small brochure site, or if writing it would pull time away from work that is known to matter.
- **Never treat it as a substitute** for crawlable pages, internal links and a sitemap.

If the file takes an hour and has no downside, it is fine to add. The risk is in the opportunity cost and in believing it does more than it does.

## How to Create an llms.txt File: Step by Step

### 1. Pick 10 to 30 pages worth citing

Choose the pages you would want an AI to quote when someone asks about your business: core service pages, pricing explanations, your best guides, a clear about page. Leave out thin pages, tag archives and anything out of date.

### 2. Write one plain sentence per link

Describe what the reader gets from the page, not how great it is. "Step-by-step guide to checking your Core Web Vitals in Search Console" is useful. "Our amazing resource" is not.

### 3. Group the links under clear H2 headings

Use headings such as Services, Guides, Pricing and Company. Keep secondary material under the Optional heading so a tool with limited context can drop it.

### 4. Publish it at the root and check the response

Serve the file at `/llms.txt` with a 200 status and a plain-text or Markdown content type. Open it in a browser and in `curl -I` to confirm there is no redirect loop or login wall.

### 5. Keep it in sync

Regenerate it when you publish or retire important pages. A stale file that links to deleted pages is worse than none. If your site runs on Next.js, a route handler that builds the file from your content list keeps it current without manual edits.

## What Matters More Than llms.txt for AI Search?

If your goal is to be cited in AI answers, these factors have more evidence behind them:

- **Pages that are indexed and fast.** If a page cannot be crawled, no file can rescue it. Run the free [SEO checker](/seo-checker/) to catch the basics.
- **Direct answers near the top of the page.** AI systems quote passages that answer the question in the first sentences. Our guide to [getting cited in Google AI Overviews](/blog/get-cited-in-google-ai-overviews/) shows the pattern.
- **Mentions on third-party sites.** In our [lawyer recommendation experiment](/blog/chatgpt-recommendation-experiment/), shortlists were built from directories and other outside sources, not from the firms' own websites.
- **A clear definition of the topic.** If you are new to the subject, start with [what generative engine optimization is](/blog/what-is-generative-engine-optimization/) and the wider [AI search visibility guide](/blog/ai-search-visibility-guide/).

To see whether AI tools mention your brand at all today, follow the prompt test in [how to check if ChatGPT recommends your brand](/blog/check-if-chatgpt-recommends-your-brand/). Teams that want this tracked across ChatGPT, Claude, Gemini and Perplexity can look at [Rank on AI](/rank-on-ai/).

## FAQ

### Is llms.txt an official standard?

No. It is a community proposal with a public specification, not a standard from a body such as the IETF or W3C. Different tools may handle it differently, or ignore it.

### Will llms.txt improve my rankings or AI citations?

There is no public evidence that it does. Google has said AI systems do not use it, and no major AI search product has documented using it for citations. Treat any claim of a ranking boost as unproven.

### Where do I put the llms.txt file?

At the root of your domain, so the address is `https://yourdomain.com/llms.txt`. The proposal also allows the same file in a subpath for documentation that lives under a folder.

### Is llms.txt the same as robots.txt?

No. robots.txt gives crawlers rules about what they may fetch. llms.txt is a Markdown reading list for AI tools and cannot block or allow anything.

### Can llms.txt hurt my SEO?

It is unlikely to, since it is a separate text file. Problems come from listing outdated or low-quality pages, which sends tools to content you would rather they did not read, or from spending time on it instead of fixes that matter.

Want to know whether your site is ready for AI search before you worry about files like this? Run the free [SEO checker](/seo-checker/) or ask for a free audit.
