'use client'

import { motion } from 'framer-motion'
import {
  GitCommit,
  GitBranch,
  Box,
  Cpu,
  Globe,
  Shield,
  ArrowRight,
} from 'lucide-react'
import { BlurFade } from '@/components/ui/magic/blur-fade'

const DEPLOY_STEPS = [
  {
    icon: GitCommit,
    label: 'Source',
    value: 'github.com/joyson-fernandes/portfolio-website-v2',
    detail: 'Next.js + TypeScript + Tailwind',
  },
  {
    icon: GitBranch,
    label: 'CI/CD',
    value: 'GitHub Actions → Self-hosted Runner',
    detail: 'Docker build, Trivy scan, Harbor push',
  },
  {
    icon: Shield,
    label: 'Security',
    value: 'Trivy CVE scan + Harbor registry',
    detail: '0 critical/high vulnerabilities',
  },
  {
    icon: Box,
    label: 'GitOps',
    value: 'ArgoCD auto-sync from k8s/ directory',
    detail: 'Webhook-triggered, instant deploy',
  },
  {
    icon: Cpu,
    label: 'Runtime',
    value: 'Kubernetes v1.31 — 6-node HA cluster',
    detail: 'Cilium CNI, MetalLB LoadBalancer',
  },
  {
    icon: Globe,
    label: 'Delivery',
    value: 'Nginx Proxy Manager → joysonfernandes.com',
    detail: 'SSL termination, reverse proxy',
  },
]

export default function DeployInfo() {
  return (
    <section className="relative border-y border-border bg-card/30 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <BlurFade delay={0.1}>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-mono font-medium tracking-widest uppercase rounded-full border border-border text-muted-foreground">
              Meta
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
              How This Site Is Deployed
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              The page you're reading right now goes through this exact pipeline.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPLOY_STEPS.map((step, i) => (
            <BlurFade key={step.label} delay={0.15 + i * 0.08}>
              <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card/80 transition-all hover:border-primary/20">
                <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                  <step.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
                    {step.label}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-0.5 leading-tight">
                    {step.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {step.detail}
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
