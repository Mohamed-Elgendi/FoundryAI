/**
 * Teacher Guides List
 *
 * Grid of guides with search, filter, and create action.
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GuideCard } from "@/components/shared/guide-card";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";

// Mock data — replace with Supabase query
const MOCK_GUIDES = [
  { id: "1", title: "Introduction to React", subject: "Web Development", difficulty: "beginner", estimatedDuration: "3h", enrolledCount: 45 },
  { id: "2", title: "Advanced Python", subject: "Programming", difficulty: "advanced", estimatedDuration: "6h", enrolledCount: 82 },
  { id: "3", title: "Data Science Fundamentals", subject: "Data Science", difficulty: "intermediate", estimatedDuration: "5h", enrolledCount: 120 },
  { id: "4", title: "Machine Learning Basics", subject: "AI/ML", difficulty: "intermediate", estimatedDuration: "4h", enrolledCount: 67 },
];

export default function TeacherGuidesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Guides</h1>
        <Button asChild>
          <Link href="/teacher/guides/new">Create New Guide</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input placeholder="Search guides..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guide Grid */}
      {MOCK_GUIDES.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_GUIDES.map((guide) => (
            <GuideCard
              key={guide.id}
              guideId={guide.id}
              title={guide.title}
              subject={guide.subject}
              difficulty={guide.difficulty}
              estimatedDuration={guide.estimatedDuration}
              enrolledCount={guide.enrolledCount}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No guides yet"
          description="Create your first guide to get started"
          actionLabel="Create Guide"
          actionHref="/teacher/guides/new"
        />
      )}
    </div>
  );
}
