/**
 * Guide Card
 *
 * Displays guide information with badges and enrollment count.
 */

'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface GuideCardProps {
  title: string;
  subject: string;
  difficulty: string;
  estimatedDuration: string;
  enrolledCount: number;
  onEnroll?: () => void;
  guideId?: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  advanced: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  expert: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function GuideCard({
  title,
  subject,
  difficulty,
  estimatedDuration,
  enrolledCount,
  onEnroll,
  guideId,
}: GuideCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="secondary">{subject}</Badge>
          <Badge className={DIFFICULTY_COLORS[difficulty] || ""}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>⏱ {estimatedDuration}</span>
          <span>👥 {enrolledCount} enrolled</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {guideId && (
          <Button variant="outline" size="sm" asChild>
            <Link href={onEnroll ? `/student/guides/${guideId}` : `/teacher/guides/${guideId}`}>
              View
            </Link>
          </Button>
        )}
        {onEnroll && (
          <Button size="sm" onClick={onEnroll}>
            Enroll
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
