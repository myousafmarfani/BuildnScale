import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getModel } from '@/lib/benchmarks/data'
import { METRICS, formatScore, dateLabel } from '@/lib/benchmarks/catalog'
import type { Metric } from '@/lib/benchmarks/types'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import {
  BenchmarkShell,
  PageHeading,
  SnapshotNotice,
} from '@/components/benchmarks/Shell'
export const revalidate = 3600
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const found = await getModel((await params).slug)
  return found
    ? benchmarkMetadata(
        `${found.model.name} benchmarks`,
        `Inspect ${found.model.name} scores, evaluated configuration, data provenance, and benchmark limitations.`,
        `/models/${found.model.id}`
      )
    : notFound()
}
export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const found = await getModel((await params).slug)
  if (!found) notFound()
  const { model: m, snapshot: s } = found
  return (
    <BenchmarkShell active="Models">
      <Link className="mb-6 inline-block text-sm text-teal" href="/models">
        ← All models
      </Link>
      <PageHeading
        title={m.name}
        description="An evaluated model label, preserved from the source. Use the evidence below to understand what was measured and what remains unknown."
      />
      <SnapshotNotice snapshot={s} />
      <div className="mb-8 flex flex-wrap gap-3">
        <a
          className="btn-secondary"
          href={m.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Model reference ↗
        </a>
        <Link className="btn-primary" href={`/compare?models=${m.id}`}>
          Choose a model to compare →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(m.scores).map(([key, value]) => (
          <div key={key} className="metric-card">
            <span>{METRICS[key as Metric].name}</span>
            <strong className="text-teal">
              {formatScore(value, key as Metric)}
            </strong>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {METRICS[key as Metric].description}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-5 text-xl font-semibold">Evaluation record</h2>
          <dl className="space-y-4 text-sm">
            {[
              ['Source', s.source],
              ['Publisher / namespace', m.publisher],
              [
                'Prompt mode',
                m.instructionTuned === null
                  ? 'Not supplied'
                  : m.instructionTuned
                    ? 'Instruction prompted'
                    : 'Base completion',
              ],
              [
                'Source-reported parameters',
                m.parametersB == null
                  ? 'Not provided'
                  : `${m.parametersB} billion`,
              ],
              ['Evaluation date', 'Not supplied per model'],
              ['Source updated', dateLabel(s.sourceUpdatedAt)],
              ['Source revision', s.sourceRevision],
              [
                'Reasoning effort / harness',
                'Not supplied per model in this source',
              ],
              ['Confidence interval', 'Not supplied; no significance claim'],
              ['Model license / context limit', 'Not verified in this dataset'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1 border-b border-border pb-3 sm:grid-cols-[1fr_1.2fr]"
              >
                <dt className="text-muted">{label}</dt>
                <dd className="break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold">
            Price, speed & practical use
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {m.pricing
              ? `Source-reported USD per million tokens: input ${m.pricing.input ?? 'unavailable'}, output ${m.pricing.output ?? 'unavailable'}. These are catalog rates, not measured task costs.`
              : 'Verified pricing is not included in this source. We do not infer current API pricing from historical model names.'}
          </p>
          <p className="mt-4 text-sm text-muted">
            {m.speed == null
              ? 'Output speed: not measured in this dataset.'
              : `Source-reported output speed: ${m.speed} tokens/second.`}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Python function-completion results do not establish React, Next.js,
            tool-calling, or production-agent reliability. Validate candidates
            on your own workload.
          </p>
          <Link
            className="mt-6 inline-block text-sm text-teal"
            href="/leaderboard/methodology"
          >
            Read the methodology →
          </Link>
        </section>
      </div>
      <p className="mt-7 text-xs text-muted">{s.attribution}</p>
    </BenchmarkShell>
  )
}
