import type { Snapshot } from '@/lib/benchmarks/types'
export function EvidenceJsonLd({ snapshot }: { snapshot: Snapshot }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: snapshot.source === 'arena' ? 'Arena model rankings on BuildnScale' : 'Historical EvalPlus coding benchmark results on BuildnScale',
    description:
      snapshot.source === 'arena' ? 'Latest imported overall Arena text, web development, and agent boards, with source dates and uncertainty. Normalized by BuildnScale; evaluations were not rerun.' : 'An attributed historical source snapshot of Python code-generation measurements. Normalized by BuildnScale; evaluations were not rerun.',
    url: snapshot.source === 'arena' ? 'https://www.buildnscale.dev/leaderboard' : 'https://www.buildnscale.dev/leaderboard/archive',
    license: snapshot.source === 'arena' ? 'https://creativecommons.org/licenses/by/4.0/' : 'https://www.apache.org/licenses/LICENSE-2.0',
    creator: {
      '@type': 'Organization',
      name: snapshot.source === 'arena' ? 'Arena / lmarena-ai' : 'EvalPlus contributors',
      url: snapshot.source === 'arena' ? 'https://arena.ai/' : 'https://evalplus.github.io/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BuildnScale',
      url: 'https://www.buildnscale.dev',
    },
    citation: snapshot.sourceURL,
    version: snapshot.sourceRevision,
    dateModified: snapshot.sourceUpdatedAt,
    variableMeasured: snapshot.source === 'arena' ? ['Arena Text (style controlled)', 'Arena Web Development', 'Arena Agent IPS'] : [
      'HumanEval pass@1',
      'HumanEval+ pass@1',
      'MBPP pass@1',
      'MBPP+ pass@1',
    ],
    isAccessibleForFree: true,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
