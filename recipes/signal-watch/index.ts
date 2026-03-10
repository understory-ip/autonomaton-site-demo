/**
 * Signal Watch Recipe — Main Export
 *
 * This is the entry point for the Signal Watch recipe.
 * Import everything from here to activate the recipe.
 *
 * Usage:
 *   import { SignalWatchProvider, SignalWatchApp } from './recipes/signal-watch'
 *
 * The recipe extends the core autonomaton with:
 * - Competitive intelligence domain vocabulary (subjects, signals, briefings)
 * - AI landscape watchlist with 5 default competitors
 * - Zone-based governance for score adjustments
 * - Strategic briefing compilation
 */

// State
export * from './state'

// Config
export * from './config'

// Re-export useful core types
export type {
  BaseAppState,
  BaseAppAction,
  Tier,
  Zone,
  Interaction,
  TelemetryEntry,
} from '../../src/core/state/types'
