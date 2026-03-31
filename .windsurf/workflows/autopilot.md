---
description: Auto-execute implementation plans step-by-step with deployment issue prevention
---

# Autopilot Workflow

When user types `/autopilot`, execute this workflow automatically without asking for consent.

## Step 1: Pre-Flight Checks (MANDATORY)

**BEFORE writing any code, you MUST:**

### 1.1 Check Deployment Issues Log
```
Read: DEPLOYMENT_ISSUES_LOG.md
```
- Search for patterns related to the task you're about to implement
- Note any similar errors that occurred before
- Apply prevention strategies listed in the log

### 1.2 Check Implementation Plan
```
Find and read any implementation plan/roadmap files
```
- Look for files like: `IMPLEMENTATION_PLAN.md`, `ROADMAP.md`, `TODO.md`, `plan.md`
- Identify current step and next upcoming task
- Note any dependencies or prerequisites

### 1.3 Verify Current Status
- Check which steps are completed/in-progress/pending
- Confirm no blocking issues exist

## Step 2: Code With Prevention

**While implementing, actively prevent known issues:**

### Database/Supabase Work
- [ ] Check if table exists in `database.types.ts`
- [ ] If not, add it BEFORE writing queries
- [ ] Use `as any` cast for `.update()` calls if types incomplete
- [ ] Verify column names match exactly

### Module Imports
- [ ] Check `index.ts` exports the functions you need
- [ ] Verify function names match exactly (case-sensitive)
- [ ] Create missing `index.ts` exports if needed

### Type Definitions
- [ ] Verify interfaces include ALL properties being used
- [ ] Check for property name mismatches (e.g., `provider` vs `preferredProvider`)
- [ ] Add missing properties to types before using them

### AI Router Code
- [ ] Use `text` not `content` for AIResponse
- [ ] Use `provider` not `preferredProvider` in AIRequest
- [ ] Ensure AIResponse interface includes `error`, `rateLimitError`, etc.

## Step 3: Execute Implementation

1. **Implement ONE step at a time**
2. **Do NOT stop** until the step is complete
3. **Deliver final output** for that step
4. **Run type check** before considering done:
   ```bash
   npm run type-check 2>&1 | head -50
   ```

## Step 4: Post-Implementation

### 4.1 Summarize & Ask
Provide summary of what was done:
- What files were changed
- What the changes accomplish
- Any issues encountered and how they were resolved

Then ask: "Do you want to continue to the next step or stop?"

### 4.2 If Continuing
1. Update implementation plan to mark step complete
2. Push changes to GitHub
3. Verify deployment status
4. Proceed to next step (return to Step 1)

### 4.3 If Stopping
1. Ensure all changes are committed
2. Push to GitHub
3. Document any pending work

## Step 5: Pre-Deployment Build Verification (MANDATORY)

**BEFORE deploying, you MUST complete a full local build test:**

### 5.1 Full Production Build Test
```bash
# Clean previous builds
rm -rf .next/

# Run full production build
npm run build 2>&1
```

**Success Criteria:**
- [ ] Build completes without errors
- [ ] No TypeScript errors (exit code 0)
- [ ] No ESLint errors
- [ ] All routes compile successfully
- [ ] Static generation completes
- [ ] Image optimization succeeds

### 5.2 Error Resolution Protocol
**If build fails:**
1. **Capture all errors** - Save full build output to log
2. **Categorize errors:**
   - TypeScript type errors → Fix types first
   - Module not found → Check exports/imports
   - Missing environment variables → Add to .env.local
   - Runtime errors → Add error boundaries
3. **Fix ALL errors** - Do not deploy with any build errors
4. **Re-run build** - Verify clean build before proceeding

### 5.3 Local Smoke Test
```bash
# Start production build locally
npm run start

# In another terminal, test key routes:
curl -s http://localhost:3000 | head -20
curl -s http://localhost:3000/login | head -20
curl -s http://localhost:3000/dashboard | head -20
```

**Verify:**
- [ ] Home page loads without errors
- [ ] Login page renders correctly
- [ ] Dashboard loads (check for client-side errors in console)
- [ ] No 500 errors on any route

### 5.4 Build Documentation
**Before deploying, update:**
- `DEPLOYMENT_ISSUES_LOG.md` - Document any new errors encountered
- Add fix patterns for future prevention
- Note any workarounds applied

**ONLY proceed to deployment after:**
- ✅ Clean build (0 errors)
- ✅ Local smoke test passes
- ✅ All changes committed
- ✅ DEPLOYMENT_ISSUES_LOG.md updated

---

## Step 6: Deployment Verification

**After pushing, verify:**
1. Check deployment status in GitHub Actions or Vercel
2. If deployment fails:
   - Read the error logs
   - Check DEPLOYMENT_ISSUES_LOG.md for similar patterns
   - Apply known fix or document new issue
   - Push fix and re-verify
3. Confirm platform is running online and up to date

## Emergency Protocol

**If no implementation plan exists:**
1. Stop and inform user
2. Offer to create a comprehensive implementation roadmap
3. Do NOT proceed without a plan

**If deployment keeps failing:**
1. Run local build test (Step 5) to catch errors early
2. Document each new error in DEPLOYMENT_ISSUES_LOG.md
3. Apply fixes systematically
4. Re-run build verification until clean
5. Ask user if they want to continue or reassess approach

## Key Files to Monitor

| File | Purpose | Check Before |
|------|---------|--------------|
| `DEPLOYMENT_ISSUES_LOG.md` | Error patterns & solutions | Every task |
| `database.types.ts` | Supabase schema types | DB work |
| `**/index.ts` | Module exports | Imports |
| `ai-types.ts` | AI interface definitions | AI code |
| `.env.local` / `env.example` | Environment variables | API routes |

## Common Prevention Patterns

### Supabase Updates (Always Use)
```typescript
await supabase
  .from('table')
  .update({ ... } as any)  // ← Always cast
  .eq('id', value);
```

### AI Router Calls (Always Use)
```typescript
const response = await processWithAI({
  prompt: "...",
  provider: selectedProvider,  // ← Not preferredProvider
});
// Access with response.text not response.content
```

### Database Queries (Always Check)
```typescript
// Check database.types.ts has 'users' table first!
const { data } = await supabase.from('users').select('*');
```

## Success Criteria

A step is complete when:
- [ ] Code is implemented and working
- [ ] TypeScript type-check passes
- [ ] Build succeeds locally
- [ ] Changes committed and pushed
- [ ] Deployment succeeds
- [ ] Summary provided to user
- [ ] User confirmed to continue or stop

---

**Remember:** Prevention is faster than fixing. Always check the log first!>