// API Route: AI Curriculum Engine - ACTUAL IMPLEMENTATION
// Beast Mode - Production Ready

import { NextRequest, NextResponse } from 'next/server';
import { curriculumService } from '@/layer-3-data/services/curriculum-service';

// GET: Fetch user curricula or specific curriculum
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const curriculumId = searchParams.get('curriculumId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get specific curriculum
    if (curriculumId) {
      const curriculum = await curriculumService.getCurriculum(curriculumId);
      if (!curriculum) {
        return NextResponse.json(
          { error: 'Curriculum not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(curriculum);
    }

    // Get all user curricula
    const curricula = await curriculumService.getUserCurricula(userId);
    return NextResponse.json({ curricula, count: curricula.length });
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Generate new curriculum
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, topic, skillLevel } = body;

    if (!userId || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, topic' },
        { status: 400 }
      );
    }

    const curriculum = await curriculumService.generateCurriculum(
      userId,
      topic,
      skillLevel || 'beginner'
    );

    return NextResponse.json(curriculum, { status: 201 });
  } catch (error) {
    console.error('Error generating curriculum:', error);
    return NextResponse.json(
      { error: 'Failed to generate curriculum' },
      { status: 500 }
    );
  }
}

// PUT: Update curriculum
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { curriculumId, updates } = body;

    if (!curriculumId) {
      return NextResponse.json(
        { error: 'Curriculum ID is required' },
        { status: 400 }
      );
    }

    const curriculum = await curriculumService.updateCurriculum(curriculumId, updates);
    return NextResponse.json(curriculum);
  } catch (error) {
    console.error('Error updating curriculum:', error);
    return NextResponse.json(
      { error: 'Failed to update curriculum' },
      { status: 500 }
    );
  }
}

// DELETE: Delete curriculum
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const curriculumId = searchParams.get('curriculumId');

    if (!curriculumId) {
      return NextResponse.json(
        { error: 'Curriculum ID is required' },
        { status: 400 }
      );
    }

    await curriculumService.deleteCurriculum(curriculumId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting curriculum:', error);
    return NextResponse.json(
      { error: 'Failed to delete curriculum' },
      { status: 500 }
    );
  }
}
