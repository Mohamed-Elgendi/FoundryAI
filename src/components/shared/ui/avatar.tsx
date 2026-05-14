import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "Avatar", fallback, size = "md", className }, ref) => {
    const [error, setError] = React.useState(false);

    const sizes = {
      xs: "h-6 w-6 text-[10px]",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    };

    if (!src || error) {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
            sizes[size],
            className,
          )}
        >
          {(fallback ?? alt)?.charAt(0)?.toUpperCase()}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("inline-flex overflow-hidden rounded-full", sizes[size], className)}>
        <img
          className="h-full w-full object-cover"
          src={src}
          alt={alt}
          onError={() => setError(true)}
        />
      </div>
    );
  },
);
Avatar.displayName = "Avatar";

export { Avatar };
