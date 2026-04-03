'use client'

import { useState, useEffect } from 'react'

export const MAIN_SECTIONS = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'certifications',
  'github',
]

export const HOMELAB_SECTIONS = [
  'homelab-hero',
  'infrastructure',
  'pipeline',
  'monitoring',
  'status',
  'adrs',
  'deploy-info',
]

export function useScrollSpy(sections: string[]) {
  const [activeSection, setActiveSection] = useState(sections[0] || '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const ai = sections.indexOf(a.target.id)
            const bi = sections.indexOf(b.target.id)
            return ai - bi
          })
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  return activeSection
}
