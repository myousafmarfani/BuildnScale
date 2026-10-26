import { Suspense } from 'react'
import { getSnapshots } from '@/lib/benchmarks/data'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import {
  BenchmarkShell,
  PageHeading,
  SnapshotNotice,
} from '@/components/benchmarks/Shell'
import { Explorer } from '@/components/benchmarks/Explorer'
import { EvidenceJsonLd } from '@/components/benchmarks/EvidenceJsonLd'
export const metadata = benchmarkMetadata(
  'Historical AI coding benchmark archive',
  'Explore the December 2024 EvalPlus coding snapshot. These are historical evaluations, not current frontier rankings.',
  '/leaderboard/archive'
)
export const revalidate = 3600
export default async function Archive() {
  const snapshot = (await getSnapshots()).find((s) => s.source === 'evalplus')!
  return (
    <BenchmarkShell active="Archive">
      <PageHeading
        title="Historical benchmark archive."
        description="Older evaluations preserved for reference, with their original source dates. Use the main leaderboard for current feed coverage."
      />
      <EvidenceJsonLd snapshot={snapshot} />
      <SnapshotNotice snapshot={snapshot} />
      <Suspense fallback={<p>Loading archive…</p>}>
        <Explorer snapshot={snapshot} />
      </Suspense>
    </BenchmarkShell>
  )
}
