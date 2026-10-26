import Link from 'next/link'
import {
  IconArrowUpRight,
  IconArrowRight,
  IconCheck,
  IconBrandGithub,
  IconShieldLock,
  IconDeviceLaptop,
  IconBolt,
} from '@tabler/icons-react'
import { ToolCatalog } from '@/components/workspace/ToolCatalog'
import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BuildnScale',
  url: 'https://www.buildnscale.dev',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.buildnscale.dev/tools?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}
export default function Home() {
  const posts = getAllPosts().slice(0, 3)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="border-b border-border bg-teal-subtle"><div className="container-site flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><p>Choosing an AI model for your next build?</p><Link className="font-medium text-teal" href="/leaderboard">Explore sourced AI benchmarks →</Link></div></div>
      <section className="home-hero">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" /> YOUR NEXT
              SMALL WIN STARTS HERE
            </p>
            <h1 className="hero-title">
              Less friction.
              <br />
              More <span className="text-teal">finished.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Plan your day, protect your focus, and get the small stuff done. A
              practical toolkit for developers, freelancers, and people who
              build.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/tools">
                Find your next tool
                <IconArrowUpRight className="h-4 w-4" />
              </Link>
              <Link className="btn-secondary" href="/tools/daily-planner">
                Plan today
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
              {['Free to use', 'No signup to start', 'Open source'].map(
                (text) => (
                  <span key={text} className="flex items-center gap-1.5">
                    <IconCheck className="h-3.5 w-3.5 text-teal" />
                    {text}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="hero-workspace" aria-label="Example daily workspace">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="text-xs font-mono text-muted">
                YOUR DAILY WORKSPACE
              </span>
              <span className="rounded-full bg-teal-subtle px-2 py-1 text-[10px] text-teal">
                Example day
              </span>
            </div>
            <div className="p-5 sm:p-7">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="mb-1 text-xs text-muted">
                    A little structure goes a long way.
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Make space to build.
                  </h2>
                </div>
                <span className="text-xs text-muted">01 / 03</span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-3">
                  {[
                    [
                      '09:00',
                      'Build the next feature',
                      '90 min · Deep work',
                      'teal',
                    ],
                    ['10:30', 'A proper break', '15 min · Step away', 'amber'],
                    [
                      '11:00',
                      'Ship the small fix',
                      '30 min · Clear the queue',
                      'blue',
                    ],
                  ].map(([time, title, desc, tone]) => (
                    <div key={time} className="flex gap-3">
                      <span className="pt-3 text-[10px] font-mono text-muted">
                        {time}
                      </span>
                      <div className={`workspace-block tone-${tone}`}>
                        <p className="text-sm font-medium text-fg">{title}</p>
                        <p className="mt-1 text-[11px] text-muted">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-bg p-4">
                <div className="flex items-center gap-3">
                  <span className="focus-dot" />
                  <div>
                    <p className="text-sm font-medium">One thing at a time.</p>
                    <p className="mt-1 text-[11px] text-muted">
                      Focus mode, minus the noise.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-2xl tracking-tight text-teal">
                  25:00
                </span>
              </div>
            </div>
            <Link
              className="flex items-center justify-between border-t border-border px-5 py-4 text-xs text-teal hover:bg-raised"
              href="/tools/daily-planner"
            >
              Make it your day <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <div className="border-y border-border bg-surface">
        <div className="container-site grid gap-5 py-6 sm:grid-cols-3">
          {[
            [
              IconBolt,
              'Open it. Use it. Move on.',
              'Useful tools without setup rituals.',
            ],
            [
              IconDeviceLaptop,
              'Your browser is your workspace.',
              'Personal productivity data saves locally.',
            ],
            [
              IconShieldLock,
              'A clear choice about your data.',
              'Optional accounts for sync and monitoring.',
            ],
          ].map(([Icon, title, desc]) => {
            const I = Icon as typeof IconBolt
            return (
              <div key={String(title)} className="flex gap-3">
                <I className="mt-1 h-5 w-5 shrink-0 text-teal" />
                <div>
                  <p className="text-sm font-medium">{String(title)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {String(desc)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <section className="container-site section-pad">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">SMALL TOOLS. REAL PROGRESS.</p>
            <h2 className="section-title">What are you working on?</h2>
          </div>
          <Link href="/tools" className="text-sm text-teal">
            Your workspace <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <ToolCatalog compact />
      </section>
      <section className="border-y border-border bg-surface">
        <div className="container-site section-pad">
          <p className="eyebrow mb-3">A SIMPLE RHYTHM</p>
          <h2 className="section-title mb-10">
            From a busy day to a useful one.
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                '01',
                'Give your day a plan.',
                'Pick what matters. Put it on the calendar.',
                '/tools/daily-planner',
                'Open planner',
              ],
              [
                '02',
                'Protect a little focus.',
                'Choose one task and give it your attention.',
                '/tools/pomodoro',
                'Start a session',
              ],
              [
                '03',
                'Notice your progress.',
                'Review your work and make next week better.',
                '/tools/weekly-review',
                'Review your week',
              ],
            ].map(([num, title, desc, href, label]) => (
              <div key={num} className="workflow-card">
                <span className="text-xs font-mono text-teal">/ {num}</span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mb-6 mt-3 text-sm leading-relaxed text-muted">
                  {desc}
                </p>
                <Link className="mt-auto text-sm text-teal" href={href}>
                  {label} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-site section-pad">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow mb-3">NOTES FROM THE BUILD LOG</p>
            <h2 className="section-title">Ideas you can put to work.</h2>
          </div>
          <Link className="shrink-0 text-sm text-teal" href="/blog">
            Read all ↗
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <section className="container-site pb-20">
        <div className="open-source-banner">
          <div>
            <p className="eyebrow mb-3">BUILT IN THE OPEN</p>
            <h2 className="section-title">Help shape your everyday toolkit.</h2>
            <p className="mt-3 text-sm text-muted">
              Found friction? Missing a tool? Tell us what would help you get
              something done.
            </p>
          </div>
          <a
            href="https://github.com/myousafmarfani/BuildnScale/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary shrink-0"
          >
            <IconBrandGithub className="h-4 w-4" /> Share an idea ↗
          </a>
        </div>
      </section>
    </>
  )
}
