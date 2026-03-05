interface PrincipleRowProps {
  title: string
  description: string
  isFirst?: boolean
}

export function PrincipleRow({ title, description, isFirst }: PrincipleRowProps) {
  return (
    <div className={`grid grid-cols-[200px_1fr] gap-6 py-3.5 border-b border-grove-border items-start ${isFirst ? 'border-t' : ''}`}>
      <div className="font-serif text-[17px] text-grove-text">{title}</div>
      <div className="text-[13px] text-grove-text-mid leading-relaxed">{description}</div>
    </div>
  )
}
