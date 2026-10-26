'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  IconSearch,
  IconArrowUpRight,
  IconArrowsExchange,
  IconX,
} from '@tabler/icons-react'
import type { Metric, Snapshot } from '@/lib/benchmarks/types'
import { METRICS, formatScore } from '@/lib/benchmarks/catalog'
import { rankModels } from '@/lib/benchmarks/core.mjs'
export function Explorer({
  snapshot,
  catalog = false,
  defaultMetric,
}: {
  snapshot: Snapshot
  catalog?: boolean
  defaultMetric?: Metric
}) {
  const params = useSearchParams(),
    pathname = usePathname(),
    router = useRouter()
  const metricList = Object.keys(METRICS).filter((k) =>
    snapshot.models.some((m) => m.scores[k as Metric] != null)
  ) as Metric[]
  const metric = metricList.includes(params.get('metric') as Metric)
    ? (params.get('metric') as Metric)
    : defaultMetric && metricList.includes(defaultMetric)
      ? defaultMetric
      : metricList[0]
  const query = params.get('q') || '',
    publisher = params.get('publisher') || '',
    mode = params.get('mode') || ''
  const [selected, setSelected] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    router.replace(`${pathname}${next.size ? '?' + next : ''}`, {
      scroll: false,
    })
  }
  const publishers = [
    ...new Set(snapshot.models.map((m) => m.publisher)),
  ].sort()
  const rows = useMemo(() => {
    const ranked = rankModels(snapshot.models, metric)
    // Preserve the full-source competition rank when filtering; ties share rank.
    const base = catalog
      ? snapshot.models.map((m) => ({
          ...m,
          rank: ranked.find((r) => r.id === m.id)?.rank ?? null,
        }))
      : ranked
    return base.filter(
      (m) =>
        `${m.name} ${m.publisher}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (!publisher || m.publisher === publisher) &&
        (!mode ||
          (m.instructionTuned !== null &&
            (mode === 'instruct') === m.instructionTuned))
    )
  }, [snapshot, metric, query, publisher, mode, catalog])
  const page = Math.max(
    1,
    Math.min(
      Math.ceil(rows.length / 25) || 1,
      Math.floor(Number(params.get('page'))) || 1
    )
  )
  const visible = rows.slice((page - 1) * 25, page * 25)
  const toggle = (id: string) => {
    setNotice('')
    if (selected.includes(id))
      setSelected(selected.filter((value) => value !== id))
    else if (selected.length < 3) setSelected([...selected, id])
    else setNotice('Compare up to three models. Remove one to add another.')
  }

  return (
    <section aria-label="Model explorer">
      <div className="mb-5 grid gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <label className="text-xs text-muted">
          Search models
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-bg px-3">
            <IconSearch size={18} />
            <input
              className="min-h-11 w-full min-w-0 bg-transparent text-sm text-fg outline-none"
              value={query}
              onChange={(e) => update('q', e.target.value)}
              placeholder="Model name or publisher"
            />
          </div>
        </label>
        <label className="text-xs text-muted">
          Benchmark
          <select
            className="workspace-input mt-2 min-h-11"
            aria-label="Benchmark"
            value={metric}
            onChange={(e) => update('metric', e.target.value)}
          >
            {metricList.map((k) => (
              <option key={k} value={k}>
                {METRICS[k].name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Publisher / source namespace
          <select
            className="workspace-input mt-2 min-h-11"
            aria-label="Publisher"
            value={publisher}
            onChange={(e) => update('publisher', e.target.value)}
          >
            <option value="">All publishers</option>
            {publishers.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Evaluation mode
          <select
            className="workspace-input mt-2 min-h-11"
            aria-label="Evaluation mode"
            value={mode}
            onChange={(e) => update('mode', e.target.value)}
          >
            <option value="">All modes</option>
            <option value="instruct">Instruction prompted</option>
            <option value="base">Base completion</option>
          </select>
        </label>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p aria-live="polite" className="text-muted">
          {rows.length} models · {METRICS[metric].name} · Higher is better
        </p>
        <button
          className="text-teal underline underline-offset-4"
          onClick={() => router.replace(pathname, { scroll: false })}
        >
          Reset filters
        </button>
      </div>
      <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted">
        {METRICS[metric].description} Ranks apply only to this source snapshot
        and selected metric. Equal displayed scores share a rank; small
        differences do not establish statistical superiority.
      </p>
      <div
        className="hidden overflow-x-auto rounded-xl border border-border sm:block"
        tabIndex={0}
        role="region"
        aria-label="Benchmark results table, scroll horizontally on small screens"
      >
        <table className="benchmark-table">
          <caption className="sr-only">
            {METRICS[metric].name} results from {snapshot.source}. Select models
            to compare.
          </caption>
          <thead>
            <tr>
              <th scope="col">Compare</th>
              <th scope="col">Rank</th>
              <th scope="col">Model / evaluated label</th>
              <th scope="col">{METRICS[metric].name}</th>
              <th scope="col">Mode</th>
              <th scope="col">Parameters</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((m) => (
              <tr key={m.id}>
                <td>
                  <input
                    className="h-5 w-5 accent-[var(--color-teal)]"
                    type="checkbox"
                    aria-label={`Compare ${m.name}`}
                    checked={selected.includes(m.id)}
                    onChange={() => toggle(m.id)}
                  />
                </td>
                <td className="font-mono text-muted">
                  {m.rank === null ? '—' : `#${m.rank}`}
                </td>
                <th scope="row">
                  <Link
                    className="font-medium hover:text-teal"
                    href={`/models/${m.id}`}
                  >
                    {m.name}
                  </Link>
                  <span className="mt-1 block text-xs font-normal text-muted">
                    {m.publisher}
                  </span>
                </th>
                <td>
                  <span className="font-mono font-medium text-teal">
                    {formatScore(m.scores[metric], metric)}
                  </span>
                  {m.scores[metric] != null && METRICS[metric].unit === '%' && (
                    <div
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-raised"
                    >
                      <div
                        className="h-full rounded-full bg-teal"
                        style={{ width: `${m.scores[metric]}%` }}
                      />
                    </div>
                  )}
                </td>
                <td className="text-muted">
                  {m.instructionTuned === null
                    ? 'Not supplied'
                    : m.instructionTuned
                      ? 'Instruction'
                      : 'Completion'}
                </td>
                <td className="font-mono text-muted">
                  {m.parametersB == null ? 'Not provided' : `${m.parametersB}B`}
                </td>
                <td>
                  <a
                    className="inline-flex min-h-11 items-center gap-1 text-teal"
                    href={snapshot.sourceURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Evidence
                    <IconArrowUpRight size={14} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && (
          <div className="p-12 text-center">
            <p className="font-medium">No models match these filters.</p>
            <button
              className="btn-secondary mt-4"
              onClick={() => router.replace(pathname, { scroll: false })}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <div
        className="grid gap-3 sm:hidden"
        aria-label="Mobile benchmark results"
      >
        {visible.map((m) => (
          <article
            key={m.id}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex items-start gap-3">
              <input
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-teal)]"
                type="checkbox"
                aria-label={`Compare ${m.name}`}
                checked={selected.includes(m.id)}
                onChange={() => toggle(m.id)}
              />
              <div className="min-w-0 flex-1">
                <p className="mb-1 font-mono text-xs text-muted">
                  {m.rank == null ? 'Unranked' : `#${m.rank}`}
                </p>
                <Link
                  className="break-words text-sm font-medium hover:text-teal"
                  href={`/models/${m.id}`}
                >
                  {m.name}
                </Link>
              </div>
              <div className="shrink-0 text-right">
                <strong className="font-mono text-lg text-teal">
                  {formatScore(m.scores[metric], metric)}
                </strong>
                <span className="mt-1 block max-w-24 text-xs text-muted">
                  {METRICS[metric].name}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted">
              <span>
                {m.publisher} ·{' '}
                {m.instructionTuned === null
                  ? 'Mode not supplied'
                  : m.instructionTuned
                    ? 'Instruction'
                    : 'Completion'}
              </span>
              <a
                className="inline-flex min-h-9 items-center gap-1 text-teal"
                href={snapshot.sourceURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Evidence <IconArrowUpRight size={14} />
              </a>
            </div>
          </article>
        ))}
        {!visible.length && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
            No models match these filters.
            <button
              className="btn-secondary mt-4"
              onClick={() => router.replace(pathname, { scroll: false })}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <button
          className="tool-button"
          disabled={page <= 1}
          onClick={() => update('page', String(page - 1))}
        >
          ← Previous
        </button>
        <span className="text-muted">
          Page {page} of {Math.max(1, Math.ceil(rows.length / 25))}
        </span>
        <button
          className="tool-button"
          disabled={page * 25 >= rows.length}
          onClick={() => update('page', String(page + 1))}
        >
          Next →
        </button>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-muted">
        {snapshot.attribution} Parameter counts and instruction labels are
        source metadata. Namespace is shown where supplied; it is not a verified
        API provider or license classification.
      </p>
      {selected.length > 0 && (
        <div className="sticky bottom-4 z-40 mt-6 rounded-xl border border-border-strong bg-surface p-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            <IconArrowsExchange size={20} className="text-teal" />
            <span className="text-sm">{selected.length} selected</span>
            {selected.map((id) => (
              <button
                key={id}
                className="filter-chip"
                onClick={() => toggle(id)}
              >
                {snapshot.models.find((m) => m.id === id)?.name}
                <IconX size={14} />
              </button>
            ))}
            <Link
              aria-disabled={selected.length < 2}
              onClick={(e) => {
                if (selected.length < 2) e.preventDefault()
              }}
              className={`btn-primary ml-auto ${selected.length < 2 ? 'opacity-50' : ''}`}
              href={`/compare?models=${selected.join(',')}`}
            >
              Compare models →
            </Link>
            <button
              aria-label="Clear comparison"
              className="tool-button"
              onClick={() => setSelected([])}
            >
              <IconX size={18} />
            </button>
          </div>
          {notice && (
            <p role="status" className="mt-3 text-sm text-amber">
              {notice}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
