-- ============================================
-- Migration 003: Tier 2 Opportunity Intelligence
-- Archetypes, Ideas, Opportunity Radar
-- ============================================

-- Business archetype profiles
CREATE TABLE IF NOT EXISTS archetype_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  selected_archetype TEXT NOT NULL,
  fit_score INT DEFAULT 0 CHECK (fit_score BETWEEN 0 AND 100),
  strengths TEXT[],
  areas_to_develop TEXT[],
  timeline_estimate_days INT,
  revenue_potential_min INT,
  revenue_potential_max INT,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, selected_archetype)
);

-- AI-extracted ideas from brain dumps
CREATE TABLE IF NOT EXISTS extracted_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_brain_dump_id UUID REFERENCES brain_dumps(id) ON DELETE SET NULL,
  archetype TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_audience TEXT,
  monetization_strategy TEXT,
  ai_analysis JSONB,
  feasibility_score INT DEFAULT 0 CHECK (feasibility_score BETWEEN 0 AND 100),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'selected', 'in_progress', 'completed', 'abandoned')),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_extracted_ideas_user ON extracted_ideas(user_id, created_at DESC);

-- Opportunity radar scans
CREATE TABLE IF NOT EXISTS opportunity_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES extracted_ideas(id) ON DELETE CASCADE,
  idea_title TEXT NOT NULL,
  idea_description TEXT,
  demand_score INT CHECK (demand_score BETWEEN 0 AND 25),
  competition_score INT CHECK (competition_score BETWEEN 0 AND 25),
  feasibility_score INT CHECK (feasibility_score BETWEEN 0 AND 25),
  monetization_score INT CHECK (monetization_score BETWEEN 0 AND 25),
  total_score INT GENERATED ALWAYS AS (COALESCE(demand_score, 0) + COALESCE(competition_score, 0) + COALESCE(feasibility_score, 0) + COALESCE(monetization_score, 0)) STORED,
  analysis_details JSONB,
  recommendations TEXT[],
  risks TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_opportunity_scans_user ON opportunity_scans(user_id, total_score DESC);
CREATE INDEX idx_opportunity_scans_idea ON opportunity_scans(idea_id);

-- Self-discovery assessments
CREATE TABLE IF NOT EXISTS self_discovery_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('psychological', 'cognitive', 'behavioral', 'professional', 'full')),
  responses JSONB NOT NULL,
  results JSONB,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Productivity tracking (4D)
CREATE TABLE IF NOT EXISTS productivity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  focus_score INT CHECK (focus_score BETWEEN 1 AND 100),
  energy_score INT CHECK (energy_score BETWEEN 1 AND 100),
  motivation_score INT CHECK (motivation_score BETWEEN 1 AND 100),
  completion_rate INT CHECK (completion_rate BETWEEN 0 AND 100),
  tasks_completed INT DEFAULT 0,
  tasks_total INT DEFAULT 0,
  deep_work_minutes INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_productivity_logs_user_date ON productivity_logs(user_id, date DESC);

-- RLS
ALTER TABLE archetype_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_discovery_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own archetype_profiles" ON archetype_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own extracted_ideas" ON extracted_ideas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own opportunity_scans" ON opportunity_scans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own self_discovery_assessments" ON self_discovery_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own productivity_logs" ON productivity_logs FOR ALL USING (auth.uid() = user_id);
