---
title: How to Fix Duplicate Product URLs on Shopify
excerpt: "Why Shopify serves one product at several URLs, what its canonical tag already handles, and a step-by-step fix for theme links, variants, tags and filters."
date: 2026-11-25T11:00:00.000Z
category: Technical SEO
keyword: shopify duplicate product urls
author:
  name: RiseRidge Team
coverImage: /uploads/shopifyduplicateproducturlshero.svg
---

Shopify creates duplicate product URLs because every product can be reached at `/products/<handle>` and again at `/collections/<collection>/products/<handle>` for each collection it belongs to. Shopify themes add a canonical tag that points all of those versions to the `/products/` URL, so the duplicates are usually not a crisis. To fix them properly, make your theme link to the `/products/` URL everywhere, keep filter and tag pages out of the index, and check in Search Console that Google accepts your canonicals.

This guide is for Shopify store owners and marketers who have seen "Duplicate" or "Alternate page" warnings in Search Console, or who found several URLs for one product in a crawl, and want to know what to fix and what to leave alone.

## Why Does Shopify Create Duplicate Product URLs?

Shopify builds URLs from two things: the product handle and the context a shopper came from. A running shoe with the handle `trail-runner` in two collections can be reached at three addresses:

- `/products/trail-runner`
- `/collections/mens/products/trail-runner`
- `/collections/sale/products/trail-runner`

All three show the same page. Shopify does this so a theme can keep the collection in the breadcrumb and the "back to collection" link. The URLs are created by the theme's product card code, usually a Liquid filter that makes a product link "within" the current collection.

Other patterns add more copies of the same content:

- **Variant URLs** such as `/products/trail-runner?variant=4412...`, created when a shopper picks a size or color.
- **Collection tag pages** such as `/collections/mens/blue`, which filter a collection by a product tag.
- **Filter and sort parameters** such as `?filter.v.price.gte=50` or `?sort_by=price-ascending` on collection pages.
- **Paginated collections** such as `/collections/mens?page=2`.
- **Copied products.** When you duplicate a product in the admin or import the same item twice, you get a second product with a near-identical handle (often ending in `-1` or `-copy`) and the same description.
- **International subfolders** such as `/en-ca/products/trail-runner` when you sell in several markets.

Some of these are true duplicates. Others are legitimate pages that only look similar. The fix is different for each, so it helps to sort them first.

## Does Shopify's Canonical Tag Already Fix Duplicate Product URLs?

Partly. A canonical tag is a line in the page's `<head>` (`<link rel="canonical" href="...">`) that tells search engines which URL is the main version of a page. Shopify themes output it from the `canonical_url` object, and on a collection-scoped product URL it points to the plain `/products/` URL. That is the behavior you want, and [Ahrefs' guide to canonical tags](https://ahrefs.com/blog/canonical-tags/) notes that Shopify handles canonicalization fairly well out of the box.

There are three reasons the canonical alone is often not enough:

1. **A canonical is a hint, not a command.** Google weighs it together with other signals. The same Ahrefs guide lists internal and external links and the sitemap as canonicalization signals too. Google's own documentation on [consolidating duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) describes the same set of methods.
2. **Your internal links may contradict it.** If every collection grid links to `/collections/mens/products/trail-runner` while the canonical says `/products/trail-runner`, the strongest internal signal points at the URL you told Google not to use. Google can then pick the collection URL as canonical anyway, and the `/products/` URL ends up with almost no internal links.
3. **Custom or older themes break it.** A developer edit, a page builder or an SEO app can remove the tag, print it twice or point it to the wrong URL. Ahrefs warns that Google ignores all declared canonicals if a page declares more than one.

So the canonical is the safety net. The real fix is making every other signal agree with it.

## Which Shopify Duplicate URLs Need Fixing?

Use this table to decide what to do with each pattern you find.

| URL pattern | Example | Is it a problem? | Fix |
|---|---|---|---|
| Collection-scoped product | `/collections/mens/products/trail-runner` | Yes, when the theme links to it | Change theme links to `/products/`; keep the canonical |
| Variant parameter | `/products/trail-runner?variant=...` | Rarely | Confirm the canonical points to the clean product URL |
| Collection tag page | `/collections/mens/blue` | Often thin or near-duplicate | Add `noindex, follow`, or turn valuable tags into real collections |
| Filter and sort parameters | `/collections/mens?sort_by=price-ascending` | Yes, at scale | Keep out of internal links; check robots.txt coverage |
| Paginated collection | `/collections/mens?page=2` | No | Self-referencing canonical; do not point pages 2+ to page 1 |
| Copied product | `/products/trail-runner-1` | Yes | Merge into one product and 301-redirect the copy |
| Market subfolder | `/en-ca/products/trail-runner` | No, if hreflang is in place | Check that the alternate-language tags are present |

The first and the copied-product rows are where most stores lose ranking signals. Start there.

## How Do I Fix Duplicate Product URLs on Shopify, Step by Step?

Work in a duplicate of your live theme so you can preview every change before publishing.

### Step 1: Find the duplicates you actually have

Crawl the store with Screaming Frog, Sitebulb or a similar crawler and export every URL that contains `/products/`. Sort by product handle. Any handle that appears under more than one path is a duplicate group.

Then check Search Console. In **Indexing > Pages**, look at three reasons:

- **Alternate page with proper canonical tag.** Google found the duplicate and accepted your canonical. This is normal and needs no action.
- **Duplicate without user-selected canonical.** Google found duplicates and no canonical told it which one to keep. Check that the canonical tag exists on these pages.
- **Duplicate, Google chose different canonical than user.** Google ignored your canonical. This is the one to fix, because it means your signals disagree.

Open a few affected URLs in the URL Inspection tool and compare the user-declared canonical with the Google-selected one.

### Step 2: Point theme product links to the /products/ URL

Open the theme code editor (**Online Store > Themes > ⋯ > Edit code**) and search the `snippets` and `sections` folders for `within`. In most themes the product card contains something like:

```liquid
<a href="{{ product.url | within: collection }}">
```

Change it to:

```liquid
<a href="{{ product.url }}">
```

The file name depends on the theme. Common ones are `card-product.liquid`, `product-card.liquid`, `product-grid-item.liquid` and `product-thumbnail.liquid`. Some themes use a variable such as `product_link` set earlier in the file, so follow it back to where the URL is built. Shopify's [Liquid reference for the `within` filter](https://shopify.dev/docs/api/liquid/filters/within) explains what it does.

Preview a collection page, hover over a few products and confirm the links now go straight to `/products/<handle>`. The breadcrumb on the product page may lose the collection name. Most stores accept that trade-off. If you want to keep it, use a theme setting or JavaScript that reads the referring collection, rather than putting the collection in the URL.

### Step 3: Check the canonical tag on every template

View the page source of a product page, a collection-scoped product URL, a variant URL and a collection page. Each should contain exactly one canonical tag:

```liquid
<link rel="canonical" href="{{ canonical_url }}">
```

This line normally lives in `layout/theme.liquid`. Search the code for a second `rel="canonical"`, which apps and page builders sometimes inject. Remove the extra one so only the theme's version remains.

### Step 4: Handle tag and filter pages

Collection tag pages (`/collections/mens/blue`) and filter combinations rarely deserve to rank on their own. You have two options:

- **Keep them out of the index.** Add a conditional robots tag in the `<head>` of `theme.liquid`:

  ```liquid
  {% if current_tags %}
    <meta name="robots" content="noindex, follow">
  {% endif %}
  ```

  Google must be able to crawl a page to see a `noindex` tag, so do not also block the same URLs in robots.txt.
- **Promote the valuable ones.** If "men's blue running shoes" gets real search demand, create a proper collection for it with its own title, description and intro copy instead of relying on a tag URL.

For sort and filter parameters, open `yourstore.com/robots.txt`. Shopify's default file already disallows several of these patterns, including sorted collection URLs. Make sure your theme's filter links do not create crawlable plain links for every combination, and do not link to sorted or filtered URLs from menus, blog posts or footers.

### Step 5: Merge copied products and redirect the extras

For each duplicate product (same item, second handle), choose the one to keep. Usually that is the one with the most reviews, sales history and backlinks. Move any unique content to it, then delete or archive the copy and add a 301 redirect from the old URL to the kept one. In the Shopify admin, search for "URL redirects" to find the redirect manager. When you change a handle on a product's SEO settings, tick the box that creates a redirect from the old URL.

### Step 6: Keep the sitemap and internal links clean

Shopify's automatic `sitemap.xml` lists products by their `/products/` URL, which is correct. Ahrefs puts it simply: only canonical URLs should be listed in your sitemap. Problems come from elsewhere:

- Menus, mega-menus and blog posts that link to collection-scoped product URLs. Update them to `/products/` links.
- Apps that generate their own landing pages or feeds with alternate URLs.
- Old URLs in email templates and ads, which are fine for tracking but should not be copied into site navigation.

### Step 7: Request validation and monitor

After publishing the theme, go back to the Pages report in Search Console, open "Duplicate, Google chose different canonical than user" and click **Validate fix**. Re-crawl the store a week later and confirm that collection pages now link to `/products/` URLs. Expect Google to take several weeks to re-process a large catalog.

## Shopify Duplicate Product URL Checklist

1. Crawl the store and group product URLs by handle.
2. Read the three duplicate reasons in Search Console's Pages report.
3. Remove `| within: collection` from product card links in a duplicate theme.
4. Preview collection grids and confirm links go to `/products/<handle>`.
5. Confirm exactly one canonical tag on product, variant and collection templates.
6. Add `noindex, follow` to tag pages, or turn high-demand tags into real collections.
7. Check that filter and sort URLs are not linked from navigation or content.
8. Merge copied products and 301-redirect the duplicates.
9. Update menus and blog links to the `/products/` URLs.
10. Validate the fix in Search Console and re-crawl after a week.

Duplicate URLs are one item in a full store review. Our [Shopify SEO checklist](/blog/shopify-seo-checklist/) covers the rest of the technical setup, collection pages and content, and the [technical SEO audit checklist](/blog/technical-seo-audit-checklist/) explains how to audit canonicals and indexation on any platform.

## Do Duplicate Product URLs Affect Rich Results and AI Search?

Yes, indirectly. When Google is unsure which URL is the main product page, it can split signals between versions or show a version with weaker data. Product structured data, reviews and price information work best when they all sit on one clear URL. If you are cleaning up the product template anyway, check your [Shopify product schema](/blog/shopify-product-schema/) at the same time, since a theme edit can duplicate the markup as easily as it duplicates a link.

AI assistants such as ChatGPT and Perplexity also cite and link to specific pages. A single, well-linked product URL gives them one clear page to cite. Our [Rank on AI](/rank-on-ai/) service tracks how often AI assistants mention a brand and which pages they point to.

Two Shopify examples from our own work show what clean product data can lead to. For a DTC travel-bag brand running two Shopify stores, product rich-snippet impressions went from 866 to 34,257 after product data, structured markup and content were improved together. For a DTC accessories brand, the first 40 days of work included Product structured data on 175 pages. In both cases the result came from a program of changes, not from URL cleanup alone. Both are on our [case studies page](/case-studies/).

## FAQ

### Are duplicate product URLs on Shopify bad for SEO?

They are not a penalty, and Shopify's canonical tag prevents the worst of it. The real cost is diluted signals: internal links pointing at collection-scoped URLs, and Google sometimes choosing the wrong version as canonical. Fixing theme links removes most of that cost.

### Should I block /collections/*/products/ URLs in robots.txt?

No. If Google cannot crawl those URLs, it cannot see the canonical tag on them, and any links pointing to them lose their value. Let them be crawled, keep the canonical, and stop linking to them from your theme.

### Will removing the collection from product URLs break my breadcrumbs?

It can. Themes use the collection in the URL to show "Home > Men's > Trail Runner". Without it, the breadcrumb usually falls back to "Home > Trail Runner". You can rebuild the collection breadcrumb from the product's main collection in the theme code if you need it.

### What does "Alternate page with proper canonical tag" mean in Search Console?

It means Google found a duplicate URL, read its canonical tag and indexed the main version instead. On a Shopify store, these are usually collection-scoped and variant URLs. That is the correct outcome, so no action is needed.

### How long does it take Google to fix duplicate URLs after the change?

It depends on catalog size and how often Google crawls the store. Small stores often see the Pages report change within a few weeks. Larger catalogs can take longer. Submitting the sitemap and using **Validate fix** in Search Console helps Google re-check the affected URLs sooner.

Not sure which duplicates your store has? Run it through our free [SEO checker](/seo-checker/), or see how we handle [Shopify SEO](/shopify-seo/) for growing stores.
