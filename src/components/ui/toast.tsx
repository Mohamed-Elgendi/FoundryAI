"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  children: React.ReactNode
  className?: string
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center space-x-2 rounded-lg border bg-popover text-popover-foreground shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Toast.displayName = "Toast"

export { Toast }
