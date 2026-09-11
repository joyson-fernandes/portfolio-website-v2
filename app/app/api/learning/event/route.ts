import { NextRequest, NextResponse } from 'next/server'
import { CERTS } from '@/data/learning/certs'
import { quizAttemptsTotal, quizPassTotal, quizScorePercent, withMetrics } from '@/lib/metrics'

const VALID_CERT_IDS = new Set(CERTS.map((c) => c.id))
const VALID_MODES = new Set(['learning', 'exam'])

export const POST = withMetrics('/api/learning/event', 'POST', async (request: NextRequest) => {
  const body = await request.json().catch(() => null)
  const certId = body?.certId
  const mode = body?.mode
  const passed = body?.passed
  const scorePercent = body?.scorePercent

  // Reject unknown cert ids / modes rather than recording them as a metric
  // label — labels come from user input here, so an arbitrary value would
  // otherwise blow up Prometheus's label cardinality.
  if (
    typeof certId !== 'string' ||
    !VALID_CERT_IDS.has(certId) ||
    typeof mode !== 'string' ||
    !VALID_MODES.has(mode) ||
    typeof passed !== 'boolean' ||
    typeof scorePercent !== 'number' ||
    scorePercent < 0 ||
    scorePercent > 100
  ) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  quizAttemptsTotal.inc({ cert_id: certId, mode })
  quizScorePercent.observe({ cert_id: certId, mode }, scorePercent)
  if (passed) {
    quizPassTotal.inc({ cert_id: certId, mode })
  }

  return NextResponse.json({ ok: true })
})
