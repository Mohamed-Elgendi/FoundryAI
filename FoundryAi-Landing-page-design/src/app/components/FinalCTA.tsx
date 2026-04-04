import { motion } from 'motion/react';
import { Shield, Headphones, Infinity } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-indigo-600">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-xl text-violet-100 mb-4">
              Every day you wait is a day your future self loses.
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
              Start With $0. Build to 7 Figures.
            </h2>
            <p className="text-xl text-violet-100">
              Join the transformation. 10,000+ entrepreneurs forged. $50M+ revenue generated. 
              Your journey from $0 to masterful entrepreneur starts now.
            </p>
          </div>

          <div>
            <a 
              href="/auth/signup"
              className="px-10 py-4 rounded-full bg-white text-violet-600 text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all inline-block"
            >
              Forge Your Future — Start Free
            </a>
            <p className="mt-4 text-violet-100">
              No credit card • No prior skills needed • First revenue in 14 days
            </p>
          </div>

          <div className="inline-block px-6 py-2 rounded-full bg-amber-500 text-white font-semibold">
            🔥 Limited: 50% off Pro plan for founding members
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
            <div className="flex items-center gap-3 text-white">
              <Shield className="w-6 h-6" />
              <span>Zero-Risk Start</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Headphones className="w-6 h-6" />
              <span>24/7 AI Support</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Infinity className="w-6 h-6" />
              <span>Free Forever Tier</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
