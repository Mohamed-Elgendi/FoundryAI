/**
 * Assignment Submission
 *
 * View assignment details and submit work.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data
const ASSIGNMENT = {
  title: "HTML Structure Quiz",
  guide: "Web Development Bootcamp",
  instructions: "Create a well-structured HTML document with semantic elements. Include a header, navigation, main content area with at least 3 sections, and a footer. Use appropriate heading levels and list elements.",
  dueDate: "2024-03-20",
  status: "pending",
  maxScore: 100,
};

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [submission, setSubmission] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{ASSIGNMENT.title}</h1>
        <p className="text-muted-foreground">{ASSIGNMENT.guide}</p>
        <div className="mt-2 flex gap-2">
          <Badge>{ASSIGNMENT.status}</Badge>
          <Badge variant="outline">Due: {ASSIGNMENT.dueDate}</Badge>
          <Badge variant="secondary">Max Score: {ASSIGNMENT.maxScore}</Badge>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm">{ASSIGNMENT.instructions}</p>
        </CardContent>
      </Card>

      {/* Submission Form */}
      {submitted ? (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>
            Your submission has been received! It will be graded soon.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Submission</CardTitle>
            <CardDescription>Write your answer or upload files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Write your submission here..."
              rows={10}
            />

            {/* File Upload Area */}
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="mx-auto mb-2 h-8 w-8 text-muted-foreground"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Upload Files
              </Button>
            </div>

            <Button onClick={handleSubmit} disabled={!submission.trim()} className="w-full">
              Submit Assignment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
