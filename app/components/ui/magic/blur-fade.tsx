'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface BlurFadeProps {
  children: ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  className?: string
  inView?: boolean
}

export function BlurFade({
  children,
  delay = 0,
  duration = 0.4,
  yOffset = 6,
  className,
  inView = true,
}: BlurFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: 'blur(6px)' }}
      {...(inView
        ? {
            whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
            viewport: { once: true, margin: '-50px' },
          }
        : { animate: { opacity: 1, y: 0, filter: 'blur(0px)' } })}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
