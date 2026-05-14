import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showLabel, size = "md", variant = "default", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizes = {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-4",
    };

    const variants = {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500",
    };

    return (
      <div className="w-full" role="presentation" ref={ref}>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-full bg-secondary",
              sizes[size],
              className,
            )}
            {...props}
          >
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out",
                variants[variant],
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {showLabel && (
            <span className="text-xs font-medium text-muted-foreground min-w-[3rem] text-right">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    );
  },
);
Progress.displayName = "Progress";

export { Progress };
