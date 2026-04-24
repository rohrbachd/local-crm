# Local-First CRM MVP Roadmap

**Product:** Local-First CRM MVP  
**Document type:** Development roadmap  
**Version:** 0.1  
**Date:** 2026-04-24  
**Status:** Draft  

---

## Phase Checklist (High-Level)

- [ ] Phase 0 - Clickable shell + vault setup
- [ ] Phase 1 - Company + contact mini CRM
- [ ] Phase 2 - Relationship detail views
- [ ] Phase 3 - Lead management slice
- [ ] Phase 4 - Interaction timeline slice
- [ ] Phase 5 - OpenProject follow-up slice
- [ ] Phase 6 - Search, filters, and dashboard
- [ ] Phase 7 - Import/export + data quality
- [ ] Phase 8 - Sync-safety hardening + beta

---

## 1. Roadmap Philosophy

This roadmap is organized around **vertical development slices**.

A vertical slice means that each phase should deliver a small but complete piece of functionality across the full application stack:

- User interface.
- Domain logic.
- Local storage.
- Data model.
- Error handling.
- Basic test coverage.
- Demo scenario.

The goal is to avoid building “invisible” layers for too long. At the end of every phase, there should be a clickable, testable, visual product increment.

Each phase should answer:

> What can a user do at the end of this phase that they could not do before?

---

## 2. Roadmap Overview

| Phase | Working product at the end | Main value |
|---|---|---|
| **0. Clickable shell + vault setup** | User can open the app, select/create a CRM folder, and see a dashboard | Proves the desktop/local-folder concept |
| **1. Company + contact mini CRM** | User can create companies and contacts and see them stored as Markdown files | First real CRM value |
| **2. Relationship detail views** | User can open a company/contact page with linked data and notes | Makes it feel like a real CRM |
| **3. Lead management slice** | User can create and move leads through simple statuses | Adds business-development workflow |
| **4. Interaction timeline slice** | User can log calls/meetings/notes and see relationship history | Adds CRM memory |
| **5. OpenProject follow-up slice** | User can create an OpenProject follow-up task from a lead/contact/company | Connects CRM to task execution |
| **6. Search, filters, and dashboard** | User can search and filter CRM data and see useful overview widgets | Makes the product usable with real data |
| **7. Import/export + data quality** | User can import contacts/companies and detect duplicates | Makes it practical for first users |
| **8. Sync-safety hardening + beta** | App detects file conflicts, creates backups, and feels safe enough for testing | Makes shared-drive usage less risky |

---

## 3. Phase 0 — Clickable Shell + Vault Setup

### Goal

Create the smallest possible product that proves the core concept:

> This is a desktop CRM client that works on a local folder.

The app should behave conceptually like an Obsidian-style vault application: the user chooses a folder, and the application uses that folder as the workspace.

### End-to-End Demo

A user can:

1. Start the app.
2. Choose **Create CRM Vault**.
3. Select a local folder.
4. The app creates the folder structure.
5. Dashboard opens and shows:
   - CRM folder path.
   - Number of companies: 0.
   - Number of contacts: 0.
   - OpenProject: not configured.
6. User closes and reopens the app.
7. App remembers the selected vault.

### Build in This Phase

| Area | Scope |
|---|---|
| App shell | Desktop app, routing, layout, sidebar |
| Navigation | Dashboard, Companies, Contacts, Leads, Settings |
| Storage | Create/read config file |
| Vault | Create folder structure |
| UI | Empty states and onboarding |
| Settings | Show selected CRM folder |

### Suggested Files Created

```text
crm-vault/
  companies/
  contacts/
  leads/
  interactions/
  attachments/
  config/
    crm-config.json
  indexes/
```

### Acceptance Criteria

- App starts successfully.
- User can select a CRM folder.
- Folder structure is created.
- App can reopen an existing CRM folder.
- Dashboard shows real folder path and basic counts.
- No company/contact functionality yet.

### Do Not Build Yet

- Authentication.
- OpenProject.
- Search.
- Import/export.
- Sync conflict handling beyond basic write errors.

---

## 4. Phase 1 — Company + Contact Mini CRM

### Goal

Create the first useful CRM feature:

> I can enter companies and contacts and see them again.

This phase should already produce real Markdown data in the vault.

### End-to-End Demo

A user can:

1. Open the CRM.
2. Create a company, for example **ACME GmbH**.
3. Create a contact, for example **Jane Doe**.
4. Link Jane Doe to ACME GmbH.
5. Close and reopen the app.
6. See ACME GmbH and Jane Doe still listed.
7. Open the local folder and inspect the generated Markdown files.

### Build in This Phase

| Area | Scope |
|---|---|
| Company model | ID, name, type, website, email, phone, address, tags, notes |
| Contact model | ID, first name, last name, email, phone, role, company ID, tags, notes |
| UI | Company list, contact list, create/edit forms |
| Storage | Markdown + YAML frontmatter read/write |
| Validation | Required fields, email format, duplicate warning by exact email |
| Linking | Contact links to company by stable ID |

### Example Company File

```markdown
---
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

### Acceptance Criteria

- User can create, edit, and archive companies.
- User can create, edit, and archive contacts.
- Contact can be linked to a company.
- Files are stored as readable Markdown.
- App reloads data from disk on startup.
- Basic duplicate warning appears for same email address.

### Do Not Build Yet

- Complex relationships.
- Lead pipeline.
- Interaction history.
- OpenProject.
- Full-text search.

---

## 5. Phase 2 — Relationship Detail Views

### Goal

Make the product feel like a CRM instead of just two tables.

> When I open a company, I see who belongs to it and what I know about it.

### End-to-End Demo

A user can:

1. Open ACME GmbH.
2. See company details.
3. See all contacts linked to ACME.
4. Click Jane Doe.
5. See Jane’s contact details.
6. Navigate back to ACME.
7. Edit notes on either page.

### Build in This Phase

| Area | Scope |
|---|---|
| Company detail page | Header, metadata, notes, linked contacts |
| Contact detail page | Header, metadata, company link, notes |
| Navigation | Clickable links between company/contact |
| Editing UX | Inline edit or edit dialog |
| Data loading | Resolve linked IDs and missing references |
| Empty states | “No contacts yet,” “No notes yet” |

### Acceptance Criteria

- Company page shows linked contacts.
- Contact page shows linked company.
- Missing/deleted company reference is handled gracefully.
- Notes can be edited and saved.
- Visual UI feels like a simple CRM.

### Do Not Build Yet

- Timelines.
- Leads.
- Tasks.
- Search beyond simple list filtering.

---

## 6. Phase 3 — Lead Management Slice

### Goal

Add the first business workflow.

> I can track potential opportunities and move them through simple stages.

### End-to-End Demo

A user can:

1. Open ACME GmbH.
2. Click **Create lead**.
3. Enter **Energy data space pilot**.
4. Link Jane Doe as contact person.
5. Set status to `new`.
6. Move lead to `contacted`.
7. Open a Leads view and filter by status.
8. Open the lead detail page.

### Build in This Phase

| Area | Scope |
|---|---|
| Lead model | ID, title, company ID, contact IDs, status, owner, tags, notes |
| Lead statuses | new, contacted, qualified, proposal, negotiation, won, lost, paused, archived |
| UI | Lead list, lead detail page, create/edit lead form |
| Linking | Company → leads, contact → leads |
| Pipeline | Simple list grouped by status or lightweight board |

### Acceptance Criteria

- User can create a lead from a company.
- User can link one or more contacts.
- User can change status.
- Company page shows related leads.
- Contact page shows related leads.
- Lead file is readable Markdown.

### Do Not Build Yet

- Revenue forecasting.
- Probability calculations.
- Kanban drag-and-drop unless very cheap to implement.
- OpenProject task creation.

---

## 7. Phase 4 — Interaction Timeline Slice

### Goal

Add the CRM memory layer.

> I can log what happened and see the relationship history.

### End-to-End Demo

A user can:

1. Open Jane Doe.
2. Click **Add interaction**.
3. Select type:
   - Meeting.
   - Call.
   - Email note.
   - Event conversation.
   - Internal note.
4. Write summary and detailed Markdown note.
5. Link the interaction to ACME GmbH and the lead.
6. Open ACME GmbH and see the same interaction in the company timeline.
7. Open the lead and see the same interaction there.

### Build in This Phase

| Area | Scope |
|---|---|
| Interaction model | ID, date, type, summary, body, linked company/contact/lead IDs |
| UI | Add interaction dialog/page |
| Timeline | Company, contact, and lead timeline |
| Sorting | Newest first |
| Markdown body | Simple Markdown editor or textarea |
| Storage | Separate interaction Markdown files |

### Acceptance Criteria

- Interaction appears on all linked entities.
- Timeline sorts by date.
- Interaction body supports Markdown text.
- User can edit an interaction.
- User can delete/archive an interaction.
- Broken links are displayed but do not crash the app.

### Do Not Build Yet

- Email sync.
- Calendar sync.
- Automatic activity capture.
- Attachments beyond optional file path references.

---

## 8. Phase 5 — OpenProject Follow-Up Slice

### Goal

Connect CRM relationship work to execution.

> From a CRM lead, I can create a real follow-up task in OpenProject.

OpenProject is the first implementation of a generic task-provider interface. The CRM should not hard-code OpenProject deeply into the domain model, because Jira, GitLab issues, GitHub issues, Microsoft Planner, or another task provider may be added later.

### End-to-End Demo

A user can:

1. Go to Settings.
2. Enter OpenProject base URL.
3. Configure authentication.
4. Test connection.
5. Select default project and work package type.
6. Open a lead.
7. Click **Create follow-up task**.
8. Enter title, description, and due date.
9. Task is created in OpenProject.
10. CRM stores the OpenProject work package ID and URL.
11. User can click **Open in OpenProject**.

### Build in This Phase

| Area | Scope |
|---|---|
| Integration interface | `TaskManagementProvider` |
| OpenProject adapter | Test connection, create work package, fetch work package |
| Settings UI | Base URL, auth mode, project, type |
| Lead integration | Create follow-up from lead |
| External task reference | Store ID, URL, title, status snapshot |
| Error handling | Connection failure, auth failure, validation failure |

### Suggested Adapter Interface

```typescript
interface TaskManagementProvider {
  providerId: string;

  testConnection(): Promise<ConnectionStatus>;

  createTask(input: CreateTaskInput): Promise<ExternalTaskRef>;

  getTask(taskId: string): Promise<ExternalTask>;

  openTaskInBrowser(taskId: string): void;
}
```

### Example Task Input

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

### Acceptance Criteria

- User can test OpenProject connection.
- User can create a follow-up task from a lead.
- Created task appears in OpenProject.
- Lead page shows linked external task.
- User can open the task in browser.
- If OpenProject is unavailable, CRM data is not corrupted.

### Important Technical Note

OpenProject work package creation may require instance-specific project, type, status, and custom-field values. Therefore, the adapter should avoid hard-coding too many OpenProject assumptions and should use configurable defaults.

### Do Not Build Yet

- Jira.
- GitHub issues.
- GitLab issues.
- Two-way synchronization.
- Full task list management inside the CRM.

---

## 9. Phase 6 — Search, Filters, and Dashboard

### Goal

Make the CRM usable once it contains more than a few records.

> I can quickly find people, companies, leads, and recent activity.

### End-to-End Demo

A user can:

1. Search for **ACME**.
2. See matching company, contact, lead, and interaction.
3. Filter leads by `qualified`.
4. Open dashboard.
5. See:
   - Recent interactions.
   - Open leads by status.
   - Follow-ups created in OpenProject.
   - Recently updated companies.

### Build in This Phase

| Area | Scope |
|---|---|
| Search index | Derived from Markdown files |
| Global search | Companies, contacts, leads, interactions |
| Filters | Tags, status, company, lead status |
| Dashboard | Counts, recent changes, open leads |
| Rebuild index | Button in settings |
| List UX | Sorting, pagination, or virtualized lists |

### Acceptance Criteria

- Search works offline.
- Search index can be rebuilt from source files.
- Dashboard uses real data.
- User can filter leads by status.
- User can filter contacts by company/tag/status.
- Search results link to detail pages.

### Do Not Build Yet

- Advanced fuzzy search tuning.
- Complex reporting.
- Sales forecasting.
- AI summaries.

---

## 10. Phase 7 — Import/Export + Data Quality

### Goal

Make it practical to start using the CRM with existing data.

> I can bring in a CSV and clean up duplicates.

### End-to-End Demo

A user can:

1. Open Import.
2. Select a CSV file with contacts.
3. Map columns to CRM fields.
4. Preview import.
5. See duplicate warnings.
6. Import contacts and companies.
7. Export contacts/companies/leads back to CSV.

### Build in This Phase

| Area | Scope |
|---|---|
| CSV import | Contacts and companies |
| Field mapping | Simple mapping UI |
| Duplicate detection | Email, company name, domain |
| Preview | Show records before import |
| Export | CSV export for companies, contacts, leads |
| Import log | What was imported, skipped, or warned |

### Acceptance Criteria

- CSV import does not immediately write until confirmed.
- User can map columns.
- Duplicate contacts by exact email are detected.
- Duplicate companies by normalized name/domain are detected.
- Export produces usable CSV files.
- Failed import rows are reported clearly.

### Do Not Build Yet

- Complex merge UI.
- vCard import.
- Outlook/Gmail import.
- Deduplication with machine learning.

---

## 11. Phase 8 — Sync-Safety Hardening + Beta

### Goal

Make the shared-folder model safe enough for real testing.

> I can use this in a synced folder without constantly fearing data loss.

This is especially important because the MVP deliberately relies on external sync tools rather than its own server.

### End-to-End Demo

A user can:

1. Open CRM vault in OneDrive/Google Drive/Nextcloud folder.
2. Edit a contact.
3. Simulate an external file change.
4. App detects that the file changed on disk.
5. App warns before overwrite.
6. User can reload from disk or save as conflict copy.
7. App creates backup before destructive writes.

### Build in This Phase

| Area | Scope |
|---|---|
| File watcher | Detect external changes |
| Conflict detection | Compare last-read timestamp/hash with current file |
| Safe writes | Write temp file, backup old file, replace |
| Backups | Keep last N versions |
| Conflict UI | Reload, overwrite, save copy |
| Error UX | Clear messages for permission/read/write errors |
| Beta packaging | Installer or portable build |

### Acceptance Criteria

- App detects external file modification before overwrite.
- App creates backups before updates/deletes.
- User can recover recent previous version.
- Search index can be rebuilt after corruption/deletion.
- App has a packaged build for at least one target OS.
- Product is ready for internal beta testing.

### Do Not Build Yet

- Real-time collaboration.
- Multi-user locking server.
- Three-way merge.
- User/role permissions.

---

## 12. Recommended Release Plan

### Internal Alpha 1 — After Phase 2

Purpose:

> Validate that the local vault, Markdown storage, and company/contact UX feel right.

Testers should be able to create and browse real contacts and companies.

---

### Internal Alpha 2 — After Phase 4

Purpose:

> Validate whether the product already feels like a useful CRM.

At this point, users can manage companies, contacts, leads, and relationship history.

---

### Integration Alpha — After Phase 5

Purpose:

> Validate OpenProject task creation.

This is the first version that proves the original concept:

- CRM for relationship context.
- OpenProject for follow-up execution.

---

### Usability Beta — After Phase 6

Purpose:

> Validate daily usability.

Search, filters, and dashboard determine whether the tool is actually usable beyond demo data.

---

### Practical Beta — After Phase 8

Purpose:

> Validate real-world shared-folder usage.

This is the first version that should be used with real data by a small team, because sync conflicts and backups have been considered.

---

## 13. Visual Product Roadmap

```text
Phase 0
Clickable app + CRM vault setup
        ↓
Phase 1
Create companies and contacts as Markdown files
        ↓
Phase 2
Company/contact detail pages with linked relationship data
        ↓
Phase 3
Lead tracking with simple status workflow
        ↓
Phase 4
Interaction notes and relationship timeline
        ↓
Phase 5
OpenProject follow-up task creation
        ↓
Phase 6
Search, filters, dashboard
        ↓
Phase 7
CSV import/export and duplicate warnings
        ↓
Phase 8
Conflict detection, backups, beta packaging
```

---

## 14. Recommended MVP Cut Line

The **first real MVP** should be the end of **Phase 5**.

At that point, the product does the essential thing:

```text
Create company
→ Create contact
→ Create lead
→ Log interaction
→ Create OpenProject follow-up task
→ Reopen the app and see everything persisted in local Markdown files
```

That is enough to demonstrate the product idea, get feedback, and decide whether to continue.

The **first usable internal beta** should be the end of **Phase 8**, because shared-folder storage without conflict detection and backups is too risky for real use.

---

## 15. Definition of Done for Every Phase

Every phase should follow the same definition of done:

1. There is a visible UI.
2. A user can complete a real workflow.
3. The data is persisted to the CRM vault.
4. The app can be closed and reopened without losing the result.
5. The feature has at least one happy-path test.
6. The feature has at least one failure/edge-case test.
7. There is demo data or a demo script.
8. The phase can be shown to a stakeholder in under five minutes.

This keeps development focused on usable product increments instead of invisible architecture.

---

## 16. Testing Strategy by Phase

| Phase | Minimum test coverage |
|---|---|
| Phase 0 | Vault creation, config read/write, invalid folder handling |
| Phase 1 | Create/edit/archive company and contact, Markdown serialization |
| Phase 2 | Company-contact linking, missing reference handling |
| Phase 3 | Lead creation, status changes, company/contact lead links |
| Phase 4 | Interaction creation, timeline sorting, linked entity display |
| Phase 5 | OpenProject connection failure, successful task creation, task reference persistence |
| Phase 6 | Search index rebuild, search result correctness, filter behavior |
| Phase 7 | CSV import preview, duplicate detection, export format |
| Phase 8 | External file change detection, backup creation, conflict behavior |

---

## 17. Suggested Demo Data

Use one consistent demo scenario across phases:

### Companies

- ACME GmbH
- Stadtwerke Beispielstadt
- ELDORADO Research Institute
- Schneider Electric Demo Partner

### Contacts

- Jane Doe — Innovation Manager at ACME GmbH
- Max Müller — Business Development at Stadtwerke Beispielstadt
- Ana Silva — Research Lead at ELDORADO Research Institute
- Paul Schneider — Partner Manager at Schneider Electric Demo Partner

### Leads

- ACME energy data space pilot
- Stadtwerke forecasting collaboration
- Brazil-Germany interoperability project
- Industrial AI optimization workshop

### Interaction Examples

- Hannover Messe conversation.
- Follow-up call.
- Proposal discussion.
- Internal preparation note.

---

## 18. Main Risks Across the Roadmap

| Risk | Most relevant phase | Mitigation |
|---|---|---|
| Too much architecture before visible value | All phases | Require visual demo at the end of each phase |
| File sync conflicts | Phase 8 | Add hash/timestamp conflict detection and backups |
| Markdown schema changes become painful | Phase 1 onward | Add schema version to every file |
| OpenProject API assumptions are wrong | Phase 5 | Use configurable defaults and schema/form-based API exploration |
| Product becomes a bad clone of a full CRM | All phases | Keep scope limited to contacts, companies, leads, interactions, and follow-ups |
| Users do not trust shared-folder storage | Phase 8 | Make backups, recovery, and conflict handling visible |
| Search becomes slow with real data | Phase 6 | Use derived local index and rebuild mechanism |

---

## 19. Recommended Development Sequence Inside Each Phase

For each phase, implement in this order:

1. **Demo scenario first**  
   Write the concrete user journey in plain language.

2. **Data model second**  
   Define the file format and required fields.

3. **UI skeleton third**  
   Build enough UI to click through the journey.

4. **Persistence fourth**  
   Store the data in the vault.

5. **Reload behavior fifth**  
   Close/reopen the app and verify data survives.

6. **Error handling sixth**  
   Add the most likely failure path.

7. **Test seventh**  
   Add at least one happy-path and one failure-path test.

8. **Demo script last**  
   Write a short repeatable demo script.

---

## 20. References and Assumptions

The roadmap is based on the following product and technical assumptions:

- **Vertical slicing:** Development phases should deliver demonstrable working software, with a bit of each application layer included in each slice.  
  Reference: https://www.visual-paradigm.com/scrum/user-story-splitting-vertical-slice-vs-horizontal-slice/

- **Obsidian-style local vault:** Obsidian stores notes as Markdown-formatted plain text files in a local vault folder.  
  Reference: https://obsidian.md/help/data-storage

- **OpenProject work packages:** OpenProject work packages are the target object for follow-up tasks, and the OpenProject API provides work package endpoints and schema information.  
  Reference: https://www.openproject.org/docs/api/endpoints/work-packages/

- **OpenProject API examples:** OpenProject provides examples for API-based work package creation and form/schema handling.  
  Reference: https://www.openproject.org/docs/api/example/

---

## 21. Final Recommendation

Use **Phase 5** as the first real MVP cut line and **Phase 8** as the first internal beta cut line.

This gives a good balance:

- Early visual progress.
- Real product value.
- No over-engineering.
- Clear integration milestone.
- Reasonable safety before real team usage.
