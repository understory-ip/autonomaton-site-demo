import type { ReactNode } from 'react'

interface SlideProps {
  active: boolean
  eyebrow?: string
  children: ReactNode
  variant?: 'default' | 'title' | 'last' | 'scroll'
  maxWidth?: string
}

export function Slide({ active, eyebrow, children, variant = 'default', maxWidth = '1100px' }: SlideProps) {
  const variantClasses = {
    default: '',
    title: 'deck-slide-title',
    last: 'deck-slide-last',
    scroll: '',
  }

  return (
    <div className={`deck-slide ${active ? 'active' : ''} ${variantClasses[variant]}`}>
      <div
        className={`deck-content relative z-10 w-full ${variant === 'scroll' ? 'deck-slide-scroll' : ''}`}
        style={{ maxWidth }}
      >
        {eyebrow && (
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-grove-amber mb-5">
            {eyebrow}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// Typography helpers
export function Display({ children }: { children: ReactNode }) {
  return (
    <div className="font-serif italic text-[clamp(48px,6vw,88px)] leading-[1.05] tracking-[-0.02em] text-grove-text mb-6 [&>em]:text-grove-amber [&>em]:not-italic">
      {children}
    </div>
  )
}

export function Headline({ children }: { children: ReactNode }) {
  return (
    <div className="font-serif text-[clamp(32px,4vw,56px)] leading-[1.1] tracking-[-0.01em] text-grove-text mb-5 [&>em]:text-grove-amber [&>em]:not-italic">
      {children}
    </div>
  )
}

export function Subtitle({ children }: { children: ReactNode }) {
  return (
    <div className="font-sans font-light text-[clamp(16px,1.8vw,20px)] leading-[1.55] text-grove-text-mid max-w-[680px]">
      {children}
    </div>
  )
}

export function Lodestar({ children }: { children: ReactNode }) {
  return (
    <div className="font-serif italic text-[22px] text-grove-text-dim border-l-2 border-grove-amber pl-5 mt-8">
      {children}
    </div>
  )
}

export function BodyText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-sans font-light text-[15px] leading-[1.65] text-grove-text-mid ${className}`}>
      {children}
    </p>
  )
}

export function Divider() {
  return <div className="w-12 h-px bg-grove-amber my-6" />
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block font-mono text-[10px] tracking-[0.1em] uppercase text-grove-amber bg-[rgba(212,98,26,0.1)] border border-[rgba(212,98,26,0.3)] px-2 py-0.5 mr-2">
      {children}
    </span>
  )
}
