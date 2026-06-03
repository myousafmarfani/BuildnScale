"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import {
  IconCalendarEvent,
  IconPlayerPlay,
  IconFlame,
  IconMarkdown,
  IconCalculator,
  IconChartBar,
  IconActivity,
  IconChevronDown,
  IconMenu2,
  IconSun,
  IconMoon,
  IconBrandGithub,
} from "@tabler/icons-react"
import { MobileSheet } from "./MobileSheet"

const tools = [
  { icon: IconActivity, name: "Downtime Detector", desc: "Monitor uptime", href: "/tools/downtime-detector" },
  { icon: IconCalendarEvent, name: "Daily Focus Planner", desc: "Time-block your day", href: "/tools/daily-planner" },
  { icon: IconPlayerPlay, name: "Pomodoro + Task Log", desc: "Track sessions", href: "/tools/pomodoro" },
  { icon: IconFlame, name: "Habit Tracker", desc: "Build daily streaks", href: "/tools/habit-tracker" },
  { icon: IconMarkdown, name: "Markdown Notes", desc: "Capture fast", href: "/tools/markdown-notes" },
  { icon: IconCalculator, name: "Freelancer Calculator", desc: "Price your time", href: "/tools/rate-calculator" },
  { icon: IconChartBar, name: "Weekly Review", desc: "Reflect and reset", href: "/tools/weekly-review" },
]

export function Nav() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav className="sticky top-0 z-[100] h-[52px] border-b border-border bg-bg">
        <div className="mx-auto flex h-full w-full max-w-site items-center px-5">
          <Link href="/" className="font-display text-sm font-semibold text-fg">
            build<span className="text-teal">n</span>scale
          </Link>

          <div className="ml-8 hidden items-center md:flex">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1 text-sm transition-colors duration-150 ${
                  dropdownOpen ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                Tools
                <IconChevronDown className="mt-0.5 h-3 w-3" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-[44px] w-[640px] rounded-xl border border-border-strong bg-bg p-5">
                  <div className="grid grid-cols-2 gap-2">
                    {tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="flex items-start gap-4 rounded-lg p-3.5 transition-colors hover:bg-raised group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-raised text-teal group-hover:bg-teal/10 transition-colors">
                          <tool.icon className="h-5 w-5" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="text-sm font-medium text-fg group-hover:text-teal transition-colors">{tool.name}</span>
                          <span className="mt-0.5 text-xs text-tertiary leading-relaxed">{tool.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-border pt-3">
                    <Link
                      href="/tools"
                      className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium text-teal transition-colors hover:bg-raised"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Browse all tools
                      <span className="text-base leading-none">→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className={`ml-6 text-sm transition-colors duration-150 ${
                isActive("/blog") ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              Blog
            </Link>

          </div>

          <div className="ml-auto hidden items-center gap-5 md:flex">
            <a
              href="https://github.com/myousafmarfani/BuildnScale"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary transition-colors duration-150 hover:text-muted"
              aria-label="GitHub"
            >
              <IconBrandGithub className="h-[18px] w-[18px]" />
            </a>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-tertiary transition-colors duration-150 hover:text-muted"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
              </button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-sm text-tertiary transition-colors duration-150 hover:text-muted"
                >
                  {session?.user?.name || session?.user?.email || "Dashboard"}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs text-tertiary transition-colors duration-150 hover:text-muted bg-transparent border-none cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-tertiary transition-colors duration-150 hover:text-muted"
                >
                  Sign in
                </Link>
                <Link
                  href="/tools/downtime-detector"
                  className="rounded-[6px] bg-teal px-3.5 py-[7px] text-xs font-medium text-bg transition-opacity hover:opacity-90"
                >
                  Try free →
                </Link>
              </>
            )}
          </div>

          <button
            className="ml-auto text-muted md:hidden"
            onClick={() => setSheetOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu2 className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <MobileSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  )
}
