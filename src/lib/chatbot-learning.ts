import { prisma } from '@/lib/db';

interface LearningContext {
  sessionId: string;
  userId?: string;
  previousMessages: Array<{
    content: string;
    sender: 'USER' | 'BOT';
    intent?: string;
    wasHelpful?: boolean;
  }>;
}

interface LearningPattern {
  pattern: string;
  intent: string;
  confidence: number;
  examples: string[];
}

export class ChatbotLearningService {
  // Lưu conversation và message để học hỏi
  static async saveConversationMessage(
    sessionId: string,
    userMessage: string,
    botResponse: string,
    intent: string,
    confidence: number,
    responseTime: number,
    userId?: string
  ) {
    try {
      // Tìm hoặc tạo conversation
      let conversation = await prisma.chatConversation.findFirst({
        where: { sessionId, endedAt: null }
      });

      if (!conversation) {
        conversation = await prisma.chatConversation.create({
          data: {
            sessionId,
            userId,
            totalMessages: 0
          }
        });
      }

      // Lưu user message
      const userMsg = await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          content: userMessage,
          sender: 'USER',
          intent,
          confidence,
          response: botResponse,
          responseTime
        }
      });

      // Lưu bot response
      await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          content: botResponse,
          sender: 'BOT'
        }
      });

      // Update conversation message count
      await prisma.chatConversation.update({
        where: { id: conversation.id },
        data: {
          totalMessages: { increment: 2 }
        }
      });

      return { conversationId: conversation.id, messageId: userMsg.id };
    } catch (error) {
      console.error('Error saving conversation:', error);
      return null;
    }
  }

  // Lưu feedback từ user để học hỏi
  static async saveFeedback(
    conversationId: string,
    messageId: string,
    rating: number,
    feedbackType: 'HELPFUL' | 'NOT_HELPFUL' | 'SUGGESTION' | 'COMPLAINT' | 'COMPLIMENT',
    comment?: string
  ) {
    try {
      await prisma.chatFeedback.create({
        data: {
          conversationId,
          messageId,
          rating,
          feedbackType,
          comment
        }
      });

      // Update message helpful status
      await prisma.chatMessage.update({
        where: { id: messageId },
        data: {
          wasHelpful: rating >= 3
        }
      });

      // Học hỏi từ feedback
      await this.learnFromFeedback(messageId, rating >= 3);
      
      return true;
    } catch (error) {
      console.error('Error saving feedback:', error);
      return false;
    }
  }

  // Học hỏi từ feedback để cải thiện responses
  static async learnFromFeedback(messageId: string, wasHelpful: boolean) {
    try {
      const message = await prisma.chatMessage.findUnique({
        where: { id: messageId },
        include: { conversation: true }
      });

      if (!message || !message.intent) return;

      // Tìm knowledge base entry tương ứng
      const knowledgeEntry = await prisma.chatKnowledgeBase.findFirst({
        where: {
          intent: message.intent,
          question: { contains: message.content.toLowerCase() }
        }
      });

      if (knowledgeEntry) {
        // Update success rate
        const newUsageCount = knowledgeEntry.usageCount + 1;
        const currentSuccessful = knowledgeEntry.successRate * knowledgeEntry.usageCount;
        const newSuccessful = currentSuccessful + (wasHelpful ? 1 : 0);
        const newSuccessRate = newSuccessful / newUsageCount;

        await prisma.chatKnowledgeBase.update({
          where: { id: knowledgeEntry.id },
          data: {
            usageCount: newUsageCount,
            successRate: newSuccessRate,
            confidence: Math.min(1.0, knowledgeEntry.confidence + (wasHelpful ? 0.05 : -0.05))
          }
        });
      } else if (wasHelpful && message.response) {
        // Tạo knowledge base entry mới từ successful interaction
        await prisma.chatKnowledgeBase.create({
          data: {
            question: message.content.toLowerCase(),
            answer: message.response,
            intent: message.intent,
            confidence: 0.7,
            usageCount: 1,
            successRate: 1.0,
            source: 'learned'
          }
        });
      }
    } catch (error) {
      console.error('Error learning from feedback:', error);
    }
  }

  // Tìm learned response từ knowledge base
  static async findLearnedResponse(userMessage: string, intent: string) {
    try {
      // Tìm exact match hoặc similar question
      const knowledgeEntries = await prisma.chatKnowledgeBase.findMany({
        where: {
          OR: [
            { intent, isActive: true },
            { question: { contains: userMessage.toLowerCase() } }
          ]
        },
        orderBy: [
          { confidence: 'desc' },
          { successRate: 'desc' },
          { usageCount: 'desc' }
        ],
        take: 5
      });

      // Chọn best match dựa trên similarity và confidence
      for (const entry of knowledgeEntries) {
        const similarity = this.calculateSimilarity(userMessage.toLowerCase(), entry.question);
        const score = (similarity * 0.4) + (entry.confidence * 0.3) + (entry.successRate * 0.3);
        
        if (score > 0.6) { // Threshold for using learned response
          // Update usage count
          await prisma.chatKnowledgeBase.update({
            where: { id: entry.id },
            data: { usageCount: { increment: 1 } }
          });
          
          return {
            response: entry.answer,
            confidence: entry.confidence,
            source: 'learned'
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding learned response:', error);
      return null;
    }
  }

  // Học patterns mới từ user interactions
  static async learnNewPattern(userMessage: string, intent: string, confidence: number) {
    try {
      const keywords = this.extractKeywords(userMessage);
      const pattern = keywords.join('|'); // Simple regex pattern

      // Check if pattern already exists
      const existingPattern = await prisma.chatLearningPattern.findFirst({
        where: { pattern, intent }
      });

      if (existingPattern) {
        // Update existing pattern
        await prisma.chatLearningPattern.update({
          where: { id: existingPattern.id },
          data: {
            successCount: { increment: 1 },
            totalAttempts: { increment: 1 },
            lastUsed: new Date(),
            examples: {
              push: userMessage
            }
          }
        });
      } else {
        // Create new pattern
        await prisma.chatLearningPattern.create({
          data: {
            pattern,
            patternType: 'keyword',
            intent,
            confidence,
            examples: [userMessage],
            successCount: 1,
            totalAttempts: 1,
            lastUsed: new Date()
          }
        });
      }
    } catch (error) {
      console.error('Error learning new pattern:', error);
    }
  }

  // Phân tích conversation context để hiểu better
  static async analyzeConversationContext(sessionId: string): Promise<LearningContext> {
    try {
      const conversation = await prisma.chatConversation.findFirst({
        where: { sessionId, endedAt: null },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 10 // Last 10 messages for context
          }
        }
      });

      if (!conversation) {
        return {
          sessionId,
          previousMessages: []
        };
      }

      const previousMessages = conversation.messages.map((msg: {
        content: string;
        sender: string;
        intent?: string | null;
        wasHelpful?: boolean | null;
      }) => ({
        content: msg.content,
        sender: msg.sender as 'USER' | 'BOT',
        intent: msg.intent || undefined,
        wasHelpful: msg.wasHelpful || undefined
      }));

      return {
        sessionId,
        userId: conversation.userId || undefined,
        previousMessages
      };
    } catch (error) {
      console.error('Error analyzing conversation context:', error);
      return {
        sessionId,
        previousMessages: []
      };
    }
  }

  // Improved intent detection sử dụng learned patterns
  static async improvedIntentDetection(userMessage: string, context: LearningContext) {
    try {
      // Get learned patterns
      const patterns = await prisma.chatLearningPattern.findMany({
        where: { isActive: true },
        orderBy: { confidence: 'desc' }
      });

      let bestMatch = null;
      let bestScore = 0;

      for (const pattern of patterns) {
        const score = this.matchPattern(userMessage, pattern);
        if (score > bestScore && score > 0.7) { // Threshold
          bestMatch = { intent: pattern.intent, confidence: score };
          bestScore = score;

          // Update pattern usage
          await prisma.chatLearningPattern.update({
            where: { id: pattern.id },
            data: {
              totalAttempts: { increment: 1 },
              lastUsed: new Date()
            }
          });
        }
      }

      return bestMatch;
    } catch (error) {
      console.error('Error in improved intent detection:', error);
      return null;
    }
  }

  // Helper methods
  private static calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.toLowerCase().split(' ');
    const words2 = str2.toLowerCase().split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    return intersection.length / union.length;
  }

  private static extractKeywords(message: string): string[] {
    const stopWords = ['tôi', 'bạn', 'là', 'có', 'được', 'và', 'của', 'trong', 'để', 'với', 'này', 'đó', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return message.toLowerCase()
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 5); // Top 5 keywords
  }

  private static matchPattern(userMessage: string, pattern: any): number {
    try {
      const keywords = pattern.pattern.split('|');
      const messageWords = userMessage.toLowerCase().split(' ');
      let matches = 0;

      for (const keyword of keywords) {
        if (messageWords.some(word => word.includes(keyword.toLowerCase()))) {
          matches++;
        }
      }

      return matches / keywords.length;
    } catch (error) {
      return 0;
    }
  }

  // Admin methods for managing learned data
  static async getLearnedKnowledge(limit = 50) {
    return await prisma.chatKnowledgeBase.findMany({
      orderBy: [
        { successRate: 'desc' },
        { usageCount: 'desc' }
      ],
      take: limit
    });
  }

  static async getConversationStats() {
    const totalConversations = await prisma.chatConversation.count();
    const totalMessages = await prisma.chatMessage.count();
    const avgSatisfaction = await prisma.chatConversation.aggregate({
      _avg: { satisfaction: true }
    });
    const helpfulMessagesCount = await prisma.chatMessage.count({
      where: { wasHelpful: true }
    });

    return {
      totalConversations,
      totalMessages,
      averageSatisfaction: avgSatisfaction._avg.satisfaction || 0,
      helpfulMessagesCount
    };
  }
}