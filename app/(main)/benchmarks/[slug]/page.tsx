import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BENCHMARKS, METRICS } from '@/lib/benchmarks/catalog'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import { BenchmarkShell, PageHeading } from '@/components/benchmarks/Shell'
export function generateStaticParams() {
  return BENCHMARKS.map((b) => ({ slug: b.slug }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const b = BENCHMARKS.find((b) => b.slug === slug)
  return b
    ? benchmarkMetadata(`${b.name} explained`, b.text, `/benchmarks/${b.slug}`)
    : {}
}
export default async function BenchmarkGuide({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params,
    b = BENCHMARKS.find((b) => b.slug === slug)
  if (!b) notFound()
  return (
    <BenchmarkShell active="Methodology">
      <PageHeading title={`${b.name}, explained.`} description={b.text} />
      <article className="benchmark-copy max-w-3xl">
        <h2>Read the metric</h2>
        <p>
          {METRICS[b.metric].description} The benchmark has{' '}
          {METRICS[b.metric].tasks} tasks in the EvalPlus subset. A result
          refers to the evaluated model and prompting setup. Our initial
          historical snapshot preserves the source-reported pass@1 percentage.
        </p>
        <h2>Why expanded tests matter</h2>
        <p>
          A generated function can pass a small set of examples and still fail
          edge cases. EvalPlus adds tests to detect more incorrect solutions.
          Select the expanded and base metrics separately to inspect the
          difference; we do not average them into an overall score.
        </p>
        <h2>What this does not measure</h2>
        <p>
          These Python tasks do not establish React component quality,
          repository-level issue resolution, deployment correctness, or agent
          tool-use reliability. Published static tasks can be affected by
          contamination. Historical scores do not establish current API
          availability.
        </p>
        <h2>From benchmark to your application</h2>
        <p>
          Shortlist candidates using relevant evidence, then run representative
          tests from your own application. Record exact versions, prompts,
          tools, retries, costs, and failures. For small studies, report
          uncertainty and avoid definitive winner claims.
        </p>
        <p>
          <a href={b.url}>Original framework and documentation ↗</a>
        </p>
        <p>
          <Link
            href={`/leaderboard/coding?metric=${encodeURIComponent(b.metric)}`}
          >
            Explore {b.name} results →
          </Link>
        </p>
      </article>
    </BenchmarkShell>
  )
}
