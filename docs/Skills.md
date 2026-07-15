# Skills.md
# Agent Skills Specification
## KSP Crime Intelligence Copilot — AI Assistant Capability Modules

**Version:** 1.0
**Companion to:** `Agent.md`, `TRD.md` §7
**Last updated:** 2026-07-13

---

## 1. Purpose

This document defines the discrete, reusable **"skills"** (capability modules) available to the AI assistant/router described in `Agent.md`. Each skill is a self-contained unit with a clear trigger, inputs, outputs, allowed data sources, and safety constraints — modeled the same way a well-documented tool/function should be, so it can be implemented as a callable module inside the `assistant` Catalyst Function (or, if using an agent framework, as an individual tool/skill definition).

A **skill** in this system is *not* automatically an LLM call. Most skills below are deterministic; only skills explicitly marked **[AI]** invoke Catalyst QuickML or Zia.

---

## 2. Skill Index

| # | Skill Name | Type | Uses AI? |
|---|---|---|---|
| 1 | `intent_classification` | Router | ✅ (lightweight QuickML) |
| 2 | `sql_lookup` | Deterministic | ❌ |
| 3 | `trend_analysis` | Deterministic | ❌ |
| 4 | `case_summary` | Generative | ✅ QuickML |
| 5 | `translation` | Generative | ✅ Zia |
| 6 | `similarity_search` | Hybrid | ✅ (Stage 2 only) |
| 7 | `report_drafting` | Generative | ✅ QuickML |
| 8 | `investigation_reasoning` | Generative | ✅ QuickML |
| 9 | `voice_transcription` | Deterministic (service call) | ✅ Zia (STT) |
| 10 | `voice_synthesis` | Deterministic (service call) | ✅ Zia (TTS) |
| 11 | `map_data_shaping` | Deterministic | ❌ |
| 12 | `graph_data_shaping` | Deterministic | ❌ |
| 13 | `timeline_construction` | Deterministic | ❌ |
| 14 | `access_control_check` | Deterministic | ❌ |
| 15 | `cache_lookup` | Deterministic | ❌ |

---

## 3. Skill Definitions

### 3.1 `intent_classification` [AI — lightweight]
- **Trigger:** Any free-text input arriving at the `assistant` Function (typed or voice-transcribed).
- **Input:** raw user text, caller role/context.
- **Output:** one of `{ sql_lookup, trend_analysis, case_summary, translation, similarity_search, report_drafting, investigation_reasoning, clarify }`.
- **Data sources:** none (pure classification over the input text; may reference a small set of few-shot examples).
- **Constraints:** must default to `clarify` when confidence is low rather than guessing; must never itself answer the question — its only job is routing.
- **Cost note:** this is the cheapest possible AI call (short prompt, short output) and is the only AI step allowed to run on *every* assistant request.

### 3.2 `sql_lookup` (deterministic)
- **Trigger:** intent = `sql_lookup` (counts, lists, "how many," "which," "show me").
- **Input:** structured filter object derived from the user's text (via a rules/keyword extractor, not free LLM generation, wherever feasible) plus caller role.
- **Output:** `{ total, items[], filters, generatedAt }` — identical shape to `/api/cases` and `/api/analytics/trends` responses.
- **Data sources:** `vw_case_summary` and other views listed in `TRD.md` §4.4, via parameterized queries only.
- **Constraints:** table/column allow-list enforced; no invented columns; results filtered by caller role before return.

### 3.3 `trend_analysis` (deterministic)
- **Trigger:** intent = `trend_analysis` ("rising," "trend," "compare over time," "increase/decrease").
- **Input:** metric name, dimension (district/category/act), time window.
- **Output:** a time-bucketed series plus computed deltas/percentages.
- **Data sources:** `vw_case_by_district`, `vw_case_by_category`, `vw_case_by_status`.
- **Constraints:** purely computational; no AI call. May feed its output into `investigation_reasoning` for a narrative explanation when the user asks "why."

### 3.4 `case_summary` [AI]
- **Trigger:** intent = `case_summary` ("summarize case X," used standalone or inside `report_drafting`).
- **Input:** the full case bundle (from the `cases` detail assembly), never raw user speculation.
- **Output:** a short, formal-tone narrative summary.
- **Data sources:** case bundle only (grounded context passed into the prompt).
- **Constraints:** must not include any fact not present in the input bundle; must not draw guilt conclusions; must flag missing data ("victim details not on file") rather than omit silently.

### 3.5 `translation` [AI — Zia]
- **Trigger:** intent = `translation`, or a `translate to <language>` suffix on any other skill's output.
- **Input:** source text + target language (e.g., English → Kannada).
- **Output:** translated text.
- **Constraints:** preserve meaning exactly; official/formal register; no added or dropped content.

### 3.6 `similarity_search` (hybrid)
- **Trigger:** intent = `similarity_search` ("find similar cases to X," "does this match any known pattern").
- **Stage 1 (deterministic):** filter by act/section overlap, district, crime head, time window, station, keyword match — produces a candidate pool.
- **Stage 2 (AI-assisted):** embed the case-summary text of the candidate pool and the query case (via QuickML), retrieve nearest neighbors, blend with the Stage-1 rule score.
- **Output:** ranked list of `{ caseId, similarityScore, matchingReasons[], linkedAccusedActsDistrict }`.
- **Constraints:** every result must carry human-readable reason codes; no result may be returned without at least one Stage-1 justification (prevents pure-embedding "black box" matches).

### 3.7 `report_drafting` [AI]
- **Trigger:** intent = `report_drafting`, or a call from the `reports` Function.
- **Input:** full case bundle, similar-case results (optional), map/timeline summaries.
- **Output:** structured report sections including an AI-generated narrative summary (built on `case_summary`), ready for HTML→PDF rendering via SmartBrowz.
- **Constraints:** same grounding rules as `case_summary`; must include a generated timestamp and disclaimer footer in the final template (enforced at template level, not by the model).

### 3.8 `investigation_reasoning` [AI]
- **Trigger:** intent = `investigation_reasoning` ("why," "explain the pattern," "is this suspicious").
- **Input:** deterministic outputs from `trend_analysis` and/or `similarity_search` — never raw unaggregated data.
- **Output:** an explanatory narrative with an explicit confidence level and a clear statement of *why* a pattern is suspected.
- **Constraints:** must never assert guilt or make a legal determination; must label all conclusions as suggestions/hypotheses grounded in the supplied evidence.

### 3.9 `voice_transcription` [AI — Zia STT]
- **Trigger:** an audio blob arrives at `/api/voice/transcribe`.
- **Output:** transcript text, forwarded automatically into `intent_classification`.
- **Constraints:** language auto-detect or explicit selector; low-confidence transcriptions should be surfaced to the user for confirmation rather than silently acted upon.

### 3.10 `voice_synthesis` [AI — Zia TTS]
- **Trigger:** assistant response ready and voice-mode is active.
- **Output:** synthesized audio of the response text (optionally translated first via `translation`).

### 3.11 `map_data_shaping` (deterministic)
- **Trigger:** `/api/map/hotspots` calls, or an assistant request implying a spatial answer.
- **Output:** clustered points + heatmap-ready payload, with district/station fallback for records missing coordinates.

### 3.12 `graph_data_shaping` (deterministic)
- **Trigger:** `/api/graph/case/{caseId}` calls, or an assistant request implying a relationship answer.
- **Output:** nodes+edges JSON, depth-limited for progressive loading.

### 3.13 `timeline_construction` (deterministic)
- **Trigger:** case detail/timeline requests.
- **Output:** chronologically ordered events with gap/delay flags (incident→FIR, FIR→arrest, FIR→chargesheet).

### 3.14 `access_control_check` (deterministic — cross-cutting)
- **Trigger:** every skill invocation, as a pre-step.
- **Input:** caller role, requested resource/fields.
- **Output:** allow / redact-fields / deny.
- **Constraint:** this skill is mandatory and cannot be bypassed by any other skill, including AI-generated requests (an AI-proposed SQL query is still passed through this check before execution).

### 3.15 `cache_lookup` (deterministic — cross-cutting)
- **Trigger:** any skill whose output is defined as cacheable in `TRD.md` §9.
- **Behavior:** cache-aside — check Catalyst Cache first; on miss, execute the skill and populate the cache; return the (possibly cached) result.

---

## 4. Skill Composition Examples

| User request | Skills invoked, in order |
|---|---|
| "How many robbery FIRs in Mysuru last week?" | `access_control_check` → `intent_classification` → `sql_lookup` → `cache_lookup` |
| "Why are robbery cases rising in Mysuru?" | `access_control_check` → `intent_classification` → `trend_analysis` → `investigation_reasoning` |
| "Summarize case KA-19-2026-00123." | `access_control_check` → `intent_classification` → `case_summary` |
| "Translate this to Kannada." | `access_control_check` → `intent_classification` → `translation` |
| "Find cases similar to this complaint." | `access_control_check` → `intent_classification` → `similarity_search` |
| Voice query end-to-end | `voice_transcription` → `access_control_check` → `intent_classification` → (relevant skill) → `voice_synthesis` |
| "Generate a report for this case." | `access_control_check` → `intent_classification` → `report_drafting` (internally uses `case_summary`, `similarity_search`, `timeline_construction`, `map_data_shaping`) |

---

## 5. Adding a New Skill (Guideline for Future Extension)

When adding a new skill, define at minimum:
1. **Trigger** — what intent or event invokes it.
2. **Input/Output contract** — exact shape, matching the API envelope conventions in `TRD.md` §6.1.
3. **Data sources** — which views/tables/services it is allowed to touch (allow-list, not implicit).
4. **AI usage** — explicitly state whether it calls QuickML/Zia, and why a deterministic approach is insufficient (per the hybrid-architecture principle in `PRD.md` §3/§6).
5. **Safety constraints** — grounding rules, redaction rules, and any guardrails specific to the new skill.
6. Register the skill in the router's intent table (`Agent.md` §Router Design) and in the Skill Index (§2 above).

---

## 6. Related Documents

- `Agent.md` — the router/agent that orchestrates these skills.
- `TRD.md` §7 — AI pipeline design this skill set implements.
- `PRD.md` §7.10 — product-level assistant requirements.
- `MCP_Guide.md` — how these skills map to Catalyst MCP tools when exposed to external AI agents/dev tooling.
