import Image from 'next/image'
import Link from 'next/link'
import { IconCode } from '@tabler/icons-react'
import type { Post } from '@/lib/posts'

const heroImageMap: Record<string, { src: string; alt: string }> = {
  'why-time-blocking': {
    src: '/images/time-blocking-for-developers.webp',
    alt: 'Time blocking for developers shown as 30-minute focus blocks on a daily calendar grid',
  },
  'focus-planning-tool': {
    src: '/images/focus-planning-tool.webp',
    alt: 'Focus planning tool showing a single time-blocked daily priority on a vertical day grid',
  },
  'replaced-notion-daily-notes': {
    src: '/images/notion-to-md.webp',
    alt: 'Local-first Markdown notes interface showing folder structure and plain text files replacing a Notion workspace',
  },
  'freelance-rate-2026': {
    src: '/images/freelancer-rate.webp',
    alt: 'Freelance rate calculator showing dollar figures, billable hours, and profit margin breakdown for developer freelancing',
  },
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function ThumbnailImage({ slug, featured }: { slug: string; featured?: boolean }) {
  const entry = heroImageMap[slug]
  if (!entry) return null
  return (
    <Image
      src={entry.src}
      alt={entry.alt}
      fill
      sizes={featured ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
      className="object-cover"
      priority={featured}
    />
  )
}

function ThumbnailPlaceholder({ slug, category, featured }: { slug: string; category: string; featured?: boolean }) {
  const hero = heroImageMap[slug]
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-border"
      style={{ aspectRatio: featured ? '16 / 10' : '16 / 9' }}
    >
      {hero ? (
        <ThumbnailImage slug={slug} featured={featured} />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(45deg, var(--color-info-subtle), var(--color-surface))' }}
        >
          <IconCode className="h-16 w-16 text-teal opacity-50" />
        </div>
      )}
      {featured && (
        <span className="absolute bottom-3 left-3 z-10 text-2xs font-display bg-bg text-teal px-2 py-0.5 rounded-sm border border-border">
          FEATURED
        </span>
      )}
      {!featured && (
        <span className="absolute bottom-3 left-3 z-10 text-2xs font-display bg-bg text-teal px-2 py-0.5 rounded-sm border border-border">
          {category.toUpperCase()}
        </span>
      )}
    </div>
  )
}

export function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="mt-10 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 md:gap-12 items-center bg-surface border border-border rounded-lg p-6 md:p-10 no-underline group"
      >
        <ThumbnailPlaceholder slug={post.slug} category={post.category} featured />
        <div>
          <span className="font-display text-2xs text-teal tracking-widest uppercase">
            {post.category}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-fg mt-3 mb-4 leading-snug group-hover:text-teal transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            {post.excerpt}
          </p>
          <div className="flex gap-5 text-xs font-display text-tertiary">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col no-underline group"
    >
      <ThumbnailPlaceholder slug={post.slug} category={post.category} />
      <div className="mt-5 flex-1 flex flex-col">
        <span className="text-2xs font-display text-teal">{post.title}</span>
        <h3 className="text-lg font-medium text-fg mt-2 mb-2 leading-snug group-hover:text-teal transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed flex-1 mb-4">
          {post.excerpt}
        </p>
        <div className="flex gap-5 text-xs font-display text-tertiary mt-auto">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </Link>
  )
}
