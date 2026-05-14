/**
 * Student Course Content
 *
 * View lessons, track progress, navigate course.
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Mock data
const COURSE = {
  title: "Web Development Bootcamp",
  progress: 65,
};

const LESSONS = [
  { id: "1", title: "Introduction to HTML", duration: "30m", completed: true },
  { id: "2", title: "CSS Fundamentals", duration: "45m", completed: true },
  { id: "3", title: "Build a Landing Page", duration: "60m", completed: true },
  { id: "4", title: "JavaScript Basics", duration: "40m", completed: true },
  { id: "5", title: "Mid-Course Quiz", duration: "20m", completed: false },
  { id: "6", title: "React Introduction", duration: "50m", completed: false },
  { id: "7", title: "React Hooks", duration: "45m", completed: false },
  { id: "8", title: "Final Project", duration: "90m", completed: false },
];

export default function StudentCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const currentLesson = LESSONS.find((l) => !l.completed) || LESSONS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{COURSE.title}</h1>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-sm">
            <span>Course Progress</span>
            <span className="font-medium">{COURSE.progress}%</span>
          </div>
          <Progress value={COURSE.progress} className="h-3" />
        </div>
      </div>

      {/* Lesson List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Lessons</h2>
        <div className="space-y-2">
          {LESSONS.map((lesson) => (
            <Card
              key={lesson.id}
              className={`transition-colors ${
                currentLesson.id === lesson.id
                  ? "border-primary ring-1 ring-primary/20"
                  : "hover:border-muted-foreground/30"
              }`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      lesson.completed
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : currentLesson.id === lesson.id
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {lesson.completed ? "✓" : lesson.id}
                  </span>
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {lesson.completed && <Badge variant="secondary">Completed</Badge>}
                  {currentLesson.id === lesson.id && <Badge>Current</Badge>}
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href="#">{lesson.completed ? "Review" : "Start"}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline">← Previous Lesson</Button>
        <Button asChild>
          <Link href="#">Next Lesson →</Link>
        </Button>
      </div>
    </div>
  );
}
