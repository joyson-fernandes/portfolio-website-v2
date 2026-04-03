'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Server, ArrowRight, Cpu, Activity, Shield } from 'lucide-react'
import { MovingBorder } from '@/components/ui/aceternity/moving-border'
import { BlurFade } from '@/components/ui/magic/blur-fade'

const HIGHLIGHTS = [
  { icon: Cpu, label: '6-Node K8s Cluster' },
  { icon: Activity, label: 'Live Grafana Monitoring' },
  { icon: Shield, label: 'Vault HA + Kyverno' },
]

export default function HomelabCTA() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1}>
          <Link href="/homelab" className="block group">
            <MovingBorder
              duration={5000}
              className="p-8 md:p-10"
              borderClassName="opacity-60"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left: icon + text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-xs font-medium">
                    <Server className="h-3 w-3" />
                    Bare-Metal Infrastructure
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:gradient-text-violet transition-all">
                    Explore My Homelab
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
                    Interactive architecture diagrams, live Grafana monitoring, real-time service health, CI/CD pipeline visualization, and the architecture decisions behind every tool choice.
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    {HIGHLIGHTS.map((h) => (
                      <div key={h.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <h.icon className="h-3.5 w-3.5 text-violet-400" />
                        {h.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: arrow */}
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                    <ArrowRight className="h-6 w-6 text-violet-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </MovingBorder>
          </Link>
        </BlurFade>
      </div>
    </section>
  )
}
