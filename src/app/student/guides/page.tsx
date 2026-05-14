/**
 * Student Guides — Explore
 *
 * Browse and enroll in guides.
 */

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

// Mock data
const MOCK_GUIDES = [
  { id: "1", title: "Introduction to React", subject: "Web Development", difficulty: "beginner", estimatedDuration: "3h", enrolledCount: 45 },
  { id: "2", title: "Advanced Python", subject: "Programming", difficulty: "advanced", estimatedDuration: "6h", enrolledCount: 82 },
  { id: "3", title: "Data Science Fundamentals", subject: "Data Science", difficulty: "intermediate", estimatedDuration: "5h", enrolledCount: 120 },
  { id: "4", title: "Machine Learning Basics", subject: "AI/ML", difficulty: "intermediate", estimatedDuration: "4h", enrolledCount: 67 },
  { id: "5", title: "UI/UX Design Principles", subject: "Design", difficulty: "beginner", estimatedDuration: "2h", enrolledCount: 93 },
  { id: "6", title: "Docker & Kubernetes", subject: "DevOps", difficulty: "advanced", estimatedDuration: "5h", enrolledCount: 41 },
];

export default function StudentGuidesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Explore Guides</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Input placeholder="Search guides..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="web">Web Development</SelectItem>
            <SelectItem value="programming">Programming</SelectItem>
            <SelectItem value="data">Data Science</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
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
              onEnroll={() => {}}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No guides found" description="Try adjusting your filters" />
      )}
    </div>
  );
}
