'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  IconPlus,
  IconArrowRight,
  IconExternalLink,
  IconRefresh,
  IconTrash,
  IconEdit,
} from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import {
  ToolPageIntro,
  EmptyToolState,
} from '@/components/workspace/ToolPageIntro'

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
              background:
                ratio >= 0.99
                  ? 'var(--color-teal)'
                  : ratio >= 0.8
                    ? 'var(--color-amber)'
                    : '#E24B4A',
              opacity: d.total > 0 ? 1 : 0.25,
            }}
          />
        )
      })}
    </div>
  )
}

export default function DowntimeDetectorPage() {
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'

  const [url, setUrl] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState('')

  const [sites, setSites] = useState<Site[]>([])
  const [loadingSites, setLoadingSites] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addUrl, setAddUrl] = useState('')
  const [addName, setAddName] = useState('')
  const [adding, setAdding] = useState(false)

  const [checkingSiteId, setCheckingSiteId] = useState<string | null>(null)
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const [history, setHistory] = useState<{
    uptimePercent: number
    days: { date: string; up: number; down: number }[]
  } | null>(null)

  const doCheck = useCallback(async (targetUrl: string) => {
    setChecking(true)
    setError('')
    setResult(null)
    setHistory(null)
    try {
      const res = await fetch('/api/downtime/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Check failed')
        return
      }
      setResult(data)
      const historyRes = await fetch(
        `/api/downtime/history?url=${encodeURIComponent(data.url)}`
      )
      if (historyRes.ok) {
        setHistory(await historyRes.json())
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setChecking(false)
    }
  }, [])

  const fetchSites = useCallback(async () => {
    try {
      const res = await fetch('/api/downtime/sites')
      if (res.ok) {
        setSites(await res.json())
      } else {
        setError('Could not load monitors. Please try again.')
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
    setError('')
    try {
      const res = await fetch('/api/downtime/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: addUrl.trim(),
          display_name: addName.trim() || null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setShowAddModal(false)
        setAddUrl('')
        setAddName('')
        await fetchSites()
        // Immediately check the newly added site
        checkSiteNow(data.id)
      } else {
        setError(data.error || 'Failed to add site')
      }
    } catch {
      setError('Failed to add site')
    } finally {
      setAdding(false)
    }
  }

  const checkSiteNow = async (siteId: string) => {
    setCheckingSiteId(siteId)
    try {
      const response = await fetch(`/api/downtime/sites/${siteId}/check`, {
        method: 'POST',
      })
      if (!response.ok) {
        setError('Could not check this monitor. Please try again.')
        return
      }
      await fetchSites()
    } catch {
      // ignore
    } finally {
      setCheckingSiteId(null)
    }
  }

  const deleteSite = async (siteId: string) => {
    try {
      const res = await fetch(`/api/downtime/sites/${siteId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        await fetchSites()
      }
    } catch {
      // ignore
    }
  }

  const updateDisplayName = async (siteId: string, name: string) => {
    try {
      const res = await fetch(`/api/downtime/sites/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="tool-page-scroll">
      <div className="tool-page-container">
        <ToolPageIntro
          eyebrow="CHECK / UNDERSTAND / MONITOR"
          title="Is your website responding?"
          description="Check its HTTP response from our server, or save a monitor to keep a history of your own sites."
        />
        <div className="monitor-check-layout">
          <section className="tool-panel p-5 sm:p-7">
            <p className="eyebrow mb-3">QUICK WEBSITE CHECK</p>
            <h2 className="mb-5 text-xl font-semibold tracking-tight">
              Start with an address.
            </h2>
            <form
              className="flex flex-wrap gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                if (url.trim() && !checking) void doCheck(url)
              }}
            >
              <label htmlFor="website-url" className="sr-only">
                Website address
              </label>
              <input
                id="website-url"
                type="text"
                inputMode="url"
                autoCapitalize="none"
                spellCheck={false}
                autoComplete="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com or https://example.com"
                className="workspace-input min-w-[180px] flex-1"
                required
                maxLength={2048}
              />
              <button
                type="submit"
                disabled={!url.trim() || checking}
                className="btn-primary"
              >
                {checking ? 'Checking…' : 'Check website'}
                <IconArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              No signup for a quick check · Up to 10 checks per hour · Public
              websites only
            </p>
            {checking && (
              <p role="status" className="mt-5 text-sm text-teal">
                Checking the response. This can take up to 10 seconds…
              </p>
            )}
          </section>
          <aside className="tool-panel p-5 sm:p-7">
            <h2 className="text-sm font-semibold">
              A check is a useful signal.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We report the HTTP status, response time, and server location. A
              blocked request does not always mean your website is offline.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              This is a single-location check. It does not test certificate
              expiry or every visitor’s connection.
            </p>
          </aside>
        </div>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-danger p-4 text-sm text-danger"
          >
            {error}
          </p>
        )}
        {result && (
          <section className="tool-panel mt-6 p-5 sm:p-7" aria-live="polite">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${result.is_up ? 'bg-teal-subtle text-teal' : 'bg-raised text-amber'}`}
                >
                  {result.is_up
                    ? 'Responding successfully'
                    : 'Needs a closer look'}
                </span>
                <h2 className="mt-3 break-all text-lg font-semibold">
                  {result.url}
                </h2>
                <p className="mt-2 text-xs text-muted">
                  Checked {new Date(result.checked_at).toLocaleTimeString()}
                </p>
              </div>
              <button
                className="tool-button"
                disabled={checking}
                onClick={() => doCheck(result.url)}
              >
                <IconRefresh className="h-4 w-4" />
                Check again
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="metric-card">
                <span>Response time</span>
                <strong className="!text-xl">
                  {result.response_ms}
                  <small> ms</small>
                </strong>
              </div>
              <div className="metric-card">
                <span>HTTP status</span>
                <strong className="!text-xl">
                  {result.status_code ?? '—'}
                </strong>
              </div>
              <div className="metric-card">
                <span>Server region</span>
                <strong className="!text-base break-words">
                  {result.region || 'Server'}
                </strong>
              </div>
            </div>
            {result.error_message && (
              <p className="mt-4 rounded-lg bg-bg p-4 text-sm text-muted">
                {result.error_message}
              </p>
            )}
            {history && history.days.length > 0 && (
              <div className="mt-5 border-t border-border pt-5">
                <p className="mb-3 text-xs text-muted">
                  Sampled availability over 30 days: {history.uptimePercent}% ·
                  your saved checks
                </p>
                <Sparkline
                  days={history.days.map((day) => ({
                    up: day.up,
                    total: day.up + day.down,
                  }))}
                />
              </div>
            )}
          </section>
        )}
        <section className="tool-panel mt-6 p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow mb-2">YOUR WEBSITE WATCHLIST</p>
              <h2 className="text-xl font-semibold tracking-tight">
                Keep the bigger picture.
              </h2>
              <p className="mt-2 text-sm text-muted">
                Saved monitors keep check history in your account.
              </p>
            </div>
            {isAuthenticated && (
              <button
                className="btn-primary"
                onClick={() => setShowAddModal(!showAddModal)}
                aria-expanded={showAddModal}
              >
                <IconPlus className="h-4 w-4" />
                Add a monitor
              </button>
            )}
          </div>
          {status === 'loading' ? (
            <p role="status" className="py-5 text-sm text-muted">
              Loading account…
            </p>
          ) : !isAuthenticated ? (
            <EmptyToolState
              title="Your sites, in one place."
              description="Quick checks work without an account. Sign in when you want to save monitors and review their history."
            >
              <Link
                className="btn-primary"
                href="/sign-in?callbackUrl=%2Ftools%2Fdowntime-detector"
              >
                Sign in to save monitors ↗
              </Link>
            </EmptyToolState>
          ) : (
            <>
              {showAddModal && (
                <form
                  className="mb-6 rounded-xl border border-border-strong bg-bg p-4 sm:p-5"
                  onSubmit={(e) => {
                    e.preventDefault()
                    void addSite()
                  }}
                >
                  <h3 className="mb-4 text-base font-semibold">
                    Add a website monitor
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm">
                      Website address
                      <input
                        className="workspace-input mt-2"
                        value={addUrl}
                        onChange={(e) => setAddUrl(e.target.value)}
                        placeholder="https://example.com"
                        inputMode="url"
                        autoCapitalize="none"
                        required
                        maxLength={2048}
                      />
                    </label>
                    <label className="text-sm">
                      Display name{' '}
                      <span className="text-muted">(optional)</span>
                      <input
                        className="workspace-input mt-2"
                        value={addName}
                        onChange={(e) => setAddName(e.target.value)}
                        placeholder="My portfolio"
                        maxLength={100}
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={adding || !addUrl.trim()}
                    >
                      {adding ? 'Adding…' : 'Add & check website'}
                    </button>
                    <button
                      type="button"
                      className="tool-button"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {loadingSites ? (
                <p
                  role="status"
                  className="py-8 text-center text-sm text-muted"
                >
                  Loading your monitors…
                </p>
              ) : sites.length === 0 ? (
                <EmptyToolState
                  title="Your watchlist is ready."
                  description="Add a website above to start collecting a history of its responses."
                />
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {sites.map((site) => (
                    <article key={site.id} className="monitor-card">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {editingSiteId === site.id ? (
                            <form
                              className="flex flex-wrap gap-2"
                              onSubmit={(e) => {
                                e.preventDefault()
                                void updateDisplayName(site.id, editName)
                              }}
                            >
                              <input
                                aria-label="Monitor display name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="workspace-input !w-auto min-w-0 flex-1"
                                maxLength={100}
                              />
                              <button type="submit" className="tool-button">
                                Save
                              </button>
                              <button
                                type="button"
                                className="tool-button"
                                onClick={() => setEditingSiteId(null)}
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <>
                              <Link
                                href={`/tools/downtime-detector/${site.id}`}
                                className="break-words text-base font-semibold hover:text-teal"
                              >
                                {site.displayName ||
                                  site.url.replace(/^https?:\/\//, '')}
                              </Link>
                              <p className="mt-2 break-all text-xs text-muted">
                                {site.url}
                              </p>
                            </>
                          )}
                        </div>
                        <span
                          className={`monitor-dot ${site.lastCheck?.isUp ? 'up' : ''}`}
                          aria-label={
                            site.lastCheck
                              ? site.lastCheck.isUp
                                ? 'Last check succeeded'
                                : 'Last check failed'
                              : 'Awaiting first check'
                          }
                        />
                      </div>
                      <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted">
                        <span>
                          {site.uptimePercent == null
                            ? 'No check history'
                            : `${site.uptimePercent}% sampled availability`}
                        </span>
                        <span>
                          {site.lastCheck
                            ? `Checked ${formatTimeAgo(site.lastCheck.checkedAt)}`
                            : 'Not checked yet'}
                        </span>
                      </div>
                      <div className="monitor-actions">
                        <button
                          className="tool-button"
                          onClick={() => checkSiteNow(site.id)}
                          disabled={checkingSiteId === site.id}
                        >
                          <IconRefresh className="h-4 w-4" />
                          {checkingSiteId === site.id ? 'Checking…' : 'Check'}
                        </button>
                        <button
                          className="tool-button"
                          onClick={() => {
                            setEditingSiteId(site.id)
                            setEditName(site.displayName || '')
                          }}
                        >
                          <IconEdit className="h-4 w-4" />
                          Rename
                        </button>
                        <button
                          className="tool-button"
                          onClick={() => {
                            if (
                              confirm(
                                'Remove this monitor and its check history?'
                              )
                            )
                              void deleteSite(site.id)
                          }}
                          aria-label={`Remove monitor ${site.displayName || site.url}`}
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/tools/downtime-detector/${site.id}`}
                          className="tool-button ml-auto"
                        >
                          History
                          <IconExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
