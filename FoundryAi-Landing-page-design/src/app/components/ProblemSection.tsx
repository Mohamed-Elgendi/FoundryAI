import { motion } from 'motion/react';
import { Clock, FileQuestion, TrendingDown } from 'lucide-react';

const painPoints = [
  {
    icon: Clock,
    title: 'Stuck at $0 with no clear path?',
    description: 'You\'ve tried courses, watched videos, read books — but still haven\'t made your first dollar online. No momentum, no revenue, no confidence.',
  },
  {
    icon: FileQuestion,
    title: 'Overwhelmed by endless options?',
    description: 'SaaS? YouTube? Affiliate marketing? Agency? With 1000+ ways to make money online, you freeze. Analysis paralysis keeps you from starting.',
  },
  {
    icon: TrendingDown,
    title: 'Building alone without support?',
    description: 'Every time you hit a wall — technical issue, marketing confusion, self-doubt — there\'s no one to help. You quit before you see results.',
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            The Brutal Truth Most "Gurus" Won't Tell You
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Knowledge without execution is worthless. Tactics without foundation crumble. 
            90% of aspiring entrepreneurs fail because they skip the most critical step: 
            building the capacity to build.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-6">
                <point.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {point.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
