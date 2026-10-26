'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { IconChevronDown, IconApps } from '@tabler/icons-react'
import { TOOLS, getTool } from '@/lib/tools-registry'
import { ToolIcon } from '@/components/workspace/ToolIcon'
export function ToolBreadcrumbs({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bns_recent') || '[]')
      const recent = Array.isArray(saved) ? saved : []
      localStorage.setItem(
        'bns_recent',
        JSON.stringify(
          [
            slug,
            ...recent.filter((x) => typeof x === 'string' && x !== slug),
          ].slice(0, 6)
        )
      )
    } catch {
      /* Optional recent history. */
    }
    function dismiss(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    function escape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        ref.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('mousedown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [slug])
  return (
    <div ref={ref} className="relative min-w-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="tool-switcher"
        className="flex max-w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-raised"
      >
        <span className="hidden text-teal sm:block">
          <ToolIcon slug={slug} className="h-4 w-4" />
        </span>
        <span className="truncate">{getTool(slug)?.name ?? 'Tools'}</span>
        <IconChevronDown className="h-3 w-3 shrink-0" />
      </button>
      {open && (
        <nav
          id="tool-switcher"
          aria-label="Switch tools"
          className="tool-switcher"
        >
          <Link
            href="/tools"
            className="mb-2 flex items-center gap-3 border-b border-border px-3 pb-3 text-sm text-teal"
          >
            <IconApps className="h-4 w-4" /> All tools & workspace
          </Link>
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              aria-current={slug === tool.slug ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-raised ${slug === tool.slug ? 'bg-raised text-teal' : 'text-muted'}`}
              onClick={() => setOpen(false)}
            >
              <ToolIcon slug={tool.slug} className="h-4 w-4" />
              {tool.name}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
