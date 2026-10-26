'use client'
import { useState } from 'react'
import Link from 'next/link'
import { IconPlus, IconCheck, IconTrash, IconFlame } from '@tabler/icons-react'
import {
  ToolPageIntro,
  EmptyToolState,
} from '@/components/workspace/ToolPageIntro'
import { useBrowserData } from '@/hooks/useBrowserData'
import { useLocalSetting } from '@/hooks/useLocalSetting'
import { useSync } from '@/hooks/useSync'
import { dateKey, localDate, shiftDate, weekStart } from '@/lib/workspace-dates'
import {
  currentStreak,
  longestStreak,
  monthlyCompletion,
  type Habit,
  type Checkins,
} from '@/lib/habit-stats'
const colors = [
  'var(--color-teal)',
  'var(--color-info)',
  'var(--color-amber)',
  'var(--habit-color-purple)',
]
export default function HabitTrackerPage() {
  const [habits, setHabits, habitError, ready] = useBrowserData<Habit[]>(
    'bns_habits_habits',
    []
  )
  const [checks, setChecks, checkError, checksReady] = useBrowserData<Checkins>(
    'bns_habits_checkins',
    {}
  )
  const [range, setRange] = useLocalSetting('bns_habits_heatmapWeeks', '13')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const today = dateKey()
  const monday = weekStart(today)
  const week = Array.from({ length: 7 }, (_, i) => shiftDate(monday, i))
  const count = habits.filter((habit) =>
    (checks[today] || []).includes(habit.id)
  ).length
  const best = Math.max(
    0,
    ...habits.map((habit) => longestStreak(habit.id, checks))
  )
  const weeks = Math.max(1, Math.min(52, Number(range) || 13))
  const days = Array.from({ length: weeks * 7 }, (_, i) =>
    shiftDate(monday, -(weeks - 1) * 7 + i)
  )
  useSync([
    'bns_habits_habits',
    'bns_habits_checkins',
    'bns_habits_heatmapWeeks',
  ])
  function add(value = name) {
    if (!value.trim() || !ready) return
    if (
      habits.some(
        (habit) => habit.name.toLowerCase() === value.trim().toLowerCase()
      )
    ) {
      setMessage('You already have that habit.')
      return
    }
    setHabits([
      ...habits,
      {
        id: crypto.randomUUID(),
        name: value.trim(),
        color: colors[habits.length % colors.length],
        createdAt: Date.now(),
      },
    ])
    setName('')
    setMessage('Habit added. Start with one check-in.')
  }
  function toggle(habit: Habit, date = today) {
    if (
      !checksReady ||
      date > today ||
      date < dateKey(new Date(habit.createdAt))
    )
      return
    const previous = checks[date] || []
    const checked = previous.includes(habit.id)
    setChecks({
      ...checks,
      [date]: checked
        ? previous.filter((id) => id !== habit.id)
        : [...previous, habit.id],
    })
    setMessage(
      `${habit.name}: ${checked ? 'check-in removed' : 'done'}${date === today ? ' today' : ` on ${date}`}.`
    )
  }
  function remove(habit: Habit) {
    if (!confirm(`Delete “${habit.name}” and its check-in history?`)) return
    setHabits(habits.filter((item) => item.id !== habit.id))
    setChecks(
      Object.fromEntries(
        Object.entries(checks).map(([day, ids]) => [
          day,
          ids.filter((id) => id !== habit.id),
        ])
      )
    )
    setMessage('Habit deleted.')
  }
  return (
    <div className="tool-page-scroll">
      <div className="tool-page-container">
        <ToolPageIntro
          eyebrow="SHOW UP / A LITTLE EVERY DAY"
          title="Consistency, without the pressure."
          description="Choose a few habits that matter. Check in, notice your progress, and keep going."
        />
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="metric-card">
            <span>Today’s check-ins</span>
            <strong>
              {count}
              <small> / {habits.length}</small>
            </strong>
          </div>
          <div className="metric-card">
            <span>Best streak ever</span>
            <strong>
              {best}
              <small> days</small>
            </strong>
          </div>
          <div className="metric-card">
            <span>This month</span>
            <strong>
              {monthlyCompletion(habits, checks)}
              <small>% done</small>
            </strong>
          </div>
        </div>
        <div className="habit-layout">
          <section className="tool-panel p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Your daily check-in</h2>
                <p className="mt-1 text-xs text-muted">
                  {localDate(today).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-subtle text-teal">
                <IconCheck className="h-5 w-5" />
              </span>
            </div>
            <form
              className="mb-5 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                add()
              }}
            >
              <input
                className="workspace-input min-w-0 flex-1"
                aria-label="New habit"
                placeholder="A small habit you can repeat…"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="btn-primary !px-3"
                aria-label="Add habit"
                type="submit"
                disabled={!name.trim() || !ready}
              >
                <IconPlus className="h-5 w-5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </form>
            {!habits.length ? (
              <EmptyToolState
                title="Start smaller than you think."
                description="One repeatable habit is plenty. Add your own or try one below."
              >
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    'Read for 20 minutes',
                    'Move for 15 minutes',
                    'Ship one small thing',
                  ].map((item) => (
                    <button
                      key={item}
                      className="tool-button"
                      disabled={!ready}
                      onClick={() => add(item)}
                    >
                      {item} +
                    </button>
                  ))}
                </div>
              </EmptyToolState>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => {
                  const done = (checks[today] || []).includes(habit.id)
                  return (
                    <article
                      key={habit.id}
                      className={`habit-row ${done ? 'checked' : ''}`}
                    >
                      <button
                        className="habit-check"
                        aria-label={`Check in ${habit.name}`}
                        aria-pressed={done}
                        onClick={() => toggle(habit)}
                        disabled={!checksReady}
                      >
                        {done ? (
                          <IconCheck className="h-6 w-6" />
                        ) : (
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ background: habit.color }}
                          />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <input
                          className="task-title-input"
                          aria-label={`Rename habit ${habit.name}`}
                          value={habit.name}
                          maxLength={100}
                          onChange={(e) =>
                            setHabits(
                              habits.map((item) =>
                                item.id === habit.id
                                  ? { ...item, name: e.target.value }
                                  : item
                              )
                            )
                          }
                        />
                        <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                          <IconFlame className="h-3.5 w-3.5 text-amber" />
                          {currentStreak(habit.id, checks)} day streak
                          {done ? ' · Done today' : ''}
                        </p>
                      </div>
                      <button
                        aria-label={`Delete habit ${habit.name}`}
                        onClick={() => remove(habit)}
                        className="workspace-icon-button hover:text-danger"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </article>
                  )
                })}
              </div>
            )}
            {(message || habitError || checkError) && (
              <p role="status" className="mt-4 text-sm text-muted">
                {habitError || checkError || message}
              </p>
            )}
          </section>
          <section className="tool-panel p-4 sm:p-6">
            <h2 className="text-lg font-semibold">This week, at a glance.</h2>
            <p className="mb-5 mt-2 text-xs leading-relaxed text-muted">
              Missed a check-in? Tap a past day to update it. Future days are
              disabled.
            </p>
            {!habits.length ? (
              <p className="py-8 text-center text-sm text-muted">
                Add a habit to see your week here.
              </p>
            ) : (
              <div
                className="habit-week-scroll"
                tabIndex={0}
                aria-label="Weekly habit check-ins, scroll horizontally on small screens"
              >
                <table className="habit-week-table">
                  <thead>
                    <tr>
                      <th className="text-left">Habit</th>
                      {week.map((day) => (
                        <th key={day}>
                          <span>
                            {localDate(day).toLocaleDateString(undefined, {
                              weekday: 'narrow',
                            })}
                          </span>
                          <small>{localDate(day).getDate()}</small>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map((habit) => (
                      <tr key={habit.id}>
                        <th
                          className="max-w-[120px] truncate text-left"
                          title={habit.name}
                        >
                          {habit.name}
                        </th>
                        {week.map((day) => (
                          <td key={day}>
                            <button
                              aria-label={`${habit.name}, ${day}`}
                              aria-pressed={(checks[day] || []).includes(
                                habit.id
                              )}
                              disabled={
                                day > today ||
                                day < dateKey(new Date(habit.createdAt)) ||
                                !checksReady
                              }
                              onClick={() => toggle(habit, day)}
                            >
                              {(checks[day] || []).includes(habit.id) ? (
                                <IconCheck className="h-4 w-4" />
                              ) : (
                                <span className="h-1 w-1 rounded-full bg-border" />
                              )}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
        <section className="tool-panel mt-6 p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Your consistency, over time.</h2>
              <p className="mt-1 text-xs text-muted">
                Every square is a day. Brighter means more of your habits
                completed.
              </p>
            </div>
            <label className="tool-field-inline">
              Range
              <select value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="13">13 weeks</option>
                <option value="26">26 weeks</option>
                <option value="52">52 weeks</option>
              </select>
            </label>
          </div>
          <div
            className="overflow-x-auto pb-2"
            tabIndex={0}
            aria-label="Habit completion heatmap, scroll horizontally for more days"
          >
            <div
              className="habit-heatmap"
              style={{ gridTemplateColumns: `repeat(${weeks},14px)` }}
            >
              {days.map((day) => {
                const eligible = habits.filter(
                  (habit) => dateKey(new Date(habit.createdAt)) <= day
                )
                const ratio = eligible.length
                  ? eligible.filter((habit) =>
                      (checks[day] || []).includes(habit.id)
                    ).length / eligible.length
                  : 0
                return (
                  <span
                    key={day}
                    title={`${day}: ${Math.round(ratio * 100)}% complete`}
                    style={{
                      background:
                        day > today
                          ? 'transparent'
                          : `var(--cell-level-${ratio === 0 ? 0 : Math.ceil(ratio * 4)})`,
                      opacity: day > today ? 0.25 : 1,
                    }}
                  />
                )
              })}
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-muted">
            <span>
              {days[0]} – {today}
            </span>
            <span>Less ▫ ▪ More</span>
          </div>
        </section>
        <div className="tool-next-step">
          <span>Missed a day? The next check-in still counts.</span>
          <Link href="/tools/weekly-review">Reflect on your week →</Link>
        </div>
      </div>
    </div>
  )
}
