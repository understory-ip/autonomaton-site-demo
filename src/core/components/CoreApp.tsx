/**
 * CoreApp — Base Autonomaton Shell
 *
 * This is the minimal UI skeleton that recipes extend.
 * It provides:
 * - Header with mode switcher
 * - Pipeline visualization
 * - Generic interaction pane
 * - Telemetry stream
 * - Command input
 *
 * Recipes inject their own dashboard, views, and domain-specific components.
 */

import { type ReactNode } from 'react'
import { CoreProvider } from '../state/context'

interface CoreAppProps {
  /** Recipe title displayed in header */
  title?: string
  /** Recipe version */
  version?: string
  /** Main content area (recipe provides this) */
  children?: ReactNode
  /** Custom header component (recipe can override) */
  header?: ReactNode
  /** Custom footer component (recipe can override) */
  footer?: ReactNode
}

/**
 * CoreApp — Minimal autonomaton shell.
 *
 * Usage:
 * ```tsx
 * <CoreApp title="My Recipe" version="1.0.0">
 *   <MyRecipeDashboard />
 * </CoreApp>
 * ```
 *
 * Or wrap with recipe provider:
 * ```tsx
 * <RecipeProvider>
 *   <CoreApp title="My Domain">
 *     <MyDomainDashboard />
 *   </CoreApp>
 * </RecipeProvider>
 * ```
 */
export function CoreApp({
  title = 'Grove Autonomaton',
  version = '1.0.0',
  children,
  header,
  footer,
}: CoreAppProps) {
  return (
    <div className="h-screen bg-grove-bg text-grove-text flex flex-col overflow-hidden">
      {/* Header */}
      {header ?? (
        <header className="border-b border-grove-border px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-mono">{title}</h1>
          <span className="text-xs text-grove-text-dim font-mono">v{version}</span>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {children ?? (
          <div className="flex-1 flex items-center justify-center text-grove-text-dim">
            <div className="text-center">
              <p className="text-lg mb-2">No recipe loaded</p>
              <p className="text-sm">Configure a recipe to see domain-specific content.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      {footer ?? (
        <footer className="border-t border-grove-border px-6 py-2 text-center text-xs text-grove-text-dim font-mono">
          Built on{' '}
          <a
            href="https://github.com/understory-ip/autonomaton_docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-grove-text transition-colors"
          >
            Grove Autonomaton Pattern
          </a>
        </footer>
      )}
    </div>
  )
}

/**
 * CoreAppWithProvider — CoreApp wrapped with core state provider.
 * Use this for standalone core testing (separation test #1).
 */
export function CoreAppWithProvider(props: CoreAppProps) {
  return (
    <CoreProvider>
      <CoreApp {...props} />
    </CoreProvider>
  )
}
