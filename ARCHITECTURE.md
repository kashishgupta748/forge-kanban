# 🏛️ Forge Kanban — System Architecture

> Deep-dive technical reference for the Forge Kanban agent system, application architecture, database design, and deployment topology.

---

## 1. System Overview

Forge Kanban is built by a **Human-in-the-Loop (HITL) multi-agent system** composed of two specialized AI agents:

- **Hermes** (Brain) — a reasoning and orchestration agent powered by Gemini 2.5 Flash
- **OpenClaw** (Hands) — a code execution agent powered by qwen2.5-coder:32b

The human operator communicates exclusively via Slack. They provide high-level intent ("add tag support") and respond to explicit decision requests. All planning, decomposition, code generation, testing, and deployment is handled autonomously by the agents.

The system is designed around four principles:
1. **Specialization** — planning model and coding model are different, chosen for their strengths
2. **Persistent memory** — decisions from Session 1 are available in Session 50
3. **Structured communication** — agents use typed JSON task objects, not freeform chat
4. **Human escalation** — agents know when to stop and ask; they never guess on architectural decisions

---

## 2. Component Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FORGE AGENT SYSTEM                            │
│                                                                        │
│   👤 Human Operator                                                    │
│        │  (Slack DM / channel)                                         │
│        │                                                               │
│        ▼                                                               │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │  🧠 HERMES  (Brain Agent)                                    │     │
│   │                                                               │     │
│   │   Primary Model  : Gemini 2.5 Flash (Google AI Studio)       │     │
│   │   Fallback Model : Groq llama3-70b-8192                      │     │
│   │                                                               │     │
│   │   Responsibilities:                                           │     │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │     │
│   │   │    Task      │  │   Memory     │  │  Slack Comms     │  │     │
│   │   │Decomposition │  │  Manager     │  │  (post/receive)  │  │     │
│   │   └──────────────┘  └──────────────┘  └──────────────────┘  │     │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │     │
│   │   │   Model      │  │   Sprint     │  │  SKILL Executor  │  │     │
│   │   │   Router     │  │   Tracker    │  │ (status-report)  │  │     │
│   │   └──────────────┘  └──────────────┘  └──────────────────┘  │     │
│   └───────────────────────────┬─────────────────────────────────┘     │
│                                │  JSON Task Objects                     │
│                                │  { type, file, instruction, context } │
│                                ▼                                        │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │  🤖 OPENCLAW  (Hands Agent)                                  │     │
│   │                                                               │     │
│   │   Primary Model  : qwen2.5-coder:32b (Ollama, local)         │     │
│   │   Fallback Model : Groq mixtral-8x7b-32768                   │     │
│   │                                                               │     │
│   │   Capabilities:                                               │     │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │     │
│   │   │    Code      │  │  Terminal    │  │  Git Operations  │  │     │
│   │   │  Generation  │  │  Commands   │  │  (add/commit/    │  │     │
│   │   │  & Writing   │  │  (migrate,  │  │   push/PR)       │  │     │
│   │   │              │  │   test, npm)│  │                  │  │     │
│   │   └──────────────┘  └──────────────┘  └──────────────────┘  │     │
│   │   ┌──────────────┐  ┌──────────────┐                         │     │
│   │   │    Build     │  │   Deploy     │                         │     │
│   │   │   Triggers   │  │   Triggers   │                         │     │
│   │   └──────────────┘  └──────────────┘                         │     │
│   └───────────────────────────┬─────────────────────────────────┘     │
│                                │  git push (via SSH)                    │
│                                ▼                                        │
│                      ┌──────────────────┐                              │
│                      │  GitHub Repo     │                              │
│                      │  (source truth)  │                              │
│                      │  + GitHub Actions│                              │
│                      └────────┬─────────┘                              │
│                               │  CI/CD webhooks                        │
│                    ┌──────────┴──────────┐                             │
│                    ▼                     ▼                              │
│            ┌──────────────┐    ┌──────────────────┐                   │
│            │   Vercel     │    │     Render       │                   │
│            │  (Frontend)  │    │    (Backend)     │                   │
│            │  React/Vite  │    │   Laravel 12     │                   │
│            │  Edge CDN    │    │   PHP 8.3        │                   │
│            │  Free tier   │    │   SQLite         │                   │
│            └──────────────┘    └──────────────────┘                   │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Brain (Hermes) — Responsibilities

### 3.1 Task Decomposition and Planning

Hermes receives a high-level intent and breaks it into atomic, executable tasks:

```
Input:  "Add due date support to cards"
Output: [
  { id: "T-01", type: "migration", instruction: "Add due_date timestamp nullable to cards table" },
  { id: "T-02", type: "model",     instruction: "Add getDueDateFormattedAttribute accessor to Card model" },
  { id: "T-03", type: "resource",  instruction: "Include due_date and is_overdue in CardResource" },
  { id: "T-04", type: "frontend",  instruction: "Add DatePicker to CardModal.tsx, bind to due_date" },
  { id: "T-05", type: "frontend",  instruction: "Add red border to Card.tsx when is_overdue === true" }
]
```

Each task object includes:
- `id` — sequential, used for dependency ordering
- `type` — migration | model | controller | resource | frontend | test | command
- `instruction` — natural language instruction for OpenClaw
- `context` — relevant memory facts injected at dispatch time
- `depends_on` — array of task IDs that must complete first

### 3.2 Memory Management

Hermes reads from and writes to `agent-memory.json` at key decision points:

**Write triggers:**
- After human confirms an architectural decision
- After a schema is finalized
- After a design/color decision is made
- After a naming convention is established

**Read triggers:**
- At the start of every new session
- Before dispatching any task (to inject relevant context)
- Before generating a status report

### 3.3 Model Routing Decisions

Hermes makes routing decisions for every task:

```
IF task.type IN ['planning', 'decomposition', 'memory', 'status_report']:
    model = HERMES_MODEL (Gemini 2.5 Flash)
    IF api_error OR rate_limit:
        model = HERMES_FALLBACK_MODEL (Groq llama3-70b)

IF task.type IN ['code', 'migration', 'test', 'command']:
    model = OPENCLAW_MODEL (qwen2.5-coder:32b)
    IF ollama_unavailable:
        model = OPENCLAW_FALLBACK_MODEL (Groq mixtral)
```

### 3.4 Slack Communication

Hermes uses the Slack API for two-way communication:

- **Incoming:** Reads new messages from the designated channel/DM via Event Subscriptions
- **Outgoing:** Posts status reports, clarifying questions, and confirmations
- **Threading:** All responses to a task thread within the same Slack thread for traceability
- **Formatting:** Uses Slack Block Kit for structured status reports

### 3.5 Sprint Progress Tracking

Hermes maintains an in-memory sprint object, persisted to `sprint-state.json`:

```json
{
  "sprint": "Week-3",
  "start_date": "2026-06-23",
  "total_tasks": 20,
  "completed_tasks": 14,
  "in_progress": 1,
  "blocked": 0,
  "last_update": "2026-06-25T10:40:00Z",
  "velocity": 2.8
}
```

### 3.6 SKILL Execution — status-report

When Hermes needs to post a status report, it invokes the `status-report` SKILL (see `/skills/status-report/SKILL.md`). This SKILL enforces the three-section format, memory recall protocol, and Slack posting procedure.

---

## 4. Hands (OpenClaw) — Responsibilities

### 4.1 Code Generation and File Writing

OpenClaw receives a typed task and generates the appropriate code using qwen2.5-coder:32b:

- Full file generation (not just snippets) to avoid merge conflicts
- Reads existing file before rewriting (context-aware generation)
- Validates PHP syntax with `php -l` before writing
- Validates TypeScript with `tsc --noEmit` after writing

### 4.2 Terminal Command Execution

OpenClaw executes system commands within an allowed command whitelist:

```
ALLOWED COMMANDS:
  php artisan migrate
  php artisan migrate:rollback
  php artisan db:seed
  php artisan test
  php artisan config:cache
  php artisan route:cache
  composer install
  composer require {package}
  npm install
  npm run build
  npm run test
  git add
  git commit
  git push
  git checkout -b
```

Destructive commands (`rm -rf`, `DROP TABLE`, etc.) are blocked and escalated to Hermes for human approval.

### 4.3 Git Operations

After completing a task or task group, OpenClaw commits:

```bash
git add -A
git commit -m "feat(cards): add due_date field and overdue detection [T-01 T-02 T-03]"
git push origin main
```

Commit messages follow Conventional Commits with task IDs for traceability.

### 4.4 Test Execution

After writing backend code, OpenClaw runs the relevant test:

```bash
php artisan test --filter=CardTest
```

If tests fail, OpenClaw feeds the failure output back to qwen2.5-coder for a fix attempt (max 3 retries before escalating to Hermes).

### 4.5 Build and Deploy Triggers

After pushing to GitHub, OpenClaw waits for CI to pass, then triggers:

```bash
# Vercel auto-deploys on push to main (webhook)
# Render auto-deploys on push to main (webhook)
# OpenClaw monitors deploy status via Render/Vercel APIs
```

---

## 5. Model Routing — Detailed Specification

### 5.1 Routing Table

| Task Category | Primary Model | Fallback Model | Rationale |
|--------------|--------------|----------------|-----------|
| Task decomposition | Gemini 2.5 Flash | Groq llama3-70b | Long-context reasoning |
| Memory management | Gemini 2.5 Flash | Groq llama3-70b | Structured JSON output |
| Status report generation | Gemini 2.5 Flash | Groq llama3-70b | Language quality |
| PHP code generation | qwen2.5-coder:32b | Groq mixtral | Code specialization |
| TypeScript/React generation | qwen2.5-coder:32b | Groq mixtral | Code specialization |
| SQL migration generation | qwen2.5-coder:32b | Groq mixtral | Code specialization |
| Test writing | qwen2.5-coder:32b | Groq mixtral | Code specialization |
| Shell command generation | qwen2.5-coder:32b | Groq mixtral | Command precision |

### 5.2 Routing Criteria

**Task Type** — Most important criterion. Code tasks always go to qwen2.5-coder; reasoning tasks always go to Gemini 2.5 Flash.

**Context Length** — If the full context (memory + codebase excerpt + instruction) exceeds 128K tokens, Gemini 2.5 Flash is required (1M context window). Groq fallback has 8K-32K context limits.

**Latency Requirements** — Interactive responses (user is waiting in Slack) prefer Groq (faster). Background tasks prefer Gemini or Ollama (quality over speed).

**Cost** — Development: all free tiers. Production: Gemini API charges apply; Ollama is always free. Routing logic tracks monthly spend via `usage-tracker.json`.

### 5.3 Failover Sequence

```
Primary fails → wait 2s → retry primary
Primary fails again → switch to fallback → log failover
Fallback fails → pause task → notify Hermes
Hermes notified → post to Slack: "⚠️ Model unavailable. Pausing until resolved."
```

---

## 6. Memory System — Detailed Specification

### 6.1 What Gets Stored

| Memory Key Pattern | Example | Stored When |
|-------------------|---------|-------------|
| `db_schema_{table}` | Cards table column definitions | Schema migration confirmed |
| `api_conventions` | URL structure, response envelope | API design session |
| `color_system` | Tailwind palette decisions | UI color decisions |
| `component_patterns` | React conventions, naming | Frontend architecture session |
| `auth_pattern` | Token storage, Axios config | Auth implementation |
| `naming_convention_{domain}` | Model/controller naming rules | First file created |
| `test_strategy` | PHPUnit feature test location | First test written |
| `deploy_config` | Render/Vercel env var names | Deployment setup |

### 6.2 Storage Format

```json
{
  "project": "forge-kanban",
  "schema_version": "1.0",
  "memories": [
    {
      "key": "string (namespaced)",
      "value": "string (detailed fact)",
      "tags": ["schema", "backend"],
      "stored_at": "ISO-8601 timestamp",
      "updated_at": "ISO-8601 timestamp",
      "context": "string (why this was stored)",
      "confidence": "high | medium | low"
    }
  ]
}
```

### 6.3 Retrieval Strategy

Retrieval is tag-based with keyword matching:

```
Task: "Add checklist to card"
Tags extracted: ["cards", "frontend", "schema"]

Retrieved memories:
  - db_schema_cards (tag: schema, cards)
  - component_patterns (tag: frontend)
  - api_conventions (tag: backend)
  - color_system (tag: frontend) ← only if visual component involved
```

Semantic embedding search (via local `nomic-embed-text` model) will be added in Sprint 4 for more accurate retrieval on larger memory stores.

### 6.4 Memory File Location

```
forge-kanban/
└── agent-data/
    ├── agent-memory.json       ← persistent cross-session memory
    ├── sprint-state.json       ← current sprint progress
    └── usage-tracker.json      ← API usage and cost tracking
```

### 6.5 Memory Pruning

After 30 days, low-confidence memories are archived to `agent-data/memory-archive/`. High-confidence memories are kept indefinitely. Memory size is capped at 500 entries before archiving is triggered.

---

## 7. Kanban Application Architecture

### 7.1 Backend — Laravel 12

```
app/
├── Http/
│   ├── Controllers/Api/V1/
│   │   ├── AuthController.php
│   │   ├── BoardController.php
│   │   ├── ListController.php
│   │   ├── CardController.php
│   │   ├── TagController.php
│   │   ├── CommentController.php
│   │   ├── MemberController.php
│   │   └── DashboardController.php
│   ├── Resources/
│   │   ├── BoardResource.php
│   │   ├── ListResource.php
│   │   ├── CardResource.php
│   │   ├── TagResource.php
│   │   └── CommentResource.php
│   └── Middleware/
│       └── EnsureBoardMember.php
├── Models/
│   ├── User.php
│   ├── Board.php
│   ├── BoardList.php
│   ├── Card.php
│   ├── Tag.php
│   ├── Comment.php
│   └── Activity.php
└── Policies/
    ├── BoardPolicy.php
    └── CardPolicy.php
```

### 7.2 Frontend — React 18 + TypeScript

```
src/
├── api/
│   ├── client.ts           ← Axios instance with interceptors
│   ├── boards.ts           ← Board API functions
│   ├── cards.ts            ← Card API functions
│   └── auth.ts             ← Auth API functions
├── components/
│   ├── Board/
│   │   ├── Board.tsx
│   │   ├── BoardColumn.tsx
│   │   └── BoardHeader.tsx
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── CardModal.tsx
│   │   ├── CardBadge.tsx
│   │   └── CardDueDate.tsx
│   ├── Tag/
│   │   ├── TagBadge.tsx
│   │   └── TagPicker.tsx
│   ├── Comment/
│   │   ├── CommentList.tsx
│   │   └── CommentForm.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Avatar.tsx
├── hooks/
│   ├── useBoards.ts
│   ├── useCards.ts
│   └── useDragDrop.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── BoardPage.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── stores/
│   └── authStore.ts        ← Zustand auth state
└── types/
    ├── board.ts
    ├── card.ts
    └── user.ts
```

### 7.3 Data Flow

```
User Action (click, drag, type)
       │
       ▼
React Component
       │ calls mutation
       ▼
TanStack Query useMutation
       │ calls API function
       ▼
Axios instance (with Bearer token)
       │ HTTP request
       ▼
Laravel Router → Controller → Model → SQLite
       │ Eloquent query
       ▼
JsonResource (transforms model)
       │ JSON response { data: {...} }
       ▼
TanStack Query (updates cache)
       │ invalidates queries
       ▼
React re-renders with fresh data
```

---

## 8. Database Schema

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA (ERD)                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐       ┌───────────────────┐       ┌───────────────┐
│  users   │       │  board_user       │       │    boards     │
├──────────┤       ├───────────────────┤       ├───────────────┤
│ id (PK)  │──┐    │ board_id (FK)     │──────▶│ id (PK)       │
│ name     │  │    │ user_id  (FK) ────│──┐    │ title         │
│ email    │  └───▶│ role              │  │    │ description   │
│ password │       └───────────────────┘  │    │ background    │
│ avatar   │                              └───▶│ owner_id (FK) │
│ created_at│                                  │ created_at    │
│ updated_at│                                  │ updated_at    │
└──────────┘                                   └──────┬────────┘
                                                      │ 1
                                                      │
                                                   ┌──┴─────────────┐
                                                   │  board_lists   │
                                                   ├────────────────┤
                                                   │ id (PK)        │
                                                   │ board_id (FK)  │
                                                   │ title          │
                                                   │ position (int) │
                                                   │ created_at     │
                                                   │ updated_at     │
                                                   └──────┬─────────┘
                                                          │ 1
                                                          │
                                        ┌────────────────▼──────────────┐
                                        │            cards               │
                                        ├───────────────────────────────┤
                                        │ id (PK)                        │
                                        │ list_id (FK)                   │
                                        │ title                          │
                                        │ description (text, nullable)   │
                                        │ position (int)                 │
                                        │ due_date (timestamp, nullable) │
                                        │ created_by (FK users)          │
                                        │ created_at                     │
                                        │ updated_at                     │
                                        └──┬───────────────┬────────────┘
                                           │               │
                        ┌──────────────────┘               └───────────────────┐
                        │                                                        │
               ┌────────▼──────────┐                                  ┌────────▼───────┐
               │   card_user       │                                  │   card_tag     │
               │   (assignees)     │                                  │   (pivot)      │
               ├───────────────────┤                                  ├────────────────┤
               │ card_id (FK)      │                                  │ card_id (FK)   │
               │ user_id (FK)      │                                  │ tag_id (FK)────┼──┐
               └───────────────────┘                                  └────────────────┘  │
                                                                                           │
                                                                              ┌────────────▼┐
                                                                              │    tags      │
                                                                              ├─────────────┤
                                                                              │ id (PK)      │
                                                                              │ board_id (FK)│
                                                                              │ name         │
                                                                              │ color        │
                                                                              │ created_at   │
                                                                              └─────────────┘

 ┌────────────────────────────────────────────────────────────┐
 │              SUPPORTING TABLES                              │
 └────────────────────────────────────────────────────────────┘

 ┌─────────────────────┐         ┌──────────────────────────┐
 │     comments        │         │       activities          │
 ├─────────────────────┤         ├──────────────────────────┤
 │ id (PK)             │         │ id (PK)                  │
 │ card_id (FK)        │         │ board_id (FK)            │
 │ user_id (FK)        │         │ card_id (FK, nullable)   │
 │ content (text)      │         │ user_id (FK)             │
 │ created_at          │         │ type (enum)              │
 │ updated_at          │         │ data (JSON)              │
 └─────────────────────┘         │ created_at               │
                                  └──────────────────────────┘
```

### Entity Relationships Summary

| Relationship | Type | Notes |
|-------------|------|-------|
| User ↔ Board | Many-to-Many | via `board_user` pivot with `role` column |
| Board → BoardList | One-to-Many | ordered by `position` |
| BoardList → Card | One-to-Many | ordered by `position` |
| Card ↔ User | Many-to-Many | via `card_user` (assignees) |
| Card ↔ Tag | Many-to-Many | via `card_tag` pivot |
| Card → Comment | One-to-Many | |
| Board → Activity | One-to-Many | soft activity log |
| Tag → Board | Many-to-One | tags are board-scoped |

---

## 9. API Design

### 9.1 RESTful Conventions

- **Base URL:** `/api/v1/`
- **Auth:** `Authorization: Bearer {token}` header
- **Content-Type:** `application/json`
- **Versioning:** URL path versioning (`/v1/`, `/v2/`)

### 9.2 Response Envelope

**Single resource:**
```json
{
  "data": {
    "id": 1,
    "title": "My Card",
    "description": "Card description",
    "due_date": "2026-06-30T00:00:00Z",
    "is_overdue": false,
    "tags": [...]
  }
}
```

**Collection:**
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 20,
    "total": 58
  }
}
```

**Error:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["The title field is required."]
  }
}
```

### 9.3 HTTP Status Codes

| Code | Used For |
|------|----------|
| `200 OK` | Successful GET, PUT |
| `201 Created` | Successful POST |
| `204 No Content` | Successful DELETE |
| `401 Unauthorized` | Missing or invalid token |
| `403 Forbidden` | Authenticated but not authorized |
| `404 Not Found` | Resource doesn't exist |
| `422 Unprocessable Entity` | Validation failed |
| `500 Internal Server Error` | Unexpected server error |

---

## 10. Deployment Architecture

### 10.1 Infrastructure Topology

```
Developer Machine
      │
      │ git push
      ▼
┌────────────────────────────────────────┐
│           GitHub                        │
│  Repository: forge-kanban               │
│  Branch: main (production)              │
│  Branch: develop (staging)              │
│                                          │
│  GitHub Actions:                         │
│  ├─ PHP lint (Pint)                     │
│  ├─ PHPUnit tests                       │
│  ├─ TypeScript type-check               │
│  ├─ ESLint                              │
│  └─ Vitest frontend tests               │
└──────────────┬───────────────┬─────────┘
               │               │
               │ webhook        │ webhook
               ▼               ▼
    ┌──────────────┐  ┌──────────────────┐
    │   Vercel     │  │     Render       │
    │              │  │                  │
    │  Builds:     │  │  Builds:         │
    │  npm run     │  │  composer install│
    │  build       │  │  artisan migrate │
    │              │  │  config:cache    │
    │  Serves:     │  │                  │
    │  dist/ as    │  │  Serves:         │
    │  static SPA  │  │  php artisan     │
    │  via CDN     │  │  serve           │
    │              │  │                  │
    │  URL:        │  │  URL:            │
    │  forge-      │  │  forge-kanban-   │
    │  kanban.     │  │  api.onrender    │
    │  vercel.app  │  │  .com            │
    └──────────────┘  └──────────────────┘
```

### 10.2 Free Tier Constraints

| Service | Constraint | Mitigation |
|---------|-----------|-----------|
| Render (free) | Spins down after 15min inactivity | UptimeRobot pings /api/health every 10min |
| Render (free) | 750 hours/month compute | Sufficient for development/demo |
| Vercel (free) | 100GB bandwidth/month | Static files via CDN, minimal bandwidth |
| Vercel (free) | 100 deployments/day | Well within limits for development |
| SQLite | Not replicated | Acceptable for demo; migrate to Postgres for production |

### 10.3 GitHub Actions CI/CD Pipeline

```yaml
# .github/workflows/ci.yml (condensed view)

on: [push, pull_request]

jobs:
  backend:
    - composer install
    - php artisan key:generate
    - php artisan migrate
    - php artisan test
    - vendor/bin/pint --test  # lint check

  frontend:
    - npm install
    - npm run type-check
    - npm run lint
    - npm run test
    - npm run build
```

---

## 11. Autonomous Jobs

### 11.1 Cron Schedule

```
# crontab -l

# Sprint update every 10 minutes during work hours
*/10 9-18 * * 1-5 php /forge/artisan hermes:sprint-update

# Daily memory consolidation (clean up low-confidence entries)
0 23 * * * php /forge/artisan hermes:consolidate-memory

# Weekly sprint reset on Monday 9 AM
0 9 * * 1 php /forge/artisan hermes:new-sprint
```

### 11.2 Sprint Update Format

The `hermes:sprint-update` command invokes the `status-report` SKILL and posts to Slack:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SPRINT UPDATE — {date} {time}
Sprint: {name} | Progress: {done}/{total} ({pct}%)
━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ What I Did
{bullet list}

🔲 What's Left
{bullet list}

❓ What Needs Your Call
{numbered list}

⚡ Next action: {next_task_description}
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 11.3 Slack Message Format (Block Kit JSON)

```json
{
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "📊 Sprint Update" }
    },
    {
      "type": "section",
      "text": { "type": "mrkdwn", "text": "*Sprint: Week 3* | Progress: 14/20 (70%)" }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": { "type": "mrkdwn", "text": "*✅ What I Did*\n• Created TagBadge.tsx\n• Updated CardResource" }
    },
    {
      "type": "section",
      "text": { "type": "mrkdwn", "text": "*🔲 What's Left*\n• Tag filtering\n• E2E tests" }
    },
    {
      "type": "section",
      "text": { "type": "mrkdwn", "text": "*❓ What Needs Your Call*\n1. Tag limit per card?\n2. Comment deletion permissions?" }
    }
  ]
}
```

---

*Architecture document maintained by Hermes. Last updated: 2026-06-25.*
