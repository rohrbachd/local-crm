# Project Constitution

## Core Principles

### I. Clear Scope and Requirements

- Each feature MUST have a written spec that includes scope, functional requirements, non-functional requirements, and acceptance criteria.
- Ambiguities MUST be resolved before implementation begins.
- The active PRD, technical design/spec, and roadmap documents under `docs/` MUST be reviewed and kept in sync for any change that affects scope, architecture, or milestones.

### II. Maintainable Architecture

- Code MUST respect agreed boundaries and dependency direction.
- Shared logic MUST live in explicit shared modules, not copy-pasted.
- Avoid hidden global state; prefer explicit inputs and dependency injection where appropriate.
- Prefer object-oriented design for domain modeling; avoid pure procedural implementations unless explicitly justified.
- Modules MUST be self-contained with explicit interfaces and no direct access to other modules' internal data stores.
- Reused protocol/domain literals (e.g., header names, role values, storage keys, URL path fragments) MUST be centralized in named constants, not duplicated as inline string literals across files.

### III. Quality and Testing

- Changes to production code MUST include tests covering critical paths.
- Tests MUST be runnable locally and in CI.
- Failures MUST block releases until resolved or explicitly waived with documented rationale.
- Each module MUST have its own unit test suite that can run independently of other modules.
- Code MUST follow clean-code practices (readable naming, small cohesive units, and minimal side effects).
- Repeated parsing/normalization logic (e.g., header extraction and trimming) MUST be implemented via shared, named helper functions when used in multiple call sites.

### IV. Security and Privacy

- Validate inputs and handle errors safely.
- Protect secrets; never commit credentials.
- Apply least privilege and safe defaults for any external access.

### V. Automation and Documentation

- CI MUST run build, lint/format, and tests.
- User-facing behavior changes MUST update relevant docs.
- API and CLI changes (if applicable) MUST update their documentation and examples.

## Delivery Workflow

- Required sequence: Spec -> Plan -> Tasks -> Implementation -> Validation.
- Constitution checks MUST be completed before planning is finalized and rechecked before implementation.
- Each user story MUST be independently testable and deliverable when user stories are used.

## Governance

- The constitution supersedes templates and local conventions when conflicts arise.
- Amendments require a documented proposal, a version bump, and template updates.
- Versioning follows semantic versioning: MAJOR for removals/redefinitions, MINOR for additions, PATCH for clarifications.

**Version**: 1.1.1 | **Ratified**: [DATE] | **Last Amended**: 2026-04-19
