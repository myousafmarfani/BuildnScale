import Link from "next/link"

const TOOL_NAMES: Record<string, string> = {
  "daily-planner": "Daily Focus Planner",
  "pomodoro": "Pomodoro + Task Log",
  "habit-tracker": "Habit Streak Tracker",
  "markdown-notes": "Markdown Notes",
  "rate-calculator": "Freelancer Rate Calculator",
  "weekly-review": "Weekly Review",
}

interface ToolBreadcrumbsProps {
  slug: string
}

export function ToolBreadcrumbs({ slug }: ToolBreadcrumbsProps) {
  const toolName = TOOL_NAMES[slug]

  return (
    <>
      <Link
        href="/tools"
        className="hidden sm:inline text-sm text-muted hover:text-fg transition-colors shrink-0"
      >
        Tools
      </Link>
      <span className="hidden sm:inline text-xs text-tertiary mx-1">/</span>
      <span className="text-sm font-medium truncate">{toolName}</span>
    </>
  )
}
