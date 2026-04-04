-- Migration: 002_tier1_core_foundation_schema.sql
-- Description: Complete Tier 1 Core Foundation Layer tables
-- Created: 2026-04-04

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TIER 1: CORE FOUNDATION LAYER TABLES
-- ============================================

-- 1. BELIEF ARCHITECTURE SYSTEM
-- ============================================
CREATE TABLE IF NOT EXISTS public.belief_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100) DEFAULT 50,
  level INTEGER CHECK (level >= 1 AND level <= 5) DEFAULT 1,
  micro_proof_count INTEGER DEFAULT 0,
  pattern_recognition_count INTEGER DEFAULT 0,
  capability_evidence_count INTEGER DEFAULT 0,
  identity_milestones INTEGER DEFAULT 0,
  legendary_moments INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.belief_evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  evidence_type TEXT CHECK (evidence_type IN ('micro_proof', 'pattern', 'capability', 'identity', 'legendary')) NOT NULL,
  description TEXT NOT NULL,
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
  related_belief TEXT,
  date_recorded DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUCCESS MINDSET FORGE
-- ============================================
CREATE TABLE IF NOT EXISTS public.mindset_pillars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pillar_name TEXT CHECK (pillar_name IN (
    'abundance_consciousness',
    'growth_mindset',
    'resilience',
    'possibility_expansion',
    'owner_mentality',
    'long_term_vision',
    'limitless_potential'
  )) NOT NULL,
  current_score INTEGER CHECK (current_score >= 0 AND current_score <= 100) DEFAULT 50,
  target_score INTEGER CHECK (target_score >= 0 AND target_score <= 100) DEFAULT 80,
  practice_streak INTEGER DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  insights TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pillar_name)
);

CREATE TABLE IF NOT EXISTS public.mindset_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pillar_name TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  content TEXT NOT NULL,
  completion_status TEXT CHECK (completion_status IN ('started', 'completed', 'skipped')) DEFAULT 'started',
  reflection TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONFIDENCE CORE
-- ============================================
CREATE TABLE IF NOT EXISTS public.confidence_quotients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  overall_cq INTEGER CHECK (overall_cq >= 0 AND overall_cq <= 100) DEFAULT 50,
  technical_cq INTEGER CHECK (technical_cq >= 0 AND technical_cq <= 100) DEFAULT 40,
  sales_cq INTEGER CHECK (sales_cq >= 0 AND sales_cq <= 100) DEFAULT 40,
  strategy_cq INTEGER CHECK (strategy_cq >= 0 AND strategy_cq <= 100) DEFAULT 40,
  creative_cq INTEGER CHECK (creative_cq >= 0 AND creative_cq <= 100) DEFAULT 50,
  communication_cq INTEGER CHECK (communication_cq >= 0 AND communication_cq <= 100) DEFAULT 45,
  leadership_cq INTEGER CHECK (leadership_cq >= 0 AND leadership_cq <= 100) DEFAULT 35,
  last_assessment TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.confidence_evidence_stack (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  layer INTEGER CHECK (layer >= 1 AND layer <= 5) NOT NULL,
  evidence_type TEXT CHECK (evidence_type IN ('micro_win', 'daily_victory', 'weekly_breakthrough', 'monthly_transformation', 'legendary_proof')) NOT NULL,
  description TEXT NOT NULL,
  domain TEXT CHECK (domain IN ('technical', 'sales', 'strategy', 'creative', 'communication', 'leadership', 'general')),
  impact_rating INTEGER CHECK (impact_rating >= 1 AND impact_rating <= 10),
  date_recorded DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AFFIRMATION & JOURNALING
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_type TEXT CHECK (entry_type IN ('morning_ritual', 'evening_ritual', 'midday_check', 'spontaneous')) NOT NULL,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('energized', 'peaceful', 'anxious', 'grateful', 'focused', 'tired', 'excited', 'reflective')),
  gratitude_items TEXT[] DEFAULT '{}',
  affirmations_used TEXT[] DEFAULT '{}',
  mind_alignment_score INTEGER CHECK (mind_alignment_score >= 0 AND mind_alignment_score <= 100),
  body_alignment_score INTEGER CHECK (body_alignment_score >= 0 AND body_alignment_score <= 100),
  soul_alignment_score INTEGER CHECK (soul_alignment_score >= 0 AND soul_alignment_score <= 100),
  entry_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  affirmation_text TEXT NOT NULL,
  category TEXT CHECK (category IN ('capability', 'abundance', 'resilience', 'success', 'purpose', 'identity', 'growth')),
  is_proof_based BOOLEAN DEFAULT FALSE,
  evidence_reference TEXT,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.journal_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_entries INTEGER DEFAULT 0,
  morning_completions INTEGER DEFAULT 0,
  evening_completions INTEGER DEFAULT 0,
  last_entry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DISTRACTIONS KILLER (5-Layer Defense)
-- ============================================
CREATE TABLE IF NOT EXISTS public.digital_fortress_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  layer_1_digital_enabled BOOLEAN DEFAULT FALSE,
  blocked_apps TEXT[] DEFAULT '{}',
  blocked_websites TEXT[] DEFAULT '{}',
  notification_silenced BOOLEAN DEFAULT FALSE,
  layer_2_physical_enabled BOOLEAN DEFAULT FALSE,
  workspace_setup_notes TEXT,
  sensory_preferences JSONB DEFAULT '{}',
  layer_3_cognitive_enabled BOOLEAN DEFAULT FALSE,
  single_task_mode BOOLEAN DEFAULT FALSE,
  intention_statement TEXT,
  layer_4_social_enabled BOOLEAN DEFAULT FALSE,
  status_message TEXT,
  auto_responder_enabled BOOLEAN DEFAULT FALSE,
  layer_5_internal_enabled BOOLEAN DEFAULT FALSE,
  urge_surfing_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT CHECK (session_type IN ('deep_work', 'pomodoro', 'flow_state', 'planning')) DEFAULT 'deep_work',
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  interruptions_count INTEGER DEFAULT 0,
  distractions_blocked INTEGER DEFAULT 0,
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  layers_active INTEGER CHECK (layers_active >= 0 AND layers_active <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.focus_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_score INTEGER CHECK (current_score >= 0 AND current_score <= 100) DEFAULT 70,
  average_score DECIMAL(5,2) DEFAULT 70.0,
  best_score INTEGER DEFAULT 70,
  total_sessions INTEGER DEFAULT 0,
  total_focus_minutes INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  vulnerabilities_detected INTEGER DEFAULT 0,
  attempts_blocked_today INTEGER DEFAULT 0,
  last_session_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BRAIN DUMP SYSTEM
-- ============================================
CREATE TABLE IF NOT EXISTS public.brain_dumps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  raw_content TEXT NOT NULL,
  duration_seconds INTEGER,
  word_count INTEGER,
  cognitive_load_before INTEGER CHECK (cognitive_load_before >= 0 AND cognitive_load_before <= 100),
  cognitive_load_after INTEGER CHECK (cognitive_load_after >= 0 AND cognitive_load_after <= 100),
  dump_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.brain_dump_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dump_id UUID REFERENCES public.brain_dumps(id) ON DELETE CASCADE,
  item_content TEXT NOT NULL,
  category TEXT CHECK (category IN ('urgent', 'scheduled', 'idea', 'trash', 'delegate', 'release', 'reference')) NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  is_actionable BOOLEAN DEFAULT TRUE,
  scheduled_date DATE,
  ai_suggested_action TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cognitive_load_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  load_percentage INTEGER CHECK (load_percentage >= 0 AND load_percentage <= 100),
  source TEXT CHECK (source IN ('brain_dump', 'assessment', 'ai_analysis')),
  factors TEXT[] DEFAULT '{}',
  reading_date TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EMOTION CONTROLLER
-- ============================================
CREATE TABLE IF NOT EXISTS public.emotion_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_state TEXT CHECK (current_state IN (
    'anxious', 'discouraged', 'overwhelmed', 'bored', 'frustrated',
    'procrastinating', 'fatigued', 'focused', 'flow', 'excited',
    'confident', 'peaceful', 'grateful'
  )) NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10) NOT NULL,
  trigger_identified TEXT,
  target_state TEXT CHECK (target_state IN ('focused', 'flow', 'confident', 'peaceful')),
  transition_strategy_used TEXT,
  was_successful BOOLEAN,
  notes TEXT,
  checkin_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flow_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  entry_method TEXT CHECK (entry_method IN ('2_minute_ritual', 'transition_protocol', 'direct_entry')),
  depth_score INTEGER CHECK (depth_score >= 1 AND depth_score <= 10),
  interruptions INTEGER DEFAULT 0,
  work_type TEXT,
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emotion_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_type TEXT CHECK (pattern_type IN ('trigger_response', 'time_of_day', 'work_type', 'energy_cycle')) NOT NULL,
  description TEXT NOT NULL,
  frequency_count INTEGER DEFAULT 1,
  success_rate DECIMAL(5,2) DEFAULT 0.0,
  insights JSONB DEFAULT '{}',
  first_observed TIMESTAMPTZ DEFAULT NOW(),
  last_observed TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MOMENTUM BUILDER (7 Dimensions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.momentum_dimensions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dimension_name TEXT CHECK (dimension_name IN (
    'financial', 'social', 'physical', 'mental_emotional',
    'educational', 'professional', 'spiritual_meaning'
  )) NOT NULL,
  current_stage INTEGER CHECK (current_stage >= 1 AND current_stage <= 5) DEFAULT 1,
  current_score INTEGER CHECK (current_score >= 0 AND current_score <= 100) DEFAULT 20,
  momentum_velocity DECIMAL(5,2) DEFAULT 0.0,
  last_weekly_target INTEGER,
  last_weekly_actual INTEGER,
  streak_weeks INTEGER DEFAULT 0,
  total_milestones INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dimension_name)
);

CREATE TABLE IF NOT EXISTS public.momentum_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dimension_name TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score >= 10),
  activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.momentum_flywheel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  overall_momentum_score INTEGER CHECK (overall_momentum_score >= 0 AND overall_momentum_score <= 100) DEFAULT 25,
  flywheel_speed DECIMAL(5,2) DEFAULT 0.0,
  compound_growth_rate DECIMAL(5,2) DEFAULT 0.0,
  dimensions_in_sync INTEGER DEFAULT 0,
  last_momentum_check TIMESTAMPTZ,
  next_milestone_prediction DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_belief_scores_user_id ON public.belief_scores(user_id);
CREATE INDEX idx_belief_evidence_user_id ON public.belief_evidence(user_id);
CREATE INDEX idx_mindset_pillars_user_id ON public.mindset_pillars(user_id);
CREATE INDEX idx_confidence_quotients_user_id ON public.confidence_quotients(user_id);
CREATE INDEX idx_confidence_evidence_user_id ON public.confidence_evidence_stack(user_id);
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_date ON public.journal_entries(entry_date DESC);
CREATE INDEX idx_affirmations_user_id ON public.affirmations(user_id);
CREATE INDEX idx_focus_sessions_user_id ON public.focus_sessions(user_id);
CREATE INDEX idx_focus_scores_user_id ON public.focus_scores(user_id);
CREATE INDEX idx_brain_dumps_user_id ON public.brain_dumps(user_id);
CREATE INDEX idx_brain_dump_items_user_id ON public.brain_dump_items(user_id);
CREATE INDEX idx_emotion_checkins_user_id ON public.emotion_checkins(user_id);
CREATE INDEX idx_flow_sessions_user_id ON public.flow_sessions(user_id);
CREATE INDEX idx_momentum_dimensions_user_id ON public.momentum_dimensions(user_id);
CREATE INDEX idx_momentum_flywheel_user_id ON public.momentum_flywheel(user_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.belief_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.belief_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mindset_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mindset_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidence_quotients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidence_evidence_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_fortress_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_dump_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_load_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.momentum_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.momentum_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.momentum_flywheel ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
CREATE POLICY "Users can view own belief scores"
  ON public.belief_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own belief scores"
  ON public.belief_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own belief scores"
  ON public.belief_scores FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own belief scores"
  ON public.belief_scores FOR DELETE
  USING (auth.uid() = user_id);

-- Belief Evidence
CREATE POLICY "Users can view own belief evidence"
  ON public.belief_evidence FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own belief evidence"
  ON public.belief_evidence FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own belief evidence"
  ON public.belief_evidence FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own belief evidence"
  ON public.belief_evidence FOR DELETE
  USING (auth.uid() = user_id);

-- Mindset Pillars
CREATE POLICY "Users can view own mindset pillars"
  ON public.mindset_pillars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mindset pillars"
  ON public.mindset_pillars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mindset pillars"
  ON public.mindset_pillars FOR UPDATE
  USING (auth.uid() = user_id);

-- Mindset Exercises
CREATE POLICY "Users can view own mindset exercises"
  ON public.mindset_exercises FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mindset exercises"
  ON public.mindset_exercises FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mindset exercises"
  ON public.mindset_exercises FOR UPDATE
  USING (auth.uid() = user_id);

-- Confidence Quotients
CREATE POLICY "Users can view own confidence quotients"
  ON public.confidence_quotients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own confidence quotients"
  ON public.confidence_quotients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own confidence quotients"
  ON public.confidence_quotients FOR UPDATE
  USING (auth.uid() = user_id);

-- Confidence Evidence
CREATE POLICY "Users can view own confidence evidence"
  ON public.confidence_evidence_stack FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own confidence evidence"
  ON public.confidence_evidence_stack FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own confidence evidence"
  ON public.confidence_evidence_stack FOR UPDATE
  USING (auth.uid() = user_id);

-- Journal Entries
CREATE POLICY "Users can view own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

-- Affirmations
CREATE POLICY "Users can view own affirmations"
  ON public.affirmations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own affirmations"
  ON public.affirmations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affirmations"
  ON public.affirmations FOR UPDATE
  USING (auth.uid() = user_id);

-- Journal Streaks
CREATE POLICY "Users can view own journal streaks"
  ON public.journal_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal streaks"
  ON public.journal_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal streaks"
  ON public.journal_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Digital Fortress Settings
CREATE POLICY "Users can view own fortress settings"
  ON public.digital_fortress_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fortress settings"
  ON public.digital_fortress_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fortress settings"
  ON public.digital_fortress_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Focus Sessions
CREATE POLICY "Users can view own focus sessions"
  ON public.focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus sessions"
  ON public.focus_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own focus sessions"
  ON public.focus_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Focus Scores
CREATE POLICY "Users can view own focus scores"
  ON public.focus_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus scores"
  ON public.focus_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own focus scores"
  ON public.focus_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- Brain Dumps
CREATE POLICY "Users can view own brain dumps"
  ON public.brain_dumps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brain dumps"
  ON public.brain_dumps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brain dumps"
  ON public.brain_dumps FOR UPDATE
  USING (auth.uid() = user_id);

-- Brain Dump Items
CREATE POLICY "Users can view own brain dump items"
  ON public.brain_dump_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brain dump items"
  ON public.brain_dump_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brain dump items"
  ON public.brain_dump_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Cognitive Load Readings
CREATE POLICY "Users can view own cognitive load readings"
  ON public.cognitive_load_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cognitive load readings"
  ON public.cognitive_load_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Emotion Checkins
CREATE POLICY "Users can view own emotion checkins"
  ON public.emotion_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotion checkins"
  ON public.emotion_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emotion checkins"
  ON public.emotion_checkins FOR UPDATE
  USING (auth.uid() = user_id);

-- Flow Sessions
CREATE POLICY "Users can view own flow sessions"
  ON public.flow_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flow sessions"
  ON public.flow_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flow sessions"
  ON public.flow_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Emotion Patterns
CREATE POLICY "Users can view own emotion patterns"
  ON public.emotion_patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotion patterns"
  ON public.emotion_patterns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Momentum Dimensions
CREATE POLICY "Users can view own momentum dimensions"
  ON public.momentum_dimensions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own momentum dimensions"
  ON public.momentum_dimensions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own momentum dimensions"
  ON public.momentum_dimensions FOR UPDATE
  USING (auth.uid() = user_id);

-- Momentum Activities
CREATE POLICY "Users can view own momentum activities"
  ON public.momentum_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own momentum activities"
  ON public.momentum_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Momentum Flywheel
CREATE POLICY "Users can view own momentum flywheel"
  ON public.momentum_flywheel FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own momentum flywheel"
  ON public.momentum_flywheel FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own momentum flywheel"
  ON public.momentum_flywheel FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_belief_scores_updated_at
  BEFORE UPDATE ON public.belief_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mindset_pillars_updated_at
  BEFORE UPDATE ON public.mindset_pillars
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_confidence_quotients_updated_at
  BEFORE UPDATE ON public.confidence_quotients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brain_dump_items_updated_at
  BEFORE UPDATE ON public.brain_dump_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_streaks_updated_at
  BEFORE UPDATE ON public.journal_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_digital_fortress_settings_updated_at
  BEFORE UPDATE ON public.digital_fortress_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_focus_scores_updated_at
  BEFORE UPDATE ON public.focus_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_momentum_dimensions_updated_at
  BEFORE UPDATE ON public.momentum_dimensions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_momentum_flywheel_updated_at
  BEFORE UPDATE ON public.momentum_flywheel
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
