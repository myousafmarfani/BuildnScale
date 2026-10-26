'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  IconPlus,
  IconCheck,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconArrowRight,
  IconCalendarEvent,
} from '@tabler/icons-react'
import {
  ToolPageIntro,
  EmptyToolState,
} from '@/components/workspace/ToolPageIntro'
import { SettingsDrawer } from '@/components/ui/SettingsDrawer'
import { UserGuideModal } from '@/components/ui/UserGuideModal'
import { useBrowserData } from '@/hooks/useBrowserData'
import { useLocalSetting } from '@/hooks/useLocalSetting'
import { useSync } from '@/hooks/useSync'
import {
  dateKey,
  localDate,
  shiftDate,
  slotLabel,
  overlaps,
} from '@/lib/workspace-dates'
import { downloadFile, csvCell } from '@/lib/download'
interface Task {
  id: string
  title: string
  color: string
  startSlot?: number
  duration?: number
  completed: boolean
}
export default function DailyPlannerPage() {
  const [date, setDate] = useState(dateKey())
  const [tasks, setTasks, storageError, ready] = useBrowserData<Task[]>(
    `bns_tasks_${date}`,
    []
  )
  const [startHour, setStartHour] = useLocalSetting('bns_planner_startHour', 8)
  const [format, setFormat] = useLocalSetting('bns_planner_timeFormat', '24h')
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(2)
  const [view, setView] = useLocalSetting<'agenda' | 'timeline'>(
    'bns_planner_view',
    'agenda'
  )
  const [settings, setSettings] = useState(false)
  const [guide, setGuide] = useState(false)
  const [message, setMessage] = useState('')
  const [removed, setRemoved] = useState<{ task: Task; date: string } | null>(
    null
  )
  const inputRef = useRef<HTMLInputElement>(null)
  useSync([
    `bns_tasks_${date}`,
    'bns_planner_startHour',
    'bns_planner_timeFormat',
  ])
  useEffect(() => {
    setMessage('')
  }, [date])
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === 'n' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !(event.target as HTMLElement)?.closest(
          'input,textarea,select,button,[contenteditable]'
        )
      ) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
  const completed = tasks.filter((task) => task.completed).length
  const plannedMinutes = tasks
    .filter((task) => task.startSlot != null)
    .reduce((sum, task) => sum + (task.duration || 2) * 30, 0)
  const sorted = [...tasks].sort(
    (a, b) =>
      Number(a.completed) - Number(b.completed) ||
      (a.startSlot ?? 99) - (b.startSlot ?? 99)
  )
  function add(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim() || !ready) return
    const slot = time === '' ? undefined : Number(time)
    if (slot != null && overlaps(tasks, '', slot, duration)) {
      setMessage(
        'That time overlaps another task. Choose a free slot or add it to the inbox.'
      )
      return
    }
    if (slot != null && slot + duration > 48) {
      setMessage(
        'This task extends past midnight. Choose an earlier time or shorter duration.'
      )
      return
    }
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        color: 'var(--color-teal)',
        startSlot: slot,
        duration,
        completed: false,
      },
    ])
    setTitle('')
    setMessage('Task added.')
    inputRef.current?.focus()
  }
  function schedule(id: string, value: string) {
    const task = tasks.find((item) => item.id === id)
    const slot = value === '' ? undefined : Number(value)
    const length = task?.duration || 2
    if (
      slot != null &&
      (slot + length > 48 || overlaps(tasks, id, slot, length))
    ) {
      setMessage('Choose a free time that finishes before midnight.')
      return
    }
    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, startSlot: slot } : item
      )
    )
    setMessage('Schedule updated.')
  }
  function carryForward() {
    try {
      const yesterday: Task[] = JSON.parse(
        localStorage.getItem(`bns_tasks_${shiftDate(date, -1)}`) || '[]'
      )
      const unfinished = yesterday.filter(
        (task) =>
          !task.completed &&
          !tasks.some((existing) => existing.title === task.title)
      )
      setTasks([
        ...tasks,
        ...unfinished.map((task) => ({
          ...task,
          id: crypto.randomUUID(),
          startSlot: undefined,
          completed: false,
        })),
      ])
      setMessage(
        unfinished.length
          ? `${unfinished.length} unfinished tasks brought into your inbox.`
          : 'No new unfinished tasks from the previous day.'
      )
    } catch {
      setMessage('Could not read the previous day’s tasks.')
    }
  }
  function exportDay() {
    downloadFile(
      `plan-${date}.csv`,
      [
        ['Task', 'Start', 'Minutes', 'Completed'],
        ...tasks.map((task) => [
          task.title,
          task.startSlot == null ? '' : slotLabel(task.startSlot),
          (task.duration || 2) * 30,
          task.completed,
        ]),
      ]
        .map((row) => row.map(csvCell).join(','))
        .join('\n'),
      'text/csv;charset=utf-8'
    )
  }
  const timeOptions = Array.from({ length: 48 }, (_, index) => (
    <option key={index} value={index}>
      {slotLabel(index)}
    </option>
  ))
  return (
    <div className="tool-page-scroll">
      <div className="tool-page-container">
        <ToolPageIntro
          eyebrow="PLAN / DO / FINISH"
          title="Give your day a little direction."
          description="Capture what matters, then make room for it. Your plan saves as you go."
          onGuide={() => setGuide(true)}
          onSettings={() => setSettings(true)}
        >
          <button
            className="tool-button"
            onClick={exportDay}
            disabled={!tasks.length}
          >
            <IconDownload className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </ToolPageIntro>
        <div className="tool-panel mb-5 flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="workspace-icon-button"
              aria-label="Previous day"
              onClick={() => setDate(shiftDate(date, -1))}
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <label className="flex items-center gap-2">
              <IconCalendarEvent className="h-4 w-4 text-teal" />
              <input
                type="date"
                aria-label="Planning date"
                className="rounded-md bg-transparent text-sm font-medium"
                value={date}
                onChange={(e) => e.target.value && setDate(e.target.value)}
              />
            </label>
            <button
              className="workspace-icon-button"
              aria-label="Next day"
              onClick={() => setDate(shiftDate(date, 1))}
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
            <button className="tool-button" onClick={() => setDate(dateKey())}>
              Today
            </button>
          </div>
          <div className="segmented-control" aria-label="Planner view">
            {(['agenda', 'timeline'] as const).map((item) => (
              <button
                key={item}
                aria-pressed={view === item}
                onClick={() => setView(item)}
              >
                {item === 'agenda' ? 'Task list' : 'Timeline'}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="metric-card">
            <span>Completed</span>
            <strong>
              {completed}
              <small> / {tasks.length}</small>
            </strong>
          </div>
          <div className="metric-card">
            <span>Time planned</span>
            <strong>
              {Math.floor(plannedMinutes / 60)}
              <small>h {plannedMinutes % 60}m</small>
            </strong>
          </div>
          <div className="metric-card">
            <span>Unscheduled</span>
            <strong>
              {
                tasks.filter(
                  (task) => task.startSlot == null && !task.completed
                ).length
              }
              <small> tasks</small>
            </strong>
          </div>
        </div>
        <form onSubmit={add} className="tool-panel mb-5 p-4 sm:p-5">
          <label
            htmlFor="new-task"
            className="mb-3 block text-sm font-semibold"
          >
            What would you like to get done?
          </label>
          <div className="flex flex-wrap gap-3">
            <input
              ref={inputRef}
              id="new-task"
              className="workspace-input min-w-[160px] flex-1"
              placeholder="e.g. Ship the checkout fix"
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={!title.trim() || !ready}
              className="btn-primary"
            >
              <IconPlus className="h-4 w-4" />
              Add task
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="tool-field-inline">
              When
              <select
                aria-label="New task start time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Inbox · decide later</option>
                {timeOptions}
              </select>
            </label>
            <label className="tool-field-inline">
              Duration
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 6, 8].map((length) => (
                  <option key={length} value={length}>
                    {length * 30} min
                  </option>
                ))}
              </select>
            </label>
            <span className="hidden text-xs text-muted sm:block">
              N to capture a task
            </span>
          </div>
        </form>
        {(message || storageError) && (
          <p
            role="status"
            className={`mb-4 rounded-lg border border-border p-3 text-sm ${storageError ? 'text-danger' : 'text-muted'}`}
          >
            {storageError || message}
            {removed?.date === date && (
              <button
                className="ml-3 text-teal underline"
                onClick={() => {
                  const task = removed.task
                  const restored =
                    task.startSlot != null &&
                    overlaps(tasks, task.id, task.startSlot, task.duration || 2)
                      ? { ...task, startSlot: undefined }
                      : task
                  setTasks([...tasks, restored])
                  setRemoved(null)
                  setMessage('Task restored.')
                }}
              >
                Undo delete
              </button>
            )}
          </p>
        )}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {localDate(date).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </h2>
          <button
            className="text-sm text-teal hover:underline"
            onClick={carryForward}
            disabled={!ready}
          >
            Bring unfinished tasks from yesterday
          </button>
        </div>
        {view === 'agenda' ? (
          <div className="space-y-3">
            {!tasks.length && (
              <EmptyToolState
                title="A fresh day. Start with one thing."
                description="Add your first task above. Leave it in the inbox or give it a time—both are a good start."
              />
            )}
            {sorted.map((task) => (
              <article
                className={`planner-task ${task.completed ? 'is-complete' : ''}`}
                key={task.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
              >
                <button
                  aria-label={`Mark ${task.title} ${task.completed ? 'incomplete' : 'complete'}`}
                  aria-pressed={task.completed}
                  className="task-check"
                  onClick={() =>
                    setTasks(
                      tasks.map((item) =>
                        item.id === task.id
                          ? { ...item, completed: !item.completed }
                          : item
                      )
                    )
                  }
                >
                  {task.completed && <IconCheck className="h-4 w-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <input
                    aria-label={`Task title: ${task.title}`}
                    className="task-title-input"
                    value={task.title}
                    maxLength={200}
                    onChange={(e) =>
                      setTasks(
                        tasks.map((item) =>
                          item.id === task.id
                            ? { ...item, title: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <div className="mt-2 flex flex-wrap gap-3">
                    <select
                      aria-label={`Schedule ${task.title}`}
                      className="task-time-select"
                      value={task.startSlot ?? ''}
                      onChange={(e) => schedule(task.id, e.target.value)}
                    >
                      <option value="">Inbox · no time yet</option>
                      {timeOptions}
                    </select>
                    <select
                      aria-label={`Duration for ${task.title}`}
                      className="task-time-select"
                      value={task.duration || 2}
                      onChange={(e) => {
                        const length = Number(e.target.value)
                        if (
                          task.startSlot != null &&
                          (task.startSlot + length > 48 ||
                            overlaps(tasks, task.id, task.startSlot, length))
                        ) {
                          setMessage(
                            'That duration overlaps another task or extends past midnight.'
                          )
                          return
                        }
                        setTasks(
                          tasks.map((item) =>
                            item.id === task.id
                              ? { ...item, duration: length }
                              : item
                          )
                        )
                      }}
                    >
                      {[1, 2, 3, 4, 6, 8].map((length) => (
                        <option key={length} value={length}>
                          {length * 30} min
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  aria-label={`Delete ${task.title}`}
                  className="workspace-icon-button hover:text-danger"
                  onClick={() => {
                    setRemoved({ task, date })
                    setTasks(tasks.filter((item) => item.id !== task.id))
                    setMessage('Task removed.')
                  }}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="tool-panel overflow-hidden">
            <p className="border-b border-border p-4 text-xs text-muted">
              Tap an empty time to prepare a task. Drag tasks from the list to
              reschedule.
            </p>
            {Array.from(
              { length: (24 - startHour) * 2 },
              (_, index) => index + startHour * 2
            ).map((slot) => (
              <div
                key={slot}
                className="timeline-row"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  schedule(e.dataTransfer.getData('taskId'), String(slot))
                }}
              >
                <button
                  className="timeline-time"
                  onClick={() => {
                    setTime(String(slot))
                    inputRef.current?.focus()
                    inputRef.current?.scrollIntoView({
                      block: 'center',
                      behavior: 'smooth',
                    })
                  }}
                  aria-label={`Add task at ${slotLabel(slot)}`}
                >
                  {format === '12h'
                    ? `${Math.floor(slot / 2) % 12 || 12}:${slot % 2 ? '30' : '00'} ${slot < 24 ? 'am' : 'pm'}`
                    : slotLabel(slot)}
                </button>
                <div className="flex flex-1 flex-col gap-2 py-2">
                  {tasks
                    .filter((task) => task.startSlot === slot)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="timeline-task"
                        draggable
                        onDragStart={(e) =>
                          e.dataTransfer.setData('taskId', task.id)
                        }
                      >
                        <button
                          className="flex flex-1 items-center gap-2 text-left"
                          onClick={() =>
                            setTasks(
                              tasks.map((item) =>
                                item.id === task.id
                                  ? { ...item, completed: !item.completed }
                                  : item
                              )
                            )
                          }
                        >
                          <span className="task-check shrink-0">
                            {task.completed && (
                              <IconCheck className="h-4 w-4" />
                            )}
                          </span>
                          <span
                            className={task.completed ? 'line-through' : ''}
                          >
                            {task.title}
                          </span>
                        </button>
                        <span className="text-xs text-muted">
                          {(task.duration || 2) * 30}m
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="tool-next-step">
          <span>
            {tasks.length && completed === tasks.length
              ? 'Your plan is complete. Take a moment to enjoy it.'
              : 'Ready to work on one thing?'}
          </span>
          <Link href="/tools/pomodoro">
            Start a focus session
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <SettingsDrawer
          open={settings}
          onClose={() => setSettings(false)}
          title="Planner preferences"
          settings={[
            {
              key: 'startHour',
              label: 'Timeline starts at (24-hour)',
              type: 'number',
              value: startHour,
              min: 0,
              max: 12,
            },
            {
              key: 'timeFormat',
              label: 'Time format',
              type: 'select',
              value: format,
              options: [
                { label: '24-hour', value: '24h' },
                { label: '12-hour', value: '12h' },
              ],
            },
          ]}
          onChange={(key, value) =>
            key === 'startHour'
              ? setStartHour(Number(value))
              : setFormat(String(value))
          }
        />
        <UserGuideModal
          open={guide}
          onClose={() => setGuide(false)}
          toolId="daily-planner"
        />
      </div>
    </div>
  )
}
