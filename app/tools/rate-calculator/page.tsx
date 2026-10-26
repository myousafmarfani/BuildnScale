'use client'

import { useState, useMemo, useCallback, useRef } from 'react'

import { Toast } from '@/components/ui/Toast'
import { UserGuideModal } from '@/components/ui/UserGuideModal'

import { ToolPageIntro } from '@/components/workspace/ToolPageIntro'
import { useLocalSetting } from '@/hooks/useLocalSetting'
import { useSync } from '@/hooks/useSync'

const STORAGE_KEY = 'bns_ratecalc_'

const PROFIT_MARGINS = [0, 10, 20, 30] as const

function formatCurrency(n: number, currency: string = '$'): string {
  if (n >= 1000000) return `${currency}${(n / 1000000).toFixed(1)}M`
  if (n >= 1000)
    return `${currency}${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  return `${currency}${n.toFixed(0)}`
}

function formatCurrencyDecimal(n: number, currency: string = '$'): string {
  return `${currency}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function escapeHTML(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]!
  )
}
function generateInvoiceHTML(
  hourlyRate: number,
  hoursBilled: number,
  clientName: string,
  projectDescription: string,
  total: number,
  currency: string,
  invoiceNumber: number
): string {
  currency = escapeHTML(currency)
  const invoiceNum = `INV-${String(invoiceNumber).padStart(4, '0')}`
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Invoice ${invoiceNum}</title>
<style>
  @media print { @page { margin: 0.75in; } body { font-family: 'Helvetica', Arial, sans-serif; color: #222; } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica', Arial, sans-serif; padding: 40px; color: #222; line-height: 1.5; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
  .brand { font-size: 22px; font-weight: 700; color: #0d9488; }
  .brand span { color: #222; }
  .invoice-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-top: 4px; }
  .meta { margin-bottom: 32px; display: flex; gap: 48px; }
  .meta-col { font-size: 13px; color: #555; }
  .meta-col strong { color: #222; display: block; font-size: 14px; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #0d9488; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888; }
  td { padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 14px; }
  td:last-child, th:last-child { text-align: right; }
  .total-row td { border-bottom: none; padding-top: 16px; }
  .total-row td:last-child { font-size: 22px; font-weight: 700; color: #0d9488; }
  .footer { margin-top: 48px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 16px; }
  .btn { margin-top: 32px; padding: 10px 24px; background: #0d9488; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
  @media print { .btn { display: none; } }
</style></head>
<body>
  <div class="header">
    <div>
      <div class="brand">build<span>n</span>scale</div>
      <div class="invoice-title">Invoice</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:24px;font-weight:700">${invoiceNum}</div>
      <div style="font-size:13px;color:#888">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  </div>
  <div class="meta">
    <div class="meta-col">
      <strong>Bill To</strong>
      ${escapeHTML(clientName || 'Client')}
    </div>
    <div class="meta-col">
      <strong>Project</strong>
      ${escapeHTML(projectDescription || 'Professional services')}
    </div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Rate</th><th>Hours</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>${escapeHTML(projectDescription || 'Professional services')}</td><td>${currency}${hourlyRate.toFixed(2)}/hr</td><td>${hoursBilled}</td><td>${currency}${total.toFixed(2)}</td></tr>
      <tr class="total-row"><td colspan="3" style="text-align:right;font-weight:600">Total Due</td><td>${currency}${total.toFixed(2)}</td></tr>
    </tbody>
  </table>
  <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  <div class="footer">Thank you for your business</div>
  <script>setTimeout(() => window.print(), 600)</script>
</body></html>`
}

export default function RateCalculatorPage() {
  useSync([
    'bns_ratecalc_income',
    'bns_ratecalc_expenses',
    'bns_ratecalc_hoursPerWeek',
    'bns_ratecalc_weeksPerYear',
    'bns_ratecalc_margin',
    'bns_ratecalc_hoursBilled',
    'bns_ratecalc_currency',
  ])

  const [monthlyIncome, setMonthlyIncome] = useLocalSetting<number>(
    STORAGE_KEY + 'income',
    8000
  )
  const [expenses, setExpenses] = useLocalSetting<number>(
    STORAGE_KEY + 'expenses',
    2000
  )
  const [hoursPerWeek, setHoursPerWeek] = useLocalSetting<number>(
    STORAGE_KEY + 'hoursPerWeek',
    32
  )
  const [weeksPerYear, setWeeksPerYear] = useLocalSetting<number>(
    STORAGE_KEY + 'weeksPerYear',
    46
  )
  const [profitMargin, setProfitMargin] = useLocalSetting<
    (typeof PROFIT_MARGINS)[number]
  >(STORAGE_KEY + 'margin', 0)
  const [clientName, setClientName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [hoursBilled, setHoursBilled] = useLocalSetting<number>(
    STORAGE_KEY + 'hoursBilled',
    40
  )
  const [currency, setCurrency] = useLocalSetting<string>(
    STORAGE_KEY + 'currency',
    '$'
  )
  const [toast, setToast] = useState<{
    message: string
    variant: 'success' | 'error' | 'info'
  } | null>(null)
  const [userGuideOpen, setUserGuideOpen] = useState(false)
  const invoiceCountRef = useRef(0)

  const calculations = useMemo(() => {
    const totalNeeded = Math.max(0, monthlyIncome) + Math.max(0, expenses)
    const annualNeeded = totalNeeded * 12
    const billableHoursPerYear =
      Math.max(1, hoursPerWeek) * Math.max(1, weeksPerYear)
    const hourlyRate = Math.ceil(
      (annualNeeded / Math.max(1, billableHoursPerYear)) *
        (1 + profitMargin / 100)
    )
    const dayRate = hourlyRate * (hoursPerWeek / 5)
    const weekRate = hourlyRate * hoursPerWeek
    const monthRate = (hourlyRate * billableHoursPerYear) / 12
    const yearRate = hourlyRate * billableHoursPerYear
    const invoiceTotal = hourlyRate * hoursBilled

    return {
      totalNeeded,
      annualNeeded,
      billableHoursPerYear,
      hourlyRate,
      dayRate,
      weekRate,
      monthRate,
      yearRate,
      invoiceTotal,
    }
  }, [
    monthlyIncome,
    expenses,
    hoursPerWeek,
    weeksPerYear,
    profitMargin,
    hoursBilled,
  ])

  const generatePDF = useCallback(() => {
    const num = invoiceCountRef.current + 1
    invoiceCountRef.current = num
    const html = generateInvoiceHTML(
      calculations.hourlyRate,
      hoursBilled,
      clientName,
      projectDescription,
      calculations.invoiceTotal,
      currency,
      num
    )
    const win = window.open('', '_blank')
    if (!win) {
      setToast({
        message: 'Allow pop-ups to open the printable invoice.',
        variant: 'error',
      })
      return
    }
    win.opener = null
    win.document.write(html)
    win.document.close()
    setToast({
      message: `Invoice #${String(num).padStart(4, '0')} generated`,
      variant: 'success',
    })
  }, [calculations, hoursBilled, clientName, projectDescription, currency])

  return (
    <div className="tool-page-scroll">
      <div className="tool-page-container">
        <ToolPageIntro
          eyebrow="PRICE YOUR TIME / WITH INTENTION"
          title="Build a rate around your real life."
          description="Start with what you need to earn. Account for the time you can actually bill. These are planning estimates, not tax advice."
          onGuide={() => setUserGuideOpen(true)}
        >
          <label className="tool-field-inline">
            Currency
            <select
              aria-label="Invoice and rate currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {[
                ['$', 'USD · $'],
                ['€', 'EUR · €'],
                ['£', 'GBP · £'],
                ['PKR ', 'PKR · Rs'],
                ['CA$', 'CAD · CA$'],
                ['A$', 'AUD · A$'],
              ].map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </ToolPageIntro>
        <div className="rate-layout">
          <div className="space-y-5">
            <section className="tool-panel p-5 sm:p-7">
              <p className="eyebrow mb-2">01 / WHAT YOU NEED</p>
              <h2 className="mb-6 text-xl font-semibold tracking-tight">
                Set your monthly target.
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <RateField
                  label="Take-home income goal"
                  hint="Your personal monthly target, before any taxes you need to budget."
                  value={monthlyIncome}
                  onChange={setMonthlyIncome}
                  min={0}
                  max={9999999}
                  suffix={currency}
                />
                <RateField
                  label="Monthly business expenses"
                  hint="Software, equipment, workspace, and other regular costs."
                  value={expenses}
                  onChange={setExpenses}
                  min={0}
                  max={9999999}
                  suffix={currency}
                />
              </div>
            </section>
            <section className="tool-panel p-5 sm:p-7">
              <p className="eyebrow mb-2">02 / WHAT YOU CAN BILL</p>
              <h2 className="mb-6 text-xl font-semibold tracking-tight">
                Leave room for being human.
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <RateField
                  label="Billable hours each week"
                  hint="Exclude admin, marketing, learning, and unpaid meetings."
                  value={hoursPerWeek}
                  onChange={setHoursPerWeek}
                  min={1}
                  max={80}
                  suffix="hours"
                />
                <RateField
                  label="Working weeks each year"
                  hint="Allow time for holidays, illness, and quieter periods."
                  value={weeksPerYear}
                  onChange={setWeeksPerYear}
                  min={1}
                  max={52}
                  suffix="weeks"
                />
              </div>
              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-medium">
                  Add a pricing buffer
                </legend>
                <p className="mb-3 text-xs leading-relaxed text-muted">
                  A markup above your break-even target for uncertainty and
                  growth.
                </p>
                <div className="segmented-control">
                  {PROFIT_MARGINS.map((value) => (
                    <button
                      type="button"
                      key={value}
                      aria-pressed={profitMargin === value}
                      onClick={() => setProfitMargin(value)}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </fieldset>
            </section>
          </div>
          <aside className="rate-result tool-panel">
            <div className="rate-result-top">
              <p className="eyebrow mb-4">YOUR ESTIMATED HOURLY RATE</p>
              <p className="rate-number">
                {formatCurrency(calculations.hourlyRate, currency)}
                <span>/hr</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                A starting point based on your goals, availability, and{' '}
                {profitMargin}% buffer.
              </p>
            </div>
            <dl className="rate-breakdown">
              <div>
                <dt>Per billable day</dt>
                <dd>{formatCurrency(calculations.dayRate, currency)}</dd>
              </div>
              <div>
                <dt>Monthly average revenue</dt>
                <dd>{formatCurrency(calculations.monthRate, currency)}</dd>
              </div>
              <div>
                <dt>Annual billable hours</dt>
                <dd>{calculations.billableHoursPerYear.toLocaleString()}</dd>
              </div>
            </dl>
            <div className="border-t border-border p-5">
              <p className="text-xs leading-relaxed text-muted">
                Formula: (monthly income + expenses) × 12 ÷ annual billable
                hours, plus your buffer. Rounded up. Taxes and payment fees are
                not included.
              </p>
              <a className="btn-primary mt-5 w-full" href="#invoice-builder">
                Use this rate in an invoice ↓
              </a>
            </div>
          </aside>
        </div>
        <section
          id="invoice-builder"
          className="tool-panel mt-6 scroll-mt-5 p-5 sm:p-7"
        >
          <div className="mb-6">
            <p className="eyebrow mb-2">03 / PUT YOUR RATE TO WORK</p>
            <h2 className="text-xl font-semibold tracking-tight">
              Prepare a simple invoice.
            </h2>
            <p className="mt-2 text-sm text-muted">
              Fill in the details, then print or save as PDF in your browser.
            </p>
          </div>
          <div className="grid items-start gap-7 xl:grid-cols-[1.2fr_1fr]">
            <div className="space-y-5">
              <label className="block text-sm font-medium">
                Client name
                <input
                  className="workspace-input mt-2"
                  maxLength={150}
                  placeholder="Who are you billing?"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Project or service
                <input
                  className="workspace-input mt-2"
                  maxLength={300}
                  placeholder="e.g. Website development"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </label>
              <RateField
                label="Hours to invoice"
                hint="The work you completed for this client."
                value={hoursBilled}
                onChange={setHoursBilled}
                min={0.5}
                max={10000}
                suffix="hours"
                step={0.5}
              />
            </div>
            <div className="invoice-summary">
              <p className="mb-5 text-[10px] font-mono uppercase tracking-widest text-muted">
                INVOICE SUMMARY
              </p>
              <p className="break-words text-base font-semibold">
                {clientName || 'Your client'}
              </p>
              <p className="mt-2 break-words text-sm text-muted">
                {projectDescription || 'Your project or service'}
              </p>
              <div className="my-6 flex justify-between border-y border-border py-4 text-sm text-muted">
                <span>{Math.max(0, hoursBilled)} hours</span>
                <span>
                  × {formatCurrency(calculations.hourlyRate, currency)}/hr
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm">Total due</span>
                <strong className="text-3xl font-semibold tracking-tight">
                  {formatCurrencyDecimal(calculations.invoiceTotal, currency)}
                </strong>
              </div>
              <button
                className="btn-primary mt-6 w-full"
                disabled={
                  !clientName.trim() ||
                  !projectDescription.trim() ||
                  hoursBilled <= 0
                }
                onClick={generatePDF}
              >
                Print / save invoice as PDF ↗
              </button>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {!clientName.trim() || !projectDescription.trim()
                  ? 'Add a client name and project to prepare your invoice.'
                  : 'Opens a printable invoice in a new tab.'}
              </p>
            </div>
          </div>
        </section>
        {toast && (
          <Toast
            message={toast.message}
            variant={toast.variant}
            visible={true}
            onDismiss={() => setToast(null)}
          />
        )}
        <UserGuideModal
          open={userGuideOpen}
          onClose={() => setUserGuideOpen(false)}
          toolId="rate-calculator"
        />
      </div>
    </div>
  )
}
function RateField({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  suffix,
  step = 1,
}: {
  label: string
  hint: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  suffix: string
  step?: number
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <span className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-bg px-4">
        <input
          aria-label={label}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const next = Number(e.target.value)
            if (Number.isFinite(next))
              onChange(Math.max(0, Math.min(max, next)))
          }}
          onBlur={() => onChange(Math.max(min, Math.min(max, value)))}
          className="min-h-[56px] min-w-0 w-full bg-transparent text-xl font-medium outline-none"
        />
        <span className="shrink-0 text-xs text-muted">{suffix}</span>
      </span>
      <span className="mt-2 block text-xs leading-relaxed text-muted">
        {hint}
      </span>
    </label>
  )
}
