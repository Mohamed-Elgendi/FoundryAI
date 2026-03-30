import { motion } from 'motion/react';
import { Clock, FileQuestion, TrendingDown } from 'lucide-react';

const painPoints = [
  {
    icon: Clock,
    title: 'Spending weeks on research?',
    description: 'Traditional planning takes 40+ hours of research and writing',
  },
  {
    icon: FileQuestion,
    title: 'Staring at a blank page?',
    description: "Writer's block kills momentum before you even start",
  },
  {
    icon: TrendingDown,
    title: 'Unsure about your numbers?',
    description: 'Financial projections feel like guesswork without expert help',
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
            Stop Struggling with Business Planning
          </h2>
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
