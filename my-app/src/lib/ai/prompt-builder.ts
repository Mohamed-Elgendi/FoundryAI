/**
 * Prompt Builder Utilities
 * Shared utilities for building structured AI prompts
 */

export interface PromptSection {
  title: string;
  content: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface PromptConfig {
  role: string;
  task: string;
  sections: PromptSection[];
  outputFormat: string;
  qualityRequirements?: string[];
}

/**
 * Build a structured prompt from configuration
 */
export function buildPrompt(config: PromptConfig): string {
  const parts: string[] = [];
  
  // Role definition
  parts.push(`You are ${config.role}.`);
  parts.push('');
  
  // Task description
  parts.push(`## TASK`);
  parts.push(config.task);
  parts.push('');
  
  // Sections
  config.sections.forEach(section => {
    parts.push(`## ${section.title}`);
    if (section.priority) {
      parts.push(`Priority: ${section.priority.toUpperCase()}`);
    }
    parts.push(section.content);
    parts.push('');
  });
  
  // Quality requirements
  if (config.qualityRequirements && config.qualityRequirements.length > 0) {
    parts.push(`## QUALITY REQUIREMENTS`);
    config.qualityRequirements.forEach(req => {
      parts.push(`- ${req}`);
    });
    parts.push('');
  }
  
  // Output format
  parts.push(`## OUTPUT FORMAT`);
  parts.push(config.outputFormat);
  parts.push('');
  parts.push('Return ONLY the requested output. No markdown, no explanations, no code blocks around the JSON.');
  
  return parts.join('\n');
}

/**
 * Create a market research section prompt
 */
export function createMarketResearchSection(userInput: string): string {
  return `Based on "${userInput}", provide real 2024-2025 market data:

**Market Size:**
- TAM: Total market with dollar amount (e.g., "$2.3B market in 2024")
- SAM: Serviceable segment (e.g., "$450M addressable market")
- SOM: Initial target (e.g., "$50M first-year target")
- Growth: Year-over-year percentage with trend

**Key Trends (5-7 specific 2024-2025 trends):**
- Technology shifts affecting this space
- Consumer behavior changes
- Economic or regulatory factors

**Competitor Analysis (3 real companies):**
For each: name, strengths, weaknesses, market share estimate, pricing

**Target Demographics:**
Age, income, location, job titles, pain points with data

**Market Gaps:**
3-5 specific unmet needs or opportunities`;
}

/**
 * Create a feature specification section
 */
export function createFeatureSection(count: number = 6): string {
  return `List ${count} specific MVP features. Each feature must include:
- Feature name and clear description
- What problem it solves
- How it works (user interaction)
- Business value/impact`;
}

/**
 * Create a tech stack section
 */
export function createTechStackSection(): string {
  return `List 6-8 specific tools with:
- Category (Frontend, Database, AI, etc.)
- Tool name with version
- Purpose (what it does)
- Cost (isFree: true/false)

Use only real, currently available tools. No placeholders.`;
}

/**
 * Create a build plan section
 */
export function createBuildPlanSection(steps: number = 8): string {
  return `Provide ${steps} sequential build steps. Each step must have:
- Step number and title
- Detailed description (what to do)
- Estimated time
- aiToolAction: Specific AI prompt for Windsurf/Cursor`;
}

/**
 * Create monetization section
 */
export function createMonetizationSection(): string {
  return `Provide complete monetization strategy:
- Revenue model name
- Pricing structure with specific tiers
- 5-7 tactics for acquiring first users
- Revenue estimate with timeline`;
}
