-- ============================================
-- Migration 006: Tier 5 Education & Gamification
// Learning Paths, Spaced Repetition, Points, Badges, Leaderboards
-- ============================================

-- Learning paths
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  archetype TEXT NOT NULL,
  pace TEXT DEFAULT 'moderate' CHECK (pace IN ('slow', 'moderate', 'fast')),
  experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  learning_style TEXT DEFAULT 'mixed' CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'mixed')),
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  is_active BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning modules within paths
CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL,
  content_type TEXT DEFAULT 'interactive' CHECK (content_type IN ('video', 'text', 'interactive', 'exercise', 'quiz')),
  content_url TEXT,
  estimated_duration_minutes INT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(path_id, order_index)
);

-- Spaced repetition items
CREATE TABLE IF NOT EXISTS spaced_repetition_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES learning_modules(id) ON DELETE SET NULL,
  front_content TEXT NOT NULL,
  back_content TEXT NOT NULL,
  interval_days INT DEFAULT 1,
  repetition_count INT DEFAULT 0,
  ease_factor DECIMAL(4,2) DEFAULT 2.5,
  next_review_date DATE DEFAULT (CURRENT_DATE + INTERVAL '1 day'),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'learning', 'review', 'mastered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_spaced_repetition_review ON spaced_repetition_items(user_id, next_review_date) WHERE next_review_date <= CURRENT_DATE;

-- Gamification points log
CREATE TABLE IF NOT EXISTS points_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points_awarded INT NOT NULL,
  source TEXT NOT NULL, -- daily_login, task_completed, streak, achievement, etc.
  source_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_points_log_user ON points_log(user_id, created_at DESC);

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_reward INT DEFAULT 0,
  tier INT DEFAULT 1,
  criteria JSONB NOT NULL, -- JSON structure defining how to earn
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's earned achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievement_definitions(id) NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress_data JSONB,
  UNIQUE(user_id, achievement_id)
);

-- Streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  streak_type TEXT NOT NULL, -- daily_login, daily_checkin, daily_focus
  current_streak INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- Leaderboard entries (daily/weekly/monthly)
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  points_earned INT DEFAULT 0,
  rank_position INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill matrix
CREATE TABLE IF NOT EXISTS skill_matrix (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  archetype TEXT,
  current_level INT DEFAULT 0 CHECK (current_level BETWEEN 0 AND 5),
  xp_in_level INT DEFAULT 0,
  xp_for_next_level INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Seed initial achievements
INSERT INTO achievement_definitions (slug, name, description, icon, points_reward, tier, criteria) VALUES
('first_login', 'First Steps', 'Logged into FoundryAI for the first time', '🚀', 10, 1, '{"type": "event", "event": "first_login"}'),
('first_checkin', 'Morning Ritual', 'Completed your first daily check-in', '☀️', 25, 1, '{"type": "event", "event": "first_checkin"}'),
('first_brain_dump', 'Mind Clearer', 'Completed your first brain dump', '🧠', 30, 1, '{"type": "event", "event": "first_brain_dump"}'),
('first_idea', 'Visionary', 'Got your first AI-extracted idea', '💡', 50, 2, '{"type": "event", "event": "first_idea"}'),
('first_project', 'Builder', 'Started your first project', '🔨', 100, 3, '{"type": "event", "event": "first_project"}'),
('first_revenue', 'Money Maker', 'Earned your first dollar', '💰', 200, 4, '{"type": "event", "event": "first_revenue"}'),
('streak_7', 'Week Warrior', 'Maintained a 7-day daily streak', '🔥', 75, 1, '{"type": "streak", "days": 7}'),
('streak_30', 'Month Master', 'Maintained a 30-day daily streak', '⚡', 300, 2, '{"type": "streak", "days": 30}'),
('level_10', 'Decathlete', 'Reached level 10', '🏆', 500, 3, '{"type": "level", "level": 10}'),
('all_dimensions', 'Hex Warrior', 'Scored 50+ in all 7 momentum dimensions', '🌟', 250, 2, '{"type": "momentum", "all_above": 50}');

-- RLS
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaced_repetition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_matrix ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own learning_paths" ON learning_paths FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own learning_modules" ON learning_modules FOR ALL USING (
  auth.uid() = (SELECT user_id FROM learning_paths WHERE id = learning_modules.path_id)
);
CREATE POLICY "Users can manage own spaced_repetition_items" ON spaced_repetition_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own points_log" ON points_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view achievement_definitions" ON achievement_definitions FOR SELECT USING (true);
CREATE POLICY "Users can view own user_achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own user_streaks" ON user_streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own leaderboard_entries" ON leaderboard_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view leaderboard" ON leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Users can manage own skill_matrix" ON skill_matrix FOR ALL USING (auth.uid() = user_id);
