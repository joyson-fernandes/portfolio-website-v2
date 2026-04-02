'use client'

import { Github, Linkedin, Mail, FileText, ArrowUp } from 'lucide-react'

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/joyson-fernandes', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/joysonfernandes/', label: 'LinkedIn' },
  { icon: FileText, href: 'https://medium.com/@joysonfernandes', label: 'Medium' },
  { icon: Mail, href: 'mailto:contact@joysonfernandes.com', label: 'Email' },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center">
          {/* Name */}
          <h3 className="text-lg font-bold gradient-text mb-1">
            Joyson Fernandes
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Platform & DevOps Engineer
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3 mb-8">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                aria-label={link.label}
              >
                <link.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Deployed on homelab */}
          <div className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-border bg-card/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Deployed on my homelab K8s cluster
            </span>
          </div>

          {/* Copyright + scroll to top */}
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Joyson Fernandes
            </p>
            <button
              onClick={scrollToTop}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
