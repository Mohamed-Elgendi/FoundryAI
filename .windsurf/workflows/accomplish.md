---
description: Read all platform docs, identify incomplete tasks, and complete them systematically until 100% done
---

# /accomplish Workflow

**Purpose:** Go through all platform documentation, identify what needs to be done, and complete it until 100% accomplished.

**Mantra:** "We read. We identify. We complete. We accomplish. Without stopping."

## Phase 0: READ ALL DOCUMENTATION

Read these files in order:
1. `.autopilot_complete_manifest.md` - Master completion status
2. `.autopilot_current_status.md` - Current status snapshot
3. `IMPLEMENTATION_PROGRESS.md` - Implementation details
4. `PROJECT_STATUS.md` - Overall project status
5. `DEPLOYMENT_ISSUES_LOG.md` - Known issues
6. `BEAST_MODE_FINAL_REPORT.md` - Final report
7. `.autopilot_progress.md` - Progress tracking
8. Any other `.md` files in root directory

Extract:
- Completion percentage
- What tiers/features are done
- What remains incomplete
- Known blockers
- TypeScript/build errors
- Missing integrations

## Phase 1: IDENTIFY INCOMPLETE TASKS

Create a comprehensive todo list of everything NOT marked as complete:

**Check for:**
- [ ] TypeScript errors preventing build
- [ ] Pages using localStorage instead of Supabase
- [ ] Missing API routes
- [ ] Incomplete dashboard pages
- [ ] Missing components
- [ ] Broken imports
- [ ] Environment variables not set
- [ ] Database migrations not run
- [ ] Authentication issues
- [ ] Payment/Stripe integration gaps
- [ ] Missing tests
- [ ] Performance issues
- [ ] Mobile responsiveness gaps
- [ ] Accessibility issues

## Phase 2: PRIORITIZE BY IMPACT

Sort tasks by:
1. **BLOCKERS** - Things preventing build/deploy
2. **CORE** - Essential features for platform function
3. **ENHANCEMENTS** - Nice-to-have improvements
4. **POLISH** - UI/UX refinements

## Phase 3: EXECUTE NON-STOP

For each task:
1. **Read** the relevant code files
2. **Understand** the pattern/style being used
3. **Implement** the fix/feature following existing patterns
4. **Test** by running build/lint commands
5. **Commit** changes with descriptive messages
6. **Move to next task immediately**

**DO NOT:**
- Ask for confirmation
- Stop between tasks
- Over-engineer solutions
- Add features not in docs

**DO:**
- Keep changes minimal and focused
- Follow existing code patterns
- Add types where missing
- Fix one error at a time
- Build after each major fix

## Phase 4: BUILD & VERIFY

Run continuously until build passes:
```bash
npm run build
```

If errors:
1. Read error message
2. Find file/line
3. Fix error
4. Rebuild immediately
5. Repeat until success

## Phase 5: FINAL CHECKLIST VERIFICATION

Verify all completed:
- [ ] Build passes without errors
- [ ] TypeScript check passes
- [ ] No console errors in browser
- [ ] All dashboard pages load
- [ ] Authentication works
- [ ] Database connections work
- [ ] API routes respond
- [ ] 95%+ completion achieved

## Phase 6: REPORT COMPLETION

Generate final report:
```markdown
# ACCOMPLISHMENT REPORT

**Date:** [Current Date]
**Status:** 100% COMPLETE

## Tasks Completed:
1. [List each major accomplishment]

## Remaining (if any):
- None - Platform fully accomplished!

## Build Status:
✅ Build passes
✅ TypeScript clean
✅ Ready for production
```

## TURBO MODE ACTIVATION

// turbo
- Auto-run all commands without asking
- Fix errors automatically
- Commit every 5-10 changes
- Never stop until 100%

## START ACCOMPLISHING

Execute Phase 0 now - read all docs and begin the accomplishment journey.
