-- ============================================
-- Migration 004: Tier 3 Launch Protocol
-- Projects, Build Workflow, Milestones
-- ============================================

-- Projects (from selected ideas)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES extracted_ideas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  archetype TEXT NOT NULL,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'building', 'testing', 'launched', 'paused', 'completed', 'abandoned')),
  launch_day INT DEFAULT 1 CHECK (launch_day BETWEEN 1 AND 14),
  current_day INT DEFAULT 1,
  estimated_revenue_potential INT,
  tools TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON projects(user_id, status, created_at DESC);

-- Project milestones (14-day protocol)
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  day INT NOT NULL CHECK (day BETWEEN 1 AND 14),
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, day)
);

CREATE INDEX idx_project_milestones_project ON project_milestones(project_id, day);

-- Build assistant AI conversations
CREATE TABLE IF NOT EXISTS build_assistant_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant', 'system')),
  message_content TEXT NOT NULL,
  step_number INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_build_assistant_logs_project ON build_assistant_logs(project_id, created_at);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_assistant_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own project_milestones" ON project_milestones FOR ALL USING (
  auth.uid() = (SELECT user_id FROM projects WHERE id = project_milestones.project_id)
);
CREATE POLICY "Users can manage own build_assistant_logs" ON build_assistant_logs FOR ALL USING (auth.uid() = user_id);
