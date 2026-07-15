# MCP_Guide.md
# Zoho Catalyst MCP Integration Guide
## KSP Crime Intelligence Copilot — Agent-Ready Tooling on Catalyst

**Version:** 1.0
**Companion to:** `Agent.md`, `Skills.md`, `TRD.md`
**Last updated:** 2026-07-13

> **Note on currency of information:** Zoho MCP is an actively evolving product. The concepts, console flow, and general capabilities described below are accurate as of this writing, but the exact list of Catalyst-specific tools exposed through Zoho MCP can change. Before final implementation, verify the current tool catalog at the Zoho MCP console (`mcp.zoho.com`) and the Catalyst developer docs (`docs.catalyst.zoho.com`).

---

## 1. What is Zoho MCP (in this project's context)

**Zoho MCP** is Zoho's implementation of the **Model Context Protocol (MCP)** — an open standard that lets AI agents (Claude, GPT, Gemini, or any MCP-speaking client) discover and call structured "tools" exposed by an application, instead of the agent having to know raw API endpoints. Zoho MCP provides a **low-code console** where you create an MCP Server, attach tools from one or more Zoho products (including **Catalyst**), and get a single MCP URL that any MCP client (Claude Desktop, Cursor, VS Code, Windsurf, ChatGPT, Gemini) can connect to.

For this project, MCP is relevant in **two distinct ways**, and it's important not to conflate them:

1. **Development-time MCP usage** — the team uses a Catalyst-flavored MCP server inside their own AI coding tools (e.g., Claude Desktop, Claude Code, Cursor) to accelerate building the app itself: scaffolding Functions, inspecting Data Store schema, checking deployment status, reading logs, etc.
2. **Runtime/agent MCP usage** — the in-product AI assistant (`Agent.md`) is architected around *internal skills* (`Skills.md`) that call Catalyst services directly via the Catalyst SDK inside Functions. MCP is **not** required for the in-product assistant to work — but MCP is the recommended path if the team later wants **external** agents (e.g., a supervisor's own Claude/Cursor session) to safely query or act on this Catalyst project without custom API glue.

This guide covers both, with the primary emphasis on (1) since that is what accelerates the hackathon build, and a forward-looking design for (2).

---

## 2. Core MCP Concepts (Quick Reference)

| Term | Meaning |
|---|---|
| **MCP Server** | A configured endpoint (created in the Zoho MCP console) that exposes a chosen set of tools to any connected MCP client. |
| **Tool** | A single callable capability (e.g., "list Data Store tables," "invoke a Function," "fetch deployment status") that an agent can invoke with structured parameters. |
| **MCP Client** | The AI application connecting to the server — Claude Desktop, Claude Code, Cursor, VS Code (with MCP support), Windsurf, ChatGPT, Gemini, etc. |
| **MCP URL** | The unique, secure URL generated per MCP Server; this is what you paste into the MCP client's configuration. |
| **Authorization** | OAuth 2.1-based; either per-user ("Connection") or organization-wide with a Super Admin sharing access ("Collaborator"). |
| **Model-agnostic** | Zoho MCP does not depend on a specific LLM — any MCP-compliant agent can use it. |

---

## 3. Setting Up a Catalyst MCP Server (Development-Time Usage)

### 3.1 Prerequisites
- A Zoho account with access to the Catalyst project for this build.
- Appropriate plan/permissions to create integrations in Zoho MCP.
- The Catalyst project already initialized (per `Deploymentplan.md` §4, Step 1) so there is something for the MCP tools to introspect.

### 3.2 Step-by-Step Setup

1. Navigate to the Zoho MCP console at **mcp.zoho.com**.
2. Click **Create MCP Server**, give it a clear name (e.g., `ksp-crime-copilot-catalyst-dev`).
3. Go to **Tools → Add Tools**, search for **Catalyst**, and select the tools relevant to this project's workflow (e.g., project/service inspection, Function management, Data Store schema/query tools, deployment status — the exact tool names are defined by Zoho's current Catalyst MCP tool catalog; select all if you want the full surface for a hackathon build).
4. Click **Add Now** to attach the selected tools to your MCP Server.
5. Complete **authorization**: select the Catalyst service and the specific org/project to scope access to, then sign in with the Zoho account that owns the Catalyst project.
6. Go to the **Connect** tab and copy the generated **MCP URL**.
7. Paste that URL into your MCP client's configuration (see §3.3).

### 3.3 Connecting to Common MCP Clients

| Client | Where to configure |
|---|---|
| **Claude Desktop / Claude Code** | Settings → Developer → Edit Config → add the MCP server entry with the copied URL. |
| **Cursor** | Settings → Tools and Integrations → Add Custom MCP → paste URL. |
| **VS Code** | MCP-compatible extension/setting → add server URL. |
| **Windsurf** | MCP configuration panel → add server URL. |
| **ChatGPT / Gemini** | Respective app/connector settings that support custom MCP servers. |

### 3.4 Authorization Model

- **Connection (default):** each team member authenticates individually with their own Zoho account credentials — good for a small hackathon team where everyone has direct Catalyst access.
- **Collaborator:** the team lead becomes Super Admin, authorizes once, and shares the MCP URL; other members use the Super Admin's authorized session rather than individually authenticating — useful if only one team member has full Catalyst project owner rights.

### 3.5 Example Development-Time Prompts

Once connected, a team member can ask their MCP-enabled AI client things like:
- "List the tables currently defined in the KSP Crime Copilot Catalyst Data Store."
- "Show me the latest deployment status of the `assistant` Function."
- "What environment variables are configured for the `reports` Function?"
- "Summarize the last 20 log entries for the `cases` Function."

This lets engineers use natural language, inside their coding assistant, to inspect and manage the Catalyst backend while building — significantly speeding up the phases in `implementation_plan.md`.

---

## 4. Mapping Catalyst Services to MCP Tool Categories

While the exact tool names in the Catalyst MCP tool catalog should be confirmed live in the console, they map conceptually onto the same service surface used throughout this project's `TRD.md`:

| Catalyst Service (used in this project) | Expected MCP tool category |
|---|---|
| Data Store | Schema inspection, table/row query tools |
| Functions | Deploy status, invoke, log retrieval |
| Authentication | User/role listing (admin-scoped) |
| API Gateway | Route/endpoint listing |
| QuickML | Model/config inspection |
| Zia Services | Service status/config inspection |
| SmartBrowz | Render job status |
| Stratus | File/object listing |
| Cache | Cache key inspection/invalidation |
| Cron | Scheduled job listing/status |

Treat this table as a planning aid, not a guarantee of exact tool names — verify against the live tool list when you add tools in step 3.2.3 above.

---

## 5. Runtime/Agent-Facing MCP Design (Forward-Looking)

The in-product assistant described in `Agent.md` does **not** need MCP to function — it calls Catalyst services directly from within Catalyst Functions via the Catalyst SDK, which is faster, cheaper, and keeps all access inside the already-authenticated, role-checked request pipeline (`TRD.md` §8).

However, if this project is extended so that **external** trusted agents (e.g., a senior officer's own Claude session, used outside the product's own chat UI) should be able to query the system, the recommended pattern is:

1. Create a **separate, narrowly-scoped** Zoho MCP server (distinct from the development-time one in §3) that only exposes a curated set of **read-only, already-redacted** tools — for example, a thin wrapper tool that calls the `analytics` Function's public endpoints, never a tool with direct Data Store write access.
2. Reuse the **same `access_control_check` skill** (`Skills.md` §3.14) inside whatever Function backs each exposed MCP tool, so MCP-originated requests go through identical RBAC and redaction rules as the in-app assistant — MCP must never become a side-channel that bypasses `PRD.md` §8 security requirements.
3. Prefer **Collaborator-style, organization-scoped authorization** for this runtime server so individual officers don't need standing Catalyst project credentials — they authenticate against a tightly scoped, admin-approved MCP surface instead.
4. Log every MCP tool invocation with the same audit rigor required for admin actions (`TRD.md` §8.1).
5. Never expose the AI-generation tools (`case_summary`, `report_drafting`, `investigation_reasoning`) as raw, unconstrained MCP tools — if exposed at all, they must still enforce the grounding-only and no-fabrication rules from `Agent.md` §2 and §5, by having the MCP tool call into the existing `assistant` Function rather than a bare LLM call.

### 5.1 Why this project does not require runtime MCP for v1

Per `PRD.md` §5.2 (Out of Scope) and the hackathon time constraints, exposing an external MCP-facing agent surface is **not** part of the v1 build. It is documented here so the team has a clear, safe extension path after the datathon, without needing to redesign the security model.

---

## 6. Security Considerations Specific to MCP

- **Least privilege:** only attach the Catalyst tools actually needed for the current task to any given MCP Server — don't attach write/delete-capable tools to a server used only for read-only inspection during development.
- **Credential scope:** MCP authorization is tied to a Zoho account's actual Catalyst permissions — a team member with limited Catalyst project rights will have correspondingly limited MCP tool access, which mirrors (and should not be used to escalate beyond) the RBAC model in `PRD.md` §4.1.
- **Data exposure to the LLM:** any data returned by an MCP tool is shared with the connected LLM to generate a response — apply the same sensitivity judgment used for Zia/QuickML calls in `TRD.md` §7.5 (don't casually pull full victim/complainant PII through a development-time MCP query).
- **Separate dev and runtime servers:** keep the development-time MCP server (§3) and any future runtime/agent-facing MCP server (§5) as **separate** Zoho MCP Server configurations with separate tool scopes, so a broad development tool set is never accidentally exposed to an external, less-trusted agent.
- **Rotate/revoke access:** when a team member's involvement ends (post-hackathon), revoke their MCP authorization along with their Catalyst project access.

---

## 7. Quick Setup Checklist

- [ ] Zoho MCP console account created/available to the team.
- [ ] Development-time Catalyst MCP Server created and named clearly.
- [ ] Only necessary Catalyst tools attached (schema, Functions, deployment, logs).
- [ ] Authorization model chosen (Connection vs Collaborator) based on team structure.
- [ ] MCP URL copied and configured in each team member's preferred MCP client.
- [ ] Verified with a simple prompt (e.g., "list my Catalyst Data Store tables").
- [ ] Documented in this file which tools were actually attached (update §4 with the confirmed list once verified in-console).
- [ ] Decision recorded on whether a runtime/agent-facing MCP server (§5) will be built post-hackathon.

---

## 8. Related Documents

- `TRD.md` — the Catalyst service architecture this MCP layer introspects/extends.
- `Agent.md` — the in-product assistant that remains the primary, security-hardened AI interface; MCP is a complementary developer/extension tool, not a replacement.
- `Skills.md` — the skill contracts that any future runtime MCP tool must reuse rather than bypass.
- `Deploymentplan.md` — where Catalyst project setup (a prerequisite for MCP tool use) is defined.
