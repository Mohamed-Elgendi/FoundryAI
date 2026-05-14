/**
 * Course Overview
 *
 * Course stats, student info, and navigation cards.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Web Development Bootcamp</h1>
        <p className="mt-1 text-muted-foreground">
          A comprehensive course covering HTML, CSS, JavaScript, React, and more.
        </p>
        <Badge className="mt-2">Active</Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Students Enrolled</CardDescription>
            <CardTitle className="text-4xl">120</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Progress</CardDescription>
            <CardTitle className="text-4xl">65%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={65} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Assignments</CardDescription>
            <CardTitle className="text-4xl">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">6 graded, 2 pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Course Management</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Curriculum", description: "Manage lessons and content", href: "/teacher/courses/1/curriculum" },
            { title: "Assignments", description: "Create and manage assignments", href: "/teacher/courses/1/assignments" },
            { title: "Progress", description: "View student progress reports", href: "#" },
            { title: "Leaderboard", description: "Top performing students", href: "#" },
          ].map((item) => (
            <Card key={item.title} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href={item.href}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
