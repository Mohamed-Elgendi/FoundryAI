# UX Interaction Layer (Layer 6)

## Interaction Patterns, Motion, and User Flows

---

## Document Purpose

This document specifies Layer 6 of the FoundryAI architecture—the UX Interaction Layer. It defines interaction patterns, motion design, accessibility requirements, and user flow orchestration.

**Audience:** UX/Interaction Agent, Frontend Engineer Agent

**Prerequisites:**
- `01-ARCHITECTURE/00-system-overview.md`
- `01-ARCHITECTURE/07-design-system-layer.md`
- `03-UX-PATTERNS/00-ux-principles.md`

---

## Layer Responsibility

The UX Interaction Layer:
1. Defines how users interact with components
2. Specifies motion and animation behavior
3. Ensures accessibility compliance (WCAG 2.1 AA)
4. Orchestrates user flow transitions
5. Provides feedback for all user actions

### UX Principles

| Principle | Implementation |
|-----------|---------------|
| **Clarity** | Every interaction has clear purpose and outcome |
| **Feedback** | Every action produces visible response |
| **Forgiveness** | Mistakes are easy to undo |
| **Consistency** | Similar actions produce similar results |
| **Efficiency** | Common tasks are fast, expert shortcuts available |
| **Delight** | Moments of joy in the experience |

---

## Interaction Patterns

### Button Interactions

```typescript
// File: src/ux/interactions/button.ts

export const buttonInteractions = {
  // Primary Button
  primary: {
    idle: {
      scale: 1,
      background: 'primary.DEFAULT',
      boxShadow: 'none',
    },
    hover: {
      scale: 1.02,
      background: 'primary.hover',
      boxShadow: 'shadow-sm',
      cursor: 'pointer',
      transition: 'all 200ms ease-out',
    },
    active: {
      scale: 0.98,
      background: 'primary.active',
      boxShadow: 'shadow-inner',
      transition: 'all 100ms ease-out',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    focus: {
      outline: '2px solid ring',
      outlineOffset: '2px',
    },
  },
  
  // Loading State
  loading: {
    cursor: 'wait',
    opacity: 0.8,
    pointerEvents: 'none',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  
  // Success State (after action)
  success: {
    animation: 'success-bounce 300ms ease-out',
    icon: 'CheckCircle',
    iconColor: 'success.DEFAULT',
  },
};

// CSS Animation Keyframes
export const buttonAnimations = `
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes success-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
`;
```

### Input Interactions

```typescript
// File: src/ux/interactions/input.ts

export const inputInteractions = {
  text: {
    idle: {
      border: '1px solid border.DEFAULT',
      background: 'background.DEFAULT',
    },
    hover: {
      border: '1px solid border.strong',
    },
    focus: {
      border: '2px solid primary.DEFAULT',
      boxShadow: '0 0 0 3px primary.DEFAULT/20',
      outline: 'none',
    },
    error: {
      border: '2px solid danger.DEFAULT',
      boxShadow: '0 0 0 3px danger.DEFAULT/20',
    },
    disabled: {
      background: 'muted.DEFAULT',
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },
  
  // Validation feedback
  validation: {
    success: {
      border: '2px solid success.DEFAULT',
      icon: 'Check',
      iconColor: 'success.DEFAULT',
    },
    error: {
      border: '2px solid danger.DEFAULT',
      icon: 'AlertCircle',
      iconColor: 'danger.DEFAULT',
      shake: true, // Shake animation for errors
    },
    validating: {
      icon: 'Loader2',
      iconAnimation: 'spin',
    },
  },
};
```

### Card Interactions

```typescript
// File: src/ux/interactions/card.ts

export const cardInteractions = {
  default: {
    idle: {
      transform: 'translateY(0)',
      boxShadow: 'shadow-sm',
    },
    hover: {
      transform: 'translateY(-4px)',
      boxShadow: 'shadow-lg',
      transition: 'all 300ms ease-out',
    },
    active: {
      transform: 'translateY(-2px)',
      boxShadow: 'shadow-md',
    },
  },
  
  // Selectable card
  selectable: {
    idle: {
      border: '2px solid transparent',
    },
    selected: {
      border: '2px solid primary.DEFAULT',
      background: 'primary.DEFAULT/5',
    },
  },
  
  // Opportunity card specific
  opportunity: {
    hover: {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: 'shadow-xl',
    },
    // Validation score indicator animation
    scoreUpdate: {
      animation: 'score-pulse 500ms ease-out',
    },
  },
};
```

### Modal/Dialog Interactions

```typescript
// File: src/ux/interactions/modal.ts

export const modalInteractions = {
  // Entry animation
  enter: {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    content: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
  },
  
  // Exit animation
  exit: {
    overlay: {
      animate: { opacity: 0 },
      transition: { duration: 0.15 },
    },
    content: {
      animate: { opacity: 0, scale: 0.95, y: 20 },
      transition: { duration: 0.2 },
    },
  },
  
  // Focus trap
  accessibility: {
    trapFocus: true,
    initialFocus: 'firstFocusable',
    returnFocus: true,
    escapeClose: true,
    overlayClose: true,
  },
};
```

---

## Motion Design

### Duration Scale

```typescript
// File: src/ux/motion/duration.ts

export const duration = {
  // Micro interactions
  instant: 0,
  fast: 100,      // Hover, focus states
  normal: 200,    // Button clicks, toggles
  
  // Standard transitions
  medium: 300,    // Card hovers, dropdowns
  slow: 400,      // Page transitions, modals
  
  // Complex animations
  deliberate: 500, // Form transitions, onboarding
  dramatic: 800,   // Celebrations, milestones
} as const;

// Use based on interaction type
export const durationGuidelines = {
  // Micro feedback (immediate response)
  feedback: duration.fast,
  
  // State changes (hover, focus)
  stateChange: duration.normal,
  
  // Content reveal (dropdowns, accordions)
  contentReveal: duration.medium,
  
  // Page/section transitions
  pageTransition: duration.slow,
  
  // Success celebrations
  celebration: duration.dramatic,
};
```

### Easing Functions

```typescript
// File: src/ux/motion/easing.ts

export const easing = {
  // Standard easings
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  
  // Custom easings for specific feels
  bouncy: [0.68, -0.55, 0.265, 1.55],      // Playful, energetic
  smooth: [0.16, 1, 0.3, 1],               // Elegant, premium
  snappy: [0.25, 0.1, 0.25, 1],            // Quick, responsive
  dramatic: [0.87, 0, 0.13, 1],            // Emphasis, celebration
} as const;

// Context-specific recommendations
export const easingGuidelines = {
  // User-initiated (buttons, clicks)
  userAction: easing.snappy,
  
  // System-initiated (notifications, reveals)
  systemAction: easing.smooth,
  
  // Success/completion states
  success: easing.bouncy,
  
  // Serious/important moments
  important: easing.dramatic,
};
```

### Animation Components

```typescript
// File: src/ux/motion/components.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { duration, easing } from './duration';

// Fade animation wrapper
export function FadeIn({ 
  children, 
  delay = 0,
  duration: dur = duration.medium 
}: { 
  children: React.ReactNode; 
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: dur / 1000, 
        delay: delay / 1000,
        ease: easing.smooth,
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for lists
export function StaggerContainer({ 
  children,
  staggerDelay = 50,
}: { 
  children: React.ReactNode;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay / 1000,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger item (use inside StaggerContainer)
export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { ease: easing.smooth },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Celebration animation for milestones
export function Celebration({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [0.8, 1.1, 1], 
        opacity: 1,
      }}
      transition={{ 
        duration: duration.dramatic / 1000,
        ease: easing.bouncy,
      }}
    >
      {children}
    </motion.div>
  );
}

// Loading skeleton shimmer
export function Shimmer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
      }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Accessibility (a11y)

### Focus Management

```typescript
// File: src/ux/accessibility/focus.ts

export const focusManagement = {
  // Visible focus indicator
  visibleFocus: {
    outline: '2px solid primary.DEFAULT',
    outlineOffset: '2px',
    borderRadius: 'radii.sm',
  },
  
  // Skip link for keyboard users
  skipLink: {
    position: 'fixed',
    top: '-100%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    padding: 'spacing.4',
    background: 'primary.DEFAULT',
    color: 'primary.foreground',
    borderRadius: 'radii.DEFAULT',
    
    // Show on focus
    ':focus': {
      top: 'spacing.4',
    },
  },
  
  // Focus trap for modals
  focusTrap: {
    enabled: true,
    initialFocus: 'first',
    returnFocus: true,
  },
  
  // Focus order
  tabIndex: {
    logical: true, // Follow visual order
    skipHidden: true, // Skip hidden/disabled elements
  },
};
```

### ARIA Patterns

```typescript
// File: src/ux/accessibility/aria.ts

export const ariaPatterns = {
  // Button
  button: {
    role: 'button',
    ariaLabel: 'descriptive-action', // e.g., "Create new opportunity"
    ariaPressed: 'for-toggle-buttons',
    ariaExpanded: 'for-dropdown-buttons',
    ariaDisabled: 'when-disabled',
  },
  
  // Modal/Dialog
  modal: {
    role: 'dialog',
    ariaModal: true,
    ariaLabelledBy: 'modal-title-id',
    ariaDescribedBy: 'modal-description-id',
  },
  
  // Form inputs
  input: {
    ariaLabel: 'if-no-visible-label',
    ariaDescribedBy: 'error-message-id',
    ariaInvalid: 'when-error',
    ariaRequired: 'when-required',
  },
  
  // Navigation
  navigation: {
    role: 'navigation',
    ariaLabel: 'Main menu',
    ariaCurrent: 'page-for-active-link',
  },
  
  // Live regions for dynamic content
  liveRegion: {
    role: 'status',       // For non-critical updates
    ariaLive: 'polite',
    ariaAtomic: true,
  },
  alert: {
    role: 'alert',        // For critical errors
    ariaLive: 'assertive',
  },
};
```

### Keyboard Navigation

```typescript
// File: src/ux/accessibility/keyboard.ts

export const keyboardNavigation = {
  // Standard shortcuts
  shortcuts: {
    // Global
    help: '?',           // Show keyboard shortcuts
    search: '/',         // Focus search
    escape: 'Escape',    // Close modals, cancel actions
    
    // Navigation
    next: 'ArrowRight',
    previous: 'ArrowLeft',
    up: 'ArrowUp',
    down: 'ArrowDown',
    
    // Actions
    confirm: 'Enter',
    confirmAlt: 'Space',
    cancel: 'Escape',
    
    // Brain Dump quick access
    brainDump: 'Mod+Shift+D', // Cmd/Ctrl+Shift+D
  },
  
  // Keyboard trap prevention
  preventTrap: {
    checkOnMount: true,
    logViolations: process.env.NODE_ENV === 'development',
  },
};
```

### Screen Reader Support

```typescript
// File: src/ux/accessibility/screen-reader.tsx

'use client';

// Visually hidden text for screen readers
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </span>
  );
}

// Live region for announcements
export function LiveRegion({ 
  message, 
  type = 'polite' 
}: { 
  message: string; 
  type?: 'polite' | 'assertive';
}) {
  return (
    <div
      role={type === 'assertive' ? 'alert' : 'status'}
      aria-live={type}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Usage: Announce to screen readers
export function useAnnouncer() {
  const [message, setMessage] = useState('');
  
  const announce = (msg: string, type: 'polite' | 'assertive' = 'polite') => {
    setMessage(msg);
    // Clear after announcement
    setTimeout(() => setMessage(''), 1000);
  };
  
  return { announce, LiveRegion: () => <LiveRegion message={message} type="polite" /> };
}
```

---

## User Flow Orchestration

### Flow Transitions

```typescript
// File: src/ux/flows/transitions.ts

export const flowTransitions = {
  // Onboarding flow
  onboarding: {
    stepTransition: {
      exit: { x: -100, opacity: 0 },
      enter: { x: 100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      transition: { duration: 0.4, ease: easing.smooth },
    },
    
    progressIndicator: {
      type: 'stepper',
      animation: 'fill',
      duration: duration.medium,
    },
  },
  
  // Opportunity selection
  opportunity: {
    cardSelect: {
      scale: [1, 1.05, 1.02],
      border: 'highlight',
      duration: duration.fast,
    },
    
    validationReveal: {
      type: 'count-up',
      duration: duration.dramatic,
      easing: easing.dramatic,
    },
  },
  
  // Build workflow
  build: {
    milestoneComplete: {
      type: 'confetti',
      duration: duration.dramatic,
      sound: 'success-chime',
    },
    
    dailyCheckin: {
      type: 'slide-in',
      direction: 'bottom',
      duration: duration.medium,
    },
  },
};
```

### State Feedback Patterns

```typescript
// File: src/ux/patterns/feedback.ts

export const feedbackPatterns = {
  // Success feedback
  success: {
    visual: {
      icon: 'CheckCircle',
      color: 'success.DEFAULT',
      animation: 'scale-bounce',
    },
    audio: {
      enabled: true,
      sound: 'success-chime',
    },
    haptic: {
      enabled: true,
      type: 'light',
    },
    duration: 3000, // How long to show
  },
  
  // Error feedback
  error: {
    visual: {
      icon: 'AlertCircle',
      color: 'danger.DEFAULT',
      animation: 'shake',
    },
    audio: {
      enabled: true,
      sound: 'error-buzz',
    },
    duration: 0, // Persist until dismissed
  },
  
  // Loading feedback
  loading: {
    visual: {
      type: 'spinner',
      text: 'Loading...',
    },
    minimumDuration: 500, // Prevent flash
  },
  
  // Progress feedback
  progress: {
    visual: {
      type: 'bar' | 'circular' | 'steps',
      showPercentage: true,
    },
    animation: 'smooth-fill',
  },
};
```

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** UX/Interaction Agent  

**Related Documents:**
- `03-UX-PATTERNS/01-interaction-patterns.md` — Pattern library
- `03-UX-PATTERNS/02-user-flows/` — Specific flow definitions
- `03-UX-PATTERNS/05-accessibility-guide.md` — a11y deep dive

**Change Protocol:**
1. New patterns need UX research justification
2. Animation changes need performance testing
3. Accessibility changes need screen reader testing

---

**End of UX Interaction Layer Specification. All user interactions must follow these patterns.**
