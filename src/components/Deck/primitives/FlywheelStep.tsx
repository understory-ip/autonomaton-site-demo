interface FlywheelStepProps {
  num: number
  title: string
  description: string
}

export function FlywheelStep({ num, title, description }: FlywheelStepProps) {
  return (
    <div className="bg-grove-bg3 border border-grove-border p-4 flex gap-3 items-start">
      <div className="font-mono text-[22px] text-grove-amber leading-none opacity-50 flex-shrink-0">
        {num}
      </div>
      <div>
        <div className="text-[13px] font-medium text-grove-text mb-1">{title}</div>
        <div className="text-[12px] text-grove-text-dim leading-[1.5]">{description}</div>
      </div>
    </div>
  )
}
