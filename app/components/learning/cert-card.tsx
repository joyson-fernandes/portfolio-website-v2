'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { CertMeta } from '@/data/learning/certs'

interface CertCardProps {
  cert: CertMeta
  index: number
}

export default function CertCard({ cert, index }: CertCardProps) {
  const content = (
    <div
      className={`relative rounded-2xl border bg-card p-6 h-full overflow-hidden transition-colors duration-300 ${
        cert.available
          ? 'border-border hover:border-primary/50 group'
          : 'border-border opacity-50 pointer-events-none'
      }`}
    >
      {cert.available && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <div className="relative z-10">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xs mb-4 ${
            cert.available
              ? 'bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-violet-500/25 text-blue-300'
              : 'bg-secondary border border-border text-muted-foreground'
          }`}
        >
          {cert.shortName}
        </div>
        <h3 className="text-lg font-bold mb-1">{cert.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 min-h-[2.5rem]">{cert.description}</p>
        {cert.available ? (
          <>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground mb-4">
              <span>{cert.questionCount} Questions</span>
              <span>&middot;</span>
              <span>{cert.durationMinutes} Min</span>
              <span>&middot;</span>
              <span>{cert.passThreshold}% Pass</span>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
              Start Simulator <ArrowRight className="w-4 h-4" />
            </div>
          </>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {cert.available ? <Link href={`/learning/${cert.id}`}>{content}</Link> : content}
    </motion.div>
  )
}
