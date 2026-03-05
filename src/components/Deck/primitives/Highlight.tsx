import type { ReactNode } from 'react'

interface HighlightProps {
  children: ReactNode
  className?: string
}

export function Highlight({ children, className = '' }: HighlightProps) {
  return (
    <div className={`bg-[rgba(212,98,26,0.06)] border border-[rgba(212,98,26,0.3)] p-5 ${className}`}>
      <div className="text-[14px] text-grove-text-mid leading-[1.65] [&>strong]:text-grove-text">
        {children}
      </div>
    </div>
  )
}
