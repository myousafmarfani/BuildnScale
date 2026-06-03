import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Changelog — buildnscale.dev",
  description: "Release notes and updates for buildnscale.dev. Track every version from pre-release to launch.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Changelog — buildnscale.dev",
    description: "Release notes and updates for buildnscale.dev.",
    url: "https://buildnscale.dev/changelog",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    title: "Changelog — buildnscale.dev",
    description: "Release notes and updates for buildnscale.dev.",
    images: ["/twitter-image"],
  },
}

const releases = [
  {
    version: "1.0.0",
    date: "May 28, 2026",
    tag: "Launch",
    tagColor: "text-teal",
    changes: [
      "Full theme system with dark and light mode",
      "User authentication with email/password and Google OAuth",
      "Seven productivity tools: Daily Planner, Pomodoro Timer, Habit Tracker, Markdown Notes, Rate Calculator, Weekly Review, Downtime Detector",
      "Dashboard for authenticated users",
      "Privacy Policy, Terms of Service, Roadmap, and Changelog pages",
      "Responsive design with mobile navigation sheet",
    ],
  },
  {
    version: "0.5.0",
    date: "May 15, 2026",
    tag: "Beta",
    tagColor: "text-amber",
    changes: [
      "Habit Tracker: active streak calculation and weekly heatmap",
      "Pomodoro: session logging with start/end timestamps",
      "Markdown Notes: auto-save with debounce and word count",
      "Daily Planner: drag-and-drop time block reordering",
      "Settings panels added to all tools (UI shell)",
    ],
  },
  {
    version: "0.4.0",
    date: "April 28, 2026",
    tag: "Beta",
    tagColor: "text-amber",
    changes: [
      "Rate Calculator: hourly/monthly/annual rate conversions",
      "Weekly Review: guided reflection prompts",
      "Footer with tool links and social icons",
      "Pricing page layout with feature comparison",
    ],
  },
  {
    version: "0.3.0",
    date: "April 10, 2026",
    tag: "Alpha",
    tagColor: "text-tertiary",
    changes: [
      "Blog page with MDX article support",
      "Pomodoro: basic timer with start/pause/reset",
      "Habit Tracker: habit creation and daily check-off",
      "Daily Planner: hourly time blocks",
    ],
  },
  {
    version: "0.2.0",
    date: "March 22, 2026",
    tag: "Alpha",
    tagColor: "text-tertiary",
    changes: [
      "Landing page with tool showcase",
      "Tailwind CSS theme with dark-first design tokens",
      "Navigation bar with tools dropdown",
      "Mobile responsive sheet navigation",
    ],
  },
  {
    version: "0.1.0",
    date: "March 1, 2026",
    tag: "Pre-release",
    tagColor: "text-tertiary",
    changes: [
      "Initial Next.js 14.2 project scaffold",
      "Font setup (DM Sans + JetBrains Mono)",
      "Basic route structure with route groups",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <Link
        href="/"
        className="font-display mx-auto mb-12 block w-fit text-base font-semibold text-fg no-underline"
      >
        build<span className="text-teal">n</span>scale
      </Link>

      <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">Changelog</h1>
      <p className="mt-2 text-sm text-tertiary">
        Every release, documented. Follow along on{" "}
        <a
          href="https://github.com/anomalyco/buildnscale"
          className="text-teal no-underline"
        >
          GitHub
        </a>
        .
      </p>

      <div className="mt-10 space-y-8">
        {releases.map((release) => (
          <div key={release.version} className="border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-fg">
                  v{release.version}
                </h2>
                <p className="text-xs text-tertiary mt-0.5">{release.date}</p>
              </div>
              <span className={`text-2xs font-medium uppercase tracking-wider ${release.tagColor}`}>
                {release.tag}
              </span>
            </div>
            <ul className="space-y-2">
              {release.changes.map((change) => (
                <li key={change} className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal/60" />
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  )
}
