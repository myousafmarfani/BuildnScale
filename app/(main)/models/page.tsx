import { Suspense } from 'react'
import Link from 'next/link'
import { getSnapshots } from '@/lib/benchmarks/data'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import {
  BenchmarkShell,
  PageHeading,
  SnapshotNotice,
} from '@/components/benchmarks/Shell'
import { Explorer } from '@/components/benchmarks/Explorer'
export const metadata = benchmarkMetadata(
  'AI model benchmark catalog',
  'Browse evaluated AI model labels, inspect source evidence, and select models for comparison.',
  '/models'
)
export const revalidate = 3600
export default async function Models({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sources = await getSnapshots(),
    query = await searchParams
  const snapshot =
    sources.find((s) => s.source === query.source) ||
    sources.find((s) => s.source === 'evalplus')!
  return (
    <BenchmarkShell active="Models">
      <PageHeading
        title="Meet the evaluated models."
        description="Exact labels from the selected evaluator. Historical model labels are preserved; availability, licenses, and current API aliases should be checked with the publisher."
      />
      {sources.length > 1 && (
        <nav aria-label="Catalog source" className="mb-5 flex gap-3">
          {sources.map((s) => (
            <Link
              className={`filter-chip ${snapshot.source === s.source ? 'is-active' : ''}`}
              key={s.source}
              href={`/models?source=${s.source}`}
            >
              {s.source}
            </Link>
          ))}
        </nav>
      )}
      <SnapshotNotice snapshot={snapshot} />
      <Suspense fallback={<p>Loading catalog…</p>}>
        <Explorer snapshot={snapshot} catalog />
      </Suspense>
    </BenchmarkShell>
  )
}
