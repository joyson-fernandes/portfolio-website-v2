import { NextRequest, NextResponse } from 'next/server'
import { projectLinkClicksTotal, withMetrics } from '@/lib/metrics'

// Individual Medium article titles are dynamic (fetched from Medium) and
// would be unbounded as a metric label, so those clicks are lumped under
// 'medium-article' rather than labeled per-article.
const VALID_PROJECTS = new Set([
  'ide-platform',
  'linkvolt',
  'portfolio-v2',
  'medium-article',
  'medium-profile',
])

export const POST = withMetrics('/api/track/project-click', 'POST', async (request: NextRequest) => {
  const body = await request.json().catch(() => null)
  const project = body?.project

  if (typeof project !== 'string' || !VALID_PROJECTS.has(project)) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  projectLinkClicksTotal.inc({ project })

  return NextResponse.json({ ok: true })
})
