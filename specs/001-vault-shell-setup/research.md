# Research: Phase 0 Clickable Shell and Vault Setup

## Decision 1: Adopt the technical stack baseline from the technical spec

- Decision: Use Tauri 2 + React + TypeScript + Vite as the implementation baseline for Phase 0 shell and vault flows.
- Rationale: This matches the approved technical direction, preserves native filesystem and dialog access through Tauri, and keeps product logic in TypeScript.
- Alternatives considered:
  - Electron + React + TypeScript (larger runtime, not selected for MVP baseline).
  - Pure web app (cannot satisfy local-folder desktop requirements cleanly).

## Decision 2: Bootstrap canonical data model baseline now

- Decision: Create `docs/data-model.md` as the canonical model baseline in this planning phase because it was missing.
- Rationale: The plan workflow requires a canonical model for delta tracking. Creating it now prevents ambiguity for later phases.
- Alternatives considered:
  - Defer canonical model creation to a later phase (rejected; blocks clear delta tracking now).
  - Keep model only in feature folder (rejected; violates canonical-source requirement).

## Decision 3: Use strict compatibility validation for existing vault open

- Decision: A folder is compatible only when required CRM directories and a valid vault configuration artifact are both present.
- Rationale: Strict validation avoids accidental writes to unrelated directories and makes open behavior deterministic.
- Alternatives considered:
  - Auto-repair missing config on open (rejected; can hide data issues).
  - Open any folder and infer compatibility dynamically (rejected; unsafe and ambiguous).

## Decision 4: Apply best-effort rollback for partial initialization failures

- Decision: On initialization failure, roll back artifacts created by the current attempt; if rollback is incomplete, mark vault invalid and provide recovery guidance.
- Rationale: Balances safety and practicality under filesystem edge cases where full atomic operations may not be possible.
- Alternatives considered:
  - No rollback (rejected; leaves avoidable partial state).
  - Require full atomic initialization only (rejected; too brittle in heterogeneous local storage contexts).

## Decision 5: Represent app-service contract in OpenAPI format

- Decision: Define vault lifecycle operations in an OpenAPI contract (`contracts/vault-management.openapi.yaml`) as a testable service boundary.
- Rationale: Keeps user-action-to-contract mapping explicit for future implementation and contract tests, even though transport is internal desktop IPC.
- Alternatives considered:
  - No formal contract until implementation (rejected; weakens plan-level traceability).
  - GraphQL schema for Phase 0 (rejected; not needed for limited lifecycle commands).

## Decision 6: Settings corruption behavior should degrade gracefully

- Decision: Missing/unreadable/corrupted app settings reset to defaults, log the issue, and continue to vault selection.
- Rationale: Preserves startup usability while preventing silent reuse of broken settings state.
- Alternatives considered:
  - Block startup until manual fix (rejected; poor UX and unnecessary downtime).
  - Ignore errors silently (rejected; hides reliability issues and complicates support).
