'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Snapshot } from '@/lib/benchmarks/types'
import { estimateCost } from '@/lib/benchmarks/core.mjs'
export function ValueExplorer({ snapshots }: { snapshots: Snapshot[] }) {
  const [input, setInput] = useState(2000),
    [output, setOutput] = useState(500),
    [requests, setRequests] = useState(1000)
  const models = snapshots.flatMap((s) =>
    s.models
      .filter((m) => m.pricing?.input != null && m.pricing?.output != null)
      .map((m) => ({ m, s }))
  )
  return (
    <>
      <div className="grid gap-5 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-3">
        {[
          ['Input tokens / request', input, setInput],
          ['Output tokens / request', output, setOutput],
          ['Requests / month', requests, setRequests],
        ].map(([label, value, set]) => (
          <label key={String(label)} className="text-sm text-muted">
            {String(label)}
            <input
              type="number"
              min="0"
              max="1000000000"
              className="workspace-input mt-2 min-h-11"
              value={value as number}
              onChange={(e) =>
                (set as (v: number) => void)(
                  Math.max(0, Math.min(1e9, Number(e.target.value) || 0))
                )
              }
            />
          </label>
        ))}
      </div>
      <p className="my-5 text-sm leading-relaxed text-muted">
        USD estimate = requests × (input tokens × input rate + output tokens ×
        output rate) ÷ 1,000,000. Excludes caching, batch discounts, tool fees,
        retries, taxes, and separately billed reasoning tokens.
      </p>
      {!models.length ? (
        <div className="rounded-2xl border border-dashed border-border-strong p-8 sm:p-12">
          <span className="eyebrow">PRICING COVERAGE</span>
          <h2 className="mt-4 text-2xl font-semibold">
            No verified price feed published yet.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            The historical EvalPlus source contains coding scores, not prices or
            speed measurements. Price rankings will appear when an attributed,
            permitted pricing source is connected. Coding scores remain
            available now.
          </p>
          <Link className="btn-primary mt-6" href="/leaderboard/coding">
            Explore coding results →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="benchmark-table">
            <caption className="sr-only">Estimated monthly token costs</caption>
            <thead>
              <tr>
                <th>Model</th>
                <th>Input / 1M</th>
                <th>Output / 1M</th>
                <th>Monthly estimate</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {models
                .sort(
                  (a, b) =>
                    estimateCost(a.m.pricing, input, output, requests)! -
                    estimateCost(b.m.pricing, input, output, requests)!
                )
                .map(({ m, s }) => (
                  <tr key={m.id}>
                    <th>
                      <Link href={`/models/${m.id}`}>{m.name}</Link>
                    </th>
                    <td>${m.pricing!.input}</td>
                    <td>${m.pricing!.output}</td>
                    <td className="font-mono text-teal">
                      $
                      {estimateCost(
                        m.pricing,
                        input,
                        output,
                        requests
                      )!.toFixed(2)}
                    </td>
                    <td>
                      <a className="text-teal" href={s.sourceURL}>
                        Evidence ↗
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
