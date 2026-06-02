"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconArrowLeft, IconActivity } from "@tabler/icons-react"
import { useSession } from "next-auth/react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

interface SiteDetail {
  siteId: string
  url: string
  displayName: string | null
  uptimePercent: number
  totalChecks: number
  upChecks: number
  downChecks: number
  days: {
    date: string
    up: number
    down: number
    total: number
    avgResponseMs: number | null
  }[]
  incidents: {
    id: string
    checkedAt: string
    statusCode: number | null
    region: string | null
    errorMessage: string | null
    responseMs: number | null
  }[]
  range: number
}

export default function SiteDetailPage() {
  const { data: session, status: authStatus } = useSession()
  const params = useParams()
  const siteId = params?.siteId as string

  const [data, setData] = useState<SiteDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [range, setRange] = useState(30)

  const fetchDetail = useCallback(async () => {
    try {
      const res = await fetch(`/api/downtime/sites/${siteId}/checks?range=${range}`)
      if (!res.ok) {
        if (res.status === 401) {
          setError("Please sign in to view this page")
        } else {
          setError("Site not found")
        }
        return
      }
      setData(await res.json())
    } catch {
      setError("Failed to load site data")
    } finally {
      setLoading(false)
    }
  }, [siteId, range])

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchDetail()
    } else if (authStatus === "unauthenticated") {
      setLoading(false)
      setError("Please sign in to view this page")
    }
  }, [authStatus, fetchDetail])

  const statusBadge = (isUp: boolean) => {
    if (isUp) {
      return <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[11px] font-medium text-green-400 border border-green-500/30">ONLINE</span>
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[11px] font-medium text-red-400 border border-red-500/30">DOWN</span>
  }

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const formatDuration = (start: string, end?: string) => {
    const s = new Date(start).getTime()
    const e = end ? new Date(end).getTime() : Date.now()
    const diff = e - s
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "<1m"
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    const remMins = mins % 60
    return `${hours}h ${remMins}m`
  }

  const BarChart = ({ days }: { days: { date: string; up: number; total: number }[] }) => {
    const maxVal = Math.max(...days.map((d) => d.total), 1)
    const barWidth = Math.max(4, Math.min(16, 400 / days.length))
    return (
      <div className="flex items-end gap-[3px] h-32 overflow-x-auto pb-1">
        {days.map((d, i) => {
          const ratio = d.total > 0 ? d.up / d.total : 0
          const height = Math.max(2, (d.total / maxVal) * 100)
          return (
            <div
              key={i}
              className="rounded-sm shrink-0"
              title={`${d.date}: ${d.up}/${d.total} up (${Math.round(ratio * 100)}%)`}
              style={{
                width: `${barWidth}px`,
                height: `${height}px`,
                background: ratio >= 0.99 ? "var(--color-teal)" : ratio >= 0.8 ? "var(--color-amber)" : "#E24B4A",
                opacity: Math.max(0.3, ratio),
              }}
            />
          )
        })}
      </div>
    )
  }

  const LineChart = ({ days }: { days: { date: string; avgResponseMs: number | null }[] }) => {
    const values = days.map((d) => d.avgResponseMs ?? 0)
    const maxVal = Math.max(...values, 1)
    const w = 600
    const h = 160
    const points = values.map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w
      const y = h - (v / maxVal) * h * 0.85 - 8
      return `${x},${y}`
    })
    const pathD = points.length > 1 ? `M${points.join(" L")}` : ""

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
        {pathD && (
          <path d={pathD} fill="none" stroke="var(--color-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {values.map((v, i) => {
          if (v === 0) return null
          const x = (i / Math.max(values.length - 1, 1)) * w
          const y = h - (v / maxVal) * h * 0.85 - 8
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2.5"
              fill="var(--color-teal)"
              className="hover:r-4 transition-all"
            />
          )
        })}
        {values.length > 0 && (
          <>
            <text x="0" y="12" className="fill-tertiary" fontSize="10">{maxVal}ms</text>
            <text x="0" y={h - 4} className="fill-tertiary" fontSize="10">0ms</text>
          </>
        )}
      </svg>
    )
  }

  const rangeButton = (value: number, label: string) => (
    <button
      onClick={() => setRange(value)}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
        range === value
          ? "bg-teal text-bg"
          : "border border-border bg-raised text-muted hover:text-fg"
      }`}
    >
      {label}
    </button>
  )

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="flex h-[52px] items-center border-b border-border px-4">
          <Link href="/tools/downtime-detector" className="flex items-center gap-2 text-sm text-muted hover:text-fg">
            <IconArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
        <div className="mx-auto max-w-[800px] px-4 py-20 text-center">
          <p className="text-sm text-tertiary">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex h-[52px] items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Link href="/tools/downtime-detector" className="flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors">
            <IconArrowLeft className="h-4 w-4" /> Downtime Detector
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="font-mono text-sm text-fg">{data.displayName || data.url.replace(/^https?:\/\//, "")}</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-[800px] px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-fg">
              {data.displayName || data.url.replace(/^https?:\/\//, "")}
            </h1>
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-tertiary hover:text-muted">
              {data.url} ↗
            </a>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-display text-fg">{data.uptimePercent}%</div>
            <div className="text-[11px] text-tertiary">uptime ({data.range}d)</div>
          </div>
        </div>

        {/* Range Toggle */}
        <div className="mb-6 flex gap-2">
          {rangeButton(7, "7d")}
          {rangeButton(30, "30d")}
          {rangeButton(90, "90d")}
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="text-[11px] text-tertiary mb-1">Total Checks</div>
            <div className="font-mono text-lg text-fg">{data.totalChecks.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="text-[11px] text-tertiary mb-1">Up</div>
            <div className="font-mono text-lg text-green-400">{data.upChecks.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="text-[11px] text-tertiary mb-1">Down</div>
            <div className="font-mono text-lg text-red-400">{data.downChecks.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="text-[11px] text-tertiary mb-1">Incidents</div>
            <div className="font-mono text-lg text-fg">{data.incidents.length}</div>
          </div>
        </div>

        {/* Uptime Bar Chart */}
        <div className="mb-8 rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-display text-sm font-semibold text-fg">Daily Uptime</h2>
          <BarChart days={data.days} />
          <div className="mt-2 flex justify-between text-[10px] text-tertiary">
            <span>{data.days[0]?.date}</span>
            <span>{data.days[data.days.length - 1]?.date}</span>
          </div>
        </div>

        {/* Response Time Line Chart */}
        <div className="mb-8 rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-display text-sm font-semibold text-fg">Response Time</h2>
          <LineChart days={data.days} />
        </div>

        {/* Incident Table */}
        <div className="mb-8 rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-display text-sm font-semibold text-fg">Incident Log</h2>
          {data.incidents.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-tertiary">
              No incidents recorded in this period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Started</th>
                    <th className="px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Duration</th>
                    <th className="px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Status Code</th>
                    <th className="px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Region</th>
                    <th className="px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {data.incidents.map((inc, i) => (
                    <tr key={inc.id} className="border-t border-border text-muted">
                      <td className="px-3 py-3 whitespace-nowrap">{formatTimestamp(inc.checkedAt)}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {i > 0
                          ? formatDuration(data.incidents[i - 1]?.checkedAt ?? inc.checkedAt, inc.checkedAt)
                          : formatDuration(inc.checkedAt)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap font-mono">{inc.statusCode ?? "N/A"}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{inc.region ?? "—"}</td>
                      <td className="px-3 py-3 max-w-[200px] truncate" title={inc.errorMessage ?? ""}>
                        {inc.errorMessage ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
