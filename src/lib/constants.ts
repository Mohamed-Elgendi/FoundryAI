/**
 * Project Constants
 * 
 * Centralized configuration values for the FoundryAI project.
 */

export const DATABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// OpenAI Configuration
export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
export const OPENAI_TEMPERATURE = 0.7;

// Stripe Plans
export const STRIPE_PLANS = {
  free: {
    id: "price_free",
    name: "Free",
    price: 0,
    features: ["Up to 3 guides", "Basic analytics", "Community support"],
  },
  pro: {
    id: "price_pro",
    name: "Pro",
    price: 2900, // $29.00 in cents
    interval: "month" as const,
    features: [
      "Unlimited guides",
      "Advanced analytics",
      "AI curriculum builder",
      "Priority support",
      "Custom branding",
    ],
  },
  enterprise: {
    id: "price_enterprise",
    name: "Enterprise",
    price: 9900, // $99.00 in cents
    interval: "month" as const,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "SSO/SAML",
    ],
  },
} as const;

// Feature Flags
export const FEATURES = {
  aiCurriculumBuilder: process.env.NEXT_PUBLIC_AI_CURRICULUM_BUILDER !== "false",
  teamCollaboration: process.env.NEXT_PUBLIC_TEAM_COLLABORATION !== "false",
  liveSessions: process.env.NEXT_PUBLIC_LIVE_SESSIONS !== "false",
  certificates: process.env.NEXT_PUBLIC_CERTIFICATES !== "false",
} as const;

// Pagination
export const PAGINATION = {
  defaultPerPage: 10,
  maxPerPage: 50,
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  api: {
    window: 60 * 1000, // 1 minute
    max: 30,
  },
  auth: {
    window: 15 * 60 * 1000, // 15 minutes
    max: 5,
  },
  ai: {
    window: 60 * 1000, // 1 minute
    max: 10,
  },
} as const;
