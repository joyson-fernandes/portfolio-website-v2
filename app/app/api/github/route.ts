import { NextResponse } from 'next/server'
import { externalApiCallsTotal, withMetrics } from '@/lib/metrics'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface ContributionWeek {
  days: ContributionDay[]
}

export const GET = withMetrics('/api/github', 'GET', async () => {
  try {
    const username = 'joyson-fernandes'

    // Fetch contribution data from GitHub's GraphQL API
    // Using the public contributions page as fallback
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    externalApiCallsTotal.inc({ target: 'jogruber-contributions', status: response.ok ? 'up' : 'down' })

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub data')
    }

    const data = await response.json()

    // Get basic profile info from GitHub REST API
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 },
    })
    externalApiCallsTotal.inc({ target: 'github-api', status: profileRes.ok ? 'up' : 'down' })
    const profile = await profileRes.json()

    return NextResponse.json({
      contributions: data.contributions || [],
      total: data.total?.lastYear || 0,
      profile: {
        repos: profile.public_repos || 0,
        followers: profile.followers || 0,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { contributions: [], total: 0, profile: { repos: 0, followers: 0 } },
      { status: 200 } // Return empty data rather than error
    )
  }
})
