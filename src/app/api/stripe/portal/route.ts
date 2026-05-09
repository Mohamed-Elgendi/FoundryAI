import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

interface User {
  stripe_customer_id: string | null;
}

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      );
    }

    const { userId } = await request.json();

    // Get user's Stripe customer ID
    if (!createSupabaseClient()) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { data: user, error } = await createSupabaseClient()
      ?.from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single<User>();

    if (error || !user?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No billing account found' },
        { status: 404 }
      );
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_URL || 'https://foundryai-seven.vercel.app'}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Billing portal error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create billing portal' },
      { status: 500 }
    );
  }
}
