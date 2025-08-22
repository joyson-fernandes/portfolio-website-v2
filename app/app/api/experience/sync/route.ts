
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// This endpoint can be called by external services to update your experience
export async function POST(request: NextRequest) {
  try {
    // You could add authentication here if needed
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.EXPERIENCE_SYNC_TOKEN
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const experienceFilePath = path.join(process.cwd(), 'data', 'experience.json')
    
    // Validate required fields
    if (!body.experiences || !Array.isArray(body.experiences)) {
      return NextResponse.json(
        { error: 'Invalid experience data format' },
        { status: 400 }
      )
    }

    // Update the lastUpdated timestamp
    const updatedData = {
      lastUpdated: new Date().toISOString(),
      profile: body.profile || {
        name: "Joyson Fernandes",
        title: "Cloud DevOps Engineer",
        location: "London, UK",
        summary: "Passionate about automation, cloud architecture, and building efficient infrastructure solutions."
      },
      experiences: body.experiences,
      stats: body.stats || {
        yearsExperience: "5+",
        usersSupported: "500+",
        uptimeAchieved: "99.5%",
        responseTimeImprovement: "60%"
      }
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data')
    await fs.mkdir(dataDir, { recursive: true })

    await fs.writeFile(experienceFilePath, JSON.stringify(updatedData, null, 2))

    return NextResponse.json({ 
      success: true, 
      message: 'Experience data updated successfully',
      experienceCount: updatedData.experiences.length 
    })
  } catch (error) {
    console.error('Error syncing experience data:', error)
    return NextResponse.json(
      { error: 'Failed to sync experience data' },
      { status: 500 }
    )
  }
}
