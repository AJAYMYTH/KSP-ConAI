# Agent.md
# AI Assistant / Router Agent Design
## KSP Crime Intelligence Copilot

**Version:** 1.0
**Companion to:** `Skills.md`, `TRD.md` §7
**Last updated:** 2026-07-13

---

## 1. Purpose

This document specifies the design of the **assistant agent** — the component behind `/api/assistant/query` (and, indirectly, `/api/voice/transcribe`) that turns a natural-language investigator question into a safe, grounded, explainable answer. It defines the agent's role, router logic, state handling, tool/skill access, safety envelope, and failure modes, so it can be implemented directly inside the Catalyst `assistant` Function.

---

## 2. Agent Identity & Operating Principles

**Name:** KSP Crime Intelligence Copilot Assistant
**Role:** A retrieval-grounded investigative assistant for authenticated KSP personnel. It classifies intent, routes to deterministic or generative skills, and returns concise, sourced answers.

**Operating principles (non-negotiable):**
1. **Deterministic-first.** The agent must never call an LLM for something SQL/aggregation can answer exactly.
2. **Grounded-only generation.** Every generative answer must be built from data explicitly retrieved and passed into the prompt context — never from the model's parametric memory.
3. **No fabrication.** If data is missing, the agent says so; it never invents FIR numbers, names, dates, or outcomes.
4. **No guilt/legal determinations.** The agent may describe patterns and evidence; it never states or implies that a person is guilty.
5. **Role-aware.** The agent enforces the same RBAC redaction as the REST API — it is not a bypass channel.
6. **Transparent.** Every AI-touched answer surfaces its sources (case IDs, SQL preview, or record references).
7. **Ask when ambiguous.** If intent or scope is unclear, the agent asks a clarifying question rather than guessing.

---

## 3. Agent Architecture

```
User input (text or voice-transcribed)
        │
        ▼
┌────────────────────┐
│ access_control_check│  (role resolved from session; applied before and after retrieval)
└─────────┬───────────┘
          ▼
┌────────────────────┐
│ intent_classification│ [AI - lightweight]
└─────────┬───────────┘
          │
   ┌──────┴────────────────────────────────────────────┐
   ▼                                                     ▼
Deterministic branch                              Generative/semantic branch
(sql_lookup, trend_analysis,                      (case_summary, translation,
 map_data_shaping, graph_data_shaping,             similarity_search[stage2],
 timeline_construction)                            report_drafting,
   │                                                investigation_reasoning)
   │                                                     │
   └──────────────────┬──────────────────────────────────┘
                       ▼
              Response Composer
    (attaches sources/SQL preview/confidence,
     applies final role-based redaction,
     shapes to API envelope)
                       ▼
                 JSON response
```

The agent is implemented as an in-process pipeline inside the `assistant` Catalyst Function — not a separate always-on service — to keep the architecture stateless and consistent with Catalyst's Functions model.

---

## 4. Router Design

### 4.1 Intent Table

| Intent | Example trigger phrases | Branch | Skills invoked |
|---|---|---|---|
| `sql_lookup` | "how many," "list," "show me," "which cases" | Deterministic | `sql_lookup` |
| `trend_analysis` | "trend," "over time," "rising," "compare months" | Deterministic | `trend_analysis` |
| `case_summary` | "summarize case," "give me an overview of" | Generative | `case_summary` |
| `translation` | "translate to," "in Kannada" | Generative | `translation` |
| `similarity_search` | "similar cases," "does this match," "resembles" | Hybrid | `similarity_search` |
| `report_drafting` | "generate a report," "prepare a summary document" | Generative | `report_drafting` |
| `investigation_reasoning` | "why," "explain the pattern," "is this suspicious" | Generative | `trend_analysis`/`similarity_search` → `investigation_reasoning` |
| `clarify` | ambiguous or multi-intent input | N/A | Clarifying-question response only |

### 4.2 Classification Approach

Two-tier classification to minimize AI cost, per the hybrid-architecture principle:
1. **Tier 1 — rules/keyword pass (no AI cost):** a lightweight lexical matcher checks for strong signal phrases (e.g., "how many" → `sql_lookup`; "translate" → `translation`). If a confident match is found, skip Tier 2 entirely.
2. **Tier 2 — QuickML classification (small AI cost):** only invoked when Tier 1 is inconclusive. A short, constrained prompt returns exactly one label from the Intent Table, plus a confidence score.

If Tier 2 confidence is below a defined threshold, the agent returns a `clarify` response rather than guessing.

### 4.3 Slot / Parameter Extraction

For deterministic branches, the router also extracts structured parameters (district, category, date range, act/section, caseId) from the input, preferring rule-based extraction (regex/keyword/date-parsing) over LLM extraction wherever possible, again to minimize AI cost. LLM-based extraction is a fallback only when rule-based extraction fails to find required parameters for a classified intent.

---

## 5. Context & Grounding Rules

- The agent's generative calls receive a **context bundle** assembled *before* the LLM call — e.g., for `case_summary`, the full case bundle from the `cases` detail assembly; for `investigation_reasoning`, the deterministic output of `trend_analysis`/`similarity_search`.
- The agent never passes an open-ended "you have access to the whole database" instruction to the model. Context is always a bounded, pre-fetched, JSON-serializable object.
- The system prompt for every generative call explicitly instructs the model to only use the supplied context and to state when information is not present, per the prompt design rules in `TRD.md` §7.3.

---

## 6. Multi-Turn / Session Behavior

- The agent is largely stateless per request but may accept a short conversation history (last N turns) to resolve references like "that case" or "the previous district."
- History is only used for reference resolution, not as an implicit trust source for facts — every factual claim in a response must still be grounded in a fresh retrieval for that turn.
- Clarifying questions consume a turn; the agent should track that the next user message is likely an answer to its own clarifying question (simple state flag, not complex dialogue management).

---

## 7. Response Composition

Every assistant response includes:

```json
{
  "success": true,
  "data": {
    "answer": "short, direct answer text",
    "supportingData": { "...": "numbers/records used" },
    "linkedCases": ["caseId1", "caseId2"],
    "sqlPreview": "SELECT ... (only for sql_lookup/trend_analysis branches)",
    "sources": ["vw_case_summary", "caseId..."],
    "confidence": "high | medium | low",
    "intent": "sql_lookup",
    "generatedAt": "2026-07-13T00:00:00Z"
  }
}
```

- `sqlPreview` is populated for deterministic branches to satisfy the transparency requirement (PRD FR-10.4).
- `confidence` is always present; for deterministic branches it is `high` by definition (exact computation); for generative branches it reflects the model/agent's self-assessed confidence and/or the retrieval quality (e.g., few supporting records → `low`).

---

## 8. Failure Modes & Handling

| Failure | Agent behavior |
|---|---|
| Ambiguous intent | Return a `clarify` response with a specific follow-up question. |
| No data found for a grounded query | State plainly that no matching records were found; do not generate a speculative answer. |
| Low-confidence intent classification | Same as ambiguous intent — ask, don't guess. |
| AI service (QuickML/Zia) unavailable | Degrade gracefully: deterministic branches continue to function; generative branches return a clear "AI service temporarily unavailable" message rather than failing silently or hanging. |
| Role-restricted data requested | Return a redacted response and, where appropriate, a note that some fields are restricted for the caller's role — never silently return unauthorized data. |
| AI-generated SQL/parameters fail validation against the allow-list | Reject the AI's output, fall back to a `clarify` response asking the user to rephrase; never execute unvalidated AI-generated SQL. |

---

## 9. Cost & Latency Budget (Design Target)

| Branch | Expected AI calls | Expected latency budget |
|---|---|---|
| `sql_lookup` (Tier-1 matched) | 0 | < 500ms |
| `sql_lookup` (Tier-2 fallback) | 1 (classification only) | < 1.5s |
| `trend_analysis` | 0–1 | < 1.5s |
| `case_summary` | 1 | < 3s |
| `translation` | 1 | < 2s |
| `similarity_search` | 1 (embedding/re-rank) | < 3s |
| `report_drafting` | 1–2 (summary + optional reasoning) | best-effort (async-friendly) |
| `investigation_reasoning` | 1 | < 3s |

These budgets exist to keep the demo responsive and to bound QuickML credit usage per PRD §9/§10.

---

## 10. Extending the Agent

To add a new capability:
1. Define it as a new skill in `Skills.md` first (contract, data sources, AI usage, constraints).
2. Add an entry to the Intent Table (§4.1) with trigger phrases and branch type.
3. Decide whether it needs Tier-1 rule matching, Tier-2 classification, or both.
4. Ensure any generative call follows the grounding rules in §5 and the prompt design rules in `TRD.md` §7.3.
5. Update the Response Composition schema (§7) if the new skill needs additional response fields.

---

## 11. Related Documents

- `Skills.md` — the individual capability modules this agent orchestrates.
- `TRD.md` §7 — the underlying AI/hybrid pipeline architecture.
- `PRD.md` §7.10, §9 — product requirements and AI usage boundaries this agent must satisfy.
- `MCP_Guide.md` — how this agent's skills/tools can additionally be exposed via Zoho Catalyst's MCP server for external AI-agent or IDE tooling access.
