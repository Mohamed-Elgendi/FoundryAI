import { motion } from 'motion/react';
import { Lightbulb, Zap, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Lightbulb,
    title: 'Forge Your Foundation',
    description: 'Before building a business, you build the capacity to build. Our 8-system Core Foundation Layer optimizes your psychology, focus, emotions, and momentum.',
    detail: 'Belief Architecture → Distractions Killer → Brain Dump → Emotion Controller',
  },
  {
    icon: Zap,
    title: 'Discover & Validate',
    description: 'Stop guessing. The Opportunity Radar scans 12 proven business archetypes to find validated gaps with real demand — SaaS, YouTube, Agencies, Digital Products, and more.',
    detail: 'AI-validated opportunities with market size, competition, and revenue potential',
  },
  {
    icon: CheckCircle,
    title: 'Execute & Earn',
    description: 'Not theory. Real execution. The AI Build Assistant guides you step-by-step to launch your first revenue stream within 14 days, then scales you to 7 figures.',
    detail: 'From $0 → $1 → $100 → $1K → $10K → $100K → $1M+ per month',
  },
];

export function SolutionSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            The FoundryAI Transformation Journey
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            We don't teach entrepreneurship. We forge entrepreneurs. 
            Every session produces tangible progress — from mindset mastery to revenue generation.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 transform -translate-y-1/2 opacity-20" />
          
          <div className="grid lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {step.description}
                    </p>
                    <span className="text-sm text-violet-600 dark:text-violet-400 font-medium">
                      {step.detail}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
