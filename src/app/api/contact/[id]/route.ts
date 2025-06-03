import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// DELETE contact message by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check if message exists
    const existingMessage = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!existingMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Delete the message
    await prisma.contact.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
}