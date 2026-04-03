'use client'

import { motion } from 'framer-motion'
import { Server } from 'lucide-react'
import { Particles } from '@/components/ui/magic/particles'
import { BlurFade } from '@/components/ui/magic/blur-fade'
import AnimatedCounter from '@/components/shared/animated-counter'

const STATS = [
  { value: 6, suffix: '', label: 'K8s Nodes' },
  { value: 22, suffix: '+', label: 'Apps Running' },
  { value: 99, suffix: '%', label: 'Uptime' },
  { value: 3, suffix: '', label: 'Years Running' },
]

export default function HomelabHero() {
  return (
    <section id="homelab-hero" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <Particles className="z-0" quantity={25} color="#8b5cf6" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <BlurFade delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-border bg-card/50 backdrop-blur-sm">
            <Server className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-medium text-muted-foreground">
              Homelab Enthusiast
            </span>
          </div>
        </BlurFade>

        {/* Heading */}
        <BlurFade delay={0.2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 gradient-text-violet">
            My Homelab
          </h1>
        </BlurFade>

        {/* Description */}
        <BlurFade delay={0.3}>
          <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
            <p>
              I run a production-grade Kubernetes cluster in my home — not because I have to, but because I believe the best way to understand infrastructure is to build and operate it yourself. Every tool on this page is something I manage daily.
            </p>
            <p>
              This homelab is my playground for learning, breaking things, and rebuilding them better. From Cilium eBPF networking to Vault HA secrets management, from ArgoCD GitOps to Prometheus observability — it's all running on bare metal, 24/7.
            </p>
          </div>
        </BlurFade>

        {/* Stats */}
        <BlurFade delay={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text-violet">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
