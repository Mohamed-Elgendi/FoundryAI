# Agent Communication Protocol

## Standardized Inter-Agent Communication Specification

---

## Document Purpose

This document defines the mandatory communication protocol for all AI agents working on FoundryAI. It ensures consistent, structured, and traceable communication across the multi-agent ecosystem.

**Audience:** All AI agents, Lead Architect

**Prerequisites:** `00-NORTHSTAR/03-ai-agent-onboarding.md`, `01-ARCHITECTURE/00-system-overview.md`

---

## Protocol Overview

### Why Standardized Communication?

| Problem | Solution |
|---------|----------|
| Agents speak different "languages" | Structured message format |
| Context gets lost between sessions | Persistent message history |
| No accountability for changes | Audit trail in every message |
| Cross-layer changes break things | Dependency tracking |
| Unclear who owns what | Explicit recipient addressing |

### Protocol Design Principles

1. **Structured:** Machine and human readable
2. **Complete:** All context included
3. **Traceable:** Unique IDs and timestamps
4. **Actionable:** Clear next steps defined
5. **Secure:** Validation and approval workflows

---

## Message Format Specification

### Required Message Structure

```yaml
message:
  # Identity
  message_id: "uuid-v4"                    # Unique identifier
  timestamp: "2026-03-30T19:30:00Z"        # ISO-8601 format
  thread_id: "uuid-v4" | null             # Group related messages
  
  # Routing
  from: "agent-name"                      # Sender identifier
  to: "agent-name" | "all" | "lead-architect"  # Recipient
  cc: ["agent-name"]                      # Carbon copy (optional)
  
  # Classification
  type: "request" | "notify" | "question" | "approve" | "reject" | "handoff" | "blocker"
  priority: "critical" | "high" | "medium" | "low"
  
  # Context
  context:
    layer_affected: "design-system" | "ux" | "presentation" | "logic" | "data" | "ai" | "security"
    feature_area: "tier1-foundation" | "tier2-opportunity" | "tier3-build" | "tier4-discovery" | "tier5-education" | "tier6-monetization"
    files_involved:
      - "src/design-system/tokens/colors.ts"
      - "src/components/Button.tsx"
    user_story: "As a user, I want dark mode so I can work comfortably at night"
    related_docs:
      - "02-DESIGN-SYSTEM/07-theme-engine.md"
    
  # Content
  payload:
    action: "create" | "update" | "delete" | "review" | "implement" | "fix"
    title: "Brief summary of the message"
    description: "Detailed explanation"
    
    # For requests
    requirements:
      - "Specific requirement 1"
      - "Specific requirement 2"
    acceptance_criteria:
      - "Criterion 1"
      - "Criterion 2"
      
    # For implementation
    implementation_details:
      approach: "Description of solution"
      files_modified:
        - "path/to/file.ts"
      tests_added: true
      docs_updated: true
      
    # For questions
    question: "What is the specific question?"
    options:
      - "Option A"
      - "Option B"
    
    # For approvals
    approved: true | false
    feedback: "Approval feedback or rejection reason"
    
  # Dependencies and Workflow
  dependencies:
    requires_approval_from: ["design-system-agent", "lead-architect"]
    blocks: ["task-id-123", "task-id-456"]       # This blocks these tasks
    blocked_by: ["task-id-789"]                  # This is blocked by these tasks
    related_to: ["pr-123", "issue-456"]
    
  # Metadata
  metadata:
    estimated_hours: 4
    actual_hours: null                          # Fill in on completion
    complexity: "low" | "medium" | "high"
    risk_level: "low" | "medium" | "high"
    review_status: "pending" | "in-review" | "approved" | "rejected"
```

---

## Message Types Deep Dive

### 1. REQUEST

**Purpose:** Ask another agent to do something

**Sender:** Any agent  
**Recipient:** Specific agent or Lead Architect  
**Expected Response:** Approve, Reject, or Question

**Example:**
```yaml
message:
  message_id: "req-001"
  timestamp: "2026-03-30T10:00:00Z"
  from: "frontend-agent"
  to: "design-system-agent"
  type: "request"
  priority: "medium"
  
  context:
    layer_affected: "design-system"
    feature_area: "tier6-monetization"
    user_story: "As a user, I need a premium badge to identify my tier"
    
  payload:
    action: "create"
    title: "Create PremiumBadge component tokens"
    description: "Dashboard needs a badge showing user's tier (Starter, Pro, Elite, Legend). Need color tokens for each tier."
    requirements:
      - "Badge must support 4 tier variants"
      - "Each tier has distinct color scheme"
      - "Must work in light and dark themes"
      - "Must meet WCAG AA contrast"
    acceptance_criteria:
      - "Token file created: tokens/tiers.ts"
      - "Colors defined for all 4 tiers"
      - "Documentation updated"
      
  dependencies:
    requires_approval_from: ["ux-agent"]
    estimated_hours: 2
```

---

### 2. NOTIFY

**Purpose:** Inform other agents about something you did

**Sender:** Any agent  
**Recipient:** "all" or specific agents  
**Expected Response:** None (fire-and-forget)

**Example:**
```yaml
message:
  message_id: "ntf-001"
  timestamp: "2026-03-30T11:30:00Z"
  from: "database-architect"
  to: "all"
  type: "notify"
  priority: "medium"
  
  context:
    layer_affected: "data"
    feature_area: "tier3-build"
    files_involved:
      - "supabase/migrations/20260330_add_revenue_tracking.sql"
    
  payload:
    action: "create"
    title: "Added revenue_tracking table"
    description: "New table for tracking user revenue milestones. Unlocks tier progression logic."
    implementation_details:
      files_modified:
        - "supabase/migrations/20260330_add_revenue_tracking.sql"
      docs_updated: true
      
  dependencies:
    blocked_by: []
    estimated_hours: 1
```

---

### 3. QUESTION

**Purpose:** Ask for clarification or guidance

**Sender:** Any agent  
**Recipient:** Specific agent or Lead Architect  
**Expected Response:** Answer or Redirect

**Example:**
```yaml
message:
  message_id: "qst-001"
  timestamp: "2026-03-30T14:00:00Z"
  from: "ai-ml-agent"
  to: "lead-architect"
  type: "question"
  priority: "high"
  
  context:
    layer_affected: "ai"
    feature_area: "tier2-opportunity"
    
  payload:
    question: "Should we add Anthropic Claude-3 as tertiary AI provider?"
    description: "OpenRouter supports Claude-3. Groq currently has best price/performance for our use case. Is redundancy worth the additional complexity?"
    options:
      - "Add Claude-3 as tertiary (Groq → OpenRouter → Claude direct)"
      - "Keep current two-provider setup"
      - "Replace OpenRouter with Claude direct"
    
  dependencies:
    blocked_by: ["decision-needed"]
```

---

### 4. APPROVE

**Purpose:** Approve a request or implementation

**Sender:** Agent with approval authority  
**Recipient:** Requesting agent  
**Expected Response:** None

**Example:**
```yaml
message:
  message_id: "apr-001"
  timestamp: "2026-03-30T15:00:00Z"
  from: "design-system-agent"
  to: "frontend-agent"
  type: "approve"
  thread_id: "req-001"
  priority: "medium"
  
  context:
    layer_affected: "presentation"
    
  payload:
    action: "review"
    title: "Approved: PremiumBadge component"
    approved: true
    feedback: "Approved with minor suggestion: add 'free' tier for completeness. Otherwise excellent work!"
    
  metadata:
    review_status: "approved"
```

---

### 5. REJECT

**Purpose:** Reject a request with explanation

**Sender:** Agent with approval authority  
**Recipient:** Requesting agent  
**Expected Response:** Revised request or discussion

**Example:**
```yaml
message:
  message_id: "rej-001"
  timestamp: "2026-03-30T15:30:00Z"
  from: "ux-agent"
  to: "frontend-agent"
  type: "reject"
  thread_id: "req-002"
  priority: "medium"
  
  context:
    layer_affected: "ux"
    
  payload:
    action: "review"
    title: "Rejected: Modal animation timing"
    approved: false
    feedback: "Animation duration 500ms is too slow. Users perceive delay. Please reduce to 200-300ms per UX-PATTERNS/01-interaction-patterns.md guidelines."
    
  dependencies:
    blocks: ["task-123"]
```

---

### 6. HANDOFF

**Purpose:** Pass work to another agent

**Sender:** Agent completing their part  
**Recipient:** Next agent in workflow  
**Expected Response:** Acknowledgment

**Example:**
```yaml
message:
  message_id: "hnd-001"
  timestamp: "2026-03-30T16:00:00Z"
  from: "ux-agent"
  to: "frontend-agent"
  type: "handoff"
  priority: "high"
  
  context:
    layer_affected: "presentation"
    feature_area: "tier1-foundation"
    files_involved:
      - "wireframes/brain-dump-flow.fig"
      - "03-UX-PATTERNS/flows/brain-dump.md"
    
  payload:
    action: "implement"
    title: "Brain Dump feature ready for implementation"
    description: "Complete UX specification and wireframes for Brain Dump system. Includes: input modal, categorization flow, scheduling integration."
    implementation_details:
      approach: "Follow wireframes exactly. Use design-system components. See acceptance criteria in docs."
      tests_added: false
      docs_updated: true
    acceptance_criteria:
      - "Modal opens with keyboard shortcut (Cmd/Ctrl+Shift+D)"
      - "Voice input option available"
      - "Auto-categorization with manual override"
      - "One-click schedule to calendar"
      
  dependencies:
    blocked_by: []
    requires_approval_from: []
    estimated_hours: 8
```

---

### 7. BLOCKER

**Purpose:** Escalate critical blocking issue

**Sender:** Any agent  
**Recipient:** Lead Architect + affected agents  
**Expected Response:** Immediate attention and resolution

**Example:**
```yaml
message:
  message_id: "blk-001"
  timestamp: "2026-03-30T17:00:00Z"
  from: "backend-agent"
  to: "lead-architect"
  cc: ["database-architect", "security-agent"]
  type: "blocker"
  priority: "critical"
  
  context:
    layer_affected: "data"
    feature_area: "tier6-monetization"
    files_involved:
      - "src/layers/data-layer.ts"
    
  payload:
    action: "fix"
    title: "CRITICAL: Database connection pool exhaustion"
    description: "Production experiencing intermittent 500 errors. Connection pool maxing out during peak hours. Need immediate architecture decision on scaling strategy."
    
  dependencies:
    blocks: ["all-tier6-work"]
    risk_level: "high"
```

---

## Communication Workflows

### Standard Change Workflow

```
1. Requesting Agent identifies need
   ↓
2. Sends REQUEST to affected layer owner
   ↓
3. Layer owner reviews requirements
   ↓
4. Decision:
   ├─ APPROVE → Proceed to implementation
   ├─ REJECT → Revise and resubmit
   └─ QUESTION → Clarify then decide
   ↓
5. Implementing agent completes work
   ↓
6. Sends NOTIFY to all affected agents
   ↓
7. QA Agent verifies
   ↓
8. Mark complete
```

### Cross-Layer Change Workflow

```
1. Identifying agent maps affected layers
   ↓
2. Sends REQUEST to Lead Architect
   ↓
3. Lead Architect coordinates review:
   ├─ Design System Agent (if visual)
   ├─ UX Agent (if interaction)
   ├─ Frontend Agent (if implementation)
   ├─ Backend Agent (if API)
   ├─ Database Agent (if schema)
   └─ Security Agent (if auth/data)
   ↓
4. All agents APPROVE
   ↓
5. Lead Architect gives final approval
   ↓
6. Changes implemented in dependency order:
   Layer 7 → 6 → 5 → 4 → 3 → 2 → 1
   ↓
7. QA verifies end-to-end
```

### Emergency Hotfix Workflow

```
1. Agent discovers critical production issue
   ↓
2. Sends BLOCKER to Lead Architect
   ↓
3. Lead Architect assesses and approves hotfix
   ↓
4. Agent implements fix immediately
   ↓
5. Deploy to production
   ↓
6. Retroactive documentation:
   ├─ ADR created
   ├─ NOTIFY sent to all
   └─ Docs updated within 24h
```

---

## Agent Addressing Reference

| Agent | Address | Responsibilities |
|-------|---------|------------------|
| Lead Architect | `lead-architect` | Cross-layer decisions, final approval, conflict resolution |
| Design System | `design-system-agent` | Layer 7, visual tokens, themes |
| UX/Interaction | `ux-agent` | Layer 6, user flows, interactions |
| Frontend Engineer | `frontend-agent` | Layer 5, React components |
| Backend/API | `backend-agent` | Layer 4, business logic, APIs |
| Database Architect | `database-agent` | Layer 3, schema, data layer |
| AI/ML | `ai-ml-agent` | Layer 2, AI routing, prompts |
| Security | `security-agent` | Layer 1, auth, protection |
| DevOps/Infra | `devops-agent` | Deployment, monitoring |
| QA/Testing | `qa-agent` | Quality assurance, testing |
| Content/Copy | `content-agent` | Microcopy, documentation |
| All Agents | `all` | Broadcast to entire team |

---

## Message Validation Rules

### Required Fields

Every message MUST include:
- `message_id` (valid UUID)
- `timestamp` (ISO-8601)
- `from` (valid agent identifier)
- `to` (valid agent identifier or "all")
- `type` (one of allowed values)
- `payload.title`
- `payload.description`

### Context Requirements

Based on type:

| Type | Required Context |
|------|------------------|
| REQUEST | `layer_affected`, `user_story`, `acceptance_criteria` |
| NOTIFY | `layer_affected`, `files_involved` |
| QUESTION | `layer_affected`, clear question |
| APPROVE | `thread_id` (references original request) |
| REJECT | `thread_id`, detailed feedback |
| HANDOFF | `files_involved`, `acceptance_criteria` |
| BLOCKER | `risk_level`, detailed impact |

### Priority Guidelines

- **critical**: Production down, data loss, security breach
- **high**: Feature blocked, significant user impact
- **medium**: Standard workflow, normal development
- **low**: Nice-to-have, refactoring, documentation

---

## Response Time Expectations

| Priority | Expected Response |
|----------|-------------------|
| critical | Immediate (agent available) |
| high | Within 4 hours |
| medium | Within 24 hours |
| low | Within 72 hours |

**Weekend/Holiday:** Critical only

---

## Message History and Audit Trail

All messages are persisted to:
```
docs/99-DECISIONS/agent-communications/
├── 2026/
│   ├── 03/
│   │   ├── 2026-03-30-message-log.md
│   │   └── 2026-03-31-message-log.md
```

### Retention
- Active threads: Indefinite
- Completed threads: 90 days
- Critical/blocker: Permanent

---

## Best Practices

### DO

✅ Be specific in requirements and acceptance criteria  
✅ Include relevant documentation links  
✅ Tag all affected agents  
✅ Update thread on progress  
✅ Mark dependencies accurately  
✅ Respond within SLA  
✅ Archive completed threads  

### DON'T

❌ Send vague or incomplete requests  
❌ Skip context because "they know"  
❌ Bypass approval process for cross-layer changes  
❌ Leave threads hanging without closure  
❌ Use wrong priority (everything can't be "high")  
❌ Send messages without reading related docs  

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE — Required for ALL communication  
**Owner:** Lead Architect (Cascade)  

**Related Documents:**
- `00-NORTHSTAR/03-ai-agent-onboarding.md` — Agent entry guide
- `05-AGENTS/00-agent-ecosystem-overview.md` — Agent roles and responsibilities

**Change Protocol:**
- Protocol changes require Lead Architect approval
- New message types need agent ecosystem consensus
- Validation rules updated quarterly

---

**End of Agent Communication Protocol. ALL agents must use this format for every communication.**
