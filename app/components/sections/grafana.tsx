'use client'

import { BarChart3, Monitor, Wifi } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import { BlurFade } from '@/components/ui/magic/blur-fade'

const GRAFANA_URL = 'https://grafana.joysontech.com'
const DASHBOARD_UID = 'portfolio-public'

const PANELS = [
  {
    title: 'Cluster CPU Usage',
    description: 'Aggregate CPU utilisation across all 6 K8s nodes',
    panelId: 1,
    icon: Monitor,
  },
  {
    title: 'Cluster Memory Usage',
    description: 'Total memory consumption across the cluster',
    panelId: 2,
    icon: BarChart3,
  },
  {
    title: 'Network Traffic',
    description: 'Inbound and outbound traffic across all nodes',
    panelId: 3,
    icon: Wifi,
  },
]

export default function Grafana() {
  return (
    <SectionWrapper id="monitoring">
      <SectionHeading
        label="Observability"
        title="Live Monitoring"
        description="Real-time cluster metrics powered by Prometheus and Grafana — straight from the homelab."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PANELS.map((panel, i) => (
          <BlurFade key={panel.title} delay={0.1 + i * 0.1}>
            <div className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
              <div className="h-52 bg-[#181b1f] relative">
                <iframe
                  src={`${GRAFANA_URL}/d-solo/${DASHBOARD_UID}/portfolio-cluster-overview?panelId=${panel.panelId}&orgId=2&theme=dark&refresh=30s`}
                  className="w-full h-full border-0"
                  title={panel.title}
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <panel.icon className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{panel.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{panel.description}</p>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        <span className="text-xs text-muted-foreground">
          Live data · refreshing every 30s · Prometheus → Grafana
        </span>
      </div>
    </SectionWrapper>
  )
}
