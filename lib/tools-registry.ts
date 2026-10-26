export const TOOL_CATEGORIES = [
  'All tools',
  'Focus & planning',
  'Writing & notes',
  'Developer tools',
  'Freelancing',
  'Review & habits',
] as const
export type ToolCategory = (typeof TOOL_CATEGORIES)[number]

export const TOOLS = [
  {
    slug: 'daily-planner',
    name: 'Daily Focus Planner',
    description:
      'Turn your task list into a realistic day. Schedule work in 30-minute blocks.',
    category: ['Focus & planning'],
    tags: ['Time blocking', 'Task inbox', 'Day export'],
    shortcut: '01',
    color: 'teal',
  },
  {
    slug: 'pomodoro',
    name: 'Pomodoro + Task Log',
    description:
      'Make room for deep work with a focus timer, breaks, and a session log.',
    category: ['Focus & planning'],
    tags: ['Focus timer', 'Task queue', 'Session export'],
    shortcut: '02',
    color: 'amber',
  },
  {
    slug: 'markdown-notes',
    name: 'Markdown Notes',
    description:
      'Capture a thought, draft a build log, or keep project notes with live preview.',
    category: ['Writing & notes', 'Developer tools'],
    tags: ['Auto-save', 'Live preview', 'Markdown export'],
    shortcut: '03',
    color: 'blue',
  },
  {
    slug: 'json-toolkit',
    name: 'JSON Toolkit',
    description:
      'Format, validate, and minify JSON without sending your input to a server.',
    category: ['Developer tools'],
    tags: ['Format & validate', 'Minify', 'Copy & download'],
    shortcut: '04',
    color: 'purple',
  },
  {
    slug: 'downtime-detector',
    name: 'Downtime Detector',
    description:
      'Check an HTTP response now, or sign in to monitor your own websites.',
    category: ['Developer tools'],
    tags: ['HTTP status', 'Response time', 'Saved monitors'],
    shortcut: '05',
    color: 'teal',
  },
  {
    slug: 'rate-calculator',
    name: 'Freelancer Rate Calculator',
    description:
      'Price your time around your income goals and prepare a printable invoice.',
    category: ['Freelancing'],
    tags: ['Rate breakdown', 'Income goals', 'Print to PDF'],
    shortcut: '06',
    color: 'amber',
  },
  {
    slug: 'habit-tracker',
    name: 'Habit Streak Tracker',
    description:
      'Build a routine one check-in at a time. See your consistency over time.',
    category: ['Review & habits'],
    tags: ['Daily check-ins', 'Streaks', 'Heatmap'],
    shortcut: '07',
    color: 'purple',
  },
  {
    slug: 'weekly-review',
    name: 'Weekly Review Dashboard',
    description:
      'Bring your focus sessions, completed tasks, and habits into one weekly reflection.',
    category: ['Review & habits'],
    tags: ['Cross-tool stats', 'Reflections', 'Weekly export'],
    shortcut: '08',
    color: 'blue',
  },
] as const
export type Tool = (typeof TOOLS)[number]
export function toolCountWord(): string {
  return (
    [
      'Zero',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
    ][TOOLS.length] ?? String(TOOLS.length)
  )
}
export function getTool(slug: string) {
  return TOOLS.find((tool) => tool.slug === slug)
}
