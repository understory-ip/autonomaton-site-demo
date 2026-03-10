/**
 * TierDistribution — Tier Usage Breakdown
 *
 * Shows horizontal bars for each tier's usage.
 * Highlights the flywheel effect: more Tier 0 = more savings.
 */

import type { TierHistoryEntry, Tier } from '../../state/types'
import { TIER_CONFIG } from '../../config/tiers'

interface TierDistributionProps {
  tierHistory: TierHistoryEntry[]
  className?: string
}

interface TierStats {
  tier: Tier
  count: number
  percentage: number
  estimatedCost: number
}

function calculateTierStats(entries: TierHistoryEntry[]): TierStats[] {
  const counts: Record<Tier, number> = { 0: 0, 1: 0, 2: 0, 3: 0 }

  entries.forEach((entry) => {
    counts[entry.tier] = (counts[entry.tier] || 0) + 1
  })

  const total = entries.length || 1

  return ([0, 1, 2, 3] as Tier[]).map((tier) => ({
    tier,
    count: counts[tier],
    percentage: (counts[tier] / total) * 100,
    estimatedCost: counts[tier] * TIER_CONFIG[tier].cost,
  }))
}

function formatCost(cost: number): string {
  if (cost === 0) return '$0.00'
  if (cost < 0.01) return '<$0.01'
  return `$${cost.toFixed(2)}`
}

export function TierDistribution({ tierHistory, className = '' }: TierDistributionProps) {
  const stats = calculateTierStats(tierHistory)
  const totalOps = tierHistory.length
  const totalCost = stats.reduce((sum, s) => sum + s.estimatedCost, 0)

  // Calculate savings vs all Tier 2
  const allTier2Cost = totalOps * TIER_CONFIG[2].cost
  const savings = allTier2Cost - totalCost

  const tierColors = {
    0: 'bg-emerald-500',
    1: 'bg-blue-400',
    2: 'bg-amber-400',
    3: 'bg-purple-500',
  }

  const tierLabels = {
    0: 'Skills',
    1: 'Cheap',
    2: 'Premium',
    3: 'Apex',
  }

  if (totalOps === 0) {
    return (
      <div className={`p-6 bg-grove-bg2 rounded-lg border border-grove-border ${className}`}>
        <h3 className="font-mono text-sm font-medium text-grove-text-dim uppercase tracking-wider mb-4">
          Tier Distribution
        </h3>
        <p className="text-sm text-grove-text-dim text-center font-mono py-4">
          No operations yet
        </p>
      </div>
    )
  }

  return (
    <div className={`p-6 bg-grove-bg2 rounded-lg border border-grove-border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm font-medium text-grove-text-dim uppercase tracking-wider">
          Tier Distribution
        </h3>
        <span className="text-xs font-mono text-grove-text-dim">
          {totalOps} ops
        </span>
      </div>

      {/* Tier Bars */}
      <div className="space-y-3 mb-4">
        {stats.map(({ tier, count, percentage, estimatedCost }) => (
          <div key={tier} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${tierColors[tier]}`} />
                <span className="text-xs font-mono text-grove-text">
                  Tier {tier}
                </span>
                <span className="text-xs font-mono text-grove-text-dim">
                  ({tierLabels[tier]})
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-grove-text-dim">{count}</span>
                <span className="text-grove-text">{percentage.toFixed(0)}%</span>
                <span className="text-grove-text-dim w-16 text-right">
                  {formatCost(estimatedCost)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-grove-bg rounded-full overflow-hidden">
              <div
                className={`h-full ${tierColors[tier]} transition-all duration-500`}
                style={{ width: `${Math.max(percentage, 1)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t border-grove-border/50 flex items-center justify-between">
        <div className="text-xs font-mono text-grove-text-dim">
          Estimated Total
        </div>
        <div className="text-sm font-mono font-medium text-grove-text">
          {formatCost(totalCost)}
        </div>
      </div>

      {savings > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs font-mono text-emerald-400">
            Savings vs all Tier 2
          </div>
          <div className="text-sm font-mono font-medium text-emerald-400">
            {formatCost(savings)}
          </div>
        </div>
      )}
    </div>
  )
}
