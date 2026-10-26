import Link from 'next/link'
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
  const snapshot =
    sources.find((s) => s.source === query.source) ||
    sources.find((s) => s.source === 'evalplus')!
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
              className={`filter-chip ${s.source === snapshot.source ? 'is-active' : ''}`}
              key={s.source}
              href={`/leaderboard/coding?source=${s.source}`}
            >
              {s.source === 'evalplus' ? 'EvalPlus' : 'Artificial Analysis'}
            </Link>
          ))}
        </nav>
      )}
      {category === 'coding' ? (
        <>
          <SnapshotNotice snapshot={snapshot} />
          <Suspense fallback={<p>Loading explorer…</p>}>
            <Explorer snapshot={snapshot} />
          </Suspense>
        </>
      ) : (
        <ValueExplorer snapshots={sources} />
      )}
    </BenchmarkShell>
  )
}
