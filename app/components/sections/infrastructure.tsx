'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Maximize2 } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import Legend from '@/components/infrastructure/legend'
import infraData from '@/data/infrastructure.json'

const InfrastructureDiagram = dynamic(
  () => import('@/components/infrastructure/infrastructure-diagram'),
  { ssr: false, loading: () => <DiagramSkeleton /> }
)

function DiagramSkeleton() {
  return (
    <div className="w-full h-[600px] md:h-[700px] rounded-xl border border-border bg-card/50 flex items-center justify-center">
      <div className="text-muted-foreground text-sm animate-pulse">
        Loading infrastructure diagram...
      </div>
    </div>
  )
}

// Mobile-friendly static card view
function MobileInfraView() {
  const grouped = infraData.nodes.reduce(
    (acc, node) => {
      const cat = node.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(node)
      return acc
    },
    {} as Record<string, typeof infraData.nodes>
  )

  return (
    <div className="space-y-4 md:hidden">
      {Object.entries(grouped).map(([category, nodes]) => {
        const catInfo = infraData.categories[category as keyof typeof infraData.categories]
        return (
          <div key={category} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: catInfo?.color }}
              />
              <span className="text-sm font-semibold text-foreground">
                {catInfo?.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="px-3 py-2 rounded-lg border border-border/50 bg-background/50"
                >
                  <div className="text-xs font-medium text-foreground truncate">
                    {node.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {node.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Infrastructure() {
  return (
    <SectionWrapper id="infrastructure">
      <SectionHeading
        label="Infrastructure"
        title="Homelab Architecture"
        description="A production-grade 6-node Kubernetes cluster running 22+ applications with full GitOps, observability, and security."
      />

      {/* Desktop: interactive React Flow diagram */}
      <div className="hidden md:block">
        <InfrastructureDiagram />
        <Legend categories={infraData.categories} />
      </div>

      {/* Mobile: static card view */}
      <MobileInfraView />
    </SectionWrapper>
  )
}
