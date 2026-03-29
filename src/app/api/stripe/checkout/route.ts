import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe';

export async function POST(request: Request) {
  try {
    const { priceId, userId, userEmail, tier } = await request.json();

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://foundryai-seven.vercel.app'}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://foundryai-seven.vercel.app'}/pricing?canceled=true`,
      metadata: {
        userId,
        tier,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
