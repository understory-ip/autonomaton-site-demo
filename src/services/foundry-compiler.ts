/**
 * Foundry Compiler — Tier 3 Streaming PRD Generator (v0.9.2)
 *
 * Compiles app descriptions into strict Grove Autonomaton PRDs in real-time.
 * Output is wrapped by blueprint-generator.ts into the Sovereign Manifesto HTML.
 *
 * v0.9.2: Prompt logic moved to declarative pipeline (prompts.schema.ts)
 */

import type { ModelConfig, AppAction } from '../state/types'
import { streamCognitiveRequest } from './CognitiveAdapter'
import { compileFoundryPrompt } from '../config/prompts.schema'

// =============================================================================
// SYSTEM PROMPT — Compiled from Declarative Pipeline
// =============================================================================

// The prompt is now composed from src/config/prompts.schema.ts
// This separates prompt engineering from execution logic.
export const FOUNDRY_SYSTEM_PROMPT = compileFoundryPrompt()

// =============================================================================
// COMPILATION ORCHESTRATOR
// =============================================================================

type Dispatch = React.Dispatch<AppAction>

/**
 * Stream architecture compilation from Tier 3 provider.
 * Dispatches chunks to state as they arrive.
 */
export async function compileArchitecture(
  appDescription: string,
  tierConfig: ModelConfig,
  dispatch: Dispatch
): Promise<void> {
  dispatch({ type: 'START_FOUNDRY_COMPILATION' })

  try {
    for await (const chunk of streamCognitiveRequest(
      appDescription,
      FOUNDRY_SYSTEM_PROMPT,
      tierConfig
    )) {
      dispatch({ type: 'APPEND_FOUNDRY_CHUNK', chunk })
    }
    dispatch({ type: 'COMPLETE_FOUNDRY_COMPILATION' })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    dispatch({ type: 'FAIL_FOUNDRY_COMPILATION', error: message })
  }
}
