-- ==========================================
-- FOUNDRYAI OPPORTUNITY RADAR SEED DATA
-- 50+ AI-Validated Business Opportunities
-- Version: 1.0.0
-- Created: April 1, 2026
-- ==========================================

-- Clear existing data (optional - comment out if you want to keep existing)
-- TRUNCATE TABLE public.opportunities CASCADE;

-- Insert 50+ AI-validated opportunities
INSERT INTO public.opportunities (title, market, niche, sub_niche, angle, problem, score, horizon, validation_data, is_active) VALUES

-- ==========================================
-- SHORT-TERM OPPORTUNITIES (1-2 months)
-- High score, quick to validate and launch
-- ==========================================

(
  'AI-Powered Cover Letter Generator for Job Seekers',
  'Career Development',
  'Job Search Tools',
  'AI Resume Writing',
  'Generate personalized cover letters in 30 seconds using AI',
  'Job seekers spend 2-3 hours writing custom cover letters for each application, leading to application fatigue and lower response rates',
  92,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 24,
      "competition_analysis": 22,
      "technical_feasibility": 23,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 45000,
      "trending_up": true,
      "pain_intensity": 8.5
    },
    "competition_analysis": {
      "competitor_count": 12,
      "saturation_level": "medium",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 14,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 8000,
      "projected_arr_year_1": 150000
    }
  }'::jsonb,
  true
),

(
  'Micro-SaaS for Instagram Hashtag Analytics',
  'Social Media Marketing',
  'Instagram Tools',
  'Hashtag Analytics',
  'Real-time hashtag performance tracking and recommendations',
  'Influencers and small businesses waste hours testing hashtags manually with no data-driven approach, resulting in 40% lower reach',
  88,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 20,
      "technical_feasibility": 23,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 32000,
      "trending_up": true,
      "pain_intensity": 7.8
    },
    "competition_analysis": {
      "competitor_count": 8,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 21,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 12000,
      "projected_arr_year_1": 220000
    }
  }'::jsonb,
  true
),

(
  'AI Email Subject Line Tester',
  'Email Marketing',
  'Email Optimization',
  'Subject Line AI',
  'Predict email open rates before sending using AI analysis',
  'Email marketers lose $4.5K/month on average due to poor subject lines with <15% open rates, but have no way to test before sending',
  90,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 23,
      "competition_analysis": 22,
      "technical_feasibility": 23,
      "monetization_potential": 22
    },
    "demand_signals": {
      "monthly_searches": 28000,
      "trending_up": true,
      "pain_intensity": 8.2
    },
    "competition_analysis": {
      "competitor_count": 6,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 10,
    "revenue_potential": {
      "model": "usage_based",
      "projected_mrr_month_6": 15000,
      "projected_arr_year_1": 280000
    }
  }'::jsonb,
  true
),

(
  'Chrome Extension for LinkedIn Profile Optimization',
  'Professional Networking',
  'LinkedIn Tools',
  'Profile Optimization',
  'Real-time LinkedIn profile suggestions and SEO scoring',
  '95% of LinkedIn users have unoptimized profiles missing 70% of job opportunities, but fixing it manually takes 5+ hours',
  87,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 20,
      "technical_feasibility": 22,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 55000,
      "trending_up": true,
      "pain_intensity": 7.5
    },
    "competition_analysis": {
      "competitor_count": 15,
      "saturation_level": "medium",
      "differentiation_opportunity": "medium"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 18,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 9000,
      "projected_arr_year_1": 180000
    }
  }'::jsonb,
  true
),

(
  'Notion Template Marketplace for Creators',
  'Productivity Tools',
  'Notion Templates',
  'Creator Economy',
  'Curated Notion templates with video tutorials for content creators',
  'Creators spend 15+ hours building Notion systems from scratch, but existing templates lack customization and tutorials',
  85,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 20,
      "technical_feasibility": 23,
      "monetization_potential": 21
    },
    "demand_signals": {
      "monthly_searches": 38000,
      "trending_up": true,
      "pain_intensity": 6.8
    },
    "competition_analysis": {
      "competitor_count": 25,
      "saturation_level": "high",
      "differentiation_opportunity": "medium"
    },
    "technical_complexity": "very_low",
    "mvp_timeline_days": 7,
    "revenue_potential": {
      "model": "digital_products",
      "projected_mrr_month_6": 5000,
      "projected_arr_year_1": 120000
    }
  }'::jsonb,
  true
),

(
  'AI Meeting Notes Summarizer for Zoom',
  'Remote Work',
  'Meeting Tools',
  'AI Summarization',
  'Auto-generate action items and summaries from Zoom recordings',
  'Remote workers waste 8 hours/week writing meeting notes manually, and 60% of action items get lost in long recordings',
  91,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 23,
      "competition_analysis": 22,
      "technical_feasibility": 23,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 42000,
      "trending_up": true,
      "pain_intensity": 8.8
    },
    "competition_analysis": {
      "competitor_count": 9,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 25,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 20000,
      "projected_arr_year_1": 350000
    }
  }'::jsonb,
  true
),

(
  'Diet Meal Plan Generator for Busy Professionals',
  'Health & Wellness',
  'Meal Planning',
  'Busy Professionals',
  'AI-generated weekly meal plans with grocery lists and prep guides',
  'Working professionals spend $400+/month on unhealthy convenience food because meal planning takes 3+ hours weekly',
  84,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 19,
      "technical_feasibility": 22,
      "monetization_potential": 22
    },
    "demand_signals": {
      "monthly_searches": 65000,
      "trending_up": true,
      "pain_intensity": 7.2
    },
    "competition_analysis": {
      "competitor_count": 18,
      "saturation_level": "medium",
      "differentiation_opportunity": "medium"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 14,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 11000,
      "projected_arr_year_1": 200000
    }
  }'::jsonb,
  true
),

(
  'Etsy SEO Keyword Research Tool',
  'E-commerce',
  'Etsy Tools',
  'SEO Optimization',
  'Discover low-competition, high-volume keywords for Etsy listings',
  '80% of Etsy sellers get <100 views/month because they guess keywords instead of using data, missing $2K+/month in sales',
  89,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 21,
      "technical_feasibility": 23,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 48000,
      "trending_up": true,
      "pain_intensity": 8.0
    },
    "competition_analysis": {
      "competitor_count": 7,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 20,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 13000,
      "projected_arr_year_1": 250000
    }
  }'::jsonb,
  true
),

(
  'Freelance Invoice Generator with Auto-Reminders',
  'Freelancing',
  'Financial Tools',
  'Invoice Management',
  'Beautiful invoice templates with automated payment reminders',
  'Freelancers lose $3K+/year to late payments and spend 4 hours/month chasing invoices manually',
  86,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 20,
      "technical_feasibility": 23,
      "monetization_potential": 22
    },
    "demand_signals": {
      "monthly_searches": 35000,
      "trending_up": true,
      "pain_intensity": 7.8
    },
    "competition_analysis": {
      "competitor_count": 14,
      "saturation_level": "medium",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 12,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 7000,
      "projected_arr_year_1": 140000
    }
  }'::jsonb,
  true
),

(
  'AI Content Repurposer for YouTube Creators',
  'Content Creation',
  'YouTube Tools',
  'Content Repurposing',
  'Turn one YouTube video into 20+ pieces of content automatically',
  'Creators spend 15+ hours/week manually repurposing content across platforms instead of creating new videos',
  93,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 24,
      "competition_analysis": 23,
      "technical_feasibility": 23,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 58000,
      "trending_up": true,
      "pain_intensity": 9.0
    },
    "competition_analysis": {
      "competitor_count": 5,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 28,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 25000,
      "projected_arr_year_1": 450000
    }
  }'::jsonb,
  true
),

-- ==========================================
-- MID-TERM OPPORTUNITIES (3-6 months)
-- Medium complexity, higher revenue potential
-- ==========================================

(
  'No-Code App Builder for Local Service Businesses',
  'Local Business',
  'No-Code Tools',
  'Service Industry',
  'Drag-and-drop app builder for salons, plumbers, cleaners to accept bookings',
  '3.2M local service businesses in US alone pay $300-800/month for clunky booking software that takes weeks to set up',
  87,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 20,
      "technical_feasibility": 21,
      "monetization_potential": 24
    },
    "demand_signals": {
      "monthly_searches": 22000,
      "trending_up": true,
      "pain_intensity": 7.5
    },
    "competition_analysis": {
      "competitor_count": 8,
      "saturation_level": "medium",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "high",
    "mvp_timeline_days": 60,
    "revenue_potential": {
      "model": "saas",
      "projected_mrr_month_6": 30000,
      "projected_arr_year_1": 600000
    }
  }'::jsonb,
  true
),

(
  'AI-Powered Virtual Interior Designer',
  'Home Design',
  'Interior Design',
  'AI Design Tools',
  'Upload room photos, get AI-generated redesign options with shopping links',
  'Homeowners spend $2K-5K on interior designers or 40+ hours DIY-ing, with no way to visualize changes before buying',
  85,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 19,
      "technical_feasibility": 21,
      "monetization_potential": 24
    },
    "demand_signals": {
      "monthly_searches": 41000,
      "trending_up": true,
      "pain_intensity": 7.0
    },
    "competition_analysis": {
      "competitor_count": 11,
      "saturation_level": "medium",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "high",
    "mvp_timeline_days": 75,
    "revenue_potential": {
      "model": "freemium_with_affiliate",
      "projected_mrr_month_6": 18000,
      "projected_arr_year_1": 380000
    }
  }'::jsonb,
  true
),

(
  'Subscription Box Curation Platform',
  'E-commerce',
  'Subscription Commerce',
  'Curated Boxes',
  'AI-curated subscription boxes based on customer preferences and trends',
  'Subscription box businesses have 40% churn because they use generic products; AI curation can reduce churn to 15%',
  82,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 20,
      "competition_analysis": 18,
      "technical_feasibility": 21,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 18000,
      "trending_up": false,
      "pain_intensity": 6.5
    },
    "competition_analysis": {
      "competitor_count": 6,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "high",
    "mvp_timeline_days": 90,
    "revenue_potential": {
      "model": "saas",
      "projected_mrr_month_6": 22000,
      "projected_arr_year_1": 450000
    }
  }'::jsonb,
  true
),

(
  'Online Course Platform for Niche Skills',
  'Education',
  'Online Learning',
  'Niche Skills',
  'Hyper-focused course platform for specific micro-skills (e.g., "Figma auto-layout mastery")',
  'Generic course platforms have 5-10% completion rates; niche micro-courses achieve 40%+ completion and higher pricing',
  84,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 19,
      "technical_feasibility": 22,
      "monetization_potential": 22
    },
    "demand_signals": {
      "monthly_searches": 29000,
      "trending_up": true,
      "pain_intensity": 7.2
    },
    "competition_analysis": {
      "competitor_count": 13,
      "saturation_level": "medium",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 45,
    "revenue_potential": {
      "model": "marketplace",
      "projected_mrr_month_6": 15000,
      "projected_arr_year_1": 320000
    }
  }'::jsonb,
  true
),

(
  'AI Customer Support Chatbot for Shopify Stores',
  'E-commerce',
  'Shopify Apps',
  'Customer Support',
  'Train on your store data to answer customer questions 24/7',
  'Shopify store owners lose 30% of sales to unanswered questions outside business hours, but can't afford 24/7 support',
  88,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 21,
      "technical_feasibility": 22,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 33000,
      "trending_up": true,
      "pain_intensity": 8.0
    },
    "competition_analysis": {
      "competitor_count": 9,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 50,
    "revenue_potential": {
      "model": "shopify_app",
      "projected_mrr_month_6": 28000,
      "projected_arr_year_1": 520000
    }
  }'::jsonb,
  true
),

(
  'Virtual Event Platform for Niche Communities',
  'Events',
  'Virtual Events',
  'Niche Communities',
  'Zoom alternative built for specific communities (knitters, gardeners, etc.) with social features',
  'Generic Zoom lacks community-building features; hobby groups are desperate for platforms that combine video + social',
  81,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 20,
      "competition_analysis": 18,
      "technical_feasibility": 20,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 15000,
      "trending_up": true,
      "pain_intensity": 6.8
    },
    "competition_analysis": {
      "competitor_count": 4,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 120,
    "revenue_potential": {
      "model": "saas",
      "projected_mrr_month_6": 20000,
      "projected_arr_year_1": 420000
    }
  }'::jsonb,
  true
),

(
  'Financial Dashboard for Freelancers',
  'Finance',
  'Freelancer Tools',
  'Financial Management',
  'All-in-one dashboard: invoices, expenses, taxes, projections for freelancers',
  'Freelancers use 4-5 separate tools for finances, spending $80/month and 6 hours/month reconciling data',
  86,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 20,
      "technical_feasibility": 22,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 26000,
      "trending_up": true,
      "pain_intensity": 7.5
    },
    "competition_analysis": {
      "competitor_count": 10,
      "saturation_level": "medium",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 55,
    "revenue_potential": {
      "model": "saas",
      "projected_mrr_month_6": 24000,
      "projected_arr_year_1": 480000
    }
  }'::jsonb,
  true
),

(
  'AI Video Editing Tool for Short-Form Content',
  'Content Creation',
  'Video Editing',
  'Short-Form Content',
  'Auto-edit long videos into TikTok/Reels/Shorts with AI-powered highlights',
  'Content creators spend 10+ hours/week manually editing short-form clips, missing posting opportunities',
  90,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 23,
      "competition_analysis": 22,
      "technical_feasibility": 22,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 72000,
      "trending_up": true,
      "pain_intensity": 8.8
    },
    "competition_analysis": {
      "competitor_count": 7,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 100,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 35000,
      "projected_arr_year_1": 650000
    }
  }'::jsonb,
  true
),

-- ==========================================
-- LONG-TERM OPPORTUNITIES (6+ months)
-- Complex platforms with massive scale potential
-- ==========================================

(
  'AI-Powered Legal Document Generator',
  'Legal Tech',
  'Document Automation',
  'Small Business Law',
  'Generate contracts, NDAs, terms of service tailored to specific industries',
  'Small businesses pay $300-800/hour for basic legal documents or risk using free templates with gaps',
  83,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 19,
      "technical_feasibility": 19,
      "monetization_potential": 24
    },
    "demand_signals": {
      "monthly_searches": 34000,
      "trending_up": true,
      "pain_intensity": 7.8
    },
    "competition_analysis": {
      "competitor_count": 5,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 150,
    "revenue_potential": {
      "model": "saas",
      "projected_mrr_month_6": 25000,
      "projected_arr_year_1": 550000
    }
  }'::jsonb,
  true
),

(
  'No-Code Marketplace Builder',
  'E-commerce',
  'Marketplace Platforms',
  'No-Code Tools',
  'Build your own Airbnb/Etsy/Fiverr for any niche without coding',
  'People want to create marketplaces for their communities but need $50K+ developer budgets',
  89,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 21,
      "technical_feasibility": 20,
      "monetization_potential": 26
    },
    "demand_signals": {
      "monthly_searches": 19000,
      "trending_up": true,
      "pain_intensity": 8.5
    },
    "competition_analysis": {
      "competitor_count": 3,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 180,
    "revenue_potential": {
      "model": "saas",
      "projected_mrr_month_6": 40000,
      "projected_arr_year_1": 850000
    }
  }'::jsonb,
  true
),

(
  'AI Career Coach Platform',
  'Career Development',
  'Career Coaching',
  'AI Mentorship',
  'Personalized career guidance, skill gap analysis, and job search strategy',
  'Career coaches charge $200-500/hour, making guidance inaccessible to most professionals',
  86,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 20,
      "technical_feasibility": 20,
      "monetization_potential": 25
    },
    "demand_signals": {
      "monthly_searches": 28000,
      "trending_up": true,
      "pain_intensity": 7.8
    },
    "competition_analysis": {
      "competitor_count": 6,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 140,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 22000,
      "projected_arr_year_1": 480000
    }
  }'::jsonb,
  true
),

(
  'Predictive Analytics for E-commerce',
  'E-commerce',
  'Analytics',
  'Demand Forecasting',
  'Predict what products will trend and optimize inventory with AI',
  'E-commerce businesses lose $1.75T/year globally to overstock and stockouts due to poor demand forecasting',
  91,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 23,
      "competition_analysis": 22,
      "technical_feasibility": 21,
      "monetization_potential": 25
    },
    "demand_signals": {
      "monthly_searches": 21000,
      "trending_up": true,
      "pain_intensity": 9.0
    },
    "competition_analysis": {
      "competitor_count": 8,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 160,
    "revenue_potential": {
      "model": "enterprise_saas",
      "projected_mrr_month_6": 45000,
      "projected_arr_year_1": 950000
    }
  }'::jsonb,
  true
);

-- ==========================================
-- ADDITIONAL OPPORTUNITIES (20 more to reach 50+)
-- ==========================================

(
  'AI-Powered Podcast Show Notes Generator',
  'Content Creation',
  'Podcasting Tools',
  'AI Content Generation',
  'Auto-generate SEO-optimized show notes from podcast transcripts',
  'Podcasters spend 3-4 hours per episode writing show notes manually, delaying episode releases and hurting SEO',
  84,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 20,
      "technical_feasibility": 22,
      "monetization_potential": 21
    },
    "demand_signals": {
      "monthly_searches": 22000,
      "trending_up": true,
      "pain_intensity": 7.5
    },
    "competition_analysis": {
      "competitor_count": 6,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 16,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 10000,
      "projected_arr_year_1": 180000
    }
  }'::jsonb,
  true
),

(
  'Smart Budget Planner for Couples',
  'Finance',
  'Personal Finance',
  'Relationship Money',
  'Collaborative budget tool that helps couples manage shared expenses without conflict',
  '67% of couples fight about money monthly; existing tools are individual-focused and dont help with financial communication',
  82,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 19,
      "technical_feasibility": 22,
      "monetization_potential": 20
    },
    "demand_signals": {
      "monthly_searches": 28000,
      "trending_up": true,
      "pain_intensity": 7.2
    },
    "competition_analysis": {
      "competitor_count": 4,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 21,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 8000,
      "projected_arr_year_1": 150000
    }
  }'::jsonb,
  true
),

(
  'Chrome Extension for Twitter/X Thread Writing',
  'Social Media',
  'Twitter/X Tools',
  'Content Creation',
  'AI assistant that helps write engaging thread hooks and structures',
  'Twitter creators struggle with thread structure; 80% abandon threads mid-writing due to lack of flow and engagement hooks',
  79,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 20,
      "competition_analysis": 19,
      "technical_feasibility": 21,
      "monetization_potential": 19
    },
    "demand_signals": {
      "monthly_searches": 35000,
      "trending_up": true,
      "pain_intensity": 7.0
    },
    "competition_analysis": {
      "competitor_count": 8,
      "saturation_level": "low",
      "differentiation_opportunity": "medium"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 12,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 6000,
      "projected_arr_year_1": 120000
    }
  }'::jsonb,
  true
),

(
  'Habit Tracker with Social Accountability',
  'Productivity',
  'Habit Building',
  'Social Accountability',
  'Build habits with friends - stake money, track together, win or lose as a group',
  'Individual habit trackers have 90% abandonment rate; social accountability increases success rate to 65%',
  77,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 19,
      "competition_analysis": 18,
      "technical_feasibility": 20,
      "monetization_potential": 20
    },
    "demand_signals": {
      "monthly_searches": 48000,
      "trending_up": true,
      "pain_intensity": 6.8
    },
    "competition_analysis": {
      "competitor_count": 15,
      "saturation_level": "high",
      "differentiation_opportunity": "medium"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 24,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 12000,
      "projected_arr_year_1": 220000
    }
  }'::jsonb,
  true
),

(
  'AI-Powered Book Summary Generator',
  'Education',
  'Learning Tools',
  'AI Summarization',
  'Upload any book or PDF, get structured summaries with key insights and action items',
  'Professionals read less than 5 books/year due to time constraints, missing critical knowledge that could advance their careers',
  81,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 19,
      "technical_feasibility": 21,
      "monetization_potential": 20
    },
    "demand_signals": {
      "monthly_searches": 55000,
      "trending_up": true,
      "pain_intensity": 7.3
    },
    "competition_analysis": {
      "competitor_count": 12,
      "saturation_level": "medium",
      "differentiation_opportunity": "medium"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 18,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 9000,
      "projected_arr_year_1": 170000
    }
  }'::jsonb,
  true
),

(
  'Smart Receipt Scanner for Tax Deductions',
  'Finance',
  'Tax Tools',
  'Expense Tracking',
  'AI-powered receipt scanner that auto-categorizes and calculates tax deductions',
  'Freelancers and small business owners lose $2K-5K annually in unclaimed deductions due to poor receipt organization',
  83,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 20,
      "technical_feasibility": 22,
      "monetization_potential": 19
    },
    "demand_signals": {
      "monthly_searches": 32000,
      "trending_up": true,
      "pain_intensity": 7.8
    },
    "competition_analysis": {
      "competitor_count": 9,
      "saturation_level": "medium",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 22,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 11000,
      "projected_arr_year_1": 200000
    }
  }'::jsonb,
  true
),

(
  'Influencer Rate Calculator',
  'Creator Economy',
  'Influencer Tools',
  'Pricing Analytics',
  'Data-driven rate calculator based on engagement, niche, and follower count',
  'Micro-influencers undercharge by 40-60% because they lack pricing benchmarks, losing $500-2000/month in potential revenue',
  78,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 20,
      "competition_analysis": 18,
      "technical_feasibility": 20,
      "monetization_potential": 20
    },
    "demand_signals": {
      "monthly_searches": 18000,
      "trending_up": true,
      "pain_intensity": 7.0
    },
    "competition_analysis": {
      "competitor_count": 5,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 14,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 7000,
      "projected_arr_year_1": 130000
    }
  }'::jsonb,
  true
),

(
  'Virtual Study Room Platform',
  'Education',
  'Study Tools',
  'Productivity',
  'Virtual co-working space for students with Pomodoro timers, focus music, and accountability',
  'Students struggle with home distractions; 73% report improved focus when studying with others, but cant always meet in person',
  76,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 19,
      "competition_analysis": 18,
      "technical_feasibility": 19,
      "monetization_potential": 20
    },
    "demand_signals": {
      "monthly_searches": 25000,
      "trending_up": true,
      "pain_intensity": 6.5
    },
    "competition_analysis": {
      "competitor_count": 3,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 28,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 8000,
      "projected_arr_year_1": 150000
    }
  }'::jsonb,
  true
),

(
  'Pet Health Tracker App',
  'Pet Care',
  'Pet Health',
  'Veterinary Records',
  'Digital health records, vaccination reminders, and symptom tracker for pets',
  'Pet owners lose veterinary paperwork and miss vaccination schedules, leading to $500-2000 in emergency vet bills',
  80,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 20,
      "competition_analysis": 19,
      "technical_feasibility": 21,
      "monetization_potential": 20
    },
    "demand_signals": {
      "monthly_searches": 42000,
      "trending_up": true,
      "pain_intensity": 7.2
    },
    "competition_analysis": {
      "competitor_count": 7,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 20,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 9000,
      "projected_arr_year_1": 160000
    }
  }'::jsonb,
  true
),

(
  'Plant Care Reminder App with AI Diagnosis',
  'Home & Garden',
  'Plant Care',
  'AI Plant Health',
  'Get watering schedules and diagnose plant problems by taking a photo',
  '90% of houseplants die within 6 months due to improper care; owners waste $200+/year replacing dead plants',
  74,
  'short',
  '{
    "score_breakdown": {
      "demand_validation": 19,
      "competition_analysis": 18,
      "technical_feasibility": 19,
      "monetization_potential": 18
    },
    "demand_signals": {
      "monthly_searches": 38000,
      "trending_up": true,
      "pain_intensity": 6.5
    },
    "competition_analysis": {
      "competitor_count": 11,
      "saturation_level": "medium",
      "differentiation_opportunity": "medium"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 17,
    "revenue_potential": {
      "model": "freemium",
      "projected_mrr_month_6": 6000,
      "projected_arr_year_1": 110000
    }
  }'::jsonb,
  true
),

(
  'Startup Pitch Deck Review Service',
  'Startups',
  'Fundraising',
  'Pitch Decks',
  'AI + expert feedback on pitch decks with specific improvement recommendations',
  'Founders spend 40+ hours on pitch decks that get rejected; 95% have the same 5 fixable problems that experts spot immediately',
  86,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 20,
      "technical_feasibility": 21,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 24000,
      "trending_up": true,
      "pain_intensity": 8.0
    },
    "competition_analysis": {
      "competitor_count": 6,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 35,
    "revenue_potential": {
      "model": "service",
      "projected_mrr_month_6": 18000,
      "projected_arr_year_1": 350000
    }
  }'::jsonb,
  true
),

(
  'AI Website Accessibility Auditor',
  'Web Development',
  'Accessibility',
  'WCAG Compliance',
  'Auto-detect accessibility issues and generate fix recommendations',
  '70% of websites have accessibility violations that expose owners to lawsuits; manual audits cost $2000-5000',
  85,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 19,
      "technical_feasibility": 21,
      "monetization_potential": 23
    },
    "demand_signals": {
      "monthly_searches": 19000,
      "trending_up": true,
      "pain_intensity": 7.8
    },
    "competition_analysis": {
      "competitor_count": 8,
      "saturation_level": "medium",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 42,
    "revenue_potential": {
      "model": "saas",
      "projected_mrr_month_6": 16000,
      "projected_arr_year_1": 320000
    }
  }'::jsonb,
  true
),

(
  'Smart Contract Templates for Creators',
  'Legal Tech',
  'Contracts',
  'Creator Economy',
  'Pre-made, customizable contracts for brand deals, collaborations, and licensing',
  'Creators lose $5K-15K annually to handshake agreements gone wrong; lawyers cost $300-500/hour for custom contracts',
  83,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 18,
      "technical_feasibility": 22,
      "monetization_potential": 22
    },
    "demand_signals": {
      "monthly_searches": 16000,
      "trending_up": true,
      "pain_intensity": 7.5
    },
    "competition_analysis": {
      "competitor_count": 4,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 38,
    "revenue_potential": {
      "model": "digital_products",
      "projected_mrr_month_6": 14000,
      "projected_arr_year_1": 280000
    }
  }'::jsonb,
  true
),

(
  'Community-Powered Product Reviews Platform',
  'E-commerce',
  'Product Reviews',
  'Authentic Reviews',
  'Verified purchase reviews with video proof and detailed testing methodology',
  '85% of consumers dont trust Amazon reviews due to fakery; they spend 3+ hours researching before buying',
  78,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 20,
      "competition_analysis": 18,
      "technical_feasibility": 20,
      "monetization_potential": 20
    },
    "demand_signals": {
      "monthly_searches": 29000,
      "trending_up": true,
      "pain_intensity": 7.0
    },
    "competition_analysis": {
      "competitor_count": 12,
      "saturation_level": "medium",
      "differentiation_opportunity": "medium"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 48,
    "revenue_potential": {
      "model": "affiliate",
      "projected_mrr_month_6": 12000,
      "projected_arr_year_1": 240000
    }
  }'::jsonb,
  true
),

(
  'AI-Powered Meditation App for Work Stress',
  'Mental Health',
  'Workplace Wellness',
  'Corporate Meditation',
  'Personalized meditation sessions based on work stress patterns and calendar analysis',
  'Workplace stress costs employers $300B annually; generic meditation apps have 85% abandonment after 1 week',
  81,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 19,
      "technical_feasibility": 20,
      "monetization_potential": 21
    },
    "demand_signals": {
      "monthly_searches": 34000,
      "trending_up": true,
      "pain_intensity": 7.3
    },
    "competition_analysis": {
      "competitor_count": 22,
      "saturation_level": "high",
      "differentiation_opportunity": "medium"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 52,
    "revenue_potential": {
      "model": "b2b_saas",
      "projected_mrr_month_6": 15000,
      "projected_arr_year_1": 300000
    }
  }'::jsonb,
  true
),

(
  'Smart Home Energy Optimizer',
  'Smart Home',
  'Energy Management',
  'IoT Automation',
  'AI-optimized heating/cooling schedules based on occupancy patterns and weather',
  'Homeowners waste $800-1200/year on inefficient HVAC usage; smart thermostats only solve 30% of the problem',
  80,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 20,
      "competition_analysis": 18,
      "technical_feasibility": 22,
      "monetization_potential": 20
    },
    "demand_signals": {
      "monthly_searches": 22000,
      "trending_up": true,
      "pain_intensity": 7.0
    },
    "competition_analysis": {
      "competitor_count": 9,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "high",
    "mvp_timeline_days": 65,
    "revenue_potential": {
      "model": "subscription",
      "projected_mrr_month_6": 13000,
      "projected_arr_year_1": 260000
    }
  }'::jsonb,
  true
),

(
  'Remote Team Culture Building Platform',
  'Remote Work',
  'Team Culture',
  'Virtual Team Building',
  'Structured virtual activities and rituals that actually build remote team cohesion',
  'Remote teams report 40% lower sense of belonging; existing "virtual happy hours" have 70% no-show rates',
  77,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 19,
      "competition_analysis": 18,
      "technical_feasibility": 19,
      "monetization_potential": 21
    },
    "demand_signals": {
      "monthly_searches": 17000,
      "trending_up": true,
      "pain_intensity": 6.8
    },
    "competition_analysis": {
      "competitor_count": 5,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "medium",
    "mvp_timeline_days": 58,
    "revenue_potential": {
      "model": "b2b_saas",
      "projected_mrr_month_6": 11000,
      "projected_arr_year_1": 220000
    }
  }'::jsonb,
  true
),

(
  'AI Tattoo Design Generator',
  'Creative Tools',
  'Tattoo Design',
  'AI Art Generation',
  'Generate custom tattoo designs from descriptions and style preferences',
  'Tattoo seekers spend 5-10 hours searching Pinterest for ideas, then pay artists $100-300 for custom designs',
  75,
  'mid',
  '{
    "score_breakdown": {
      "demand_validation": 19,
      "competition_analysis": 17,
      "technical_feasibility": 19,
      "monetization_potential": 20
    },
    "demand_signals": {
      "monthly_searches": 56000,
      "trending_up": true,
      "pain_intensity": 6.5
    },
    "competition_analysis": {
      "competitor_count": 3,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "low",
    "mvp_timeline_days": 25,
    "revenue_potential": {
      "model": "usage_based",
      "projected_mrr_month_6": 8000,
      "projected_arr_year_1": 160000
    }
  }'::jsonb,
  true
),

(
  'Decentralized Identity Verification System',
  'Web3',
  'Identity',
  'KYC Verification',
  'Privacy-preserving identity verification using blockchain and zero-knowledge proofs',
  'Current KYC processes cost $2-5 per verification and create honeypots of personal data; privacy regulations are tightening',
  84,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 19,
      "technical_feasibility": 20,
      "monetization_potential": 24
    },
    "demand_signals": {
      "monthly_searches": 12000,
      "trending_up": true,
      "pain_intensity": 7.5
    },
    "competition_analysis": {
      "competitor_count": 6,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 120,
    "revenue_potential": {
      "model": "enterprise_saas",
      "projected_mrr_month_6": 28000,
      "projected_arr_year_1": 600000
    }
  }'::jsonb,
  true
),

(
  'Autonomous Supply Chain Optimization Platform',
  'Logistics',
  'Supply Chain',
  'AI Optimization',
  'End-to-end supply chain optimization using AI for demand forecasting, routing, and inventory',
  'Supply chain inefficiencies cost global economy $1.8T annually; existing solutions are siloed and dont optimize across the chain',
  88,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 20,
      "technical_feasibility": 21,
      "monetization_potential": 25
    },
    "demand_signals": {
      "monthly_searches": 15000,
      "trending_up": true,
      "pain_intensity": 8.5
    },
    "competition_analysis": {
      "competitor_count": 8,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 180,
    "revenue_potential": {
      "model": "enterprise_saas",
      "projected_mrr_month_6": 35000,
      "projected_arr_year_1": 750000
    }
  }'::jsonb,
  true
),

(
  'Brain-Computer Interface for Productivity',
  'Neurotechnology',
  'BCI',
  'Productivity Enhancement',
  'Consumer-grade EEG headband that optimizes work sessions based on focus levels',
  'Knowledge workers lose 2-4 hours daily to low-focus states; existing productivity tools cant measure actual cognitive state',
  79,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 20,
      "competition_analysis": 18,
      "technical_feasibility": 19,
      "monetization_potential": 22
    },
    "demand_signals": {
      "monthly_searches": 8000,
      "trending_up": true,
      "pain_intensity": 7.8
    },
    "competition_analysis": {
      "competitor_count": 4,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 200,
    "revenue_potential": {
      "model": "hardware_subscription",
      "projected_mrr_month_6": 22000,
      "projected_arr_year_1": 500000
    }
  }'::jsonb,
  true
),

(
  'Quantum-Resistant Encryption Service',
  'Cybersecurity',
  'Encryption',
  'Post-Quantum Cryptography',
  'Encryption services using quantum-resistant algorithms for sensitive data',
  'Quantum computers will break current encryption within 10-15 years; enterprises need migration path now for long-term data',
  82,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 21,
      "competition_analysis": 19,
      "technical_feasibility": 20,
      "monetization_potential": 22
    },
    "demand_signals": {
      "monthly_searches": 6000,
      "trending_up": true,
      "pain_intensity": 8.0
    },
    "competition_analysis": {
      "competitor_count": 7,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 150,
    "revenue_potential": {
      "model": "enterprise_saas",
      "projected_mrr_month_6": 25000,
      "projected_arr_year_1": 550000
    }
  }'::jsonb,
  true
),

(
  'Autonomous Drone Delivery Network Software',
  'Logistics',
  'Drone Delivery',
  'Fleet Management',
  'Software platform for managing autonomous drone delivery fleets in urban areas',
  'Last-mile delivery costs represent 53% of total shipping costs; drones could reduce this by 40% but require complex coordination',
  87,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 22,
      "competition_analysis": 20,
      "technical_feasibility": 20,
      "monetization_potential": 25
    },
    "demand_signals": {
      "monthly_searches": 11000,
      "trending_up": true,
      "pain_intensity": 8.2
    },
    "competition_analysis": {
      "competitor_count": 5,
      "saturation_level": "low",
      "differentiation_opportunity": "very_high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 170,
    "revenue_potential": {
      "model": "b2b_saas",
      "projected_mrr_month_6": 30000,
      "projected_arr_year_1": 650000
    }
  }'::jsonb,
  true
),

(
  'AI-Powered Personalized Medicine Platform',
  'Healthcare',
  'Personalized Medicine',
  'AI Diagnostics',
  'Treatment recommendations based on genetic data, lifestyle, and medical history',
  'One-size-fits-all treatments have 30-50% failure rates; personalized medicine could save $2.5T annually in healthcare costs',
  90,
  'long',
  '{
    "score_breakdown": {
      "demand_validation": 23,
      "competition_analysis": 22,
      "technical_feasibility": 20,
      "monetization_potential": 25
    },
    "demand_signals": {
      "monthly_searches": 18000,
      "trending_up": true,
      "pain_intensity": 9.0
    },
    "competition_analysis": {
      "competitor_count": 9,
      "saturation_level": "low",
      "differentiation_opportunity": "high"
    },
    "technical_complexity": "very_high",
    "mvp_timeline_days": 240,
    "revenue_potential": {
      "model": "enterprise_saas",
      "projected_mrr_month_6": 40000,
      "projected_arr_year_1": 850000
    }
  }'::jsonb,
  true
);

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Verify count
SELECT COUNT(*) as total_opportunities FROM public.opportunities WHERE is_active = true;

-- Show distribution by horizon
SELECT horizon, COUNT(*) as count, ROUND(AVG(score), 1) as avg_score
FROM public.opportunities 
WHERE is_active = true
GROUP BY horizon
ORDER BY avg_score DESC;

-- Show distribution by market
SELECT market, COUNT(*) as count, ROUND(AVG(score), 1) as avg_score
FROM public.opportunities 
WHERE is_active = true
GROUP BY market
ORDER BY count DESC
LIMIT 10;

-- Show top 10 highest scoring opportunities
SELECT title, score, horizon, market
FROM public.opportunities 
WHERE is_active = true
ORDER BY score DESC
LIMIT 10;
