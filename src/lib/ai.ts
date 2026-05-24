/**
 * AI Curriculum Generation
 * 
 * Generates curriculum content using OpenAI API based on guide parameters.
 */

import { OPENAI_API_KEY, OPENAI_MODEL } from "./constants";

interface CurriculumParams {
  title: string;
  subject: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedDuration: string;
  targetAudience: string;
  description: string;
  numberOfLessons?: number;
}

export interface CurriculumLesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: "lesson" | "exercise" | "quiz" | "project";
  prerequisites?: string[];
}

export async function generateCurriculum(
  params: CurriculumParams
): Promise<CurriculumLesson[]> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const {
    title,
    subject,
    difficulty,
    estimatedDuration,
    targetAudience,
    description,
    numberOfLessons = 5,
  } = params;

  const prompt = `
    You are an expert curriculum designer. Create a comprehensive curriculum based on the following parameters.

    Guide Title: ${title}
    Subject: ${subject}
    Difficulty Level: ${difficulty}
    Estimated Total Duration: ${estimatedDuration}
    Target Audience: ${targetAudience}
    Description: ${description}
    Number of Lessons: ${numberOfLessons}

    Generate ${numberOfLessons} lessons that progress logically from basic to advanced concepts.
    Each lesson should include:
    - A clear, descriptive title
    - Detailed content explaining the concepts
    - An estimated duration (format: Xm, Xh, or Xd)
    - Type (lesson, exercise, quiz, or project)
    - Prerequisites (references to other lesson titles, if any)

    Return the response as a JSON array with the following structure:
    [
      {
        "id": "lesson-1",
        "title": "Lesson Title",
        "content": "Detailed lesson content...",
        "duration": "30m",
        "type": "lesson",
        "prerequisites": []
      }
    ]

    Ensure the curriculum is:
    1. Well-structured and progressive
    2. Appropriate for the target difficulty level
    3. Balanced between theory and practice
    4. Includes assessments (quizzes) at appropriate intervals
    5. Ends with a practical project
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert curriculum designer who creates structured, progressive learning paths.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    const curriculum = JSON.parse(content) as CurriculumLesson[];

    // Assign IDs if not present
    return curriculum.map((lesson, index) => ({
      ...lesson,
      id: lesson.id || `lesson-${index + 1}`,
    }));
  } catch (error) {
    console.error("Error generating curriculum:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to generate curriculum"
    );
  }
}

/**
 * Generate AI-powered assignment suggestions
 */
export async function generateAssignmentSuggestions({
  guideTitle,
  subject,
  difficulty,
  lessonCount,
}: {
  guideTitle: string;
  subject: string;
  difficulty: string;
  lessonCount: number;
}): Promise<
  Array<{
    title: string;
    description: string;
    instructions: string;
    maxScore: number;
    dueAfter: string;
  }>
> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const prompt = `
    Generate ${Math.ceil(lessonCount / 2)} assignments for a "${guideTitle}" course.
    Subject: ${subject}, Difficulty: ${difficulty}

    Each assignment should test practical skills learned in the lessons.
    Return as JSON array with: title, description, instructions, maxScore (0-100), dueAfter (duration format like 2d)
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert assignment designer for educational courses.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) throw new Error("Failed to generate assignments");

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

/**
 * Generate quiz questions for a lesson
 */
export async function generateQuizQuestions({
  lessonTitle,
  content,
  difficulty,
  questionCount = 5,
}: {
  lessonTitle: string;
  content: string;
  difficulty: string;
  questionCount?: number;
}): Promise<
  Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>
> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const prompt = `
    Generate ${questionCount} multiple-choice quiz questions for the lesson: "${lessonTitle}"
    Difficulty: ${difficulty}
    Content: ${content.substring(0, 1000)}...

    Return as JSON array with: question, options (array of 4 strings), correctAnswer (index 0-3), explanation
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert quiz question writer.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) throw new Error("Failed to generate quiz questions");

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
