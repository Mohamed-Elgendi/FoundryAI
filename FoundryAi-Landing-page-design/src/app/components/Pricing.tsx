import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useState } from 'react';

const pricingPlans = [
  {
    name: 'Free',
    subtitle: 'Get Started',
    price: '$0',
    period: '/month',
    features: [
      '5 business plans per month',
      'Basic market research',
      'JSON exports',
      'Community support',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    subtitle: 'Most Popular',
    price: '$29',
    period: '/month',
    features: [
      '50 business plans per month',
      'Advanced market research',
      'PDF & Markdown exports',
      'Priority email support',
      'Financial projections',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    subtitle: 'For Teams',
    price: '$99',
    period: '/month',
    features: [
      'Unlimited plans',
      'Custom AI training',
      'API access',
      'Priority phone support',
      'Team collaboration',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Start free, upgrade when you're ready to scale
          </p>

          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`${!annual ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-8 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${annual ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`${annual ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
              Annual
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
              Save 20%
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white dark:bg-slate-800 rounded-2xl p-8 ${
                plan.highlighted
                  ? 'ring-2 ring-violet-600 shadow-2xl scale-105'
                  : 'border border-slate-200 dark:border-slate-700'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold">
                    {plan.subtitle}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                {!plan.highlighted && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {plan.subtitle}
                  </p>
                )}
              </div>

              <div className="text-center mb-8">
                <span className="text-5xl font-bold text-slate-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-full font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105'
                    : 'border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:border-violet-600 dark:hover:border-violet-500'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-slate-600 dark:text-slate-400"
        >
          No credit card required for trial
        </motion.div>
      </div>
    </section>
  );
}
