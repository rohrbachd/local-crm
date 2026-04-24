# Feature Specification: Phase 0 Clickable Shell and Vault Setup

**Feature Branch**: `[001-vault-shell-setup]`  
**Created**: 2026-04-24  
**Status**: Draft  
**Input**: User description: "Run speckit.specify for Phase 0 of the roadmap and link PRD and technical spec."  
**Glossary**: N/A

## Clarifications

### Session 2026-04-24

- Q: When creating a vault in a non-empty folder, should initialization be blocked, auto-allowed, or confirmation-based? -> A: Allow non-empty folders only after compatibility checks and explicit user confirmation.
- Q: What qualifies as a compatible existing vault? -> A: A folder is compatible only when required folders and a valid CRM vault configuration artifact are both present.
- Q: How should partial initialization failures be handled? -> A: Attempt rollback of artifacts created in the failed attempt; if rollback is incomplete, mark vault invalid and show recovery steps.
- Q: How should corrupted app settings be handled at startup? -> A: Reset to defaults, log the issue, and continue to vault selection.
- Q: What should happen if a user tries "Open existing vault" on an incompatible folder? -> A: Block opening and offer "Initialize this folder as new vault" with compatibility warning and explicit confirmation.

## Constitution Alignment (mandatory)

- **I. Clear Scope and Requirements**: This feature is scoped to Roadmap Phase 0 only and uses explicit functional requirements, edge cases, and acceptance scenarios. Source documents are linked for traceability:
  - [Roadmap](../../docs/local_first_crm_mvp_roadmap.md)
  - [PRD](../../docs/local_first_crm_mvp_prd.md)
  - [Technical Spec](../../docs/local_first_crm_technical_spec.md)
- **III. Quality and Testing**: Each user story is independently testable with Given/When/Then scenarios, and requirements are written to support plan-level and implementation-level testing.
- **IV. Security and Privacy**: The feature requires safe handling of inaccessible or non-writable folders and avoids storing secrets in vault files.
- **V. Automation and Documentation**: This spec defines expected user-facing behavior so later plan/tasks/implementation can remain aligned with `docs/`.
- **Exceptions**: None.

## User Scenarios and Testing (mandatory)

### Story Priorities and Motivation

Phase 0 proves the core product promise: a desktop CRM that works from a user-controlled local folder. P1 establishes vault creation/opening and persistence continuity, P2 delivers a visible shell with core navigation and dashboard context, and P3 ensures recovery behavior for broken paths or permission failures.

### User Stories (Prioritized)

### User Story - Initialize or Open CRM Vault (Priority: P1)

As a user, I can create a new CRM vault or open an existing one so the app has a valid local workspace.

**Why this priority**: Without a valid vault, no future CRM workflow can exist.

**Independent Test**: Can be fully tested by creating/opening a vault and verifying required folder and config artifacts are present.

**Acceptance Scenarios**:

1. **Given** first app launch, **When** the user selects an empty writable folder and chooses "Create CRM Vault", **Then** the system initializes the required vault structure and opens the dashboard.
2. **Given** an existing compatible vault folder (required folders present and valid configuration artifact present), **When** the user opens it, **Then** the system loads it without changing existing CRM entity files.
3. **Given** a read-only or inaccessible folder, **When** the user attempts to initialize or open it, **Then** the system blocks activation and shows a clear error with recovery guidance.
4. **Given** a writable folder that is not empty, **When** the user chooses to create a vault, **Then** the system runs a compatibility check and requires explicit confirmation before creating CRM artifacts.
5. **Given** the user selects "Open existing vault" for an incompatible folder, **When** compatibility validation fails, **Then** the system blocks open and offers an "Initialize this folder as new vault" path with warning and explicit confirmation.

---

### User Story - Navigate Initial Application Shell (Priority: P2)

As a user, I can see and use the core navigation and dashboard so I can orient myself before entity features are implemented.

**Why this priority**: A visible, clickable product increment is required at the end of every phase.

**Independent Test**: Can be fully tested by verifying each primary section is reachable and placeholder states are shown where Phase 0 intentionally excludes CRUD.

**Acceptance Scenarios**:

1. **Given** a loaded vault, **When** the user uses the main navigation, **Then** Dashboard, Companies, Contacts, Leads, and Settings sections are reachable.
2. **Given** Phase 0 scope, **When** the user visits Companies, Contacts, or Leads, **Then** each section shows an empty-state message indicating the functionality is not yet available in this phase.
3. **Given** the dashboard, **When** it loads, **Then** it displays active vault path, company count, contact count, and task integration status as "not configured."

---

### User Story - Resume Previous Vault on Restart (Priority: P3)

As a user, I can close and reopen the app and continue with the previously selected vault when it is still available.

**Why this priority**: Restart continuity is essential to prove local-first persistence and basic usability.

**Independent Test**: Can be fully tested by selecting a vault, restarting the app, and observing automatic vault restore behavior.

**Acceptance Scenarios**:

1. **Given** a successfully selected vault, **When** the user restarts the app and the path remains accessible, **Then** the app auto-opens that vault and lands on dashboard.
2. **Given** a previously selected vault path that is now unavailable, **When** the app starts, **Then** the app shows vault selection and explains the previous path cannot be opened.
3. **Given** startup with missing, unreadable, or corrupted app-level settings, **When** the app opens, **Then** the app resets settings to defaults, logs the issue, and remains usable by showing vault selection instead of failing startup.

---

### Edge Cases

- User cancels folder selection during vault creation.
- Selected folder already exists and contains unrelated files that do not match CRM vault expectations.
- User chooses "Open existing vault" for a folder that fails compatibility validation and needs conversion flow.
- Vault initialization succeeds for some directories but fails before completion due to permissions or path errors.
- If initialization fails mid-way, the system attempts rollback of artifacts created during that attempt and surfaces recovery steps when rollback cannot be completed fully.
- App-level settings are missing, unreadable, or corrupted at startup and must be reset to defaults without blocking launch.
- Previously selected vault path points to a disconnected drive or deleted directory.
- Folder names contain special characters and long paths.

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: The system MUST provide a startup flow that lets users either create a new CRM vault or open an existing CRM vault.
- **FR-002**: The system MUST validate that a selected vault location is readable and writable before setting it as the active vault.
- **FR-003**: When creating a new vault, the system MUST initialize the required top-level structure: `companies`, `contacts`, `leads`, `interactions`, `attachments`, `config`, and `indexes`.
- **FR-004**: The system MUST create a vault configuration artifact in the `config` folder that identifies the vault as initialized CRM data.
- **FR-005**: The system MUST persist the last successfully opened vault path in app-level settings outside the CRM vault.
- **FR-006**: On startup, if the persisted vault path is accessible and valid, the system MUST auto-open it and show the dashboard without repeating onboarding.
- **FR-007**: On startup, if the persisted vault path is missing, invalid, or inaccessible, the system MUST not crash and MUST provide a recovery path to select another folder.
- **FR-008**: The dashboard MUST display, at minimum, the active vault path, company count, contact count, and task integration status.
- **FR-009**: The shell navigation MUST provide routes for Dashboard, Companies, Contacts, Leads, and Settings.
- **FR-010**: For Phase 0, Companies, Contacts, and Leads views MUST clearly indicate that record management is not yet available.
- **FR-011**: Opening an existing compatible vault MUST NOT modify existing entity files as part of the open action.
- **FR-012**: The system MUST only mark a vault as active after initialization/open validation completes successfully.
- **FR-013**: The authoritative store for CRM Phase 0 state MUST be the selected vault folder and its configuration artifact; app-level settings MAY store only the vault pointer and non-domain app state.
- **FR-014**: As a startup-readiness policy that complements FR-007, if persistent dependencies are unavailable at startup (vault path unavailable or app settings unreadable), the system MUST degrade to a usable selection flow rather than entering a broken partial state.
- **FR-015**: Vault bootstrap behavior MUST include verification that required folders and configuration artifacts exist before the dashboard is shown.
- **FR-016**: During new-vault creation in a non-empty folder, the system MUST run a compatibility check and require explicit user confirmation before writing CRM folders or configuration artifacts.
- **FR-017**: The system MUST consider an existing folder compatible for open only when both conditions are true: all required top-level CRM folders exist and a valid CRM vault configuration artifact exists.
- **FR-018**: If vault initialization fails after creating artifacts, the system MUST attempt to roll back artifacts created during that initialization attempt.
- **FR-019**: If rollback is incomplete, the system MUST mark the vault as invalid for auto-open and present explicit recovery guidance before any further write attempt.
- **FR-020**: If app-level settings are missing, unreadable, or corrupted at startup, the system MUST reset them to defaults, log the settings error to a local app log outside the CRM vault using structured fields (`level`, `code`, `timestamp`, `message`), retain those log entries for at least the last 7 days, and continue to vault selection flow.
- **FR-021**: If a folder fails compatibility validation during "Open existing vault," the system MUST block opening and offer a conversion path to "Initialize this folder as new vault" with compatibility warning and explicit user confirmation before writing.

### Non-Functional Requirements

- **NFR-001 (Performance)**: The startup path from app launch to an actionable screen (dashboard or vault selection) MUST complete within 5 seconds for local vaults under normal desktop conditions.
- **NFR-002 (Performance)**: New-vault initialization of the required Phase 0 folder structure and configuration artifact MUST complete within 2 minutes for first-time users.
- **NFR-003 (Reliability)**: The app MUST not crash on missing, inaccessible, or incompatible vault paths at startup; it MUST present a recovery path in 100% of tested failure cases.
- **NFR-004 (Reliability)**: Open-existing-vault flow MUST be non-mutating in open-only mode; no existing entity file content or timestamps may change as a side effect of open validation.
- **NFR-005 (Security/Least Privilege)**: Filesystem access MUST be scoped to the selected vault path and required app-settings path only; out-of-scope path access attempts MUST be rejected and surfaced as handled errors.
- **NFR-006 (Observability)**: Vault lifecycle failures (initialize/open/startup recovery) MUST emit structured local log events with `level`, `code`, `timestamp`, and `message`.
- **NFR-007 (Observability)**: Recovery-critical events (settings reset, rollback incomplete, incompatible vault detection) MUST include a traceable error code that can be correlated with UI recovery messages.

### Key Entities (include if feature involves data)

- **CRM Vault**: User-selected local folder that acts as the authoritative store for CRM Phase 0 data, including required subfolders and configuration artifact.
- **Vault Configuration Artifact**: Initialization metadata in the vault that identifies the folder as a compatible CRM workspace.
- **App Session Settings**: App-local configuration that stores non-domain state, including last opened vault pointer, and supports restart continuity.
- **Dashboard Snapshot**: Read-only presentation state containing active vault path, basic entity counts, and task integration status.

### Assumptions and Dependencies

- Phase 0 scope is limited to shell, vault setup/opening, and restart continuity; entity CRUD and integration behavior are out of scope.
- The app runs as a desktop client for a single local OS user in this phase.
- Source alignment dependencies:
  - [Roadmap](../../docs/local_first_crm_mvp_roadmap.md)
  - [PRD](../../docs/local_first_crm_mvp_prd.md)
  - [Technical Spec](../../docs/local_first_crm_technical_spec.md)

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: In usability testing, at least 90% of first-time users can create a new vault and reach the dashboard within 2 minutes without facilitator intervention.
- **SC-002**: In acceptance testing, 100% of successful new-vault initializations produce the required folder structure and configuration artifact.
- **SC-003**: In restart tests, at least 95% of sessions with an unchanged accessible vault path auto-open the same vault without manual reselection.
- **SC-004**: In startup failure tests (missing path, inaccessible folder, unreadable app settings), users can recover to a valid vault selection flow in under 30 seconds without app restart.
- **SC-005**: Stakeholders can complete the full Phase 0 demo flow (create/open vault, verify dashboard state, restart and reopen) in under 5 minutes.
