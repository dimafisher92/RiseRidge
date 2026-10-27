type JsonLdType =
  | 'organization'
  | 'website'
  | 'breadcrumb'
  | 'article'
  | 'faq'
  | 'service';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface ArticleData {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  section?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// A byline like "RiseRidge Team" is the organization; anything else is a person.
function isPersonAuthor(name?: string): name is string {
  return !!name && !/riseridge|team|staff|editorial/i.test(name);
}

export function JsonLd({
  type,
  breadcrumbs,
  article,
  faqs,
}: {
  type: JsonLdType;
  breadcrumbs?: BreadcrumbItem[];
  article?: ArticleData;
  faqs?: FaqItem[];
}) {
  const baseUrl = 'https://riseridge.io';

  const schemas: Record<string, object> = {
    organization: {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${baseUrl}/#organization`,
      name: 'RiseRidge',
      alternateName: 'RiseRidge SEO',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logos/riseridge/png/lockup-horizontal.png`,
      },
      image: `${baseUrl}/logos/riseridge/png/lockup-horizontal.png`,
      description:
        'RiseRidge is an AI-driven SEO agency founded in 2020. It grows organic traffic and revenue for e-commerce and Shopify brands, local businesses and growth-stage companies, and gets them recommended in AI search (ChatGPT, Claude, Gemini, Perplexity, Google AI Overviews).',
      slogan: 'AI-Driven SEO. Measurable Growth.',
      foundingDate: '2020',
      award: 'TOP 100 USA Entrepreneurs (TOP USA Awards 2023)',
      knowsAbout: [
        'Search Engine Optimization',
        'AI Search Optimization',
        'LLM Visibility',
        'Generative Engine Optimization',
        'Answer Engine Optimization',
        'Shopify SEO',
        'E-commerce SEO',
        'Technical SEO',
        'Content Marketing',
        'Local SEO',
        'Keyword Research',
        'Link Building',
      ],
      areaServed: 'Worldwide',
      sameAs: [
        'https://www.instagram.com/riseridge_ai/',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@riseridge.io',
        contactType: 'sales',
        availableLanguage: 'English',
      },
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      name: 'RiseRidge',
      url: baseUrl,
      description: 'AI-Driven SEO. Measurable Growth.',
      publisher: { '@id': `${baseUrl}/#organization` },
      inLanguage: 'en-US',
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (breadcrumbs || []).map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: `${baseUrl}${item.href}`,
      })),
    },
    article: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.description,
          url: `${baseUrl}${article.url}`,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}${article.url}`,
          },
          datePublished: article.datePublished,
          dateModified: article.dateModified ?? article.datePublished,
          ...(article.section ? { articleSection: article.section } : {}),
          image: article.image
            ? [article.image]
            : [`${baseUrl}/opengraph-image`],
          author: isPersonAuthor(article.authorName)
            ? { '@type': 'Person', name: article.authorName }
            : {
                '@type': 'Organization',
                name: article.authorName || 'RiseRidge',
                url: baseUrl,
              },
          publisher: { '@id': `${baseUrl}/#organization` },
        }
      : {},
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (faqs || []).map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    service: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AI-Driven SEO',
      provider: { '@id': `${baseUrl}/#organization` },
      areaServed: 'Worldwide',
      description:
        'AI-powered SEO services including technical audits, content intelligence, rank tracking, and LLM visibility optimization for ChatGPT, Claude, Gemini, and Perplexity.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'SEO Services',
        itemListElement: [
          'AI SEO Automation',
          'Content Intelligence',
          'Technical SEO Audits',
          'Rank Tracking & Analytics',
          'LLM Visibility Monitoring',
          'Local SEO Management',
        ].map((name) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name },
        })),
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas[type]) }}
    />
  );
}
