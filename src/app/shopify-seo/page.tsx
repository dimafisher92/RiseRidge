import type { Metadata } from 'next';
import { ServicePage, type ServicePageContent } from '@/components/ServicePage';

export const metadata: Metadata = {
  title: 'Shopify SEO Agency for E-commerce Brands',
  description:
    'Shopify SEO agency for DTC and e-commerce brands: technical fixes, collection and product pages, product schema and AI shopping visibility. Month-to-month.',
  alternates: { canonical: '/shopify-seo' },
  openGraph: {
    title: 'Shopify SEO Agency | RiseRidge',
    description: 'Shopify SEO measured in organic revenue, not just rankings.',
  },
};

const CONTENT: ServicePageContent = {
  path: '/shopify-seo',
  breadcrumb: 'Shopify SEO',
  eyebrow: 'Shopify SEO agency',
  title: 'Shopify SEO that grows',
  titleAccent: 'organic revenue',
  answer:
    'RiseRidge is a Shopify SEO agency for DTC and e-commerce brands. We fix the technical issues Shopify creates (duplicate product URLs, filter and tag pages, slow app scripts), optimize the collection and product pages that carry commercial searches, add product structured data, and make your store visible in AI shopping answers. We report results in organic revenue, not just rankings.',
  primaryCta: 'Get a Free Shopify SEO Audit',
  included: [
    {
      title: 'Shopify technical SEO',
      description:
        'Duplicate collection-path product URLs, canonical tags, filter and tag pages, pagination, redirects, sitemaps and Core Web Vitals on your theme.',
    },
    {
      title: 'Collection pages',
      description:
        'Keyword mapping and copy for the collection pages that carry most commercial searches, with internal links that send authority where revenue is.',
    },
    {
      title: 'Product pages and rich results',
      description:
        'Unique product copy, Product schema with price and availability from your store, and image optimization so listings earn rich results.',
    },
    {
      title: 'Content that sells',
      description:
        'Buying guides, comparisons and FAQs that answer pre-purchase questions and link to the right products and collections.',
    },
    {
      title: 'AI shopping visibility',
      description:
        'Get your store recommended when shoppers ask ChatGPT, Perplexity or Google AI Overviews for the best product in your category.',
    },
    {
      title: 'Multi-store and multi-language',
      description:
        'hreflang, localized content and separate strategies for each storefront, as with the English and Spanish stores in our travel-bag case study.',
    },
  ],
  steps: [
    {
      title: 'Audit',
      description:
        'Crawl the store, map keywords to collections and products, and set an organic revenue baseline from Shopify analytics and Search Console.',
    },
    {
      title: 'Fix',
      description:
        'Resolve duplicate URLs, indexation and speed issues in the theme, and add product structured data.',
    },
    {
      title: 'Optimize',
      description:
        'Rewrite and expand the collection and product pages with the most revenue upside first.',
    },
    {
      title: 'Grow',
      description:
        'Publish buying guides, earn links and AI citations, and report organic revenue every month.',
    },
  ],
  proof: [
    {
      client: 'DTC travel-bag brand, two Shopify stores',
      period: 'English and Spanish stores',
      stats: [
        { value: '+102%', label: 'Flagship organic revenue' },
        { value: '+106%', label: 'Organic clicks, English store' },
        { value: '+189%', label: 'Organic clicks, Spanish store' },
        { value: '866 → 34,257', label: 'Rich-snippet (product) impressions' },
      ],
    },
    {
      client: 'E-commerce brand',
      period: 'First 4 months',
      stats: [
        { value: '$21K/day', label: 'Peak daily revenue' },
        { value: '340%', label: 'Organic traffic growth' },
      ],
    },
  ],
  fit: [
    'DTC brands on Shopify that want to rely less on paid ads',
    'Stores with hundreds or thousands of SKUs and messy collection or filter URLs',
    'Brands running more than one storefront or language',
    'Teams that want SEO reported in revenue and checkouts, not just traffic',
  ],
  guides: [
    { href: '/blog/shopify-seo-checklist/', title: 'The Shopify SEO checklist for 2026' },
    { href: '/blog/shopify-store-chatgpt-recommendations/', title: 'How to get your Shopify store recommended by ChatGPT' },
    { href: '/blog/technical-seo-audit-checklist/', title: 'Technical SEO audit checklist' },
    { href: '/ai-seo-agency/', title: 'AI SEO: getting recommended by AI assistants' },
  ],
  faqs: [
    {
      question: 'What does a Shopify SEO agency do?',
      answer:
        'A Shopify SEO agency grows a store\'s organic traffic and revenue from Google and AI search. That means fixing Shopify-specific technical issues, optimizing collection and product pages for the searches that convert, adding product structured data, publishing content that answers pre-purchase questions, and earning links and mentions.',
    },
    {
      question: 'Is Shopify good for SEO?',
      answer:
        'Shopify handles hosting, SSL, sitemaps and basic meta tags well. Its weak spots are duplicate product URLs created by collection paths, a fixed URL structure (/products/ and /collections/), filter and tag pages that can bloat the index, and app scripts that slow pages down. Most of the work is fixing those and building pages around what shoppers actually search.',
    },
    {
      question: 'How long does Shopify SEO take to work?',
      answer:
        'Technical fixes are picked up as Google recrawls the store; rankings for competitive collection terms take longer. For reference, one e-commerce client reached $21K/day in peak daily revenue within 4 months.',
    },
    {
      question: 'How do you report Shopify SEO results?',
      answer:
        'Organic revenue, checkouts and clicks from Shopify analytics and Search Console, plus rankings for your target collections and products. Engagements are month-to-month with no long-term lock-in.',
    },
    {
      question: 'Can you help my store show up in ChatGPT shopping answers?',
      answer:
        'Yes. AI assistants recommend products using structured product data, reviews, retailer and roundup pages, and clear on-site answers. We cover all of these as part of the program; our guide on getting a Shopify store recommended by ChatGPT explains the approach.',
    },
  ],
  cta: {
    heading: 'Where Is Your Store Losing Organic Revenue?',
    description:
      'Get a free Shopify SEO audit: duplicate URLs, indexation gaps, collection pages with the most upside, and how AI assistants see your store.',
    primaryLabel: 'Get Your Free Shopify Audit',
  },
  schema: {
    name: 'Shopify SEO',
    serviceType: 'E-commerce SEO',
    description:
      'Shopify technical SEO, collection and product page optimization, product structured data, content and AI shopping visibility for DTC and e-commerce brands.',
  },
};

export default function ShopifySeoPage() {
  return <ServicePage content={CONTENT} />;
}
