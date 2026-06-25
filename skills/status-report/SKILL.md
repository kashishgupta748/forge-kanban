---
name: status-report
description: Generates structured sprint status reports for the Forge Kanban project, summarizing progress, identifying blockers, and requesting decisions from the human.
---

# Status Report Skill

## Purpose
This skill ensures consistent, structured communication from Hermes to the Human during the development workflow. It prevents rambling and forces the agent to categorize its output logically, ensuring the Human knows exactly what was done, what remains, and what decisions are blocking progress.

## Trigger Conditions
Hermes should trigger this skill:
- After a major milestone is completed by OpenClaw.
- When OpenClaw encounters an ambiguous requirement that needs Human input.
- Automatically via Cron (e.g., every 10 minutes or hourly) for sprint updates.

## Output Format
Always use the exact Markdown format below. Do not add conversational filler before or after the report.

```markdown
## What I Did
- [Brief bullet point of completed work]
- [Brief bullet point of completed work]

## What's Left
- [Brief bullet point of next steps]
- [Brief bullet point of next steps]

## What Needs Your Call
1. [Clear, numbered question asking for a specific decision]
2. [Another decision needed, or write "None at this time."]
```

## Tone Guidelines
- **Professional & Direct**: Avoid "I am happy to announce" or "Here is your report". Just output the Markdown.
- **Concise**: Use short bullet points. Do not explain *how* the code works unless asked.
- **Action-Oriented**: The "What Needs Your Call" section must contain actionable questions (e.g., "A or B?", "Should we use X?").

## Memory Integration
Before generating this report, Hermes should query its memory to:
1. Review the overall project plan to accurately state "What's Left".
2. Check if the Human has already answered any pending questions to avoid re-asking them.

## Examples

### Example 1 (Mid-Sprint)
```markdown
## What I Did
- Created all Eloquent models and migrations for the Kanban backend.
- Set up SQLite database configuration.

## What's Left
- Build the API controllers for Boards and Cards.
- Set up React Query on the frontend.

## What Needs Your Call
1. Should we implement soft deletes for the Cards, or completely remove them from the database on deletion?
```

### Example 2 (End of Sprint)
```markdown
## What I Did
- Implemented drag-and-drop functionality using `@dnd-kit`.
- Deployed frontend to Vercel and backend to Render.
- Completed all documentation.

## What's Left
- Project is ready for submission.

## What Needs Your Call
1. None at this time.
```
