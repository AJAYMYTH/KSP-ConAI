# implementation_plan.md
# Implementation Plan
## KSP Crime Intelligence Copilot — Astro.js + Zoho Catalyst

**Version:** 1.0
**Companion to:** `PRD.md`, `TRD.md`
**Last updated:** 2026-07-13

---

## 1. Purpose

This plan translates `PRD.md` and `TRD.md` into an executable, phased build sequence with concrete tasks, a repository layout, a team split, and a build order optimized for hackathon time constraints. It also defines the "fast path" fallback order if time runs short.

---

## 2. Repository Layout

```text
ksp-crime-copilot/
├── app/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── login.astro
│   │   ├── dashboard.astro
│   │   ├── search.astro
│   │   ├── cases/[caseId].astro
│   │   ├── analytics.astro
│   │   ├── map.astro
│   │   ├── graph.astro
│   │   ├── timeline.astro
│   │   ├── assistant.astro
│   │   └── reports.astro
│   ├── layouts/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── charts/
│   │   ├── filters/
│   │   ├── map/
│   │   ├── graph/
│   │   ├── assistant/
│   │   └── reports/
│   └── styles/
├── functions/
│   ├── auth/
│   ├── cases/
│   ├── search/
│   ├── analytics/
│   ├── graph/
│   ├── assistant/
│   ├── reports/
│   ├── voice/
│   └── admin/
├── catalyst/
│   ├── config.json
│   ├── quickml/
│   └── data-model/
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── implementation_plan.md
│   ├── Skills.md
│   ├── Agent.md
│   ├── Deploymentplan.md
│   └── MCP_Guide.md
├── public/
└── package.json
```

---

## 3. Development Phases

### Phase 1 — Foundation
- Initialize Astro.js project; set up folder structure above.
- Initialize Zoho Catalyst project (`catalyst init`); link to the repository.
- Configure Catalyst Authentication (login flow, session handling).
- Design and create the Data Store schema (all master + transaction tables from `TRD.md` §4).
- Seed/mock demo data covering all districts, statuses, categories used in the demo script.
- Build the API skeleton: stub Functions for `auth`, `cases`, `analytics`, `map`, `graph`, `assistant`, `reports`, `voice`, `admin`, each returning a shaped mock response matching the API envelope in `TRD.md` §6.1.
- Configure Catalyst API Gateway routes to map to each Function.

**Exit criteria:** a user can log in, land on an empty-but-structured dashboard, and every API route responds with a valid (even if mocked) payload.

### Phase 2 — Core Intelligence
- Implement real `cases` search + filter logic against `vw_case_summary`.
- Implement case detail assembly (`cases` detail sub-route).
- Implement `analytics` aggregate queries and chart-ready response shaping.
- Build Dashboard, Search, and Case Detail pages/components against real endpoints.
- Wire up pagination, debounced search, and CSV/PDF export button (export can call a lightweight export utility initially, ahead of full SmartBrowz reports).

**Exit criteria:** Dashboard shows real KPI numbers; Search returns real, filterable, paginated case lists; Case Detail shows a fully assembled case.

### Phase 3 — Visualization
- Build `map` Function (clustered points + heatmap payload) and Map page.
- Build `graph` Function (`vw_accused_network`-based nodes/edges, progressive expansion) and Graph page.
- Build `vw_case_timeline`-based Timeline Function/page, including delay-highlighting logic (incident→FIR, FIR→arrest, FIR→chargesheet).

**Exit criteria:** Map shows real hotspot data; Graph shows a real case's relationship network with expand-on-click; Timeline shows a chronologically correct, gap-highlighted view for any demo case.

### Phase 4 — AI Layer
- Implement the AI Router inside `assistant` (see `Agent.md` for full design): intent classification → deterministic or QuickML branch.
- Implement the Similar Case Search hybrid pipeline (Stage 1 rule filter + Stage 2 embedding similarity via QuickML).
- Implement translation via Zia for at least summary/report text.
- Build the Assistant page (chat window, suggested prompts, source citations, SQL preview panel).

**Exit criteria:** The assistant correctly answers at least the demo Q&A set (§ "Fixed intents for the fast path" below) with grounded, sourced responses and no fabrication.

### Phase 5 — Reports and Voice
- Implement the `reports` Function: gather case bundle → AI narrative (QuickML, grounded) → HTML template → SmartBrowz PDF render → Stratus storage → `GeneratedReports` record.
- Build the Reports page (template selection, case selection, preview, export controls, generated file history).
- Implement the `voice` Function (Zia STT → assistant → Zia TTS/translation) and the mic/waveform/playback UI.

**Exit criteria:** A PDF report can be generated end-to-end for any demo case; a voice query can be spoken, transcribed, answered, and (optionally) read back.

### Phase 6 — Polish
- Apply Catalyst Cache to dashboard/analytics/map endpoints per `TRD.md` §9.
- Run the full test suite from `TRD.md` §10.
- UX cleanup: loading skeletons, empty states, error states, responsive pass.
- Presentation/demo prep: rehearse the demo script in `Deploymentplan.md`.

**Exit criteria:** The Demo Readiness Checklist in `Deploymentplan.md` is 100% green.

---

## 4. Build Order for Maximum Speed (Fallback Path)

If time is short, prioritize in this strict order so a working product exists early:

1. Authentication
2. Data ingestion / mock data
3. Dashboard
4. Search and case detail
5. Analytics charts
6. Report export
7. Assistant with only 3–5 fixed intents
8. Map
9. Graph
10. Voice
11. Polish

### Fixed intents for the fast-path assistant (recommended set of 5)
1. "How many FIRs match `<filters>`?" → deterministic count.
2. "Show trend of `<category>` in `<district>` over `<period>`." → deterministic trend + optional LLM narrative.
3. "Summarize case `<caseId>`." → grounded QuickML summary.
4. "Translate this summary to Kannada." → Zia translation.
5. "Find cases similar to `<caseId>`." → hybrid similarity search.

This gives a credible AI demo without needing the full open-ended router built out.

---

## 5. Feature-Level Task Checklist

Use this as a literal build/PR checklist, grouped by feature (maps 1:1 to `PRD.md` §7).

- [ ] Auth: login page, session middleware, role injection, protected-route gating
- [ ] Dashboard: KPI cards, trend chart, district comparison, recent FIR list, caching
- [ ] Search: filter form, query param mapping, pagination, CSV/PDF export, debouncing
- [ ] Case Detail: sticky header, collapsible sections, quick actions (report/map/graph/related)
- [ ] Analytics: 8 core metrics, chart rendering, image export, filter sync
- [ ] Map: marker plotting, clustering, heatmap, district fallback, filters
- [ ] Graph: node/edge builder, Cytoscape rendering, expand-on-click, details drawer
- [ ] Timeline: event ordering, gap highlighting, vertical/horizontal layout
- [ ] Similar Case Search: rule-stage filter, embedding-stage retrieval, blended score, reason codes
- [ ] Assistant: router, SQL-lookup branch, trend branch, summary branch, translation branch, similarity branch, SQL preview UI, source citations
- [ ] Reports: template, data assembly, AI narrative, SmartBrowz render, Stratus storage, history list
- [ ] Voice: recorder UI, Zia STT call, routing to assistant, Zia TTS/translation, playback UI
- [ ] Admin: user/role management, saved prompt templates, cache invalidation, data refresh trigger, audit log viewer

---

## 6. Team Split (2–5 Members)

| Member | Focus | Deliverables |
|---|---|---|
| **1 — Frontend/Astro** | Pages, layout, charts, responsive UI | All `.astro` pages, shared components, design system |
| **2 — Backend/Data Store** | APIs, SQL logic, filters, analytics | `cases`, `analytics`, `map` Functions; Data Store schema + views |
| **3 — AI/QuickML** | Assistant, summaries, similarity search, prompt design | `assistant` Function, prompt templates, similarity pipeline |
| **4 — Maps/Graph/Visualization** | Map, graph, timeline, charts | `map`/`graph` Functions + corresponding pages/components |
| **5 — Reports/Testing/Deployment** | PDF generation, QA, Catalyst deployment, demo prep | `reports`/`voice` Functions, test suite, `Deploymentplan.md` execution |

For teams of 2–3, merge roles: e.g., (Frontend+Viz) + (Backend+AI) + (Reports/QA/Deploy).

---

## 7. Suggested Demo Story (Script Basis)

1. Log in.
2. Show dashboard.
3. Search a FIR by district.
4. Open case detail.
5. Show map hotspot.
6. Open accused graph.
7. Ask the assistant a question.
8. Generate a PDF report.
9. Show translation or voice feature.
10. Close with a concise impact statement:
   > "This system helps investigators move from raw FIR records to actionable intelligence through search, analytics, graph relationships, geospatial views, and AI-assisted summaries."

---

## 8. Documents to Produce Alongside This Plan

Beyond the seven core documents in this package, teams with extra time should also produce:
1. `architecture.md` (diagram-heavy expansion of `TRD.md` §2)
2. `database-schema.md` (full DDL / ER export)
3. `api-spec.md` (OpenAPI/Swagger form of `TRD.md` §6)
4. `ui-component-map.md` (component tree per page)
5. `prompt-design.md` (expanded prompt library beyond `TRD.md` §7.3)
6. `demo-script.md` (word-for-word narration for the demo story above)

---

## 9. Related Documents

- `PRD.md` — what to build and why.
- `TRD.md` — how to build it (architecture, data, API, AI pipeline, security).
- `Skills.md` — modular AI-agent skill definitions used by the assistant.
- `Agent.md` — the assistant/router agent's full design.
- `Deploymentplan.md` — Catalyst deployment steps and readiness checklist.
- `MCP_Guide.md` — Zoho Catalyst MCP server integration guide.
