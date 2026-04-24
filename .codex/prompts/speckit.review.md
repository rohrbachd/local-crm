---
description: Perform an automated code review for the current branch/MR (or full repo) and emit review artifacts (Markdown + Code Quality JSON).
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

### Supported Arguments (recommended)

- `--base <ref>`: Override base ref (default: MR target branch in CI, else `origin/main`)
- `--changed-only`: Review only changes (default)
- `--full-scan`: Review the entire repository (see **Scan Modes**)
- `--max-findings <n>`: Cap total findings in outputs (default: 200 for full-scan, 50 for changed-only)
- `--fail-on <severity>`: Optional gating (e.g. `blocker`, `critical`)
- `--policy <path>`: Optional policy/rules context file(s) passed to the AI (e.g. `constitution.md`)

---

## Why this workflow (security + maintainability principles)

This runner follows broadly recommended secure development practices:

- Perform **focused code review** using secure coding checklists and verify common vulnerability classes. (OWASP guidance)
- Keep review focused on **design, correctness, tests, and complexity** to improve long-term code health. (Google engineering practices)
- **Record and triage** discovered issues so they can be fixed, deferred, or justified with rationale.

---

## Goal

Generate the following artifacts:

- `.review/ai-review.md` -- human-readable review summary + findings
- `.review/gl-code-quality-report.json` -- CodeClimate-style issues list
- `.review/review-meta.json` -- summary metrics and gating fields

---

## Scan Modes

### Default: Changed-only (MR review)

- Compute diff (`BASE...HEAD`) and **prefer** findings in changed files/lines.
- Intended for: fast feedback, minimal noise.

### Optional: Full scan (`--full-scan`)

- Analyze **the entire repository at current `HEAD`**.
- **Coverage requirement:** the runner MUST enumerate **all tracked files** (e.g., via `git ls-files`) and scan them.
  - Exclude generated/build/vendor directories only if they are not tracked or are clearly non-source artifacts.
- Intended for: baseline creation, maintainability work, refactoring campaigns.
- Output control:
  - Prefer higher-severity findings; cap total findings via `--max-findings`
  - Summarize hotspots in `review-meta.json` (top files by finding density/severity)

---

## Review Focus Areas (what to look for)

### A) Correctness & Reliability

- Edge cases / error paths, nullability, retries/timeouts, resource cleanup
- Concurrency/thread-safety hazards, race conditions
- API/contract safety (backwards compatibility, schema changes, breaking changes)
- Observability: actionable logs/metrics without leaking secrets

### B) Security (common classes)

Use secure coding categories as a checklist (examples):

- Input validation & canonicalization
- Output encoding
- Authentication / session management
- Access control (authorization checks)
- Cryptographic practices (no home-grown crypto; safe defaults)
- Error handling & logging (no sensitive info in errors/logs)
- Data protection (secrets, PII, encryption at rest/in transit)
- Communication security (TLS, cert validation)
- System configuration / hardening
- Database and query safety
- File management (path traversal, unsafe uploads)

### C) Maintainability & Simplification (reduce future risk)

- Hotspots: duplication, overly complex functions, deep nesting
- Tight coupling / cycles / "god classes"
- Hidden invariants, magic constants, unclear naming that causes errors
- Public API surface too wide (reduce to what's needed)
- Prefer "make it easy to do the right thing" defaults

---

## Operating Constraints

- **STRICTLY READ-ONLY**: Do not modify source files.
- **Evidence-based**: Every finding MUST include file + line range and cite the relevant snippet
  - changed-only: cite from diff
  - full-scan: cite from file snippet (include line numbers)
- **Concise outputs**:
  - AI findings: max 10 (max 3 `BLOCKER`)
  - Total issues: cap via `--max-findings` (prefer high severity)

---

## Execution Steps

### 1) Determine review context

1. Detect whether running in GitLab CI for a Merge Request (prefer CI variables).
2. Determine base ref:
   - MR pipeline: base = `$CI_MERGE_REQUEST_TARGET_BRANCH_NAME`
   - Else: base = `origin/main` (override via `--base`)
3. Fetch base ref (if needed) and compute diff against `HEAD`:
   - `git fetch origin <base-branch>`
   - Use `BASE...HEAD` (triple-dot).

### 2) Collect inputs for review

Create output directories:

- Ensure `.review/` exists

Write:

- Unified diff to `.review/mr.diff` (always; may be empty in full-scan)
- Changed file list to `.review/changed-files.txt`

Full-scan additions (`--full-scan`):

- Write `.review/all-files.txt` containing **all tracked files** (e.g., `git ls-files`)
- Write `.review/scan-root.txt` with the repo root path
- The AI review MUST consider files across the repo, not only a subset. If repo size forces prioritization, state the prioritization rules explicitly in the summary.

### 3) AI review pass (reasoning + simplification)

Provide the AI agent with:

- Scan mode (`changed-only` vs `full-scan`)
- MR description (if available)
- `.review/mr.diff`
- If full-scan: `.review/all-files.txt` and file snippets for findings (with line numbers)
- Relevant rule context (`--policy`), if available

The AI agent MUST output:

A) Markdown review (summary + max 10 findings, max 3 blockers)  
B) CodeClimate issues list (JSON array)  
C) Meta JSON (risk score + recommendation, hotspots)

AI MUST prioritize:

1. Correctness, edge cases, error handling, contract safety
2. Security boundaries and data handling (categories above)
3. Test adequacy and concrete validation steps
4. Maintainability simplifications ONLY when they reduce real risk/complexity

### 4) Scope filtering and output

1. Convert AI findings into CodeClimate issues (see **Output Formats**)
2. Deduplicate by `fingerprint`
3. Apply scope filtering:
   - Changed-only: prefer findings in changed files/lines; allow out-of-scope only if high severity and clearly relevant
   - Full-scan: allow all; cap with `--max-findings` and summarize hotspots
4. Write final outputs:
   - `.review/ai-review.md`
   - `.review/gl-code-quality-report.json`
   - `.review/review-meta.json`

### 5) Gating (optional)

`review-meta.json` MUST include:

- `blockers_count`, `critical_count`, `major_count`, `minor_count`, `info_count`
- `risk_score` (0-10)
- `recommendation`: `approve` | `approve-with-nits` | `request-changes`

If `--fail-on <severity>` is set, the runner SHOULD exit non-zero when that severity count > 0.

---

## Severity mapping (standard)

- **blocker**: security vulnerability, data loss risk, crash, authz bypass
- **critical**: correctness bug likely in typical paths, concurrency hazards
- **major**: important reliability/maintainability issue (missing error handling, unsafe defaults)
- **minor**: low-risk maintainability/readability improvement
- **info**: informational / suggestions

---

## Output Formats

### Markdown: `.review/ai-review.md`

Required structure:

1. **Summary** (3-5 bullets)
2. **Findings table** sorted by severity  
   Columns: `Severity | Location | Issue | Impact | Recommendation | Validation`
3. **Maintainability opportunities** (optional, max 5 bullets)
4. **Validation** MUST be present for each non-`NIT` finding (concrete test steps)

### CodeClimate JSON: `.review/gl-code-quality-report.json`

- MUST be a JSON array of issue objects.
- Each issue MUST include:
  - `description`
  - `check_name` (namespaced, e.g. `ai-review.<category>`)
  - `fingerprint` (stable hash of `path + begin_line + check_name + description`)
  - `severity`: `info` | `minor` | `major` | `critical` | `blocker`
  - `location`: `{ "path": "...", "lines": { "begin": N, "end": M } }`

Notes:
- `location.path` MUST be repository-relative and MUST NOT start with `./`.
- `lines.begin` MUST be present.

### Meta JSON: `.review/review-meta.json`

```json
{
  "mode": "changed-only",
  "base_ref": "...",
  "head_ref": "...",
  "changed_files": 0,
  "findings": { "blocker": 0, "critical": 0, "major": 0, "minor": 0, "info": 0 },
  "risk_score": 0,
  "recommendation": "approve",
  "hotspots": [
    { "path": "src/...", "score": 0, "blocker": 0, "critical": 0, "major": 0, "minor": 0, "info": 0 }
  ]
}
```

---

## AI Review Prompt (embed this inside your runner)

```text
You are an automated reviewer. Focus on correctness, reliability, security, API/contract safety, and tests.
Also propose maintainability simplifications ONLY when they materially reduce risk or complexity.

No personal preference. No style feedback unless it causes bugs or violates an explicit rule.

Inputs:
- Scan mode: changed-only | full-scan
- Unified diff (mr.diff) (may be empty in full scan)
- For full-scan: all tracked file paths (all-files.txt)
- Optional rule context: local coding standards / constitution

Rules:
- Every finding MUST include file path + line range and cite the relevant snippet.
- If uncertain, label as QUESTION and state what evidence would confirm it.
- AI findings: max 10 total, max 3 blockers.
- Prefer high confidence; avoid noisy style notes.

Output:
1) Markdown review:
   - Summary (3-5 bullets)
   - Findings table: Severity | Location | Issue | Impact | Recommendation | Validation
   - Maintainability opportunities (max 5 bullets)
2) CodeClimate JSON array (issues)
3) Meta JSON (risk score 0-10, recommendation, hotspots)
```
