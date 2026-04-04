-- ==========================================
-- FOUNDRYAI TIER 1: CORE FOUNDATION LAYER
-- Version: 1.0.0
-- Created: April 1, 2026
-- Purpose: Create all Tier 1 Core Foundation tables
-- ==========================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TIER 1 SUBSYSTEM 1: BELIEF ARCHITECTURE
-- ==========================================

-- Belief Scores: Real-time belief strength tracking
CREATE TABLE IF NOT EXISTS public.foundryai_belief_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  belief_strength INTEGER CHECK (belief_strength >= 0 AND belief_strength <= 100) DEFAULT 50,
  identity_level INTEGER CHECK (identity_level >= 1 AND identity_level <= 5) DEFAULT 1,
  conviction_category TEXT CHECK (conviction_category IN ('financial', 'capability', 'worthiness', 'inevitability')),
  calibration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  morning_intention TEXT,
  evening_reflection TEXT,
  pattern_insights JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_belief_scores IS 'Daily belief strength scores and calibration records';

-- Evidence Stack: Proof-based belief construction
CREATE TABLE IF NOT EXISTS public.foundryai_evidence_stack (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  layer INTEGER CHECK (layer >= 1 AND layer <= 5) NOT NULL,
  evidence_type TEXT CHECK (evidence_type IN ('micro_win', 'daily_victory', 'weekly_breakthrough', 'monthly_transformation', 'legendary_proof')),
  evidence_description TEXT NOT NULL,
  capability_proven TEXT NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
  external_validation JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  is_highlighted BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE public.foundryai_evidence_stack IS '5-layer evidence stack for proof-based belief formation';

-- ==========================================
-- TIER 1 SUBSYSTEM 2: SUCCESS MINDSET FORGE
-- ==========================================

-- Mindset Pillars: 7-pillar psychology framework tracking
CREATE TABLE IF NOT EXISTS public.foundryai_mindset_pillars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  pillar_name TEXT CHECK (pillar_name IN ('abundance', 'growth', 'resilience', 'possibility', 'ownership', 'visioning', 'limitless')) NOT NULL,
  pillar_strength INTEGER CHECK (pillar_strength >= 0 AND pillar_strength <= 100) DEFAULT 50,
  daily_practice_completed BOOLEAN DEFAULT FALSE,
  practice_notes TEXT,
  limiting_belief_identified TEXT,
  empowering_replacement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pillar_name, DATE(created_at))
);

COMMENT ON TABLE public.foundryai_mindset_pillars IS 'Daily tracking of 7-pillar success psychology framework';

-- ==========================================
-- TIER 1 SUBSYSTEM 3: CONFIDENCE CORE
-- ==========================================

-- Confidence Quotients: Domain-specific confidence tracking
CREATE TABLE IF NOT EXISTS public.foundryai_confidence_quotients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  domain TEXT CHECK (domain IN ('technical', 'sales', 'business', 'creative', 'communication', 'leadership', 'product', 'marketing')) NOT NULL,
  cq_score INTEGER CHECK (cq_score >= 0 AND cq_score <= 100) DEFAULT 50,
  trend_direction TEXT CHECK (trend_direction IN ('rising', 'stable', 'declining')) DEFAULT 'stable',
  last_intervention_at TIMESTAMPTZ,
  intervention_trigger TEXT,
  evidence_count INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, domain, DATE(calculated_at))
);

COMMENT ON TABLE public.foundryai_confidence_quotients IS 'Domain-specific Confidence Quotient (CQ) tracking';

-- ==========================================
-- TIER 1 SUBSYSTEM 4: AFFIRMATION & JOURNALING
-- ==========================================

-- Affirmation Sessions: Morning, midday, evening rituals
CREATE TABLE IF NOT EXISTS public.foundryai_affirmation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_type TEXT CHECK (session_type IN ('morning', 'midday', 'evening')) NOT NULL,
  evidence_reviewed JSONB,
  affirmations_spoken TEXT[],
  intent_declared TEXT,
  gratitude_entries TEXT[],
  power_pose_activated BOOLEAN DEFAULT FALSE,
  mind_body_alignment_score INTEGER CHECK (mind_body_alignment_score >= 0 AND mind_body_alignment_score <= 100),
  duration_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_affirmation_sessions IS 'Daily affirmation ceremony tracking (morning, midday, evening)';

-- ==========================================
-- TIER 1 SUBSYSTEM 5: DISTRACTIONS KILLER
-- ==========================================

-- Distraction Logs: All distraction attempts and blocks
CREATE TABLE IF NOT EXISTS public.foundryai_distraction_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  distraction_type TEXT CHECK (distraction_type IN ('digital', 'physical', 'cognitive', 'social', 'internal')) NOT NULL,
  source_application TEXT,
  trigger_context TEXT,
  defense_layer_activated INTEGER CHECK (defense_layer_activated >= 1 AND defense_layer_activated <= 5),
  was_blocked BOOLEAN DEFAULT FALSE,
  gave_in_duration_seconds INTEGER,
  urge_intensity INTEGER CHECK (urge_intensity >= 1 AND urge_intensity <= 10),
  surfed_successfully BOOLEAN,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_distraction_logs IS 'Distraction attempts and defense outcomes';

-- Focus Sessions: Deep work tracking
CREATE TABLE IF NOT EXISTS public.foundryai_focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_intention TEXT NOT NULL,
  planned_duration_minutes INTEGER NOT NULL,
  actual_duration_minutes INTEGER,
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  interruptions_count INTEGER DEFAULT 0,
  distractions_blocked INTEGER DEFAULT 0,
  flow_state_achieved BOOLEAN DEFAULT FALSE,
  flow_duration_minutes INTEGER,
  defense_layers_active JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  cognitive_load_before INTEGER CHECK (cognitive_load_before >= 0 AND cognitive_load_before <= 100),
  cognitive_load_after INTEGER CHECK (cognitive_load_after >= 0 AND cognitive_load_after <= 100)
);

COMMENT ON TABLE public.foundryai_focus_sessions IS 'Focus session tracking with defense layer status';

-- Digital Fortress Settings: User distraction preferences
CREATE TABLE IF NOT EXISTS public.foundryai_digital_fortress_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  blocked_apps TEXT[] DEFAULT '{}',
  blocked_websites TEXT[] DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  do_not_disturb_schedule JSONB,
  workspace_preferences JSONB,
  social_shield_message TEXT DEFAULT 'In deep work mode until {{time}}',
  auto_responder_enabled BOOLEAN DEFAULT FALSE,
  emergency_contacts TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_digital_fortress_settings IS 'User digital fortress configuration';

-- ==========================================
-- TIER 1 SUBSYSTEM 6: BRAIN DUMP SYSTEM
-- ==========================================

-- Brain Dumps: Mental RAM clearing sessions
CREATE TABLE IF NOT EXISTS public.foundryai_brain_dumps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  raw_content TEXT NOT NULL,
  session_type TEXT CHECK (session_type IN ('pre_session', 'micro_dump', 'end_of_day', 'emergency')) DEFAULT 'pre_session',
  categorization JSONB, -- {urgent: [], scheduled: [], ideas: [], trash: [], delegate: [], release: []}
  cognitive_load_before INTEGER CHECK (cognitive_load_before >= 0 AND cognitive_load_before <= 100),
  cognitive_load_after INTEGER CHECK (cognitive_load_after >= 0 AND cognitive_load_after <= 100),
  time_to_complete_seconds INTEGER,
  ai_categorized BOOLEAN DEFAULT FALSE,
  items_extracted INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_brain_dumps IS 'Brain dump sessions with AI categorization';

-- Cognitive Load Readings: Real-time mental RAM usage
CREATE TABLE IF NOT EXISTS public.foundryai_cognitive_load_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  load_percentage INTEGER CHECK (load_percentage >= 0 AND load_percentage <= 100),
  load_source TEXT CHECK (load_source IN ('tasks', 'decisions', 'emotions', 'external', 'mixed')),
  triggers_identified TEXT[],
  recommended_action TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_cognitive_load_readings IS 'Real-time cognitive load monitoring';

-- ==========================================
-- TIER 1 SUBSYSTEM 7: EMOTION CONTROLLER
-- ==========================================

-- Emotion Check-ins: Multi-modal emotion detection
CREATE TABLE IF NOT EXISTS public.foundryai_emotion_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  current_state TEXT CHECK (current_state IN ('anxious', 'discouraged', 'overwhelmed', 'bored', 'frustrated', 'procrastinating', 'fatigued', 'neutral', 'engaged', 'flow', 'excited')) NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  detected_via TEXT CHECK (detected_via IN ('self_report', 'text_analysis', 'behavioral', 'productivity_pattern')) DEFAULT 'self_report',
  context TEXT,
  transition_strategy_used TEXT,
  target_state TEXT CHECK (target_state IN ('focused', 'flow', 'confident', 'energized', 'calm')),
  transition_successful BOOLEAN,
  time_to_transition_seconds INTEGER,
  intervention_recommended TEXT,
  checked_in_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_emotion_checkins IS 'Emotion state tracking and transition pathways';

-- Flow Sessions: Deep flow state tracking
CREATE TABLE IF NOT EXISTS public.foundryai_flow_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  entry_ritual_used TEXT,
  trigger_activity TEXT,
  challenge_level INTEGER CHECK (challenge_level >= 1 AND challenge_level <= 10),
  skill_level INTEGER CHECK (skill_level >= 1 AND skill_level <= 10),
  flow_depth_score INTEGER CHECK (flow_depth_score >= 0 AND flow_depth_score <= 100),
  duration_minutes INTEGER,
  interruptions_count INTEGER DEFAULT 0,
  quality_indicators JSONB,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ
);

COMMENT ON TABLE public.foundryai_flow_sessions IS 'Flow state session tracking and compounding';

-- ==========================================
-- TIER 1 SUBSYSTEM 8: MOMENTUM BUILDER
-- ==========================================

-- Momentum Dimensions: 7-dimension progress tracking
CREATE TABLE IF NOT EXISTS public.foundryai_momentum_dimensions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  dimension TEXT CHECK (dimension IN ('financial', 'social', 'physical', 'mental_emotional', 'educational', 'professional', 'spiritual_meaning')) NOT NULL,
  current_stage INTEGER CHECK (current_stage >= 0 AND current_stage <= 5) DEFAULT 0,
  stage_name TEXT,
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100) DEFAULT 0,
  velocity DECIMAL(5,2) DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  milestones_this_period INTEGER DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dimension, DATE(calculated_at))
);

COMMENT ON TABLE public.foundryai_momentum_dimensions IS '7-dimension momentum tracking (Financial, Social, Physical, Mental, Educational, Professional, Spiritual)';

-- Momentum Flywheel: Compounding effect tracking
CREATE TABLE IF NOT EXISTS public.foundryai_momentum_flywheel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  flywheel_speed INTEGER CHECK (flywheel_speed >= 0 AND flywheel_speed <= 100) DEFAULT 0,
  dimensions_active INTEGER DEFAULT 0,
  compounding_multiplier DECIMAL(3,2) DEFAULT 1.00,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  daily_ritual_completed BOOLEAN DEFAULT FALSE,
  wins_across_dimensions JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, DATE(calculated_at))
);

COMMENT ON TABLE public.foundryai_momentum_flywheel IS 'Daily momentum flywheel compound effect';

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.foundryai_belief_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_evidence_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_mindset_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_confidence_quotients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_affirmation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_distraction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_digital_fortress_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_cognitive_load_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_emotion_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_flow_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_momentum_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_momentum_flywheel ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES: User Data Ownership
-- ==========================================

-- Belief Scores
CREATE POLICY "Users can manage own belief scores"
  ON public.foundryai_belief_scores FOR ALL
  USING (auth.uid() = user_id);

-- Evidence Stack
CREATE POLICY "Users can manage own evidence stack"
  ON public.foundryai_evidence_stack FOR ALL
  USING (auth.uid() = user_id);

-- Mindset Pillars
CREATE POLICY "Users can manage own mindset pillars"
  ON public.foundryai_mindset_pillars FOR ALL
  USING (auth.uid() = user_id);

-- Confidence Quotients
CREATE POLICY "Users can manage own confidence quotients"
  ON public.foundryai_confidence_quotients FOR ALL
  USING (auth.uid() = user_id);

-- Affirmation Sessions
CREATE POLICY "Users can manage own affirmation sessions"
  ON public.foundryai_affirmation_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Distraction Logs
CREATE POLICY "Users can manage own distraction logs"
  ON public.foundryai_distraction_logs FOR ALL
  USING (auth.uid() = user_id);

-- Focus Sessions
CREATE POLICY "Users can manage own focus sessions"
  ON public.foundryai_focus_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Digital Fortress Settings
CREATE POLICY "Users can manage own fortress settings"
  ON public.foundryai_digital_fortress_settings FOR ALL
  USING (auth.uid() = user_id);

-- Brain Dumps
CREATE POLICY "Users can manage own brain dumps"
  ON public.foundryai_brain_dumps FOR ALL
  USING (auth.uid() = user_id);

-- Cognitive Load Readings
CREATE POLICY "Users can manage own cognitive load readings"
  ON public.foundryai_cognitive_load_readings FOR ALL
  USING (auth.uid() = user_id);

-- Emotion Check-ins
CREATE POLICY "Users can manage own emotion check-ins"
  ON public.foundryai_emotion_checkins FOR ALL
  USING (auth.uid() = user_id);

-- Flow Sessions
CREATE POLICY "Users can manage own flow sessions"
  ON public.foundryai_flow_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Momentum Dimensions
CREATE POLICY "Users can manage own momentum dimensions"
  ON public.foundryai_momentum_dimensions FOR ALL
  USING (auth.uid() = user_id);

-- Momentum Flywheel
CREATE POLICY "Users can manage own momentum flywheel"
  ON public.foundryai_momentum_flywheel FOR ALL
  USING (auth.uid() = user_id);

-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================

-- Belief Scores indexes
CREATE INDEX IF NOT EXISTS idx_belief_scores_user_date ON public.foundryai_belief_scores(user_id, calibration_date DESC);
CREATE INDEX IF NOT EXISTS idx_belief_scores_strength ON public.foundryai_belief_scores(belief_strength DESC);

-- Evidence Stack indexes
CREATE INDEX IF NOT EXISTS idx_evidence_stack_user_layer ON public.foundryai_evidence_stack(user_id, layer);
CREATE INDEX IF NOT EXISTS idx_evidence_stack_type ON public.foundryai_evidence_stack(evidence_type);
CREATE INDEX IF NOT EXISTS idx_evidence_stack_highlighted ON public.foundryai_evidence_stack(is_highlighted) WHERE is_highlighted = TRUE;

-- Mindset Pillars indexes
CREATE INDEX IF NOT EXISTS idx_mindset_pillars_user_pillar ON public.foundryai_mindset_pillars(user_id, pillar_name);
CREATE INDEX IF NOT EXISTS idx_mindset_pillars_date ON public.foundryai_mindset_pillars(user_id, DATE(created_at));

-- Confidence Quotients indexes
CREATE INDEX IF NOT EXISTS idx_cq_user_domain ON public.foundryai_confidence_quotients(user_id, domain);
CREATE INDEX IF NOT EXISTS idx_cq_score ON public.foundryai_confidence_quotients(cq_score);

-- Affirmation Sessions indexes
CREATE INDEX IF NOT EXISTS idx_affirmation_user_type ON public.foundryai_affirmation_sessions(user_id, session_type);
CREATE INDEX IF NOT EXISTS idx_affirmation_completed ON public.foundryai_affirmation_sessions(completed_at DESC);

-- Distraction Logs indexes
CREATE INDEX IF NOT EXISTS idx_distractions_user_type ON public.foundryai_distraction_logs(user_id, distraction_type);
CREATE INDEX IF NOT EXISTS idx_distractions_blocked ON public.foundryai_distraction_logs(was_blocked);
CREATE INDEX IF NOT EXISTS idx_distractions_logged ON public.foundryai_distraction_logs(logged_at DESC);

-- Focus Sessions indexes
CREATE INDEX IF NOT EXISTS idx_focus_user_score ON public.foundryai_focus_sessions(user_id, focus_score DESC);
CREATE INDEX IF NOT EXISTS idx_focus_flow ON public.foundryai_focus_sessions(flow_state_achieved) WHERE flow_state_achieved = TRUE;
CREATE INDEX IF NOT EXISTS idx_focus_started ON public.foundryai_focus_sessions(started_at DESC);

-- Brain Dumps indexes
CREATE INDEX IF NOT EXISTS idx_brain_dumps_user_type ON public.foundryai_brain_dumps(user_id, session_type);
CREATE INDEX IF NOT EXISTS idx_brain_dumps_created ON public.foundryai_brain_dumps(created_at DESC);

-- Cognitive Load indexes
CREATE INDEX IF NOT EXISTS idx_cognitive_load_user ON public.foundryai_cognitive_load_readings(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_cognitive_load_percentage ON public.foundryai_cognitive_load_readings(load_percentage);

-- Emotion Check-ins indexes
CREATE INDEX IF NOT EXISTS idx_emotion_user_state ON public.foundryai_emotion_checkins(user_id, current_state);
CREATE INDEX IF NOT EXISTS idx_emotion_checked_in ON public.foundryai_emotion_checkins(checked_in_at DESC);
CREATE INDEX IF NOT EXISTS idx_emotion_transition_success ON public.foundryai_emotion_checkins(transition_successful);

-- Flow Sessions indexes
CREATE INDEX IF NOT EXISTS idx_flow_user_depth ON public.foundryai_flow_sessions(user_id, flow_depth_score DESC);
CREATE INDEX IF NOT EXISTS idx_flow_entered ON public.foundryai_flow_sessions(entered_at DESC);

-- Momentum indexes
CREATE INDEX IF NOT EXISTS idx_momentum_user_dim ON public.foundryai_momentum_dimensions(user_id, dimension);
CREATE INDEX IF NOT EXISTS idx_momentum_stage ON public.foundryai_momentum_dimensions(current_stage);
CREATE INDEX IF NOT EXISTS idx_flywheel_user_date ON public.foundryai_momentum_flywheel(user_id, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_flywheel_speed ON public.foundryai_momentum_flywheel(flywheel_speed DESC);

-- ==========================================
-- AUTO-UPDATE TRIGGER FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_belief_scores_updated_at 
  BEFORE UPDATE ON public.foundryai_belief_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mindset_pillars_updated_at 
  BEFORE UPDATE ON public.foundryai_mindset_pillars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fortress_settings_updated_at 
  BEFORE UPDATE ON public.foundryai_digital_fortress_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SCHEMA VERIFICATION
-- ==========================================

DO $$
DECLARE
  table_count INTEGER;
  policy_count INTEGER;
  index_count INTEGER;
BEGIN
  -- Count Tier 1 tables
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name LIKE 'foundryai_%';
  
  -- Count RLS policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
  AND tablename LIKE 'foundryai_%';
  
  -- Count indexes
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes 
  WHERE schemaname = 'public' 
  AND tablename LIKE 'foundryai_%';
  
  RAISE NOTICE 'FoundryAI Tier 1 Schema Created:';
  RAISE NOTICE '- Total Tables: %', table_count;
  RAISE NOTICE '- RLS Policies: %', policy_count;
  RAISE NOTICE '- Indexes: %', index_count;
  RAISE NOTICE 'Tier 1 Core Foundation Layer: READY';
END $$;

-- ==========================================
-- MIGRATION COMPLETE
-- ==========================================
