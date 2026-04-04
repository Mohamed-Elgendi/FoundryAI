-- FoundryAI Tier 1-6 Database Schema
-- Complete 6-Tier Ecosystem Architecture

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TIER 1: CORE FOUNDATION SYSTEMS (Always Active)
-- ============================================

-- 1.1 Brain Dump System
CREATE TABLE IF NOT EXISTS brain_dumps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Urgent', 'Scheduled', 'Ideas', 'Trash', 'Delegate', 'Release')),
    cognitive_load_before INTEGER CHECK (cognitive_load_before BETWEEN 0 AND 100),
    cognitive_load_after INTEGER CHECK (cognitive_load_after BETWEEN 0 AND 100),
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_brain_dumps_user_id ON brain_dumps(user_id);
CREATE INDEX idx_brain_dumps_created_at ON brain_dumps(created_at DESC);

-- 1.2 Cognitive Load Readings (Real-time RAM usage)
CREATE TABLE IF NOT EXISTS cognitive_load_readings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    load_percentage INTEGER NOT NULL CHECK (load_percentage BETWEEN 0 AND 100),
    source VARCHAR(50) DEFAULT 'self_assessment',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cognitive_load_user_id ON cognitive_load_readings(user_id);
CREATE INDEX idx_cognitive_load_created_at ON cognitive_load_readings(created_at DESC);

-- 1.3 Distractions & Focus (5-Layer Defense)
CREATE TABLE IF NOT EXISTS distraction_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    distraction_type VARCHAR(100) NOT NULL,
    source VARCHAR(50), -- 'digital', 'social', 'environmental', 'cognitive', 'identity'
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
    blocked BOOLEAN DEFAULT false,
    defense_layer INTEGER CHECK (defense_layer BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_distraction_logs_user_id ON distraction_logs(user_id);

-- 1.4 Focus Sessions (Deep Work Tracking)
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    focus_score INTEGER CHECK (focus_score BETWEEN 0 AND 100),
    interruptions_count INTEGER DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    goal_achieved BOOLEAN DEFAULT false,
    notes TEXT
);

CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_start_time ON focus_sessions(start_time DESC);

-- 1.5 Digital Fortress Settings
CREATE TABLE IF NOT EXISTS digital_fortress_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    website_blocklist TEXT[], -- Array of blocked websites
    app_blocklist TEXT[], -- Array of blocked apps
    notification_settings JSONB DEFAULT '{}',
    scheduled_focus_times JSONB DEFAULT '[]',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.6 Emotion Check-ins (8-State System)
CREATE TABLE IF NOT EXISTS emotion_checkins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_state VARCHAR(50) NOT NULL CHECK (current_state IN (
        'Anxious', 'Overwhelmed', 'Frustrated', 'Bored', 'Neutral', 
        'Engaged', 'Curious', 'Flow'
    )),
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
    trigger VARCHAR(200),
    transition_target VARCHAR(50),
    transition_successful BOOLEAN,
    intervention_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_emotion_checkins_user_id ON emotion_checkins(user_id);

-- 1.7 Flow Sessions
CREATE TABLE IF NOT EXISTS flow_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    flow_quality_score INTEGER CHECK (flow_quality_score BETWEEN 1 AND 10),
    compounding_session_number INTEGER DEFAULT 1,
    activity_type VARCHAR(100),
    notes TEXT
);

-- 1.8 Momentum Flywheel (7 Dimensions)
CREATE TABLE IF NOT EXISTS momentum_dimensions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dimension VARCHAR(50) NOT NULL CHECK (dimension IN (
        'Financial', 'Social', 'Physical', 'Mental', 'Educational', 'Professional', 'Spiritual'
    )),
    current_level INTEGER DEFAULT 1,
    momentum_score INTEGER CHECK (momentum_score BETWEEN 0 AND 100),
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, dimension)
);

-- 1.9 Belief Architecture (5-Level Proof System)
CREATE TABLE IF NOT EXISTS belief_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    belief_statement TEXT NOT NULL,
    belief_level INTEGER DEFAULT 1 CHECK (belief_level BETWEEN 1 AND 5),
    proof_count INTEGER DEFAULT 0,
    identity_crystallization INTEGER CHECK (identity_crystallization BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_belief_scores_user_id ON belief_scores(user_id);

-- 1.10 Evidence Stack (Proof Accumulation)
CREATE TABLE IF NOT EXISTS evidence_stack (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    belief_id UUID REFERENCES belief_scores(id) ON DELETE CASCADE,
    evidence_type VARCHAR(50) NOT NULL CHECK (evidence_type IN (
        'Thought', 'Action', 'Result', 'Feedback', 'Pattern'
    )),
    description TEXT NOT NULL,
    proof_value INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.11 Confidence Quotients (Domain-Specific)
CREATE TABLE IF NOT EXISTS confidence_quotients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain VARCHAR(100) NOT NULL,
    cq_score INTEGER CHECK (cq_score BETWEEN 0 AND 100),
    evidence_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, domain)
);

-- 1.12 Success Mindset (7 Pillars)
CREATE TABLE IF NOT EXISTS mindset_pillars (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pillar_name VARCHAR(100) NOT NULL,
    pillar_strength INTEGER CHECK (pillar_strength BETWEEN 0 AND 100),
    exercises_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, pillar_name)
);

-- 1.13 Affirmations & Journaling
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_type VARCHAR(50) NOT NULL CHECK (entry_type IN ('Morning', 'Evening', 'Brain_Dump', 'Gratitude')),
    content TEXT NOT NULL,
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
    affirmations_used TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);

-- ============================================
-- TIER 2: OPPORTUNITY INTELLIGENCE
-- ============================================

-- 2.1 Business Archetype Profiles
CREATE TABLE IF NOT EXISTS archetype_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    primary_archetype VARCHAR(50) CHECK (primary_archetype IN (
        'The_Problem_Solver', 'The_Creative_Artisan', 'The_Community_Builder',
        'The_Knowledge_Sharer', 'The_Digital_Nomad', 'The_Local_Champion',
        'The_Sustainability_Pioneer', 'The_Health_Wellness_Guide', 
        'The_Tech_Innovator', 'The_Cultural_Bridge', 'The_Family_Business_Owner',
        'The_Retirement_Reinventor'
    )),
    secondary_archetype VARCHAR(50),
    archetype_score JSONB DEFAULT '{}',
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.2 Opportunity Radar Entries
CREATE TABLE IF NOT EXISTS opportunity_radar (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_title VARCHAR(200) NOT NULL,
    description TEXT,
    market_size VARCHAR(50),
    competition_level VARCHAR(50),
    time_to_revenue VARCHAR(50),
    startup_costs VARCHAR(50),
    archetype_fit_score INTEGER CHECK (archetype_fit_score BETWEEN 0 AND 100),
    is_validated BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'discovered',
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_opportunity_radar_user_id ON opportunity_radar(user_id);

-- 2.3 Business Ideas (Extracted & Refined)
CREATE TABLE IF NOT EXISTS business_ideas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    raw_input TEXT NOT NULL,
    refined_concept TEXT,
    target_archetypes TEXT[],
    potential_revenue JSONB,
    implementation_complexity VARCHAR(50),
    market_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TIER 3: BUILD & EXECUTION SYSTEMS
-- ============================================

-- 3.1 Launch Workflows (14-Day Protocol)
CREATE TABLE IF NOT EXISTS launch_workflows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workflow_name VARCHAR(200) NOT NULL,
    current_day INTEGER DEFAULT 1 CHECK (current_day BETWEEN 1 AND 14),
    overall_progress INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    target_completion_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 3.2 Workflow Tasks
CREATE TABLE IF NOT EXISTS workflow_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES launch_workflows(id) ON DELETE CASCADE,
    task_name VARCHAR(200) NOT NULL,
    day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 14),
    estimated_duration_minutes INTEGER,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    dependencies UUID[], -- Array of task IDs
    ai_guidance TEXT
);

-- 3.3 Tool Recommendations
CREATE TABLE IF NOT EXISTS tool_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    tool_category VARCHAR(50),
    archetype_match TEXT[],
    tier_match VARCHAR(50),
    monthly_cost_range VARCHAR(50),
    learning_curve VARCHAR(50),
    roi_score INTEGER CHECK (roi_score BETWEEN 0 AND 100),
    is_recommended BOOLEAN DEFAULT true,
    user_adoption_status VARCHAR(50) DEFAULT 'suggested'
);

-- ============================================
-- TIER 4: PERSONAL DEVELOPMENT
-- ============================================

-- 4.1 Entrepreneurial DNA Profile
CREATE TABLE IF NOT EXISTS entrepreneurial_dna (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    dna_type VARCHAR(50) CHECK (dna_type IN ('Builder', 'Teacher', 'Connector', 'Visionary')),
    cognitive_advantages TEXT[],
    blind_spots TEXT[],
    assessment_completed BOOLEAN DEFAULT false,
    assessment_date TIMESTAMP WITH TIME ZONE
);

-- 4.2 Psychometric Results
CREATE TABLE IF NOT EXISTS psychometric_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_type VARCHAR(100) NOT NULL,
    results JSONB NOT NULL,
    insights TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.3 Passion Evidence Log
CREATE TABLE IF NOT EXISTS passion_evidence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    passion_area VARCHAR(200) NOT NULL,
    evidence_type VARCHAR(50),
    description TEXT,
    hours_invested INTEGER DEFAULT 0,
    outcomes_achieved TEXT[],
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.4 Character Stats (Gamification)
CREATE TABLE IF NOT EXISTS character_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    strength INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    creativity INTEGER DEFAULT 10,
    resilience INTEGER DEFAULT 10,
    social INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.5 Productivity Sessions
CREATE TABLE IF NOT EXISTS productivity_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
    output_quality INTEGER CHECK (output_quality BETWEEN 1 AND 10),
    duration_minutes INTEGER,
    time_of_day VARCHAR(20),
    chronotype_alignment_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TIER 5: TRAINING & EDUCATION
-- ============================================

-- 5.1 Learning Paths
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    path_name VARCHAR(200) NOT NULL,
    path_type VARCHAR(50), -- 'Skill', 'Business', 'Personal'
    current_module INTEGER DEFAULT 1,
    total_modules INTEGER,
    progress_percentage INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 5.2 Skill Matrix
CREATE TABLE IF NOT EXISTS skill_matrix (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    current_level INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
    target_level INTEGER DEFAULT 3,
    hours_practiced INTEGER DEFAULT 0,
    last_practiced TIMESTAMP WITH TIME ZONE
);

-- 5.3 Spaced Repetition Queue
CREATE TABLE IF NOT EXISTS spaced_repetition_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'Concept', 'Fact', 'Procedure'
    content TEXT NOT NULL,
    next_review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    interval_days INTEGER DEFAULT 1,
    repetition_count INTEGER DEFAULT 0,
    ease_factor DECIMAL(3,2) DEFAULT 2.5
);

-- 5.4 Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    certification_name VARCHAR(200) NOT NULL,
    issuer VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    credential_url TEXT,
    status VARCHAR(50) DEFAULT 'active'
);

-- ============================================
-- TIER 6: MONETIZATION
-- ============================================

-- 6.1 Membership Tiers
CREATE TABLE IF NOT EXISTS membership_tiers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tier_name VARCHAR(50) NOT NULL UNIQUE,
    monthly_price DECIMAL(10,2),
    annual_price DECIMAL(10,2),
    features_included TEXT[],
    is_active BOOLEAN DEFAULT true
);

-- 6.2 User Memberships
CREATE TABLE IF NOT EXISTS user_memberships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES membership_tiers(id),
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active'
);

-- 6.3 Foundry Coins (Gamification Currency)
CREATE TABLE IF NOT EXISTS foundry_coins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.4 Coin Transactions
CREATE TABLE IF NOT EXISTS coin_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('Earned', 'Spent', 'Bonus')),
    amount INTEGER NOT NULL,
    reason VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.5 Redemptions
CREATE TABLE IF NOT EXISTS redemptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL,
    coins_spent INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.6 Revenue Streams (For Business Tracking)
CREATE TABLE IF NOT EXISTS revenue_streams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stream_name VARCHAR(200) NOT NULL,
    stream_type VARCHAR(50),
    monthly_revenue DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6.7 Milestone Achievements
CREATE TABLE IF NOT EXISTS milestone_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    milestone_name VARCHAR(200) NOT NULL,
    milestone_type VARCHAR(50),
    coins_rewarded INTEGER DEFAULT 0,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AFFILIATE SYSTEM
-- ============================================

-- 7.1 Affiliate Referrals
CREATE TABLE IF NOT EXISTS affiliate_referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    referral_code VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    signup_date TIMESTAMP WITH TIME ZONE,
    conversion_date TIMESTAMP WITH TIME ZONE
);

-- 7.2 Affiliate Revenue
CREATE TABLE IF NOT EXISTS affiliate_revenue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    revenue_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Apply RLS to all tables
ALTER TABLE brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_load_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE distraction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_fortress_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE momentum_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE belief_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE confidence_quotients ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindset_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE archetype_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_radar ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrepreneurial_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychometric_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE passion_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaced_repetition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundry_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_revenue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user data isolation
CREATE POLICY "Users can only access their own brain dumps" ON brain_dumps
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own cognitive load readings" ON cognitive_load_readings
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own distraction logs" ON distraction_logs
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own focus sessions" ON focus_sessions
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own fortress settings" ON digital_fortress_settings
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own emotion checkins" ON emotion_checkins
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own flow sessions" ON flow_sessions
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own momentum dimensions" ON momentum_dimensions
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own belief scores" ON belief_scores
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own evidence stack" ON evidence_stack
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own confidence quotients" ON confidence_quotients
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own mindset pillars" ON mindset_pillars
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own journal entries" ON journal_entries
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own archetype profile" ON archetype_profiles
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own opportunities" ON opportunity_radar
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own business ideas" ON business_ideas
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own workflows" ON launch_workflows
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own tool recommendations" ON tool_recommendations
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own DNA profile" ON entrepreneurial_dna
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own psychometric results" ON psychometric_results
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own passion evidence" ON passion_evidence
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own character stats" ON character_stats
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own productivity sessions" ON productivity_sessions
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own learning paths" ON learning_paths
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own skills" ON skill_matrix
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own review items" ON spaced_repetition_items
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own certifications" ON certifications
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own membership" ON user_memberships
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own coins" ON foundry_coins
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own coin transactions" ON coin_transactions
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own redemptions" ON redemptions
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own revenue streams" ON revenue_streams
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own milestones" ON milestone_achievements
    FOR ALL USING (auth.uid() = user_id);
    
CREATE POLICY "Users can only access their own referrals" ON affiliate_referrals
    FOR ALL USING (auth.uid() = referrer_id);
    
CREATE POLICY "Users can only access their own affiliate revenue" ON affiliate_revenue
    FOR ALL USING (auth.uid() = referrer_id);

-- ============================================
-- SEED DATA: Membership Tiers
-- ============================================

INSERT INTO membership_tiers (tier_name, monthly_price, annual_price, features_included) VALUES
('Free', 0.00, 0.00, ARRAY[
    'Basic opportunity radar',
    'Brain dump system',
    'Limited templates',
    'Community access'
]),
('Starter', 29.00, 290.00, ARRAY[
    'Full opportunity radar',
    'All Tier 1 foundation systems',
    'Idea extraction engine',
    '100+ business templates',
    'Basic workflow engine',
    'Email support'
]),
('Growth', 79.00, 790.00, ARRAY[
    'Everything in Starter',
    'AI build assistant',
    'Advanced workflows',
    'Tool recommender',
    'Skill matrix',
    'Learning paths',
    'Priority support'
]),
('Pro', 199.00, 1990.00, ARRAY[
    'Everything in Growth',
    '1-on-1 coaching sessions',
    'Custom workflows',
    'White-glove onboarding',
    'Advanced analytics',
    'API access',
    'Dedicated support'
]);

-- Insert default membership tier for new users (Free)
-- Note: This would typically be done via a trigger or application logic
