'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/layer-1-security/auth';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function Header({ darkMode, setDarkMode }: HeaderProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">FoundryAI</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Features</a>
            <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Pricing</a>
            <a href="#faq" className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-slate-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {mounted && !isAuthenticated && (
              <Link 
                href="/login"
                className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
            {mounted && isAuthenticated ? (
              <Link 
                href="/dashboard"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/signup"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
