'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import { BlurFade } from '@/components/ui/magic/blur-fade'

interface ServiceStatus {
  name: string
  status: 'up' | 'down' | 'degraded'
  latency: number | null
  category: string
}

interface StatusData {
  overall: 'operational' | 'degraded' | 'down'
  services: ServiceStatus[]
  checkedAt: string
}

const STATUS_CONFIG = {
  up: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'Operational' },
  degraded: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500', label: 'Degraded' },
  down: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500', label: 'Down' },
}

export default function Status() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/status')
      const json = await res.json()
      setData(json)
    } catch {
      // Silently fail — status section is non-critical
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 60000) // Refresh every 60s
    return () => clearInterval(interval)
  }, [])

  // Group by category
  const grouped = (data?.services || []).reduce((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = []
    acc[svc.category].push(svc)
    return acc
  }, {} as Record<string, ServiceStatus[]>)

  const overallConfig = data ? STATUS_CONFIG[data.overall === 'operational' ? 'up' : 'degraded'] : STATUS_CONFIG.up

  return (
    <SectionWrapper id="status">
      <SectionHeading
        label="Live"
        title="Infrastructure Status"
        description="Real-time health of the homelab services powering this site and my projects."
      />

      {/* Overall status banner */}
      <BlurFade delay={0.1}>
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card mb-8">
          <div className="flex items-center gap-3">
            <div className={`relative flex h-3 w-3`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${overallConfig.bg} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${overallConfig.bg}`} />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {loading ? 'Checking services...' : data?.overall === 'operational' ? 'All Systems Operational' : 'Some Services Degraded'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {data?.checkedAt && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Last checked: {new Date(data.checkedAt).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchStatus}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Refresh status"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </BlurFade>

      {/* Service grid grouped by category */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/2 mb-1" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, services]) => (
            <div key={category}>
              <h3 className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-widest mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((svc, i) => {
                  const config = STATUS_CONFIG[svc.status]
                  const Icon = config.icon
                  return (
                    <BlurFade key={svc.name} delay={0.05 + i * 0.05}>
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card transition-all hover:border-primary/20">
                        <div className={`flex-shrink-0 ${config.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground">{svc.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {svc.status === 'up' && svc.latency !== null
                              ? `${config.label} · ${svc.latency}ms`
                              : config.label}
                          </div>
                        </div>
                        {svc.latency !== null && (
                          <div className="flex-shrink-0">
                            <div className={`text-xs font-mono ${
                              svc.latency < 100 ? 'text-emerald-500' : svc.latency < 500 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {svc.latency}ms
                            </div>
                          </div>
                        )}
                      </div>
                    </BlurFade>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
