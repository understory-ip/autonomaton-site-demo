import type { ReactNode } from 'react'

interface DeckCardProps {
  num?: string
  title?: string
  children: ReactNode
  accent?: boolean
  className?: string
}

export function DeckCard({ num, title, children, accent = true, className = '' }: DeckCardProps) {
  return (
    <div className={`bg-grove-bg3 border border-grove-border p-7 relative ${className}`}>
      {accent && <div className="card-accent" />}
      {num && (
        <div className="font-mono text-[10px] text-[#8B3D10] tracking-[0.15em] mb-3">
          {num}
        </div>
      )}
      {title && (
        <div className="font-serif text-xl text-grove-text mb-2.5">
          {title}
        </div>
      )}
      <div className="text-[13.5px] leading-relaxed text-grove-text-mid font-light">
        {children}
      </div>
    </div>
  )
}
