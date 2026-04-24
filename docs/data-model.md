# Canonical Data Model Baseline

## Purpose

This file is the canonical data model baseline for Local-First CRM features.
Feature-level data models under `specs/*/data-model.md` must include a `Delta vs Canonical` section against this file.

## Entity Groups

### CRM Domain Entities

#### Company

- `id` (string, required)
- `schemaVersion` (integer, required)
- `type` = `company`
- `name` (string, required)
- `status` = `active | inactive | archived`
- `website` (string, optional)
- `mainEmail` (string, optional)
- `mainPhone` (string, optional)
- `address` (string, optional)
- `tags` (string[], optional)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)
- `markdownBody` (string, optional)

#### Contact

- `id` (string, required)
- `schemaVersion` (integer, required)
- `type` = `contact`
- `firstName` (string, required)
- `lastName` (string, required)
- `email` (string, optional)
- `phone` (string, optional)
- `companyId` (string, optional)
- `role` (string, optional)
- `status` = `active | inactive | archived`
- `tags` (string[], optional)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)
- `markdownBody` (string, optional)

#### Lead

- `id` (string, required)
- `schemaVersion` (integer, required)
- `type` = `lead`
- `title` (string, required)
- `companyId` (string, optional)
- `contactIds` (string[], optional)
- `status` = `new | contacted | qualified | proposal | negotiation | won | lost | paused | archived`
- `owner` (string, optional)
- `tags` (string[], optional)
- `externalTaskRefs` (ExternalTaskRef[], optional)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)
- `markdownBody` (string, optional)

#### Interaction

- `id` (string, required)
- `schemaVersion` (integer, required)
- `type` = `interaction`
- `interactionType` = `meeting | call | email_note | event_conversation | internal_note | other`
- `dateTime` (datetime, required)
- `summary` (string, required)
- `companyIds` (string[], optional)
- `contactIds` (string[], optional)
- `leadIds` (string[], optional)
- `externalTaskRefs` (ExternalTaskRef[], optional)
- `tags` (string[], optional)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)
- `markdownBody` (string, optional)

#### ExternalTaskRef

- `providerId` (string, required)
- `externalId` (string, required)
- `url` (string, required)
- `title` (string, required)
- `statusSnapshot` (string, optional)
- `lastSyncedAt` (datetime, optional)

### Phase 0 Operational Entities

#### CRMVault

- `vaultPath` (string, required, absolute path)
- `status` = `uninitialized | initializing | ready | invalid`
- `isCompatible` (boolean, required)
- `createdAt` (datetime, optional)
- `lastValidatedAt` (datetime, required)
- `validationIssues` (string[], optional)

#### VaultConfigurationArtifact

- `schemaVersion` (integer, required)
- `vaultId` (string, required)
- `vaultName` (string, optional)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

#### AppSessionSettings

- `settingsVersion` (integer, required)
- `lastOpenedVaultPath` (string, optional)
- `updatedAt` (datetime, required)
- `integrityState` = `valid | reset`

#### DashboardSnapshot

- `activeVaultPath` (string, required)
- `companyCount` (integer, required, >= 0)
- `contactCount` (integer, required, >= 0)
- `taskIntegrationStatus` = `not_configured | configured | unavailable`
- `capturedAt` (datetime, required)

## Relationship Baseline

- `Company (1) -> (0..n) Contact`
- `Company (1) -> (0..n) Lead`
- `Contact (0..n) -> (0..n) Lead`
- `Interaction (0..n) -> (0..n) Company/Contact/Lead`
- `Lead (0..n) -> (0..n) ExternalTaskRef`
- `CRMVault (1) -> (1) VaultConfigurationArtifact`
- `AppSessionSettings (1) -> (0..1) CRMVault` by pointer path
- `DashboardSnapshot` derives from active `CRMVault`

## Authority Rules

- Source of truth for CRM domain data: vault files.
- Source of truth for Phase 0 vault compatibility: required folders + valid vault configuration artifact.
- App settings are pointer metadata only and never replace vault authority.
