import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import { Card } from "./Card"
import type { ComponentType } from "react"

interface ToolCardProps {
  icon: ComponentType<{ className?: string }>
  name: string
  description: string
  href: string
  featured?: boolean
}

export function ToolCard({
  icon: Icon,
  name,
  description,
  href,
  featured,
}: ToolCardProps) {
  return (
    <Link href={href}>
      <Card featured={featured} className="relative block">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-raised text-teal">
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <span className="text-[15px] font-body font-medium text-fg">
            {name}
          </span>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-tertiary">
          {description}
        </p>
        <div className="flex items-center gap-1 text-sm text-teal group-hover:underline">
          Try free
          <IconArrowRight className="h-3.5 w-3.5" />
        </div>
      </Card>
    </Link>
  )
}
