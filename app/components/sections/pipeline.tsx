'use client'

import { motion } from 'framer-motion'
import {
  GitCommit,
  Play,
  Box,
  Shield,
  Upload,
  GitBranch,
  Rocket,
  Activity,
  ArrowRight,
} from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'

const STEPS = [
  {
    icon: GitCommit,
    label: 'Push Code',
    detail: 'Developer pushes to main',
    color: '#a1a1aa',
  },
  {
    icon: Play,
    label: 'GitHub Actions',
    detail: 'CI pipeline triggers',
    color: '#f97316',
  },
  {
    icon: Box,
    label: 'Docker Build',
    detail: 'Multi-stage, non-root',
    color: '#3b82f6',
  },
  {
    icon: Shield,
    label: 'Trivy Scan',
    detail: 'CVE & compliance check',
    color: '#8b5cf6',
  },
  {
    icon: Upload,
    label: 'Push to Registry',
    detail: 'Harbor / ECR / ACR',
    color: '#06b6d4',
  },
  {
    icon: GitBranch,
    label: 'ArgoCD Sync',
    detail: 'GitOps detects change',
    color: '#f97316',
  },
  {
    icon: Rocket,
    label: 'K8s Rollout',
    detail: 'Zero-downtime deploy',
    color: '#22c55e',
  },
  {
    icon: Activity,
    label: 'Health Check',
    detail: 'Prometheus confirms',
    color: '#22c55e',
  },
]

export default function Pipeline() {
  return (
    <SectionWrapper id="pipeline" className="overflow-hidden">
      <SectionHeading
        label="Workflow"
        title="How I Deploy"
        description="End-to-end GitOps pipeline — from code push to production with security scanning and zero-downtime rollouts."
      />

      {/* Desktop: horizontal pipeline */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between gap-2">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex-1 relative"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <motion.div
                  className="relative h-14 w-14 rounded-xl border border-border bg-card flex items-center justify-center mb-3 z-10"
                  style={{ boxShadow: `0 0 20px ${step.color}15` }}
                  whileInView={{
                    borderColor: [`${step.color}30`, `${step.color}60`, `${step.color}30`],
                  }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  viewport={{ once: true }}
                >
                  <step.icon className="h-5 w-5" style={{ color: step.color }} />
                </motion.div>

                {/* Label */}
                <div className="text-sm font-semibold text-foreground mb-0.5">
                  {step.label}
                </div>
                <div className="text-[11px] text-muted-foreground leading-tight">
                  {step.detail}
                </div>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <motion.div
                  className="absolute top-7 left-[calc(50%+28px)] right-[calc(-50%+28px)] flex items-center justify-center z-0"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                >
                  <div className="h-px w-full bg-border relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ height: '1px' }}
                      initial={{ width: '0%' }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.15 + 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical pipeline */}
      <div className="md:hidden space-y-1">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <div className="flex items-center gap-4 py-3">
              <div
                className="flex-shrink-0 h-10 w-10 rounded-lg border border-border bg-card flex items-center justify-center"
                style={{ boxShadow: `0 0 15px ${step.color}10` }}
              >
                <step.icon className="h-4 w-4" style={{ color: step.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground">{step.label}</div>
                <div className="text-xs text-muted-foreground">{step.detail}</div>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div className="ml-5 h-4 w-px bg-border" />
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
