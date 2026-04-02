'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink, RefreshCw, Award } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import { BlurFade } from '@/components/ui/magic/blur-fade'
import { CardHoverEffect } from '@/components/ui/aceternity/card-hover-effect'
import { useCertifications } from '@/hooks/useCertifications'

const KUBESTRONAUT_CERTS = [
  { name: 'CKA', full: 'Certified Kubernetes Administrator' },
  { name: 'CKAD', full: 'Certified Kubernetes Application Developer' },
  { name: 'CKS', full: 'Certified Kubernetes Security Specialist' },
  { name: 'KCNA', full: 'Kubernetes and Cloud Native Associate' },
  { name: 'KCSA', full: 'Kubernetes and Cloud Native Security Associate' },
]

const CERT_GROUPS = [
  { authority: 'AWS', color: '#f97316' },
  { authority: 'Azure', color: '#3b82f6' },
  { authority: 'HashiCorp', color: '#8b5cf6' },
  { authority: 'Other', color: '#6b7280' },
]

function categorizeIssuer(issuer: string): string {
  const lower = issuer.toLowerCase()
  if (lower.includes('amazon') || lower.includes('aws')) return 'AWS'
  if (lower.includes('microsoft') || lower.includes('azure')) return 'Azure'
  if (lower.includes('hashicorp')) return 'HashiCorp'
  return 'Other'
}

export default function Certifications() {
  const { certifications, loading, lastUpdated, refetch } = useCertifications()
  const [activeFilter, setActiveFilter] = useState('All')

  // Group certs by authority
  const grouped = certifications.reduce((acc, cert) => {
    const group = categorizeIssuer(cert.issuer)
    if (!acc[group]) acc[group] = []
    acc[group].push(cert)
    return acc
  }, {} as Record<string, typeof certifications>)

  const categories = ['All', ...CERT_GROUPS.map(g => g.authority).filter(a => grouped[a]?.length)]
  const filtered = activeFilter === 'All'
    ? certifications
    : certifications.filter(c => categorizeIssuer(c.issuer) === activeFilter)

  return (
    <SectionWrapper id="certifications">
      <SectionHeading
        label="Credentials"
        title="Certifications"
        description="Industry-recognized certifications validating my cloud and DevOps expertise."
      />

      {/* Kubestronaut Hero Card */}
      <BlurFade delay={0.1}>
        <motion.div
          className="relative mb-12 rounded-2xl border border-border bg-card overflow-hidden"
          whileHover={{ borderColor: 'rgba(139, 92, 246, 0.4)' }}
        >
          {/* Gradient background accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-cyan-500/5" />

          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left: Kubestronaut badge */}
              <div className="flex-shrink-0 text-center">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-3 mx-auto">
                  <Award className="h-10 w-10 md:h-12 md:w-12 text-violet-400" />
                </div>
                <div className="text-lg md:text-xl font-bold gradient-text-violet">
                  Kubestronaut
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  CNCF Certified
                </div>
              </div>

              {/* Right: 5 cert badges */}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-4 text-center md:text-left">
                  One of ~2,000 engineers worldwide to hold all five CNCF Kubernetes certifications.
                </p>
                <div className="grid grid-cols-5 gap-3">
                  {KUBESTRONAUT_CERTS.map((cert, i) => (
                    <motion.div
                      key={cert.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                      className="group relative"
                    >
                      <div className="flex flex-col items-center p-3 rounded-xl border border-border bg-background/50 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5 transition-all">
                        <div className="text-lg md:text-xl font-bold text-violet-400 mb-1">
                          {cert.name}
                        </div>
                        <div className="text-[9px] md:text-[10px] text-muted-foreground text-center leading-tight hidden sm:block">
                          {cert.full}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </BlurFade>

      {/* Filter + status bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const groupInfo = CERT_GROUPS.find(g => g.authority === cat)
            return (
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
                {cat !== 'All' && grouped[cat] && (
                  <span className="ml-1 opacity-60">({grouped[cat].length})</span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
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

      {/* Cert grid */}
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
          {filtered.map((cert, i) => {
            const group = categorizeIssuer(cert.issuer)
            const groupColor = CERT_GROUPS.find(g => g.authority === group)?.color || '#6b7280'
            return (
              <BlurFade key={cert.id} delay={0.05 + i * 0.04}>
                <CardHoverEffect>
                  <a
                    href={cert.badgeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 h-full">
                      {/* Authority tag */}
                      <div className="flex justify-center mb-3">
                        <span
                          className="px-2 py-0.5 text-[10px] font-medium rounded-full border"
                          style={{
                            color: groupColor,
                            borderColor: `${groupColor}40`,
                            backgroundColor: `${groupColor}10`,
                          }}
                        >
                          {group}
                        </span>
                      </div>

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
            )
          })}
        </div>
      )}
    </SectionWrapper>
  )
}
