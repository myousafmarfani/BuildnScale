import { cn } from "@/lib/utils"

interface KbdHintProps {
  keys: string[]
  label?: string
  className?: string
}

export function KbdHint({ keys, label, className }: KbdHintProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-tertiary font-body", className)}>
      {keys.map((key, i) => (
        <kbd
          key={i}
          className="font-mono rounded-kbd border border-border-strong bg-raised px-[5px] py-[1px] text-[11px] text-muted tracking-[0.06em]"
        >
          {key}
        </kbd>
      ))}
      {label && <span className="ml-1">{label}</span>}
    </span>
  )
}
