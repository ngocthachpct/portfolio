import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ChatbotLearningService } from '@/lib/chatbot-learning';
import ChatbotIntentRouter, { GREETING_RESPONSES, HELP_RESPONSES } from '@/lib/chatbot-router';

export async function POST(request: Request) {
  try {
    const { message, sessionId, userId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const startTime = Date.now();
    
    // Generate session ID if not provided
    const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Detect intent using router
    const intent = ChatbotIntentRouter.detectIntent(message);
    let detectedIntent = { intent, confidence: 0.7 };

    // Try to get database context if available
    let context = null;
    try {
      context = await ChatbotLearningService.analyzeConversationContext(currentSessionId);
      // Try improved intent detection with learned patterns
      const improvedIntent = await ChatbotLearningService.improvedIntentDetection(message, context);
      if (improvedIntent) {
        detectedIntent = improvedIntent;
      }
    } catch (dbError) {
      console.warn('Database context unavailable, using basic intent detection:', dbError);
    }

    // Try to find learned response first (with database fallback)
    let learnedResponse = null;
    try {
      learnedResponse = await ChatbotLearningService.findLearnedResponse(
        message, 
        detectedIntent.intent
      );
    } catch (dbError) {
      console.warn('Learned response unavailable, using direct generation:', dbError);
    }

    let response: string;
    let responseSource = 'default';

    if (learnedResponse && learnedResponse.confidence > 0.6) {
      // Use learned response
      response = learnedResponse.response;
      responseSource = 'learned';
    } else {
      // Generate response directly instead of using microservice routing
      try {
        response = await generateResponse(detectedIntent.intent);
        responseSource = 'direct';
      } catch (generateError) {
        console.error('Error generating response:', generateError);
        response = ChatbotIntentRouter.getFallbackResponse(detectedIntent.intent);
        responseSource = 'fallback';
      }
    }    const responseTime = Date.now() - startTime;

    // Save conversation for learning (fire and forget) - with error handling
    try {
      await ChatbotLearningService.saveConversationMessage(
        currentSessionId,
        message,
        response,
        detectedIntent.intent,
        detectedIntent.confidence,
        responseTime,
        userId
      );
    } catch (saveError) {
      console.warn('Failed to save conversation (non-critical):', saveError);
    }

    // Learn new pattern if confidence is low (fire and forget) - with error handling
    if (detectedIntent.confidence < 0.7) {
      try {
        await ChatbotLearningService.learnNewPattern(
          message,
          detectedIntent.intent,
          detectedIntent.confidence
        );
      } catch (learnError) {
        console.warn('Failed to learn pattern (non-critical):', learnError);
      }
    }

    return NextResponse.json({ 
      response,
      intent: detectedIntent.intent,
      confidence: detectedIntent.confidence,
      source: responseSource,
      sessionId: currentSessionId,
      responseTime
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    
    // Provide a graceful fallback response
    const fallbackResponse = "Xin chào! Tôi có thể giúp bạn tìm hiểu về dự án, kỹ năng, kinh nghiệm và thông tin liên hệ. Hãy hỏi tôi bất cứ điều gì!";
    
    return NextResponse.json({
      response: fallbackResponse,
      intent: 'greeting',
      confidence: 0.5,
      source: 'error_fallback',
      sessionId: `fallback_${Date.now()}`,
      responseTime: 100
    });
  }
}

// Add new endpoint for feedback
export async function PATCH(request: Request) {
  try {
    const { conversationId, messageId, rating, feedbackType, comment } = await request.json();

    if (!conversationId || !messageId || rating === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const success = await ChatbotLearningService.saveFeedback(
      conversationId,
      messageId,
      rating,
      feedbackType,
      comment
    );

    if (success) {
      return NextResponse.json({ message: 'Feedback saved successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
    }
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Navigation intents - Điều hướng
  if (lowerMessage.includes('đi tới') || lowerMessage.includes('chuyển tới') || lowerMessage.includes('tới trang') ||
      lowerMessage.includes('go to') || lowerMessage.includes('navigate to') || lowerMessage.includes('visit') ||
      lowerMessage.includes('mở trang') || lowerMessage.includes('vào trang') || lowerMessage.includes('direct') ||
      lowerMessage.includes('hướng dẫn tới') || lowerMessage.includes('dẫn tới') || lowerMessage.includes('tới')) {
    
    // Check specific pages
    if (lowerMessage.includes('home') || lowerMessage.includes('trang chủ') || lowerMessage.includes('homepage')) {
      return 'navigate_home';
    }
    if (lowerMessage.includes('about') || lowerMessage.includes('giới thiệu') || lowerMessage.includes('thông tin cá nhân')) {
      return 'navigate_about';
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('dự án') || lowerMessage.includes('portfolio')) {
      return 'navigate_projects';
    }
    if (lowerMessage.includes('blog') || lowerMessage.includes('bài viết') || lowerMessage.includes('tin tức')) {
      return 'navigate_blog';
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('liên hệ') || lowerMessage.includes('thông tin liên lạc')) {
      return 'navigate_contact';
    }
    
    return 'navigate_general';
  }
  
  // Specific page requests without "go to" keywords
  if (lowerMessage.includes('trang chủ') || (lowerMessage.includes('home') && !lowerMessage.includes('homepage'))) {
    return 'navigate_home';
  }
  if (lowerMessage.includes('xem dự án') || lowerMessage.includes('danh sách dự án')) {
    return 'navigate_projects';
  }
  if (lowerMessage.includes('đọc blog') || lowerMessage.includes('xem blog')) {
    return 'navigate_blog';
  }
  if (lowerMessage.includes('form liên hệ') || lowerMessage.includes('gửi tin nhắn')) {
    return 'navigate_contact';
  }
  
  // Greetings - Chào hỏi
  if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
      lowerMessage.includes('chào') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') ||
      lowerMessage.includes('good afternoon') || lowerMessage.includes('good evening') || 
      lowerMessage.includes('chào buổi sáng') || lowerMessage.includes('chào buổi chiều')) {
    return 'greeting';
  }
  
  // Projects - Dự án
  if (lowerMessage.includes('dự án') || lowerMessage.includes('project') || lowerMessage.includes('portfolio') ||
      lowerMessage.includes('work') || lowerMessage.includes('công việc') || lowerMessage.includes('làm gì') ||
      lowerMessage.includes('demo') || lowerMessage.includes('github') || lowerMessage.includes('source code') ||
      lowerMessage.includes('ứng dụng') || lowerMessage.includes('website') || lowerMessage.includes('app')) {
    return 'projects';
  }
  
  // Skills and technologies - Kỹ năng và công nghệ
  if (lowerMessage.includes('kỹ năng') || lowerMessage.includes('skill') || lowerMessage.includes('công nghệ') ||
      lowerMessage.includes('technology') || lowerMessage.includes('framework') || lowerMessage.includes('programming') ||
      lowerMessage.includes('react') || lowerMessage.includes('nextjs') || lowerMessage.includes('typescript') ||
      lowerMessage.includes('javascript') || lowerMessage.includes('python') || lowerMessage.includes('node') ||
      lowerMessage.includes('lập trình') || lowerMessage.includes('biết gì') || lowerMessage.includes('sử dụng gì') ||
      lowerMessage.includes('frontend') || lowerMessage.includes('backend') || lowerMessage.includes('fullstack')) {
    return 'skills';
  }
  
  // About/Personal info - Thông tin cá nhân
  if (lowerMessage.includes('giới thiệu') || lowerMessage.includes('about') || lowerMessage.includes('thông tin') ||
      lowerMessage.includes('bản thân') || lowerMessage.includes('ai') || lowerMessage.includes('who') ||
      lowerMessage.includes('background') || lowerMessage.includes('experience') || lowerMessage.includes('kinh nghiệm') ||
      lowerMessage.includes('học vấn') || lowerMessage.includes('education') || lowerMessage.includes('là ai')) {
    return 'about';
  }
  
  // Contact information - Thông tin liên hệ
  if (lowerMessage.includes('liên hệ') || lowerMessage.includes('contact') || lowerMessage.includes('email') ||
      lowerMessage.includes('phone') || lowerMessage.includes('điện thoại') || lowerMessage.includes('địa chỉ') ||
      lowerMessage.includes('address') || lowerMessage.includes('social') || lowerMessage.includes('facebook') ||
      lowerMessage.includes('linkedin') || lowerMessage.includes('twitter') || lowerMessage.includes('zalo')) {
    return 'contact';
  }
  
  // Specific contact methods - Các cách liên hệ cụ thể
  if (lowerMessage.includes('email') || lowerMessage.includes('@') || lowerMessage.includes('mail') ||
      lowerMessage.includes('thư điện tử') || lowerMessage.includes('gửi mail')) {
    return 'email';
  }
  
  if (lowerMessage.includes('phone') || lowerMessage.includes('điện thoại') || lowerMessage.includes('số điện thoại') ||
      lowerMessage.includes('gọi') || lowerMessage.includes('call') || lowerMessage.includes('sdt')) {
    return 'phone';
  }
  
  if (lowerMessage.includes('address') || lowerMessage.includes('địa chỉ') || lowerMessage.includes('ở đâu') ||
      lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('vị trí')) {
    return 'address';
  }
  
  if (lowerMessage.includes('github') || lowerMessage.includes('git') || lowerMessage.includes('source code') ||
      lowerMessage.includes('code') || lowerMessage.includes('repository') || lowerMessage.includes('repo')) {
    return 'github';
  }
  
  if (lowerMessage.includes('linkedin') || lowerMessage.includes('professional') || lowerMessage.includes('nghề nghiệp') ||
      lowerMessage.includes('network') || lowerMessage.includes('kết nối')) {
    return 'linkedin';
  }
  
  if (lowerMessage.includes('twitter') || lowerMessage.includes('x.com') || lowerMessage.includes('tweet') ||
      lowerMessage.includes('follow') || lowerMessage.includes('theo dõi')) {
    return 'twitter';
  }
  
  if (lowerMessage.includes('facebook') || lowerMessage.includes('fb') || lowerMessage.includes('social media') ||
      lowerMessage.includes('mạng xã hội')) {
    return 'facebook';
  }
  
  if (lowerMessage.includes('zalo') || lowerMessage.includes('chat') || lowerMessage.includes('nhắn tin') ||
      lowerMessage.includes('message') || lowerMessage.includes('instant message')) {
    return 'zalo';
  }
  
  if (lowerMessage.includes('form') || lowerMessage.includes('contact form') || lowerMessage.includes('form liên hệ') ||
      lowerMessage.includes('điền form') || lowerMessage.includes('gửi tin nhắn')) {
    return 'contactform';
  }
  
  // Blog - Blog
  if (lowerMessage.includes('blog') || lowerMessage.includes('bài viết') || lowerMessage.includes('article') ||
      lowerMessage.includes('post') || lowerMessage.includes('write') || lowerMessage.includes('viết') ||
      lowerMessage.includes('đọc gì') || lowerMessage.includes('content') || lowerMessage.includes('tin tức')) {
    return 'blog';
  }
  
  // Services/Hiring - Dịch vụ/Thuê
  if (lowerMessage.includes('dịch vụ') || lowerMessage.includes('service') || lowerMessage.includes('hire') ||
      lowerMessage.includes('thuê') || lowerMessage.includes('freelance') || lowerMessage.includes('job') ||
      lowerMessage.includes('work together') || lowerMessage.includes('collaborate') || lowerMessage.includes('hợp tác') ||
      lowerMessage.includes('làm việc cùng') || lowerMessage.includes('outsource')) {
    return 'services';
  }
  
  // Learning/Education - Học tập
  if (lowerMessage.includes('học') || lowerMessage.includes('learn') || lowerMessage.includes('course') ||
      lowerMessage.includes('tutorial') || lowerMessage.includes('guide') || lowerMessage.includes('how to') ||
      lowerMessage.includes('làm sao') || lowerMessage.includes('bắt đầu') || lowerMessage.includes('start') ||
      lowerMessage.includes('tài liệu') || lowerMessage.includes('hướng dẫn')) {
    return 'learning';
  }
  
  // Technology stack - Stack công nghệ
  if (lowerMessage.includes('tech stack') || lowerMessage.includes('technology stack') || lowerMessage.includes('tools') ||
      lowerMessage.includes('công cụ') || lowerMessage.includes('phần mềm') || lowerMessage.includes('software') ||
      lowerMessage.includes('database') || lowerMessage.includes('cơ sở dữ liệu') || lowerMessage.includes('framework nào')) {
    return 'techstack';
  }
  
  // Career/Future plans - Sự nghiệp
  if (lowerMessage.includes('tương lai') || lowerMessage.includes('future') || lowerMessage.includes('career') ||
      lowerMessage.includes('nghề nghiệp') || lowerMessage.includes('plan') || lowerMessage.includes('kế hoạch') ||
      lowerMessage.includes('goal') || lowerMessage.includes('mục tiêu') || lowerMessage.includes('định hướng')) {
    return 'career';
  }
  
  // Pricing/Cost - Giá cả
  if (lowerMessage.includes('giá') || lowerMessage.includes('price') || lowerMessage.includes('cost') ||
      lowerMessage.includes('fee') || lowerMessage.includes('phí') || lowerMessage.includes('budget') ||
      lowerMessage.includes('money') || lowerMessage.includes('tiền') || lowerMessage.includes('chi phí') ||
      lowerMessage.includes('bao nhiêu')) {
    return 'pricing';
  }
  
  // Timeline/Availability - Thời gian
  if (lowerMessage.includes('time') || lowerMessage.includes('thời gian') || lowerMessage.includes('deadline') ||
      lowerMessage.includes('available') || lowerMessage.includes('rảnh') || lowerMessage.includes('busy') ||
      lowerMessage.includes('schedule') || lowerMessage.includes('lịch') || lowerMessage.includes('bao lâu') ||
      lowerMessage.includes('khi nào')) {
    return 'timeline';
  }
  
  // Help/FAQ - Trợ giúp
  if (lowerMessage.includes('help') || lowerMessage.includes('giúp') || lowerMessage.includes('hỗ trợ') ||
      lowerMessage.includes('support') || lowerMessage.includes('question') || lowerMessage.includes('câu hỏi') ||
      lowerMessage.includes('faq') || lowerMessage.includes('hướng dẫn')) {
    return 'help';
  }
  
  // Compliments - Khen ngợi
  if (lowerMessage.includes('tuyệt vời') || lowerMessage.includes('great') || lowerMessage.includes('awesome') ||
      lowerMessage.includes('good') || lowerMessage.includes('nice') || lowerMessage.includes('excellent') ||
      lowerMessage.includes('hay') || lowerMessage.includes('đẹp') || lowerMessage.includes('impressive') ||
      lowerMessage.includes('ấn tượng')) {
    return 'compliment';
  }
  
  // Goodbye - Tạm biệt
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('tạm biệt') ||
      lowerMessage.includes('see you') || lowerMessage.includes('hẹn gặp lại') || lowerMessage.includes('chào') ||
      lowerMessage.includes('thanks') || lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank you')) {
    return 'goodbye';
  }
  
  // Website navigation and usage - Điều hướng và sử dụng website
  if (lowerMessage.includes('cách dùng') || lowerMessage.includes('how to use') || lowerMessage.includes('sử dụng') ||
      lowerMessage.includes('thao tác') || lowerMessage.includes('navigate') || lowerMessage.includes('điều hướng') ||
      lowerMessage.includes('website') || lowerMessage.includes('trang web') || lowerMessage.includes('chức năng') ||
      lowerMessage.includes('feature') || lowerMessage.includes('làm sao') || lowerMessage.includes('menu') ||
      lowerMessage.includes('navigation') || lowerMessage.includes('vào đâu') || lowerMessage.includes('ở đâu')) {
    return 'navigation';
  }
  
  // Blog operations - Thao tác blog
  if (lowerMessage.includes('đọc blog') || lowerMessage.includes('xem blog') || lowerMessage.includes('blog') ||
      lowerMessage.includes('bài viết') || lowerMessage.includes('article') || lowerMessage.includes('read') ||
      lowerMessage.includes('đọc bài') || lowerMessage.includes('view post') || lowerMessage.includes('post')) {
    return 'blog_usage';
  }
  
  // Project exploration - Khám phá dự án
  if (lowerMessage.includes('xem dự án') || lowerMessage.includes('view project') || lowerMessage.includes('demo') ||
      lowerMessage.includes('live demo') || lowerMessage.includes('source code') || lowerMessage.includes('github') ||
      lowerMessage.includes('repository') || lowerMessage.includes('tech stack') || lowerMessage.includes('technology')) {
    return 'project_usage';
  }
  
  // Contact form usage - Sử dụng form liên hệ
  if (lowerMessage.includes('gửi tin nhắn') || lowerMessage.includes('contact form') || lowerMessage.includes('form liên hệ') ||
      lowerMessage.includes('send message') || lowerMessage.includes('điền form') || lowerMessage.includes('fill form') ||
      lowerMessage.includes('submit') || lowerMessage.includes('gửi form')) {
    return 'contact_usage';
  }
  
  // Theme and UI operations - Thao tác giao diện
  if (lowerMessage.includes('dark mode') || lowerMessage.includes('light mode') || lowerMessage.includes('theme') ||
      lowerMessage.includes('chế độ tối') || lowerMessage.includes('chế độ sáng') || lowerMessage.includes('giao diện') ||
      lowerMessage.includes('màu sắc') || lowerMessage.includes('color') || lowerMessage.includes('switch theme') ||
      lowerMessage.includes('đổi theme') || lowerMessage.includes('appearance')) {
    return 'theme_usage';
  }
  
  // Mobile responsiveness - Responsive di động
  if (lowerMessage.includes('mobile') || lowerMessage.includes('điện thoại') || lowerMessage.includes('phone') ||
      lowerMessage.includes('tablet') || lowerMessage.includes('responsive') || lowerMessage.includes('di động') ||
      lowerMessage.includes('màn hình nhỏ') || lowerMessage.includes('small screen')) {
    return 'mobile_usage';
  }
  
  // Search and filter - Tìm kiếm và lọc
  if (lowerMessage.includes('tìm kiếm') || lowerMessage.includes('search') || lowerMessage.includes('filter') ||
      lowerMessage.includes('lọc') || lowerMessage.includes('find') || lowerMessage.includes('tìm') ||
      lowerMessage.includes('category') || lowerMessage.includes('danh mục') || lowerMessage.includes('sort')) {
    return 'search_usage';
  }
  
  // Performance and loading - Hiệu suất
  if (lowerMessage.includes('loading') || lowerMessage.includes('tải') || lowerMessage.includes('slow') ||
      lowerMessage.includes('chậm') || lowerMessage.includes('performance') || lowerMessage.includes('hiệu suất') ||
      lowerMessage.includes('speed') || lowerMessage.includes('tốc độ') || lowerMessage.includes('lag') ||
      lowerMessage.includes('giật') || lowerMessage.includes('error') || lowerMessage.includes('lỗi')) {
    return 'performance_help';
  }
  
  // Accessibility features - Tính năng trợ năng
  if (lowerMessage.includes('accessibility') || lowerMessage.includes('trợ năng') || lowerMessage.includes('keyboard') ||
      lowerMessage.includes('bàn phím') || lowerMessage.includes('screen reader') || lowerMessage.includes('alt text') ||
      lowerMessage.includes('contrast') || lowerMessage.includes('độ tương phản') || lowerMessage.includes('font size') ||
      lowerMessage.includes('cỡ chữ')) {
    return 'accessibility_help';
  }
  
  // Share and social features - Chia sẻ
  if (lowerMessage.includes('share') || lowerMessage.includes('chia sẻ') || lowerMessage.includes('social') ||
      lowerMessage.includes('bookmark') || lowerMessage.includes('đánh dấu') || lowerMessage.includes('save') ||
      lowerMessage.includes('lưu') || lowerMessage.includes('copy link') || lowerMessage.includes('sao chép link')) {
    return 'share_usage';
  }
  
  // Admin features (if applicable) - Tính năng admin
  if (lowerMessage.includes('admin') || lowerMessage.includes('quản trị') || lowerMessage.includes('dashboard') ||
      lowerMessage.includes('login') || lowerMessage.includes('đăng nhập') || lowerMessage.includes('edit') ||
      lowerMessage.includes('chỉnh sửa') || lowerMessage.includes('manage') || lowerMessage.includes('quản lý')) {
    return 'admin_info';
  }
  
  return 'default';
}

async function generateResponse(intent: string): Promise<string> {
  try {
    switch (intent) {
      case 'greeting':
        const greetings = [
          "Xin chào! Tôi là chatbot của portfolio này. Tôi có thể giúp bạn tìm hiểu về kinh nghiệm, kỹ năng, dự án và thông tin liên hệ của chủ sở hữu portfolio. Bạn muốn biết gì?",
          "Chào bạn! Rất vui được giới thiệu portfolio này. Tôi có thể trả lời các câu hỏi về background, projects, skills và career journey.",
          "Hello! Tôi ở đây để giúp bạn tìm hiểu về portfolio này. Hãy hỏi tôi bất cứ điều gì về kinh nghiệm làm việc, dự án hoặc kỹ năng!"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];

      case 'projects':
        const projects = await prisma.project.findMany({
          select: { title: true, description: true },
          take: 3
        });
        
        if (projects.length > 0) {
          const projectList = projects.map((p: { title: string; description: string }) => `"${p.title}"`).join(', ');
          return `Các dự án nổi bật bao gồm: ${projectList}. Mỗi dự án đều thể hiện kỹ năng full-stack development với demo trực tiếp và source code công khai trên GitHub. Bạn có thể xem chi tiết trong phần Projects để đánh giá chất lượng code và approach.`;
        }
        return "Các dự án đang được phát triển và sẽ được cập nhật sớm. Hãy quay lại sau để xem showcase các projects mới nhất!";

      case 'skills':
        const aboutInfo = await prisma.aboutContent.findFirst();
        if (aboutInfo && aboutInfo.skills) {
          return `Kỹ năng chính: ${aboutInfo.skills}. Có kinh nghiệm từ frontend đến backend, database design và deployment. Luôn cập nhật và học hỏi các công nghệ mới để phù hợp với nhu cầu thị trường.`;
        }
        return "Kỹ năng chính: React, Next.js, TypeScript, JavaScript, Node.js, Python, PostgreSQL, MongoDB và các công nghệ web hiện đại. Chuyên về full-stack development với khả năng làm việc độc lập và team.";

      case 'about':
        const about = await prisma.aboutContent.findFirst();
        if (about) {
          const summary = about.aboutDescription.length > 200 
            ? about.aboutDescription.substring(0, 200) + '...' 
            : about.aboutDescription;
          return `${summary} Để biết thêm chi tiết về background, kinh nghiệm và career journey, bạn có thể xem phần About.`;
        }
        return "Là một full-stack developer đam mê công nghệ với kinh nghiệm phát triển ứng dụng web hiện đại. Có khả năng làm việc cả frontend và backend, luôn tìm hiểu và áp dụng best practices trong development.";

      case 'contact':
        try {
          const contactInfo = await (prisma as any).contactInfo.findFirst();
          if (contactInfo && contactInfo.email) {
            const socialLinks = [];
            if (contactInfo.githubUrl) socialLinks.push('GitHub');
            if (contactInfo.linkedinUrl) socialLinks.push('LinkedIn');
            if (contactInfo.twitterUrl) socialLinks.push('Twitter');
            
            let response = `Thông tin liên hệ:\n📧 Email: ${contactInfo.email}`;
            if (contactInfo.phone) response += `\n📞 Điện thoại: ${contactInfo.phone}`;
            if (socialLinks.length > 0) response += `\n🌐 Social: ${socialLinks.join(', ')}`;
            response += '\n\nHoặc sử dụng contact form trong phần Contact để gửi tin nhắn trực tiếp!';
            
            return response;
          }
        } catch (error) {
          console.error('Error fetching contact info:', error);
        }
        return "Hãy vào phần Contact để xem thông tin liên hệ chi tiết và gửi tin nhắn. Luôn sẵn sàng thảo luận về cơ hội nghề nghiệp!";

      case 'email':
        try {
          const contactInfo = await (prisma as any).contactInfo.findFirst();
          if (contactInfo && contactInfo.email) {
            return `📧 **Email:** ${contactInfo.email}

🔹 **Phù hợp để thảo luận:**
• Cơ hội việc làm và career opportunities
• Chi tiết về kinh nghiệm và background
• Technical discussions về projects
• Interview scheduling
• Collaboration possibilities

📝 **Khi gửi email, hãy include:**
• Position/role bạn đang tuyển dụng
• Brief về company và requirements
• Timeline cho recruitment process
• Câu hỏi cụ thể về technical skills

Thường phản hồi email trong vòng 24h! ⚡`;
          }
        } catch (error) {
          console.error('Error fetching contact info:', error);
        }
        return "📧 Email là cách tốt nhất để thảo luận về cơ hội nghề nghiệp và technical discussions. Bạn có thể tìm thấy email trong phần Contact!";

      case 'phone':
        try {
          const contactInfo = await (prisma as any).contactInfo.findFirst();
          if (contactInfo && contactInfo.phone) {
            return `📞 **Số điện thoại:** ${contactInfo.phone}

🔹 **Thích hợp cho:**
• Initial screening calls
• Quick technical discussions
• Interview scheduling
• Urgent opportunities
• Career consultation

⏰ **Thời gian liên hệ tốt nhất:**
• Thứ 2-6: 9:00 AM - 6:00 PM
• Thứ 7: 10:00 AM - 3:00 PM
• Chủ nhật: Chỉ urgent cases

📱 **Lưu ý:** Có thể nhắn tin trước để confirm thời gian phù hợp cho cả hai bên!`;
          }
        } catch (error) {
          console.error('Error fetching contact info:', error);
        }
        return "📞 Số điện thoại để trao đổi trực tiếp có trong phần Contact. Thích hợp cho screening calls và interview scheduling!";

      case 'address':
        try {
          const contactInfo = await (prisma as any).contactInfo.findFirst();
          if (contactInfo && contactInfo.address) {
            return `📍 **Địa chỉ:** ${contactInfo.address}

🏢 **Về location:**
• Sẵn sàng cho in-person interviews
• Local opportunities được ưu tiên
• Flexible với hybrid/remote work
• Có thể relocate nếu cần thiết

🤝 **Face-to-face meetings:**
• Technical interviews
• Company visit và team introduction
• Onboarding sessions
• Regular collaboration nếu là local role

📅 **Scheduling:** Email hoặc call trước để arrange!`;
          }
        } catch (error) {
          console.error('Error fetching contact info:', error);
        }
        return "📍 Địa chỉ có trong phần Contact. Sẵn sàng cho in-person interviews và local opportunities!";

      case 'github':
        try {
          const contactInfo = await (prisma as any).contactInfo.findFirst();
          if (contactInfo && contactInfo.githubUrl) {
            return `💻 **GitHub:** ${contactInfo.githubUrl}

🔹 **Tại GitHub bạn có thể:**
• Review source code quality và coding style
• Check commit history và consistency
• Đánh giá technical skills qua projects
• Xem collaboration và contribution patterns

⭐ **Highlights:**
• Clean, well-documented code
• Modern development practices
• Variety of technology stacks
• Active contribution history

🤝 **For recruiters:**
• Perfect để assess technical abilities
• Evidence của problem-solving skills
• Code quality và best practices
• Learning curve và adaptability

Essential để evaluate technical fit! 🚀`;
          }
        } catch (error) {
          console.error('Error fetching contact info:', error);
        }
        return "💻 GitHub profile showcase toàn bộ technical skills và code quality. Essential cho technical evaluation!";

      case 'linkedin':
        try {
          const contactInfo = await (prisma as any).contactInfo.findFirst();
          if (contactInfo && contactInfo.linkedinUrl) {
            return `💼 **LinkedIn:** ${contactInfo.linkedinUrl}

🔹 **Professional profile bao gồm:**
• Detailed work experience và achievements
• Professional recommendations
• Skill endorsements từ colleagues
• Career progression timeline
• Education background

📈 **For recruiters:**
• Complete professional history
• Network và industry connections
• Career goals và aspirations
• Professional achievements
• Continuous learning evidence

🤝 **Connect để:**
• Professional networking
• Career opportunity discussions
• Industry insights sharing
• Long-term relationship building

Perfect cho comprehensive background check! ✨`;
          }
        } catch (error) {
          console.error('Error fetching contact info:', error);
        }
        return "💼 LinkedIn có complete professional profile perfect cho recruiters và career opportunities!";

      case 'twitter':
        try {
          const contactInfo = await (prisma as any).contactInfo.findFirst();
          if (contactInfo && contactInfo.twitterUrl) {
            return `🐦 **Twitter/X:** ${contactInfo.twitterUrl}

🔹 **Professional insights:**
• Tech industry thoughts và trends
• Learning journey sharing
• Community engagement
• Professional development updates

💭 **Shows:**
• Passion for technology
• Continuous learning mindset
• Industry awareness
• Communication skills
• Thought leadership potential

🔥 **For recruiters:**
• Cultural fit assessment
• Communication style
• Professional interests
• Industry engagement level

Great để understand personality và professional interests! 🚀`;
          }
        } catch (error) {
          console.error('Error fetching contact info:', error);
        }
        return "🐦 Twitter/X shows professional interests và industry engagement. Great cho cultural fit assessment!";

      case 'facebook':
        return `📘 **Facebook:** Hiện tại focus chủ yếu vào professional platforms cho career opportunities.

🔹 **Professional alternatives:**
• **LinkedIn** - Complete professional profile
• **GitHub** - Technical skills showcase  
• **Email** - Direct career discussions
• **Phone** - Interview scheduling

💡 **For recruiters:** LinkedIn và GitHub cung cấp comprehensive view về professional background và technical abilities!

Hãy connect qua LinkedIn cho professional networking! ✨`;

      case 'zalo':
        return `📱 **Zalo:** Hiện tại sử dụng chủ yếu professional communication channels.

🔹 **Professional communication:**
• **📞 Phone** - Interview scheduling
• **📧 Email** - Detailed discussions  
• **💼 LinkedIn** - Professional networking
• **📝 Contact Form** - Structured inquiries

⚡ **Response time:**
1. **Phone** - Immediate (business hours)
2. **Email** - Within 24h
3. **LinkedIn** - Within 24h  
4. **Contact form** - Within 24h

Sẵn sàng adapt communication method theo preference của company! 😊`;

      case 'contactform':
        return `📝 **Contact Form - Recommended cho recruiters!**

🔹 **Perfect để:**
• ✅ Job opportunity inquiries
• ✅ Interview scheduling
• ✅ Technical questions
• ✅ Company introductions
• ✅ Collaboration discussions

📋 **Useful information to include:**
• **Company name** và industry
• **Position** đang tuyển dụng
• **Job requirements** overview
• **Timeline** cho recruitment process
• **Next steps** trong process

⚡ **Response guarantee:** Within 24h for all career opportunities!

🎯 **Location:** Contact section của website. Professional và structured approach! 

Direct connection cho career discussions! 📧`;

      case 'blog':
        try {
          const blogPosts = await prisma.blogPost.findMany({
            select: { title: true, slug: true, excerpt: true },
            take: 3,
            orderBy: { createdAt: 'desc' }
          });
          
          if (blogPosts.length > 0) {
            const postTitles = blogPosts.map((p: { title: string; slug: string; excerpt: string | null }) => `"${p.title}"`).join(', ');
            return `Bài viết mới nhất: ${postTitles}. Blog chia sẻ kinh nghiệm development, tutorials và insights về công nghệ. Xem thêm trong phần Blog!`;
          }
        } catch (error) {
          console.error('Error fetching blog posts:', error);
        }
        return "Blog đang được cập nhật với các bài viết về development experience, tutorials và tech insights. Stay tuned!";

      case 'services':
        return `💼 **Career Focus & Expertise:**
        
🎯 **Chuyên môn chính:**
• Full-stack Web Development
• React/Next.js Frontend Development
• Node.js Backend Development
• Database Design & Optimization
• API Development & Integration

💡 **Working Style:**
• Agile/Scrum methodology
• Clean code practices
• Test-driven development
• Collaborative team work
• Continuous learning mindset

🚀 **Career Goals:**
• Contribute to innovative projects
• Work with modern tech stacks
• Collaborate with talented teams
• Solve complex technical challenges`;

      case 'learning':
        return `📚 **Continuous Learning Approach:**

🎓 **Current Learning:**
• Advanced React patterns
• Cloud architecture (AWS, Azure)
• DevOps và CI/CD practices
• System design principles
• Leadership skills

📖 **Preferred Learning Sources:**
• Official documentation
• Technical blogs và articles
• Open source contributions
• Industry conferences
• Hands-on projects

💪 **Learning Philosophy:**
• Learning by building
• Stay updated với industry trends
• Share knowledge với community
• Practical application first
• Continuous improvement mindset`;

      case 'techstack':
        return `🛠️ **Technical Skills:**

**Frontend Expertise:**
• React, Next.js, TypeScript
• Modern CSS (Tailwind, Styled-components)
• State management (Redux, Zustand)
• Testing (Jest, React Testing Library)

**Backend Proficiency:**
• Node.js, Express.js
• API design và development
• Database design (SQL/NoSQL)
• Authentication & Authorization

**DevOps & Tools:**
• Git version control
• Docker containerization
• CI/CD pipelines
• Cloud deployment (Vercel, AWS)

**Always expanding skillset based on project needs!**`;

      case 'career':
        return `🎯 **Career Aspirations:**

🚀 **Short-term Goals (1-2 years):**
• Join innovative company với modern tech stack
• Contribute to meaningful projects
• Expand full-stack expertise
• Build strong team relationships

🌟 **Long-term Vision (3-5 years):**
• Senior Developer hoặc Tech Lead role
• Mentor junior developers
• Architect scalable solutions
• Drive technical decisions

💼 **Ideal Work Environment:**
• Collaborative và learning-focused team
• Modern development practices
• Growth opportunities
• Work-life balance
• Innovation-driven culture`;

      case 'pricing':
        return `💼 **Salary Expectations & Benefits:**

💰 **Compensation:**
• Competitive salary theo market rate
• Performance-based bonuses welcome
• Growth opportunities valued over initial salary
• Open to negotiation based on role và company

🎁 **Preferred Benefits:**
• Learning & development budget
• Flexible working arrangements
• Health insurance
• Team building activities
• Modern equipment và tools

📈 **Value Proposition:**
• Strong technical skills
• Fast learning ability
• Team collaboration
• Problem-solving mindset
• Commitment to quality

Contact để discuss specific opportunities!`;

      case 'timeline':
        return `⏰ **Availability & Timeline:**

🚀 **Current Status:**
• Available for new opportunities
• Ready to start: Flexible (2-4 weeks notice)
• Open to both immediate và future start dates

📅 **Interview Process:**
• Available for interviews anytime
• Flexible với schedule requirements
• Can accommodate multiple interview rounds
• Technical assessments welcome

🎯 **Commitment:**
• Looking for long-term opportunities
• Stable và growth-oriented positions
• Team collaboration focus
• Professional development priorities

⏱️ **Response Time:**
• Email inquiries: Within 24h
• Interview scheduling: Same day
• Technical assessments: As requested`;

      case 'help':
        return `🤝 **How I can help your team:**

💻 **Technical Contributions:**
• Build scalable web applications
• Implement modern development practices  
• Optimize performance và user experience
• Maintain clean, documented code

👥 **Team Collaboration:**
• Work effectively in Agile environments
• Communicate technical concepts clearly
• Mentor junior team members
• Contribute to technical decisions

🚀 **Value Addition:**
• Bring fresh perspectives
• Solve complex problems creatively
• Adapt quickly to new technologies
• Maintain high quality standards

Ready to contribute to your team's success!`;

      // Website operation responses
      case 'navigation':
        return `
🧭 **Portfolio Navigation Guide:**

**Main Sections:**
• **Home** - Overview và introduction
• **About** - Professional background & experience  
• **Projects** - Technical showcase & demos
• **Blog** - Technical insights & articles
• **Contact** - Professional contact information

**For Recruiters:**
• Start with **About** for background
• Check **Projects** for technical skills
• Review **Blog** for communication skills
• Use **Contact** for opportunities

**Technical Assessment:**
• All project source code available
• Live demos for hands-on testing
• Technical blog posts for depth evaluation
        `;

      case 'blog_usage':
        return `
📖 **Cách sử dụng Blog:**

**Đọc bài viết:**
• Vào trang Blog từ menu chính
• Browse qua danh sách bài viết
• Click vào tiêu đề hoặc "Read more" để đọc full

**Tính năng:**
• Tự động lưu vị trí đọc
• Responsive trên mọi thiết bị
• Chia sẻ bài viết qua social media
• Search và filter theo tag/category

**Tips:**
• Bookmark những bài viết hay
• Sử dụng search để tìm chủ đề cụ thể
• Check thường xuyên để có bài viết mới
        `;

      case 'project_usage':
        return `
🚀 **Cách xem Projects:**

**Browse dự án:**
• Vào trang Projects từ menu
• Xem thumbnail và mô tả ngắn
• Click "View Demo" để xem live demo
• Click "Source Code" để xem GitHub

**Thông tin dự án:**
• **Technology stack** được sử dụng
• **Features** chính của dự án
• **Live demo** để test thực tế
• **Source code** để học hỏi

**Demo projects:**
• Test các tính năng trực tiếp
• Responsive trên mobile/desktop
• Có thể interact với UI/UX
• Performance tối ưu
        `;

      case 'contact_usage':
        return `
📧 **Cách sử dụng Contact Form:**

**Gửi tin nhắn:**
1. Vào trang Contact
2. Điền **Name** (tên của bạn)
3. Điền **Email** (email hợp lệ)
4. Chọn **Subject** (chủ đề)
5. Viết **Message** (nội dung chi tiết)
6. Click **Send Message**

**Lưu ý:**
• Email sẽ được trả lời trong 24h
• Kiểm tra spam folder nếu không thấy reply
• Có thể attach file nếu cần
• Form có validation để đảm bảo thông tin chính xác

**Các cách liên hệ khác:**
• Email trực tiếp
• LinkedIn 
• GitHub
• Phone (có trong Contact info)
        `;

      case 'theme_usage':
        return `
🌙 **Cách chuyển đổi Theme:**

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
• Không ảnh hưởng đến performance
        `;

      case 'mobile_usage':
        return `
📱 **Sử dụng trên Mobile:**

**Mobile Menu:**
• Click hamburger icon (☰) để mở menu
• Swipe để navigate giữa các trang
• Tap để interact với elements

**Touch Gestures:**
• **Tap**: click/select
• **Long press**: context menu
• **Swipe**: scroll/navigate
• **Pinch**: zoom in/out

**Optimized Features:**
• Fast loading trên 3G/4G
• Touch-friendly button sizes
• Readable fonts trên small screen
• Efficient image compression

**Tips:**
• Landscape mode cho experience tốt hơn
• Use thumb-friendly navigation
• Auto-hide keyboard khi scroll
        `;

      case 'search_usage':
        return `
🔍 **Tính năng Search & Filter:**

**Search Projects:**
• Gõ keyword vào search box
• Filter theo technology (React, Node.js, etc.)
• Sort theo date, popularity
• Real-time search results

**Search Blog:**
• Tìm theo tiêu đề, content, tags
• Filter theo category, date
• Advanced search với multiple keywords
• Suggestion khi gõ

**Tips để search hiệu quả:**
• Sử dụng từ khóa cụ thể
• Combine multiple filters
• Use quotes cho exact phrase
• Try synonyms nếu không tìm thấy
        `;

      case 'performance_help':
        return `
⚡ **Khắc phục vấn đề Performance:**

**Nếu website chậm:**
• **Refresh** trang (Ctrl+F5)
• **Clear cache** của browser
• **Check internet** connection
• **Close** các tab không cần thiết

**Optimization features:**
• Image lazy loading
• Code splitting
• CDN delivery
• Browser caching

**Best experience:**
• Use modern browser (Chrome, Firefox, Safari)
• Enable JavaScript
• Stable internet connection
• Close unnecessary apps

**Nếu vẫn chậm:**
• Try incognito/private mode
• Disable browser extensions
• Contact qua form nếu issue persist
        `;

      case 'accessibility_help':
        return `
♿ **Accessibility Features:**

**Keyboard Navigation:**
• **Tab**: di chuyển giữa elements
• **Enter/Space**: activate buttons/links
• **Arrow keys**: navigate menus
• **ESC**: close modals/dropdowns

**Screen Reader Support:**
• Alt text cho tất cả images
• ARIA labels cho interactive elements
• Semantic HTML structure
• Skip links cho main content

**Visual Accessibility:**
• High contrast colors
• Scalable fonts (zoom up to 200%)
• Focus indicators rõ ràng
• No information by color alone

**Customization:**
• Browser zoom support
• Text size adjustment
• High contrast mode
• Reduced motion options
        `;

      case 'share_usage':
        return `
🔗 **Chia sẻ & Bookmark:**

**Share content:**
• Copy URL từ address bar
• Use social share buttons
• Right-click → Copy link
• QR code cho mobile sharing

**Bookmark features:**
• **Browser bookmark**: Ctrl+D
• **Save to reading list**
• **Add to home screen** (mobile)
• **Share via email/messaging**

**Direct links:**
• Mỗi project có URL riêng
• Blog posts có permanent links
• Contact info có direct share
• Deep links work perfectly

**Tips:**
• Bookmark specific pages bạn hay dùng
• Share projects để showcase work
• Use short URLs cho social media
        `;

      case 'admin_info':
        return `
🔐 **Thông tin Admin:**

**Lưu ý quan trọng:**
• Admin area là **private** cho website owner
• Không public access cho visitors
• Requires authentication để truy cập

**Admin features (chỉ cho owner):**
• Manage blog posts
• Update project information  
• View contact messages
• Edit about/home content
• Upload media files

**Cho visitors:**
• Browse public content freely
• Use contact form để gửi messages
• View projects và blog posts
• All public features available

**Nếu bạn cần edit content:**
• Contact qua form với yêu cầu cụ thể
• Provide detailed information
• Owner sẽ update cho bạn
        `;

      case 'compliment':
        return "🙏 Cảm ơn bạn rất nhiều! Rất vui khi portfolio này có thể thể hiện được passion và dedication trong công việc. Luôn cố gắng deliver quality work và continuous improvement!";

      case 'goodbye':
        return "👋 Cảm ơn bạn đã dành thời gian tìm hiểu về portfolio! Hy vọng chúng ta sẽ có cơ hội collaborate trong tương lai. Hãy liên hệ bất cứ lúc nào cho career opportunities!";

      // Navigation responses - Điều hướng
      case 'navigate_home':
        return `🏠 **Đang chuyển đến trang Home...**

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

*Trang sẽ được chuyển trong giây lát...*`;

      case 'navigate_about':
        return `👤 **Đang chuyển đến trang About...**

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

*Đang load trang About...*`;

      case 'navigate_projects':
        return `🚀 **Đang chuyển đến trang Projects...**

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

*Loading Projects page...*`;

      case 'navigate_blog':
        return `📝 **Đang chuyển đến trang Blog...**

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

*Chuyển đến Blog trong giây lát...*`;

      case 'navigate_contact':
        return `📧 **Đang chuyển đến trang Contact...**

🤝 **Available options:**
• Contact form cho direct messages
• Professional email address
• Phone number cho urgent calls
• Social media links
• LinkedIn professional profile

⚡ **Response time:**
• Contact form: Within 24h
• Email: Within 24h
• Phone: During business hours
• LinkedIn: Within 24h

*Loading Contact page...*`;

      case 'navigate_general':
        return `🧭 **Navigation Options:**

**Main Sections Available:**
• 🏠 **Home** - Portfolio overview & introduction
• 👤 **About** - Professional background & experience  
• 🚀 **Projects** - Technical showcase & demos
• 📝 **Blog** - Technical insights & articles
• 📧 **Contact** - Professional contact information

**Quick Navigation:**
• Say "go to [page name]" để direct navigation
• Use main menu trên top của page
• Click logo để return về Home

**Examples:**
• "Take me to projects"
• "Go to about page"
• "Show me the contact form"

Bạn muốn đi đến trang nào?`;

      case 'chatbot_introduction':
        return `🤖 **Xin chào! Tôi là Portfolio Assistant!**

🎯 **Tôi là ai:**
• AI chatbot thông minh được tích hợp vào portfolio này
• Được thiết kế để hỗ trợ visitors và recruiters
• Có khả năng trả lời câu hỏi về owner của portfolio
• Có thể điều hướng bạn đến các trang cụ thể

💡 **Tôi có thể giúp bạn:**
• **📋 Thông tin về background & experience**
• **🚀 Chi tiết về projects & technical skills**
• **💼 Career goals & collaboration opportunities**
• **📧 Contact information & ways to connect**
• **🧭 Navigation hướng dẫn sử dụng website**

🔍 **Khả năng đặc biệt:**
• Hiểu cả tiếng Việt và tiếng Anh
• Có thể chuyển hướng trang tự động
• Cung cấp thông tin real-time từ database
• Tối ưu cho recruiters và career opportunities

💬 **Cách tương tác:**
• Hỏi bất cứ điều gì về portfolio này
• Yêu cầu điều hướng: "đi tới trang projects"
• Tìm hiểu technical skills và experience
• Thảo luận về collaboration possibilities

🎪 **Examples bạn có thể thử:**
• "Kỹ năng lập trình là gì?"
• "Go to projects page"
• "Tell me about the experience"
• "How to contact for job opportunities?"

Tôi ở đây để giúp bạn tìm hiểu mọi thứ về portfolio này! Bạn muốn biết gì? 😊`;

      default:
        const defaultResponses = [
          "🤔 Tôi có thể giúp bạn tìm hiểu về background, projects, technical skills, hoặc career aspirations. Bạn muốn biết gì cụ thể?",
          "💭 Hãy hỏi tôi về professional experience, technical expertise, career goals, hoặc collaboration opportunities!",
          "🔍 Tôi có thể share insights về development skills, project experience, learning approach, hoặc career vision. Bạn quan tâm điều gì?"
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
  } catch (error) {
    console.error('Error generating response:', error);
    return "⚠️ Xin lỗi, có lỗi xảy ra. Bạn có thể thử hỏi lại hoặc liên hệ trực tiếp qua phần Contact để thảo luận về career opportunities.";
  }
}