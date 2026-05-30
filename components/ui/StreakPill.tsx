import { IconFlame } from "@tabler/icons-react"

interface StreakPillProps {
  count: number
}

export function StreakPill({ count }: StreakPillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-muted bg-amber-subtle px-2.5 py-1 text-[13px] font-body font-medium text-amber">
      <IconFlame className="h-3.5 w-3.5" />
      {count}-day streak
    </span>
  )
}
