/**
 * DashboardView — Main Dashboard Layout
 *
 * Shows:
 * - Subject cards with scores and zone badges
 * - Latest briefing preview
 * - Ratchet chart (the money shot)
 * - Tier distribution
 */

import type { WatchlistSubject, Briefing, CostHistoryEntry, TierHistoryEntry } from '../../state/types'
import { SubjectCard } from './SubjectCard'
import { RatchetChart } from './RatchetChart'
import { TierDistribution } from './TierDistribution'

interface DashboardViewProps {
  subjects: WatchlistSubject[]
  briefings: Briefing[]
  costHistory: CostHistoryEntry[]
  tierHistory: TierHistoryEntry[]
  onSubjectClick: (subject: WatchlistSubject) => void
  onBriefingClick: (briefing: Briefing) => void
  onViewBriefings: () => void
}

function LatestBriefing({
  briefing,
  onClick,
}: {
  briefing: Briefing | null
  onClick: () => void
}) {
  if (!briefing) {
    return (
      <div className="p-6 bg-grove-bg2 rounded-lg border border-grove-border">
        <h3 className="font-mono text-sm font-medium text-grove-text-dim uppercase tracking-wider mb-4">
          Latest Briefing
        </h3>
        <p className="text-sm text-grove-text-dim font-mono text-center py-4">
          No briefings yet. Run a scan to get started.
        </p>
      </div>
    )
  }

  const zoneColors = {
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    yellow: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <button
      onClick={onClick}
      className="w-full p-6 bg-grove-bg2 rounded-lg border border-grove-border hover:border-grove-accent/50 transition-all duration-200 text-left group"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mono text-sm font-medium text-grove-text-dim uppercase tracking-wider">
          Latest Briefing
        </h3>
        <span
          className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${zoneColors[briefing.zone]}`}
        >
          {briefing.zone}
        </span>
      </div>

      <h4 className="font-mono text-lg font-medium text-grove-text mb-2 group-hover:text-grove-accent transition-colors">
        {briefing.title}
      </h4>

      <p className="text-sm text-grove-text-dim line-clamp-2 mb-4">
        {briefing.summary}
      </p>

      <div className="flex items-center justify-between text-xs font-mono text-grove-text-dim">
        <span>
          {new Date(briefing.timestamp).toLocaleDateString()} •{' '}
          {briefing.signalCount} signal{briefing.signalCount !== 1 ? 's' : ''}
        </span>
        <span className="text-grove-accent group-hover:underline">
          View Full →
        </span>
      </div>
    </button>
  )
}

export function DashboardView({
  subjects,
  briefings,
  costHistory,
  tierHistory,
  onSubjectClick,
  onBriefingClick,
  onViewBriefings,
}: DashboardViewProps) {
  const latestBriefing = briefings[0] || null

  // Sort subjects by tier (primary first) then by score (high to low)
  const sortedSubjects = [...subjects].sort((a, b) => {
    const tierOrder = { primary: 0, secondary: 1, emerging: 2 }
    if (tierOrder[a.tier] !== tierOrder[b.tier]) {
      return tierOrder[a.tier] - tierOrder[b.tier]
    }
    return b.baselineScore - a.baselineScore
  })

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 scrollbar-thin">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-xl font-medium text-grove-text">
          Dashboard
        </h1>
        <button
          onClick={onViewBriefings}
          className="text-sm font-mono text-grove-accent hover:underline"
        >
          View All Briefings →
        </button>
      </div>

      {/* Subject Cards Grid */}
      <section>
        <h2 className="font-mono text-sm font-medium text-grove-text-dim uppercase tracking-wider mb-4">
          Watchlist ({subjects.length})
        </h2>
        {subjects.length === 0 ? (
          <div className="p-8 bg-grove-bg2 rounded-lg border border-grove-border text-center">
            <p className="text-sm text-grove-text-dim font-mono">
              No subjects in watchlist. Add competitors to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onClick={() => onSubjectClick(subject)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Latest Briefing + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Latest Briefing */}
        <LatestBriefing
          briefing={latestBriefing}
          onClick={() => latestBriefing && onBriefingClick(latestBriefing)}
        />

        {/* Right: Tier Distribution */}
        <TierDistribution tierHistory={tierHistory} />
      </div>

      {/* Ratchet Chart - Full Width */}
      <RatchetChart costHistory={costHistory} />
    </div>
  )
}
