import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe';
import { createSupabaseClient } from '@/layer-3-data/storage/supabase-client';

type UserUpdate = {
  subscription_tier?: string;
  subscription_status?: string;
  stripe_customer_id?: string;
  subscription_period_start?: string;
  updated_at?: string;
};

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    );
  }

  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId as string | undefined;
        const tier = session.metadata?.tier as string | undefined;

        if (userId && tier && createSupabaseClient()) {
          const customerId = typeof session.customer === 'string' 
            ? session.customer 
            : null;

          if (customerId) {
            const updateData: UserUpdate = {
              subscription_tier: tier,
              subscription_status: 'active',
              stripe_customer_id: customerId,
              subscription_period_start: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            await createSupabaseClient()
              .from('users')
              .update(updateData as any)
              .eq('id', userId);
          }
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        
        if (createSupabaseClient()) {
          const updateData: UserUpdate = {
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          };

          await createSupabaseClient()
            .from('users')
            .update(updateData as any)
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        if (createSupabaseClient()) {
          const updateData: UserUpdate = {
            subscription_tier: 'free',
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          };

          await createSupabaseClient()
            .from('users')
            .update(updateData as any)
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
