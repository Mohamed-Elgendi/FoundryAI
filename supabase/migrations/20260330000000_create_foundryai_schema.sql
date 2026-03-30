-- ==========================================
-- FOUNDRYAI DATABASE SCHEMA
-- Version: 1.0.0
-- Created: March 30, 2026
-- Purpose: Create all FoundryAI tables with RLS policies
-- Note: Using 'foundryai_' prefix to avoid conflicts with existing tables
-- ==========================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLE 1: foundryai_profiles
-- Stores user profile information and tier status
-- ==========================================
CREATE TABLE IF NOT EXISTS public.foundryai_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro', 'elite', 'legend')),
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  archetype TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE public.foundryai_profiles IS 'User profiles with tier and revenue tracking';

-- ==========================================
-- TABLE 2: foundryai_user_journeys
-- Tracks user progress through the platform
-- ==========================================
CREATE TABLE IF NOT EXISTS public.foundryai_user_journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  current_stage TEXT DEFAULT 'discovery' CHECK (current_stage IN ('discovery', 'onboarding', 'foundation', 'opportunity', 'build', 'launch', 'revenue', 'scale')),
  selected_archetype TEXT,
  selected_opportunity_id UUID,
  build_progress INTEGER DEFAULT 0 CHECK (build_progress >= 0 AND build_progress <= 100),
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  milestones_achieved TEXT[] DEFAULT '{}',
  momentum_scores JSONB DEFAULT '{}',
  brain_dumps JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_user_journeys IS 'User journey state and progress tracking';

-- ==========================================
-- TABLE 3: foundryai_opportunities
-- AI-validated opportunities for users to pursue
-- ==========================================
CREATE TABLE IF NOT EXISTS public.foundryai_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  archetype TEXT NOT NULL,
  category TEXT CHECK (category IN ('saas', 'content', 'service', 'product', 'agency', 'marketplace')),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  timeline TEXT,
  budget_estimate DECIMAL(10,2),
  validation_score DECIMAL(5,2) CHECK (validation_score >= 0 AND validation_score <= 100),
  trending_score DECIMAL(5,2),
  demand_signals JSONB,
  technical_feasibility JSONB,
  monetization_data JSONB,
  competition_analysis JSONB,
  keywords TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  is_trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_opportunities IS 'AI-validated business opportunities';

-- ==========================================
-- TABLE 4: foundryai_revenue
-- Revenue tracking for tier progression
-- ==========================================
CREATE TABLE IF NOT EXISTS public.foundryai_revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  source TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  milestone_triggered TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_revenue IS 'User revenue records for tier progression';

-- ==========================================
-- TABLE 5: foundryai_templates
-- AI-generated templates for building
-- ==========================================
CREATE TABLE IF NOT EXISTS public.foundryai_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  archetype TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro', 'elite', 'legend')),
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.foundryai_templates IS 'Building templates organized by tier';

-- ==========================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.foundryai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundryai_templates ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES: foundryai_profiles
-- ==========================================
CREATE POLICY "Users can view own foundryai profile"
  ON public.foundryai_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own foundryai profile"
  ON public.foundryai_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own foundryai profile"
  ON public.foundryai_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow service role to manage all profiles (for admin functions)
CREATE POLICY "Service role can manage all foundryai profiles"
  ON public.foundryai_profiles
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ==========================================
-- RLS POLICIES: foundryai_user_journeys
-- ==========================================
CREATE POLICY "Users can view own foundryai journey"
  ON public.foundryai_user_journeys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own foundryai journey"
  ON public.foundryai_user_journeys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own foundryai journey"
  ON public.foundryai_user_journeys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- RLS POLICIES: foundryai_opportunities
-- ==========================================
CREATE POLICY "FoundryAI opportunities are public read"
  ON public.foundryai_opportunities FOR SELECT
  TO PUBLIC
  USING (is_active = TRUE);

CREATE POLICY "Service role can manage foundryai opportunities"
  ON public.foundryai_opportunities FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ==========================================
-- RLS POLICIES: foundryai_revenue
-- ==========================================
CREATE POLICY "Users can view own foundryai revenue"
  ON public.foundryai_revenue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own foundryai revenue"
  ON public.foundryai_revenue FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own foundryai revenue"
  ON public.foundryai_revenue FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own foundryai revenue"
  ON public.foundryai_revenue FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================
-- RLS POLICIES: foundryai_templates
-- ==========================================
CREATE POLICY "FoundryAI templates are public read"
  ON public.foundryai_templates FOR SELECT
  TO PUBLIC
  USING (is_active = TRUE);

CREATE POLICY "Service role can manage foundryai templates"
  ON public.foundryai_templates FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_foundryai_profiles_email ON public.foundryai_profiles(email);
CREATE INDEX IF NOT EXISTS idx_foundryai_profiles_tier ON public.foundryai_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_foundryai_profiles_archetype ON public.foundryai_profiles(archetype);

-- User journeys indexes
CREATE INDEX IF NOT EXISTS idx_foundryai_user_journeys_user_id ON public.foundryai_user_journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_foundryai_user_journeys_stage ON public.foundryai_user_journeys(current_stage);
CREATE INDEX IF NOT EXISTS idx_foundryai_user_journeys_archetype ON public.foundryai_user_journeys(selected_archetype);

-- Opportunities indexes
CREATE INDEX IF NOT EXISTS idx_foundryai_opportunities_category ON public.foundryai_opportunities(category);
CREATE INDEX IF NOT EXISTS idx_foundryai_opportunities_archetype ON public.foundryai_opportunities(archetype);
CREATE INDEX IF NOT EXISTS idx_foundryai_opportunities_validation_score ON public.foundryai_opportunities(validation_score DESC);
CREATE INDEX IF NOT EXISTS idx_foundryai_opportunities_active_category ON public.foundryai_opportunities(is_active, category) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_foundryai_opportunities_trending ON public.foundryai_opportunities(is_trending) WHERE is_trending = TRUE;
CREATE INDEX IF NOT EXISTS idx_foundryai_opportunities_difficulty ON public.foundryai_opportunities(difficulty_level);

-- Revenue indexes
CREATE INDEX IF NOT EXISTS idx_foundryai_revenue_user_id ON public.foundryai_revenue(user_id);
CREATE INDEX IF NOT EXISTS idx_foundryai_revenue_user_date ON public.foundryai_revenue(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_foundryai_revenue_milestone ON public.foundryai_revenue(milestone_triggered) WHERE milestone_triggered IS NOT NULL;

-- Templates indexes
CREATE INDEX IF NOT EXISTS idx_foundryai_templates_archetype ON public.foundryai_templates(archetype);
CREATE INDEX IF NOT EXISTS idx_foundryai_templates_tier ON public.foundryai_templates(tier);
CREATE INDEX IF NOT EXISTS idx_foundryai_templates_category ON public.foundryai_templates(category);

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

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_foundryai_profiles_updated_at 
  BEFORE UPDATE ON public.foundryai_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foundryai_user_journeys_updated_at 
  BEFORE UPDATE ON public.foundryai_user_journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foundryai_opportunities_updated_at 
  BEFORE UPDATE ON public.foundryai_opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foundryai_templates_updated_at 
  BEFORE UPDATE ON public.foundryai_templates
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
  -- Count tables
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
  
  RAISE NOTICE 'FoundryAI Schema Created:';
  RAISE NOTICE '- Tables: %/5', table_count;
  RAISE NOTICE '- RLS Policies: %', policy_count;
  RAISE NOTICE '- Indexes: %', index_count;
END $$;

-- ==========================================
-- MIGRATION COMPLETE
-- ==========================================
