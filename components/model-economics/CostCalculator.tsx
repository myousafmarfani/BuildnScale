'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import type { ModelPricing } from '@/lib/model-economics/types'
import { estimateAll, sanitizeWorkload } from '@/lib/model-economics/estimate.mjs'

type Inputs = {
  tasks: number
  turns: number
  input: number
  output: number
  cache: number
  retry: number
  plan: number
  scheduled: boolean
}

const DEFAULTS: Inputs = {
  tasks: 1_000,
  turns: 3,
  input: 8_000,
  output: 700,
  cache: 0,
  retry: 2,
  plan: 20,
  scheduled: false,
}

const PRESETS: Array<{ id: string; label: string; values: Partial<Inputs> }> = [
  {
    id: 'assistant',
    label: 'Support assistant',
    values: { tasks: 4_000, turns: 2, input: 6_000, output: 500, cache: 40, retry: 2 },
  },
  {
    id: 'agent',
    label: 'Coding agent',
    values: { tasks: 600, turns: 8, input: 30_000, output: 1_200, cache: 60, retry: 5 },
  },
  {
    id: 'extraction',
    label: 'Batch extraction',
    values: { tasks: 50_000, turns: 1, input: 1_500, output: 250, cache: 0, retry: 1 },
  },
]

const VIEW_KEY = 'bn_model_economics_view'
const CALC_KEY = 'bn_model_economics_calculate'

function track(event: string) {
  if (typeof window === 'undefined') return
  const w = window as Window & {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
  if (typeof w.gtag === 'function') {
    w.gtag('event', event)
    return
  }
  // gtag.js may not have loaded yet. Queue the command so it is not lost.
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push(['event', event])
}

function once(key: string) {
  try {
    if (sessionStorage.getItem(key)) return false
    sessionStorage.setItem(key, '1')
    return true
  } catch {
    return true
  }
}

const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

function formatMoney(value: number) {
  const digits = value === 0 ? 2 : value < 0.01 ? 4 : value < 1 ? 3 : 2
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

function Field({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
}: {
  label: string
  hint?: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  prefix?: string
  suffix?: string
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-xs font-medium text-muted">{label}</span>
      <span className="mt-1 flex items-center rounded-lg border border-border bg-bg focus-within:border-teal">
        {prefix ? (
          <span className="pl-3 text-sm text-tertiary" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          type="number"
          inputMode="decimal"
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-fg outline-none"
          value={value}
          min={min}
          max={max}
          step={step ?? 1}
          onChange={(event) =>
            onChange(event.target.value === '' ? min : Number(event.target.value))
          }
        />
        {suffix ? (
          <span className="pr-3 text-xs text-tertiary" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </span>
      {hint ? <span className="mt-1 block text-2xs leading-relaxed text-tertiary">{hint}</span> : null}
    </label>
  )
}

export function CostCalculator({
  models,
  checkedAt,
  checkedISO,
}: {
  models: ModelPricing[]
  checkedAt: string
  checkedISO: string
}) {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS)
  const [tab, setTab] = useState<'inputs' | 'assumptions'>('inputs')
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const [shareURL, setShareURL] = useState('')
  const [email, setEmail] = useState('')
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const dirtyRef = useRef(false)
  const shareRef = useRef<HTMLInputElement>(null)

  const safe = useMemo(() => sanitizeWorkload(inputs), [inputs])
  const rows = useMemo(() => estimateAll(models, safe), [models, safe])
  const eligible = rows.filter((row) => !row.overContext)
  const cheapest = eligible[0] ?? rows[0]
  const hasScheduled = models.some((model) => model.scheduledPricing.length > 0)

  useEffect(() => {
    if (once(VIEW_KEY)) track('model_economics_view')
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const keys: Array<[string, keyof Pick<Inputs, 'tasks' | 'turns' | 'input' | 'output' | 'cache' | 'retry' | 'plan'>]> = [
      ['t', 'tasks'],
      ['n', 'turns'],
      ['i', 'input'],
      ['o', 'output'],
      ['c', 'cache'],
      ['r', 'retry'],
      ['p', 'plan'],
    ]
    const next: Partial<Inputs> = {}
    for (const [param, key] of keys) {
      const raw = params.get(param)
      if (raw === null) continue
      const parsed = Number(raw)
      if (Number.isFinite(parsed)) next[key] = parsed
    }
    if (params.get('s') === '1') next.scheduled = true
    if (Object.keys(next).length > 0) setInputs((current) => sanitizeWorkload({ ...current, ...next }))
  }, [])

  useEffect(() => {
    if (!dirtyRef.current) return
    const timer = setTimeout(() => {
      if (once(CALC_KEY)) track('model_economics_calculate')
    }, 1_200)
    return () => clearTimeout(timer)
  }, [safe])

  function update(patch: Partial<Inputs>) {
    dirtyRef.current = true
    setInputs((current) => sanitizeWorkload({ ...current, ...patch }))
    setShareState('idle')
  }

  function applyPreset(values: Partial<Inputs>) {
    dirtyRef.current = true
    setInputs(sanitizeWorkload({ ...DEFAULTS, scheduled: inputs.scheduled, ...values }))
    setShareState('idle')
  }

  function buildURL() {
    const url = new URL(window.location.href)
    url.search = new URLSearchParams({
      t: String(safe.tasks),
      n: String(safe.turns),
      i: String(safe.input),
      o: String(safe.output),
      c: String(safe.cache),
      r: String(safe.retry),
      p: String(safe.plan),
      s: safe.scheduled ? '1' : '0',
    }).toString()
    return url.toString()
  }

  async function share() {
    const url = buildURL()
    setShareURL(url)
    try {
      await navigator.clipboard.writeText(url)
      setShareState('copied')
    } catch {
      setShareState('manual')
      window.setTimeout(() => shareRef.current?.select(), 0)
    }
    track('model_economics_share')
  }

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (emailState === 'sending') return
    setEmailState('sending')
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) throw new Error('subscribe failed')
      setEmailState('done')
      setEmail('')
      track('model_economics_email_capture')
    } catch {
      setEmailState('error')
    }
  }

  return (
    <section className="mt-10" aria-labelledby="calculator-heading">
      <div className="rounded-2xl border border-border-strong bg-surface">
        <div className="border-b border-border px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">WORKLOAD → BILL</p>
              <h2 id="calculator-heading" className="mt-2 font-display text-xl font-semibold text-fg sm:text-2xl">
                Estimate the monthly bill.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Start from a preset or enter your own numbers. Everything runs in your
                browser; no workload data is sent to us.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="filter-chip"
                  onClick={() => applyPreset(preset.values)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-1 border-b border-border px-5 pt-3 sm:px-7" role="group" aria-label="Calculator sections">
          <button
            type="button"
            aria-pressed={tab === 'inputs'}
            className={`min-h-10 border-b-2 px-3 text-sm ${tab === 'inputs' ? 'border-teal font-medium text-fg' : 'border-transparent text-muted'}`}
            onClick={() => setTab('inputs')}
          >
            Workload
          </button>
          <button
            type="button"
            aria-pressed={tab === 'assumptions'}
            className={`min-h-10 border-b-2 px-3 text-sm ${tab === 'assumptions' ? 'border-teal font-medium text-fg' : 'border-transparent text-muted'}`}
            onClick={() => setTab('assumptions')}
          >
            Assumptions
          </button>
        </div>

        {tab === 'inputs' ? (
          <div className="px-5 py-5 sm:px-7">
            <p className="mb-4 text-xs leading-relaxed text-tertiary">
              One task is a unit of work. Turns are model calls inside a task. Input
              tokens per request should include the system prompt and conversation
              history.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Tasks per month"
                value={safe.tasks}
                onChange={(tasks) => update({ tasks })}
                min={1}
                max={5_000_000}
                hint="User requests, jobs, or tickets."
              />
              <Field
                label="Turns per task"
                value={safe.turns}
                onChange={(turns) => update({ turns })}
                min={1}
                max={100}
                hint="Model calls per task, including tools."
              />
              <Field
                label="Input tokens / request"
                value={safe.input}
                onChange={(input) => update({ input })}
                min={1}
                max={2_000_000}
                hint="System prompt + history + user message."
              />
              <Field
                label="Output tokens / request"
                value={safe.output}
                onChange={(output) => update({ output })}
                min={1}
                max={1_000_000}
                hint="Visible answer plus reasoning tokens."
              />
              <Field
                label="Cache hit rate"
                value={safe.cache}
                onChange={(cache) => update({ cache })}
                min={0}
                max={100}
                suffix="%"
                hint="Share of input tokens read from cache."
              />
              <Field
                label="Retry rate"
                value={safe.retry}
                onChange={(retry) => update({ retry })}
                min={0}
                max={100}
                suffix="%"
                hint="Extra requests from retries and failures."
              />
              <Field
                label="Your chat plan"
                value={safe.plan}
                onChange={(plan) => update({ plan })}
                min={0}
                max={1_000_000}
                prefix="$"
                hint="Optional. Set 0 to hide the comparison."
              />
              {hasScheduled ? (
                <label className="flex items-start gap-3 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-muted">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-teal"
                    checked={safe.scheduled}
                    onChange={(event) => update({ scheduled: event.target.checked })}
                  />
                  <span>
                    Use Gemini 4 Carbon&apos;s scheduled December 1, 2026 price
                    <span className="mt-0.5 block text-2xs text-tertiary">
                      Google lists $2/$10 now, then $4/$20.
                    </span>
                  </span>
                </label>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-tertiary">
                Current snapshot checked <time dateTime={checkedISO}>{checkedAt}</time>.
              </p>
              <button
                type="button"
                className="text-sm text-teal hover:underline"
                onClick={() => {
                  setInputs(DEFAULTS)
                  setShareState('idle')
                }}
              >
                Reset to defaults
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 px-5 py-5 text-sm leading-relaxed text-muted sm:px-7">
            <p>
              The estimate charges every request at its model&apos;s list price for the
              input and output tokens you enter. Cache hits are billed at the cache-read
              rate; cache writes and cache storage are not modelled.
            </p>
            <p>
              Retries multiply the whole request, including output. Tool calls, web
              search, and reasoning tokens can add cost that this estimate misses. Your
              tokenizer may produce a different count for the same text.
            </p>
            <p>
              Long-context rates apply automatically when a single request exceeds that
              model&apos;s threshold: 100,000 input tokens for Claude Haiku 5.5 and
              272,000 for the GPT-6 models. The subscription comparison assumes a chat
              plan is an alternative for interactive work; it is not a production quota.
            </p>
          </div>
        )}

        <div className="border-t border-border px-5 py-5 sm:px-7">
          {eligible.length === 0 ? (
            <p className="mb-4 rounded-lg border border-amber bg-amber-subtle px-4 py-3 text-sm text-amber" role="alert">
              Every model here is over its context window at {numberFormat.format(safe.input)}{" "}
              input tokens per request. Reduce the input, split the task, or use a model
              with a larger window before treating these numbers as usable.
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="metric-card">
              <span>{eligible.length === 0 ? 'Lowest estimate' : 'Cheapest monthly'}</span>
              <strong className="text-teal">{formatMoney(cheapest.monthly)}</strong>
              <small>{cheapest.model.name}</small>
            </div>
            <div className="metric-card">
              <span>Cost per task</span>
              <strong>{formatMoney(cheapest.perTask)}</strong>
              <small>{formatMoney(cheapest.perThousand)} per 1,000 tasks</small>
            </div>
            <div className="metric-card">
              <span>Requests / month</span>
              <strong>{numberFormat.format(Math.round(cheapest.requests))}</strong>
              <small>
                {numberFormat.format(safe.tasks)} tasks × {safe.turns} turns
                {safe.retry > 0 ? ` + ${safe.retry}% retries` : ''}
              </small>
            </div>
            <div className="metric-card">
              <span>Cache savings</span>
              <strong>{formatMoney(cheapest.cacheSavings)}</strong>
              <small>
                {safe.cache > 0
                  ? `At a ${safe.cache}% hit rate on ${cheapest.model.name}`
                  : 'Set a cache hit rate to see savings'}
              </small>
            </div>
          </div>

          {safe.plan > 0 ? (
            <p className="mt-4 rounded-lg border border-border bg-bg px-4 py-3 text-sm leading-relaxed text-muted">
              Your plan costs {formatMoney(safe.plan)}/month. The Plan column shows which
              rows are cheaper on the API at this workload and which are cheaper on the
              plan. Compare within the same provider: a Claude plan is not a substitute
              for a DeepSeek API bill.†
            </p>
          ) : null}

          <div
            className="mt-5 overflow-x-auto"
            role="region"
            aria-label="Cost estimates by model"
            tabIndex={0}
          >
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="sr-only">
                Estimated monthly cost by model for the workload entered above
              </caption>
              <thead>
                <tr className="border-b border-border text-left text-2xs uppercase tracking-wider text-tertiary">
                  <th scope="col" className="py-2 pr-3 font-medium">Model</th>
                  <th scope="col" className="hidden pb-2 pr-3 font-medium sm:table-cell">Webdev*</th>
                  <th scope="col" className="pb-2 pr-3 text-right font-medium">Per task</th>
                  <th scope="col" className="pb-2 pr-3 text-right font-medium">Monthly</th>
                  <th scope="col" className="pb-2 pr-3 text-right font-medium">vs cheapest</th>
                  <th scope="col" className="pb-2 text-right font-medium">Plan†</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isCheapest = row.model.id === cheapest.model.id
                  return (
                    <tr
                      key={row.model.id}
                      className={`border-b border-border last:border-0 ${isCheapest ? 'bg-teal-subtle' : ''}`}
                    >
                      <td className="py-3 pr-3 align-top">
                        <span className="flex flex-wrap items-center gap-2 font-medium text-fg">
                          {row.model.name}
                          {isCheapest ? (
                            <span className="rounded-full bg-teal px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-bg">
                              Cheapest
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block text-2xs text-tertiary">
                          {row.model.publisher} · {numberFormat.format(row.model.contextTokens)} context
                        </span>
                        <span className="mt-1 flex flex-wrap gap-1">
                          {row.overContext ? (
                            <span className="rounded bg-amber-subtle px-1.5 py-0.5 text-[10px] text-amber">
                              Exceeds context
                            </span>
                          ) : null}
                          {row.longContext ? (
                            <span className="rounded bg-raised px-1.5 py-0.5 text-[10px] text-tertiary">
                              Long-context rate
                            </span>
                          ) : null}
                          {row.scheduled ? (
                            <span className="rounded bg-raised px-1.5 py-0.5 text-[10px] text-tertiary">
                              Dec 1 price
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td className="hidden py-3 pr-3 align-top sm:table-cell">
                        {row.model.quality ? (
                          <Link
                            href={row.model.quality.href}
                            className="text-teal no-underline"
                            title={`${row.model.quality.label} on ${row.model.quality.boardName}`}
                          >
                            {Math.round(row.model.quality.score)}
                          </Link>
                        ) : (
                          <span className="text-tertiary">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-3 text-right align-top tabular-nums text-muted">
                        {formatMoney(row.perTask)}
                      </td>
                      <td className="py-3 pr-3 text-right align-top font-medium tabular-nums text-fg">
                        {formatMoney(row.monthly)}
                      </td>
                      <td className="py-3 pr-3 text-right align-top tabular-nums text-tertiary">
                        {isCheapest
                          ? "—"
                          : `${(row.monthly / Math.max(cheapest.monthly, 0.000001)).toFixed(1)}×`}
                      </td>
                      <td className="py-3 text-right align-top tabular-nums">
                        {inputs.plan > 0 && !row.overContext ? (
                          row.monthly > safe.plan ? (
                            <span className="text-muted">Plan −{formatMoney(row.monthly - safe.plan)}</span>
                          ) : (
                            <span className="text-teal">API −{formatMoney(safe.plan - row.monthly)}</span>
                          )
                        ) : (
                          <span className="text-tertiary">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-2xs leading-relaxed text-tertiary">
            * Arena web-development score on {rows[0]?.model.quality?.sourceDate ?? "the snapshot date"},
            shown for context only. It is not a fitness score for your task, and a higher
            score does not mean a model is worth the difference.{" "}
            <Link href="/leaderboard" className="text-teal no-underline">See the boards →</Link>
          </p>
          <p className="mt-1.5 text-2xs leading-relaxed text-tertiary">
            † Plans have usage limits and are meant for interactive work. Treat this row
            as a sanity check, not a quota comparison.
          </p>

          {cheapest.cacheSavings > 0 ? (
            <p className="mt-3 text-xs leading-relaxed text-muted">
              At a {safe.cache}% cache hit rate, {cheapest.model.name} saves{" "}
              {formatMoney(cheapest.cacheSavings)}/month on this workload. A 0% hit rate
              would cost {formatMoney(cheapest.monthlyNoCache)}/month.
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <button type="button" className="btn-secondary" onClick={share}>
                Share these assumptions
              </button>
              <p className="mt-2 text-2xs text-tertiary" role="status">
                {shareState === 'copied'
                  ? 'Link copied. It contains the numbers, not your identity.'
                  : shareState === 'manual'
                    ? 'Copy the link below.'
                    : 'The link encodes the inputs. Nothing is saved on our side.'}
              </p>
              {shareState === 'manual' ? (
                <input
                  ref={shareRef}
                  readOnly
                  value={shareURL}
                  aria-label="Shareable calculator link"
                  className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs text-muted"
                />
              ) : null}
            </div>

            <form onSubmit={subscribe} className="w-full max-w-sm">
              <label htmlFor="model-economics-email" className="block text-xs font-medium text-muted">
                Get BuildnScale updates
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  id="model-economics-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-fg outline-none placeholder:text-tertiary focus:border-teal"
                />
                <button type="submit" className="btn-primary" disabled={emailState === 'sending'}>
                  {emailState === 'sending' ? 'Saving…' : 'Notify me'}
                </button>
              </div>
              <p className="mt-2 text-2xs leading-relaxed text-tertiary" role={emailState === 'error' ? 'alert' : 'status'}>
                {emailState === 'done'
                  ? 'Almost there. Check your inbox to confirm your subscription.'
                  : emailState === 'error'
                    ? 'That did not work. Try again, or open an issue on GitHub.'
                    : 'Low volume. Build logs and model price changes. Unsubscribe any time.'}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
