/**
 * Student Dashboard
 *
 * Progress stats and continue-learning section.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Courses Enrolled</CardDescription>
            <CardTitle className="text-4xl">4</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lessons Completed</CardDescription>
            <CardTitle className="text-4xl">28</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-4xl">🔥 12 days</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Continue Learning</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Web Development Bootcamp", progress: 65, next: "Lesson 7: React Hooks" },
            { title: "Data Science 101", progress: 42, next: "Lesson 4: Data Visualization" },
            { title: "Python Programming", progress: 80, next: "Lesson 12: OOP Principles" },
          ].map((course) => (
            <Card key={course.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.next}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={course.progress} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{course.progress}% complete</span>
                    <Button size="sm" asChild>
                      <Link href={`/student/courses/1`}>Continue</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
