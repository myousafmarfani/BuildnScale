"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Link from "next/link"
import {
  IconCheck,
  IconSettings,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconPlus,
  IconList,
  IconCalendarWeek,
  IconCalendarEvent,
  IconChartBar,
  IconBook2,
} from "@tabler/icons-react"
import { ToolBreadcrumbs } from "@/components/ui/ToolBreadcrumbs"
import { SettingsDrawer } from "@/components/ui/SettingsDrawer"
import { Toast } from "@/components/ui/Toast"
import { UserGuideModal } from "@/components/ui/UserGuideModal"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { useSync } from "@/hooks/useSync"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "bns_habits_"

interface Habit {
  id: string
  name: string
  color: string
  createdAt: number
}

type Checkins = Record<string, string[]>

const CELL_LEVELS = [
  "var(--cell-level-0)",
  "var(--cell-level-1)",
  "var(--cell-level-2)",
  "var(--cell-level-3)",
  "var(--cell-level-4)",
]

const HABIT_COLORS = [
  "var(--color-teal)",
  "var(--color-info)",
  "var(--color-amber)",
  "var(--habit-color-purple)",
  "var(--color-danger)",
]

function isToday(date: Date): boolean {
  const t = new Date()
  return (
    date.getFullYear() === t.getFullYear() &&
    date.getMonth() === t.getMonth() &&
    date.getDate() === t.getDate()
  )
}

function formatDateWords(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

function toISO(d: Date): string {
  return d.toLocaleDateString("en-CA")
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

function getStreak(habitId: string, checkins: Checkins): number {
  let count = 0
  const d = new Date()
  const today = toISO(d)
  const todayChecked = (checkins[today] || []).includes(habitId)
  if (!todayChecked) d.setDate(d.getDate() - 1)
  for (let i = 0; i < 366; i++) {
    const ds = toISO(d)
    if ((checkins[ds] || []).includes(habitId)) count++
    else break
    d.setDate(d.getDate() - 1)
  }
  return count
}

function getLongestStreak(checkins: Checkins, habits: Habit[]): number {
  return Math.max(0, ...habits.map((h) => getStreak(h.id, checkins)))
}

function getMonthCompletion(checkins: Checkins, habits: Habit[]): number {
  if (habits.length === 0) return 0
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  let checkedDays = 0
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    if (date > d) break
    const ds = toISO(date)
    if ((checkins[ds] || []).length > 0) checkedDays++
  }
  return Math.round((checkedDays / daysInMonth) * 100)
}

function getWeekDates(): Date[] {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export default function HabitTrackerPage() {
  const todayStr = toISO(new Date())

  useSync(["bns_habits_habits", "bns_habits_checkins"])

  const [habits, setHabits] = useState<Habit[]>([])
  const [checkins, setCheckins] = useState<Checkins>({})
  const [adding, setAdding] = useState(false)
  const [addInput, setAddInput] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editInput, setEditInput] = useState("")
  const [kebabOpen, setKebabOpen] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileTab, setMobileTab] = useState<"habits" | "week" | "year" | "stats">("habits")
  const [tooltip, setTooltip] = useState<{ date: Date; count: number; x: number; y: number } | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [userGuideOpen, setUserGuideOpen] = useState(false)

  const addRef = useRef<HTMLInputElement>(null)
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const h = loadJSON<Habit[]>(STORAGE_KEY + "habits", [])
    const c = loadJSON<Checkins>(STORAGE_KEY + "checkins", {})
    setHabits(h)
    setCheckins(c)
  }, [])

  useEffect(() => {
    if (adding) addRef.current?.focus()
  }, [adding])

  useEffect(() => {
    if (editingId) editRef.current?.focus()
  }, [editingId])

  useEffect(() => {
    if (!toastVisible) return
    const id = setTimeout(() => {
      setToast(null)
      setToastVisible(false)
    }, 2500)
    return () => clearTimeout(id)
  }, [toastVisible])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAdding(false)
        setEditingId(null)
        setKebabOpen(null)
        setTooltip(null)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (kebabOpen) {
        const target = e.target as HTMLElement
        if (!target.closest("[data-kebab]")) setKebabOpen(null)
      }
    }
    window.addEventListener("click", handler)
    return () => window.removeEventListener("click", handler)
  }, [kebabOpen])

  const persistHabits = useCallback((next: Habit[]) => {
    setHabits(next)
    saveJSON(STORAGE_KEY + "habits", next)
  }, [])

  const persistCheckins = useCallback((next: Checkins) => {
    setCheckins(next)
    saveJSON(STORAGE_KEY + "checkins", next)
  }, [])

  const addHabit = useCallback(() => {
    const name = addInput.trim()
    if (!name) return
    const habit: Habit = {
      id: crypto.randomUUID(),
      name,
      color: HABIT_COLORS[habits.length % HABIT_COLORS.length],
      createdAt: Date.now(),
    }
    persistHabits([...habits, habit])
    setAddInput("")
    setAdding(false)
    setToast("Habit added")
    setToastVisible(true)
  }, [addInput, habits, persistHabits])

  const deleteHabit = useCallback((id: string) => {
    persistHabits(habits.filter((h) => h.id !== id))
    const nextCheckins: Checkins = {}
    for (const [date, ids] of Object.entries(checkins)) {
      const filtered = ids.filter((hid) => hid !== id)
      if (filtered.length > 0) nextCheckins[date] = filtered
    }
    persistCheckins(nextCheckins)
    setKebabOpen(null)
    setToast("Habit deleted")
    setToastVisible(true)
  }, [habits, checkins, persistHabits, persistCheckins])

  const renameHabit = useCallback((id: string, name: string) => {
    persistHabits(habits.map((h) => (h.id === id ? { ...h, name } : h)))
    setEditingId(null)
  }, [habits, persistHabits])

  const moveHabit = useCallback((id: string, dir: "up" | "down") => {
    const idx = habits.findIndex((h) => h.id === id)
    if (idx < 0) return
    const next = [...habits]
    const target = dir === "up" ? idx - 1 : idx + 1
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    persistHabits(next)
    setKebabOpen(null)
  }, [habits, persistHabits])

  const toggleCheckin = useCallback((habitId: string) => {
    const today = toISO(new Date())
    const todayCheckins = checkins[today] || []
    const next: Checkins = { ...checkins }
    const habit = habits.find((h) => h.id === habitId)
    if (todayCheckins.includes(habitId)) {
      next[today] = todayCheckins.filter((id) => id !== habitId)
      if (next[today].length === 0) delete next[today]
      setToast(`Unchecked "${habit?.name || habitId}"`)
      setToastVisible(true)
    } else {
      next[today] = [...todayCheckins, habitId]
      setToast(`✅ "${habit?.name || habitId}" checked!`)
      setToastVisible(true)
    }
    persistCheckins(next)
  }, [checkins, habits, persistCheckins])

  const streaks = useMemo(
    () => Object.fromEntries(habits.map((h) => [h.id, getStreak(h.id, checkins)])),
    [habits, checkins]
  )

  const longestStreak = useMemo(() => getLongestStreak(checkins, habits), [checkins, habits])
  const monthCompletion = useMemo(() => getMonthCompletion(checkins, habits), [checkins, habits])
  const todayCheckedCount = useMemo(() => {
    const today = toISO(new Date())
    return (checkins[today] || []).length
  }, [checkins])
  const weekDates = useMemo(() => getWeekDates(), [])

  const heatmapData = useMemo(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)

    const weeks: { date: Date; level: number; count: number }[][] = []
    for (let w = 52 - 1; w >= 0; w--) {
      const week: { date: Date; level: number; count: number }[] = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(monday)
        date.setDate(monday.getDate() - w * 7 + d)
        const ds = toISO(date)
        const count = (checkins[ds] || []).length
        const ratio = habits.length > 0 ? count / habits.length : 0
        let level: number
        if (date > today) level = -1
        else if (count === 0) level = 0
        else if (ratio <= 0.25) level = 1
        else if (ratio <= 0.5) level = 2
        else if (ratio <= 0.75) level = 3
        else level = 4
        week.push({ date, level, count })
      }
      weeks.push(week)
    }
    return weeks
  }, [checkins, habits])

  const monthLabels = useMemo(() => {
    const labels: { col: number; name: string }[] = []
    let lastMonth = -1
    heatmapData.forEach((week, colIdx) => {
      const month = week[3]?.date.getMonth() ?? -1
      if (month !== lastMonth) {
        labels.push({ col: colIdx, name: MONTHS_SHORT[month] })
        lastMonth = month
      }
    })
    return labels
  }, [heatmapData])

  return (
    <div className="flex h-screen flex-col bg-bg">
      {/* Top Bar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-bg px-3 md:px-4 sticky top-0 z-[100]">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/" className="font-display text-sm font-semibold text-fg shrink-0">
            build<span className="text-teal">n</span>scale
          </Link>
          <div className="h-4 w-px bg-border shrink-0" />
          <ToolBreadcrumbs slug="habit-tracker" />
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
        <div className="mx-auto max-w-[1060px] px-4 md:px-5 py-8 md:py-12">
          {/* Desktop: two columns */}
          <div className={cn("flex gap-8 md:gap-12", isMobile && "flex-col")}>
            {/* Left Column */}
            <div className={cn(isMobile ? "w-full" : "w-full md:w-[480px] lg:w-[520px] shrink-0")}>
              {/* Habits Section */}
              <section className="mb-10 md:mb-12">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-display text-sm text-fg">
                    Today — {formatDateWords(new Date())}
                  </span>
                  <button
                    onClick={() => setAdding(true)}
                    className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-teal hover:bg-raised transition-colors"
                  >
                    <IconPlus className="h-3.5 w-3.5" /> Add habit
                  </button>
                </div>

                {/* Habit Rows */}
                {habits.map((habit, idx) => (
                  <div key={habit.id} className="flex items-center border-b border-border py-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleCheckin(habit.id)}
                      className={cn(
                        "mr-3 md:mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-180",
                        (checkins[todayStr] || []).includes(habit.id)
                          ? "border-teal bg-teal"
                          : "border-border"
                      )}
                    >
                      {(checkins[todayStr] || []).includes(habit.id) && (
                        <IconCheck className="h-3.5 w-3.5 text-bg" />
                      )}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {editingId === habit.id ? (
                        <input
                          ref={editRef}
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") renameHabit(habit.id, editInput)
                            if (e.key === "Escape") setEditingId(null)
                          }}
                          className="w-full bg-transparent text-sm font-medium text-fg outline-none"
                        />
                      ) : (
                        <div className="text-sm font-medium text-fg truncate">{habit.name}</div>
                      )}
                      <div className={cn("mt-0.5 flex items-center gap-1 text-xs", (streaks[habit.id] ?? 0) > 0 ? "text-amber" : "text-tertiary")}>
                        {(streaks[habit.id] ?? 0) > 0 ? (
                          <><span>🔥</span> {streaks[habit.id]}-day streak</>
                        ) : (
                          "○ Start your streak today"
                        )}
                      </div>
                    </div>

                    {/* Kebab */}
                    <div className="relative" data-kebab>
                      <button
                        onClick={() => setKebabOpen(kebabOpen === habit.id ? null : habit.id)}
                        className="p-1 text-tertiary hover:text-muted transition-colors"
                      >
                        <IconDotsVertical className="h-4 w-4" />
                      </button>
                      {kebabOpen === habit.id && (
                        <div className="absolute right-0 top-8 z-30 w-36 rounded-lg border border-border bg-surface py-1 shadow-lg">
                          <button
                            onClick={() => { setEditInput(habit.name); setEditingId(habit.id); setKebabOpen(null) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted hover:bg-raised"
                          >
                            <IconPencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => { setDeleteConfirmId(habit.id); setKebabOpen(null) }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-raised"
                          >
                            <IconTrash className="h-3.5 w-3.5" /> Delete
                          </button>
                          <div className="border-t border-border my-1" />
                          <button
                            onClick={() => moveHabit(habit.id, "up")}
                            disabled={idx === 0}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted hover:bg-raised disabled:opacity-30"
                          >
                            <IconArrowUp className="h-3.5 w-3.5" /> Move up
                          </button>
                          <button
                            onClick={() => moveHabit(habit.id, "down")}
                            disabled={idx === habits.length - 1}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted hover:bg-raised disabled:opacity-30"
                          >
                            <IconArrowDown className="h-3.5 w-3.5" /> Move down
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Habit Inline */}
                {adding && (
                  <div className="flex items-center border-b border-border py-4">
                    <div className="mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-tertiary" />
                    <input
                      ref={addRef}
                      value={addInput}
                      onChange={(e) => setAddInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addHabit()
                        if (e.key === "Escape") { setAdding(false); setAddInput("") }
                      }}
                      placeholder="Habit name..."
                      className="flex-1 bg-transparent text-sm font-medium text-fg outline-none placeholder:text-tertiary"
                    />
                  </div>
                )}

                {habits.length === 0 && !adding && (
                  <div className="py-10 text-center font-mono text-xs text-tertiary">
                    No habits yet. Click &ldquo;+ Add habit&rdquo; to start tracking.
                  </div>
                )}
              </section>

              {/* Weekly Mini Calendar */}
              <section className="mb-10 md:mb-12">
                <div className="mb-3 font-display text-xs uppercase tracking-[0.08em] text-muted">This week</div>
                <div className="flex justify-between">
                  {weekDates.map((d, i) => {
                    const ds = toISO(d)
                    const count = (checkins[ds] || []).length
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <div
                          className={cn(
                            "flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full text-xs font-medium transition-all",
                            count === habits.length && habits.length > 0
                              ? "bg-teal text-bg"
                              : count > 0
                                ? "bg-teal/20 text-teal"
                                : isToday(d)
                                  ? "border border-border text-muted"
                                  : "text-tertiary"
                          )}
                        >
                          {d.getDate()}
                        </div>
                        <span className="font-mono text-[11px] text-tertiary">
                          {d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            {/* Right Column (desktop only) */}
            <div className="hidden md:block flex-1 min-w-0">
              {/* Heatmap */}
              <section className="rounded-lg border border-border bg-surface p-5 lg:p-8">
                <div className="mb-5 text-xs text-muted">
                  Year in habits · {new Date().getFullYear() - 1} → {new Date().getFullYear()}
                </div>

                {/* Month labels */}
                <div className="relative mb-1" style={{ paddingLeft: "32px" }}>
                  <div className="flex overflow-x-auto" style={{ gap: "3px" }}>
                    {monthLabels.map((m, i) => (
                      <span
                        key={i}
                        className="font-mono text-[11px] text-tertiary shrink-0"
                        style={{
                          marginLeft: i > 0
                            ? `${(m.col - monthLabels[i - 1].col) * 14 - monthLabels[i - 1].name.length * 6.5}px`
                            : "0",
                        }}
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className="flex overflow-x-auto pb-2">
                  <div className="flex flex-col gap-[3px] pt-0 pr-2 shrink-0">
                    {[0, 2, 4].map((row) => (
                      <div key={row} className="flex h-[13px] items-center font-mono text-[11px] text-tertiary">
                        {["M", "W", "F"][Math.floor(row / 2)]}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-[3px]">
                    {heatmapData.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((day, di) => (
                          <div
                            key={di}
                            className="relative h-[11px] w-[11px] rounded-[2px]"
                            style={{ background: day.level < 0 ? "transparent" : CELL_LEVELS[day.level], border: day.level < 0 ? "none" : "1px solid var(--color-border)" }}
                            onMouseEnter={(e) => {
                              if (day.level >= 0) {
                                const rect = (e.target as HTMLElement).getBoundingClientRect()
                                setTooltip({ date: day.date, count: day.count, x: rect.left + rect.width / 2, y: rect.top - 8 })
                              }
                            }}
                            onMouseLeave={() => setTooltip(null)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-tertiary">
                  <div className="flex items-center gap-2">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                      <div key={l} className="h-[11px] w-[11px] rounded-[2px]" style={{ background: CELL_LEVELS[l], border: "1px solid var(--color-border)" }} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Mobile: Right column content below */}
          {isMobile && (
            <div className="mt-6">
              {mobileTab === "year" && (
                <section className="rounded-lg border border-border bg-surface p-5">
                  <div className="mb-4 text-xs text-muted">
                    Year in habits · {new Date().getFullYear() - 1} → {new Date().getFullYear()}
                  </div>
                  <div className="relative mb-1" style={{ paddingLeft: "32px" }}>
                    <div className="flex overflow-x-auto" style={{ gap: "3px" }}>
                      {monthLabels.map((m, i) => (
                        <span key={i} className="font-mono text-[11px] text-tertiary shrink-0">{m.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto pb-2">
                    <div className="flex">
                      <div className="flex flex-col gap-[3px] pt-0 pr-2">
                        {[0, 2, 4].map((row) => (
                          <div key={row} className="flex h-[13px] items-center font-mono text-[11px] text-tertiary">
                            {["M", "W", "F"][Math.floor(row / 2)]}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-[3px]">
                        {heatmapData.map((week, wi) => (
                          <div key={wi} className="flex flex-col gap-[3px]">
                            {week.map((day, di) => (
                              <div key={di} className="h-[11px] w-[11px] rounded-[2px]" style={{ background: day.level < 0 ? "transparent" : CELL_LEVELS[day.level], border: day.level < 0 ? "none" : "1px solid var(--color-border)" }} />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {mobileTab === "stats" && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border bg-raised p-4 text-center">
                    <span className="block font-display text-2xl text-teal">{longestStreak}</span>
                    <span className="text-[11px] text-tertiary">Longest streak</span>
                  </div>
                  <div className="rounded-lg border border-border bg-raised p-4 text-center">
                    <span className="block font-display text-2xl text-teal">{monthCompletion}%</span>
                    <span className="text-[11px] text-tertiary">Month</span>
                  </div>
                  <div className="rounded-lg border border-border bg-raised p-4 text-center">
                    <span className="block font-display text-2xl text-teal">{todayCheckedCount}/{habits.length}</span>
                    <span className="text-[11px] text-tertiary">Today</span>
                  </div>
                </div>
              )}

              {mobileTab === "week" && (
                <section className="mb-12">
                  <div className="mb-3 font-display text-xs uppercase tracking-[0.08em] text-muted">This week</div>
                  <div className="flex justify-between">
                    {weekDates.map((d, i) => {
                      const ds = toISO(d)
                      const count = (checkins[ds] || []).length
                      return (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium transition-all",
                              count === habits.length && habits.length > 0
                                ? "bg-teal text-bg"
                                : count > 0
                                  ? "bg-teal/20 text-teal"
                                  : isToday(d)
                                    ? "border border-border text-muted"
                                    : "text-tertiary"
                            )}
                          >
                            {d.getDate()}
                          </div>
                          <span className="font-mono text-[11px] text-tertiary">
                            {d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          )}


        </div>
      </main>

      {/* Mobile Tab Bar */}
      {isMobile && (
        <div className="grid h-14 shrink-0 grid-cols-4 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)]">
          {(
            [
              { key: "habits" as const, icon: IconList, label: "Habits" },
              { key: "week" as const, icon: IconCalendarWeek, label: "Week" },
              { key: "year" as const, icon: IconCalendarEvent, label: "Year" },
              { key: "stats" as const, icon: IconChartBar, label: "Stats" },
            ]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] ${mobileTab === tab.key ? "text-teal" : "text-tertiary"}`}
            >
              <tab.icon className="h-[18px] w-[18px]" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-raised border border-border px-2.5 py-1.5 text-xs text-fg shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {tooltip.count} habit{tooltip.count !== 1 ? "s" : ""} completed
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="w-full max-w-xs rounded-lg border border-border bg-surface p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 font-display text-base font-semibold text-fg">Delete habit?</h3>
            <p className="mb-4 text-sm text-muted">This will also remove all check-in history for this habit. This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => { deleteHabit(deleteConfirmId); setDeleteConfirmId(null) }} className="flex-1 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white">Delete</button>
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-md border border-border px-4 py-2 text-sm text-muted">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast} variant="success" visible={toastVisible} onDismiss={() => { setToast(null); setToastVisible(false) }} />
      )}

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Habit Tracker Settings"
        settings={[
          { key: "maxHabits", label: "Free tier habit limit", type: "number", value: 5, min: 3, max: 20, suffix: "habits" },
        ]}
        onChange={() => {}}
        onReset={() => {
          if (confirm("Delete all habit data? This cannot be undone.")) {
            localStorage.removeItem(STORAGE_KEY + "habits")
            localStorage.removeItem(STORAGE_KEY + "checkins")
            window.location.reload()
          }
        }}
      />

      <UserGuideModal
        open={userGuideOpen}
        onClose={() => setUserGuideOpen(false)}
        toolId="habit-tracker"
      />
    </div>
  )
}
