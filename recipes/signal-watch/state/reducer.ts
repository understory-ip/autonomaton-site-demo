/**
 * Signal Watch Recipe — Reducer
 *
 * Extends coreReducer with competitive intelligence actions.
 */

import { coreReducer } from '../../../src/core/state/reducer'
import type { SignalWatchState, SignalWatchAction, ScoreHistoryEntry } from './types'
import { defaultRoutingConfig } from '../config/routing'
import { defaultZonesSchema } from '../config/zones'
import { DEFAULT_AI_WATCHLIST } from '../config/defaults'

// =============================================================================
// INITIAL STATE — Signal Watch specific
// =============================================================================

export const signalWatchInitialState: SignalWatchState = {
  mode: 'demo',

  modelConfig: {
    tier0: { provider: 'local_memory', apiKey: null, model: 'cached_skill' },
    tier1: { provider: 'anthropic', apiKey: null, model: 'claude-3-haiku-20240307' },
    tier2: { provider: 'anthropic', apiKey: null, model: 'claude-sonnet-4-20250514' },
    tier3: { provider: 'anthropic', apiKey: null, model: 'claude-opus-4-20250514' },
  },

  routingConfig: defaultRoutingConfig,
  zonesSchema: defaultZonesSchema,
  voicePreset: 'strategic',

  // Pre-configured AI competitors for frictionless onboarding
  watchlist: DEFAULT_AI_WATCHLIST,
  signals: [],
  pendingAdjustments: [],

  pipeline: {
    currentStage: null,
    stages: {
      telemetry: 'idle',
      recognition: 'idle',
      compilation: 'idle',
      approval: 'idle',
      execution: 'idle',
    },
    halted: false,
    haltReason: null,
  },

  interactions: [],
  pendingApproval: null,

  skills: [],
  patternCounts: {},
  skillProposal: { active: false, intent: null, pattern: null, count: 0 },

  metrics: {
    totalCost: 0,
    interactionCount: 0,
    tierHistory: [],
    localCount: 0,
    skillsFired: 0,
    costHistory: [],
  },

  telemetry: [],
  selectedTelemetryId: null,
  selectedInteractionId: null,

  tutorial: {
    active: true,
    currentStep: 0,
    completed: false,
  },

  simulateFailure: 'none',
  configRipple: false,
  currentView: 'briefings',

  isDeckOpen: typeof window !== 'undefined' && !localStorage.getItem('grove_hasSeenDeck'),
  activeSlideIndex: 0,

  foundry: {
    input: '',
    isCompiling: false,
    generatedPRD: '',
    compilerLogs: [],
    error: null,
  },
}

// =============================================================================
// REDUCER
// =============================================================================

export function signalWatchReducer(
  state: SignalWatchState,
  action: SignalWatchAction
): SignalWatchState {
  switch (action.type) {
    // =========================================================================
    // SIGNAL WATCH SPECIFIC ACTIONS
    // =========================================================================
    case 'UPDATE_VOICE_PRESET':
      return { ...state, voicePreset: action.preset }

    case 'SET_WATCHLIST':
      return { ...state, watchlist: action.watchlist }

    case 'ADD_SIGNAL':
      return {
        ...state,
        signals: [...state.signals, action.signal],
      }

    case 'ADD_SIGNALS':
      return {
        ...state,
        signals: [...state.signals, ...action.signals],
      }

    case 'ADD_SCORE_ADJUSTMENT':
      return {
        ...state,
        pendingAdjustments: [...state.pendingAdjustments, action.adjustment],
      }

    case 'APPROVE_SCORE_ADJUSTMENT': {
      const adjustment = state.pendingAdjustments.find(a => a.id === action.id)
      if (!adjustment || !state.watchlist) return state

      return {
        ...state,
        watchlist: {
          ...state.watchlist,
          subjects: state.watchlist.subjects.map(subject =>
            subject.id === adjustment.subjectId
              ? {
                  ...subject,
                  baselineScore: adjustment.proposedScore,
                  lastUpdated: new Date().toISOString(),
                  history: [
                    ...subject.history,
                    {
                      timestamp: new Date().toISOString(),
                      score: adjustment.proposedScore,
                      delta: adjustment.delta,
                      reason: adjustment.reason,
                      signalId: adjustment.signalIds?.[0] || null,
                      approvedBy: 'human' as const,
                    } satisfies ScoreHistoryEntry,
                  ],
                }
              : subject
          ),
        },
        pendingAdjustments: state.pendingAdjustments.map(a =>
          a.id === action.id ? { ...a, status: 'approved' as const } : a
        ),
      }
    }

    case 'REJECT_SCORE_ADJUSTMENT':
      return {
        ...state,
        pendingAdjustments: state.pendingAdjustments.map(a =>
          a.id === action.id ? { ...a, status: 'rejected' as const } : a
        ),
      }

    // =========================================================================
    // DELEGATE TO CORE REDUCER
    // =========================================================================
    default:
      // Pass to core reducer for base actions
      return coreReducer(state, action) as SignalWatchState
  }
}
