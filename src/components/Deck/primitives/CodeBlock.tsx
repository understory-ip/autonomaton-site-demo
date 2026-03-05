import type { ReactNode } from 'react'

interface CodeBlockProps {
  label?: string
  children: ReactNode
}

export function CodeBlock({ label, children }: CodeBlockProps) {
  return (
    <div>
      {label && (
        <div className="font-mono text-[10px] text-grove-amber tracking-[0.15em] uppercase mb-2">
          {label}
        </div>
      )}
      <pre className="bg-[#0c0c0c] border border-grove-border border-l-[3px] border-l-grove-amber p-5 font-mono text-[12.5px] leading-[1.7] text-[#C8C0B0] overflow-x-auto">
        {children}
      </pre>
    </div>
  )
}

// Syntax highlighting helpers
export function Kw({ children }: { children: ReactNode }) {
  return <span className="code-kw">{children}</span>
}

export function Val({ children }: { children: ReactNode }) {
  return <span className="code-val">{children}</span>
}

export function Cmt({ children }: { children: ReactNode }) {
  return <span className="code-cmt">{children}</span>
}

export function Str({ children }: { children: ReactNode }) {
  return <span className="code-str">{children}</span>
}
