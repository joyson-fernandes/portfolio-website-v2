
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'experience.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataPath, 'utf-8')
    const data = JSON.parse(fileContent)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading experience data:', error)
    return NextResponse.json(
      { error: 'Failed to load experience data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json()
    
    // Add lastUpdated timestamp
    updatedData.lastUpdated = new Date().toISOString()
    
    // Write to file
    await fs.writeFile(dataPath, JSON.stringify(updatedData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Experience data updated successfully',
      data: updatedData
    })
  } catch (error) {
    console.error('Error updating experience data:', error)
    return NextResponse.json(
      { error: 'Failed to update experience data' },
      { status: 500 }
    )
  }
}
