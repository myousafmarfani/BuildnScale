'use client'
import { useState, useRef } from 'react'
import { IconDownload, IconUpload, IconDatabase } from '@tabler/icons-react'
import { downloadFile } from '@/lib/download'
const allowedKey = (key: string) =>
  /^bns_(tasks_\d{4}-\d{2}-\d{2}|pomo_\w+|habits_\w+|notes_\w+|ratecalc_\w+|review_\w+|streak|streak_days|favorites|recent|planner_\w+)$/.test(
    key
  )
export function WorkspaceData() {
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState<Record<string, string> | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  function backup() {
    try {
      const entries = Object.fromEntries(
        Object.keys(localStorage)
          .filter(allowedKey)
          .map((key) => [key, localStorage.getItem(key)!])
      )
      downloadFile(
        `buildnscale-backup-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify({ app: 'buildnscale', version: 1, entries }, null, 2),
        'application/json'
      )
      setStatus(
        `Exported ${Object.keys(entries).length} saved entries. Keep this file private.`
      )
    } catch {
      setStatus(
        'Could not access browser storage. Please check your browser settings.'
      )
    }
  }
  async function readFile(file?: File) {
    if (!file) return
    setPending(null)
    try {
      if (file.size > 5_000_000)
        throw new Error('Backup must be smaller than 5 MB.')
      const data = JSON.parse(await file.text())
      if (
        data.app !== 'buildnscale' ||
        data.version !== 1 ||
        !data.entries ||
        typeof data.entries !== 'object' ||
        Array.isArray(data.entries)
      )
        throw new Error('Choose a BuildnScale workspace backup.')
      const entries = Object.entries(data.entries)
      if (
        !entries.length ||
        entries.some(
          ([key, value]) => !allowedKey(key) || typeof value !== 'string'
        )
      )
        throw new Error('Backup contains unsupported entries.')
      for (const [key, value] of entries) {
        const parsed = JSON.parse(value as string)
        if (
          /^bns_tasks_|^bns_pomo_sessions_|^bns_habits_habits$|^bns_notes_notes$|^bns_(favorites|recent|streak_days)$|^bns_pomo_tasks$/.test(
            key
          ) &&
          !Array.isArray(parsed)
        )
          throw new Error('Backup contains invalid list data.')
      }
      setPending(data.entries)
      setStatus(
        `Ready to restore ${entries.length} entries. Existing entries with the same keys will be replaced. Export a backup first if you want to keep them.`
      )
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : 'Could not read backup.'
      )
    }
    if (fileRef.current) fileRef.current.value = ''
  }
  function restore() {
    if (!pending) return
    const previous = Object.fromEntries(
      Object.keys(pending).map((key) => [key, localStorage.getItem(key)])
    )
    try {
      for (const [key, value] of Object.entries(pending))
        localStorage.setItem(key, value)
      setPending(null)
      setStatus('Workspace restored. Reloading…')
      window.location.reload()
    } catch {
      for (const [key, value] of Object.entries(previous)) {
        try {
          if (value === null) localStorage.removeItem(key)
          else localStorage.setItem(key, value)
        } catch {
          /* Report storage failure below. */
        }
      }
      setStatus(
        'Restore failed: browser storage may be full. Export your existing data before retrying.'
      )
    }
  }
  return (
    <section
      id="workspace-data"
      className="scroll-mt-24 rounded-xl border border-border bg-surface p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-xl">
          <span className="mb-4 inline-flex text-teal">
            <IconDatabase className="h-6 w-6" />
          </span>
          <h2 className="text-xl font-semibold tracking-tight">
            Your work deserves a backup.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Planner tasks, notes, habits, focus logs, and preferences live in
            this browser. Export a copy before switching browsers or clearing
            site data. Saved website monitors live in your account and are not
            included.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={backup} className="btn-secondary">
            <IconDownload className="h-4 w-4" />
            Export backup
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-secondary"
          >
            <IconUpload className="h-4 w-4" />
            Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => readFile(e.target.files?.[0])}
          />
        </div>
      </div>
      {status && (
        <p role="status" className="mt-4 text-sm text-muted">
          {status}
        </p>
      )}
      {pending && (
        <div className="mt-4 flex gap-3">
          <button onClick={restore} className="btn-primary">
            Restore these entries
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setPending(null)
              setStatus('Import cancelled.')
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </section>
  )
}
