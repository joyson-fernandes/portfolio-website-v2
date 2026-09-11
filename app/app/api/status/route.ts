import { NextResponse } from 'next/server'
import { externalApiCallsTotal, withMetrics } from '@/lib/metrics'

interface ServiceStatus {
  name: string
  url: string
  status: 'up' | 'down' | 'degraded'
  latency: number | null
  category: string
}

const SERVICES = [
  { name: 'Portfolio', url: 'http://portfolio-app.portfolio.svc.cluster.local', category: 'Applications' },
  { name: 'ArgoCD', url: 'http://argocd-server.argocd.svc.cluster.local:80', category: 'Platform' },
  { name: 'Harbor Registry', url: 'http://harbor-portal.harbor.svc.cluster.local', category: 'Platform' },
  { name: 'Vault', url: 'http://vault.vault.svc.cluster.local:8200/v1/sys/health?standbyok=true&sealedcode=200&uninitcode=200', category: 'Security' },
  { name: 'Prometheus', url: 'http://kube-prometheus-kube-prome-prometheus.monitoring.svc.cluster.local:9090/-/healthy', category: 'Observability' },
  { name: 'Grafana', url: 'http://kube-prometheus-grafana.monitoring.svc.cluster.local/api/health', category: 'Observability' },
  { name: 'Loki', url: 'http://loki.monitoring.svc.cluster.local:3100/ready', category: 'Observability' },
]

async function checkService(service: typeof SERVICES[0]): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(service.url, {
      signal: controller.signal,
      redirect: 'manual',
      cache: 'no-store',
      headers: { 'User-Agent': 'portfolio-status-check' },
    })
    clearTimeout(timeout)

    const latency = Date.now() - start
    const isUp = response.status < 400
    externalApiCallsTotal.inc({ target: service.name, status: isUp ? 'up' : 'degraded' })
    return {
      name: service.name,
      url: service.url,
      status: isUp ? 'up' : 'degraded',
      latency,
      category: service.category,
    }
  } catch (err) {
    console.error(`Status check failed for ${service.name}:`, err instanceof Error ? err.message : err)
    externalApiCallsTotal.inc({ target: service.name, status: 'down' })
    return {
      name: service.name,
      url: service.url,
      status: 'down',
      latency: null,
      category: service.category,
    }
  }
}

export const dynamic = 'force-dynamic'

export const GET = withMetrics('/api/status', 'GET', async () => {
  const results = await Promise.all(SERVICES.map(checkService))

  const allUp = results.every((r) => r.status === 'up')
  const anyDown = results.some((r) => r.status === 'down')

  return NextResponse.json({
    overall: anyDown ? 'degraded' : allUp ? 'operational' : 'degraded',
    services: results,
    checkedAt: new Date().toISOString(),
  })
})
