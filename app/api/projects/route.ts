
import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const PROJECTS_FILE = join(process.cwd(), 'data/projects.json')

interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  icon: string
  color: string
  github?: string
  demo?: string
  mediumUrl?: string
  highlights: string[]
  type: 'manual' | 'medium'
  featured: boolean
  publishedDate: string
  categories?: string[]
  content?: string
}

interface ProjectsData {
  lastUpdated: string
  mediumUrl: string
  settings: {
    autoUpdateFromMedium: boolean
    maxProjects: number
    fallbackToManual: boolean
    includeManualProjects: boolean
  }
  mediumArticles: Project[]
  manualProjects: Project[]
  combinedProjects: Project[]
}

export async function GET() {
  try {
    const data = await readFile(PROJECTS_FILE, 'utf8')
    const projectsData = JSON.parse(data)
    
    return NextResponse.json(projectsData)
  } catch (error) {
    console.error('Error reading projects data:', error)
    return NextResponse.json({ error: 'Failed to load projects data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const updatedData: ProjectsData = await request.json()
    
    // Update timestamp
    updatedData.lastUpdated = new Date().toISOString()
    
    // Combine projects for display
    updatedData.combinedProjects = [
      ...updatedData.mediumArticles,
      ...(updatedData.settings.includeManualProjects ? updatedData.manualProjects : [])
    ].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    
    await writeFile(PROJECTS_FILE, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Projects data updated successfully',
      data: updatedData
    })
  } catch (error) {
    console.error('Error updating projects data:', error)
    return NextResponse.json({ error: 'Failed to update projects data' }, { status: 500 })
  }
}
