'use client';

import { useTheme } from '@/lib/theme/theme-context';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'ghost';
}

export function ThemeToggle({ className, variant = 'default' }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch - render placeholder until mounted
  if (!mounted) {
    return (
      <div className={cn(
        'w-10 h-10 rounded-lg',
        variant === 'default' ? 'bg-slate-100' : '',
        className
      )} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
        variant === 'default' 
          ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700' 
          : 'hover:bg-slate-100 dark:hover:bg-slate-800',
        className
      )}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <Sun className={cn(
        'w-5 h-5 transition-all duration-200',
        theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
      )} />
      <Moon className={cn(
        'w-5 h-5 absolute transition-all duration-200',
        theme === 'light' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
      )} />
    </button>
  );
}
