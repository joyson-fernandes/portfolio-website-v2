import Link from 'next/link'
import { Clock, Signal, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import type { GuideMeta } from '@/lib/guide-types'
import { GUIDE_CATEGORIES } from '@/lib/guide-types'
import TechBadge from '@/components/shared/tech-badge'

const DIFFICULTY_COLORS = {
  beginner: { text: 'text-emerald-500', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
  intermediate: { text: 'text-yellow-500', border: 'border-yellow-500/20', bg: 'bg-yellow-500/10' },
  advanced: { text: 'text-red-500', border: 'border-red-500/20', bg: 'bg-red-500/10' },
}

export default function GuideCard({ guide }: { guide: GuideMeta }) {
  const category = GUIDE_CATEGORIES.find((c) => c.id === guide.category)
  const difficulty = DIFFICULTY_COLORS[guide.difficulty] || DIFFICULTY_COLORS.intermediate

  return (
    <Link href={`/homelab/guides/${guide.slug}`} className="group block">
      <div className="h-full rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        {/* Category + Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <span
              className="px-2 py-0.5 text-[10px] font-medium rounded-full border"
              style={{
                color: category.color,
                borderColor: `${category.color}40`,
                backgroundColor: `${category.color}10`,
              }}
            >
              {category.label}
            </span>
          )}
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${difficulty.text} ${difficulty.border} ${difficulty.bg}`}>
            {guide.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {guide.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {guide.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {guide.duration}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(guide.date), 'MMM d, yyyy')}
          </span>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5">
          {guide.services.slice(0, 5).map((s) => (
            <TechBadge key={s} name={s} />
          ))}
        </div>
      </div>
    </Link>
  )
}
