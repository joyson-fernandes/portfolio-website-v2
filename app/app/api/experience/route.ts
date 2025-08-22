
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const experienceFilePath = path.join(process.cwd(), 'data', 'experience.json')
    
    // Check if file exists
    try {
      await fs.access(experienceFilePath)
    } catch {
      // File doesn't exist, return default empty data
      const defaultData = {
        lastUpdated: new Date().toISOString(),
        profile: {
          name: "Joyson Fernandes",
          title: "Cloud DevOps Engineer",
          location: "London, UK",
          summary: "Passionate about automation, cloud architecture, and building efficient infrastructure solutions."
        },
        experiences: [],
        stats: {
          yearsExperience: "0",
          usersSupported: "0",
          uptimeAchieved: "0%",
          responseTimeImprovement: "0%"
        }
      }
      return NextResponse.json(defaultData)
    }

    const fileContents = await fs.readFile(experienceFilePath, 'utf8')
    const experienceData = JSON.parse(fileContents)

    return NextResponse.json(experienceData)
  } catch (error) {
    console.error('Error reading experience data:', error)
    return NextResponse.json(
      { error: 'Failed to load experience data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const experienceFilePath = path.join(process.cwd(), 'data', 'experience.json')
    
    // Update the lastUpdated timestamp
    const updatedData = {
      ...body,
      lastUpdated: new Date().toISOString()
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data')
    await fs.mkdir(dataDir, { recursive: true })

    await fs.writeFile(experienceFilePath, JSON.stringify(updatedData, null, 2))

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error('Error updating experience data:', error)
    return NextResponse.json(
      { error: 'Failed to update experience data' },
      { status: 500 }
    )
  }
}
