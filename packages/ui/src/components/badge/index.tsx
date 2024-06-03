import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/ui"

const badgeVariants = cva(
  "select-none flex items-center rounded-md border px-3 py-1 h-6 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        disabled:
          "border-neutral-500 bg-neutral-600/40 text-neutral-300 shadow hover:bg-neutral-600/80",
        info:
          "border-sky-600 bg-sky-600/20 text-sky-400 hover:bg-sky-600/80",
        warning:
          "border-amber-600 bg-amber-600/20 text-amber-400  hover:bg-amber-600/80",
        success:
          "border-green-600 bg-green-600/20 text-green-400  hover:bg-green-600/80",
        destructive:
          "border-red-600 bg-red-600/20 text-red-400 hover:bg-red-600/80",
      },
    },
    defaultVariants: {
      variant: "disabled",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
