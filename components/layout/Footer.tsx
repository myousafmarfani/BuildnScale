import Link from "next/link"
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-site px-5 py-16">
        <div className="mb-12 grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-sm font-semibold text-fg">
              build<span className="text-teal">n</span>scale
            </Link>
            <span className="mt-3 block text-sm text-tertiary">
              Tools for developers who ship.
            </span>
            <div className="mt-4 flex gap-3">
              <a href="https://github.com/myousafmarfani/BuildnScale" target="_blank" rel="noopener noreferrer" className="text-tertiary transition-colors hover:text-fg" aria-label="GitHub">
                <IconBrandGithub className="h-5 w-5" />
              </a>
              <a href="#" className="text-tertiary transition-colors hover:text-fg" aria-label="X">
                <IconBrandX className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <span className="font-display mb-4 block text-[11px] uppercase tracking-[0.1em] text-tertiary">
              Tools
            </span>
            <div className="flex flex-col gap-2.5">
              <Link href="/tools/daily-planner" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Daily Planner
              </Link>
              <Link href="/tools/pomodoro" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Pomodoro
              </Link>
              <Link href="/tools/habit-tracker" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Habit Tracker
              </Link>
              <Link href="/tools/markdown-notes" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Markdown Notes
              </Link>
              <Link href="/tools/rate-calculator" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Rate Calculator
              </Link>
              <Link href="/tools/weekly-review" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Weekly Review
              </Link>
            </div>
          </div>

          <div>
            <span className="font-display mb-4 block text-[11px] uppercase tracking-[0.1em] text-tertiary">
              Company
            </span>
            <div className="flex flex-col gap-2.5">
              <Link href="/blog" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Blog
              </Link>
              <Link href="/roadmap" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Roadmap
              </Link>
              <Link href="/changelog" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Changelog
              </Link>
            </div>
          </div>

          <div>
            <span className="font-display mb-4 block text-[11px] uppercase tracking-[0.1em] text-tertiary">
              Legal
            </span>
            <div className="flex flex-col gap-2.5">
              <Link href="/privacy" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted transition-colors duration-150 hover:text-fg">
                Cookies
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border-t border-border pt-6 text-xs text-tertiary md:flex-row">
          <span>© 2026 buildnscale.dev · Built by <a href="https://github.com/myousafmarfani" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-fg transition-colors">Muhammad Yousaf</a></span>
          <div className="flex gap-4">
            <a href="https://github.com/myousafmarfani/BuildnScale/graphs/contributors" target="_blank" rel="noopener noreferrer" className="hover:text-muted transition-colors">Contributors</a>
            <span>All tools free.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
