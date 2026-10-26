'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  IconMenu2,
  IconX,
  IconSearch,
  IconArrowUpRight,
  IconHome,
  IconApps,
  IconBook2,
  IconRoute,
  IconLayoutDashboard,
  IconBrandGithub,
  IconStar,
  IconChevronRight,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react'
import { TOOLS, getTool } from '@/lib/tools-registry'
import { ToolIcon } from './ToolIcon'
import { useLocalSetting } from '@/hooks/useLocalSetting'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const destinations = [
  { href: '/', name: 'Home', icon: IconHome },
  { href: '/tools', name: 'All tools', icon: IconApps },
  { href: '/blog', name: 'Build log', icon: IconBook2 },
  { href: '/roadmap', name: 'Roadmap', icon: IconRoute },
]

export function ToolWorkspace({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const slug = path.split('/')[2]
  const tool = getTool(slug)
  const { data: session } = useSession()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalSetting(
    'bns_sidebar_collapsed',
    false
  )
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [favorite, setFavorite] = useState(false)
  const menuRef = useRef<HTMLDialogElement>(null)
  const searchRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMenu(false)
    setSearch(false)
    setQuery('')
    if (!tool) return
    try {
      const saved = JSON.parse(localStorage.getItem('bns_favorites') || '[]')
      setFavorite(Array.isArray(saved) && saved.includes(slug))
      const history = JSON.parse(localStorage.getItem('bns_recent') || '[]')
      localStorage.setItem(
        'bns_recent',
        JSON.stringify(
          [
            slug,
            ...(Array.isArray(history) ? history : []).filter(
              (x) => typeof x === 'string' && x !== slug
            ),
          ].slice(0, 6)
        )
      )
    } catch {
      /* Preferences are optional. */
    }
  }, [path, slug, tool])
  useEffect(() => {
    const dialog = menuRef.current
    if (!dialog) return
    if (menu && !dialog.open) dialog.showModal()
    if (!menu && dialog.open) dialog.close()
  }, [menu])
  useEffect(() => {
    const dialog = searchRef.current
    if (!dialog) return
    if (search && !dialog.open) dialog.showModal()
    if (!search && dialog.open) dialog.close()
  }, [search])
  useEffect(() => {
    if (!tool) return
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearch((value) => !value)
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [tool])
  if (!tool) return children
  function toggleFavorite() {
    try {
      const raw = JSON.parse(localStorage.getItem('bns_favorites') || '[]')
      const values: string[] = Array.isArray(raw) ? raw : []
      localStorage.setItem(
        'bns_favorites',
        JSON.stringify(
          favorite
            ? values.filter((x) => x !== slug)
            : [...new Set([...values, slug])]
        )
      )
      setFavorite(!favorite)
    } catch {
      /* Keep the workspace usable when storage is unavailable. */
    }
  }
  const navigation = (
    <>
      <p className="workspace-nav-label">YOUR TOOLKIT</p>
      <nav aria-label="Tools" className="space-y-1">
        {TOOLS.map((item) => (
          <Link
            key={item.slug}
            href={`/tools/${item.slug}`}
            onClick={() => {
              setMenu(false)
              setSearch(false)
            }}
            aria-current={slug === item.slug ? 'page' : undefined}
            className={`workspace-nav-item ${slug === item.slug ? 'active' : ''}`}
          >
            <ToolIcon slug={item.slug} className="h-[18px] w-[18px] shrink-0" />
            <span>
              {item.name
                .replace('Daily Focus Planner', 'Daily Planner')
                .replace(' + Task Log', '')
                .replace(' Dashboard', '')
                .replace('Freelancer Rate Calculator', 'Rate Calculator')
                .replace('Habit Streak Tracker', 'Habit Tracker')}
            </span>
            {slug === item.slug && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal" />
            )}
          </Link>
        ))}
      </nav>
      <p className="workspace-nav-label mt-8">EXPLORE BUILDNSCALE</p>
      <nav aria-label="Site pages" className="space-y-1">
        {destinations.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              setMenu(false)
              setSearch(false)
            }}
            className="workspace-nav-item"
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.name}
            <IconArrowUpRight className="ml-auto h-3 w-3" />
          </Link>
        ))}
        <Link
          href={session ? '/dashboard' : '/sign-in'}
          className="workspace-nav-item"
        >
          <IconLayoutDashboard className="h-[18px] w-[18px]" />
          {session ? 'My dashboard' : 'Sign in for sync'}
        </Link>
      </nav>
    </>
  )
  return (
    <div className="tool-workspace">
      <a href="#tool-content" className="skip-tool-link">
        Skip navigation
      </a>
      <header className="workspace-header">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <button
            ref={menuButtonRef}
            className="workspace-icon-button lg:hidden"
            aria-label="Open workspace navigation"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
          >
            <IconMenu2 className="h-5 w-5" />
          </button>
          <button
            className="workspace-icon-button hidden lg:inline-flex"
            aria-label={
              sidebarCollapsed ? 'Expand tool sidebar' : 'Collapse tool sidebar'
            }
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
            aria-controls="workspace-sidebar"
            onClick={() => setSidebarCollapsed((value) => !value)}
          >
            {sidebarCollapsed ? (
              <IconLayoutSidebarLeftExpand className="h-5 w-5" />
            ) : (
              <IconLayoutSidebarLeftCollapse className="h-5 w-5" />
            )}
          </button>
          <Link href="/" className="brand hidden lg:inline-flex">
            <span className="brand-mark">b.</span>build
            <span className="text-teal">n</span>scale
          </Link>
          <Link
            href="/tools"
            className="hidden text-sm text-muted hover:text-fg lg:block"
          >
            Workspace
          </Link>
          <IconChevronRight className="hidden h-3 w-3 text-tertiary lg:block" />
          <span
            className={`tool-icon tone-${tool.color} !h-8 !w-8 !rounded-lg lg:hidden`}
          >
            <ToolIcon slug={slug} className="h-4 w-4" />
          </span>
          <span className="truncate text-sm font-semibold">{tool.name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            ref={searchButtonRef}
            onClick={() => setSearch(true)}
            className="workspace-search-button"
            aria-label="Find a tool or page"
          >
            <IconSearch className="h-4 w-4" />
            <span className="hidden xl:inline">Find a tool or page</span>
            <kbd className="hidden xl:inline">⌘ K</kbd>
          </button>
          <button
            className={`workspace-icon-button ${favorite ? 'text-amber' : ''}`}
            aria-label={
              favorite ? 'Remove tool from favorites' : 'Save tool to favorites'
            }
            aria-pressed={favorite}
            onClick={toggleFavorite}
          >
            <IconStar
              className="h-[18px] w-[18px]"
              fill={favorite ? 'currentColor' : 'none'}
            />
          </button>
          <ThemeToggle />
        </div>
      </header>
      <div className="workspace-body">
        <aside
          id="workspace-sidebar"
          aria-label="Tool sidebar"
          className={`workspace-rail ${sidebarCollapsed ? 'is-collapsed' : ''}`}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-5">
            {navigation}
          </div>
          <div className="m-3 rounded-xl border border-border p-3">
            <p className="text-xs font-medium">Your work, your workspace.</p>
            <Link
              className="mt-3 inline-flex text-xs text-teal"
              href="/tools#workspace-data"
            >
              Back up your workspace ↗
            </Link>
          </div>
          <a
            href="https://github.com/myousafmarfani/BuildnScale"
            className="workspace-nav-item m-3 mt-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandGithub className="h-4 w-4" />
            Source & feedback ↗
          </a>
        </aside>
        <div id="tool-content" tabIndex={-1} className="workspace-content">
          {hydrated ? (
            children
          ) : (
            <div className="tool-page-container" role="status">
              Opening your workspace…
            </div>
          )}
        </div>
      </div>
      <dialog
        aria-label="Workspace navigation"
        ref={menuRef}
        className="workspace-dialog workspace-menu"
        onCancel={() => setMenu(false)}
        onClose={() => {
          setMenu(false)
          menuButtonRef.current?.focus()
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenu(false)
        }}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="brand">
            build<span className="text-teal">n</span>scale
          </span>
          <button
            className="workspace-icon-button"
            aria-label="Close workspace navigation"
            onClick={() => setMenu(false)}
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-3">{navigation}</div>
      </dialog>
      <dialog
        aria-label="Find a tool or page"
        ref={searchRef}
        className="workspace-dialog workspace-command"
        onCancel={() => setSearch(false)}
        onClose={() => {
          setSearch(false)
          searchButtonRef.current?.focus()
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSearch(false)
        }}
      >
        <div className="flex items-center gap-3 border-b border-border p-4">
          <IconSearch className="h-5 w-5 text-teal" />
          <input
            autoFocus
            aria-label="Search tools and pages"
            className="min-w-0 flex-1 bg-transparent outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where would you like to go?"
          />
          <button
            aria-label="Close search"
            className="workspace-icon-button"
            onClick={() => setSearch(false)}
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60dvh] overflow-auto p-3">
          <p className="workspace-nav-label">TOOLS</p>
          {TOOLS.filter((item) =>
            `${item.name} ${item.description}`
              .toLowerCase()
              .includes(query.toLowerCase())
          ).map((item) => (
            <Link
              key={item.slug}
              className="workspace-nav-item"
              onClick={() => setSearch(false)}
              href={`/tools/${item.slug}`}
            >
              <ToolIcon slug={item.slug} />
              <span>{item.name}</span>
            </Link>
          ))}
          <p className="workspace-nav-label mt-4">PAGES</p>
          {destinations
            .filter((item) =>
              item.name.toLowerCase().includes(query.toLowerCase())
            )
            .map((item) => (
              <Link
                key={item.href}
                className="workspace-nav-item"
                onClick={() => setSearch(false)}
                href={item.href}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          {!TOOLS.some((item) =>
            `${item.name} ${item.description}`
              .toLowerCase()
              .includes(query.toLowerCase())
          ) &&
            !destinations.some((item) =>
              item.name.toLowerCase().includes(query.toLowerCase())
            ) && (
              <p className="p-4 text-sm text-muted">
                No matches. Try “notes”, “timer”, or “home”.
              </p>
            )}
        </div>
      </dialog>
    </div>
  )
}
