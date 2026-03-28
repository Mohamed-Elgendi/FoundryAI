'use client';

import { FoundryAI } from '@/components/foundryai/FoundryAI';
import { OpportunityRadar, Opportunity } from '@/components/foundryai/OpportunityRadar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Target, Rocket, Menu, X, TrendingUp, Lightbulb, Crown, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('build');
  const [prefilledIdea, setPrefilledIdea] = useState<string | undefined>(undefined);

  const handleOpportunitySelect = (opportunity: Opportunity) => {
    const ideaText = `${opportunity.title}: ${opportunity.problem}. The angle is ${opportunity.angle}. Target market: ${opportunity.market} / ${opportunity.niche}.`;
    setPrefilledIdea(ideaText);
    setActiveTab('build');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="container px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight">FoundryAI</span>
              <span className="text-[10px] text-slate-500 -mt-1">Business Blueprint Studio</span>
            </div>
          </div>

          {/* Desktop Nav - Marketing focused */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="font-medium">AI-Powered Analysis</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Target className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">Market Validated</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Rocket className="h-4 w-4 text-violet-500" />
              <span className="font-medium">Launch Ready</span>
            </span>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-4">
            <nav className="flex flex-col gap-3 text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="font-medium">AI-Powered Analysis</span>
              </span>
              <span className="flex items-center gap-2 text-slate-600">
                <Target className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">Market Validated</span>
              </span>
              <span className="flex items-center gap-2 text-slate-600">
                <Rocket className="h-4 w-4 text-violet-500" />
                <span className="font-medium">Launch Ready</span>
              </span>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Hero Section - Marketing Focused */}
        <section className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Trusted by 10,000+ Entrepreneurs
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 text-slate-900">
            Transform Ideas Into{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Profitable Businesses
            </span>
          </h1>
          
          <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Get a complete business blueprint with market research, revenue projections, 
            and a step-by-step launch plan — all in under 2 minutes.
          </p>
          
          {/* Social Proof / Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { label: 'Market Research', desc: 'TAM/SAM Analysis' },
              { label: 'Revenue Model', desc: 'Pricing Strategy' },
              { label: 'Launch Plan', desc: '90-Day Roadmap' },
              { label: 'Risk Assessment', desc: 'Competitive Edge' },
            ].map((item) => (
              <div 
                key={item.label}
                className="flex flex-col items-center px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-semibold text-slate-900">{item.label}</span>
                <span className="text-xs text-slate-500">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs Section */}
        <section className="mx-auto max-w-3xl px-0 sm:px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-slate-100/80">
              <TabsTrigger value="build" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Lightbulb className="w-4 h-4" />
                Build Your Business
              </TabsTrigger>
              <TabsTrigger value="radar" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <TrendingUp className="w-4 h-4" />
                Discover Opportunities
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="build" className="mt-0">
              <FoundryAI initialIdea={prefilledIdea} />
            </TabsContent>
            
            <TabsContent value="radar" className="mt-0">
              <OpportunityRadar 
                onSelect={handleOpportunitySelect} 
                limit={5}
              />
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Footer - Clean Marketing Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">FoundryAI</span>
            </div>
            <p className="text-sm text-slate-500 text-center max-w-md">
              Empowering entrepreneurs to build successful businesses with AI-powered market intelligence.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>© 2025 FoundryAI</span>
              <span>•</span>
              <span>Privacy First</span>
              <span>•</span>
              <span>Enterprise Grade</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
