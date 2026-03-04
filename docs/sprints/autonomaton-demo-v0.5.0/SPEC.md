# Feature: v0.5.0 — "Live Cognitive Routing"

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | All tasks implemented |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-04T19:00:00Z |
| **Next Action** | Commit and tag v0.5.0 |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** Live LLM API integration with BYOK (Bring Your Own Key)
- **Success looks like:** User types prompt → API call fires → real Claude/Gemini/OpenAI response appears
- **We are NOT:** Changing routing logic, zone governance, or skill flywheel
- **Current phase:** Complete

---

## Pattern Check (Abbreviated)

**Existing pattern to extend:** Pipeline orchestrator async execution pattern
**Canonical home for this feature:**
- CognitiveAdapter → `src/services/CognitiveAdapter.ts` (new)
- Pipeline integration → `src/services/pipeline-orchestrator.ts` (modified)

---

## Goal

Transform the system from a simulated demo into a live, model-agnostic client. Read user-provided API keys from models.config in real-time and execute native network requests to the appropriate LLM provider during the "Execution" stage.

---

## Non-Goals

- Changing the routing logic or zone governance
- Modifying the skill flywheel
- Adding new failure types
- Persisting API keys (BYOK stays in browser memory only)

---

## Acceptance Criteria

- [x] CognitiveAdapter created with provider factory pattern
- [x] Anthropic SDK integration with `dangerouslyAllowBrowser: true`
- [x] Google Gemini SDK integration
- [x] OpenAI SDK integration with `dangerouslyAllowBrowser: true`
- [x] Pipeline orchestrator uses CognitiveAdapter for interactive mode
- [x] 'executing' status added to InteractionStatus type
- [x] UPDATE_INTERACTION_STATUS action added to reducer
- [x] InteractionCard shows "Awaiting Tier N Cognition..." during API call
- [x] API errors trigger Jidoka halt with DiagnosticCard
- [x] Telemetry captures tokensIn/tokensOut/modelUsed for live calls
- [x] Build passes with no errors

---

## Architecture

```
User Input → Pipeline Stages 1-4 → [APPROVAL if Yellow] → Execution Stage
                                                              ↓
                                                    executeCognitiveRequest()
                                                              ↓
                                            ┌─────────────────┼─────────────────┐
                                            ↓                 ↓                 ↓
                                       Anthropic          Google           OpenAI
                                       (Claude)          (Gemini)         (GPT-4o)
                                            ↓                 ↓                 ↓
                                            └─────────────────┴─────────────────┘
                                                              ↓
                                                    Response → UI Update
```

---

## Implementation Notes

### Provider SDK Details

| Provider | Package | Browser Flag | Default Model |
|----------|---------|--------------|---------------|
| Anthropic | `@anthropic-ai/sdk` | `dangerouslyAllowBrowser: true` | claude-sonnet-4-20250514 |
| Google | `@google/generative-ai` | Native browser support | gemini-1.5-pro |
| OpenAI | `openai` | `dangerouslyAllowBrowser: true` | gpt-4o |

### Graceful Degradation (Jidoka)

When API calls fail, the system triggers the existing halt mechanism:

1. **Missing API Key** → Halt with "Missing API Key for provider: X"
2. **Network Error** → Halt with provider error message
3. **Rate Limit** → Halt with rate limit error
4. **Invalid Response** → Halt with parsing error

All errors render the inline `DiagnosticCard` we built in v0.4.1.

---

## Files Modified

- `package.json` — Added SDK dependencies
- `src/services/CognitiveAdapter.ts` — **CREATED** (Provider factory)
- `src/state/types.ts` — Added 'executing' status, UPDATE_INTERACTION_STATUS action
- `src/state/reducer.ts` — Added UPDATE_INTERACTION_STATUS case
- `src/services/pipeline-orchestrator.ts` — Integrated live API calls
- `src/components/Interaction/InteractionPane.tsx` — Added executing UI state
