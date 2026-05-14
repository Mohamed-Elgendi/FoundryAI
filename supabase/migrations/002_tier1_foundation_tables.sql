-- ============================================
-- Migration 002: Tier 1 Foundation Tables
-- Focus, Momentum, Ritual, Emotion, Mindset
-- ============================================

-- Daily ritual tracking
CREATE TABLE IF NOT EXISTS daily_rituals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in_completed BOOLEAN DEFAULT FALSE,
  mood_rating INT CHECK (mood_rating BETWEEN 1 AND 10),
  energy_rating INT CHECK (energy_rating BETWEEN 1 AND 10),
  focus_rating INT CHECK (focus_rating BETWEEN 1 AND 10),
  journal_entry TEXT,
  gratitude_entries TEXT[],
  wins_today TEXT[],
  intention_tomorrow TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Momentum tracking (7 dimensions)
CREATE TABLE IF NOT EXISTS momentum_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  financial_score INT DEFAULT 50 CHECK (financial_score BETWEEN 1 AND 100),
  social_score INT DEFAULT 50 CHECK (social_score BETWEEN 1 AND 100),
  physical_score INT DEFAULT 50 CHECK (physical_score BETWEEN 1 AND 100),
  mental_score INT DEFAULT 50 CHECK (mental_score BETWEEN 1 AND 100),
  educational_score INT DEFAULT 50 CHECK (educational_score BETWEEN 1 AND 100),
  professional_score INT DEFAULT 50 CHECK (professional_score BETWEEN 1 AND 100),
  spiritual_score INT DEFAULT 50 CHECK (spiritual_score BETWEEN 1 AND 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_momentum_entries_user_date ON momentum_entries(user_id, date DESC);

-- Focus tracking
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_name TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  distractions_count INT DEFAULT 0,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_focus_sessions_user ON focus_sessions(user_id, started_at DESC);

-- Distractions killer tracking
CREATE TABLE IF NOT EXISTS distraction_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  distraction_type TEXT NOT NULL,
  blocked_at TIMESTAMPTZ DEFAULT NOW(),
  technique_used TEXT,
  notes TEXT
);

-- Emotional control entries
CREATE TABLE IF NOT EXISTS emotional_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emotion TEXT NOT NULL,
  intensity INT CHECK (intensity BETWEEN 1 AND 10),
  trigger TEXT,
  response TEXT,
  step_1_identify TEXT,
  step_2_label TEXT,
  step_3_reframe TEXT,
  step_4_act TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emotional_entries_user ON emotional_entries(user_id, created_at DESC);

-- Belief architecture
CREATE TABLE IF NOT EXISTS beliefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  limiting_belief TEXT NOT NULL,
  empowering_belief TEXT,
  evidence TEXT[],
  practice_count INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Confidence evidence
CREATE TABLE IF NOT EXISTS confidence_evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement TEXT NOT NULL,
  category TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  impact_rating INT CHECK (impact_rating BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brain dump entries
CREATE TABLE IF NOT EXISTS brain_dumps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'inbox', -- inbox, urgent, later, someday, done, idea
  priority INT DEFAULT 0 CHECK (priority BETWEEN 0 AND 3),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processing', 'archived', 'converted')),
  converted_to_idea BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brain_dumps_user_category ON brain_dumps(user_id, category);

-- Affirmation journaling
CREATE TABLE IF NOT EXISTS affirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  affirmation TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT FALSE,
  category TEXT,
  practiced_today BOOLEAN DEFAULT FALSE,
  practice_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Success mindset practices
CREATE TABLE IF NOT EXISTS mindset_practices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  practice_type TEXT NOT NULL, -- reflection, gratitude, visualization, goal_setting
  content TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE daily_rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE momentum_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE distraction_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE beliefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE confidence_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindset_practices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily_rituals" ON daily_rituals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own momentum_entries" ON momentum_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own focus_sessions" ON focus_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own distraction_blocks" ON distraction_blocks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own emotional_entries" ON emotional_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own beliefs" ON beliefs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own confidence_evidence" ON confidence_evidence FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own brain_dumps" ON brain_dumps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own affirmations" ON affirmations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own mindset_practices" ON mindset_practices FOR ALL USING (auth.uid() = user_id);
