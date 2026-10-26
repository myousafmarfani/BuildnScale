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
import { TOOLS } from '@/lib/tools-registry'
import { ToolIcon } from '@/components/workspace/ToolIcon'

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  return (
    <header className="site-nav">
      <nav
        className="container-site flex h-[calc(var(--site-header-height)-1px)] items-center gap-8"
        aria-label="Main navigation"
      >
        <Link href="/" aria-label="BuildnScale home" className="brand">
          <span className="brand-mark">b.</span>build
          <span className="text-teal">n</span>scale
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {[
            ['/tools', 'Tools'],
            ['/leaderboard', 'AI benchmarks'],
            ['/blog', 'Build log'],
            ['/roadmap', 'Roadmap'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? 'page' : undefined}
              className={`text-sm ${pathname.startsWith(href) ? 'text-teal' : 'text-muted hover:text-fg'}`}
            >
              {label}
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
            className="md:hidden p-2"
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
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-bg px-5 py-5 md:hidden"
        >
          <div className="mb-4 flex flex-wrap gap-5">
            {[
              ['/tools', 'All tools'],
              ['/leaderboard', 'AI benchmarks'],
              ['/blog', 'Build log'],
              ['/roadmap', 'Roadmap'],
              [
                session ? '/dashboard' : '/sign-in',
                session ? 'Dashboard' : 'Sign in',
              ],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-muted"
              >
                {label}
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
