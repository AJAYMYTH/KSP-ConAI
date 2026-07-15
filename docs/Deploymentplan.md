# Deploymentplan.md
# Deployment Plan
## KSP Crime Intelligence Copilot — Zoho Catalyst Deployment

**Version:** 1.0
**Companion to:** `TRD.md`, `implementation_plan.md`
**Last updated:** 2026-07-13

---

## 1. Purpose

This document specifies the concrete, ordered steps to provision, configure, and deploy the KSP Crime Intelligence Copilot on Zoho Catalyst, plus the demo-readiness checklist used to confirm the system is judge/stakeholder ready.

---

## 2. Environments

| Environment | Purpose | Catalyst project stage |
|---|---|---|
| **Development** | Local iteration, Catalyst CLI local serving where supported | Catalyst "Development" environment |
| **Staging/Demo** | Final rehearsal environment, mirrors production config | Catalyst "Production" environment (used as the demo target) |

For a hackathon timeline, Development and the Demo environment may be the same Catalyst project, promoted carefully before the final demo slot.

---

## 3. Pre-Deployment Checklist

- [ ] Zoho account created and Catalyst access enabled.
- [ ] Catalyst CLI installed (`npm install -g zcatalyst-cli` or the current published package) and authenticated (`catalyst login`).
- [ ] Node.js runtime version confirmed against Catalyst Functions' supported runtime.
- [ ] Repository structure matches `implementation_plan.md` §2.
- [ ] `.env`/secrets strategy decided (Catalyst environment variables for service credentials — never hard-coded in Functions).

---

## 4. Deployment Steps (Suggested Order)

### Step 1 — Configure Catalyst Project
1. Run `catalyst init` in the repository root; select "Create a new project" or link an existing one.
2. Enable the required Catalyst services for the project: Authentication, Data Store, Functions, API Gateway, QuickML, Zia Services, SmartBrowz, Stratus, Cache, Cron, and Web/Static Client Hosting (or AppSail if SSR hosting is needed for Astro).
3. Record the generated `catalyst.json`/project config; commit the non-secret portions to the repo (`catalyst/config.json`).

### Step 2 — Create Data Store Tables
1. In the Catalyst console (or via CLI schema definition), create all master and transaction tables listed in `TRD.md` §4.1.
2. Define relationships/foreign keys matching the ER diagram relationships in `TRD.md` §4.3.
3. Create the read-optimized views listed in `TRD.md` §4.4 (`vw_case_summary`, `vw_case_by_district`, `vw_case_by_category`, `vw_case_by_status`, `vw_case_hotspots`, `vw_accused_network`, `vw_case_timeline`, `vw_repeat_offenders`).
4. Load seed/mock data covering enough districts, categories, and statuses to make the demo script (§8 below) fully functional.

### Step 3 — Build Backend Functions
1. Scaffold each Function under `functions/` (`auth`, `cases`, `search`, `analytics`, `graph`, `assistant`, `reports`, `voice`, `admin`) using `catalyst function:create` (or equivalent CLI command) with the Advanced I/O Function type.
2. Implement business logic per `TRD.md` §5.
3. Configure environment variables per Function (Data Store connection context is automatic within Catalyst; QuickML/Zia/SmartBrowz/Stratus are accessed via the Catalyst SDK, not raw API keys).
4. Deploy Functions: `catalyst deploy` (or `catalyst function:deploy` for incremental updates).

### Step 4 — Create Frontend Shell in Astro
1. Scaffold Astro project under `app/` per `implementation_plan.md` §2.
2. Implement the shared `AppShell` (topbar + sidebar + workspace) and design system tokens (dark navy/slate, cyan accent, amber/green/red status colors).
3. Wire the Astro/React islands to call the deployed API Gateway base URL (via a small typed API client module, not scattered raw `fetch` calls).

### Step 5 — Connect Authentication
1. Configure Catalyst Authentication (email/password and/or the identity providers required).
2. Implement the login page and session-aware route gating in Astro middleware.
3. Confirm role resolution (`admin`/`investigator`/`analyst`/`viewer`) is attached to the session and available to every Function via the shared `auth` module.

### Step 6 — Implement Search and Dashboard
1. Point the Search page and Dashboard page at the now-live `cases` and `analytics` Functions.
2. Verify pagination, filters, and KPI cards render real data.
3. Enable Catalyst Cache on the dashboard/analytics endpoints per `TRD.md` §9.

### Step 7 — Add Analytics and Map
1. Complete the Analytics page charts.
2. Deploy the `map` Function and Map page; verify clustering/heatmap and the district/station fallback for missing coordinates.

### Step 8 — Add Graph and Timeline
1. Deploy the `graph` Function and Graph page; verify progressive expand-on-click behavior.
2. Implement the Timeline view and delay-highlighting logic.

### Step 9 — Connect Assistant
1. Deploy the `assistant` Function implementing the router described in `Agent.md`.
2. Configure QuickML models/prompts and Zia translation per `TRD.md` §7.3 and `Skills.md`.
3. Verify the fixed demo intent set (see `implementation_plan.md` §4) end-to-end.

### Step 10 — Add PDF Export
1. Deploy the `reports` Function; configure SmartBrowz rendering and a Stratus bucket for generated PDFs.
2. Verify the Reports page can select a case, preview, generate, and download a PDF, and that it appears in "generated file history."

### Step 11 — Test End-to-End
1. Execute the full test plan from `TRD.md` §10 against the deployed environment (not just local).
2. Run the manual demo test script (§8 below) at least twice.

### Step 12 — Deploy and Verify
1. Promote/deploy the final build to the demo-facing Catalyst environment.
2. Run the Demo Readiness Checklist (§9) and sign off.
3. Configure Cron jobs (materialized view refresh, cache warm-up) to run on a schedule that guarantees fresh data at demo time without needing a manual "refresh now" during the live demo.

---

## 5. Rollback Strategy

- Keep the previous known-good Function deployment package available (Catalyst retains deployment history); if a late-stage deploy breaks the demo path, redeploy the last good version rather than debugging live.
- Data Store schema changes should be additive where possible during the final 24–48 hours before a demo (avoid destructive migrations close to presentation time).

---

## 6. Monitoring & Observability

- Use Catalyst's built-in Function logs/console to monitor errors during rehearsal and the live demo.
- Enable basic request logging in each Function (already required for the audit rules in `TRD.md` §8.1) so any live-demo failure can be diagnosed immediately afterward.
- Keep an eye on QuickML/Zia call counts during rehearsals to validate the AI credit budget assumptions in `PRD.md` §10.

---

## 7. Secrets & Configuration Management

- Store all service credentials/config as Catalyst environment variables scoped per Function, never committed to the repository.
- `catalyst/config.json` in the repo contains only non-secret project structure/config.
- Role-to-permission mappings (`PRD.md` §4.1) are seeded once via the `admin` Function or directly in the Data Store, and treated as configuration, not code.

---

## 8. Demo Script (Execution Order)

1. Log in.
2. Show dashboard.
3. Search a FIR by district.
4. Open case detail.
5. Show map hotspot.
6. Open accused graph.
7. Ask the assistant a question (use one of the fixed demo intents).
8. Generate a PDF report.
9. Show translation or voice feature.
10. Close with the impact statement from `implementation_plan.md` §7.

---

## 9. Demo Readiness Checklist

- [ ] Login works (correct role resolved, correct redirect).
- [ ] Dashboard loads with real, cached KPI data within target latency.
- [ ] Search returns correct, paginated, role-appropriate data.
- [ ] Case detail renders all sections without errors.
- [ ] Map shows real hotspot points (and fallback aggregation is verified for at least one no-coordinate case).
- [ ] Graph shows real relationships and expands on click.
- [ ] Timeline renders chronologically correct events with gap highlights.
- [ ] Assistant answers the fixed demo Q&A set correctly, with sources/SQL preview shown.
- [ ] Report exports successfully and opens as a valid, well-formatted PDF.
- [ ] Voice/translation feature works at least once, live.
- [ ] All major pages are verified mobile-safe/responsive.
- [ ] Admin tools are reachable for the `admin` role and hidden for other roles.
- [ ] Full demo script (§8) has been rehearsed end-to-end without manual intervention, at least twice.

---

## 10. Related Documents

- `TRD.md` — the architecture and service mapping this plan deploys.
- `implementation_plan.md` — the phased build plan this deployment follows.
- `MCP_Guide.md` — using Zoho Catalyst's MCP integration for agent-assisted development and/or runtime tool access during and after this deployment.
