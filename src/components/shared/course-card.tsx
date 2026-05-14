/**
 * Course Card
 *
 * Displays course information with progress bar and enrollment count.
 */

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface CourseCardProps {
  title: string;
  progress: number;
  enrolledCount: number;
  status: string;
  courseId?: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  archived: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function CourseCard({
  title,
  progress,
  enrolledCount,
  status,
  courseId,
}: CourseCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{progress}% complete</span>
          <span>👥 {enrolledCount} enrolled</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Badge className={STATUS_COLORS[status] || ""}>{status}</Badge>
        {courseId && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/teacher/courses/${courseId}`}>View</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
