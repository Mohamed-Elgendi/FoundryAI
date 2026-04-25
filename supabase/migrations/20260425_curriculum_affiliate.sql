-- Beast Mode Database Migration: Curriculum & Affiliate Systems
-- Created: April 25, 2026

-- ============================================
-- AI CURRICULUM ENGINE
-- ============================================

-- User Learning Profiles
CREATE TABLE IF NOT EXISTS user_learning_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  archetype VARCHAR(50) DEFAULT 'entrepreneur',
  current_skills JSONB DEFAULT '[]',
  target_skills JSONB DEFAULT '[]',
  learning_style VARCHAR(20) DEFAULT 'visual',
  time_availability INTEGER DEFAULT 10,
  goals JSONB DEFAULT '[]',
  preferences JSONB DEFAULT '{
    "preferred_content_types": ["video", "article"],
    "session_duration": 30,
    "preferred_times": ["morning"],
    "difficulty_preference": "balanced"
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Curricula
CREATE TABLE IF NOT EXISTS curricula (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  modules JSONB DEFAULT '[]',
  estimated_duration INTEGER DEFAULT 0,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  ai_generated BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'draft',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE,
  module_id UUID,
  type VARCHAR(20) NOT NULL, -- 'pre', 'mid', 'post', 'practice'
  questions JSONB DEFAULT '[]',
  score INTEGER,
  max_score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Progress
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE,
  module_id UUID,
  lesson_id UUID,
  action VARCHAR(20) NOT NULL, -- 'started', 'completed', 'reviewed', 'assessed'
  time_spent INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE,
  template_id VARCHAR(100) DEFAULT 'default-template',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  skills JSONB DEFAULT '[]',
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  verification_code VARCHAR(100) UNIQUE NOT NULL,
  blockchain_hash VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'next_lesson', 'skill_gap', 'resource', 'career_path'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  relevance INTEGER DEFAULT 0,
  action_url VARCHAR(500),
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AFFILIATE MARKETPLACE
-- ============================================

-- Affiliates
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(20) DEFAULT 'bronze',
  commission_rate INTEGER DEFAULT 10,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  pending_earnings DECIMAL(10,2) DEFAULT 0,
  lifetime_clicks INTEGER DEFAULT 0,
  lifetime_conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  stripe_connect_account_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Affiliate Tiers
CREATE TABLE IF NOT EXISTS affiliate_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(20) UNIQUE NOT NULL,
  display_name VARCHAR(50) NOT NULL,
  min_conversions INTEGER NOT NULL,
  commission_rate INTEGER NOT NULL,
  benefits JSONB DEFAULT '[]',
  color VARCHAR(7) DEFAULT '#8B4513',
  active BOOLEAN DEFAULT TRUE
);

-- Insert Default Tiers
INSERT INTO affiliate_tiers (name, display_name, min_conversions, commission_rate, benefits, color) VALUES
  ('bronze', 'Bronze Partner', 0, 10, '["10% commission", "Basic analytics"]', '#CD7F32'),
  ('silver', 'Silver Partner', 10, 15, '["15% commission", "Advanced analytics", "Priority support"]', '#C0C0C0'),
  ('gold', 'Gold Partner', 50, 25, '["25% commission", "Premium analytics", "Dedicated support", "Early access"]', '#FFD700'),
  ('platinum', 'Platinum Partner', 100, 35, '["35% commission", "Enterprise analytics", "Account manager", "Custom terms"]', '#E5E4E2')
ON CONFLICT (name) DO NOTHING;

-- Affiliate Products
CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  commission_rate INTEGER DEFAULT 10,
  image_url VARCHAR(500),
  category VARCHAR(50),
  tags JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Products
INSERT INTO affiliate_products (name, description, price, commission_rate, category, tags) VALUES
  ('FoundryAI Pro Subscription', 'Monthly Pro plan access', 29.99, 30, 'subscription', '["recurring", "pro"]'),
  ('FoundryAI Enterprise', 'Enterprise plan access', 99.99, 25, 'subscription', '["recurring", "enterprise"]'),
  ('AI Course Bundle', 'Complete AI mastery courses', 199.99, 40, 'course', '["one-time", "education"]'),
  ('Consulting Package', '1-on-1 business coaching', 499.99, 20, 'service', '["one-time", "coaching"]')
ON CONFLICT DO NOTHING;

-- Affiliate Links
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  product_id UUID REFERENCES affiliate_products(id) ON DELETE SET NULL,
  url VARCHAR(500) NOT NULL,
  short_url VARCHAR(255),
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  earnings DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clicks
CREATE TABLE IF NOT EXISTS clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  link_id UUID REFERENCES affiliate_links(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer VARCHAR(500),
  country VARCHAR(2),
  converted BOOLEAN DEFAULT FALSE,
  conversion_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversions
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  order_id VARCHAR(100) NOT NULL,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES affiliate_products(id) ON DELETE SET NULL,
  product_name VARCHAR(255),
  product_price DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'paid'
  cookie_id VARCHAR(100),
  click_id UUID REFERENCES clicks(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payouts
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  method VARCHAR(20) NOT NULL, -- 'stripe', 'paypal', 'bank_transfer', 'crypto'
  stripe_transfer_id VARCHAR(100),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate Notifications
CREATE TABLE IF NOT EXISTS affiliate_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'conversion', 'payout', 'tier_upgrade', 'milestone'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Curriculum Indexes
CREATE INDEX IF NOT EXISTS idx_curricula_user_id ON curricula(user_id);
CREATE INDEX IF NOT EXISTS idx_curricula_status ON curricula(status);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_verification ON certificates(verification_code);

-- Affiliate Indexes
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_affiliate_id ON affiliate_links(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_clicks_affiliate_id ON clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_conversions_affiliate_id ON conversions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_conversions_status ON conversions(status);
CREATE INDEX IF NOT EXISTS idx_payouts_affiliate_id ON payouts(affiliate_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Increment Affiliate Clicks
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(p_affiliate_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE affiliates
  SET lifetime_clicks = lifetime_clicks + 1,
      updated_at = NOW()
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Affiliate Top Products
CREATE OR REPLACE FUNCTION get_affiliate_top_products(
  p_affiliate_id UUID,
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  product_id UUID,
  product_name VARCHAR,
  clicks BIGINT,
  conversions BIGINT,
  earnings DECIMAL,
  conversion_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ap.id as product_id,
    ap.name as product_name,
    COALESCE(SUM(al.clicks), 0) as clicks,
    COALESCE(SUM(al.conversions), 0) as conversions,
    COALESCE(SUM(al.earnings), 0) as earnings,
    CASE
      WHEN COALESCE(SUM(al.clicks), 0) > 0
      THEN (COALESCE(SUM(al.conversions), 0)::DECIMAL / SUM(al.clicks)) * 100
      ELSE 0
    END as conversion_rate
  FROM affiliate_products ap
  LEFT JOIN affiliate_links al ON al.product_id = ap.id AND al.affiliate_id = p_affiliate_id
  WHERE ap.active = TRUE
  GROUP BY ap.id, ap.name
  ORDER BY conversions DESC, clicks DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get Affiliate Monthly Earnings
CREATE OR REPLACE FUNCTION get_affiliate_monthly_earnings(
  p_affiliate_id UUID,
  p_months INTEGER DEFAULT 12
)
RETURNS TABLE (
  month TEXT,
  clicks BIGINT,
  conversions BIGINT,
  earnings DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH months AS (
    SELECT generate_series(
      DATE_TRUNC('month', NOW()) - (p_months - 1 || ' months')::INTERVAL,
      DATE_TRUNC('month', NOW()),
      '1 month'::INTERVAL
    ) as month_start
  )
  SELECT
    TO_CHAR(m.month_start, 'YYYY-MM') as month,
    COALESCE(SUM(CASE WHEN cl.created_at >= m.month_start AND cl.created_at < m.month_start + INTERVAL '1 month' THEN 1 ELSE 0 END), 0) as clicks,
    COALESCE(SUM(CASE WHEN c.created_at >= m.month_start AND c.created_at < m.month_start + INTERVAL '1 month' AND c.status IN ('approved', 'paid') THEN 1 ELSE 0 END), 0) as conversions,
    COALESCE(SUM(CASE WHEN c.created_at >= m.month_start AND c.created_at < m.month_start + INTERVAL '1 month' AND c.status IN ('approved', 'paid') THEN c.commission_amount ELSE 0 END), 0) as earnings
  FROM months m
  LEFT JOIN clicks cl ON cl.affiliate_id = p_affiliate_id AND cl.created_at >= m.month_start AND cl.created_at < m.month_start + INTERVAL '1 month'
  LEFT JOIN conversions c ON c.affiliate_id = p_affiliate_id AND c.created_at >= m.month_start AND c.created_at < m.month_start + INTERVAL '1 month'
  GROUP BY m.month_start
  ORDER BY m.month_start DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Curriculum RLS
ALTER TABLE user_learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE curricula ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Affiliate RLS
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY user_learning_profile_owner ON user_learning_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY curriculum_owner ON curricula FOR ALL USING (user_id = auth.uid());
CREATE POLICY assessment_owner ON assessments FOR ALL USING (user_id = auth.uid());
CREATE POLICY learning_progress_owner ON learning_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY certificate_owner ON certificates FOR ALL USING (user_id = auth.uid());
CREATE POLICY ai_recommendations_owner ON ai_recommendations FOR ALL USING (user_id = auth.uid());

CREATE POLICY affiliate_owner ON affiliates FOR ALL USING (user_id = auth.uid());
CREATE POLICY affiliate_links_owner ON affiliate_links FOR ALL USING (affiliate_id IN (
  SELECT id FROM affiliates WHERE user_id = auth.uid()
));
CREATE POLICY affiliate_notifications_owner ON affiliate_notifications FOR ALL USING (affiliate_id IN (
  SELECT id FROM affiliates WHERE user_id = auth.uid()
));
CREATE POLICY conversions_owner ON conversions FOR ALL USING (affiliate_id IN (
  SELECT id FROM affiliates WHERE user_id = auth.uid()
));
CREATE POLICY payouts_owner ON payouts FOR ALL USING (affiliate_id IN (
  SELECT id FROM affiliates WHERE user_id = auth.uid()
));

-- Products are public for viewing
CREATE POLICY affiliate_products_public ON affiliate_products FOR SELECT USING (active = TRUE);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_curricula_updated_at BEFORE UPDATE ON curricula
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_profiles_updated_at BEFORE UPDATE ON user_learning_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE user_learning_profiles IS 'Stores personalized learning preferences and goals for each user';
COMMENT ON TABLE curricula IS 'AI-generated learning curricula for users';
COMMENT ON TABLE certificates IS 'Verifiable certificates for completed curricula';
COMMENT ON TABLE affiliates IS 'Affiliate program participants and their stats';
COMMENT ON TABLE conversions IS 'Tracked conversions from affiliate referrals';
COMMENT ON TABLE payouts IS 'Payout history for affiliates';
