import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET contact info
export async function GET() {
  try {
    // Get the first (and should be only) contact info record
    const contactInfo = await (prisma as any).contactInfo.findFirst({
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (!contactInfo) {
      // Return default structure if no record exists
      return NextResponse.json({
        id: null,
        email: '',
        phone: '',
        address: '',
        githubUrl: '',
        linkedinUrl: '',
        twitterUrl: '',
        description: ''
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

// POST/PUT update contact info
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if contact info already exists
    const existingContactInfo = await (prisma as any).contactInfo.findFirst();

    let contactInfo;
    
    if (existingContactInfo) {
      // Update existing record
      contactInfo = await (prisma as any).contactInfo.update({
        where: {
          id: existingContactInfo.id,
        },
        data: {
          email: body.email,
          phone: body.phone || null,
          address: body.address || null,
          githubUrl: body.githubUrl || null,
          linkedinUrl: body.linkedinUrl || null,
          twitterUrl: body.twitterUrl || null,
          description: body.description || null,
        },
      });
    } else {
      // Create new record
      contactInfo = await (prisma as any).contactInfo.create({
        data: {
          email: body.email,
          phone: body.phone || null,
          address: body.address || null,
          githubUrl: body.githubUrl || null,
          linkedinUrl: body.linkedinUrl || null,
          twitterUrl: body.twitterUrl || null,
          description: body.description || null,
        },
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}