export function downloadFile(
  name: string,
  content: string,
  type = 'text/plain;charset=utf-8'
) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function csvCell(value: unknown) {
  const text = String(value ?? '')
  // Prevent spreadsheet formulas when exported text comes from a task or note.
  return (
    '"' +
    (/^[=+@\-\t\r]/.test(text) ? "'" + text : text).replaceAll('"', '""') +
    '"'
  )
}
