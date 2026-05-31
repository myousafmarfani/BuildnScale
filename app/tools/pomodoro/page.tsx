"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconRefresh,
  IconClock,
  IconCheck,
  IconSettings,
  IconList,
  IconCalendarEvent,
  IconCircle,
  IconBook2,
  IconLayoutSidebarRightCollapse,
} from "@tabler/icons-react"
import { StreakPill } from "@/components/ui/StreakPill"
import { SettingsDrawer } from "@/components/ui/SettingsDrawer"
import { ToolBreadcrumbs } from "@/components/ui/ToolBreadcrumbs"
import { UserGuideModal } from "@/components/ui/UserGuideModal"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { useSync } from "@/hooks/useSync"

const CIRCUMFERENCE = 2 * Math.PI * 98
const STORAGE_KEY = "bns_pomo_"

interface PomodoroSession {
  id: string
  task: string
  duration: number
  startTime: number
  endTime: number
  completed: boolean
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function formatHour(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatDuration(duration: number): string {
  return formatTime(duration)
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

function updateStreak(): { streak: number; days: string[] } {
  const today = new Date().toLocaleDateString("en-CA")
  const { streak, days } = loadStreak()
  if (days.includes(today)) return { streak, days }
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA")
  const newDays = [...days, today]
  const newStreak =
    days.length === 0 || days[days.length - 1] === yesterday ? streak + 1 : 1
  saveStreak(newStreak, newDays)
  return { streak: newStreak, days: newDays }
}

function playBeep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.value = 0.25
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc.stop(ctx.currentTime + 0.15)
  } catch {
    // audio not available
  }
}

export default function PomodoroPage() {
  const today = new Date().toLocaleDateString("en-CA")

  useSync([
    "bns_pomo_focusTime",
    "bns_pomo_shortBreak",
    "bns_pomo_longBreak",
    "bns_pomo_longBreakInterval",
    `bns_pomo_sessions_${today}`,
    "bns_pomo_tasks",
    "bns_pomo_currentTask",
    `bns_pomo_totalFocus_${today}`,
    "bns_streak",
    "bns_streak_days",
  ])

  const [focusTime, setFocusTime] = useState(() => loadJSON(STORAGE_KEY + "focusTime", 25) as number)
  const [shortBreak, setShortBreak] = useState(() => loadJSON(STORAGE_KEY + "shortBreak", 5) as number)
  const [longBreak, setLongBreak] = useState(() => loadJSON(STORAGE_KEY + "longBreak", 15) as number)
  const [longBreakInterval, setLongBreakInterval] = useState(() => loadJSON(STORAGE_KEY + "longBreakInterval", 4) as number)

  const [timeLeft, setTimeLeft] = useState(focusTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus")
  const [sessionNumber, setSessionNumber] = useState(1)
  const [completedSessions, setCompletedSessions] = useState<PomodoroSession[]>([])
  const [tasks, setTasks] = useState<string[]>([])
  const [currentTask, setCurrentTask] = useState("")
  const [totalFocusToday, setTotalFocusToday] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [isLongBreak, setIsLongBreak] = useState(false)
  const [pendingTransition, setPendingTransition] = useState<{
    type: "focus" | "break"
    time: number
  } | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileTab, setMobileTab] = useState<"timer" | "log" | "tasks">("timer")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [userGuideOpen, setUserGuideOpen] = useState(false)

  const focusSeconds = focusTime * 60
  const shortBreakSeconds = shortBreak * 60
  const longBreakSeconds = longBreak * 60

  const focusRef = useRef(focusSeconds)
  const shortRef = useRef(shortBreakSeconds)
  const longRef = useRef(longBreakSeconds)
  useEffect(() => { focusRef.current = focusSeconds }, [focusSeconds])
  useEffect(() => { shortRef.current = shortBreakSeconds }, [shortBreakSeconds])
  useEffect(() => { longRef.current = longBreakSeconds }, [longBreakSeconds])

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    setStreak(loadStreak().streak)
    const s = updateStreak()
    setStreak(s.streak)

    const loadedSessions = loadJSON<PomodoroSession[]>(
      STORAGE_KEY + "sessions_" + today,
      []
    )
    setCompletedSessions(loadedSessions)

    const loadedTasks = loadJSON<string[]>(STORAGE_KEY + "tasks", [])
    setTasks(loadedTasks)

    const loadedCurrentTask = loadJSON<string>(STORAGE_KEY + "currentTask", "")
    setCurrentTask(loadedCurrentTask)

    const loadedTotalFocus = loadJSON<number>(STORAGE_KEY + "totalFocus_" + today, 0)
    setTotalFocusToday(loadedTotalFocus)
  }, [today])

  const persist = useCallback(
    (partial?: {
      sessions?: PomodoroSession[]
      tasks?: string[]
      currentTask?: string
      totalFocus?: number
    }) => {
      const s = partial?.sessions ?? completedSessions
      const t = partial?.tasks ?? tasks
      const ct = partial?.currentTask ?? currentTask
      const tf = partial?.totalFocus ?? totalFocusToday
      saveJSON(STORAGE_KEY + "sessions_" + today, s)
      saveJSON(STORAGE_KEY + "tasks", t)
      saveJSON(STORAGE_KEY + "currentTask", ct)
      saveJSON(STORAGE_KEY + "totalFocus_" + today, tf)
    },
    [completedSessions, tasks, currentTask, totalFocusToday, today]
  )

  const logSession = useCallback(
    (startTs: number) => {
      const now = Date.now()
      const session: PomodoroSession = {
        id: crypto.randomUUID(),
        task: currentTask || "Untitled",
        duration: focusSeconds,
        startTime: startTs,
        endTime: now,
        completed: true,
      }
      const next = [...completedSessions, session]
      setCompletedSessions(next)
      setTotalFocusToday((p) => p + focusRef.current)
      const newTotal = totalFocusToday + focusRef.current
      persist({ sessions: next, totalFocus: newTotal })
    },
    [currentTask, completedSessions, totalFocusToday, persist, focusSeconds]
  )

  const toggleTimer = useCallback(() => {
    if (countdown > 0) return
    if (isRunning) {
      setIsRunning(false)
    } else {
      if (sessionStartTime === null) {
        setSessionStartTime(Date.now())
      }
      setIsRunning(true)
    }
  }, [isRunning, sessionStartTime, countdown])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setSessionStartTime(null)
    setIsLongBreak(false)
    setTimeLeft(sessionType === "focus" ? focusRef.current : shortRef.current)
    setCountdown(0)
    setPendingTransition(null)
  }, [sessionType])

  const addTask = useCallback(() => {
    const val = inputRef.current?.value.trim()
    if (!val) return
    const next = [...tasks, val]
    setTasks(next)
    saveJSON(STORAGE_KEY + "tasks", next)
    if (inputRef.current) inputRef.current.value = ""
  }, [tasks])

  const selectTask = useCallback(
    (task: string) => {
      setCurrentTask(task)
      saveJSON(STORAGE_KEY + "currentTask", task)
    },
    []
  )

  const removeTask = useCallback(
    (idx: number) => {
      const next = tasks.filter((_, i) => i !== idx)
      setTasks(next)
      saveJSON(STORAGE_KEY + "tasks", next)
    },
    [tasks]
  )

  const totalTime = sessionType === "focus" ? focusSeconds : shortBreakSeconds
  const progress = timeLeft / totalTime
  const dashoffset = CIRCUMFERENCE * (1 - progress)
  const nextSessionLabel =
    sessionType === "focus"
      ? `Break ${sessionNumber >= 4 ? "(long)" : ""}`
      : "Focus"

  useEffect(() => {
    if (isRunning && countdown === 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, countdown])

  useEffect(() => {
    if (timeLeft > 0 || countdown > 0) return
    playBeep()
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      const title = sessionType === "focus" ? "Focus session complete!" : "Break over!"
      new Notification(title, {
        body: sessionType === "focus" ? "Time for a break." : "Ready to focus again.",
        icon: "/favicon.ico",
      })
    }

    if (sessionType === "focus") {
      const st = sessionStartTime ?? Date.now()
      logSession(st)
      const isLong = sessionNumber % longBreakInterval === 0
      setIsLongBreak(isLong)
      setPendingTransition({
        type: "break",
        time: isLong ? longRef.current : shortRef.current,
      })
      setSessionNumber((n) => n + 1)
    } else {
      setPendingTransition({ type: "focus", time: focusRef.current })
    }
    setSessionStartTime(null)
    setCountdown(3)
  }, [timeLeft, countdown, logSession, longBreakInterval, sessionNumber, sessionStartTime, sessionType])

  useEffect(() => {
    if (countdown <= 0 || !pendingTransition) return
    const id = setTimeout(() => {
      if (countdown === 1) {
        if (pendingTransition.type === "focus") setIsLongBreak(false)
        setSessionType(pendingTransition.type)
        setTimeLeft(pendingTransition.time)
        setIsRunning(true)
        setSessionStartTime(Date.now())
        setPendingTransition(null)
        setCountdown(0)
      } else {
        setCountdown((c) => c - 1)
      }
    }, 1000)
    return () => clearTimeout(id)
  }, [countdown, pendingTransition])

  useEffect(() => {
    saveJSON(STORAGE_KEY + "focusTime", focusTime)
  }, [focusTime])
  useEffect(() => {
    saveJSON(STORAGE_KEY + "shortBreak", shortBreak)
  }, [shortBreak])
  useEffect(() => {
    saveJSON(STORAGE_KEY + "longBreak", longBreak)
  }, [longBreak])
  useEffect(() => {
    saveJSON(STORAGE_KEY + "longBreakInterval", longBreakInterval)
  }, [longBreakInterval])

  const pomodoroSettings = [
    { key: "focusTime", label: "Focus duration", type: "number" as const, value: focusTime, min: 10, max: 120, suffix: "min" },
    { key: "shortBreak", label: "Short break", type: "number" as const, value: shortBreak, min: 1, max: 30, suffix: "min" },
    { key: "longBreak", label: "Long break", type: "number" as const, value: longBreak, min: 5, max: 60, suffix: "min" },
    { key: "longBreakInterval", label: "Long break after", type: "number" as const, value: longBreakInterval, min: 1, max: 10, suffix: "sessions" },
  ]

  const handleSettingsChange = (key: string, value: string | number) => {
    switch (key) {
      case "focusTime":
        setFocusTime(value as number)
        if (!isRunning) setTimeLeft((value as number) * 60)
        break
      case "shortBreak":
        setShortBreak(value as number)
        break
      case "longBreak":
        setLongBreak(value as number)
        break
      case "longBreakInterval":
        setLongBreakInterval(value as number)
        break
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.code === "Space") {
        e.preventDefault()
        toggleTimer()
      }
      if (e.key === "r" || e.key === "R") {
        resetTimer()
      }
      if (e.code === "Space" && sessionStartTime === null) {
        setSessionStartTime(Date.now())
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggleTimer, resetTimer, sessionStartTime])

  const displaySessionNum = ((sessionNumber - 1) % 4) + 1
  const sessionLabel =
    sessionType === "focus"
      ? `Focus · Session ${displaySessionNum} of 4`
      : isLongBreak || (sessionType === "break" && sessionNumber % 4 === 0)
        ? "Long Break"
        : "Short Break"

  const ringColor = sessionType === "focus" ? "var(--color-teal)" : "var(--color-amber)"
  const ringBg = "var(--color-raised)"

  return (
    <div className="flex h-screen flex-col bg-bg">
      {/* Top Bar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border bg-bg px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/" className="font-display text-sm font-semibold text-fg shrink-0">
            build<span className="text-teal">n</span>scale
          </Link>
          <div className="h-4 w-px bg-border shrink-0" />
          <ToolBreadcrumbs slug="pomodoro" />
        </div>

        {!isMobile && (
          <div className="hidden md:flex gap-3 font-display text-[11px] text-tertiary">
            <span>
              <span className="rounded-[3px] border border-border bg-raised px-1 py-[1px] font-mono text-[10px] text-muted">Space</span> Start/Pause
            </span>
            <span>
              <span className="rounded-[3px] border border-border bg-raised px-1 py-[1px] font-mono text-[10px] text-muted">R</span> Reset
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <StreakPill count={streak} />
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

      {/* Main Content */}
      <main className="relative flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[700px] px-4">
            {/* Timer Section */}
            <div className="flex flex-col items-center pt-12 md:pt-20">
              {/* Timer Ring */}
              <div className="relative mb-8 flex h-[180px] w-[180px] md:h-[200px] md:w-[200px] flex-col items-center justify-center">
                <svg
                  className="absolute inset-0"
                  viewBox="0 0 200 200"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="98"
                    fill="none"
                    stroke={ringBg}
                    strokeWidth="4"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="98"
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={String(CIRCUMFERENCE)}
                    strokeDashoffset={String(dashoffset)}
                    style={{
                      transition: isRunning
                        ? "stroke-dashoffset 1s linear"
                        : "none",
                    }}
                  />
                </svg>
                <div className="font-display text-[40px] md:text-[48px] font-semibold text-fg">
                  {countdown > 0
                    ? formatTime(pendingTransition?.time ?? totalTime)
                    : formatTime(timeLeft)}
                </div>
                <div className="text-xs text-tertiary text-center px-4">
                  {countdown > 0
                    ? `Starting ${nextSessionLabel} in ${countdown}…`
                    : sessionLabel}
                </div>
              </div>

              {/* Session Dots */}
              <div className="mb-6 flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i < sessionNumber
                        ? "bg-teal"
                        : i === sessionNumber
                          ? "border-2 border-teal"
                          : "bg-raised"
                    }`}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="mb-8 md:mb-10 flex gap-3">
                <button
                  onClick={() => {
                    if (typeof Notification !== "undefined" && Notification.permission === "default") {
                      Notification.requestPermission()
                    }
                    toggleTimer()
                  }}
                  className="flex items-center gap-2 rounded-md bg-teal px-6 py-2.5 text-sm font-medium text-bg transition-all duration-180 hover:brightness-110"
                >
                  {isRunning ? (
                    <>
                      <IconPlayerPause className="h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <IconPlayerPlay className="h-4 w-4" />{" "}
                      {countdown > 0 ? "Starting…" : "Start"}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (isRunning && countdown === 0) {
                      setShowResetConfirm(true)
                    } else {
                      resetTimer()
                    }
                  }}
                  className="flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-muted transition-all duration-180 hover:text-fg"
                >
                  <IconRefresh className="h-4 w-4" />
                </button>
              </div>

              {/* Current Task */}
              <div className="mb-8 md:mb-10 text-center">
                <div className="text-xs text-tertiary">Working on:</div>
                <div className="mt-1 text-base font-medium text-fg">
                  {currentTask || "No task selected"}
                </div>
                <button
                  onClick={() => inputRef.current?.focus()}
                  className="mt-1 text-xs text-teal hover:underline"
                >
                  Change task
                </button>
              </div>

              {/* Task Log */}
              <section className="w-full pb-12 md:pb-20">
                <h2 className="mb-4 border-b border-border pb-2 text-xs uppercase tracking-[0.08em] text-muted">
                  Today&apos;s log
                </h2>

                {completedSessions.length === 0 && !isRunning ? (
                  <div className="py-12 text-center font-mono text-xs text-tertiary">
                    No sessions yet. Start your first Pomodoro above.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs min-w-[400px]">
                      <thead>
                        <tr>
                          <th className="px-2 md:px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">#</th>
                          <th className="px-2 md:px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Task</th>
                          <th className="px-2 md:px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Duration</th>
                          <th className="px-2 md:px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Time</th>
                          <th className="px-2 md:px-3 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedSessions.map((s, i) => (
                          <tr key={s.id} className="border-b border-border text-muted">
                            <td className="px-2 md:px-3 py-3">{i + 1}</td>
                            <td className="px-2 md:px-3 py-3 max-w-[120px] truncate">{s.task}</td>
                            <td className="px-2 md:px-3 py-3 whitespace-nowrap">{formatDuration(s.duration)}</td>
                            <td className="px-2 md:px-3 py-3 whitespace-nowrap">
                              {formatHour(s.startTime)}–{formatHour(s.endTime)}
                            </td>
                            <td className="px-2 md:px-3 py-3 text-teal whitespace-nowrap">
                              <IconCheck className="mr-1 inline h-3 w-3" /> Done
                            </td>
                          </tr>
                        ))}
                        {isRunning && sessionStartTime && (
                          <tr className="border-l-2 border-teal bg-surface text-fg">
                            <td className="px-2 md:px-3 py-3">{completedSessions.length + 1}</td>
                            <td className="px-2 md:px-3 py-3 max-w-[120px] truncate">{currentTask || "Untitled"}</td>
                            <td className="px-2 md:px-3 py-3 whitespace-nowrap">
                              {formatTime(focusSeconds - timeLeft > 0 ? focusSeconds - timeLeft : 0)}
                            </td>
                            <td className="px-2 md:px-3 py-3 whitespace-nowrap">
                              {formatHour(sessionStartTime)}–now
                            </td>
                            <td className="px-2 md:px-3 py-3 text-teal whitespace-nowrap">
                              <IconClock className="mr-1 inline h-3 w-3" /> Active
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-4 font-display text-xs text-teal">
                  Total focus today: {Math.floor(totalFocusToday / 60)} min
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`shrink-0 border-l border-border bg-surface overflow-y-auto transition-all duration-280 ${
          isMobile
            ? "hidden"
            : sidebarOpen
              ? "w-[220px] lg:w-[240px] p-5"
              : "w-0 overflow-hidden border-l-0"
        }`}>
          {sidebarOpen && (
          <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-[0.08em] text-muted">Queue</h3>
            <button onClick={() => setSidebarOpen(false)} className="text-tertiary hover:text-muted transition-colors">
              <IconLayoutSidebarRightCollapse className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4 flex items-center rounded-md border border-border bg-raised px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Add task..."
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask()
              }}
              className="w-full bg-transparent text-xs text-fg outline-none placeholder:text-tertiary"
            />
          </div>

          <div className="flex flex-col gap-2">
            {tasks.length === 0 && (
              <div className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-tertiary">
                No tasks yet
              </div>
            )}
            {tasks.map((task, idx) => (
              <div
                key={idx}
                onClick={() => selectTask(task)}
                className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-xs transition-all ${
                  currentTask === task
                    ? "border border-teal/40 bg-teal/5 text-fg"
                    : "border border-border bg-raised text-muted hover:text-fg"
                }`}
              >
                <span className="flex-1 truncate">{task}</span>
                {currentTask === task && (
                  <span className="text-[10px] text-teal shrink-0">Active</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTask(idx)
                    if (currentTask === task) {
                      setCurrentTask("")
                      saveJSON(STORAGE_KEY + "currentTask", "")
                    }
                  }}
                  className="text-tertiary hover:text-danger shrink-0"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          </>
          )}
        </aside>
        {!isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="shrink-0 border-l border-border bg-surface px-1 text-tertiary hover:text-muted transition-colors"
            aria-label="Open queue"
          >
            <IconLayoutSidebarRightCollapse className="h-4 w-4 rotate-180" />
          </button>
        )}
      </main>

      {/* Mobile Tab Bar */}
      {isMobile && (
        <div className="grid h-14 shrink-0 grid-cols-3 border-t border-border bg-bg pb-[env(safe-area-inset-bottom)]">
          {(
            [
              { key: "timer" as const, icon: IconCalendarEvent, label: "Timer" },
              { key: "log" as const, icon: IconList, label: "Log" },
              { key: "tasks" as const, icon: IconCircle, label: "Tasks" },
            ]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] ${
                mobileTab === tab.key ? "text-teal" : "text-tertiary"
              }`}
            >
              <tab.icon className="h-[18px] w-[18px]" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Task Overlay */}
      {isMobile && mobileTab === "tasks" && (
        <div className="absolute inset-x-0 bottom-14 top-[52px] z-20 overflow-y-auto bg-surface p-5">
          <h3 className="mb-4 text-xs uppercase tracking-[0.08em] text-muted">Queue</h3>
          <div className="mb-4 flex items-center rounded-md border border-border bg-raised px-3 py-2">
            <input
              placeholder="Add task..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input = e.target as HTMLInputElement
                  const val = input.value.trim()
                  if (val) {
                    const next = [...tasks, val]
                    setTasks(next)
                    saveJSON(STORAGE_KEY + "tasks", next)
                    input.value = ""
                  }
                }
              }}
              className="w-full bg-transparent text-xs text-fg outline-none placeholder:text-tertiary"
            />
          </div>
          <div className="flex flex-col gap-2">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                onClick={() => selectTask(task)}
                className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-xs ${
                  currentTask === task
                    ? "border border-teal/40 bg-teal/5 text-fg"
                    : "border border-border bg-raised text-muted"
                }`}
              >
                <span className="flex-1 truncate">{task}</span>
                {currentTask === task && (
                  <span className="text-[10px] text-teal">Active</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTask(idx)
                    if (currentTask === task) {
                      setCurrentTask("")
                      saveJSON(STORAGE_KEY + "currentTask", "")
                    }
                  }}
                  className="text-tertiary hover:text-danger ml-auto"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Log Overlay */}
      {isMobile && mobileTab === "log" && (
        <div className="absolute inset-x-0 bottom-14 top-[52px] z-20 overflow-y-auto bg-bg p-5">
          <h2 className="mb-4 text-xs uppercase tracking-[0.08em] text-muted">Today&apos;s log</h2>
          {completedSessions.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-tertiary">No sessions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">#</th>
                    <th className="px-2 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Task</th>
                    <th className="px-2 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Dur</th>
                    <th className="px-2 py-2 text-left font-display text-[11px] font-normal uppercase text-tertiary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedSessions.map((s, i) => (
                    <tr key={s.id} className="border-b border-border text-muted">
                      <td className="px-2 py-3">{i + 1}</td>
                      <td className="px-2 py-3 truncate max-w-[100px]">{s.task}</td>
                      <td className="px-2 py-3 whitespace-nowrap">{formatDuration(s.duration)}</td>
                      <td className="px-2 py-3 text-teal whitespace-nowrap">
                        <IconCheck className="mr-1 inline h-3 w-3" /> Done
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 font-display text-xs text-teal">
            Total focus today: {Math.floor(totalFocusToday / 60)} min
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="w-full max-w-xs rounded-lg border border-border bg-surface p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 font-display text-base font-semibold text-fg">Reset timer?</h3>
            <p className="mb-4 text-sm text-muted">
              You have an active session running. Resetting will lose your progress.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetTimer()
                  setShowResetConfirm(false)
                }}
                className="flex-1 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-md border border-border px-4 py-2 text-sm text-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Drawer */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Pomodoro Settings"
        settings={pomodoroSettings}
        onChange={handleSettingsChange}
        onReset={() => {
          setFocusTime(25)
          setShortBreak(5)
          setLongBreak(15)
          setLongBreakInterval(4)
          if (!isRunning) setTimeLeft(25 * 60)
        }}
      />

      <UserGuideModal
        open={userGuideOpen}
        onClose={() => setUserGuideOpen(false)}
        toolId="pomodoro"
      />
    </div>
  )
}
