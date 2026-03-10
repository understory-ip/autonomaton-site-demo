/**
 * RatchetChart — Cost Trend Visualization
 *
 * THE MONEY SHOT: Shows cost declining over time as skills kick in.
 * Visualizes the flywheel effect where Tier 0 cached skills
 * replace expensive cloud inference.
 */

import type { CostHistoryEntry } from '../../state/types'

interface RatchetChartProps {
  costHistory: CostHistoryEntry[]
  className?: string
}

interface WeekBucket {
  label: string
  cost: number
  count: number
  skillCount: number
}

function bucketByWeek(entries: CostHistoryEntry[]): WeekBucket[] {
  if (entries.length === 0) return []

  const buckets: Map<string, WeekBucket> = new Map()

  entries.forEach((entry) => {
    const date = new Date(entry.timestamp)
    // Get week start (Sunday)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().slice(0, 10)

    const existing = buckets.get(weekKey)
    if (existing) {
      existing.cost += entry.cost
      existing.count += 1
      if (entry.skillMatch) existing.skillCount += 1
    } else {
      buckets.set(weekKey, {
        label: `Week ${buckets.size + 1}`,
        cost: entry.cost,
        count: 1,
        skillCount: entry.skillMatch ? 1 : 0,
      })
    }
  })

  return Array.from(buckets.values())
}

function formatCost(cost: number): string {
  if (cost < 0.01) return '<$0.01'
  if (cost < 1) return `$${cost.toFixed(2)}`
  return `$${cost.toFixed(1)}`
}

export function RatchetChart({ costHistory, className = '' }: RatchetChartProps) {
  const buckets = bucketByWeek(costHistory)
  const maxCost = Math.max(...buckets.map((b) => b.cost), 0.01)

  // Calculate trend
  const trend =
    buckets.length >= 2
      ? buckets[buckets.length - 1].cost < buckets[0].cost
        ? 'declining'
        : buckets[buckets.length - 1].cost > buckets[0].cost
        ? 'rising'
        : 'stable'
      : 'insufficient'

  if (costHistory.length === 0) {
    return (
      <div className={`p-6 bg-grove-bg2 rounded-lg border border-grove-border ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-sm font-medium text-grove-text-dim uppercase tracking-wider">
            Cost Ratchet
          </h3>
          <span className="text-xs font-mono text-grove-text-dim">
            No data yet
          </span>
        </div>
        <div className="h-32 flex items-center justify-center">
          <p className="text-sm text-grove-text-dim text-center font-mono">
            Run scans to see cost trends
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 bg-grove-bg2 rounded-lg border border-grove-border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm font-medium text-grove-text-dim uppercase tracking-wider">
          Cost Ratchet
        </h3>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded ${
            trend === 'declining'
              ? 'bg-emerald-500/20 text-emerald-400'
              : trend === 'rising'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-grove-bg3 text-grove-text-dim'
          }`}
        >
          {trend === 'declining' && '↓ Costs declining'}
          {trend === 'rising' && '↑ Costs rising'}
          {trend === 'stable' && '→ Stable'}
          {trend === 'insufficient' && 'Building baseline...'}
        </span>
      </div>

      {/* Chart */}
      <div className="h-32 flex items-end gap-2 mb-4">
        {buckets.map((bucket, i) => {
          const height = Math.max((bucket.cost / maxCost) * 100, 4)
          const skillRatio = bucket.count > 0 ? bucket.skillCount / bucket.count : 0

          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              {/* Bar */}
              <div className="w-full flex flex-col-reverse relative group">
                {/* Main bar */}
                <div
                  className="w-full bg-gradient-to-t from-grove-accent/60 to-grove-accent rounded-t transition-all duration-300 hover:opacity-80"
                  style={{ height: `${height}%`, minHeight: '4px' }}
                />
                {/* Skill overlay (darker portion representing skill usage) */}
                {skillRatio > 0 && (
                  <div
                    className="absolute bottom-0 left-0 w-full bg-emerald-500/40 rounded-t"
                    style={{ height: `${height * skillRatio}%` }}
                  />
                )}
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-grove-bg3 px-2 py-1 rounded text-xs font-mono text-grove-text opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {formatCost(bucket.cost)} • {bucket.count} ops
                </div>
              </div>
              {/* Label */}
              <span className="text-xs font-mono text-grove-text-dim mt-2 truncate w-full text-center">
                {bucket.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-grove-accent" />
            <span className="text-grove-text-dim">Cloud</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500/40" />
            <span className="text-grove-text-dim">Skills</span>
          </div>
        </div>
        <span className="text-grove-text-dim">
          Total: {formatCost(costHistory.reduce((sum, e) => sum + e.cost, 0))}
        </span>
      </div>
    </div>
  )
}
