'use client';

import Link from 'next/link';
import { Crown, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">FoundryAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign Up
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Terms & Conditions
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                By accessing or using FoundryAI, you agree to be bound by these Terms & Conditions. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">2. Description of Service</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                FoundryAI is an AI-powered business plan generator that helps users create actionable 
                business strategies, market research, tech stack recommendations, and monetization plans. 
                The service is provided &quot;as is&quot; and we make no warranties about the accuracy or 
                completeness of the generated content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">3. User Accounts</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                To use certain features of FoundryAI, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and complete information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">4. Acceptable Use</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You agree not to use FoundryAI for any unlawful purpose or to:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li>Generate content that is illegal, harmful, or infringing</li>
                <li>Attempt to reverse engineer or copy our AI systems</li>
                <li>Use automated means to access the service without permission</li>
                <li>Interfere with other users&apos; access to the service</li>
                <li>Upload malicious code or viruses</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">5. Intellectual Property</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You retain ownership of the business ideas and content you input into FoundryAI. 
                The generated output is yours to use commercially. However, FoundryAI retains all 
                rights to our platform, AI models, and proprietary technology.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">6. Subscription & Payments</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Some features of FoundryAI require a paid subscription. By subscribing:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li>You agree to pay all applicable fees</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>You can cancel at any time from your account settings</li>
                <li>Refunds are handled on a case-by-case basis</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                FoundryAI shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the service. The AI-generated content 
                should be reviewed by professionals before making business decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">8. Modifications to Terms</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of 
                significant changes via email or through the platform. Continued use after changes 
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">9. Contact Information</h2>
              <p className="text-slate-600 dark:text-slate-400">
                If you have any questions about these Terms & Conditions, please contact us at{' '}
                <a href="mailto:support@foundryai.com" className="text-violet-600 hover:text-violet-700">
                  support@foundryai.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} FoundryAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
