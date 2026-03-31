-- ==========================================
-- Migration: Add AI Response Cache Table
-- Created: March 31, 2026
-- Purpose: Cache AI responses to reduce API costs
-- ==========================================

CREATE TABLE IF NOT EXISTS public.ai_response_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_hash VARCHAR(64) UNIQUE NOT NULL,
  response TEXT NOT NULL,
  provider VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  access_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.ai_response_cache IS 'Cache for AI responses to reduce API costs';

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ai_response_cache_hash ON public.ai_response_cache(prompt_hash);

-- Enable RLS
ALTER TABLE public.ai_response_cache ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role can manage cache"
  ON public.ai_response_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ==========================================
-- Migration: Add Plans Table
-- Created: March 31, 2026
-- Purpose: Store generated business plans
-- ==========================================

CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title VARCHAR(500) NOT NULL,
  business_idea TEXT NOT NULL,
  archetype VARCHAR(100) NOT NULL,
  canvas JSONB DEFAULT '{}',
  market_analysis JSONB DEFAULT '{}',
  gtm_strategy JSONB DEFAULT '{}',
  financial_projections JSONB DEFAULT '{}',
  action_items JSONB DEFAULT '{}',
  ai_provider VARCHAR(100),
  generation_time_ms INTEGER,
  version VARCHAR(20) DEFAULT '1.0',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.plans IS 'User-generated business plans with structured data';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON public.plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON public.plans(status);
CREATE INDEX IF NOT EXISTS idx_plans_created_at ON public.plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plans_is_favorite ON public.plans(is_favorite);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Users can only access their own plans
CREATE POLICY "Users can manage own plans"
  ON public.plans
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- Migration: Add User Opportunities Table
-- Created: March 31, 2026
-- Purpose: Track user-saved opportunities
-- ==========================================

CREATE TABLE IF NOT EXISTS public.user_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  opportunity_id UUID REFERENCES public.foundryai_opportunities(id) NOT NULL,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'in_progress', 'completed', 'dismissed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

COMMENT ON TABLE public.user_opportunities IS 'User saved and tracked opportunities';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_opportunities_user_id ON public.user_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_opportunities_opportunity_id ON public.user_opportunities(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_user_opportunities_status ON public.user_opportunities(status);

-- Enable RLS
ALTER TABLE public.user_opportunities ENABLE ROW LEVEL SECURITY;

-- Users can only access their own saved opportunities
CREATE POLICY "Users can manage own saved opportunities"
  ON public.user_opportunities
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_opportunities_updated_at
  BEFORE UPDATE ON public.user_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
