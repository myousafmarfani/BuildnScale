"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { IconX, IconSun, IconMoon, IconCalendarEvent, IconPlayerPlay, IconFlame, IconMarkdown, IconCalculator, IconChartBar } from "@tabler/icons-react"

interface MobileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const tools = [
  { icon: IconCalendarEvent, name: "Daily Focus Planner", href: "/tools/daily-planner" },
  { icon: IconPlayerPlay, name: "Pomodoro + Task Log", href: "/tools/pomodoro" },
  { icon: IconFlame, name: "Habit Tracker", href: "/tools/habit-tracker" },
  { icon: IconMarkdown, name: "Markdown Notes", href: "/tools/markdown-notes" },
  { icon: IconCalculator, name: "Freelancer Calculator", href: "/tools/rate-calculator" },
  { icon: IconChartBar, name: "Weekly Review", href: "/tools/weekly-review" },
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

        <div className="mt-6 mb-6 flex flex-col gap-5">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-center gap-4 text-[15px] text-muted"
              onClick={() => onOpenChange(false)}
            >
              <tool.icon className="h-[18px] w-[18px] shrink-0 text-teal" />
              {tool.name}
            </Link>
          ))}
        </div>

        <div className="h-px bg-border" />

        <div className="mt-auto mb-6 flex flex-col gap-3 pb-6">
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
                href="/tools/daily-planner"
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
