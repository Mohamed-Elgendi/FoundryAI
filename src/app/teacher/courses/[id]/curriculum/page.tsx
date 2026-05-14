/**
 * Curriculum Editor
 *
 * Manage lessons within a course — add, edit, delete, reorder.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: "lesson" | "exercise" | "quiz" | "project";
}

const INITIAL_LESSONS: Lesson[] = [
  { id: "1", title: "Introduction to HTML", content: "Learn the basics of HTML structure and tags.", duration: "30m", type: "lesson" },
  { id: "2", title: "CSS Fundamentals", content: "Styling web pages with CSS selectors and properties.", duration: "45m", type: "lesson" },
  { id: "3", title: "Build a Landing Page", content: "Create a responsive landing page from scratch.", duration: "60m", type: "exercise" },
  { id: "4", title: "JavaScript Basics", content: "Variables, functions, and DOM manipulation.", duration: "40m", type: "lesson" },
  { id: "5", title: "Mid-Course Quiz", content: "Test your knowledge of HTML, CSS, and JS.", duration: "20m", type: "quiz" },
];

export default function CurriculumEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [editing, setEditing] = useState<Lesson | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...lessons];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setLessons(updated);
  };

  const moveDown = (index: number) => {
    if (index === lessons.length - 1) return;
    const updated = [...lessons];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setLessons(updated);
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Curriculum</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Lesson</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Lesson title" />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea placeholder="Lesson content..." rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input placeholder="30m" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input placeholder="lesson" />
                </div>
              </div>
              <DialogFooter>
                <Button>Add</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lesson List */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <Card key={lesson.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <span className="text-sm font-medium text-muted-foreground w-8">
                {index + 1}.
              </span>
              <div className="flex-1">
                <h3 className="font-medium">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {lesson.content}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{lesson.type}</Badge>
                <Badge variant="secondary">{lesson.duration}</Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => moveUp(index)}>↑</Button>
                <Button variant="ghost" size="sm" onClick={() => moveDown(index)}>↓</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(lesson)}>✏️</Button>
                <Button variant="ghost" size="sm" onClick={() => removeLesson(lesson.id)} className="text-red-500">🗑</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
