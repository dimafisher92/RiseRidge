---
title: "Shopify Core Web Vitals: How to Fix LCP, INP and CLS"
excerpt: "How to measure and fix Core Web Vitals on Shopify: what LCP, INP and CLS mean, why apps and themes fail them, and the fixes to make in order of impact."
date: 2026-11-23T11:00:00.000Z
category: Technical SEO
keyword: shopify core web vitals
author:
  name: RiseRidge Team
coverImage: /uploads/shopifycorewebvitalshero.svg
---

Shopify Core Web Vitals are Google's three page experience metrics applied to your store: Largest Contentful Paint (how fast the main content appears), Interaction to Next Paint (how fast the page reacts to taps and clicks) and Cumulative Layout Shift (how much the layout jumps while loading). On Shopify, the platform's hosting and CDN are rarely the problem. Failing scores usually come from three places you control: an oversized hero image, app scripts that load on every page, and theme sections that shift content as they render.

This guide is for Shopify store owners and marketers. It explains how the metrics are measured, how to find which pages fail, and the specific fixes for each metric, in the order that usually pays off fastest.

## What Are Core Web Vitals?

Core Web Vitals are three metrics Google uses to judge real-world page experience. Each one has a "good" threshold, and a page passes only when at least 75% of visits meet it. The current thresholds, as summarized in [Ahrefs' Core Web Vitals guide](https://ahrefs.com/blog/core-web-vitals/), are:

| Metric | What it measures | Good | Needs improvement | Poor |
|---|---|---|---|---|
| Largest Contentful Paint (LCP) | Time until the largest visible element renders | 2.5 s or less | 2.5 s to 4 s | Over 4 s |
| Interaction to Next Paint (INP) | Delay between a tap, click or key press and the next screen update | 200 ms or less | 200 ms to 500 ms | Over 500 ms |
| Cumulative Layout Shift (CLS) | How much visible content moves unexpectedly | 0.1 or less | 0.1 to 0.25 | Over 0.25 |

INP replaced First Input Delay as the responsiveness metric on March 12, 2024. The difference matters for stores: First Input Delay only looked at the first interaction, while INP covers every click, tap and key press during the visit. A product page that feels fine on first load but stalls when a shopper opens the cart drawer or changes a variant now fails.

A few more definitions you will see in reports:

- **Field data** is collected from real Chrome users through the Chrome User Experience Report (CrUX). This is what Google uses.
- **Lab data** comes from a simulated test, such as Lighthouse. It is repeatable and good for debugging, but it is not what Google scores.
- **The 28-day window.** CrUX reports a rolling 28-day period, so a fix you ship today takes up to four weeks to show fully in your field data.

## Do Core Web Vitals Affect Shopify Rankings?

Yes, but less than most speed-app marketing suggests. Google has used page experience signals, including Core Web Vitals, in mobile rankings since 2021 and desktop rankings since 2022. Google representatives have described them as small factors or tiebreakers, and [Ahrefs](https://ahrefs.com/blog/core-web-vitals/) does not expect large ranking gains from optimizing them alone.

The stronger reason to fix them is revenue. A product page that takes too long to show the product, or a cart button that does not respond, loses shoppers before rankings ever come into it. Treat Core Web Vitals as a conversion problem that also protects your rankings.

One nuance for stores: Google uses page-level data when a URL has enough traffic. When it does not, it may fall back to data for a group of similar pages or the whole origin. A slow template therefore drags down every product page built on it, including low-traffic ones.

## How Do I Check Core Web Vitals on My Shopify Store?

Use three tools, in this order.

1. **Google Search Console, Core Web Vitals report.** It groups your URLs by status (Poor, Needs improvement, Good) separately for mobile and desktop, and it groups similar URLs together. On Shopify that usually means one group for product pages, one for collections, and the home page. Start with whichever group is Poor on mobile.
2. **Shopify's web performance report.** The Shopify admin includes a web performance view built from real visitor data for Online Store themes. Use it to see when a score changed and line that date up with an app install or theme edit.
3. **PageSpeed Insights.** Test one representative URL from each failing group: a product page, a collection page and the home page. The top of the report shows field data when Google has enough of it. The diagnostics below show lab data and name the specific element, script or image holding the page back. For LCP, it identifies the exact LCP element, as [Ahrefs' LCP guide](https://ahrefs.com/blog/largest-contentful-paint-lcp/) explains.

Always test on mobile first. Most Shopify traffic is mobile, and mobile scores are almost always the ones that fail.

## Why Do Shopify Stores Fail Core Web Vitals?

Shopify serves pages from a global CDN and handles image resizing and caching. The common failures come from what is added on top:

| Cause | Metric it usually hurts | How to spot it |
|---|---|---|
| Hero image or slider that is too large, lazy-loaded or set as a CSS background | LCP | PageSpeed Insights names the image as the LCP element |
| Apps that add JavaScript to every page (reviews, pop-ups, chat, upsells, tracking) | INP, LCP | Many third-party scripts in the network waterfall; long tasks in the performance trace |
| Theme code for cart drawers, variant pickers and filters that runs heavy work on click | INP | Slow response when opening the cart or changing a variant |
| App blocks, announcement bars and banners that load after the page | CLS | Content jumps down a few hundred milliseconds after load |
| Images and embeds without width and height | CLS | Layout shifts flagged on product galleries and blog images |
| Web fonts swapping late | CLS, LCP | Headline text reflows when the custom font arrives |
| Leftover code from uninstalled apps | All three | Script tags in `theme.liquid` pointing to apps you no longer use |

## How Do I Fix LCP on Shopify?

LCP is usually the hero image on the home page, the first product image on a product page, or a large banner on a collection page. Fix it in this order.

### Step 1: Make the LCP image load first

Never lazy-load the image that appears above the fold. Lazy loading tells the browser to wait, which is the opposite of what you want for the largest element on screen. [Ahrefs' LCP guide](https://ahrefs.com/blog/largest-contentful-paint-lcp/) is blunt about it: do not lazy-load images above the fold. Instead, add `fetchpriority="high"` to that image, or preload it with `<link rel="preload" as="image">`. Both tell the browser to fetch it early, and they can be used together.

In a Shopify theme, the first image in the hero or main product media section is the one to change. Shopify's `image_tag` Liquid filter accepts attributes such as `loading` and `fetchpriority`, so the fix is often one parameter in the section file. Keep `loading="lazy"` on everything further down the page.

### Step 2: Serve the right size

Many stores upload a 4,000-pixel product photo and let the browser shrink it. Use responsive images (`srcset` and `sizes`) so a phone downloads a phone-sized file. Shopify's image filters can generate several widths from one upload, and current themes usually do this already. Check the custom sections your developer or a page builder added, because they are where fixed full-size URLs tend to hide.

### Step 3: Replace sliders with one static image

Hero carousels load several large images, often with a script that must run before the first slide appears. One static, compressed hero image is almost always faster, and the first slide of a slider rarely gets more attention than a well-chosen single image.

### Step 4: Remove render-blocking work

Move non-essential scripts to load with `defer` or `async`, and cut CSS that is not used above the fold. Custom fonts should use `font-display: swap` or `optional`, or you can switch body text to a system font. Every app that injects a blocking script into the `<head>` delays the first paint.

## How Do I Fix INP on Shopify?

INP failures on Shopify are mostly JavaScript problems: too much code running on the main thread, so the browser cannot respond to a tap right away.

### Step 1: Audit your apps

List every installed app and ask two questions: does it add code to the storefront, and is that code needed on every page? A reviews widget is needed on product pages, not on the blog. A pop-up app may load its full script on every page view even when no pop-up shows. Remove apps you do not use, and for the ones you keep, check their settings for page targeting or a "load on interaction" option.

Uninstalling an app does not always remove its code. Search `theme.liquid` and the snippets folder for script tags and snippet includes that belong to apps you have already removed.

### Step 2: Prefer app embeds and app blocks

Apps built on Shopify's theme app extensions add their code through app embeds and app blocks you can switch off in the theme editor, without editing theme files. Older apps often inject code directly into theme files instead. When you choose between two apps that do the same job, pick the one that uses app blocks and lets you control where it loads.

### Step 3: Fix the theme's interaction code

Test the interactions shoppers use most: changing a variant, adding to cart, opening the cart drawer, applying a collection filter. If any of them hesitates on a mid-range phone, the handler is doing too much at once. A developer can break long tasks into smaller pieces, update the visible state first and do the slower work (analytics events, recommendations) afterwards.

### Step 4: Delay third-party tags

Chat widgets, heatmap tools, ad pixels and tag managers do not need to run before the shopper can interact. Load them after the page is interactive or on first user interaction. Use Shopify's customer events for tracking pixels where you can, because they run separately from the main page code.

## How Do I Fix CLS on Shopify?

CLS measures content moving while the shopper is trying to read or tap. On Shopify, the usual causes are late-loading app content and images without dimensions.

1. **Reserve space for app blocks.** Reviews stars, "buy now, pay later" messages and trust badges often appear a moment after the page loads and push the price and add-to-cart button down. Give their container a minimum height in CSS so the space is held before the content arrives.
2. **Set width and height on every image and video.** Shopify's image filters can output these attributes. Check custom sections and blog content, where images are often added without them.
3. **Avoid inserting banners above existing content.** Announcement bars, cookie notices and promo banners should either be in the initial HTML or appear as an overlay that does not move the page.
4. **Load fonts predictably.** Preload the one or two font files used above the fold, and choose a fallback font with similar proportions so the swap does not reflow text.

## Shopify Core Web Vitals Checklist

Work through this list on mobile, for your home page, one collection and one product template:

1. Search Console Core Web Vitals report reviewed; failing URL groups noted.
2. LCP element identified for each template in PageSpeed Insights.
3. LCP image not lazy-loaded; `fetchpriority="high"` or preload set.
4. Responsive image sizes served; no full-size originals above the fold.
5. Hero slider replaced with one static image, or its first slide optimized.
6. Every app reviewed; unused apps removed and leftover code cleaned from the theme.
7. Remaining app scripts limited to the pages that need them.
8. Third-party tags delayed until after the page is interactive.
9. Variant change, add-to-cart and cart drawer tested for lag on a mid-range phone.
10. Width and height set on all images and embeds.
11. Space reserved for app blocks, badges and banners.
12. Fonts preloaded with a close fallback.
13. Fix dates logged, and field data re-checked after 28 days.

Speed is one part of a healthy store. Our [Shopify SEO checklist](/blog/shopify-seo-checklist/) puts it alongside crawling, collections and content, and the [technical SEO audit checklist](/blog/technical-seo-audit-checklist/) shows how to audit Core Web Vitals together with indexation and structured data. If you are cleaning up the product template anyway, check your [Shopify product schema](/blog/shopify-product-schema/) at the same time, since apps that slow a page down often duplicate its markup too.

## How Long Until Fixes Show Up?

Lab scores in PageSpeed Insights change as soon as the fix is live. Field data, which is what Search Console and Google use, follows a 28-day rolling window, so expect the report to improve gradually over about four weeks. When you have fixed a URL group, use the "Validate fix" button in Search Console's Core Web Vitals report to start Google's tracking of that group.

Log the date of each change. If a score drops later, a dated list of app installs and theme edits is usually the fastest way to find the cause. Our [case studies](/case-studies/) show how technical fixes fit into wider Shopify SEO programs.

## FAQ

### What are good Core Web Vitals scores for a Shopify store?

The same as for any site: LCP of 2.5 seconds or less, INP of 200 milliseconds or less, and CLS of 0.1 or less, measured at the 75th percentile of real visits. Mobile and desktop are assessed separately, and mobile is usually the harder one to pass.

### Do Shopify speed apps fix Core Web Vitals?

Some help with specific tasks such as image compression or delaying scripts, but an app that promises a higher score is still another script on your store. Removing unused apps, fixing the hero image and cleaning leftover code usually does more. If you try a speed app, compare field data before and after, not just the lab score.

### Why is my PageSpeed score different from Search Console?

The PageSpeed Insights performance score comes from a single lab test on a simulated device. Search Console uses field data from real Chrome users over 28 days. A store can score poorly in the lab and still pass in the field, or the other way round. Google uses the field data.

### Does changing my Shopify theme improve Core Web Vitals?

It can, if your current theme is old or heavily customized. But a new theme with the same apps installed will often fail for the same reasons. Audit apps and images first. Consider a theme change when the theme's own code is the bottleneck, for example on cart and variant interactions.

### How often should I check Core Web Vitals?

Check Search Console monthly, and after every new app install or theme change. Re-run PageSpeed Insights on your main templates once a quarter.

Want to see where your store loses speed? Run it through our free [SEO checker](/seo-checker/) or book a free audit, and we will show you which pages fail and what to fix first.
