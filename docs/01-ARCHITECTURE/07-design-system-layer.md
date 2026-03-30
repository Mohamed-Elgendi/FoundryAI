# Design System Layer (Layer 7)

## Visual Language, Tokens, and Theme Engine

---

## Document Purpose

This document specifies Layer 7 of the FoundryAI architecture—the Design System Layer. It defines the visual language, design tokens, theme engine, and component styling architecture.

**Audience:** Design System Agent, Frontend Engineer Agent

**Prerequisites:**
- `01-ARCHITECTURE/00-system-overview.md`
- `01-ARCHITECTURE/03-presentation-layer.md`
- `02-DESIGN-SYSTEM/01-token-architecture.md`

---

## Layer Responsibility

The Design System Layer:
1. Defines immutable visual values (colors, typography, spacing)
2. Manages theme switching (light, dark, custom)
3. Provides semantic token abstraction
4. Ensures visual consistency across all components
5. Enables safe visual changes without breaking functionality

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Semantic Tokens** | Colors named by purpose, not value |
| **Theme Agnostic** | Same tokens work in any theme |
| **Immutable Contracts** | Token semantics never change |
| **Hierarchical Scale** | Spacing/typography use mathematical scales |
| **Accessibility First** | All combinations meet WCAG AA |

---

## Token Architecture

### Token Hierarchy

```
tokens/
├── primitive/          # Raw values
│   ├── colors.ts       # Hex/RGB values
│   ├── typography.ts   # Font specs
│   └── spacing.ts      # Base units
│
├── semantic/           # Purpose-based mapping
│   ├── colors.ts       # primary, secondary, danger
│   └── typography.ts   # heading, body, caption
│
└── component/        # Component-specific
    ├── button.ts
    ├── input.ts
    └── card.ts
```

### Primitive Tokens

```typescript
// File: src/design-system/tokens/primitive/colors.ts

export const primitiveColors = {
  // Brand colors
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Primary brand
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Semantic primitives
  success: {
    light: '#86efac',
    DEFAULT: '#22c55e',
    dark: '#15803d',
  },
  warning: {
    light: '#fde047',
    DEFAULT: '#eab308',
    dark: '#a16207',
  },
  danger: {
    light: '#fca5a5',
    DEFAULT: '#ef4444',
    dark: '#b91c1c',
  },
  info: {
    light: '#93c5fd',
    DEFAULT: '#3b82f6',
    dark: '#1d4ed8',
  },
} as const;
```

### Semantic Tokens

```typescript
// File: src/design-system/tokens/semantic/colors.ts

import { primitiveColors } from '../primitive/colors';

// Semantic colors abstract primitives by purpose
// These NEVER change their meaning, only their values
export const semanticColors = {
  // Action colors
  primary: {
    DEFAULT: primitiveColors.brand[500],
    hover: primitiveColors.brand[600],
    active: primitiveColors.brand[700],
    disabled: primitiveColors.brand[300],
    foreground: '#ffffff',
  },
  
  secondary: {
    DEFAULT: primitiveColors.gray[200],
    hover: primitiveColors.gray[300],
    active: primitiveColors.gray[400],
    disabled: primitiveColors.gray[100],
    foreground: primitiveColors.gray[900],
  },
  
  danger: {
    DEFAULT: primitiveColors.danger.DEFAULT,
    hover: primitiveColors.danger.dark,
    active: '#991b1b',
    disabled: primitiveColors.danger.light,
    foreground: '#ffffff',
  },
  
  // Background colors
  background: {
    DEFAULT: '#ffffff',
    subtle: primitiveColors.gray[50],
    muted: primitiveColors.gray[100],
  },
  
  // Foreground colors
  foreground: {
    DEFAULT: primitiveColors.gray[900],
    subtle: primitiveColors.gray[600],
    muted: primitiveColors.gray[400],
    inverted: '#ffffff',
  },
  
  // Surface colors (cards, modals)
  surface: {
    DEFAULT: '#ffffff',
    raised: '#ffffff',
    sunken: primitiveColors.gray[50],
  },
  
  // Border colors
  border: {
    DEFAULT: primitiveColors.gray[200],
    subtle: primitiveColors.gray[100],
    strong: primitiveColors.gray[300],
  },
  
  // Tier colors (membership)
  tier: {
    free: primitiveColors.gray[400],
    starter: primitiveColors.brand[400],
    pro: '#8b5cf6',      // Violet
    elite: '#f59e0b',    // Amber
    legend: '#ec4899',   // Pink
  },
  
  // Validation score colors
  validation: {
    exceptional: primitiveColors.success.dark,  // 80-100
    strong: primitiveColors.success.DEFAULT,      // 60-79
    moderate: primitiveColors.warning.DEFAULT,    // 40-59
    weak: primitiveColors.danger.light,           // 20-39
    reject: primitiveColors.danger.DEFAULT,       // 0-19
  },
} as const;
```

### Spacing Scale

```typescript
// File: src/design-system/tokens/spacing.ts

// 4px base unit (0.25rem)
// Geometric progression for visual harmony
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px (base)
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px
} as const;

// Semantic spacing
export const layoutSpacing = {
  xs: spacing[1],
  sm: spacing[2],
  md: spacing[4],
  lg: spacing[6],
  xl: spacing[8],
  '2xl': spacing[12],
  '3xl': spacing[16],
  '4xl': spacing[24],
} as const;
```

### Typography Scale

```typescript
// File: src/design-system/tokens/typography.ts

export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  // Font sizes (1.25 scale ratio)
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],    // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],   // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
    '5xl': ['3rem', { lineHeight: '1' }],          // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],       // 60px
  },
  
  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Semantic typography
  heading: {
    h1: {
      fontSize: '3.75rem',  // 60px
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',  // 36px
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem',   // 24px
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.25rem',  // 20px
      fontWeight: '600',
      lineHeight: '1.4',
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: '600',
      lineHeight: '1.5',
    },
    h6: {
      fontSize: '1rem',     // 16px
      fontWeight: '600',
      lineHeight: '1.5',
    },
  },
  
  body: {
    large: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.75',
    },
    DEFAULT: {
      fontSize: '1rem',     // 16px
      lineHeight: '1.6',
    },
    small: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.5',
    },
  },
} as const;
```

---

## Theme Engine

### Theme Definition

```typescript
// File: src/design-system/themes/types.ts

export interface Theme {
  name: string;
  isDark: boolean;
  colors: typeof semanticColors;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
  radii: typeof radii;
}

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

export const radii = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',
} as const;
```

### Light Theme

```typescript
// File: src/design-system/themes/light.ts

import { semanticColors } from '../tokens/semantic/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';
import { shadows, radii } from './types';

export const lightTheme: Theme = {
  name: 'light',
  isDark: false,
  colors: semanticColors,
  spacing,
  typography,
  shadows,
  radii,
};
```

### Dark Theme

```typescript
// File: src/design-system/themes/dark.ts

import { primitiveColors } from '../tokens/primitive/colors';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';
import { shadows, radii } from './types';

// Dark theme inverts background/foreground
// Adjusts other colors for dark mode visibility
const darkSemanticColors = {
  ...semanticColors,
  
  background: {
    DEFAULT: primitiveColors.gray[900],
    subtle: primitiveColors.gray[800],
    muted: primitiveColors.gray[700],
  },
  
  foreground: {
    DEFAULT: primitiveColors.gray[50],
    subtle: primitiveColors.gray[300],
    muted: primitiveColors.gray[500],
    inverted: primitiveColors.gray[900],
  },
  
  surface: {
    DEFAULT: primitiveColors.gray[800],
    raised: primitiveColors.gray[800],
    sunken: primitiveColors.gray[900],
  },
  
  border: {
    DEFAULT: primitiveColors.gray[700],
    subtle: primitiveColors.gray[800],
    strong: primitiveColors.gray[600],
  },
  
  // Adjust primary for dark mode
  primary: {
    DEFAULT: primitiveColors.brand[400],
    hover: primitiveColors.brand[300],
    active: primitiveColors.brand[200],
    disabled: primitiveColors.brand[700],
    foreground: primitiveColors.gray[900],
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  isDark: true,
  colors: darkSemanticColors,
  spacing,
  typography,
  shadows: {
    ...shadows,
    // Darker shadows for dark mode
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  },
  radii,
};
```

### Theme Provider

```typescript
// File: src/design-system/themes/provider.tsx

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from './themes';
import type { Theme } from './types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (name: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(lightTheme);
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    // Check saved preference or system preference
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const preference = saved || 'system';
    setThemePreference(preference);
    applyTheme(preference);
  }, []);

  useEffect(() => {
    if (themePreference === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        setThemeState(e.matches ? darkTheme : lightTheme);
      };
      
      setThemeState(mediaQuery.matches ? darkTheme : lightTheme);
      mediaQuery.addEventListener('change', handler);
      
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [themePreference]);

  const applyTheme = (name: 'light' | 'dark' | 'system') => {
    if (name === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? darkTheme : lightTheme);
    } else {
      setThemeState(name === 'dark' ? darkTheme : lightTheme);
    }
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(name === 'system' 
      ? (theme.isDark ? 'dark' : 'light')
      : name
    );
  };

  const setTheme = (name: 'light' | 'dark' | 'system') => {
    setThemePreference(name);
    localStorage.setItem('theme', name);
    applyTheme(name);
  };

  const toggleTheme = () => {
    const newTheme = theme.isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

---

## CSS Variable Integration

### Tailwind Configuration

```typescript
// File: tailwind.config.ts

import { semanticColors, spacing, typography } from './src/design-system/tokens';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map semantic tokens to Tailwind
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          foreground: 'hsl(var(--danger-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Tier colors
        'tier-free': 'hsl(var(--tier-free))',
        'tier-starter': 'hsl(var(--tier-starter))',
        'tier-pro': 'hsl(var(--tier-pro))',
        'tier-elite': 'hsl(var(--tier-elite))',
        'tier-legend': 'hsl(var(--tier-legend))',
      },
      spacing,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      boxShadow: shadows,
      borderRadius: radii,
    },
  },
};
```

### CSS Variable Definitions

```css
/* File: src/app/globals.css */

@layer base {
  :root {
    /* Light theme CSS variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 0 0% 100%;
    
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    
    --danger: 0 84.2% 60.2%;
    --danger-foreground: 0 0% 100%;
    
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 217.2 91.2% 59.8%;
    
    /* Tier colors */
    --tier-free: 220 9% 46%;
    --tier-starter: 217 91% 60%;
    --tier-pro: 263 70% 50%;
    --tier-elite: 38 92% 50%;
    --tier-legend: 330 81% 60%;
  }

  .dark {
    /* Dark theme CSS variables */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    
    --danger: 0 62.8% 30.6%;
    --danger-foreground: 210 40% 98%;
    
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    
    /* Tier colors remain similar but may adjust for dark mode */
    --tier-free: 220 9% 60%;
    --tier-starter: 217 91% 70%;
    --tier-pro: 263 70% 60%;
    --tier-elite: 38 92% 60%;
    --tier-legend: 330 81% 70%;
  }
}
```

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Design System Agent  

**Related Documents:**
- `02-DESIGN-SYSTEM/01-token-architecture.md` — Token deep dive
- `02-DESIGN-SYSTEM/02-color-system.md` — Color theory and accessibility
- `02-DESIGN-SYSTEM/03-typography-system.md` — Typography scale details
- `02-DESIGN-SYSTEM/07-theme-engine.md` — Theme switching implementation

**Change Protocol:**
1. Token semantic changes require architecture review
2. Color changes need accessibility (contrast) verification
3. Theme additions need UX review

---

**End of Design System Layer Specification. All visual design must use these tokens.**
