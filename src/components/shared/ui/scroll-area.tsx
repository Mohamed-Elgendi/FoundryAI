import { cn } from "@/lib/utils";

export function ScrollArea({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-auto", className)}
      {...props}
    >
      <div className="overflow-auto">{children}</div>
    </div>
  );
}

export function ScrollBar({
  className,
  orientation = "horizontal",
}: React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "horizontal"
          ? "flex-col h-2 w-full"
          : "flex-row h-full w-2",
        className
      )}
    >
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute rounded-full bg-border" />
      </div>
    </div>
  );
}
