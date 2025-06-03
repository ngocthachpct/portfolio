import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get the first home content record or create a default one if none exists
    let homeContent = await prisma.homeContent.findFirst()

    if (!homeContent) {
      // Create default home content if none exists
      homeContent = await prisma.homeContent.create({
        data: {
          title: "Hi, I'm Your Name",
          subtitle: "Full Stack Developer",
          description: "I create beautiful, responsive, and user-friendly websites and applications using modern technologies like Next.js, React, and Tailwind CSS.",
        },
      })
    }

    return NextResponse.json(homeContent)
  } catch (error) {
    console.error('Error fetching home content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, subtitle, description } = body

    // Validate required fields
    if (!title || !subtitle || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get existing home content
    const existingContent = await prisma.homeContent.findFirst()

    let homeContent

    if (existingContent) {
      // Update existing record
      homeContent = await prisma.homeContent.update({
        where: { id: existingContent.id },
        data: { title, subtitle, description },
      })
    } else {
      // Create new record if none exists
      homeContent = await prisma.homeContent.create({
        data: { title, subtitle, description },
      })
    }

    return NextResponse.json(homeContent)
  } catch (error) {
    console.error('Error updating home content:', error)
    return NextResponse.json(
      { error: 'Failed to update home content' },
      { status: 500 }
    )
  }
}