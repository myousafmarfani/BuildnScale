'use client'
import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  IconBraces,
  IconCopy,
  IconDownload,
  IconUpload,
} from '@tabler/icons-react'
import { ToolBreadcrumbs } from '@/components/ui/ToolBreadcrumbs'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { transformJSON } from '@/lib/json-toolkit'
import { downloadFile } from '@/lib/download'
const SAMPLE =
  '{"project":"BuildnScale","tools":["planner","timer","json"],"openSource":true,"version":2}'
export default function JSONToolkitPage() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState<number | 'minify'>(2)
  const [notice, setNotice] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const result = useMemo(() => transformJSON(input, indent), [input, indent])
  async function importFile(file?: File) {
    if (!file) return
    try {
      if (file.size > 1_000_000)
        throw new Error('Choose a file smaller than 1 MB.')
      setInput(await file.text())
      setNotice('File loaded in this browser. Nothing was uploaded.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not read file.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-[60px] shrink-0 items-center justify-between gap-3 border-b border-border px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="hidden font-semibold sm:block">
            build<span className="text-teal">n</span>scale
          </Link>
          <ToolBreadcrumbs slug="json-toolkit" />
        </div>
        <ThemeToggle />
      </header>
      <main className="mx-auto w-full max-w-[1400px] flex-1 p-5 sm:p-8">
        <div className="tool-intro">
          <div>
            <p className="eyebrow mb-3">DEVELOPER TOOLS / JSON</p>
            <h1 className="section-title">Make sense of your JSON.</h1>
            <p className="mt-3 text-sm text-muted">
              Format, validate, or minify. Input stays in this tab and is
              cleared when you leave.
            </p>
          </div>
          <span className="tool-icon tone-purple">
            <IconBraces className="h-6 w-6" />
          </span>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted">
            Output
            <select
              aria-label="JSON output indentation"
              className="rounded-md border border-border bg-surface px-3 py-2 text-fg"
              value={indent}
              onChange={(e) =>
                setIndent(
                  e.target.value === 'minify'
                    ? 'minify'
                    : Number(e.target.value)
                )
              }
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value="minify">Minified</option>
            </select>
          </label>
          <button
            className="btn-secondary"
            onClick={() => fileRef.current?.click()}
          >
            <IconUpload className="h-4 w-4" />
            Open file
          </button>
          <button
            className="text-sm text-teal hover:underline"
            onClick={() => {
              setInput(SAMPLE)
              setNotice('Example loaded.')
            }}
          >
            Try an example
          </button>
          <button
            className="ml-auto text-sm text-muted hover:text-fg"
            onClick={() => {
              setInput('')
              setNotice('Input cleared.')
            }}
          >
            Clear
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => importFile(e.target.files?.[0])}
          />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex justify-between border-b border-border px-4 py-3 text-xs text-muted">
              <label htmlFor="json-input">JSON INPUT</label>
              <span>
                {new TextEncoder().encode(input).length.toLocaleString()} bytes
              </span>
            </div>
            <textarea
              id="json-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setNotice('')
              }}
              spellCheck={false}
              maxLength={1_000_000}
              placeholder={'Paste JSON here…\n\n{"hello": "world"}'}
              className="min-h-[360px] w-full resize-y bg-transparent p-4 font-mono text-sm leading-7 outline-none lg:min-h-[480px]"
            />
          </section>
          <section className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-xs text-muted">
              <label htmlFor="json-output">OUTPUT</label>
              <div className="flex gap-3">
                <button
                  disabled={!result.output}
                  aria-label="Copy JSON output"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(result.output)
                      setNotice('Copied JSON to clipboard.')
                    } catch {
                      setNotice(
                        'Clipboard is unavailable. Select and copy the output manually.'
                      )
                    }
                  }}
                  className="flex items-center gap-1.5"
                >
                  <IconCopy className="h-4 w-4" />
                  Copy
                </button>
                <button
                  disabled={!result.output}
                  onClick={() =>
                    downloadFile(
                      'formatted.json',
                      result.output,
                      'application/json'
                    )
                  }
                  className="flex items-center gap-1.5"
                >
                  <IconDownload className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <textarea
              id="json-output"
              readOnly
              spellCheck={false}
              value={result.output}
              placeholder="Your formatted JSON appears here."
              className="min-h-[360px] w-full resize-y bg-transparent p-4 font-mono text-sm leading-7 outline-none lg:min-h-[480px]"
            />
          </section>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${input && result.error ? 'border-danger text-danger' : 'border-border text-muted'}`}
        >
          {notice ||
            (input
              ? result.error
                ? `Invalid JSON: ${result.error}`
                : 'Valid JSON · Ready to copy or download.'
              : 'Paste JSON or open a file up to 1 MB to begin.')}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Standard JSON syntax: double-quoted keys, no comments, no trailing
          commas. Formatting uses JavaScript number precision; large unsafe
          integers are rejected. Input is not saved.
        </p>
      </main>
    </div>
  )
}
