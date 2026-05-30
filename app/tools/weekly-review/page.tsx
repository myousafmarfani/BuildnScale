"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import Link from "next/link"
import {
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconCheck,
  IconFlame,
  IconCalendarEvent,
  IconSettings,
  IconBook2,
} from "@tabler/icons-react"
import { SettingsDrawer } from "@/components/ui/SettingsDrawer"
import { Toast } from "@/components/ui/Toast"
import { UserGuideModal } from "@/components/ui/UserGuideModal"
import { ToolBreadcrumbs } from "@/components/ui/ToolBreadcrumbs"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "bns_review_"
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

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

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDateRange(monday: Date): string {
  const sun = new Date(monday)
  sun.setDate(monday.getDate() + 6)
  const mo = monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const su = sun.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })
  return `${mo}–${su}`
}

function getWeekNumber(monday: Date): number {
  const d = new Date(monday)
  d.setDate(d.getDate() + 3)
  const week1 = new Date(d.getFullYear(), 0, 4)
  week1.setDate(week1.getDate() - (week1.getDay() + 6) % 7)
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

function toISO(d: Date): string {
  return d.toLocaleDateString("en-CA")
}

const HABIT_NAMES = ["Morning coding", "No meetings before 10", "Ship one thing", "Read 20m", "Exercise"]

export default function WeeklyReviewPage() {
  const thisMonday = getMonday(new Date())
  const [selectedWeek, setSelectedWeek] = useState(toISO(thisMonday))
  const [reflections, setReflections] = useState<Record<string, { wentWell: string; gotInWay: string; protect: string }>>({})
  const [wentWell, setWentWell] = useState("")
  const [gotInWay, setGotInWay] = useState("")
  const [protect, setProtect] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [mobileTab, setMobileTab] = useState<"summary" | "chart" | "habits" | "reflect">("summary")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [firstDay, setFirstDay] = useState(() => loadJSON<string>(STORAGE_KEY + "firstDay", "monday"))
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" | "info" } | null>(null)
  const [userGuideOpen, setUserGuideOpen] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const all = loadJSON<Record<string, { wentWell: string; gotInWay: string; protect: string }>>(STORAGE_KEY + "reflections", {})
    setReflections(all)
  }, [])

  useEffect(() => { saveJSON(STORAGE_KEY + "firstDay", firstDay) }, [firstDay])

  useEffect(() => {
    const entry = reflections[selectedWeek]
    setWentWell(entry?.wentWell || "")
    setGotInWay(entry?.gotInWay || "")
    setProtect(entry?.protect || "")
  }, [selectedWeek, reflections])

  const mondayDate = useMemo(() => {
    const [y, m, d] = selectedWeek.split("-").map(Number)
    return new Date(y, m - 1, d)
  }, [selectedWeek])

  const weekLabel = `Week ${getWeekNumber(mondayDate)} · ${formatDateRange(mondayDate)}`

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mondayDate)
      d.setDate(mondayDate.getDate() + i)
      return d
    })
  }, [mondayDate])

  const weekData = useMemo(() => {
    const dayData = weekDays.map((day) => {
      const ds = toISO(day)
      const pomoSessions = loadJSON<any[]>(`bns_pomo_sessions_${ds}`, [])
      const tasks = loadJSON<any[]>(`bns_tasks_${ds}`, [])
      const checkins = loadJSON<Record<string, string[]>>("bns_habits_checkins", {})
      const habits = loadJSON<any[]>("bns_habits_habits", [])
      const dayCheckins = checkins[ds] || []

      const focusSec = pomoSessions
        .filter((s: any) => s.completed)
        .reduce((sum: number, s: any) => sum + (s.duration || 0), 0)

      return {
        date: ds,
        focusHours: Math.round((focusSec / 3600) * 10) / 10,
        tasksCompleted: tasks.filter((t: any) => t.completed).length,
        habitChecked: dayCheckins,
        habitsTotal: habits.length,
        active: tasks.filter((t: any) => t.completed).length > 0 || focusSec > 0,
      }
    })

    const totalFocus = dayData.reduce((s, d) => s + d.focusHours, 0)
    const totalTasks = dayData.reduce((s, d) => s + d.tasksCompleted, 0)
    const totalChecked = dayData.reduce((s, d) => s + d.habitChecked.length, 0)
    const totalPossible = dayData.reduce((s, d) => s + d.habitsTotal, 0)
    const habitPct = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0
    const activeDays = dayData.filter((d) => d.active).length
    const streak = loadJSON<number>("bns_streak", 0) || 0

    return { dayData, totalFocus, totalTasks, habitPct, activeDays, streak }
  }, [weekDays])

  const lastWeekData = useMemo(() => {
    const lastMonday = new Date(mondayDate)
    lastMonday.setDate(mondayDate.getDate() - 7)
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(lastMonday)
      d.setDate(lastMonday.getDate() + i)
      return d
    })
    const totalFocus = days.reduce((sum, d) => {
      const ds = toISO(d)
      const sessions = loadJSON<any[]>(`bns_pomo_sessions_${ds}`, [])
      return sum + sessions.filter((s: any) => s.completed).reduce((s2: number, s: any) => s2 + (s.duration || 0), 0)
    }, 0) / 3600
    const totalTasks = days.reduce((sum, d) => {
      const ds = toISO(d)
      const tasks = loadJSON<any[]>(`bns_tasks_${ds}`, [])
      return sum + tasks.filter((t: any) => t.completed).length
    }, 0)

    return { totalFocus: Math.round(totalFocus * 10) / 10, totalTasks }
  }, [mondayDate])

  const deltaFocus = weekData.totalFocus - lastWeekData.totalFocus
  const deltaTasks = weekData.totalTasks - lastWeekData.totalTasks

  const isCurrentWeek = toISO(thisMonday) === selectedWeek

  const maxFocus = Math.max(...weekData.dayData.map((d) => d.focusHours), 5)
  const bestDay = weekData.dayData.reduce(
    (best, d, i) => (d.focusHours > (best?.hours ?? -1) ? { idx: i, hours: d.focusHours } : best),
    null as { idx: number; hours: number } | null
  )

  const habitGridData = useMemo(() => {
    const checkins = loadJSON<Record<string, string[]>>("bns_habits_checkins", {})
    const habits = loadJSON<any[]>("bns_habits_habits", [])
    const names = habits.length > 0 ? habits.map((h: any) => h.name) : HABIT_NAMES

    return names.slice(0, 8).map((name: string) => ({
      name,
      days: weekDays.map((d) => {
        const ds = toISO(d)
        const dayCheckins = checkins[ds] || []
        const habit = habits.find((h: any) => h.name === name)
        return habit ? dayCheckins.includes(habit.id) : false
      }),
    }))
  }, [weekDays])

  const commitSave = useCallback(() => {
    const next = { ...reflections, [selectedWeek]: { wentWell, gotInWay, protect } }
    setReflections(next)
    saveJSON(STORAGE_KEY + "reflections", next)
    setToast({ message: "Reflection saved", variant: "success" })
  }, [reflections, selectedWeek, wentWell, gotInWay, protect])

  const debouncedSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => { commitSave() }, 600)
  }, [commitSave])

  return (
    <div className="flex h-screen flex-col bg-bg">
      {/* Top Bar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-bg px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/" className="font-display text-sm font-semibold text-fg shrink-0">
            build<span className="text-teal">n</span>scale
          </Link>
          <div className="h-4 w-px bg-border shrink-0" />
          <ToolBreadcrumbs slug="weekly-review" />
        </div>
        <div className="flex items-center gap-2 md:gap-3 font-display text-xs text-muted">
          <button onClick={() => { const prev = new Date(mondayDate); prev.setDate(prev.getDate() - 7); setSelectedWeek(toISO(prev)) }}>
            <IconChevronLeft className="h-4 w-4 text-teal" />
          </button>
          <span className="whitespace-nowrap hidden sm:inline">{weekLabel}</span>
          <span className="whitespace-nowrap sm:hidden">W{getWeekNumber(mondayDate)}</span>
          <button onClick={() => { const next = new Date(mondayDate); next.setDate(next.getDate() + 7); if (next <= thisMonday) setSelectedWeek(toISO(next)) }}>
            <IconChevronRight className="h-4 w-4 text-teal" />
          </button>
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
      <main className="flex-1 overflow-y-auto bg-bg">
        <div className="mx-auto max-w-[1100px] px-4 md:px-5 py-6 md:py-8">
          {/* Page Header */}
          <div className="mb-6 md:mb-8 flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl md:text-[32px] font-semibold text-fg">
                {isCurrentWeek ? "Good morning." : "Your week in review"}
              </h1>
              <p className="mt-1 text-sm text-muted">{weekLabel}</p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className={cn(
            "mb-8 grid gap-4",
            isMobile ? "grid-cols-2" : "grid-cols-4",
            isMobile && mobileTab !== "summary" && "hidden"
          )}>
            <div className="rounded-lg border border-border bg-surface p-4 md:p-5">
              <IconClock className="mb-3 h-5 w-5 text-teal" />
              <span className="block font-display text-2xl md:text-[32px] font-semibold text-fg">{weekData.totalFocus.toFixed(1)}h</span>
              <span className="text-xs text-tertiary">Total focus time</span>
              {deltaFocus !== 0 && (
                <span className={cn("mt-2 block text-[11px]", deltaFocus > 0 ? "text-teal" : "text-danger")}>
                  {deltaFocus > 0 ? "↑" : "↓"} {Math.abs(deltaFocus).toFixed(1)}h vs last week
                </span>
              )}
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 md:p-5">
              <IconCheck className="mb-3 h-5 w-5 text-teal" />
              <span className="block font-display text-2xl md:text-[32px] font-semibold text-fg">{weekData.totalTasks > 0 ? weekData.totalTasks : "—"}</span>
              <span className="text-xs text-tertiary">Tasks completed</span>
              {deltaTasks !== 0 && (
                <span className={cn("mt-2 block text-[11px]", deltaTasks > 0 ? "text-teal" : "text-danger")}>
                  {deltaTasks > 0 ? "↑" : "↓"} {Math.abs(deltaTasks)} vs last week
                </span>
              )}
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 md:p-5">
              <IconFlame className="mb-3 h-5 w-5 text-amber" />
              <span className="block font-display text-2xl md:text-[32px] font-semibold text-fg">{weekData.habitPct > 0 ? `${weekData.habitPct}%` : "—"}</span>
              <span className="text-xs text-tertiary">Habit completion</span>
              {weekData.streak > 0 && <span className="mt-2 block text-[11px] text-amber">🔥 {weekData.streak}-day streak ongoing</span>}
              {weekData.streak === 0 && weekData.habitPct === 0 && <span className="mt-2 block text-[11px] text-tertiary">No habits tracked this week</span>}
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 md:p-5">
              <IconCalendarEvent className="mb-3 h-5 w-5 text-teal" />
              <span className="block font-display text-2xl md:text-[32px] font-semibold text-fg">{weekData.activeDays > 0 ? `${weekData.activeDays}/${isCurrentWeek ? 5 : 7}` : "—"}</span>
              <span className="text-xs text-tertiary">Active days</span>
              <span className="mt-2 block text-[11px] text-teal">
                {weekData.activeDays === 0 ? "No activity recorded yet" : weekData.activeDays >= 5 ? "Full week — great work" : `${weekData.activeDays} days active`}
              </span>
            </div>
          </div>

          {/* Middle Section */}
          <div className={cn("mb-8 grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-[1.5fr_1fr]", isMobile && mobileTab !== "chart" && mobileTab !== "habits" && "hidden")}>
            {/* Focus Time Chart */}
            <div className={cn("rounded-lg border border-border bg-surface p-5 md:p-6", isMobile && mobileTab !== "chart" && "hidden")}>
              <h3 className="mb-6 text-xs text-muted">Focus time by day</h3>
              {weekData.dayData.map((d, i) => {
                const pct = maxFocus > 0 ? (d.focusHours / maxFocus) * 100 : 0
                return (
                  <div key={i} className="mb-3 grid items-center gap-3" style={{ gridTemplateColumns: "48px 1fr 40px" }}>
                    <span className={cn("font-display text-[11px]", i === bestDay?.idx ? "text-teal" : "text-tertiary")}>{DAYS[i]}</span>
                    <div className="relative h-7 overflow-hidden rounded bg-raised">
                      <div className="h-full rounded bg-teal" style={{ width: `${Math.max(pct, 0)}%`, animation: isCurrentWeek ? `barGrow 0.6s ease-out ${i * 0.08}s forwards` : "none" }} />
                    </div>
                    <span className="font-display text-xs text-right">{d.focusHours.toFixed(1)}h</span>
                  </div>
                )
              })}
              {bestDay && <div className="mt-4 font-display text-xs text-teal">Best day: {DAYS[bestDay.idx]} ({bestDay.hours.toFixed(1)}h)</div>}
            </div>

            {/* Habit Mini Grid */}
            <div className={cn("rounded-lg border border-border bg-surface p-5 md:p-6", isMobile && mobileTab !== "habits" && "hidden")}>
              <h3 className="mb-4 text-xs text-muted">Habits this week</h3>
              <div className="flex justify-between px-1 mb-2 text-[11px] text-tertiary">
                {DAYS.map((d) => <span key={d} className="w-5 text-center">{d[0]}</span>)}
              </div>
              <div className="flex flex-col gap-2">
                {habitGridData.map((habit, hi) => (
                  <div key={hi} className="flex items-center gap-2">
                    <span className="w-16 md:w-20 truncate text-xs text-muted shrink-0">{habit.name}</span>
                    <div className="grid flex-1 grid-cols-7 gap-1">
                      {habit.days.map((checked, di) => (
                        <div key={di} className={cn("h-4 w-4 md:h-5 md:w-5 rounded-sm", checked ? "bg-teal" : "bg-raised")} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reflection Section */}
          <section className={cn("mb-8 rounded-lg border border-border bg-surface p-5 md:p-7", isMobile && mobileTab !== "reflect" && "hidden")}>
            <h2 className="text-sm font-medium text-fg">Weekly reflection</h2>
            <p className="mb-6 text-xs text-tertiary">Takes 5 minutes. Worth the clarity.</p>

            <div className="mb-6">
              <label className="mb-2 block text-xs text-muted">What went well this week?</label>
              <textarea value={wentWell} onChange={(e) => { setWentWell(e.target.value); debouncedSave() }} placeholder="Shipped the beta for the calculator..." className="min-h-[80px] w-full rounded-md border border-border bg-raised p-3 font-display text-sm text-fg outline-none focus:border-teal" />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-xs text-muted">What got in the way?</label>
              <textarea value={gotInWay} onChange={(e) => { setGotInWay(e.target.value); debouncedSave() }} placeholder="Too many ad-hoc meetings on Wednesday..." className="min-h-[80px] w-full rounded-md border border-border bg-raised p-3 font-display text-sm text-fg outline-none focus:border-teal" />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-xs text-muted">One thing to protect next week.</label>
              <textarea value={protect} onChange={(e) => { setProtect(e.target.value); debouncedSave() }} placeholder="Deep work block from 9–12 every day..." className="min-h-[80px] w-full rounded-md border border-border bg-raised p-3 font-display text-sm text-fg outline-none focus:border-teal" />
            </div>

            <div className="flex justify-end">
              <button onClick={() => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); commitSave() }} className="rounded-md bg-teal px-5 py-2 text-sm font-medium text-bg transition-all hover:brightness-110">
                Save reflection →
              </button>
            </div>
          </section>


        </div>
      </main>

      {/* Mobile Tab Bar */}
      {isMobile && (
        <div className="grid h-14 shrink-0 grid-cols-4 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)]">
          {([{ key: "summary" as const, icon: IconCheck, label: "Summary" }, { key: "chart" as const, icon: IconClock, label: "Chart" }, { key: "habits" as const, icon: IconFlame, label: "Habits" }, { key: "reflect" as const, icon: IconCalendarEvent, label: "Reflect" }]).map((tab) => (
            <button key={tab.key} onClick={() => setMobileTab(tab.key)} className={cn("flex flex-col items-center justify-center gap-0.5 text-[10px]", mobileTab === tab.key ? "text-teal" : "text-tertiary")}>
              <tab.icon className="h-[16px] w-[16px]" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} variant={toast.variant} visible={!!toast} onDismiss={() => setToast(null)} />}

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Review Settings"
        settings={[{ key: "firstDay", label: "First day of week", type: "select", value: firstDay, options: [{ label: "Monday", value: "monday" }, { label: "Sunday", value: "sunday" }] }]}
        onChange={(key, val) => { if (key === "firstDay") setFirstDay(val as string) }}
      />

      <UserGuideModal
        open={userGuideOpen}
        onClose={() => setUserGuideOpen(false)}
        toolId="weekly-review"
      />

      <style jsx global>{`
        @keyframes barGrow {
          from { width: 0 !important; }
        }
      `}</style>
    </div>
  )
}
