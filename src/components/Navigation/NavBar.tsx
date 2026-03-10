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
    <nav className="flex items-center gap-1 px-4 py-2 bg-grove-bg2 border-b border-grove-border">
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
    </nav>
  )
}
