/**
 * SubjectCard — Compact subject display for dashboard
 *
 * Shows name, score bar, zone badge, and recent delta.
 */

import type { WatchlistSubject, Zone } from '../../state/types'
import { ZONE_THRESHOLDS } from '../../config/zones'

interface SubjectCardProps {
  subject: WatchlistSubject
  onClick?: () => void
}

function getZoneFromDelta(delta: number): Zone {
  const absDelta = Math.abs(delta)
  if (absDelta < ZONE_THRESHOLDS.greenMax) return 'green'
  if (absDelta < ZONE_THRESHOLDS.yellowMax) return 'yellow'
  return 'red'
}

function formatDelta(delta: number): string {
  if (delta === 0) return '—'
  const sign = delta > 0 ? '▲' : '▼'
  return `${sign}${Math.abs(delta * 100).toFixed(0)}%`
}

function getRelativeTime(timestamp: string): string {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const lastEntry = subject.history[subject.history.length - 1]
  const delta = lastEntry?.delta || 0
  const zone = getZoneFromDelta(delta)
  const scorePercent = Math.round(subject.baselineScore * 100)

  const zoneColors = {
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    yellow: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const tierBadge = {
    primary: 'P',
    secondary: 'S',
    emerging: 'E',
  }

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-grove-bg2 rounded-lg border border-grove-border hover:border-grove-accent/50 transition-all duration-200 text-left group"
    >
      {/* Header: Name + Tier */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-sm font-medium text-grove-text truncate pr-2">
          {subject.name}
        </span>
        <span className="text-xs font-mono text-grove-text-dim bg-grove-bg3 px-1.5 py-0.5 rounded">
          {tierBadge[subject.tier]}
        </span>
      </div>

      {/* Score Bar */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-2xl font-mono font-bold text-grove-text">
            {scorePercent}
          </span>
          <span className="text-xs font-mono text-grove-text-dim">%</span>
        </div>
        <div className="h-2 bg-grove-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-grove-accent/60 to-grove-accent transition-all duration-500"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Zone + Delta */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${zoneColors[zone]}`}
        >
          {zone}
        </span>
        <span
          className={`text-xs font-mono ${
            delta > 0
              ? 'text-emerald-400'
              : delta < 0
              ? 'text-red-400'
              : 'text-grove-text-dim'
          }`}
        >
          {formatDelta(delta)}
        </span>
      </div>

      {/* Last Update */}
      <div className="mt-2 text-xs font-mono text-grove-text-dim">
        {subject.lastUpdated ? getRelativeTime(subject.lastUpdated) : 'No updates'}
      </div>
    </button>
  )
}
