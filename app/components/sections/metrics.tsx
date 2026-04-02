'use client'

import { motion } from 'framer-motion'
import AnimatedCounter from '@/components/shared/animated-counter'

const METRICS = [
  { value: 70, suffix: '%', label: 'Faster Provisioning', description: 'via Terraform IaC' },
  { value: 32, suffix: '%', label: 'Cloud Cost Reduction', description: 'RI + right-sizing' },
  { value: 50, suffix: '%', label: 'Faster Deployments', description: 'CI/CD automation' },
  { value: 22, suffix: '', label: 'ArgoCD Apps', description: 'all synced & healthy' },
  { value: 0, suffix: '', label: 'Critical CIS Findings', description: 'kube-bench verified' },
]

export default function Metrics() {
  return (
    <section className="relative border-y border-border bg-card/30 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4"
        >
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              <div className="text-sm font-medium text-foreground mb-0.5">
                {metric.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
