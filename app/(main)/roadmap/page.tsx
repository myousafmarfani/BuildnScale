import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Roadmap — buildnscale.dev",
  description: "What we're building next at buildnscale.dev. See upcoming features, mobile apps, API, and more.",
  openGraph: {
    title: "Roadmap — buildnscale.dev",
    description: "What we're building next at buildnscale.dev.",
    url: "https://buildnscale.dev/roadmap",
    images: ["/opengraph-image"],
  },
  twitter: {
    title: "Roadmap — buildnscale.dev",
    description: "What we're building next at buildnscale.dev.",
  },
}

const items = [
  {
    quarter: "Q2 2026",
    status: "In progress",
    color: "text-amber",
    items: [
      "User accounts & cloud sync",
      "Team workspaces",
      "Time-blocking calendar view for Daily Planner",
      "Habit Tracker: export CSV / JSON",
    ],
  },
  {
    quarter: "Q3 2026",
    status: "Planned",
    color: "text-teal",
    items: [
      "Mobile apps (iOS / Android)",
      "Pomodoro: customizable timer durations & sounds",
      "Weekly Review: personal OKR integration",
      "Rate Calculator: invoice PDF export",
    ],
  },
  {
    quarter: "Q4 2026",
    status: "Planned",
    color: "text-teal",
    items: [
      "API & webhooks for tool automation",
      "Dark mode refinements & theme editor",
      "Markdown Notes: real-time collaboration",
      "Public profile pages",
    ],
  },
  {
    quarter: "2027",
    status: "Future",
    color: "text-tertiary",
    items: [
      "VS Code extension",
      "AI-powered daily standup summaries",
      "Browser extension for quick capture",
      "Self-hosted option",
    ],
  },
]

export default function RoadmapPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <Link
        href="/"
        className="font-display mx-auto mb-12 block w-fit text-base font-semibold text-fg no-underline"
      >
        build<span className="text-teal">n</span>scale
      </Link>

      <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">Roadmap</h1>
      <p className="mt-2 text-sm text-tertiary">
        What we&apos;re building next. Priorities shift — this is our best guess.
      </p>

      <div className="mt-10 space-y-8">
        {items.map((section) => (
          <div key={section.quarter} className="border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-fg">{section.quarter}</h2>
              <span className={`text-2xs font-medium uppercase tracking-wider ${section.color}`}>
                {section.status}
              </span>
            </div>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-tertiary">
        Have a feature request?{" "}
        <a
          href="https://github.com/anomalyco/buildnscale/issues"
          className="text-teal no-underline"
        >
          Open an issue on GitHub
        </a>
      </p>
    </main>
  )
}
