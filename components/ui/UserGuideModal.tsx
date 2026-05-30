"use client"

import { useEffect, useRef } from "react"
import { IconX, IconBulb, IconKeyboard, IconListCheck, IconStar, IconClock, IconPlayerPlay, IconCheck } from "@tabler/icons-react"

interface Guide {
  title: string
  icon: React.ReactNode
  steps: { label: string; desc: string }[]
  shortcuts?: { keys: string; desc: string }[]
  tips?: string[]
}

const GUIDES: Record<string, Guide> = {
  "daily-planner": {
    title: "Daily Focus Planner Guide",
    icon: <IconClock className="h-5 w-5 text-teal" />,
    steps: [
      { label: "Add tasks", desc: "Type a task in the sidebar input and press Enter. Pick a color for visual organization." },
      { label: "Schedule on grid", desc: "Drag unscheduled tasks from the sidebar into any 30-minute time slot on the grid." },
      { label: "Mark complete", desc: "Click the checkbox on any task to mark it done. Completed tasks show with reduced opacity." },
      { label: "Edit or delete", desc: "Click a scheduled task to edit its title. Use the X button on unscheduled tasks to remove them." },
      { label: "Navigate days", desc: "Use the bottom bar arrows or press T to jump back to today. Previous days are read-only." },
    ],
    shortcuts: [
      { keys: "N", desc: "Focus the add-task input" },
      { keys: "T", desc: "Scroll to today" },
      { keys: "⌘K", desc: "Focus the add-task input" },
    ],
    tips: [
      "Color-code tasks by category (e.g., blue for deep work, amber for admin)",
      "Plan no more than 6 hours of scheduled tasks per day",
      "Leave buffer slots between meetings for context switching",
    ],
  },
  pomodoro: {
    title: "Pomodoro + Task Log Guide",
    icon: <IconPlayerPlay className="h-5 w-5 text-teal" />,
    steps: [
      { label: "Set a task", desc: "Type a task in the Queue sidebar and select it as your active focus task." },
      { label: "Start the timer", desc: "Press Space or click Start to begin a 25-minute focus session." },
      { label: "Work until the bell", desc: "Stay focused until the timer ends. A beep and notification will alert you." },
      { label: "Take a break", desc: "After each session, a short break (5 min) starts. Every 4th session triggers a long break (15 min)." },
      { label: "Review your log", desc: "Completed sessions appear in Today's log with duration, time range, and task name." },
    ],
    shortcuts: [
      { keys: "Space", desc: "Start / Pause timer" },
      { keys: "R", desc: "Reset timer" },
    ],
    tips: [
      "Use the Queue to batch tasks before starting — select one as you begin each session",
      "Enable browser notifications to get alerts while working in another tab",
      "The countdown shows which session you're on (1-4) before a long break",
    ],
  },
  "habit-tracker": {
    title: "Habit Streak Tracker Guide",
    icon: <IconCheck className="h-5 w-5 text-teal" />,
    steps: [
      { label: "Add a habit", desc: "Click '+ Add habit' and name it. Free plan allows up to 5 habits." },
      { label: "Check in daily", desc: "Tap the circle next to each habit to mark it done for today." },
      { label: "Track your streak", desc: "Each consecutive day with a check-in builds your streak. Fire emoji means you're on a roll!" },
      { label: "View your year", desc: "The heatmap shows your consistency over the last 52 weeks. Darker cells = more habits completed." },
      { label: "Manage habits", desc: "Use the kebab menu (⋯) to rename, reorder, or delete habits." },
    ],
    shortcuts: [
      { keys: "Esc", desc: "Cancel editing or close menus" },
    ],
    tips: [
      "Start with 2-3 habits to avoid overwhelming yourself",
      "Use the week view to spot which days you tend to miss",
      "Consistency beats intensity — a 1-day streak maintained is better than a 7-day streak once",
    ],
  },
  "markdown-notes": {
    title: "Markdown Notes Guide",
    icon: <IconListCheck className="h-5 w-5 text-teal" />,
    steps: [
      { label: "Create a note", desc: "Click '+ New Note' or press ⌘N. Your note appears in the sidebar list." },
      { label: "Write in Markdown", desc: "Type in the editor using Markdown syntax. Headings, lists, code blocks all supported." },
      { label: "Preview live", desc: "The right panel renders your Markdown as formatted HTML in real time." },
      { label: "Auto-save", desc: "Notes save automatically as you type. Look for the 'Last saved' timestamp." },
      { label: "Search", desc: "Use the search bar to find notes by title or content. Clears with the X button." },
    ],
    shortcuts: [
      { keys: "⌘N", desc: "Create a new note" },
      { keys: "⌘E", desc: "Toggle editor / preview on mobile" },
      { keys: "⌘S", desc: "Force save the current note" },
    ],
    tips: [
      "Use # for headings, * for italic, ** for bold, and ``` for code blocks",
      "The search filters notes in real time — great for quickly finding meeting notes",
      "Hit ⌘S before switching notes to ensure your changes are saved",
    ],
  },
  "rate-calculator": {
    title: "Freelancer Rate Calculator Guide",
    icon: <IconStar className="h-5 w-5 text-teal" />,
    steps: [
      { label: "Set your numbers", desc: "Enter your monthly income goal, expenses, billable hours per week, and weeks per year." },
      { label: "Choose profit margin", desc: "Select a desired profit margin (0-30%) to build buffer into your rate." },
      { label: "See your rates", desc: "The right panel instantly shows your hourly, daily, weekly, monthly, and yearly rates." },
      { label: "Generate an invoice", desc: "Fill in client name, project description, and hours billed, then click 'Generate PDF Invoice'." },
      { label: "Print or save", desc: "The invoice opens in a new tab with a print dialog — save as PDF from there." },
    ],
    shortcuts: [],
    tips: [
      "Aim for 30 billable hours/week if you're starting out — the rest goes to admin and sales",
      "Include taxes in your monthly expenses for a realistic rate",
      "Use the 20% margin as a starting point until you have a steady pipeline",
    ],
  },
  "weekly-review": {
    title: "Weekly Review Dashboard Guide",
    icon: <IconBulb className="h-5 w-5 text-teal" />,
    steps: [
      { label: "View your stats", desc: "See total focus time, tasks completed, habit completion %, and active days at a glance." },
      { label: "Explore the chart", desc: "The bar chart shows focus time by day. Your best day is highlighted in teal." },
      { label: "Check habits", desc: "The habit grid shows which habits you completed each day of the week." },
      { label: "Write reflections", desc: "Answer the three weekly reflection questions. It auto-saves as you type." },
      { label: "Navigate weeks", desc: "Use the arrows in the top bar to move between weeks. Current week is always accessible." },
    ],
    shortcuts: [],
    tips: [
      "Write your reflection on Friday afternoon to close the week intentionally",
      "Compare 'focus time' with 'tasks completed' to gauge your efficiency",
      "Use the habit grid to identify patterns — e.g., do you always skip habits on Wednesdays?",
    ],
  },
}

interface UserGuideModalProps {
  open: boolean
  onClose: () => void
  toolId: string
}

export function UserGuideModal({ open, onClose, toolId }: UserGuideModalProps) {
  const guide = GUIDES[toolId]
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    modalRef.current?.focus()
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open || !guide) return null

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-tertiary hover:text-fg transition-colors"
        >
          <IconX className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          {guide.icon}
          <h2 className="font-display text-lg font-semibold text-fg">{guide.title}</h2>
        </div>

        {/* Steps */}
        <section className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-teal">
            <IconListCheck className="h-4 w-4" /> How to use
          </h3>
          <ol className="space-y-3">
            {guide.steps.map((step, i) => (
              <li key={i} className="rounded-lg border border-border bg-raised p-3">
                <span className="mb-1 block text-sm font-medium text-fg">
                  {i + 1}. {step.label}
                </span>
                <span className="text-xs text-muted leading-relaxed">{step.desc}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Keyboard Shortcuts */}
        {guide.shortcuts && guide.shortcuts.length > 0 && (
          <section className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-teal">
              <IconKeyboard className="h-4 w-4" /> Keyboard shortcuts
            </h3>
            <div className="space-y-2">
              {guide.shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border border-border bg-raised px-3 py-2">
                  <span className="text-xs text-muted">{s.desc}</span>
                  <kbd className="rounded-md border border-border bg-bg px-2 py-1 font-mono text-[11px] text-fg">
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tips */}
        {guide.tips && guide.tips.length > 0 && (
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-teal">
              <IconBulb className="h-4 w-4" /> Tips
            </h3>
            <ul className="space-y-2">
              {guide.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 rounded-md border border-border bg-raised px-3 py-2">
                  <span className="mt-0.5 shrink-0 text-teal">✦</span>
                  <span className="text-xs text-muted leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-teal py-2.5 text-sm font-medium text-bg transition-all hover:brightness-110"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
