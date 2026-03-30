import { NextResponse } from 'next/server';
import { storeFeedback, getFeedbackStats } from '@/layer-3-data/storage/createSupabaseClient';
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

    const feedback: FeedbackData = {
      userInput,
      output,
      isHelpful,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
    };

    await storeFeedback(feedback);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to store feedback' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await getFeedbackStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
