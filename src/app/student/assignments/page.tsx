/**
 * Student Assignments List
 *
 * View all assignments with status and filter.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// Mock data
const ASSIGNMENTS = [
  { id: "1", title: "HTML Structure Quiz", guide: "Web Development Bootcamp", dueDate: "2024-03-20", status: "graded", score: 92 },
  { id: "2", title: "CSS Styling Exercise", guide: "Web Development Bootcamp", dueDate: "2024-03-25", status: "submitted", score: null },
  { id: "3", title: "Data Visualization Project", guide: "Data Science 101", dueDate: "2024-04-01", status: "pending", score: null },
  { id: "4", title: "Python Basics Quiz", guide: "Python Programming", dueDate: "2024-03-15", status: "graded", score: 88 },
];

const STATUS_STYLES: Record<string, string> = {
  graded: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

export default function StudentAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {ASSIGNMENTS.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{a.title}</h3>
                  <Badge className={STATUS_STYLES[a.status] || ""}>{a.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {a.guide} · Due: {a.dueDate}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {a.score && (
                  <span className="text-lg font-semibold text-primary">
                    {a.score}%
                  </span>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/student/assignments/${a.id}`}>
                    {a.status === "pending" ? "Start" : "View"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
