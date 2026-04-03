'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Cloud,
  GitBranch,
  Shield,
  Activity,
  Server,
  Award,
  Bot,
  Boxes,
  Workflow,
} from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import AnimatedCounter from '@/components/shared/animated-counter'
import { BentoGrid, BentoCard } from '@/components/ui/aceternity/bento-grid'
import { BlurFade } from '@/components/ui/magic/blur-fade'

interface AboutData {
  sectionTitle: string
  subtitle: string
  mainTitle: string
  paragraphs: string[]
  stats: { value: string; label: string }[]
  highlights: { title: string; description: string }[]
}

const HIGHLIGHT_ICONS: Record<string, React.ElementType> = {
  'Kubernetes & Security': Shield,
  'Infrastructure as Code': GitBranch,
  'Platform Engineering': Boxes,
  'CI/CD & GitHub Actions': Workflow,
  'Cloud — AWS & Azure': Cloud,
  'AI & Automation': Bot,
}

const STATS = [
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 11, suffix: '+', label: 'Certifications' },
  { value: 3, suffix: '', label: 'Cloud Platforms' },
  { value: 50, suffix: '+', label: 'Projects Delivered' },
]

const fallbackData: AboutData = {
  sectionTitle: 'About Me',
  subtitle: 'Cloud DevOps Engineer building production-grade infrastructure.',
  mainTitle: 'Transforming Ideas into Infrastructure',
  paragraphs: [
    'As a Cloud DevOps Engineer, I specialize in creating automated cloud solutions that drive operational efficiency. My expertise spans AWS, Azure, Kubernetes, and GitOps workflows.',
    'I run a production-grade homelab — a 6-node Kubernetes cluster with full GitOps, observability, and security. Every tool I showcase here is something I operate daily.',
  ],
  stats: [],
  highlights: [],
}

export default function About() {
  const [data, setData] = useState<AboutData>(fallbackData)

  useEffect(() => {
    fetch('/api/about')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  return (
    <SectionWrapper id="about">
      <SectionHeading
        label="About"
        title={data.mainTitle}
        description={data.subtitle}
      />

      <BentoGrid className="mb-12">
        {/* Bio card — large */}
        <BentoCard colSpan={2} rowSpan={2} className="flex flex-col justify-center">
          <BlurFade delay={0.1}>
            <div className="space-y-4">
              {data.paragraphs.slice(0, 2).map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
              {data.paragraphs[2] && (
                <p className="text-muted-foreground leading-relaxed">
                  {data.paragraphs[2]}
                </p>
              )}
            </div>
          </BlurFade>
        </BentoCard>

        {/* Stat cards */}
        {STATS.map((stat, i) => (
          <BentoCard key={stat.label} className="flex flex-col items-center justify-center text-center">
            <BlurFade delay={0.2 + i * 0.1}>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </BlurFade>
          </BentoCard>
        ))}
      </BentoGrid>

      {/* Highlights grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.highlights.map((h, i) => {
          const Icon = HIGHLIGHT_ICONS[h.title] || Shield
          return (
            <BlurFade key={h.title} delay={0.3 + i * 0.08}>
              <div className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {h.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{h.description}</p>
                </div>
              </div>
            </BlurFade>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
