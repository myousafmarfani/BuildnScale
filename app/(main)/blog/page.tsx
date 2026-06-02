import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import BlogContent from './BlogContent'

export const metadata: Metadata = {
  title: 'Blog — Writing while building | buildnscale.dev',
  description:
    'Tactics, lessons, and tool updates for developers who actually ship. No fluff, just technical growth. Time blocking, freelancing, and productivity deep dives.',
  openGraph: {
    title: 'Blog — Writing while building | buildnscale.dev',
    description:
      'Tactics, lessons, and tool updates for developers who actually ship.',
    url: 'https://buildnscale.dev/blog',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Blog — Writing while building | buildnscale.dev',
    description:
      'Tactics, lessons, and tool updates for developers who actually ship.',
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  return <BlogContent posts={posts} />
}
