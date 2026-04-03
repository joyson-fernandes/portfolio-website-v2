import { NextResponse } from 'next/server'

interface ServiceStatus {
  name: string
  url: string
  status: 'up' | 'down' | 'degraded'
  latency: number | null
  category: string
}

const SERVICES = [
  { name: 'Portfolio', url: 'http://portfolio-app.portfolio.svc.cluster.local', category: 'Applications' },
  { name: 'ArgoCD', url: 'https://argocd-server.argocd.svc.cluster.local', category: 'Platform' },
  { name: 'Harbor Registry', url: 'http://harbor-portal.harbor.svc.cluster.local', category: 'Platform' },
  { name: 'Vault', url: 'http://vault.vault.svc.cluster.local:8200/v1/sys/health', category: 'Security' },
  { name: 'Prometheus', url: 'http://kube-prometheus-kube-prome-prometheus.monitoring.svc.cluster.local:9090/-/healthy', category: 'Observability' },
  { name: 'Grafana', url: 'http://kube-prometheus-grafana.monitoring.svc.cluster.local/api/health', category: 'Observability' },
  { name: 'Loki', url: 'http://loki.monitoring.svc.cluster.local:3100/ready', category: 'Observability' },
]

async function checkService(service: typeof SERVICES[0]): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(service.url, {
      signal: controller.signal,
      // Skip TLS verification for internal services
      ...(service.url.startsWith('https') ? { next: { revalidate: 0 } } : {}),
    })
    clearTimeout(timeout)

    const latency = Date.now() - start
    return {
      name: service.name,
      url: service.url,
      status: response.ok ? 'up' : 'degraded',
      latency,
      category: service.category,
    }
  } catch {
    return {
      name: service.name,
      url: service.url,
      status: 'down',
      latency: null,
      category: service.category,
    }
  }
}

export async function GET() {
  const results = await Promise.all(SERVICES.map(checkService))

  const allUp = results.every((r) => r.status === 'up')
  const anyDown = results.some((r) => r.status === 'down')

  return NextResponse.json({
    overall: anyDown ? 'degraded' : allUp ? 'operational' : 'degraded',
    services: results,
    checkedAt: new Date().toISOString(),
  })
}
