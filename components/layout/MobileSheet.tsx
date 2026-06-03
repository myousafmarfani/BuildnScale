"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { IconX, IconSun, IconMoon, IconBrandGithub, IconCalendarEvent, IconPlayerPlay, IconFlame, IconMarkdown, IconCalculator, IconChartBar, IconActivity } from "@tabler/icons-react"

interface MobileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const tools = [
  { icon: IconActivity, name: "Downtime Detector", href: "/tools/downtime-detector", desc: "Monitor uptime" },
  { icon: IconCalendarEvent, name: "Daily Focus Planner", href: "/tools/daily-planner", desc: "Time-block your day" },
  { icon: IconPlayerPlay, name: "Pomodoro + Task Log", href: "/tools/pomodoro", desc: "Track sessions" },
  { icon: IconFlame, name: "Habit Tracker", href: "/tools/habit-tracker", desc: "Build daily streaks" },
  { icon: IconMarkdown, name: "Markdown Notes", href: "/tools/markdown-notes", desc: "Capture fast" },
  { icon: IconCalculator, name: "Freelancer Calculator", href: "/tools/rate-calculator", desc: "Price your time" },
  { icon: IconChartBar, name: "Weekly Review", href: "/tools/weekly-review", desc: "Reflect and reset" },
]

export function MobileSheet({ open, onOpenChange }: MobileSheetProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false)
    }

    function handleClickOutside(e: MouseEvent) {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleKey)
    document.addEventListener("mousedown", handleClickOutside)

    const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )
    focusable?.[0]?.focus()

    return () => {
      document.removeEventListener("keydown", handleKey)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] bg-bg md:hidden">
      <div
        ref={sheetRef}
        className="flex h-full flex-col px-6 pt-6"
        style={{ animation: "slide-in 0.28s ease-out" }}
      >
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="font-display text-sm font-semibold text-fg" onClick={() => onOpenChange(false)}>
            build<span className="text-teal">n</span>scale
          </Link>
          <button onClick={() => onOpenChange(false)} aria-label="Close menu">
            <IconX className="h-5 w-5 text-muted" />
          </button>
        </div>

        <div className="mb-8 flex flex-col gap-6">
          <Link href="/tools" className="text-[22px] font-medium text-fg" onClick={() => onOpenChange(false)}>
            Tools
          </Link>
          <Link href="/blog" className="text-[22px] font-medium text-fg" onClick={() => onOpenChange(false)}>
            Blog
          </Link>
        </div>

        <div className="h-px bg-border" />

        <div className="mt-6 mb-6 flex flex-col gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-start gap-4 rounded-lg p-3 -mx-3 transition-colors hover:bg-raised"
              onClick={() => onOpenChange(false)}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-raised text-teal">
                <tool.icon className="h-[18px] w-[18px]" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-[15px] font-medium text-fg">{tool.name}</span>
                <span className="text-xs text-tertiary">{tool.desc}</span>
              </div>
            </Link>
          ))}
          <Link
            href="/tools"
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-teal -mx-3 transition-colors hover:bg-raised"
            onClick={() => onOpenChange(false)}
          >
            Browse all tools
            <span>→</span>
          </Link>
        </div>

        <div className="h-px bg-border" />

        <div className="mt-auto mb-6 flex flex-col gap-3 pb-6">
          <a
            href="https://github.com/myousafmarfani/BuildnScale"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-md text-[15px] font-medium text-tertiary"
          >
            <IconBrandGithub className="h-4 w-4" /> GitHub
          </a>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-12 items-center justify-center gap-2 rounded-md text-[15px] font-medium text-tertiary"
            >
              {theme === "dark" ? <><IconSun className="h-4 w-4" /> Light mode</> : <><IconMoon className="h-4 w-4" /> Dark mode</>}
            </button>
          )}
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex h-12 items-center justify-center rounded-md text-[15px] font-medium text-teal"
                onClick={() => onOpenChange(false)}
              >
                {session?.user?.name || session?.user?.email || "Dashboard"}
              </Link>
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); onOpenChange(false) }}
                className="flex h-12 items-center justify-center rounded-md text-[15px] font-medium text-tertiary bg-transparent border-none cursor-pointer w-full"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="flex h-12 items-center justify-center rounded-md text-[15px] font-medium text-tertiary"
                onClick={() => onOpenChange(false)}
              >
                Sign in
              </Link>
              <Link
                href="/tools/downtime-detector"
                className="flex h-12 items-center justify-center rounded-md bg-teal text-[15px] font-medium text-bg"
                onClick={() => onOpenChange(false)}
              >
                Try free →
              </Link>
            </>
          )}
        </div>

        <span className="font-display pb-6 text-center text-[11px] text-tertiary">
          v1.0.0 · © 2026 buildnscale.dev
        </span>
      </div>
    </div>
  )
}
