'use client'
import { useEffect, useRef } from 'react'
import { IconX } from '@tabler/icons-react'
interface Setting {
  key: string
  label: string
  type: 'number' | 'select' | 'text'
  value: string | number
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
  suffix?: string
}
interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  settings: Setting[]
  onChange: (key: string, value: string | number) => void
  onReset?: () => void
}
export function SettingsDrawer({
  open,
  onClose,
  title,
  settings,
  onChange,
  onReset,
}: SettingsDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      className="settings-dialog"
      aria-label={title}
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-5">
        <h2 className="text-base font-semibold">{title}</h2>
        <button
          className="workspace-icon-button"
          onClick={onClose}
          aria-label="Close settings"
        >
          <IconX className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-6 p-5">
        {settings.map((setting) => (
          <label key={setting.key} className="block">
            <span className="mb-2 block text-sm font-medium">
              {setting.label}
            </span>
            {setting.type === 'select' ? (
              <select
                className="workspace-input"
                value={setting.value}
                onChange={(event) => onChange(setting.key, event.target.value)}
              >
                {setting.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  className="workspace-input"
                  type={setting.type}
                  value={setting.value}
                  min={setting.min}
                  max={setting.max}
                  step={setting.step ?? 1}
                  onChange={(event) => {
                    if (setting.type === 'text') {
                      onChange(setting.key, event.target.value)
                      return
                    }
                    const number = Number(event.target.value)
                    if (event.target.value !== '' && Number.isFinite(number))
                      onChange(
                        setting.key,
                        Math.min(
                          setting.max ?? Infinity,
                          Math.max(setting.min ?? -Infinity, number)
                        )
                      )
                  }}
                />
                {setting.suffix && (
                  <span className="shrink-0 text-xs text-muted">
                    {setting.suffix}
                  </span>
                )}
              </div>
            )}
          </label>
        ))}
        {onReset && (
          <button className="tool-button w-full" onClick={onReset}>
            Reset preferences to defaults
          </button>
        )}
        <p className="text-xs leading-relaxed text-muted">
          Preferences save in this browser. Press Escape or use the close button
          to return.
        </p>
      </div>
    </dialog>
  )
}
