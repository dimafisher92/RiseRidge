import type { MetadataRoute } from 'next';
import { client } from '../../tina/__generated__/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://arcwave.io';

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const result = await client.queries.postConnection({ sort: 'date' });
    blogEntries = (result.data.postConnection.edges ?? []).map((edge) => ({
      url: `${baseUrl}/blog/${edge!.node!._sys.filename}`,
      lastModified: new Date(edge!.node!.date),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // gracefully skip blog entries if TinaCloud is unreachable at build time
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rank-on-ai`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/seo-checker`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogEntries,
  ];
}
