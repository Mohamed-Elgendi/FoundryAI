// @ts-nocheck
'use client';

import { motion } from 'framer-motion';
import { Clock, FileQuestion, TrendingDown, AlertCircle } from 'lucide-react';

const painPoints = [
  {
    icon: Clock,
    title: '40+ Hours Wasted',
    subtitle: 'on research & writing',
    description: 'Traditional business planning takes weeks of manual research, writing, and formatting. Time you could spend building your business.',
    stat: '87%',
    statLabel: 'of founders quit before finishing',
  },
  {
    icon: FileQuestion,
    title: 'The Blank Page Paralysis',
    subtitle: "writer's block kills momentum",
    description: "Staring at an empty document doesn't create a business plan. You need guidance, structure, and expert insights.",
    stat: '73%',
    statLabel: 'struggle with where to start',
  },
  {
    icon: TrendingDown,
    title: 'Financial Guesswork',
    subtitle: 'projections feel like gambling',
    description: 'Without market data and industry benchmarks, your financial projections are just wishful thinking.',
    stat: '62%',
    statLabel: 'of plans fail investor scrutiny',
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>The Reality Check</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Business Planning is{' '}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Broken
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Most entrepreneurs never finish their business plan. Here&apos;s why.
          </p>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-red-500/30 transition-all duration-300 h-full">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <point.icon className="w-7 h-7 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {point.title}
                      </h3>
                      <p className="text-red-400 text-sm font-medium">
                        {point.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 leading-relaxed mb-6">
                    {point.description}
                  </p>

                  {/* Stat */}
                  <div className="flex items-baseline gap-2 pt-6 border-t border-slate-800">
                    <span className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                      {point.stat}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {point.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 text-lg mb-4">
            There&apos;s a better way to build your business plan
          </p>
          <div className="inline-flex items-center gap-2 text-violet-400 font-semibold">
            <span>See how FoundryAI fixes this</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
