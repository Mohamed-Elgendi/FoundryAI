// ============================================
// FoundryAI Design Tokens
// Layer 7 - Design System Foundation
// ============================================

// Color Tokens - Semantic Layer
export const colors = {
  // Primary palette
  primary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7", // Core brand purple
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
  },

  // Secondary palette (Blues)
  secondary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Core blue
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Accent palette (Gradients)
  accent: {
    cyan: "#06b6d4",
    purple: "#a855f7",
    pink: "#ec4899",
    gradient: "linear-gradient(135deg, #06b6d4, #a855f7, #ec4899)",
    gradientHover: "linear-gradient(135deg, #0891b2, #9333ea, #db2777)",
  },

  // Success / Warning / Danger
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },

  // Neutrals
  neutral: {
    0: "#ffffff",
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    1000: "#020617",
  },

  // Semantic tokens
  foreground: "#0f172a",
  "foreground-muted": "#64748b",
  "foreground-inverse": "#ffffff",
  background: "#ffffff",
  "background-subtle": "#f8fafc",
  "background-inverse": "#0f172a",
  border: "#e2e8f0",
  "border-strong": "#cbd5e1",
  input: "#e2e8f0",
  ring: "#a855f7",

  // Dark mode overrides
  dark: {
    foreground: "#f1f5f9",
    "foreground-muted": "#94a3b8",
    "foreground-inverse": "#0f172a",
    background: "#020617",
    "background-subtle": "#0f172a",
    "background-inverse": "#f8fafc",
    border: "#1e293b",
    "border-strong": "#334155",
    input: "#1e293b",
    card: {
      DEFAULT: "#0f172a",
      foreground: "#f1f5f9",
    },
    popover: {
      DEFAULT: "#0f172a",
      foreground: "#f1f5f9",
    },
    secondary: {
      DEFAULT: "#1e293b",
      foreground: "#f1f5f9",
    },
    muted: {
      DEFAULT: "#1e293b",
      foreground: "#94a3b8",
    },
    accent: {
      DEFAULT: "#1e293b",
      foreground: "#f1f5f9",
    },
    destructive: {
      DEFAULT: "#7f1d1d",
      foreground: "#f1f5f9",
    },
  },
} as const;

// Typography Tokens
export const typography = {
  fonts: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    display: "'Inter', system-ui, -apple-system, sans-serif",
  },
  sizes: {
    xs: "0.75rem",       // 12px
    sm: "0.875rem",      // 14px
    base: "1rem",        // 16px
    lg: "1.125rem",      // 18px
    xl: "1.25rem",       // 20px
    "2xl": "1.5rem",     // 24px
    "3xl": "1.875rem",   // 30px
    "4xl": "2.25rem",    // 36px
    "5xl": "3rem",       // 48px
    "6xl": "3.75rem",    // 60px
    "7xl": "4.5rem",     // 72px
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  leading: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
  tracking: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// Spacing Tokens (4px base unit)
export const spacing = {
  0: "0px",
  1: "0.25rem",    // 4px
  2: "0.5rem",     // 8px
  3: "0.75rem",    // 12px
  4: "1rem",       // 16px
  5: "1.25rem",    // 20px
  6: "1.5rem",     // 24px
  8: "2rem",       // 32px
  10: "2.5rem",    // 40px
  12: "3rem",      // 48px
  16: "4rem",      // 64px
  20: "5rem",      // 80px
  24: "6rem",      // 96px
  32: "8rem",      // 128px
} as const;

// Border Radius Tokens
export const radius = {
  none: "0px",
  sm: "0.25rem",    // 4px
  md: "0.375rem",   // 6px
  base: "0.5rem",   // 8px
  lg: "0.75rem",    // 12px
  xl: "1rem",       // 16px
  "2xl": "1.5rem",  // 24px
  full: "9999px",
} as const;

// Shadow Tokens
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  // Glow shadows for AI/interactive elements
  glow: "0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.15)",
  "glow-sm": "0 0 10px rgba(168, 85, 247, 0.2)",
  "glow-lg": "0 0 30px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)",
} as const;

// Animation Tokens
export const animation = {
  durations: {
    instant: "0ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
    slowest: "700ms",
  },
  easings: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

// Z-Index Tokens
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Tier Colors (Used across platform for tier identification)
export const tierColors = {
  1: { // Foundation
    primary: "#22c55e",
    secondary: "#16a34a",
    light: "#f0fdf4",
    name: "Foundation",
  },
  2: { // Opportunity
    primary: "#06b6d4",
    secondary: "#0891b2",
    light: "#ecfeff",
    name: "Opportunity",
  },
  3: { // Launch
    primary: "#3b82f6",
    secondary: "#2563eb",
    light: "#eff6ff",
    name: "Launch",
  },
  4: { // Discovery
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    light: "#f5f3ff",
    name: "Discovery",
  },
  5: { // Education
    primary: "#ec4899",
    secondary: "#db2777",
    light: "#fdf2f8",
    name: "Education",
  },
  6: { // Monetization
    primary: "#f59e0b",
    secondary: "#d97706",
    light: "#fffbeb",
    name: "Monetization",
  },
} as const;

// Archetype Colors
export const archetypeColors = {
  aiAgency: { primary: "#6366f1", light: "#eef2ff", name: "AI Agency" },
  facelessYouTube: { primary: "#ef4444", light: "#fef2f2", name: "Faceless YouTube" },
  seoAffiliate: { primary: "#22c55e", light: "#f0fdf4", name: "SEO Affiliate" },
  saas: { primary: "#3b82f6", light: "#eff6ff", name: "SaaS" },
  digitalProducts: { primary: "#ec4899", light: "#fdf2f8", name: "Digital Products" },
  paaS: { primary: "#8b5cf6", light: "#f5f3ff", name: "PaaS" },
  microSaaS: { primary: "#06b6d4", light: "#ecfeff", name: "Micro SaaS" },
} as const;

// Momentum Dimension Colors
export const momentumColors = {
  financial: { primary: "#22c55e", light: "#f0fdf4", name: "Financial" },
  social: { primary: "#ec4899", light: "#fdf2f8", name: "Social" },
  physical: { primary: "#ef4444", light: "#fef2f2", name: "Physical" },
  mental: { primary: "#8b5cf6", light: "#f5f3ff", name: "Mental" },
  educational: { primary: "#3b82f6", light: "#eff6ff", name: "Educational" },
  professional: { primary: "#06b6d4", light: "#ecfeff", name: "Professional" },
  spiritual: { primary: "#f59e0b", light: "#fffbeb", name: "Spiritual" },
} as const;

// Export all tokens
export const designTokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  animation,
  zIndex,
  breakpoints,
  tierColors,
  archetypeColors,
  momentumColors,
} as const;

export type DesignTokens = typeof designTokens;
