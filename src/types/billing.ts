// Billing & Credit System Types - ACTUAL IMPLEMENTATION
// Generated during BEAST MODE execution

export interface UserCredits {
  id: string;
  userId: string;
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  lastPurchaseDate: Date;
  autoRechargeEnabled: boolean;
  autoRechargeThreshold: number;
  autoRechargeAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = 'purchase' | 'usage' | 'bonus' | 'refund' | 'referral';

export interface CreditTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  metadata?: Record<string, any>;
  stripePaymentIntentId?: string;
  createdAt: Date;
}

export interface UsageRecord {
  id: string;
  userId: string;
  featureType: string;
  aiProvider?: string;
  modelUsed?: string;
  inputTokens: number;
  outputTokens: number;
  creditsConsumed: number;
  durationMs?: number;
  success: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface PricingTier {
  id: string;
  name: string;
  featureType: string;
  basePriceCredits: number;
  perTokenPrice: number;
  minimumCharge: number;
  maximumCharge?: number;
  active: boolean;
  createdAt: Date;
}

export interface CreditPlan {
  id: string;
  stripePriceId: string;
  name: string;
  monthlyCredits: number;
  bonusCredits: number;
  rolloverCredits: boolean;
  priceCents: number;
  currency: string;
  active: boolean;
  features: string[];
}

export interface CreditCalculation {
  inputTokens: number;
  outputTokens: number;
  baseCharge: number;
  tokenCharge: number;
  totalCredits: number;
  breakdown: {
    base: number;
    input: number;
    output: number;
  };
}

export interface UsageStats {
  totalCredits: number;
  totalCalls: number;
  byFeature: Record<string, { credits: number; calls: number }>;
  byModel: Record<string, { credits: number; calls: number }>;
}

// Credit packages for purchase
export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceCents: number;
  bonusCredits: number;
  popular?: boolean;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 1000,
    priceCents: 999, // $9.99
    bonusCredits: 0
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 5000,
    priceCents: 3999, // $39.99
    bonusCredits: 500,
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 20000,
    priceCents: 9999, // $99.99
    bonusCredits: 3000
  }
];

// Default pricing tiers
export const DEFAULT_PRICING_TIERS: Omit<PricingTier, 'id' | 'createdAt'>[] = [
  {
    name: 'AI Text Generation',
    featureType: 'ai_generation',
    basePriceCredits: 1,
    perTokenPrice: 0.0001,
    minimumCharge: 1,
    maximumCharge: 500,
    active: true
  },
  {
    name: 'Image Generation',
    featureType: 'image_creation',
    basePriceCredits: 10,
    perTokenPrice: 0,
    minimumCharge: 10,
    maximumCharge: 50,
    active: true
  },
  {
    name: 'Document Analysis',
    featureType: 'document_analysis',
    basePriceCredits: 5,
    perTokenPrice: 0.0002,
    minimumCharge: 5,
    maximumCharge: 200,
    active: true
  },
  {
    name: 'API Call',
    featureType: 'api_call',
    basePriceCredits: 0,
    perTokenPrice: 0.00005,
    minimumCharge: 1,
    maximumCharge: 100,
    active: true
  }
];
