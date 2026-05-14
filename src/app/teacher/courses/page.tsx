/**
 * Teacher Courses List
 *
 * Grid of courses with create action.
 */

import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/shared/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";

// Mock data
const MOCK_COURSES = [
  { id: "1", title: "Web Development Bootcamp", progress: 65, enrolledCount: 120, status: "active" },
  { id: "2", title: "Data Science 101", progress: 42, enrolledCount: 89, status: "active" },
  { id: "3", title: "Python Programming", progress: 100, enrolledCount: 203, status: "completed" },
];

export default function TeacherCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button>Create Course</Button>
      </div>

      {MOCK_COURSES.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_COURSES.map((course) => (
            <CourseCard
              key={course.id}
              courseId={course.id}
              title={course.title}
              progress={course.progress}
              enrolledCount={course.enrolledCount}
              status={course.status}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No courses yet"
          description="Create your first course to organize your guides"
          actionLabel="Create Course"
          actionHref="#"
        />
      )}
    </div>
  );
}
