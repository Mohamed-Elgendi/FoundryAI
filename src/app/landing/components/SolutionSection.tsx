// @ts-nocheck
'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Lightbulb,
    title: 'Describe Your Idea',
    description: 'Tell us about your business concept in plain English. No forms, no templates, just conversation.',
    detail: '2 minutes',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'AI Analyzes & Builds',
    description: 'Our AI researches markets, analyzes competitors, and generates professional business plans instantly.',
    detail: '3 minutes',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: CheckCircle,
    title: 'Get Your Blueprint',
    description: 'Receive a complete, investor-ready business plan with financials, market analysis, and strategy.',
    detail: 'Ready to download',
    color: 'from-emerald-500 to-teal-500',
  },
];

export function SolutionSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-violet-950/10 to-slate-950" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>The Solution</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            From Idea to Plan in{' '}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            No more blank pages. No more guesswork. Just results.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5">
            <div className="h-full bg-gradient-to-r from-amber-500/30 via-violet-500/30 to-emerald-500/30" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Time Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                      {step.detail}
                    </span>
                  </div>

                  <div className="pt-8">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} bg-opacity-20 flex items-center justify-center mb-6`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow - Not on last item */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-slate-500" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '5 min', label: 'Average time' },
            { value: '10,000+', label: 'Plans created' },
            { value: '94%', label: 'Satisfaction rate' },
            { value: '$50M+', label: 'Funding raised' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-500 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
