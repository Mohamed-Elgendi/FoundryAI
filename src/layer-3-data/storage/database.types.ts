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
