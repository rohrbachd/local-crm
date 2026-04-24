---
description: Validate an implemented feature against the spec, design rules, and required quality gates.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Validation Steps

1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks` from repo root and parse JSON for FEATURE_DIR and AVAILABLE_DOCS list.
   - All file paths must be absolute.
   - For single quotes in args like "I'm Groot", use escape syntax: e.g. `I'\''m Groot` (or double-quote if possible: "I'm Groot").

2. **Load context** (from FEATURE_DIR):
   - **REQUIRED**: `spec.md` (requirements, success criteria, edge cases)
   - **REQUIRED**: `plan.md`
   - **REQUIRED**: `tasks.md`
   - **IF EXISTS**: `checklists/*.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`
   - **ALSO**: `docs/engineering/rules/unclebob_rules.schema.json`, `docs/engineering/rules/unclebob_rules.v0.json`, `.specify/memory/constitution.md`

3. **Requirement coverage analysis**:
   - Extract FR-_ and SC-_ entries from `spec.md`.
   - Map each requirement to validating tests (unit/integration/contract).
   - Mark each FR/SC as: **Covered**, **Partially Covered**, or **Not Covered**.
   - Note any missing tests or unclear coverage.

4. **Design rule alignment check**:
   - Review implementation against constitution rules and Uncle Bob rule catalog.
   - Record any violations or open questions.
   - If compliance cannot be verified, mark as **Needs Review** with a short reason.

4.5 **Uncle Bob rule verification (required)**:

- Run `npm run guardrails` and map results to CA-CYCLE-001 and CC-FMT-001.
- If dependency-cruiser/arch rules exist, run them and map to CA-DEP-001/CA-PORT-001.
- For each rule, record evidence or mark "Needs Review" (no evidence).
- If major issues are found, log them in `docs/unclebob-followups.md`.

5. **Create Uncle Bob rules checklist**:
   - Create or update `FEATURE_DIR/checklists/unclebob-rules.md`.
   - Base checklist items on `docs/engineering/rules/unclebob_rules.v0.json` (validate against schema).
   - Include one checkbox per rule with: rule ID, title, severity.
   - Check off items only when verified; otherwise leave unchecked with a short note.
   - Link this checklist from `FEATURE_DIR/checklists/validation.md` in the Notes section.

6. **Create validation checklist**:
   - Create or update `FEATURE_DIR/checklists/validation.md`.
   - Use template style from `.specify/templates/checklist-template.md`.
   - Checklist must include:
     - FR coverage completeness
     - SC coverage completeness
     - Edge case coverage
     - Constitution alignment
     - Uncle Bob rule alignment (summary of `checklists/unclebob-rules.md`)
     - Lint, test, build status
     - Quickstart verification status (if present)
   - Check off items only if validated.

7. **Run quality gates** (from repo root):
   - `npm run lint`
   - `npm test`
   - `npm run build`
   - Capture pass/fail and key output notes.

8. **Report**:
   - Provide tables for:
     - Requirements coverage (FR/SC -> tests, status)
     - Lint/Test/Build results
     - Constitution/UncleBob alignment status
     - Uncle Bob rules checklist status (total/complete/remaining)
     - Validation checklist summary (total/complete/incomplete)
   - Clearly call out gaps or skipped checks.

9. **Close out**:
   - If any gates fail or coverage gaps remain, list required follow-up actions.
   - If all gates pass and coverage is complete, state that validation succeeded.
