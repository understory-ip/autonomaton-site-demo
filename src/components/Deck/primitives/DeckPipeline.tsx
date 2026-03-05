interface PipelineStageProps {
  num: string
  name: string
  isFirst?: boolean
}

function PipelineStage({ num, name, isFirst }: PipelineStageProps) {
  return (
    <div className={`flex-1 bg-grove-bg3 border border-grove-border py-4 px-3 text-center relative ${isFirst ? 'border-l-2 border-l-grove-amber' : ''}`}>
      <div className="font-mono text-[10px] text-[#8B3D10] mb-1.5">{num}</div>
      <div className="font-mono text-[13px] text-grove-text font-medium">{name}</div>
    </div>
  )
}

function PipelineArrow() {
  return (
    <div className="text-[14px] text-[#8B3D10] px-2 flex-shrink-0">
      →
    </div>
  )
}

export function DeckPipeline() {
  const stages = [
    { num: '01', name: 'TELEMETRY' },
    { num: '02', name: 'RECOGNITION' },
    { num: '03', name: 'COMPILATION' },
    { num: '04', name: 'APPROVAL' },
    { num: '05', name: 'EXECUTION' },
  ]

  return (
    <div className="flex items-center gap-0 w-full my-7">
      {stages.map((stage, i) => (
        <div key={stage.num} className="contents">
          <PipelineStage {...stage} isFirst={i === 0} />
          {i < stages.length - 1 && <PipelineArrow />}
        </div>
      ))}
    </div>
  )
}
