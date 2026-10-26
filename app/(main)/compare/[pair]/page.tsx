import { notFound, redirect } from 'next/navigation'
import { getSnapshots } from '@/lib/benchmarks/data'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import {
  BenchmarkShell,
  PageHeading,
  SnapshotNotice,
} from '@/components/benchmarks/Shell'
import { ComparePicker } from '@/components/benchmarks/ComparePicker'
import { Comparison } from '@/components/benchmarks/Comparison'
export const revalidate = 3600
async function resolvePair(pair: string) {
  const snapshots = await getSnapshots(),
    models = snapshots.flatMap((s) => s.models)
  // Match complete identifiers, including model labels that contain "vs".
  for (const a of models) {
    if (!pair.startsWith(`${a.id}-vs-`)) continue
    const b = models.find((m) => m.id === pair.slice(a.id.length + 4))
    if (b && b.id !== a.id)
      return { snapshots, models, ids: [a.id, b.id], names: [a.name, b.name] }
  }
  return null
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>
}) {
  const result = await resolvePair((await params).pair)
  return result
    ? benchmarkMetadata(
        `${result.names[0]} vs ${result.names[1]}`,
        `Compare sourced benchmark scores and evaluation limitations for ${result.names[0]} and ${result.names[1]}.`,
        `/compare/${[...result.ids].sort().join('-vs-')}`,
        false
      )
    : notFound()
}
export default async function Pair({
  params,
}: {
  params: Promise<{ pair: string }>
}) {
  const { pair } = await params,
    result = await resolvePair(pair)
  if (!result) notFound()
  const canonical = [...result.ids].sort().join('-vs-')
  if (pair !== canonical) redirect(`/compare/${canonical}`)
  return (
    <BenchmarkShell active="Compare">
      <PageHeading
        title={`${result.names[0]} vs ${result.names[1]}`}
        description="A side-by-side view of published measurements, configuration coverage, and the evidence behind each result."
      />
      <ComparePicker models={result.models} selected={result.ids} />
      {result.snapshots
        .filter((s) => s.models.some((m) => result.ids.includes(m.id)))
        .map((s) => (
          <SnapshotNotice key={s.source} snapshot={s} />
        ))}
      <Comparison snapshots={result.snapshots} ids={result.ids} />
    </BenchmarkShell>
  )
}
