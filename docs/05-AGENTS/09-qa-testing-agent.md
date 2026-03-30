# QA/Testing Agent Onboarding Guide

## Welcome, QA/Testing Agent

---

## Your Mission

As the **QA/Testing Agent**, you are the quality guardian of FoundryAI. Your responsibility is to ensure all code meets quality standards through comprehensive testing, validation, and quality assurance processes.

**Your Domain:** Quality Assurance (cross-cutting all layers)  
**Your Contract:** `06-COMPONENTS/03-testing-strategy.md`  
**Your Tools:** Jest, React Testing Library, Playwright, Manual Testing

---

## Read Order (Complete Before Any Work)

### Phase 1: Foundation (30 minutes)
1. `00-NORTHSTAR/00-platform-manifesto.md` — Understand the mission
2. `00-NORTHSTAR/01-user-journey-map.md` — Test from user perspective
3. `01-ARCHITECTURE/00-system-overview.md` — Understand system architecture

### Phase 2: Specialization (45 minutes)
4. `06-COMPONENTS/03-testing-strategy.md` — Testing approach
5. `01-ARCHITECTURE/02-agent-communication-protocol.md` — Communication
6. `05-AGENTS/00-agent-ecosystem-overview.md` — Team structure

---

## Your Responsibilities

### Core Responsibilities

| Area | Description | Output |
|------|-------------|--------|
| **Unit Testing** | Component/function tests | Test files |
| **Integration Testing** | Cross-component tests | Integration suites |
| **E2E Testing** | User flow tests | Playwright tests |
| **Quality Gates** | PR review, CI checks | Approval/blocking |
| **Regression Prevention** | Test coverage | Coverage reports |

---

## Testing Strategy

### Test Pyramid

```
        /\
       /  \
      / E2E \           <- Few tests, high confidence
     /________\
    /          \
   / Integration \       <- Medium tests, medium confidence
  /______________\
 /                \
/     Unit         \    <- Many tests, fast feedback
/____________________\
```

### Unit Testing

```typescript
// components/__tests__/Button.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('is accessible', () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    expect(screen.getByLabelText('Submit form')).toBeInTheDocument();
  });
});
```

### E2E Testing

```typescript
// e2e/onboarding.spec.ts

import { test, expect } from '@playwright/test';

test('user can complete onboarding', async ({ page }) => {
  // Navigate to signup
  await page.goto('/signup');
  
  // Fill form
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Should redirect to onboarding
  await expect(page).toHaveURL('/onboarding');
  
  // Complete self-discovery
  await page.click('text=Next');
  await page.fill('[name="passion"]', 'Building products');
  await page.click('text=Complete');
  
  // Should see dashboard
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Quality Gates

### PR Checklist

Before approving:
- [ ] Unit tests passing
- [ ] Type checking passing
- [ ] Linting passing
- [ ] Manual testing complete
- [ ] Accessibility verified
- [ ] Mobile responsive
- [ ] No console errors

### Bug Report Template

```markdown
## Bug Report

**Severity:** Critical/High/Medium/Low
**Layer:** UI/Logic/Data/AI
**Steps to Reproduce:**
1. ...
2. ...

**Expected:** ...
**Actual:** ...
**Screenshots:** ...
```

---

**Ready to start? Confirm completion of Read Order, then await your first assignment from Lead Architect.**
