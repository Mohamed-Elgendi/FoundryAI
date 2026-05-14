"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipContextValue {
  show: boolean;
  setShow: (show: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ show, setShow }}>
      {children}
    </TooltipContext.Provider>
  );
}

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  className?: string;
}

export function Tooltip({ content, children, side = "top", delayDuration = 300, className }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delayDuration);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  const sides = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          className={cn(
            "absolute z-50 left-1/2 -translate-x-1/2 whitespace-nowrap",
            "rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95",
            sides[side],
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export { TooltipProvider as Tooltip };
