import { FoundryAI } from '@/components/vibebuilder/VibeBuilder';
import { Sparkles, Zap, Shield, Link2, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl float-delayed" />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-primary/8 rounded-full blur-3xl float" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/50 sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight">FoundryAI</span>
              <span className="text-xs text-muted-foreground">Forge Your Venture</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Powered by Groq AI
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                100% Free Stack
              </span>
            </nav>
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors hover-lift"
              >
                <Link2 className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors hover-lift"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex fade-in-up">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 shadow-lg shadow-primary/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">AI-Powered Execution Engine</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 fade-in-up-delayed">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block">Turn Your Ideas Into</span>
              <span className="block mt-2 gradient-text glow-text">
                Revenue Streams
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Describe your concept in plain English. Our AI transforms it into a complete 
              business blueprint with market research, tech stack, and monetization strategy.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 fade-in-up-delayed" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: '📊', text: 'Market Research' },
              { icon: '⚡', text: 'MVP Features' },
              { icon: '🛠️', text: 'Tech Stack' },
              { icon: '📋', text: 'Build Plan' },
              { icon: '💰', text: 'Monetization' },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-border/50 shadow-sm hover-lift cursor-default"
              >
                <span>{feature.icon}</span>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main App Section */}
      <section className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <FoundryAI />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-md bg-white/30 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Built with Next.js 15, Tailwind CSS, and Groq AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>100% Free Stack</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>Self-Improving System</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
