"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Link from "next/link"
import { marked } from "marked"
import {
  IconSettings,
  IconPlus,
  IconSearch,
  IconFileExport,
  IconX,
  IconMenu2,
  IconBook2,
} from "@tabler/icons-react"
import { ToolBreadcrumbs } from "@/components/ui/ToolBreadcrumbs"
import { SettingsDrawer } from "@/components/ui/SettingsDrawer"
import { UserGuideModal } from "@/components/ui/UserGuideModal"
import { useSync } from "@/hooks/useSync"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "bns_notes_"

interface Note {
  id: string
  title: string
  content: string
  updatedAt: number
}

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

function formatDate(ts: number): string {
  const now = Date.now()
  const diff = now - ts
  if (diff < 60000) return "just now"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getPreview(content: string): string {
  const lines = content.trim().split("\n")
  return lines[1] || lines[0] || ""
}

export default function MarkdownNotesPage() {
  useSync(["bns_notes_notes", "bns_notes_fontSize", "bns_notes_lineWidth"])

  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [mobileTab, setMobileTab] = useState<"notes" | "edit" | "preview">("edit")
  const [showDrawer, setShowDrawer] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [localTitle, setLocalTitle] = useState("")
  const [localContent, setLocalContent] = useState("")
  const [editorFontSize, setEditorFontSize] = useState(() => loadJSON(STORAGE_KEY + "fontSize", "medium") as string)
  const [editorLineWidth, setEditorLineWidth] = useState(() => loadJSON(STORAGE_KEY + "lineWidth", "medium") as string)
  const [userGuideOpen, setUserGuideOpen] = useState(false)

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const loaded = loadJSON<Note[]>(STORAGE_KEY + "notes", [])
    setNotes(loaded)
    if (loaded.length > 0) {
      setActiveNoteId(loaded[0].id)
      setLocalTitle(loaded[0].title)
      setLocalContent(loaded[0].content)
    }
  }, [])

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId) ?? null,
    [notes, activeNoteId]
  )

  const filteredNotes = useMemo(
    () =>
      notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [notes, searchQuery]
  )

  const commitSave = useCallback(
    (id: string, title: string, content: string) => {
      const now = Date.now()
      setNotes((prev) => {
        const next = prev.map((n) =>
          n.id === id ? { ...n, title, content, updatedAt: now } : n
        )
        saveJSON(STORAGE_KEY + "notes", next)
        return next
      })
    },
    []
  )

  const debouncedSave = useCallback(
    (id: string, title: string, content: string) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        commitSave(id, title, content)
      }, 500)
    },
    [commitSave]
  )

  const handleTitleChange = useCallback(
    (value: string) => {
      setLocalTitle(value)
      if (activeNoteId) debouncedSave(activeNoteId, value, localContent)
    },
    [activeNoteId, localContent, debouncedSave]
  )

  useEffect(() => { saveJSON(STORAGE_KEY + "fontSize", editorFontSize) }, [editorFontSize])
  useEffect(() => { saveJSON(STORAGE_KEY + "lineWidth", editorLineWidth) }, [editorLineWidth])

  const handleContentChange = useCallback(
    (value: string) => {
      setLocalContent(value)
      if (activeNoteId) debouncedSave(activeNoteId, localTitle, value)
    },
    [activeNoteId, localTitle, debouncedSave]
  )

  const switchNote = useCallback(
    (id: string) => {
      if (activeNoteId && saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        commitSave(activeNoteId, localTitle, localContent)
      }
      const note = notes.find((n) => n.id === id)
      if (note) {
        setActiveNoteId(id)
        setLocalTitle(note.title)
        setLocalContent(note.content)
      }
    },
    [activeNoteId, localTitle, localContent, notes, commitSave]
  )

  const createNote = useCallback(() => {
    if (activeNoteId && saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      commitSave(activeNoteId, localTitle, localContent)
    }
    const note: Note = {
      id: crypto.randomUUID(),
      title: "Untitled",
      content: "",
      updatedAt: Date.now(),
    }
    setNotes((prev) => {
      const next = [note, ...prev]
      saveJSON(STORAGE_KEY + "notes", next)
      return next
    })
    setActiveNoteId(note.id)
    setLocalTitle("")
    setLocalContent("")
    setShowDrawer(false)
    if (isMobile) setMobileTab("edit")
  }, [activeNoteId, localTitle, localContent, commitSave, isMobile])

  const deleteNote = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation()
      const next = notes.filter((n) => n.id !== id)
      setNotes(next)
      saveJSON(STORAGE_KEY + "notes", next)
      if (activeNoteId === id) {
        if (next.length > 0) switchNote(next[0].id)
        else { setActiveNoteId(null); setLocalTitle(""); setLocalContent("") }
      }
    },
    [notes, activeNoteId, switchNote]
  )

  const html = useMemo(() => {
    try {
      const result = marked.parse(localContent, { breaks: true })
      return typeof result === "string" ? result : ""
    } catch { return "" }
  }, [localContent])

  const wordCount = localContent ? localContent.split(/\s+/).filter(Boolean).length : 0
  const charCount = localContent.length

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.metaKey) {
          if (e.key === "s") { e.preventDefault(); if (activeNoteId) commitSave(activeNoteId, localTitle, localContent) }
          if (e.key === "n") { e.preventDefault(); createNote() }
          if (e.key === "e") { e.preventDefault(); if (isMobile) setMobileTab((t) => (t === "edit" ? "preview" : "edit")) }
        }
      } else {
        if (e.metaKey) {
          if (e.key === "s") { e.preventDefault(); if (activeNoteId) commitSave(activeNoteId, localTitle, localContent) }
          if (e.key === "n") { e.preventDefault(); createNote() }
          if (e.key === "e") { e.preventDefault(); if (isMobile) setMobileTab((t) => (t === "edit" ? "preview" : "edit")) }
        }
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [activeNoteId, localTitle, localContent, commitSave, createNote, isMobile])

  return (
    <div className="flex h-screen flex-col bg-bg">
      {/* Top Bar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-bg px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          {isMobile && (
            <button onClick={() => setShowDrawer(true)} className="text-tertiary hover:text-muted">
              <IconMenu2 className="h-5 w-5" />
            </button>
          )}
          <Link href="/" className="font-display text-sm font-semibold text-fg shrink-0">
            build<span className="text-teal">n</span>scale
          </Link>
          <div className="h-4 w-px bg-border shrink-0" />
          <ToolBreadcrumbs slug="markdown-notes" />
        </div>

        {!isMobile && (
          <div className="hidden md:flex gap-4 font-display text-[11px] text-tertiary">
            <span><span className="rounded-[3px] border border-border bg-raised px-1 py-[1px] font-mono text-[10px] text-muted">⌘N</span> New</span>
            <span><span className="rounded-[3px] border border-border bg-raised px-1 py-[1px] font-mono text-[10px] text-muted">⌘E</span> Preview</span>
            <span><span className="rounded-[3px] border border-border bg-raised px-1 py-[1px] font-mono text-[10px] text-muted">⌘S</span> Save</span>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button onClick={() => setUserGuideOpen(true)} className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:text-fg hover:bg-raised transition-colors">
            <IconBook2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          <button onClick={() => setSettingsOpen(true)} className="text-tertiary hover:text-muted transition-colors">
            <IconSettings className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="flex flex-1 overflow-hidden">
        {/* Note List (Pane 1) */}
        <aside
          className={cn(
            "w-[220px] lg:w-[240px] shrink-0 border-r border-border bg-surface flex flex-col",
            isMobile && "fixed inset-y-0 left-0 z-40 w-[280px] border-r shadow-lg transition-transform duration-280",
            isMobile && !showDrawer && "-translate-x-full"
          )}
        >
          <div className="border-b border-border p-3 md:p-4">
            <div className="flex items-center gap-2 rounded-md border border-border bg-raised px-3 py-2">
              <IconSearch className="h-3.5 w-3.5 text-tertiary shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes…"
                className="w-full bg-transparent font-display text-xs text-fg outline-none placeholder:text-tertiary"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-tertiary hover:text-muted">
                  <IconX className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="border-b border-border p-3 md:p-4">
            <button
              onClick={createNote}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-2 text-xs text-teal hover:bg-raised transition-colors"
            >
              <IconPlus className="h-3.5 w-3.5" /> New Note
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="px-4 py-8 text-center font-mono text-[11px] text-tertiary">
                {searchQuery ? "No matching notes" : "No notes yet"}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => { switchNote(note.id); if (isMobile) setShowDrawer(false) }}
                  className={cn(
                    "relative cursor-pointer border-b border-border px-3 md:px-4 py-3 transition-colors hover:bg-raised group",
                    activeNoteId === note.id && "border-l-2 border-teal bg-raised"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="block truncate text-sm font-medium text-fg">{note.title || "Untitled"}</span>
                    {activeNoteId === note.id && !isMobile && (
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="truncate text-xs text-tertiary max-w-[100px] lg:max-w-[140px]">
                      {getPreview(note.content) || note.content.slice(0, 40) || "Empty note"}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-tertiary">{formatDate(note.updatedAt)}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(note.id) }}
                    className="absolute right-2 top-3 hidden group-hover:flex items-center justify-center h-5 w-5 text-tertiary hover:text-danger transition-colors"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Overlay for mobile drawer */}
        {isMobile && showDrawer && (
          <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setShowDrawer(false)} />
        )}

        {/* Editor (Pane 2) */}
        <section
          ref={editorRef}
          className={cn("flex flex-1 flex-col overflow-y-auto bg-bg", isMobile && mobileTab !== "edit" && "hidden")}
        >
          {activeNote ? (
            <div
              className="mx-auto flex w-full flex-1 flex-col px-5 md:px-8 py-6 md:py-8"
              style={{ maxWidth: editorLineWidth === "narrow" ? "42rem" : editorLineWidth === "wide" ? "64rem" : "52rem" }}
            >
              <div className="mb-6">
                <input
                  value={localTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Note title…"
                  className="w-full bg-transparent font-display text-xl md:text-[22px] font-semibold text-fg outline-none placeholder:text-tertiary"
                />
                <div className="mt-1 text-xs text-tertiary">
                  {activeNoteId && notes.find((n) => n.id === activeNoteId)?.updatedAt
                    ? `Last saved ${formatDate(notes.find((n) => n.id === activeNoteId)!.updatedAt)}`
                    : "Not saved yet"}
                </div>
              </div>
              <textarea
                ref={contentRef}
                value={localContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing… (Markdown supported)"
                className="flex-1 resize-none bg-transparent font-mono leading-[1.75] text-fg outline-none placeholder:text-tertiary"
                style={{ fontSize: editorFontSize === "small" ? "13px" : editorFontSize === "large" ? "17px" : "15px" }}
              />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="text-center">
                <p className="font-mono text-sm text-tertiary">No note selected</p>
                <button onClick={createNote} className="mt-4 rounded-md border border-border px-4 py-2 text-xs text-teal hover:bg-raised transition-colors">
                  Create a new note
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Preview (Pane 3) */}
        <section
          className={cn(
            "flex flex-1 flex-col overflow-y-auto border-l border-border bg-bg p-5 md:p-8",
            isMobile && mobileTab !== "preview" && "hidden"
          )}
        >
          {activeNote ? (
            localContent ? (
              <div className="prose-custom max-w-full" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="font-mono text-xs text-tertiary text-center px-4">Start typing in the editor to see the preview</p>
              </div>
            )
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="font-mono text-sm text-tertiary">No note selected</p>
            </div>
          )}
        </section>
      </main>

      {/* Bottom Bar */}
      <footer className="flex h-8 shrink-0 items-center justify-between border-t border-border bg-bg px-3 md:px-4 font-display text-[11px] text-tertiary">
        <div>
          {wordCount} word{wordCount !== 1 ? "s" : ""} · {charCount} character{charCount !== 1 ? "s" : ""}
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 hover:text-muted transition-colors">
            <IconFileExport className="h-3.5 w-3.5" />
            Export PDF
          </button>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <div className="grid h-12 shrink-0 grid-cols-3 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)]">
          {(
            [
              { key: "notes" as const, icon: IconMenu2, label: "Notes" },
              { key: "edit" as const, icon: IconPlus, label: "Edit" },
              { key: "preview" as const, icon: IconFileExport, label: "Preview" },
            ]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setMobileTab(tab.key); if (tab.key === "notes") setShowDrawer(true) }}
              className={cn("flex flex-col items-center justify-center gap-0.5 text-[10px]", mobileTab === tab.key ? "text-teal" : "text-tertiary")}
            >
              <tab.icon className="h-[16px] w-[16px]" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-bg p-6 shadow-xl">
            <h3 className="font-display text-[15px] font-semibold text-fg">Delete note?</h3>
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted">This action cannot be undone. The note will be permanently deleted.</p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="rounded-md border border-border bg-raised px-4 py-2 text-xs text-muted hover:text-fg transition-colors">Cancel</button>
              <button onClick={(e) => { setDeleteConfirmId(null); deleteNote(deleteConfirmId, e) }} className="rounded-md bg-red px-4 py-2 text-xs text-white hover:opacity-90 transition-opacity">Delete</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .prose-custom {
          max-width: 100%;
          overflow-wrap: break-word;
        }
        .prose-custom h1 {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px;
          font-weight: 600;
          color: var(--color-teal);
          margin-bottom: 16px;
        }
        .prose-custom h2,
        .prose-custom h3 {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .prose-custom h2 { font-size: 18px; color: var(--color-fg); }
        .prose-custom h3 { font-size: 15px; color: var(--color-fg); }
        .prose-custom p {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 16px;
          color: var(--color-muted);
        }
        .prose-custom code {
          background: var(--color-raised);
          color: var(--color-amber);
          padding: 1px 5px;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
        }
        .prose-custom pre {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .prose-custom pre code {
          background: transparent;
          color: var(--color-fg);
          padding: 0;
          display: block;
          font-family: 'JetBrains Mono', monospace;
        }
        .prose-custom blockquote {
          border-left: 3px solid var(--color-teal);
          padding-left: 16px;
          color: var(--color-tertiary);
          margin-bottom: 24px;
          font-style: italic;
        }
        .prose-custom a { color: var(--color-teal); text-decoration: none; }
        .prose-custom a:hover { text-decoration: underline; }
        .prose-custom ul, .prose-custom ol { padding-left: 20px; margin-bottom: 16px; }
        .prose-custom li { margin-bottom: 6px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--color-muted); }
        .prose-custom hr { border: none; border-top: 1px solid var(--color-border); margin: 24px 0; }
        .prose-custom img { max-width: 100%; border-radius: 8px; margin: 16px 0; }
      `}</style>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Notes Settings"
        settings={[
          { key: "fontSize", label: "Editor font size", type: "select", value: editorFontSize, options: [{ label: "Small", value: "small" }, { label: "Medium", value: "medium" }, { label: "Large", value: "large" }] },
          { key: "lineWidth", label: "Editor width", type: "select", value: editorLineWidth, options: [{ label: "Narrow", value: "narrow" }, { label: "Medium", value: "medium" }, { label: "Wide", value: "wide" }] },
        ]}
        onChange={(key, val) => {
          if (key === "fontSize") setEditorFontSize(val as string)
          if (key === "lineWidth") setEditorLineWidth(val as string)
        }}
      />

      <UserGuideModal
        open={userGuideOpen}
        onClose={() => setUserGuideOpen(false)}
        toolId="markdown-notes"
      />
    </div>
  )
}
