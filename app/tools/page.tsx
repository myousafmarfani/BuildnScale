"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconCalendarEvent,
  IconPlayerPlay,
  IconFlame,
  IconFileText,
  IconCurrencyDollar,
  IconChartBar,
  IconActivity,
  IconBrandGithub,
  IconGitBranch,
  IconMail,
} from "@tabler/icons-react"
import { Nav } from "@/components/layout/Nav"
import { Footer } from "@/components/layout/Footer"
import { cn } from "@/lib/utils"

const FILTERS = [
  { key: "all", label: "All" },
  { key: "daily", label: "Daily use" },
  { key: "weekly", label: "Weekly" },
  { key: "freelancers", label: "For Freelancers" },
  { key: "devs", label: "For Devs" },
] as const

type FilterKey = (typeof FILTERS)[number]["key"]

const TOOLS = [
  {
    id: "downtime-detector",
    name: "Downtime Detector",
    href: "/tools/downtime-detector",
    icon: IconActivity,
    category: "devs" as const,
    badge: "For Devs",
    description:
      "Check if any site is up right now. Monitor your own domains with real-time uptime graphs and multi-region checks.",
    tags: ["Multi-region", "SSL check", "Response time"],
  },
  {
    id: "daily-planner",
    name: "Daily Focus Planner",
    href: "/tools/daily-planner",
    icon: IconCalendarEvent,
    category: "daily" as const,
    badge: "Daily use",
    description:
      "Drag tasks into 30-min time blocks on a vertical day grid. Protect your deep work without complex project tools.",
    tags: ["localStorage", "No login", "Cloud sync"],
  },
  {
    id: "pomodoro",
    name: "Pomodoro + Task Log",
    href: "/tools/pomodoro",
    icon: IconPlayerPlay,
    category: "daily" as const,
    badge: "Daily use",
    description:
      "25-minute focus sessions with automatic breaks. Logs every session with task metadata so you track actual output.",
    tags: ["Session log", "Daily stats", "Export CSV"],
  },
  {
    id: "habit-tracker",
    name: "Habit Streak Tracker",
    href: "/tools/habit-tracker",
    icon: IconFlame,
    category: "daily" as const,
    badge: "Daily use",
    description:
      "Visualise consistency with a contribution-style heatmap. Simple streaks that stick.",
    tags: ["Heatmap", "Unlimited habits", "Streak alert"],
  },
  {
    id: "markdown-notes",
    name: "Markdown Notes",
    href: "/tools/markdown-notes",
    icon: IconFileText,
    category: "devs" as const,
    badge: "Daily use",
    description:
      "Distraction-free markdown editor with live preview. Perfect for fast capture, dev notes, and build logs.",
    tags: ["Syntax highlight", "Auto-save", "Live preview"],
  },
  {
    id: "rate-calculator",
    name: "Freelancer Rate Calculator",
    href: "/tools/rate-calculator",
    icon: IconCurrencyDollar,
    category: "freelancers" as const,
    badge: "For Freelancers",
    description:
      "Calculate your ideal hourly rate based on income, expenses, and billable weeks. Generate client-ready PDF invoices instantly.",
    tags: ["Sliders", "Breakdown", "PDF invoice"],
  },
  {
    id: "weekly-review",
    name: "Weekly Review Dashboard",
    href: "/tools/weekly-review",
    icon: IconChartBar,
    category: "weekly" as const,
    badge: "Weekly",
    description:
      "Aggregate your focus time, task completions, and habit scores. Weekly reflections help you stay intentional about your work.",
    tags: ["Cross-tool stats", "Bar chart", "CSV export"],
  },
]

export default function ToolsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")

  const filteredTools =
    activeFilter === "all"
      ? TOOLS
      : TOOLS.filter((t) => t.category === activeFilter)

  return (
    <>
      <Nav />
      {/* Header */}
      <section className="border-b border-border px-5 section-pad text-center">
        <div className="mx-auto max-w-[1000px]">
          <span className="mb-3 block font-display text-[11px] uppercase tracking-[0.12em] text-teal">
            TOOL SUITE
          </span>
          <h1 className="font-display text-[48px] font-bold tracking-[-0.03em] text-fg">
            Tools that work daily.
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-[1.65] text-muted">
            Seven free productivity tools for developers and remote workers. No account required. No bloat. Just open and use.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8 text-xs text-tertiary">
            <span>7 tools</span>
            <span className="text-border">•</span>
            <span>Free forever</span>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[52px] z-10 border-b border-border bg-bg">
        <div className="mx-auto flex max-w-[1000px] items-center px-5 py-2.5">
          <div className="flex gap-2 scrollbar-x">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs transition-all",
                  activeFilter === f.key
                    ? "bg-teal font-medium text-bg"
                    : "border border-border bg-raised text-muted hover:text-fg"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Grid */}
      <section className="mx-auto max-w-[1060px] px-5 section-pad">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {filteredTools.map((tool, i) => {
            const pairIndex = Math.floor(i / 2)
            const isRect = pairIndex % 2 === 0 ? i % 2 === 0 : i % 2 !== 0
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group relative rounded-xl border border-border bg-surface transition-all duration-200 hover:border-teal/50 hover:outline hover:outline-1 hover:outline-teal/20 ${
                  isRect ? "md:col-span-2" : "md:col-span-1"
                } flex-col p-6 sm:p-8`}
              >
                <div className={`mb-5 flex ${isRect ? "h-14 w-14" : "h-12 w-12"} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 text-teal ring-1 ring-teal/10`}>
                  <tool.icon className={`${isRect ? "h-6 w-6" : "h-5 w-5"}`} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-lg font-semibold text-fg">
                        {tool.name}
                      </span>
                      <span className="ml-3 inline-block rounded-full bg-teal/10 px-2.5 py-0.5 text-[11px] font-medium text-teal">
                        {tool.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-border bg-raised px-2.5 py-1 text-[11px] font-medium text-tertiary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-teal opacity-0 transition-all duration-200 group-hover:opacity-100">
                      Try free
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="py-16 text-center font-mono text-sm text-tertiary">
            No tools match this filter yet. Try a different category.
          </div>
        )}
      </section>

      {/* Coming Soon */}
      <section className="mx-auto max-w-[1000px] px-5">
        <div className="relative mb-6 text-center font-display text-[11px] tracking-[0.1em] text-tertiary before:absolute before:left-0 before:top-1/2 before:h-px before:w-[35%] before:bg-border after:absolute after:right-0 after:top-1/2 after:h-px after:w-[35%] after:bg-border">
          COMING SOON
        </div>

        <div className="mb-20 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: IconGitBranch,
              name: "Git Activity Dashboard",
              date: "Coming Q3 2026",
            },
            {
              icon: IconMail,
              name: "Email Digest Builder",
              date: "Coming Q3 2026",
            },
            {
              icon: IconCurrencyDollar,
              name: "MRR Tracker",
              date: "Coming Q3 2026",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-lg border border-dashed border-border bg-bg p-5 opacity-60"
            >
              <item.icon className="h-6 w-6 text-tertiary" />
              <span className="mt-3 block text-sm text-tertiary">
                {item.name}
              </span>
                  <span className="text-xs text-tertiary">
                {item.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="border-y border-border bg-surface px-5 section-pad text-center">
        <div className="mx-auto max-w-[1000px]">
          <h2 className="font-display text-[28px] text-fg">
            Want early access?
          </h2>
          <p className="mb-6 text-sm text-muted">
            Star the repo or join the waitlist for upcoming features.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://github.com/myousafmarfani/BuildnScale"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm text-muted transition-all hover:text-fg"
            >
              <IconBrandGithub className="h-4 w-4" /> Star on GitHub
            </a>
            <a
              href="#"
              className="rounded-md bg-teal px-6 py-3 text-sm font-medium text-bg transition-all hover:brightness-110"
            >
              Join waitlist →
            </a>
          </div>
          </div>
        </section>
        <Footer />
      </>
    )
  }
