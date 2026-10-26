import { dateKey, localDate, shiftDate } from './workspace-dates'
export type Habit = {
  id: string
  name: string
  color: string
  createdAt: number
}
export type Checkins = Record<string, string[]>
export function currentStreak(id: string, checks: Checkins, today = dateKey()) {
  let day = (checks[today] || []).includes(id) ? today : shiftDate(today, -1)
  let count = 0
  while ((checks[day] || []).includes(id)) {
    count++
    day = shiftDate(day, -1)
    if (count > 10000) break
  }
  return count
}
export function longestStreak(id: string, checks: Checkins) {
  let longest = 0,
    run = 0,
    previous = ''
  for (const day of Object.keys(checks).sort()) {
    if (!(checks[day] || []).includes(id)) continue
    run = shiftDate(day, -1) === previous ? run + 1 : 1
    previous = day
    longest = Math.max(longest, run)
  }
  return longest
}
export function monthlyCompletion(
  habits: Habit[],
  checks: Checkins,
  today = dateKey()
) {
  const date = localDate(today)
  let possible = 0,
    done = 0
  for (let day = 1; day <= date.getDate(); day++) {
    const key = dateKey(new Date(date.getFullYear(), date.getMonth(), day))
    const eligible = habits.filter(
      (habit) => dateKey(new Date(habit.createdAt)) <= key
    )
    possible += eligible.length
    done += eligible.filter((habit) =>
      (checks[key] || []).includes(habit.id)
    ).length
  }
  return possible ? Math.round((done / possible) * 100) : 0
}
