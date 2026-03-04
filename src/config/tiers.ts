/**
 * Tier Configuration — Cognitive Routing
 *
 * Four tiers of intelligence, each with distinct profiles:
 * - Tier 0: Pattern Cache (learned skills) — instant, free, local
 * - Tier 1: Cheap Cognition — fast, cheap, local-ish
 * - Tier 2: Premium Cognition — moderate, standard, cloud
 * - Tier 3: Apex Cognition — slow, expensive, cloud/agentic
 *
 * The Ratchet: Over time, work migrates DOWN the tiers.
 * Every downward migration improves cost, privacy, sovereignty, and simplicity.
 */

import type { Tier, TierConfig } from '../state/types'

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  0: {
    latencyMs: 50,
    cost: 0.00,
    sovereignty: 'local',
    label: 'Cached Skill',
  },
  1: {
    latencyMs: 200,
    cost: 0.001,
    sovereignty: 'local',
    label: 'Cheap Cognition',
  },
  2: {
    latencyMs: 800,
    cost: 0.01,
    sovereignty: 'cloud',
    label: 'Premium Cognition',
  },
  3: {
    latencyMs: 1500,
    cost: 0.10,
    sovereignty: 'cloud',
    label: 'Apex Cognition',
  },
}

/**
 * Get tier CSS class for consistent styling
 */
export function getTierColorClass(tier: Tier): string {
  return `tier-${tier}`
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  if (cost === 0) return '$0.00'
  if (cost < 0.01) return `$${cost.toFixed(4)}`
  return `$${cost.toFixed(2)}`
}

/**
 * Calculate savings when a pattern migrates to Tier 0
 */
export function calculateSavings(originalTier: Tier): number {
  return TIER_CONFIG[originalTier].cost - TIER_CONFIG[0].cost
}

/**
 * Get sovereignty icon/label
 */
export function getSovereigntyLabel(sovereignty: 'local' | 'cloud'): string {
  return sovereignty === 'local' ? '🏠 Local' : '☁️ Cloud'
}
