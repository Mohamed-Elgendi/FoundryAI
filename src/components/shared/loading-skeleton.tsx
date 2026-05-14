/**
 * Loading Skeletons
 *
 * Skeleton placeholders for cards, lists, and tables.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";

/** Skeleton for a card */
export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted/50" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted/50" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted/50" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted/50" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** Skeleton for a list */
export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-12 items-center gap-4 rounded-lg border px-4"
        >
          <div className="h-4 flex-1 animate-pulse rounded bg-muted/50" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted/50" />
          <div className="h-4 w-12 animate-pulse rounded bg-muted/50" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton for a table */
export function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border">
      {/* Header */}
      <div className="flex h-10 items-center gap-4 border-b bg-muted/30 px-4">
        <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted/50" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted/50" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex h-12 items-center gap-4 border-b last:border-b-0 px-4">
          <div className="h-4 flex-1 animate-pulse rounded bg-muted/50" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted/50" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted/50" />
        </div>
      ))}
    </div>
  );
}
