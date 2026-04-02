'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Server } from 'lucide-react'
import { BackgroundBeams } from '@/components/ui/aceternity/background-beams'
import { Spotlight } from '@/components/ui/aceternity/spotlight'
import { TextGenerate } from '@/components/ui/aceternity/text-generate'
import { ShimmerButton, OutlineButton } from '@/components/ui/magic/shimmer-button'
import { Particles } from '@/components/ui/magic/particles'

const ROLES = [
  'Platform Engineer',
  'DevOps Engineer',
  'Kubernetes Security Specialist',
  'Cloud & IaC Architect',
  'AI-Driven Automation',
]

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const role = ROLES[roleIndex]
    const speed = isDeleting ? 30 : 60

    if (!isDeleting && displayed === role) {
      const pause = setTimeout(() => setIsDeleting(true), 2000)
      return () => clearTimeout(pause)
    }

    if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
      return
    }

    const timer = setTimeout(() => {
      setDisplayed(
        isDeleting ? role.slice(0, displayed.length - 1) : role.slice(0, displayed.length + 1)
      )
    }, speed)

    return () => clearTimeout(timer)
  }, [displayed, isDeleting, roleIndex])

  return (
    <Spotlight className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundBeams className="z-0" />
      <Particles className="z-0" quantity={30} color="#3b82f6" />

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-30 z-0" />

      {/* Radial fade */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background z-0" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" id="hero">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-border bg-card/50 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Available for opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <TextGenerate words="Joyson Fernandes" delay={500} className="text-foreground" />
        </motion.h1>

        {/* Typing role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="h-10 mb-6"
        >
          <span className="text-xl md:text-2xl font-mono text-muted-foreground">
            {displayed}
            <span className="animate-pulse-glow text-primary">|</span>
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Platform engineering, Kubernetes security, and AI-driven automation.
          <br className="hidden sm:block" />
          Building secure, scalable infrastructure on AWS, Azure, and bare-metal K8s.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <ShimmerButton href="#infrastructure">
            <Server className="h-4 w-4" />
            View Infrastructure
          </ShimmerButton>
          <OutlineButton href="#about">
            Learn More
          </OutlineButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </Spotlight>
  )
}
