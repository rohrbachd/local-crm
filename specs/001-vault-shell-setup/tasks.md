# Tasks: Phase 0 Clickable Shell and Vault Setup

**Input**: Design documents from `/specs/001-vault-shell-setup/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/vault-management.openapi.yaml, quickstart.md

**Tests**: Include unit, component, contract-aligned, integration, and performance validation tests because Phase 0 requires happy-path and failure-path coverage.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on unfinished tasks)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`)
- All tasks include concrete file paths

## Path Conventions

- Desktop app source: `apps/desktop/src/`
- Tauri/native source: `apps/desktop/src-tauri/src/`
- Tests: `apps/desktop/tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the desktop project shell, toolchain, and baseline automation.

- [X] T001 Create desktop project directories in `apps/desktop/src/`, `apps/desktop/src-tauri/src/`, and `apps/desktop/tests/`
- [X] T002 Initialize desktop app package and scripts in `apps/desktop/package.json`
- [X] T003 [P] Configure TypeScript and Vite settings in `apps/desktop/tsconfig.json` and `apps/desktop/vite.config.ts`
- [X] T004 [P] Configure Tauri app baseline in `apps/desktop/src-tauri/tauri.conf.json` and `apps/desktop/src-tauri/src/main.rs`
- [X] T005 [P] Configure linting and formatting in `apps/desktop/eslint.config.js` and `apps/desktop/.prettierrc`
- [X] T006 [P] Configure test runners in `apps/desktop/vitest.config.ts`, `apps/desktop/playwright.config.ts`, and `apps/desktop/tests/setup.ts`
- [X] T007 Configure CI workflow to run build/lint/tests in `.github/workflows/desktop-ci.yml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared models, validation, error plumbing, and least-privilege guardrails required by all user stories.

**WARNING**: No user story implementation starts before this phase is complete.

- [X] T008 Define shared vault constants in `apps/desktop/src/shared/constants/vault.ts`
- [X] T009 [P] Define Phase 0 domain types and state enums in `apps/desktop/src/shared/domain/vault-model.ts`
- [X] T010 [P] Implement schema validation for vault config and settings in `apps/desktop/src/shared/domain/validators.ts`
- [X] T011 [P] Define structured application errors in `apps/desktop/src/shared/errors/crm-errors.ts`
- [X] T012 Implement filesystem adapter interface and base helpers in `apps/desktop/src/shared/services/filesystem-adapter.ts`
- [X] T013 Implement vault compatibility validator service in `apps/desktop/src/shared/services/vault-compatibility-service.ts`
- [X] T014 Implement initialization rollback helper service in `apps/desktop/src/shared/services/vault-rollback-service.ts`
- [X] T015 Implement app settings repository with corruption reset behavior and structured local logging in `apps/desktop/src/shared/services/app-settings-service.ts`
- [X] T016 Implement local structured logger with retention policy in `apps/desktop/src/shared/services/local-log-service.ts`
- [X] T017 Configure Tauri least-privilege capability/ACL scoping in `apps/desktop/src-tauri/capabilities/default.json` and `apps/desktop/src-tauri/tauri.conf.json`
- [X] T018 Wire shared command registration stubs for vault/settings/dashboard in `apps/desktop/src-tauri/src/commands/mod.rs`
- [X] T019 Add foundational unit tests for constants, validators, error mapping, and log schema in `apps/desktop/tests/unit/foundation.test.ts`
- [X] T020 Add integration test for denied out-of-scope filesystem access in `apps/desktop/tests/integration/filesystem-acl-scope.test.ts`

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - Initialize or Open CRM Vault (Priority: P1)

**Goal**: User can create a new vault or open a compatible existing vault with strict validation and recovery behavior.

**Independent Test**: Create/open vault flows work end-to-end, including non-empty folder confirmation, incompatible-folder block/conversion option, read-only handling, special-path handling, open-only non-mutation, and partial-init rollback behavior.

### Tests for User Story 1

- [X] T021 [P] [US1] Add initialize/open contract tests from OpenAPI behavior in `apps/desktop/tests/contract/vault-lifecycle.contract.test.ts`
- [X] T022 [P] [US1] Add integration test for non-empty folder explicit confirmation flow in `apps/desktop/tests/integration/vault-create-nonempty.test.ts`
- [X] T023 [P] [US1] Add integration test for incompatible open with conversion option in `apps/desktop/tests/integration/vault-open-incompatible.test.ts`
- [X] T024 [P] [US1] Add integration test for partial initialization rollback and invalid marking in `apps/desktop/tests/integration/vault-init-rollback.test.ts`
- [X] T025 [P] [US1] Add integration test for read-only/inaccessible folder handling in `apps/desktop/tests/integration/vault-open-readonly.test.ts`
- [X] T026 [P] [US1] Add integration test for long/special-character vault paths in `apps/desktop/tests/integration/vault-path-edgecases.test.ts`
- [X] T027 [P] [US1] Add integration test asserting open-only flow does not mutate existing files in `apps/desktop/tests/integration/vault-open-no-mutation.test.ts`

### Implementation for User Story 1

- [X] T028 [P] [US1] Implement Tauri command for `POST /vaults/initialize` behavior in `apps/desktop/src-tauri/src/commands/vault_initialize.rs`
- [X] T029 [P] [US1] Implement Tauri command for `POST /vaults/open` behavior in `apps/desktop/src-tauri/src/commands/vault_open.rs`
- [X] T030 [US1] Implement onboarding create/open vault screen in `apps/desktop/src/features/settings/VaultOnboardingPage.tsx`
- [X] T031 [US1] Implement compatibility warning and confirmation modal in `apps/desktop/src/features/settings/VaultCompatibilityDialog.tsx`
- [X] T032 [US1] Implement recovery guidance UI for initialization/open failures in `apps/desktop/src/features/settings/VaultRecoveryPanel.tsx`
- [X] T033 [US1] Wire frontend vault service to invoke initialize/open commands in `apps/desktop/src/shared/services/vault-client.ts`

**Checkpoint**: US1 is independently functional and testable.

---

## Phase 4: User Story 2 - Navigate Initial Application Shell (Priority: P2)

**Goal**: User can navigate Dashboard, Companies, Contacts, Leads, Settings; dashboard shows Phase 0 snapshot; list pages show explicit empty states.

**Independent Test**: With an active vault, all routes are reachable; dashboard renders path/count/status; non-implemented sections clearly indicate Phase 0 scope.

### Tests for User Story 2

- [X] T034 [P] [US2] Add component test for sidebar navigation routes in `apps/desktop/tests/component/app-navigation.test.tsx`
- [X] T035 [P] [US2] Add component test for dashboard snapshot rendering in `apps/desktop/tests/component/dashboard-snapshot.test.tsx`
- [X] T036 [P] [US2] Add integration test for Phase 0 empty states in companies/contacts/leads pages in `apps/desktop/tests/integration/phase0-empty-states.test.tsx`

### Implementation for User Story 2

- [X] T037 [P] [US2] Implement route map and app shell layout in `apps/desktop/src/app/routes.tsx` and `apps/desktop/src/shared/layout/AppShell.tsx`
- [X] T038 [P] [US2] Implement dashboard page and snapshot widget in `apps/desktop/src/features/dashboard/DashboardPage.tsx`
- [X] T039 [P] [US2] Implement dashboard snapshot command for `GET /dashboard/snapshot` behavior in `apps/desktop/src-tauri/src/commands/dashboard_snapshot.rs`
- [X] T040 [US2] Implement Phase 0 placeholder pages in `apps/desktop/src/features/companies/CompaniesPage.tsx`, `apps/desktop/src/features/contacts/ContactsPage.tsx`, and `apps/desktop/src/features/leads/LeadsPage.tsx`
- [X] T041 [US2] Connect dashboard data query service in `apps/desktop/src/shared/services/dashboard-client.ts`

**Checkpoint**: US2 is independently functional and testable.

---

## Phase 5: User Story 3 - Resume Previous Vault on Restart (Priority: P3)

**Goal**: App resumes last valid vault on startup and degrades safely to vault selection when settings or path are invalid.

**Independent Test**: Restart with valid path auto-opens dashboard; missing/inaccessible path routes to selection with clear error; corrupted settings reset and structured logging continue.

### Tests for User Story 3

- [X] T042 [P] [US3] Add integration test for startup auto-open with valid settings path in `apps/desktop/tests/integration/startup-auto-open.test.ts`
- [X] T043 [P] [US3] Add integration test for missing/inaccessible path fallback in `apps/desktop/tests/integration/startup-path-fallback.test.ts`
- [X] T044 [P] [US3] Add unit test for settings corruption reset behavior and logging schema in `apps/desktop/tests/unit/settings-reset.test.ts`

### Implementation for User Story 3

- [X] T045 [P] [US3] Implement Tauri commands for `GET /app/settings` and `PUT /app/settings` behavior in `apps/desktop/src-tauri/src/commands/app_settings.rs`
- [X] T046 [P] [US3] Implement startup resolver command for `GET /vaults/active` behavior in `apps/desktop/src-tauri/src/commands/vault_active.rs`
- [X] T047 [US3] Implement frontend startup bootstrap flow and fallback navigation in `apps/desktop/src/app/bootstrap/startup.ts`
- [X] T048 [US3] Implement startup error banner and settings-reset notification UI in `apps/desktop/src/features/settings/StartupRecoveryNotice.tsx`
- [X] T049 [US3] Persist last opened vault pointer from successful open/create flows in `apps/desktop/src/shared/services/session-state.ts`

**Checkpoint**: US3 is independently functional and testable.

---

## Phase 6: Polish and Cross-Cutting Concerns

**Purpose**: Final hardening, measurable validation, and traceable implementation evidence across all stories.

- [X] T050 [P] Update Phase 0 developer run and validation notes in `specs/001-vault-shell-setup/quickstart.md`
- [X] T051 [P] Produce requirement-to-task and requirement-to-test evidence report in `specs/001-vault-shell-setup/implementation-evidence.md`
- [X] T052 Run and document performance validation against Phase 0 thresholds (<= 5s startup, <= 2min vault initialization) in `apps/desktop/tests/performance/phase0-performance.test.ts`
- [X] T053 Run full desktop test suite and fix failures in `apps/desktop/tests/`
- [ ] T054 Run manual quickstart validation and capture final results in `specs/001-vault-shell-setup/plan.md`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2 (recommended after US1 for realistic dashboard flow)
- **Phase 5 (US3)**: Depends on Phase 2 and uses services built in US1
- **Phase 6 (Polish)**: Depends on completed target user stories

### User Story Dependencies

- **US1 (P1)**: No user-story dependency after foundational
- **US2 (P2)**: Can start after foundational; practically integrates with US1 vault lifecycle
- **US3 (P3)**: Depends on vault lifecycle and settings paths established by US1

### Within Each User Story

- Write tests first and confirm they fail.
- Implement command/service/model logic before final UI integration.
- Complete story acceptance checks before starting lower-priority story polish.

### Parallel Opportunities

- Setup tasks `T003-T006` can run in parallel.
- Foundational tasks `T009-T011` can run in parallel, then merge into `T012-T018`.
- US1 tests `T021-T027` can run in parallel; commands `T028-T029` can run in parallel.
- US2 tasks `T037-T039` can run in parallel; placeholder UI task `T040` follows shell setup.
- US3 tests `T042-T044` can run in parallel; commands `T045-T046` can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T021 [US1] Add initialize/open contract tests in apps/desktop/tests/contract/vault-lifecycle.contract.test.ts"
Task: "T025 [US1] Add read-only/inaccessible folder handling test in apps/desktop/tests/integration/vault-open-readonly.test.ts"
Task: "T027 [US1] Add open-no-mutation integration test in apps/desktop/tests/integration/vault-open-no-mutation.test.ts"

Task: "T028 [US1] Implement initialize command in apps/desktop/src-tauri/src/commands/vault_initialize.rs"
Task: "T029 [US1] Implement open command in apps/desktop/src-tauri/src/commands/vault_open.rs"
```

## Parallel Example: User Story 2

```bash
Task: "T037 [US2] Implement route map and app shell in apps/desktop/src/app/routes.tsx and apps/desktop/src/shared/layout/AppShell.tsx"
Task: "T038 [US2] Implement dashboard page in apps/desktop/src/features/dashboard/DashboardPage.tsx"
Task: "T039 [US2] Implement dashboard snapshot command in apps/desktop/src-tauri/src/commands/dashboard_snapshot.rs"
```

## Parallel Example: User Story 3

```bash
Task: "T042 [US3] Add startup auto-open integration test in apps/desktop/tests/integration/startup-auto-open.test.ts"
Task: "T043 [US3] Add startup fallback integration test in apps/desktop/tests/integration/startup-path-fallback.test.ts"
Task: "T044 [US3] Add settings reset + logging schema unit test in apps/desktop/tests/unit/settings-reset.test.ts"

Task: "T045 [US3] Implement app settings commands in apps/desktop/src-tauri/src/commands/app_settings.rs"
Task: "T046 [US3] Implement active vault resolver command in apps/desktop/src-tauri/src/commands/vault_active.rs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently using `T021-T033`.
4. Demo vault create/open lifecycle and failure handling.

### Incremental Delivery

1. Deliver US1 (vault lifecycle) as MVP.
2. Add US2 (shell navigation + dashboard snapshot).
3. Add US3 (restart continuity + safe fallback).
4. Finish with Phase 6 polish and full validation.

### Parallel Team Strategy

1. Team aligns on Setup and Foundational phases.
2. After Phase 2:
   - Developer A: US1 command/service work (`T028-T033`)
   - Developer B: US2 shell/dashboard work (`T037-T041`)
   - Developer C: US3 startup/settings work (`T045-T049`)
3. Merge and run full validation pass (`T050-T054`).

---

## Notes

- `[P]` tasks are safe to execute in parallel if dependencies are satisfied.
- `[US1]/[US2]/[US3]` labels provide direct traceability to spec user stories.
- Each story has explicit independent test criteria.
- Suggested MVP scope: **US1 only** after Setup + Foundational.
