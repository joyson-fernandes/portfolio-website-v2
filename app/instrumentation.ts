export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { registerOTel } = await import('@vercel/otel')

  // Exporter endpoint/protocol come from the standard OTEL_EXPORTER_OTLP_*
  // env vars (set on the Deployment) rather than hardcoded here — no-op
  // if they're unset, so this is safe to ship even before Tempo exists
  // in an environment.
  registerOTel({ serviceName: 'portfolio' })
}
