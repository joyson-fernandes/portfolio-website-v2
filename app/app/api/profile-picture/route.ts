
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' 
      }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate filename with timestamp to avoid conflicts
    const fileExtension = path.extname(file.name)
    const filename = `profile-picture-${Date.now()}${fileExtension}`
    const filepath = path.join(uploadsDir, filename)

    // Write file
    await writeFile(filepath, buffer)

    // Return success response with file info
    return NextResponse.json({
      success: true,
      filename,
      url: `/api/files/${filename}`,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Profile picture upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload profile picture' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Check for current profile picture
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ 
        currentPicture: null,
        defaultUrl: 'https://cdn.abacus.ai/images/99dbdee6-dd39-4ea5-aee3-e0b20c58fcb0.png'
      })
    }

    // Find the most recent profile picture
    const fs = require('fs')
    const files = fs.readdirSync(uploadsDir)
    const profilePictures = files.filter((file: string) => 
      file.startsWith('profile-picture-') && 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    )

    if (profilePictures.length === 0) {
      return NextResponse.json({ 
        currentPicture: null,
        defaultUrl: 'https://cdn.abacus.ai/images/99dbdee6-dd39-4ea5-aee3-e0b20c58fcb0.png'
      })
    }

    // Sort by creation time (newest first)
    profilePictures.sort((a: string, b: string) => {
      const aTime = parseInt(a.match(/profile-picture-(\d+)/)?.[1] || '0')
      const bTime = parseInt(b.match(/profile-picture-(\d+)/)?.[1] || '0')
      return bTime - aTime
    })

    const latestPicture = profilePictures[0]
    
    return NextResponse.json({
      currentPicture: latestPicture,
      url: `/api/files/${latestPicture}`,
      defaultUrl: 'https://cdn.abacus.ai/images/99dbdee6-dd39-4ea5-aee3-e0b20c58fcb0.png'
    })

  } catch (error) {
    console.error('Profile picture get error:', error)
    return NextResponse.json({ 
      error: 'Failed to get profile picture info' 
    }, { status: 500 })
  }
}
