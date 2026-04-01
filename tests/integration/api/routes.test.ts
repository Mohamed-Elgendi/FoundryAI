import { POST as generatePlan } from '@/app/api/generate/route';
import { POST as refinePlan } from '@/app/api/refine/route';
import { GET as getProviders } from '@/app/api/providers/route';
import { POST as submitFeedback } from '@/app/api/feedback/route';
import { FoundryAIOutput } from '@/types';

// Mock dependencies
jest.mock('@/layer-2-ai/router/ai-router', () => ({
  processWithAI: jest.fn(),
  getDefaultProvider: jest.fn().mockReturnValue('groq-llama-3-3'),
}));

jest.mock('@/layer-3-data/storage/supabase-client', () => ({
  getSuccessfulPatterns: jest.fn().mockResolvedValue({ patterns: [] }),
  saveFeedback: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@/lib/engines/master-prompt', () => ({
  buildMasterPrompt: jest.fn((input: string) => `## ENRICHED PROMPT\n\n${input}`),
  parseAIResponse: jest.fn(),
}));

import { processWithAI } from '@/layer-2-ai/router/ai-router';
import { parseAIResponse } from '@/lib/engines/master-prompt';

const mockedProcessWithAI = processWithAI as jest.MockedFunction<typeof processWithAI>;
const mockedParseAIResponse = parseAIResponse as jest.MockedFunction<typeof parseAIResponse>;

describe('API Routes - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/generate', () => {
    it('should successfully generate a plan', async () => {
      const mockOutput: FoundryAIOutput = {
        ideaName: 'Test Business',
        targetAudience: {
          description: 'Test users with their core struggle',
          painLevel: 8
        },
        problemStatement: {
          coreProblem: 'Test pain point',
          quantifiedCost: '$1000/month',
          negativeConsequences: ['Consequence 1', 'Consequence 2'],
          alternatives: ['Alternative 1', 'Alternative 2'],
          reasonsTheyFail: ['Reason 1', 'Reason 2'],
          coreSolution: 'Test solution',
          keyBenefits: ['Benefit 1', 'Benefit 2'],
          fullStatement: 'Full problem statement'
        },
        marketResearch: {
          tam: '$10B (2024)',
          sam: '$100M',
          som: '$10M initial target',
          marketGrowthRate: '15% YoY',
          keyTrends: ['Trend 1', 'Trend 2', 'Trend 3'],
          competitorAnalysis: [
            { name: 'Competitor 1', strengths: 'Strong brand', weaknesses: 'High price', marketShare: '30%', pricing: '$50/month' }
          ],
          targetDemographics: 'Test demographics',
          userPainPoints: ['Pain 1', 'Pain 2'],
          marketGaps: ['Gap 1', 'Gap 2']
        },
        mvpFeatures: ['Feature 1', 'Feature 2'],
        techStack: [{ category: 'Frontend', tool: 'Next.js', purpose: 'React framework', isFree: true }],
        buildPlan: [{ step: 1, title: 'Setup', description: 'Initialize project', estimatedTime: '1 week' }],
        monetizationStrategy: {
          model: 'Freemium',
          pricing: 'Free tier + Pro subscription',
          firstUserTactics: ['Product Hunt launch', 'Social media'],
          revenueEstimate: '$1K-5K MRR within 6 months'
        }
      };

      mockedProcessWithAI.mockResolvedValueOnce({
        text: JSON.stringify(mockOutput),
        provider: 'groq-llama-3-3',
        latencyMs: 1000,
      });

      mockedParseAIResponse.mockReturnValueOnce(mockOutput);

      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'I want to start a test business',
          provider: 'groq-llama-3-3',
        }),
      });

      const response = await generatePlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.output).toEqual(mockOutput);
      expect(data.provider).toBe('groq-llama-3-3');
    });

    it('should return 400 for invalid input', async () => {
      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: '',
        }),
      });

      const response = await generatePlan(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should handle AI service errors', async () => {
      mockedProcessWithAI.mockResolvedValueOnce({
        text: '',
        provider: 'groq-llama-3-3',
        error: 'Service unavailable',
        suggestedAction: 'Please try again later',
      });

      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'Test business idea',
        }),
      });

      const response = await generatePlan(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.error).toBeDefined();
      expect(data.suggestedAction).toBe('Please try again later');
    });

    it('should handle malformed AI response', async () => {
      mockedProcessWithAI.mockResolvedValueOnce({
        text: 'Invalid JSON response',
        provider: 'groq-llama-3-3',
        latencyMs: 500,
      });

      mockedParseAIResponse.mockReturnValueOnce(null);

      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'Test business idea',
        }),
      });

      const response = await generatePlan(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('parse');
    });

    it('should handle rate limit errors', async () => {
      mockedProcessWithAI.mockResolvedValueOnce({
        text: '',
        provider: 'groq-llama-3-3',
        error: 'Rate limit exceeded',
        rateLimitError: true,
        suggestedAction: 'Please wait and try again',
      });

      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'Test business idea',
        }),
      });

      const response = await generatePlan(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.rateLimitError).toBe(true);
    });

    it('should handle quota exceeded errors', async () => {
      mockedProcessWithAI.mockResolvedValueOnce({
        text: '',
        provider: 'groq-llama-3-3',
        error: 'Quota exceeded',
        quotaExceeded: true,
      });

      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'Test business idea',
        }),
      });

      const response = await generatePlan(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.quotaExceeded).toBe(true);
    });

    it('should use fallback provider when preferred fails', async () => {
      mockedProcessWithAI.mockResolvedValueOnce({
        content: JSON.stringify({ ideaName: 'Test' }),
        provider: 'gpt-4o',
        fallbackUsed: true,
        latencyMs: 1500,
      });

      mockedParseAIResponse.mockReturnValueOnce({ ideaName: 'Test' } as FoundryAIOutput);

      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'Test business idea',
          provider: 'groq-llama-3-3',
        }),
      });

      const response = await generatePlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.fallbackUsed).toBe(true);
    });

    it('should handle JSON parsing errors gracefully', async () => {
      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });

      const response = await generatePlan(request);
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/refine', () => {
    it('should successfully refine a plan', async () => {
      const mockRefinedOutput: FoundryAIOutput = {
        ideaName: 'Refined Business',
        targetAudience: {
          description: 'Refined users with their core struggle',
          painLevel: 9
        },
        problemStatement: {
          coreProblem: 'Refined pain point',
          quantifiedCost: '$2000/month',
          negativeConsequences: ['Consequence 1', 'Consequence 2'],
          alternatives: ['Alternative 1', 'Alternative 2'],
          reasonsTheyFail: ['Reason 1', 'Reason 2'],
          coreSolution: 'Refined solution',
          keyBenefits: ['Benefit 1', 'Benefit 2'],
          fullStatement: 'Full problem statement'
        },
        marketResearch: {
          tam: '$20B (2024)',
          sam: '$200M',
          som: '$20M initial target',
          marketGrowthRate: '20% YoY',
          keyTrends: ['Trend 1', 'Trend 2', 'Trend 3'],
          competitorAnalysis: [
            { name: 'Competitor 1', strengths: 'Strong brand', weaknesses: 'High price', marketShare: '25%', pricing: '$100/month' }
          ],
          targetDemographics: 'Refined demographics',
          userPainPoints: ['Pain 1', 'Pain 2'],
          marketGaps: ['Gap 1', 'Gap 2']
        },
        mvpFeatures: ['Refined Feature 1', 'Refined Feature 2'],
        techStack: [{ category: 'Frontend', tool: 'Next.js', purpose: 'React framework', isFree: true }],
        buildPlan: [{ step: 1, title: 'Refined Setup', description: 'Initialize project', estimatedTime: '2 weeks' }],
        monetizationStrategy: {
          model: 'Freemium',
          pricing: 'Free tier + Pro subscription',
          firstUserTactics: ['Product Hunt launch', 'Social media'],
          revenueEstimate: '$2K-10K MRR within 6 months'
        }
      };

      mockedProcessWithAI.mockResolvedValueOnce({
        text: JSON.stringify(mockRefinedOutput),
        provider: 'groq-llama-3-3',
        latencyMs: 800,
      });

      mockedParseAIResponse.mockReturnValueOnce(mockRefinedOutput);

      const request = new Request('http://localhost:3000/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalIdea: 'Original business idea',
          currentPlan: { businessName: 'Original' },
          feedback: 'Make it more specific',
          provider: 'groq-llama-3-3',
        }),
      });

      const response = await refinePlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.output).toEqual(mockRefinedOutput);
    });

    it('should return 400 for missing required fields', async () => {
      const request = new Request('http://localhost:3000/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalIdea: '',
          feedback: 'Improve this',
        }),
      });

      const response = await refinePlan(request);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/providers', () => {
    it('should return available providers', async () => {
      const response = await getProviders();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.providers).toBeDefined();
      expect(Array.isArray(data.providers)).toBe(true);
      expect(data.defaultProvider).toBeDefined();
    });

    it('should include provider metadata', async () => {
      const response = await getProviders();
      const data = await response.json();

      if (data.providers.length > 0) {
        const provider = data.providers[0];
        expect(provider).toHaveProperty('id');
        expect(provider).toHaveProperty('name');
        expect(provider).toHaveProperty('description');
      }
    });
  });

  describe('POST /api/feedback', () => {
    it('should successfully submit feedback', async () => {
      const request = new Request('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'test-plan-123',
          rating: 5,
          comment: 'Great plan!',
          category: 'general',
        }),
      });

      const response = await submitFeedback(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should handle missing required fields', async () => {
      const request = new Request('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: 5,
        }),
      });

      const response = await submitFeedback(request);
      expect(response.status).toBe(400);
    });

    it('should validate rating range', async () => {
      const request = new Request('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'test-plan-123',
          rating: 6, // Invalid: should be 1-5
          comment: 'Test',
        }),
      });

      const response = await submitFeedback(request);
      expect(response.status).toBe(400);
    });
  });
});
