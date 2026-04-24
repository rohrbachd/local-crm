# Implementation Plan: Phase 0 Clickable Shell and Vault Setup

**Branch**: `[001-vault-shell-setup]` | **Date**: 2026-04-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `D:\Development\local-crm\specs\001-vault-shell-setup\spec.md`

## Summary

Deliver the first working Local-First CRM slice: a desktop shell that can create/open a CRM vault, validate compatibility, persist the last vault pointer, and recover safely from startup and initialization failures. The plan uses the stack and architecture direction defined in the technical specification, strict compatibility gates from clarifications, and explicit best-effort rollback rules for partial writes.

## Technical Context

**Language/Version**: TypeScript (React UI and application services) + Rust (Tauri native commands), as defined in `docs/local_first_crm_technical_spec.md`  
**Primary Dependencies**: Tauri 2, React, Vite, filesystem/dialog/opener capabilities, schema validation for local config and vault artifact parsing  
**Storage**: Local filesystem vault (`companies`, `contacts`, `leads`, `interactions`, `attachments`, `config`, `indexes`) + app-level settings file outside vault  
**Testing**: Vitest (unit), React Testing Library (component), Playwright (end-to-end), plus manual acceptance checks from Phase 0 demo  
**Target Platform**: Desktop application; Windows-first MVP target with architecture compatible with macOS/Linux later  
**Project Type**: Desktop client (native shell + web UI)  
**Performance Goals**: Initial create/open flow completes in <= 2 minutes for first-time users; app relaunch to dashboard <= 5 seconds on normal local storage  
**Constraints**: Offline-capable for core CRM workflows, explicit confirmation before writing into non-empty folders, no silent overwrite of incompatible state, best-effort rollback on failed initialization  
**Scale/Scope**: Phase 0 only; shell + vault lifecycle + dashboard snapshot (no entity CRUD), expected empty-to-small datasets in this phase

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Research Gate

- **I. Clear Scope and Requirements**: PASS. Scope is bounded to Phase 0 and links to roadmap/PRD/technical spec are present in spec.
- **II. Maintainable Architecture**: PASS. Plan keeps domain, storage, and shell boundaries explicit and avoids hidden shared state.
- **III. Quality and Testing**: PASS. Independent testability remains mapped to user stories and acceptance scenarios.
- **IV. Security and Privacy**: PASS. Validation, least-privilege folder handling, and safe startup fallback are explicit.
- **V. Automation and Documentation**: PASS. This plan generates research/data model/contracts/quickstart artifacts and updates agent context.
- **Exceptions**: None.

### Post-Design Gate

- **Result**: PASS.
- `research.md`, `data-model.md`, `contracts/`, and `quickstart.md` fully defined.
- Canonical model baseline created and aligned (`docs/data-model.md`).
- No constitution violations introduced by design artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/001-vault-shell-setup/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- vault-management.openapi.yaml
`-- tasks.md
```

### Source Code (repository root)

```text
apps/
`-- desktop/
    |-- src/
    |   |-- app/
    |   |-- features/
    |   |   |-- dashboard/
    |   |   |-- companies/
    |   |   |-- contacts/
    |   |   |-- leads/
    |   |   `-- settings/
    |   `-- shared/
    `-- src-tauri/
        `-- src/
            `-- commands/

docs/
|-- local_first_crm_mvp_roadmap.md
|-- local_first_crm_mvp_prd.md
|-- local_first_crm_technical_spec.md
`-- data-model.md

specs/
`-- 001-vault-shell-setup/
```

**Structure Decision**: Adopt the desktop app structure proposed in `docs/local_first_crm_technical_spec.md` (`apps/desktop` + `src-tauri`) to keep UI, domain services, and native filesystem boundaries explicit from the first feature.

## Phase 0: Research and Decisions

- Outputs documented in [research.md](./research.md).
- All technical unknowns from this plan are resolved; no remaining `NEEDS CLARIFICATION` items.
- Key decisions include canonical data model bootstrap, compatibility checks, rollback strategy, and contract boundary style.

## Phase 1: Design and Contracts

- Data model defined in [data-model.md](./data-model.md), including `Delta vs Canonical`.
- Canonical model baseline created/updated at `D:\Development\local-crm\docs\data-model.md`.
- Contract defined in `D:\Development\local-crm\specs\001-vault-shell-setup\contracts\vault-management.openapi.yaml`.
- Validation and demo flow defined in [quickstart.md](./quickstart.md).
- Agent context updated via:
  - `.specify/scripts/powershell/update-agent-context.ps1 -AgentType codex`

## Complexity Tracking

No constitution violations requiring justification.
