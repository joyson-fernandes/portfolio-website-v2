'use client'

import { cn } from '@/lib/utils'
import { ReactNode, useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion'

interface MovingBorderProps {
  children: ReactNode
  duration?: number
  className?: string
  containerClassName?: string
  borderClassName?: string
}

export function MovingBorder({
  children,
  duration = 4000,
  className,
  containerClassName,
  borderClassName,
}: MovingBorderProps) {
  const pathRef = useRef<SVGRectElement>(null)
  const progress = useMotionValue(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength()
    if (length) {
      const pxPerMs = length / duration
      progress.set((time * pxPerMs) % length)
    }
  })

  const x = useTransform(progress, (val) => {
    return pathRef.current?.getPointAtLength(val)?.x ?? 0
  })
  const y = useTransform(progress, (val) => {
    return pathRef.current?.getPointAtLength(val)?.y ?? 0
  })
  const maskImage = useMotionTemplate`radial-gradient(100px 100px at ${x}px ${y}px, white, transparent 80%)`

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden p-[1px]',
        containerClassName
      )}
    >
      <div className="absolute inset-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute h-full w-full"
          viewBox="0 0 100 100"
        >
          <rect
            ref={pathRef as any}
            x="0"
            y="0"
            width="100"
            height="100"
            rx="8"
            fill="none"
            className="invisible"
          />
        </svg>
      </div>
      <motion.div
        className={cn(
          'absolute inset-0 rounded-xl',
          borderClassName
        )}
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        }}
      />
      <div className={cn('relative rounded-xl bg-card', className)}>
        {children}
      </div>
    </div>
  )
}
