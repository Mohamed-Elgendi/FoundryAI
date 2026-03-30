'use client';

import { motion } from 'framer-motion';
import { FileText, Globe, TrendingUp, Radar, Download, Sparkles } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'AI Business Plan Generator',
    description: 'Complete executive summaries, market analysis, and financial projections',
  },
  {
    icon: Globe,
    title: 'Real-Time Market Research',
    description: 'Automated competitor analysis and industry insights',
  },
  {
    icon: TrendingUp,
    title: 'Financial Modeling',
    description: 'Revenue forecasts, cost analysis, and break-even calculations',
  },
  {
    icon: Radar,
    title: 'Opportunity Radar',
    description: 'Discover trending markets and untapped opportunities',
  },
  {
    icon: Download,
    title: 'Export & Share',
    description: 'PDF, Markdown, and JSON exports for investors and teams',
  },
  {
    icon: Sparkles,
    title: 'Plan Refinement',
    description: 'Iterate and improve your plan with AI assistance',
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need to Launch Successfully
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-600 dark:hover:border-violet-500 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
