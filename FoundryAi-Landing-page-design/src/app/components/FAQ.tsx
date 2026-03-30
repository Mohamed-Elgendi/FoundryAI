import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does the AI create business plans?',
    answer: 'FoundryAI uses advanced GPT technology combined with real-time market data and industry-specific templates. Our AI analyzes your business concept, researches competitors, evaluates market opportunities, and generates comprehensive business plans tailored to your industry.',
  },
  {
    question: 'Is my business idea kept confidential?',
    answer: 'Absolutely. We take privacy seriously. All your data is encrypted end-to-end, and we never share your business ideas with third parties. Your intellectual property is completely secure and confidential.',
  },
  {
    question: 'Can I export and edit the generated plans?',
    answer: 'Yes! You can export your business plans in multiple formats including PDF, Word, and Markdown. This allows you to easily edit, customize, and share your plans with investors, partners, or team members.',
  },
  {
    question: 'What if I\'m not satisfied?',
    answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not completely satisfied with FoundryAI, simply contact our support team for a full refund, no questions asked.',
  },
  {
    question: 'Do I need business experience to use this?',
    answer: 'Not at all! FoundryAI is designed to be beginner-friendly. Our guided process walks you through each step, and the AI helps you understand complex business concepts. Whether you\'re a first-time entrepreneur or seasoned business owner, FoundryAI adapts to your level.',
  },
  {
    question: 'How accurate are the financial projections?',
    answer: 'Our AI uses industry benchmarks, market data, and proven financial models to generate realistic projections. While no projection can guarantee future results, our estimates are based on actual market data and are comparable to what professional consultants would provide.',
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
            Frequently Asked Questions
          </h2>
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
