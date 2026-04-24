# Technical Specification: Local-First CRM MVP

**Product:** Local-First CRM MVP  
**Document type:** Technical specification / architecture reference  
**Version:** 0.1  
**Date:** 2026-04-24  
**Status:** Draft  
**Primary stack decision:** Tauri 2 + React + TypeScript + Vite  

---

## 1. Purpose of This Document

This document defines the recommended technology stack and technical architecture for the Local-First CRM MVP.

The CRM is intended to be a desktop application that stores its data in a local, human-readable folder structure, similar in concept to an Obsidian vault. The application should be able to work with folders synced by OneDrive, Google Drive, Nextcloud, Dropbox, or a normal shared/network drive without depending on those providers' APIs.

The first integration target is OpenProject for follow-up tasks. The integration must be replaceable later with Jira, GitLab issues, GitHub issues, Microsoft Planner, or other task-management systems.

---

## 2. Key Technical Decision

Use:

```text
Tauri 2
React
TypeScript
Vite
pnpm
Markdown + YAML frontmatter
Zod
MiniSearch
TanStack Query
Tailwind CSS
Radix UI or shadcn/ui
Vitest
React Testing Library
Playwright
```

The guiding principle is:

> Use TypeScript for product logic and UI. Use Tauri/Rust for native desktop capabilities, filesystem access, secure operations, packaging, and OS integration.

---

## 3. Why Tauri 2 + React + TypeScript

### 3.1 Product Fit

The CRM should be:

- Desktop-first.
- Local-first.
- File-based.
- Portable.
- Usable without a backend server.
- Capable of reading/writing local files.
- Able to integrate with external systems through HTTP APIs.
- Built with open-source/free tooling.

Tauri fits this because it packages a web frontend into a native desktop application while using Rust for the backend/native layer.

React + TypeScript fit because the application needs:

- Forms.
- Lists.
- Detail views.
- Dashboard widgets.
- Validation.
- A maintainable domain model.
- A scalable component structure.

Vite fits because it is a modern frontend build tool with fast development feedback and good React support.

---

## 4. Architecture Overview

```text
React + TypeScript Frontend
  - Dashboard
  - Companies
  - Contacts
  - Leads
  - Interactions
  - Settings
  - OpenProject configuration

        ↓

Application Services
  - CompanyService
  - ContactService
  - LeadService
  - InteractionService
  - TaskIntegrationService
  - SearchService

        ↓

Domain Layer
  - Company
  - Contact
  - Lead
  - Interaction
  - ExternalTaskRef
  - CRMVaultConfig

        ↓

Adapters
  - MarkdownVaultStorageAdapter
  - OpenProjectTaskProvider
  - SearchIndexAdapter
  - CredentialStorageAdapter

        ↓

Native / External Systems
  - Local filesystem via Tauri
  - CRM vault folder
  - OpenProject API
  - OS credential storage
```

---

## 5. Tauri + React Interaction Model

Tauri applications combine:

1. A **frontend web application**.
2. A **Rust/native backend**.
3. A communication bridge between both sides.

For this CRM:

```text
React UI
  ↓ calls
Tauri API / invoke commands
  ↓ executes
Rust backend functions or Tauri plugins
  ↓ accesses
Filesystem, dialogs, browser opening, credential storage
```

### 5.1 Frontend Responsibility

The React/TypeScript frontend should handle:

- User interface.
- Form state.
- Field validation.
- Routing.
- Loading and saving entities.
- Displaying timelines.
- Search UI.
- OpenProject settings UI.
- Error display.
- Local cache invalidation.
- User workflow orchestration.

### 5.2 Tauri/Rust Responsibility

The Tauri/Rust side should handle:

- Folder picker.
- File and directory operations.
- Safe/atomic writes.
- File watching.
- Opening external URLs.
- Access to OS-level credential storage.
- Packaging.
- Native integration.
- Security permissions and command exposure.

### 5.3 Communication from React to Rust

Tauri provides an `invoke` mechanism for calling Rust commands from the frontend.

Example TypeScript call:

```ts
import { invoke } from "@tauri-apps/api/core";

const companyId = await invoke<string>("create_company", {
  vaultPath,
  name: "ACME GmbH",
});
```

Example Rust command:

```rust
#[tauri::command]
async fn create_company(vault_path: String, name: String) -> Result<String, String> {
    // Create markdown file and return company ID.
    Ok("company_01HX123".to_string())
}
```

### 5.4 Communication from Rust to React

Rust can notify the frontend through Tauri events or channels.

Use cases:

- File changed externally.
- Vault index rebuild completed.
- OpenProject sync completed.
- Long-running operation progress.
- Conflict detected.

---

## 6. Recommended Project Structure

Use a monorepo-style structure from the beginning, even if it only contains one app. This keeps domain logic separate from UI and native shell code.

```text
local-first-crm/
  apps/
    desktop/
      src/
        app/
          App.tsx
          main.tsx
          routes.tsx
        features/
          companies/
          contacts/
          leads/
          interactions/
          dashboard/
          settings/
        shared/
          components/
          hooks/
          layout/
          utils/
      src-tauri/
        src/
          main.rs
          commands/
            vault.rs
            files.rs
            open_project.rs
            credentials.rs
        capabilities/
        tauri.conf.json
      package.json
      vite.config.ts

  packages/
    crm-domain/
      src/
        entities/
        schemas/
        services/
        errors/

    crm-storage/
      src/
        vault/
        markdown/
        indexing/
        backups/

    crm-integrations/
      src/
        task-provider/
        openproject/

    crm-ui/
      src/
        components/
```

For a very small first version, the `packages/` folder can be postponed. However, the code should still be organized as if these boundaries exist.

---

## 7. Technology Stack

## 7.1 Core Runtime and Frameworks

| Area | Decision | Reason |
|---|---|---|
| Desktop shell | Tauri 2 | Lightweight desktop packaging with native capabilities and Rust backend |
| Frontend framework | React | Mature component model for CRM-style UI |
| Language | TypeScript | Type-safe domain model and UI logic |
| Build tool | Vite | Fast development server and production builds |
| Package manager | pnpm | Efficient dependency management and workspace support |

---

## 7.2 UI Stack

| Area | Decision | Reason |
|---|---|---|
| Styling | Tailwind CSS | Fast, consistent admin-style UI |
| Accessible primitives | Radix UI | Open-source accessible components |
| Optional component starter | shadcn/ui | Useful copy-in components built on Tailwind/Radix |
| Icons | lucide-react | Open-source icon set |
| Forms | React Hook Form or controlled forms | Either is acceptable; keep simple for MVP |
| Routing | TanStack Router or React Router | Needed for entity detail pages |

Recommendation:

```text
Start with React Router if you want simplicity.
Use TanStack Router if you want stronger type-safe routing.
```

For the MVP, React Router is likely enough.

---

## 7.3 Data and Validation Stack

| Area | Decision | Reason |
|---|---|---|
| Entity validation | Zod | Runtime validation of files loaded from disk |
| Data format | Markdown + YAML frontmatter | Human-readable, portable, Obsidian-like |
| Markdown/frontmatter parsing | gray-matter or yaml + custom parser | Simple and mature |
| Local search | MiniSearch | Lightweight local search index |
| Async data/caching | TanStack Query | Good for async file and API operations |
| Dates | Native Date or date-fns | date-fns only if formatting becomes repetitive |

---

## 7.4 Testing Stack

| Test level | Tool | Purpose |
|---|---|---|
| Unit tests | Vitest | Domain logic, schema validation, serialization |
| Component tests | React Testing Library | Forms, lists, detail pages |
| End-to-end tests | Playwright | Full workflows across UI |
| Linting | ESLint | Code quality |
| Formatting | Prettier | Consistent formatting |
| Type checking | TypeScript compiler | Static correctness |

---

## 7.5 Native/Desktop Features

| Requirement | Recommended Tauri mechanism |
|---|---|
| Select CRM vault folder | Dialog plugin |
| Read/write local files | Filesystem plugin and/or custom Rust commands |
| Open OpenProject task URL | Opener plugin |
| Watch vault folder | Custom Rust command or Tauri/plugin support |
| Store non-sensitive settings | Tauri store plugin or config JSON |
| Store secrets/tokens | OS credential store / keyring approach / Stronghold |
| Security restrictions | Tauri permissions and capabilities |

---

## 8. License and Tooling Requirements

The project should use only free/open-source tools and libraries.

### 8.1 License Policy

Allowed licenses for dependencies:

```text
MIT
Apache-2.0
BSD-2-Clause
BSD-3-Clause
ISC
MPL-2.0, only after review
```

Avoid or review carefully:

```text
GPL
AGPL
SSPL
Commercial-only licenses
Free-for-non-commercial-only licenses
Source-available but not open-source licenses
Paid UI kits/templates
```

### 8.2 Dependency License Checks

Use package-manager tooling and/or an automated license checker in CI.

Suggested commands/tools:

```bash
pnpm licenses list
```

Optional additional tools:

```bash
license-checker-rseidelsohn
oss-review-toolkit
FOSSA, only if allowed by organization policy
```

### 8.3 Known Licenses of Proposed Core Stack

| Tool/library | License note |
|---|---|
| Tauri | MIT or Apache-2.0 where applicable |
| React | MIT |
| TypeScript | Apache-2.0 |
| Vite | MIT |
| TanStack Query | MIT |
| Zod | MIT |
| Tailwind CSS | MIT |
| Radix UI | MIT |
| MiniSearch | MIT |
| Vitest | MIT |
| Playwright | Apache-2.0 |

Always verify licenses at the time a dependency is added.

---

## 9. CRM Vault Design

## 9.1 Folder Structure

```text
crm-vault/
  companies/
  contacts/
  leads/
  interactions/
  attachments/
  config/
    crm-config.json
    task-provider-config.json
  indexes/
    search-index.json
  backups/
```

## 9.2 Entity File Naming

Use readable slugs plus stable IDs:

```text
companies/company-acme-gmbh-company_01HX123.md
contacts/contact-jane-doe-contact_01HX456.md
leads/lead-acme-pilot-lead_01HX789.md
interactions/2026-04-24-call-jane-doe-interaction_01HX999.md
```

The filename is for humans. The stable ID in frontmatter is the real identity.

## 9.3 Markdown Entity File Format

Example company file:

```markdown
---
schemaVersion: 1
id: company_01HX123
type: company
name: ACME GmbH
status: active
website: https://example.com
tags:
  - energy
createdAt: 2026-04-24T10:00:00Z
updatedAt: 2026-04-24T10:00:00Z
---

# ACME GmbH

## Notes

Potential partner for energy data space pilot.
```

Example contact file:

```markdown
---
schemaVersion: 1
id: contact_01HX456
type: contact
firstName: Jane
lastName: Doe
email: jane.doe@example.com
phone: "+49 123 456"
companyId: company_01HX123
role: Innovation Manager
status: active
tags:
  - partner
createdAt: 2026-04-24T10:05:00Z
updatedAt: 2026-04-24T10:05:00Z
---

# Jane Doe

## Notes

Met at Hannover Messe.
```

## 9.4 Schema Versioning

Every entity file must include:

```yaml
schemaVersion: 1
```

This allows future migrations.

Rules:

- Never load a file without validating it.
- Unknown schema versions should produce a clear error.
- Migrations should create backups before rewriting files.
- Index files should be rebuildable and not treated as source of truth.

---

## 10. Domain Model

## 10.1 Core Entities

```text
Company
Contact
Lead
Interaction
ExternalTaskRef
CRMVaultConfig
TaskProviderConfig
```

## 10.2 Company

Required fields:

```ts
type Company = {
  schemaVersion: 1;
  id: string;
  type: "company";
  name: string;
  status: "active" | "inactive" | "archived";
  website?: string;
  mainEmail?: string;
  mainPhone?: string;
  address?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  markdownBody: string;
};
```

## 10.3 Contact

```ts
type Contact = {
  schemaVersion: 1;
  id: string;
  type: "contact";
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId?: string;
  role?: string;
  status: "active" | "inactive" | "archived";
  tags: string[];
  createdAt: string;
  updatedAt: string;
  markdownBody: string;
};
```

## 10.4 Lead

```ts
type Lead = {
  schemaVersion: 1;
  id: string;
  type: "lead";
  title: string;
  companyId?: string;
  contactIds: string[];
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "won"
    | "lost"
    | "paused"
    | "archived";
  owner?: string;
  tags: string[];
  externalTaskRefs: ExternalTaskRef[];
  createdAt: string;
  updatedAt: string;
  markdownBody: string;
};
```

## 10.5 Interaction

```ts
type Interaction = {
  schemaVersion: 1;
  id: string;
  type: "interaction";
  interactionType:
    | "meeting"
    | "call"
    | "email_note"
    | "event_conversation"
    | "internal_note"
    | "other";
  dateTime: string;
  summary: string;
  companyIds: string[];
  contactIds: string[];
  leadIds: string[];
  externalTaskRefs: ExternalTaskRef[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  markdownBody: string;
};
```

## 10.6 External Task Reference

```ts
type ExternalTaskRef = {
  providerId: "openproject" | string;
  externalId: string;
  url: string;
  title: string;
  statusSnapshot?: string;
  lastSyncedAt?: string;
};
```

---

## 11. Validation with Zod

All entity files must be validated when loaded.

Example:

```ts
import { z } from "zod";

export const CompanySchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1),
  type: z.literal("company"),
  name: z.string().min(1),
  status: z.enum(["active", "inactive", "archived"]),
  website: z.string().url().optional().or(z.literal("")),
  mainEmail: z.string().email().optional().or(z.literal("")),
  mainPhone: z.string().optional(),
  address: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Company = z.infer<typeof CompanySchema> & {
  markdownBody: string;
};
```

Why this matters:

- Markdown files can be edited manually.
- Sync tools can create conflict copies.
- Files may be corrupted.
- Old schema versions may exist.
- The app must not trust raw disk data.

---

## 12. Storage Adapter

Define a storage interface independent of Tauri:

```ts
export interface CrmStorage {
  initializeVault(path: string): Promise<void>;

  listCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | null>;
  saveCompany(company: Company): Promise<void>;

  listContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | null>;
  saveContact(contact: Contact): Promise<void>;

  listLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | null>;
  saveLead(lead: Lead): Promise<void>;

  listInteractions(): Promise<Interaction[]>;
  saveInteraction(interaction: Interaction): Promise<void>;

  rebuildIndex(): Promise<void>;
}
```

Implementation:

```text
MarkdownVaultStorage implements CrmStorage
```

The React app should depend on the `CrmStorage` interface, not on raw filesystem APIs.

---

## 13. File Writing Strategy

File writing must be safe because the vault may be inside a synced folder.

Recommended write process:

```text
1. Read current file metadata/hash.
2. Check whether the file changed since it was loaded.
3. If changed, stop and show conflict warning.
4. Write new content to temporary file.
5. Create backup copy of current file.
6. Atomically replace original file if possible.
7. Rebuild/update index entry.
8. Emit UI notification.
```

Pseudo-flow:

```ts
async function safeWriteEntity(filePath: string, content: string, expectedHash?: string) {
  const currentHash = await hashFileIfExists(filePath);

  if (expectedHash && currentHash !== expectedHash) {
    throw new FileConflictError(filePath);
  }

  await createBackup(filePath);
  await writeTempFile(filePath, content);
  await replaceOriginalWithTemp(filePath);
}
```

---

## 14. Search Index

Use MiniSearch or a similar local in-memory/indexed search library.

Principles:

- Index is derived data.
- Index can be deleted and rebuilt.
- Search should include:
  - company name,
  - contact name,
  - email,
  - lead title,
  - interaction summary,
  - tags,
  - Markdown note body.

Example search document:

```ts
type SearchDocument = {
  id: string;
  entityType: "company" | "contact" | "lead" | "interaction";
  title: string;
  subtitle?: string;
  body: string;
  tags: string[];
  updatedAt: string;
};
```

Search index location:

```text
crm-vault/indexes/search-index.json
```

---

## 15. Task Provider Integration

## 15.1 Task Provider Interface

OpenProject must be one replaceable task provider, not a hard dependency of the domain.

```ts
export interface TaskManagementProvider {
  providerId: string;

  testConnection(): Promise<ConnectionStatus>;

  createTask(input: CreateTaskInput): Promise<ExternalTaskRef>;

  getTask(taskId: string): Promise<ExternalTask>;

  openTaskInBrowser(taskId: string): void;
}
```

## 15.2 Create Task Input

```ts
export type CreateTaskInput = {
  title: string;
  description: string;
  dueDate?: string;
  relatedEntityId: string;
  relatedEntityType: "contact" | "company" | "lead" | "interaction";
  assignee?: string;
  projectId?: string;
};
```

## 15.3 OpenProject Adapter

```text
OpenProjectTaskProvider implements TaskManagementProvider
```

Responsibilities:

- Test API connection.
- Load available projects if possible.
- Load available work package types if possible.
- Create work package.
- Return external task reference.
- Open work package URL.
- Fetch status snapshot.

OpenProject-specific data should remain inside the adapter.

---

## 16. Settings and Configuration

## 16.1 App-Level Settings

Stored outside the CRM vault, in the app config directory:

```json
{
  "lastOpenedVaultPath": "C:/Users/Daniel/OneDrive/CRM"
}
```

This allows the app to remember which vault was last used.

## 16.2 Vault-Level Settings

Stored inside the vault:

```text
crm-vault/config/crm-config.json
```

Example:

```json
{
  "schemaVersion": 1,
  "vaultName": "Fraunhofer CRM",
  "createdAt": "2026-04-24T10:00:00Z",
  "defaultLeadStatus": "new"
}
```

## 16.3 Task Provider Settings

Non-secret task provider settings may be stored in:

```text
crm-vault/config/task-provider-config.json
```

Example:

```json
{
  "schemaVersion": 1,
  "activeProvider": "openproject",
  "openproject": {
    "baseUrl": "https://openproject.example.com",
    "defaultProjectId": "123",
    "defaultWorkPackageTypeId": "1"
  }
}
```

Secrets/tokens must not be stored in this file.

---

## 17. Credential Storage

OpenProject tokens or OAuth credentials must not be stored in plain text inside the CRM vault.

Recommended approach:

```text
Use OS credential storage, keyring, or Tauri-compatible secure storage.
```

Requirements:

- Store token per local user.
- Allow user to remove credentials.
- Never log tokens.
- Never store tokens in Markdown files.
- Never store tokens in exported CRM backups unless explicitly designed and encrypted.

---

## 18. Tauri Security Model

Tauri uses permissions and capabilities to control what frontend windows/webviews may access.

For this app:

- Do not enable broad filesystem access unnecessarily.
- Scope access to the selected CRM vault folder where possible.
- Only expose required commands.
- Do not expose generic arbitrary shell execution.
- Do not expose unrestricted path access without validation.
- Use strict Content Security Policy where possible.

Suggested principle:

> The React frontend should only be able to access what the CRM needs, not the entire operating system.

---

## 19. Error Handling

Use structured errors.

```ts
type CrmError =
  | { type: "VaultNotFound"; path: string }
  | { type: "VaultNotWritable"; path: string }
  | { type: "InvalidEntityFile"; path: string; reason: string }
  | { type: "FileConflict"; path: string }
  | { type: "OpenProjectConnectionFailed"; reason: string }
  | { type: "OpenProjectAuthenticationFailed" }
  | { type: "UnknownError"; message: string };
```

UI requirements:

- Show clear human-readable error messages.
- Provide recovery action where possible.
- Do not show raw stack traces to normal users.
- Log technical details to a local debug log if needed.

---

## 20. Testing Strategy

## 20.1 Unit Tests

Use Vitest for:

- ID generation.
- Slug generation.
- Markdown serialization.
- Markdown parsing.
- Zod validation.
- Lead status transitions.
- Search index document generation.

## 20.2 Component Tests

Use React Testing Library for:

- Company form.
- Contact form.
- Lead form.
- Detail page rendering.
- Error states.
- Empty states.

## 20.3 End-to-End Tests

Use Playwright for vertical workflows:

```text
Create vault
→ Create company
→ Create contact
→ Link contact to company
→ Create lead
→ Add interaction
→ Close/reopen app
→ Verify data persists
```

OpenProject integration should have:

- Mocked API tests.
- One manual/integration test against a real OpenProject instance.
- Failure tests for authentication and connection errors.

---

## 21. Development Setup

## 21.1 Prerequisites

Install:

```text
Node.js LTS
pnpm
Rust toolchain
Tauri prerequisites for target OS
```

## 21.2 Create Project

Recommended starting command:

```bash
pnpm create tauri-app local-first-crm
```

Choose:

```text
Frontend: React
Language: TypeScript
Package manager: pnpm
```

## 21.3 Install Core Dependencies

Example:

```bash
pnpm add zod @tanstack/react-query minisearch gray-matter
pnpm add react-router
pnpm add -D vitest @testing-library/react @testing-library/user-event playwright eslint prettier
```

UI dependencies:

```bash
pnpm add tailwindcss lucide-react
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
```

Exact commands may vary depending on the selected UI setup.

---

## 22. CI/CD Recommendation

Use GitLab CI/CD or GitHub Actions.

Pipeline stages:

```text
install
typecheck
lint
test
license-check
build
package
```

Minimum CI checks:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm licenses list
pnpm build
```

Later:

```bash
pnpm exec playwright test
```

For desktop packaging, build per OS:

```text
Windows build
macOS build
Linux build
```

For the MVP, Windows-first is acceptable.

---

## 23. MVP Technical Milestones

## Milestone 1: Tauri + React Skeleton

Deliver:

- App starts.
- Sidebar navigation works.
- Dashboard page visible.
- Settings page visible.

## Milestone 2: Vault Creation

Deliver:

- Select local folder.
- Initialize CRM folder structure.
- Save app config.
- Reopen last vault.

## Milestone 3: Company/Contact Persistence

Deliver:

- Create company.
- Create contact.
- Store Markdown files.
- Reload from disk.

## Milestone 4: Detail Views

Deliver:

- Company detail page.
- Contact detail page.
- Linked contacts/companies.

## Milestone 5: Leads and Interactions

Deliver:

- Create lead.
- Change lead status.
- Add interaction.
- Show timelines.

## Milestone 6: OpenProject Adapter

Deliver:

- Configure OpenProject.
- Test connection.
- Create work package.
- Store external task reference.

## Milestone 7: Search and Dashboard

Deliver:

- Build search index.
- Global search.
- Dashboard widgets.

## Milestone 8: Safe Writes and Backups

Deliver:

- Backup before write.
- Conflict detection.
- Rebuild index.
- Beta package.

---

## 24. Explicit Non-Goals for the MVP

Do not implement in the first MVP:

- Server backend.
- Multi-tenant SaaS.
- Role-based access control.
- Real-time collaboration.
- Email synchronization.
- Calendar synchronization.
- Mobile app.
- Built-in task management replacement.
- Complex reporting.
- AI features.
- Plugin marketplace.
- Own cloud sync.

---

## 25. Main Architectural Rules

1. **Domain layer must not depend on Tauri.**
2. **Domain layer must not depend on OpenProject.**
3. **OpenProject must be an adapter.**
4. **Markdown files are the source of truth.**
5. **Indexes are disposable.**
6. **Every entity file must have a schema version.**
7. **Every loaded file must be validated.**
8. **Never silently overwrite externally changed files.**
9. **Never store secrets in the CRM vault.**
10. **Every phase must produce a visible, testable product slice.**

---

## 26. References

### Tauri

- Create project:  
  https://v2.tauri.app/start/create-project/

- Frontend with Vite:  
  https://v2.tauri.app/start/frontend/vite/

- Calling Rust from the frontend:  
  https://v2.tauri.app/develop/calling-rust/

- Calling the frontend from Rust:  
  https://v2.tauri.app/develop/calling-frontend/

- File system plugin:  
  https://v2.tauri.app/plugin/file-system/

- Dialog plugin:  
  https://v2.tauri.app/plugin/dialog/

- Permissions and capabilities:  
  https://v2.tauri.app/security/permissions/  
  https://v2.tauri.app/reference/acl/capability/

- Tauri license/architecture:  
  https://v2.tauri.app/concept/architecture/  
  https://github.com/tauri-apps/tauri

### React / Vite / TypeScript

- React build tool recommendation:  
  https://react.dev/learn/build-a-react-app-from-scratch

- Vite guide:  
  https://vite.dev/guide/

- React license:  
  https://github.com/facebook/react/blob/master/LICENSE

- TypeScript license:  
  https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt

### Supporting Libraries

- TanStack Query:  
  https://tanstack.com/query/latest  
  https://github.com/TanStack/query/blob/main/LICENSE

- Zod:  
  https://zod.dev/  
  https://github.com/colinhacks/zod

- MiniSearch:  
  https://github.com/lucaong/minisearch

- Radix UI:  
  https://www.radix-ui.com/  
  https://github.com/radix-ui/primitives

- Playwright:  
  https://playwright.dev/  
  https://github.com/microsoft/playwright

### OpenProject

- OpenProject API introduction:  
  https://www.openproject.org/docs/api/introduction/

- Work package API:  
  https://www.openproject.org/docs/api/endpoints/work-packages/

- API examples / form handling:  
  https://www.openproject.org/docs/api/example/

---

## 27. Final Recommendation

Proceed with:

```text
Tauri 2
React
TypeScript
Vite
pnpm
Tailwind CSS
Radix UI / shadcn-style components
Zod
MiniSearch
TanStack Query
Markdown + YAML frontmatter
Vitest
React Testing Library
Playwright
OpenProject adapter
```

This stack is well aligned with the CRM’s goals:

- Local-first.
- File-based.
- Desktop-friendly.
- Open-source/free.
- Maintainable.
- Extensible.
- Suitable for an MVP and later growth.
