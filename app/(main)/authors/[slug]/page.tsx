import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAuthorBySlug, getAllAuthors } from '@/lib/authors'
import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { breadcrumbJsonLd } from '@/lib/json-ld'
import { IconArrowLeft, IconBrandGithub, IconBrandX, IconWorld } from '@tabler/icons-react'

export function generateStaticParams() {
  const authors = getAllAuthors()
  return authors.map(author => ({ slug: author.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) return { title: 'Author not found — buildnscale.dev' }

  return {
    title: `${author.name} — buildnscale.dev`,
    description: author.bio,
    openGraph: {
      title: `${author.name} — buildnscale.dev`,
      description: author.bio,
      url: `https://www.buildnscale.dev/authors/${slug}`,
      type: 'profile',
      images: ['/opengraph-image'],
    },
    twitter: {
      title: `${author.name} — buildnscale.dev`,
      description: author.bio,
      images: ['/twitter-image'],
    },
    robots: { index: true, follow: true },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) notFound()

  const allPosts = getAllPosts()
  const posts = allPosts.filter(p => p.authorSlug === slug)

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio,
    image: `https://www.buildnscale.dev${author.avatar}`,
    url: `https://www.buildnscale.dev/authors/${slug}`,
    ...(author.github && { sameAs: [author.github, author.twitter, author.website].filter(Boolean) }),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', url: 'https://www.buildnscale.dev' },
            { name: 'Authors', url: 'https://www.buildnscale.dev/authors' },
            { name: author.name, url: `https://www.buildnscale.dev/authors/${slug}` },
          ]))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="border-b border-border">
        <div className="container-site flex items-center h-[52px]">
          <Link
            href="/authors"
            className="flex items-center gap-1.5 text-sm text-tertiary hover:text-muted transition-colors"
          >
            <IconArrowLeft className="h-4 w-4" />
            All authors
          </Link>
        </div>
      </div>

      <header className="border-b border-border">
        <div className="container-site py-12 md:py-[60px] flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          <Image
            src={author.avatar}
            alt={author.name}
            width={128}
            height={128}
            className="rounded-full object-cover shrink-0"
          />
          <div className="text-center md:text-left">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-fg">
              {author.name}
            </h1>
            <p className="mt-2 text-tertiary">{author.bio}</p>
            <div className="mt-4 flex gap-4 justify-center md:justify-start">
              {author.github && (
                <a
                  href={author.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tertiary hover:text-fg transition-colors"
                  aria-label={`${author.name} on GitHub`}
                >
                  <IconBrandGithub className="h-5 w-5" />
                </a>
              )}
              {author.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tertiary hover:text-fg transition-colors"
                  aria-label={`${author.name} on X`}
                >
                  <IconBrandX className="h-5 w-5" />
                </a>
              )}
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tertiary hover:text-fg transition-colors"
                  aria-label={`${author.name}'s website`}
                >
                  <IconWorld className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container-site pb-20">
        {posts.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center text-muted font-display text-sm">
            No posts yet.
          </div>
        )}
      </main>
    </div>
  )
}
