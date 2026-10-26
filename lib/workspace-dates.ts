export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function localDate(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}
export function shiftDate(key: string, amount: number) {
  const date = localDate(key)
  date.setDate(date.getDate() + amount)
  return dateKey(date)
}
export function weekStart(key: string, sunday = false) {
  const date = localDate(key)
  return shiftDate(key, -(sunday ? date.getDay() : (date.getDay() + 6) % 7))
}
export function slotLabel(slot: number) {
  return `${String(Math.floor(slot / 2)).padStart(2, '0')}:${slot % 2 ? '30' : '00'}`
}
export function overlaps(
  tasks: { id: string; startSlot?: number; duration?: number }[],
  id: string,
  start: number,
  duration: number
) {
  return tasks.some(
    (task) =>
      task.id !== id &&
      task.startSlot != null &&
      start < task.startSlot + (task.duration || 2) &&
      start + duration > task.startSlot
  )
}
