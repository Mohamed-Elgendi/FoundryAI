/**
 * AI Providers Module
 * Provider configurations and factory
 */

export interface ProviderConfig {
  id: string;
  name: string;
  apiKeyEnv: string;
  baseURL?: string;
  models: string[];
}

export const providers: ProviderConfig[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    models: ['claude-3-5-sonnet', 'claude-3-5-haiku', 'claude-3-opus']
  },
  {
    id: 'openai',
    name: 'OpenAI',
    apiKeyEnv: 'OPENAI_API_KEY',
    models: ['gpt-4o', 'gpt-4o-mini']
  },
  {
    id: 'groq',
    name: 'Groq',
    apiKeyEnv: 'GROQ_API_KEY',
    models: ['llama-3.3-70b', 'mixtral-8x7b']
  }
];

export function getProviderConfig(id: string): ProviderConfig | undefined {
  return providers.find((p) => p.id === id);
}
