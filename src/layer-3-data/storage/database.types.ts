/**
 * Database Type Definitions for FoundryAI
 * Auto-generated from Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      foundryai_profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          tier: 'free' | 'starter' | 'pro' | 'elite' | 'legend';
          revenue_generated: number;
          archetype: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          tier?: 'free' | 'starter' | 'pro' | 'elite' | 'legend';
          revenue_generated?: number;
          archetype?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          tier?: 'free' | 'starter' | 'pro' | 'elite' | 'legend';
          revenue_generated?: number;
          archetype?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      foundryai_user_journeys: {
        Row: {
          id: string;
          user_id: string;
          current_stage: 'discovery' | 'onboarding' | 'foundation' | 'opportunity' | 'build' | 'launch' | 'revenue' | 'scale';
          selected_archetype: string | null;
          selected_opportunity_id: string | null;
          build_progress: number;
          revenue_generated: number;
          milestones_achieved: string[];
          momentum_scores: Json;
          brain_dumps: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_stage?: 'discovery' | 'onboarding' | 'foundation' | 'opportunity' | 'build' | 'launch' | 'revenue' | 'scale';
          selected_archetype?: string | null;
          selected_opportunity_id?: string | null;
          build_progress?: number;
          revenue_generated?: number;
          milestones_achieved?: string[];
          momentum_scores?: Json;
          brain_dumps?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_stage?: 'discovery' | 'onboarding' | 'foundation' | 'opportunity' | 'build' | 'launch' | 'revenue' | 'scale';
          selected_archetype?: string | null;
          selected_opportunity_id?: string | null;
          build_progress?: number;
          revenue_generated?: number;
          milestones_achieved?: string[];
          momentum_scores?: Json;
          brain_dumps?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      foundryai_opportunities: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          archetype: string;
          category: 'saas' | 'content' | 'service' | 'product' | 'agency' | 'marketplace' | null;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
          timeline: string | null;
          budget_estimate: number | null;
          validation_score: number | null;
          trending_score: number | null;
          demand_signals: Json;
          technical_feasibility: Json;
          monetization_data: Json;
          competition_analysis: Json;
          keywords: string[] | null;
          is_active: boolean;
          is_trending: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          archetype: string;
          category?: 'saas' | 'content' | 'service' | 'product' | 'agency' | 'marketplace' | null;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          timeline?: string | null;
          budget_estimate?: number | null;
          validation_score?: number | null;
          trending_score?: number | null;
          demand_signals?: Json;
          technical_feasibility?: Json;
          monetization_data?: Json;
          competition_analysis?: Json;
          keywords?: string[] | null;
          is_active?: boolean;
          is_trending?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          archetype?: string;
          category?: 'saas' | 'content' | 'service' | 'product' | 'agency' | 'marketplace' | null;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          timeline?: string | null;
          budget_estimate?: number | null;
          validation_score?: number | null;
          trending_score?: number | null;
          demand_signals?: Json;
          technical_feasibility?: Json;
          monetization_data?: Json;
          competition_analysis?: Json;
          keywords?: string[] | null;
          is_active?: boolean;
          is_trending?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      foundryai_revenue: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          source: string;
          date: string;
          description: string | null;
          milestone_triggered: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          source: string;
          date?: string;
          description?: string | null;
          milestone_triggered?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          source?: string;
          date?: string;
          description?: string | null;
          milestone_triggered?: string | null;
          created_at?: string;
        };
      };
      foundryai_templates: {
        Row: {
          id: string;
          title: string;
          content: string;
          archetype: string | null;
          tier: 'free' | 'starter' | 'pro' | 'elite' | 'legend';
          category: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          archetype?: string | null;
          tier?: 'free' | 'starter' | 'pro' | 'elite' | 'legend';
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          archetype?: string | null;
          tier?: 'free' | 'starter' | 'pro' | 'elite' | 'legend';
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          subscription_tier: string | null;
          subscription_status: string | null;
          stripe_customer_id: string | null;
          subscription_period_start: string | null;
          subscription_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          subscription_tier?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          subscription_period_start?: string | null;
          subscription_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          subscription_tier?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          subscription_period_start?: string | null;
          subscription_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_response_cache: {
        Row: {
          id: string;
          prompt_hash: string;
          response: string;
          provider: string;
          model: string;
          access_count: number;
          created_at: string;
          last_accessed: string;
        };
        Insert: {
          id?: string;
          prompt_hash: string;
          response: string;
          provider: string;
          model: string;
          access_count?: number;
          created_at?: string;
          last_accessed?: string;
        };
        Update: {
          id?: string;
          prompt_hash?: string;
          response?: string;
          provider?: string;
          model?: string;
          access_count?: number;
          created_at?: string;
          last_accessed?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          business_idea: string;
          archetype: string;
          canvas: Json;
          market_analysis: Json;
          gtm_strategy: Json;
          financial_projections: Json;
          action_items: Json;
          ai_provider: string | null;
          generation_time_ms: number | null;
          version: string;
          status: 'draft' | 'published' | 'archived';
          is_favorite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          business_idea: string;
          archetype: string;
          canvas?: Json;
          market_analysis?: Json;
          gtm_strategy?: Json;
          financial_projections?: Json;
          action_items?: Json;
          ai_provider?: string | null;
          generation_time_ms?: number | null;
          version?: string;
          status?: 'draft' | 'published' | 'archived';
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          business_idea?: string;
          archetype?: string;
          canvas?: Json;
          market_analysis?: Json;
          gtm_strategy?: Json;
          financial_projections?: Json;
          action_items?: Json;
          ai_provider?: string | null;
          generation_time_ms?: number | null;
          version?: string;
          status?: 'draft' | 'published' | 'archived';
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_opportunities: {
        Row: {
          id: string;
          user_id: string;
          opportunity_id: string;
          status: 'saved' | 'in_progress' | 'completed' | 'dismissed';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          opportunity_id: string;
          status?: 'saved' | 'in_progress' | 'completed' | 'dismissed';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          opportunity_id?: string;
          status?: 'saved' | 'in_progress' | 'completed' | 'dismissed';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brain_dumps: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          category: 'Urgent' | 'Scheduled' | 'Ideas' | 'Trash' | 'Delegate' | 'Release' | null;
          cognitive_load_before: number | null;
          cognitive_load_after: number | null;
          duration_seconds: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          category?: 'Urgent' | 'Scheduled' | 'Ideas' | 'Trash' | 'Delegate' | 'Release' | null;
          cognitive_load_before?: number | null;
          cognitive_load_after?: number | null;
          duration_seconds?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          category?: 'Urgent' | 'Scheduled' | 'Ideas' | 'Trash' | 'Delegate' | 'Release' | null;
          cognitive_load_before?: number | null;
          cognitive_load_after?: number | null;
          duration_seconds?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cognitive_load_readings: {
        Row: {
          id: string;
          user_id: string;
          load_percentage: number;
          source: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          load_percentage: number;
          source?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          load_percentage?: number;
          source?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      distraction_logs: {
        Row: {
          id: string;
          user_id: string;
          distraction_type: string;
          source: string | null;
          intensity: number | null;
          blocked: boolean;
          defense_layer: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          distraction_type: string;
          source?: string | null;
          intensity?: number | null;
          blocked?: boolean;
          defense_layer?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          distraction_type?: string;
          source?: string | null;
          intensity?: number | null;
          blocked?: boolean;
          defense_layer?: number | null;
          created_at?: string;
        };
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          duration_minutes: number;
          focus_score: number | null;
          interruptions_count: number;
          start_time: string;
          end_time: string | null;
          goal_achieved: boolean;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          duration_minutes: number;
          focus_score?: number | null;
          interruptions_count?: number;
          start_time?: string;
          end_time?: string | null;
          goal_achieved?: boolean;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          duration_minutes?: number;
          focus_score?: number | null;
          interruptions_count?: number;
          start_time?: string;
          end_time?: string | null;
          goal_achieved?: boolean;
          notes?: string | null;
        };
      };
      emotion_checkins: {
        Row: {
          id: string;
          user_id: string;
          current_state: 'Anxious' | 'Overwhelmed' | 'Frustrated' | 'Bored' | 'Neutral' | 'Engaged' | 'Curious' | 'Flow';
          intensity: number | null;
          trigger: string | null;
          transition_target: string | null;
          transition_successful: boolean | null;
          intervention_used: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_state: 'Anxious' | 'Overwhelmed' | 'Frustrated' | 'Bored' | 'Neutral' | 'Engaged' | 'Curious' | 'Flow';
          intensity?: number | null;
          trigger?: string | null;
          transition_target?: string | null;
          transition_successful?: boolean | null;
          intervention_used?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_state?: 'Anxious' | 'Overwhelmed' | 'Frustrated' | 'Bored' | 'Neutral' | 'Engaged' | 'Curious' | 'Flow';
          intensity?: number | null;
          trigger?: string | null;
          transition_target?: string | null;
          transition_successful?: boolean | null;
          intervention_used?: string | null;
          created_at?: string;
        };
      };
      flow_sessions: {
        Row: {
          id: string;
          user_id: string;
          start_time: string;
          end_time: string | null;
          duration_minutes: number | null;
          flow_quality_score: number | null;
          compounding_session_number: number;
          activity_type: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          start_time?: string;
          end_time?: string | null;
          duration_minutes?: number | null;
          flow_quality_score?: number | null;
          compounding_session_number?: number;
          activity_type?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          start_time?: string;
          end_time?: string | null;
          duration_minutes?: number | null;
          flow_quality_score?: number | null;
          compounding_session_number?: number;
          activity_type?: string | null;
          notes?: string | null;
        };
      };
      momentum_dimensions: {
        Row: {
          id: string;
          user_id: string;
          dimension: 'Financial' | 'Social' | 'Physical' | 'Mental' | 'Educational' | 'Professional' | 'Spiritual';
          current_level: number;
          momentum_score: number | null;
          last_calculated: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dimension: 'Financial' | 'Social' | 'Physical' | 'Mental' | 'Educational' | 'Professional' | 'Spiritual';
          current_level?: number;
          momentum_score?: number | null;
          last_calculated?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          dimension?: 'Financial' | 'Social' | 'Physical' | 'Mental' | 'Educational' | 'Professional' | 'Spiritual';
          current_level?: number;
          momentum_score?: number | null;
          last_calculated?: string;
        };
      };
      belief_scores: {
        Row: {
          id: string;
          user_id: string;
          belief_statement: string;
          belief_level: number;
          proof_count: number;
          identity_crystallization: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          belief_statement: string;
          belief_level?: number;
          proof_count?: number;
          identity_crystallization?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          belief_statement?: string;
          belief_level?: number;
          proof_count?: number;
          identity_crystallization?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      evidence_stack: {
        Row: {
          id: string;
          user_id: string;
          belief_id: string | null;
          evidence_type: 'Thought' | 'Action' | 'Result' | 'Feedback' | 'Pattern';
          description: string;
          proof_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          belief_id?: string | null;
          evidence_type: 'Thought' | 'Action' | 'Result' | 'Feedback' | 'Pattern';
          description: string;
          proof_value?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          belief_id?: string | null;
          evidence_type?: 'Thought' | 'Action' | 'Result' | 'Feedback' | 'Pattern';
          description?: string;
          proof_value?: number;
          created_at?: string;
        };
      };
      confidence_quotients: {
        Row: {
          id: string;
          user_id: string;
          domain: string;
          cq_score: number | null;
          evidence_count: number;
          last_updated: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          domain: string;
          cq_score?: number | null;
          evidence_count?: number;
          last_updated?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          domain?: string;
          cq_score?: number | null;
          evidence_count?: number;
          last_updated?: string;
        };
      };
      mindset_pillars: {
        Row: {
          id: string;
          user_id: string;
          pillar_name: string;
          pillar_strength: number | null;
          exercises_completed: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pillar_name: string;
          pillar_strength?: number | null;
          exercises_completed?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pillar_name?: string;
          pillar_strength?: number | null;
          exercises_completed?: number;
          created_at?: string;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_type: 'Morning' | 'Evening' | 'Brain_Dump' | 'Gratitude';
          content: string;
          mood_rating: number | null;
          affirmations_used: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_type: 'Morning' | 'Evening' | 'Brain_Dump' | 'Gratitude';
          content: string;
          mood_rating?: number | null;
          affirmations_used?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entry_type?: 'Morning' | 'Evening' | 'Brain_Dump' | 'Gratitude';
          content?: string;
          mood_rating?: number | null;
          affirmations_used?: string[] | null;
          created_at?: string;
        };
      };
      foundryai_revenue_goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          goal_type: string | null;
          start_date: string | null;
          end_date: string | null;
          status: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          goal_type?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          goal_type?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      foundryai_revenue_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          source: string;
          description: string | null;
          opportunity_id: string | null;
          project_id: string | null;
          customer_id: string | null;
          transaction_date: string;
          transaction_type: string;
          payment_method: string | null;
          payment_status: string;
          is_recurring: boolean;
          recurring_interval: string | null;
          tax_amount: number;
          fee_amount: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency?: string;
          source: string;
          description?: string | null;
          opportunity_id?: string | null;
          project_id?: string | null;
          customer_id?: string | null;
          transaction_date?: string;
          transaction_type?: string;
          payment_method?: string | null;
          payment_status?: string;
          is_recurring?: boolean;
          recurring_interval?: string | null;
          tax_amount?: number;
          fee_amount?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          source?: string;
          description?: string | null;
          opportunity_id?: string | null;
          project_id?: string | null;
          customer_id?: string | null;
          transaction_date?: string;
          transaction_type?: string;
          payment_method?: string | null;
          payment_status?: string;
          is_recurring?: boolean;
          recurring_interval?: string | null;
          tax_amount?: number;
          fee_amount?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      opportunity_radar: {
        Row: {
          id: string;
          user_id: string;
          status: 'discovered' | 'validated' | 'selected' | 'archived';
          is_validated: boolean;
          title: string | null;
          description: string | null;
          archetype_fit_score: number | null;
          market_demand_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'discovered' | 'validated' | 'selected' | 'archived';
          is_validated?: boolean;
          title?: string | null;
          description?: string | null;
          archetype_fit_score?: number | null;
          market_demand_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'discovered' | 'validated' | 'selected' | 'archived';
          is_validated?: boolean;
          title?: string | null;
          description?: string | null;
          archetype_fit_score?: number | null;
          market_demand_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      opportunities: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          archetype: string;
          category: string | null;
          difficulty_level: string | null;
          timeline: string | null;
          budget_estimate: number | null;
          validation_score: number | null;
          trending_score: number | null;
          demand_signals: Json;
          technical_feasibility: Json;
          monetization_data: Json;
          competition_analysis: Json;
          keywords: string[] | null;
          is_active: boolean;
          is_trending: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          archetype: string;
          category?: string | null;
          difficulty_level?: string | null;
          timeline?: string | null;
          budget_estimate?: number | null;
          validation_score?: number | null;
          trending_score?: number | null;
          demand_signals?: Json;
          technical_feasibility?: Json;
          monetization_data?: Json;
          competition_analysis?: Json;
          keywords?: string[] | null;
          is_active?: boolean;
          is_trending?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          archetype?: string;
          category?: string | null;
          difficulty_level?: string | null;
          timeline?: string | null;
          budget_estimate?: number | null;
          validation_score?: number | null;
          trending_score?: number | null;
          demand_signals?: Json;
          technical_feasibility?: Json;
          monetization_data?: Json;
          competition_analysis?: Json;
          keywords?: string[] | null;
          is_active?: boolean;
          is_trending?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      digital_fortress_settings: {
        Row: {
          id: string;
          user_id: string;
          website_blocklist: string[] | null;
          app_blocklist: string[] | null;
          notification_settings: Json;
          scheduled_focus_times: Json;
          last_updated: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          website_blocklist?: string[] | null;
          app_blocklist?: string[] | null;
          notification_settings?: Json;
          scheduled_focus_times?: Json;
          last_updated?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          website_blocklist?: string[] | null;
          app_blocklist?: string[] | null;
          notification_settings?: Json;
          scheduled_focus_times?: Json;
          last_updated?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper type for table access
export type Tables = Database['public']['Tables'];
