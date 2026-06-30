"use client"

import { useState } from "react"
import SubscribeModal from "@/components/SubscribeModal"

interface BuildLogCTAProps {
  variant?: "default" | "sidebar"
}

export default function BuildLogCTA({ variant = "default" }: BuildLogCTAProps) {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStatus, setModalStatus] = useState<"success" | "alreadySubscribed" | "error">("success")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.alreadySubscribed) {
        setModalStatus("alreadySubscribed")
      } else if (data.success) {
        setModalStatus("success")
      } else {
        setModalStatus("error")
      }
      setModalOpen(true)
      if (data.success || data.alreadySubscribed) setEmail("")
    } catch {
      setModalStatus("error")
      setModalOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  const inputId = "subscribe-email"

  if (variant === "sidebar") {
    return (
      <>
        <div className="bg-surface border border-border rounded-lg p-5">
          <h3 className="font-display text-sm font-semibold text-fg mb-1">
            Get weekly updates
          </h3>
          <p className="text-xs text-muted leading-relaxed mb-3">
            New tools, engineering lessons, and productivity tactics.
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor={inputId} className="sr-only">Email address</label>
            <input
              id={inputId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dev@company.com"
              className="w-full bg-bg border border-border rounded-md px-3 py-2 text-xs text-fg outline-none mb-2 focus:border-teal transition-colors"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal text-bg text-xs font-semibold py-2 rounded-md hover:bg-teal-hover transition-colors disabled:opacity-50"
            >
              {submitting ? "Subscribing\u2026" : "Subscribe"}
            </button>
          </form>
        </div>
        <SubscribeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} status={modalStatus} />
      </>
    )
  }

  return (
    <>
      <section className="mt-16 mb-20 bg-surface border border-border rounded-lg py-12 px-6 text-center">
        <h2 className="font-display text-2xl font-bold text-fg">
          Get the build log in your inbox
        </h2>
        <p className="mt-3 text-sm text-muted max-w-md mx-auto">
          One email per week. Only technical lessons and new tool releases.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex max-w-sm mx-auto gap-2">
          <label htmlFor={inputId} className="sr-only">Email address</label>
          <input
            id={inputId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dev@company.com"
            className="flex-1 bg-bg border border-border rounded-md px-4 py-2.5 text-sm text-fg outline-none focus:border-teal transition-colors"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-teal text-bg text-sm font-semibold px-5 rounded-md hover:bg-teal-hover transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {submitting ? "Subscribing\u2026" : "Subscribe \u2192"}
          </button>
        </form>
      </section>
      <SubscribeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} status={modalStatus} />
    </>
  )
}
