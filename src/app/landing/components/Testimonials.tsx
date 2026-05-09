'use client';

import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp, Award, Users } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Tech Startup Founder',
    company: 'EcoTech Solutions',
    content: 'Created my investor deck and business plan in 2 hours instead of 2 weeks. The AI understood my vision better than some consultants I\'ve worked with. Raised $500K seed round.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60',
    metric: '$500K',
    metricLabel: 'Seed funding raised',
    rating: 5,
  },
  {
    name: 'Michael R.',
    role: 'Small Business Owner',
    company: 'Riverside Coffee',
    content: 'The financial projections were spot-on. My bank was impressed with the professional quality. Saved me thousands in consultant fees and got my loan approved in days.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60',
    metric: '$50K',
    metricLabel: 'Business loan approved',
    rating: 5,
  },
  {
    name: 'Jennifer L.',
    role: 'Business Consultant',
    company: 'JL Consulting Group',
    content: "I use FoundryAI for all my clients now. It's like having a team of analysts working 24/7. The quality rivals what I'd charge $10K for. Game changer for my practice.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=60',
    metric: '40+',
    metricLabel: 'Client plans created',
    rating: 5,
  },
];

const stats = [
  { value: '10,000+', label: 'Plans Created', icon: TrendingUp },
  { value: '$50M+', label: 'Funding Raised', icon: Award },
  { value: '4.9/5', label: 'Average Rating', icon: Star },
  { value: '50,000+', label: 'Entrepreneurs Helped', icon: Users },
];

export function Testimonials() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Loved by Founders</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Real Results from{' '}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Real Entrepreneurs
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join thousands who transformed their ideas into funded businesses.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-violet-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300 h-full flex flex-col">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-violet-400" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-300 leading-relaxed mb-6 flex-1">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Metric Badge */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold">{testimonial.metric}</span>
                    <span className="text-emerald-400/80 text-sm">{testimonial.metricLabel}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-800">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                    <div className="text-xs text-violet-400">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
