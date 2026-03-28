import { NextResponse } from 'next/server';
import { processWithAI, AIProvider, getDefaultProvider } from '@/lib/ai/ai-router';
import { successResponse, errorResponse, errors } from '@/lib/api/response';
import { buildMasterPrompt, parseAIResponse } from '@/lib/engines/master-prompt';
import { getSuccessfulPatterns } from '@/lib/db/supabase';

export async function POST(request: Request) {
  try {
    const { userInput, provider } = await request.json();

    if (!userInput || typeof userInput !== 'string') {
      return errors.badRequest('Invalid input: userInput is required');
    }

    const selectedProvider: AIProvider = provider || getDefaultProvider();

    const patterns = await getSuccessfulPatterns(10);
    const patternHints = patterns.length > 0
      ? `\n\n## SUCCESSFUL PATTERNS TO CONSIDER\n${patterns.map(p => `- Input type: ${p.inputPattern}`).join('\n')}`
      : '';

    const prompt = buildMasterPrompt(userInput) + patternHints;
    const aiResponse = await processWithAI({ prompt, preferredProvider: selectedProvider });

    if (aiResponse.error || !aiResponse.content) {
      return errors.aiError(
        aiResponse.error || 'Failed to generate output',
        aiResponse.suggestedAction,
        { 
          rateLimitError: aiResponse.rateLimitError,
          quotaExceeded: aiResponse.quotaExceeded 
        }
      );
    }

    const parsedOutput = parseAIResponse(aiResponse.content);

    if (!parsedOutput) {
      return errors.internal('Failed to parse AI output', 'The AI response was malformed. Please try again.');
    }

    return successResponse({
      output: parsedOutput,
      provider: aiResponse.provider,
      fallbackUsed: aiResponse.fallbackUsed,
    });

  } catch (error: any) {
    console.error('Generate API error:', error);
    return errors.internal(error?.message || 'Internal server error');
  }
}
