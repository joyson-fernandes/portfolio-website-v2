'use client'

// Fire-and-forget client-side metric reporting. `keepalive: true` lets the
// request complete even if the click also navigates/opens a new tab.
function report(url: string, body: Record<string, unknown>) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Metrics reporting is best-effort — never let this affect the UX.
  })
}

export function trackProjectClick(project: string) {
  report('/api/track/project-click', { project })
}

export function trackGuideView(slug: string) {
  report('/api/track/guide-view', { slug })
}
