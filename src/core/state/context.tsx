/**
 * Core Context — Base State Provider
 *
 * Provides base state and dispatch. Recipes extend this with their own state.
 */

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react'
import { coreReducer, coreInitialState } from './reducer'
import type { BaseAppState, BaseAppAction } from './types'

// =============================================================================
// CONTEXT — Generic, extendable by recipes
// =============================================================================

interface CoreContextValue<S extends BaseAppState = BaseAppState, A extends BaseAppAction = BaseAppAction> {
  state: S
  dispatch: Dispatch<A>
}

const CoreContext = createContext<CoreContextValue | null>(null)

// =============================================================================
// PROVIDER — Can be used directly or extended by recipes
// =============================================================================

interface CoreProviderProps {
  children: ReactNode
}

/**
 * Core provider for base autonomaton.
 * Recipes should use createRecipeProvider() instead for extended state.
 */
export function CoreProvider({ children }: CoreProviderProps) {
  const [state, dispatch] = useReducer(coreReducer, coreInitialState)

  return (
    <CoreContext.Provider value={{ state, dispatch }}>
      {children}
    </CoreContext.Provider>
  )
}

/**
 * Factory to create recipe-specific providers.
 * Recipes call this with their extended reducer and initial state.
 */
export function createRecipeProvider<S extends BaseAppState, A extends BaseAppAction>(
  reducer: (state: S, action: A) => S,
  initialState: S
) {
  return function RecipeProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
      <CoreContext.Provider value={{ state, dispatch } as unknown as CoreContextValue}>
        {children}
      </CoreContext.Provider>
    )
  }
}

// =============================================================================
// HOOKS — Work with both core and recipe contexts
// =============================================================================

/**
 * Access the full state and dispatch
 */
export function useCore<S extends BaseAppState = BaseAppState, A extends BaseAppAction = BaseAppAction>(): CoreContextValue<S, A> {
  const context = useContext(CoreContext)
  if (!context) {
    throw new Error('useCore must be used within CoreProvider or RecipeProvider')
  }
  return context as unknown as CoreContextValue<S, A>
}

/**
 * Access just the state (for read-only components)
 */
export function useCoreState<S extends BaseAppState = BaseAppState>(): S {
  return useCore<S>().state
}

/**
 * Access just dispatch (for action-only components)
 */
export function useCoreDispatch<A extends BaseAppAction = BaseAppAction>(): Dispatch<A> {
  return useCore<BaseAppState, A>().dispatch
}

// =============================================================================
// SELECTOR HOOKS — Granular state access for core state
// =============================================================================

export function usePipeline() {
  return useCoreState().pipeline
}

export function useInteractions() {
  return useCoreState().interactions
}

export function useSkills() {
  return useCoreState().skills
}

export function useTelemetry() {
  return useCoreState().telemetry
}

export function useMetrics() {
  return useCoreState().metrics
}

export function useTutorial() {
  return useCoreState().tutorial
}

export function useRoutingConfig() {
  return useCoreState().routingConfig
}

export function useZonesSchema() {
  return useCoreState().zonesSchema
}

export function useMode() {
  return useCoreState().mode
}

export function useSkillProposal() {
  return useCoreState().skillProposal
}

export function usePendingApproval() {
  return useCoreState().pendingApproval
}

export function useSimulateFailure() {
  return useCoreState().simulateFailure
}

export function usePatternCounts() {
  return useCoreState().patternCounts
}
