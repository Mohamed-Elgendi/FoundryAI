import {
  processWithAI,
  getProviderStatus,
  getFallbackProviders,
  getDefaultProvider,
  isProviderConfigured,
  AIRequest,
  AIResponse,
  AIProvider,
} from '@/layer-2-ai/router/ai-router';

// Mock AI SDKs
jest.mock('@ai-sdk/anthropic', () => ({
  anthropic: jest.fn().mockReturnValue('anthropic-model'),
}));

jest.mock('@ai-sdk/openai', () => ({
  openai: jest.fn().mockReturnValue('openai-model'),
}));

jest.mock('@ai-sdk/groq', () => ({
  groq: jest.fn().mockReturnValue('groq-model'),
}));

jest.mock('@ai-sdk/google', () => ({
  google: jest.fn().mockReturnValue('google-model'),
}));

jest.mock('@ai-sdk/mistral', () => ({
  mistral: jest.fn().mockReturnValue('mistral-model'),
}));

jest.mock('ai', () => ({
  generateText: jest.fn(),
  createOpenAICompatible: jest.fn().mockReturnValue((model: string) => `compatible-${model}`),
}));

import { generateText } from 'ai';

const mockedGenerateText = generateText as jest.MockedFunction<typeof generateText>;

describe('AI Router', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getDefaultProvider', () => {
    it('should return default provider', () => {
      const provider = getDefaultProvider();
      expect(provider).toBeDefined();
      expect(typeof provider).toBe('string');
    });
  });

  describe('isProviderConfigured', () => {
    it('should return true when API key is set', () => {
      process.env.GROQ_API_KEY = 'test-key';
      expect(isProviderConfigured('groq-llama-3-3')).toBe(true);
    });

    it('should return false when API key is not set', () => {
      delete process.env.GROQ_API_KEY;
      expect(isProviderConfigured('groq-llama-3-3')).toBe(false);
    });
  });

  describe('getFallbackProviders', () => {
    it('should return priority list when no preferred provider', () => {
      const providers = getFallbackProviders();
      expect(providers).toBeInstanceOf(Array);
      expect(providers.length).toBeGreaterThan(0);
    });

    it('should put preferred provider first when specified', () => {
      const providers = getFallbackProviders('gpt-4o');
      expect(providers[0]).toBe('gpt-4o');
    });

    it('should not duplicate preferred provider in list', () => {
      const providers = getFallbackProviders('claude-3-5-haiku');
      const count = providers.filter(p => p === 'claude-3-5-haiku').length;
      expect(count).toBe(1);
    });
  });

  describe('processWithAI', () => {
    const mockRequest: AIRequest = {
      prompt: 'Test prompt',
      preferredProvider: 'fallback',
    };

    it('should return fallback response when using fallback provider', async () => {
      const result = await processWithAI(mockRequest);

      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.provider).toBe('fallback');
      expect(result.latencyMs).toBeDefined();
      expect(typeof result.latencyMs).toBe('number');
    });

    it('should handle missing API key gracefully', async () => {
      delete process.env.GROQ_API_KEY;

      const result = await processWithAI({
        prompt: 'Test',
        preferredProvider: 'groq-llama-3-3',
      });

      expect(result).toBeDefined();
      expect(result.error).toContain('API key not configured');
    });

    it('should successfully process with available provider', async () => {
      process.env.GROQ_API_KEY = 'test-key';
      mockedGenerateText.mockResolvedValueOnce({ text: 'Generated response' } as any);

      const result = await processWithAI({
        prompt: 'Test prompt',
        preferredProvider: 'groq-llama-3-3',
      });

      expect(result).toBeDefined();
      expect(result.provider).toBe('groq-llama-3-3');
      expect(mockedGenerateText).toHaveBeenCalled();
    });

    it('should handle abort signal', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        processWithAI({
          prompt: 'Test',
          preferredProvider: 'groq-llama-3-3',
          signal: controller.signal,
        })
      ).rejects.toThrow('Request aborted');
    });

    it('should use fallback providers when preferred fails', async () => {
      process.env.GROQ_API_KEY = 'test-key';
      process.env.OPENAI_API_KEY = 'test-key';

      // First provider fails
      mockedGenerateText
        .mockRejectedValueOnce(new Error('Rate limit exceeded'))
        .mockResolvedValueOnce({ text: 'Fallback response' } as any);

      const result = await processWithAI({
        prompt: 'Test',
        preferredProvider: 'groq-llama-3-3',
      });

      expect(result).toBeDefined();
      expect(result.fallbackUsed).toBe(true);
    });

    it('should return error when all providers fail', async () => {
      process.env.GROQ_API_KEY = 'test-key';
      mockedGenerateText.mockRejectedValue(new Error('API Error'));

      const result = await processWithAI({
        prompt: 'Test',
        preferredProvider: 'groq-llama-3-3',
      });

      expect(result).toBeDefined();
      expect(result.error).toBeDefined();
    });

    it('should handle quota exceeded errors', async () => {
      process.env.GROQ_API_KEY = 'test-key';
      process.env.OPENAI_API_KEY = 'test-key';

      // First provider has quota exceeded
      mockedGenerateText
        .mockRejectedValueOnce(new Error('quota exceeded'))
        .mockResolvedValueOnce({ text: 'Fallback response' } as any);

      const result = await processWithAI({
        prompt: 'Test',
        preferredProvider: 'groq-llama-3-3',
      });

      expect(result).toBeDefined();
      expect(result.content).toBe('Fallback response');
    });

    it('should respect custom maxOutputTokens and temperature', async () => {
      process.env.GROQ_API_KEY = 'test-key';
      mockedGenerateText.mockResolvedValueOnce({ text: 'Response' } as any);

      await processWithAI({
        prompt: 'Test',
        preferredProvider: 'groq-llama-3-3',
        maxOutputTokens: 2048,
        temperature: 0.5,
      });

      expect(mockedGenerateText).toHaveBeenCalledWith(
        expect.objectContaining({
          maxOutputTokens: 2048,
          temperature: 0.5,
        })
      );
    });
  });

  describe('getProviderStatus', () => {
    it('should return status for all providers', () => {
      const status = getProviderStatus();

      expect(status).toBeInstanceOf(Array);
      expect(status.length).toBeGreaterThan(0);

      status.forEach(providerStatus => {
        expect(providerStatus).toHaveProperty('provider');
        expect(providerStatus).toHaveProperty('available');
        expect(providerStatus).toHaveProperty('info');
        expect(typeof providerStatus.available).toBe('boolean');
      });
    });

    it('should reflect API key configuration in availability', () => {
      process.env.GROQ_API_KEY = 'test-key';
      delete process.env.ANTHROPIC_API_KEY;

      const status = getProviderStatus();
      const groqStatus = status.find(s => s.provider === 'groq-llama-3-3');
      const anthropicStatus = status.find(s => s.provider === 'claude-3-5-sonnet');

      expect(groqStatus?.available).toBe(true);
      expect(anthropicStatus?.available).toBe(false);
    });
  });

  describe('Error Classification', () => {
    beforeEach(() => {
      process.env.GROQ_API_KEY = 'test-key';
    });

    it('should detect rate limit errors', async () => {
      mockedGenerateText.mockRejectedValueOnce({
        message: 'Rate limit exceeded',
        statusCode: 429,
      });

      const result = await processWithAI({
        prompt: 'Test',
        preferredProvider: 'groq-llama-3-3',
      });

      expect(result.rateLimitError).toBe(true);
    });

    it('should detect quota exceeded errors', async () => {
      mockedGenerateText.mockRejectedValueOnce(new Error('insufficient_quota'));

      const result = await processWithAI({
        prompt: 'Test',
        preferredProvider: 'groq-llama-3-3',
      });

      expect(result.quotaExceeded).toBe(true);
    });

    it('should detect billing errors', async () => {
      mockedGenerateText.mockRejectedValueOnce(new Error('billing quota exceeded'));

      const result = await processWithAI({
        prompt: 'Test',
        preferredProvider: 'groq-llama-3-3',
      });

      expect(result.quotaExceeded).toBe(true);
    });
  });
});
