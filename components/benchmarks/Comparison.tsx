import Link from 'next/link'
import type { Snapshot, Metric } from '@/lib/benchmarks/types'
import { METRICS, formatScore, dateLabel } from '@/lib/benchmarks/catalog'
export function Comparison({
  snapshots,
  ids,
}: {
  snapshots: Snapshot[]
  ids: string[]
}) {
  const entries = ids.flatMap((id) =>
    snapshots.flatMap((s) =>
      s.models.filter((m) => m.id === id).map((m) => ({ m, s }))
    )
  )
  const metrics = Object.keys(METRICS).filter((k) =>
    entries.some(({ m }) => m.scores[k as Metric] != null)
  ) as Metric[]
  if (entries.length < 2)
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        Choose two or three models to inspect their evidence side by side.
      </div>
    )
  const sameSource =
    new Set(entries.map((e) => `${e.s.source}:${e.s.sourceRevision}`)).size ===
    1
  return (
    <>
      <p className="mb-5 text-sm leading-relaxed text-muted">
        {sameSource
          ? 'These results share a source snapshot. Compare within each metric; small differences are not proof of superiority.'
          : 'These models come from different sources or snapshots. Shared names do not establish equivalent evaluation settings. No cross-source winner is calculated.'}
      </p>
      <div
        className="overflow-x-auto rounded-xl border border-border"
        role="region"
        tabIndex={0}
        aria-label="Model comparison table"
      >
        <table className="benchmark-table">
          <caption className="sr-only">
            Model scores and evaluation provenance
          </caption>
          <thead>
            <tr>
              <th scope="col">Evidence</th>
              {entries.map(({ m }) => (
                <th scope="col" key={m.id}>
                  <Link className="text-teal" href={`/models/${m.id}`}>
                    {m.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric}>
                <th scope="row">{METRICS[metric].name}</th>
                {entries.map(({ m }) => (
                  <td className="font-mono" key={m.id}>
                    {formatScore(m.scores[metric], metric)}
                  </td>
                ))}
              </tr>
            ))}
            {[
              ['Source', entries.map(({ s }) => s.source)],
              [
                'Source updated',
                entries.map(({ s }) => dateLabel(s.sourceUpdatedAt)),
              ],
              [
                'Prompt mode',
                entries.map(({ m }) =>
                  m.instructionTuned === null
                    ? 'Not supplied'
                    : m.instructionTuned
                      ? 'Instruction prompted'
                      : 'Base completion'
                ),
              ],
              [
                'Parameters',
                entries.map(({ m }) =>
                  m.parametersB == null ? 'Not provided' : `${m.parametersB}B`
                ),
              ],
              [
                'Input USD / 1M tokens',
                entries.map(({ m }) =>
                  m.pricing?.input == null
                    ? 'Not provided'
                    : `$${m.pricing.input}`
                ),
              ],
              [
                'Output USD / 1M tokens',
                entries.map(({ m }) =>
                  m.pricing?.output == null
                    ? 'Not provided'
                    : `$${m.pricing.output}`
                ),
              ],
              [
                'Output speed',
                entries.map(({ m }) =>
                  m.speed == null ? 'Not measured' : `${m.speed} tokens/s`
                ),
              ],
              ['Confidence intervals', entries.map(() => 'Not supplied')],
            ].map(([label, values]) => (
              <tr key={label as string}>
                <th scope="row">{label}</th>
                {(values as string[]).map((value, i) => (
                  <td key={i} className="text-muted">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">Source evidence</th>
              {entries.map(({ m, s }) => (
                <td key={m.id}>
                  <a
                    className="text-teal"
                    href={s.sourceURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View source ↗
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-7 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">
          Use this comparison responsibly
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          These scores describe performance on specific published evaluations.
          They do not establish production availability, model licensing, React
          quality, agent reliability, or the best choice for your workload. Test
          representative cases before switching models.
        </p>
      </div>
    </>
  )
}
