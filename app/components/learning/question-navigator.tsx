'use client'

interface QuestionNavigatorProps {
  total: number
  currentIndex: number
  answered: Set<number>
  onJump: (index: number) => void
}

export default function QuestionNavigator({ total, currentIndex, answered, onJump }: QuestionNavigatorProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
        {answered.size} / {total} answered
      </div>
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === currentIndex
          const isAnswered = answered.has(i)
          return (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              className={`h-9 rounded-md text-xs font-mono font-bold border transition-colors ${
                isCurrent
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isAnswered
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500'
                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/40'
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
