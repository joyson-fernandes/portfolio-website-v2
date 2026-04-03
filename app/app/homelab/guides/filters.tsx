'use client'

import { useState } from 'react'
import type { GuideMeta } from '@/lib/guide-types'
import GuideCard from '@/components/guides/guide-card'

interface GuideFiltersProps {
  guides: GuideMeta[]
  categories: { id: string; label: string; color: string }[]
}

export default function GuideFilters({ guides, categories }: GuideFiltersProps) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? guides
    : guides.filter((g) => g.category === activeFilter)

  const usedCategories = categories.filter((c) =>
    guides.some((g) => g.category === c.id)
  )

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
            activeFilter === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
          }`}
        >
          All ({guides.length})
        </button>
        {usedCategories.map((cat) => {
          const count = guides.filter((g) => g.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                activeFilter === cat.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {cat.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Guide grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          No guides in this category yet. Check back soon!
        </div>
      )}
    </>
  )
}
