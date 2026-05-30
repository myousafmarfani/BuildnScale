interface TaskItemProps {
  title: string
  color?: string
  onDragStart?: () => void
}

export function TaskItem({
  title,
  color = "oklch(35% 0.1 165)",
  onDragStart,
}: TaskItemProps) {
  return (
    <div
      className="flex cursor-move items-center gap-2.5 rounded-md border border-border bg-raised px-3 py-2.5 text-sm"
      draggable
      onDragStart={onDragStart}
    >
      <div className="text-tertiary">⠿</div>
      <div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span>{title}</span>
    </div>
  )
}
