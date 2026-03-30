import { useState, useEffect } from 'react';
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
import { Header } from './components/Header';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950' : 'bg-white'}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
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
