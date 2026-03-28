# FoundryAI

**Where million-dollar ideas are forged.**

FoundryAI is a crash-proof startup ideation platform that transforms raw concepts into actionable business plans. Built with a 6-layer resilient architecture and multi-provider AI fallback system.

![FoundryAI](https://img.shields.io/badge/FoundryAI-forge-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Groq](https://img.shields.io/badge/Groq-AI-green)

## 🎯 Core Philosophy

- **Execution > Knowledge**
- **Simplicity > Complexity**
- **Speed > Perfection**
- **Systems > Intelligence**

## ✨ Features

- **Idea Extraction Engine**: Converts vague input into clear product concepts
- **Tool Generation Engine**: Produces SaaS/tool concepts with core functionality
- **MVP Planning Engine**: Defines minimum features and fastest path to launch
- **Build Execution Engine**: Provides step-by-step, beginner-friendly instructions
- **Stack Recommendation Engine**: Recommends only free tools (Windsurf, Supabase, Vercel, GitHub)
- **Monetization Engine**: Suggests revenue models, pricing, and first-user acquisition tactics
- **Self-Improvement Loop**: Learns from user feedback to improve future outputs

## 🛠 Tech Stack (100% Free)

| Category | Tool | Purpose |
|----------|------|---------|
| Frontend | Next.js 15 | React framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Components | shadcn/ui | UI components |
| AI Layer | Groq + OpenRouter | AI processing |
| Database | Supabase | Data storage |
| Hosting | Vercel | Deployment |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub account
- Supabase account (free)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mohamed-Elgendi/FoundryAI.git
   cd vibebuilder-ai/my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   GROQ_API_KEY=your_groq_key
   OPENROUTER_API_KEY=your_openrouter_key  # optional
   ```

4. **Set up Supabase database**
   
   Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📊 Database Schema

Create the following table in Supabase:

```sql
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  user_input text not null,
  output_json jsonb not null,
  is_helpful boolean not null,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_feedback_is_helpful ON public.feedback(is_helpful);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow inserts
CREATE POLICY "Allow anonymous inserts" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Allow selects
CREATE POLICY "Allow anonymous selects" ON public.feedback
  FOR SELECT USING (true);
```

## 🔁 Self-Improvement System

FoundryAI continuously improves through:

1. **User Feedback Collection**: 👍/👎 on each output
2. **Pattern Recognition**: Analyzes successful outputs
3. **Prompt Optimization**: Injects successful patterns into new prompts
4. **Adaptive Learning**: Adjusts outputs based on historical data

## 📁 Project Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/      # AI generation endpoint
│   │   │   └── feedback/      # Feedback storage endpoint
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── vibebuilder/       # VibeBuilder components
│   │       ├── VibeBuilder.tsx
│   │       ├── IdeaInput.tsx
│   │       ├── OutputDisplay.tsx
│   │       └── LoadingState.tsx
│   ├── lib/
│   │   ├── ai-router.ts       # Multi-AI routing
│   │   ├── db/
│   │   │   └── supabase.ts    # Database operations
│   │   └── engines/
│   │       └── master-prompt.ts # AI prompt builder
│   └── types/
│       └── index.ts           # TypeScript types
├── env.example                # Environment template
└── package.json
```

## 🌐 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

## 📝 Usage

1. **Enter your idea** in the input field (e.g., "I want to build a tool that helps freelancers track invoices")
2. **Click "Generate Build Plan"**
3. **Review your structured output**:
   - Tool name and target user
   - Problem statement
   - MVP features list
   - Free tech stack recommendations
   - Step-by-step build plan with AI prompts
   - Monetization strategy
4. **Provide feedback** 👍/👎 to help the system improve

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for your own projects.

---

**Built with ❤️**

*Execution → Simplicity → Speed → Systems*

