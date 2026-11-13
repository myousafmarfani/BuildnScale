import { EvidenceJsonLd } from '@/components/benchmarks/EvidenceJsonLd'
import Link from 'next/link'
import { Suspense } from 'react'
import { getSnapshots } from '@/lib/benchmarks/data'
import { selectSnapshot } from '@/lib/benchmarks/selection.mjs'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import {
  BenchmarkShell,
  PageHeading,
  SnapshotNotice,
} from '@/components/benchmarks/Shell'
import { Explorer } from '@/components/benchmarks/Explorer'
import { CurrentCoverage } from '@/components/benchmarks/CurrentCoverage'
export const metadata = benchmarkMetadata(
  'Arena AI model leaderboard for developers',
  'Compare Arena text, web development, and agent preference ratings with source dates, confidence intervals, and historical results kept in a separate archive.',
  '/leaderboard'
)
export const revalidate = 3600
export default async function Leaderboard() {
  const snapshot = selectSnapshot(await getSnapshots())
  return (
    <BenchmarkShell>
      <PageHeading
        title="Choose with evidence."
        description="Arena's published text, web development, and agent boards for developers building applications and agents. These are preference and IPS ratings, not pass rates or a universal benchmark score. Inspect the source date and uncertainty before deciding."
      />
      {snapshot ? (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[
              [
                `${snapshot.models.length} evaluated labels`,
                'Latest imported model coverage',
              ],
              [
                'Text, web development & agents',
                'Separate source ratings, never a blended score',
              ],
              [
                'Published uncertainty',
                'Confidence intervals and counts from Arena',
              ],
            ].map(([title, text]) => (
              <div className="metric-card" key={title}>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-3 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
          <EvidenceJsonLd snapshot={snapshot} />
          <SnapshotNotice snapshot={snapshot} />
          <div className="mb-6 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/leaderboard/coding">
              Web development →
            </Link>
            <Link className="btn-secondary" href="/leaderboard/agents">
              Agent results →
            </Link>
          </div>
          <Suspense fallback={<p>Loading explorer…</p>}>
            <Explorer snapshot={snapshot} defaultMetric="arena-text" />
          </Suspense>
        </>
      ) : (
        <CurrentCoverage />
      )}
      <div className="mt-8 border-t border-border pt-6 text-sm text-muted">
        Looking for older evaluations?{' '}
        <Link href="/leaderboard/archive" className="text-teal">
          Browse the dated archive →
        </Link>
      </div>
    </BenchmarkShell>
  )
}
