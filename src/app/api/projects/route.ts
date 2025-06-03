import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create a new project
export async function POST(request: Request) {
  try {
    // Check authentication (uncomment when auth is set up)
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, and imageUrl are required' },
        { status: 400 }
      );
    }

    // Try to find an admin user, if not found, create one or use a default approach
    let adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });
    
    // If no admin user exists, create a default admin user
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin',
          email: 'admin@portfolio.com',
          role: 'ADMIN'
        }
      });
    }
    
    // Create the project
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        githubUrl: body.githubUrl || null,
        liveUrl: body.liveUrl || null,
        userId: adminUser.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}