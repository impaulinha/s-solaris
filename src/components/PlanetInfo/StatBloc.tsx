interface StatBlockProps {
  label: string
  value: string
}

export function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-surface-700 pt-4">
      <span className="font-mono text-[10px] tracking-[0.25em] text-star-400 uppercase">
        {label}
      </span>
      <span className="font-mono text-xs text-star-200 leading-relaxed">
        {value}
      </span>
    </div>
  )
}
