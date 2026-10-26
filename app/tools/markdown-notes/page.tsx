'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import {
  IconPlus,
  IconSearch,
  IconDownload,
  IconUpload,
  IconTrash,
} from '@tabler/icons-react'
import {
  ToolPageIntro,
  EmptyToolState,
} from '@/components/workspace/ToolPageIntro'
import { useBrowserData } from '@/hooks/useBrowserData'
import { useLocalSetting } from '@/hooks/useLocalSetting'
import { useSync } from '@/hooks/useSync'
import { downloadFile } from '@/lib/download'
interface Note {
  id: string
  title: string
  content: string
  updatedAt: number
}
export default function MarkdownNotesPage() {
  const [notes, setNotes, error, ready] = useBrowserData<Note[]>(
    'bns_notes_notes',
    []
  )
  const [activeId, setActiveId] = useLocalSetting<string | null>(
    'bns_notes_activeNoteId',
    null
  )
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'notes' | 'edit' | 'preview'>('edit')
  const [desktopView, setDesktopView] = useLocalSetting<
    'edit' | 'split' | 'preview'
  >('bns_notes_view', 'split')
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  useSync(['bns_notes_notes'])
  const active = notes.find((note) => note.id === activeId) ?? notes[0] ?? null
  const filtered = notes.filter((note) =>
    `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase())
  )
  const html = useMemo(() => {
    if (!active || typeof window === 'undefined') return ''
    const result = marked.parse(active.content, { breaks: true, async: false })
    return DOMPurify.sanitize(result, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['img', 'video', 'audio', 'iframe', 'form', 'style'],
      FORBID_ATTR: ['style'],
    })
  }, [active])
  function createNote(content = '', title = 'Untitled note') {
    const note = {
      id: crypto.randomUUID(),
      title,
      content,
      updatedAt: Date.now(),
    }
    setNotes([note, ...notes])
    setActiveId(note.id)
    setTab('edit')
    setMessage('New note created.')
    setTimeout(() => editorRef.current?.focus(), 0)
  }
  function update(field: 'title' | 'content', value: string) {
    if (!active) return
    setNotes(
      notes.map((note) =>
        note.id === active.id
          ? { ...note, [field]: value, updatedAt: Date.now() }
          : note
      )
    )
  }
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        setMessage('Your notes save as you type.')
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])
  async function importNote(file?: File) {
    if (!file) return
    try {
      if (file.size > 1_000_000)
        throw new Error('Choose a Markdown or text file smaller than 1 MB.')
      createNote(
        await file.text(),
        file.name.replace(/\.(md|txt|markdown)$/i, '')
      )
      setMessage('Note imported and saved in this browser.')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Could not read that file.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }
  function removeNote() {
    if (
      !active ||
      !confirm(
        `Delete “${active.title || 'Untitled note'}”? Export it first if you need a copy.`
      )
    )
      return
    setNotes(notes.filter((note) => note.id !== active.id))
    setActiveId(null)
    setMessage('Note deleted.')
  }
  return (
    <div className="notes-tool-page">
      <div className="px-4 pt-6 sm:px-7">
        <ToolPageIntro
          eyebrow="CAPTURE / THINK / WRITE"
          title="A little space for your thoughts."
          description="Write in Markdown. Preview when you need to. Your notes save as you type."
        >
          <button
            className="tool-button"
            onClick={() => fileRef.current?.click()}
            disabled={!ready}
          >
            <IconUpload className="h-4 w-4" />
            Import
          </button>
          <button
            className="btn-primary"
            onClick={() => createNote()}
            disabled={!ready}
          >
            <IconPlus className="h-4 w-4" />
            New note
          </button>
        </ToolPageIntro>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept=".md,.markdown,.txt,text/plain,text/markdown"
          onChange={(e) => importNote(e.target.files?.[0])}
        />
      </div>
      <div className="notes-mobile-switch tool-mobile-tabs lg:hidden">
        {(['notes', 'edit', 'preview'] as const).map((item) => (
          <button
            key={item}
            aria-pressed={tab === item}
            onClick={() => setTab(item)}
          >
            {item === 'notes'
              ? `Notes (${notes.length})`
              : item === 'edit'
                ? 'Write'
                : 'Preview'}
          </button>
        ))}
      </div>
      <div className="notes-work-area">
        <aside
          className={`notes-list ${tab === 'notes' ? 'mobile-visible' : ''}`}
          aria-label="Your notes"
        >
          <label className="catalog-search !rounded-lg !px-3 !py-3">
            <IconSearch className="h-4 w-4 shrink-0 text-muted" />
            <input
              aria-label="Search notes"
              placeholder="Search your notes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <p className="mb-3 mt-5 text-[10px] font-mono uppercase tracking-widest text-muted">
            YOUR NOTES · {filtered.length}
          </p>
          <div className="space-y-2">
            {filtered.map((note) => (
              <button
                key={note.id}
                className={`note-list-item ${active?.id === note.id ? 'active' : ''}`}
                aria-pressed={active?.id === note.id}
                onClick={() => {
                  setActiveId(note.id)
                  setTab('edit')
                }}
              >
                <span className="block truncate text-sm font-semibold">
                  {note.title || 'Untitled note'}
                </span>
                <span className="mt-2 block truncate text-xs text-muted">
                  {note.content.replace(/[#*`>]/g, '').slice(0, 80) ||
                    'Ready for your first thought…'}
                </span>
                <span className="mt-3 block text-[10px] text-tertiary">
                  {new Date(note.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </button>
            ))}
            {!filtered.length && (
              <p className="px-2 py-8 text-center text-sm text-muted">
                {query
                  ? 'No matching notes. Try a different word.'
                  : 'Your notes will appear here.'}
              </p>
            )}
          </div>
        </aside>
        <section
          className={`notes-document ${tab !== 'notes' ? 'mobile-visible' : ''}`}
          aria-label="Note workspace"
        >
          {!active ? (
            <div className="m-auto w-full max-w-lg p-5">
              <EmptyToolState
                title="Catch a thought before it disappears."
                description="Start a note, paste a snippet, or import a Markdown file. There is no setup to get through."
              >
                <button
                  className="btn-primary"
                  onClick={() => createNote()}
                  disabled={!ready}
                >
                  Write your first note
                </button>
              </EmptyToolState>
            </div>
          ) : (
            <>
              <div className="note-document-toolbar">
                <div className="hidden lg:block">
                  <div className="segmented-control">
                    {(['edit', 'split', 'preview'] as const).map((item) => (
                      <button
                        key={item}
                        aria-pressed={desktopView === item}
                        onClick={() => setDesktopView(item)}
                      >
                        {item === 'edit'
                          ? 'Write'
                          : item === 'split'
                            ? 'Split view'
                            : 'Preview'}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="workspace-status">
                  {error ? 'Unsaved changes' : 'Saved in this browser'}
                </span>
                <div className="ml-auto flex gap-1">
                  <button
                    aria-label="Export current note as Markdown"
                    className="workspace-icon-button"
                    onClick={() =>
                      downloadFile(
                        `${(active.title || 'note').replace(/[^a-z0-9_-]/gi, '-')}.md`,
                        active.content,
                        'text/markdown;charset=utf-8'
                      )
                    }
                  >
                    <IconDownload className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Delete current note"
                    className="workspace-icon-button hover:text-danger"
                    onClick={removeNote}
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <input
                aria-label="Note title"
                placeholder="Untitled note"
                maxLength={160}
                className="note-title"
                value={active.title}
                onChange={(e) => update('title', e.target.value)}
              />
              <div
                className={`note-content-panes desktop-${desktopView} mobile-${tab}`}
              >
                <div className="note-editor-pane">
                  <label htmlFor="note-editor" className="sr-only">
                    Markdown content
                  </label>
                  <textarea
                    ref={editorRef}
                    id="note-editor"
                    spellCheck={false}
                    value={active.content}
                    onChange={(e) => update('content', e.target.value)}
                    placeholder={
                      'Start writing…\n\n# Your next idea\n\n- A thought worth keeping\n- A small thing to try'
                    }
                    className="note-editor"
                  />
                </div>
                <div className="note-preview-pane">
                  <p className="mb-5 text-[10px] uppercase tracking-widest text-muted">
                    LIVE PREVIEW
                  </p>
                  {active.content ? (
                    <div
                      className="post-content"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  ) : (
                    <p className="text-sm text-muted">
                      Your words take shape here.
                    </p>
                  )}
                </div>
              </div>
              <div className="note-status-bar">
                <span>
                  {active.content.trim()
                    ? active.content.trim().split(/\s+/).length
                    : 0}{' '}
                  words · {active.content.length} characters
                </span>
                <span>Markdown · autosave</span>
              </div>
            </>
          )}
        </section>
      </div>
      {(error || message) && (
        <p
          role="status"
          className={`notes-feedback ${error ? 'text-danger' : 'text-muted'}`}
        >
          {error || message}
        </p>
      )}
    </div>
  )
}
