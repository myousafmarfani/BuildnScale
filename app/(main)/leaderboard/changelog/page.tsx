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
                : 'Artificial Analysis snapshot'}
            </h2>
            <p className="mt-3 text-sm text-muted">
              {s.models.length} evaluated labels · Source updated{' '}
              {dateLabel(s.sourceUpdatedAt)} · {s.license}
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
