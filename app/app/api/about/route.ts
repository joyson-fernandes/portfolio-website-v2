
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ABOUT_DATA_FILE = path.join(process.cwd(), 'data', 'about.json')

// Default about content
const defaultAboutData = {
  sectionTitle: "About Me",
  subtitle: "A dedicated Cloud DevOps Engineer with a passion for building robust, scalable infrastructure solutions and automating complex workflows.",
  mainTitle: "Transforming Ideas into Infrastructure",
  paragraphs: [
    "As a Cloud DevOps Engineer and Infrastructure Support Analyst, I specialize in creating seamless, automated cloud solutions that drive business growth and operational efficiency. My journey spans multiple cloud platforms, with deep expertise in AWS and Azure ecosystems.",
    "I graduated from the comprehensive 40-week Level Up In Tech program, where I mastered modern cloud technologies and DevOps practices. Currently, I balance my role as Infrastructure Support Analyst at Airinmar with part-time Cloud DevOps engineering at Level Up In Tech, continuously expanding my expertise.",
    "My approach combines technical excellence with collaborative problem-solving, focusing on Infrastructure as Code, containerization, and continuous integration/deployment pipelines. I'm passionate about automation, cloud architecture, and staying at the forefront of emerging technologies."
  ],
  stats: [
    { value: "5+", label: "Years Experience" },
    { value: "11+", label: "Certifications" },
    { value: "3", label: "Cloud Platforms" },
    { value: "50+", label: "Projects Delivered" }
  ],
  highlights: [
    {
      title: "Cloud Architecture",
      description: "Expert in AWS, Azure, and GCP cloud platforms with focus on scalable solutions."
    },
    {
      title: "Infrastructure as Code",
      description: "Proficient in Terraform, CloudFormation, and Ansible for automation."
    },
    {
      title: "DevOps Excellence",
      description: "CI/CD pipelines, containerization, and modern deployment strategies."
    },
    {
      title: "Team Collaboration",
      description: "Strong communication skills and experience in cross-functional teams."
    },
    {
      title: "11+ Certifications",
      description: "AWS, Azure, HashiCorp, and Microsoft certified professional."
    },
    {
      title: "Problem Solver",
      description: "Passionate about solving complex infrastructure challenges efficiently."
    }
  ]
}

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(ABOUT_DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// GET - Fetch about content
export async function GET() {
  try {
    ensureDataDirectory()
    
    if (!fs.existsSync(ABOUT_DATA_FILE)) {
      // Create default file if it doesn't exist
      fs.writeFileSync(ABOUT_DATA_FILE, JSON.stringify(defaultAboutData, null, 2))
    }
    
    const data = fs.readFileSync(ABOUT_DATA_FILE, 'utf8')
    const aboutData = JSON.parse(data)
    
    return NextResponse.json(aboutData)
  } catch (error) {
    console.error('Error fetching about data:', error)
    return NextResponse.json(defaultAboutData)
  }
}

// POST - Update about content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.sectionTitle || !body.subtitle || !body.mainTitle || !body.paragraphs) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Ensure paragraphs is an array
    if (!Array.isArray(body.paragraphs)) {
      return NextResponse.json(
        { error: 'Paragraphs must be an array' },
        { status: 400 }
      )
    }
    
    // Ensure stats is an array with proper structure
    if (body.stats && !Array.isArray(body.stats)) {
      return NextResponse.json(
        { error: 'Stats must be an array' },
        { status: 400 }
      )
    }
    
    // Ensure highlights is an array with proper structure
    if (body.highlights && !Array.isArray(body.highlights)) {
      return NextResponse.json(
        { error: 'Highlights must be an array' },
        { status: 400 }
      )
    }
    
    ensureDataDirectory()
    
    // Create the updated data object
    const updatedData = {
      sectionTitle: body.sectionTitle.trim(),
      subtitle: body.subtitle.trim(),
      mainTitle: body.mainTitle.trim(),
      paragraphs: body.paragraphs.map((p: string) => p.trim()).filter((p: string) => p.length > 0),
      stats: body.stats || defaultAboutData.stats,
      highlights: body.highlights || defaultAboutData.highlights
    }
    
    // Write to file
    fs.writeFileSync(ABOUT_DATA_FILE, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'About content updated successfully',
      data: updatedData 
    })
  } catch (error) {
    console.error('Error updating about data:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}
