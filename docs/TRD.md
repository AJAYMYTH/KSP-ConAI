# TRD.md
# Technical Requirements Document
## KSP Crime Intelligence Copilot — Astro.js + Zoho Catalyst

**Version:** 1.0
**Companion to:** `PRD.md`
**Last updated:** 2026-07-13

---

## 1. Purpose

This document specifies *how* the product described in `PRD.md` is built: architecture, data model, API contracts, AI pipeline design, security model, caching strategy, and testing approach. It is written to pin-to-pin detail so any engineer can implement a module without needing to reverse-engineer intent from the PRD.

---

## 2. System Architecture Overview

### 2.1 High-Level Diagram (textual)

```
┌───────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                            │
│  Astro.js pages (SSR/static) + React islands (charts, map, graph,  │
│  chat, filters) — Tailwind/CSS design system                       │
└───────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS (fetch/XHR)
                             ▼
┌───────────────────────────────────────────────────────────────────┐
│                    Zoho Catalyst API Gateway                       │
│  - Route mapping, auth enforcement, rate limiting                  │
└───────────────────────────┬────────────────────────────────────────┘
                             ▼
┌───────────────────────────────────────────────────────────────────┐
│                    Zoho Catalyst Functions (Advanced I/O)           │
│  auth · cases · search · analytics · graph · map · assistant ·      │
│  reports · voice · admin                                            │
└───┬────────────┬────────────┬────────────┬────────────┬───────────┘
    │            │            │            │            │
    ▼            ▼            ▼            ▼            ▼
Catalyst      Catalyst     Catalyst     Catalyst     Catalyst
Data Store    Cache        QuickML      Zia          SmartBrowz
(FIR schema)  (hot reads)  (NLU/RAG/    (STT/TTS/     (PDF/report
                            similarity)  translate)    rendering)
                             │
                             ▼
                       Catalyst Stratus
                    (file storage: reports,
                     exports, embeddings cache)

Catalyst Cron: scheduled refresh of materialized views / embeddings
Catalyst Authentication: session + role management (fronting all of the above)
```

### 2.2 Layering Principles

1. **Presentation layer** (Astro + React islands) never talks to the Data Store directly — always via Functions through the API Gateway.
2. **Function layer** is the only layer allowed to query Catalyst Data Store, call QuickML/Zia/SmartBrowz, or write to Stratus.
3. **AI layer** (QuickML/Zia) is invoked exclusively from the `assistant`, `reports`, and `voice` functions — never from `search`, `analytics`, `graph`, or `map` functions, enforcing the hybrid-architecture rule at the code level, not just by convention.

---

## 3. Why Zoho Catalyst (Platform Constraints)

Catalyst is the mandated platform. Services used and their mapped responsibility:

| Catalyst Service | Responsibility in this system |
|---|---|
| **Authentication** | Login, session issuance, role claims |
| **Data Store** | Relational storage of the FIR schema (tables + views) |
| **Functions** | All backend business logic (stateless, per-route) |
| **API Gateway** | Public entry point; auth enforcement, routing, throttling |
| **QuickML** | Intent classification, RAG, embeddings/similarity, report-narrative generation |
| **Zia Services** | Speech-to-text, text-to-speech, translation |
| **SmartBrowz** | Headless rendering of HTML → PDF for reports |
| **Stratus** | Object storage for generated reports, exports, cached embeddings |
| **Cache** | Response caching for dashboard/analytics/expensive queries |
| **Cron** | Scheduled jobs: materialized view refresh, embedding regeneration, cache warm-up |
| **Web/Static Hosting (AppSail / Client Hosting)** | Hosting the built Astro.js site |

See `MCP_Guide.md` for how these services are also exposed as MCP tools for agentic/AI-driven development and runtime tool-calling.

---

## 4. Data Model

### 4.1 Source Schema (from ER Diagram)

**Transaction tables:**
`CaseMaster`, `ComplainantDetails`, `Victim`, `Accused`, `ArrestSurrender`, `ChargesheetDetails`, `ActSectionAssociation`

**Master tables:**
`Act`, `Section`, `CrimeHead`, `CrimeSubHead`, `CaseCategory`, `CaseStatusMaster`, `GravityOffence`, `Court`, `District`, `State`, `Unit`, `UnitType`, `Rank`, `Designation`, `Employee`, `OccupationMaster`, `ReligionMaster`, `CasteMaster`

### 4.2 Key Fields for Analytics

- Crime number, case number
- Crime registered date; incident from/to timestamps; info-received date
- Latitude / longitude
- Case category; gravity of offence; major/minor crime head
- Case status; court; district/state/unit
- Registering officer
- Complainants, victims, accused
- Arrest/surrender history
- Acts and sections
- Chargesheet status

### 4.3 Key Relationships

- 1 FIR → many victims
- 1 FIR → many accused
- 1 FIR → many complainants
- 1 FIR → many act–section mappings
- 1 accused → many arrest/surrender events
- 1 officer → many cases
- 1 district → many stations (units)
- 1 state → many districts
- 1 crime head → many sub-heads

### 4.4 Denormalized / Materialized Views (Catalyst Data Store views or scheduled tables)

| View | Purpose |
|---|---|
| `vw_case_summary` | One row per FIR with resolved lookups (district name, category name, status name) for fast listing |
| `vw_case_by_district` | District-level counts and trends |
| `vw_case_by_category` | Category-level counts |
| `vw_case_by_status` | Status distribution |
| `vw_case_hotspots` | Lat/long + density-ready aggregation |
| `vw_accused_network` | Precomputed accused↔case↔accused adjacency for graph seeding |
| `vw_case_timeline` | Flattened chronological events per case |
| `vw_repeat_offenders` | Accused appearing in 2+ FIRs, with case list |

### 4.5 Derived Fields (computed in views, not base tables)

`case_age_days`, `is_chargesheeted`, `is_active_case`, `incident_month`, `incident_week`, `district_group`, `severity_bucket`, `repeat_offender_score`

### 4.6 Refresh Strategy

Views/materializations that are expensive to compute live are refreshed by **Catalyst Cron** jobs on a schedule (e.g., every 15–30 minutes for demo purposes, or on-demand via the Admin "data refresh" action). The `assistant` and `analytics` functions read from these precomputed views wherever possible instead of hitting raw transaction tables.

---

## 5. Backend Function Specification (Catalyst Functions)

Each function is a stateless, independently deployable Catalyst Advanced I/O Function (Node.js runtime recommended for parity with Astro/React tooling).

### 5.1 `auth`
- Verifies the Catalyst session token on each call.
- Resolves the user's role from Catalyst Authentication user attributes / a `UserRole` table.
- Returns an access context object: `{ userId, role, permissions[] }`.
- Exposed indirectly — most other functions import this as a shared middleware module rather than calling it over HTTP.

### 5.2 `cases` (search + detail)
- **Search sub-route**: accepts filter params, builds a parameterized SQL query against `vw_case_summary` (never raw string concatenation), applies pagination, returns `{ total, items, filters, generatedAt }`.
- **Detail sub-route**: given a `caseId`, fetches all child records (complainants, victims, accused, arrests, act/sections, chargesheet, court) in parallel queries and assembles a single case object.
- Enforces field-level redaction for `viewer` role.

### 5.3 `analytics`
- Computes/reads aggregate metrics: FIRs per month, district distribution, top acts/sections, category distribution, status distribution, gravity-by-district, repeat-offender patterns, officer workload.
- Always reads from materialized views where available; falls back to on-the-fly aggregation only for filter combinations not precomputed.
- Response is pre-shaped for direct chart consumption (labels + series arrays).

### 5.4 `map`
- Returns FIR records with valid `latitude`/`longitude`, clustered server-side by a grid/geohash bucket to limit payload size.
- Falls back to district/station-level aggregate points when coordinates are missing.
- Supports category/date filters.

### 5.5 `graph`
- Given a `caseId` (or district/query scope), builds a nodes+edges JSON from `vw_accused_network` and related joins.
- Supports a `depth` parameter (default 1) to control expansion size; deeper expansion is a follow-up call, not part of the initial payload (progressive loading, per PRD FR-7.3).

### 5.6 `assistant`
- The AI Router entry point (see `Agent.md` for the full agent design).
- Pipeline: receive text → intent classification (QuickML) → route to (a) SQL builder + `cases`/`analytics` internals, (b) similarity search, (c) summarization/report-narrative (QuickML), or (d) translation (Zia).
- Always attaches a `sources`/`sql_preview` field to the response for transparency.
- Applies role-based redaction identical to `cases`.

### 5.7 `reports`
- Given a `caseId`, gathers the full case bundle (reusing `cases` detail logic), requests an AI-generated narrative summary (QuickML) grounded strictly in the gathered facts, assembles an HTML report template, and renders it to PDF via **SmartBrowz**.
- Persists the PDF to **Stratus** and records an entry in a `GeneratedReports` table (for "generated file history").

### 5.8 `voice`
- Accepts an audio blob, sends it to **Zia** speech-to-text, forwards the transcript to `assistant`, and (optionally) sends the assistant's text response to **Zia** text-to-speech / translation for playback.

### 5.9 `admin`
- User/role management, saved prompt template CRUD, cache invalidation trigger, data-refresh trigger (kicks a Cron job or runs the view-refresh routine synchronously for a manual "refresh now"), audit log read access.

---

## 6. API Design

### 6.1 Conventions
- REST-style, resource-oriented endpoints, fronted by Catalyst API Gateway.
- Filtering/search uses query parameters; mutation-like or heavier operations (assistant queries, report generation, voice transcription) use `POST` with a JSON body.
- Pagination is standard (`page`, `pageSize` or `limit`/`offset`) for all list endpoints.
- All responses use a stable envelope:

```json
{
  "success": true,
  "data": {
    "total": 128,
    "items": [],
    "filters": {},
    "generatedAt": "2026-07-13T00:00:00Z"
  }
}
```

- Error envelope:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Session invalid or expired."
  }
}
```

### 6.2 Endpoint Catalog

| Method | Path | Function | Purpose |
|---|---|---|---|
| GET | `/api/dashboard/summary` | `analytics` | KPI cards + summary widgets |
| GET | `/api/cases` | `cases` | Search/filter FIRs (paginated) |
| GET | `/api/cases/{caseId}` | `cases` | Full case detail |
| GET | `/api/search` | `cases` | Alias/general search entry (delegates to `cases`) |
| GET | `/api/analytics/trends` | `analytics` | Trend series for charts |
| GET | `/api/map/hotspots` | `map` | Clustered/heatmap-ready points |
| GET | `/api/graph/case/{caseId}` | `graph` | Nodes+edges for a case neighborhood |
| POST | `/api/assistant/query` | `assistant` | Natural-language Q&A |
| POST | `/api/reports/case/{caseId}` | `reports` | Generate and return/store a PDF report |
| POST | `/api/voice/transcribe` | `voice` | Speech-to-text (+ optional routing to assistant) |
| GET/POST | `/api/admin/*` | `admin` | User/role/cache/audit management |

### 6.3 Request Patterns
- Query params for all filters (district, station, dateFrom/dateTo, category, act, section, status, court, accused, victim, officer).
- Pagination is mandatory on all list endpoints (`vw_case_summary` scale requires it).
- Response shaping happens server-side — the frontend never post-processes raw rows into chart series.
- JSON schemas for chart/table payloads are versioned and stable across releases to avoid frontend breakage.

---

## 7. AI / Hybrid Pipeline Design

### 7.1 AI Router Logic (implemented in `assistant` function)

1. Receive user request (text, possibly voice-transcribed).
2. Classify into one of: **SQL lookup**, **trend analysis**, **summary generation**, **translation**, **similarity search**, **report drafting** (via a lightweight QuickML classification call or a rules-first classifier with LLM fallback — see `Agent.md` §Router).
3. Deterministic branches (SQL lookup, trend analysis) route to the same internal logic used by `cases`/`analytics` — **no LLM call** for these.
4. Generative/semantic branches (summary, translation, similarity re-ranking, report drafting, open-ended reasoning) call **QuickML**/**Zia** with strict, constrained prompts (see §7.3).

### 7.2 Example Router Traces

**Example A — deterministic:**
> "Count robbery FIRs in Mysuru last week."
Router path: intent classification → SQL generation (bounded, whitelisted tables/columns) → query execution → chart/table response. No LLM conversation needed beyond the initial (cheap) intent classification.

**Example B — hybrid with narrative:**
> "Why are robbery cases rising in Mysuru?"
Router path: SQL aggregation (trend numbers) → trend analysis (deterministic delta/percentage calc) → LLM explanation (QuickML) grounded strictly in the computed numbers. This is where AI adds real value — narrative reasoning over facts already computed deterministically.

### 7.3 Prompt Design Rules

| Prompt type | Constraints |
|---|---|
| SQL generation | Only produce SQL; only reference an explicit allow-listed table/column set; never invent columns; must include the caller's filters; output must be parameterized (values bound, not inlined). |
| Summary | Summarize only the facts provided in context; never infer unsupported facts; formal tone; concise but complete. |
| Translation | Preserve meaning exactly; official/formal tone; never add content not present in the source. |
| Investigation reasoning | Base reasoning strictly on retrieved evidence; always include a confidence indicator; explicitly show *why* a pattern is suspected; never make or imply a claim of guilt. |

### 7.4 Similarity Search Pipeline

1. **Stage 1 (deterministic):** filter candidates by act/section overlap, district, crime head, time window, station, keyword match.
2. **Stage 2 (semantic):** generate/query embeddings for case summary text via QuickML vector capability (or an equivalent embedding call), retrieve top-K nearest neighbors from the candidate pool.
3. **Blend:** combine rule-based score (Stage 1) and cosine similarity (Stage 2) using a weighted formula (e.g. `final = 0.5*rule_score + 0.5*semantic_score`, tunable).
4. **Transparency:** attach reason codes (e.g., "same district", "overlapping section 379", "similar MO by embedding") to every result.

### 7.5 AI Trust & Safety Rules
- The model never fabricates records; if retrieval returns nothing, the assistant states that plainly.
- Every generative answer is grounded in retrieved data passed into the prompt context — no answer is generated from parametric memory alone.
- Speculative content (e.g., risk scores, pattern suspicions) is always labeled as a "suggestion," never a fact.
- Sources (case IDs, table names, or SQL) are shown wherever feasible.

---

## 8. Security Architecture

### 8.1 Rules
- Enforce authentication on every protected route via Catalyst Authentication session validation (server-side, in each Function, not just the API Gateway layer).
- Enforce role checks per-endpoint (never rely on hidden UI elements as the only gate).
- Restrict sensitive fields (e.g., victim/complainant PII) based on role.
- Validate every backend input (type, range, allow-listed enum values for filters).
- Use parameterized queries exclusively — no dynamic SQL string concatenation, including for AI-generated SQL (bind AI output to a validated template, don't execute raw AI text against the Data Store).
- Do not expose raw internal IDs unnecessarily in API responses (use case/business identifiers where possible).
- Log access to sensitive views (e.g., full accused/victim PII) for audit.
- Audit all admin actions (role changes, cache purges, data refresh triggers).

### 8.2 AI-Specific Trust Rules
(See §7.5 — restated here for the security section's completeness): grounding-only generation, no fabrication, labeled speculation, visible sourcing.

---

## 9. Caching Strategy (Catalyst Cache)

| Cached item | TTL guidance | Invalidation trigger |
|---|---|---|
| Dashboard summary | 5–15 min | Cron refresh / admin manual refresh |
| Analytics trend series | 5–15 min | Cron refresh |
| Map hotspot clusters | 5–15 min | Cron refresh |
| Repeat-offender view results | 15–30 min | Cron refresh |
| Assistant SQL-lookup answers (identical query) | Short TTL (1–5 min), keyed by normalized query + role | New data ingested / admin refresh |

Caching is applied at the Function layer (cache-aside pattern): check cache → on miss, query Data Store/materialized view → populate cache → return.

---

## 10. Testing Strategy

### 10.1 Backend
- Unit tests for query builders (filter → parameterized SQL correctness).
- Integration tests for each API endpoint (auth required, role redaction correctness, pagination correctness).
- Tests for assistant routing logic (given a fixed set of sample questions, verify correct intent classification and correct branch — deterministic vs AI).
- Tests for report generation (valid HTML → valid PDF, correct data population).

### 10.2 Frontend
- Page rendering smoke tests for all Astro routes.
- Chart rendering tests (given fixed sample data, chart renders without error).
- Filter interaction tests.
- Responsive layout checks (desktop, tablet, mobile-safe minimum).
- Loading-state tests (skeletons appear/disappear correctly).

### 10.3 AI Layer
- Intent classification accuracy against a labeled sample set of questions.
- SQL generation correctness (only allow-listed tables/columns used; no invented columns).
- Summary consistency (same input facts → consistent tone/structure, not necessarily identical text).
- Translation quality spot-checks.
- Hallucination prevention: verify 0 fabricated case IDs/facts across a fixed Q&A regression set.

### 10.4 Minimum Test Plan for Hackathon Timeline
- Unit tests for query builders.
- Integration tests for the core API surface.
- Smoke tests for all main pages.
- A manual demo test script (mirrors the 10-step demo story in `Deploymentplan.md`).
- Exported-report validation (open the PDF, confirm structure and populated data).

---

## 11. Technology Stack Summary

| Layer | Technology |
|---|---|
| Frontend framework | Astro.js (pages/routing) + React islands (interactive widgets) |
| Styling | Utility-first CSS (Tailwind or equivalent) with a dark navy/slate + cyan accent design system |
| Charts | Any React-friendly charting library (e.g., Recharts) rendered inside islands |
| Map | A JS mapping library (e.g., Leaflet/MapLibre) with clustering + heatmap plugin |
| Graph | Cytoscape.js or equivalent network-graph library |
| Backend runtime | Zoho Catalyst Functions (Node.js, Advanced I/O) |
| Data | Zoho Catalyst Data Store (relational) |
| AI/NLU | Zoho Catalyst QuickML |
| Voice/Translation | Zoho Catalyst Zia Services |
| Report rendering | Zoho Catalyst SmartBrowz (HTML → PDF) |
| File storage | Zoho Catalyst Stratus |
| Caching | Zoho Catalyst Cache |
| Scheduling | Zoho Catalyst Cron |
| Hosting | Zoho Catalyst Web/Static Client Hosting (AppSail for SSR if needed) |
| Auth | Zoho Catalyst Authentication |

---

## 12. Related Documents

- `PRD.md` — product scope and acceptance criteria.
- `implementation_plan.md` — phased delivery plan.
- `Skills.md` — modular AI-agent skill definitions.
- `Agent.md` — full assistant/router agent design.
- `Deploymentplan.md` — Catalyst deployment and demo checklist.
- `MCP_Guide.md` — Zoho Catalyst MCP integration for agentic tooling.
