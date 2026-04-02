'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ShimmerButtonProps {
  children: ReactNode
  className?: string
  shimmerColor?: string
  background?: string
  href?: string
  onClick?: () => void
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = '#3b82f6',
  background = 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  href,
  onClick,
}: ShimmerButtonProps) {
  const Comp = href ? 'a' : 'button'
  return (
    <Comp
      href={href}
      onClick={onClick}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5',
        className
      )}
      style={{ background }}
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          backgroundImage: `linear-gradient(110deg, transparent 25%, ${shimmerColor}44 50%, transparent 75%)`,
          backgroundSize: '200% 100%',
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Comp>
  )
}

export function OutlineButton({
  children,
  className,
  href,
  onClick,
}: {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
}) {
  const Comp = href ? 'a' : 'button'
  return (
    <Comp
      href={href}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </Comp>
  )
}
