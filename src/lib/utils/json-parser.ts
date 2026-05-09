/**
 * Shared JSON Parser Utility for AI Responses
 * Handles extraction, cleaning, and validation of JSON from AI outputs
 */

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  rawSnippet?: string;
}

/**
 * Extract JSON from markdown code blocks or raw text
 */
export function extractJSON(response: string): string {
  let jsonStr = response;
  
  // Try multiple code block patterns
  const patterns = [
    /```json\s*([\s\S]*?)```/,  // ```json ... ```
    /```\s*([\s\S]*?)```/,      // ``` ... ```
    /`{3,}\s*([\s\S]*?)`{3,}/,  // any triple backticks
  ];
  
  for (const pattern of patterns) {
    const match = response.match(pattern);
    if (match && match[1]) {
      jsonStr = match[1];
      break;
    }
  }
  
  // Find JSON object boundaries - look for outermost braces
  const firstBrace = jsonStr.indexOf('{');
  const lastBrace = jsonStr.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  }
  
  return jsonStr;
}

/**
 * Clean JSON string by handling newlines, tabs, and special characters
 */
export function cleanJSON(jsonStr: string): string {
  let cleaned = '';
  let inString = false;
  let escaped = false;
  
  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];
    
    if (!inString) {
      if (char === '"') {
        inString = true;
        cleaned += char;
      } else if (char === '\n' || char === '\r' || char === '\t') {
        cleaned += ' ';
      } else {
        cleaned += char;
      }
    } else {
      if (escaped) {
        cleaned += char;
        escaped = false;
      } else if (char === '\\') {
        cleaned += char;
        escaped = true;
      } else if (char === '"') {
        inString = false;
        cleaned += char;
      } else if (char === '\n') {
        cleaned += '\\n';
      } else if (char === '\r') {
        cleaned += '\\r';
      } else if (char === '\t') {
        cleaned += '\\t';
      } else {
        cleaned += char;
      }
    }
  }
  
  // Remove trailing commas
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
  
  return cleaned.trim();
}

/**
 * Parse and validate JSON with comprehensive error handling
 */
export function parseJSON<T>(response: string, validator?: (data: unknown) => T | null): ParseResult<T> {
  try {
    // Extract
    let jsonStr = extractJSON(response);
    
    // Clean
    jsonStr = cleanJSON(jsonStr);
    
    // Parse
    const parsed = JSON.parse(jsonStr);
    
    // Validate if validator provided
    if (validator) {
      const validated = validator(parsed);
      if (!validated) {
        return {
          success: false,
          error: 'Validation failed',
          rawSnippet: response.slice(0, 500)
        };
      }
      return { success: true, data: validated };
    }
    
    return { success: true, data: parsed as T };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
      rawSnippet: response.slice(0, 1000)
    };
  }
}
