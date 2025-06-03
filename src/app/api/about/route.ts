import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get the first about content record or create a default one if none exists
    let aboutContent = await prisma.aboutContent.findFirst()

    if (!aboutContent) {
      // Create default about content if none exists
      aboutContent = await prisma.aboutContent.create({
        data: {
          aboutTitle: "About Me",
          aboutDescription: "I'm a passionate developer with experience in building web applications using modern technologies. I enjoy solving complex problems and creating intuitive user experiences.",
          heading: "Hi, I'm Your Name",
          skills: "React, Next.js, TypeScript, Node.js, Express, MongoDB, PostgreSQL, Tailwind CSS",
          experience: "Senior Developer at XYZ Company (2020-Present)\nJunior Developer at ABC Corp (2018-2020)",
          education: "Bachelor of Science in Computer Science (2018)\nWeb Development Bootcamp (2017)",
        },
      })
    }

    return NextResponse.json(aboutContent)
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { aboutTitle, aboutDescription, heading, skills, experience, education, avatarUrl } = body

    // Validate required fields
    if (!aboutTitle || !aboutDescription || !heading || !skills || !experience || !education) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get existing about content
    const existingContent = await prisma.aboutContent.findFirst()

    let aboutContent

    if (existingContent) {
      // Update existing record
      aboutContent = await prisma.aboutContent.update({
        where: { id: existingContent.id },
        data: { 
          aboutTitle, 
          aboutDescription, 
          heading, 
          skills, 
          experience, 
          education,
          avatarUrl // Include avatarUrl in the update
        },
      })
    } else {
      // Create new record if none exists
      aboutContent = await prisma.aboutContent.create({
        data: { 
          aboutTitle, 
          aboutDescription, 
          heading, 
          skills, 
          experience, 
          education,
          avatarUrl // Include avatarUrl in the creation
        },
      })
    }

    return NextResponse.json(aboutContent)
  } catch (error) {
    console.error('Error updating about content:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}