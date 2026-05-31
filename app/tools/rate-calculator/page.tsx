"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import Link from "next/link"
import {
  IconSettings,
  IconBook2,
} from "@tabler/icons-react"
import { ToolBreadcrumbs } from "@/components/ui/ToolBreadcrumbs"
import { SettingsDrawer } from "@/components/ui/SettingsDrawer"
import { Toast } from "@/components/ui/Toast"
import { UserGuideModal } from "@/components/ui/UserGuideModal"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { useSync } from "@/hooks/useSync"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "bns_ratecalc_"

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

const PROFIT_MARGINS = [0, 10, 20, 30] as const

function formatCurrency(n: number, currency: string = "$"): string {
  if (n >= 1000000) return `${currency}${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${currency}${n.toLocaleString("en-US")}`
  return `${currency}${n.toFixed(0)}`
}

function formatCurrencyDecimal(n: number, currency: string = "$"): string {
  return `${currency}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
  const invoiceNum = `INV-${String(invoiceNumber).padStart(4, "0")}`
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
      <div style="font-size:13px;color:#888">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
  </div>
  <div class="meta">
    <div class="meta-col">
      <strong>Bill To</strong>
      ${clientName || "Client"}
    </div>
    <div class="meta-col">
      <strong>Project</strong>
      ${projectDescription || "Professional services"}
    </div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Rate</th><th>Hours</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>${projectDescription || "Professional services"}</td><td>${currency}${(hourlyRate).toFixed(2)}/hr</td><td>${hoursBilled}</td><td>${currency}${total.toFixed(2)}</td></tr>
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
    "bns_ratecalc_income",
    "bns_ratecalc_expenses",
    "bns_ratecalc_hoursPerWeek",
    "bns_ratecalc_weeksPerYear",
    "bns_ratecalc_margin",
    "bns_ratecalc_hoursBilled",
    "bns_ratecalc_currency",
  ])

  const [monthlyIncome, setMonthlyIncome] = useState(() => loadJSON<number>(STORAGE_KEY + "income", 8000))
  const [expenses, setExpenses] = useState(() => loadJSON<number>(STORAGE_KEY + "expenses", 2000))
  const [hoursPerWeek, setHoursPerWeek] = useState(() => loadJSON<number>(STORAGE_KEY + "hoursPerWeek", 32))
  const [weeksPerYear, setWeeksPerYear] = useState(() => loadJSON<number>(STORAGE_KEY + "weeksPerYear", 46))
  const [profitMargin, setProfitMargin] = useState<(typeof PROFIT_MARGINS)[number]>(() => loadJSON<number>(STORAGE_KEY + "margin", 0) as (typeof PROFIT_MARGINS)[number])
  const [clientName, setClientName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [hoursBilled, setHoursBilled] = useState(() => loadJSON<number>(STORAGE_KEY + "hoursBilled", 40))
  const [currency, setCurrency] = useState(() => loadJSON<string>(STORAGE_KEY + "currency", "$"))
  const [isMobile, setIsMobile] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" | "info" } | null>(null)
  const [userGuideOpen, setUserGuideOpen] = useState(false)
  const invoiceCountRef = useRef(0)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => { saveJSON(STORAGE_KEY + "income", monthlyIncome) }, [monthlyIncome])
  useEffect(() => { saveJSON(STORAGE_KEY + "expenses", expenses) }, [expenses])
  useEffect(() => { saveJSON(STORAGE_KEY + "hoursPerWeek", hoursPerWeek) }, [hoursPerWeek])
  useEffect(() => { saveJSON(STORAGE_KEY + "weeksPerYear", weeksPerYear) }, [weeksPerYear])
  useEffect(() => { saveJSON(STORAGE_KEY + "margin", profitMargin) }, [profitMargin])
  useEffect(() => { saveJSON(STORAGE_KEY + "hoursBilled", hoursBilled) }, [hoursBilled])
  useEffect(() => { saveJSON(STORAGE_KEY + "currency", currency) }, [currency])

  const calculations = useMemo(() => {
    const totalNeeded = monthlyIncome + expenses
    const annualNeeded = totalNeeded * 12
    const billableHoursPerYear = hoursPerWeek * weeksPerYear
    const hourlyRate = Math.ceil(
      (annualNeeded / billableHoursPerYear) * (1 + profitMargin / 100)
    )
    const dayRate = hourlyRate * (hoursPerWeek / 5)
    const weekRate = hourlyRate * hoursPerWeek
    const monthRate = hourlyRate * hoursPerWeek * 4
    const yearRate = hourlyRate * billableHoursPerYear
    const invoiceTotal = hourlyRate * hoursBilled

    return { totalNeeded, annualNeeded, billableHoursPerYear, hourlyRate, dayRate, weekRate, monthRate, yearRate, invoiceTotal }
  }, [monthlyIncome, expenses, hoursPerWeek, weeksPerYear, profitMargin, hoursBilled])

  const generatePDF = useCallback(() => {
    const num = invoiceCountRef.current + 1
    invoiceCountRef.current = num
    const html = generateInvoiceHTML(
      calculations.hourlyRate, hoursBilled, clientName, projectDescription,
      calculations.invoiceTotal, currency, num
    )
    const win = window.open("", "_blank")
    if (win) {
      win.document.write(html)
      win.document.close()
    }
    setToast({ message: `Invoice #${String(num).padStart(4, "0")} generated`, variant: "success" })
  }, [calculations, hoursBilled, clientName, projectDescription, currency])

  const incomeSliderPercent = ((monthlyIncome - 500) / (30000 - 500)) * 100

  return (
    <div className="flex h-screen flex-col bg-bg">
      {/* Top Bar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-bg px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/" className="font-display text-sm font-semibold text-fg shrink-0">
            build<span className="text-teal">n</span>scale
          </Link>
          <div className="h-4 w-px bg-border shrink-0" />
          <ToolBreadcrumbs slug="rate-calculator" />
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button onClick={() => setUserGuideOpen(true)} className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:text-fg hover:bg-raised transition-colors">
            <IconBook2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Guide</span>
          </button>
          <ThemeToggle />
          <button onClick={() => setSettingsOpen(true)} className="text-tertiary hover:text-muted transition-colors">
            <IconSettings className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-bg">
        <div className="mx-auto max-w-[860px] px-4 md:px-5 py-8 md:py-12">
          <div className={cn("flex gap-6 md:gap-8", isMobile ? "flex-col" : "")}>
            {/* Left: Inputs */}
            <div className={cn(isMobile ? "w-full" : "w-full md:w-[55%] shrink-0")}>
              <div className="rounded-lg border border-border bg-surface p-5 md:p-7">
                <h2 className="mb-6 text-xs uppercase tracking-[0.08em] text-muted">Your numbers</h2>

                {/* Monthly Target Income */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs text-muted">Monthly target income</label>
                  <div className="flex items-baseline gap-2 rounded-md border border-border bg-raised px-3 py-3">
                    <span className="font-display text-xs text-tertiary">{currency}</span>
                    <input
                      type="text"
                      value={monthlyIncome.toLocaleString("en-US")}
                      onChange={(e) => {
                        const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10)
                        if (!isNaN(v)) setMonthlyIncome(Math.min(Math.max(v, 0), 999999))
                      }}
                      className="w-full bg-transparent font-display text-lg text-fg outline-none"
                    />
                  </div>
                  <div className="relative mt-3 h-1 w-full rounded-full bg-border">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-teal" style={{ width: `${Math.min(incomeSliderPercent, 100)}%` }} />
                    <input
                      type="range" min={500} max={30000} step={100}
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(parseInt(e.target.value, 10))}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-teal" style={{ left: `calc(${Math.min(incomeSliderPercent, 100)}% - 6px)` }} />
                  </div>
                </div>

                {/* Monthly Expenses */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs text-muted">Monthly expenses</label>
                  <div className="flex items-baseline gap-2 rounded-md border border-border bg-raised px-3 py-3">
                    <span className="font-display text-xs text-tertiary">{currency}</span>
                    <input
                      type="text"
                      value={expenses.toLocaleString("en-US")}
                      onChange={(e) => {
                        const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10)
                        if (!isNaN(v)) setExpenses(Math.min(Math.max(v, 0), 99999))
                      }}
                      className="w-full bg-transparent font-display text-lg text-fg outline-none"
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] text-tertiary">Rent, tools, taxes, health insurance…</div>
                </div>

                {/* Billable Hours Per Week */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs text-muted">Billable hours per week</label>
                  <div className="flex items-baseline gap-2 rounded-md border border-border bg-raised px-3 py-3">
                    <input
                      type="number"
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 168))}
                      className="w-full bg-transparent font-display text-lg text-fg outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="font-display text-xs text-tertiary">hours</span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-tertiary">Leave 8h/week for admin, sales, breaks</div>
                </div>

                {/* Weeks Per Year */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs text-muted">Weeks worked per year</label>
                  <div className="flex items-baseline gap-2 rounded-md border border-border bg-raised px-3 py-3">
                    <input
                      type="number"
                      value={weeksPerYear}
                      onChange={(e) => setWeeksPerYear(Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 52))}
                      className="w-full bg-transparent font-display text-lg text-fg outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="font-display text-xs text-tertiary">weeks</span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-tertiary">After holidays and sick days</div>
                </div>

                {/* Profit Margin */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs text-muted">Desired profit margin</label>
                  <div className="grid grid-cols-4 gap-1 rounded-md border border-border bg-raised p-1">
                    {PROFIT_MARGINS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setProfitMargin(m)}
                        className={cn(
                          "rounded-sm px-2 py-1.5 text-xs transition-all",
                          profitMargin === m ? "bg-teal font-medium text-bg" : "text-muted hover:text-fg"
                        )}
                      >
                        {m}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center font-display text-[11px] text-tertiary">
                Based on {weeksPerYear} billable weeks · {hoursPerWeek}h/week · {currency}{calculations.totalNeeded.toLocaleString("en-US")}/mo need
              </div>
            </div>

            {/* Right: Results */}
            <div className={cn("flex-1", isMobile ? "w-full mb-24" : "")}>
              <div className="rounded-lg border border-teal-muted bg-teal-subtle p-5 md:p-7 flex flex-col items-center">
                <span className="mb-6 font-display text-xs uppercase text-teal">Your Rate</span>

                {/* Primary Rate */}
                <div className="mb-8 text-center">
                  <div className="font-display text-5xl md:text-6xl font-bold leading-none text-fg">
                    {formatCurrency(calculations.hourlyRate, currency)}
                  </div>
                  <div className="mt-1 text-lg text-teal">/ hour</div>
                </div>

                {/* Breakdown Grid */}
                <div className="mb-8 grid w-full grid-cols-2 gap-3 md:gap-4">
                  <div className="rounded-md border border-border bg-bg p-3">
                    <span className="block font-display text-lg md:text-xl font-medium text-fg">{formatCurrency(calculations.dayRate, currency)}</span>
                    <span className="text-[11px] text-tertiary">per day</span>
                  </div>
                  <div className="rounded-md border border-border bg-bg p-3">
                    <span className="block font-display text-lg md:text-xl font-medium text-fg">{formatCurrency(calculations.weekRate, currency)}</span>
                    <span className="text-[11px] text-tertiary">per week</span>
                  </div>
                  <div className="rounded-md border border-border bg-bg p-3">
                    <span className="block font-display text-lg md:text-xl font-medium text-fg">{formatCurrency(calculations.monthRate, currency)}</span>
                    <span className="text-[11px] text-tertiary">per month</span>
                  </div>
                  <div className="rounded-md border border-border bg-bg p-3">
                    <span className="block font-display text-lg md:text-xl font-medium text-fg">{formatCurrency(calculations.yearRate, currency)}</span>
                    <span className="text-[11px] text-tertiary">per year</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mb-8 w-full border-t border-dashed border-teal/40" />

                {/* Invoice Section */}
                <div className="w-full">
                  <h3 className="mb-4 text-sm font-medium text-fg">Generate Invoice</h3>

                  <div className="mb-4">
                    <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Client name"
                      className="w-full rounded-md border border-border bg-raised px-3 py-2.5 text-sm text-fg outline-none placeholder:text-tertiary"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Project description"
                      className="w-full rounded-md border border-border bg-raised px-3 py-2.5 text-sm text-fg outline-none placeholder:text-tertiary"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="number"
                      value={hoursBilled}
                      onChange={(e) => setHoursBilled(Math.min(Math.max(parseInt(e.target.value, 10) || 0, 0), 1000))}
                      className="w-full rounded-md border border-border bg-raised px-3 py-2.5 text-sm text-fg outline-none"
                    />
                  </div>

                  <div className="mb-4 text-right font-display text-lg text-teal">
                    Total: {formatCurrencyDecimal(calculations.invoiceTotal, currency)}
                  </div>

                  <button
                    onClick={generatePDF}
                    className="mb-3 w-full rounded-md bg-teal py-3 text-sm font-semibold text-bg transition-all hover:brightness-110"
                  >
                    Generate PDF Invoice →
                  </button>


                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Result Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-teal-muted bg-teal-subtle px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="font-display text-xl font-bold text-fg">
              {formatCurrency(calculations.hourlyRate, currency)}
              <span className="ml-1 text-xs font-normal text-teal">/ hour</span>
            </div>
            <button onClick={generatePDF} className="rounded-md bg-teal px-4 py-2 text-xs font-semibold text-bg">
              Generate Invoice
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} variant={toast.variant} visible={!!toast} onDismiss={() => setToast(null)} />}

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Calculator Settings"
        settings={[
          { key: "currency", label: "Currency symbol", type: "select", value: currency, options: [{ label: "$ (USD)", value: "$" }, { label: "€ (EUR)", value: "€" }, { label: "£ (GBP)", value: "£" }, { label: "¥ (JPY)", value: "¥" }] },
          { key: "defaultHours", label: "Default hours/week", type: "number", value: hoursPerWeek, min: 1, max: 80, suffix: "hrs" },
        ]}
        onChange={(key, val) => {
          if (key === "currency") setCurrency(val as string)
          if (key === "defaultHours") setHoursPerWeek(val as number)
        }}
      />

      <UserGuideModal
        open={userGuideOpen}
        onClose={() => setUserGuideOpen(false)}
        toolId="rate-calculator"
      />
    </div>
  )
}
