import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'I have $0, no skills, and no experience. Can I really do this?',
    answer: 'Absolutely. FoundryAI was specifically engineered for individuals starting from absolute zero. Our Core Foundation Layer builds your psychology, focus, and momentum before you touch business tactics. The AI Build Assistant handles technical complexity for you. Many of our most successful members started exactly where you are — with nothing but the willingness to transform.',
  },
  {
    question: 'How is this different from courses, coaches, or other platforms?',
    answer: 'We don\'t teach — we forge. Traditional education gives you information and leaves you to figure out execution. FoundryAI is a complete transformation operating system: the 8-system Core Foundation Layer runs continuously, the Opportunity Radar finds validated gaps (not theory), and the AI Build Assistant guides you step-by-step to real revenue. Every session produces tangible progress, not just knowledge.',
  },
  {
    question: 'Which business archetype should I start with?',
    answer: 'It depends on your starting position. $0, no skills, limited time? → Faceless YouTube or Digital Products. Some technical skills? → SaaS or API Services. Marketing background? → AI Agency or Online Brand. The Opportunity Radar will analyze your specific situation and recommend the optimal archetype based on market demand and your profile.',
  },
  {
    question: 'How quickly can I make my first dollar?',
    answer: 'Our systematic 14-Day Launch Protocol is designed to get you to first revenue fast. Digital Products and AI Agencies often see first sales within 7-14 days. SaaS products typically take 14-30 days to launch and get beta users. The key is following the execution framework — not getting stuck in analysis paralysis.',
  },
  {
    question: 'What if I don\'t know what business to start?',
    answer: 'Perfect. The Opportunity Radar continuously scans 12 proven business archetypes to find validated opportunities with real market demand. You don\'t need to come up with ideas — you just need to pick from AI-validated opportunities that match your profile. Plus, the Idea Extraction Engine can transform vague concepts into concrete, validated business models.',
  },
  {
    question: 'Is this really free to start? What\'s the catch?',
    answer: 'No catch. We believe in zero-cost entry — start with absolutely nothing and only invest once you\'re generating revenue. The free tier includes the Core Foundation Layer, Opportunity Radar scans, and basic AI assistance. When you start earning, our tier-based recommendations ensure you reinvest at optimal ROI. We win when you win.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Your Questions, Answered
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about starting your transformation from $0 to masterful entrepreneur.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-semibold text-lg text-slate-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
