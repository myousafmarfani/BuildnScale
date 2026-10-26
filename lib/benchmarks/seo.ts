import type { Metadata } from 'next'
export function benchmarkMetadata(
  title: string,
  description: string,
  path: string,
  index = true
): Metadata {
  return {
    title: `${title} | BuildnScale`,
    description,
    alternates: { canonical: path },
    robots: { index, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      images: ['/leaderboard/share-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/leaderboard/share-image'],
    },
  }
}
