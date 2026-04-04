-- Revenue Tracking Schema
-- Tier 4 Revenue Engine tables for FoundryAI

-- Revenue transactions table
CREATE TABLE IF NOT EXISTS foundryai_revenue_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  source VARCHAR(50) NOT NULL, -- 'product', 'service', 'subscription', 'affiliate', 'other'
  description TEXT,
  
  -- Related entities
  opportunity_id UUID,
  project_id UUID,
  customer_id UUID,
  
  -- Transaction metadata
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transaction_type VARCHAR(20) DEFAULT 'income', -- 'income', 'refund', 'chargeback'
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
  
  -- Recurring revenue tracking
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_interval VARCHAR(20), -- 'monthly', 'yearly', 'weekly'
  subscription_id UUID,
  
  -- Taxes and fees
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  fee_amount DECIMAL(10, 2) DEFAULT 0,
  net_amount DECIMAL(10, 2) GENERATED ALWAYS AS (amount - COALESCE(tax_amount, 0) - COALESCE(fee_amount, 0)) STORED,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue goals table
CREATE TABLE IF NOT EXISTS foundryai_revenue_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Goal details
  name VARCHAR(255) NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Timeframe
  goal_type VARCHAR(20) NOT NULL, -- 'monthly', 'quarterly', 'yearly', 'milestone'
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Progress
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'achieved', 'missed', 'cancelled'
  achieved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue streams table (for tracking different income sources)
CREATE TABLE IF NOT EXISTS foundryai_revenue_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stream details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  stream_type VARCHAR(50) NOT NULL, -- 'product', 'service', 'subscription', 'affiliate', 'ad_revenue', 'sponsorship', 'other'
  
  -- Configuration
  base_price DECIMAL(10, 2),
  pricing_model VARCHAR(20), -- 'one_time', 'subscription', 'usage_based', 'hybrid'
  
  -- Tracking
  is_active BOOLEAN DEFAULT TRUE,
  launched_at TIMESTAMP WITH TIME ZONE,
  
  -- Performance metrics
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  customer_count INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue analytics daily snapshots
CREATE TABLE IF NOT EXISTS foundryai_revenue_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Date
  snapshot_date DATE NOT NULL,
  
  -- Daily metrics
  daily_revenue DECIMAL(10, 2) DEFAULT 0,
  daily_transactions INTEGER DEFAULT 0,
  daily_customers INTEGER DEFAULT 0,
  
  -- Cumulative metrics
  mtd_revenue DECIMAL(10, 2) DEFAULT 0,
  ytd_revenue DECIMAL(10, 2) DEFAULT 0,
  
  -- By source
  revenue_by_source JSONB DEFAULT '{}',
  
  -- Unique constraint for one snapshot per user per day
  UNIQUE(user_id, snapshot_date)
);

-- Enable Row Level Security
ALTER TABLE foundryai_revenue_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundryai_revenue_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundryai_revenue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundryai_revenue_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies for revenue_transactions
CREATE POLICY "Users can view own revenue transactions"
  ON foundryai_revenue_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own revenue transactions"
  ON foundryai_revenue_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own revenue transactions"
  ON foundryai_revenue_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own revenue transactions"
  ON foundryai_revenue_transactions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for revenue_goals
CREATE POLICY "Users can view own revenue goals"
  ON foundryai_revenue_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own revenue goals"
  ON foundryai_revenue_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own revenue goals"
  ON foundryai_revenue_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own revenue goals"
  ON foundryai_revenue_goals FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for revenue_streams
CREATE POLICY "Users can view own revenue streams"
  ON foundryai_revenue_streams FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own revenue streams"
  ON foundryai_revenue_streams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own revenue streams"
  ON foundryai_revenue_streams FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own revenue streams"
  ON foundryai_revenue_streams FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for revenue_daily
CREATE POLICY "Users can view own revenue snapshots"
  ON foundryai_revenue_daily FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_revenue_transactions_user_id ON foundryai_revenue_transactions(user_id);
CREATE INDEX idx_revenue_transactions_date ON foundryai_revenue_transactions(transaction_date DESC);
CREATE INDEX idx_revenue_transactions_source ON foundryai_revenue_transactions(source);
CREATE INDEX idx_revenue_transactions_opportunity ON foundryai_revenue_transactions(opportunity_id);

CREATE INDEX idx_revenue_goals_user_id ON foundryai_revenue_goals(user_id);
CREATE INDEX idx_revenue_goals_status ON foundryai_revenue_goals(status);

CREATE INDEX idx_revenue_streams_user_id ON foundryai_revenue_streams(user_id);
CREATE INDEX idx_revenue_streams_type ON foundryai_revenue_streams(stream_type);

CREATE INDEX idx_revenue_daily_user_date ON foundryai_revenue_daily(user_id, snapshot_date DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_revenue_transactions_updated_at
  BEFORE UPDATE ON foundryai_revenue_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_goals_updated_at
  BEFORE UPDATE ON foundryai_revenue_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_streams_updated_at
  BEFORE UPDATE ON foundryai_revenue_streams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update daily revenue snapshot
CREATE OR REPLACE FUNCTION update_daily_revenue_snapshot(
  p_user_id UUID,
  p_date DATE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO foundryai_revenue_daily (
    user_id,
    snapshot_date,
    daily_revenue,
    daily_transactions,
    mtd_revenue,
    ytd_revenue,
    revenue_by_source
  )
  SELECT
    p_user_id,
    p_date,
    COALESCE(SUM(CASE WHEN transaction_date::DATE = p_date THEN net_amount ELSE 0 END), 0),
    COUNT(CASE WHEN transaction_date::DATE = p_date THEN 1 END),
    COALESCE(SUM(CASE WHEN transaction_date::DATE >= DATE_TRUNC('month', p_date)::DATE 
                      AND transaction_date::DATE <= p_date THEN net_amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_date::DATE >= DATE_TRUNC('year', p_date)::DATE 
                      AND transaction_date::DATE <= p_date THEN net_amount ELSE 0 END), 0),
    COALESCE(
      jsonb_object_agg(
        source,
        SUM(net_amount)
      ) FILTER (WHERE transaction_date::DATE = p_date),
      '{}'::jsonb
    )
  FROM foundryai_revenue_transactions
  WHERE user_id = p_user_id
    AND transaction_date::DATE <= p_date
    AND payment_status = 'completed'
  ON CONFLICT (user_id, snapshot_date)
  DO UPDATE SET
    daily_revenue = EXCLUDED.daily_revenue,
    daily_transactions = EXCLUDED.daily_transactions,
    mtd_revenue = EXCLUDED.mtd_revenue,
    ytd_revenue = EXCLUDED.ytd_revenue,
    revenue_by_source = EXCLUDED.revenue_by_source;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_daily_revenue_snapshot(UUID, DATE) TO authenticated;
