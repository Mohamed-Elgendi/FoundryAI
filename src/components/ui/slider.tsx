"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange?.(Number(e.target.value))}
      className={cn(
        "flex h-2 w-full cursor-pointer",
        className
      )}
      {...props}
    />
  )
)
Slider.displayName = "Slider"

export { Slider }
