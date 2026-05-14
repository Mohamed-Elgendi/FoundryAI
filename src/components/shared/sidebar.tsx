/**
 * Sidebar Navigation
 *
 * Collapsible sidebar with role-aware navigation.
 * Supports teacher and student roles with different nav items.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface NavItem {
  label: string;
  href: string;
}

const TEACHER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard" },
  { label: "Guides", href: "/teacher/guides" },
  { label: "Courses", href: "/teacher/courses" },
  { label: "Settings", href: "/teacher/settings" },
];

const STUDENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard" },
  { label: "My Guides", href: "/student/guides" },
  { label: "Assignments", href: "/student/assignments" },
  { label: "Courses", href: "/student/courses" },
  { label: "Analytics", href: "/student/analytics" },
];

export interface SidebarProps {
  role: "teacher" | "student";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = role === "teacher" ? TEACHER_NAV : STUDENT_NAV;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <Link href="/" className="text-xl font-bold text-foreground">
            FoundryAI
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t p-4 text-xs text-muted-foreground">
          FoundryAI v1.0.0
        </div>
      )}
    </aside>
  );
}
