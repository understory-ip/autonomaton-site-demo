/**
 * Voice Presets — Declarative Output Styling
 *
 * These presets control HOW briefings are written, not WHAT they contain.
 * The Litmus Test: Switch preset → next scan → visibly different output.
 *
 * VERSION: 1.0.0
 */

export type VoicePresetId = 'strategic' | 'executive' | 'operator'

export interface VoicePreset {
  id: VoicePresetId
  name: string
  description: string
  instructions: string[]
  preview: string  // Sample output to show in Config panel
}

export const VOICE_PRESETS: Record<VoicePresetId, VoicePreset> = {
  strategic: {
    id: 'strategic',
    name: 'Strategic Analyst',
    description: 'Lead with insight. No hedging. Active voice.',
    instructions: [
      'LEAD WITH INSIGHT: Start with "so what?" — strategic implication first',
      'NO HEDGING: Avoid "potentially", "possibly", "might". State directly.',
      'ACTIVE VOICE: "Anthropic cut prices" not "Prices were cut"',
      'STRATEGIC FRAMING: Tie to business impact, market dynamics',
      'SENTENCE ARCHITECTURE: Short for impact. Longer for explanation.',
    ],
    preview: `"Anthropic's 50% price cut repositions Claude as the cost-performance leader. This is a market share play aimed directly at OpenAI's enterprise base."`,
  },
  executive: {
    id: 'executive',
    name: 'Executive Brief',
    description: 'Bottom-line up front. 3 bullets max. Decision-ready.',
    instructions: [
      'BLUF: Bottom Line Up Front. First sentence is the decision point.',
      'THREE BULLETS MAX: Distill to 3 actionable insights.',
      'DECISION-READY: End with clear recommendation or options.',
      'NO BACKGROUND: Assume executive knows context.',
      'NUMBERS FIRST: Lead with metrics, percentages, deltas.',
    ],
    preview: `"ACTION REQUIRED: Anthropic pricing now 50% below OpenAI.
• Enterprise cost: -$2.4M/year at current volume
• Migration risk: Low (API compatible)
• Recommendation: Pilot Claude on Tier 2 workloads"`,
  },
  operator: {
    id: 'operator',
    name: 'Operator Log',
    description: 'Terse. Facts only. No interpretation. Timestamp all.',
    instructions: [
      'SUMMARY FORMAT: Use "[ISO_TIMESTAMP] EVENT_TYPE\\nkey: value" format. Max 3 lines.',
      'ANALYSIS FORMAT: Numbered list only. "[1] Subject: fact. [2] Subject: fact." No paragraphs.',
      'KEY FINDINGS: Single line each. "SUBJECT: metric (+/-X%)" format.',
      'NO PROSE: Zero narrative sentences. Data points and deltas only.',
      'NO INTERPRETATION: Report what happened, not what it means. No "this suggests" or "indicates".',
    ],
    preview: `"[2024-03-09T14:32Z] PRICE_CHANGE
anthropic/claude-3.5-sonnet: -50% to $3/MTok
source: official_blog | confidence: HIGH"`,
  },
} as const

/**
 * Get the voice instructions as a formatted string for prompt injection
 */
export function getVoiceInstructions(presetId: VoicePresetId): string {
  const preset = VOICE_PRESETS[presetId]
  return `# VOICE: ${preset.name}
${preset.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}`
}

/**
 * Default preset for new users
 */
export const DEFAULT_VOICE_PRESET: VoicePresetId = 'strategic'
