"use client"

import { useEffect, useRef } from "react"
import { IconX } from "@tabler/icons-react"

interface Setting {
  key: string
  label: string
  type: "number" | "select" | "text"
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

export function SettingsDrawer({ open, onClose, title, settings, onChange, onReset }: SettingsDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    function handleClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKey)
    document.addEventListener("mousedown", handleClickOutside)

    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )
    focusable?.[0]?.focus()

    return () => {
      document.removeEventListener("keydown", handleKey)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[300]" style={{ animation: "fade-in 0.15s ease-out" }}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-border bg-bg shadow-xl"
        style={{ animation: "slide-in-right 0.2s ease-out" }}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <span className="font-display text-sm font-semibold text-fg">{title}</span>
          <button onClick={onClose} className="text-muted hover:text-fg bg-transparent border-none cursor-pointer">
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5" style={{ height: "calc(100% - 56px)" }}>
          <div className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.key}>
                <label className="mb-1.5 block text-xs text-muted">{setting.label}</label>
                {setting.type === "select" ? (
                  <select
                    value={setting.value}
                    onChange={(e) => onChange(setting.key, e.target.value)}
                    className="w-full h-9 rounded-md border border-border bg-raised px-3 text-sm text-fg outline-none focus:border-teal transition-colors"
                  >
                    {setting.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={setting.value}
                      onChange={(e) => onChange(setting.key, Number(e.target.value))}
                      min={setting.min}
                      max={setting.max}
                      step={setting.step ?? 1}
                      className="w-full h-9 rounded-md border border-border bg-raised px-3 text-sm text-fg outline-none focus:border-teal transition-colors"
                    />
                    {setting.suffix && (
                      <span className="text-xs text-tertiary shrink-0">{setting.suffix}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="mt-8 w-full h-9 rounded-md border border-danger/40 text-xs text-danger hover:bg-danger/5 transition-colors bg-transparent cursor-pointer"
            >
              Reset to defaults
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
