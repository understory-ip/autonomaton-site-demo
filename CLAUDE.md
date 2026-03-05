# Grove Autonomaton Pattern Playground — Claude Code Instructions

This project implements the **Grove Autonomaton Pattern** and **Trellis Architecture**. All development work MUST follow the Foundation Loop methodology.

## CRITICAL: No Coding Without Foundation Loop

**BEFORE writing ANY code**, you MUST invoke the Foundation Loop skill:

```
/grove-foundation-loop
```

This is a **hard requirement**. The skill will guide you through:
- **Phase 0: Pattern Check** — Identify existing patterns to extend
- **Phase 0.5: Canonical Source Audit** — Prevent component duplication
- **Tier Selection** — Match methodology to task complexity

### Why This Matters

This codebase has been carefully architected with:
- Canonical components (e.g., `TelemetryStream` for all audit logging)
- Declarative configuration patterns
- Strict separation of concerns

**Creating duplicate patterns is a serious architectural violation.** The Foundation Loop catches these BEFORE they happen.

## Tier Selection Quick Reference

| Tier | Duration | When to Use | Artifacts |
|------|----------|-------------|-----------|
| **Quick Fix** | < 1 hour | Bug fixes, typos, config tweaks | DEVLOG only |
| **Feature** | 1-4 hours | Contained feature work | SPEC + DEVLOG |
| **Sprint** | 1-3 days | Refactoring, new systems | Full 9 artifacts |

## Canonical Components — DO NOT DUPLICATE

| Capability | Canonical Home | Notes |
|------------|----------------|-------|
| Audit logging/telemetry | `TelemetryStream.tsx` | Supports multiple display modes |
| State management | `state/reducer.ts` | All state changes go through reducer |
| Config editing | `ConfigEditor.tsx` | Declarative config display |
| Pipeline visualization | `PipelineVisualization.tsx` | The 5-stage invariant |

## Project Structure

```
src/
├── components/          # React components
│   ├── Foundry/         # Tier 3 PRD compiler
│   ├── Interaction/     # Chat-style sandbox
│   ├── Telemetry/       # Audit stream (canonical)
│   └── ...
├── config/              # Declarative schemas
│   ├── prompts.schema.ts # Prompt pipeline
│   ├── routing.ts       # Intent → Tier mapping
│   └── zones.ts         # Zone definitions
├── services/            # Business logic
│   ├── CognitiveAdapter.ts
│   └── foundry-compiler.ts
├── state/               # State management
│   ├── types.ts         # Type definitions
│   ├── reducer.ts       # State transitions
│   └── context.tsx      # React context
└── utils/               # Helpers
```

## Grove Architecture Rules

| Rule | Violation | Correct Approach |
|------|-----------|------------------|
| No duplicate patterns | Creating new telemetry UI | Extend `TelemetryStream` |
| Declarative config | Hardcoded `if/else` logic | Config-driven behavior |
| Single source of truth | Multiple state stores | Use reducer pattern |
| Behavior tests | Testing CSS classes | Test user-visible outcomes |

## Version History

- **v0.9.3** — Recursive Provenance & Compiler Ledger
- **v0.9.2** — The Sovereign Manifesto Payload
- **v0.9.1** — Provenance & Frictionless Entry
- **v0.9.0** — The Architect's Foundry

---

**Remember: `/grove-foundation-loop` BEFORE any implementation work.**
