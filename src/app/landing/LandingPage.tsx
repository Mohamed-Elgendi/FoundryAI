'use client';

import { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { LiveDemo } from './components/LiveDemo';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { useTheme } from '@/lib/theme/theme-context';

export function LandingPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950' : 'bg-white'}`}>
      <Header />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGrid />
      <Testimonials />
      <Pricing />
      <LiveDemo />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
