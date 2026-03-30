'use client';

import { motion } from 'framer-motion';
import { Shield, Headphones, Infinity } from 'lucide-react';
import Link from 'next/link';

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
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
              Ready to Build Your Business?
            </h2>
            <p className="text-xl text-violet-100">
              Join thousands of entrepreneurs who&apos;ve turned ideas into reality
            </p>
          </div>

          <div>
            <Link 
              href="/signup"
              className="inline-block px-10 py-4 rounded-full bg-white text-violet-600 text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all"
            >
              Build Your Plan Now
            </Link>
            <p className="mt-4 text-violet-100">
              Takes less than 2 minutes • No credit card required
            </p>
          </div>

          <div className="inline-block px-6 py-2 rounded-full bg-amber-500 text-white font-semibold">
            🎉 Limited time: Get 50% off Pro plan
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
            <div className="flex items-center gap-3 text-white">
              <Shield className="w-6 h-6" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Headphones className="w-6 h-6" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Infinity className="w-6 h-6" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
