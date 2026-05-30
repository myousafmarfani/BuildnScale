"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Link from "next/link"
import {
  IconSettings,
  IconGripVertical,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconShare,
  IconDownload,
  IconChartBar,
  IconLayoutSidebarRightCollapse,
  IconX,
  IconBook2,
} from "@tabler/icons-react"
import { StreakPill } from "@/components/ui/StreakPill"
import { KbdHint } from "@/components/ui/KbdHint"
import { ToolBreadcrumbs } from "@/components/ui/ToolBreadcrumbs"
import { SettingsDrawer } from "@/components/ui/SettingsDrawer"
import { UserGuideModal } from "@/components/ui/UserGuideModal"
import { useSync } from "@/hooks/useSync"

const SLOT_HEIGHT = 28
const TOTAL_HOURS = 24

const COLORS = [
  { name: "blue", value: "var(--color-info)" },
  { name: "purple", value: "var(--habit-color-purple)" },
  { name: "teal", value: "var(--color-teal)" },
  { name: "amber", value: "var(--color-amber)" },
  { name: "coral", value: "var(--color-danger)" },
  { name: "gray", value: "var(--color-tertiary)" },
]

const HOURS = Array.from({ length: TOTAL_HOURS }, (_, i) => i)

interface Task {
  id: string
  title: string
  color: string
  startSlot?: number
  duration?: number
  completed: boolean
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
}

function toISO(d: Date): string {
  return d.toLocaleDateString("en-CA")
}

function getToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function getDayFromStr(str: string): Date {
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function loadStreak(): { streak: number; days: string[] } {
  if (typeof window === "undefined") return { streak: 0, days: [] }
  const s = parseInt(localStorage.getItem("bns_streak") || "0", 10) || 0
  const d: string[] = JSON.parse(localStorage.getItem("bns_streak_days") || "[]")
  return { streak: s, days: d }
}

function saveStreak(streak: number, days: string[]) {
  localStorage.setItem("bns_streak", String(streak))
  localStorage.setItem("bns_streak_days", JSON.stringify(days))
}

function loadTasks(dateStr: string): Task[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(`bns_tasks_${dateStr}`)
  return data ? JSON.parse(data) : []
}

function saveTasks(dateStr: string, tasks: Task[]) {
  localStorage.setItem(`bns_tasks_${dateStr}`, JSON.stringify(tasks))
}

function updateStreak(): { streak: number; days: string[] } {
  const today = toISO(getToday())
  const { streak, days } = loadStreak()
  if (days.includes(today)) return { streak, days }
  const yesterday = toISO(new Date(Date.now() - 86400000))
  const newDays = [...days, today]
  const newStreak = days.length === 0 || days[days.length - 1] === yesterday ? streak + 1 : 1
  saveStreak(newStreak, newDays)
  return { streak: newStreak, days: newDays }
}

export default function DailyPlannerPage() {
  const todayStr = toISO(getToday())

  const [tasks, setTasks] = useState<Task[]>([])
  const [dateStr, setDateStr] = useState(todayStr)
  const [streak, setStreak] = useState(0)
  const [, setStreakDays] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inputText, setInputText] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLORS[2].value)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [mobileTab, setMobileTab] = useState<"grid" | "tasks" | "today" | "streak">("grid")
  const [isMobile, setIsMobile] = useState(false)
  const [now, setNow] = useState(new Date())
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [userGuideOpen, setUserGuideOpen] = useState(false)

  const gridRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const { streak: s, days } = loadStreak()
    setStreak(s)
    setStreakDays(days)
  }, [])

  useEffect(() => {
    const s = updateStreak()
    setStreak(s.streak)
    setStreakDays(s.days)
  }, [])

  useEffect(() => {
    setTasks(loadTasks(dateStr))
  }, [dateStr])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === "n" || e.key === "N") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "t" || e.key === "T") {
        e.preventDefault()
        setDateStr(todayStr)
        setTimeout(() => {
          if (gridRef.current) gridRef.current.scrollTop = 0
        }, 50)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [todayStr])

  const commitTasks = useCallback(
    (next: Task[]) => {
      setTasks(next)
      saveTasks(dateStr, next)
    },
    [dateStr]
  )

  const addTask = useCallback(() => {
    if (!inputText.trim()) return
    const t: Task = {
      id: crypto.randomUUID(),
      title: inputText.trim(),
      color: selectedColor,
      completed: false,
    }
    commitTasks([...tasks, t])
    setInputText("")
  }, [inputText, selectedColor, tasks, commitTasks])

  const deleteTask = useCallback(
    (id: string) => commitTasks(tasks.filter((t) => t.id !== id)),
    [tasks, commitTasks]
  )

  const toggleComplete = useCallback(
    (id: string) =>
      commitTasks(
        tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      ),
    [tasks, commitTasks]
  )

  const moveTaskToGrid = useCallback(
    (taskId: string, startSlot: number) =>
      commitTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, startSlot, duration: t.duration || 2 } : t
        )
      ),
    [tasks, commitTasks]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent, targetSlot: number) => {
      e.preventDefault()
      const taskId = e.dataTransfer.getData("taskId")
      if (!taskId) return
      moveTaskToGrid(taskId, targetSlot)
    },
    [moveTaskToGrid]
  )

  const changeDate = useCallback(
    (dir: "prev" | "next") => {
      const d = getDayFromStr(dateStr)
      d.setDate(d.getDate() + (dir === "prev" ? -1 : 1))
      setDateStr(toISO(d))
    },
    [dateStr]
  )

  const scheduledTasks = tasks.filter((t) => t.startSlot != null)
  const unscheduledTasks = tasks.filter((t) => t.startSlot == null)

  const nowMin = now.getHours() * 60 + now.getMinutes()
  const timeLineTop = (nowMin / 30) * SLOT_HEIGHT

  const scrollToNow = () => {
    if (gridRef.current) {
      gridRef.current.scrollTop = timeLineTop - 200
    }
  }

  const syncKeys = useMemo(
    () => ["bns_streak", "bns_streak_days", `bns_tasks_${dateStr}`],
    [dateStr]
  )
  useSync(syncKeys)

  const selectedDate = getDayFromStr(dateStr)
  const isToday = dateStr === todayStr

  return (
    <div className="flex h-screen flex-col bg-bg">
      {/* Top Bar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-bg px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/" className="font-display text-sm font-semibold text-fg shrink-0">
            build<span className="text-teal">n</span>scale
          </Link>
          <div className="h-4 w-px bg-border shrink-0" />
          <ToolBreadcrumbs slug="daily-planner" />
          <span className="hidden sm:inline rounded-[5px] border border-border bg-raised px-2 py-[3px] font-display text-[11px] text-tertiary shrink-0">
            {formatDate(selectedDate)}
          </span>
        </div>

        {!isMobile && (
          <div className="hidden md:flex gap-3 text-xs text-tertiary">
            <KbdHint keys={["N"]} label="New task" />
            <KbdHint keys={["T"]} label="Today" />
            <KbdHint keys={["⌘", "K"]} label="Command" />
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <StreakPill count={streak} />
          <button onClick={() => setUserGuideOpen(true)} className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted hover:text-fg hover:bg-raised transition-colors">
            <IconBook2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          <button onClick={() => setSettingsOpen(true)} className="text-tertiary hover:text-muted transition-colors">
            <IconSettings className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <main className="flex flex-1 overflow-hidden">
        {/* Time Grid */}
        <div
          ref={gridRef}
          className="relative flex-1 overflow-y-auto overflow-x-hidden bg-bg"
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="inline-flex min-w-full">
            <div
              className="grid flex-1"
              style={{ gridTemplateColumns: "minmax(48px, 64px) 1fr" }}
            >
              {HOURS.flatMap((hour) => [
                <div
                  key={`l-${hour}`}
                  className="time-cell flex h-[56px] items-start border-b border-raised pt-1"
                >
                  <span className="font-mono w-12 md:w-16 text-right text-[11px] text-tertiary pr-1 md:pr-3">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>,
                <div
                  key={`s-${hour}`}
                  className="slot-container relative flex-1 border-l border-border min-w-0"
                  onDrop={(e) => handleDrop(e, hour * 2)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="h-[28px] border-b border-raised/40" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, hour * 2)} />
                  <div className="h-[28px] border-b border-raised/40" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, hour * 2 + 1)} />
                  {scheduledTasks
                    .filter((t) => t.startSlot! >= hour * 2 && t.startSlot! < (hour + 1) * 2)
                    .map((task) => {
                      const innerTop = (task.startSlot! - hour * 2) * SLOT_HEIGHT
                      const blockH = (task.duration || 2) * SLOT_HEIGHT - 2
                      return (
                        <div
                          key={task.id}
                          className={`task-block absolute left-1 right-1 md:left-2 md:right-2 cursor-pointer rounded-[5px] px-1.5 md:px-2.5 py-1.5 text-[11px] md:text-xs font-medium text-fg transition-all duration-150 hover:scale-[1.01] hover:brightness-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${
                            task.completed ? "opacity-45" : ""
                          }`}
                          style={{
                            top: `${innerTop}px`,
                            height: `${blockH}px`,
                            background: task.color,
                            borderLeft: "3px solid rgba(0,0,0,0.2)",
                            textDecoration: task.completed ? "line-through" : "none",
                          }}
                          onClick={() => {
                            setEditingTask(task.id)
                            setEditTitle(task.title)
                          }}
                        >
                          <span className="truncate block">{task.title}</span>
                        </div>
                      )
                    })}
                </div>,
              ])}
            </div>
          </div>

          {/* Current Time Line */}
          {isToday && timeLineTop > 0 && (
            <div
              className="pointer-events-none absolute left-0 right-0 z-[5] h-[2px] bg-teal"
              style={{ top: `${timeLineTop}px` }}
            >
              <div className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full bg-teal" />
            </div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-bg/80 font-mono text-sm text-tertiary px-4 text-center">
              <p>No tasks yet.</p>
              <p className="mt-2">Press N to add your first task, or type in the sidebar →</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside
          className={`shrink-0 border-l border-border bg-surface transition-all duration-280 overflow-y-auto ${
            isMobile
              ? sidebarOpen
                ? "fixed inset-y-0 right-0 z-30 w-[280px] shadow-lg"
                : "hidden"
              : "w-[260px] lg:w-[280px]"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-xs uppercase tracking-[0.08em] text-muted">Tasks</span>
            <button onClick={() => setSidebarOpen(false)} className="text-tertiary hover:text-muted transition-colors">
              {isMobile ? <IconX className="h-4 w-4" /> : <IconLayoutSidebarRightCollapse className="h-4 w-4" />}
            </button>
          </div>

          <div className="p-4">
            <div className="mb-4 rounded-md border border-border bg-raised p-2.5">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask()
                }}
                placeholder="Add task…"
                className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-tertiary"
              />
              <div className="mt-1 font-mono text-[10px] text-tertiary">↵ to add · drag to plan</div>
            </div>

            {inputText && (
              <div className="mb-4 flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    className={`h-5 w-5 rounded-full border-2 transition-all ${
                      selectedColor === c.value ? "scale-110 border-fg" : "border-transparent"
                    }`}
                    style={{ background: c.value }}
                    onClick={() => setSelectedColor(c.value)}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {unscheduledTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                  className="flex cursor-move items-center gap-2.5 rounded-md border border-border bg-raised px-3 py-2.5 text-sm"
                >
                  <IconGripVertical className="h-3.5 w-3.5 shrink-0 text-tertiary" />
                  <div
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: task.color }}
                  />
                  <span
                    className={`flex-1 truncate ${task.completed ? "text-tertiary line-through" : ""}`}
                  >
                    {task.title}
                  </span>
                  <button onClick={() => toggleComplete(task.id)} className="text-tertiary hover:text-teal transition-colors shrink-0">
                    <div
                      className={`h-4 w-4 rounded border ${
                        task.completed ? "border-teal bg-teal" : "border-border"
                      }`}
                    />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-tertiary hover:text-danger transition-colors shrink-0">
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {unscheduledTasks.length === 0 && tasks.length > 0 && (
              <div className="py-6 text-center font-mono text-xs text-tertiary">
                All tasks are scheduled!
              </div>
            )}
          </div>

          <div className="border-t border-border p-4 mt-auto">
            <div className="mb-2 text-xs text-tertiary">
              {scheduledTasks.length} of {tasks.length} tasks planned
            </div>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-raised">
              <div
                className="h-full rounded-full bg-teal transition-all"
                style={{
                  width: `${tasks.length > 0 ? (scheduledTasks.length / tasks.length) * 100 : 0}%`,
                }}
              />
            </div>
            {streak > 0 && (
              <div className="mt-3 text-[11px] text-amber">🔥 Keep your streak alive</div>
            )}
          </div>
        </aside>
      </main>

      {/* Bottom Bar */}
      <footer className="flex h-11 shrink-0 items-center justify-between border-t border-border bg-bg px-3 md:px-4 text-sm">
        <div className="flex items-center gap-2 md:gap-4 text-muted">
          <button onClick={() => changeDate("prev")} className="text-tertiary hover:text-muted transition-colors">
            <IconChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => changeDate("prev")} className="hover:text-fg transition-colors text-xs md:text-sm">
            Yesterday
          </button>
          <button
            onClick={() => {
              setDateStr(todayStr)
              scrollToNow()
            }}
            className={`pb-0.5 text-xs md:text-sm ${isToday ? "border-b-2 border-teal text-fg" : ""}`}
          >
            Today
          </button>
          <button onClick={() => changeDate("next")} className="hover:text-fg transition-colors text-xs md:text-sm">
            Tomorrow
          </button>
          <button onClick={() => changeDate("next")} className="text-tertiary hover:text-muted transition-colors">
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[11px] text-tertiary">
            {scheduledTasks.length} / {tasks.length} tasks in blocks
          </span>
          <div className="h-[3px] w-20 overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full bg-teal"
              style={{
                width: `${tasks.length > 0 ? (scheduledTasks.length / tasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 text-tertiary">
          <IconShare className="h-4 w-4 hover:text-muted cursor-pointer transition-colors" onClick={() => {
            const summary = tasks
              .filter((t) => t.startSlot != null)
              .sort((a, b) => (a.startSlot || 0) - (b.startSlot || 0))
              .map((t) => `• ${t.title}`)
              .join("\n")
            const text = `My plan for ${formatDate(selectedDate)}:\n${summary || "No scheduled tasks"}`
            navigator.clipboard.writeText(text).then(() => {
              const el = document.createElement("div")
              el.className = "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-md bg-teal px-4 py-2 text-sm text-bg shadow-lg"
              el.textContent = "Copied to clipboard!"
              document.body.appendChild(el)
              setTimeout(() => el.remove(), 2000)
            })
          }} />
          <IconDownload className="h-4 w-4 hover:text-muted cursor-pointer transition-colors" />
          <IconChartBar className="h-4 w-4 text-amber" />
        </div>
      </footer>

      {/* Mobile Tab Bar */}
      {isMobile && (
        <div className="grid h-14 shrink-0 grid-cols-4 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)]">
          {([
            { key: "tasks" as const, icon: "📋", label: "Tasks" },
            { key: "grid" as const, icon: "🗓", label: "Planner" },
            { key: "today" as const, icon: "●", label: "Today" },
            { key: "streak" as const, icon: "🔥", label: "Streak" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setMobileTab(tab.key)
                if (tab.key === "tasks") setSidebarOpen(true)
                if (tab.key === "today") scrollToNow()
              }}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] ${
                mobileTab === tab.key ? "text-teal" : "text-tertiary"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Overlay when sidebar is open on mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-xs rounded-lg border border-border bg-surface p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 font-display text-base font-semibold text-fg">Delete task?</h3>
            <p className="mb-4 text-sm text-muted">
              This will remove the task from all time slots. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  deleteTask(deleteConfirm)
                  setDeleteConfirm(null)
                }}
                className="flex-1 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-md border border-border px-4 py-2 text-sm text-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editing Popover */}
      {editingTask && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setEditingTask(null)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 font-display text-base font-semibold text-fg">Edit task</h3>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mb-4 w-full rounded-md border border-border bg-raised px-3 py-2 text-sm text-fg outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitTasks(
                    tasks.map((t) =>
                      t.id === editingTask ? { ...t, title: editTitle } : t
                    )
                  )
                  setEditingTask(null)
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  commitTasks(
                    tasks.map((t) =>
                      t.id === editingTask ? { ...t, title: editTitle } : t
                    )
                  )
                  setEditingTask(null)
                }}
                className="flex-1 rounded-md bg-teal px-4 py-2 text-sm font-medium text-bg"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1 rounded-md border border-border px-4 py-2 text-sm text-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm(editingTask)
                  setEditingTask(null)
                }}
                className="rounded-md border border-danger/40 px-3 py-2 text-sm text-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Planner Settings"
        settings={[
          {
            key: "startHour",
            label: "Day starts at",
            type: "number",
            value: 8,
            min: 0,
            max: 12,
            suffix: "AM",
          },
          {
            key: "timeFormat",
            label: "Time format",
            type: "select",
            value: "12h",
            options: [
              { label: "12-hour", value: "12h" },
              { label: "24-hour", value: "24h" },
            ],
          },
        ]}
        onChange={() => {}}
      />

      <UserGuideModal
        open={userGuideOpen}
        onClose={() => setUserGuideOpen(false)}
        toolId="daily-planner"
      />
    </div>
  )
}
