/**
 * Teacher Assignments
 *
 * View and manage course assignments.
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data
const ASSIGNMENTS = [
  { id: "1", title: "HTML Structure Quiz", dueDate: "2024-03-20", submissions: 85, total: 120, status: "graded" },
  { id: "2", title: "CSS Styling Exercise", dueDate: "2024-03-25", submissions: 42, total: 120, status: "active" },
  { id: "3", title: "JavaScript DOM Challenge", dueDate: "2024-04-01", submissions: 0, total: 120, status: "draft" },
];

export default function TeacherAssignmentsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <Button>Create Assignment</Button>
      </div>

      <div className="space-y-3">
        {ASSIGNMENTS.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">{a.title}</h3>
                <p className="text-sm text-muted-foreground">Due: {a.dueDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {a.submissions}/{a.total} submitted
                </span>
                <Badge
                  className={
                    a.status === "graded"
                      ? "bg-green-100 text-green-800"
                      : a.status === "active"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {a.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
