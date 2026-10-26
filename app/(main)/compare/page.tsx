import { getSnapshots } from '@/lib/benchmarks/data'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import {
  BenchmarkShell,
  PageHeading,
  SnapshotNotice,
} from '@/components/benchmarks/Shell'
import { ComparePicker } from '@/components/benchmarks/ComparePicker'
import { Comparison } from '@/components/benchmarks/Comparison'
export const metadata = benchmarkMetadata(
  'Compare AI model benchmarks',
  'Choose up to three evaluated models and compare scores, source dates, pricing coverage, and limitations.',
  '/compare',
  false
)
export const revalidate = 3600
export default async function Compare({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const snapshots = await getSnapshots(),
    query = await searchParams
  const models = snapshots
    .flatMap((s) => s.models)
    .sort((a, b) => a.name.localeCompare(b.name))
  const ids = [
    ...new Set(
      (typeof query.models === 'string' ? query.models : '').split(',')
    ),
  ]
    .filter((id) => models.some((m) => m.id === id))
    .slice(0, 3)
  return (
    <BenchmarkShell active="Compare">
      <PageHeading
        title="Compare the evidence."
        description="Choose up to three evaluated model labels. Scores stay within their own benchmark; missing evidence stays visible."
      />
      <ComparePicker models={models} selected={ids} />
      {snapshots
        .filter((s) => s.models.some((m) => ids.includes(m.id)))
        .map((s) => (
          <SnapshotNotice key={s.source} snapshot={s} />
        ))}
      <Comparison snapshots={snapshots} ids={ids} />
    </BenchmarkShell>
  )
}
