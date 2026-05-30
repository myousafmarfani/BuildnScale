import { getAllPosts, getPostBySlug } from '@/lib/posts'
import PostContent from './PostContent'

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = getPostBySlug(params.slug)
    return {
      title: `${post.title} — buildnscale.dev`,
      description: post.excerpt,
    }
  } catch {
    return { title: 'Post not found — buildnscale.dev' }
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const post = getPostBySlug(params.slug)
    const allPosts = getAllPosts()
    const relatedPosts = allPosts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3)
    return <PostContent post={post} relatedPosts={relatedPosts} />
  } catch {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="font-display text-3xl text-fg">Post not found</h1>
        <p className="mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    )
  }
}
