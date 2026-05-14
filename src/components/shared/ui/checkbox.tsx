import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onCheckedChange, id, ...props }, ref) => {
    const generatedId = id || React.useId();
    return (
      <div className="flex items-center gap-2">
        <input
          id={generatedId}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-border text-primary focus:ring-ring",
            "cursor-pointer accent-purple-600",
            className,
          )}
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        {label && (
          <label htmlFor={generatedId} className="text-sm text-foreground cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
