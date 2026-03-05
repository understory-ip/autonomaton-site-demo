interface StatBoxProps {
  num: string
  label: string
}

export function StatBox({ num, label }: StatBoxProps) {
  return (
    <div className="bg-grove-bg3 border border-grove-border p-6">
      <div className="font-serif italic text-5xl text-grove-amber leading-none mb-2">
        {num}
      </div>
      <div className="text-[13px] text-grove-text-mid leading-[1.5]">
        {label}
      </div>
    </div>
  )
}
