# FoundryAI Deployment Issues Log

This document tracks all deployment errors encountered and their solutions to prevent recurring issues.

**Usage:** Before implementing any code changes, check this log for related patterns.

---

## Table of Contents
1. [TypeScript/Supabase Issues](#typescript-supabase-issues)
2. [Import/Module Issues](#import-module-issues)
3. [AI Router Issues](#ai-router-issues)
4. [Stripe Webhook Issues](#stripe-webhook-issues)

---

## TypeScript/Supabase Issues

### Issue: Supabase .update() Type Error
**Date:** 2026-03-31
**Status:** ✅ Resolved

**Error:**
```
Type error: Argument of type 'UserUpdate' is not assignable to parameter of type 'never'
```

**Root Cause:**
- Supabase client's `.update()` method has strict typing
- When table schema isn't properly typed, TypeScript infers update parameter as `never`
- The `Database` type (in `database.types.ts`) was missing the `users` table definition

**Solution Applied:**

**Option A - Quick Fix (Used in webhook):**
```typescript
await createSupabaseClient()
  .from('users')
  .update({
    subscription_tier: tier,
    subscription_status: 'active',
    // ... other fields
  } as any)  // ← Add 'as any' cast
  .eq('id', userId);
```

**Option B - Proper Fix (Recommended for new code):**
1. Add table to `database.types.ts`:
```typescript
users: {
  Row: {
    id: string;
    subscription_tier: string | null;
    subscription_status: string | null;
    // ... other columns
  };
  Insert: { /* ... */ };
  Update: { /* ... */ };
};
```

2. Remove `as any` casts - types will be inferred correctly

**Files Affected:**
- `src/app/api/stripe/webhook/route.ts`
- `src/layer-3-data/storage/database.types.ts`

**Prevention:**
- Always define new tables in `database.types.ts` before using them
- Run `supabase gen types` if you have Supabase CLI configured
- Check if table exists in types before writing queries

---

### Issue: Missing Database Table Definition
**Date:** 2026-03-31
**Status:** ✅ Resolved

**Error:**
Supabase queries fail because `users` table is not in Database interface

**Solution:**
Added complete `users` table definition to `database.types.ts`:
```typescript
users: {
  Row: {
    id: string;
    email: string;
    subscription_tier: string | null;
    subscription_status: string | null;
    stripe_customer_id: string | null;
    subscription_period_start: string | null;
    subscription_period_end: string | null;
    created_at: string;
    updated_at: string;
  };
  Insert: { /* optional fields */ };
  Update: { /* optional fields */ };
};
```

**Files Affected:**
- `src/layer-3-data/storage/database.types.ts`

---

## Import/Module Issues

### Issue: Missing Module Exports
**Date:** 2026-03-31
**Status:** ✅ Resolved

**Errors:**
```
Module not found: '@/layer-3-data/storage/supabase-client'
Module not found: '@/lib/utils'
Module not found: '@/layer-2-ai/router/ai-router'
```

**Root Causes & Solutions:**

1. **Missing index.ts exports:**
   - Add `export * from './supabase-client'` to `src/layer-3-data/storage/index.ts`

2. **Missing file:**
   - Created `src/lib/utils.ts` with `cn()` function

3. **Missing functions:**
   - Added `storeFeedback()`, `getFeedbackStats()`, `getSuccessfulPatterns()` to `supabase-client.ts`

**Prevention:**
- Always check `index.ts` files export what you need
- Verify function names match imports exactly
- Use TypeScript's "Go to Definition" to verify paths

---

## AI Router Issues

### Issue: AIResponse Missing Properties
**Date:** 2026-03-31
**Status:** ✅ Resolved

**Error:**
```
Property 'content' does not exist on type 'AIResponse'
Property 'error' does not exist on type 'AIResponse'
```

**Root Cause:**
`AIResponse` interface in `ai-types.ts` was missing properties used in API routes

**Solution:**
Updated `AIResponse` interface:
```typescript
export interface AIResponse {
  text?: string;           // Changed from required to optional
  error?: string;          // Added
  provider: AIProvider;
  model: string;
  usage?: { /* ... */ };
  cost?: number;
  latency: number;
  rateLimitError?: boolean;     // Added
  quotaExceeded?: boolean;        // Added
  fallbackUsed?: boolean;         // Added
  suggestedAction?: string;     // Added
}
```

**Additional Fix:**
Changed `preferredProvider` to `provider` in API calls:
```typescript
// Wrong:
const aiResponse = await processWithAI({ prompt, preferredProvider: selectedProvider });

// Correct:
const aiResponse = await processWithAI({ prompt, provider: selectedProvider });
```

**Files Affected:**
- `src/layer-2-ai/router/ai-types.ts`
- `src/app/api/generate/route.ts`
- `src/app/api/refine/route.ts`

---

## Stripe Webhook Issues

### Issue: Type Mismatch in Webhook Route
**Date:** 2026-03-31
**Status:** ✅ Resolved

**Errors:**
Multiple type errors in `stripe/webhook/route.ts`:
- `session.customer` type mismatch
- `updateData` type inference issues
- Missing type casts

**Solutions Applied:**

1. **Validate customer ID type:**
```typescript
const customerId = typeof session.customer === 'string' 
  ? session.customer 
  : null;
```

2. **Remove type casts from Supabase updates (FINAL FIX):**
```typescript
await createSupabaseClient()
  .from('users')
  .update({
    subscription_tier: tier,
    subscription_status: 'active',
    // ... other fields
  })  // ← No cast needed, let Supabase infer types
  .eq('id', userId);
```

**Key Insight:** Neither `as any` nor `as const` work reliably with Supabase's type system. The best approach is to:
1. Define the `users` table properly in `database.types.ts`
2. Pass update objects without any type casts
3. Let TypeScript infer types from the Database interface

3. **Add UserUpdate interface (later removed in favor of inline objects):**
```typescript
interface UserUpdate {
  subscription_tier?: string | null;
  subscription_status?: string | null;
  stripe_customer_id?: string | null;
  subscription_period_start?: string | null;
  updated_at?: string | null;
}
```

**Files Affected:**
- `src/app/api/stripe/webhook/route.ts`
- `src/app/api/stripe/portal/route.ts`

---

## Best Practices Checklist

Before writing new code, verify:

- [ ] **Database Types:** Does the table exist in `database.types.ts`?
- [ ] **Exports:** Are functions exported from module `index.ts`?
- [ ] **Function Names:** Do imported names match exported names exactly?
- [ ] **Type Properties:** Does interface include all used properties?
- [ ] **Supabase Updates:** Use `as any` cast if table types are incomplete
- [ ] **API Properties:** Check if property names match type definitions (e.g., `provider` vs `preferredProvider`)

---

## Common Patterns to Avoid

### ❌ Don't:
```typescript
// Don't create intermediate variables without typing
const updateData = { subscription_tier: tier }; // Type inferred as object, not specific interface
await supabase.from('users').update(updateData); // May fail type check

// Don't use wrong property names
processWithAI({ preferredProvider: selectedProvider }); // Wrong!

// Don't forget type casts on Supabase updates
await supabase.from('users').update({ ... }); // May fail if types incomplete
```

### ✅ Do:
```typescript
// Do cast to specific interface or use inline with as any
const updateData: UserUpdate = { subscription_tier: tier };
await supabase.from('users').update(updateData as any);

// Or inline with cast:
await supabase.from('users').update({
  subscription_tier: tier,
  // ...
} as any);

// Do use correct property names
processWithAI({ provider: selectedProvider }); // Correct!

// Do add new tables to database.types.ts first
```

---

## Future Improvements

1. **Generate Supabase Types:**
   ```bash
   npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
   ```

2. **Add Type Checking to CI:**
   Add `npm run type-check` to GitHub Actions before build

3. **Use Strict TypeScript:**
   Enable `strict: true` in `tsconfig.json` to catch issues earlier

---

**Last Updated:** 2026-03-31
**Maintained by:** Cascade AI Assistant
