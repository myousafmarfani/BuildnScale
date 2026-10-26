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
  'AI benchmarks for developers',
  'Compare the latest imported AI model benchmark scores, prices, and performance, with source dates and historical results kept in a separate archive.',
  '/leaderboard'
)
export const revalidate = 3600
export default async function Leaderboard() {
  const snapshot = selectSnapshot(await getSnapshots())
  return (
    <BenchmarkShell>
      <PageHeading
        title="Choose with evidence."
        description="AI model benchmarks for developers building applications and agents. Compare the latest published snapshot, inspect its source, and weigh quality against price and speed."
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
                'Quality, cost & speed',
                'Source-reported measurements, kept separate',
              ],
              [
                `Index version ${snapshot.indexVersion}`,
                'Comparable within the recorded source version',
              ],
            ].map(([title, text]) => (
              <div className="metric-card" key={title}>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-3 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
          <SnapshotNotice snapshot={snapshot} />
          <div className="mb-6 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/leaderboard/coding">
              Coding benchmarks →
            </Link>
            <Link className="btn-secondary" href="/leaderboard/value">
              Compare workload costs →
            </Link>
          </div>
          <Suspense fallback={<p>Loading explorer…</p>}>
            <Explorer snapshot={snapshot} defaultMetric="aa-intelligence" />
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
