'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconArrowRight,
} from '@tabler/icons-react'
import { ToolPageIntro } from '@/components/workspace/ToolPageIntro'
import { useBrowserData } from '@/hooks/useBrowserData'
import { useLocalSetting } from '@/hooks/useLocalSetting'
import { useSync } from '@/hooks/useSync'
import { dateKey, localDate, shiftDate, weekStart } from '@/lib/workspace-dates'
import { downloadFile, csvCell } from '@/lib/download'
import type { Habit, Checkins } from '@/lib/habit-stats'
type Reflection = { wentWell: string; gotInWay: string; protect: string }
type Day = {
  date: string
  minutes: number
  tasks: number
  checkins: number
  possible: number
}
function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback
  } catch {
    return fallback
  }
}
export default function WeeklyReviewPage() {
  const [firstDay, setFirstDay] = useLocalSetting(
    'bns_review_firstDay',
    'monday'
  )
  const [selected, setSelected] = useState(weekStart(dateKey()))
  const [reflections, setReflections, error, ready] = useBrowserData<
    Record<string, Reflection>
  >('bns_review_reflections', {})
  const [days, setDays] = useState<Day[]>([])
  const [message, setMessage] = useState('')
  const current = weekStart(dateKey(), firstDay === 'sunday')
  const reflection = reflections[selected] ?? {
    wentWell: '',
    gotInWay: '',
    protect: '',
  }
  useSync(['bns_review_reflections', 'bns_review_firstDay'])
  useEffect(
    () => setSelected(weekStart(dateKey(), firstDay === 'sunday')),
    [firstDay]
  )
  useEffect(() => {
    function refresh() {
      const habits = read<Habit[]>('bns_habits_habits', [])
      const checks = read<Checkins>('bns_habits_checkins', {})
      setDays(
        Array.from({ length: 7 }, (_, i) => {
          const date = shiftDate(selected, i)
          const sessions = read<{ completed: boolean; duration: number }[]>(
            `bns_pomo_sessions_${date}`,
            []
          )
          const tasks = read<{ completed: boolean }[]>(`bns_tasks_${date}`, [])
          const eligible =
            date > dateKey()
              ? []
              : habits.filter(
                  (habit) => dateKey(new Date(habit.createdAt)) <= date
                )
          return {
            date,
            minutes: sessions
              .filter((item) => item.completed)
              .reduce((sum, item) => sum + (item.duration || 0) / 60, 0),
            tasks: tasks.filter((item) => item.completed).length,
            checkins: eligible.filter((habit) =>
              (checks[date] || []).includes(habit.id)
            ).length,
            possible: eligible.length,
          }
        })
      )
    }
    refresh()
    window.addEventListener('focus', refresh)
    window.addEventListener('bns:sync', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('bns:sync', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [selected])
  const minutes = days.reduce((sum, item) => sum + item.minutes, 0)
  const tasks = days.reduce((sum, item) => sum + item.tasks, 0)
  const possible = days.reduce((sum, item) => sum + item.possible, 0)
  const checks = days.reduce((sum, item) => sum + item.checkins, 0)
  const max = Math.max(30, ...days.map((item) => item.minutes))
  const active = days.filter(
    (item) => item.minutes || item.tasks || item.checkins
  ).length
  const filled = Object.values(reflection).filter((value) =>
    value.trim()
  ).length
  function update(key: keyof Reflection, value: string) {
    setReflections({
      ...reflections,
      [selected]: { ...reflection, [key]: value },
    })
    setMessage('Reflection saved in this browser.')
  }
  function exportWeek() {
    downloadFile(
      `review-${selected}.csv`,
      [
        ['Date', 'Focus minutes', 'Tasks completed', 'Habit check-ins'],
        ...days.map((day) => [
          day.date,
          Math.round(day.minutes),
          day.tasks,
          day.checkins,
        ]),
        [],
        ['What went well', reflection.wentWell],
        ['What got in the way', reflection.gotInWay],
        ['Protect next week', reflection.protect],
      ]
        .map((row) => row.map(csvCell).join(','))
        .join('\n'),
      'text/csv;charset=utf-8'
    )
  }
  return (
    <div className="tool-page-scroll">
      <div className="tool-page-container">
        <ToolPageIntro
          eyebrow="PAUSE / NOTICE / ADJUST"
          title="A clearer view of your week."
          description="Look at what happened. Keep what worked. Make a little room for what comes next."
        >
          <button className="tool-button" onClick={exportWeek}>
            <IconDownload className="h-4 w-4" />
            Export week
          </button>
        </ToolPageIntro>
        <div className="tool-panel mb-5 flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-2">
            <button
              className="workspace-icon-button"
              aria-label="Previous week"
              onClick={() => setSelected(shiftDate(selected, -7))}
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {localDate(selected).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}{' '}
              –{' '}
              {localDate(shiftDate(selected, 6)).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <button
              className="workspace-icon-button"
              aria-label="Next week"
              disabled={selected >= current}
              onClick={() => setSelected(shiftDate(selected, 7))}
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
            <button
              className="tool-button"
              onClick={() => setSelected(current)}
            >
              This week
            </button>
          </div>
          <label className="tool-field-inline">
            Week starts
            <select
              value={firstDay}
              onChange={(e) => setFirstDay(e.target.value)}
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </label>
        </div>
        <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="metric-card">
            <span>Focused time</span>
            <strong>
              {Math.floor(minutes / 60)}
              <small>h {Math.round(minutes % 60)}m</small>
            </strong>
          </div>
          <div className="metric-card">
            <span>Tasks finished</span>
            <strong>{tasks}</strong>
          </div>
          <div className="metric-card">
            <span>Habits completed</span>
            <strong>
              {possible ? Math.round((checks / possible) * 100) : 0}
              <small>% of due check-ins</small>
            </strong>
          </div>
          <div className="metric-card">
            <span>Days with activity</span>
            <strong>
              {active}
              <small> / 7</small>
            </strong>
          </div>
        </div>
        <div className="review-layout">
          <section className="tool-panel p-5 sm:p-7">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="eyebrow mb-2">01 / NOTICE THE PATTERN</p>
                <h2 className="text-xl font-semibold tracking-tight">
                  Where your focus went.
                </h2>
              </div>
              <span className="text-xs text-muted">
                Completed Pomodoro sessions
              </span>
            </div>
            <div className="review-chart">
              {days.map((day) => (
                <div key={day.date} className="review-chart-column">
                  <span className="text-[11px] text-muted">
                    {Math.round(day.minutes)}m
                  </span>
                  <div className="review-bar-track">
                    <div
                      className="review-bar"
                      style={{ height: `${(day.minutes / max) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs ${day.date === dateKey() ? 'text-teal' : 'text-muted'}`}
                  >
                    {localDate(day.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                    })}
                  </span>
                </div>
              ))}
            </div>
            {!minutes && (
              <p className="mt-5 rounded-lg bg-bg p-4 text-sm leading-relaxed text-muted">
                No completed focus sessions recorded for this week yet. This
                chart uses your real session log.
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-4 text-sm">
              <Link className="text-teal" href="/tools/pomodoro">
                Open focus timer ↗
              </Link>
              <Link className="text-teal" href="/tools/habit-tracker">
                Review habit check-ins ↗
              </Link>
            </div>
          </section>
          <aside className="tool-panel p-5 sm:p-7">
            <p className="eyebrow mb-2">A SMALL CHECKPOINT</p>
            <h2 className="text-xl font-semibold tracking-tight">
              Progress has many shapes.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {active
                ? `You recorded activity on ${active} ${active === 1 ? 'day' : 'days'} this week. Use the reflection below to remember the work that numbers do not capture.`
                : 'Your week is more than a dashboard. Use the reflection below even if you did not track your work here.'}
            </p>
            <div className="mt-6 rounded-xl bg-bg p-4">
              <p className="text-sm font-medium">
                {filled} of 3 reflections written
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised">
                <div
                  className="h-full rounded-full bg-teal"
                  style={{ width: `${(filled / 3) * 100}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted">
                A sentence is enough. You can return anytime.
              </p>
            </div>
          </aside>
        </div>
        <section className="tool-panel mt-6 p-5 sm:p-7">
          <p className="eyebrow mb-2">02 / REFLECT WITHOUT OVERTHINKING</p>
          <h2 className="text-xl font-semibold tracking-tight">
            What would you like to carry forward?
          </h2>
          <div className="mt-7 grid gap-6 lg:grid-cols-3">
            {(
              [
                {
                  key: 'wentWell',
                  label: 'What went well?',
                  hint: 'A win, a small improvement, or something you enjoyed.',
                  placeholder: 'I finally shipped…',
                },
                {
                  key: 'gotInWay',
                  label: 'What got in the way?',
                  hint: 'Notice the friction without judging yourself.',
                  placeholder: 'I lost focus when…',
                },
                {
                  key: 'protect',
                  label: 'What will you protect next week?',
                  hint: 'One realistic change you can make space for.',
                  placeholder: 'I will make room for…',
                },
              ] as const
            ).map((field, index) => (
              <label key={field.key} className="block">
                <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-subtle text-xs text-teal">
                  {index + 1}
                </span>
                <span className="block text-sm font-semibold">
                  {field.label}
                </span>
                <span className="mb-4 mt-2 block text-xs leading-relaxed text-muted">
                  {field.hint}
                </span>
                <textarea
                  disabled={!ready}
                  value={reflection[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="workspace-input min-h-[150px] resize-y leading-6"
                />
              </label>
            ))}
          </div>
          <p role="status" className="mt-5 text-xs text-muted">
            {error || message || 'Your reflections save as you type.'}
          </p>
        </section>
        <div className="tool-next-step">
          <span>03 / Turn one intention into a little space in your day.</span>
          <Link href="/tools/daily-planner">
            Plan your next day
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
