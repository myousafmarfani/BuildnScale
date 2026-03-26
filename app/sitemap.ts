import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { getAllRoadmaps } from '@/lib/roadmaps';
import { getAllResources } from '@/lib/resources';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.buildnscale.dev';
  const posts = getAllPosts();
  const resources = getAllResources();
  const roadmaps = await getAllRoadmaps();

  const toValidDate = (value?: string): Date => {
    if (!value) return new Date();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const latestDate = (dates: Date[]): Date => {
    if (dates.length === 0) return new Date();
    return new Date(Math.max(...dates.map((date) => date.getTime())));
  };

  const postDates = posts.map((post) => toValidDate(post.updatedAt || post.date));
  const resourceDates = resources.map((resource) => toValidDate(resource.lastVerified));
  const roadmapDates = roadmaps.map((roadmap) => toValidDate(roadmap.lastUpdated));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: latestDate([...postDates, ...resourceDates, ...roadmapDates]),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: latestDate(postDates),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/resources`,
      lastModified: latestDate(resourceDates),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/roadmaps`,
      lastModified: latestDate(roadmapDates),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/projects`,
      lastModified: latestDate(postDates),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/author`,
      lastModified: latestDate(postDates),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: latestDate(postDates),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: toValidDate(post.updatedAt || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${base}/resources/${resource.slug}`,
    lastModified: toValidDate(resource.lastVerified),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const roadmapRoutes: MetadataRoute.Sitemap = roadmaps.map((roadmap) => ({
    url: `${base}/roadmaps/${roadmap.slug}`,
    lastModified: toValidDate(roadmap.lastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes, ...resourceRoutes, ...roadmapRoutes];
}
