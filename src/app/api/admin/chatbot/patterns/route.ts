import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const patterns = await prisma.chatLearningPattern.findMany({
      orderBy: [
        { successCount: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(patterns);
  } catch (error) {
    console.error('Error fetching learning patterns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning patterns' },
      { status: 500 }
    );
  }
}