'use client'

import { useEffect } from 'react'
import { trackGuideView } from '@/lib/track'

export default function GuideViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackGuideView(slug)
  }, [slug])

  return null
}
