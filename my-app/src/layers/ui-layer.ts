/**
 * LAYER 1: UI/UX SYSTEM DESIGN
 * ============================
 * Wonderful, stunning user interface and experience layer
 * Focuses on accessibility, animations, theming, and component design system
 */

// Design System Tokens
export const designTokens = {
  // Colors
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans), system-ui, sans-serif',
      mono: 'var(--font-geist-mono), monospace',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },

  // Animations
  animation: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easings: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Accessibility Helpers
export const a11y = {
  // Focus styles
  focusRing: 'ring-2 ring-primary-500 ring-offset-2 outline-none',
  
  // Screen reader only
  srOnly: 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
  
  // Skip link
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-primary',
  
  // Reduced motion
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
};

// Animation Presets
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] },
  },
  
  stagger: {
    container: {
      animate: { transition: { staggerChildren: 0.1 } },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  },
};

// Component Variants
export const componentVariants = {
  // Button variants
  button: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    variants: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    },
  },
  
  // Card variants
  card: {
    base: 'rounded-xl bg-white shadow-sm border transition-shadow duration-200',
    hover: 'hover:shadow-md',
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  
  // Input variants
  input: {
    base: 'w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed',
    states: {
      error: 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
      success: 'border-success-500 focus:border-success-500 focus:ring-success-500/20',
    },
  },
};

// Responsive Utilities
export const responsive = {
  // Hide on mobile, show on desktop
  mobileHidden: 'hidden md:block',
  
  // Show on mobile, hide on desktop  
  desktopHidden: 'md:hidden',
  
  // Container queries
  container: {
    sm: '@container (min-width: 640px)',
    md: '@container (min-width: 768px)',
    lg: '@container (min-width: 1024px)',
  },
};

// Theme Configuration
export type Theme = 'light' | 'dark' | 'system';

export const themeConfig = {
  defaultTheme: 'light' as Theme,
  storageKey: 'vibebuilder-theme',
  themes: ['light', 'dark', 'system'] as Theme[],
};

// Export all for easy access
export const ui = {
  tokens: designTokens,
  a11y,
  animations,
  variants: componentVariants,
  responsive,
  theme: themeConfig,
};
