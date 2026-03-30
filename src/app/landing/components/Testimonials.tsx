'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Tech Startup Founder',
    content: 'Created my investor deck and business plan in 2 hours instead of 2 weeks. Raised $500K seed round.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60',
  },
  {
    name: 'Michael R.',
    role: 'Small Business Owner',
    content: 'The financial projections were spot-on. Saved me thousands in consultant fees.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60',
  },
  {
    name: 'Jennifer L.',
    role: 'Business Consultant',
    content: "I use FoundryAI for all my clients now. It's like having a team of analysts working 24/7.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=60',
  },
];

const stats = [
  { value: '10,000+', label: 'Plans Created' },
  { value: '$50M+', label: 'Funding Raised' },
  { value: '4.9/5', label: 'Rating' },
];

export function Testimonials() {
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
            Loved by Entrepreneurs Worldwide
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                  width={48}
                  height={48}
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <div key={index} className="p-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
