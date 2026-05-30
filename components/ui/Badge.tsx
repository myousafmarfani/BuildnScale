import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BadgeProps {
  variant?: "free" | "new" | "tag"
  children: ReactNode
  className?: string
}

export function Badge({ variant = "free", children, className }: BadgeProps) {
  const variants = {
    free: "bg-teal-subtle text-teal border-teal-muted",
    new: "bg-info-subtle text-info border-info-muted",
    tag: "bg-raised text-muted border-border rounded-sm px-1.5 py-0.5",
  }

  const base =
    variant === "tag"
      ? ""
      : "rounded-pill px-2 py-0.5"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border text-[11px] font-body font-medium",
        base,
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
