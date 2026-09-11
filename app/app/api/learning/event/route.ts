import { NextRequest, NextResponse } from 'next/server'
import { CERTS } from '@/data/learning/certs'
import { quizAttemptsTotal, quizPassTotal, withMetrics } from '@/lib/metrics'

const VALID_CERT_IDS = new Set(CERTS.map((c) => c.id))

export const POST = withMetrics('/api/learning/event', 'POST', async (request: NextRequest) => {
  const body = await request.json().catch(() => null)
  const certId = body?.certId
  const passed = body?.passed

  // Reject unknown cert ids rather than recording them as a metric label —
  // labels come from user input here, so an arbitrary value would otherwise
  // blow up Prometheus's label cardinality.
  if (typeof certId !== 'string' || !VALID_CERT_IDS.has(certId) || typeof passed !== 'boolean') {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  quizAttemptsTotal.inc({ cert_id: certId })
  if (passed) {
    quizPassTotal.inc({ cert_id: certId })
  }

  return NextResponse.json({ ok: true })
})
