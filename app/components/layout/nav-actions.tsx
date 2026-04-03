'use client'

import { Github, Linkedin, Mail, FileText } from 'lucide-react'
import ThemeToggle from '@/components/shared/theme-toggle'

export const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/joyson-fernandes', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/joysonfernandes/', label: 'LinkedIn' },
  { icon: FileText, href: 'https://medium.com/@joysonfernandes', label: 'Medium' },
  { icon: Mail, href: 'mailto:contact@joysonfernandes.com', label: 'Email' },
]

export default function NavActions() {
  return (
    <div className="hidden md:flex items-center gap-1">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label={link.label}
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
      <div className="w-px h-5 bg-border mx-1" />
      <ThemeToggle />
    </div>
  )
}
