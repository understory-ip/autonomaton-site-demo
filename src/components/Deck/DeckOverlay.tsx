/**
 * DeckOverlay — Full-screen pattern deck overlay
 *
 * v0.7.1: SPA overlay (not separate page)
 * - Auto-opens on first visit (localStorage check in reducer)
 * - ESC key dismisses and persists to localStorage
 * - Left-hand navigation for slide selection
 * - Keyboard nav: Arrow keys, Space
 */

import { useCallback, useEffect } from 'react'
import { useAppState, useAppDispatch } from '../../state/context'
import { slideComponents, slideMetadata } from './slides'
import './deck.css'

export function DeckOverlay() {
  const { isDeckOpen, activeSlideIndex } = useAppState()
  const dispatch = useAppDispatch()
  const total = slideComponents.length

  // Close deck and persist to localStorage
  const closeDeck = useCallback(() => {
    localStorage.setItem('grove_hasSeenDeck', 'true')
    dispatch({ type: 'CLOSE_DECK' })
  }, [dispatch])

  // Navigation helpers
  const next = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_SLIDE', index: Math.min(activeSlideIndex + 1, total - 1) })
  }, [dispatch, activeSlideIndex, total])

  const prev = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_SLIDE', index: Math.max(activeSlideIndex - 1, 0) })
  }, [dispatch, activeSlideIndex])

  // Keyboard navigation: ESC, Left, Right, Up, Down, Space
  useEffect(() => {
    if (!isDeckOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDeck()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDeckOpen, closeDeck, next, prev])

  if (!isDeckOpen) return null

  // Render current slide
  const CurrentSlide = slideComponents[activeSlideIndex]

  return (
    <div className="fixed inset-0 z-50 bg-grove-bg flex font-sans text-grove-text overflow-hidden">
      {/* LEFT NAV */}
      <div className="w-64 flex-none border-r border-grove-border bg-grove-bg2 flex flex-col">
        <div className="p-6 font-serif text-2xl text-grove-amber border-b border-grove-border">
          The Pattern
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm">
          {slideMetadata.map((slide: { id: string; title: string }, i: number) => (
            <button
              key={slide.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_SLIDE', index: i })}
              className={`w-full text-left px-3 py-2 border transition-colors ${
                i === activeSlideIndex
                  ? 'text-grove-amber bg-grove-bg border-grove-amber'
                  : 'text-grove-text-dim hover:text-grove-text border-transparent hover:border-grove-border'
              }`}
            >
              {slide.title}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CANVAS */}
      <div className="flex-1 relative flex flex-col bg-grove-bg">
        {/* ESCAPE HATCH */}
        <button
          onClick={closeDeck}
          className="absolute top-6 right-6 px-4 py-2 border border-grove-border hover:border-grove-amber hover:text-grove-amber font-mono text-xs uppercase tracking-wider transition-colors z-10 bg-grove-bg/80 backdrop-blur"
        >
          [ x Enter Sandbox ]
        </button>

        {/* SLIDE CONTENT */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-12">
          <CurrentSlide active={true} />
        </div>

        {/* BOTTOM NAV */}
        <div className="h-16 border-t border-grove-border bg-grove-bg2 flex items-center justify-between px-6 font-mono text-xs">
          <button
            onClick={prev}
            disabled={activeSlideIndex === 0}
            className={`px-4 py-2 transition-colors ${
              activeSlideIndex === 0
                ? 'text-grove-text-dim cursor-not-allowed'
                : 'text-grove-text hover:text-grove-amber'
            }`}
          >
            &larr; Previous
          </button>
          <span className="text-grove-text-dim">
            {activeSlideIndex + 1} / {total}
          </span>
          <button
            onClick={next}
            disabled={activeSlideIndex === total - 1}
            className={`px-4 py-2 transition-colors ${
              activeSlideIndex === total - 1
                ? 'text-grove-text-dim cursor-not-allowed'
                : 'text-grove-text hover:text-grove-amber'
            }`}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
