import Link from "next/link"
import {
  IconCalendarEvent,
  IconPlayerPlay,
  IconFlame,
  IconMarkdown,
  IconCalculator,
  IconChartBar,
  IconActivity,
} from "@tabler/icons-react"
import { TOOLS, toolCountWord } from "@/lib/tools-registry"

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "buildnscale.dev",
  url: "https://www.buildnscale.dev",
  description:
    "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more. No account required.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.buildnscale.dev/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "buildnscale.dev",
  url: "https://www.buildnscale.dev",
  logo: "https://www.buildnscale.dev/og-image.png",
  description:
    "Free productivity tools for developers. Daily planner, Pomodoro timer, habit tracker, and more.",
  founder: {
    "@type": "Person",
    name: "Muhammad Yousaf",
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are these productivity tools really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all tools on buildnscale.dev are completely free. No credit card required, no usage limits, no hidden upgrades.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account to use the tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All tools work without an account. Your data is stored locally in your browser. Sign up only if you want to sync data across devices.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private and secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Tool data stays in your browser's localStorage by default. If you sign up, it's encrypted in transit and at rest. We never sell your data.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the tools offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Since data is stored locally in your browser, most tools work offline after the initial page load.",
      },
    },
    {
      "@type": "Question",
      name: "Is buildnscale.dev open source?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the entire platform is open source. You can view, fork, and contribute on GitHub at github.com/myousafmarfani/BuildnScale.",
      },
    },
  ],
}

const tools = [
  {
    icon: IconActivity,
    name: "Downtime Detector",
    desc: "Check if any site is up now. Monitor your domains with real-time uptime graphs.",
    href: "/tools/downtime-detector",
    featured: true,
  },
  {
    icon: IconCalendarEvent,
    name: "Daily Focus Planner",
    desc: "Drag tasks into 30-min blocks. Your day, structured.",
    href: "/tools/daily-planner",
  },
  {
    icon: IconPlayerPlay,
    name: "Pomodoro + Task Log",
    desc: "25-minute focus sessions. Track output, not activity.",
    href: "/tools/pomodoro",
  },
  {
    icon: IconFlame,
    name: "Habit Streak Tracker",
    desc: "One daily check-in. Streaks that make you show up.",
    href: "/tools/habit-tracker",
  },
  {
    icon: IconMarkdown,
    name: "Markdown Notes",
    desc: "Capture thoughts fast. Markdown rendered instantly.",
    href: "/tools/markdown-notes",
  },
  {
    icon: IconCalculator,
    name: "Freelancer Rate Calculator",
    desc: "Set your hourly rate. Generate a clean PDF invoice.",
    href: "/tools/rate-calculator",
  },
  {
    icon: IconChartBar,
    name: "Weekly Review Dashboard",
    desc: "Reflect on output, streaks, and goals every Sunday.",
    href: "/tools/weekly-review",
  },
]

const steps = [
  {
    num: "01",
    title: "Add your tasks",
    desc: "Dump everything on your mind into the task inbox. No categories, no tags.",
  },
  {
    num: "02",
    title: "Block your time",
    desc: "Drag tasks into 30-min slots on the day grid. Protect your deep work.",
  },
  {
    num: "03",
    title: "Come back tomorrow",
    desc: "The planner resets each day. Unfinished tasks surface at the top.",
  },
]

const posts = [
  {
    tag: "Productivity",
    title: "Why time-blocking beats to-do lists for developers",
    excerpt: "Most dev to-do lists are graveyards. Here's why blocking time works.",
    date: "May 2026",
    read: "7 min read",
  },
  {
    tag: "Tools",
    title: "We replaced Notion daily notes with a 200-line tool",
    excerpt: "Notion is powerful. It's also overkill for a morning planning session.",
    date: "May 2026",
    read: "5 min read",
  },
  {
    tag: "Freelancing",
    title: "How to set your freelance rate in 2026",
    excerpt: "The calculator we built to answer this for ourselves — and every dev we know.",
    date: "May 2026",
    read: "9 min read",
  },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className="relative py-[100px] md:py-[100px]">
        <div className="container-site">
          <div className="grid items-center gap-16 md:grid-cols-[1.2fr_1fr]">
            <div className="hero-content">
              <span className="mb-4 flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.1em] text-teal before:h-1.5 before:w-1.5 before:rounded-full before:bg-teal before:content-['']">
                open-source · productivity tools
              </span>
              <h1 className="mb-6 font-display text-hero font-bold leading-[1.1] tracking-[-0.03em] text-fg">
                Productivity tools for developers who actually{" "}
                <span className="text-teal">ship.</span>
              </h1>
              <p className="mb-8 max-w-[440px] text-[17px] leading-relaxed text-muted">
                Free, fast, no-signup tools you&apos;ll open every morning. No Notion. No bloat. Just the tool and your tasks.
              </p>
              <div className="mb-8 flex gap-3">
                <Link
                  href="/tools/downtime-detector"
                  className="rounded-md bg-teal px-6 py-3 text-[15px] font-medium text-bg transition-all duration-180 hover:opacity-90"
                >
                  Open Downtime Detector →
                </Link>
                <Link
                  href="/tools"
                  className="rounded-md border border-border px-6 py-3 text-[15px] font-medium text-muted transition-all duration-180 hover:border-border-strong hover:text-fg"
                >
                  Browse all tools
                </Link>
              </div>
              <div className="flex gap-4 text-xs text-tertiary">
                <span>✓ No account required</span>
                <span>✓ Free forever</span>
                <span>✓ Your data stays yours</span>
              </div>
            </div>

            <div className="preview-card">
              <div className="flex items-center gap-1.5 border-b border-border bg-bg px-3 py-2">
                <span className="h-2 w-2 rounded-full" style={{ background: "#E24B4A" }} />
                <span className="h-2 w-2 rounded-full" style={{ background: "#EF9F27" }} />
                <span className="h-2 w-2 rounded-full" style={{ background: "#1D9E75" }} />
                <span className="ml-1 font-display text-[11px] text-tertiary">
                  daily-planner · today
                </span>
                <span className="ml-auto font-display text-[11px] text-amber">
                  🔥 4
                </span>
              </div>
              <div className="p-3 font-display text-[11px] text-tertiary">
                {[
                  { time: "09:00", content: null, style: null },
                  { time: "10:00", content: null, style: null },
                  { time: "10:30", content: null, style: null },
                  { time: "11:30", content: null, style: null },
                  { time: "12:00", content: null, style: null },
                ].map((slot, i) => (
                  <div
                    key={slot.time}
                    className="grid grid-cols-[48px_1fr] border-b py-1.5"
                    style={{
                      borderColor: "var(--color-border)",
                      opacity: i === 3 ? 0.5 : undefined,
                    }}
                  >
                    <span>{slot.time}</span>
                    {i === 0 && (
                      <div
                        className="rounded-sm px-2 py-0.5 text-[10px] font-medium text-fg"
                        style={{
                          background: "var(--color-info-subtle)",
                          borderLeft: "3px solid var(--color-info)",
                        }}
                      >
                        Deep work — Feature branch
                      </div>
                    )}
                    {i === 1 && (
                      <div
                        className="rounded-sm px-2 py-0.5 text-[10px]"
                        style={{
                          background: "var(--color-teal-subtle)",
                          color: "var(--color-teal)",
                          borderLeft: "2px solid var(--color-teal)",
                        }}
                      >
                        Stand-up meeting
                      </div>
                    )}
                    {i === 2 && (
                      <div
                        className="rounded-sm px-2 py-0.5 text-[10px] font-medium text-fg"
                        style={{
                          background: "var(--color-raised)",
                          borderLeft: "3px solid var(--habit-color-purple)",
                        }}
                      >
                        Design review
                      </div>
                    )}
                    {i === 3 && (
                      <div
                        className="rounded-sm px-2 py-0.5 text-[10px] font-medium text-fg/60 line-through"
                        style={{
                          background: "var(--color-teal-subtle)",
                          borderLeft: "2px solid var(--color-teal)",
                        }}
                      >
                        Write tests
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="tools">
        <div className="container-site">
          <div className="section-pad text-center">
            <span className="mb-3 block font-display text-[11px] uppercase tracking-[0.12em] text-teal">
              THE TOOL SUITE
            </span>
            <h2 className="mb-3 font-display text-4xl text-fg">
              {toolCountWord()} tools. One habit.
            </h2>
            <p className="text-base text-muted">
              Each one designed to be opened daily and closed fast.
            </p>
          </div>

          <div className="grid gap-5 pb-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => {
              const pairIndex = Math.floor(i / 2)
              const isRect = pairIndex % 2 === 0 ? i % 2 === 0 : i % 2 !== 0
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className={`group relative rounded-xl border bg-surface transition-all duration-200 hover:border-teal/50 hover:outline hover:outline-1 hover:outline-teal/20 ${
                    isRect ? "lg:col-span-2" : "lg:col-span-1"
                  } col-span-1 flex-col border-border p-6 sm:p-8`}
                >
                  <div className={`mb-5 flex ${isRect ? "h-14 w-14" : "h-12 w-12"} items-center justify-center rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 text-teal ring-1 ring-teal/10`}>
                    <tool.icon className={`${isRect ? "h-6 w-6" : "h-5 w-5"}`} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <span className="text-lg font-semibold text-fg">
                      {tool.name}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">
                      {tool.desc}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-teal opacity-0 transition-all duration-200 group-hover:opacity-100">
                      Try free
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-bg section-pad">
        <div className="container-site">
          <div className="mb-12 text-center">
            <span className="mb-3 block font-display text-[11px] uppercase tracking-[0.12em] text-teal">
              THE METHOD
            </span>
            <h2 className="font-display text-4xl text-fg">
              Three steps. Every morning.
            </h2>
          </div>
          <div className="mx-auto grid max-w-[900px] gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <span className="absolute -left-2 -top-4 font-display text-5xl font-bold text-teal opacity-[0.15]">
                  {step.num}
                </span>
                <h3 className="relative mb-2 text-lg font-medium text-fg">
                  {step.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="section-pad">
        <div className="container-site">
          <div className="mb-12 text-left">
            <span className="mb-3 block font-display text-[11px] uppercase tracking-[0.12em] text-teal">
              FROM THE BUILD LOG
            </span>
            <h2 className="mb-3 font-display text-4xl text-fg">
              Writing while building.
            </h2>
            <p className="text-base text-muted">
              Tactics, lessons, and tools for developers who ship.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.title}
                href="#"
                className="block rounded-[10px] border border-border bg-surface p-6 transition-all duration-180 hover:-translate-y-0.5 hover:border-border-strong"
              >
                <span className="mb-4 inline-block rounded-full bg-teal-subtle px-2 py-0.5 text-[10px] text-teal">
                  {post.tag}
                </span>
                <span className="mb-2 block text-[17px] font-medium leading-snug text-fg">
                  {post.title}
                </span>
                <span className="mb-5 block text-sm leading-relaxed text-tertiary">
                  {post.excerpt}
                </span>
                <div className="flex justify-between font-display text-xs text-tertiary">
                  <span>{post.date}</span>
                  <span>{post.read}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="container-site section-pad text-center">
          <span className="mb-3 block font-display text-[11px] uppercase tracking-[0.12em] text-teal">
            SHIP FASTER
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            Open-source. Free forever.{" "}
            <span className="text-teal">Your data stays yours.</span>
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-base text-muted">
            No signup walls, no data mining, no hidden tiers. Just productivity tools that respect your time and privacy.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/tools"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-teal px-8 text-sm font-medium text-bg transition-all hover:brightness-110"
            >
              Browse all tools →
            </Link>
            <Link
              href="https://github.com/myousafmarfani/BuildnScale"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-8 text-sm font-medium text-muted transition-all hover:border-neutral-700 hover:text-fg"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              Star on GitHub
            </Link>
          </div>
        </div>
      </section>

    </>
  )
}
