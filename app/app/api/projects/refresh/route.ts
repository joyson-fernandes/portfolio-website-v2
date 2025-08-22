
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import Parser from 'rss-parser'

export const dynamic = 'force-dynamic'

interface MediumRSSItem {
  title?: string
  link?: string
  pubDate?: string
  creator?: string
  content?: string
  categories?: string[]
  guid?: string
  contentSnippet?: string
  isoDate?: string
  [key: string]: any
}

const rssParser = new Parser({
  customFields: {
    item: ['content:encoded', 'dc:creator']
  }
})

function extractImageFromContent(content: string): string | null {
  // Try to extract the first image from Medium article content
  const imgRegex = /<img[^>]+src="([^">]+)"/i
  const match = content.match(imgRegex)
  return match ? match[1] : null
}

function extractTechnologiesFromContent(content: string, categories: string[] = []): string[] {
  const techKeywords = [
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform',
    'Ansible', 'CI/CD', 'DevOps', 'Python', 'Node.js', 'React', 'Angular', 'Vue',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Nginx', 'Apache', 'Linux', 'Ubuntu',
    'EC2', 'S3', 'Lambda', 'CloudFormation', 'ARM Templates', 'Helm', 'Prometheus',
    'Grafana', 'ELK Stack', 'Istio', 'ArgoCD', 'GitHub Actions', 'GitLab CI',
    'Serverless', 'Microservices', 'API Gateway', 'Load Balancer', 'VPC', 'Subnets'
  ]
  
  const found = new Set<string>()
  
  // Add categories as technologies
  categories.forEach(cat => {
    const cleanCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
    if (techKeywords.some(tech => tech.toLowerCase() === cleanCat.toLowerCase())) {
      found.add(cleanCat)
    }
  })
  
  // Extract from content
  const contentLower = content.toLowerCase()
  techKeywords.forEach(tech => {
    if (contentLower.includes(tech.toLowerCase())) {
      found.add(tech)
    }
  })
  
  return Array.from(found).slice(0, 6) // Limit to 6 technologies
}

function generateProjectDescription(title: string, content: string): string {
  // Clean HTML and get first paragraph or meaningful content
  const cleanContent = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Get first meaningful sentence or paragraph
  const sentences = cleanContent.split(/[.!?]+/)
  let description = sentences[0]?.trim() || title
  
  if (description.length < 100 && sentences[1]) {
    description += '. ' + sentences[1].trim()
  }
  
  // Limit length
  if (description.length > 200) {
    description = description.substring(0, 200) + '...'
  }
  
  return description
}

function generateProjectHighlights(content: string): string[] {
  const highlights = []
  
  // Look for numbered lists or bullet points
  const listRegex = /(?:^|\n)\s*(?:\d+\.|\*|-|\•)\s*([^\n]+)/g
  let match
  
  while ((match = listRegex.exec(content)) !== null && highlights.length < 3) {
    const highlight = match[1].replace(/<[^>]*>/g, '').trim()
    if (highlight.length > 20 && highlight.length < 150) {
      highlights.push(highlight)
    }
  }
  
  // If no highlights found, create generic ones
  if (highlights.length === 0) {
    highlights.push(
      'Implemented cloud-native solutions',
      'Automated deployment processes',
      'Enhanced system reliability and performance'
    )
  }
  
  return highlights
}

function determineProjectIcon(technologies: string[], categories: string[] = []): string {
  const iconMap: { [key: string]: string } = {
    'aws': 'Cloud',
    'azure': 'Cloud', 
    'gcp': 'Cloud',
    'docker': 'Container',
    'kubernetes': 'Container',
    'jenkins': 'Layers',
    'terraform': 'Layers',
    'ci-cd': 'Layers',
    'devops': 'Cpu'
  }
  
  const allTerms = [...technologies, ...categories].map(t => t.toLowerCase())
  
  for (const [term, icon] of Object.entries(iconMap)) {
    if (allTerms.some(t => t.includes(term))) {
      return icon
    }
  }
  
  return 'Cpu' // Default icon
}

function determineProjectColor(technologies: string[], categories: string[] = []): string {
  const colorMap: { [key: string]: string } = {
    'aws': 'from-orange-500 to-orange-600',
    'azure': 'from-blue-500 to-blue-600',
    'gcp': 'from-blue-500 to-green-500',
    'docker': 'from-blue-600 to-cyan-600',
    'kubernetes': 'from-blue-500 to-purple-600',
    'jenkins': 'from-blue-500 to-blue-600',
    'terraform': 'from-purple-500 to-purple-600'
  }
  
  const allTerms = [...technologies, ...categories].map(t => t.toLowerCase())
  
  for (const [term, color] of Object.entries(colorMap)) {
    if (allTerms.some(t => t.includes(term))) {
      return color
    }
  }
  
  return 'from-gray-500 to-gray-600' // Default color
}

export async function POST(request: NextRequest) {
  try {
    const projectsFilePath = path.join(process.cwd(), 'data', 'projects.json')
    
    // Read current projects data
    let currentData
    try {
      const fileContents = await fs.readFile(projectsFilePath, 'utf8')
      currentData = JSON.parse(fileContents)
    } catch {
      // File doesn't exist, create default structure
      currentData = {
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
    }

    // Fetch and parse Medium RSS feed
    const mediumRSSUrl = currentData.mediumUrl + '/feed'
    
    try {
      const feed = await rssParser.parseURL(mediumRSSUrl)
      const mediumProjects = []

      for (const item of feed.items as MediumRSSItem[]) {
        if (!item.title || !item.link) continue

        const content = item['content:encoded'] || item.content || ''
        const categories = item.categories || []
        const technologies = extractTechnologiesFromContent(content, categories)
        const image = extractImageFromContent(content)
        const description = generateProjectDescription(item.title, content)
        const highlights = generateProjectHighlights(content)
        const icon = determineProjectIcon(technologies, categories)
        const color = determineProjectColor(technologies, categories)

        const project = {
          id: `medium-${item.guid?.split('/').pop() || Date.now()}`,
          title: item.title,
          description,
          image: image || 'https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Project_%282019%E2%80%93present%29.svg',
          technologies,
          icon,
          color,
          mediumUrl: item.link,
          highlights,
          type: 'medium' as const,
          featured: false,
          publishedDate: item.isoDate || item.pubDate || new Date().toISOString(),
          categories,
          content: content.substring(0, 1000) // Store snippet for search
        }

        mediumProjects.push(project)
      }

      // Update the data
      const updatedData = {
        ...currentData,
        lastUpdated: new Date().toISOString(),
        mediumArticles: mediumProjects
      }

      // Ensure data directory exists
      const dataDir = path.join(process.cwd(), 'data')
      await fs.mkdir(dataDir, { recursive: true })

      await fs.writeFile(projectsFilePath, JSON.stringify(updatedData, null, 2))

      return NextResponse.json({ 
        success: true, 
        message: 'Projects refreshed from Medium successfully',
        mediumProjectsCount: mediumProjects.length,
        data: updatedData
      })

    } catch (rssError) {
      console.error('Error fetching Medium RSS:', rssError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch Medium RSS feed',
        fallbackUsed: currentData.settings.fallbackToManual
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error refreshing projects from Medium:', error)
    return NextResponse.json(
      { error: 'Failed to refresh projects from Medium' },
      { status: 500 }
    )
  }
}
