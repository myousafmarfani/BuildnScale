import { getAllPosts, getPostBySlug } from '@/lib/posts'
import PostContent from './PostContent'

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const post = getPostBySlug(slug)
    return {
      title: `${post.title} — buildnscale.dev`,
      description: post.excerpt,
      openGraph: {
        title: `${post.title} — buildnscale.dev`,
        description: post.excerpt,
        url: `https://buildnscale.dev/blog/${slug}`,
        type: 'article',
        publishedTime: post.date,
        authors: ['Muhammad Yousaf'],
        tags: [post.category],
        images: ['/opengraph-image'],
      },
      twitter: {
        title: `${post.title} — buildnscale.dev`,
        description: post.excerpt,
        images: ['/twitter-image'],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch {
    return { title: 'Post not found — buildnscale.dev' }
  }
}

function blogPostJsonLd(post: { title: string; excerpt: string; date: string; slug: string; category: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: "Muhammad Yousaf" },
    publisher: {
      "@type": "Organization",
      name: "buildnscale.dev",
      logo: { "@type": "ImageObject", url: "https://buildnscale.dev/og-image.png" },
    },
    url: `https://buildnscale.dev/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://buildnscale.dev/blog/${post.slug}` },
    image: "https://buildnscale.dev/og-image.png",
    articleSection: post.category,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const post = getPostBySlug(slug)
    const allPosts = getAllPosts()
    const relatedPosts = allPosts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3)
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd(post)) }}
        />
        <PostContent post={post} relatedPosts={relatedPosts} />
      </>
    )
  } catch {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="font-display text-3xl text-fg">Post not found</h1>
        <p className="mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    )
  }
}
