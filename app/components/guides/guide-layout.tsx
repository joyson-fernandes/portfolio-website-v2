import Link from 'next/link'
import { ArrowLeft, Clock, Signal, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import type { GuideMeta } from '@/lib/guide-types'
import { GUIDE_CATEGORIES } from '@/lib/guide-types'
import TechBadge from '@/components/shared/tech-badge'
import GuideToc from '@/components/guides/guide-toc'

const DIFFICULTY_COLORS = {
  beginner: { text: 'text-emerald-500', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
  intermediate: { text: 'text-yellow-500', border: 'border-yellow-500/20', bg: 'bg-yellow-500/10' },
  advanced: { text: 'text-red-500', border: 'border-red-500/20', bg: 'bg-red-500/10' },
}

interface GuideLayoutProps {
  meta: GuideMeta
  content: string
  children: React.ReactNode
}

export default function GuideLayout({ meta, content, children }: GuideLayoutProps) {
  const category = GUIDE_CATEGORIES.find((c) => c.id === meta.category)
  const difficulty = DIFFICULTY_COLORS[meta.difficulty] || DIFFICULTY_COLORS.intermediate

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/homelab/guides"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        {/* Header */}
        <div className="mb-10">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <span
                className="px-2.5 py-1 text-xs font-medium rounded-full border"
                style={{
                  color: category.color,
                  borderColor: `${category.color}40`,
                  backgroundColor: `${category.color}10`,
                }}
              >
                {category.label}
              </span>
            )}
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${difficulty.text} ${difficulty.border} ${difficulty.bg}`}>
              {meta.difficulty}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {meta.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
            {meta.description}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {meta.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(meta.date), 'MMMM d, yyyy')}
            </span>
            {meta.updated && meta.updated !== meta.date && (
              <span className="text-xs">
                Updated: {format(new Date(meta.updated), 'MMM d, yyyy')}
              </span>
            )}
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-2">
            {meta.services.map((s) => (
              <TechBadge key={s} name={s} />
            ))}
          </div>
        </div>

        {/* Content + TOC */}
        <div className="flex gap-12">
          <article className="flex-1 min-w-0 max-w-3xl">
            {children}
          </article>
          <GuideToc content={content} />
        </div>
      </div>
    </div>
  )
}
