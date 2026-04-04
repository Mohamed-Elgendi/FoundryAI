import { motion } from 'motion/react';
import { Brain, Radar, Zap, Bot, TrendingUp, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: '8-System Core Foundation',
    description: 'Before you build a business, build the capacity to build. Belief Architecture, Distractions Killer, Brain Dump, Emotion Controller, Momentum Builder, and more — all working 24/7.',
  },
  {
    icon: Radar,
    title: '12 Business Archetypes',
    description: 'From SaaS to YouTube to Agencies to Digital Products — every viable online income methodology covered with the complete 4-Pillar Success System.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Opportunity Radar',
    description: 'Stop chasing shiny objects. Our AI scans real-time market data to find validated opportunities with demand, feasibility, and monetization potential.',
  },
  {
    icon: Bot,
    title: '24/7 AI Build Assistant',
    description: 'Your always-on technical co-founder. From code generation to error resolution to architecture decisions — never build alone again.',
  },
  {
    icon: TrendingUp,
    title: '7-Dimensional Momentum Engine',
    description: 'Track progress across Financial, Social, Physical, Mental, Educational, Professional, and Spiritual dimensions. Compound growth in all areas.',
  },
  {
    icon: Sparkles,
    title: '$0 → 7 Figures Roadmap',
    description: 'Clear pathway: First revenue within 14 days, then scale through $1 → $100 → $1K → $10K → $100K → $1M+ per month with systematic execution.',
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
            The Universal Money Making Machine
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Not a course. Not just a tool. A complete transformation operating system 
            that forges entrepreneurs while simultaneously building their businesses.
          </p>
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
