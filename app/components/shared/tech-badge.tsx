interface TechBadgeProps {
  name: string
  className?: string
}

export default function TechBadge({ name, className = '' }: TechBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-mono font-medium rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground hover:border-primary/50 ${className}`}
    >
      {name}
    </span>
  )
}
