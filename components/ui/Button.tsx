import { cn } from "@/lib/utils"
import { forwardRef, type ButtonHTMLAttributes } from "react"
import { IconLoader2 } from "@tabler/icons-react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "icon-only"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: "bg-teal text-bg border-transparent hover:bg-teal-hover",
      ghost:
        "bg-transparent text-muted border border-border hover:border-border-strong hover:bg-raised hover:text-fg",
      danger:
        "bg-danger/10 text-danger border-danger/40 hover:bg-danger/20",
      "icon-only":
        "bg-transparent text-muted border border-transparent hover:border-border hover:text-fg",
    }

    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-6 text-base",
    }

    const iconOnlySizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border font-body font-medium transition-all duration-180 ease",
          variant === "icon-only"
            ? iconOnlySizeClasses[size]
            : sizeClasses[size],
          variantClasses[variant],
          (disabled || loading) && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {loading ? <IconLoader2 className="h-4 w-4 animate-spin" /> : children}
      </button>
    )
  }
)
Button.displayName = "Button"
