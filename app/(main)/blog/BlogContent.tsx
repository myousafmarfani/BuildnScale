'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { IconCode } from '@tabler/icons-react'
import type { Post } from '@/lib/posts'

const categories = ['All', 'Productivity', 'Tools', 'Freelancing', 'Indie Dev']

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function ThumbnailPlaceholder({ category, featured }: { category: string; featured?: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-border"
      style={{ aspectRatio: featured ? '16 / 10' : '16 / 9' }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(45deg, var(--color-info-subtle), var(--color-surface))' }}
      >
        <IconCode className="h-16 w-16 text-teal opacity-50" />
      </div>
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

export default function BlogContent({ posts }: { posts: Post[] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [page, setPage] = useState(1)
  const perPage = 4

  const featured = posts.length > 0 ? posts[0] : null
  const gridPosts = posts.slice(1)

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return gridPosts
    return gridPosts.filter(p => p.category === activeFilter)
  }, [activeFilter, gridPosts])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const paginatedPosts = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  return (
    <div>
      <header className="border-b border-border">
          <div className="container-site section-pad">
          <h1 className="font-display text-hero font-bold tracking-tighter text-fg">
            Build Log.
          </h1>
          <p className="mt-4 text-lg text-muted max-w-[600px] leading-relaxed">
            Tactics, lessons, and tool updates for developers who actually ship. No fluff, just technical growth.
          </p>
        </div>
      </header>

      <div className="sticky top-[52px] z-20 border-b border-border bg-bg">
        <div className="mx-auto flex max-w-[1000px] items-center px-5 py-2.5">
          <div className="flex gap-2 scrollbar-x">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveFilter(cat); setPage(1) }}
                className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                  activeFilter === cat
                    ? 'bg-teal font-medium text-bg'
                    : 'border border-border bg-raised text-muted hover:text-fg'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container-site pb-20">
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="mt-10 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 md:gap-12 items-center bg-surface border border-border rounded-lg p-6 md:p-10 no-underline group"
          >
            <ThumbnailPlaceholder category={featured.category} featured />
            <div>
              <span className="font-display text-2xs text-teal tracking-widest uppercase">
                {featured.category}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-fg mt-3 mb-4 leading-snug group-hover:text-teal transition-colors">
                {featured.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-4">
                {featured.excerpt}
              </p>
              <div className="flex gap-5 text-xs font-display text-tertiary">
                <span>{formatDate(featured.date)}</span>
                <span>{featured.readTime} min read</span>
              </div>
            </div>
          </Link>
        )}

        {paginatedPosts.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col no-underline group"
              >
                <ThumbnailPlaceholder category={post.category} />
                <div className="mt-5 flex-1 flex flex-col">
                  <span className="text-2xs font-display text-teal">{post.title}</span>
                  <h3 className="text-lg font-medium text-fg mt-2 mb-2 leading-snug group-hover:text-teal transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed flex-1 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex gap-5 text-xs font-display text-tertiary mt-auto">
                    <span>{formatDate(post.date)}</span>
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center text-muted font-display text-sm">
            No posts in this category yet.
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, safePage - 1))}
              disabled={safePage <= 1}
              className="text-xs font-display text-muted px-3 py-1.5 border border-border rounded-md disabled:opacity-30 hover:text-fg transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`text-xs font-display px-3 py-1.5 border rounded-md transition-colors ${
                  p === safePage
                    ? 'bg-teal text-bg border-teal'
                    : 'border-border text-muted hover:text-fg'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage >= totalPages}
              className="text-xs font-display text-muted px-3 py-1.5 border border-border rounded-md disabled:opacity-30 hover:text-fg transition-colors"
            >
              Next
            </button>
          </div>
        )}

        <section className="mt-16 mb-20 bg-surface border border-border rounded-lg py-12 px-6 text-center">
          <h2 className="font-display text-2xl font-bold text-fg">
            Get the build log in your inbox
          </h2>
          <p className="mt-3 text-sm text-muted max-w-md mx-auto">
            One email per week. Only technical lessons and new tool releases.
          </p>
          <div className="mt-6 flex max-w-sm mx-auto gap-2">
            <input
              type="email"
              placeholder="dev@company.com"
              className="flex-1 bg-bg border border-border rounded-md px-4 py-2.5 text-sm text-fg outline-none focus:border-teal transition-colors"
            />
            <button className="bg-teal text-bg text-sm font-semibold px-5 rounded-md hover:bg-teal-hover transition-colors whitespace-nowrap">
              Subscribe →
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
