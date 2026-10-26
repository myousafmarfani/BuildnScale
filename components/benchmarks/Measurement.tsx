import type { Model, Metric } from '@/lib/benchmarks/types'
export function Measurement({ model, metric }: { model: Model; metric: Metric }) {
  const ev = model.evidence?.[metric]
  if (!ev) return null
  const precision = metric === 'arena-agent' ? 4 : 1
  return <div className="mt-2 space-y-1 text-xs font-normal text-muted">
    <p>{metric === 'arena-agent' ? '95% CI' : 'Source CI'}: {ev.lower == null || ev.upper == null ? 'Not supplied' : `${ev.lower.toFixed(precision)} to ${ev.upper.toFixed(precision)}`}</p>
    <p>{ev.count == null ? 'Count not supplied' : `${ev.count.toLocaleString('en-US')} ${metric === 'arena-agent' ? 'observations' : 'votes'}`}{ev.sessions != null ? ` · ${ev.sessions.toLocaleString('en-US')} sessions` : ''}</p>
    <p>Published {ev.publishedAt}</p>
    {model.identityNote && <p>{model.identityNote}</p>}
  </div>
}
