-- ============================================
-- Migration 007: Layer 4 Services
-- AI Usage Tracking, Audit Logs, Webhooks
-- ============================================

-- AI usage tracking
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  provider TEXT NOT NULL, -- groq, openrouter, etc.
  model TEXT NOT NULL,
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  cost_cents INT DEFAULT 0, -- Cost in cents
  latency_ms INT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'timeout', 'retry')),
  error_message TEXT,
  request_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user ON ai_usage_tracking(user_id, created_at DESC);
CREATE INDEX idx_ai_usage_provider ON ai_usage_tracking(provider, created_at DESC);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- Webhook events
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'retrying')),
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  next_retry_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_status ON webhook_events(status) WHERE status IN ('pending', 'retrying');

-- RLS
ALTER TABLE ai_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai_usage_tracking" ON ai_usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages audit_log" ON audit_log FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service role manages webhook_events" ON webhook_events FOR ALL USING (true);
