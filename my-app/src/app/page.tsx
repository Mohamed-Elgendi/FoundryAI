import { FoundryAI } from '@/components/foundryai/FoundryAI';
import { Sparkles, Zap, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-base sm:text-lg">FoundryAI</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Powered by Groq AI
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              100% Free Stack
            </span>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-3">
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Powered by Groq AI
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                100% Free Stack
              </span>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Hero Section */}
        <section className="mx-auto max-w-3xl text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
            Turn Your Ideas Into{" "}
            <span className="text-gradient">Revenue Streams</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Describe your concept in plain English. Our AI transforms it into a complete 
            business blueprint with market research, tech stack, and monetization strategy.
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 sm:mt-6">
            {['Market Research', 'MVP Features', 'Tech Stack', 'Build Plan', 'Monetization'].map((feature) => (
              <span 
                key={feature}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs sm:text-sm font-medium bg-background"
              >
                {feature}
              </span>
            ))}
          </div>
        </section>

        {/* App Section */}
        <section className="mx-auto max-w-3xl px-0 sm:px-4">
          <FoundryAI />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-center sm:text-left">Built with Next.js 15, Tailwind CSS, and Groq AI</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span>100% Free Stack</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
