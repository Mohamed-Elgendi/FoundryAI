import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Lazy initialization
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return supabase;
}

/**
 * POST /api/revenue
 * Record new revenue entry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, source, date, description } = body;

    if (!userId || !amount || !source) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for milestones
    const milestone = checkMilestone(amount);

    const revenueData = {
      user_id: userId,
      amount,
      source,
      date: date || new Date().toISOString(),
      description,
      milestone_triggered: milestone
    };

    const { data, error } = await getSupabaseClient()
      .from('revenue')
      .insert(revenueData as any)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      milestone
    });

  } catch (error) {
    console.error('Error recording revenue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record revenue' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/revenue?userId=xxx
 * Get revenue history for user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabaseClient()
      .from('revenue')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    // Calculate stats
    const revenueData = data || [];
    const totalRevenue = revenueData.reduce((sum, r: any) => sum + parseFloat(r.amount || 0), 0);
    const thisMonth = revenueData.filter((r: any) => {
      const d = new Date(r.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((sum, r: any) => sum + parseFloat(r.amount || 0), 0);

    return NextResponse.json({
      success: true,
      revenue: data || [],
      stats: {
        total: totalRevenue,
        thisMonth,
        count: data?.length || 0
      }
    });

  } catch (error) {
    console.error('Error fetching revenue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revenue' },
      { status: 500 }
    );
  }
}

function checkMilestone(amount: number): string | null {
  if (amount >= 1000) return '$1K_ACHIEVED';
  if (amount >= 100) return '$100_ACHIEVED';
  if (amount >= 10) return '$10_ACHIEVED';
  return null;
}
