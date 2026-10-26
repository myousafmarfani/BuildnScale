import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Snapshot } from '@/lib/benchmarks/types'
import { dateLabel } from '@/lib/benchmarks/catalog'
import { isStale, arenaFreshness } from '@/lib/benchmarks/core.mjs'
export function BenchmarkShell({
  children,
  active = 'Overview',
}: {
  children: ReactNode
  active?: string
}) {
  return (
    <main className="container-site pb-20 pt-8 sm:pt-12">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <Link href="/leaderboard" className="eyebrow">
          BUILDNSCALE / AI BENCHMARKS
        </Link>
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
          Evidence for your next build
        </span>
      </div>
      <nav
        aria-label="Benchmark navigation"
        className="mb-10 flex flex-wrap gap-2 border-b border-border pb-4"
      >
        {[
          ['/leaderboard', 'Overview'],
          ['/leaderboard/coding', 'Coding'],
          ['/leaderboard/agents', 'Agents'],
          ['/leaderboard/value', 'Price & performance'],
          ['/models', 'Models'],
          ['/compare', 'Compare'],
          ['/leaderboard/methodology', 'Methodology'],
          ['/leaderboard/changelog', 'Updates'],
          ['/leaderboard/archive', 'Archive'],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={active === label ? 'page' : undefined}
            className={`filter-chip ${active === label ? 'is-active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {children}
      <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-border pt-6 text-sm text-muted">
        <p>Published evidence. Clear sources. No sponsored rank placement.</p>
        <Link className="text-teal" href="/leaderboard/methodology">
          How to read these results →
        </Link>
      </div>
    </main>
  )
}
export function SnapshotNotice({ snapshot }: { snapshot: Snapshot }) {
  const arena = snapshot.source === 'arena'
  const checkedAt = snapshot.lastCheckedAt || snapshot.retrievedAt
  const { checkOverdue: overdue, publicationOld: oldPublication } = arenaFreshness(snapshot)
  const stale = arena ? overdue || oldPublication : isStale(snapshot.sourceUpdatedAt)
  return (
    <aside
      className={`mb-7 rounded-xl border p-4 text-sm leading-relaxed ${stale ? 'border-amber/40 bg-amber/5' : 'border-border bg-surface'}`}
      aria-label="Data provenance"
    >
      <p className="font-medium">
        {snapshot.source === 'evalplus'
          ? 'Historical EvalPlus snapshot'
          : arena ? 'Arena published dataset' : 'Artificial Analysis snapshot'}{' '}
        · source published (oldest included board) {dateLabel(snapshot.sourceUpdatedAt)}
      </p>
      <p className="mt-1 text-muted">
        {snapshot.source === 'evalplus'
          ? 'Coverage reflects this archived source, not today’s frontier or model availability. Scores are imported, not tested by BuildnScale.'
          : arena ? 'Latest published overall boards for text, web development, and agents. Each rating has its own scale and publication date. Results are imported, not evaluated by BuildnScale.' : 'Scores reflect the selected source index and configuration, not a universal ranking.'}{' '}
        {arena ? <> {overdue && 'Update check overdue: no successful source check in the last eight hours. Displaying the last validated snapshot.'} {oldPublication && 'At least one board was published more than seven days ago; a recent check does not make those measurements new.'}</> : stale && 'Source is older than 30 days or its update date is unavailable.'}
      </p>
      <p className="mt-2 text-xs text-muted">
        Retrieved {dateLabel(snapshot.retrievedAt)} · Last successful check {new Date(checkedAt).toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC')} ·{' '}
        <a
          className="text-teal underline underline-offset-4"
          href={snapshot.sourceURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View exact source ↗
        </a>{' '}
        · {arena ? <a className="text-teal underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> : snapshot.license}
        {snapshot.indexVersion && ` · Index version ${snapshot.indexVersion}`}
      </p>
      {arena && <p className="mt-2 text-xs text-muted">{snapshot.attribution}</p>}
    </aside>
  )
}
export function PageHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <h1 className="section-title sm:text-5xl">{title}</h1>
      <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
        {description}
      </p>
    </div>
  )
}
