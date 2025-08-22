
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const projectsFilePath = path.join(process.cwd(), 'data', 'projects.json')
    
    // Check if file exists
    try {
      await fs.access(projectsFilePath)
    } catch {
      // File doesn't exist, return default empty data
      const defaultData = {
        lastUpdated: new Date().toISOString(),
        mediumUrl: "https://medium.com/@joysonfernandes",
        settings: {
          autoUpdateFromMedium: true,
          maxProjects: 10,
          fallbackToManual: true,
          includeManualProjects: true
        },
        mediumArticles: [],
        manualProjects: [],
        combinedProjects: []
      }
      return NextResponse.json(defaultData)
    }

    const fileContents = await fs.readFile(projectsFilePath, 'utf8')
    const projectData = JSON.parse(fileContents)

    // Combine manual and medium projects based on settings
    const combinedProjects = []
    
    if (projectData.settings.includeManualProjects) {
      combinedProjects.push(...projectData.manualProjects || [])
    }
    
    if (projectData.mediumArticles && projectData.mediumArticles.length > 0) {
      combinedProjects.push(...projectData.mediumArticles)
    }
    
    // Sort by featured status and published date
    combinedProjects.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    })

    // Limit to maxProjects
    const limitedProjects = combinedProjects.slice(0, projectData.settings.maxProjects || 10)
    
    projectData.combinedProjects = limitedProjects

    return NextResponse.json(projectData)
  } catch (error) {
    console.error('Error reading projects data:', error)
    return NextResponse.json(
      { error: 'Failed to load projects data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const projectsFilePath = path.join(process.cwd(), 'data', 'projects.json')
    
    // Update the lastUpdated timestamp
    const updatedData = {
      ...body,
      lastUpdated: new Date().toISOString()
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data')
    await fs.mkdir(dataDir, { recursive: true })

    await fs.writeFile(projectsFilePath, JSON.stringify(updatedData, null, 2))

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error('Error updating projects data:', error)
    return NextResponse.json(
      { error: 'Failed to update projects data' },
      { status: 500 }
    )
  }
}
