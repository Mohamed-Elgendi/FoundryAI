import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeKey 
  ? new Stripe(stripeKey, {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    })
  : null;

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

// Price IDs (to be set in environment variables)
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
  ENTERPRISE_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
};

// Feature limits per tier
export const TIER_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    plansPerMonth: 5,
    refinementsPerPlan: 2,
    canExport: false,
    canAccessRadar: true,
    support: 'community',
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    plansPerMonth: 50,
    refinementsPerPlan: 10,
    canExport: true,
    canAccessRadar: true,
    support: 'email',
  },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: {
    plansPerMonth: -1, // unlimited
    refinementsPerPlan: -1, // unlimited
    canExport: true,
    canAccessRadar: true,
    support: 'priority',
  },
};
