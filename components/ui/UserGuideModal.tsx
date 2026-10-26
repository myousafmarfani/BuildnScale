'use client'
import { useEffect, useRef } from 'react'
import { IconX } from '@tabler/icons-react'
const GUIDES: Record<
  string,
  { title: string; steps: { label: string; desc: string }[] }
> = {
  'daily-planner': {
    title: 'Daily Focus Planner guide',
    steps: [
      {
        label: 'Capture a task',
        desc: 'Write a task in the quick-add form. Choose Inbox to decide on its time later, or pick a start time and duration before adding.',
      },
      {
        label: 'Shape your day',
        desc: 'Use the task’s time and duration selectors to schedule it. Overlapping blocks are rejected. Timeline lets you tap a time or drag a task to reschedule.',
      },
      {
        label: 'Finish and return',
        desc: 'Use the circle to mark a task complete. Task titles can be edited in place. Delete can be undone until you leave this page.',
      },
      {
        label: 'Plan another day',
        desc: 'Use the date picker, arrows, or Today. Bring unfinished tasks from the previous day into the selected date when you want them.',
      },
      {
        label: 'Find your next step',
        desc: 'Export a day as CSV, or use the workspace navigation to open the focus timer, notes, or weekly review. N focuses quick-add; Ctrl/Command + K opens workspace search.',
      },
    ],
  },
  pomodoro: {
    title: 'Pomodoro & focus guide',
    steps: [
      {
        label: 'Choose one thing',
        desc: 'Add a task to your queue. The first task becomes active automatically. You can also start without a task.',
      },
      {
        label: 'Start with a small block',
        desc: 'Use Start focus, or Space when you are not typing in a field. Pause when you need to. Pause before adjusting durations in Settings.',
      },
      {
        label: 'Make room for breaks',
        desc: 'Focus and break sessions transition automatically. Choose Focus, Short break, or Long break while paused to change mode. Session notifications are optional.',
      },
      {
        label: 'Return without starting over',
        desc: 'The current timer is remembered in this browser. When you return or reload, the countdown catches up to elapsed time. Completed sessions appear in the log and can be exported as CSV.',
      },
    ],
  },
  'rate-calculator': {
    title: 'Freelancer rate calculator guide',
    steps: [
      {
        label: 'Enter your monthly goals',
        desc: 'Set an income goal and monthly business expenses in your chosen currency.',
      },
      {
        label: 'Use realistic availability',
        desc: 'Enter hours you can bill per week and working weeks per year. Unpaid admin time and time off reduce the hours available to bill.',
      },
      {
        label: 'Choose a pricing buffer',
        desc: 'The buffer is a markup on the calculated break-even rate. It is not an accounting profit margin. Taxes and payment fees are not included automatically.',
      },
      {
        label: 'Prepare an invoice',
        desc: 'Add a client, project or service, and billed hours. Print / save invoice as PDF opens a printable invoice in a new tab. Allow popups for this site if your browser blocks it.',
      },
    ],
  },
}
export function UserGuideModal({
  open,
  onClose,
  toolId,
}: {
  open: boolean
  onClose: () => void
  toolId: string
}) {
  const guide = GUIDES[toolId]
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  if (!guide) return null
  return (
    <dialog
      ref={ref}
      className="guide-dialog"
      aria-label={guide.title}
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border p-5">
        <h2 className="text-lg font-semibold tracking-tight">{guide.title}</h2>
        <button
          className="workspace-icon-button"
          aria-label="Close guide"
          onClick={onClose}
        >
          <IconX className="h-5 w-5" />
        </button>
      </div>
      <ol className="space-y-4 p-5">
        {guide.steps.map((step, index) => (
          <li key={step.label} className="flex gap-3">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-subtle text-xs text-teal">
              {index + 1}
            </span>
            <div>
              <h3 className="text-sm font-semibold">{step.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="p-5 pt-0">
        <button className="btn-primary w-full" onClick={onClose}>
          Got it, let’s get started
        </button>
      </div>
    </dialog>
  )
}
