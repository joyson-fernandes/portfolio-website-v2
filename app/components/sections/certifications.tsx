'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, RefreshCw } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import { BlurFade } from '@/components/ui/magic/blur-fade'
import { CardHoverEffect } from '@/components/ui/aceternity/card-hover-effect'
import { useCertifications } from '@/hooks/useCertifications'

export default function Certifications() {
  const { certifications, loading, lastUpdated, refetch } = useCertifications()
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(certifications.map((c) => c.category))).sort()]
  const filtered =
    activeFilter === 'All'
      ? certifications
      : certifications.filter((c) => c.category === activeFilter)

  return (
    <SectionWrapper id="certifications">
      <SectionHeading
        label="Credentials"
        title="Certifications"
        description="Industry-recognized certifications validating my cloud and DevOps expertise."
      />

      {/* Status + filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                activeFilter === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live status */}
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Live from Credly
            </span>
          )}
          <button
            onClick={refetch}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Refresh certifications"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
              <div className="h-16 w-16 bg-muted rounded-lg mx-auto mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cert, i) => (
            <BlurFade key={cert.id} delay={0.05 + i * 0.05}>
              <CardHoverEffect>
                <a
                  href={cert.badgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 h-full">
                    {/* Badge image */}
                    <div className="relative h-20 w-20 mx-auto mb-3">
                      {cert.imageUrl ? (
                        <Image
                          src={cert.imageUrl}
                          alt={cert.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {cert.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {cert.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-1">{cert.issuer}</p>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                      <span>{cert.date}</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </a>
              </CardHoverEffect>
            </BlurFade>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
