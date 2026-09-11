import type { Sampler, SamplingResult } from '@opentelemetry/sdk-trace-base'

// Prometheus scrapes /api/metrics every 30s — tracing every scrape is pure
// noise (not a real user request) and drowns out the traces worth looking
// at. Everything else is sampled normally.
class IgnoreMetricsScrapesSampler implements Sampler {
  constructor(private readonly delegate: Sampler) {}

  shouldSample(...args: Parameters<Sampler['shouldSample']>): SamplingResult {
    const [, , spanName] = args
    if (spanName.includes('/api/metrics')) {
      return { decision: 0 } // NOT_RECORD
    }
    return this.delegate.shouldSample(...args)
  }

  toString() {
    return `IgnoreMetricsScrapesSampler(${this.delegate.toString()})`
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { registerOTel } = await import('@vercel/otel')
  const { AlwaysOnSampler } = await import('@opentelemetry/sdk-trace-base')

  // Exporter endpoint/protocol come from the standard OTEL_EXPORTER_OTLP_*
  // env vars (set on the Deployment) rather than hardcoded here — no-op
  // if they're unset, so this is safe to ship even before Tempo exists
  // in an environment.
  registerOTel({
    serviceName: 'portfolio',
    traceSampler: new IgnoreMetricsScrapesSampler(new AlwaysOnSampler()),
  })
}
