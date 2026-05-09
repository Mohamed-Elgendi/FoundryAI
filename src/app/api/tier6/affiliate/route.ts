/**
 * Tier 6 Affiliate API Routes
 * Affiliate tracking, conversions, payouts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from '@/layer-1-security/auth/route-handler';

// GET /api/tier6/affiliate - Get user's affiliate data
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get affiliate profile
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select(`
        *,
        affiliate_programs (
          program_name,
          commission_type,
          commission_value
        )
      `)
      .eq('user_id', user.id)
      .single();

    // Get recent clicks
    const { data: clicks } = await supabase
      .from('affiliate_clicks')
      .select('*')
      .eq('affiliate_id', affiliate?.id)
      .gte('clicked_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('clicked_at', { ascending: false })
      .limit(50);

    // Get conversions
    const { data: conversions } = await supabase
      .from('affiliate_conversions')
      .select('*')
      .eq('affiliate_id', affiliate?.id)
      .order('converted_at', { ascending: false });

    // Get payouts
    const { data: payouts } = await supabase
      .from('affiliate_payouts')
      .select('*')
      .eq('affiliate_id', affiliate?.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      affiliate,
      clicks: clicks || [],
      conversions: conversions || [],
      payouts: payouts || [],
      stats: {
        totalClicks: affiliate?.total_clicks || 0,
        totalConversions: affiliate?.total_conversions || 0,
        totalEarnings: affiliate?.total_earnings || 0,
        pendingEarnings: affiliate?.pending_earnings || 0,
        conversionRate: affiliate?.total_clicks > 0 
          ? ((affiliate.total_conversions / affiliate.total_clicks) * 100).toFixed(2)
          : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching affiliate data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affiliate data' },
      { status: 500 }
    );
  }
}

// POST /api/tier6/affiliate/register - Register as affiliate
export async function POSTRegister(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Get default program
    const { data: program } = await supabase
      .from('affiliate_programs')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (!program) {
      return NextResponse.json(
        { error: 'No active affiliate program' },
        { status: 400 }
      );
    }

    // Generate affiliate code
    const affiliateCode = `FA${user.id.slice(0, 8).toUpperCase()}`;

    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        user_id: user.id,
        program_id: program.id,
        affiliate_code: affiliateCode,
        referral_link: `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${affiliateCode}`,
        payout_method: body.payoutMethod,
        payout_details: body.payoutDetails,
        approved_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ affiliate: data, success: true });
  } catch (error) {
    console.error('Error registering affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to register affiliate' },
      { status: 500 }
    );
  }
}

// POST /api/tier6/affiliate/track-click - Track affiliate click
export async function POSTTrackClick(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient();
  try {
    const body = await request.json();

    // Find affiliate by code
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id, user_id')
      .eq('affiliate_code', body.code)
      .single();

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Invalid affiliate code' },
        { status: 404 }
      );
    }

    // Record click
    await supabase
      .from('affiliate_clicks')
      .insert({
        affiliate_id: affiliate.id,
        ip_address: body.ipAddress,
        user_agent: body.userAgent,
        referrer_url: body.referrer,
        landing_page: body.landingPage,
        device_type: body.deviceType,
        browser: body.browser,
        country: body.country,
      });

    // Update affiliate click count
    await supabase
      .from('affiliates')
      .update({
        total_clicks: supabase.rpc('increment', { x: 1 }),
        unique_clicks: body.isUnique ? supabase.rpc('increment', { x: 1 }) : undefined,
      })
      .eq('id', affiliate.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
