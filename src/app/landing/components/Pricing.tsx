'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Free',
    subtitle: 'Get Started',
    price: { monthly: '$0', annual: '$0' },
    period: 'forever',
    description: 'Perfect for exploring and trying out the platform',
    features: [
      '5 business plans per month',
      'Basic market research',
      'JSON exports',
      'Community support',
      'Standard templates',
    ],
    cta: 'Start Free',
    highlighted: false,
    color: 'from-slate-600 to-slate-500',
  },
  {
    name: 'Pro',
    subtitle: 'Most Popular',
    price: { monthly: '$29', annual: '$23' },
    period: '/month',
    description: 'For serious entrepreneurs ready to launch',
    features: [
      '50 business plans per month',
      'Advanced market research',
      'PDF & Word exports',
      'Priority email support',
      'Financial projections',
      'Competitor analysis',
      'Custom branding',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
    color: 'from-violet-600 to-indigo-600',
  },
  {
    name: 'Enterprise',
    subtitle: 'For Teams',
    price: { monthly: '$99', annual: '$79' },
    period: '/month',
    description: 'For teams and agencies with multiple clients',
    features: [
      'Unlimited plans',
      'Custom AI training',
      'API access',
      'Priority phone support',
      'Team collaboration',
      'White-label options',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    color: 'from-amber-500 to-orange-500',
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-violet-500/5 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Simple Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Start Free, Scale{' '}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              When Ready
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            No hidden fees. No surprises. Choose the plan that works for you.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-7 rounded-full bg-slate-800 border border-slate-700 transition-colors"
            >
              <motion.div
                animate={{ x: annual ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-slate-500'}`}>
              Annual
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              Save 20%
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${plan.highlighted ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted 
                  ? 'border-violet-500/50 shadow-2xl shadow-violet-500/10' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}>
                {/* Plan Header */}
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${plan.color} bg-opacity-10 text-sm font-medium mb-4`}>
                    <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{plan.subtitle}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">
                      {annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-slate-500">{plan.period}</span>
                  </div>
                  {plan.highlighted && annual && (
                    <p className="text-emerald-400 text-sm mt-1">Save $72/year</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/signup"
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-slate-500">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
