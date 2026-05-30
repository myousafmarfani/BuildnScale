'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSync } from "@/hooks/useSync"
import {
  IconLayoutDashboard,
  IconCalendarEvent,
  IconFlame,
  IconHistory,
  IconPlayerPlay,
  IconMarkdown,
  IconFileInvoice,
  IconSettings,
  IconFileExport,
  IconLogout,
  IconTools,
  IconUser,
  IconCircleCheck,
  IconClock,
  IconTarget,
  IconTrendingUp,
} from '@tabler/icons-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: IconLayoutDashboard },
  { id: 'weekly-review', label: 'Weekly Review', icon: IconCalendarEvent },
  { id: 'habits', label: 'Habits', icon: IconFlame },
  { id: 'planner-history', label: 'Planner History', icon: IconHistory },
  { id: 'pomodoro-log', label: 'Pomodoro Log', icon: IconPlayerPlay },
  { id: 'notes-archive', label: 'Notes Archive', icon: IconMarkdown },
  { id: 'invoice-history', label: 'Invoice History', icon: IconFileInvoice },
]

const settingsItems = [
  { id: 'settings', label: 'Settings', icon: IconSettings },
  { id: 'export-data', label: 'Export Data', icon: IconFileExport },
]

const mobileTabs = [
  { id: 'overview', label: 'Overview', icon: IconLayoutDashboard },
  { id: 'tools', label: 'Tools', icon: IconTools },
  { id: 'habits', label: 'Habits', icon: IconFlame },
  { id: 'account', label: 'Account', icon: IconUser },
]

function toISO(d: Date) {
  return d.toISOString().split('T')[0]
}

const CELL_LEVELS = ['', 'oklch(25% 0.08 165)', 'oklch(35% 0.1 165)', 'oklch(45% 0.12 165)', 'oklch(58% 0.16 165)']

export default function DashboardPage() {
  useSync(["bns_streak", "bns_habits_habits", "bns_habits_checkins"])

  const [activeNav, setActiveNav] = useState('overview')
  const [mobileTab, setMobileTab] = useState('overview')

  const stats = useMemo(() => {
    try {
      const streak = parseInt(localStorage.getItem('bns_streak') || '0', 10)
      const habitsData = JSON.parse(localStorage.getItem('bns_habits_habits') || '[]')
      const checkins = JSON.parse(localStorage.getItem('bns_habits_checkins') || '{}')
      const today = toISO(new Date())

      const todayCheckins = checkins[today] || []
      const habitScore = habitsData.length > 0 ? Math.round((todayCheckins.length / habitsData.length) * 100) : 0

      const tasksToday = JSON.parse(localStorage.getItem(`bns_tasks_${today}`) || '[]')
      const tasksDone = tasksToday.filter((t: { done: boolean }) => t.done).length

      let focusMinutes = 0
      const sessions = JSON.parse(localStorage.getItem(`bns_pomo_sessions_${today}`) || '[]')
      focusMinutes = sessions.length * 25

      return { streak, habitScore, tasksDone, focusMinutes }
    } catch {
      return { streak: 14, habitScore: 72, tasksDone: 3, focusMinutes: 125 }
    }
  }, [])

  const heatmapData = useMemo(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff)

    let allCheckins: Record<string, number> = {}
    try {
      const checkins = JSON.parse(localStorage.getItem('bns_habits_checkins') || '{}')
      allCheckins = Object.fromEntries(
        Object.entries(checkins).map(([d, arr]) => [d, (arr as string[]).length])
      )
    } catch {}

    const weeks: { date: Date; level: number }[][] = []
    for (let w = 51; w >= 0; w--) {
      const week: { date: Date; level: number }[] = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(monday)
        date.setDate(monday.getDate() - w * 7 + d)
        const ds = toISO(date)
        const count = allCheckins[ds] || 0
        let level: number
        if (date > today) level = -1
        else if (count <= 0) level = 0
        else if (count <= 1) level = 1
        else if (count <= 2) level = 2
        else if (count <= 3) level = 3
        else level = 4
        week.push({ date, level })
      }
      weeks.push(week)
    }
    return weeks
  }, [])

  const monthLabels = useMemo(() => {
    if (heatmapData.length === 0) return []
    const labels: { name: string; width: number }[] = []
    let currentMonth = -1
    let count = 0
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    heatmapData.forEach((week) => {
      const mid = week[3]
      const m = mid.date.getMonth()
      if (m !== currentMonth) {
        if (currentMonth !== -1) {
          labels[labels.length - 1].width = count
        }
        labels.push({ name: names[m], width: 0 })
        currentMonth = m
        count = 1
      } else {
        count++
      }
    })
    if (labels.length > 0) labels[labels.length - 1].width = count

    return labels.map((l) => ({
      ...l,
      width: 14 * l.width + (l.width - 1) * 3,
    }))
  }, [heatmapData])

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-[220px] shrink-0 bg-surface border-r border-border h-screen sticky top-0 p-6">
        <Link href="/" className="font-display text-sm font-semibold text-fg no-underline mb-10">
          build<span className="text-teal">n</span>scale
        </Link>

          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-border">
            <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-bg text-xs font-semibold shrink-0">
              MJ
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-fg truncate">marc_jenkins</div>
            </div>
          </div>

        <nav className="flex-1">
          <div className="mb-6">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition-all ${
                    activeNav === item.id
                      ? 'bg-raised text-teal border border-border'
                      : 'text-muted hover:text-fg hover:bg-raised'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </div>

          <div>
            {settingsItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition-all ${
                    activeNav === item.id
                      ? 'bg-raised text-teal border border-border'
                      : 'text-muted hover:text-fg hover:bg-raised'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>

        <button className="flex items-center gap-3 px-3 py-2 text-sm text-tertiary hover:text-muted transition-colors mt-auto border-t border-border pt-4">
          <IconLogout className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border flex h-[56px]" role="tablist">
        {mobileTabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={mobileTab === tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-2xs transition-colors ${
                mobileTab === tab.id ? 'text-teal' : 'text-tertiary'
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-16 py-10 md:py-12 pb-20 md:pb-12">
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="font-display text-3xl md:text-[32px] font-bold tracking-tight text-fg">
              Good morning.
            </h1>
            <p className="text-sm text-muted mt-1">Here&apos;s your week so far.</p>
          </div>

        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-surface border border-border rounded-lg p-5">
            <IconClock className="h-4 w-4 text-teal mb-2" />
            <div className="font-display text-[32px] font-semibold text-fg">{stats.focusMinutes}h</div>
            <div className="text-xs text-tertiary mt-1">Focus time today</div>
            <div className="mt-3 h-1 bg-raised rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${Math.min(100, (stats.focusMinutes / 200) * 100)}%` }} />
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-5">
            <IconCircleCheck className="h-4 w-4 text-teal mb-2" />
            <div className="font-display text-[32px] font-semibold text-fg">{stats.tasksDone}</div>
            <div className="text-xs text-tertiary mt-1">Tasks completed</div>
            <div className="mt-3 h-1 bg-raised rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${Math.min(100, (stats.tasksDone / 8) * 100)}%` }} />
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-5">
            <IconTarget className="h-4 w-4 text-teal mb-2" />
            <div className="font-display text-[32px] font-semibold text-fg">{stats.habitScore}%</div>
            <div className="text-xs text-tertiary mt-1">Habit score</div>
            <div className="mt-3 h-1 bg-raised rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${stats.habitScore}%` }} />
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-5">
            <IconTrendingUp className="h-4 w-4 text-amber mb-2" />
            <div className="font-display text-[32px] font-semibold text-fg">{stats.streak}<span className="text-lg text-muted">d</span></div>
            <div className="text-xs text-tertiary mt-1">Day streak</div>
            <div className="mt-3 h-1 bg-raised rounded-full overflow-hidden">
              <div className="h-full bg-amber rounded-full" style={{ width: `${Math.min(100, (stats.streak / 365) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="mb-12 bg-surface border border-border rounded-lg p-6">
          <h2 className="font-display text-sm font-semibold text-fg mb-4">Activity</h2>
          <div className="overflow-x-auto pb-2">
            <div>
              <div className="flex mb-1 ml-[26px]">
                {monthLabels.map((m, i) => (
                  <span key={i} className="font-mono text-[11px] text-tertiary" style={{ width: m.width, minWidth: m.width }}>
                    {m.name}
                  </span>
                ))}
              </div>
              <div className="flex">
                <div className="flex flex-col gap-[3px] pt-0 pr-2">
                  {[0, 2, 4].map(row => (
                    <div key={row} className="flex h-[13px] items-center font-mono text-[11px] text-tertiary">
                      {['M', 'W', 'F'][Math.floor(row / 2)]}
                    </div>
                  ))}
                </div>
                <div className="flex gap-[3px]">
                  {heatmapData.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className="h-[11px] w-[11px] rounded-[2px]"
                          style={{ background: day.level < 0 ? 'transparent' : CELL_LEVELS[day.level] }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 ml-[26px]">
                <span className="text-2xs text-tertiary">Less</span>
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} className="h-[10px] w-[10px] rounded-[2px]" style={{ background: CELL_LEVELS[l] }} />
                ))}
                <span className="text-2xs text-tertiary">More</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-col: Sessions + Streak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-sm font-medium text-fg">Recent Sessions</h2>
              <a href="#" className="text-xs text-teal no-underline">View all →</a>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-2xs font-display text-tertiary uppercase border-b border-border bg-bg">
                  <th className="text-left px-6 py-3 font-normal">Date</th>
                  <th className="text-left px-6 py-3 font-normal">Sessions</th>
                  <th className="text-left px-6 py-3 font-normal">Focus</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: 'May 18', sessions: 4, focus: '1.7h', status: 'active' },
                  { date: 'May 17', sessions: 6, focus: '2.5h', status: 'done' },
                  { date: 'May 16', sessions: 3, focus: '1.3h', status: 'done' },
                  { date: 'May 15', sessions: 5, focus: '2.1h', status: 'done' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[oklch(18%_0.005_250)]">
                    <td className="px-6 py-4 text-sm text-fg">{row.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-pill border ${
                        row.status === 'active'
                          ? 'bg-teal-subtle text-teal border-teal-muted'
                          : 'bg-raised text-muted border-border'
                      }`}>
                        {row.status === 'active' ? 'In Progress' : 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-fg">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-sm font-medium text-fg mb-4">Streak Overview</h2>
            <div className="font-display text-5xl font-bold text-fg mb-1">{stats.streak}</div>
            <div className="text-xs text-tertiary mb-6">consecutive days</div>
            <div className="flex gap-2 mb-4">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (6 - i))
                const ds = toISO(d)
                let filled = false
                try {
                  const checkins = JSON.parse(localStorage.getItem('bns_habits_checkins') || '{}')
                  filled = !!checkins[ds]
                } catch {}
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`h-8 w-full rounded-md ${filled ? 'bg-teal' : 'bg-raised border border-border'}`} />
                    <span className="text-2xs text-tertiary font-mono">
                      {d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2)}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="text-xs text-muted">
              Best streak: <span className="text-fg font-medium">{stats.streak} days</span>
            </div>
          </div>
        </div>


      </main>
    </div>
  )
}
