import type { Snapshot } from '@/lib/benchmarks/types'
export function EvidenceJsonLd({ snapshot }: { snapshot: Snapshot }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Historical EvalPlus coding benchmark results on BuildnScale',
    description:
      'An attributed historical source snapshot of Python code-generation measurements. Normalized by BuildnScale; evaluations were not rerun.',
    url: 'https://www.buildnscale.dev/leaderboard/archive',
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
    creator: {
      '@type': 'Organization',
      name: 'EvalPlus contributors',
      url: 'https://evalplus.github.io/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BuildnScale',
      url: 'https://www.buildnscale.dev',
    },
    citation: snapshot.sourceURL,
    version: snapshot.sourceRevision,
    dateModified: snapshot.sourceUpdatedAt,
    variableMeasured: [
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
