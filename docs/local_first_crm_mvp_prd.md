# Product Requirements Document: Local-First CRM MVP

**Product name:** Local-First CRM MVP  
**Document type:** Product Requirements Document (PRD)  
**Version:** 0.1  
**Date:** 2026-04-24  
**Status:** Draft  

---

## 1. Product Vision

Build a lightweight, local-first CRM client for managing companies, contacts, leads, and follow-up tasks.

The CRM stores its own data in a configurable local folder using human-readable files, similar to an Obsidian vault. The folder can be placed inside OneDrive, Google Drive, Nextcloud, Dropbox, a network share, or any other synced/shared storage.

The CRM should not try to replace a full project management system. Instead, it should integrate with external task systems, starting with **OpenProject**, so follow-up tasks can be managed in a proper project/task environment.

---

## 2. MVP Goal

The MVP should answer four basic questions:

1. **Who do we know?**  
   Contacts and companies.

2. **What is the relationship status?**  
   Lead status, relationship notes, and communication history.

3. **What should happen next?**  
   Follow-up tasks linked to OpenProject work packages.

4. **Where is the data?**  
   In a local, transparent, user-controlled folder.

---

## 3. Target Users

Primary users:

- Small teams doing sales, partner management, research transfer, consulting, or business development.
- Users who want CRM-like structure but do not want to maintain a full CRM server.
- Users who like local-first tools such as Obsidian.
- Teams already using OpenProject, Jira, or another project/task system.

Initial target use case:

> A small organization wants to track companies, contacts, leads, notes, and follow-up tasks without adopting a heavy CRM platform.

---

## 4. Product Scope

### 4.1 In Scope for MVP

- Contact management.
- Company management.
- Simple lead management.
- Local file-based data storage.
- Configurable CRM folder location.
- Configurable OpenProject connection.
- Creation and linking of OpenProject follow-up tasks.
- Simple desktop UI.
- Search and filtering.
- Basic import/export.
- Minimal settings screen.

### 4.2 Out of Scope for MVP

- Email synchronization.
- Calendar synchronization.
- Marketing automation.
- Newsletter management.
- Sales forecasting.
- Role-based multi-user permissions.
- Built-in task management.
- Built-in ticketing/helpdesk.
- Complex automation workflows.
- Mobile app.
- Real-time collaboration.
- Server backend.

---

## 5. Core Product Concept

The CRM is a **desktop client** that works against a folder structure like this:

```text
crm-vault/
  companies/
    company-acme-gmbh.md
  contacts/
    contact-jane-doe.md
  leads/
    lead-acme-energy-project.md
  interactions/
    2026-04-24-call-acme-jane-doe.md
  attachments/
  config/
    crm-config.json
    openproject-config.json
  indexes/
    search-index.json
```

The local folder is the source of truth. Cloud sync is handled externally by OneDrive, Google Drive, Nextcloud, Dropbox, or another provider.

The CRM should not depend on the sync provider’s API in the MVP. It only needs access to a normal local filesystem path.

---

## 6. Key Design Principles

### 6.1 Local-First

The user owns the data. The CRM should work even without internet access, except for OpenProject synchronization.

### 6.2 Human-Readable Storage

Data should be stored in Markdown files with structured frontmatter, for example YAML frontmatter plus Markdown body. This keeps the data portable and editable.

Example:

```markdown
---
id: contact_01HTX7K9
type: contact
firstName: Jane
lastName: Doe
email: jane.doe@example.com
phone: "+49 123 456"
companyId: company_01HTX7A1
role: Innovation Manager
status: active
tags:
  - energy
  - partner
createdAt: 2026-04-24T10:00:00Z
updatedAt: 2026-04-24T10:00:00Z
---

# Jane Doe

## Notes

Met at Hannover Messe. Interested in data spaces and forecasting.

## Relationship Context

Potential partner for pilot project.
```

### 6.3 Replaceable Integrations

OpenProject should be implemented through a task-management adapter interface. The CRM should not hard-code OpenProject concepts deep into the domain model.

Future adapters could include:

- Jira.
- GitLab issues.
- GitHub issues.
- Microsoft Planner.
- Linear.
- Generic webhook/task API.

### 6.4 Simple Before Powerful

The first version should prioritize clarity, speed, and reliability over advanced CRM functionality.

---

## 7. Core Entities

### 7.1 Company

A company represents an organization, customer, partner, public institution, research institute, funder, supplier, or other business entity.

Required fields:

- ID.
- Name.
- Type: customer, lead, partner, supplier, funder, other.
- Status: active, inactive, archived.
- Website.
- Main email.
- Main phone.
- Address.
- Tags.
- Notes.
- Created date.
- Updated date.

Optional fields:

- Industry.
- Company size.
- Country.
- Region.
- LinkedIn/profile URL.
- Source.
- Owner.
- Related companies.

---

### 7.2 Contact

A contact represents a person.

Required fields:

- ID.
- First name.
- Last name.
- Company link.
- Email.
- Status.
- Tags.
- Notes.
- Created date.
- Updated date.

Optional fields:

- Phone.
- Role/title.
- Department.
- LinkedIn/profile URL.
- Preferred communication channel.
- Consent status.
- Relationship strength.
- Source.
- Owner.

---

### 7.3 Lead

A lead represents a potential opportunity, collaboration, sale, project, or business development case.

Required fields:

- ID.
- Title.
- Related company.
- Related contacts.
- Lead status.
- Owner.
- Created date.
- Updated date.

Suggested lead statuses:

```text
new
contacted
qualified
proposal
negotiation
won
lost
paused
archived
```

Optional fields:

- Estimated value.
- Probability.
- Expected close date.
- Source.
- Tags.
- Notes.
- Next action date.
- Linked OpenProject work package IDs.

---

### 7.4 Interaction

An interaction captures something that happened.

Interaction types:

- Meeting.
- Call.
- Email note.
- Event conversation.
- LinkedIn message.
- Internal note.
- Other.

Required fields:

- ID.
- Date/time.
- Type.
- Related company.
- Related contacts.
- Summary.
- Created date.
- Updated date.

Optional fields:

- Follow-up required: yes/no.
- Linked lead.
- Linked task.
- Attachments.
- Tags.

---

### 7.5 Follow-Up Task Reference

The MVP should not duplicate the whole task system. It should store references to external tasks.

Required fields:

- External system, for example `openproject`.
- External task ID.
- External URL.
- Title.
- Status snapshot.
- Last sync timestamp.
- Related contact/company/lead.

---

## 8. Functional Requirements

### 8.1 Vault Setup

The user must be able to select or create a CRM folder.

Requirements:

- User can select an existing folder.
- User can create a new CRM folder.
- App validates that the folder is writable.
- App creates required subfolders.
- App creates default config files.
- App warns if the folder already contains incompatible CRM data.
- App should not require OneDrive/Google Drive specifically; any local path should work.

Acceptance criteria:

- Given a new empty folder, the app initializes a valid CRM vault.
- Given an existing CRM vault, the app opens it without modifying data unexpectedly.
- Given a read-only folder, the app shows a clear error.

---

### 8.2 Contact Management

Requirements:

- Create contact.
- Edit contact.
- Archive contact.
- Delete contact, preferably soft delete in MVP.
- Link contact to company.
- Search contacts.
- Filter by company, tag, status, owner.
- Show all interactions for a contact.
- Show all leads related to a contact.
- Show linked follow-up tasks.

Acceptance criteria:

- A user can create a contact with name, email, company, and notes.
- The contact is saved as a Markdown file.
- The contact appears in search immediately.
- Editing a contact updates the file and `updatedAt` timestamp.

---

### 8.3 Company Management

Requirements:

- Create company.
- Edit company.
- Archive company.
- Link contacts to company.
- View all contacts of a company.
- View all leads of a company.
- View all interactions of a company.
- View linked follow-up tasks.

Acceptance criteria:

- A user can create a company and assign contacts to it.
- The company detail page shows contacts, leads, notes, and interaction history.
- A company can be archived without deleting its contacts.

---

### 8.4 Lead Management

Requirements:

- Create lead.
- Assign lead to company.
- Assign one or more contacts.
- Set lead status.
- Add notes.
- Create follow-up task in OpenProject.
- View linked OpenProject tasks.
- Filter leads by status, company, owner, tag.

Acceptance criteria:

- A user can create a lead from a company page.
- A user can move a lead from `new` to `contacted`, `qualified`, etc.
- A user can create an OpenProject follow-up task from the lead view.
- The lead file stores the external task link.

---

### 8.5 Interaction Notes

Requirements:

- Add interaction note to contact, company, or lead.
- Interaction note must support Markdown.
- Interaction note must have date, type, summary, and full note body.
- Interaction appears in related timelines.

Acceptance criteria:

- A user can log a meeting with a company and two contacts.
- The interaction appears on the company page and both contact pages.
- The interaction is stored as a separate Markdown file.

---

### 8.6 OpenProject Integration

OpenProject should be the first implementation of a generic task-management integration.

Requirements:

- User can configure OpenProject base URL.
- User can configure authentication.
- User can select default project.
- User can select default work package type.
- User can create a follow-up work package from:
  - Contact.
  - Company.
  - Lead.
  - Interaction.
- CRM stores OpenProject work package ID and URL.
- CRM can refresh task status from OpenProject.
- CRM handles connection errors gracefully.

Authentication:

- Prefer OAuth2 where possible.
- For MVP/dev mode, allow API token or personal access token only if supported and acceptable for the target OpenProject deployment.

Task adapter interface:

```typescript
interface TaskManagementProvider {
  providerId: string;

  testConnection(): Promise<ConnectionStatus>;

  createTask(input: CreateTaskInput): Promise<ExternalTaskRef>;

  getTask(taskId: string): Promise<ExternalTask>;

  listTasksForCrmEntity(entityId: string): Promise<ExternalTask[]>;

  openTaskInBrowser(taskId: string): void;
}
```

Example create task input:

```typescript
type CreateTaskInput = {
  title: string;
  description: string;
  dueDate?: string;
  relatedEntityId: string;
  relatedEntityType: "contact" | "company" | "lead" | "interaction";
  assignee?: string;
  projectId?: string;
};
```

Acceptance criteria:

- User can test OpenProject connection from settings.
- User can create a task from a lead.
- The task appears in OpenProject.
- The CRM stores the returned task ID and URL.
- If OpenProject is offline, the CRM shows a clear error and does not corrupt local CRM data.

---

### 8.7 Search and Filtering

Requirements:

- Global search across contacts, companies, leads, and notes.
- Filter contacts by company, tag, status.
- Filter leads by status, owner, tag.
- Search should work offline.
- Search index should be rebuilt if needed.

Acceptance criteria:

- Searching for a company name returns company, contacts, and related leads.
- Searching within notes returns matching interactions.
- Search index can be rebuilt from source files.

---

### 8.8 Import/Export

MVP import:

- CSV import for contacts.
- CSV import for companies.
- Basic duplicate detection by email/domain/name.

MVP export:

- Export contacts to CSV.
- Export companies to CSV.
- Export leads to CSV.
- Since files are already Markdown, raw folder export is inherently possible.

Acceptance criteria:

- User can import a CSV with contacts.
- User can map CSV columns to CRM fields.
- Duplicate contacts are flagged before import.

---

## 9. UI Requirements

### 9.1 Main Navigation

The MVP UI should have:

```text
Dashboard
Companies
Contacts
Leads
Interactions
Settings
```

---

### 9.2 Dashboard

Dashboard should show:

- Recently updated companies.
- Recently added contacts.
- Open leads by status.
- Follow-ups due soon.
- OpenProject connection status.

---

### 9.3 Company Detail Page

Sections:

- Header: name, type, status, tags.
- Contact list.
- Lead list.
- Interaction timeline.
- Follow-up tasks.
- Notes.

Primary actions:

- Add contact.
- Add lead.
- Add interaction.
- Create follow-up task.
- Edit company.

---

### 9.4 Contact Detail Page

Sections:

- Header: name, role, company, status.
- Contact information.
- Interaction timeline.
- Related leads.
- Follow-up tasks.
- Notes.

Primary actions:

- Add interaction.
- Create follow-up task.
- Edit contact.

---

### 9.5 Lead Detail Page

Sections:

- Header: title, status, owner.
- Company/contact links.
- Notes.
- Timeline.
- Follow-up tasks.

Primary actions:

- Change status.
- Add note.
- Create OpenProject task.
- Mark lead won/lost/paused.

---

### 9.6 Settings

Settings should include:

- CRM folder path.
- Data backup warning/info.
- OpenProject base URL.
- OpenProject authentication.
- Default OpenProject project.
- Default work package type.
- Task provider selection.
- Rebuild search index.
- Export data.
- App version.

---

## 10. Data Storage Requirements

### 10.1 File Format

Recommended:

- Markdown files with YAML frontmatter.
- Stable IDs generated by the app.
- No business-critical state hidden only in indexes.
- Index files may be regenerated.

---

### 10.2 File Naming

Use readable slugs plus stable internal IDs.

Example:

```text
contacts/contact-jane-doe-contact_01HTX7K9.md
companies/company-acme-gmbh-company_01HTX7A1.md
leads/lead-acme-energy-pilot-lead_01HTX8B2.md
```

---

### 10.3 Conflict Handling

Because OneDrive, Google Drive, Dropbox, Nextcloud, and similar sync tools are eventually consistent, conflicts must be expected.

MVP requirements:

- Detect if a file changed externally while open.
- Warn user before overwriting external changes.
- Keep automatic backup copy before save.
- Never silently delete unknown files.
- Provide a “reload from disk” option.
- Log conflicts.

Later requirements:

- Three-way merge.
- Conflict resolution UI.
- Entity-level version history.

---

### 10.4 Backups

MVP requirements:

- On every write, optionally create local backup copy.
- Keep last N versions per file.
- Provide “open CRM folder” button.
- Provide “export zip backup” action.

---

## 11. Non-Functional Requirements

### 11.1 Performance

The MVP should support at least:

- 5,000 contacts.
- 2,000 companies.
- 10,000 interaction notes.
- 1,000 leads.

Expected behavior:

- App startup under a few seconds for normal datasets.
- Search results within 500 ms after index is built.
- Lazy loading for timelines.

---

### 11.2 Reliability

Requirements:

- Atomic file writes where possible.
- Backup before destructive operations.
- Index rebuild from source files.
- Clear error messages for sync/storage problems.

---

### 11.3 Security

Requirements:

- Do not store OpenProject secrets in plain text if avoidable.
- Use OS credential store/keychain for tokens.
- Avoid logging access tokens.
- Provide “remove credentials” option.
- Local files may contain personal data, so the user must be warned that the selected shared folder controls access.

---

### 11.4 Privacy / GDPR

Requirements:

- Track consent status for contacts.
- Track source of contact data.
- Support export of a contact’s data.
- Support deletion/anonymization of a contact.
- Avoid collecting unnecessary personal data.

---

### 11.5 Portability

Requirements:

- Data can be read without the app.
- Markdown files remain understandable.
- No vendor lock-in to OneDrive, Google Drive, or OpenProject.
- OpenProject links remain normal URLs.

---

## 12. Technical Architecture

Suggested stack:

```text
Desktop client:
  Electron or Tauri

Frontend:
  React + TypeScript

Storage:
  Local filesystem
  Markdown + YAML frontmatter
  JSON indexes

Search:
  Local index, e.g. FlexSearch/Lunr-style approach

Integrations:
  TaskManagementProvider interface
  OpenProject adapter first

Configuration:
  Local config files + OS credential store for secrets
```

Given an existing TypeScript/React direction, a reasonable first choice would be:

- **Tauri + React + TypeScript** if a lean desktop client is preferred.
- **Electron + React + TypeScript** if the largest ecosystem and easiest desktop integration are preferred.

---

## 13. Proposed Modules

```text
app-shell
  windowing
  navigation
  routing

crm-domain
  contacts
  companies
  leads
  interactions
  tasks

crm-storage
  vault initialization
  markdown parser/writer
  file watcher
  index builder
  backup manager

crm-integrations
  task provider interface
  openproject adapter

crm-ui
  dashboard
  contact views
  company views
  lead views
  settings

crm-security
  credential storage
  token handling

crm-import-export
  CSV import
  CSV export
```

---

## 14. MVP User Stories

### 14.1 Vault Setup

As a user, I want to select a local CRM folder so that I can store my CRM data in a shared/synced drive.

Acceptance criteria:

- I can select a folder.
- The app validates it.
- The app creates the needed structure.
- I can reopen the same folder later.

---

### 14.2 Create Company

As a user, I want to create a company so that I can track organizations I work with.

Acceptance criteria:

- I can enter name, website, type, status, tags, and notes.
- The company is saved as a Markdown file.
- The company appears in the company list.

---

### 14.3 Create Contact

As a user, I want to create a contact and link it to a company.

Acceptance criteria:

- I can enter name, email, phone, role, company, tags, and notes.
- The contact appears under the company.
- The contact appears in global search.

---

### 14.4 Create Lead

As a user, I want to create a lead for a company/contact.

Acceptance criteria:

- I can create a lead from a company or contact.
- I can assign status and owner.
- I can add notes.
- I can filter leads by status.

---

### 14.5 Log Interaction

As a user, I want to log a meeting or call so that the relationship history is preserved.

Acceptance criteria:

- I can create an interaction with type, date, summary, notes, and linked people.
- The interaction appears in related timelines.

---

### 14.6 Create OpenProject Follow-Up

As a user, I want to create a follow-up task in OpenProject from a CRM lead.

Acceptance criteria:

- I can click “Create follow-up task.”
- The app creates an OpenProject work package.
- The CRM stores the external task reference.
- I can open the task in OpenProject.

---

## 15. Important Implementation Decisions

### Decision 1: Shared Folder, Not Cloud API

For MVP, the CRM should only use a local folder path. OneDrive, Google Drive, Nextcloud, Dropbox, or similar sync should be external.

Reason:

- Simpler.
- Provider-independent.
- Easier to test.
- Aligned with Obsidian-like behavior.

---

### Decision 2: OpenProject as Adapter, Not Core Dependency

OpenProject should be one implementation of `TaskManagementProvider`.

Reason:

- Jira or another system may be added later.
- Prevents vendor lock-in.
- Keeps CRM domain clean.

---

### Decision 3: Markdown Files as Source of Truth

Indexes should be derived.

Reason:

- Human-readable.
- Portable.
- Easier backup.
- Easier debugging.
- Similar mental model to Obsidian.

---

### Decision 4: No Multi-User Permission Model in MVP

Access is controlled by the shared drive provider.

Reason:

- Keeps MVP manageable.
- Avoids building a server.
- But the app must clearly warn users that everyone with folder access may access CRM data.

---

## 16. Risks and Mitigations

| Risk | Description | Mitigation |
|---|---|---|
| File sync conflicts | Two users edit the same file at the same time. | Detect external changes, backup before write, show conflict warning. |
| Data privacy leakage | Shared folder may expose personal data to unintended users. | Clear warning, documentation, consent/source fields, access guidance. |
| OpenProject API complexity | Work package creation may require project/type/status-specific fields. | Use configurable defaults and test connection screen. |
| Poor data quality | Duplicate contacts/companies. | Duplicate detection by email/domain/name. |
| Scope creep | CRM features can grow endlessly. | Keep MVP focused on contacts, companies, leads, follow-ups. |
| Hidden lock-in | OpenProject concepts leak into CRM domain. | Adapter interface and generic external task reference. |
| Search/index corruption | Index files can become stale. | Rebuild index from Markdown source files. |

---

## 17. Suggested Development Milestones

### Milestone 1: Local Vault Foundation

Deliverables:

- Desktop app skeleton.
- Folder selection.
- Vault initialization.
- Markdown read/write.
- File watcher.
- Basic index rebuild.

---

### Milestone 2: Companies and Contacts

Deliverables:

- Company CRUD.
- Contact CRUD.
- Company-contact linking.
- Search.
- Basic dashboard.

---

### Milestone 3: Leads and Interactions

Deliverables:

- Lead CRUD.
- Lead statuses.
- Interaction notes.
- Timelines on company/contact/lead pages.

---

### Milestone 4: OpenProject Integration

Deliverables:

- OpenProject settings.
- Connection test.
- Create work package from lead/contact/company.
- Store external task references.
- Open task in browser.
- Refresh task status.

---

### Milestone 5: Import/Export and Hardening

Deliverables:

- CSV import.
- CSV export.
- Duplicate detection.
- Backup before write.
- Conflict detection.
- Basic privacy/export/delete functions.

---

## 18. MVP Success Criteria

The MVP is successful when:

- A small team can manage contacts, companies, leads, and follow-ups without a central CRM server.
- Data remains readable as files.
- Users can place the CRM vault in OneDrive, Google Drive, Nextcloud, Dropbox, or another shared folder.
- Users can create OpenProject follow-up tasks from CRM records.
- Users can search relationship data quickly.
- The app does not corrupt data during normal file-sync scenarios.
- The OpenProject integration can later be replaced by Jira or another task provider.

---

## 19. Open Questions Before Development

These should be decided early:

1. Should this be a **single-user-first** app with shared-folder support, or explicitly a small-team app?
2. Should files use **YAML frontmatter + Markdown**, or JSON files plus Markdown notes?
3. Should contacts and companies be separate files, or should small relationships be embedded?
4. Should the app allow manual editing of files while open?
5. Should OpenProject credentials be per-user or shared per vault?
6. Should every follow-up task exist only in OpenProject, or should the CRM also keep local draft tasks when offline?
7. Should the MVP support Windows only first, or Windows/macOS/Linux from the beginning?

---

## 20. Recommended First Vertical Slice

Start with this minimal vertical slice:

```text
Open CRM folder
→ Create company
→ Create contact
→ Create lead
→ Add interaction note
→ Create OpenProject follow-up task
→ See everything on company timeline
```

This slice proves the entire concept: local-first CRM data, simple UI, relationship context, and external task-system integration.

---

## 21. References and Assumptions

The MVP concept is based on the following assumptions and public documentation:

- Obsidian stores notes as Markdown-formatted plain text files in a local vault folder, and the vault can be managed with normal file tools:  
  https://obsidian.md/help/data-storage

- Google Drive for Desktop supports local file synchronization/mirroring or streaming behavior, making a synced local folder a realistic storage location:  
  https://support.google.com/drive/answer/13401938  
  https://support.google.com/drive/answer/10838124

- OpenProject provides an API for work packages and documents OAuth2 authentication options:  
  https://www.openproject.org/docs/api/endpoints/work-packages/  
  https://www.openproject.org/docs/api/introduction/

---

## 22. Notes for Future Specification

This PRD intentionally stays at the product-requirements level. Before implementation, the following additional documents would be useful:

- Technical architecture document.
- Domain model and file format specification.
- OpenProject adapter specification.
- UI wireframes.
- Test strategy.
- Data migration/import specification.
- Security and privacy checklist.
