'use client'

import { useState, useEffect } from 'react'

const SECTIONS = [
  'hero',
  'about',
  'infrastructure',
  'skills',
  'projects',
  'experience',
  'certifications',
]

export function useScrollSpy() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const ai = SECTIONS.indexOf(a.target.id)
            const bi = SECTIONS.indexOf(b.target.id)
            return ai - bi
          })
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return activeSection
}
