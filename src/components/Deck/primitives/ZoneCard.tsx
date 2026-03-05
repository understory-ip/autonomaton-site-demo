interface ZoneCardProps {
  zone: 'green' | 'yellow' | 'red'
  label: string
  meaning: string
  description: string
}

const zoneColors = {
  green: {
    border: 'border-t-grove-green',
    label: 'text-grove-green',
  },
  yellow: {
    border: 'border-t-grove-yellow',
    label: 'text-grove-yellow',
  },
  red: {
    border: 'border-t-grove-red',
    label: 'text-grove-red',
  },
}

export function ZoneCard({ zone, label, meaning, description }: ZoneCardProps) {
  const colors = zoneColors[zone]

  return (
    <div className={`border border-grove-border border-t-[3px] ${colors.border} p-6`}>
      <div className={`font-mono text-[11px] tracking-[0.2em] uppercase mb-2.5 ${colors.label}`}>
        {label}
      </div>
      <div className="font-serif text-[17px] text-grove-text mb-2">
        {meaning}
      </div>
      <div className="text-[13px] text-grove-text-mid leading-[1.55]">
        {description}
      </div>
    </div>
  )
}
