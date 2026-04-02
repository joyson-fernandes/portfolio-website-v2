'use client'

import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import TechBadge from '@/components/shared/tech-badge'
import { BlurFade } from '@/components/ui/magic/blur-fade'
import { useExperience } from '@/hooks/useExperience'

export default function Experience() {
  const { experiences, loading } = useExperience()

  return (
    <SectionWrapper id="experience">
      <SectionHeading
        label="Career"
        title="Professional Experience"
        description="My journey in cloud infrastructure and IT operations."
      />

      {loading ? (
        <div className="space-y-6 max-w-3xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse">
              <div className="h-5 bg-muted rounded w-1/2 mb-2" />
              <div className="h-4 bg-muted rounded w-1/3 mb-4" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          {(experiences || []).map((exp, i) => (
            <BlurFade key={exp.id} delay={0.1 + i * 0.1}>
              <div
                className={`relative flex gap-6 mb-8 md:mb-12 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 top-2 z-10">
                  <div
                    className={`h-[14px] w-[14px] rounded-full border-2 border-background ${
                      exp.current
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                        : 'bg-primary'
                    }`}
                  />
                </div>

                {/* Content card */}
                <div className={`flex-1 ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{exp.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          <span>{exp.company}</span>
                        </div>
                      </div>
                      {exp.current && (
                        <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                      {exp.type && (
                        <span className="px-1.5 py-0.5 rounded border border-border text-[10px]">
                          {exp.type}
                        </span>
                      )}
                    </div>

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {exp.achievements.slice(0, 3).map((a, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech badges */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.slice(0, 6).map((t) => (
                          <TechBadge key={t} name={t} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
