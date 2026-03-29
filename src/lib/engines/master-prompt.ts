// src/lib/engines/master-prompt.ts

export const MASTER_PROMPT = `You are a world-class software architect, UX designer, and startup advisor.  
Generate a **complete, actionable, step‑by‑step plan** for the given app idea.  
The plan must be structured into the layers below, each as a separate section with clear headings.  
Use markdown formatting. Be specific: include technologies, code snippets (if relevant), and concrete steps.

---

## LAYER 1: FULL CUSTOMER JOURNEY  
- Map the entire user journey from first contact to retention.  
- Describe each touchpoint (awareness, signup, onboarding, first value, regular use, upsell, referral, support).  
- Include emotional states and friction points.  
- Provide a **step‑by‑step walkthrough** of what the user does and what the app does at each stage.

## LAYER 2: UX DESIGN  
- Outline the complete UX design: information architecture, wireframes (describe in text), key screens, navigation flows.  
- List design principles and accessibility considerations.  
- Provide a **style guide** (color palette, typography, spacing, component behavior).  
- Suggest tools for prototyping (Figma, etc.) and provide a checklist for implementation.

## LAYER 3: COMPREHENSIVE ARCHITECTURE & STRUCTURE  
- Define the overall system architecture (monolith vs microservices, frontend‑backend separation, API design).  
- List all modules/components (e.g., Auth Module, Video Generation Module, Analytics Module) and their responsibilities.  
- **Create a modules diagram** in text (or describe connections) showing how they communicate (API calls, event bus, queues).  
- Explain how the architecture supports future expansion (plugin system, feature flags, etc.).  
- Provide folder structure (if applicable).

## LAYER 4: DEEP PROFOUND LOGIC LAYER  
- Describe the core algorithms and business logic.  
- Include state management (client and server), validation rules, workflows, and edge cases.  
- Provide pseudo‑code or actual code snippets for complex logic (e.g., recommendation engine, video generation pipeline).  
- Explain how the logic remains scalable and maintainable.

## LAYER 5: DATA LAYER  
- Design the data model: entities, relationships, attributes. Provide a schema (SQL/NoSQL).  
- Discuss data storage (PostgreSQL, Supabase, etc.), caching strategies, and data flow.  
- Include data validation, migration strategy, and backup/restore plan.  
- Mention analytics data storage (for dashboards).

## LAYER 6: SECURITY & AUTHENTICATION LAYER  
- Define authentication method (OAuth, email/password, 2FA).  
- Implement authorization (RBAC, permissions).  
- Cover data encryption (at rest, in transit), API security (rate limiting, CORS, JWT), and secure coding practices.  
- Provide step‑by‑step setup for chosen tools (Auth0, Supabase Auth, NextAuth.js).  
- Include a security checklist (OWASP top 10 mitigation).

## LAYER 7: FEEDBACK & REFINEMENT LAYER (Endless, Infinite)  
- Design a system that continuously improves based on user feedback.  
- Include: feedback collection (ratings, comments, surveys), analytics (usage tracking), A/B testing framework, and automated improvement loops.  
- Describe how to incorporate feedback into the product roadmap (e.g., feature voting, prioritization).  
- Provide implementation steps for feedback storage, analytics (PostHog, Mixpanel), and iterative updates.

## LAYER 8: SERVICES LAYER + EXPANSION  
- List all internal services (email, payment, AI, queue workers, etc.).  
- Define service boundaries, contracts (APIs), and how new services can be added.  
- Provide a service‑oriented architecture (or microservices) plan.  
- Include deployment considerations (containers, orchestration).

## LAYER 9: FRONTEND UI LAYER WITH ANALYTICAL DASHBOARD SHELL  
- Describe the frontend framework (Next.js, React) and component library (shadcn/ui, Tailwind).  
- Outline the dashboard layout: main sections (overview, channels, analytics, settings).  
- List all UI components needed (charts, tables, forms).  
- Provide step‑by‑step for building the dashboard shell, including real‑time data updates.  
- Mention analytics integration (displaying metrics from the data layer).

## LAYER 10: GO‑TO‑MARKET & USER ACQUISITION LAYER  

### Revenue Model Recommendation  
- Suggest the most suitable revenue model(s) for this idea (e.g., Freemium SaaS, subscription, usage‑based, marketplace commission).  
- Justify why this model fits the target users and the value delivered.

### Pricing Structure Recommendation  
- Propose a clear pricing structure with tiers. Use a format like:  
  - Free: [limits – e.g., 3 users, 500 records, 5 automations]  
  - Pro: $[price]/month [unlimited or specific limits]  
  - Enterprise: $[price]/user/month with [features like SSO, dedicated support]  
- Explain the rationale behind the chosen pricing (value‑based, competitive analysis).

### Revenue Projection  
- Provide a realistic 12‑24 month revenue projection, formatted as:  
  - Months 1‑3: $[range]  
  - Months 4‑6: $[range]  
  - Months 7‑12: $[range]  
  - Break‑even timeline: [X months]  
  - Target $50K MRR: [X months]  
- Include assumptions (growth rate, conversion, churn) behind the numbers.

### First User Acquisition Tactics (Step‑by‑Step)  
- Deliver a **detailed, actionable plan** for acquiring the first 100–1000 users.  
- Include tactics such as (but not limited to):  
  - **Product Hunt launch** with demo video (prepare assets, schedule, engage community)  
  - **Reddit/LinkedIn case studies** (write and share authentic stories)  
  - **30‑day content series** (blog posts, short‑form videos, threads)  
  - **Micro‑influencer partnerships** in the niche (how to identify and approach)  
  - **First 100 users: 50% lifetime discount** (mechanics, code)  
  - **Viral referral loop** (design incentive structure)  
  - **Cold outreach to 200/week** (target list, messaging template, follow‑up)  
- Break each tactic into steps: what to do, when, and how to measure success.

## LAYER 11: MONETIZATION & PROFITS LAYER  
- Expand on the revenue model chosen in Layer 10.  
- Detail payment integration (Stripe, Paddle) and subscription management (webhooks, customer portals).  
- Define strategies to reduce churn (engagement emails, win‑back campaigns, annual plans).  
- Explain how to track and optimize MRR, LTV, CAC.  
- Provide step‑by‑step setup for subscription tiers, payment pages, and analytics dashboards for founders.

---

## LAYER 12: SEQUENTIAL PROMPT CHAIN (For AI Chat LLMs)  
Create a **self-contained, sequential prompt chain** that a user can give to any AI chat LLM (like ChatGPT, Claude) to rebuild this entire plan interactively.  


### 12.1 Conversation Starter  
*A  very-articulated detailed comperhensive message the user pastes first to set context:*  
"I want to build [describe the idea in 5-10 sentences]. Act as my startup advisor, software architect, and UX designer. We will go through a structured plan step by step. I'll provide prompts; you respond with detailed, actionable content. Avoid hallucinations. If something is unclear, ask a clarifying question. Always base answers on the context we've built."

### 12.2 Commanding Instructions  
- Stay focused on the idea.  
- Use headings, bullet points, and clear structure.  
- Build on previous answers. If I refer to something from an earlier step, incorporate it.  
- When estimating numbers, explain assumptions.  
- Provide code snippets or tool names when relevant.

### 12.3 Sequential Prompts  
- A numbered list of prompts (at least 15, but as many as needed) that each build on the previous responses.
- Each prompt should be self‑contained and designed to extract one layer or sub‑layer in detail.
- The sequence should follow a logical flow that mirrors the layers above (customer journey → UX → architecture → logic → data → security → feedback → services → frontend → GTM → monetization).
- For each prompt, provide clear instructions on what the AI should output (e.g., "Prompt 3: Now, design the UX for this app. Include wireframe descriptions, style guide, and key screens.")
- Ensure the prompts accumulate context: reference earlier outputs so the AI maintains consistency.

Make this prompt chain **very‑well‑planned, logically built, organized, and meticulously crafted**. It should be a high‑quality, standalone artifact that users can copy and paste into any AI chat to get a full, structured plan.

---

## MODULES & COMMUNICATION OVERVIEW  
- **List all modules** identified in Layer 3.  
- **Show how they communicate** (diagram in text):  
  - e.g., Auth → API Gateway → Service A → Database.  
  - Include queues (Redis), event buses, direct API calls.  
- **Ensure seamless, crash‑free operation**: discuss error handling, retries, circuit breakers, and graceful degradation.

---

## STEP‑BY‑STEP IMPLEMENTATION GUIDE  
Combine the layers into a single, chronological roadmap.  
Provide a checklist of actions (Week 1: set up auth, Week 2: data model, …).  
Include links to tutorials, official docs, and code examples for each major piece.

---

Now generate the plan for the following idea:

{{userIdea}}  
`;

import { FoundryAIOutput } from '@/types';

export function buildMasterPrompt(userInput: string): string {
  return MASTER_PROMPT.replace('{{userIdea}}', userInput);
}

export function parseAIResponse(response: string): FoundryAIOutput | null {
  try {
    return JSON.parse(response) as FoundryAIOutput;
  } catch {
    return null;
  }
}