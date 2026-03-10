/**
 * Cognitive Router — Intent Classification Engine
 *
 * This proves Claim #2: Intelligent routing minimizes cost.
 * The router classifies intent, selects tier, and checks skill cache.
 *
 * In Demo mode: keyword matching against routing.config
 * In Interactive mode: actual LLM inference
 */

import type { RoutingConfig, Tier, Zone, Skill, ZonesSchema } from '../state/types'
import { TIER_CONFIG } from '../config/tiers'

export interface RoutingDecision {
  intent: string
  tier: Tier
  zone: Zone
  confidence: number
  cost: number
  sovereignty: 'local' | 'cloud'
  skillMatch: Skill | null
  reasoning: string
}

/**
 * Classify input and route to appropriate tier
 */
export function classifyIntent(
  input: string,
  routingConfig: RoutingConfig,
  skills: Skill[]
): RoutingDecision {
  const normalized = input.toLowerCase().trim()

  // Phase 1: Check skill cache (Tier 0)
  // If we have a learned skill that matches, use it
  const matchedSkill = skills.find((skill) => {
    const intentConfig = routingConfig.intents[skill.intentMatch]
    if (!intentConfig) return false
    return intentConfig.keywords.some((kw) => normalized.includes(kw.toLowerCase()))
  })

  if (matchedSkill) {
    return {
      intent: matchedSkill.intentMatch,
      tier: 0,
      zone: routingConfig.intents[matchedSkill.intentMatch]?.zone || 'green',
      confidence: 0.95, // High confidence for cached skills
      cost: TIER_CONFIG[0].cost,
      sovereignty: TIER_CONFIG[0].sovereignty,
      skillMatch: matchedSkill,
      reasoning: `Matched cached skill: ${matchedSkill.pattern}`,
    }
  }

  // Phase 2: Match against intent keywords
  let bestMatch: { intent: string; score: number } | null = null

  for (const [intentName, config] of Object.entries(routingConfig.intents)) {
    for (const keyword of config.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        const score = keyword.length / normalized.length // Rough relevance
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { intent: intentName, score }
        }
      }
    }
  }

  if (bestMatch) {
    const intentConfig = routingConfig.intents[bestMatch.intent]
    const tier = intentConfig.tier
    return {
      intent: bestMatch.intent,
      tier,
      zone: intentConfig.zone,
      confidence: Math.min(0.9, 0.5 + bestMatch.score),
      cost: TIER_CONFIG[tier].cost,
      sovereignty: TIER_CONFIG[tier].sovereignty,
      skillMatch: null,
      reasoning: `Matched intent "${bestMatch.intent}" via keywords`,
    }
  }

  // Phase 3: Ad-hoc query — route to Tier 2 for general handling
  // This is a governed fallback (yellow zone, flywheel eligible)
  return {
    intent: 'ad_hoc_query',
    tier: 2,
    zone: 'yellow',
    confidence: 0.3,
    cost: TIER_CONFIG[2].cost,
    sovereignty: TIER_CONFIG[2].sovereignty,
    skillMatch: null,
    reasoning: 'No intent match — routing as ad-hoc query',
  }
}

/**
 * Check if a pattern has reached the skill proposal threshold
 * Reads threshold from routingConfig.skillPromotion.afterNApprovals (CONFIG-DRIVEN)
 */
export function shouldProposeSkill(
  intent: string,
  patternCounts: Record<string, number>,
  skills: Skill[],
  routingConfig?: RoutingConfig
): boolean {
  // READ FROM CONFIG — not hardcoded!
  const threshold = routingConfig?.skillPromotion?.afterNApprovals ?? 5
  const count = patternCounts[intent] || 0
  const alreadyHasSkill = skills.some((s) => s.intentMatch === intent)
  return count >= threshold && !alreadyHasSkill
}

/**
 * Categorize a delta into minor/medium/major
 * CONFIG-DRIVEN: Takes thresholds from zone schema
 */
export function categorizeDelta(
  delta: number,
  zonesSchema: ZonesSchema
): 'minor' | 'medium' | 'major' {
  const absDelta = Math.abs(delta)
  const greenThreshold = zonesSchema.zones.green.thresholds?.maxDelta ?? 0.05
  const yellowThreshold = zonesSchema.zones.yellow.thresholds?.maxDelta ?? 0.15

  if (absDelta < greenThreshold) return 'minor'     // GREEN zone
  if (absDelta < yellowThreshold) return 'medium'   // YELLOW zone
  return 'major'                                      // RED zone
}

/**
 * Generate a generic pattern description
 * Recipes can override this with domain-specific descriptions
 */
export function generatePatternDescription(intent: string): string {
  // Generic descriptions — recipes extend with domain-specific ones
  const patterns: Record<string, string> = {
    quick_classify: 'Quick classification request → immediate categorization',
    analyze: 'Analysis request → structured review',
    deep_analysis: 'Deep analysis request → comprehensive evaluation',
    ad_hoc_query: 'Custom query → general processing',
  }
  return patterns[intent] || `Pattern: ${intent}`
}
