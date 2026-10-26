import Link from 'next/link'
import { selectSnapshot } from '@/lib/benchmarks/selection.mjs'
import { CurrentCoverage } from '@/components/benchmarks/CurrentCoverage'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getSnapshots } from '@/lib/benchmarks/data'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import {
  BenchmarkShell,
  PageHeading,
  SnapshotNotice,
} from '@/components/benchmarks/Shell'
import { Explorer } from '@/components/benchmarks/Explorer'
import { ValueExplorer } from '@/components/benchmarks/ValueExplorer'
export const revalidate = 3600
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  if (!['coding', 'value'].includes(category)) notFound()
  return benchmarkMetadata(
    category === 'value'
      ? 'AI model pricing and performance'
      : 'AI coding benchmark leaderboard',
    category === 'value'
      ? 'Estimate token costs using verified prices, with explicit assumptions and quality benchmarks kept separate.'
      : 'Compare AI coding results by benchmark, evaluated model label, and prompting mode with source provenance.',
    `/leaderboard/${category}`
  )
}
export default async function Category({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { category } = await params
  if (!['coding', 'value'].includes(category)) notFound()
  const sources = await getSnapshots(),
    query = await searchParams
  const snapshot = selectSnapshot(sources, query.source)
  return (
    <BenchmarkShell
      active={category === 'value' ? 'Price & performance' : 'Coding'}
    >
      <PageHeading
        title={
          category === 'value' ? 'Know the tradeoffs.' : 'Coding, measured.'
        }
        description={
          category === 'value'
            ? 'Estimate workload costs with explicit token assumptions. Prices and benchmark scores answer different questions; compare both before choosing.'
            : 'Inspect results for a specific evaluation. Source coverage, test suite, and prompting configuration matter as much as the score.'
        }
      />
      {category === 'coding' && sources.length > 1 && (
        <nav aria-label="Data source" className="mb-5 flex gap-3">
          {sources.map((s) => (
            <Link
              className={`filter-chip ${s.source === snapshot?.source ? 'is-active' : ''}`}
              key={s.source}
              href={`/leaderboard/coding?source=${s.source}`}
            >
              {s.source === 'evalplus'
                ? 'EvalPlus archive (2024)'
                : 'Latest imported results'}
            </Link>
          ))}
        </nav>
      )}
      {category === 'coding' ? (
        snapshot ? (
          <>
            <SnapshotNotice snapshot={snapshot} />
            <Suspense fallback={<p>Loading explorer…</p>}>
              <Explorer snapshot={snapshot} defaultMetric="aa-coding" />
            </Suspense>
          </>
        ) : (
          <CurrentCoverage />
        )
      ) : (
        <>
          {sources
            .filter((s) => s.source === 'artificial-analysis')
            .map((s) => (
              <SnapshotNotice key={s.source} snapshot={s} />
            ))}
          <ValueExplorer snapshots={sources} />
        </>
      )}
    </BenchmarkShell>
  )
}
