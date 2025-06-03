import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get conversation statistics
    const totalConversations = await prisma.chatConversation.count();
    
    const totalMessages = await prisma.chatMessage.count();
    
    const helpfulMessages = await prisma.chatMessage.count({
      where: {
        wasHelpful: true
      }
    });
    
    const avgSatisfactionResult = await prisma.chatConversation.aggregate({
      _avg: {
        satisfaction: true
      }
    });

    const stats = {
      totalConversations,
      totalMessages,
      helpfulMessagesCount: helpfulMessages,
      averageSatisfaction: avgSatisfactionResult._avg.satisfaction || 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching chatbot stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatbot statistics' },
      { status: 500 }
    );
  }
}