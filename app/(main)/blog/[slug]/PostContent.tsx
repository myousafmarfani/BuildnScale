'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IconArrowLeft, IconTools } from '@tabler/icons-react'
import type { Post } from '@/lib/posts'
import BuildLogCTA from '@/components/BuildLogCTA'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const toolMap: Record<string, { name: string; href: string; description: string }> = {
  'why-time-blocking': {
    name: 'Daily Focus Planner',
    href: '/tools/daily-planner',
    description: 'Open the Daily Focus Planner and drag your one priority into a 30-minute time block. Set a hard start and end — treat it like a meeting with yourself.',
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
  'focus-planning-tool': {
    name: 'Daily Focus Planner',
    href: '/tools/daily-planner',
    description: 'Open the Daily Focus Planner, set your one priority in the top slot, and drag supporting tasks into 30-minute blocks below. Start with a 2-minute close-out at day\'s end.',
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

  const [scrollProgress, setScrollProgress] = useState(0)
  const tool = toolMap[currentPost.slug]

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      <nav className="sticky top-[52px] z-20 border-b border-border bg-bg relative">
        <div className="mx-auto flex max-w-[1000px] items-center px-5 py-2.5">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-sm text-tertiary hover:text-fg transition-colors"
          >
            <IconArrowLeft className="h-4 w-4" />
            All Posts
          </Link>
        </div>
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-teal"
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading progress"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </nav>

      <main>
      <article>
        <header className="border-b border-border">
          <div className="container-site py-12 md:py-[60px]">
            <nav className="flex items-center gap-1.5 text-xs text-tertiary mb-5">
              <Link href="/" className="hover:text-fg transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-fg transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-muted">{currentPost.category}</span>
            </nav>
            <span className="font-display text-2xs text-teal tracking-[0.12em] uppercase">
              {currentPost.category} · <time dateTime={currentPost.date}>{formatDate(currentPost.date)}</time>
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-fg mt-4 mb-6 leading-tight">
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

              <Link
                href={`/authors/${currentPost.authorSlug}`}
                className="border-t border-border pt-10 mt-16 flex gap-5 items-center no-underline group"
              >
                <Image
                  src="/author.avif"
                  alt="Muhammad Yousaf"
                  width={56}
                  height={56}
                  className="rounded-full shrink-0 object-cover"
                />
                <div>
                  <span className="block text-base font-medium text-fg group-hover:text-teal transition-colors">Muhammad Yousaf</span>
                  <span className="block text-sm text-tertiary">Founder at BuildnScale · Full-Stack and AI Engineer</span>
                </div>
              </Link>
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

              <BuildLogCTA variant="sidebar" />
            </aside>
          </div>
        </div>
      </article>
      </main>

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
                    <time dateTime={rp.date}>{formatDate(rp.date)}</time>
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
