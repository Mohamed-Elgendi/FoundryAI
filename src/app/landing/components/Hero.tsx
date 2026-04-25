// @ts-nocheck
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950/20 to-slate-950">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-500/5 to-transparent rounded-full" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-12rem)]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              <span>AI-Powered Business Planning</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
              >
                Turn Your{' '}
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Idea
                </span>
                <br />
                Into a Business
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl text-slate-400 leading-relaxed max-w-xl"
              >
                Generate investor-ready business plans with AI in minutes. 
                No more blank pages, no more guesswork.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                href="/signup"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-lg font-semibold overflow-hidden transition-all hover:shadow-2xl hover:shadow-violet-500/25 hover:scale-105 text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Building Free
                  <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link 
                href="#demo"
                className="group px-8 py-4 rounded-full border border-slate-700 text-slate-300 text-lg font-semibold hover:border-violet-500/50 hover:text-white transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">Bank-grade security</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">No credit card required</span>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4 pt-6 border-t border-slate-800"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-slate-300 font-semibold ml-2">4.9/5</span>
                </div>
                <p className="text-sm text-slate-500">Trusted by 10,000+ entrepreneurs</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Demo Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-slate-500">FoundryAI Business Plan Generator</span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Input Area */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-2">Describe your business idea:</p>
                  <p className="text-white text-sm leading-relaxed">
                    &ldquo;An AI-powered business planning platform that helps entrepreneurs create investor-ready plans in minutes...&rdquo;
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    <span className="text-xs text-violet-400">AI is analyzing your idea...</span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Research', icon: '🔍', active: true },
                    { label: 'Analysis', icon: '📊', active: true },
                    { label: 'Writing', icon: '✍️', active: true },
                    { label: 'Review', icon: '✅', active: false },
                  ].map((step, i) => (
                    <div key={i} className={`text-center p-2 rounded-lg border ${step.active ? 'bg-violet-500/10 border-violet-500/30' : 'bg-slate-800/30 border-slate-700'}`}>
                      <div className="text-lg mb-1">{step.icon}</div>
                      <div className={`text-xs ${step.active ? 'text-violet-400' : 'text-slate-500'}`}>{step.label}</div>
                    </div>
                  ))}
                </div>

                {/* Generated Preview */}
                <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-xl p-4 border border-violet-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">Executive Summary</span>
                    <span className="text-xs text-emerald-400">✓ Generated</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-700/50 rounded w-full" />
                    <div className="h-2 bg-slate-700/50 rounded w-4/5" />
                    <div className="h-2 bg-slate-700/50 rounded w-3/4" />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Time Saved', value: '40+ hrs' },
                    { label: 'Accuracy', value: '94%' },
                    { label: 'Plans Built', value: '10K+' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-3 bg-slate-800/30 rounded-lg">
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-violet-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-white text-sm font-semibold">Live AI Analysis</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-slate-800 rounded-xl p-3 shadow-xl border border-slate-700"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">JD</div>
                <div>
                  <div className="text-white text-sm font-medium">Just generated!</div>
                  <div className="text-slate-500 text-xs">2 minutes ago</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-700 flex justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
