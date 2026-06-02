'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  IconActivity,
} from '@tabler/icons-react'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: IconLayoutDashboard },
  { id: 'downtime-detector', label: 'Downtime Detector', icon: IconActivity, href: '/tools/downtime-detector' },
  { id: 'weekly-review', label: 'Weekly Review', icon: IconCalendarEvent, href: '/tools/weekly-review' },
  { id: 'habits', label: 'Habits Tracker', icon: IconFlame, href: '/tools/habit-tracker' },
  { id: 'planner-history', label: 'Planner History', icon: IconHistory, href: '/tools/daily-planner' },
  { id: 'pomodoro-log', label: 'Pomodoro Log', icon: IconPlayerPlay, href: '/tools/pomodoro' },
  { id: 'notes-archive', label: 'Notes Archive', icon: IconMarkdown, href: '/tools/markdown-notes' },
  { id: 'invoice-history', label: 'Invoice History', icon: IconFileInvoice, href: '/tools/rate-calculator' },
]

const settingsItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: IconSettings, href: '/dashboard/settings' },
  { id: 'export-data', label: 'Export Data', icon: IconFileExport },
]

const mobileTabs: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: IconLayoutDashboard },
  { id: 'tools', label: 'Tools', icon: IconTools, href: '/tools' },
  { id: 'habits', label: 'Habits', icon: IconFlame, href: '/tools/habit-tracker' },
  { id: 'settings', label: 'Settings', icon: IconUser, href: '/dashboard/settings' },
]

function toISO(d: Date) {
  return d.toISOString().split('T')[0]
}

const CELL_LEVELS = ['var(--cell-level-0)', 'var(--cell-level-1)', 'var(--cell-level-2)', 'var(--cell-level-3)', 'var(--cell-level-4)']
const HEATMAP_CELL_SIZE = 11
const HEATMAP_GAP = 3
const HEATMAP_COLUMN = HEATMAP_CELL_SIZE + HEATMAP_GAP

function exportAllData() {
  const data: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('bns_')) {
      data[key] = localStorage.getItem(key) || ''
    }
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const date = toISO(new Date())
  a.download = `buildnscale-export-${date}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function DashboardPage() {
  useSync(["bns_streak", "bns_habits_habits", "bns_habits_checkins"])

  const { data: session } = useSession()
  const router = useRouter()

  const [activeNav, setActiveNav] = useState('overview')

  const initials = useMemo(() => {
    if (session?.user?.name) {
      return session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return session?.user?.email?.[0].toUpperCase() || '?'
  }, [session])

  const displayName = useMemo(() => {
    if (session?.user?.name) return session.user.name
    if (session?.user?.email) return session.user.email.split('@')[0]
    return 'user'
  }, [session])

  const [stats, setStats] = useState({ streak: 0, habitScore: 0, tasksDone: 0, focusMinutes: 0 })
  const [checkins, setCheckins] = useState<Record<string, string[]>>({})

  useEffect(() => {
    try {
      const streak = parseInt(localStorage.getItem('bns_streak') || '0', 10)
      const habitsData = JSON.parse(localStorage.getItem('bns_habits_habits') || '[]')
      const checkinsData = JSON.parse(localStorage.getItem('bns_habits_checkins') || '{}')
      const today = toISO(new Date())

      setCheckins(checkinsData)

      const todayCheckins = checkinsData[today] || []
      const habitScore = habitsData.length > 0 ? Math.round((todayCheckins.length / habitsData.length) * 100) : 0

      const tasksToday = JSON.parse(localStorage.getItem(`bns_tasks_${today}`) || '[]')
      const tasksDone = tasksToday.filter((t: { done: boolean }) => t.done).length

      let focusMinutes = 0
      const sessions = JSON.parse(localStorage.getItem(`bns_pomo_sessions_${today}`) || '[]')
      focusMinutes = sessions.length * 25

      setStats({ streak, habitScore, tasksDone, focusMinutes })
    } catch {}
  }, [])

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const availableYears = useMemo(() => {
    const years = new Set<number>()
    for (const d of Object.keys(checkins)) {
      years.add(new Date(d).getFullYear())
    }
    years.add(new Date().getFullYear())
    return Array.from(years).sort((a, b) => b - a)
  }, [checkins])

  const allCheckinCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const [d, arr] of Object.entries(checkins)) {
      counts[d] = arr.length
    }
    return counts
  }, [checkins])

  const heatmapData = useMemo(() => {
    const year = selectedYear
    const today = new Date()

    const jan1 = new Date(year, 0, 1)
    const dec31 = new Date(year, 11, 31)
    const startDay = jan1.getDay()
    const startMonday = new Date(jan1)
    startMonday.setDate(jan1.getDate() - (startDay === 0 ? 6 : startDay - 1))
    const endDay = dec31.getDay()
    const endSunday = new Date(dec31)
    endSunday.setDate(dec31.getDate() + (endDay === 0 ? 0 : 6 - endDay))

    const weeks: { date: Date; level: number; count: number; isFuture: boolean }[][] = []
    const cursor = new Date(startMonday)
    while (cursor <= endSunday) {
      const week: { date: Date; level: number; count: number; isFuture: boolean }[] = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(cursor)
        date.setDate(cursor.getDate() + d)
        const ds = toISO(date)
        const count = allCheckinCounts[ds] || 0
        const isInYear = date >= jan1 && date <= dec31
        const isFuture = isInYear && year === today.getFullYear() && date > today
        let level: number
        if (!isInYear) level = -1
        else if (isFuture) level = 0
        else if (count <= 0) level = 0
        else if (count <= 1) level = 1
        else if (count <= 2) level = 2
        else if (count <= 3) level = 3
        else level = 4
        week.push({ date, level, count, isFuture })
      }
      weeks.push(week)
      cursor.setDate(cursor.getDate() + 7)
    }
    return weeks
  }, [selectedYear, allCheckinCounts])

  const heatmapWidth = heatmapData.length * HEATMAP_COLUMN

  const monthLabels = useMemo(() => {
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const labels: { name: string; col: number }[] = []
    let lastMonth = -1
    heatmapData.forEach((week, colIdx) => {
      const mid = week[3]
      const m = mid.date.getMonth()
      if (m !== lastMonth) {
        labels.push({ name: names[m], col: colIdx })
        lastMonth = m
      }
    })
    return labels
  }, [heatmapData])

  const yearContributions = useMemo(() => {
    let total = 0
    const prefix = `${selectedYear}-`
    for (const [d, arr] of Object.entries(checkins)) {
      if (d.startsWith(prefix)) {
        total += arr.length
      }
    }
    return total
  }, [selectedYear, checkins])

  function handleMobileTabClick(item: NavItem) {
    if (item.href) {
      router.push(item.href)
    } else {
      setActiveNav(item.id)
    }
  }

  return (
    <div className="min-h-screen flex">
      <style>{`footer { display: none }`}</style>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-[220px] shrink-0 bg-surface border-r border-border h-screen sticky top-0 p-6">
        <Link href="/dashboard/settings" className="flex items-center gap-3 mb-10 pb-6 border-b border-border group">
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-bg text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-fg truncate group-hover:text-teal transition-colors">{displayName}</div>
          </div>
        </Link>

        <nav className="flex-1">
          <div className="mb-6">
            {navItems.map(item => {
              const Icon = item.icon
              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition-all text-muted hover:text-fg hover:bg-raised no-underline"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              }
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
              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition-all text-muted hover:text-fg hover:bg-raised no-underline"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              }
              return (
                <button
                  key={item.id}
                  onClick={exportAllData}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-1 transition-all text-muted hover:text-fg hover:bg-raised"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2 text-sm text-tertiary hover:text-muted transition-colors mt-auto border-t border-border pt-4 w-full bg-transparent border-none cursor-pointer"
        >
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
              aria-selected={tab.id === 'overview' && activeNav === 'overview'}
              onClick={() => handleMobileTabClick(tab)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 text-2xs transition-colors text-tertiary hover:text-muted bg-transparent border-none cursor-pointer pt-1"
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
        <div className="mb-12 bg-surface border border-border rounded-lg p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-sm font-semibold text-fg">{yearContributions.toLocaleString()} contributions in {selectedYear}</h2>
            </div>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="appearance-none bg-raised border border-border rounded-md px-3 py-1.5 text-xs text-muted font-mono cursor-pointer hover:border-strong transition-colors pr-7"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-tertiary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="inline-flex flex-col">
              {/* Month labels */}
              <div className="relative mb-[2px] ml-[30px] h-[14px]" style={{ width: `${heatmapWidth}px` }}>
                {monthLabels.map((m, i) => (
                  <span
                    key={i}
                    className="absolute top-0 font-mono text-[10px] leading-none text-tertiary whitespace-nowrap"
                    style={{ left: `${m.col * HEATMAP_COLUMN}px` }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>
              <div className="flex">
                <div className="flex flex-col gap-[2px] pr-[6px]">
                  <div className="h-[11px]" />
                  <div className="flex h-[11px] items-center font-mono text-[10px] text-tertiary leading-none">Mon</div>
                  <div className="h-[11px]" />
                  <div className="flex h-[11px] items-center font-mono text-[10px] text-tertiary leading-none">Wed</div>
                  <div className="h-[11px]" />
                  <div className="flex h-[11px] items-center font-mono text-[10px] text-tertiary leading-none">Fri</div>
                  <div className="h-[11px]" />
                </div>
                <div className="flex" style={{ gap: '2px', width: `${heatmapWidth}px` }}>
                  {heatmapData.map((week, wi) => (
                    <div key={wi} className="flex flex-col" style={{ gap: '2px' }}>
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className="rounded-[2px]"
                          style={{
                            height: `${HEATMAP_CELL_SIZE}px`,
                            width: `${HEATMAP_CELL_SIZE}px`,
                            background: day.level < 0 ? 'transparent' : CELL_LEVELS[day.level],
                            border: day.level < 0 ? 'none' : '1px solid var(--color-border)',
                            opacity: day.isFuture ? 0.42 : 1,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 ml-[30px]">
                <span className="text-2xs text-tertiary">Less</span>
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} className="h-[10px] w-[10px] rounded-[2px]" style={{ background: CELL_LEVELS[l], border: '1px solid var(--color-border)' }} />
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
              <Link href="/tools/pomodoro" className="text-xs text-teal no-underline">View all →</Link>
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
                  <tr key={i} className="border-b border-border">
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
