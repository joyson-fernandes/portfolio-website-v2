'use client'

interface LegendProps {
  categories: Record<string, { color: string; label: string }>
}

export default function Legend({ categories }: LegendProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 px-4">
      {Object.entries(categories).map(([key, { color, label }]) => (
        <div key={key} className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-muted-foreground font-medium">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
