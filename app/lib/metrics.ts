import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client'

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
      labelNames: ['cert_id'],
      registers: [registry],
    }),
)

export const quizPassTotal = metricOrExisting(
  'portfolio_quiz_pass_total',
  () =>
    new Counter({
      name: 'portfolio_quiz_pass_total',
      help: 'Total Learning Hub quiz attempts that passed',
      labelNames: ['cert_id'],
      registers: [registry],
    }),
)

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
