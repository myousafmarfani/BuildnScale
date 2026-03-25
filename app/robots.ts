import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog/', '/roadmaps/', '/projects/', '/resources/', '/author/'],
        disallow: ['/api/', '/_next/', '/search'],
      },
    ],
    sitemap: 'https://buildnscale.dev/sitemap.xml',
  };
}
