import { NextResponse } from 'next/server';
import { processWithAI } from '@/lib/ai/ai-router';
import { successResponse, errors } from '@/lib/api/response';
import { buildRefinementPrompt, parseRefinementResponse, RefinementContext } from '@/lib/engines/refinement-prompt';
import { getSuccessfulPatterns } from '@/lib/db/supabase';

export async function POST(request: Request) {
  try {
    const { originalInput, currentOutput, iterationCount, previousRefinements } = await request.json();

    if (!originalInput || !currentOutput || typeof iterationCount !== 'number') {
      return errors.badRequest('Missing required fields: originalInput, currentOutput, iterationCount');
    }

    const context: RefinementContext = {
      originalInput,
      currentOutput,
      iterationCount,
      previousRefinements: previousRefinements || [],
    };

    // Get patterns for enhancement
    const patterns = await getSuccessfulPatterns(10);
    
    const prompt = buildRefinementPrompt(context);
    
    // Use Groq for refinement with longer timeout
    const aiResponse = await processWithAI({ prompt, preferredProvider: 'groq' });

    if (aiResponse.error || !aiResponse.content) {
      return errors.aiError(
        aiResponse.error || 'Failed to refine output',
        aiResponse.suggestedAction
      );
    }

    const refinedOutput = parseRefinementResponse(aiResponse.content);

    if (!refinedOutput) {
      return errors.internal('Failed to parse refined output', 'The AI refinement response was malformed. Please try again.');
    }

    return successResponse({
      output: refinedOutput,
      iteration: iterationCount + 1,
      provider: aiResponse.provider,
    });

  } catch (error: any) {
    console.error('Refinement API error:', error);
    return errors.internal(error?.message || 'Internal server error');
  }
}
