type JsonLdType = 'organization' | 'website' | 'breadcrumb';

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function JsonLd({
  type,
  breadcrumbs,
}: {
  type: JsonLdType;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const baseUrl = 'https://arcwave.io';

  const schemas: Record<string, object> = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ArcWave',
      url: baseUrl,
      logo: `${baseUrl}/logo.svg`,
      description:
        'AI-driven SEO agency that engineers organic search growth. We combine AI-powered SEO infrastructure with hands-on strategic execution to move businesses from invisible to undeniable.',
      sameAs: [
        'https://linkedin.com/company/arcwave',
        'https://twitter.com/arcwave',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@arcwave.io',
        contactType: 'sales',
      },
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ArcWave',
      url: baseUrl,
      description: 'AI-Driven SEO. Measurable Growth.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas[type]) }}
    />
  );
}
