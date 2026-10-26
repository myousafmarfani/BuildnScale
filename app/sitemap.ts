import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { getAllAuthors } from '@/lib/authors'
import { getSnapshots } from '@/lib/benchmarks/data'
import { BENCHMARKS } from '@/lib/benchmarks/catalog'
import { TOOLS } from '@/lib/tools-registry'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.buildnscale.dev'

  const posts = getAllPosts()
  const authors = getAllAuthors()

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/roadmap`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/write-for-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  const toolPages = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const authorPages = authors.map((author) => ({
    url: `${baseUrl}/authors/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const snapshots = await getSnapshots()
  const benchmarkPages = [
    '/leaderboard',
    '/leaderboard/coding',
    '/leaderboard/value',
    '/leaderboard/methodology',
    '/leaderboard/changelog',
    '/models',
    ...BENCHMARKS.map((b) => `/benchmarks/${b.slug}`),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  const modelPages = snapshots.flatMap((snapshot) =>
    snapshot.models.map((model) => ({
      url: `${baseUrl}/models/${model.id}`,
      lastModified: new Date(snapshot.retrievedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )
  return [
    ...staticPages,
    ...toolPages,
    ...blogPages,
    ...authorPages,
    ...benchmarkPages,
    ...modelPages,
  ]
}
