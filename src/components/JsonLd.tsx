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
  const baseUrl = 'https://rankpilot.ai';

  const schemas: Record<string, object> = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'RankPilot',
      url: baseUrl,
      logo: `${baseUrl}/logo.svg`,
      description:
        'AI-Powered SEO agency helping e-commerce and growth-stage businesses dominate organic search with proprietary AI tooling.',
      sameAs: [
        'https://linkedin.com/company/rankpilot',
        'https://twitter.com/rankpilot',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@rankpilot.ai',
        contactType: 'sales',
      },
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'RankPilot',
      url: baseUrl,
      description: 'AI-Powered SEO. Precision Navigation to the Top.',
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
