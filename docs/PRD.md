# PRD.md
# Product Requirements Document
## KSP Crime Intelligence Copilot — Datathon 2026
### Platform: Astro.js + Zoho Catalyst (Hybrid Architecture)

**Document owner:** Product/Engineering Team
**Version:** 1.0
**Status:** Draft for Build
**Last updated:** 2026-07-13

---

## 1. Purpose of this Document

This PRD defines *what* the KSP Crime Intelligence Copilot must do, for whom, and why — independent of implementation detail (covered in `TRD.md`). It is the single source of truth for scope, feature acceptance criteria, user roles, and success metrics, and is written so that a judge, a new engineer, or a stakeholder can understand the product end-to-end without reading source code.

---

## 2. Background & Problem Statement

Karnataka State Police (KSP) investigators and analysts currently work with FIR (First Information Report) data spread across many relational tables (case master, accused, victims, complainants, arrests, acts/sections, chargesheets, courts, etc.). Answering investigative questions — repeat offenders, hotspot districts, case timelines, similar-case matches — requires manual cross-referencing that is slow and error-prone.

Representative questions the product must help answer:

- Which FIRs match a given pattern (act, section, MO, location)?
- Are there repeat offenders across multiple FIRs?
- Which locations/districts show a crime hotspot?
- Which acts/sections are most common in a district or time window?
- What is the full timeline of a case, from incident to chargesheet?
- Which historical cases resemble a new complaint?
- What evidence supports a given risk/priority score for a case?

### 2.1 Why now

The dataset (FIR ER schema) already exists and is rich enough to power real intelligence workflows. What is missing is a unified, fast, explainable application layer. Zoho Catalyst is mandated as the platform layer for the Datathon, which constrains and shapes the architecture (see `TRD.md` §3 and `MCP_Guide.md`).

---

## 3. Product Vision

> Deliver a fast, explainable, and trustworthy crime-intelligence workspace where **most work is powered by deterministic backend logic (SQL, joins, aggregation, cached views)**, and **AI is invoked only where it adds real, defensible value**: natural-language intent understanding, report drafting, translation, summarization, similarity search, and investigation reasoning.

This vision directly drives the **hybrid architecture** decision (§6) and the **Catalyst QuickML usage boundaries** (§9).

### 3.1 Product Principles

| Principle | Meaning |
|---|---|
| Deterministic-first | If a question can be answered with SQL/aggregation, it must be — never route it to an LLM. |
| Explainable AI | Every AI-touched answer must show its supporting data (source records, SQL preview, or citations). No black-box answers. |
| Credit-conscious | Catalyst QuickML/AI credit usage must be minimized by design, not as an afterthought. |
| Role-aware | Every view and API respects role-based access; sensitive investigative data is never exposed to unauthorized roles. |
| Demo-credible | The product must survive a live demo: stable, fast, and visually convincing over being "complete." |

---

## 4. Target Users & Personas

| Persona | Role | Primary Goals | Key Screens |
|---|---|---|---|
| **Investigating Officer (IO)** | `investigator` | Look up a case, view timeline, generate a report, find similar cases | Case Detail, Timeline, Reports, Assistant |
| **Crime Analyst** | `analyst` | Spot trends, hotspots, repeat offenders across districts | Dashboard, Analytics, Map, Graph |
| **Station/District Admin** | `admin` | Manage user access, monitor system health, refresh data | Admin Tools |
| **Viewer / Supervisor** | `viewer` | Read-only oversight of dashboards and reports | Dashboard, Reports (read-only) |

### 4.1 Role Capability Matrix

| Capability | admin | investigator | analyst | viewer |
|---|:---:|:---:|:---:|:---:|
| View dashboard | ✅ | ✅ | ✅ | ✅ |
| Search/filter FIRs | ✅ | ✅ | ✅ | ✅ (limited fields) |
| View case detail (full) | ✅ | ✅ | ✅ | ❌ (redacted) |
| Use AI assistant | ✅ | ✅ | ✅ | ❌ |
| Generate PDF report | ✅ | ✅ | ✅ | ❌ |
| Use voice interaction | ✅ | ✅ | ✅ | ❌ |
| Access admin tools | ✅ | ❌ | ❌ | ❌ |
| Manage users/roles | ✅ | ❌ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ | ❌ |

---

## 5. Scope

### 5.1 In Scope (v1 / Hackathon Build)

1. Authentication & role-based access (Zoho Catalyst Authentication)
2. Home dashboard with KPIs and trends
3. FIR search with multi-field filters
4. FIR case detail page (full 360° view of one case)
5. Analytics dashboard (trends, distributions, comparisons)
6. Geo hotspot map
7. Relationship graph (accused, victims, stations, acts)
8. Case timeline view
9. Similar-case search (hybrid rule-based + semantic)
10. Natural-language assistant (AI router, intent-limited)
11. PDF report generator
12. Voice query support (speech-to-text, text-to-speech, translation)
13. Minimal admin tools

### 5.2 Out of Scope (v1)

- Full FIR data-entry / case creation workflows
- Complex case editing UI
- Deep workflow automation (e.g. auto-assignment of officers)
- External system integrations beyond the hackathon (CCTNS, e-Courts, etc.)
- Multi-department cross-agency workflows
- Heavy custom ML model training pipelines
- Mobile native apps (web-responsive only)

### 5.3 Explicit Non-Goals

- The system does **not** make guilt/innocence determinations.
- The system does **not** auto-file or auto-submit anything to a court or external registry.
- The assistant does **not** fabricate case facts; it only reports what is retrievable from the data store.

---

## 6. Hybrid Architecture Rationale (Product-Level)

| If AI-first (every feature calls an LLM) | If Hybrid (deterministic-first, AI where needed) |
|---|---|
| Costs escalate quickly | Catalyst AI credits last far longer |
| Latency increases | Most responses are near-instant (SQL/cache) |
| Debugging is difficult | Deterministic logic is testable and traceable |
| Answers may vary run to run | Numeric/factual answers are always exact |
| Harder to trust in a police context | Easier to explain and defend under judging/scrutiny |

**Product decision:** AI (via Catalyst QuickML/Zia) is reserved for: (1) natural-language intent classification, (2) RAG-based knowledge lookups, (3) summarization/report drafting, (4) translation, (5) semantic similarity re-ranking, and (6) investigation reasoning narratives. Everything else — counts, filters, joins, aggregates, map points, graph edges, timelines — is deterministic SQL/backend logic.

---

## 7. Functional Requirements by Feature

### 7.1 Authentication & RBAC
- **FR-1.1**: Users must log in via Catalyst Authentication before accessing any protected page.
- **FR-1.2**: On login, the system fetches the user's role (admin / investigator / analyst / viewer) and injects it into the session context.
- **FR-1.3**: Every protected API endpoint must independently validate the session and role server-side (never trust client-only checks).
- **FR-1.4**: Unauthorized access attempts must be logged.

### 7.2 Dashboard
- **FR-2.1**: Display KPI cards: total FIRs, active cases, chargesheeted cases, arrest events.
- **FR-2.2**: Display top crime hotspots (preview), top crime categories, recent FIR list, district comparisons, case-status distribution.
- **FR-2.3**: All dashboard metrics must support a time-range filter.
- **FR-2.4**: Dashboard queries must be cached (Catalyst Cache) to avoid recomputation on every page load.

### 7.3 Search & Filters
- **FR-3.1**: Support search by FIR number, crime number, complainant name, accused name, police station, district, act, section, status, court, and date range.
- **FR-3.2**: Results must be paginated.
- **FR-3.3**: Users can export search results to CSV/PDF.
- **FR-3.4**: Search input must be debounced or submit-on-enter (no per-keystroke server calls).

### 7.4 Case Detail
- **FR-4.1**: Show full case data grouped into semantic sections: case summary, incident details, complainants, victims, accused, arrest/surrender, acts & sections, crime head, status, court, related intelligence.
- **FR-4.2**: Provide quick actions: generate report, open on map, open in graph, view related/similar cases.
- **FR-4.3**: A sticky header must always show FIR identity (FIR #, district, station, status).

### 7.5 Analytics
- **FR-5.1**: Compute and chart: FIRs per month, district distribution, top acts/sections, case category distribution, case-status distribution, gravity-by-district, repeat-offender patterns, officer workload.
- **FR-5.2**: Filters on this page must be shareable/syncable with other pages where feasible.
- **FR-5.3**: Charts must be exportable as an image.

### 7.6 Map / Hotspots
- **FR-6.1**: Plot FIRs with valid lat/long as markers; cluster markers at high zoom-out levels.
- **FR-6.2**: Provide a heatmap layer for incident density.
- **FR-6.3**: Support filters by crime head, category, and date range.
- **FR-6.4**: Cases without coordinates must gracefully fall back to district/station-level aggregation (never silently dropped).

### 7.7 Relationship Graph
- **FR-7.1**: Nodes: case, accused, victim, complainant, police station, officer, court, act, section.
- **FR-7.2**: Edges: FIR–accused, FIR–victim, FIR–station, accused–arrest event, FIR–section, FIR–court.
- **FR-7.3**: Graph must load progressively — initial case neighborhood first, expand-on-click thereafter — to avoid overwhelming the view.
- **FR-7.4**: Clicking any node opens a details drawer.

### 7.8 Timeline
- **FR-8.1**: Chronologically render: incident start/end, info-received date, FIR registration, arrest/surrender events, chargesheet date, court milestones.
- **FR-8.2**: Highlight unusual delays (e.g., incident→FIR gap, FIR→arrest gap, FIR→chargesheet gap).

### 7.9 Similar Case Search
- **FR-9.1**: Stage 1 (deterministic): match on act/section overlap, district, crime head, time window, station, keywords.
- **FR-9.2**: Stage 2 (semantic): use embeddings over case summary text, retrieved via vector search, blended with Stage-1 rule weights.
- **FR-9.3**: Every result must show a similarity score and human-readable matching reasons (transparency requirement).

### 7.10 Natural-Language Assistant
- **FR-10.1**: Accept free-text questions (typed or voice-transcribed).
- **FR-10.2**: Classify intent into one of: SQL lookup, trend analysis, summary generation, translation, similarity search, report drafting.
- **FR-10.3**: Route deterministic intents to backend logic; route only generative/semantic intents to the LLM (Catalyst QuickML).
- **FR-10.4**: Every AI answer must show: short answer, supporting numbers/records, linked cases, and a confidence/explanation note. A SQL preview panel is shown for transparency where relevant.
- **FR-10.5**: The assistant must never fabricate records; if data is insufficient, it must say so and/or ask a clarifying question.
- **FR-10.6**: Assistant responses must respect the caller's role-based data visibility.

### 7.11 Report Generator
- **FR-11.1**: Generate a downloadable PDF containing: case overview, complainant/victim/accused lists, acts & sections, arrests, timeline, map summary, case status, similar cases, and an AI-generated narrative summary.
- **FR-11.2**: Reports must use a formal tone with title, section headings, tables, a generated timestamp, and a disclaimer footer.
- **FR-11.3**: Generated reports are stored (Catalyst Stratus) and listed in a "generated file history."

### 7.12 Voice Support
- **FR-12.1**: Record audio in-browser; send to speech-to-text (Catalyst Zia).
- **FR-12.2**: Route transcribed text through the assistant pipeline.
- **FR-12.3**: Optionally synthesize the response back to speech; support translation (e.g., English ↔ Kannada).

### 7.13 Admin Tools
- **FR-13.1**: Manage users and role assignment.
- **FR-13.2**: Manage saved prompt templates for the assistant.
- **FR-13.3**: Trigger data refresh and cache invalidation.
- **FR-13.4**: View ingestion status and audit logs.

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Dashboard and search pages must render primary content within ~1–2s using cached/aggregated data under demo conditions. |
| Cost | AI/LLM calls must be limited to the intents defined in §7.10; all other reads must be zero-AI-cost. |
| Security | All access is authenticated; all inputs are validated server-side; queries are parameterized (no string-concatenated SQL); sensitive fields are role-gated. |
| Explainability | Every AI-assisted answer must be traceable to source data. |
| Availability | The demo path (login → dashboard → search → case detail → map → graph → assistant → report) must work end-to-end without manual intervention. |
| Responsiveness | All pages must be usable on typical laptop and tablet viewports; graceful degradation on mobile. |
| Localization | Kannada translation support for at least summary/report text. |

---

## 9. AI Usage Boundaries (Product-Level Guardrails)

AI (Catalyst QuickML / Zia) is used **only** for:
1. Natural-language → intent mapping.
2. RAG-based knowledge/document lookups.
3. Summarization and report-narrative drafting.
4. Translation (English ↔ Kannada, extensible).
5. Semantic similarity re-ranking for case matching.
6. Investigation reasoning narratives (with confidence levels, never claims of guilt).

AI is **never** used for: raw counts, filters, joins, pagination, map/graph data shaping, or any answer that a SQL query can already produce deterministically.

---

## 10. Success Metrics

| Metric | Target for Demo/Judging |
|---|---|
| Working end-to-end demo flow | 100% of the 10-step demo story (see `Deploymentplan.md` §Demo Readiness) completes without failure |
| AI credit usage | < a small, bounded number of LLM calls per demo session (only assistant + report + translation) |
| Dashboard load (cached) | Sub-2-second perceived load |
| Search result accuracy | 100% of filter combinations return correct, role-appropriate results |
| Assistant hallucination rate | 0 fabricated records in demo Q&A set |
| Report generation success | 100% success rate for the demo case set |

---

## 11. Assumptions & Dependencies

- The FIR ER schema (CaseMaster, ComplainantDetails, Victim, Accused, ArrestSurrender, Act, Section, CrimeHead, CrimeSubHead, CrimeHeadActSection, CasteMaster, ReligionMaster, OccupationMaster, CaseStatusMaster, Court, District, State, Unit, UnitType, Rank, Designation, Employee, CaseCategory, GravityOffence, ChargesheetDetails) is available and can be seeded/mocked for the demo.
- Zoho Catalyst is the mandated platform (Authentication, Data Store, Functions, API Gateway, QuickML, Zia, SmartBrowz, Stratus, Cache, Cron, hosting).
- A small team (2–5 members) will build this within hackathon time constraints (see `implementation_plan.md` and team split).
- Real-time integration with external police systems (CCTNS, e-Courts) is not required for v1.

---

## 12. Related Documents

- `TRD.md` — technical architecture, data model, API contracts.
- `implementation_plan.md` — phased build plan and task breakdown.
- `Skills.md` — reusable "skills"/capability modules for the AI agent layer.
- `Agent.md` — the AI assistant/router agent design.
- `Deploymentplan.md` — Catalyst deployment steps and demo checklist.
- `MCP_Guide.md` — Zoho Catalyst MCP server integration guide for AI-agent tooling.
