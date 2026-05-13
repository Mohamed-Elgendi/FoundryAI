import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';
import { FeedbackData } from '@/types';

export async function POST(request: Request) {
  try {
    const { userInput, output, isHelpful } = await request.json();

    if (!userInput || !output || typeof isHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: userInput, output, isHelpful' },
        { status: 400 }
      );
    }

    const feedbackData: FeedbackData = {
      userId: 'anonymous', // Default for now
      email: 'anonymous@example.com', // Default for now
      userInput,
      feedback: output,
      rating: isHelpful ? 5 : 1, // Convert boolean to rating
      isHelpful,
      createdAt: new Date().toISOString(),
    };

    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from('evidence_stack')
      .insert({
        user_id: feedbackData.userId,
        belief_id: null,
        evidence_type: 'Feedback',
        description: feedbackData.feedback,
        proof_value: feedbackData.rating,
        created_at: feedbackData.createdAt,
      } as any);

    if (error) {
      console.error('Error storing feedback:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
