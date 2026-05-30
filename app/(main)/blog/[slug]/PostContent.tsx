'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconArrowLeft, IconTools } from '@tabler/icons-react'
import type { Post } from '@/lib/posts'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const toolMap: Record<string, { name: string; href: string; description: string }> = {
  'why-time-blocking': {
    name: 'Daily Focus Planner',
    href: '/tools/daily-planner',
    description: 'Open our Daily Focus Planner and drag your 3 biggest tasks into 60-minute blocks. Don\'t check email until the first block is green.',
  },
  'replaced-notion-daily-notes': {
    name: 'Markdown Notes',
    href: '/tools/markdown-notes',
    description: 'Write, preview, and organize your Markdown notes in a clean 3-pane editor with live preview and auto-save.',
  },
  'freelance-rate-2026': {
    name: 'Freelancer Rate Calculator',
    href: '/tools/rate-calculator',
    description: 'Run the numbers on your hourly rate with expense tracking, profit margins, and invoice PDF generation.',
  },
}

function TocItem({
  id,
  text,
  activeId,
  onClick,
}: {
  id: string
  text: string
  activeId: string
  onClick: (id: string) => void
}) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`block w-full text-left text-sm py-1.5 pl-3 border-l-2 transition-all duration-150 ${
        activeId === id
          ? 'border-teal text-fg font-medium'
          : 'border-border text-tertiary hover:text-muted hover:border-muted'
      }`}
    >
      {text}
    </button>
  )
}

export default function PostContent({ post: currentPost, relatedPosts = [] }: { post: Post; relatedPosts?: Post[] }) {
  const [activeId, setActiveId] = useState('')

  const tool = toolMap[currentPost.slug]

  useEffect(() => {
    setActiveId('')
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-52px 0px -65% 0px', threshold: 0 }
    )

    const h2s = document.querySelectorAll('.post-content h2')
    h2s.forEach(h2 => observer.observe(h2))

    return () => observer.disconnect()
  }, [currentPost.slug])

  const handleTocClick = (id: string) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div>
      <div className="border-b border-border">
        <div className="container-site flex items-center h-[52px]">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-sm text-tertiary hover:text-muted transition-colors"
          >
            <IconArrowLeft className="h-4 w-4" />
            All posts
          </Link>
        </div>
      </div>

      <article>
        <header className="border-b border-border">
          <div className="container-site py-12 md:py-[60px]">
            <span className="font-display text-2xs text-teal tracking-[0.12em] uppercase">
              {currentPost.category} · {formatDate(currentPost.date)}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[oklch(100%_0_0)] mt-4 mb-6 leading-tight">
              {currentPost.title}
            </h1>
            <div className="flex gap-5 text-sm font-display text-tertiary">
              <span>{currentPost.readTime} min read</span>
            </div>
          </div>
        </header>

        <div className="container-site">
          <div className="flex flex-col md:flex-row md:gap-[60px]">
            <div className="flex-1 max-w-article pt-12 md:pt-[48px] pb-20">
              <div
                className="post-content text-[17px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentPost.contentHtml }}
              />

              {tool && (
                <div className="flex gap-4 items-start bg-teal-subtle border border-teal-muted rounded-lg p-6 my-12">
                  <span className="text-2xl mt-0.5" role="img" aria-label="tool">🗓</span>
                  <div>
                    <h4 className="text-base font-semibold text-fg mb-1">Try this today</h4>
                    <p className="text-sm text-muted leading-relaxed mb-3">{tool.description}</p>
                    <Link
                      href={tool.href}
                      className="inline-block bg-teal text-bg text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-teal-hover transition-colors"
                    >
                      Open {tool.name} →
                    </Link>
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-10 mt-16 flex gap-5 items-center">
                <div className="w-14 h-14 rounded-full bg-raised border border-border shrink-0" />
                <div>
                  <span className="block text-base font-medium text-fg">Marc Jenkins</span>
                  <span className="block text-sm text-tertiary">Founder at buildnscale.dev · ex-Linear engineer</span>
                </div>
              </div>
            </div>

            <aside className="w-full md:w-[280px] shrink-0 md:sticky md:top-[80px] md:self-start md:pt-[48px] pb-10 md:pb-20">
              {currentPost.headings.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-display text-xs font-medium text-muted uppercase tracking-widest mb-3">
                    On this page
                  </h3>
                  <nav>
                    {currentPost.headings.map(h => (
                      <TocItem
                        key={h.id}
                        id={h.id}
                        text={h.text}
                        activeId={activeId}
                        onClick={handleTocClick}
                      />
                    ))}
                  </nav>
                </div>
              )}

              <div className="mb-10 bg-surface border border-border rounded-lg p-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-teal-subtle text-teal mb-4">
                  <IconTools className="h-5 w-5" />
                </div>
                <h3 className="font-display text-sm font-semibold text-fg mb-1">
                  Try a tool
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  Open the Daily Focus Planner to time-block your day in 30-minute increments.
                </p>
                <Link
                  href="/tools/daily-planner"
                  className="inline-block text-xs font-semibold text-teal hover:text-teal-hover transition-colors"
                >
                  Open Planner →
                </Link>
              </div>

              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="font-display text-sm font-semibold text-fg mb-1">
                  Get weekly updates
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-3">
                                   New tools, engineering lessons, and productivity tactics.
                </p>
                <input
                  type="email"
                  placeholder="dev@company.com"
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-xs text-fg outline-none mb-2 focus:border-teal transition-colors"
                />
                <button className="w-full bg-teal text-bg text-xs font-semibold py-2 rounded-md hover:bg-teal-hover transition-colors">
                  Subscribe
                </button>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="border-t border-border">
          <div className="container-site py-16">
            <h2 className="font-display text-xl font-bold text-fg mb-8">
              More in {currentPost.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(rp => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="flex flex-col bg-surface border border-border rounded-lg p-5 no-underline group hover:border-muted transition-colors"
                >
                  <span className="text-2xs font-display text-teal uppercase">{rp.category}</span>
                  <h3 className="text-base font-medium text-fg mt-2 mb-2 group-hover:text-teal transition-colors">
                    {rp.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed flex-1">
                    {rp.excerpt.length > 100 ? rp.excerpt.slice(0, 100) + '…' : rp.excerpt}
                  </p>
                  <div className="flex gap-4 text-2xs font-display text-tertiary mt-4">
                    <span>{formatDate(rp.date)}</span>
                    <span>{rp.readTime} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
