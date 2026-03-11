/**
 * entity-extractor — Tier 1 Haiku Entity Extraction
 *
 * Fast, cheap entity extraction from natural language input.
 * "Add Deepseek as an emerging competitor" → { name: "Deepseek", typeHint: "competitor", tierHint: "emerging" }
 *
 * This demonstrates the tiered architecture: Haiku (Tier 1) does quick
 * classification before Sonnet (Tier 2) does deep research.
 *
 * The "crimpled" UX: Users see this work and think "I could do this with regex!"
 * That's the inspiration.
 */

import Anthropic from '@anthropic-ai/sdk'

export interface EntityExtraction {
  name: string
  typeHint?: 'competitor' | 'partner' | 'market' | 'technology' | 'regulatory'
  tierHint?: 'primary' | 'secondary' | 'emerging'
  confidence: number
}

const EXTRACTION_PROMPT = `Extract the subject entity from this user input. Return JSON only.

User input: "{INPUT}"

Return format (JSON only, no markdown):
{
  "name": "company/entity name",
  "typeHint": "competitor" | "partner" | "market" | "technology" | "regulatory" | null,
  "tierHint": "primary" | "secondary" | "emerging" | null,
  "confidence": 0.0-1.0
}

Examples:
- "Add Deepseek as an emerging competitor" → {"name":"Deepseek","typeHint":"competitor","tierHint":"emerging","confidence":0.95}
- "Anthropic - direct competitor" → {"name":"Anthropic","typeHint":"competitor","tierHint":"primary","confidence":0.9}
- "Track OpenAI" → {"name":"OpenAI","typeHint":null,"tierHint":null,"confidence":0.8}
- "Microsoft as a technology partner" → {"name":"Microsoft","typeHint":"partner","tierHint":"primary","confidence":0.9}

JSON only:`

/**
 * Extract entity from natural language input using Haiku (Tier 1).
 * Fast (~200ms) and cheap (~$0.001).
 */
export async function extractSubjectEntity(
  input: string,
  apiKey: string
): Promise<EntityExtraction> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const prompt = EXTRACTION_PROMPT.replace('{INPUT}', input)

  try {
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    )
    const text = textBlock?.text ?? ''

    // Parse JSON response
    const cleaned = text.trim().replace(/```json\s*/gi, '').replace(/```\s*/g, '')
    const parsed = JSON.parse(cleaned)

    return {
      name: parsed.name || input.trim(),
      typeHint: parsed.typeHint || undefined,
      tierHint: parsed.tierHint || undefined,
      confidence: parsed.confidence || 0.5,
    }
  } catch {
    // Fallback: use raw input as name, no hints
    // This is the "fail gracefully" behavior
    return {
      name: input.trim(),
      confidence: 0.3,
    }
  }
}

/**
 * Estimate cost of Haiku extraction.
 * ~100 input tokens, ~50 output tokens = ~$0.0001
 */
export const HAIKU_EXTRACTION_COST = 0.0001
