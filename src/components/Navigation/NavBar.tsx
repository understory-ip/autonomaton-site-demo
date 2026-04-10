/**
 * NavBar — View Navigation
 *
 * Switch between Dashboard, Briefings, Config, and Flywheel views.
 */

import type { CurrentView } from '../../state/types'

interface NavBarProps {
  currentView: CurrentView
  onViewChange: (view: CurrentView) => void
}

const NAV_ITEMS: Array<{ view: CurrentView; label: string; icon: string }> = [
  { view: 'briefings', label: 'Inbox', icon: '◈' },
  { view: 'dashboard', label: 'Monitor', icon: '◉' },
  { view: 'flywheel', label: 'Flywheel', icon: '⟳' },
  { view: 'config', label: 'Config', icon: '⚙' },
]

export function NavBar({ currentView, onViewChange }: NavBarProps) {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-grove-bg2 border-b border-grove-border">
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ view, label, icon }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`
              px-4 py-2 font-mono text-sm transition-all duration-200
              ${currentView === view
                ? 'text-grove-amber font-medium border-b-2 border-grove-amber'
                : 'text-grove-text-dim hover:text-grove-text hover:bg-grove-bg3 border-b-2 border-transparent'
              }
            `}
          >
            <span className="mr-2">{icon}</span>
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/understory-ip/autonomaton-site-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-grove-text-dim hover:text-grove-amber transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Fork
        </a>
        <a
          href="https://github.com/understory-ip/autonomaton-primitive"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-grove-text-dim hover:text-grove-amber transition-colors"
        >
          Primitive
        </a>
        <a
          href="https://github.com/understory-ip/autonomaton_docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-grove-text-dim hover:text-grove-amber transition-colors"
        >
          Docs
        </a>
      </div>
    </nav>
  )
}
