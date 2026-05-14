-- ============================================
-- Migration 005: Tier 4 Discovery & Stats
-- Character Stats, Skills, Revenue Engine
-- ============================================

-- Character stats (RPG-style 7 dimensions)
CREATE TABLE IF NOT EXISTS character_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level INT DEFAULT 1,
  xp_total INT DEFAULT 0,
  xp_current INT DEFAULT 0,
  xp_to_next_level INT DEFAULT 100,
  financial_level INT DEFAULT 1,
  social_level INT DEFAULT 1,
  physical_level INT DEFAULT 1,
  mental_level INT DEFAULT 1,
  educational_level INT DEFAULT 1,
  professional_level INT DEFAULT 1,
  spiritual_level INT DEFAULT 1,
  total_achievements INT DEFAULT 0,
  total_projects_completed INT DEFAULT 0,
  total_revenue_generated DECIMAL(12,2) DEFAULT 0,
  streak_current INT DEFAULT 0,
  streak_best INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Skills tracking
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  archetype TEXT,
  proficiency INT DEFAULT 0 CHECK (proficiency BETWEEN 0 AND 100),
  last_practiced TIMESTAMPTZ,
  practice_count INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Revenue engine - goals
CREATE TABLE IF NOT EXISTS revenue_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL,
  target_date DATE NOT NULL,
  methodology TEXT NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue engine - transactions
CREATE TABLE IF NOT EXISTS revenue_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  revenue_goal_id UUID REFERENCES revenue_goals(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  methodology TEXT NOT NULL,
  source TEXT,
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_revenue_transactions_user ON revenue_transactions(user_id, transaction_date DESC);

-- Revenue engine - streams
CREATE TABLE IF NOT EXISTS revenue_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  methodology TEXT NOT NULL,
  description TEXT,
  monthly_recurring DECIMAL(12,2) DEFAULT 0,
  one_time_total DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE character_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_streams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own character_stats" ON character_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own skills" ON skills FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own revenue_goals" ON revenue_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own revenue_transactions" ON revenue_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own revenue_streams" ON revenue_streams FOR ALL USING (auth.uid() = user_id);
