'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, Shield, Lock, Eye, Trash2, Server, Globe } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Introduction</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                At FoundryAI, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, store, and protect your personal information when you use our AI-powered business 
                plan generator service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-violet-600" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Account Information</h3>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                    <li>Email address</li>
                    <li>Password (encrypted)</li>
                    <li>Account creation date</li>
                    <li>Last login timestamp</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Business Content</h3>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                    <li>Business ideas and descriptions you input</li>
                    <li>Generated business plans and strategies</li>
                    <li>Market research preferences</li>
                    <li>Saved projects and plans</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Usage Data</h3>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                    <li>IP address (for security)</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Feature usage statistics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-violet-600" />
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li><strong>Service Provision:</strong> To generate business plans and provide AI-powered recommendations</li>
                <li><strong>Account Management:</strong> To authenticate you and manage your subscription</li>
                <li><strong>Improvement:</strong> To enhance our AI models and user experience</li>
                <li><strong>Communication:</strong> To send important updates and respond to support requests</li>
                <li><strong>Security:</strong> To detect and prevent fraud or unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-600" />
                Data Security
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li>End-to-end encryption for all data in transit (TLS 1.3)</li>
                <li>AES-256 encryption for data at rest</li>
                <li>Secure authentication via Supabase Auth</li>
                <li>Regular security audits and penetration testing</li>
                <li>Strict access controls for our team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-violet-600" />
                AI Data Usage
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                When you use FoundryAI to generate business plans:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li>Your inputs are processed by our AI systems to generate outputs</li>
                <li>We do not use your specific business ideas to train our models</li>
                <li>Generic patterns may be used for improving AI performance</li>
                <li>All AI processing is done securely and confidentially</li>
                <li>You retain full ownership of generated content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-600" />
                Third-Party Services
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We use trusted third-party services to provide our platform:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li><strong>Supabase:</strong> For authentication and database hosting</li>
                <li><strong>Stripe:</strong> For payment processing</li>
                <li><strong>AI Providers:</strong> For generating business plan content</li>
                <li><strong>Vercel:</strong> For hosting and deployment</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-violet-600" />
                Your Rights
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                You have the following rights regarding your data:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your business plans</li>
                <li><strong>Objection:</strong> Opt-out of non-essential communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Data Retention</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We retain your data for as long as your account is active. If you delete your account:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li>Your personal information is permanently deleted within 30 days</li>
                <li>Anonymized usage statistics may be retained for analytics</li>
                <li>Legal obligations may require retention of certain records</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Cookies</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We use essential cookies for:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 ml-4">
                <li>Authentication and session management</li>
                <li>Theme preferences (light/dark mode)</li>
                <li>Security features</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                We do not use tracking cookies for advertising purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Changes to This Policy</h2>
              <p className="text-slate-600 dark:text-slate-400">
                We may update this Privacy Policy periodically. We will notify you of significant 
                changes via email or through the platform. Your continued use of FoundryAI after 
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-slate-600 dark:text-slate-400">
                If you have any questions about this Privacy Policy or your data, please contact us at{' '}
                <a href="mailto:privacy@foundryai.com" className="text-violet-600 hover:text-violet-700">
                  privacy@foundryai.com
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
