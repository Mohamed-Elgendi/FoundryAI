import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook verification failed:", err);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient(await cookies());

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session?.metadata?.userId;
        const priceId = session?.line_items?.data[0]?.price?.id;

        if (userId && priceId) {
          // Update user's subscription
          const { error } = await supabase
            .from("profiles")
            .update({
              stripe_subscription_id: session.subscription as string,
              membership_tier: getTierFromPrice(priceId),
              stripe_customer_id: session.customer as string,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);

          if (error) console.error("Error updating profile:", error);

          // Award welcome credits for new subscribers
          const { error: creditsError } = await supabase.rpc("add_credits", {
            p_user_id: userId,
            p_amount: 100,
            p_reason: "welcome_subscription",
          });

          if (creditsError) console.error("Error adding credits:", creditsError);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
        const subscriptionId = typeof (invoice as any).subscription === "string"
          ? (invoice as any).subscription
          : (invoice as any).subscription?.id || null;

        if (!subscriptionId) break;

        // Get user by subscription
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscriptionId)
          .single();

        if (profile) {
          // Add monthly credits
          const { error } = await supabase.rpc("add_credits", {
            p_user_id: profile.id,
            p_amount: 200,
            p_reason: "monthly_renewal",
          });

          if (error) console.error("Error adding renewal credits:", error);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
        const subscriptionId = typeof (invoice as any).subscription === "string"
          ? (invoice as any).subscription
          : (invoice as any).subscription?.id || null;

        if (!subscriptionId) break;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscriptionId)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({
              payment_failed: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price?.id;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (profile && priceId) {
          await supabase
            .from("profiles")
            .update({
              membership_tier: getTierFromPrice(priceId),
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({
              membership_tier: "free",
              stripe_subscription_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle one-time payments (credit packs)
        const userId = paymentIntent?.metadata?.userId;
        const credits = parseInt(paymentIntent?.metadata?.credits || "0");

        if (userId && credits > 0) {
          const { error } = await supabase.rpc("add_credits", {
            p_user_id: userId,
            p_amount: credits,
            p_reason: "credit_pack_purchase",
          });

          if (error) console.error("Error adding purchased credits:", error);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

function getTierFromPrice(priceId: string): string {
  if (priceId.includes("starter")) return "starter";
  if (priceId.includes("pro")) return "pro";
  if (priceId.includes("elite")) return "elite";
  if (priceId.includes("legend")) return "legend";
  return "free";
}
