"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked" | "onChange" | "size"> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md";
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, label, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "w-9 h-5",
      md: "w-11 h-6",
    };

    const thumbSizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
    };

    const translate = {
      sm: "translate-x-4",
      md: "translate-x-5",
    };

    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <div
          className={cn(
            "relative inline-flex items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "duration-200",
            sizes[size],
            checked ? "bg-primary" : "bg-input",
            className
          )}
          onClick={() => onCheckedChange?.(!checked)}
        >
          <span
            className={cn(
              "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-all duration-200",
              thumbSizes[size],
              checked ? translate[size] : "translate-x-0"
            )}
          />
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            {...props}
          />
        </div>
        {label && <span className="text-sm text-foreground">{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
