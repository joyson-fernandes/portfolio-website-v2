
import { NextRequest, NextResponse } from 'next/server'
import { cache, CACHE_KEYS } from '@/lib/cache'

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

interface CredlyBadge {
  id: string
  issued_at: string
  expires_at?: string
  state: string
  badge_template: {
    id: string
    name: string
    description: string
    image_url: string
    issuer: {
      entities: {
        entity: {
          name: string
          url?: string
          vanity_url?: string
        }
      }[]
    }
  }
  image_url: string
}

interface CredlyResponse {
  data: CredlyBadge[]
}

interface ProcessedCertification {
  id: string
  name: string
  issuer: string
  issuerUrl: string
  date: string
  expiresAt?: string
  imageUrl: string
  description: string
  badgeUrl: string
  category: string
  level: string
  color: string
}

interface CachedCertificationData {
  certifications: ProcessedCertification[]
  lastUpdated: string
}

function categorizeAndColorize(name: string, issuer: string): { category: string, level: string, color: string } {
  const lowercaseName = name.toLowerCase()
  const lowercaseIssuer = issuer.toLowerCase()
  
  // Determine category
  let category = 'General'
  if (lowercaseName.includes('aws') || lowercaseName.includes('amazon web services')) {
    category = 'Cloud'
  } else if (lowercaseName.includes('azure') || lowercaseIssuer.includes('microsoft')) {
    if (lowercaseName.includes('security')) category = 'Security'
    else if (lowercaseName.includes('365')) category = 'Productivity'
    else category = 'Cloud'
  } else if (lowercaseName.includes('terraform') || lowercaseIssuer.includes('hashicorp')) {
    category = 'Infrastructure'
  } else if (lowercaseName.includes('github') || lowercaseName.includes('git')) {
    category = 'DevOps'
  } else if (lowercaseName.includes('vmware')) {
    category = 'Virtualization'
  } else if (lowercaseName.includes('security')) {
    category = 'Security'
  } else if (lowercaseName.includes('kubernetes') || lowercaseName.includes('docker')) {
    category = 'DevOps'
  }

  // Determine level
  let level = 'Fundamental'
  if (lowercaseName.includes('practitioner')) level = 'Practitioner'
  else if (lowercaseName.includes('associate')) level = 'Associate'
  else if (lowercaseName.includes('professional') || lowercaseName.includes('expert')) level = 'Professional'
  else if (lowercaseName.includes('architect')) level = 'Architect'
  else if (lowercaseName.includes('specialty')) level = 'Specialty'
  else if (lowercaseName.includes('foundation')) level = 'Foundational'

  // Determine color based on issuer
  let color = 'from-gray-500 to-gray-600'
  if (lowercaseIssuer.includes('amazon') || lowercaseIssuer.includes('aws')) {
    color = 'from-orange-500 to-orange-600'
  } else if (lowercaseIssuer.includes('microsoft')) {
    color = 'from-blue-500 to-blue-600'
  } else if (lowercaseIssuer.includes('hashicorp')) {
    color = 'from-purple-500 to-purple-600'
  } else if (lowercaseIssuer.includes('vmware')) {
    color = 'from-green-500 to-green-600'
  } else if (lowercaseIssuer.includes('github')) {
    color = 'from-gray-700 to-gray-900'
  } else if (lowercaseIssuer.includes('google')) {
    color = 'from-blue-400 to-blue-500'
  }

  return { category, level, color }
}

async function fetchCredlyBadges(username: string): Promise<ProcessedCertification[]> {
  try {
    // Using Credly's public API endpoint
    const response = await fetch(`https://www.credly.com/users/${username}/badges.json`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-Bot/1.0)',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch badges: ${response.status}`)
    }

    const data: CredlyResponse = await response.json()
    
    const validBadges = data.data.filter(badge => {
      // Filter out invalid badges that don't have the required structure
      return badge && 
             badge.badge_template &&
             badge.badge_template.name &&
             badge.badge_template.issuer &&
             badge.badge_template.issuer.entities &&
             badge.badge_template.issuer.entities.length > 0 &&
             badge.badge_template.issuer.entities[0].entity &&
             badge.badge_template.issuer.entities[0].entity.name &&
             badge.issued_at &&
             badge.state === 'accepted' // Only show accepted badges
    })

    const processedBadges: ProcessedCertification[] = []

    for (const badge of validBadges) {
      try {
        const issuerEntity = badge.badge_template.issuer.entities[0].entity
        const { category, level, color } = categorizeAndColorize(
          badge.badge_template.name,
          issuerEntity.name
        )

        const processedBadge: ProcessedCertification = {
          id: badge.id,
          name: badge.badge_template.name,
          issuer: issuerEntity.name,
          issuerUrl: issuerEntity.vanity_url || issuerEntity.url || '#',
          date: new Date(badge.issued_at).getFullYear().toString(),
          expiresAt: badge.expires_at ? new Date(badge.expires_at).toISOString() : undefined,
          imageUrl: badge.image_url || badge.badge_template.image_url || '',
          description: badge.badge_template.description || '',
          badgeUrl: `https://www.credly.com/badges/${badge.id}`,
          category,
          level,
          color
        }
        
        processedBadges.push(processedBadge)
      } catch (error) {
        console.warn('Error processing badge:', badge.id, error)
        // Continue to next badge instead of adding null
      }
    }

    return processedBadges
  } catch (error) {
    console.error('Error fetching Credly badges:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username') || 'joyson-fernandes'
    const forceRefresh = searchParams.get('refresh') === 'true'
    
    const cacheKey = CACHE_KEYS.CERTIFICATIONS_USER(username)
    
    // Check cache first (unless force refresh is requested)
    if (!forceRefresh) {
      const cachedData = cache.get<CachedCertificationData>(cacheKey)
      if (cachedData) {
        return NextResponse.json({
          success: true,
          data: cachedData.certifications,
          count: cachedData.certifications.length,
          lastUpdated: cachedData.lastUpdated,
          cached: true
        })
      }
    }
    
    // Fetch fresh data
    const certifications = await fetchCredlyBadges(username)
    const lastUpdated = new Date().toISOString()
    
    // Cache the result for 1 hour
    cache.set(cacheKey, { certifications, lastUpdated }, 60)
    
    return NextResponse.json({
      success: true,
      data: certifications,
      count: certifications.length,
      lastUpdated,
      cached: false
    })
  } catch (error) {
    console.error('API Error:', error)
    
    // Try to return cached data as fallback
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username') || 'joyson-fernandes'
    const cacheKey = CACHE_KEYS.CERTIFICATIONS_USER(username)
    const cachedData = cache.get<CachedCertificationData>(cacheKey)
    
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData.certifications,
        count: cachedData.certifications.length,
        lastUpdated: cachedData.lastUpdated,
        cached: true,
        warning: 'Using cached data due to API error'
      })
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch certifications',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
