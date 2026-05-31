import Link from "next/link"
import {
  IconCalendarEvent,
  IconPlayerPlay,
  IconFlame,
  IconMarkdown,
  IconCalculator,
  IconChartBar,
} from "@tabler/icons-react"

const tools = [
  {
    icon: IconCalendarEvent,
    name: "Daily Focus Planner",
    desc: "Drag tasks into 30-min blocks. Your day, structured.",
    href: "/tools/daily-planner",
    featured: true,
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

const stats = [
  { num: "2,841", label: "developers using daily" },
  { num: "94%", label: "return after day 3" },
  { num: "4.8/5", label: "avg rating on ProductHunt" },
  { num: "0", label: "required fields to start" },
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
                  href="/tools/daily-planner"
                  className="rounded-md bg-teal px-6 py-3 text-[15px] font-medium text-bg transition-all duration-180 hover:opacity-90"
                >
                  Open Daily Planner →
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
              Six tools. One habit.
            </h2>
            <p className="text-base text-muted">
              Each one designed to be opened daily and closed fast.
            </p>
          </div>

          <div className="grid gap-4 pb-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="block rounded-lg border border-border bg-surface p-5 transition-all duration-180 hover:-translate-y-0.5 hover:border-border-strong"
                style={tool.featured ? { borderColor: "var(--color-teal)" } : undefined}
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[8px] bg-raised text-teal">
                  <tool.icon className="h-[18px] w-[18px]" />
                </div>
                <span className="mb-1.5 block text-[15px] font-medium text-fg">
                  {tool.name}
                </span>
                <span className="mb-4 block text-sm leading-relaxed text-tertiary">
                  {tool.desc}
                </span>
                <span className="text-sm text-teal">Try free →</span>
              </Link>
            ))}
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

      <section className="border-b border-border bg-surface py-12">
        <div className="container-site">
          <div className="grid grid-cols-2 text-center md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.num}>
                <span className="block font-display text-[32px] text-teal">
                  {stat.num}
                </span>
                <span className="text-sm text-tertiary">{stat.label}</span>
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


    </>
  )
}
