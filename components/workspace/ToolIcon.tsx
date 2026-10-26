import {
  IconCalendarEvent,
  IconPlayerPlay,
  IconMarkdown,
  IconBraces,
  IconActivity,
  IconCalculator,
  IconFlame,
  IconChartBar,
  IconApps,
} from '@tabler/icons-react'
const icons = {
  'daily-planner': IconCalendarEvent,
  pomodoro: IconPlayerPlay,
  'markdown-notes': IconMarkdown,
  'json-toolkit': IconBraces,
  'downtime-detector': IconActivity,
  'rate-calculator': IconCalculator,
  'habit-tracker': IconFlame,
  'weekly-review': IconChartBar,
}
export function ToolIcon({
  slug,
  className = 'h-5 w-5',
}: {
  slug: string
  className?: string
}) {
  const Icon = icons[slug as keyof typeof icons] ?? IconApps
  return <Icon className={className} stroke={1.6} />
}
