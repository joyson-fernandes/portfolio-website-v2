'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpotlightProps {
  className?: string
  children: React.ReactNode
}

export function Spotlight({ className, children }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    },
    [mouseX, mouseY]
  )

  const background = useMotionTemplate`
    radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.06), transparent 80%)
  `

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn('relative', className)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background }}
      />
      {children}
    </div>
  )
}
