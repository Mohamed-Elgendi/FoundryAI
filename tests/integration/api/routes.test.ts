import { POST as generatePlan } from '@/app/api/generate/route';
import { POST as refinePlan } from '@/app/api/refine/route';
import { GET as getProviders } from '@/app/api/providers/route';
import { POST as submitFeedback } from '@/app/api/feedback/route';

// Mock dependencies
jest.mock('@/layer-2-ai/router/ai-router', () => ({
  processWithAI: jest.fn(),
  getDefaultProvider: jest.fn().mockReturnValue('groq'),
  AIProvider: jest.fn(),
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
      const mockOutput = {
        businessName: 'Test Business',
        tagline: 'A test tagline',
        painPoint: 'Test pain point',
        solution: 'Test solution',
        uniqueAdvantage: 'Test advantage',
        targetCustomers: 'Test customers',
        mvp: 'Test MVP',
        firstSteps: ['Step 1', 'Step 2'],
        timeToFirstSale: '1 week',
        initialPricing: '$50',
        totalFounderTime: '2 weeks',
        startupCosts: '$100',
      };

      mockedProcessWithAI.mockResolvedValueOnce({
        text: JSON.stringify(mockOutput),
        provider: 'groq',
        latencyMs: 1000,
      });

      mockedParseAIResponse.mockReturnValueOnce(mockOutput);

      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'I want to start a test business',
          provider: 'groq',
        }),
      });

      const response = await generatePlan(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.output).toEqual(mockOutput);
      expect(data.provider).toBe('groq');
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
        provider: 'groq',
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
        provider: 'groq',
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
        provider: 'groq',
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
        provider: 'groq',
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
        text: JSON.stringify({ businessName: 'Test' }),
        provider: 'openai',
        fallbackUsed: true,
        latencyMs: 1500,
      });

      mockedParseAIResponse.mockReturnValueOnce({ businessName: 'Test' });

      const request = new Request('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: 'Test business idea',
          provider: 'groq',
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
      const mockRefinedOutput = {
        businessName: 'Refined Business',
        tagline: 'A refined tagline',
        painPoint: 'Refined pain point',
        solution: 'Refined solution',
        uniqueAdvantage: 'Refined advantage',
        targetCustomers: 'Refined customers',
        mvp: 'Refined MVP',
        firstSteps: ['Refined Step 1', 'Refined Step 2'],
        timeToFirstSale: '2 weeks',
        initialPricing: '$100',
        totalFounderTime: '3 weeks',
        startupCosts: '$200',
      };

      mockedProcessWithAI.mockResolvedValueOnce({
        text: JSON.stringify(mockRefinedOutput),
        provider: 'groq',
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
          provider: 'groq',
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
      const request = new Request('http://localhost:3000/api/providers', {
        method: 'GET',
      });

      const response = await getProviders(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.providers).toBeDefined();
      expect(Array.isArray(data.providers)).toBe(true);
      expect(data.defaultProvider).toBeDefined();
    });

    it('should include provider metadata', async () => {
      const request = new Request('http://localhost:3000/api/providers', {
        method: 'GET',
      });

      const response = await getProviders(request);
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
