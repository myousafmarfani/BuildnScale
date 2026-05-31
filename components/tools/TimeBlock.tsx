interface TimeBlockProps {
  time: string
  title: string
  color?: string
  completed?: boolean
  height?: string
}

export function TimeBlock({
  time,
  title,
  color = "var(--color-teal-muted)",
  completed,
  height = "56px",
}: TimeBlockProps) {
  return (
    <div className="flex">
      <span className="font-mono w-16 text-right pr-3 text-xs text-tertiary pt-1">
        {time}
      </span>
      <div
        className="flex-1 rounded-sm px-2.5 py-1.5 text-xs font-medium text-fg"
        style={{
          background: color,
          height,
          opacity: completed ? 0.45 : 1,
          textDecoration: completed ? "line-through" : "none",
        }}
      >
        {title}
      </div>
    </div>
  )
}
