---
description: Create or update high-quality software and code documentation for a selected scope, covering relevant stakeholders with clear doc types, stable structure, and maintainable depth.
---

Usage: `/speckit.documentation -Module <name-or-path> | -Folder <path> | -Files <path1,path2,...> | -GitDiff [<base-ref>] | -GitChanges` with optional `-Full`, `-CodeComments`, `-AllowCreate`, `-DocsOnly`, `-ContractsOnly`, and `-BaseRef <ref>`.

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Produce clear, accurate, durable documentation for the requested scope.

This command should improve documentation so that the selected area becomes understandable and usable for the people who need it, while avoiding low-value sprawl and duplicate prose.

The result should:
- support the right stakeholders for the selected scope
- stay close to the code, contracts, tests, and runtime behavior
- explain purpose, usage, modification, and failure modes where relevant
- use stable documentation homes and reusable templates where possible
- remain maintainable rather than verbose by accident

When the user requests `-Full`, interpret "sufficient" at the level of the selected module, service, or system, not at the level of the smallest possible diff.

## Core Principles

### 1) Stakeholder-first documentation

Document for the people who must use, test, extend, operate, review, or govern the selected scope.

Typical stakeholders:
- users and admins
- integrators and API consumers
- engineers and maintainers
- testers and QA
- operators and support
- architects and technical leads
- security, privacy, or compliance reviewers when relevant

For each relevant stakeholder, documentation should answer:
- what this thing is for
- when to use it and when not to use it
- how to use or operate it
- how to change it safely
- what failures, risks, and invariants matter

If `-Full` is used, you MUST explicitly identify relevant stakeholders and their top questions before writing docs, and the resulting documentation set MUST provide clear entry points for each of them.

### 2) Use Diataxis for doc types

Each page should primarily be one of:
- Tutorial: learn by doing
- How-to: perform a task
- Reference: exact facts
- Explanation: concepts, architecture, rationale, and tradeoffs

Do not mix doc types carelessly within one page.

For `-Full`, Diataxis is required unless a type is clearly not applicable. If a type is omitted, state why in the completion report.

### 3) Good documentation quality model

Good documentation is:
- discoverable: there is a clear place to start
- role-oriented: each stakeholder can find the right entry point quickly
- layered: overview first, exact detail in reference, rationale in explanation
- actionable: examples, commands, and troubleshooting exist where needed
- safe to modify: invariants, extension points, and risks are explicit
- canonical: one best home per fact, with links instead of repetition
- current: aligned with code, contracts, tests, and runtime behavior

Bad documentation usually looks like:
- long property lists without purpose or usage guidance
- API lists without examples or error semantics
- architecture notes without scenarios
- code comments that restate syntax but do not explain responsibility
- pages with mixed tutorial, reference, and rationale content

### 4) Update over create, but do not preserve weak docs

Prefer updating an existing document. Create a new one only if:
- no suitable existing home exists
- the information is worth preserving
- and creation is explicitly allowed or clearly justified

However, if an existing page is weak, replace low-value list-only documentation with structured, stakeholder-oriented content instead of preserving weakness just to minimize changes.

### 5) No duplication

Each important explanation should have one best home.

Preferred sources of truth:
- contracts or reference files for exact interfaces
- module or service docs for local responsibilities and workflows
- architecture docs for major structure and cross-cutting behavior
- ADRs for durable design decisions
- runbooks for operational procedures
- code comments and docstrings for local semantics

Link instead of repeating.

### 6) Docs as code

- Keep changes reviewable like code
- Prefer small but meaningful diffs
- Update docs and code together where appropriate
- Never invent unsupported rationale, commands, behavior, or file paths

## Supported Scope Selectors

The user may provide one or more selectors in `$ARGUMENTS`.

### Scope options

- `-GitDiff [<base-ref>]`
  - Scope to the diff between `<base-ref>` and `HEAD`
  - If omitted, infer in this order:
    1. explicit base in user input
    2. `origin/HEAD`
    3. `origin/main`
    4. `origin/master`

- `-GitChanges`
  - Scope to current staged, unstaged, or relevant untracked changes

- `-Module <name-or-path>`
  - Scope to one module, package, service, or bounded context

- `-Folder <path>`
  - Scope to a folder subtree

- `-Files <path1,path2,...>`
  - Scope to an explicit file set

- `-BaseRef <ref>`
  - Explicit base ref used with `-GitDiff`

### Output and behavior options

- `-AllowCreate`
  - Allow creation of new documentation files when no suitable home exists

- `-ContractsOnly`
  - Update only canonical contracts or reference surfaces for the selected scope

- `-DocsOnly`
  - Update prose docs only; do not update code comments unless explicitly requested

- `-CodeComments`
  - Allow updating in-code documentation and purpose comments
  - In `-Full`, cover maintenance-critical module, class, service, controller, repository, and adapter surfaces, not only thin public API shells

- `-Full`
  - Perform a broader documentation pass for the selected scope
  - Prioritize human-readable onboarding, explanation, examples, troubleshooting, and safe modification guidance
  - In `-Full`, you MUST perform:
    - stakeholder coverage mapping
    - module or service structure discovery
    - Diataxis gap analysis
    - explicit documentation planning before writing

## Default Scope Behavior

If the user provides no explicit selector, determine scope in this order:
1. explicit paths, modules, or folders mentioned in natural language
2. current working tree changes if a git repo is available
3. a targeted repo scan limited to the most relevant docs for the request

Do not require git-based scoping if the user asked for a module, folder, explicit files, or a broader pass.

## Allowed Documentation Homes

Prefer these locations unless the repo clearly uses a different structure:
- `README.md`
- nearest module or service `README.md`
- `docs/`
- `docs/architecture/`
- `docs/architecture/decisions/` or `docs/adr/`
- `docs/reference/`
- `docs/runbooks/`
- `contracts/`
- canonical OpenAPI, AsyncAPI, GraphQL, CLI, or schema files
- public in-code documentation and docstrings

Do not create arbitrary documentation folders.

If reusable templates exist under `.codex/templates/docs/`, use them as the default page form and section ordering. Adapt them to the repo and scope; do not copy placeholders verbatim.

## Deterministic Deliverables and Must-Haves

When documenting a service or module in a substantial pass, the following artifacts are expected unless clearly not applicable.

### System level
- one start-here or index page
- one glossary or terminology home
- one architecture overview
- one explanation page for major concepts and data or control flow
- one reference area for auth, config, error model, and owned public interfaces
- one runbook or how-to area for common operation and recovery tasks

### Service or module level
- one service or module index page with:
  - purpose
  - ownership and non-ownership
  - architectural context
  - folder or module map
  - key workflows
  - how to modify safely
  - links to tutorial, how-to, reference, explanation, and troubleshooting
- one reference page for exact contracts:
  - endpoints, commands, events, schemas, config, and errors
- one explanation page for how it works and why it is structured that way
- one tutorial or how-to for a realistic task or flow
- one troubleshooting section or page
- meaningful code documentation on maintenance-critical public surfaces

### Code-level must-haves
- exported or public symbols have purpose-oriented docs when they are part of the maintained surface
- non-trivial APIs include parameters, returns, constraints, and failure notes
- maintenance-critical facades, services, controllers, repositories, and adapters have responsibility comments
- complex modules have a short module-purpose comment or README section explaining folder structure

## Standard Page Forms

Unless the repository already has an equally good convention, these page types should have a stable shape.

### Service or module index
- Overview
- Purpose and primary functionality
- When to use this service or module vs alternatives
- What it owns / does not own
- Architectural context
- Folder or module map with responsibilities
- Key workflows and scenarios
- How to modify safely
- Troubleshooting links
- Related components

### Reference page
- Overview and scope
- Authentication or permissions if relevant
- Exact API, event, command, schema, or config reference
- Request and response or input and output formats
- Error scenarios and meanings
- Examples
- Notes for integrators, testers, and operators

### Explanation page
- Problem being solved
- How the component works
- Why it is structured this way
- Tradeoffs and alternatives
- Important invariants and boundaries
- Links to reference and how-to pages

### How-to page
- Goal
- Preconditions
- Step-by-step task
- Verification
- Troubleshooting or rollback

### Tutorial page
- Learning goal
- Background assumptions
- Guided steps
- Expected outcomes
- What to learn next

### Runbook page
- Trigger or symptom
- Meaning
- Checks to perform
- Recovery or rollback
- Observability pointers

### ADR
- Status
- Context
- Decision
- Consequences
- Alternatives considered

## Code Documentation Standard

Use the language-appropriate standard for touched code:
- TypeScript or JavaScript: TSDoc or JSDoc
- Java: Javadoc
- Python: docstrings
- C#: XML docs
- other languages: the repo convention

For non-trivial touched public or maintenance-critical surfaces, document:
- purpose
- parameters or inputs
- outputs or return values
- invariants or constraints
- side effects where relevant
- error or failure conditions
- one example where practical for non-trivial APIs

Do not add noisy comments that restate obvious code.

## Workflow

### 1. Establish scope

1. Determine repo root.
2. Parse scope selectors from `$ARGUMENTS`.
3. Resolve scope according to the selected mode:
   - `-GitDiff`: determine `BASE_REF`, compute changed files
   - `-GitChanges`: collect working tree changes
   - `-Module`: resolve module, package, or service path
   - `-Folder`: resolve subtree
   - `-Files`: resolve explicit files
   - no selector: infer best scope from the request
4. Exclude generated files, vendored code, lockfiles, build output, and unrelated docs unless directly relevant.
5. Build the final documentation scope as:
   - selected implementation files
   - selected contracts or schemas
   - directly relevant tests
   - nearest existing documentation files closely related to the scope

If the selected scope contains no meaningful code, contract, configuration, or behavioral surface, return a concise report and do not invent documentation work.

### 2. Load context

Load only the minimum context needed.

Always consider if relevant:
- root `README.md`
- nearest module or service `README.md`
- selected contracts or schemas
- selected tests relevant to behavior
- selected configuration files

Load only if impacted:
- architecture docs
- ADRs
- runbooks
- existing reference docs
- service docs
- system index or glossary docs
- `.codex/templates/docs/` templates relevant to the selected documentation type

### 3. Determine stakeholders and questions

For the selected scope, identify the stakeholder groups that matter and their top questions.

Examples:
- engineers: what does this own, how does it work, how do I extend it?
- testers: what behavior, edge cases, and failure modes matter?
- integrators: how do I call it, configure it, and interpret errors?
- operators: how do I run, observe, and recover it?
- leads or architects: why is it designed this way, what changed, and what are the tradeoffs?

For `-Full`, include at least these questions where relevant:
- Engineers: what does this own, how is it organized, where do I modify behavior, and what invariants must I preserve?
- Testers: which flows, edge cases, and failure states matter most?
- Integrators: how do I call or configure this correctly and what errors should I expect?
- Operators: how do I run it, verify readiness, debug failures, and recover?
- Leads and architects: why is it designed this way and what are the key tradeoffs?

### 4. Gap analysis

Classify documentation impact into one or more buckets:
- `public-api`
- `config-runtime`
- `module-dev`
- `architecture`
- `adr`
- `operations`
- `code-comments`
- `no-durable-doc-change`

For substantial passes, explicitly identify:
- missing or mixed Diataxis pages
- missing architecture views or scenarios
- exported or public symbols missing doc comments
- key services, folders, or modules lacking human-readable responsibility guidance
- pages that contain lists without explaining purpose, usage, or modification path

### 5. Plan the smallest high-value set

Apply these rules in order:
1. Prefer updating the nearest existing doc over creating a new one
2. Prefer module or service docs over root docs for local behavior
3. Prefer reference or contracts over prose for precise interfaces
4. Prefer ADR over embedding decision history into architecture overview docs
5. Prefer runbook docs over architecture prose for operational procedures
6. Prefer code comments or docstrings for local semantics that do not justify prose docs

If a page is weak, improve or replace it rather than preserving low-value output.

### 6. Apply documentation updates

When relevant templates exist under `.codex/templates/docs/`, use them for:
- service or module index pages
- reference pages
- explanation pages
- how-to pages
- tutorial pages
- runbook pages
- ADRs

#### A. Public interfaces or contracts

If public API, schema, event, CLI, or config surface changed:
- update the canonical contract or reference source first
- document auth or permissions if relevant
- document inputs, outputs, and errors
- include examples when they materially improve understanding

#### B. Module or service docs

If responsibilities, workflows, invariants, or extension points changed, update the nearest module or service doc.

For `-Full`, module or service documentation MUST be human-readable and include:
- overview
- purpose and primary functionality
- when to use this component vs alternatives
- architectural context
- folder or module map with responsibilities
- key workflows and lifecycle
- how to modify safely
- troubleshooting
- related components

When writing service or module docs, explain:
- what the folders, classes, services, or modules are for
- where a maintainer should make common changes
- what should not be changed casually
- what tests or runtime checks should be consulted

#### C. Architecture docs

Update architecture docs only when the selected scope changes:
- major boundaries
- major interactions
- trust or security boundaries
- cross-cutting runtime behavior

For `-Full`, prefer at least one clear structural view and a few meaningful scenarios over many diagrams.

#### D. ADRs

Create or update an ADR only when the change introduces a meaningful long-lived decision.

#### E. Operations or runbooks

If operational behavior changed, document:
- trigger or symptom
- meaning
- checks to perform
- recovery or rollback notes
- relevant logs, metrics, or observability pointers

#### F. Code documentation

If `-CodeComments` is enabled or the user explicitly requested code documentation:
- add or improve public API comments or docstrings for touched public surfaces
- add examples where non-trivial and helpful
- move large narrative out of code and link to durable docs when needed

If `-CodeComments` and `-Full` are both enabled:
- document exported or public symbols in the selected scope unless clearly trivial
- add module, class, or service comments where a maintainer would otherwise have to infer purpose from surrounding code
- document important parameters, returns, invariants, side effects, and failure conditions
- explain responsibility of key folders and files when the scope is a module or service

### 7. Validation

Before finishing, validate the changes against this checklist:
- scope came from explicit user selectors and or a justified inferred scope
- existing docs were updated before creating new ones where practical
- documentation changes stay within appropriate documentation homes
- no arbitrary new folders were introduced
- public interface changes are documented in canonical contract or reference locations
- local behavior is documented in the nearest appropriate module or service doc when needed
- architecture docs were changed only for true architecture-level impact
- ADRs were used only for durable design decisions
- operational procedures live in runbooks, not scattered prose
- no duplicate explanations were introduced across documents
- new text stays close to the actual code, contracts, tests, and runtime behavior
- commands, file paths, config keys, and examples are accurate
- documentation is readable for its target audience
- relevant stakeholders have explicit entry points and their top questions are answered
- substantial module or service passes do not end as reference-only docs unless explanation, how-to or tutorial, and troubleshooting are explicitly judged not applicable
- in `-Full -CodeComments`, key public and maintenance-critical code surfaces received meaningful doc comments

## Output Report

Return a concise report with:
- scope selector(s) used
- base ref used if applicable
- selected implementation areas considered
- relevant stakeholders considered
- documentation files updated
- documentation files created
- code-comment or docstring updates made
- rationale for each documentation change
- items intentionally left undocumented to avoid duplication or low-value output
- remaining uncertainties, if any
- next 3-5 high-ROI documentation improvements only if genuinely useful

## Examples

```text
/speckit.documentation -GitDiff
/speckit.documentation -GitDiff origin/main
/speckit.documentation -GitChanges
/speckit.documentation -Module billing
/speckit.documentation -Folder src/services/payments
/speckit.documentation -Files src/api/user.ts,src/contracts/user.yaml -ContractsOnly
/speckit.documentation -Module auth -AllowCreate
/speckit.documentation -Folder services/order -Full
/speckit.documentation -Module catalog -CodeComments
```

## Key Rules

- Use absolute paths when referring to files during execution
- Prefer explicit user scope over inferred scope
- Prefer updating existing docs over creating new docs
- Do not create blob documents
- Do not create arbitrary documentation folders
- Do not invent rationale or behavior not supported by source material
- ERROR only if the requested output would be clearly redundant, misleading, or low-signal
