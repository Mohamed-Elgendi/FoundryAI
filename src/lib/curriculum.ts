/**
 * Curriculum Utilities
 * 
 * Helper functions for working with curriculum data.
 */

export interface CurriculumItem {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: "lesson" | "exercise" | "quiz" | "project";
  prerequisites?: string[];
  completed?: boolean;
}

export interface CurriculumStats {
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  totalDuration: string;
  remainingDuration: string;
  lessonsByType: Record<string, number>;
}

/**
 * Parse duration string to minutes
 */
export function parseDurationToMinutes(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 0;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s": return value / 60;
    case "m": return value;
    case "h": return value * 60;
    case "d": return value * 60 * 60;
    default: return 0;
  }
}

/**
 * Calculate curriculum statistics
 */
export function calculateCurriculumStats(curriculum: CurriculumItem[]): CurriculumStats {
  const totalLessons = curriculum.length;
  const completedLessons = curriculum.filter((l) => l.completed).length;
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const totalMinutes = curriculum.reduce(
    (sum, lesson) => sum + parseDurationToMinutes(lesson.duration),
    0
  );
  const remainingMinutes = curriculum
    .filter((l) => !l.completed)
    .reduce((sum, lesson) => sum + parseDurationToMinutes(lesson.duration), 0);

  const lessonsByType = curriculum.reduce(
    (acc, lesson) => {
      acc[lesson.type] = (acc[lesson.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalLessons,
    completedLessons,
    completionPercentage,
    totalDuration: minutesToDuration(totalMinutes),
    remainingDuration: minutesToDuration(remainingMinutes),
    lessonsByType,
  };
}

/**
 * Convert minutes to duration string
 */
export function minutesToDuration(minutes: number): string {
  if (minutes === 0) return "0m";

  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    const remainingMins = Math.round(minutes % 1440);
    return remainingMins > 0 ? `${days}d ${remainingMins}m` : `${days}d`;
  }

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMins = Math.round(minutes % 60);
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  }

  return `${Math.round(minutes)}m`;
}

/**
 * Get lessons that can be unlocked (prerequisites met)
 */
export function getUnlockedLessons(curriculum: CurriculumItem[]): CurriculumItem[] {
  const completedTitles = new Set(
    curriculum.filter((l) => l.completed).map((l) => l.title)
  );

  return curriculum.filter((lesson) => {
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
      return true;
    }
    return lesson.prerequisites.every((prereq) => completedTitles.has(prereq));
  });
}

/**
 * Order lessons by prerequisites (topological sort)
 */
export function orderCurriculum(curriculum: CurriculumItem[]): CurriculumItem[] {
  const ordered: CurriculumItem[] = [];
  const visited = new Set<string>();

  function visit(lesson: CurriculumItem): void {
    if (visited.has(lesson.id)) return;
    visited.add(lesson.id);

    // Visit prerequisites first
    for (const prereq of lesson.prerequisites || []) {
      const prereqLesson = curriculum.find((l) => l.title === prereq);
      if (prereqLesson) {
        visit(prereqLesson);
      }
    }

    ordered.push(lesson);
  }

  for (const lesson of curriculum) {
    visit(lesson);
  }

  return ordered;
}

/**
 * Flatten curriculum content for rendering
 */
export function flattenCurriculum(
  curriculum: CurriculumItem[]
): Array<{ type: string; id: string; title: string; content: string; duration: string }> {
  return curriculum.map((item) => ({
    type: item.type,
    id: item.id,
    title: item.title,
    content: item.content,
    duration: item.duration,
  }));
}
