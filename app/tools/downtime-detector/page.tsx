"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  IconActivity,
  IconPlus,
  IconX,
  IconArrowRight,
  IconExternalLink,
  IconRefresh,
  IconTrash,
  IconEdit,
  IconCheck,
} from "@tabler/icons-react"
import { useSession } from "next-auth/react"
import { ToolBreadcrumbs } from "@/components/ui/ToolBreadcrumbs"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

interface CheckResult {
  url: string
  is_up: boolean
  status_code: number | null
  response_ms: number
  checked_at: string
  region: string
  error_message?: string
}

interface Site {
  id: string
  url: string
  displayName: string | null
  isActive: boolean
  createdAt: string
  lastCheck: {
    isUp: boolean
    checkedAt: string
    responseMs: number | null
    statusCode: number | null
  } | null
  uptimePercent: number | null
  totalChecks: number
}

export default function DowntimeDetectorPage() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  const [url, setUrl] = useState("")
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState("")

  const [sites, setSites] = useState<Site[]>([])
  const [loadingSites, setLoadingSites] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addUrl, setAddUrl] = useState("")
  const [addName, setAddName] = useState("")
  const [adding, setAdding] = useState(false)

  const [checkingSiteId, setCheckingSiteId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const [history, setHistory] = useState<{ uptimePercent: number; days: { date: string; up: number; down: number }[] } | null>(null)

  const doCheck = useCallback(async (targetUrl: string) => {
    setChecking(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/downtime/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Check failed")
        return
      }
      setResult(data)
      const historyRes = await fetch(`/api/downtime/history?url=${encodeURIComponent(data.url)}`)
      if (historyRes.ok) {
        setHistory(await historyRes.json())
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setChecking(false)
    }
  }, [])

  const fetchSites = useCallback(async () => {
    try {
      const res = await fetch("/api/downtime/sites")
      if (res.ok) {
        setSites(await res.json())
      }
    } catch {
      // ignore
    } finally {
      setLoadingSites(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSites()
      const interval = setInterval(fetchSites, 60000)
      return () => clearInterval(interval)
    } else {
      setLoadingSites(false)
    }
  }, [isAuthenticated, fetchSites])

  const addSite = async () => {
    if (!addUrl.trim()) return
    setAdding(true)
    setError("")
    try {
      const res = await fetch("/api/downtime/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: addUrl.trim(), display_name: addName.trim() || null }),
      })
      const data = await res.json()
      if (res.ok) {
        setShowAddModal(false)
        setAddUrl("")
        setAddName("")
        await fetchSites()
        // Immediately check the newly added site
        checkSiteNow(data.id)
      } else {
        setError(data.error || "Failed to add site")
      }
    } catch {
      setError("Failed to add site")
    } finally {
      setAdding(false)
    }
  }

  const checkSiteNow = async (siteId: string) => {
    setCheckingSiteId(siteId)
    try {
      await fetch(`/api/downtime/sites/${siteId}/check`, { method: "POST" })
      await fetchSites()
    } catch {
      // ignore
    } finally {
      setCheckingSiteId(null)
    }
  }

  const deleteSite = async (siteId: string) => {
    try {
      const res = await fetch(`/api/downtime/sites/${siteId}`, { method: "DELETE" })
      if (res.ok) {
        setDeleteConfirmId(null)
        await fetchSites()
      }
    } catch {
      // ignore
    }
  }

  const updateDisplayName = async (siteId: string, name: string) => {
    try {
      const res = await fetch(`/api/downtime/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: name }),
      })
      if (res.ok) {
        setEditingSiteId(null)
        await fetchSites()
      }
    } catch {
      // ignore
    }
  }

  const statusBadge = (isUp: boolean) => {
    if (isUp) {
      return <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[11px] font-medium text-green-400 border border-green-500/30">ONLINE</span>
    }
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[11px] font-medium text-red-400 border border-red-500/30">DOWN</span>
  }

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins} min ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const Sparkline = ({ days }: { days: { up: number; total: number }[] }) => {
    const maxVal = Math.max(...days.map((d) => d.total), 1)
    return (
      <div className="flex items-end gap-[2px] h-8">
        {days.slice(-30).map((d, i) => {
          const ratio = d.total > 0 ? d.up / d.total : 0
          const height = Math.max(2, (d.total / maxVal) * 32)
          return (
            <div
              key={i}
              className="w-[3px] rounded-sm"
              style={{
                height: `${height}px`,
                background: ratio >= 0.99 ? "var(--color-teal)" : ratio >= 0.8 ? "var(--color-amber)" : "#E24B4A",
                opacity: ratio,
              }}
            />
          )
        })}
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-bg px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/" className="font-display text-sm font-semibold text-fg shrink-0">
            build<span className="text-teal">n</span>scale
          </Link>
          <div className="h-4 w-px bg-border shrink-0" />
          <ToolBreadcrumbs slug="downtime-detector" />
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto max-w-[800px] px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <IconActivity className="h-6 w-6 text-teal" />
            <h1 className="font-display text-3xl font-bold text-fg">Downtime Detector</h1>
          </div>
          <p className="text-sm text-muted">Check if any website is up. Monitor your own domains 24/7.</p>
        </div>

        {/* Guest Check */}
        <div className="mb-8">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && url.trim() && !checking) doCheck(url) }}
                placeholder="https://example.com"
                className="flex-1 rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-fg outline-none placeholder:text-tertiary focus:border-teal/50 font-mono"
              />
              <button
                onClick={() => doCheck(url)}
                disabled={!url.trim() || checking}
                className="rounded-lg bg-teal px-5 py-2.5 text-sm font-medium text-bg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checking ? "Checking..." : "Check Now"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="mb-8 rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-fg">{result.url.replace(/^https?:\/\//, "")}</span>
                {statusBadge(result.is_up)}
              </div>
              <span className="font-mono text-xs text-tertiary">
                {new Date(result.checked_at).toLocaleTimeString()}
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-bg p-3">
                <div className="text-[11px] text-tertiary mb-1">Response</div>
                <div className="font-mono text-sm text-fg">{result.response_ms}ms</div>
              </div>
              <div className="rounded-lg bg-bg p-3">
                <div className="text-[11px] text-tertiary mb-1">HTTP Status</div>
                <div className="font-mono text-sm text-fg">{result.status_code ?? "N/A"}</div>
              </div>
              <div className="rounded-lg bg-bg p-3">
                <div className="text-[11px] text-tertiary mb-1">SSL</div>
                <div className="font-mono text-sm text-fg">{result.is_up ? "Valid" : "N/A"}</div>
              </div>
            </div>

            {history && history.days.length > 0 && (
              <div className="border-t border-border pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] text-tertiary">30-day uptime: {history.uptimePercent}%</span>
                </div>
                <Sparkline days={history.days.map(d => ({ up: d.up, total: d.up + d.down }))} />
              </div>
            )}

            {!isAuthenticated && (
              <div className="mt-4 border-t border-border pt-4 text-center">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 text-sm text-teal hover:underline"
                >
                  Sign in to monitor this site 24/7 <IconArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Authenticated Dashboard */}
        {isAuthenticated && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-fg">My Monitored Sites</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-teal px-3.5 py-2 text-xs font-medium text-bg transition-all hover:brightness-110"
              >
                <IconPlus className="h-3.5 w-3.5" /> Add Site
              </button>
            </div>

            {loadingSites ? (
              <div className="py-12 text-center">
                <div className="spinner mx-auto" />
              </div>
            ) : sites.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
                <IconActivity className="mx-auto mb-3 h-8 w-8 text-tertiary" />
                <p className="text-sm text-muted">No sites monitored yet. Add your first site to start tracking uptime.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className="rounded-xl border border-border bg-surface p-5 transition-all hover:border-border-strong"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {editingSiteId === site.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="rounded border border-border bg-bg px-2 py-1 text-sm text-fg outline-none w-40"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") updateDisplayName(site.id, editName)
                                if (e.key === "Escape") setEditingSiteId(null)
                              }}
                            />
                            <button
                              onClick={() => updateDisplayName(site.id, editName)}
                              className="text-teal hover:text-green-400"
                            >
                              <IconCheck className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-sm font-medium text-fg truncate">
                            {site.displayName || site.url.replace(/^https?:\/\//, "")}
                          </span>
                        )}
                        {site.lastCheck
                          ? statusBadge(site.lastCheck.isUp)
                          : <span className="text-[11px] text-tertiary">Pending</span>
                        }
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => checkSiteNow(site.id)}
                          disabled={checkingSiteId === site.id}
                          className="rounded-md p-1.5 text-tertiary hover:text-fg hover:bg-raised transition-colors disabled:opacity-50"
                          title="Check now"
                        >
                          <IconRefresh className={`h-4 w-4 ${checkingSiteId === site.id ? "animate-spin" : ""}`} />
                        </button>
                        <button
                          onClick={() => { setEditingSiteId(site.id); setEditName(site.displayName || site.url.replace(/^https?:\/\//, "")) }}
                          className="rounded-md p-1.5 text-tertiary hover:text-fg hover:bg-raised transition-colors"
                          title="Edit name"
                        >
                          <IconEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(site.id)}
                          className="rounded-md p-1.5 text-tertiary hover:text-red-400 hover:bg-raised transition-colors"
                          title="Delete"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/tools/downtime-detector/${site.id}`}
                          className="rounded-md p-1.5 text-tertiary hover:text-fg hover:bg-raised transition-colors"
                          title="View details"
                        >
                          <IconExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-tertiary">
                      <span className="font-mono text-[10px] text-tertiary truncate max-w-[200px]">{site.url}</span>
                      {site.uptimePercent !== null && (
                        <span className="font-mono">{site.uptimePercent}% uptime</span>
                      )}
                      {site.lastCheck && (
                        <span>Checked {formatTimeAgo(site.lastCheck.checkedAt)}</span>
                      )}
                      {site.lastCheck?.responseMs !== null && site.lastCheck?.responseMs !== undefined && (
                        <span className="font-mono">{site.lastCheck.responseMs}ms</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Site Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-fg">Add Site</h3>
              <button onClick={() => setShowAddModal(false)} className="text-tertiary hover:text-fg">
                <IconX className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-xs text-tertiary">URL</label>
              <input
                type="text"
                value={addUrl}
                onChange={(e) => setAddUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-tertiary focus:border-teal/50 font-mono"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-xs text-tertiary">Display Name (optional)</label>
              <input
                type="text"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="My Blog"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-tertiary focus:border-teal/50"
              />
            </div>
            <button
              onClick={addSite}
              disabled={!addUrl.trim() || adding}
              className="w-full rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-bg transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? "Checking site..." : "Add & Check Now"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-xs rounded-xl border border-border bg-surface p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 font-display text-base font-semibold text-fg">Remove site?</h3>
            <p className="mb-4 text-sm text-muted">All check history will be deleted. This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => deleteSite(deleteConfirmId)}
                className="flex-1 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-fg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
