'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '@/components/layout/section-wrapper'

const COMMANDS = [
  {
    prompt: '$ kubectl get nodes',
    output: [
      'NAME          STATUS   ROLES           AGE    VERSION',
      'k8s-cp01      Ready    control-plane   180d   v1.31.2',
      'k8s-cp02      Ready    control-plane   180d   v1.31.2',
      'k8s-cp03      Ready    control-plane   180d   v1.31.2',
      'k8s-w01       Ready    <none>          180d   v1.31.2',
      'k8s-w02       Ready    <none>          180d   v1.31.2',
      'k8s-w03       Ready    <none>          180d   v1.31.2',
    ],
  },
  {
    prompt: '$ argocd app list --output wide | head -5',
    output: [
      'NAME          SYNC    HEALTH   PROJECT   NAMESPACE',
      'portfolio     Synced  Healthy  default   portfolio',
      'linkvolt      Synced  Healthy  default   linkvolt',
      'prometheus    Synced  Healthy  default   monitoring',
      'vault         Synced  Healthy  default   vault',
    ],
  },
  {
    prompt: '$ terraform plan -out=tfplan',
    output: [
      'Refreshing state... [id=i-0a1b2c3d4e5f]',
      '',
      'Plan: 0 to add, 2 to change, 0 to destroy.',
      '',
      'Saved plan to: tfplan',
    ],
  },
  {
    prompt: '$ trivy image portfolio-app:latest --severity HIGH,CRITICAL',
    output: [
      'Total: 0 (HIGH: 0, CRITICAL: 0)',
      '',
      '✓ No vulnerabilities found',
    ],
  },
  {
    prompt: '$ kubectl get pods -n portfolio',
    output: [
      'NAME                            READY   STATUS    RESTARTS   AGE',
      'portfolio-app-667c46656-m7rl6   1/1     Running   0          2h',
    ],
  },
]

export default function Terminal() {
  const [lines, setLines] = useState<{ text: string; type: 'prompt' | 'output' }[]>([])
  const [currentCmd, setCurrentCmd] = useState(0)
  const [typing, setTyping] = useState('')
  const [phase, setPhase] = useState<'typing' | 'output' | 'pause'>('typing')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentCmd >= COMMANDS.length) {
      // Loop back
      const timer = setTimeout(() => {
        setLines([])
        setCurrentCmd(0)
        setPhase('typing')
        setTyping('')
      }, 3000)
      return () => clearTimeout(timer)
    }

    const cmd = COMMANDS[currentCmd]

    if (phase === 'typing') {
      if (typing.length < cmd.prompt.length) {
        const timer = setTimeout(() => {
          setTyping(cmd.prompt.slice(0, typing.length + 1))
        }, 25 + Math.random() * 35)
        return () => clearTimeout(timer)
      } else {
        setPhase('output')
      }
    }

    if (phase === 'output') {
      setLines((prev) => [
        ...prev,
        { text: cmd.prompt, type: 'prompt' },
        ...cmd.output.map((line) => ({ text: line, type: 'output' as const })),
      ])
      setTyping('')
      setPhase('pause')
    }

    if (phase === 'pause') {
      const timer = setTimeout(() => {
        setCurrentCmd((prev) => prev + 1)
        setPhase('typing')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [currentCmd, typing, phase])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines, typing])

  return (
    <SectionWrapper id="terminal">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border overflow-hidden shadow-2xl shadow-black/20"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-card border-b border-border">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-2">
              joyson@k8s-cluster ~ zsh
            </span>
          </div>

          {/* Terminal content */}
          <div
            ref={containerRef}
            className="bg-[#0a0a0a] p-4 font-mono text-sm h-[340px] overflow-y-auto scrollbar-hide"
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className={`leading-relaxed ${
                  line.type === 'prompt'
                    ? 'text-emerald-400'
                    : 'text-zinc-400'
                }`}
              >
                {line.text || '\u00A0'}
              </div>
            ))}
            {/* Currently typing line */}
            {typing && (
              <div className="text-emerald-400 leading-relaxed">
                {typing}
                <span className="animate-pulse-glow">▊</span>
              </div>
            )}
            {!typing && phase === 'typing' && currentCmd < COMMANDS.length && (
              <div className="text-emerald-400 leading-relaxed">
                $<span className="animate-pulse-glow ml-1">▊</span>
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Real commands from my daily workflow
        </p>
      </div>
    </SectionWrapper>
  )
}
