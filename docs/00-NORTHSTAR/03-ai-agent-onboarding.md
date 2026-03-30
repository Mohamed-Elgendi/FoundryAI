# AI Agent Onboarding Protocol

## Welcome to FoundryAI: Your Complete Entry Guide

---

## Document Purpose

**This is the mandatory entry point for ALL AI agents joining the FoundryAI project.** Do not write a single line of code until you have read and understood this entire document.

This protocol ensures:
- **Consistency:** All agents work from the same source of truth
- **Quality:** No uninformed decisions or technical debt
- **Coordination:** Seamless handoffs between specialized agents
- **Continuity:** Zero context loss between agent sessions

**Read Time:** 15 minutes  
**Prerequisites:** None  
**Next Steps:** Follow the Read Order below

---

## Agent Identity: Who Are You?

Before proceeding, identify your role:

| Agent Type | Primary Responsibility | Key Documents |
|------------|------------------------|---------------|
| **Lead Architect** (Cascade) | System coordination, cross-layer decisions | All documents |
| **Design System Agent** | Visual architecture, tokens, themes | 02-DESIGN-SYSTEM/* |
| **UX/Interaction Agent** | User flows, interaction patterns | 03-UX-PATTERNS/*, 00-NORTHSTAR/01-user-journey-map.md |
| **Frontend Engineer** | UI implementation, component building | 06-COMPONENTS/*, 02-DESIGN-SYSTEM/* |
| **Backend/API Agent** | Server architecture, business logic | 01-ARCHITECTURE/04-logic-layer.md, 07-API/* |
| **Database Architect** | Schema design, data layer | 01-ARCHITECTURE/05-data-layer.md, 08-DATABASE/* |
| **AI/ML Agent** | Prompt engineering, model routing | 01-ARCHITECTURE/06-ai-expansion-layer.md, 10-INTEGRATIONS/ai-providers/* |
| **Security Agent** | Protection, hardening, compliance | 01-ARCHITECTURE/09-security-agent-layer.md |
| **DevOps/Infra Agent** | Deployment, scaling, monitoring | 11-OPERATIONS/* |
| **QA/Testing Agent** | Quality assurance, test coverage | Cross-cutting (all layers) |
| **Content/Copy Agent** | Microcopy, documentation, communication | 00-NORTHSTAR/*, 03-UX-PATTERNS/* |

**Not sure which you are?** Ask the Lead Architect (Cascade) before proceeding.

---

## Mandatory Read Order (DO NOT SKIP)

### Phase 1: Foundation (Required for ALL Agents)
**Time:** 30 minutes  
**Status:** ⬜ Complete before any other activity

1. **00-NORTHSTAR/00-platform-manifesto.md**
   - Understand the mission, the 6 axioms, the transformation promise
   - Why: Every decision must serve this mission
   - Output: Mental model of "what we're building and why"

2. **00-NORTHSTAR/01-user-journey-map.md**
   - Understand the user transformation flow
   - Why: Technical decisions impact user emotions
   - Output: Understanding of user touchpoints and critical moments

3. **01-ARCHITECTURE/00-system-overview.md**
   - Understand the 7-layer architecture
   - Why: Know where your work fits in the system
   - Output: Clear picture of system boundaries and interfaces

### Phase 2: Specialization (Based on Your Role)
**Time:** 45-60 minutes  
**Status:** ⬜ Complete after Phase 1

Based on your agent type (see table above), read your specialized documents:

**Design System Agent:**
- 02-DESIGN-SYSTEM/00-design-principles.md
- 02-DESIGN-SYSTEM/01-token-architecture.md
- 02-DESIGN-SYSTEM/02-color-system.md

**UX/Interaction Agent:**
- 03-UX-PATTERNS/00-ux-principles.md
- 03-UX-PATTERNS/01-interaction-patterns.md
- 00-NORTHSTAR/01-user-journey-map.md (re-read focusing on your stages)

**Frontend Engineer:**
- 06-COMPONENTS/00-component-architecture.md
- 02-DESIGN-SYSTEM/05-component-library.md
- 01-ARCHITECTURE/03-presentation-layer.md

**Backend/API Agent:**
- 01-ARCHITECTURE/04-logic-layer.md
- 07-API/00-api-principles.md
- 07-API/endpoints/*.md

**Database Architect:**
- 01-ARCHITECTURE/05-data-layer.md
- 08-DATABASE/00-schema-overview.md
- 08-DATABASE/01-tables/*.md

**AI/ML Agent:**
- 01-ARCHITECTURE/06-ai-expansion-layer.md
- 10-INTEGRATIONS/ai-providers/00-ai-routing.md
- 04-DOMAINS/02-tier2-opportunity/00-opportunity-radar.md

**Security Agent:**
- 01-ARCHITECTURE/09-security-agent-layer.md
- 08-DATABASE/00-schema-overview.md (focus on RLS policies)
- 07-API/00-api-principles.md (focus on authentication)

**DevOps/Infra Agent:**
- 11-OPERATIONS/00-deployment.md
- 11-OPERATIONS/01-monitoring.md
- 01-ARCHITECTURE/00-system-overview.md (focus on deployment section)

**QA/Testing Agent:**
- All Phase 1 documents
- Cross-cutting review of component specifications
- 06-COMPONENTS/03-testing-strategy.md

**Content/Copy Agent:**
- 00-NORTHSTAR/00-platform-manifesto.md (focus on voice/tone)
- 00-NORTHSTAR/01-user-journey-map.md (focus on emotional states)
- 03-UX-PATTERNS/04-content-strategy.md

### Phase 3: Collaboration (Required for ALL Agents)
**Time:** 15 minutes  
**Status:** ⬜ Complete before any collaboration

4. **05-AGENTS/00-agent-ecosystem-overview.md**
   - Understand the multi-agent architecture
   - Why: You will collaborate with other agents
   - Output: Knowledge of who to contact for what

5. **01-ARCHITECTURE/02-agent-communication-protocol.md**
   - Learn the communication protocol
   - Why: Required for all inter-agent communication
   - Output: Ability to send/receive structured messages

---

## The Documentation-First Rule

### Golden Rule: Docs Before Code

```
❌ INCORRECT FLOW:
1. Write code
2. Hope it matches architecture
3. Maybe update docs later
4. Technical debt accumulates

✅ CORRECT FLOW:
1. Read relevant docs
2. Propose doc update if needed
3. Get Lead Architect approval
4. Update docs
5. Implement code to match docs
6. Verify implementation matches docs
```

### Change Management Protocol

Any change to the system MUST follow this sequence:

1. **Identify Impact:** Which docs does this change affect?
2. **Propose Update:** Create PR to documentation
3. **Cross-Layer Review:** Affected layer agents review
4. **Lead Architect Approval:** Final sign-off
5. **Doc Update Merge:** Source of truth updated
6. **Implementation:** Code matches updated docs
7. **Verification:** QA confirms docs and code align

### Emergency Protocol

**When production is broken:**
1. Fix production (code-first allowed)
2. Document the fix immediately
3. Create ADR (Architecture Decision Record)
4. Retroactive doc update within 24 hours

---

## Your Layer: Rights and Responsibilities

### Layer Ownership Model

The 7-layer architecture uses strict ownership:

```
Layer 7: DESIGN SYSTEM       → Owned by Design System Agent
Layer 6: USER EXPERIENCE       → Owned by UX/Interaction Agent  
Layer 5: PRESENTATION        → Owned by Frontend Engineer Agent
Layer 4: LOGIC               → Owned by Backend/API Agent
Layer 3: DATA                → Owned by Database Architect Agent
Layer 2: AI EXPANSION        → Owned by AI/ML Agent
Layer 1: SECURITY & AGENTS   → Owned by Security Agent
```

### Rights Within Your Layer

You have FULL authority to:
- Design and implement features within your layer
- Define interfaces your layer exposes
- Optimize internal implementations
- Create tests for your layer

### Responsibilities to Other Layers

You MUST:
- Maintain stable contracts (interfaces) your layer exposes
- Communicate changes affecting other layers
- Honor contracts from layers you depend on
- Request permission to modify cross-layer boundaries

### Cross-Layer Change Protocol

**Scenario: Design System Agent wants to change a color token**

```
1. Design System Agent proposes change
   ↓
2. UX Agent reviews (affects interaction patterns)
   ↓
3. Frontend Agent reviews (implementation impact)
   ↓
4. Lead Architect approves
   ↓
5. Design System Agent updates tokens
6. Frontend Agent updates components
7. QA Agent verifies across all pages
```

---

## Communication Protocol Quick Reference

### Message Format (All Agents Must Use)

```yaml
message:
  from: "your-agent-name"
  to: "target-agent-name" | "all" | "lead-architect"
  type: "request" | "notify" | "question" | "approve" | "reject" | "handoff"
  
  context:
    layer_affected: "design-system" | "presentation" | "logic" | "data" | "ai" | "security"
    files_involved: ["path/to/file1.ts", "path/to/file2.tsx"]
    user_story: "As a user, I want..."
    priority: "blocker" | "high" | "medium" | "low"
    
  payload:
    action: "create" | "update" | "delete" | "review"
    details: "Detailed description of the request or notification"
    proposed_solution: "Optional: your suggested approach"
    
  dependencies:
    requires_approval_from: ["agent-name"]
    blocks: ["task-id"]
    blocked_by: ["task-id"]
    
  metadata:
    timestamp: "ISO-8601"
    message_id: "unique-id"
```

### Common Message Types

**Request:** "I need something from another agent"
```yaml
from: "frontend-agent"
to: "design-system-agent"
type: "request"
payload:
  action: "review"
  details: "New Button variant needed for Dashboard"
```

**Notify:** "I'm telling other agents what I did"
```yaml
from: "database-architect"
to: "all"
type: "notify"
payload:
  action: "update"
  details: "Added revenue_tracking table schema"
```

**Question:** "I need clarification"
```yaml
from: "ai-ml-agent"
to: "lead-architect"
type: "question"
payload:
  details: "Should we add Claude-3 to provider list?"
```

**Handoff:** "I'm passing work to another agent"
```yaml
from: "ux-agent"
to: "frontend-agent"
type: "handoff"
payload:
  action: "create"
  details: "Onboarding flow wireframes complete"
```

---

## Tool and Technology Stack

### Mandatory Knowledge

Every agent must understand:

| Technology | Purpose | Minimum Level |
|------------|---------|---------------|
| **Next.js 14** | Full-stack framework | Intermediate |
| **TypeScript** | Type safety | Advanced |
| **TailwindCSS** | Styling | Intermediate |
| **shadcn/ui** | Component base | Intermediate |
| **Supabase** | Database + Auth | Intermediate |
| **PostgreSQL** | Data storage | Intermediate |
| **Git/GitHub** | Version control | Advanced |

### Layer-Specific Tools

**Design System Agent:**
- CSS Custom Properties (design tokens)
- Color theory and contrast ratios
- Typography scales

**UX/Interaction Agent:**
- User flow diagramming
- Accessibility (WCAG 2.1 AA)
- Usability heuristics

**Frontend Engineer:**
- React Server Components
- React Hooks
- Framer Motion (animations)

**Backend/API Agent:**
- Next.js API Routes
- REST API design
- Error handling patterns

**Database Architect:**
- PostgreSQL schema design
- Row Level Security (RLS)
- Indexing strategies

**AI/ML Agent:**
- Prompt engineering
- LLM API integration
- Context management

**Security Agent:**
- Authentication patterns
- Authorization (RBAC, ABAC)
- Input validation

**DevOps/Infra Agent:**
- Vercel deployment
- CI/CD pipelines
- Monitoring tools

---

## Quality Standards

### Code Quality

All code MUST meet these standards:

1. **Type Safety:** No `any` types without explicit justification
2. **Error Handling:** All errors logged, user-friendly messages
3. **Testing:** Unit tests for logic, integration tests for features
4. **Documentation:** JSDoc for all public functions
5. **Performance:** No unnecessary re-renders, optimized data fetching
6. **Accessibility:** WCAG 2.1 AA compliance minimum
7. **Security:** No secrets in code, input sanitization, RLS policies

### Documentation Quality

All docs MUST be:

1. **Complete:** Cover what, why, and how
2. **Current:** Updated with code changes
3. **Clear:** Readable by all agent types
4. **Cross-referenced:** Link to related docs
5. **Versioned:** Include version number and last updated

---

## Common Mistakes to Avoid

### ❌ Anti-Patterns

1. **Skipping the Read Order**
   - Result: Misaligned implementation, technical debt
   - Fix: Start over, read in correct order

2. **Modifying Another Layer Without Permission**
   - Result: Breaking changes, system instability
   - Fix: Use communication protocol to request change

3. **Hardcoding Values That Should Be Tokens**
   - Result: Inconsistent UI, difficult theming
   - Fix: Use design system tokens exclusively

4. **Ignoring Error Handling**
   - Result: Silent failures, poor UX
   - Fix: Implement comprehensive error boundaries

5. **Not Updating Docs After Changes**
   - Result: Documentation drift, confused agents
   - Fix: Docs-first protocol enforcement

6. **Assuming Context from Previous Agents**
   - Result: Missing critical information
   - Fix: Always read docs, never assume

### ✅ Best Practices

1. **Ask Questions Early**
   - Better to clarify than to rebuild

2. **Document Assumptions**
   - If you make an assumption, document it

3. **Test Cross-Browser/Device**
   - Chrome, Firefox, Safari, Mobile

4. **Consider Edge Cases**
   - Empty states, loading states, error states

5. **Optimize for Performance**
   - Lazy loading, code splitting, image optimization

6. **Write for Maintainability**
   - Clear naming, modular structure, comments

---

## Emergency Contacts

**Stuck?** Follow this escalation:

1. **Check Documentation First**
   - 90% of questions are answered in docs

2. **Ask in Agent Channel**
   - Use communication protocol
   - Tag relevant agents

3. **Escalate to Lead Architect**
   - Cascade: Cross-layer decisions, architectural questions
   - Use `type: "question"`, `to: "lead-architect"`

4. **Human Approval Required**
   - Architectural changes
   - Mission-critical decisions
   - Scope changes

---

## Your First Task

After reading this document completely:

1. **Confirm Understanding:**
   - Send message: `type: "notify"`, `to: "lead-architect"`
   - Payload: "Onboarding complete, ready for assignment"

2. **Await Assignment:**
   - Lead Architect will assign your first task
   - Task will include relevant doc references

3. **Execute:**
   - Follow documentation-first protocol
   - Use communication protocol for collaboration
   - Meet quality standards

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE — Required Reading  
**Owner:** Lead Architect (Cascade)  

**Updates:**
- This document is stable and rarely changes
- New agent types added as needed
- Tools updated quarterly

**Questions about this document?**
- Tag: `lead-architect`
- Type: `question`
- Context: Reference specific section

---

**Welcome to the FoundryAI team. You are now part of the mission to transform lives.**

**Read Phase 1 documents now. Do not proceed until complete.**
