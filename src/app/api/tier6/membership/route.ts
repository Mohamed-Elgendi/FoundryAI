/**
 * Tier 6 Monetization API Routes
 * Membership, revenue tracking, affiliate system
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';

// GET /api/tier6/membership - Get user's membership and coins
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get current subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        membership_tiers (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // Get coin balance
    const { data: coins } = await supabase
      .from('foundry_coins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get recent coin transactions
    const { data: transactions } = await supabase
      .from('coin_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get available membership tiers
    const { data: tiers } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('is_active', true)
      .eq('is_public', true)
      .order('display_order', { ascending: true });

    return NextResponse.json({
      subscription,
      coins: coins || { balance: 0 },
      transactions: transactions || [],
      tiers: tiers || [],
    });
  } catch (error) {
    console.error('Error fetching membership data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch membership data' },
      { status: 500 }
    );
  }
}

// POST /api/tier6/membership/redeem - Redeem coins for benefits
export async function POSTRedeem(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Check coin balance
    const { data: coins } = await supabase
      .from('foundry_coins')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (!coins || coins.balance < body.coinsToSpend) {
      return NextResponse.json(
        { error: 'Insufficient coins' },
        { status: 400 }
      );
    }

    // Deduct coins
    await supabase
      .from('foundry_coins')
      .update({
        balance: (coins as any).balance - body.coinsToSpend,
        lifetime_spent: ((coins as any).lifetime_spent || 0) + body.coinsToSpend,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    // Record transaction
    await supabase
      .from('coin_transactions')
      .insert({
        user_id: user.id,
        amount: -body.coinsToSpend,
        transaction_type: 'redemption',
        description: body.description,
      });

    // Record redemption
    const { data: redemption, error } = await supabase
      .from('coin_redemptions')
      .insert({
        user_id: user.id,
        redemption_type: body.redemptionType,
        coins_spent: body.coinsToSpend,
        value_received_usd: body.valueReceived,
        description: body.description,
        status: 'completed',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ redemption, success: true });
  } catch (error) {
    console.error('Error redeeming coins:', error);
    return NextResponse.json(
      { error: 'Failed to redeem coins' },
      { status: 500 }
    );
  }
}
