/**
 * Student Courses
 *
 * View enrolled courses.
 */

import { CourseCard } from "@/components/shared/course-card";
import { EmptyState } from "@/components/shared/empty-state";

// Mock data
const MY_COURSES = [
  { id: "1", title: "Web Development Bootcamp", progress: 65, enrolledCount: 120, status: "active" },
  { id: "2", title: "Data Science 101", progress: 42, enrolledCount: 89, status: "active" },
  { id: "3", title: "Python Programming", progress: 80, enrolledCount: 203, status: "active" },
];

export default function StudentCoursesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Courses</h1>

      {MY_COURSES.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MY_COURSES.map((course) => (
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
          description="Explore guides and enroll in courses to get started"
          actionLabel="Explore Guides"
          actionHref="/student/guides"
        />
      )}
    </div>
  );
}
