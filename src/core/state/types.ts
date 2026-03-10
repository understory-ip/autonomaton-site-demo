/**
 * Core Types — Base Autonomaton Type Definitions
 *
 * These are the INTERFACES that recipes extend.
 * Core never imports from recipes. Dependency flows one way: recipe → core.
 *
 * Vocabulary:
 * - entity (not subject, competitor)
 * - observation (not signal)
 * - analysis (not briefing)
 * - dimension (not score, scoring dimension)
 */

// =============================================================================
// PIPELINE — The five-stage invariant
// =============================================================================

/** The five stages every interaction traverses */
export type PipelineStage =
  | 'telemetry'    // Ingest, create trace
  | 'recognition'  // Classify, select tier
  | 'compilation'  // Check cache, finalize routing
  | 'approval'     // Zone governance check
  | 'execution'    // Generate response

/** State of an individual pipeline stage */
export type StageState = 'idle' | 'active' | 'complete' | 'error'

/** Pipeline state for the current interaction */
export interface PipelineState {
  currentStage: PipelineStage | null
  stages: Record<PipelineStage, StageState>
  halted: boolean
  haltReason: HaltReason | null
}

/** Diagnostic info when pipeline halts (Digital Jidoka) */
export interface HaltReason {
  stage: PipelineStage
  error: string
  expected: string
  proposedFix: string
}

// =============================================================================
// ZONES — Sovereignty guardrails (config-driven)
// =============================================================================

/** The three governance zones */
export type Zone = 'green' | 'yellow' | 'red'

/**
 * Zone threshold configuration — provided by recipe
 * Core enforces whatever thresholds it's given
 */
export interface ZoneThresholds {
  minDelta?: number       // Minimum delta to trigger this zone
  maxDelta?: number       // Maximum delta for this zone
  [key: string]: unknown  // Recipe can add custom threshold keys
}

/**
 * Zone definition — structure defined by core, values from recipe
 */
export interface ZoneDefinition {
  meaning: string              // e.g., "Routine Monitoring"
  flywheel_eligible: boolean   // Can intents in this zone become skills?
  allows: string[]             // What actions this zone permits
  forbids?: string[]           // What actions this zone explicitly forbids
  requiresApproval?: string[]  // Actions that require human approval
  requiresHumanDecision?: boolean  // All actions require human (RED zone)
  thresholds?: ZoneThresholds  // Delta thresholds for zone
  description: string          // Human-readable explanation
}

export interface ZonesSchema {
  zones: Record<Zone, ZoneDefinition>
}

// =============================================================================
// TIERS — Cognitive routing
// =============================================================================

/** The four tiers of cognition */
export type Tier = 0 | 1 | 2 | 3

export interface TierConfig {
  latencyMs: number
  cost: number
  sovereignty: 'local' | 'cloud'
  label: string
}

// =============================================================================
// ROUTING — Declarative intent configuration
// =============================================================================

export interface IntentConfig {
  tier: Tier           // 0=cached, 1=cheap, 2=premium, 3=apex
  zone: Zone
  description: string
  keywords: string[]   // For intent matching
}

/**
 * Skill promotion configuration
 * Controls when patterns become auto-approve skills
 */
export interface SkillPromotionConfig {
  afterNApprovals: number        // Default: 5
  promotableTiers: number[]      // Which tiers can become Tier 0
  [key: string]: unknown         // Recipe can add custom keys
}

export interface RoutingConfig {
  intents: Record<string, IntentConfig>
  skillPromotion?: SkillPromotionConfig
}

// =============================================================================
// SKILLS — The flywheel output
// =============================================================================

export interface Skill {
  id: string
  pattern: string
  intentMatch: string
  approvedAt: string
  timesFired: number
  cumulativeSavings: number
  originalTier: Tier
}

export interface SkillProposal {
  active: boolean
  intent: string | null
  pattern: string | null
  count: number
}

// =============================================================================
// INTERACTIONS — The unit of work
// =============================================================================

export type InteractionStatus =
  | 'pending'    // In pipeline
  | 'approved'   // Human approved (yellow zone)
  | 'rejected'   // Human rejected (yellow zone)
  | 'executing'  // Live API call in flight
  | 'completed'  // Successfully executed
  | 'halted'     // Pipeline halted (Jidoka)

export type Mode = 'demo' | 'interactive'

export interface Interaction {
  id: string
  timestamp: string
  input: string
  intent: string
  tier: Tier
  zone: Zone
  cost: number
  sovereignty: 'local' | 'cloud'
  confidence: number
  response: string | null
  status: InteractionStatus
  skillMatch: string | null
  mode: Mode
  patternCountAtCreation?: number
  flywheelEligible: boolean
}

// =============================================================================
// TELEMETRY — Audit ledger
// =============================================================================

export interface TelemetryEntry {
  id: string
  timestamp: string
  intent: string
  tier: Tier
  zone: Zone
  confidence: number
  cost: number
  mode: Mode
  latencyMs: number
  humanFeedback: 'approved' | 'rejected' | null
  skillMatch: string | null
  modelUsed?: string
  tokensIn?: number
  tokensOut?: number
  message?: string
  hash?: string  // Provenance hash
}

// =============================================================================
// MODEL CONFIGURATION
// =============================================================================

export interface ModelConfig {
  provider: string
  apiKey: string | null
  model: string
}

// =============================================================================
// METRICS
// =============================================================================

export interface CostHistoryEntry {
  timestamp: string
  cost: number
  tier: Tier
  intent: string
  skillMatch: boolean
}

export interface TierHistoryEntry {
  timestamp: string
  tier: Tier
  intent: string
}

export interface Metrics {
  totalCost: number
  interactionCount: number
  tierHistory: TierHistoryEntry[]
  localCount: number
  skillsFired: number
  costHistory: CostHistoryEntry[]
}

// =============================================================================
// UI STATE
// =============================================================================

export type CurrentView = 'dashboard' | 'inbox' | 'config' | 'flywheel'

export type TutorialStep = 0 | 1 | 2 | 3

export interface TutorialState {
  active: boolean
  currentStep: TutorialStep
  completed: boolean
}

// =============================================================================
// FAILURE SIMULATION (Andon Cord)
// =============================================================================

export type FailureType =
  | 'none'
  | 'api_timeout'
  | 'low_confidence'
  | 'hallucination_detected'

// =============================================================================
// FOUNDRY STATE
// =============================================================================

export interface FoundryState {
  input: string
  isCompiling: boolean
  generatedPRD: string
  compilerLogs: string[]
  error: string | null
}

// =============================================================================
// BASE APPLICATION STATE
// Core state that all recipes share. Recipes extend this.
// =============================================================================

export interface BaseAppState {
  // Operating mode
  mode: Mode

  // Model configuration
  modelConfig: {
    tier0: ModelConfig
    tier1: ModelConfig
    tier2: ModelConfig
    tier3: ModelConfig
  }

  // Declarative configuration
  routingConfig: RoutingConfig
  zonesSchema: ZonesSchema

  // Pipeline state
  pipeline: PipelineState

  // Interactions
  interactions: Interaction[]
  pendingApproval: Interaction | null

  // Skills (the flywheel output)
  skills: Skill[]
  patternCounts: Record<string, number>
  skillProposal: SkillProposal

  // Metrics
  metrics: Metrics

  // Telemetry (audit trail)
  telemetry: TelemetryEntry[]
  selectedTelemetryId: string | null
  selectedInteractionId: string | null

  // Tutorial
  tutorial: TutorialState

  // Failure simulation (Andon cord)
  simulateFailure: FailureType

  // UI state
  configRipple: boolean
  currentView: CurrentView

  // Deck overlay
  isDeckOpen: boolean
  activeSlideIndex: number

  // Foundry
  foundry: FoundryState
}

// =============================================================================
// BASE ACTIONS
// Core actions that all recipes share. Recipes extend this.
// =============================================================================

export type BaseAppAction =
  // Mode
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_MODEL_CONFIG'; tier: 0 | 1 | 2 | 3; config: Partial<ModelConfig> }
  | { type: 'SET_ALL_MODEL_CONFIGS'; config: Partial<ModelConfig> }

  // Config
  | { type: 'UPDATE_ROUTING_CONFIG'; config: RoutingConfig }
  | { type: 'UPDATE_ZONES_SCHEMA'; schema: ZonesSchema }
  | { type: 'TRIGGER_CONFIG_RIPPLE' }
  | { type: 'CLEAR_CONFIG_RIPPLE' }

  // Pipeline
  | { type: 'SET_PIPELINE_STAGE'; stage: PipelineStage; state: StageState }
  | { type: 'ADVANCE_PIPELINE' }
  | { type: 'RESET_PIPELINE' }
  | { type: 'HALT_PIPELINE'; reason: HaltReason }

  // Interactions
  | { type: 'SUBMIT_INPUT'; input: string }
  | { type: 'SET_PENDING_APPROVAL'; interaction: Interaction }
  | { type: 'APPROVE_INTERACTION' }
  | { type: 'REJECT_INTERACTION' }
  | { type: 'COMPLETE_INTERACTION'; response: string; telemetry: Partial<TelemetryEntry> }
  | { type: 'ADD_INTERACTION'; interaction: Interaction }
  | { type: 'UPDATE_INTERACTION_STATUS'; id: string; status: InteractionStatus }

  // Skills
  | { type: 'INCREMENT_PATTERN'; intent: string }
  | { type: 'PROPOSE_SKILL'; intent: string; pattern: string; count: number }
  | { type: 'APPROVE_SKILL' }
  | { type: 'REJECT_SKILL' }
  | { type: 'FIRE_SKILL'; skillId: string; savings: number }

  // Telemetry
  | { type: 'ADD_TELEMETRY'; entry: TelemetryEntry }
  | { type: 'SELECT_TELEMETRY'; id: string | null }
  | { type: 'SELECT_INTERACTION'; id: string | null }

  // Tutorial
  | { type: 'START_TUTORIAL' }
  | { type: 'ADVANCE_TUTORIAL' }
  | { type: 'SKIP_TUTORIAL' }
  | { type: 'COMPLETE_TUTORIAL' }

  // Failure simulation
  | { type: 'SET_FAILURE_SIMULATION'; failureType: FailureType }

  // Metrics
  | { type: 'UPDATE_METRICS'; delta: Partial<Metrics> }

  // Deck overlay
  | { type: 'OPEN_DECK' }
  | { type: 'CLOSE_DECK' }
  | { type: 'SET_ACTIVE_SLIDE'; index: number }

  // View routing
  | { type: 'SET_VIEW'; view: CurrentView }

  // Foundry
  | { type: 'SET_FOUNDRY_INPUT'; input: string }
  | { type: 'START_FOUNDRY_COMPILATION' }
  | { type: 'APPEND_FOUNDRY_LOG'; log: string }
  | { type: 'APPEND_FOUNDRY_CHUNK'; chunk: string }
  | { type: 'COMPLETE_FOUNDRY_COMPILATION' }
  | { type: 'FAIL_FOUNDRY_COMPILATION'; error: string }
  | { type: 'CLEAR_FOUNDRY' }
