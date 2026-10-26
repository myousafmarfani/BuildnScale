import Link from 'next/link'
import { benchmarkMetadata } from '@/lib/benchmarks/seo'
import { BenchmarkShell, PageHeading } from '@/components/benchmarks/Shell'
export const metadata = benchmarkMetadata(
  'Benchmark methodology & data sources',
  'How BuildnScale sources benchmark data, preserves model identities, calculates ranks, handles ties and missing measurements, and publishes corrections.',
  '/leaderboard/methodology'
)
export default function Methodology() {
  return (
    <BenchmarkShell active="Methodology">
      <PageHeading
        title="Evidence before rankings."
        description="What these comparisons measure, where the data comes from, and what we do not claim. Methodology version 1.0 · 26 October 2026."
      />
      <article className="benchmark-copy max-w-3xl">
        <h2>1. Who evaluates the models?</h2>
        <p>
          BuildnScale currently republishes attributed, licensed results. The
          initial coding source is the EvalPlus website repository, licensed
          under Apache-2.0. We normalize the published JSON, preserve evaluated
          labels, and link to an immutable upstream revision. We have not rerun
          these evaluations. The initial source data was last updated on 26
          December 2024; it is historical coverage, not a current frontier
          ranking.
        </p>
        <p>
          <a href="https://github.com/evalplus/evalplus.github.io">
            EvalPlus source repository
          </a>{' '}
          ·{' '}
          <a href="https://github.com/evalplus/evalplus">
            Evaluation framework
          </a>{' '}
          · <a href="https://arxiv.org/abs/2305.01210">Research paper</a>
        </p>
        <h2>2. What is ranked?</h2>
        <p>
          Each leaderboard orders evaluated model labels by one metric within
          one source snapshot. Higher is better for the metrics currently
          supported. We do not combine scores across sources, datasets, or index
          versions. Equal displayed scores receive competition ranks (1, 1, 3);
          alphabetical order breaks display ties without implying superiority.
          Filtering preserves ranks from the full selected snapshot.
        </p>
        <p>
          HumanEval and HumanEval+ cover 164 Python tasks. EvalPlus uses a
          sanitized 399-task MBPP subset for MBPP and MBPP+. Expanded tests can
          detect failures missed by original tests. Scores are source-reported
          pass@1 percentages, not human-preference ratings. The upstream
          leaderboard describes greedy decoding; per-model settings, evaluation
          dates, raw run counts, and confidence intervals are not included in
          its summary JSON.
        </p>
        <h2>3. What does a score leave out?</h2>
        <p>
          Python code-generation scores do not measure complete application
          development, deployment safety, tool selection, long-running agents,
          or production reliability. Public static datasets may be present in
          training data. Scores from different prompting modes may not be
          directly comparable. A tiny score difference does not establish a
          statistically significant difference.
        </p>
        <p>
          Parameter counts and instruction labels come from the source. A
          Hugging Face namespace identifies a repository publisher; it is not a
          verified corporate identity or API hosting provider. The source field
          named “open-data” does not establish model license or commercial-use
          rights, so we do not convert it into an “open source” badge.
        </p>
        <h2>4. Missing data and model versions</h2>
        <p>
          Missing values remain unavailable and are excluded from ranking for
          that metric. They never become zero. We keep exact evaluated labels;
          where the source does not identify an API version, reasoning effort,
          agent scaffold, or harness, we explicitly say so. We do not merge
          models across sources using fuzzy name matching.
        </p>
        <h2>5. Pricing and performance</h2>
        <p>
          When permitted pricing data is connected, prices are USD per million
          input/output tokens. The calculator estimates catalog token costs from
          the user's workload assumptions; it excludes caching, retries, batch
          discounts, tools, taxes, and separately billed reasoning. Speed
          measurements depend on the source's measurement setup. We do not
          create a universal “value” score by dividing unrelated benchmark
          indices by token price.
        </p>
        <h2>6. Updates and provenance</h2>
        <p>
          Each publication records the source URL, revision, source-update date
          when available, retrieval date, license or permission reference, and
          attribution. Imports validate identifiers, numeric ranges, dates,
          links, and metric names before publication. Historical snapshots are
          retained. Import failures preserve the last successful snapshot; the
          bundled EvalPlus snapshot is the fallback if storage is unavailable.
          Data older than 30 days, or without a source-update date, is flagged.
        </p>
        <p>
          Retrieval time is not evaluation time. Checking the same unchanged
          source does not make old results new. A daily import job checks for
          updates; it does not imply daily model evaluations.
        </p>
        <h2>7. External feeds and publication rights</h2>
        <p>
          Artificial Analysis integration is disabled by default. Publication
          requires credentials and a recorded permission reference covering
          public display. Any connected index must preserve its source version
          and attribution. Arena rankings are not scraped or republished here.
          Model weights, benchmark task text, and third-party logos are not
          bundled.
        </p>
        <h2>8. Independence and corrections</h2>
        <p>
          There is no paid rank placement. Future sponsorships or affiliate
          links must be disclosed and cannot change scores. Original BuildnScale
          evaluations and community votes will be separately labeled if
          introduced. They are not part of today's published dataset.
        </p>
        <p>
          Report a correction with the model label, metric, source URL, and
          evidence through{' '}
          <a href="https://github.com/myousafmarfani/BuildnScale/issues/new">
            GitHub issues
          </a>
          . We retain the original source snapshot and describe publication
          changes in the{' '}
          <Link href="/leaderboard/changelog">update history</Link>.
        </p>
      </article>
    </BenchmarkShell>
  )
}
