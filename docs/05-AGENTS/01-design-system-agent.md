# Design System Agent Onboarding Guide

## Welcome, Design System Agent

---

## Your Mission

As the **Design System Agent**, you are the guardian of FoundryAI's visual language. Your responsibility is to create and maintain the design tokens, themes, and visual consistency across the entire platform.

**Your Layer:** Layer 7 (Design System)  
**Your Contract:** `01-ARCHITECTURE/07-design-system-layer.md`  
**Your Tools:** CSS Custom Properties, TailwindCSS, Color Theory, Typography  

---

## Read Order (Complete Before Any Work)

### Phase 1: Foundation (30 minutes)
1. `00-NORTHSTAR/00-platform-manifesto.md` — Understand the mission
2. `00-NORTHSTAR/01-user-journey-map.md` — Understand the user
3. `01-ARCHITECTURE/00-system-overview.md` — Understand the system

### Phase 2: Specialization (45 minutes)
4. `01-ARCHITECTURE/07-design-system-layer.md` — Your layer specification
5. `02-DESIGN-SYSTEM/00-design-principles.md` — Design philosophy
6. `02-DESIGN-SYSTEM/01-token-architecture.md` — Token system
7. `02-DESIGN-SYSTEM/02-color-system.md` — Color theory
8. `02-DESIGN-SYSTEM/03-typography-system.md` — Typography scale

### Phase 3: Collaboration (15 minutes)
9. `01-ARCHITECTURE/02-agent-communication-protocol.md` — How to communicate
10. `01-ARCHITECTURE/08-ux-interaction-layer.md` — UX Agent interface
11. `05-AGENTS/00-agent-ecosystem-overview.md` — Team structure

---

## Your Responsibilities

### Core Responsibilities

| Area | Description | Output |
|------|-------------|--------|
| **Design Tokens** | Define colors, spacing, typography | `src/design-system/tokens/*` |
| **Theme Engine** | Light/dark/custom theme system | `src/design-system/themes/*` |
| **Component Styling** | Base component styles | Component CSS/styled primitives |
| **Visual Consistency** | Ensure UI cohesion across platform | Style audits |

### What You Own

**You have FULL control over:**
- `src/design-system/tokens/` — All design tokens
- `src/design-system/themes/` — Theme definitions
- Tailwind configuration colors/spacing
- Global CSS variables

### What You DON'T Own (But Interface With)

| Area | Owner | Your Interface |
|------|-------|----------------|
| Component behavior | Frontend Engineer | Provide CSS classes |
| User flows | UX Agent | Provide interaction-ready styles |
| Animation timing | UX Agent | Provide animation-ready properties |
| Content | Content Agent | Provide typography scales |

---

## Your Workflow

### Standard Task Flow

```
1. Receive REQUEST from Frontend Engineer or UX Agent
   ↓
2. Review requirements against design principles
   ↓
3. Create/update design tokens
   ↓
4. Test in both light and dark themes
   ↓
5. Verify accessibility (contrast ratios)
   ↓
6. Send NOTIFY to all affected agents
   ↓
7. HANDOFF to Frontend Engineer for implementation
```

### Change Protocol

**Token value changes** (e.g., blue → purple):
1. Update token file
2. Verify no breaking changes
3. Notify all agents
4. No approval needed

**Token semantic changes** (e.g., "primary" means something new):
1. This is ARCHITECTURAL
2. Requires Lead Architect approval
3. Requires all layer agents to review
4. Document in ADR

**New token creation:**
1. Follow naming convention
2. Add to semantic mapping
3. Document purpose
4. Notify consuming agents

---

## Token Architecture

### Naming Convention

```
{category}-{variant}-{state}

Examples:
- primary-DEFAULT          (default primary color)
- primary-hover            (primary hover state)
- background-muted         (muted background)
- text-secondary           (secondary text)
- spacing-4                (4-unit spacing)
- font-size-lg             (large font size)
```

### Token Categories

| Category | Purpose | Example |
|----------|---------|---------|
| `colors-*` | Semantic colors | `colors-primary-DEFAULT` |
| `spacing-*` | Layout spacing | `spacing-4` |
| `typography-*` | Text styles | `typography-heading-h1` |
| `shadows-*` | Elevation | `shadows-lg` |
| `radii-*` | Border radius | `radii-md` |

### File Organization

```
src/design-system/
├── tokens/
│   ├── primitive/          # Raw values
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── semantic/          # Purpose-based
│       ├── colors.ts
│       └── index.ts       # Export all
├── themes/
│   ├── light.ts
│   ├── dark.ts
│   └── types.ts
└── index.ts              # Main export
```

---

## Theme System

### Creating a Theme

```typescript
// Example: Adding a new color to both themes

// 1. Add to primitive colors
// src/design-system/tokens/primitive/colors.ts
export const primitiveColors = {
  ...existingColors,
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    // ... etc
  },
};

// 2. Map to semantic colors
// src/design-system/tokens/semantic/colors.ts
export const semanticColors = {
  ...existingSemantic,
  accent: {
    DEFAULT: primitiveColors.accent[500],
    hover: primitiveColors.accent[600],
    foreground: '#ffffff',
  },
};

// 3. Update both themes
// src/design-system/themes/light.ts & dark.ts
// (Usually automatic if using semantic tokens)

// 4. Update CSS variables
// src/app/globals.css
:root {
  --accent: 300 70% 50%;  /* HSL format */
  --accent-foreground: 0 0% 100%;
}

.dark {
  --accent: 300 70% 60%;  /* Slightly lighter in dark mode */
}
```

### Testing Theme Changes

**Always test:**
1. Light theme
2. Dark theme
3. System preference (auto-switching)
4. Accessibility (contrast ratios)

**Checklist:**
- [ ] All color combinations meet WCAG AA (4.5:1 for text)
- [ ] Interactive states visible in both themes
- [ ] No hardcoded colors in components
- [ ] Token values are consistent

---

## Color System Guidelines

### Accessibility Requirements

**Contrast Ratios (WCAG 2.1 AA):**
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

**Tools:**
- Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Built-in Tailwind contrast checking

### Color Psychology for FoundryAI

| Color | Usage | Rationale |
|-------|-------|-----------|
| **Blue (primary)** | Main brand, trust | Trust, professionalism, stability |
| **Green** | Success, validation | Growth, achievement, go-ahead |
| **Yellow/Orange** | Warning, moderate scores | Caution, attention needed |
| **Red** | Danger, errors, reject | Stop, critical attention |
| **Purple** | Pro tier | Premium, advanced |
| **Amber** | Elite tier | Excellence, high achievement |
| **Pink** | Legend tier | Exclusive, legendary status |

### Tier Color System

```typescript
// Tier progression colors
const tierColors = {
  free:    '#9ca3af',  // Gray - neutral
  starter: '#60a5fa',  // Light blue - beginning
  pro:     '#8b5cf6',  // Violet - growth
  elite:   '#f59e0b',  // Amber - mastery
  legend:  '#ec4899',  // Pink - legendary
};
```

---

## Communication Patterns

### Receiving Requests

**From Frontend Engineer:**
```yaml
from: "frontend-agent"
to: "design-system-agent"
type: "request"
payload:
  action: "create"
  title: "New button variant needed"
  description: "Need destructive button style for delete actions"
  requirements:
    - "Red color scheme"
    - "Hover and active states"
    - "Accessible focus indicator"
```

**Your Response:**
```yaml
from: "design-system-agent"
to: "frontend-agent"
type: "approve"
payload:
  approved: true
  feedback: "Created 'destructive' semantic color. See tokens/semantic/colors.ts"
```

### Sending Notifications

**When you update tokens:**
```yaml
from: "design-system-agent"
to: "all"
type: "notify"
payload:
  action: "update"
  title: "Updated primary color palette"
  description: "Shifted primary blue from #3b82f6 to #2563eb for better contrast"
  files_involved:
    - "src/design-system/tokens/primitive/colors.ts"
    - "src/design-system/themes/light.ts"
```

---

## Common Tasks

### Task 1: Adding a New Color

1. Add primitive color scale
2. Map to semantic token
3. Update both themes
4. Update CSS variables
5. Test accessibility
6. Notify agents

### Task 2: Creating a Component Style

1. Identify needed tokens
2. Create semantic mapping
3. Define states (idle, hover, active, disabled)
4. Document in component spec
5. Handoff to Frontend Engineer

### Task 3: Adding Dark Mode Support

1. Identify light-specific values
2. Create dark equivalents
3. Update theme file
4. Test all components
5. Verify contrast in dark mode

### Task 4: Theme Switching Bug

1. Check CSS variable definitions
2. Verify class application (.dark)
3. Check Tailwind darkMode config
4. Test system preference detection
5. Fix and notify

---

## Code Examples

### Creating a Token Set

```typescript
// src/design-system/tokens/semantic/colors.ts

export const semanticColors = {
  // Existing tokens...
  
  // New tier badge colors
  tierBadge: {
    free: {
      background: primitiveColors.gray[100],
      text: primitiveColors.gray[600],
      border: primitiveColors.gray[300],
    },
    starter: {
      background: primitiveColors.brand[50],
      text: primitiveColors.brand[600],
      border: primitiveColors.brand[200],
    },
    // ... etc
  },
};
```

### Using in Tailwind

```typescript
// tailwind.config.ts

module.exports = {
  theme: {
    extend: {
      colors: {
        tier: {
          free: 'hsl(var(--tier-free))',
          starter: 'hsl(var(--tier-starter))',
          // ... etc
        },
      },
    },
  },
};
```

### Component Usage

```tsx
// Badge component using tokens
function TierBadge({ tier }: { tier: Tier }) {
  const styles = {
    free: 'bg-tier-free/10 text-tier-free border-tier-free/20',
    starter: 'bg-tier-starter/10 text-tier-starter border-tier-starter/20',
    // ... etc
  };
  
  return (
    <span className={`px-2 py-1 rounded-full border text-sm font-medium ${styles[tier]}`}>
      {tier}
    </span>
  );
}
```

---

## Quality Checklist

Before marking work complete:

- [ ] **Token Consistency**
  - [ ] No hardcoded values in semantic tokens
  - [ ] All colors use primitive base
  - [ ] Naming follows convention

- [ ] **Accessibility**
  - [ ] Contrast ratios checked
  - [ ] Focus states visible
  - [ ] Color not only indicator

- [ ] **Theme Coverage**
  - [ ] Light theme updated
  - [ ] Dark theme updated
  - [ ] System preference works

- [ ] **Documentation**
  - [ ] Token purpose documented
  - [ ] Usage examples provided
  - [ ] Breaking changes noted

- [ ] **Communication**
  - [ ] Affected agents notified
  - [ ] Implementation guide provided
  - [ ] Questions answered

---

## Emergency Contacts

| Issue | Contact | Escalation |
|-------|---------|------------|
| Breaking change | Lead Architect | Immediate |
| Color conflict | UX Agent | Within 4 hours |
| Implementation issue | Frontend Engineer | Within 24 hours |
| Accessibility failure | Security Agent | Immediate |

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Design System Agent  

**Updates:**
- Check quarterly for new design trends
- Update when token structure changes
- Revise when new tier/brand colors added

---

**Ready to start? Confirm completion of Read Order, then await your first assignment from Lead Architect.**
