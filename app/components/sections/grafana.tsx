'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, ExternalLink, Monitor } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import { BlurFade } from '@/components/ui/magic/blur-fade'

// Configure these once Grafana is exposed publicly via NPM
// Set NEXT_PUBLIC_GRAFANA_URL in your environment
const GRAFANA_URL = process.env.NEXT_PUBLIC_GRAFANA_URL || ''

const PANELS = [
  {
    title: 'Cluster Node Resources',
    description: 'CPU, memory, and disk usage across all 6 K8s nodes',
    panelId: 1,
    icon: Monitor,
  },
  {
    title: 'Pod Status Overview',
    description: 'Running, pending, and failed pods across namespaces',
    panelId: 2,
    icon: BarChart3,
  },
  {
    title: 'API Server Latency',
    description: 'Kubernetes API server request latency (p99)',
    panelId: 3,
    icon: BarChart3,
  },
]

export default function Grafana() {
  // If Grafana URL is not configured, show a placeholder that still looks good
  if (!GRAFANA_URL) {
    return (
      <SectionWrapper id="monitoring">
        <SectionHeading
          label="Observability"
          title="Live Monitoring"
          description="Real-time cluster metrics powered by Prometheus and Grafana."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PANELS.map((panel, i) => (
            <BlurFade key={panel.title} delay={0.1 + i * 0.1}>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Simulated dark Grafana panel */}
                <div className="h-48 bg-[#181b1f] relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid opacity-10" />
                  {/* Simulated graph lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <polyline
                      points={generateRandomLine(400, 200)}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      opacity="0.4"
                    />
                    <polyline
                      points={generateRandomLine(400, 200)}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      opacity="0.3"
                    />
                  </svg>
                  <div className="relative z-10 text-center">
                    <panel.icon className="h-8 w-8 text-blue-400/50 mx-auto mb-2" />
                    <span className="text-xs text-zinc-500 font-mono">Live panel</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{panel.title}</h3>
                  <p className="text-xs text-muted-foreground">{panel.description}</p>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by Prometheus + Grafana on the homelab cluster
        </p>
      </SectionWrapper>
    )
  }

  // Live Grafana embeds when URL is configured
  return (
    <SectionWrapper id="monitoring">
      <SectionHeading
        label="Observability"
        title="Live Monitoring"
        description="Real-time cluster metrics powered by Prometheus and Grafana."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PANELS.map((panel, i) => (
          <BlurFade key={panel.title} delay={0.1 + i * 0.1}>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <iframe
                src={`${GRAFANA_URL}/d-solo/default?panelId=${panel.panelId}&orgId=1&theme=dark&kiosk`}
                className="w-full h-48 border-0"
                title={panel.title}
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">{panel.title}</h3>
                <p className="text-xs text-muted-foreground">{panel.description}</p>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>

      <div className="text-center mt-6">
        <a
          href={GRAFANA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Open full Grafana dashboard
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </SectionWrapper>
  )
}

// Generate a random polyline for the simulated graph
function generateRandomLine(width: number, height: number): string {
  const points: string[] = []
  let y = height / 2
  for (let x = 0; x <= width; x += 8) {
    y += (Math.random() - 0.5) * 30
    y = Math.max(30, Math.min(height - 30, y))
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}
