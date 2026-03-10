/**
 * Signal Watch Recipe — Type Definitions
 *
 * Extends BaseAppState and BaseAppAction with competitive intelligence types.
 */

import type {
  BaseAppState,
  BaseAppAction,
  Tier,
  Zone,
  Interaction,
  Metrics,
} from '../../../src/core/state/types'

// Re-export core types for convenience
export * from '../../../src/core/state/types'

// =============================================================================
// SIGNAL LEVELS — Competitive intelligence threat classification
// =============================================================================

export type SignalLevel = 'routine' | 'significant' | 'critical'

// =============================================================================
// SIGNALS — Competitive intelligence signal types
// =============================================================================

export type SourceType = 'rss' | 'api' | 'webhook' | 'manual'

export interface RawSignal {
  id: string
  sourceId: string
  sourceName: string
  sourceType: SourceType
  sourceReliability: number
  timestamp: string
  title: string
  content: string
  url: string
  metadata: Record<string, unknown>
}

export interface WatchlistSubjectMatch {
  subjectId: string
  subjectName: string
  relevanceScore: number
  proposedScoreDelta: number
  deltaReason: string
}

export interface ClassifiedSignal extends RawSignal {
  classificationId: string
  relevance: number
  novelty: number
  threatLevel: SignalLevel
  impactLevel: 'low' | 'medium' | 'high'
  subjects: WatchlistSubjectMatch[]
  keywords: string[]
  tier: Tier
  zone: Zone
  confidence: number
}

// =============================================================================
// WATCHLIST — Competitive subjects to monitor
// =============================================================================

export type SubjectTier = 'primary' | 'secondary' | 'emerging'
export type SubjectType = 'competitor' | 'partner' | 'market' | 'technology' | 'regulatory'

export interface SourceConfig {
  id: string
  name: string
  type: SourceType
  url: string
  reliability: number
  refreshIntervalMs: number
  enabled: boolean
}

export interface ScoreHistoryEntry {
  timestamp: string
  score: number
  delta: number
  reason: string
  signalId: string | null
  approvedBy: 'system' | 'human'
}

export interface WatchlistSubject {
  id: string
  name: string
  type: SubjectType
  tier: SubjectTier
  baselineScore: number
  keywords: string[]
  aliases: string[]
  sources: SourceConfig[]
  lastUpdated: string
  history: ScoreHistoryEntry[]
}

export interface Watchlist {
  id: string
  name: string
  version: string
  subjects: WatchlistSubject[]
  lastModified: string
}

// =============================================================================
// SCORING — Competitive score adjustments
// =============================================================================

export interface ScoreAdjustment {
  id: string
  subjectId: string
  subjectName: string
  currentScore: number
  proposedScore: number
  delta: number
  reason: string
  signalIds: string[]
  triggeredBy: string
  confidence: number
  zone: Zone
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  decidedAt: string | null
  decidedBy: 'system' | 'human' | null
}

// =============================================================================
// BRIEFINGS — Intelligence summaries
// =============================================================================

export type BriefingType = 'routine' | 'significant' | 'strategic'

export interface BriefingHighlight {
  text: string
  zone?: Zone
  subjectId?: string
  type?: 'new_entrant' | 'product_launch' | 'funding' | 'partnership' | 'regulatory' | 'talent'
}

export interface BriefingRecommendation {
  priority: 'high' | 'medium' | 'low'
  action: string
  rationale: string
  subject?: string
}

export interface ProposedSubject {
  id: string
  name: string
  type: SubjectType
  tier: SubjectTier
  keywords: string[]
  aliases: string[]
  initialScore: number
  rationale: string
}

export interface ResearchSource {
  url: string
  title: string
  citedText?: string
  pageAge?: string
}

export interface ResearchSection {
  analysis: string
  keyFindings: string[]
  sources: ResearchSource[]
  searchCount: number
  templateHash: string
}

export interface DomainConfig {
  version: string
  hash: string
  domain: {
    name: string
    description: string
  }
  signalTypes: Array<{
    label: string
    keywords: string[]
    icon?: string
  }>
  subjectTypes: Array<{
    label: string
    description: string
  }>
  scoringRubric: {
    factors: Array<{
      name: string
      weight: number
      description: string
    }>
  }
  domainKeywords: string[]
}

export interface Briefing {
  id: string
  title: string
  type: BriefingType
  timestamp: string
  tier: Tier
  signalCount: number
  period?: { start: string; end: string }
  signalIds?: string[]
  pendingAdjustments?: ScoreAdjustment[]
  pendingSubject?: ProposedSubject
  pendingDomainConfig?: DomainConfig
  research?: ResearchSection
  summary: string
  highlights: BriefingHighlight[]
  recommendations?: BriefingRecommendation[]
  zone: Zone
  status: 'draft' | 'delivered' | 'archived'
}

// =============================================================================
// EXTENDED INTERACTION — Signal Watch additions
// =============================================================================

export interface SignalWatchInteraction extends Interaction {
  signalIds?: string[]
  scoreDelta?: number
}

// =============================================================================
// EXTENDED METRICS — Signal Watch additions
// =============================================================================

export interface SignalWatchMetrics extends Metrics {
  signalsProcessed?: number
  signalsByThreatLevel?: Record<SignalLevel, number>
  pendingAdjustments?: number
  briefingsDelivered?: number
}

// =============================================================================
// VOICE PRESETS — Signal Watch specific
// =============================================================================

export type VoicePreset = 'strategic' | 'executive' | 'operator'

// =============================================================================
// SIGNAL WATCH STATE — Extends BaseAppState
// =============================================================================

export interface SignalWatchState extends BaseAppState {
  // Voice preset for briefing style
  voicePreset: VoicePreset

  // Competitive intelligence
  watchlist: Watchlist | null
  signals: ClassifiedSignal[]
  pendingAdjustments: ScoreAdjustment[]

  // Override view with Signal Watch views
  currentView: 'dashboard' | 'briefings' | 'config' | 'flywheel'
}

// =============================================================================
// SIGNAL WATCH ACTIONS — Extends BaseAppAction
// =============================================================================

export type SignalWatchAction =
  | BaseAppAction
  | { type: 'UPDATE_VOICE_PRESET'; preset: VoicePreset }
  | { type: 'SET_WATCHLIST'; watchlist: Watchlist }
  | { type: 'ADD_SIGNAL'; signal: ClassifiedSignal }
  | { type: 'ADD_SIGNALS'; signals: ClassifiedSignal[] }
  | { type: 'ADD_SCORE_ADJUSTMENT'; adjustment: ScoreAdjustment }
  | { type: 'APPROVE_SCORE_ADJUSTMENT'; id: string }
  | { type: 'REJECT_SCORE_ADJUSTMENT'; id: string }
