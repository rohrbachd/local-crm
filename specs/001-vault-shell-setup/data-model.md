# Data Model: Phase 0 Clickable Shell and Vault Setup

## Purpose

Define the Phase 0 operational model for vault lifecycle, startup continuity, and dashboard snapshot data.

## Entities

### 1. CRMVault

Represents the selected local CRM workspace.

Fields:

- `vaultPath` (string, required, absolute path)
- `status` (enum, required): `uninitialized | initializing | ready | invalid`
- `isCompatible` (boolean, required)
- `createdAt` (datetime, optional)
- `lastValidatedAt` (datetime, required)
- `validationIssues` (string[], optional)

Validation rules:

- `vaultPath` must be readable.
- For `status = ready`, compatibility checks must pass.
- For `status = invalid`, at least one `validationIssue` must be present.

### 2. VaultConfigurationArtifact

Represents persisted vault metadata in `config` folder.

Fields:

- `schemaVersion` (integer, required)
- `vaultId` (string, required, stable identifier)
- `vaultName` (string, optional)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

Validation rules:

- Required for compatibility with "Open existing vault".
- `schemaVersion` must be recognized by current app version.

### 3. AppSessionSettings

Represents app-level persisted state outside the vault.

Fields:

- `settingsVersion` (integer, required)
- `lastOpenedVaultPath` (string, optional)
- `updatedAt` (datetime, required)
- `integrityState` (enum, computed): `valid | reset`

Validation rules:

- On parse failure, settings must reset to defaults.
- `lastOpenedVaultPath` is pointer-only metadata, not source-of-truth CRM data.

### 4. DashboardSnapshot

Represents read-only summary displayed on dashboard.

Fields:

- `activeVaultPath` (string, required)
- `companyCount` (integer, required, >= 0)
- `contactCount` (integer, required, >= 0)
- `taskIntegrationStatus` (enum, required): `not_configured | configured | unavailable`
- `capturedAt` (datetime, required)

Validation rules:

- `companyCount` and `contactCount` are derived from vault files.
- `taskIntegrationStatus` defaults to `not_configured` in Phase 0.

## Relationships

- `CRMVault (1) -> (1) VaultConfigurationArtifact` when vault is initialized and compatible.
- `AppSessionSettings (1) -> (0..1) CRMVault` through `lastOpenedVaultPath`.
- `DashboardSnapshot` is derived from active `CRMVault`; it is not persisted as system of record.

## Lifecycle and State Transitions

### CRMVault Status

- `uninitialized -> initializing` when user confirms create/open action.
- `initializing -> ready` when required folders + valid configuration artifact are confirmed.
- `initializing -> invalid` when initialization fails and rollback is incomplete.
- `ready -> invalid` when startup validation later fails (missing path, permission loss, incompatible structure).

### AppSessionSettings Integrity

- `valid -> reset` when file is missing/unreadable/corrupted at startup.
- `reset -> valid` after defaults are saved successfully.

## System-of-Record Notes

- Authoritative store for Phase 0 CRM state: selected vault folder + valid vault configuration artifact.
- App session settings are non-domain metadata and must never replace vault authority.

## Delta vs Canonical

Canonical source: `D:\Development\local-crm\docs\data-model.md`

| Item | Change Type | Notes |
| --- | --- | --- |
| Canonical baseline file | Added | `docs/data-model.md` did not exist; created in this plan cycle. |
| `CRMVault` | Added to canonical baseline | Phase 0 operational entity for vault lifecycle. |
| `VaultConfigurationArtifact` | Added to canonical baseline | Compatibility marker and vault metadata artifact. |
| `AppSessionSettings` | Added to canonical baseline | Startup continuity pointer outside vault authority. |
| `DashboardSnapshot` | Added to canonical baseline | Read-only Phase 0 summary model. |

Post-update status: feature data model and canonical model are aligned; no unresolved delta remains.
