import Link from 'next/link'
import { EvidenceJsonLd } from '@/components/benchmarks/EvidenceJsonLd'
import { Suspense } from 'react'
import {
  IconArrowUpRight,
  IconCode,
  IconDatabase,
  IconScale,
} from '@tabler/icons-react'
import { getSnapshots } from '@/lib/benchmarks/data'
import { rankModels } from '@/lib/benchmarks/core.mjs'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import {
  BenchmarkShell,
  PageHeading,
  SnapshotNotice,
} from '@/components/benchmarks/Shell'
import { Explorer } from '@/components/benchmarks/Explorer'
export const metadata = benchmarkMetadata(
  'AI benchmarks for developers',
  'Explore sourced AI coding benchmarks, compare evaluated models, and understand the evidence behind model selection.',
  '/leaderboard'
)
export const revalidate = 3600
export default async function Leaderboard() {
  const snapshots = await getSnapshots(),
    snapshot = snapshots.find((s) => s.source === 'evalplus')!
  const ranked = rankModels(snapshot.models, 'humaneval+')
  return (
    <BenchmarkShell>
      <EvidenceJsonLd snapshot={snapshot} />
      <PageHeading
        title="Choose with evidence."
        description="AI benchmarks and model comparisons for developers building applications and agents. Inspect the scores, understand the tests, and compare what matters to your build."
      />
      <div className="mb-9 grid gap-4 sm:grid-cols-3">
        {[
          [
            IconCode,
            `${snapshot.models.length} evaluated labels`,
            'Explore the historical coding dataset',
          ],
          [
            IconDatabase,
            '4 coding metrics',
            'Separate results. No opaque overall score.',
          ],
          [
            IconScale,
            'Traceable evidence',
            'Source links and limitations on every result',
          ],
        ].map(([Icon, title, text]) => {
          const I = Icon as typeof IconCode
          return (
            <div
              key={String(title)}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <I className="mb-5 text-teal" size={22} />
              <h2 className="font-medium">{String(title)}</h2>
              <p className="mt-2 text-sm text-muted">{String(text)}</p>
            </div>
          )
        })}
      </div>
      <SnapshotNotice snapshot={snapshot} />
      <div className="mb-10 grid gap-4 md:grid-cols-2">
        <Link
          href="/leaderboard/coding"
          className="rounded-2xl border border-border-strong bg-teal-subtle p-6"
        >
          <span className="eyebrow mb-3">CODING / HISTORICAL COVERAGE</span>
          <h2 className="text-2xl font-semibold">From score to source.</h2>
          <p className="my-4 max-w-md text-sm leading-relaxed text-muted">
            Compare Python code-generation results. Inspect expanded tests
            alongside the original tests.
          </p>
          <span className="inline-flex items-center gap-2 text-sm text-teal">
            Explore coding rankings
            <IconArrowUpRight size={16} />
          </span>
        </Link>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <span className="eyebrow mb-3">READ THE EVIDENCE</span>
          <h2 className="text-2xl font-semibold">What does pass@1 tell you?</h2>
          <p className="my-4 text-sm leading-relaxed text-muted">
            Success on one coding task set does not establish production
            reliability, agent performance, or suitability for your app.
          </p>
          <Link className="text-sm text-teal" href="/benchmarks/humaneval-plus">
            Understand HumanEval+ →
          </Link>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold">Explore coding results</h2>
        <Link
          className="text-sm text-teal"
          href={`/compare/${ranked[0].id}-vs-${ranked[1].id}`}
        >
          Compare the top two in this snapshot →
        </Link>
      </div>
      <Suspense fallback={<p>Loading explorer…</p>}>
        <Explorer snapshot={snapshot} />
      </Suspense>
    </BenchmarkShell>
  )
}
