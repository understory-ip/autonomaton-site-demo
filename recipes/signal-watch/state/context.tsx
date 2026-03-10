/**
 * Signal Watch Recipe — Provider
 *
 * Wraps core provider with Signal Watch state and reducer.
 * This is the entry point for recipe activation.
 */

import { type ReactNode } from 'react'
import { createRecipeProvider } from '../../../src/core/state/context'
import { signalWatchReducer, signalWatchInitialState } from './reducer'
import type { SignalWatchState, SignalWatchAction } from './types'

// Create the Signal Watch provider using core factory
const { Provider, useAppState, useAppDispatch } = createRecipeProvider<
  SignalWatchState,
  SignalWatchAction
>(signalWatchReducer, signalWatchInitialState)

// Re-export with recipe-specific names
export { useAppState, useAppDispatch }

// Convenience aliases
export const useSignalWatchState = useAppState
export const useSignalWatchDispatch = useAppDispatch

/**
 * SignalWatchProvider — Root provider for Signal Watch recipe
 */
export function SignalWatchProvider({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>
}
