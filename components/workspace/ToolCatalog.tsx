'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  IconSearch,
  IconArrowUpRight,
  IconStar,
  IconX,
  IconClock,
} from '@tabler/icons-react'
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from '@/lib/tools-registry'
import { ToolIcon } from './ToolIcon'

export function ToolCatalog({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ToolCategory>('All tools')
  const [favorites, setFavorites] = useState<string[]>([])
  const [recent, setRecent] = useState<string[]>([])
  const [savedOnly, setSavedOnly] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bns_favorites') || '[]')
      const visited = JSON.parse(localStorage.getItem('bns_recent') || '[]')
      if (Array.isArray(saved))
        setFavorites(saved.filter((x) => typeof x === 'string'))
      if (Array.isArray(visited))
        setRecent(visited.filter((x) => typeof x === 'string'))
    } catch {
      /* Ignore damaged preferences. */
    }
    const q = new URLSearchParams(window.location.search).get('q')
    if (q) setQuery(q)
    function shortcut(event: KeyboardEvent) {
      if (
        event.key === '/' &&
        !(
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          (event.target as HTMLElement)?.isContentEditable
        )
      ) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
  const filtered = useMemo(
    () =>
      TOOLS.filter(
        (tool) =>
          (category === 'All tools' ||
            (tool.category as readonly string[]).includes(category)) &&
          (!savedOnly || favorites.includes(tool.slug)) &&
          [tool.name, tool.description, ...tool.tags, ...tool.category]
            .join(' ')
            .toLowerCase()
            .includes(query.toLowerCase().trim())
      ),
    [category, query, favorites, savedOnly]
  )
  function toggleFavorite(slug: string) {
    const next = favorites.includes(slug)
      ? favorites.filter((x) => x !== slug)
      : [...favorites, slug]
    setFavorites(next)
    try {
      localStorage.setItem('bns_favorites', JSON.stringify(next))
    } catch {
      /* Session-only preference when storage is unavailable. */
    }
  }
  return (
    <div id="tool-catalog" className="scroll-mt-24">
      <div className="catalog-search">
        <IconSearch className="h-5 w-5 shrink-0 text-teal" />
        <input
          ref={searchRef}
          aria-label="Search tools"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to get done?"
        />
        {query ? (
          <button onClick={() => setQuery('')} aria-label="Clear search">
            <IconX className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="hidden sm:block">/</kbd>
        )}
      </div>
      <div className="my-6 flex flex-wrap items-center gap-2">
        {TOOL_CATEGORIES.map((item) => (
          <button
            key={item}
            aria-pressed={category === item}
            className={`filter-chip ${category === item ? 'is-active' : ''}`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
        <button
          className={`filter-chip ${savedOnly ? 'is-active' : ''}`}
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly(!savedOnly)}
        >
          <IconStar className="h-3.5 w-3.5" /> Favorites{' '}
          {favorites.length > 0 && `(${favorites.length})`}
        </button>
      </div>
      {!compact && recent.length > 0 && !query && (
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <IconClock className="h-4 w-4" /> Pick up where you left off
          </span>
          {recent.slice(0, 3).map((slug) => {
            const tool = TOOLS.find((t) => t.slug === slug)
            return tool ? (
              <Link
                className="text-teal hover:underline"
                key={slug}
                href={`/tools/${slug}`}
              >
                {tool.name} →
              </Link>
            ) : null
          })}
        </div>
      )}
      <div className="mb-4 flex items-center justify-between text-xs text-muted">
        <span aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'} to make
          progress
        </span>
        <span>No account needed to get started</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <article key={tool.slug} className="tool-card group">
            <div className="mb-7 flex items-center justify-between">
              <span className={`tool-icon tone-${tool.color}`}>
                <ToolIcon slug={tool.slug} className="h-6 w-6" />
              </span>
              <button
                className={`favorite-button ${favorites.includes(tool.slug) ? 'text-amber' : 'text-tertiary'}`}
                aria-label={`${favorites.includes(tool.slug) ? 'Remove' : 'Add'} ${tool.name} ${favorites.includes(tool.slug) ? 'from' : 'to'} favorites`}
                aria-pressed={favorites.includes(tool.slug)}
                onClick={() => toggleFavorite(tool.slug)}
              >
                <IconStar
                  className="h-[18px] w-[18px]"
                  fill={favorites.includes(tool.slug) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
            <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted">
              {tool.category[0]}
            </p>
            <h3 className="mb-2 text-lg font-semibold tracking-tight">
              <Link
                href={`/tools/${tool.slug}`}
                className="after:absolute after:inset-0 after:rounded-xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-teal"
              >
                {tool.name}
              </Link>
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              {tool.description}
            </p>
            <div className="mt-auto flex items-end justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-raised px-2 py-1 text-[10px] text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <IconArrowUpRight className="h-5 w-5 shrink-0 text-teal transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <h3 className="text-lg font-semibold">No matching tools</h3>
          <p className="my-3 text-sm text-muted">
            Try another search or save a tool using its star.
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              setQuery('')
              setCategory('All tools')
              setSavedOnly(false)
            }}
          >
            Show all tools
          </button>
        </div>
      )}
    </div>
  )
}
