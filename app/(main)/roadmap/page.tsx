import type { Metadata } from "next"
import Link from "next/link"
import { Brand } from "@/components/layout/Brand"

export const metadata: Metadata = {
  title: "Roadmap — buildnscale.dev",
  description:
    "What we've shipped at buildnscale.dev, what we're maintaining, and how we choose the next problem to solve.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Roadmap — buildnscale.dev",
    description:
      "What we've shipped at buildnscale.dev, what we're maintaining, and how we choose the next problem to solve.",
    url: "https://www.buildnscale.dev/roadmap",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    title: "Roadmap — buildnscale.dev",
    description:
      "What we've shipped at buildnscale.dev, what we're maintaining, and how we choose the next problem to solve.",
    images: ["/twitter-image"],
  },
}

const shipped = [
  {
    period: "November 2026",
    title: "Model cost calculator (open beta)",
    items: [
      {
        text: "Cost per task and month across eight models, using dated list prices and assumptions you can inspect",
        href: "/ai-costs",
      },
      {
        text: "Cache-hit, retry, long-context, and scheduled-price modelling, with no login and no saved workload",
        href: "/ai-costs",
      },
      {
        text: "A subscription sanity check that says plainly it is not a production quota",
        href: "/ai-costs",
      },
    ],
  },
  {
    period: "October – November 2026",
    title: "AI benchmarks & model research",
    items: [
      {
        text: "AI Benchmarks Leaderboard: Arena text, web development, and agent boards with source dates and confidence intervals",
        href: "/leaderboard",
      },
      {
        text: "Model pages, side-by-side comparisons, and a dated historical archive",
        href: "/compare",
      },
      {
        text: "Benchmark methodology, interpretation notes, and an update history",
        href: "/leaderboard/methodology",
      },
      {
        text: "Scheduled freshness checks with validation and an explicit fallback when the source is unavailable",
        href: "/leaderboard/changelog",
      },
    ],
  },
  {
    period: "May – June 2026",
    title: "Accounts, sync & site monitoring",
    items: [
      {
        text: "Email/password and Google accounts, a personal dashboard, settings, and account deletion",
        href: "/dashboard",
      },
      {
        text: "Optional cloud sync for supported tool data, with local data kept when it conflicts",
      },
      {
        text: "Downtime Detector: server-side checks, saved monitors, response history, and 30-day summaries",
        href: "/tools/downtime-detector",
      },
    ],
  },
  {
    period: "2026",
    title: "The eight-tool workspace",
    items: [
      {
        text: "Daily Focus Planner, Pomodoro + Task Log, Markdown Notes, JSON Toolkit, Downtime Detector, Rate Calculator, Habit Streak Tracker, and Weekly Review",
        href: "/tools",
      },
      {
        text: "Shared search, favorites, recent tools, a collapsible sidebar, and mobile navigation",
        href: "/tools",
      },
      {
        text: "Browser-data backup and restore, plus CSV and print/PDF exports where they matter",
        href: "/tools#workspace-data",
      },
      {
        text: "Build log, author pages, and a writer contribution page",
        href: "/blog",
      },
    ],
  },
]

const ongoing = [
  "Keep benchmark snapshots source-dated, attributed, and honest about uncertainty — including when a source goes stale.",
  "Fix tool reliability, accessibility, and narrow-screen issues as they are reported.",
  "Keep local data, exports, backups, and optional sync portable and easy to leave with.",
  "Document how the platform works, including its limits, instead of implying coverage we do not have.",
]

const criteria = [
  "The problem is recurring and expensive, not a one-off annoyance.",
  "People already pay for a fix or cobble together a workaround.",
  "We can reach the people who have the problem and test the solution honestly.",
  "A useful first version is possible without a data, trust, or dark-pattern compromise.",
  "We can measure activation and repeat use, not just launch-day traffic.",
]

export default function RoadmapPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <Brand className="mx-auto mb-12 w-fit" />

      <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">Roadmap</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-tertiary">
        What we&apos;ve shipped, what we&apos;re maintaining, and how we choose what comes
        next. Last updated <time dateTime="2026-11-13">November 13, 2026</time>.
      </p>

      <section className="mt-10" aria-labelledby="shipped-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="shipped-heading" className="font-display text-lg font-semibold text-fg">
            Shipped
          </h2>
          <span className="text-2xs font-medium uppercase tracking-wider text-teal">
            Live
          </span>
        </div>

        <div className="space-y-5">
          {shipped.map((group) => (
            <div key={group.title} className="rounded-xl border border-border p-6">
              <p className="text-2xs font-medium uppercase tracking-wider text-tertiary">
                {group.period}
              </p>
              <h3 className="mt-1 font-display text-base font-semibold text-fg">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal/60" />
                    <span>
                      {item.text}
                      {item.href ? (
                        <>
                          {" "}
                          <Link href={item.href} className="text-teal no-underline">
                            Open →
                          </Link>
                        </>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="ongoing-heading">
        <div className="rounded-xl border border-border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="ongoing-heading" className="font-display text-lg font-semibold text-fg">
              Ongoing
            </h2>
            <span className="text-2xs font-medium uppercase tracking-wider text-amber">
              Maintenance
            </span>
          </div>
          <ul className="space-y-2.5">
            {ongoing.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber/60" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="next-heading">
        <div className="rounded-xl border border-border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="next-heading" className="font-display text-lg font-semibold text-fg">
              Next
            </h2>
            <span className="text-2xs font-medium uppercase tracking-wider text-tertiary">
              Under research
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            We are not publishing another dated feature list yet. The last roadmap assumed
            what people wanted; this time we are validating the problem first with
            developers, freelancers, and technical founders. The model cost calculator is
            the first test. Whether it becomes a larger product, stays a small reference,
            or is removed depends on usage, interviews, and whether people come back. We
            will publish the next plan only after the pain, the current workaround, and
            willingness to use a solution are confirmed.
          </p>

          <p className="mt-5 text-2xs font-medium uppercase tracking-wider text-tertiary">
            What we need to see before committing
          </p>
          <ul className="mt-3 space-y-2.5">
            {criteria.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal/60" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="parked-heading">
        <div className="rounded-xl border border-border p-6">
          <h2 id="parked-heading" className="font-display text-lg font-semibold text-fg">
            Parked, not scheduled
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            These appeared on earlier roadmaps but are not committed. Some were
            assumptions, not validated demand. They stay here until there is evidence that
            people would use them.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-tertiary">
            <li>Team workspaces and real-time collaboration</li>
            <li>Native iOS and Android apps</li>
            <li>Public profiles and social features</li>
            <li>API and webhooks for tool automation</li>
            <li>Individual tool requests such as a week calendar view, timer sounds, or habit exports</li>
          </ul>
        </div>
      </section>

      <p className="mt-10 text-center text-sm text-tertiary">
        Have a problem worth solving?{" "}
        <a
          href="https://github.com/myousafmarfani/BuildnScale/issues"
          className="text-teal no-underline"
        >
          Open an issue on GitHub
        </a>{" "}
        and describe what you currently do instead.
      </p>
    </main>
  )
}
