import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Homelab — Joyson Fernandes',
  description:
    'Bare-metal Kubernetes homelab: interactive architecture diagrams, live Grafana monitoring, CI/CD pipeline visualization, service health dashboard, and architecture decision records.',
  openGraph: {
    title: 'Homelab — Joyson Fernandes',
    description:
      'Production-grade 6-node Kubernetes cluster with live monitoring, GitOps, and infrastructure diagrams.',
    type: 'website',
  },
}

export default function HomelabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
