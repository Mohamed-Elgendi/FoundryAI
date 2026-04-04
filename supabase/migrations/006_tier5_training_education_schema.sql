-- Tier 5: Training & Education Layer Database Schema
-- Learning paths, skill matrix, spaced repetition, certifications

-- ============================================================================
-- LEARNING PATHS SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Path metadata
  path_name VARCHAR(200) NOT NULL,
  path_description TEXT,
  category VARCHAR(100), -- 'technical', 'business', 'marketing', 'personal_development'
  
  -- Progress tracking
  total_modules INTEGER NOT NULL,
  completed_modules INTEGER DEFAULT 0,
  progress_percentage INTEGER GENERATED ALWAYS AS (
    CASE WHEN total_modules > 0 THEN (completed_modules * 100 / total_modules) ELSE 0 END
  ) STORED,
  
  -- Status
  status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'paused'
  
  -- Time tracking
  estimated_hours_total INTEGER,
  hours_spent INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Priority and scheduling
  priority INTEGER DEFAULT 5, -- 1-10 scale
  scheduled_start_date DATE,
  target_completion_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  
  -- Module details
  module_number INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Content
  content_type VARCHAR(50), -- 'video', 'article', 'interactive', 'quiz', 'project'
  content_url TEXT,
  content_data JSONB, -- Flexible content storage
  
  -- Progress
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  
  -- Assessment
  has_quiz BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER,
  quiz_passed BOOLEAN,
  
  -- Dependencies
  prerequisite_module_ids UUID[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_module_number_per_path UNIQUE (path_id, module_number)
);

-- ============================================================================
-- SKILL MATRIX SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  category_name VARCHAR(100) NOT NULL UNIQUE,
  category_description TEXT,
  icon_name VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default skill categories
INSERT INTO skill_categories (category_name, category_description, display_order) VALUES
  ('Technical Skills', 'Coding, development, and technical implementation abilities', 1),
  ('Business Acumen', 'Strategy, operations, and business understanding', 2),
  ('Marketing & Sales', 'Growth, acquisition, and revenue generation', 3),
  ('Product Design', 'UX, UI, and product development skills', 4),
  ('Leadership', 'Team management and leadership capabilities', 5),
  ('Communication', 'Writing, speaking, and presentation skills', 6)
ON CONFLICT (category_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES skill_categories(id),
  
  skill_name VARCHAR(100) NOT NULL,
  skill_description TEXT,
  
  -- Difficulty and importance
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
  importance_weight INTEGER CHECK (importance_weight >= 1 AND importance_weight <= 10),
  
  -- Learning resources
  recommended_resources JSONB,
  estimated_hours_to_learn INTEGER,
  
  -- Certification available
  has_certification BOOLEAN DEFAULT FALSE,
  certification_provider VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_skill_name UNIQUE (skill_name)
);

CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  
  -- Proficiency level (0-100)
  proficiency_level INTEGER CHECK (proficiency_level >= 0 AND proficiency_level <= 100),
  
  -- Experience
  years_experience DECIMAL(4,1),
  projects_completed INTEGER DEFAULT 0,
  
  -- Self-assessment
  confidence_rating INTEGER CHECK (confidence_rating >= 1 AND confidence_rating <= 10),
  
  -- Status
  is_target_skill BOOLEAN DEFAULT FALSE, -- Skill user wants to develop
  is_core_competency BOOLEAN DEFAULT FALSE, -- Skill user excels at
  
  -- Learning tracking
  learning_started_at TIMESTAMP WITH TIME ZONE,
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  
  -- Verification
  is_certified BOOLEAN DEFAULT FALSE,
  certification_date TIMESTAMP WITH TIME ZONE,
  certification_proof_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
);

-- ============================================================================
-- SPACED REPETITION SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS knowledge_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Card content
  front_content TEXT NOT NULL, -- Question or prompt
  back_content TEXT NOT NULL, -- Answer or explanation
  
  -- Categorization
  category VARCHAR(100),
  tags TEXT[],
  difficulty INTEGER DEFAULT 3, -- 1-5 scale
  
  -- Media
  front_media_url TEXT,
  back_media_url TEXT,
  
  -- Source
  source_type VARCHAR(50), -- 'manual', 'extracted', 'imported'
  source_reference TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS spaced_repetition_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES knowledge_cards(id) ON DELETE CASCADE,
  
  -- Scheduling (SM-2 algorithm)
  interval_days INTEGER DEFAULT 1,
  repetition_count INTEGER DEFAULT 0,
  ease_factor DECIMAL(3,2) DEFAULT 2.5,
  
  -- Next review
  next_review_date DATE NOT NULL,
  next_review_timestamp TIMESTAMP WITH TIME ZONE,
  
  -- Review history
  total_reviews INTEGER DEFAULT 0,
  correct_reviews INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  
  -- Last review
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  last_rating INTEGER, -- 1-4 (again/hard/good/easy)
  
  -- Status
  is_suspended BOOLEAN DEFAULT FALSE,
  suspended_until TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_card UNIQUE (user_id, card_id)
);

CREATE TABLE IF NOT EXISTS review_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES knowledge_cards(id) ON DELETE CASCADE,
  queue_id UUID REFERENCES spaced_repetition_queue(id),
  
  -- Review details
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rating INTEGER NOT NULL, -- 1-4
  response_time_seconds INTEGER, -- How long to answer
  
  -- Performance
  was_correct BOOLEAN GENERATED ALWAYS AS (rating >= 3) STORED,
  
  -- Context
  review_session_id UUID,
  device_type VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CERTIFICATIONS & CREDENTIALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Certification details
  certification_name VARCHAR(200) NOT NULL,
  issuing_organization VARCHAR(200) NOT NULL,
  certification_description TEXT,
  
  -- Category and skill
  category VARCHAR(100),
  related_skill_id UUID REFERENCES skills(id),
  
  -- Dates
  issue_date DATE NOT NULL,
  expiration_date DATE,
  is_lifetime BOOLEAN DEFAULT FALSE,
  
  -- Verification
  credential_id VARCHAR(200),
  verification_url TEXT,
  credential_image_url TEXT,
  
  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  verification_method VARCHAR(50), -- 'manual', 'api', 'upload'
  
  -- Meta
  level VARCHAR(50), -- 'entry', 'intermediate', 'advanced', 'expert'
  hours_required INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certification_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  path_name VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Provider info
  provider_name VARCHAR(200),
  provider_url TEXT,
  
  -- Structure
  prerequisites JSONB, -- Required skills or certifications
  required_courses JSONB, -- List of required course IDs
  electives_required INTEGER DEFAULT 0,
  elective_options JSONB,
  
  -- Time and cost
  estimated_duration_hours INTEGER,
  estimated_cost_usd DECIMAL(10,2),
  
  -- Meta
  difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  industry_recognition VARCHAR(50), -- 'high', 'medium', 'low'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- LEARNING ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_learning_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Date
  stats_date DATE NOT NULL,
  
  -- Time metrics
  total_learning_minutes INTEGER DEFAULT 0,
  video_minutes INTEGER DEFAULT 0,
  reading_minutes INTEGER DEFAULT 0,
  practice_minutes INTEGER DEFAULT 0,
  
  -- Content metrics
  videos_watched INTEGER DEFAULT 0,
  articles_read INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  cards_reviewed INTEGER DEFAULT 0,
  
  -- Progress metrics
  modules_completed INTEGER DEFAULT 0,
  skills_practiced INTEGER DEFAULT 0,
  quiz_score_avg DECIMAL(4,2),
  
  -- Streaks
  daily_streak INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_date UNIQUE (user_id, stats_date)
);

CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Session details
  session_type VARCHAR(50) NOT NULL, -- 'video', 'reading', 'practice', 'quiz', 'review'
  content_id UUID, -- Reference to module, card, etc.
  content_type VARCHAR(50), -- 'module', 'card', 'article'
  
  -- Time tracking
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  
  -- Engagement
  completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  notes TEXT,
  
  -- Performance
  score INTEGER,
  difficulty_rating INTEGER, -- 1-5
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaced_repetition_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_learning_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own learning paths" ON learning_paths
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own learning modules" ON learning_modules
  FOR ALL USING (EXISTS (
    SELECT 1 FROM learning_paths WHERE id = learning_modules.path_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can only access their own skill records" ON user_skills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own knowledge cards" ON knowledge_cards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own spaced repetition queue" ON spaced_repetition_queue
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own review history" ON review_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own certifications" ON certifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own learning stats" ON daily_learning_stats
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own learning sessions" ON learning_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_learning_paths_user_status ON learning_paths(user_id, status);
CREATE INDEX idx_modules_path_number ON learning_modules(path_id, module_number);
CREATE INDEX idx_user_skills_proficiency ON user_skills(user_id, proficiency_level DESC);
CREATE INDEX idx_queue_user_review_date ON spaced_repetition_queue(user_id, next_review_date);
CREATE INDEX idx_review_history_user_date ON review_history(user_id, reviewed_at DESC);
CREATE INDEX idx_certifications_user_date ON certifications(user_id, issue_date DESC);
CREATE INDEX idx_learning_stats_user_date ON daily_learning_stats(user_id, stats_date DESC);
CREATE INDEX idx_learning_sessions_user_type ON learning_sessions(user_id, session_type);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_modules_updated_at BEFORE UPDATE ON learning_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON user_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_cards_updated_at BEFORE UPDATE ON knowledge_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spaced_repetition_queue_updated_at BEFORE UPDATE ON spaced_repetition_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_learning_stats_updated_at BEFORE UPDATE ON daily_learning_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
