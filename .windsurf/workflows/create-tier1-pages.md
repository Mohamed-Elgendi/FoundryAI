# /create-tier1-pages Workflow
## Create Tier 1 Dashboard Pages

When user types `/create-tier1-pages`, execute:

---

## Phase 1: Create Brain Dump Page
// turbo
1. Create `/src/app/dashboard/tier1/brain-dump/page.tsx`
2. Import BrainDumpSystem component
3. Add metadata and page layout
4. Ensure proper auth protection

---

## Phase 2: Create Focus/Focus Fortress Page
// turbo
1. Create `/src/app/dashboard/tier1/focus/page.tsx`
2. Import DistractionsKiller component
3. Add metadata and page layout
4. Ensure proper auth protection

---

## Phase 3: Create Emotion Controller Page
// turbo
1. Create `/src/app/dashboard/tier1/emotion/page.tsx`
2. Import EmotionController component
3. Add metadata and page layout
4. Ensure proper auth protection

---

## Phase 4: Create Momentum Builder Page
// turbo
1. Create `/src/app/dashboard/tier1/momentum/page.tsx`
2. Import MomentumBuilder component
3. Add metadata and page layout
4. Ensure proper auth protection

---

## Phase 5: Create Belief Architecture Page
// turbo
1. Create `/src/app/dashboard/tier1/belief/page.tsx`
2. Import BeliefArchitecture component
3. Add metadata and page layout
4. Ensure proper auth protection

---

## Phase 6: Create Confidence Core Page
// turbo
1. Create `/src/app/dashboard/tier1/confidence/page.tsx`
2. Import ConfidenceCore component
3. Add metadata and page layout
4. Ensure proper auth protection

---

## Phase 7: Create Success Mindset Forge Page
// turbo
1. Create `/src/app/dashboard/tier1/mindset/page.tsx`
2. Import SuccessMindsetForge component
3. Add metadata and page layout
4. Ensure proper auth protection

---

## Phase 8: Create Affirmation & Journaling Page
// turbo
1. Create `/src/app/dashboard/tier1/journal/page.tsx`
2. Import AffirmationJournaling component
3. Add metadata and page layout
4. Ensure proper auth protection

---

## Phase 9: Create Tier 1 Overview/Dashboard Page
// turbo
1. Create `/src/app/dashboard/tier1/page.tsx`
2. Import Tier1FoundationPanel component
3. Show overview of all 8 systems
4. Link to individual system pages

---

## Phase 10: Verify All Pages
// turbo
1. Run TypeScript check on all new pages
2. Verify imports are correct
3. Ensure consistent layout structure
4. Test navigation between pages

---

## Page Template Structure

Each page should follow this pattern:

```tsx
import { Metadata } from 'next';
import { requireAuth } from '@/layer-1-security/auth';
import ComponentName from '@/components/tier1/ComponentName';

export const metadata: Metadata = {
  title: 'System Name | FoundryAI',
  description: 'Description of the system',
};

export default async function PageNamePage() {
  const user = await requireAuth();
  
  return (
    <div className="container mx-auto py-6">
      <ComponentName />
    </div>
  );
}
```

---

## Navigation Structure

Add links to all Tier 1 pages in the dashboard navigation:
- /dashboard/tier1 (overview)
- /dashboard/tier1/brain-dump
- /dashboard/tier1/focus
- /dashboard/tier1/emotion
- /dashboard/tier1/momentum
- /dashboard/tier1/belief
- /dashboard/tier1/confidence
- /dashboard/tier1/mindset
- /dashboard/tier1/journal
