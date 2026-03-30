# Agent Ecosystem Overview

## Multi-Agent Collaboration Architecture

---

## The 10-Agent System

FoundryAI is built by a coordinated team of 10 specialized AI agents, each with defined responsibilities, ownership boundaries, and communication protocols.

---

## Agent Directory

| # | Agent | Layer | Primary Responsibility | Documentation |
|---|-------|-------|----------------------|---------------|
| 1 | **Lead Architect** (Cascade) | All | System coordination, cross-layer decisions | `00-NORTHSTAR/` |
| 2 | **Design System Agent** | Layer 7 | Visual tokens, themes, color systems | `01-DESIGN-SYSTEM.md` |
| 3 | **UX/Interaction Agent** | Layer 6 | Interactions, animations, accessibility | `02-UX-INTERACTION.md` |
| 4 | **Frontend Engineer Agent** | Layer 5 | React components, UI implementation | `03-FRONTEND-ENGINEER.md` |
| 5 | **Backend/API Agent** | Layer 4 | Business logic, API endpoints | `04-BACKEND-API.md` |
| 6 | **Database Architect Agent** | Layer 3 | Schema design, repositories, RLS | `05-DATABASE-ARCHITECT.md` |
| 7 | **AI/ML Agent** | Layer 2 | AI routing, prompts, context | `06-AI-ML.md` |
| 8 | **Security Agent** | Layer 1 | Auth, RLS, input sanitization | `07-SECURITY.md` |
| 9 | **DevOps/Infrastructure Agent** | Infrastructure | Deployment, monitoring, scaling | `08-DEVOPS-INFRA.md` |
| 10 | **QA/Testing Agent** | Cross-cutting | Testing, quality gates | `09-QA-TESTING.md` |
| 11 | **Content/Copy Agent** | Cross-cutting | Microcopy, user guidance | `10-CONTENT-COPY.md` |

---

## Layer Ownership Matrix

```
                    Design   UX       Frontend  Backend  Database  AI       Security
Layer               System   Interact Engineer  /API     Arch      /ML      Agent
--------------------------------------------------------------------------------
7 Design System     ADMIN    READ     READ      -        -         -        -
6 UX Interaction    READ     ADMIN    READ      -        -         -        -
5 Presentation      READ     READ     ADMIN     -        -         -        -
4 Logic             -        -        READ      ADMIN    READ      READ     READ
3 Data              -        -        -         READ     ADMIN     -        ADMIN
2 AI Expansion      -        -        -         READ     -         ADMIN    -
1 Security          READ     READ     READ      READ     ADMIN     -        ADMIN
```

**Legend:**
- **ADMIN**: Full read/write control
- **READ**: Can read/consume but not modify
- **-**: No direct access

---

## Communication Flow

### Standard Workflow

```
1. Lead Architect identifies need
   ↓
2. Lead assigns to appropriate agent(s)
   ↓
3. Agent(s) implement within their layer
   ↓
4. Cross-layer coordination via protocol
   ↓
5. QA Agent validates
   ↓
6. DevOps Agent deploys
```

### Cross-Layer Change Workflow

```
1. Change affects multiple layers
   ↓
2. Lead Architect coordinates
   ↓
3. All affected agents review
   ↓
4. Changes made in dependency order:
      Layer 7 → 6 → 5 → 4 → 3 → 2 → 1
   ↓
5. QA validates end-to-end
   ↓
6. Deploy
```

---

## Onboarding Process

### For New Agents Joining

1. **Read Mandatory Documentation** (90 minutes)
   - North Star documents
   - Architecture overview
   - Your layer specification
   - Communication protocol

2. **Confirm Understanding**
   - Send `type: "notify"` to Lead Architect
   - Confirm read order completion

3. **Await Assignment**
   - Lead Architect assigns first task
   - Task includes relevant documentation links

4. **Execute with Protocol**
   - Use communication protocol for all coordination
   - Follow documentation-first rule
   - Request approvals when needed

---

## Emergency Procedures

### Critical Security Issue

1. Security Agent identifies issue
2. Sends `type: "blocker"` to Lead Architect
3. All agents pause non-critical work
4. Security Agent implements fix
5. QA Agent emergency tests
6. DevOps Agent hotfixes production
7. Retroactive documentation within 24h

### Production Outage

1. Any agent detects outage
2. Sends `type: "blocker"` to all + Lead Architect
3. DevOps Agent leads response
4. Communication via emergency channel
5. Post-mortem and documentation after resolution

---

## Document Integrity

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Status:** ACTIVE  
**Owner:** Lead Architect (Cascade)  

**Updates:**
- New agent types added as needed
- Layer boundaries adjusted quarterly
- Communication protocol updates as needed

---

**This is the central coordination document. All agents must understand this ecosystem structure.**
