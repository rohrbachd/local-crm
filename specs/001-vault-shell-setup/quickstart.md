# Quickstart: Phase 0 Clickable Shell and Vault Setup

## Goal

Validate that Phase 0 delivers:

- desktop shell navigation,
- vault create/open flow,
- compatibility validation,
- restart continuity,
- and safe recovery from startup/init failures.

## Prerequisites

- Local repository at `D:\Development\local-crm`
- Desktop runtime prerequisites for chosen implementation stack
- Writable local folder for creating a test vault
- One read-only or inaccessible folder for negative-path testing

## Local Run Commands

From repository root:

```powershell
cd apps/desktop
npm install
npm run dev
```

Validation commands (same folder):

```powershell
npm run test
npm run lint
npm run build
```

Optional native shell run (requires Rust + Tauri CLI):

```powershell
cd apps/desktop/src-tauri
cargo tauri dev
```

## Manual Validation Flow

### 1. First Launch and New Vault Creation

1. Start the desktop app.
2. Choose `Create CRM Vault`.
3. Select an empty writable folder.
4. Confirm initialization.

Expected:

- Required folders are created:
  - `companies`
  - `contacts`
  - `leads`
  - `interactions`
  - `attachments`
  - `config`
  - `indexes`
- Vault configuration artifact exists in `config`.
- Dashboard opens and shows:
  - active vault path,
  - company count `0`,
  - contact count `0`,
  - task integration status `not configured`.

### 2. Existing Vault Open (Compatible)

1. Restart app.
2. Open an existing compatible vault.

Expected:

- Vault opens without modifying existing entity files.
- Dashboard appears with valid path/count summary.

### 3. Existing Vault Open (Incompatible)

1. Choose `Open existing vault`.
2. Select an incompatible folder.

Expected:

- Open is blocked.
- User is offered `Initialize this folder as new vault`.
- Initialization requires explicit confirmation before writing.

### 4. Non-Empty Folder Initialization

1. Choose `Create CRM Vault`.
2. Select a writable non-empty folder.

Expected:

- Compatibility check runs.
- User must explicitly confirm before CRM artifacts are written.

### 5. Failure and Recovery Paths

1. Attempt initialization in a folder where creation fails mid-way.
2. Start app with unreadable/corrupted app settings.

Expected:

- Rollback is attempted for artifacts from the failed attempt.
- If rollback cannot fully complete, vault is marked invalid and recovery guidance is shown.
- Corrupted settings reset to defaults, issue is logged, app continues to vault selection.

### 6. Restart Continuity

1. Select a valid vault and close app.
2. Relaunch app.

Expected:

- App auto-opens same vault if still accessible.
- If missing/inaccessible, app degrades to selection flow with clear error.

## Exit Criteria

- All functional requirements `FR-001` to `FR-021` from `spec.md` can be mapped to a passing scenario.
- Demo can be executed end-to-end in under five minutes.

## Implementation Run Notes
- Added US2 and US3 scaffold and tests.
- Added performance threshold test placeholder in apps/desktop/tests/performance/phase0-performance.test.ts.

