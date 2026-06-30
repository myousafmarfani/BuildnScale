"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
  status: "success" | "alreadySubscribed" | "error"
}

const COPY: Record<SubscribeModalProps["status"], { title: string; body: ReactNode }> = {
  success: {
    title: "Almost there!",
    body: "Check your inbox to confirm your subscription.",
  },
  alreadySubscribed: {
    title: "You're already subscribed",
    body: "Check your inbox for past build logs.",
  },
  error: {
    title: "Something went wrong",
    body: "Please try again or email us directly.",
  },
}

export default function SubscribeModal({ isOpen, onClose, status }: SubscribeModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement as HTMLElement
    closeRef.current?.focus()

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", handler)
      previousFocusRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const { title, body } = COPY[status]

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="relative w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-2xl animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribe-modal-title"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute right-4 top-4 text-tertiary hover:text-fg transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2
          id="subscribe-modal-title"
          className="font-display text-lg font-semibold text-fg mt-1"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          {body}
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-md bg-teal py-2.5 text-sm font-medium text-bg transition-all hover:brightness-110"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
