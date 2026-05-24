/**
 * Create New Guide
 *
 * Form with AI curriculum generation.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateCurriculum, CurriculumLesson } from "@/lib/ai";

export default function NewGuidePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    difficulty: "",
    estimatedDuration: "",
    targetAudience: "",
  });
  const [curriculum, setCurriculum] = useState<CurriculumLesson[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!form.title || !form.subject || !form.difficulty) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateCurriculum({
        title: form.title,
        subject: form.subject,
        difficulty: form.difficulty as "beginner" | "intermediate" | "advanced" | "expert",
        estimatedDuration: form.estimatedDuration,
        targetAudience: form.targetAudience,
        description: form.description,
      });
      setCurriculum(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate curriculum");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Save guide to database (placeholder)
    router.push("/teacher/guides");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Create New Guide</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., Introduction to React"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what this guide covers..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g., Web Development"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Estimated Duration</Label>
            <Input
              id="duration"
              value={form.estimatedDuration}
              onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })}
              placeholder="e.g., 3h"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input
              id="audience"
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              placeholder="e.g., High school students"
            />
          </div>
        </div>

        {/* AI Generate */}
        <Button
          onClick={handleGenerate}
          disabled={loading || !form.title || !form.subject || !form.difficulty}
        >
          {loading ? "Generating..." : "✨ AI Generate Curriculum"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Curriculum Preview */}
      {curriculum && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generated Curriculum</h2>
          {curriculum.map((lesson, i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-4 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium">{lesson.title}</h3>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="outline">{lesson.type}</Badge>
                    <Badge variant="secondary">{lesson.duration}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Save */}
      <div className="flex gap-3">
        <Button onClick={handleSave} size="lg">
          Save Guide
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href="/teacher/guides">Cancel</a>
        </Button>
      </div>
    </div>
  );
}
