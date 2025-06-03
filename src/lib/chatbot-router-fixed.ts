import { NextResponse } from 'next/server';
import ChatbotCache from './chatbot-cache';

// Chatbot Intent Router Service
class ChatbotIntentRouter {
  // Map intents to appropriate service endpoints
  private static readonly INTENT_SERVICE_MAP: { [key: string]: string } = {
    // Projects related intents
    'projects': '/api/chatbot/projects',
    
    // About/Personal related intents  
    'about': '/api/chatbot/about',
    
    // Contact related intents
    'contact': '/api/chatbot/contact',
    
    // Skills related intents
    'skills': '/api/chatbot/skills',
    
    // Blog related intents
    'blog': '/api/chatbot/blog',
    
    // Fallback intents
    'greeting': '/api/chatbot/about',
    'help': '/api/chatbot/about',
    'default': '/api/chatbot/about'
  };

  // Fallback responses for unmatched intents
  private static readonly FALLBACK_RESPONSES = [
    "Tôi có thể giúp bạn tìm hiểu về dự án, kỹ năng, kinh nghiệm, blog hoặc thông tin liên hệ. Bạn muốn biết gì cụ thể?",
    "Xin chào! Tôi có thể hỗ trợ bạn về projects, skills, experience, blog posts và contact information.",
    "Hi there! I can help you learn about projects, skills, background, blog content và ways to get in touch.",
    "Tôi sẵn sàng trả lời về portfolio, technical skills, work experience, recent blogs và contact details!"
  ];

  // Route intent to appropriate microservice
  static async routeIntent(intent: string, userMessage: string, baseUrl: string): Promise<any> {
    try {
      // Check cache first
      const cachedResponse = ChatbotCache.getCachedResponse(userMessage, intent);
      if (cachedResponse && cachedResponse.confidence > 0.8) {
        return cachedResponse;
      }

      // Get service endpoint for the intent
      const endpoint = this.INTENT_SERVICE_MAP[intent] || this.INTENT_SERVICE_MAP['default'];
      const serviceUrl = `${baseUrl}${endpoint}?query=${encodeURIComponent(userMessage)}`;
      
      // Make request to the specific service
      if (serviceUrl) {
        const startTime = Date.now();
        const response = await fetch(serviceUrl);
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          const result = await response.json();
          const finalResult = {
            response: result.response,
            intent: result.intent,
            source: result.source,
            confidence: 0.9,
            responseTime
          };
          
          // Cache the successful response
          ChatbotCache.cacheResponse(userMessage, intent, finalResult, 0.9);
          
          return finalResult;
        }
      }
      
      // Fallback response
      const fallbackResponse = this.FALLBACK_RESPONSES[
        Math.floor(Math.random() * this.FALLBACK_RESPONSES.length)
      ];
      
      const fallbackResult = {
        response: fallbackResponse,
        intent: 'fallback',
        source: 'router_fallback', 
        confidence: 0.3
      };
      
      // Cache fallback with lower confidence
      ChatbotCache.cacheResponse(userMessage, 'fallback', fallbackResult, 0.3);
      
      return fallbackResult;
      
    } catch (error) {
      console.error('Intent routing error:', error);
      
      return {
        response: "Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Hãy thử lại hoặc hỏi theo cách khác!",
        intent: 'error',
        source: 'router_error',
        confidence: 0.1
      };
    }
  }

  // Enhanced intent detection with multiple keywords
  static detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced blog detection - CHECK FIRST for better priority
    if (this.matchKeywords(lowerMessage, [
      'blog', 'bài viết', 'article', 'post', 'tutorial', 'hướng dẫn',
      'content', 'đọc', 'viết', 'learning', 'study', 'technical blog',
      'write', 'author', 'publish', 'documentation', 'guide', 'tips',
      'insights', 'sharing', 'knowledge', 'experience sharing',
      'react best practices', 'nextjs', 'typescript', 'ai chatbot',
      'what do you write', 'writing approach', 'blog về', 'viết gì về',
      'best practices', 'features', 'advanced', 'development', 'career tips',
      'web performance', 'optimization', 'responsive design', 'docker'
    ])) {
      return 'blog';
    }

    // Enhanced contact detection - CHECK EARLY to prioritize contact keywords
    if (this.matchKeywords(lowerMessage, [
      'liên hệ', 'contact', 'email', 'mail', 'phone', 'điện thoại', 'thông tin liên lạc',
      'communicate', 'communication', 'giao tiếp', 'reach', 'get in touch',
      'connect', 'kết nối', 'hire', 'thuê', 'work together', 'collaboration',
      'prefer to communicate', 'how to contact', 'ways to reach', 'what\'s your email',
      'your email', 'email address', 'địa chỉ email'
    ])) {
      return 'contact';
    }
    
    // Enhanced project detection
    if (this.matchKeywords(lowerMessage, [
      'dự án', 'project', 'portfolio', 'work', 'demo', 'github', 'source code',
      'ứng dụng', 'website', 'app', 'làm gì', 'build', 'phát triển', 'technology',
      'repository', 'repo', 'code', 'show me', 'best project'
    ])) {
      return 'projects';
    }

    // Enhanced skills detection
    if (this.matchKeywords(lowerMessage, [
      'kỹ năng', 'skill', 'technology', 'programming', 'coding', 'development',
      'frontend', 'backend', 'fullstack', 'react', 'node', 'javascript', 'typescript'
    ])) {
      return 'skills';
    }

    // Enhanced about detection  
    if (this.matchKeywords(lowerMessage, [
      'giới thiệu', 'about', 'background', 'experience', 'kinh nghiệm', 'education',
      'học vấn', 'career', 'nghề nghiệp', 'bản thân', 'ai', 'who', 'tôi là ai',
      'yourself', 'values', 'giá trị', 'principles', 'philosophy', 'motivation',
      'passion', 'đam mê', 'goals', 'mục tiêu', 'vision', 'tầm nhìn'
    ])) {
      return 'about';
    }

    // Greeting detection
    if (this.matchKeywords(lowerMessage, [
      'hello', 'hi', 'chào', 'xin chào', 'hey', 'good morning', 'good afternoon'
    ])) {
      return 'greeting';
    }

    // Help detection
    if (this.matchKeywords(lowerMessage, [
      'help', 'giúp', 'hỗ trợ', 'support', 'assistance'
    ])) {
      return 'help';
    }

    return 'default';
  }

  // Helper method to match keywords
  private static matchKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  // Get available intents for help responses
  static getAvailableIntents(): string[] {
    return Object.keys(this.INTENT_SERVICE_MAP);
  }

  // Get service endpoint for intent
  static getServiceEndpoint(intent: string): string | null {
    return this.INTENT_SERVICE_MAP[intent] || null;
  }

  // Validate intent exists
  static isValidIntent(intent: string): boolean {
    return intent in this.INTENT_SERVICE_MAP;
  }
}

// Enhanced greeting responses
export const GREETING_RESPONSES = [
  "Xin chào! 👋 Tôi là AI assistant của portfolio này. Tôi có thể giúp bạn tìm hiểu về projects, skills, experience, blog posts và contact information!",
  "Hi there! 🌟 Welcome to my portfolio! Ask me anything about my work, technical skills, background, recent blogs, or how to get in touch!",
  "Chào bạn! 🚀 Tôi sẵn sàng trả lời mọi câu hỏi về portfolio, dự án, kỹ năng, kinh nghiệm và thông tin liên hệ!",
  "Hello! 💻 I'm here to help you explore this portfolio. Feel free to ask about projects, technical expertise, career journey, blog content, or contact details!"
];

export const HELP_RESPONSES = [
  "🔍 **Tôi có thể giúp bạn về:**\n• 🚀 **Projects** - Dự án và ứng dụng đã thực hiện\n• 💻 **Skills** - Kỹ năng technical và công nghệ\n• 👨‍💻 **About** - Background, experience, education\n• 📝 **Blog** - Bài viết, tutorials và insights\n• 📧 **Contact** - Thông tin liên hệ và collaboration",
  "💡 **I can help you with:**\n• 🎯 **Projects** - Portfolio work và applications\n• 🛠️ **Technical Skills** - Programming languages và frameworks\n• 📋 **Experience** - Work history và achievements\n• ✍️ **Blog Posts** - Technical articles và tutorials\n• 🤝 **Contact Info** - Ways to connect và collaborate"
];

export default ChatbotIntentRouter;
