'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, GitCompare } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import { BlurFade } from '@/components/ui/magic/blur-fade'
import adrData from '@/data/adrs.json'

interface ADR {
  id: string
  title: string
  status: string
  date: string
  context: string
  decision: string
  consequences: string
  category: string
}

const CATEGORY_COLORS: Record<string, string> = {
  Networking: '#ec4899',
  Security: '#8b5cf6',
  GitOps: '#f97316',
  Storage: '#eab308',
  Development: '#06b6d4',
}

function ADRCard({ adr, index }: { adr: ADR; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const color = CATEGORY_COLORS[adr.category] || '#3b82f6'

  return (
    <BlurFade delay={0.1 + index * 0.08}>
      <div
        className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-5">
          <div
            className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <GitCompare className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-foreground truncate">{adr.title}</h3>
              <span
                className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded-full border"
                style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
              >
                {adr.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span>{adr.status}</span>
              <span>·</span>
              <span>{adr.date}</span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 text-muted-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                <div>
                  <h4 className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Context</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{adr.context}</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Decision</h4>
                  <p className="text-sm text-foreground leading-relaxed">{adr.decision}</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Consequences</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{adr.consequences}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlurFade>
  )
}

export default function ADRs() {
  return (
    <SectionWrapper id="adrs">
      <SectionHeading
        label="Decisions"
        title="Architecture Decision Records"
        description="Why I chose specific tools — the reasoning behind my infrastructure stack."
      />

      <div className="max-w-3xl mx-auto space-y-3">
        {(adrData as ADR[]).map((adr, i) => (
          <ADRCard key={adr.id} adr={adr} index={i} />
        ))}
      </div>
    </SectionWrapper>
  )
}
