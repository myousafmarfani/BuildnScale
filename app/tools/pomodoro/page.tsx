'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconRefresh,
} from '@tabler/icons-react'

import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SettingsDrawer } from '@/components/ui/SettingsDrawer'

import { UserGuideModal } from '@/components/ui/UserGuideModal'

import { downloadFile, csvCell } from '@/lib/download'
import {
  ToolPageIntro,
  EmptyToolState,
} from '@/components/workspace/ToolPageIntro'
import { useLocalSetting } from '@/hooks/useLocalSetting'
import { useSync } from '@/hooks/useSync'

const STORAGE_KEY = 'bns_pomo_'

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
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatHour(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
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
  const today = new Date().toLocaleDateString('en-CA')

  useSync([
    'bns_pomo_focusTime',
    'bns_pomo_shortBreak',
    'bns_pomo_longBreak',
    'bns_pomo_longBreakInterval',
    `bns_pomo_sessions_${today}`,
    'bns_pomo_tasks',
    'bns_pomo_currentTask',
    `bns_pomo_totalFocus_${today}`,
    'bns_streak',
    'bns_streak_days',
  ])

  const [focusTime, setFocusTime] = useLocalSetting(
    STORAGE_KEY + 'focusTime',
    25
  )
  const [shortBreak, setShortBreak] = useLocalSetting(
    STORAGE_KEY + 'shortBreak',
    5
  )
  const [longBreak, setLongBreak] = useLocalSetting(
    STORAGE_KEY + 'longBreak',
    15
  )
  const [longBreakInterval, setLongBreakInterval] = useLocalSetting(
    STORAGE_KEY + 'longBreakInterval',
    4
  )

  const [timeLeft, setTimeLeft] = useState(focusTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus')
  const [sessionNumber, setSessionNumber] = useState(1)
  const [completedSessions, setCompletedSessions] = useState<PomodoroSession[]>(
    []
  )
  const [tasks, setTasks] = useState<string[]>([])
  const [currentTask, setCurrentTask] = useState('')
  const [totalFocusToday, setTotalFocusToday] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [isLongBreak, setIsLongBreak] = useState(false)
  const [pendingTransition, setPendingTransition] = useState<{
    type: 'focus' | 'break'
    time: number
  } | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [userGuideOpen, setUserGuideOpen] = useState(false)
  const [notificationState, setNotificationState] = useState(
    typeof Notification === 'undefined'
      ? 'unsupported'
      : Notification.permission
  )

  const focusSeconds = focusTime * 60
  const shortBreakSeconds = shortBreak * 60
  const longBreakSeconds = longBreak * 60

  const focusRef = useRef(focusSeconds)
  const shortRef = useRef(shortBreakSeconds)
  const longRef = useRef(longBreakSeconds)
  useEffect(() => {
    focusRef.current = focusSeconds
  }, [focusSeconds])
  useEffect(() => {
    shortRef.current = shortBreakSeconds
  }, [shortBreakSeconds])
  useEffect(() => {
    longRef.current = longBreakSeconds
  }, [longBreakSeconds])

  const deadlineRef = useRef<number | null>(null)
  const settingsLoaded = useRef(false)
  const [timerReady, setTimerReady] = useState(false)
  useEffect(() => {
    if (settingsLoaded.current) return
    settingsLoaded.current = true
    const draft = loadJSON<{
      date: string
      timeLeft: number
      deadline: number | null
      running: boolean
      type: 'focus' | 'break'
      number: number
      long: boolean
      started: number | null
    } | null>(STORAGE_KEY + 'activeTimer', null)
    if (
      draft &&
      draft.date === today &&
      Number.isFinite(draft.timeLeft) &&
      draft.timeLeft >= 0 &&
      draft.timeLeft <= 7200 &&
      (draft.type === 'focus' || draft.type === 'break')
    ) {
      setSessionType(draft.type)
      setSessionNumber(draft.number || 1)
      setIsLongBreak(!!draft.long)
      setSessionStartTime(draft.started)
      setTimeLeft(
        draft.running && draft.deadline
          ? Math.max(0, Math.ceil((draft.deadline - Date.now()) / 1000))
          : draft.timeLeft
      )
      setIsRunning(draft.running)
    } else setTimeLeft(loadJSON<number>(STORAGE_KEY + 'focusTime', 25) * 60)
    setTimerReady(true)
  }, [today])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const restore = () => {
      const loadedSessions = loadJSON<PomodoroSession[]>(
        STORAGE_KEY + 'sessions_' + today,
        []
      )
      setCompletedSessions(loadedSessions)

      const loadedTasks = loadJSON<string[]>(STORAGE_KEY + 'tasks', [])
      setTasks(loadedTasks)

      const loadedCurrentTask = loadJSON<string>(
        STORAGE_KEY + 'currentTask',
        ''
      )
      setCurrentTask(loadedCurrentTask)

      const loadedTotalFocus = loadJSON<number>(
        STORAGE_KEY + 'totalFocus_' + today,
        0
      )
      setTotalFocusToday(loadedTotalFocus)
    }
    restore()
    window.addEventListener('bns:sync', restore)
    return () => window.removeEventListener('bns:sync', restore)
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
      saveJSON(STORAGE_KEY + 'sessions_' + today, s)
      saveJSON(STORAGE_KEY + 'tasks', t)
      saveJSON(STORAGE_KEY + 'currentTask', ct)
      saveJSON(STORAGE_KEY + 'totalFocus_' + today, tf)
    },
    [completedSessions, tasks, currentTask, totalFocusToday, today]
  )

  const logSession = useCallback(
    (startTs: number) => {
      const now = Date.now()
      const session: PomodoroSession = {
        id: crypto.randomUUID(),
        task: currentTask || 'Untitled',
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
    setTimeLeft(sessionType === 'focus' ? focusRef.current : shortRef.current)
    setCountdown(0)
    setPendingTransition(null)
  }, [sessionType])

  const addTask = useCallback(() => {
    const val = inputRef.current?.value.trim()
    if (!val) return
    const next = [...tasks, val]
    setTasks(next)
    saveJSON(STORAGE_KEY + 'tasks', next)
    if (!currentTask) {
      setCurrentTask(val)
      saveJSON(STORAGE_KEY + 'currentTask', val)
    }
    if (inputRef.current) inputRef.current.value = ''
  }, [tasks, currentTask])

  const selectTask = useCallback((task: string) => {
    setCurrentTask(task)
    saveJSON(STORAGE_KEY + 'currentTask', task)
  }, [])

  const removeTask = useCallback(
    (idx: number) => {
      const next = tasks.filter((_, i) => i !== idx)
      setTasks(next)
      saveJSON(STORAGE_KEY + 'tasks', next)
    },
    [tasks]
  )

  const totalTime =
    sessionType === 'focus'
      ? focusSeconds
      : isLongBreak
        ? longBreakSeconds
        : shortBreakSeconds
  const progress = timeLeft / totalTime
  const nextSessionLabel =
    sessionType === 'focus'
      ? `Break ${sessionNumber % longBreakInterval === 0 ? '(long)' : ''}`
      : 'Focus'

  useEffect(() => {
    if (!isRunning || countdown > 0) return
    deadlineRef.current = Date.now() + timeLeft * 1000
    const tick = () =>
      setTimeLeft(
        Math.max(0, Math.ceil((deadlineRef.current! - Date.now()) / 1000))
      )
    timerRef.current = setInterval(tick, 250)
    document.addEventListener('visibilitychange', tick)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      document.removeEventListener('visibilitychange', tick)
    }
    // Anchor once when a run starts; ticks must not move the deadline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, countdown])

  useEffect(() => {
    if (!timerReady) return
    if (countdown > 0 || timeLeft <= 0) {
      localStorage.removeItem(STORAGE_KEY + 'activeTimer')
      return
    }
    saveJSON(STORAGE_KEY + 'activeTimer', {
      date: today,
      timeLeft,
      deadline: isRunning ? deadlineRef.current : null,
      running: isRunning,
      type: sessionType,
      number: sessionNumber,
      long: isLongBreak,
      started: sessionStartTime,
    })
  }, [
    timerReady,
    countdown,
    timeLeft,
    isRunning,
    sessionType,
    sessionNumber,
    isLongBreak,
    sessionStartTime,
    today,
  ])

  useEffect(() => {
    if (timeLeft > 0 || countdown > 0 || !isRunning) return
    playBeep()
    if (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'granted'
    ) {
      const title =
        sessionType === 'focus' ? 'Focus session complete!' : 'Break over!'
      new Notification(title, {
        body:
          sessionType === 'focus'
            ? 'Time for a break.'
            : 'Ready to focus again.',
        icon: '/favicon.ico',
      })
    }

    if (sessionType === 'focus') {
      const st = sessionStartTime ?? Date.now()
      logSession(st)
      const isLong = sessionNumber % longBreakInterval === 0
      setIsLongBreak(isLong)
      setPendingTransition({
        type: 'break',
        time: isLong ? longRef.current : shortRef.current,
      })
      setSessionNumber((n) => n + 1)
    } else {
      setPendingTransition({ type: 'focus', time: focusRef.current })
    }
    setSessionStartTime(null)
    setCountdown(3)
  }, [
    timeLeft,
    countdown,
    logSession,
    longBreakInterval,
    sessionNumber,
    sessionStartTime,
    sessionType,
    isRunning,
  ])

  useEffect(() => {
    if (countdown <= 0 || !pendingTransition) return
    const id = setTimeout(() => {
      if (countdown === 1) {
        if (pendingTransition.type === 'focus') setIsLongBreak(false)
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

  const pomodoroSettings = [
    {
      key: 'focusTime',
      label: 'Focus duration',
      type: 'number' as const,
      value: focusTime,
      min: 10,
      max: 120,
      suffix: 'min',
    },
    {
      key: 'shortBreak',
      label: 'Short break',
      type: 'number' as const,
      value: shortBreak,
      min: 1,
      max: 30,
      suffix: 'min',
    },
    {
      key: 'longBreak',
      label: 'Long break',
      type: 'number' as const,
      value: longBreak,
      min: 5,
      max: 60,
      suffix: 'min',
    },
    {
      key: 'longBreakInterval',
      label: 'Long break after',
      type: 'number' as const,
      value: longBreakInterval,
      min: 1,
      max: 10,
      suffix: 'sessions',
    },
  ]

  const handleSettingsChange = (key: string, value: string | number) => {
    switch (key) {
      case 'focusTime':
        setFocusTime(value as number)
        if (!isRunning) setTimeLeft((value as number) * 60)
        break
      case 'shortBreak':
        setShortBreak(value as number)
        break
      case 'longBreak':
        setLongBreak(value as number)
        break
      case 'longBreakInterval':
        setLongBreakInterval(value as number)
        break
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement)?.closest('button, a, [role=dialog]')
      )
        return
      if (e.code === 'Space') {
        e.preventDefault()
        toggleTimer()
      }
      if (e.key === 'r' || e.key === 'R') {
        if (isRunning) setShowResetConfirm(true)
        else resetTimer()
      }
      if (e.code === 'Space' && sessionStartTime === null) {
        setSessionStartTime(Date.now())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleTimer, resetTimer, sessionStartTime, isRunning])

  const displaySessionNum = ((sessionNumber - 1) % longBreakInterval) + 1
  const sessionLabel =
    sessionType === 'focus'
      ? `Focus · Session ${displaySessionNum} of ${longBreakInterval}`
      : isLongBreak ||
          (sessionType === 'break' && sessionNumber % longBreakInterval === 0)
        ? 'Long Break'
        : 'Short Break'

  const ringColor =
    sessionType === 'focus' ? 'var(--color-teal)' : 'var(--color-amber)'
  const ringBg = 'var(--color-raised)'

  return (
    <div className="tool-page-scroll">
      <div className="tool-page-container">
        <ToolPageIntro
          eyebrow="FOCUS / ONE THING AT A TIME"
          title="Make room for your next small win."
          description="Choose a task. Give it your attention. A break is part of the plan."
          onGuide={() => setUserGuideOpen(true)}
          onSettings={() => setSettingsOpen(true)}
          settingsDisabled={isRunning || countdown > 0}
        />
        <div className="focus-layout">
          <section className="tool-panel focus-stage">
            <div className="segmented-control mb-8" aria-label="Timer mode">
              {(['focus', 'short', 'long'] as const).map((mode) => (
                <button
                  key={mode}
                  disabled={isRunning || countdown > 0}
                  aria-pressed={
                    mode === 'focus'
                      ? sessionType === 'focus'
                      : sessionType === 'break' &&
                        (mode === 'long' ? isLongBreak : !isLongBreak)
                  }
                  onClick={() => {
                    setSessionType(mode === 'focus' ? 'focus' : 'break')
                    setIsLongBreak(mode === 'long')
                    setTimeLeft(
                      mode === 'focus'
                        ? focusSeconds
                        : mode === 'long'
                          ? longBreakSeconds
                          : shortBreakSeconds
                    )
                    setSessionStartTime(null)
                  }}
                >
                  {mode === 'focus'
                    ? 'Focus'
                    : mode === 'short'
                      ? 'Short break'
                      : 'Long break'}
                </button>
              ))}
            </div>
            <div className="focus-clock">
              <svg
                className="absolute inset-0 -rotate-90"
                viewBox="0 0 200 200"
                aria-hidden="true"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="94"
                  fill="none"
                  stroke={ringBg}
                  strokeWidth="3"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="94"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 94}
                  strokeDashoffset={
                    2 * Math.PI * 94 * (1 - Math.min(1, Math.max(0, progress)))
                  }
                />
              </svg>
              <span className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
                {countdown
                  ? 'Next session'
                  : sessionType === 'focus'
                    ? 'Time to focus'
                    : 'Take a breath'}
              </span>
              <span
                role="timer"
                aria-label="Time remaining"
                className="focus-digits"
              >
                {formatTime(
                  countdown ? (pendingTransition?.time ?? totalTime) : timeLeft
                )}
              </span>
              <span className="mt-3 text-xs text-muted">
                {countdown
                  ? `Starting ${nextSessionLabel} in ${countdown}…`
                  : sessionLabel}
              </span>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: longBreakInterval }, (_, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${index < displaySessionNum - 1 ? 'bg-teal' : 'bg-raised'}`}
                />
              ))}
            </div>
            <div className="mb-7 mt-7 flex justify-center gap-3">
              <button
                className="btn-primary min-w-[150px]"
                disabled={countdown > 0}
                onClick={() => {
                  toggleTimer()
                }}
              >
                {isRunning ? (
                  <IconPlayerPause className="h-5 w-5" />
                ) : (
                  <IconPlayerPlay className="h-5 w-5" />
                )}
                {countdown
                  ? 'Starting…'
                  : isRunning
                    ? 'Pause'
                    : timeLeft < totalTime
                      ? 'Resume'
                      : sessionType === 'focus'
                        ? 'Start focus'
                        : 'Start break'}
              </button>
              <button
                className="tool-button"
                aria-label="Reset current timer"
                onClick={() =>
                  isRunning ? setShowResetConfirm(true) : resetTimer()
                }
              >
                <IconRefresh className="h-5 w-5" />
              </button>
            </div>
            <div className="focus-current-task">
              <span className="text-[10px] uppercase tracking-widest text-muted">
                WORKING ON
              </span>
              <p className="mt-2 break-words text-base font-medium">
                {currentTask || 'A little uninterrupted time'}
              </p>
              <button
                className="mt-3 text-xs text-teal"
                onClick={() => {
                  inputRef.current?.focus()
                  inputRef.current?.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth',
                  })
                }}
              >
                Choose or add a task ↓
              </button>
            </div>
            <p className="mt-5 text-center text-xs text-muted">
              Space to start or pause · Pause before changing settings
            </p>
            <div className="mt-3 text-center text-xs text-muted">
              {notificationState === 'default' ? (
                <button
                  className="tool-button"
                  onClick={() => {
                    void Notification.requestPermission().then((value) =>
                      setNotificationState(value)
                    )
                  }}
                >
                  Enable session notifications
                </button>
              ) : notificationState === 'granted' ? (
                'Session notifications are enabled.'
              ) : notificationState === 'denied' ? (
                'Notifications are blocked in your browser. The timer still works.'
              ) : (
                'Session alerts use the timer sound.'
              )}
            </div>
          </section>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="metric-card">
                <span>Focus today</span>
                <strong>
                  {Math.floor(totalFocusToday / 60)}
                  <small> min</small>
                </strong>
              </div>
              <div className="metric-card">
                <span>Sessions finished</span>
                <strong>{completedSessions.length}</strong>
              </div>
            </div>
            <section className="tool-panel p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">Your focus queue</h2>
                <span className="text-xs text-muted">{tasks.length} tasks</span>
              </div>
              <form
                className="mb-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  addTask()
                }}
              >
                <input
                  ref={inputRef}
                  aria-label="New focus task"
                  placeholder="One thing to work on…"
                  maxLength={200}
                  className="workspace-input min-w-0 flex-1"
                />
                <button
                  type="submit"
                  aria-label="Add focus task"
                  className="btn-primary !px-3"
                >
                  +
                </button>
              </form>
              {tasks.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-5 text-center text-sm leading-relaxed text-muted">
                  Add a task, or just start the timer.
                  <br />
                  You do not need a perfect plan.
                </p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className={`focus-queue-item ${task === currentTask ? 'active' : ''}`}
                    >
                      <button
                        aria-pressed={task === currentTask}
                        className="flex min-w-0 flex-1 items-center gap-3 py-3 text-left"
                        onClick={() => selectTask(task)}
                      >
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${task === currentTask ? 'bg-teal' : 'bg-border'}`}
                        />
                        <span className="break-words text-sm">{task}</span>
                      </button>
                      <button
                        className="workspace-icon-button"
                        aria-label={`Remove ${task} from queue`}
                        onClick={() => {
                          removeTask(index)
                          if (task === currentTask) {
                            setCurrentTask('')
                            saveJSON(STORAGE_KEY + 'currentTask', '')
                          }
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <div className="tool-panel p-5 text-sm leading-relaxed text-muted">
              <p className="mb-2 font-medium text-fg">A sustainable rhythm.</p>
              Finish a session, step away for a break, and return when you are
              ready. Your session log saves in this browser.
            </div>
          </div>
        </div>
        <section className="tool-panel mt-6 p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Today’s focus log</h2>
              <p className="mt-1 text-xs text-muted">
                Completed sessions, one useful block at a time.
              </p>
            </div>
            <button
              className="tool-button"
              disabled={!completedSessions.length}
              onClick={() =>
                downloadFile(
                  `focus-${today}.csv`,
                  [
                    ['Task', 'Seconds', 'Started', 'Finished'],
                    ...completedSessions.map((item) => [
                      item.task,
                      item.duration,
                      new Date(item.startTime).toISOString(),
                      new Date(item.endTime).toISOString(),
                    ]),
                  ]
                    .map((row) => row.map(csvCell).join(','))
                    .join('\n'),
                  'text/csv;charset=utf-8'
                )
              }
            >
              Export CSV
            </button>
          </div>
          {!completedSessions.length ? (
            <EmptyToolState
              title="Your first session starts here."
              description="Completed focus sessions will appear in this log. You can pause whenever you need to."
            />
          ) : (
            <div className="space-y-3">
              {completedSessions.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium">
                      {item.task}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {formatHour(item.startTime)}–{formatHour(item.endTime)}
                    </p>
                  </div>
                  <span className="rounded-full bg-teal-subtle px-3 py-1.5 text-xs text-teal">
                    {Math.round(item.duration / 60)} min · Done
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
        <div className="tool-next-step">
          <span>A good week is made of small sessions.</span>
          <Link href="/tools/weekly-review">See your weekly progress →</Link>
        </div>
        <ConfirmDialog
          open={showResetConfirm}
          title="Reset this session?"
          description="This clears the current countdown. Completed sessions stay in your log."
          confirmLabel="Reset timer"
          onConfirm={resetTimer}
          onClose={() => setShowResetConfirm(false)}
        />
        <SettingsDrawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          title="Focus preferences"
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
    </div>
  )
}
