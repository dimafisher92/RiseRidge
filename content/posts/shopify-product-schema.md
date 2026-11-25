---
title: "Shopify Product Schema: How to Get Rich Results"
excerpt: "How Shopify product schema works, what your theme already outputs, the fields Google needs for rich results, and how to find and fix the errors that block them."
date: 2026-11-20T11:00:00.000Z
category: Technical SEO
keyword: shopify product schema
author:
  name: RiseRidge Team
coverImage: /uploads/shopifyproductschemahero.svg
---

Shopify product schema is structured data, usually a JSON-LD block in the page code, that tells Google a page is a product and spells out its name, image, price, currency, availability and identifiers. Most Shopify themes already output a basic version, but it is often incomplete, duplicated by apps or out of sync with the price shoppers see. Fix those three problems and your product pages become eligible for rich results: the price, stock status and shipping details that appear under a listing in Google.

This guide is for Shopify store owners and marketers who want to know what their store outputs today, what Google expects, and how to close the gap without breaking the theme.

## What Is Product Schema on Shopify?

Schema markup is a shared vocabulary, maintained at Schema.org, for describing things on a web page in a way machines can read. A `Product` is one of those things. On a Shopify product page, product schema usually looks like a `<script type="application/ld+json">` block containing a `Product` object with a nested `Offer` (price, currency, availability) for each variant.

Google accepts three formats (JSON-LD, Microdata and RDFa) but recommends JSON-LD because it is less prone to errors, as [Ahrefs' schema markup guide](https://ahrefs.com/blog/schema-markup/) explains. JSON-LD sits in its own script tag, so you can change it without touching the visible HTML.

Two terms get mixed up a lot:

- **Structured data** is the code on the page.
- **Rich results** are the enhanced listings Google may show because of that code. Valid markup makes a page eligible. It does not guarantee the enhanced listing.

## Why Does Product Schema Matter for a Shopify Store?

There are three practical reasons.

**1. It changes how your listing looks.** Product rich results can show price, availability, shipping information and review ratings directly in Google, as [Ahrefs' rich snippets guide](https://ahrefs.com/blog/rich-snippets/) shows. A listing that says "In stock" with a price answers two questions before the click.

**2. It feeds Google's shopping surfaces.** Google uses product markup for both classic product snippets and merchant listings, the shopping-style results for pages where people can buy. Google's [Product structured data documentation](https://developers.google.com/search/docs/appearance/structured-data/product) describes both.

**3. AI shopping assistants read the same data.** Ahrefs notes that as AI shopping agents spread, complete and accurate product schema is how products become machine-readable and recommendable. Price, availability and return policy are the details those systems compare. Our guide to [getting a Shopify store recommended by ChatGPT](/blog/shopify-store-chatgpt-recommendations/) covers that side in depth.

## What Does Shopify Output by Default?

Shopify itself does not add product schema to every store. Your theme does. Most current themes, including Shopify's free Dawn theme, output a `Product` JSON-LD block from the product template. Older or heavily customized themes may still use Microdata, or nothing at all.

Before changing anything, find out what you have:

1. Open any product page and view the source (Ctrl+U or Cmd+Option+U).
2. Search for `application/ld+json` and `"@type": "Product"`.
3. Count how many `Product` blocks appear. More than one is a red flag.
4. Run the URL through Google's [Rich Results Test](https://search.google.com/test/rich-results). It shows which rich result types the page is eligible for and lists errors and warnings.
5. Repeat for a product with variants and a product that is out of stock. These are where most problems hide.

If you have Search Console set up, the **Shopping** and **Enhancements** reports show product markup issues across the whole store, not just one URL. The Rich Results Test checks a page at a time, and Search Console tells you how many pages share each problem.

## Which Fields Does Google Need?

Google treats product markup as two experiences, and the fields differ slightly. The table below is a working summary. The authoritative list lives in Google's [Product documentation](https://developers.google.com/search/docs/appearance/structured-data/product), and you should check it when you build.

| Field | What it holds | Where Shopify gets it | Notes |
|---|---|---|---|
| `name` | Product title | Product title | Required for both experiences |
| `image` | One or more product image URLs | Product media | Required for merchant listings; use crawlable, full-size URLs |
| `offers.price` | Current selling price | Variant price | Must match the price on the page |
| `offers.priceCurrency` | Three-letter currency code, e.g. USD | Store currency | Watch multi-currency stores |
| `offers.availability` | In stock, out of stock, preorder | Variant inventory | Must update when stock changes |
| `description` | Product description | Product description | Strip HTML; keep it the same text shoppers see |
| `sku` / `gtin` / `mpn` | Identifiers | Variant SKU and barcode | GTINs help Google match the product |
| `brand` | Brand name | Vendor field | Often left as the store name by mistake |
| `shippingDetails` | Shipping cost and delivery time | Usually missing | Recommended for merchant listings |
| `hasMerchantReturnPolicy` | Return window and method | Usually missing | Recommended for merchant listings |
| `aggregateRating` / `review` | Ratings from real customers | Review app | Only for reviews visible on the page |

For shipping and returns, there is a newer option: Google allows merchants to state these at the organization level in structured data, even without a Merchant Center account, according to [Ahrefs](https://ahrefs.com/blog/schema-markup/). That means one policy block can cover the whole store instead of repeating it on every product.

## What Does a Good Shopify Product JSON-LD Look Like?

Here is a trimmed example for a single-variant product. Values are placeholders; in a theme they come from Liquid objects.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Canvas Weekender Bag",
  "image": [
    "https://example.com/cdn/shop/files/weekender-front.jpg",
    "https://example.com/cdn/shop/files/weekender-side.jpg"
  ],
  "description": "A 40-liter canvas weekender with a padded laptop sleeve.",
  "sku": "WKD-CANVAS-OLV",
  "gtin13": "0123456789012",
  "brand": { "@type": "Brand", "name": "Example Goods" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/canvas-weekender-bag",
    "price": "129.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

For products with variants, there are two common patterns. Many themes list one `Offer` per variant inside an `offers` array. Schema.org also supports `ProductGroup` with `hasVariant`, which describes the variants (size, color) as a family. Either can work. What matters is that each price and availability value matches what a shopper sees when that variant is selected.

## How Do I Add or Fix Product Schema on Shopify?

Work through these steps in order. Each one depends on the one before.

### Step 1: Remove duplicate markup

The most common Shopify problem is two or three `Product` blocks on one page: one from the theme, one from an SEO app, one from a reviews app. Google then has to guess which to trust, and conflicting prices or ratings can make the page ineligible.

Pick one source of truth. If your theme's markup is solid, turn off product schema in the app settings. If an app does it better, remove the theme block (in the product section file) instead. Never keep both.

### Step 2: Make the price and availability match the page

Check that `price` equals the price displayed for the default variant, and that `availability` flips to `OutOfStock` when inventory hits zero. Pay attention to:

- **Sale prices.** The markup should carry the price the shopper pays, not the compare-at price.
- **Hard-coded values.** Some customized themes or old apps write a fixed `priceValidUntil` date or a static price. Once that date passes or the price changes, the markup goes stale.
- **Multi-currency.** If you sell in several currencies, the `priceCurrency` must match the currency shown on that URL.

### Step 3: Fill the identifier and brand gaps

Add barcodes (GTIN, UPC or EAN) in the variant barcode field if your products have them, and make sure the theme outputs them. Set the Vendor field to the actual brand, because many themes map it straight into `brand`.

### Step 4: Add shipping and return details

Add `shippingDetails` and `hasMerchantReturnPolicy` to product markup, or use the organization-level option described above. Use the policies you actually publish. If your return policy page says 30 days, the markup says 30 days.

### Step 5: Handle reviews carefully

If you use a reviews app, let it add `aggregateRating` and `review` only for reviews that are shown on the product page and collected from real customers. Do not hard-code ratings, and do not mark up reviews that live somewhere else. Misleading markup can lead to a manual action, which removes rich results across the site.

### Step 6: Validate, then monitor

Test five or six representative URLs in the Rich Results Test, including a variant product and an out-of-stock product. You can also paste code into the [Schema.org validator](https://validator.schema.org/) before it goes live, the order [Backlinko's schema guide](https://backlinko.com/schema-markup-guide) recommends. After publishing, watch Search Console's product reports for new errors over the following weeks.

## Product Schema Checklist for Shopify

Use this as a quick audit for any store:

1. Exactly one `Product` block per product page.
2. JSON-LD, not leftover Microdata from an older theme.
3. `name`, `image`, `price`, `priceCurrency` and `availability` present on every product.
4. Price matches the visible price, including sales.
5. Availability changes when stock runs out.
6. No hard-coded or expired `priceValidUntil` dates.
7. Brand reflects the real brand, not the store name.
8. GTIN or another identifier present where the product has one.
9. Shipping and return details in product or organization markup.
10. Rating markup only from real, visible reviews.
11. Rich Results Test passes for a simple product, a variant product and an out-of-stock product.
12. Search Console product reports reviewed monthly.

Schema is one item on a longer list. Markup works best when each product has one clear URL, so check for [duplicate product URLs on Shopify](/blog/shopify-duplicate-product-urls/) as well. Our [Shopify SEO checklist](/blog/shopify-seo-checklist/) puts it in context with crawling, collections, speed and content, and the [technical SEO audit checklist](/blog/technical-seo-audit-checklist/) covers how to audit structured data alongside the rest of the site.

## What Results Can Product Schema Drive?

Two examples from our own work, both Shopify brands and both anonymized.

For a DTC travel-bag brand running two Shopify stores, one in English and one in Spanish, product rich-snippet impressions went from 866 to 34,257 after product data, structured markup and content were improved together. Schema was one part of that program, not the only change, so the number reflects the combined work.

For a DTC accessories brand, the first 40 days included Product structured data on 175 pages, removal of outdated price markup and site-wide Organization markup. Weekly ChatGPT visits went from 16 to 807 the week after the first structured-data round went live. That is a correlation with the work, not proof that schema caused it. Both case studies are on our [case studies page](/case-studies/).

The honest takeaway: product schema rarely moves rankings on its own. It makes your listings richer, keeps your data consistent for Google and AI assistants, and removes errors that quietly cost you eligibility. That is why we fix it early in every e-commerce engagement.

## FAQ

### Does Shopify add product schema automatically?

Shopify's platform does not, but most current themes do. They output a basic `Product` JSON-LD block from the product template. Check your own pages, because customized themes, older themes and apps often change or duplicate it.

### Do I need an app for Shopify product schema?

Not necessarily. If your theme outputs clean JSON-LD with price, availability, images and identifiers, you can extend it by editing the theme. Apps help when you lack developer access or want shipping, return and review markup managed for you. Use one source, not both.

### Why is Google not showing my product rich results?

Valid markup only makes a page eligible. Google may skip rich results if the markup conflicts with the visible page, if several blocks disagree, if required fields are missing, or if it simply chooses a plain result for that query. Start with the Rich Results Test and Search Console's product reports.

### Can product schema help my products appear in ChatGPT or AI Overviews?

It helps those systems read your catalog accurately: price, stock, brand and policies. It is not a ranking switch. AI answers also weigh reviews, mentions on other sites and clear product content. Our [Rank on AI](/rank-on-ai/) service tracks how often AI assistants mention your brand.

### Should every variant have its own offer in the markup?

Each variant with a different price or stock status should be represented, either as one `Offer` per variant or through `ProductGroup` with `hasVariant`. The key rule is consistency: whatever a shopper sees for a variant should match its markup.

Want to know whether your product pages are eligible for rich results? Run your store through our free [SEO checker](/seo-checker/) or book a free audit, and we will show you what your markup is missing.
