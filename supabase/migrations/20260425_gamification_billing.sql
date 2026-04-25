-- Beast Mode Database Migration
-- Gamification & Billing Systems
-- Created: April 25, 2026

-- ============================================
-- GAMIFICATION SYSTEM
-- ============================================

-- User Points Table
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  weekly_points INTEGER DEFAULT 0,
  monthly_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  category VARCHAR(50) NOT NULL, -- 'learning', 'productivity', 'revenue', 'social'
  rarity VARCHAR(20) NOT NULL, -- 'common', 'rare', 'epic', 'legendary'
  points_awarded INTEGER DEFAULT 0,
  criteria JSONB NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- User Streaks Table
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streak_type VARCHAR(50) NOT NULL, -- 'login', 'content_creation', 'revenue', 'daily_action'
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- Leaderboard Entries Table
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'global', 'weekly', 'monthly', 'archetype', 'tier'
  archetype VARCHAR(50),
  score INTEGER DEFAULT 0,
  rank INTEGER,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category, period_start)
);

-- ============================================
-- BILLING SYSTEM
-- ============================================

-- User Credits Table
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  lifetime_spent INTEGER DEFAULT 0,
  last_purchase_date TIMESTAMP WITH TIME ZONE,
  auto_recharge_enabled BOOLEAN DEFAULT FALSE,
  auto_recharge_threshold INTEGER DEFAULT 100,
  auto_recharge_amount INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Credit Transactions Table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'purchase', 'usage', 'bonus', 'refund', 'referral'
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  metadata JSONB,
  stripe_payment_intent_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Records Table
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) NOT NULL, -- 'ai_generation', 'image_creation', 'document_analysis', 'api_call'
  ai_provider VARCHAR(50),
  model_used VARCHAR(50),
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  credits_consumed INTEGER NOT NULL,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing Tiers Table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  feature_type VARCHAR(50) NOT NULL UNIQUE,
  base_price_credits INTEGER DEFAULT 0,
  per_token_price DECIMAL(10, 6) DEFAULT 0,
  minimum_charge INTEGER DEFAULT 1,
  maximum_charge INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Plans Table (for subscriptions)
CREATE TABLE IF NOT EXISTS credit_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_price_id VARCHAR(100) UNIQUE,
  name VARCHAR(50) NOT NULL,
  monthly_credits INTEGER NOT NULL,
  bonus_credits INTEGER DEFAULT 0,
  rollover_credits BOOLEAN DEFAULT FALSE,
  price_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  active BOOLEAN DEFAULT TRUE,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Gamification Indexes
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_total_points ON user_points(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_category ON leaderboard_entries(category, score DESC);

-- Billing Indexes
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON usage_records(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_records_feature ON usage_records(feature_type, created_at DESC);

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert Default Badges
INSERT INTO badges (name, description, icon_url, category, rarity, points_awarded, criteria) VALUES
  ('First Steps', 'Complete your first action on the platform', '/badges/first-steps.svg', 'learning', 'common', 10, '{"type": "actions", "value": 1, "action": "first_action"}'),
  ('Week Warrior', 'Maintain a 7-day streak', '/badges/week-warrior.svg', 'productivity', 'rare', 100, '{"type": "streak", "value": 7}'),
  ('Point Collector', 'Earn 1,000 total points', '/badges/point-collector.svg', 'learning', 'rare', 50, '{"type": "points", "value": 1000}'),
  ('Revenue Generator', 'Generate your first revenue', '/badges/revenue-gen.svg', 'revenue', 'epic', 200, '{"type": "revenue", "value": 1}'),
  ('Month Master', 'Maintain a 30-day streak', '/badges/month-master.svg', 'productivity', 'legendary', 500, '{"type": "streak", "value": 30}'),
  ('AI Explorer', 'Use AI features 50 times', '/badges/ai-explorer.svg', 'learning', 'rare', 75, '{"type": "actions", "value": 50, "action": "ai_generation"}'),
  ('Early Adopter', 'Join during beta period', '/badges/early-adopter.svg', 'social', 'epic', 150, '{"type": "actions", "value": 1, "action": "beta_signup"}')
ON CONFLICT DO NOTHING;

-- Insert Default Pricing Tiers
INSERT INTO pricing_tiers (name, feature_type, base_price_credits, per_token_price, minimum_charge, maximum_charge) VALUES
  ('AI Text Generation', 'ai_generation', 1, 0.0001, 1, 500),
  ('Image Generation', 'image_creation', 10, 0, 10, 50),
  ('Document Analysis', 'document_analysis', 5, 0.0002, 5, 200),
  ('API Call', 'api_call', 0, 0.00005, 1, 100)
ON CONFLICT (feature_type) DO NOTHING;

-- Insert Default Credit Plans
INSERT INTO credit_plans (stripe_price_id, name, monthly_credits, bonus_credits, rollover_credits, price_cents, features) VALUES
  ('price_starter', 'Starter', 1000, 0, FALSE, 999, '["basic_ai", "email_support"]'),
  ('price_pro', 'Pro', 5000, 500, TRUE, 3999, '["advanced_ai", "priority_support", "analytics"]'),
  ('price_enterprise', 'Enterprise', 20000, 3000, TRUE, 9999, '["all_features", "dedicated_support", "api_access", "white_label"]')
ON CONFLICT (stripe_price_id) DO NOTHING;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Award Points Function
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_points INTEGER,
  p_reason TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS JSONB AS $$
DECLARE
  v_user_points RECORD;
  v_new_level INTEGER;
  v_old_level INTEGER;
BEGIN
  -- Get or create user points
  SELECT * INTO v_user_points
  FROM user_points
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_points (user_id, total_points, current_level)
    VALUES (p_user_id, p_points, 1)
    RETURNING * INTO v_user_points;
  ELSE
    v_old_level := v_user_points.current_level;

    UPDATE user_points
    SET
      total_points = total_points + p_points,
      weekly_points = weekly_points + p_points,
      monthly_points = monthly_points + p_points,
      updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING * INTO v_user_points;
  END IF;

  -- Calculate new level
  v_new_level := FLOOR(SQRT(v_user_points.total_points / 100)) + 1;

  -- Update level if changed
  IF v_new_level > COALESCE(v_old_level, 1) THEN
    UPDATE user_points
    SET current_level = v_new_level
    WHERE user_id = p_user_id;

    -- Create notification
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (
      p_user_id,
      'level_up',
      'Level Up! 🎉',
      'Congratulations! You reached Level ' || v_new_level,
      jsonb_build_object('new_level', v_new_level, 'previous_level', v_old_level)
    );
  END IF;

  -- Log activity
  INSERT INTO activity_logs (user_id, action, metadata)
  VALUES (p_user_id, 'points_earned', jsonb_build_object(
    'points', p_points,
    'reason', p_reason,
    'new_total', v_user_points.total_points,
    'metadata', p_metadata
  ));

  RETURN jsonb_build_object(
    'total_points', v_user_points.total_points,
    'current_level', v_new_level,
    'points_earned', p_points,
    'reason', p_reason,
    'leveled_up', v_new_level > COALESCE(v_old_level, 1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Leaderboard Function
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS void AS $$
BEGIN
  -- Clear old leaderboard entries
  DELETE FROM leaderboard_entries
  WHERE period_end < CURRENT_DATE;

  -- Insert global leaderboard (current month)
  INSERT INTO leaderboard_entries (user_id, category, score, rank, period_start, period_end)
  SELECT
    user_id,
    'global',
    total_points,
    ROW_NUMBER() OVER (ORDER BY total_points DESC),
    DATE_TRUNC('month', CURRENT_DATE),
    DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
  FROM user_points
  ON CONFLICT (user_id, category, period_start) DO UPDATE
  SET score = EXCLUDED.score, rank = EXCLUDED.rank, updated_at = NOW();

  -- Insert weekly leaderboard
  INSERT INTO leaderboard_entries (user_id, category, score, rank, period_start, period_end)
  SELECT
    user_id,
    'weekly',
    weekly_points,
    ROW_NUMBER() OVER (ORDER BY weekly_points DESC),
    DATE_TRUNC('week', CURRENT_DATE),
    DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days'
  FROM user_points
  ON CONFLICT (user_id, category, period_start) DO UPDATE
  SET score = EXCLUDED.score, rank = EXCLUDED.rank, updated_at = NOW();

  -- Insert monthly leaderboard
  INSERT INTO leaderboard_entries (user_id, category, score, rank, period_start, period_end)
  SELECT
    user_id,
    'monthly',
    monthly_points,
    ROW_NUMBER() OVER (ORDER BY monthly_points DESC),
    DATE_TRUNC('month', CURRENT_DATE),
    DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
  FROM user_points
  ON CONFLICT (user_id, category, period_start) DO UPDATE
  SET score = EXCLUDED.score, rank = EXCLUDED.rank, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

-- Gamification RLS
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Billing RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY user_points_owner ON user_points FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_badges_owner ON user_badges FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_streaks_owner ON user_streaks FOR ALL USING (user_id = auth.uid());
CREATE POLICY leaderboard_public ON leaderboard_entries FOR SELECT USING (true);
CREATE POLICY user_credits_owner ON user_credits FOR ALL USING (user_id = auth.uid());
CREATE POLICY credit_transactions_owner ON credit_transactions FOR ALL USING (user_id = auth.uid());
CREATE POLICY usage_records_owner ON usage_records FOR ALL USING (user_id = auth.uid());

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE user_points IS 'Stores gamification points for each user';
COMMENT ON TABLE badges IS 'Available badges that users can earn';
COMMENT ON TABLE user_badges IS 'Tracks which badges each user has earned';
COMMENT ON TABLE user_streaks IS 'Tracks user activity streaks';
COMMENT ON TABLE leaderboard_entries IS 'Leaderboard rankings by category and period';
COMMENT ON TABLE user_credits IS 'Credit balance for usage-based billing';
COMMENT ON TABLE credit_transactions IS 'History of all credit transactions';
COMMENT ON TABLE usage_records IS 'Detailed usage tracking for billing';
COMMENT ON TABLE pricing_tiers IS 'Credit pricing for different features';
