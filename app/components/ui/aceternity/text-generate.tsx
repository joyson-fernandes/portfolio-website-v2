'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextGenerateProps {
  words: string
  className?: string
  delay?: number
}

export function TextGenerate({ words, className, delay = 0 }: TextGenerateProps) {
  const [started, setStarted] = useState(false)
  const wordArray = words.split(' ')

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <span className={cn('inline', className)}>
      {wordArray.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={started ? { opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
