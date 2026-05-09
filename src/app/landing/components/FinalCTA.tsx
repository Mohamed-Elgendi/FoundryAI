'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const trustBadges = [
  { icon: Shield, label: 'Bank-grade security' },
  { icon: Clock, label: 'Setup in 2 minutes' },
  { icon: Zap, label: 'Cancel anytime' },
];

export function FinalCTA() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600">
        {/* Animated Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Join 10,000+ Entrepreneurs Today</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Ready to Turn Your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-200">
            Idea Into Reality?
          </span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Stop dreaming about your business. Start building it. 
          Your investor-ready plan is just minutes away.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link 
            href="/signup"
            className="group relative px-10 py-5 rounded-full bg-white text-violet-600 text-lg font-bold overflow-hidden transition-all hover:shadow-2xl hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              Build Your Plan Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          
          <Link 
            href="/login"
            className="px-10 py-5 rounded-full border-2 border-white/30 text-white text-lg font-semibold hover:bg-white/10 transition-all"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-12"
        >
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-white/70">
              <badge.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8 border-t border-white/10"
        >
          {[
            { value: '5 min', label: 'To get started' },
            { value: '$50M+', label: 'Funding raised' },
            { value: '94%', label: 'Success rate' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
