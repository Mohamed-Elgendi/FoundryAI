'use client';

import { motion } from 'framer-motion';
import { FileText, Globe, TrendingUp, Radar, Download, Sparkles, Brain, Shield, Zap, Target, BarChart3, FileCheck } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Business Plan Generator',
    description: 'Complete executive summaries, market analysis, and financial projections generated in minutes, not weeks.',
    color: 'from-violet-500 to-purple-500',
    size: 'large',
  },
  {
    icon: Globe,
    title: 'Real-Time Market Research',
    description: 'Automated competitor analysis and industry insights powered by live data.',
    color: 'from-blue-500 to-cyan-500',
    size: 'small',
  },
  {
    icon: BarChart3,
    title: 'Financial Modeling',
    description: 'Revenue forecasts, cost analysis, and break-even calculations with industry benchmarks.',
    color: 'from-emerald-500 to-teal-500',
    size: 'large',
  },
  {
    icon: Radar,
    title: 'Opportunity Radar',
    description: 'Discover trending markets and untapped opportunities before your competitors.',
    color: 'from-amber-500 to-orange-500',
    size: 'small',
  },
  {
    icon: FileCheck,
    title: 'Export & Share',
    description: 'PDF, Word, and Markdown exports ready for investors and stakeholders.',
    color: 'from-pink-500 to-rose-500',
    size: 'small',
  },
  {
    icon: Sparkles,
    title: 'Plan Refinement',
    description: 'Iterate and improve your plan with AI assistance based on feedback.',
    color: 'from-indigo-500 to-violet-500',
    size: 'small',
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Launch Successfully
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Professional-grade tools that work as hard as you do.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative ${feature.size === 'large' ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden">
                {/* Gradient Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-6 flex items-center gap-2 text-violet-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <span className="text-sm font-medium">Learn more</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <div className="relative bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20 rounded-2xl p-8 border border-violet-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Enterprise-Grade Security</h4>
                  <p className="text-slate-400">Your business ideas are encrypted and never shared. Ever.</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                {['SOC 2 Compliant', 'GDPR Ready', '256-bit SSL'].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
