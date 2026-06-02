export const TOOLS = [
  {
    slug: "downtime-detector",
    name: "Downtime Detector",
    description: "Check if any site is up right now. Monitor your own domains with real-time uptime graphs.",
    category: ["For Devs"],
    tags: ["Multi-region", "SSL check", "Response time"],
  },
  {
    slug: "daily-planner",
    name: "Daily Focus Planner",
    description: "Drag tasks into 30-min time blocks on a vertical day grid.",
    category: ["Daily use"],
    tags: ["localStorage", "No login", "Cloud sync"],
  },
  {
    slug: "pomodoro",
    name: "Pomodoro + Task Log",
    description: "25-minute focus sessions with automatic breaks.",
    category: ["Daily use"],
    tags: ["Session log", "Daily stats", "Export CSV"],
  },
  {
    slug: "habit-tracker",
    name: "Habit Streak Tracker",
    description: "Visualise consistency with a contribution-style heatmap.",
    category: ["Daily use"],
    tags: ["Heatmap", "Unlimited habits", "Streak alert"],
  },
  {
    slug: "markdown-notes",
    name: "Markdown Notes",
    description: "Distraction-free markdown editor with live preview.",
    category: ["Daily use"],
    tags: ["Syntax highlight", "Auto-save", "Live preview"],
  },
  {
    slug: "rate-calculator",
    name: "Freelancer Rate Calculator",
    description: "Calculate your ideal hourly rate and generate PDF invoices.",
    category: ["For Freelancers"],
    tags: ["Sliders", "Breakdown", "PDF invoice"],
  },
  {
    slug: "weekly-review",
    name: "Weekly Review Dashboard",
    description: "Aggregate your focus time, task completions, and habit scores.",
    category: ["Weekly"],
    tags: ["Cross-tool stats", "Bar chart", "CSV export"],
  },
] as const;

export type Tool = (typeof TOOLS)[number];

export function toolCountWord(): string {
  const words = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve"];
  return words[TOOLS.length] ?? TOOLS.length.toString();
}
