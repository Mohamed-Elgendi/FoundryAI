/**
 * Student Guide Detail
 *
 * View guide content and track progress.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

// Mock data
const GUIDE = {
  title: "Introduction to React",
  description: "Learn the fundamentals of React.js including components, props, state, hooks, and building modern UIs.",
  subject: "Web Development",
  difficulty: "beginner",
  estimatedDuration: "3h",
  progress: 40,
};

const CURRICULUM = [
  { id: "1", title: "What is React?", duration: "30m", type: "lesson", completed: true },
  { id: "2", title: "Components & Props", duration: "45m", type: "lesson", completed: true },
  { id: "3", title: "State Management", duration: "40m", type: "lesson", completed: false },
  { id: "4", title: "Building a Todo App", duration: "50m", type: "exercise", completed: false },
  { id: "5", title: "Chapter Quiz", duration: "20m", type: "quiz", completed: false },
];

export default function StudentGuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{GUIDE.title}</h1>
        <p className="mt-2 text-muted-foreground">{GUIDE.description}</p>
        <div className="mt-3 flex gap-2">
          <Badge variant="secondary">{GUIDE.subject}</Badge>
          <Badge>{GUIDE.difficulty}</Badge>
          <Badge variant="outline">{GUIDE.estimatedDuration}</Badge>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span>Your Progress</span>
            <span className="font-medium">{GUIDE.progress}%</span>
          </div>
          <Progress value={GUIDE.progress} className="h-2" />
        </div>

        {/* CTA */}
        <div className="mt-4">
          <Button size="lg" asChild>
            <Link href="/student/courses/1">
              {GUIDE.progress > 0 ? "Continue Learning" : "Start Guide"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Curriculum */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Curriculum</h2>
        <Accordion type="single" collapsible className="w-full">
          {CURRICULUM.map((lesson) => (
            <AccordionItem key={lesson.id} value={lesson.id}>
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs">
                    {lesson.completed ? "✓" : lesson.id}
                  </span>
                  <span>{lesson.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex gap-2">
                  <Badge variant="outline">{lesson.type}</Badge>
                  <Badge variant="secondary">{lesson.duration}</Badge>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
