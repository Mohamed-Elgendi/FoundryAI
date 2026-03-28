-- VibeBuilder AI Database Schema
-- Run this in your Supabase SQL Editor

-- Feedback table to store user feedback on AI outputs
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  user_input text not null,
  output_json jsonb not null,
  is_helpful boolean not null,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feedback_is_helpful ON public.feedback(is_helpful);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Allow anonymous selects
CREATE POLICY "Allow anonymous selects" ON public.feedback
  FOR SELECT USING (true);

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW public.feedback_stats AS
SELECT 
  COUNT(*) as total_feedback,
  COUNT(*) FILTER (WHERE is_helpful = true) as helpful_count,
  COUNT(*) FILTER (WHERE is_helpful = false) as not_helpful_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_helpful = true) / NULLIF(COUNT(*), 0), 2) as helpful_percentage
FROM public.feedback;
