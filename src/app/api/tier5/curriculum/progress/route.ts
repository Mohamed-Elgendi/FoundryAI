// API Route: Curriculum Progress Tracking
import { NextRequest, NextResponse } from 'next/server';
import { curriculumService } from '@/layer-3-data/services/curriculum-service';

// POST: Update lesson progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, curriculumId, moduleId, lessonId, action, timeSpent } = body;

    if (!userId || !curriculumId || !moduleId || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await curriculumService.updateProgress(
      userId,
      curriculumId,
      moduleId,
      lessonId,
      action || 'completed',
      timeSpent || 0
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
