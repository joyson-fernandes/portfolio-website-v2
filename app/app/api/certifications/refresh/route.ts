
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication for webhook calls
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CREDLY_WEBHOOK_TOKEN
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Revalidate the certifications cache
    revalidateTag('certifications')
    
    // Also trigger a fresh fetch by calling our main API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}/api/certifications`, {
      next: { revalidate: 0 }
    })

    return NextResponse.json({
      success: true,
      message: 'Certifications cache refreshed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error refreshing certifications:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh certifications',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also support GET for manual testing
export async function GET() {
  return POST(new NextRequest('http://localhost:3000/api/certifications/refresh'))
}
