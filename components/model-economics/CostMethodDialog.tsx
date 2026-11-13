'use client'

import { useEffect, useId, useRef } from 'react'
import { IconInfoCircle, IconX } from '@tabler/icons-react'

const tokenFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

type CostMethodDialogProps = {
  modelCount: number
  checkedLabel: string
  checkedISO: string
  defaultLow: string
  defaultHigh: string
  workload: {
    tasks: number
    turns: number
    input: number
    output: number
    retry: number
  }
}

const STEPS = [
  {
    label: '01 · Requests',
    formula: 'tasks × turns × (1 + retry rate)',
    note: 'A retry is billed like a fresh request, output included.',
  },
  {
    label: '02 · Per request',
    formula: 'input × rate + output × rate',
    note: 'Cache hits use the cache-read rate. Cache writes and storage are excluded.',
  },
  {
    label: '03 · Monthly',
    formula: 'requests × cost per request',
    note: 'Cost per task divides by tasks, not by requests.',
  },
]

export function CostMethodDialog({
  modelCount,
  checkedLabel,
  checkedISO,
  defaultLow,
  defaultHigh,
  workload,
}: CostMethodDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousOverflow = useRef('')
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const unlock = () => {
      document.body.style.overflow = previousOverflow.current
    }
    dialog.addEventListener('close', unlock)
    return () => {
      dialog.removeEventListener('close', unlock)
      unlock()
    }
  }, [])

  function open() {
    const dialog = dialogRef.current
    if (!dialog) return
    previousOverflow.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
  }

  function close() {
    dialogRef.current?.close()
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="btn-secondary mt-6 px-4 py-2.5"
      >
        <IconInfoCircle className="h-4 w-4 text-teal" aria-hidden="true" />
        See how cost per task calculated
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === dialogRef.current) close()
        }}
        className="cost-dialog m-auto w-[calc(100%_-_2rem)] max-w-[40rem] overflow-hidden rounded-2xl border border-border-strong bg-surface p-0 text-fg shadow-2xl"
      >
        <div className="flex max-h-[85dvh] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <div>
              <p className="eyebrow">WORKLOAD → BILL</p>
              <h2
                id={titleId}
                className="mt-1.5 font-display text-lg font-semibold text-fg"
              >
                How cost per task is calculated
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close dialog"
              className="rounded-lg p-2 text-muted transition-colors hover:bg-raised hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              <IconX className="h-5 w-5" />
            </button>
          </header>

          <div className="overflow-y-auto px-5 py-5 sm:px-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-bg px-2.5 py-1 text-2xs text-tertiary">
                {modelCount} models
              </span>
              <span className="rounded-full border border-border bg-bg px-2.5 py-1 text-2xs text-tertiary">
                Prices checked{" "}
                <time dateTime={checkedISO}>{checkedLabel}</time>
              </span>
              <span className="rounded-full border border-border bg-bg px-2.5 py-1 text-2xs text-tertiary">
                Runs in your browser
              </span>
              <span className="rounded-full border border-border bg-bg px-2.5 py-1 text-2xs text-tertiary">
                No provider keys
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              Default workload — {tokenFormat.format(workload.tasks)} tasks ×{' '}
              {workload.turns} turns, {tokenFormat.format(workload.input)} input and{' '}
              {tokenFormat.format(workload.output)} output tokens per request,{' '}
              {workload.retry}% retries:{' '}
              <strong className="font-medium text-fg">
                {defaultLow}–{defaultHigh} per month
              </strong>{" "}
              across these models.
            </p>

            <dl className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-bg">
              {STEPS.map((step) => (
                <div key={step.label} className="px-4 py-3">
                  <dt className="text-2xs font-medium uppercase tracking-wider text-teal">
                    {step.label}
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-fg">{step.formula}</dd>
                  <dd className="mt-1 text-xs leading-relaxed text-muted">
                    {step.note}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-2xs leading-relaxed text-tertiary">
              Dated list prices, not live quotes. An estimate is not a bill; taxes,
              discounts, tools, and cache writes are excluded.
            </p>
          </div>
        </div>
      </dialog>
    </>
  )
}
