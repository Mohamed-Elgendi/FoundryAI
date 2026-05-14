/**
 * Guide Detail
 *
 * View guide information and curriculum.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock data — replace with Supabase query
const GUIDE = {
  id: "1",
  title: "Introduction to React",
  description: "Learn the fundamentals of React.js including components, props, state, hooks, and building modern UIs.",
  subject: "Web Development",
  difficulty: "beginner",
  estimatedDuration: "3h",
};

const CURRICULUM = [
  { id: "1", title: "What is React?", content: "Introduction to the React library and its ecosystem.", duration: "30m", type: "lesson" },
  { id: "2", title: "Components & Props", content: "Understanding React components, JSX, and passing data with props.", duration: "45m", type: "lesson" },
  { id: "3", title: "State Management", content: "useState hook and managing component state.", duration: "40m", type: "lesson" },
  { id: "4", title: "Building a Todo App", content: "Hands-on exercise: create a fully functional todo application.", duration: "50m", type: "exercise" },
  { id: "5", title: "Chapter Quiz", content: "Test your understanding of React fundamentals.", duration: "20m", type: "quiz" },
  { id: "6", title: "Final Project", content: "Build a complete project applying everything you&apos;ve learned.", duration: "30m", type: "project" },
];

export default function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{GUIDE.title}</h1>
          <p className="mt-2 text-muted-foreground">{GUIDE.description}</p>
          <div className="mt-3 flex gap-2">
            <Badge variant="secondary">{GUIDE.subject}</Badge>
            <Badge>{GUIDE.difficulty}</Badge>
            <Badge variant="outline">{GUIDE.estimatedDuration}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
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
                  <span className="text-sm font-medium text-muted-foreground">{lesson.id}.</span>
                  <span>{lesson.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{lesson.content}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">{lesson.type}</Badge>
                    <Badge variant="secondary">{lesson.duration}</Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
