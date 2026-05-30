import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-xs font-body text-muted">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-md border bg-raised px-3 py-[9px] font-body text-sm text-fg outline-none transition-all placeholder:text-tertiary",
            "focus:border-teal focus:ring-2 focus:ring-teal/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            !error && "border-border",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    )
  }
)
Input.displayName = "Input"
