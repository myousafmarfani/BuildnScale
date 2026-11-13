import { getHistory } from '@/lib/benchmarks/data'
import { dateLabel } from '@/lib/benchmarks/catalog'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import { BenchmarkShell, PageHeading } from '@/components/benchmarks/Shell'
export const metadata = benchmarkMetadata(
  'AI benchmark update history',
  'Inspect published benchmark snapshots, source revisions, retrieval dates, and data coverage changes.',
  '/leaderboard/changelog'
)
export const revalidate = 3600
export default async function History() {
  const history = await getHistory()
  return (
    <BenchmarkShell active="Updates">
      <PageHeading
        title="A record you can inspect."
        description="Published source snapshots and product changes. Retrieval dates describe when BuildnScale imported data, not when models were evaluated."
      />
      <div className="max-w-3xl space-y-5">
        {history.map((s, i) => (
          <article
            className="rounded-xl border border-border bg-surface p-6"
            key={`${s.sourceRevision}-${i}`}
          >
            <p className="eyebrow">IMPORTED {dateLabel(s.retrievedAt)}</p>
            <h2 className="mt-4 text-xl font-semibold">
              {s.source === 'evalplus'
                ? 'EvalPlus coding snapshot'
                : s.source === 'arena' ? 'Arena published dataset' : 'Artificial Analysis snapshot'}
            </h2>
            <p className="mt-3 text-sm text-muted">
              {s.models.length} evaluated labels · Source updated{' '}
              {dateLabel(s.sourceUpdatedAt)} · {s.license} ·{' '}
              {s.storage === 'bundled'
                ? 'Bundled fallback'
                : s.storage === 'database'
                  ? 'Stored database snapshot'
                  : 'Snapshot'}
            </p>
            <p className="mt-3 break-all font-mono text-xs text-muted">
              Revision: {s.sourceRevision}
            </p>
            <a
              className="mt-4 inline-block text-sm text-teal"
              href={s.sourceURL}
            >
              Inspect source ↗
            </a>
          </article>
        ))}
        <article className="rounded-xl border border-border p-6">
          <p className="eyebrow">9 NOVEMBER 2026 / METHODOLOGY 2.1</p>
          <h2 className="mt-4 text-xl font-semibold">
            Freshness monitoring and Arena-first scope
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Scheduled imports now fail loudly when disabled or missing a secret,
            and a separate hourly check alerts when the public snapshot is more
            than eight hours old. Bundled fallbacks are labeled in the interface,
            the web development board is no longer presented as a coding pass
            rate, and the leaderboard describes itself as Arena&apos;s published
            preference and IPS boards rather than a universal benchmark.
          </p>
        </article>
        <article className="rounded-xl border border-border p-6">
          <p className="eyebrow">27 OCTOBER 2026 / METHODOLOGY 2.0</p>
          <h2 className="mt-4 text-xl font-semibold">
            Arena open dataset becomes the default source
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Current rankings moved to Arena&apos;s official open leaderboard
            dataset with validated four-hour refresh support. The historical
            EvalPlus results moved to a separate archive, confidence intervals
            became visible for every ranking, and stored revisions gained an
            inspectable update history.
          </p>
        </article>
        <article className="rounded-xl border border-border p-6">
          <p className="eyebrow">26 OCTOBER 2026 / METHODOLOGY 1.0</p>
          <h2 className="mt-4 text-xl font-semibold">
            Developer benchmark explorer introduced
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Coding leaderboards, model profiles, comparisons, source evidence,
            benchmark explainers, and pricing coverage status. Initial results
            are historical third-party measurements; no original evaluations or
            community votes are claimed.
          </p>
        </article>
      </div>
    </BenchmarkShell>
  )
}
