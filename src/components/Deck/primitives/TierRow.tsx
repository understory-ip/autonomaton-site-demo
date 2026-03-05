interface TierRowProps {
  tier: 0 | 1 | 2 | 3
  name: string
  description: string
  cost: string
  note: string
  isFirst?: boolean
}

export function TierRow({ tier, name, description, cost, note, isFirst }: TierRowProps) {
  return (
    <div className={`grid grid-cols-[80px_1fr_1fr_1fr] gap-0 border-b border-grove-border py-3.5 items-center ${isFirst ? 'border-t' : ''}`}>
      <div className="font-mono text-[11px] text-grove-amber tracking-[0.1em]">
        TIER {tier}
      </div>
      <div>
        <div className="text-[14px] text-grove-text">{name}</div>
        <div className="text-[12px] text-grove-text-dim">{description}</div>
      </div>
      <div className="font-mono text-[12px] text-grove-green">{cost}</div>
      <div className="text-[13px] text-grove-text-dim">{note}</div>
    </div>
  )
}
