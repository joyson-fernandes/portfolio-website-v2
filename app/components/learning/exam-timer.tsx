'use client'

interface ExamTimerProps {
  secondsLeft: number
}

export default function ExamTimer({ secondsLeft }: ExamTimerProps) {
  const clamped = Math.max(0, secondsLeft)
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  const isLow = clamped <= 300 // last 5 minutes

  return (
    <div
      className={`font-mono text-sm font-bold px-3 py-1.5 rounded-lg border tabular-nums ${
        isLow
          ? 'border-red-500/50 bg-red-500/10 text-red-500 animate-pulse'
          : 'border-border bg-secondary text-foreground'
      }`}
    >
      ⏱ {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  )
}
