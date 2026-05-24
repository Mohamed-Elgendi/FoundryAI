'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'ghost';
}

export function ThemeToggle({ className, variant = 'default' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          'w-10 h-10 rounded-lg',
          variant === 'default' ? 'bg-slate-100' : '',
          className
        )}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
        variant === 'default'
          ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun
        className={cn(
          'w-5 h-5 transition-all duration-200',
          isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        )}
      />
      <Moon
        className={cn(
          'w-5 h-5 absolute transition-all duration-200',
          !isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
        )}
      />
    </button>
  );
}
