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
  ];  // Route intent to appropriate microservice
  static async routeIntent(intent: string, userMessage: string, baseUrl: string): Promise<any> {
    try {
      // Handle navigation intents directly
      if (intent.startsWith('navigate_')) {
        const navigationResponses = {
          navigate_home: `🏠 **Đang chuyển đến trang Home...**

✨ **Trang chủ bao gồm:**
• Welcome message và introduction
• Featured projects showcase
• Quick overview về skills
• Call-to-action cho contact

🎯 **Perfect để:**
• First impression với visitors
• Quick overview về portfolio
• Navigate tới other sections
• Professional introduction

*Trang sẽ được chuyển trong giây lát...*`,

          navigate_about: `👤 **Đang chuyển đến trang About...**

📋 **Thông tin chi tiết về:**
• Professional background & experience
• Education và qualifications
• Detailed skills breakdown
• Career journey timeline
• Personal interests & hobbies

💼 **For recruiters:**
• Complete professional profile
• Work experience details
• Technical competencies
• Cultural fit indicators

*Đang load trang About...*`,

          navigate_projects: `🚀 **Đang chuyển đến trang Projects...**

💻 **Showcase bao gồm:**
• Live demos của tất cả projects
• Source code links (GitHub)
• Technology stacks used
• Project descriptions & features
• Screenshots & previews

🔍 **Technical assessment:**
• Code quality evaluation
• Modern development practices
• Problem-solving approaches
• UI/UX design skills

*Loading Projects page...*`,

          navigate_blog: `📝 **Đang chuyển đến trang Blog...**

📚 **Technical content:**
• Development tutorials & tips
• Industry insights & trends
• Problem-solving articles
• Learning journey sharing
• Best practices discussions

💡 **Shows:**
• Technical writing skills
• Knowledge sharing ability
• Continuous learning mindset
• Communication effectiveness

*Đang chuyển tới Blog...*`,

          navigate_contact: `📧 **Đang chuyển đến trang Contact...**

🤝 **Professional communication:**
• Direct contact form
• Email và phone information
• Social media links
• Response time expectations
• Preferred communication methods

💼 **For business inquiries:**
• Project collaboration opportunities
• Technical consultation
• Career opportunities
• Partnership discussions

*Loading Contact page...*`,

          navigate_general: `🧭 **Navigation Guide**

**Available pages:**
• **Home** - Portfolio overview
• **About** - Professional background
• **Projects** - Technical showcase
• **Blog** - Articles & insights
• **Contact** - Get in touch

Bạn muốn đi đến trang nào cụ thể?`
        };

        const response = navigationResponses[intent as keyof typeof navigationResponses] || 
                        navigationResponses.navigate_general;

        // Add navigation action for specific navigation intents
        const navigationAction = intent === 'navigate_home' ? '/' :
                               intent === 'navigate_about' ? '/about' :
                               intent === 'navigate_projects' ? '/projects' :
                               intent === 'navigate_blog' ? '/blog' :
                               intent === 'navigate_contact' ? '/contact' : null;

        return {
          response,
          source: 'navigation_direct',
          confidence: 0.95,
          navigationAction
        };
      }

      // Handle theme intents directly
      if (intent.startsWith('theme_')) {
        const themeResponses = {
          theme_dark: `🌙 **Dark mode đã được bật!**

✅ **Thay đổi:**
• Giao diện chuyển sang chế độ tối
• Dễ nhìn hơn trong môi trường ít ánh sáng
• Tiết kiệm pin cho thiết bị OLED
• Giảm căng thẳng cho mắt khi làm việc ban đêm

🎨 **Dark mode features:**
• High contrast cho readability tốt hơn
• Consistent color scheme trên toàn site
• Smooth transition animation
• Auto-save preference cho lần sau`,

          theme_light: `☀️ **Light mode đã được bật!**

✅ **Thay đổi:**
• Giao diện chuyển sang chế độ sáng
• Rõ ràng và sáng sủa
• Phù hợp cho môi trường có ánh sáng tốt
• Classic và professional appearance

🎨 **Light mode features:**
• Clean và minimalist design
• Excellent readability ban ngày
• High contrast text và backgrounds
• Professional look cho business context`,

          theme_system: `🔄 **System theme đã được bật!**

✅ **Thay đổi:**
• Theme sẽ theo setting hệ thống của bạn
• Tự động chuyển dark/light theo OS
• Sync với Windows/Mac/Linux preference
• Smart adaptation theo thời gian trong ngày

🎨 **Auto theme features:**
• Seamless switching với OS changes
• Respect user system preferences
• No manual intervention needed
• Consistent experience across devices`,

          theme_usage: `🌙 **Cách chuyển đổi Theme:**

**Dark/Light Mode:**
• Click icon 🌙/☀️ ở góc trên bên phải
• Theme sẽ chuyển ngay lập tức
• Setting được lưu tự động
• Sync với system preference

**Lợi ích:**
• **Dark mode**: dễ nhìn ban đêm, tiết kiệm pin
• **Light mode**: sáng sủa, phù hợp ban ngày
• **Auto**: theo setting hệ thống

**Responsive:**
• Theme hoạt động trên mọi thiết bị
• Smooth transition animation
• Không ảnh hưởng đến performance`
        };

        const response = themeResponses[intent as keyof typeof themeResponses] || 
                        themeResponses.theme_usage;

        // Add theme action for specific theme intents
        const themeAction = intent === 'theme_dark' ? 'dark' :
                          intent === 'theme_light' ? 'light' :
                          intent === 'theme_system' ? 'system' : null;

        return {
          response,
          source: 'theme_direct',
          confidence: 0.95,
          themeAction
        };
      }

      // Check cache first for non-theme intents
      const cachedResponse = ChatbotCache.getCachedResponse(userMessage, intent);
      if (cachedResponse && cachedResponse.confidence > 0.8) {
        return cachedResponse;
      }

      // --- Dynamic owner name for about/greeting/help intents ---
      if (["about", "greeting", "help"].includes(intent)) {
        let realBaseUrl = baseUrl;
        if (process.env.NODE_ENV === 'production') {
          realBaseUrl = 'https://portfolio-thacjs-projects.vercel.app';
        }
        // Fetch owner info from about API
        try {
          const aboutRes = await fetch(`${realBaseUrl}/api/chatbot/about?query=${encodeURIComponent(userMessage)}`);
          if (aboutRes.ok) {
            const aboutData = await aboutRes.json();
            const ownerName = aboutData.response.match(/\*\*Tên:\*\* ([^\-\n]+)/)?.[1]?.trim() || 'Portfolio Owner';
            let response = aboutData.response;
            // For greeting/help, customize the message
            if (intent === 'greeting') {
              response = `Xin chào! 👋 Tôi là trợ lý AI của ${ownerName}. Hỏi tôi về dự án, kỹ năng, kinh nghiệm, blog hoặc liên hệ nhé!`;
            } else if (intent === 'help') {
              response = `💡 Tôi là trợ lý AI của ${ownerName}. Tôi có thể giúp bạn về: dự án, kỹ năng, kinh nghiệm, blog, hoặc thông tin liên hệ. Bạn muốn biết gì?`;
            }
            const result = {
              response,
              intent,
              source: 'about_service',
              confidence: 0.95
            };
            ChatbotCache.cacheResponse(userMessage, intent, result, 0.95);
            return result;
          }
        } catch (err) {
          // fallback to static response below
        }
      }
      // Get service endpoint for the intent
      const endpoint = this.INTENT_SERVICE_MAP[intent] || this.INTENT_SERVICE_MAP['default'];
      // Sử dụng đúng domain production khi deploy trên Vercel
      let realBaseUrl = baseUrl;
      if (process.env.NODE_ENV === 'production') {
        realBaseUrl = 'https://portfolio-thacjs-projects.vercel.app';
      }
      const serviceUrl = `${realBaseUrl}${endpoint}?query=${encodeURIComponent(userMessage)}`;
      
      // Make request to the specific service
      if (serviceUrl) {
        const startTime = Date.now();
        const response = await fetch(serviceUrl);
        const responseTime = Date.now() - startTime;
        if (response.ok) {
          let result;
          try {
            result = await response.json();
          } catch (jsonError) {
            // If response is not valid JSON (e.g. HTML error page), fallback gracefully
            console.error('Intent routing error: Invalid JSON from service', jsonError);
            return {
              response: "Xin lỗi, tôi gặp lỗi khi lấy dữ liệu từ dịch vụ. Hãy thử lại hoặc hỏi theo cách khác!",
              intent: 'error',
              source: 'router_error',
              confidence: 0.1
            };
          }
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
    
    // Theme switching commands - Highest priority
    if (this.matchKeywords(lowerMessage, [
      'bật dark mode', 'turn on dark mode', 'enable dark mode', 'chuyển sang dark',
      'switch to dark', 'đổi sang tối', 'set theme dark', 'dark theme',
      'set dark mode', 'activate dark'
    ])) {
      return 'theme_dark';
    }

    if (this.matchKeywords(lowerMessage, [
      'bật light mode', 'turn on light mode', 'enable light mode', 'chuyển sang light',
      'switch to light', 'đổi sang sáng', 'set theme light', 'light theme',
      'chế độ sáng', 'set light mode', 'activate light'
    ])) {
      return 'theme_light';
    }

    if (this.matchKeywords(lowerMessage, [
      'system theme', 'auto theme', 'chế độ tự động', 'theo hệ thống',
      'system mode', 'set theme system', 'set system mode', 'auto mode'
    ])) {
      return 'theme_system';
    }    // Theme general usage - Lower priority
    if (this.matchKeywords(lowerMessage, [
      'dark mode', 'light mode', 'theme', 'chế độ tối', 'chế độ sáng', 'giao diện',
      'màu sắc', 'color', 'switch theme', 'đổi theme', 'appearance'
    ])) {
      return 'theme_usage';
    }
      // Navigation commands - High priority after theme
    if (this.matchKeywords(lowerMessage, [
      'đi tới trang chủ', 'go to home', 'navigate to home', 'tới trang chủ', 'đi tới Home', 'đi tới home', 'đi tới trang Home', 'đi tới trang home','chuyển tới trang chủ',
      'vào trang chủ', 'mở trang chủ', 'mở trang Home','direct to home', 'home page'
    ]) || lowerMessage === 'trang chủ') {
      return 'navigate_home';
    }

    if (this.matchKeywords(lowerMessage, [
      'đi tới about', 'đi tới About', 'đi tới trang about', 'đi tới trang About','go to about', 'navigate to about', 'chuyển tới about',
      'vào trang about', 'mở about', 'about page', 'giới thiệu page'
    ])) {
      return 'navigate_about';
    }

    if (this.matchKeywords(lowerMessage, [
      'đi tới projects', 'go to projects', 'navigate to projects', 'chuyển tới projects',
      'vào trang projects', 'mở projects', 'project page', 'dự án page'
    ])) {
      return 'navigate_projects';
    }

    if (this.matchKeywords(lowerMessage, [
      'đi tới blog', 'go to blog', 'navigate to blog', 'chuyển tới blog',
      'vào trang blog', 'mở blog', 'blog page', 'bài viết page'
    ])) {
      return 'navigate_blog';
    }

    if (this.matchKeywords(lowerMessage, [
      'đi tới contact', 'go to contact', 'navigate to contact', 'chuyển tới contact',
      'vào trang contact', 'tới trang contact','mở contact', 'contact page', 'liên hệ page'
    ])) {
      return 'navigate_contact';
    }

    // General navigation detection - must be more specific
    if (this.matchKeywords(lowerMessage, [
      'đi tới', 'go to', 'navigate to', 'chuyển tới', 'vào trang', 'mở trang',
      'direct to', 'visit', 'hướng dẫn tới', 'dẫn tới'
    ]) && !this.matchKeywords(lowerMessage, ['dự án', 'project', 'blog', 'about', 'contact', 'home'])) {
      return 'navigate_general';
    }
    
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

  // Helper method to match keywords (case-insensitive, accent-insensitive)
  private static matchKeywords(message: string, keywords: string[]): boolean {
    // Normalize message: lowercase and remove accents
    const normalizedMsg = this.normalizeText(message);
    return keywords.some(keyword => normalizedMsg.includes(this.normalizeText(keyword)));
  }

  // Helper to normalize text: lowercase and remove accents for robust matching
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
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
