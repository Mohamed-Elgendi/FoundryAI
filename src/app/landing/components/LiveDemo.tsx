'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Loader2, Sparkles, TrendingUp, Users, DollarSign, FileText, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const analysisSteps = [
  { icon: FileText, text: 'Analyzing business model...' },
  { icon: Users, text: 'Researching target market...' },
  { icon: TrendingUp, text: 'Generating financial projections...' },
  { icon: DollarSign, text: 'Calculating revenue potential...' },
];

const sampleBusinessPlan = {
  title: 'EcoBrew Coffee Subscription',
  tagline: 'Sustainable coffee delivered to your door',
  marketSize: '$47B',
  growthRate: '+12.5%',
  revenue: '$2.4M',
  timeline: '18 months',
  sections: [
    { 
      name: 'Executive Summary', 
      status: 'complete', 
      preview: 'EcoBrew is a direct-to-consumer coffee subscription service specializing in organic, sustainably-sourced beans. We target eco-conscious millennials and Gen Z consumers who value transparency and environmental responsibility.',
      details: [
        { label: 'Business Model', value: 'Subscription-based D2C with 3-tier pricing' },
        { label: 'Target Market', value: 'Urban professionals aged 25-40, household income $75K+' },
        { label: 'Unique Value Prop', value: '100% carbon-neutral shipping + farmer profit-sharing' },
        { label: 'Key Metrics', value: '$180 avg order value, 85% retention rate, 2.3% monthly churn' },
      ]
    },
    { 
      name: 'Market Analysis', 
      status: 'complete', 
      preview: 'The specialty coffee market presents a significant opportunity with strong growth drivers and favorable consumer trends toward sustainability and convenience.',
      details: [
        { label: 'TAM', value: '$47.5B global specialty coffee market (2024)' },
        { label: 'SAM', value: '$12.3B US subscription food & beverage market' },
        { label: 'SOM', value: '$890M addressable within 5 years (0.5% market share)' },
        { label: 'Growth Drivers', value: '73% of millennials prefer sustainable brands, subscription economy growing 18% YoY' },
      ]
    },
    { 
      name: 'Financial Projections', 
      status: 'locked', 
      preview: '3-year revenue forecast, break-even analysis, and funding requirements...',
      details: null
    },
    { 
      name: 'Competitive Strategy', 
      status: 'locked', 
      preview: 'Differentiation strategy vs. Blue Bottle, Trade Coffee, and local roasters...',
      details: null
    },
    { 
      name: 'Go-to-Market Plan', 
      status: 'locked', 
      preview: 'Launch strategy, customer acquisition channels, and marketing budget...',
      details: null
    },
  ]
};

export function LiveDemo() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  const handleGenerate = () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult(false);
    setShowTeaser(false);
    setCurrentStep(0);

    // Animate through analysis steps
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= analysisSteps.length) {
        clearInterval(interval);
        setLoading(false);
        setResult(true);
        // Show teaser after a brief delay
        setTimeout(() => setShowTeaser(true), 1500);
      }
    }, 800);
  };

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Live Interactive Demo
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            See the Magic Happen in Real-Time
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Enter your business idea and watch our AI build a complete plan with market research, financials, and strategy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700"
        >
          <div className="space-y-6">
            {/* Input Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Describe your business idea
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="A sustainable coffee subscription service that sources beans directly from organic farms and delivers them to eco-conscious consumers..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!input.trim() || loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI is analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Business Plan
                </>
              )}
            </button>

            {/* Analysis Progress */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
                >
                  <div className="space-y-4">
                    {analysisSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: index <= currentStep ? 1 : 0.3, 
                          x: 0 
                        }}
                        className={`flex items-center gap-3 ${
                          index < currentStep ? 'text-emerald-600 dark:text-emerald-400' : 
                          index === currentStep ? 'text-violet-600 dark:text-violet-400' : 
                          'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index < currentStep ? 'bg-emerald-100 dark:bg-emerald-900' :
                          index === currentStep ? 'bg-violet-100 dark:bg-violet-900 animate-pulse' :
                          'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          {index < currentStep ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <step.icon className="w-4 h-4" />
                          )}
                        </div>
                        <span className={`font-medium ${
                          index === currentStep ? 'animate-pulse' : ''
                        }`}>
                          {step.text}
                        </span>
                        {index === currentStep && (
                          <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Preview */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  {/* Plan Header */}
                  <div className="p-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{sampleBusinessPlan.title}</h3>
                        <p className="text-violet-100">{sampleBusinessPlan.tagline}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-semibold">
                        Preview
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      {[
                        { label: 'Market Size', value: sampleBusinessPlan.marketSize },
                        { label: 'Growth Rate', value: sampleBusinessPlan.growthRate },
                        { label: 'Revenue Potential', value: sampleBusinessPlan.revenue },
                        { label: 'Break-even', value: sampleBusinessPlan.timeline },
                      ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-xs text-violet-200">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plan Sections */}
                  <div className="space-y-3">
                    {sampleBusinessPlan.sections.map((section, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-xl border ${
                          section.status === 'complete' 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            section.status === 'complete'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`}>
                            {section.status === 'complete' ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <Lock className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-semibold ${
                                section.status === 'complete' 
                                  ? 'text-slate-900 dark:text-white' 
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}>
                                {section.name}
                              </h4>
                              {section.status === 'locked' && (
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                                  Pro Feature
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${
                              section.status === 'complete' 
                                ? 'text-slate-600 dark:text-slate-300' 
                                : 'text-slate-400 dark:text-slate-500'
                            }`}>
                              {section.status === 'complete' ? section.preview : `🔒 ${section.preview}`}
                            </p>
                            
                            {/* Detailed metrics for unlocked sections */}
                            {section.status === 'complete' && section.details && (
                              <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {section.details.map((detail, dIdx) => (
                                    <div key={dIdx} className="flex flex-col">
                                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{detail.label}</span>
                                      <span className="text-sm text-slate-700 dark:text-slate-300">{detail.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Teaser */}
            <AnimatePresence>
              {showTeaser && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Lock className="w-5 h-5" />
                    <span className="font-semibold">3 sections locked</span>
                  </div>
                  <p className="mb-4 text-amber-100">
                    Get the complete business plan with full financial projections, competitive analysis, and go-to-market strategy
                  </p>
                  <Link 
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-orange-600 font-bold hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Unlock Full Plan
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <p className="mt-3 text-sm text-amber-100">
                    Free plan available • No credit card required
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-400 text-sm">
            Trusted by 10,000+ entrepreneurs • AI-powered by GPT-4 • Bank-grade security
          </p>
        </motion.div>
      </div>
    </section>
  );
}
