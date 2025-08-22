# ✅ SSOT Verification Report — Phase 2 (40-file sampling)

Status: Completed (evidence-backed). Scope: documentation/** and depth-site/docs/** + depth-site/package.json.

## What’s accurate (confirmed)

- Pricing SSOT is unified and locked for v2.0
  - Range and math: Agency margin is 10–50% and LocationAddition is a fixed add-on, not a multiplier.
  - Evidence: `documentation/01-requirements/00-requirements-v2.0.md` (Pricing section),
    `documentation/99-reference/02-enums-standard.md` (pricing fields + equations),
    `documentation/03-api/features/03-projects.md` (computed fields in examples).

- Notifications and Messaging are fully specified
  - Evidence: `documentation/03-api/features/06-notifications.md` (channels, preferences, actions, pagination),
    `documentation/03-api/features/07-messaging.md` (conversations, participants, pagination, project chat).

- Admin + Seeds management exist and are detailed
  - Evidence: `documentation/03-api/admin/01-admin-panel.md`, `documentation/03-api/admin/03-seeds-management.md`.

- Client/Creator flows and onboarding data are captured
  - Evidence: `documentation/03-api/features/01-creators.md` (multi-step onboarding, availability, equipment),
    `documentation/03-api/features/02-clients.md` (registration, profile management).

- RBAC naming is consistent
  - The canonical role key is `salariedEmployee` (not “employee”).
  - Evidence: `documentation/99-reference/02-enums-standard.md` (roles),
    `documentation/99-reference/05-roles-matrix.md` (RBAC rules).

- Testing/Security/Operations docs exist and are non-empty
  - Evidence: `documentation/04-development/04-testing-strategy.md`,
    `documentation/07-security/00-security-overview.md`,
    `documentation/08-operations/{00-operations-overview.md,01-deployment.md,02-incident-response.md}`.

## Misleading or outdated claims (with corrections)

1) “No notifications/messaging specs” → Misleading
   - Both are comprehensive. See evidence above under accurate items.

2) “Pricing is inconsistent / margin unclear” → Misleading
   - v2.0 is consistent: AgencyMarginPercent is 10–50%; LocationAddition is fixed; equations are identical across SSOT.
   - Evidence: `01-requirements`, `99-reference/02-enums-standard.md`.

3) “Role naming is inconsistent” → Misleading
   - Canonical key is `salariedEmployee` across SSOT (reference + RBAC). Evidence: `99-reference/02`, `99-reference/05`.

4) “Onboarding isn’t stored” → Misleading
   - Stored and exposed: creator onboarding steps and statuses are modeled and surfaced via API examples.
   - Evidence: `03-api/features/01-creators.md`; data model in `02-database/00-data-dictionary.md`.

5) “Web stack is Next 14, React 18, Zustand + React Query” → Outdated
   - Current app uses Next 15.4.6 and React 19.1.0; no Zustand/React Query present (SWR is present).
   - Evidence: `depth-site/package.json` (next 15.4.6, react 19.1.0; swr installed).
   - Action: Update any doc referencing older stack; prefer SWR mention over Zustand/React Query until added.

6) Database schema file shows non-SSOT enums and currencies → Outdated examples
   - Mismatches in `02-database/01-database-schema.md`:
     - Experience: uses `beginner/intermediate/professional/expert` vs SSOT `fresh/experienced/expert`.
     - Processing: uses `basic/standard/premium` vs SSOT `raw/basic/color_correction/full_retouch/advanced_composite`.
     - Currency examples include `SAR`/`USD` vs SSOT base IQD.
     - Location as numeric modifier vs SSOT fixed `locationAddition` (no percentage multiplier).
   - Canonical references: `02-database/00-data-dictionary.md`, `99-reference/02-enums-standard.md`.
   - Action: Mark 01-database-schema as legacy examples (done via banner in this commit) and align in a future pass.

7) Security doc uses placeholder domains → Needs alignment
   - `07-security/00-security-overview.md` uses example domains (`depth.platform`), while operations use `depth-agency.com`.
   - Action: Replace placeholders with production domains or add a note that they’re examples.

8) Integrations architecture lists older framework versions/state libs → Outdated
   - `03-api/integrations/03-advanced-technical.md` claims Next 14 + Zustand/React Query. See item (5) for current reality.
   - Action: Add a version note or update to Next 15 / React 19 / SWR.

## Quick evidence index (non-exhaustive)

- Features: `03-api/features/{01-creators,02-clients,03-projects,05-storage,06-notifications,07-messaging,08-salaried-employees}.md`
- Admin/Seeds: `03-api/admin/{01-admin-panel,03-seeds-management}.md`
- Integrations: `03-api/integrations/{01-external-services,02-webhooks,03-advanced-technical}.md`
- Reference: `99-reference/{02-enums-standard,04-naming-conventions,05-roles-matrix}.md`
- Requirements: `01-requirements/00-requirements-v2.0.md`
- Database: `02-database/{00-data-dictionary,01-database-schema}.md`
- Dev/Sec/Ops: `04-development/04-testing-strategy.md`, `07-security/00-security-overview.md`, `08-operations/{00-operations-overview,01-deployment,02-incident-response}.md`
- Site stack: `depth-site/package.json`

## Recommended follow-ups

1) Update stack mentions to Next 15 / React 19 and SWR
   - Files: `03-api/integrations/03-advanced-technical.md`, `99-reference/00-resources.md` (React link now updated to 19).

2) Normalize schema doc to SSOT
   - Replace legacy enums and currency examples in `02-database/01-database-schema.md` with the SSOT tables in `02-enums-standard.md`.

3) Add a “Version Matrix” appendix
   - Add `99-reference/version-matrix.md` summarizing framework/library versions derived from package.json.

4) Add a “Domains & Environments” appendix
   - Single source for domains/URLs used across Security/Ops docs.

— End of report —
