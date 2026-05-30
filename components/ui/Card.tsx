import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  featured?: boolean
  as?: "div" | "a"
  href?: string
}

export function Card({ children, className, featured, as = "div", href }: CardProps) {
  const base =
    "rounded-lg border border-border bg-surface p-5 transition-all duration-180 ease hover:border-border-strong hover:bg-raised hover:-translate-y-0.5"

  const featuredClass = featured ? "border-teal" : ""

  const Tag = as === "a" ? "a" : "div"

  return (
    <Tag
      href={as === "a" ? href : undefined}
      className={cn(base, featuredClass, className)}
    >
      {children}
    </Tag>
  )
}
