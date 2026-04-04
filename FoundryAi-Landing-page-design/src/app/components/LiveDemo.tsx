import { motion } from 'motion/react';
import { useState } from 'react';
import { Loader2, CheckCircle, TrendingUp, Target, Users, DollarSign, Lightbulb, Shield, Rocket } from 'lucide-react';

interface AnalysisResult {
  archetype: string;
  confidence: number;
  marketSize: string;
  competition: string;
  revenuePotential: string;
  keyInsights: string[];
  nextSteps: string[];
  risks: string[];
}

export function LiveDemo() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeIdea = (text: string): AnalysisResult => {
    const lowerText = text.toLowerCase();
    
    // Determine archetype based on keywords
    let archetype = 'Digital Creator';
    if (lowerText.includes('subscription') || lowerText.includes('monthly')) {
      archetype = 'Membership Curator';
    } else if (lowerText.includes('app') || lowerText.includes('software') || lowerText.includes('platform')) {
      archetype = 'SaaS Founder';
    } else if (lowerText.includes('service') || lowerText.includes('consulting') || lowerText.includes('agency')) {
      archetype = 'Service Provider';
    } else if (lowerText.includes('product') || lowerText.includes('physical') || lowerText.includes('manufactur')) {
      archetype = 'Product Maker';
    } else if (lowerText.includes('content') || lowerText.includes('youtube') || lowerText.includes('blog')) {
      archetype = 'Content Creator';
    } else if (lowerText.includes('course') || lowerText.includes('teach') || lowerText.includes('education')) {
      archetype = 'Educator';
    } else if (lowerText.includes('marketplace') || lowerText.includes('connect') || lowerText.includes('platform')) {
      archetype = 'Marketplace Builder';
    } else if (lowerText.includes('freelance') || lowerText.includes('contract')) {
      archetype = 'Freelancer';
    }

    // Generate insights based on input
    const insights: string[] = [];
    const nextSteps: string[] = [];
    const risks: string[] = [];

    // Analyze for specific elements
    if (lowerText.includes('sustainable') || lowerText.includes('eco') || lowerText.includes('green')) {
      insights.push('Strong ESG positioning attracts conscious consumers and investors');
      insights.push('Sustainability premium allows 15-25% higher pricing');
      nextSteps.push('Get sustainability certifications (B-Corp, Fair Trade)');
    }

    if (lowerText.includes('ai') || lowerText.includes('machine learning') || lowerText.includes('automation')) {
      insights.push('AI component provides significant competitive moat');
      insights.push('High scalability potential with low marginal costs');
      nextSteps.push('Build proprietary dataset for AI training');
      risks.push('Rapid AI advancement may require continuous R&D investment');
    }

    if (lowerText.includes('direct') || lowerText.includes('farm') || lowerText.includes('source')) {
      insights.push('Direct sourcing eliminates middlemen, improving margins by 30-40%');
      insights.push('Authentic supply chain story creates strong brand differentiation');
      nextSteps.push('Document supply chain with video content for marketing');
    }

    if (lowerText.includes('local') || lowerText.includes('community')) {
      insights.push('Community-focused model builds loyal customer base');
      insights.push('Lower customer acquisition costs through word-of-mouth');
      nextSteps.push('Host community events to strengthen local presence');
    }

    if (lowerText.includes('mobile') || lowerText.includes('app')) {
      insights.push('Mobile-first approach captures on-the-go consumers');
      insights.push('Push notifications enable re-engagement at 3x rate of email');
      nextSteps.push('Develop MVP app for iOS and Android simultaneously');
    }

    // Default insights if none matched
    if (insights.length === 0) {
      insights.push('Unique value proposition identified with clear market differentiation');
      insights.push('Early mover advantage possible in emerging segment');
      insights.push('Strong founder-market fit based on described expertise');
    }

    if (nextSteps.length === 0) {
      nextSteps.push('Validate demand with 20 customer interviews');
      nextSteps.push('Build landing page to capture early interest');
      nextSteps.push('Create financial model with 3 revenue scenarios');
    }

    if (risks.length === 0) {
      risks.push('Market saturation - need clear differentiation');
      risks.push('Customer acquisition cost may exceed early projections');
    }

    // Calculate metrics
    const confidence = Math.min(95, 60 + Math.floor(input.length / 10));
    const marketSize = confidence > 80 ? '$2.5B - $5B' : confidence > 70 ? '$500M - $2B' : '$100M - $500M';
    const competition = confidence > 75 ? 'Moderate' : 'High';
    const revenuePotential = confidence > 85 ? '$50K - $500K MRR potential' : '$10K - $100K MRR potential';

    return {
      archetype,
      confidence,
      marketSize,
      competition,
      revenuePotential,
      keyInsights: insights.slice(0, 3),
      nextSteps: nextSteps.slice(0, 3),
      risks: risks.slice(0, 2),
    };
  };

  const handleGenerate = () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      const analysis = analyzeIdea(input);
      setResult(analysis);
      setLoading(false);
    }, 2000);
  };

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
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
            Try it yourself - enter any business idea and get instant AI analysis
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
                placeholder="A sustainable coffee subscription service that sources beans directly from organic farms and delivers to eco-conscious urban professionals..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
                rows={4}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!input.trim() || loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing your idea...
                </>
              ) : (
                'Generate AI Analysis'
              )}
            </button>

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-6"
              >
                {/* Archetype Badge */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-800 rounded-lg">
                      <Target className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Recommended Archetype</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{result.archetype}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">AI Confidence</p>
                    <p className="text-2xl font-bold text-emerald-600">{result.confidence}%</p>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Market Size</p>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{result.marketSize}</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-amber-600" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Competition</p>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{result.competition}</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Revenue Potential</p>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{result.revenuePotential}</p>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Key Insights</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.keyInsights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Recommended Next Steps</h3>
                  </div>
                  <ol className="space-y-2">
                    {result.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Risks */}
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Potential Risks to Address</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.risks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button className="flex-1 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all">
                    Get Full Business Plan
                  </button>
                  <button 
                    onClick={() => { setInput(''); setResult(null); }}
                    className="flex-1 py-3 rounded-full border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:border-violet-600 transition-all"
                  >
                    Try Another Idea
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
