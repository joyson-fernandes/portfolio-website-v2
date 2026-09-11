import { NextRequest, NextResponse } from 'next/server'
import { getGuideSlugs } from '@/lib/guides'
import { guideViewsTotal, withMetrics } from '@/lib/metrics'

export const POST = withMetrics('/api/track/guide-view', 'POST', async (request: NextRequest) => {
  const body = await request.json().catch(() => null)
  const slug = body?.slug

  // Guide pages are statically generated, so we can't count views at
  // render time — this endpoint is called client-side on page load
  // instead. Validate against the known slug list before using it as a
  // metric label, since it's client-supplied.
  if (typeof slug !== 'string' || !getGuideSlugs().includes(slug)) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  guideViewsTotal.inc({ slug })

  return NextResponse.json({ ok: true })
})
