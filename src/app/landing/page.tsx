'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fadeInUp, staggerContainer, float } from '@/lib/animations';
import { 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  ArrowRight, 
  Rocket,
  CheckCircle2,
  Users,
  Brain,
  Clock
} from 'lucide-react';
import Link from 'next/link';

// Animated gradient background
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent animate-pulse rounded-full blur-3xl" />
      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/20 via-cyan-600/10 to-transparent animate-pulse rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
    </div>
  );
}

// Floating elements
function FloatingElement({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

// Feature card component
function FeatureCard({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)' }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </motion.div>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <AnimatedBackground />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-white/10 text-white border-white/20 mb-6 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              The Universal Money Making Machine
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
              15-Hour Habit
            </span>
            Into a Business
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto"
          >
            From $0 to 7 Figures: The AI-Powered Platform That Transforms 
            Doom-Scrollers Into Masterful Online Entrepreneurs
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link href="/onboarding">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-violet-500/25">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link href="/radar">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                  Explore Opportunities
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            <FloatingElement delay={0}>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">14</div>
                <div className="text-slate-400 text-sm">Days to Launch</div>
              </div>
            </FloatingElement>
            <FloatingElement delay={0.5}>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-slate-400 text-sm">AI Opportunities</div>
              </div>
            </FloatingElement>
            <FloatingElement delay={1}>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">$0</div>
                <div className="text-slate-400 text-sm">Start Free</div>
              </div>
            </FloatingElement>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-violet-100 text-violet-700 mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to
              <span className="text-violet-400"> Succeed</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A complete ecosystem designed to take you from zero to launching your own business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Planning"
              description="Get detailed business plans generated by AI, tailored to your specific goals and resources"
              delay={0}
            />
            <FeatureCard
              icon={Target}
              title="Opportunity Radar"
              description="Discover 50+ AI-validated business opportunities ranked by feasibility and profit potential"
              delay={0.1}
            />
            <FeatureCard
              icon={Rocket}
              title="14-Day Launch Protocol"
              description="Follow our proven step-by-step system to go from idea to launched product in just 14 days"
              delay={0.2}
            />
            <FeatureCard
              icon={Clock}
              title="Brain Dump System"
              description="Capture every idea and task with our intelligent brain dump system that keeps you organized"
              delay={0.3}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Revenue Tracking"
              description="Track your earnings and unlock new tiers as you grow from $0 to 7 figures"
              delay={0.4}
            />
            <FeatureCard
              icon={Users}
              title="Community & Support"
              description="Join a community of builders and get AI-powered assistance every step of the way"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-violet-100 text-violet-700 mb-4">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Journey to
              <span className="text-violet-400"> Success</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Discover', desc: 'Take our self-discovery quiz to find your perfect business archetype and opportunity' },
              { step: '02', title: 'Plan', desc: 'Get a comprehensive AI-generated business plan tailored to your goals' },
              { step: '03', title: 'Launch', desc: 'Follow our 14-day protocol to build and launch your product' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0, y: index === 1 ? 50 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-2xl p-8 border border-violet-500/20 text-center">
                  <div className="text-6xl font-bold text-violet-500/30 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-violet-500 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-pink-600/10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Build Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
              {' '}Future?
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have transformed their lives with FoundryAI. 
            Your journey starts now.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link href="/onboarding">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-7 text-xl rounded-xl shadow-2xl">
                Get Started Free
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-xl">FoundryAI</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 FoundryAI. Transforming lives through entrepreneurship.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors text-sm">Privacy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-white transition-colors text-sm">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
