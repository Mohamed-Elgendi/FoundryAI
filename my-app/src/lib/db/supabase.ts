import { createClient } from '@supabase/supabase-js';
import { FeedbackData, StoredPattern, FoundryAIOutput } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if credentials are available
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function storeFeedback(feedback: FeedbackData): Promise<void> {
  if (!supabase) {
    console.log('Supabase not configured, skipping feedback storage');
    return;
  }
  
  const { error } = await supabase
    .from('feedback')
    .insert({
      user_input: feedback.userInput,
      output_json: feedback.output,
      is_helpful: feedback.isHelpful,
      user_agent: feedback.userAgent,
      created_at: feedback.timestamp,
    });

  if (error) {
    console.error('Error storing feedback:', error);
    throw error;
  }
}

export async function getSuccessfulPatterns(limit: number = 50): Promise<StoredPattern[]> {
  if (!supabase) {
    console.log('Supabase not configured, returning empty patterns');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('is_helpful', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching patterns:', error);
      return [];
    }

    return data?.map((item: { user_input: string; output_json: FoundryAIOutput }) => ({
      inputPattern: extractPattern(item.user_input),
      outputStructure: JSON.stringify(item.output_json),
      successRate: 1,
      usageCount: 1,
      lastUsed: new Date().toISOString(),
    })) || [];
  } catch (err) {
    console.error('Exception fetching patterns:', err);
    return [];
  }
}

export async function getFeedbackStats(): Promise<{ total: number; helpful: number }> {
  if (!supabase) {
    return { total: 0, helpful: 0 };
  }
  
  try {
    const { count: total, error: totalError } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true });

    const { count: helpful, error: helpfulError } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('is_helpful', true);

    if (totalError || helpfulError) {
      console.error('Error fetching stats:', totalError || helpfulError);
      return { total: 0, helpful: 0 };
    }

    return { total: total || 0, helpful: helpful || 0 };
  } catch (err) {
    console.error('Exception fetching stats:', err);
    return { total: 0, helpful: 0 };
  }
}

function extractPattern(input: string): string {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('app') || lowerInput.includes('application')) return 'app';
  if (lowerInput.includes('website') || lowerInput.includes('site')) return 'website';
  if (lowerInput.includes('tool') || lowerInput.includes('utility')) return 'tool';
  if (lowerInput.includes('saas') || lowerInput.includes('platform')) return 'saas';
  return 'general';
}
