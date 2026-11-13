'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconMenu2,
  IconX,
} from '@tabler/icons-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Brand } from '@/components/layout/Brand'
import { TOOLS } from '@/lib/tools-registry'
import { ToolIcon } from '@/components/workspace/ToolIcon'

const NAV_ITEMS: Array<{ href: string; label: string; badge?: string }> = [
  { href: '/tools', label: 'Tools' },
  { href: '/leaderboard', label: 'AI benchmarks' },
  { href: '/ai-costs', label: 'AI costs', badge: 'Beta' },
  { href: '/blog', label: 'Build log' },
  { href: '/roadmap', label: 'Roadmap' },
]

function NavBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-teal-subtle px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase leading-none tracking-wider text-teal">
      {label}
    </span>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  return (
    <header className="site-nav">
      <nav
        className="container-site flex h-[calc(var(--site-header-height)-1px)] items-center gap-5 lg:gap-8"
        aria-label="Main navigation"
      >
        <Brand priority />
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map(({ href, label, badge }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap text-sm ${pathname.startsWith(href) ? 'text-teal' : 'text-muted hover:text-fg'}`}
            >
              {label}
              {badge ? <NavBadge label={badge} /> : null}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <a
            href="https://github.com/myousafmarfani/BuildnScale"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Source code on GitHub"
            className="hidden text-muted sm:block"
          >
            <IconBrandGithub className="h-5 w-5" />
          </a>
          <ThemeToggle />
          <Link
            href={session ? '/dashboard' : '/tools'}
            className="btn-primary hidden sm:inline-flex"
          >
            {session ? 'My dashboard' : 'Open workspace'}
            <IconArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            className="p-2 lg:hidden"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <IconX className="h-5 w-5" />
            ) : (
              <IconMenu2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-bg px-5 py-5 lg:hidden"
        >
          <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1">
            {[
              ...NAV_ITEMS,
              {
                href: session ? '/dashboard' : '/sign-in',
                label: session ? 'Dashboard' : 'Sign in',
              },
            ].map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith(href) ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 py-2 text-sm ${
                  pathname.startsWith(href) ? 'text-teal' : 'text-muted'
                }`}
              >
                {label}
                {badge ? <NavBadge label={badge} /> : null}
              </Link>
            ))}
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-raised"
              >
                <span className="text-teal">
                  <ToolIcon slug={tool.slug} />
                </span>
                <span className="text-sm">{tool.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
