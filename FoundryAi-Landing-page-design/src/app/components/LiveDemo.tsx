import { motion } from 'motion/react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function LiveDemo() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 2000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            See FoundryAI in Action
          </h2>
          <p className="text-xl text-slate-300">
            Try it yourself - enter any business idea
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Describe your business idea
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="A sustainable coffee subscription service that sources beans directly from organic farms..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
                rows={4}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!input || loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate Preview'
              )}
            </button>

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Business Plan Preview
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                      Ready
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-2 bg-violet-600 rounded w-3/4" />
                    <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-full" />
                    <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-5/6" />
                    <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-full" />
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    ✓ Executive Summary • ✓ Market Analysis • ✓ Financial Projections
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
