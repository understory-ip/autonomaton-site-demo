# Signal Watch — A Grove Autonomaton

> *This is one Autonomaton. They chain, mesh, and federate — same pipeline, no integration code. [Read the protocol →](https://docs.google.com/document/d/1FYu3FopXayz7ZDKgLCva5jVnCS8rRqbnp9ObPOXdtlI/edit)*

Signal Watch is a competitive intelligence monitor built on the [Grove Autonomaton Pattern](https://the-grove.ai/autonomaton) — an open architectural specification (CC BY 4.0) for self-authoring software systems. It classifies market signals, tracks competitive scores, surfaces strategic briefings, and learns from its own usage — all governed by declarative zone policies you control.

**[Try the Playground →](https://the-grove.ai/autonomaton)**  •  **[Fork this demo →](https://the-grove.ai/autonomaton-demo/)**  •  **[Read the protocol paper →](https://docs.google.com/document/d/1FYu3FopXayz7ZDKgLCva5jVnCS8rRqbnp9ObPOXdtlI/edit)**

---

## Why This Exists

Most AI demos show you a chatbot. This one shows you a *node* — a sovereign, composable unit that governs itself with explicit rules, learns from telemetry, and connects to other Autonomatons without custom integration.

Signal Watch demonstrates every claim the Autonomaton Pattern makes:

- **Pipeline Invariant** — every signal traverses all five stages, every time
- **Declarative Governance** — all behavior defined in config, not code
- **Tiered Compute** — cheap work stays cheap; expensive models fire only when needed
- **Skill Flywheel** — approved patterns become cached skills at zero marginal cost
- **Provenance** — every decision is traceable, every action auditable, every trace hashable

If you're evaluating the pattern, this is the proof. If you're building with it, this is the starting point.

---

## The Five-Stage Pipeline

```
Signal → TELEMETRY → RECOGNITION → COMPILATION → APPROVAL → EXECUTION → Briefing
```

Every signal flows through all five stages. Every stage produces a structured trace. The pipeline shape is invariant — which is why Autonomatons compose without custom integration.

---

## How It Works

**Monitors competitive signals** from RSS feeds, APIs, and manual submissions. Each signal is classified for relevance, novelty, and threat level.

**Maintains competitive scores** for watchlist subjects. Score adjustments are proposed based on signal analysis — never applied without appropriate oversight.

**Enforces zone governance** based on the magnitude of change:

| Zone | Threshold | Behavior |
|------|-----------|----------|
| **GREEN** | Δ < 0.05 | Routine monitoring. System executes autonomously. |
| **YELLOW** | 0.05 ≤ Δ < 0.15 | Significant shift. System proposes, human approves. |
| **RED** | Δ ≥ 0.15 | Structural event. Human decision required. |

**Learns from patterns** via the Skill Flywheel. After repeated approvals, a pattern becomes a cached skill — executing at Tier 0 with no cloud inference required.

---

## Cognitive Tiers

The Cognitive Router pushes work downward. Every confirmed skill is a query that never calls an API again. The system gets cheaper as it gets smarter.

| Tier | Description | Cost | Use Case |
|------|-------------|------|----------|
| **0** | Cached skills | $0.00 | Learned patterns, keyword filters |
| **1** | Cheap inference | ~$0.001 | Keyword classification, routine briefings |
| **2** | Premium inference | ~$0.01 | Novel signal analysis, correlations |
| **3** | Apex inference | ~$0.10 | Strategic analysis, historical patterns |

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/twocash/autonomaton-demo.git
cd autonomaton-demo
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open http://localhost:5173. No API key required in demo mode.

---

## Three Files and a Loop

The minimum viable Autonomaton is three files and a loop. Signal Watch implements the full specification, but the architectural commitments reduce to:

| File | Purpose |
|------|---------|
| `src/config/routing.ts` | **routing.config** — Intent → Tier → Zone mapping |
| `src/config/zones.ts` | **zones.schema** — Governance boundaries |
| `src/services/pipeline-orchestrator.ts` | **The pipeline** — Five-stage invariant |
| `src/services/cognitive-router.ts` | **The router** — Tier selection logic |
| `src/state/types.ts` | Domain types (signals, watchlist, scoring) |

All behavior is declarative. Edit `routing.ts` or use the in-app config editor — changes take effect immediately without redeployment.

---

## Composition

Signal Watch is one node. The Autonomaton Pattern's protocol properties enable composition without custom integration:

- **Chain** — This node's execution output becomes another Autonomaton's telemetry input
- **Branch** — A single recognition event fans to multiple Autonomatons in parallel
- **Mesh** — Autonomous nodes share a telemetry bus, self-selecting into matching work
- **Hierarchy** — A supervisor Autonomaton dispatches to specialized workers
- **Federation** — Independent organizations share skills across boundaries; data stays sovereign

These primitives emerge from the architecture. The pipeline shape is invariant. The telemetry format is structured. The zone model is declarative. That's all composition requires.

**[Read the full protocol paper →](https://docs.google.com/document/d/1FYu3FopXayz7ZDKgLCva5jVnCS8rRqbnp9ObPOXdtlI/edit)**

---

## Audit Ledger

Every operation is logged with full provenance:

```
timestamp | intent | tier | zone | model | cost | #hash
```

The hash is `SHA256(watchlist_version + signals + model_response + config_state)` — enabling deterministic replay of any decision.

---

## Regulatory Compliance

Zone governance and audit logging aren't compliance features — they're architectural consequences of the pattern.

- **EU AI Act** (Aug 2026): Traceability, human oversight
- **Colorado AI Act** (Jun 2026): Governance documentation
- **SEC AI Guidelines**: Decision audit trails

The zone model maps directly to regulatory requirements. The CTO sets the outer boundary, team leads set inner boundaries, practitioners set the innermost. Compliance becomes a tree, not a checklist.

---

## The Grove Ecosystem

| Resource | Description |
|----------|-------------|
| [Autonomaton Playground](https://the-grove.ai/autonomaton) | Interactive demo — see the pattern in action |
| [Autonomaton Foundry](https://the-grove.ai/autonomaton) | Generate a Sovereign Manifesto for your own Autonomaton |
| [Protocol Paper](https://docs.google.com/document/d/1FYu3FopXayz7ZDKgLCva5jVnCS8rRqbnp9ObPOXdtlI/edit) | "TCP/IP for the Cognitive Layer" — the full architectural argument |
| [The Grove Foundation](https://the-grove.ai) | Cognitive sovereignty research and standards |

---

## License

CC BY 4.0 — The pattern is open because the thesis requires it.

**[The Grove Foundation](https://the-grove.ai)** · the-grove.ai
