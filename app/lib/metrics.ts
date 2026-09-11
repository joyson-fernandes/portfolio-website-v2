import { Registry, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client'

// Module-level singleton: Next.js can re-import this module across route
// handlers within the same server process, but we need one shared registry
// for counters to actually accumulate rather than reset per import.
const globalForMetrics = globalThis as unknown as { __promRegistry?: Registry }

export const registry = globalForMetrics.__promRegistry ?? new Registry()

if (!globalForMetrics.__promRegistry) {
  collectDefaultMetrics({ register: registry })
  globalForMetrics.__promRegistry = registry
}

function metricOrExisting<T>(name: string, create: () => T): T {
  const existing = registry.getSingleMetric(name)
  return (existing as T) ?? create()
}

export const httpRequestsTotal = metricOrExisting(
  'portfolio_http_requests_total',
  () =>
    new Counter({
      name: 'portfolio_http_requests_total',
      help: 'Total HTTP requests handled by the app',
      labelNames: ['route', 'method', 'status'],
      registers: [registry],
    }),
)

export const httpRequestDuration = metricOrExisting(
  'portfolio_http_request_duration_seconds',
  () =>
    new Histogram({
      name: 'portfolio_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['route', 'method'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
      registers: [registry],
    }),
)

export const externalApiCallsTotal = metricOrExisting(
  'portfolio_external_api_calls_total',
  () =>
    new Counter({
      name: 'portfolio_external_api_calls_total',
      help: 'Total outbound calls this app makes to external/internal services',
      labelNames: ['target', 'status'],
      registers: [registry],
    }),
)

export const quizAttemptsTotal = metricOrExisting(
  'portfolio_quiz_attempts_total',
  () =>
    new Counter({
      name: 'portfolio_quiz_attempts_total',
      help: 'Total Learning Hub quiz attempts completed',
      labelNames: ['cert_id', 'mode'],
      registers: [registry],
    }),
)

export const quizPassTotal = metricOrExisting(
  'portfolio_quiz_pass_total',
  () =>
    new Counter({
      name: 'portfolio_quiz_pass_total',
      help: 'Total Learning Hub quiz attempts that passed',
      labelNames: ['cert_id', 'mode'],
      registers: [registry],
    }),
)

export const quizScorePercent = metricOrExisting(
  'portfolio_quiz_score_percent',
  () =>
    new Histogram({
      name: 'portfolio_quiz_score_percent',
      help: 'Distribution of Learning Hub quiz scores (0-100)',
      labelNames: ['cert_id', 'mode'],
      buckets: [10, 20, 30, 40, 50, 60, 70, 75, 80, 90, 100],
      registers: [registry],
    }),
)

export const projectLinkClicksTotal = metricOrExisting(
  'portfolio_project_link_clicks_total',
  () =>
    new Counter({
      name: 'portfolio_project_link_clicks_total',
      help: 'Total clicks on outbound project/article links',
      labelNames: ['project'],
      registers: [registry],
    }),
)

export const guideViewsTotal = metricOrExisting(
  'portfolio_guide_views_total',
  () =>
    new Counter({
      name: 'portfolio_guide_views_total',
      help: 'Total views of homelab setup guides',
      labelNames: ['slug'],
      registers: [registry],
    }),
)

export const cacheHitsTotal = metricOrExisting(
  'portfolio_cache_hits_total',
  () =>
    new Counter({
      name: 'portfolio_cache_hits_total',
      help: 'Total in-memory cache hits',
      labelNames: ['key'],
      registers: [registry],
    }),
)

export const cacheMissesTotal = metricOrExisting(
  'portfolio_cache_misses_total',
  () =>
    new Counter({
      name: 'portfolio_cache_misses_total',
      help: 'Total in-memory cache misses',
      labelNames: ['key'],
      registers: [registry],
    }),
)

// Always 1 — the value carries no meaning, the labels do. Standard
// Prometheus pattern for "which version is actually running right now".
metricOrExisting(
  'portfolio_build_info',
  () =>
    new Gauge({
      name: 'portfolio_build_info',
      help: 'Build metadata for the running instance (value is always 1)',
      labelNames: ['git_sha'],
      registers: [registry],
    }),
).set({ git_sha: process.env.GIT_SHA || 'unknown' }, 1)

metricOrExisting(
  'portfolio_deploy_timestamp_seconds',
  () =>
    new Gauge({
      name: 'portfolio_deploy_timestamp_seconds',
      help: 'Unix timestamp when this process started (proxy for last deploy time)',
      registers: [registry],
    }),
).set(Date.now() / 1000)

/**
 * Wraps a route handler to record portfolio_http_requests_total and
 * portfolio_http_request_duration_seconds. Applied per-route (rather than
 * via middleware) because Next.js middleware runs before the handler and
 * can't observe the final response status.
 */
export function withMetrics<Args extends unknown[]>(
  route: string,
  method: string,
  handler: (...args: Args) => Promise<Response>,
) {
  return async function wrapped(...args: Args): Promise<Response> {
    const stop = httpRequestDuration.startTimer({ route, method })
    try {
      const response = await handler(...args)
      stop()
      httpRequestsTotal.inc({ route, method, status: String(response.status) })
      return response
    } catch (err) {
      stop()
      httpRequestsTotal.inc({ route, method, status: '500' })
      throw err
    }
  }
}
