-- Tier 6: Monetization Layer Database Schema
-- Membership tiers, revenue tracking, affiliate system

-- ============================================================================
-- MEMBERSHIP TIERS & FOUNDER COINS
-- ============================================================================

CREATE TABLE IF NOT EXISTS membership_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  tier_name VARCHAR(100) NOT NULL UNIQUE,
  tier_slug VARCHAR(50) NOT NULL UNIQUE,
  tier_description TEXT,
  
  -- Pricing
  monthly_price_usd DECIMAL(10,2),
  annual_price_usd DECIMAL(10,2),
  
  -- Features
  features_included TEXT[],
  limits JSONB, -- Usage limits per feature
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_highlighted BOOLEAN DEFAULT FALSE,
  badge_color VARCHAR(50),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO membership_tiers (tier_name, tier_slug, tier_description, monthly_price_usd, annual_price_usd, features_included, limits, display_order, badge_color) VALUES
  ('Free Forever', 'free', 'Start with $0 and access core foundation systems', 0, 0, 
   ARRAY['Brain Dump System', 'Basic Focus Timer', 'Emotion Check-ins', '7-Dimension Tracking', 'Community Access'],
   '{"brain_dumps_per_day": 3, "focus_sessions_per_day": 5, "ai_requests_per_day": 5, "storage_mb": 100}'::jsonb,
   1, 'bg-slate-100'),
  
  ('Builder', 'builder', 'Accelerate your journey with enhanced AI assistance', 29, 290,
   ARRAY['All Free Features', 'AI Build Assistant', 'Opportunity Radar', 'Template Gallery', 'Priority Support', 'Analytics Dashboard'],
   '{"brain_dumps_per_day": 10, "focus_sessions_per_day": 20, "ai_requests_per_day": 50, "storage_mb": 1000, "opportunity_scans_per_day": 10}'::jsonb,
   2, 'bg-blue-100'),
  
  ('Founder', 'founder', 'Full platform access for serious entrepreneurs', 79, 790,
   ARRAY['All Builder Features', 'Unlimited AI Access', 'White-glove Onboarding', '1-on-1 Coaching', 'API Access', 'Custom Integrations'],
   '{"brain_dumps_per_day": -1, "focus_sessions_per_day": -1, "ai_requests_per_day": -1, "storage_mb": 10000, "opportunity_scans_per_day": -1}'::jsonb,
   3, 'bg-violet-100'),
  
  ('Scale', 'scale', 'For teams and businesses ready to scale', 199, 1990,
   ARRAY['All Founder Features', 'Team Seats (5)', 'Advanced Analytics', 'Custom Workflows', 'Dedicated Account Manager', 'SLA Guarantee'],
   '{"team_seats": 5, "brain_dumps_per_day": -1, "focus_sessions_per_day": -1, "ai_requests_per_day": -1, "storage_mb": 100000}'::jsonb,
   4, 'bg-amber-100')
ON CONFLICT (tier_slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES membership_tiers(id),
  
  -- Subscription details
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'paused'
  
  -- Billing
  billing_interval VARCHAR(20), -- 'monthly', 'annual'
  current_price_usd DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Stripe integration
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  stripe_price_id VARCHAR(100),
  
  -- Trial
  is_trial BOOLEAN DEFAULT FALSE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Dates
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Usage tracking
  usage_this_period JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_active_subscription UNIQUE (user_id, status)
  WHERE status = 'active'
);

CREATE TABLE IF NOT EXISTS foundry_coins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Coin balance
  balance INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  lifetime_spent INTEGER DEFAULT 0,
  
  -- Multipliers
  current_multiplier DECIMAL(3,2) DEFAULT 1.00,
  multiplier_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Streaks
  daily_login_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_coins UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction details
  amount INTEGER NOT NULL, -- Positive for earning, negative for spending
  transaction_type VARCHAR(50) NOT NULL, -- 'login_bonus', 'streak_bonus', 'achievement', 'purchase', 'redemption', 'referral'
  
  -- Description
  description TEXT,
  related_entity_type VARCHAR(50), -- 'achievement', 'purchase', 'redemption', 'referral'
  related_entity_id UUID,
  
  -- Multiplier applied
  multiplier_applied DECIMAL(3,2) DEFAULT 1.00,
  base_amount INTEGER, -- Before multiplier
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coin_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Redemption details
  redemption_type VARCHAR(50) NOT NULL, -- 'subscription_discount', 'feature_unlock', 'merchandise', 'coaching_session'
  
  -- Cost and value
  coins_spent INTEGER NOT NULL,
  value_received_usd DECIMAL(10,2),
  
  -- Description
  description TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'cancelled'
  
  -- For subscription discounts
  subscription_id UUID REFERENCES user_subscriptions(id),
  discount_amount_usd DECIMAL(10,2),
  
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- REVENUE TRACKING SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS revenue_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stream details
  stream_name VARCHAR(200) NOT NULL,
  stream_type VARCHAR(100) NOT NULL, -- 'saas', 'services', 'content', 'affiliate', 'product', 'other'
  
  -- Description
  description TEXT,
  business_archetype VARCHAR(100), -- From the 12 archetypes
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'discontinued'
  launched_at TIMESTAMP WITH TIME ZONE,
  
  -- Targets
  monthly_target DECIMAL(12,2),
  annual_target DECIMAL(12,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revenue_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES revenue_streams(id),
  
  -- Transaction details
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  transaction_date DATE NOT NULL,
  
  -- Type
  transaction_type VARCHAR(50), -- 'recurring', 'one_time', 'refund', 'adjustment'
  
  -- Source
  source_type VARCHAR(50), -- 'stripe', 'paypal', 'manual', 'crypto', 'other'
  external_transaction_id VARCHAR(200),
  
  -- Customer info
  customer_email VARCHAR(255),
  customer_name VARCHAR(200),
  
  -- Description
  description TEXT,
  line_items JSONB,
  
  -- Status
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_interval VARCHAR(20), -- 'monthly', 'annual', 'weekly'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_amount CHECK (amount >= 0)
);

CREATE TABLE IF NOT EXISTS revenue_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Goal details
  goal_name VARCHAR(200) NOT NULL,
  goal_type VARCHAR(50), -- 'mrr', 'arr', 'total_revenue', 'customer_count', 'churn_rate'
  
  -- Target and current
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  
  -- Progress
  progress_percentage INTEGER GENERATED ALWAYS AS (
    CASE WHEN target_amount > 0 THEN LEAST((current_amount * 100 / target_amount), 100) ELSE 0 END
  ) STORED,
  
  -- Timeline
  target_date DATE NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE,
  
  -- Status
  is_achieved BOOLEAN DEFAULT FALSE,
  achieved_at TIMESTAMP WITH TIME ZONE,
  
  -- Associated stream
  stream_id UUID REFERENCES revenue_streams(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_revenue_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  stats_date DATE NOT NULL,
  
  -- Daily totals
  total_revenue DECIMAL(12,2) DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  
  -- By type
  recurring_revenue DECIMAL(12,2) DEFAULT 0,
  one_time_revenue DECIMAL(12,2) DEFAULT 0,
  
  -- By stream
  stream_breakdown JSONB DEFAULT '{}',
  
  -- Running totals
  mrr DECIMAL(12,2), -- Monthly Recurring Revenue
  arr DECIMAL(12,2), -- Annual Recurring Revenue
  
  -- Customer metrics
  new_customers INTEGER DEFAULT 0,
  churned_customers INTEGER DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_revenue_date UNIQUE (user_id, stats_date)
);

-- ============================================================================
-- AFFILIATE SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS affiliate_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  program_name VARCHAR(200) NOT NULL,
  program_description TEXT,
  
  -- Commission structure
  commission_type VARCHAR(50), -- 'percentage', 'fixed_amount'
  commission_value DECIMAL(10,2), -- Percentage (e.g., 30) or fixed amount
  
  -- Tiers
  has_tiers BOOLEAN DEFAULT FALSE,
  tier_structure JSONB, -- Array of tier objects with thresholds and commission rates
  
  -- Cookie and attribution
  cookie_duration_days INTEGER DEFAULT 30,
  attribution_model VARCHAR(50) DEFAULT 'last_click', -- 'first_click', 'last_click', 'multi_touch'
  
  -- Payout
  minimum_payout DECIMAL(10,2) DEFAULT 50.00,
  payout_methods TEXT[], -- 'paypal', 'bank_transfer', 'crypto'
  payout_schedule VARCHAR(50) DEFAULT 'monthly', -- 'weekly', 'monthly', 'on_request'
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default FoundryAI affiliate program
INSERT INTO affiliate_programs (program_name, program_description, commission_type, commission_value, has_tiers, tier_structure, cookie_duration_days, minimum_payout) VALUES
  ('FoundryAI Referral Program', 'Refer others to FoundryAI and earn commission on their subscriptions', 'percentage', 30, TRUE, 
   '[{"tier": 1, "name": "Starter", "min_referrals": 0, "commission": 30}, {"tier": 2, "name": "Pro", "min_referrals": 10, "commission": 35}, {"tier": 3, "name": "Elite", "min_referrals": 25, "commission": 40}]'::jsonb,
   60, 50.00)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES affiliate_programs(id),
  
  -- Affiliate details
  affiliate_code VARCHAR(50) NOT NULL UNIQUE,
  referral_link TEXT,
  
  -- Tracking
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  
  -- Earnings
  total_earnings DECIMAL(12,2) DEFAULT 0,
  pending_earnings DECIMAL(12,2) DEFAULT 0,
  paid_earnings DECIMAL(12,2) DEFAULT 0,
  
  -- Tier
  current_tier INTEGER DEFAULT 1,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Payout info
  payout_method VARCHAR(50),
  payout_details JSONB, -- Encrypted payout info
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_program UNIQUE (user_id, program_id)
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id),
  
  -- Click details
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,
  landing_page TEXT,
  
  -- Device info
  device_type VARCHAR(50),
  browser VARCHAR(100),
  country VARCHAR(100),
  
  -- Attribution
  converted_to_sale BOOLEAN DEFAULT FALSE,
  conversion_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id),
  click_id UUID REFERENCES affiliate_clicks(id),
  
  -- Customer details
  customer_user_id UUID REFERENCES auth.users(id),
  customer_email VARCHAR(255),
  
  -- Conversion details
  converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Revenue
  order_value DECIMAL(12,2) NOT NULL,
  commission_amount DECIMAL(12,2) NOT NULL,
  
  -- Subscription info (if applicable)
  subscription_id UUID,
  is_recurring BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'paid'
  
  -- Payout
  paid_at TIMESTAMP WITH TIME ZONE,
  payout_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id),
  
  -- Payout details
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Method
  payout_method VARCHAR(50),
  payout_reference VARCHAR(200),
  
  -- Period covered
  period_start DATE,
  period_end DATE,
  
  -- Conversions included
  conversions_included UUID[],
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  
  -- Timestamps
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- MILESTONE ACHIEVEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS milestone_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Milestone details
  milestone_name VARCHAR(200) NOT NULL,
  milestone_category VARCHAR(100), -- 'revenue', 'customers', 'product', 'personal'
  
  -- Achievement criteria
  criteria_type VARCHAR(50), -- 'mrr', 'arr', 'total_revenue', 'customer_count', 'launch'
  criteria_value DECIMAL(12,2),
  
  -- Status
  is_achieved BOOLEAN DEFAULT FALSE,
  achieved_at TIMESTAMP WITH TIME ZONE,
  
  -- Reward
  reward_coins INTEGER DEFAULT 0,
  reward_badge VARCHAR(100),
  
  -- Evidence
  evidence_data JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default milestones
INSERT INTO milestone_achievements (milestone_name, milestone_category, criteria_type, criteria_value, is_achieved, reward_coins, reward_badge) VALUES
  ('First Dollar', 'revenue', 'total_revenue', 1, FALSE, 100, 'first-dollar'),
  ('$100 Club', 'revenue', 'total_revenue', 100, FALSE, 250, 'hundred-club'),
  ('$1K Milestone', 'revenue', 'total_revenue', 1000, FALSE, 500, 'one-k-club'),
  ('$10K Achieved', 'revenue', 'total_revenue', 10000, FALSE, 1000, 'ten-k-club'),
  ('$100K Master', 'revenue', 'total_revenue', 100000, FALSE, 2500, 'hundred-k-master'),
  ('First Customer', 'customers', 'customer_count', 1, FALSE, 100, 'first-customer'),
  ('10 Customers', 'customers', 'customer_count', 10, FALSE, 250, 'ten-customers'),
  ('100 Customers', 'customers', 'customer_count', 100, FALSE, 500, 'hundred-customers'),
  ('First Launch', 'product', 'launch', 1, FALSE, 500, 'launcher')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundry_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_revenue_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own subscriptions" ON user_subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own coins" ON foundry_coins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own coin transactions" ON coin_transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own coin redemptions" ON coin_redemptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own revenue streams" ON revenue_streams
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own revenue transactions" ON revenue_transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own revenue goals" ON revenue_goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own revenue stats" ON daily_revenue_stats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own affiliate data" ON affiliates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own affiliate clicks" ON affiliate_clicks
  FOR ALL USING (EXISTS (
    SELECT 1 FROM affiliates WHERE id = affiliate_clicks.affiliate_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can only access their own affiliate conversions" ON affiliate_conversions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM affiliates WHERE id = affiliate_conversions.affiliate_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can only access their own affiliate payouts" ON affiliate_payouts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM affiliates WHERE id = affiliate_payouts.affiliate_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can only access their own milestones" ON milestone_achievements
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_subscriptions_user_status ON user_subscriptions(user_id, status);
CREATE INDEX idx_coin_transactions_user_type ON coin_transactions(user_id, transaction_type);
CREATE INDEX idx_revenue_streams_user_type ON revenue_streams(user_id, stream_type);
CREATE INDEX idx_revenue_transactions_user_date ON revenue_transactions(user_id, transaction_date DESC);
CREATE INDEX idx_revenue_goals_user_status ON revenue_goals(user_id, is_achieved);
CREATE INDEX idx_revenue_stats_user_date ON daily_revenue_stats(user_id, stats_date DESC);
CREATE INDEX idx_affiliates_user_program ON affiliates(user_id, program_id);
CREATE INDEX idx_affiliate_clicks_affiliate_date ON affiliate_clicks(affiliate_id, clicked_at DESC);
CREATE INDEX idx_affiliate_conversions_affiliate_status ON affiliate_conversions(affiliate_id, status);
CREATE INDEX idx_milestones_user_achieved ON milestone_achievements(user_id, is_achieved);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER update_membership_tiers_updated_at BEFORE UPDATE ON membership_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foundry_coins_updated_at BEFORE UPDATE ON foundry_coins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_streams_updated_at BEFORE UPDATE ON revenue_streams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_goals_updated_at BEFORE UPDATE ON revenue_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_revenue_stats_updated_at BEFORE UPDATE ON daily_revenue_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_conversions_updated_at BEFORE UPDATE ON affiliate_conversions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_payouts_updated_at BEFORE UPDATE ON affiliate_payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestone_achievements_updated_at BEFORE UPDATE ON milestone_achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
