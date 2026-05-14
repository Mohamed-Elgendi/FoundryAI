/**
 * Student Layout
 *
 * Sidebar + Header layout for all student pages.
 */

"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="student" />
      <div className="ml-64 flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
