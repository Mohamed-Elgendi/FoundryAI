'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'striped' | 'animated';
  showValue?: boolean;
  label?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, size = 'md', variant = 'default', showValue = false, label, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4'
    };
    
    const variantClasses = {
      default: 'bg-slate-100',
      gradient: 'bg-gradient-to-r from-violet-100 to-purple-100',
      striped: 'bg-slate-100',
      animated: 'bg-slate-100'
    };
    
    const barVariantClasses = {
      default: 'bg-violet-600',
      gradient: 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500',
      striped: 'bg-violet-600 stripe-pattern',
      animated: 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 animate-shimmer'
    };

    return (
      <div className="w-full" ref={ref} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-2">
            {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
            {showValue && <span className="text-sm font-medium text-slate-600">{Math.round(percentage)}%</span>}
          </div>
        )}
        <div className={cn('w-full rounded-full overflow-hidden', sizeClasses[size], variantClasses[variant], className)}>
          <motion.div
            className={cn('h-full rounded-full transition-all duration-500 ease-out', barVariantClasses[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
