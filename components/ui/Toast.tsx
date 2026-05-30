"use client"

import { useEffect, useState } from "react"
import { IconX, IconCircleCheck, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react"

interface ToastProps {
  message: string
  variant?: "success" | "error" | "info"
  visible: boolean
  duration?: number
  onDismiss?: () => void
}

const icons = {
  success: IconCircleCheck,
  error: IconAlertCircle,
  info: IconInfoCircle,
}

const variantColors = {
  success: "text-teal",
  error: "text-danger",
  info: "text-info",
}

export function Toast({
  message,
  variant = "success",
  visible,
  duration = 4000,
  onDismiss,
}: ToastProps) {
  const [show, setShow] = useState(visible)

  useEffect(() => {
    if (visible) {
      setShow(true)
      const t = setTimeout(() => setShow(false), duration)
      return () => clearTimeout(t)
    }
  }, [visible, duration])

  useEffect(() => {
    if (!show && onDismiss) onDismiss()
  }, [show, onDismiss])

  if (!show) return null

  const Icon = icons[variant]

  return (
    <div
      className="fixed bottom-6 right-6 z-[500] flex items-center gap-3 rounded-md border border-border-strong bg-raised px-4 py-3 text-sm text-fg shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
      style={{ animation: "slide-up 0.35s ease-out" }}
    >
      <Icon className={`h-4 w-4 shrink-0 ${variantColors[variant]}`} />
      <span className="flex-1">{message}</span>
      <button
        onClick={() => setShow(false)}
        className="shrink-0 text-muted transition-colors hover:text-fg"
        aria-label="Dismiss"
      >
        <IconX className="h-4 w-4" />
      </button>
    </div>
  )
}
