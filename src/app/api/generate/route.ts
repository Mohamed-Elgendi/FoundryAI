import { NextResponse } from 'next/server';
import { processWithAI, AIProvider, getDefaultProvider } from '@/layer-2-ai/router/ai-router';
import { successResponse, errorResponse, errors } from '@/lib/api/response';
import { buildMasterPrompt, parseAIResponse } from '@/lib/engines/master-prompt';
import { getSuccessfulPatterns } from '@/layer-3-data/storage/supabase-client';

export async function POST(request: Request) {
  try {
    const { userInput, provider } = await request.json();
    console.log('[Generate API] Received request:', { userInputLength: userInput?.length, provider });

    if (!userInput || typeof userInput !== 'string') {
      console.log('[Generate API] Invalid input:', userInput);
      return errors.badRequest('Invalid input: userInput is required');
    }

    const selectedProvider: AIProvider = provider || getDefaultProvider();
    console.log('[Generate API] Using provider:', selectedProvider);

    const result = await getSuccessfulPatterns(10);
    const patterns = result.patterns;
    const patternHints = patterns.length > 0
      ? `\n\n## SUCCESSFUL PATTERNS TO CONSIDER\n${patterns.map(p => `- Input type: ${p.type}`).join('\n')}`
      : '';

    const prompt = buildMasterPrompt(userInput) + patternHints;
    console.log('[Generate API] Prompt length:', prompt.length);
    
    const aiResponse = await processWithAI({ prompt, provider: selectedProvider });
    console.log('[Generate API] AI response:', { 
      hasContent: !!aiResponse.text, 
      hasError: !!aiResponse.error,
      provider: aiResponse.provider,
      fallbackUsed: aiResponse.fallbackUsed,
      contentLength: aiResponse.text?.length
    });

    if (aiResponse.error || !aiResponse.text) {
      console.error('[Generate API] AI error:', aiResponse.error);
      return errors.aiError(
        aiResponse.error || 'Failed to generate output',
        aiResponse.suggestedAction,
        { 
          rateLimitError: aiResponse.rateLimitError,
          quotaExceeded: aiResponse.quotaExceeded 
        }
      );
    }

    const parsedOutput = parseAIResponse(aiResponse.text);
    console.log('[Generate API] Parsed output:', { hasOutput: !!parsedOutput });

    if (!parsedOutput) {
      console.error('[Generate API] Parse failed. Raw content preview:', aiResponse.text?.substring(0, 500));
      return errors.internal('Failed to parse AI output', 'The AI response was malformed. Please try again.');
    }

    return NextResponse.json({
      success: true,
      output: parsedOutput,
      provider: aiResponse.provider,
      fallbackUsed: aiResponse.fallbackUsed,
    });

  } catch (error: any) {
    console.error('[Generate API] Error:', error?.message, error?.stack);
    return errors.internal(error?.message || 'Internal server error');
  }
}
