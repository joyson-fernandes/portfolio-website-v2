import { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { getGuides, GUIDE_CATEGORIES } from '@/lib/guides'
import GuideCard from '@/components/guides/guide-card'
import GuideFilters from './filters'

export const metadata: Metadata = {
  title: 'Setup Guides — Homelab',
  description:
    'Step-by-step guides for setting up Kubernetes, ArgoCD, Vault, Prometheus, Cilium, and more on a bare-metal homelab.',
}

export default function GuidesPage() {
  const guides = getGuides()

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-border bg-card/50 text-xs font-medium text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Homelab Documentation
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight gradient-text mb-4">
            Setup Guides
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Step-by-step instructions for setting up the services running on my homelab.
            Replicate my setup or learn how production-grade infrastructure works.
          </p>
        </div>

        {/* Filters + Grid */}
        <GuideFilters guides={guides} categories={GUIDE_CATEGORIES} />
      </div>
    </div>
  )
}
