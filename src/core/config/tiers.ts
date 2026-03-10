/**
 * Tier Configuration — Cognitive Routing Costs
 *
 * The four tiers of cognition with associated costs and latency.
 * These are structural constants — recipes don't override them.
 */

import type { Tier, TierConfig } from '../state/types'

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  0: {
    latencyMs: 10,
    cost: 0,
    sovereignty: 'local',
    label: 'Cached Skill',
  },
  1: {
    latencyMs: 500,
    cost: 0.001,
    sovereignty: 'cloud',
    label: 'Fast Classification',
  },
  2: {
    latencyMs: 2000,
    cost: 0.01,
    sovereignty: 'cloud',
    label: 'Standard Analysis',
  },
  3: {
    latencyMs: 5000,
    cost: 0.05,
    sovereignty: 'cloud',
    label: 'Deep Analysis',
  },
}

/**
 * Get tier label for display
 */
export function getTierLabel(tier: Tier): string {
  return TIER_CONFIG[tier].label
}

/**
 * Get tier cost for calculations
 */
export function getTierCost(tier: Tier): number {
  return TIER_CONFIG[tier].cost
}
