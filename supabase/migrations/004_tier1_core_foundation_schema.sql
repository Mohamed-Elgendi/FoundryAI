-- Tier 1 Core Foundation Layer Database Schema
-- 8 Always Active Systems for FoundryAI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SYSTEM 1: BELIEF ARCHITECTURE
-- ============================================================================

CREATE TABLE IF NOT EXISTS belief_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Belief levels (1-100 scores)
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  capability_belief INTEGER CHECK (capability_belief >= 0 AND capability_belief <= 100),
  worthiness_belief INTEGER CHECK (worthiness_belief >= 0 AND worthiness_belief <= 100),
  possibility_belief INTEGER CHECK (possibility_belief >= 0 AND possibility_belief <= 100),
  
  -- Evidence tracking
  evidence_count INTEGER DEFAULT 0,
  last_evidence_date TIMESTAMP WITH TIME ZONE,
  
  -- Daily calibration
  morning_intent TEXT,
  resistance_forecast TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: one record per user per day
  CONSTRAINT unique_user_belief_daily UNIQUE (user_id, created_at::date)
);

CREATE TABLE IF NOT EXISTS evidence_stack (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Evidence details
  evidence_type VARCHAR(50) NOT NULL, -- 'micro_win', 'daily_victory', 'weekly_breakthrough', 'monthly_transformation', 'legendary_proof'
  description TEXT NOT NULL,
  category VARCHAR(50), -- 'capability', 'persistence', 'creativity', 'learning', 'leadership'
  
  -- Proof data
  proof_data JSONB DEFAULT '{}',
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
  
  -- Belief connection
  related_belief_id UUID REFERENCES belief_scores(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SYSTEM 2: SUCCESS MINDSET FORGE
-- ============================================================================

CREATE TABLE IF NOT EXISTS mindset_pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 7 Pillars (1-100 scores each)
  abundance_consciousness INTEGER CHECK (abundance_consciousness >= 0 AND abundance_consciousness <= 100),
  growth_mindset INTEGER CHECK (growth_mindset >= 0 AND growth_mindset <= 100),
  resilience_pressure INTEGER CHECK (resilience_pressure >= 0 AND resilience_pressure <= 100),
  possibility_expansion INTEGER CHECK (possibility_expansion >= 0 AND possibility_expansion <= 100),
  owner_mentality INTEGER CHECK (owner_mentality >= 0 AND owner_mentality <= 100),
  long_term_visioning INTEGER CHECK (long_term_visioning >= 0 AND long_term_visioning <= 100),
  limitless_potential INTEGER CHECK (limitless_potential >= 0 AND limitless_potential <= 100),
  
  -- Overall mindset score
  overall_mindset_score INTEGER CHECK (overall_mindset_score >= 0 AND overall_mindset_score <= 100),
  
  -- Daily practices
  completed_reframes INTEGER DEFAULT 0,
  completed_visualizations INTEGER DEFAULT 0,
  completed_challenges INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_mindset_daily UNIQUE (user_id, created_at::date)
);

CREATE TABLE IF NOT EXISTS mindset_reframes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Reframe data
  limiting_belief TEXT NOT NULL,
  empowering_replacement TEXT NOT NULL,
  trigger_situation TEXT,
  
  -- Effectiveness
  conviction_level INTEGER CHECK (conviction_level >= 1 AND conviction_level <= 10),
  times_used INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SYSTEM 3: CONFIDENCE CORE (Evidence Stack)
-- ============================================================================

CREATE TABLE IF NOT EXISTS confidence_quotients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Confidence Quotient (0-100)
  overall_cq INTEGER CHECK (overall_cq >= 0 AND overall_cq <= 100),
  
  -- Domain-specific confidence
  technical_cq INTEGER CHECK (technical_cq >= 0 AND technical_cq <= 100),
  business_cq INTEGER CHECK (business_cq >= 0 AND business_cq <= 100),
  creative_cq INTEGER CHECK (creative_cq >= 0 AND creative_cq <= 100),
  social_cq INTEGER CHECK (social_cq >= 0 AND social_cq <= 100),
  leadership_cq INTEGER CHECK (leadership_cq >= 0 AND leadership_cq <= 100),
  
  -- Trend analysis
  trend_direction VARCHAR(20) DEFAULT 'stable', -- 'growing', 'stable', 'needs_attention'
  trend_score_change INTEGER DEFAULT 0,
  
  -- Interventions
  last_intervention_date TIMESTAMP WITH TIME ZONE,
  intervention_trigger TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_confidence_daily UNIQUE (user_id, created_at::date)
);

CREATE TABLE IF NOT EXISTS confidence_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Evidence details
  evidence_level VARCHAR(50) NOT NULL, -- 'micro_win', 'daily_victory', 'weekly_breakthrough', 'monthly_transformation', 'legendary_proof'
  description TEXT NOT NULL,
  domain VARCHAR(50), -- 'technical', 'business', 'creative', 'social', 'leadership'
  
  -- Proof
  proof_data JSONB DEFAULT '{}',
  capability_demonstrated TEXT,
  
  -- Time tracking
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SYSTEM 4: AFFIRMATION & JOURNALING
-- ============================================================================

CREATE TABLE IF NOT EXISTS affirmation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Session type
  session_type VARCHAR(20) NOT NULL, -- 'morning', 'midday', 'evening'
  
  -- Morning ritual components
  evidence_review TEXT,
  identity_affirmations TEXT[], -- Array of 5 affirmations
  intent_declaration TEXT,
  gratitude_items TEXT[],
  
  -- Evening ritual components
  evidence_captured TEXT[],
  alignment_check TEXT,
  integration_statement TEXT,
  
  -- Completion tracking
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affirmations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Affirmation content (proof-based)
  specific_evidence TEXT NOT NULL,
  capability_proven TEXT NOT NULL,
  full_affirmation TEXT GENERATED ALWAYS AS (specific_evidence || ', proving I ' || capability_proven) STORED,
  
  -- Categorization
  category VARCHAR(50),
  is_identity_level BOOLEAN DEFAULT FALSE,
  
  -- Effectiveness tracking
  times_recited INTEGER DEFAULT 0,
  conviction_level INTEGER CHECK (conviction_level >= 1 AND conviction_level <= 10),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SYSTEM 5: DISTRACTIONS KILLER
-- ============================================================================

CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Session details
  session_name TEXT,
  intended_duration_minutes INTEGER NOT NULL,
  actual_duration_minutes INTEGER,
  
  -- Focus score (0-100)
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  
  -- Distraction tracking
  interruptions_count INTEGER DEFAULT 0,
  distractions_blocked INTEGER DEFAULT 0,
  
  -- Defense layers activated
  digital_fortress_active BOOLEAN DEFAULT FALSE,
  physical_sanctuary_active BOOLEAN DEFAULT FALSE,
  cognitive_protection_active BOOLEAN DEFAULT FALSE,
  social_shield_active BOOLEAN DEFAULT FALSE,
  internal_defense_active BOOLEAN DEFAULT FALSE,
  
  -- State
  session_status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  abandonment_reason TEXT,
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS distraction_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES focus_sessions(id),
  
  -- Distraction details
  distraction_type VARCHAR(50) NOT NULL, -- 'digital', 'environmental', 'cognitive', 'social', 'internal'
  source TEXT,
  trigger TEXT,
  
  -- Response
  successfully_blocked BOOLEAN DEFAULT FALSE,
  response_action TEXT,
  
  -- Time tracking
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS digital_fortress_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Blocked items
  blocked_apps TEXT[],
  blocked_websites TEXT[],
  silenced_notifications TEXT[],
  
  -- Schedule
  focus_hours_start TIME,
  focus_hours_end TIME,
  active_days INTEGER[], -- 0-6 for Sunday-Saturday
  
  -- Advanced
  do_not_disturb_enabled BOOLEAN DEFAULT FALSE,
  phone_distance_feet INTEGER,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_fortress UNIQUE (user_id)
);

-- ============================================================================
-- SYSTEM 6: BRAIN DUMP SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS brain_dumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Session details
  session_type VARCHAR(20) DEFAULT 'pre_session', -- 'pre_session', 'mid_session', 'end_of_day'
  dump_duration_seconds INTEGER,
  
  -- Raw capture
  raw_content TEXT NOT NULL,
  word_count INTEGER,
  
  -- Cognitive load readings
  pre_dump_load INTEGER CHECK (pre_dump_load >= 0 AND pre_dump_load <= 100),
  post_dump_load INTEGER CHECK (post_dump_load >= 0 AND post_dump_load <= 100),
  load_released INTEGER GENERATED ALWAYS AS (pre_dump_load - post_dump_load) STORED,
  
  -- Categorization summary
  urgent_count INTEGER DEFAULT 0,
  important_count INTEGER DEFAULT 0,
  later_count INTEGER DEFAULT 0,
  delegate_count INTEGER DEFAULT 0,
  delete_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brain_dump_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dump_id UUID REFERENCES brain_dumps(id) ON DELETE CASCADE,
  
  -- Item content
  original_text TEXT NOT NULL,
  
  -- AI categorization
  category VARCHAR(20) NOT NULL, -- 'urgent', 'important', 'later', 'delegate', 'delete', 'idea', 'worry'
  ai_confidence FLOAT CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  
  -- User override
  user_category VARCHAR(20),
  is_actionable BOOLEAN,
  
  -- Processing
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'scheduled', 'completed', 'deleted'
  scheduled_for TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SYSTEM 7: EMOTION CONTROLLER
-- ============================================================================

CREATE TABLE IF NOT EXISTS emotion_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Detected state
  current_state VARCHAR(50) NOT NULL, -- 'anxiety', 'frustration', 'sadness', 'anger', 'boredom', 'flow', 'neutral', 'joy'
  
  -- Intensity (1-10)
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  
  -- Navigation plan
  target_state VARCHAR(50),
  recommended_action TEXT,
  reframe_statement TEXT,
  
  -- Transition pathway
  pathway_used TEXT, -- e.g., "anxiety → precision focus"
  
  -- Outcome
  transitioned_successfully BOOLEAN,
  flow_achieved BOOLEAN DEFAULT FALSE,
  flow_duration_minutes INTEGER,
  
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transitioned_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS flow_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_id UUID REFERENCES emotion_checkins(id),
  
  -- Flow details
  entry_emotion VARCHAR(50),
  flow_depth INTEGER CHECK (flow_depth >= 1 AND flow_depth <= 10),
  
  -- Session metrics
  duration_minutes INTEGER,
  productivity_score INTEGER CHECK (productivity_score >= 0 AND productivity_score <= 100),
  
  -- Compounding
  consecutive_flow_days INTEGER DEFAULT 0,
  flow_streak INTEGER DEFAULT 0,
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- SYSTEM 8: MOMENTUM BUILDER (7 Dimensions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS momentum_dimensions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dimension scores (0-100 each)
  financial_momentum INTEGER CHECK (financial_momentum >= 0 AND financial_momentum <= 100),
  social_momentum INTEGER CHECK (social_momentum >= 0 AND social_momentum <= 100),
  physical_momentum INTEGER CHECK (physical_momentum >= 0 AND physical_momentum <= 100),
  mental_emotional_momentum INTEGER CHECK (mental_emotional_momentum >= 0 AND mental_emotional_momentum <= 100),
  educational_momentum INTEGER CHECK (educational_momentum >= 0 AND educational_momentum <= 100),
  professional_momentum INTEGER CHECK (professional_momentum >= 0 AND professional_momentum <= 100),
  spiritual_meaning_momentum INTEGER CHECK (spiritual_meaning_momentum >= 0 AND spiritual_meaning_momentum <= 100),
  
  -- Overall momentum
  overall_momentum INTEGER CHECK (overall_momentum >= 0 AND overall_momentum <= 100),
  momentum_flywheel_speed INTEGER CHECK (momentum_flywheel_speed >= 0 AND momentum_flywheel_speed <= 100),
  
  -- Trends
  is_accelerating BOOLEAN DEFAULT FALSE,
  compound_effect_active BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_momentum_daily UNIQUE (user_id, created_at::date)
);

CREATE TABLE IF NOT EXISTS momentum_wins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Win details
  dimension VARCHAR(50) NOT NULL, -- 'financial', 'social', 'physical', 'mental', 'educational', 'professional', 'spiritual'
  win_description TEXT NOT NULL,
  win_magnitude INTEGER CHECK (win_magnitude >= 1 AND win_magnitude <= 10),
  
  -- Evidence
  proof_links TEXT[],
  
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE belief_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindset_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindset_reframes ENABLE ROW LEVEL SECURITY;
ALTER TABLE confidence_quotients ENABLE ROW LEVEL SECURITY;
ALTER TABLE confidence_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE affirmation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE distraction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_fortress_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_dump_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE momentum_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE momentum_wins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own belief scores" ON belief_scores
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own evidence" ON evidence_stack
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own mindset data" ON mindset_pillars
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own reframes" ON mindset_reframes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own confidence data" ON confidence_quotients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own confidence evidence" ON confidence_evidence
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own affirmation sessions" ON affirmation_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own affirmations" ON affirmations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own focus sessions" ON focus_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own distraction logs" ON distraction_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own fortress settings" ON digital_fortress_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own brain dumps" ON brain_dumps
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own brain dump items" ON brain_dump_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own emotion checkins" ON emotion_checkins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own flow sessions" ON flow_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own momentum data" ON momentum_dimensions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own momentum wins" ON momentum_wins
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_belief_scores_user_date ON belief_scores(user_id, created_at DESC);
CREATE INDEX idx_evidence_stack_user_type ON evidence_stack(user_id, evidence_type);
CREATE INDEX idx_mindset_pillars_user_date ON mindset_pillars(user_id, created_at DESC);
CREATE INDEX idx_confidence_user_date ON confidence_quotients(user_id, created_at DESC);
CREATE INDEX idx_focus_sessions_user_status ON focus_sessions(user_id, session_status);
CREATE INDEX idx_brain_dumps_user_date ON brain_dumps(user_id, created_at DESC);
CREATE INDEX idx_emotion_checkins_user_state ON emotion_checkins(user_id, current_state);
CREATE INDEX idx_momentum_user_date ON momentum_dimensions(user_id, created_at DESC);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_belief_scores_updated_at BEFORE UPDATE ON belief_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mindset_pillars_updated_at BEFORE UPDATE ON mindset_pillars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mindset_reframes_updated_at BEFORE UPDATE ON mindset_reframes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_confidence_quotients_updated_at BEFORE UPDATE ON confidence_quotients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affirmations_updated_at BEFORE UPDATE ON affirmations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brain_dump_items_updated_at BEFORE UPDATE ON brain_dump_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_momentum_dimensions_updated_at BEFORE UPDATE ON momentum_dimensions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
