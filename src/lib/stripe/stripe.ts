import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as Stripe.LATEST_API_VERSION,
  typescript: true,
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export const STRIPE_PRICING = {
  starter: {
    id: "price_starter", // Replace with actual Stripe price ID
    name: "Starter",
    amount: 1900, // $19.00 in cents
    interval: "month" as const,
  },
  pro: {
    id: "price_pro",
    name: "Pro",
    amount: 4900,
    interval: "month" as const,
  },
  elite: {
    id: "price_elite",
    name: "Elite",
    amount: 9900,
    interval: "month" as const,
  },
  legend: {
    id: "price_legend",
    name: "Legend",
    amount: 19900,
    interval: "month" as const,
  },
};

export const CREDIT_PACKAGES = [
  { id: "credits_100", name: "Starter Pack", credits: 100, price: 999 },
  { id: "credits_500", name: "Pro Pack", credits: 500, price: 2999 },
  { id: "credits_1000", name: "Elite Pack", credits: 1000, price: 4999 },
  { id: "credits_5000", name: "Legend Pack", credits: 5000, price: 19999 },
];
