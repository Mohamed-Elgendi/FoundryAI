-- Tier 4: Personal Development Layer Database Schema
-- Self-Discovery, Mindset & Personality, Productivity systems

-- ============================================================================
-- SELF-DISCOVERY SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS psychometric_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Assessment metadata
  assessment_type VARCHAR(50) NOT NULL, -- 'entrepreneurial_dna', 'cognitive_advantages', 'character_archetype', 'passion_evidence'
  assessment_name VARCHAR(100) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Results data (flexible JSON structure)
  results JSONB NOT NULL,
  
  -- Key findings (extracted for querying)
  primary_trait VARCHAR(100),
  secondary_traits TEXT[],
  strengths TEXT[],
  growth_areas TEXT[],
  
  -- Scores
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  
  -- Actionable recommendations
  recommended_archetypes TEXT[],
  recommended_paths TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entrepreneurial_dna (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- DNA Profile (8 entrepreneurial genes)
  builder_score INTEGER CHECK (builder_score >= 0 AND builder_score <= 100),
  opportunist_score INTEGER CHECK (opportunist_score >= 0 AND opportunist_score <= 100),
  specialist_score INTEGER CHECK (specialist_score >= 0 AND specialist_score <= 100),
  innovator_score INTEGER CHECK (innovator_score >= 0 AND innovator_score <= 100),
  
  -- Additional dimensions
  risk_tolerance INTEGER CHECK (risk_tolerance >= 0 AND risk_tolerance <= 100),
  action_orientation INTEGER CHECK (action_orientation >= 0 AND action_orientation <= 100),
  relationship_skills INTEGER CHECK (relationship_skills >= 0 AND relationship_skills <= 100),
  thought_processing INTEGER CHECK (thought_processing >= 0 AND thought_processing <= 100),
  
  -- Primary and secondary DNA
  primary_dna VARCHAR(50),
  secondary_dna VARCHAR(50),
  
  -- Business archetype fit scores
  saas_fit INTEGER CHECK (saas_fit >= 0 AND saas_fit <= 100),
  agency_fit INTEGER CHECK (agency_fit >= 0 AND agency_fit <= 100),
  content_fit INTEGER CHECK (content_fit >= 0 AND content_fit <= 100),
  product_fit INTEGER CHECK (product_fit >= 0 AND product_fit <= 100),
  service_fit INTEGER CHECK (service_fit >= 0 AND service_fit <= 100),
  
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_dna UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS cognitive_advantages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 7 cognitive advantages
  pattern_recognition INTEGER CHECK (pattern_recognition >= 0 AND pattern_recognition <= 100),
  systems_thinking INTEGER CHECK (systems_thinking >= 0 AND systems_thinking <= 100),
  creative_problem_solving INTEGER CHECK (creative_problem_solving >= 0 AND creative_problem_solving <= 100),
  strategic_foresight INTEGER CHECK (strategic_foresight >= 0 AND strategic_foresight <= 100),
  rapid_learning INTEGER CHECK (rapid_learning >= 0 AND rapid_learning <= 100),
  emotional_intelligence INTEGER CHECK (emotional_intelligence >= 0 AND emotional_intelligence <= 100),
  execution_velocity INTEGER CHECK (execution_velocity >= 0 AND execution_velocity <= 100),
  
  -- Dominant advantage
  dominant_advantage VARCHAR(50),
  supporting_advantages TEXT[],
  
  -- Application areas
  best_applied_in TEXT[],
  leverage_strategies TEXT[],
  
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_cognitive UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS passion_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Passion domain
  passion_domain VARCHAR(100) NOT NULL,
  passion_description TEXT,
  
  -- Evidence of passion (from assessment)
  time_investment_hours INTEGER,
  voluntary_engagement BOOLEAN,
  flow_experiences TEXT[],
  skills_developed TEXT[],
  
  -- Business application potential
  market_opportunities TEXT[],
  monetization_paths TEXT[],
  business_model_fit TEXT[],
  
  -- Validation status
  validation_stage VARCHAR(50) DEFAULT 'identified', -- 'identified', 'exploring', 'testing', 'validated'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- MINDSET & PERSONALITY (7-Pillar Psychology)
-- ============================================================================

CREATE TABLE IF NOT EXISTS character_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core stats (0-100)
  resilience INTEGER CHECK (resilience >= 0 AND resilience <= 100),
  creativity INTEGER CHECK (creativity >= 0 AND creativity <= 100),
  discipline INTEGER CHECK (discipline >= 0 AND discipline <= 100),
  intelligence INTEGER CHECK (intelligence >= 0 AND intelligence <= 100),
  charisma INTEGER CHECK (charisma >= 0 AND charisma <= 100),
  luck INTEGER CHECK (luck >= 0 AND luck <= 100),
  adaptability INTEGER CHECK (adaptability >= 0 AND adaptability <= 100),
  
  -- Calculated overalls
  total_power INTEGER GENERATED ALWAYS AS (
    resilience + creativity + discipline + intelligence + charisma + luck + adaptability
  ) STORED,
  average_stat INTEGER GENERATED ALWAYS AS (
    (resilience + creativity + discipline + intelligence + charisma + luck + adaptability) / 7
  ) STORED,
  
  -- Level progression (RPG style)
  current_level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  next_level_xp INTEGER DEFAULT 100,
  
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_character UNIQUE (user_id, recorded_at::date)
);

CREATE TABLE IF NOT EXISTS gamification_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Level system (1-100)
  current_level INTEGER DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 100),
  total_experience INTEGER DEFAULT 0,
  experience_to_next_level INTEGER DEFAULT 100,
  
  -- Achievement tracking
  achievements_unlocked INTEGER DEFAULT 0,
  total_achievements INTEGER DEFAULT 0,
  achievement_points INTEGER DEFAULT 0,
  
  -- Daily streaks
  login_streak INTEGER DEFAULT 0,
  longest_login_streak INTEGER DEFAULT 0,
  last_login_date TIMESTAMP WITH TIME ZONE,
  
  -- Skill badges
  badges_earned TEXT[],
  rare_badges TEXT[],
  legendary_badges TEXT[],
  
  -- Special titles
  current_title VARCHAR(100),
  unlocked_titles TEXT[],
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_gamification UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  achievement_id VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(200) NOT NULL,
  achievement_description TEXT,
  
  -- Rarity and points
  rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'uncommon', 'rare', 'epic', 'legendary'
  points INTEGER DEFAULT 10,
  
  -- Category
  category VARCHAR(50), -- 'milestone', 'streak', 'skill', 'social', 'revenue'
  
  -- Unlock data
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unlock_context JSONB, -- What triggered this achievement
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PRODUCTIVITY SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS productivity_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Session details
  session_type VARCHAR(50) NOT NULL, -- 'deep_work', 'shallow_work', 'meeting', 'learning', 'creative'
  task_description TEXT,
  project_id UUID,
  
  -- Time tracking
  planned_duration_minutes INTEGER NOT NULL,
  actual_duration_minutes INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Deep work metrics
  interruptions_count INTEGER DEFAULT 0,
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  flow_achieved BOOLEAN DEFAULT FALSE,
  flow_duration_minutes INTEGER,
  
  -- Outcome
  task_completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 10),
  
  -- Energy tracking
  energy_before INTEGER CHECK (energy_before >= 1 AND energy_before <= 10),
  energy_after INTEGER CHECK (energy_after >= 1 AND energy_after <= 10),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS time_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Time allocation categories (percentage 0-100)
  deep_work_pct INTEGER CHECK (deep_work_pct >= 0 AND deep_work_pct <= 100),
  shallow_work_pct INTEGER CHECK (shallow_work_pct >= 0 AND shallow_work_pct <= 100),
  meetings_pct INTEGER CHECK (meetings_pct >= 0 AND meetings_pct <= 100),
  learning_pct INTEGER CHECK (learning_pct >= 0 AND learning_pct <= 100),
  rest_recovery_pct INTEGER CHECK (rest_recovery_pct >= 0 AND rest_recovery_pct <= 100),
  
  -- Calculated totals
  total_allocated INTEGER GENERATED ALWAYS AS (
    deep_work_pct + shallow_work_pct + meetings_pct + learning_pct + rest_recovery_pct
  ) STORED,
  
  -- Ideal vs actual
  is_ideal_allocation BOOLEAN DEFAULT FALSE,
  
  recorded_for_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_time_allocation UNIQUE (user_id, recorded_for_date)
);

CREATE TABLE IF NOT EXISTS chronotype_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Chronotype classification
  chronotype VARCHAR(50) NOT NULL, -- 'lion', 'bear', 'wolf', 'dolphin'
  
  -- Peak performance windows
  peak_cognitive_start TIME,
  peak_cognitive_end TIME,
  peak_creative_start TIME,
  peak_creative_end TIME,
  peak_social_start TIME,
  peak_social_end TIME,
  
  -- Sleep preferences
  optimal_bedtime TIME,
  optimal_wake_time TIME,
  sleep_duration_ideal INTEGER, -- in minutes
  
  -- Assessment results
  assessment_answers JSONB,
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_chronotype UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS daily_rituals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Ritual types
  ritual_type VARCHAR(50) NOT NULL, -- 'morning_startup', 'evening_shutdown', 'midday_recharge', 'weekly_review'
  
  -- Ritual components
  ritual_name VARCHAR(100) NOT NULL,
  ritual_steps JSONB NOT NULL, -- Array of step objects
  estimated_duration_minutes INTEGER,
  
  -- Scheduling
  scheduled_time TIME,
  active_days INTEGER[], -- 0-6 for Sunday-Saturday
  
  -- Completion tracking
  completion_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Effectiveness
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
  impact_on_productivity INTEGER CHECK (impact_on_productivity >= -10 AND impact_on_productivity <= 10),
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE psychometric_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrepreneurial_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_advantages ENABLE ROW LEVEL SECURITY;
ALTER TABLE passion_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronotype_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rituals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own psychometric results" ON psychometric_results
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own DNA profile" ON entrepreneurial_dna
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own cognitive advantages" ON cognitive_advantages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own passion evidence" ON passion_evidence
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own character stats" ON character_stats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own gamification progress" ON gamification_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own achievements" ON achievements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own productivity sessions" ON productivity_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own time allocations" ON time_allocations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own chronotype profiles" ON chronotype_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own daily rituals" ON daily_rituals
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_psychometric_user_type ON psychometric_results(user_id, assessment_type);
CREATE INDEX idx_character_stats_user_date ON character_stats(user_id, recorded_at DESC);
CREATE INDEX idx_achievements_user_rarity ON achievements(user_id, rarity);
CREATE INDEX idx_productivity_user_type ON productivity_sessions(user_id, session_type);
CREATE INDEX idx_productivity_user_date ON productivity_sessions(user_id, started_at DESC);
CREATE INDEX idx_time_allocation_user_date ON time_allocations(user_id, recorded_for_date);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER update_psychometric_results_updated_at BEFORE UPDATE ON psychometric_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entrepreneurial_dna_updated_at BEFORE UPDATE ON entrepreneurial_dna
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cognitive_advantages_updated_at BEFORE UPDATE ON cognitive_advantages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_passion_evidence_updated_at BEFORE UPDATE ON passion_evidence
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_stats_updated_at BEFORE UPDATE ON character_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gamification_progress_updated_at BEFORE UPDATE ON gamification_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chronotype_profiles_updated_at BEFORE UPDATE ON chronotype_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_rituals_updated_at BEFORE UPDATE ON daily_rituals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
