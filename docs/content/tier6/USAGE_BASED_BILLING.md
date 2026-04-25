# Usage-Based Billing System - COMPLETE TECHNICAL SPECIFICATION
## ACTUAL Implementation Guide for Beast Mode

---

## 1. Executive Overview

**Purpose:** Track and bill users based on actual AI/API usage
**Business Impact:** 25% increase in revenue through fair pricing
**Key Metric:** Pay only for what you use - attracts price-sensitive users
**Implementation Priority:** HIGH

---

## 2. Core Components

### 2.1 Database Schema

```sql
-- Credit System (FoundryCoins)
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  lifetime_spent INTEGER DEFAULT 0,
  last_purchase_date TIMESTAMP,
  auto_recharge_enabled BOOLEAN DEFAULT FALSE,
  auto_recharge_threshold INTEGER DEFAULT 100,
  auto_recharge_amount INTEGER DEFAULT 1000,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Credit Transactions
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20), -- 'purchase', 'usage', 'bonus', 'refund', 'referral'
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  metadata JSONB,
  stripe_payment_intent_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking (per API call)
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_type VARCHAR(50), -- 'ai_generation', 'image_creation', 'document_analysis', 'api_call'
  ai_provider VARCHAR(50),
  model_used VARCHAR(50),
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  credits_consumed INTEGER NOT NULL,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pricing Tiers
CREATE TABLE pricing_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50),
  feature_type VARCHAR(50),
  base_price_credits INTEGER,
  per_token_price DECIMAL(10, 6),
  minimum_charge INTEGER DEFAULT 1,
  maximum_charge INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscription Plans with Credits
CREATE TABLE credit_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_price_id VARCHAR(100) UNIQUE,
  name VARCHAR(50),
  monthly_credits INTEGER,
  bonus_credits INTEGER DEFAULT 0,
  rollover_credits BOOLEAN DEFAULT FALSE,
  price_cents INTEGER,
  currency VARCHAR(3) DEFAULT 'USD',
  active BOOLEAN DEFAULT TRUE,
  features JSONB
);
```

### 2.2 TypeScript Types

```typescript
// src/types/billing.ts

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
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'usage' | 'bonus' | 'refund' | 'referral';
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
  features: string[];
}

// Credit consumption calculation
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
```

### 2.3 Billing Service Implementation

```typescript
// src/layer-3-data/services/billing-service.ts

import { supabase } from '@/lib/supabase';
import type {
  UserCredits,
  CreditTransaction,
  UsageRecord,
  CreditCalculation,
  PricingTier
} from '@/types/billing';

export class BillingService {
  private static instance: BillingService;
  private pricingCache: Map<string, PricingTier> = new Map();

  static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  // Get or create user credits
  async getUserCredits(userId: string): Promise<UserCredits> {
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Create new credits record
      const { data: newCredits, error: createError } = await supabase
        .from('user_credits')
        .insert({ user_id: userId, balance: 0 })
        .select()
        .single();

      if (createError) throw createError;
      return newCredits;
    }

    if (error) throw error;
    return data;
  }

  // Calculate credits for AI usage
  async calculateCredits(
    featureType: string,
    inputTokens: number,
    outputTokens: number
  ): Promise<CreditCalculation> {
    // Get pricing for feature
    const pricing = await this.getPricingTier(featureType);

    const baseCharge = pricing.basePriceCredits;
    const inputCharge = Math.ceil(inputTokens * pricing.perTokenPrice);
    const outputCharge = Math.ceil(outputTokens * pricing.perTokenPrice * 2); // Output is 2x

    let totalCredits = baseCharge + inputCharge + outputCharge;

    // Apply min/max bounds
    totalCredits = Math.max(pricing.minimumCharge, totalCredits);
    if (pricing.maximumCharge) {
      totalCredits = Math.min(pricing.maximumCharge, totalCredits);
    }

    return {
      inputTokens,
      outputTokens,
      baseCharge,
      tokenCharge: inputCharge + outputCharge,
      totalCredits,
      breakdown: {
        base: baseCharge,
        input: inputCharge,
        output: outputCharge
      }
    };
  }

  // Consume credits for usage
  async consumeCredits(
    userId: string,
    featureType: string,
    credits: number,
    metadata: Record<string, any> = {}
  ): Promise<{ success: boolean; remainingBalance: number; transaction: CreditTransaction }> {
    // Check balance
    const userCredits = await this.getUserCredits(userId);

    if (userCredits.balance < credits) {
      // Try auto-recharge if enabled
      if (userCredits.autoRechargeEnabled && userCredits.balance < userCredits.autoRechargeThreshold) {
        await this.triggerAutoRecharge(userId);
        // Recheck balance
        const updatedCredits = await this.getUserCredits(userId);
        if (updatedCredits.balance < credits) {
          return {
            success: false,
            remainingBalance: updatedCredits.balance,
            transaction: null as any
          };
        }
      } else {
        return {
          success: false,
          remainingBalance: userCredits.balance,
          transaction: null as any
        };
      }
    }

    // Deduct credits
    const { data: updated, error: updateError } = await supabase
      .from('user_credits')
      .update({
        balance: userCredits.balance - credits,
        lifetime_spent: userCredits.lifetimeSpent + credits,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Create transaction record
    const { data: transaction, error: transError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        type: 'usage',
        amount: -credits,
        balance_after: updated.balance,
        description: `Usage: ${featureType}`,
        metadata
      })
      .select()
      .single();

    if (transError) throw transError;

    // Create usage record
    await supabase.from('usage_records').insert({
      user_id: userId,
      feature_type: featureType,
      credits_consumed: credits,
      ...metadata
    });

    return {
      success: true,
      remainingBalance: updated.balance,
      transaction
    };
  }

  // Purchase credits
  async purchaseCredits(
    userId: string,
    amount: number,
    stripePaymentIntentId: string
  ): Promise<UserCredits> {
    const userCredits = await this.getUserCredits(userId);

    const { data: updated, error } = await supabase
      .from('user_credits')
      .update({
        balance: userCredits.balance + amount,
        lifetime_earned: userCredits.lifetimeEarned + amount,
        last_purchase_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    // Record transaction
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      type: 'purchase',
      amount: amount,
      balance_after: updated.balance,
      description: `Purchased ${amount} credits`,
      stripe_payment_intent_id: stripePaymentIntentId
    });

    return updated;
  }

  // Award bonus credits
  async awardBonusCredits(
    userId: string,
    amount: number,
    reason: string
  ): Promise<UserCredits> {
    const userCredits = await this.getUserCredits(userId);

    const { data: updated, error } = await supabase
      .from('user_credits')
      .update({
        balance: userCredits.balance + amount,
        lifetime_earned: userCredits.lifetimeEarned + amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('credit_transactions').insert({
      user_id: userId,
      type: 'bonus',
      amount: amount,
      balance_after: updated.balance,
      description: reason
    });

    return updated;
  }

  // Get usage statistics
  async getUsageStats(
    userId: string,
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<{
    totalCredits: number;
    totalCalls: number;
    byFeature: Record<string, { credits: number; calls: number }>;
    byModel: Record<string, { credits: number; calls: number }>;
  }> {
    const startDate = this.getPeriodStart(period);

    const { data: records, error } = await supabase
      .from('usage_records')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const stats = {
      totalCredits: 0,
      totalCalls: records?.length || 0,
      byFeature: {} as Record<string, { credits: number; calls: number }>,
      byModel: {} as Record<string, { credits: number; calls: number }>
    };

    records?.forEach(record => {
      stats.totalCredits += record.credits_consumed;

      // By feature
      if (!stats.byFeature[record.feature_type]) {
        stats.byFeature[record.feature_type] = { credits: 0, calls: 0 };
      }
      stats.byFeature[record.feature_type].credits += record.credits_consumed;
      stats.byFeature[record.feature_type].calls++;

      // By model
      if (record.model_used) {
        if (!stats.byModel[record.model_used]) {
          stats.byModel[record.model_used] = { credits: 0, calls: 0 };
        }
        stats.byModel[record.model_used].credits += record.credits_consumed;
        stats.byModel[record.model_used].calls++;
      }
    });

    return stats;
  }

  // Private methods
  private async getPricingTier(featureType: string): Promise<PricingTier> {
    if (this.pricingCache.has(featureType)) {
      return this.pricingCache.get(featureType)!;
    }

    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('feature_type', featureType)
      .eq('active', true)
      .single();

    if (error) {
      // Return default pricing
      return {
        id: 'default',
        name: 'Default',
        featureType,
        basePriceCredits: 1,
        perTokenPrice: 0.0001,
        minimumCharge: 1,
        maximumCharge: 1000,
        active: true
      };
    }

    this.pricingCache.set(featureType, data);
    return data;
  }

  private async triggerAutoRecharge(userId: string): Promise<void> {
    // This would integrate with Stripe to charge the user
    // and then call purchaseCredits()
    console.log(`Auto-recharge triggered for user ${userId}`);
  }

  private getPeriodStart(period: string): string {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo.toISOString();
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return monthAgo.toISOString();
      case 'year':
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return yearAgo.toISOString();
      default:
        return new Date(0).toISOString();
    }
  }
}

export const billingService = BillingService.getInstance();
```

---

## 3. Default Pricing Configuration

```typescript
// src/config/credit-pricing.ts

export const DEFAULT_PRICING_TIERS = [
  {
    name: 'AI Text Generation',
    featureType: 'ai_generation',
    basePriceCredits: 1,
    perTokenPrice: 0.0001, // 1 credit per 10k tokens
    minimumCharge: 1,
    maximumCharge: 500
  },
  {
    name: 'Image Generation',
    featureType: 'image_creation',
    basePriceCredits: 10,
    perTokenPrice: 0,
    minimumCharge: 10,
    maximumCharge: 50
  },
  {
    name: 'Document Analysis',
    featureType: 'document_analysis',
    basePriceCredits: 5,
    perTokenPrice: 0.0002,
    minimumCharge: 5,
    maximumCharge: 200
  },
  {
    name: 'API Call',
    featureType: 'api_call',
    basePriceCredits: 0,
    perTokenPrice: 0.00005,
    minimumCharge: 1,
    maximumCharge: 100
  }
];

// Credit packages
export const CREDIT_PACKAGES = [
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
    bonusCredits: 500
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 20000,
    priceCents: 9999, // $99.99
    bonusCredits: 3000
  }
];
```

---

## 4. React Components

```typescript
// src/components/tier6/CreditDashboard.tsx
'use client';

import { useState } from 'react';
import { useCredits } from '@/hooks/useCredits';
import { Coins, TrendingUp, ShoppingCart, AlertCircle } from 'lucide-react';

export function CreditDashboard() {
  const { credits, transactions, stats, purchaseCredits } = useCredits();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const creditPackages = [
    { id: 'starter', name: 'Starter', credits: 1000, price: 9.99, bonus: 0 },
    { id: 'pro', name: 'Pro', credits: 5000, price: 39.99, bonus: 500 },
    { id: 'enterprise', name: 'Enterprise', credits: 20000, price: 99.99, bonus: 3000 }
  ];

  return (
    <div className="credit-dashboard">
      {/* Balance Card */}
      <div className="balance-card">
        <Coins className="icon" />
        <div className="balance-info">
          <span className="balance">{credits?.balance?.toLocaleString() || 0}</span>
          <span className="label">Available Credits</span>
        </div>
        <button
          onClick={() => setShowPurchaseModal(true)}
          className="purchase-btn"
        >
          <ShoppingCart className="icon" />
          Purchase Credits
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <TrendingUp className="icon" />
          <span className="value">{stats?.totalCalls || 0}</span>
          <span className="label">API Calls This Month</span>
        </div>
        <div className="stat-card">
          <Coins className="icon" />
          <span className="value">{stats?.totalCredits || 0}</span>
          <span className="label">Credits Used This Month</span>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="usage-breakdown">
        <h3>Usage by Feature</h3>
        {Object.entries(stats?.byFeature || {}).map(([feature, data]) => (
          <div key={feature} className="usage-item">
            <span className="feature">{feature}</span>
            <span className="calls">{data.calls} calls</span>
            <span className="credits">{data.credits} credits</span>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="transactions-list">
        <h3>Recent Transactions</h3>
        {transactions?.slice(0, 10).map(tx => (
          <div key={tx.id} className={`transaction ${tx.type}`}>
            <span className="type">{tx.type}</span>
            <span className={`amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount}
            </span>
            <span className="description">{tx.description}</span>
            <span className="date">{new Date(tx.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>

      {/* Low Balance Alert */}
      {credits?.balance < 100 && (
        <div className="alert low-balance">
          <AlertCircle className="icon" />
          <span>Your credit balance is running low. Purchase more credits to continue using AI features.</span>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="purchase-modal">
          <h3>Purchase Credits</h3>
          <div className="packages-grid">
            {creditPackages.map(pkg => (
              <div
                key={pkg.id}
                className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <h4>{pkg.name}</h4>
                <span className="credits">{pkg.credits.toLocaleString()} credits</span>
                {pkg.bonus > 0 && (
                  <span className="bonus">+{pkg.bonus} bonus</span>
                )}
                <span className="price">${pkg.price}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => purchaseCredits(selectedPackage!)}
            disabled={!selectedPackage}
            className="confirm-btn"
          >
            Proceed to Payment
          </button>
          <button onClick={() => setShowPurchaseModal(false)} className="cancel-btn">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 5. API Routes

```typescript
// src/app/api/tier6/credits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { billingService } from '@/layer-3-data/services/billing-service';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const credits = await billingService.getUserCredits(userId);
    return NextResponse.json(credits);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}

// src/app/api/tier6/credits/purchase/route.ts
export async function POST(request: NextRequest) {
  try {
    const { userId, amount, stripePaymentIntentId } = await request.json();
    const credits = await billingService.purchaseCredits(userId, amount, stripePaymentIntentId);
    return NextResponse.json(credits);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to purchase credits' }, { status: 500 });
  }
}

// src/app/api/tier6/usage/route.ts
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const period = request.nextUrl.searchParams.get('period') as any || 'month';

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const stats = await billingService.getUsageStats(userId, period);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch usage stats' }, { status: 500 });
  }
}
```

---

## 6. Implementation Checklist

- [ ] Create database tables (user_credits, credit_transactions, usage_records)
- [ ] Implement BillingService with all methods
- [ ] Create pricing configuration
- [ ] Build CreditDashboard React component
- [ ] Implement API routes
- [ ] Add Stripe integration for purchases
- [ ] Create usage tracking middleware
- [ ] Add low balance notifications
- [ ] Implement auto-recharge feature
- [ ] Add tests
- [ ] Deploy to production

---

**Status:** BEAST MODE SPECIFICATION - READY FOR IMPLEMENTATION
**Pricing Model:** Usage-based with token calculations
**Next Step:** Begin actual implementation
