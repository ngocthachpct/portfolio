import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 100+ Blog-related prompts organized by categories
const BLOG_PROMPTS = {
  // Specific Blog Posts (1-50)
  specific_blogs: [
    // Tech & Programming Blogs
    { 
      q: "react best practices", 
      a: "📝 **React Best Practices: Building Scalable Applications**\n\n**Tóm tắt:** Comprehensive guide về React development best practices\n\n🔧 **Chủ đề:**\n• Component Architecture & Design Patterns\n• State Management với Redux Toolkit\n• Performance Optimization techniques\n• Custom Hooks & Reusable Logic\n• Testing Strategies với Jest & React Testing Library\n• TypeScript Integration\n• Code Splitting & Lazy Loading\n• Error Boundaries & Error Handling\n\n✨ **Key Takeaways:**\n• Component composition over inheritance\n• Proper state lifting strategies\n• Memoization với React.memo & useMemo\n• Clean code principles trong React\n• Modern React patterns (2024)\n\n🎯 **Ideal for:** React developers muốn improve code quality và scalability!" 
    },
    
    { 
      q: "nextjs 15 features", 
      a: "🚀 **Next.js 15: What's New and Game-Changing**\n\n**Tóm tắt:** Deep dive vào Next.js 15 features và improvements\n\n🔧 **New Features:**\n• App Router Enhancements\n• Turbopack Production Ready\n• Server Components Optimization\n• Improved Image Optimization\n• Enhanced Middleware capabilities\n• Better TypeScript Support\n• New Caching Strategies\n• Performance Improvements\n\n✨ **Migration Guide:**\n• Step-by-step upgrade process\n• Breaking changes và workarounds\n• Performance comparisons\n• Real-world examples\n• Best practices cho new features\n\n🎯 **Perfect for:** Developers upgrading from Next.js 13/14 hoặc learning modern web development!" 
    },
    
    { 
      q: "typescript advanced", 
      a: "💎 **Advanced TypeScript: Beyond the Basics**\n\n**Tóm tắt:** Master advanced TypeScript patterns và techniques\n\n🔧 **Advanced Topics:**\n• Generic Constraints & Conditional Types\n• Mapped Types & Template Literal Types\n• Utility Types & Custom Type Helpers\n• Decorators & Metadata\n• Module Augmentation\n• Advanced Error Handling\n• Performance Optimization\n• Integration với Popular Libraries\n\n✨ **Real Examples:**\n• Building type-safe APIs\n• Custom validation systems\n• Advanced React component typing\n• Database query builders\n• Configuration management\n\n🎯 **Target:** Experienced developers muốn level up TypeScript skills!" 
    },
    
    { 
      q: "ai chatbot development", 
      a: "🤖 **Building Intelligent AI Chatbots: A Complete Guide**\n\n**Tóm tắt:** End-to-end guide để build AI chatbot như portfolio này\n\n🔧 **Technical Stack:**\n• Natural Language Processing\n• OpenAI API Integration\n• Machine Learning algorithms\n• Database design cho conversation history\n• Real-time communication\n• Learning system implementation\n• Context management\n• Performance optimization\n\n✨ **Features Covered:**\n• Intent recognition & classification\n• Dynamic response generation\n• Conversation memory\n• Learning từ user interactions\n• Multi-language support\n• Error handling & fallbacks\n\n🎯 **Great for:** Developers interested in AI/ML và conversational interfaces!" 
    },
    
    { 
      q: "fullstack portfolio", 
      a: "🌟 **Building a Full-Stack Portfolio: From Concept to Deployment**\n\n**Tóm tắt:** Complete walkthrough của portfolio development process\n\n🔧 **Tech Stack:**\n• Frontend: Next.js 15, React, TypeScript\n• Backend: Node.js, PostgreSQL, Prisma\n• Styling: Tailwind CSS, Framer Motion\n• Deployment: Vercel, Docker\n• AI Integration: Custom chatbot system\n\n✨ **Features Built:**\n• Responsive design principles\n• Admin dashboard development\n• Blog system với CMS\n• Project showcase\n• Contact form với email integration\n• Performance optimization\n• SEO best practices\n\n🎯 **Perfect for:** Developers building their own portfolio hoặc learning full-stack development!" 
    },

    // Career & Development Blogs
    { 
      q: "career tips developer", 
      a: "💼 **Developer Career Guide: From Junior to Senior**\n\n**Tóm tắt:** Comprehensive career roadmap cho software developers\n\n🔧 **Career Stages:**\n• Junior Developer: Foundation building\n• Mid-level: Specialization & leadership\n• Senior: Architecture & mentoring\n• Principal/Staff: Technical strategy\n• Management track alternatives\n\n✨ **Practical Advice:**\n• Skill development strategies\n• Building professional network\n• Negotiating salary & benefits\n• Remote work best practices\n• Interview preparation\n• Building personal brand\n• Contributing to open source\n• Continuous learning mindset\n\n🎯 **Ideal for:** Developers ở mọi career stage muốn advance professionally!" 
    },
    
    { 
      q: "coding interview", 
      a: "🎯 **Acing Technical Interviews: A Developer's Playbook**\n\n**Tóm tắt:** Complete guide để prepare và succeed trong technical interviews\n\n🔧 **Interview Types:**\n• Algorithm & Data Structures\n• System Design interviews\n• Coding challenges\n• Behavioral questions\n• Take-home assignments\n• Pair programming sessions\n\n✨ **Preparation Strategy:**\n• Study plan & timeline\n• Practice platforms & resources\n• Mock interview techniques\n• Problem-solving frameworks\n• Communication strategies\n• Common mistakes to avoid\n• Salary negotiation tips\n\n🎯 **Essential for:** Developers preparing for job interviews ở tech companies!" 
    },

    // Web Development Blogs
    { 
      q: "responsive design", 
      a: "📱 **Mastering Responsive Design: Mobile-First Development**\n\n**Tóm tắt:** Modern approaches to responsive web design\n\n🔧 **Core Concepts:**\n• Mobile-first methodology\n• CSS Grid & Flexbox mastery\n• Breakpoint strategies\n• Fluid typography & spacing\n• Image optimization techniques\n• Touch-friendly interfaces\n• Performance considerations\n• Accessibility compliance\n\n✨ **Practical Examples:**\n• Navigation patterns\n• Card layouts\n• Form design\n• Media queries optimization\n• CSS custom properties\n• Animation considerations\n\n🎯 **Perfect for:** Frontend developers muốn master responsive design principles!" 
    },
    
    { 
      q: "web performance", 
      a: "⚡ **Web Performance Optimization: Speed Matters**\n\n**Tóm tắt:** Complete guide to optimizing web application performance\n\n🔧 **Optimization Areas:**\n• Core Web Vitals improvement\n• JavaScript bundle optimization\n• Image & media optimization\n• Caching strategies\n• Database query optimization\n• CDN implementation\n• Code splitting techniques\n• Lazy loading best practices\n\n✨ **Tools & Metrics:**\n• Lighthouse auditing\n• WebPageTest analysis\n• Performance monitoring\n• Real User Monitoring (RUM)\n• A/B testing performance\n• Automated optimization\n\n🎯 **Must-read for:** Developers focused on delivering fast, efficient web experiences!" 
    },

    // DevOps & Infrastructure
    { 
      q: "docker containerization", 
      a: "🐳 **Docker Mastery: Containerizing Applications**\n\n**Tóm tắt:** Comprehensive Docker guide from basics to advanced\n\n🔧 **Docker Concepts:**\n• Container vs VM differences\n• Dockerfile best practices\n• Multi-stage builds\n• Docker Compose orchestration\n• Volume management\n• Network configuration\n• Security considerations\n• Production deployment\n\n✨ **Real Examples:**\n• Node.js application containerization\n• Database containers\n• Development environment setup\n• CI/CD pipeline integration\n• Microservices architecture\n• Monitoring & logging\n\n🎯 **Great for:** Developers muốn learn DevOps và modern deployment practices!" 
    }
  ],

  // General Blog Questions (51-70)
  blog_general: [
    "📚 **Blog Overview:** Tôi viết về web development, career tips, và technology insights. Topics include React, Next.js, TypeScript, full-stack development, AI integration, performance optimization, career advice, interview prep, và industry best practices!",
    
    "✍️ **Writing Style:** Technical content với practical examples, step-by-step tutorials, real-world projects, code snippets, và beginner-friendly explanations. Mix Vietnamese và English để accessible cho Vietnamese developers!",
    
    "🎯 **Target Audience:** Web developers từ beginner đến advanced level, software engineers preparing for interviews, students learning programming, professionals looking for career guidance, và tech enthusiasts exploring new technologies!",
    
    "📈 **Popular Topics:** React best practices, Next.js development, TypeScript advanced patterns, career growth strategies, interview preparation, full-stack development, AI chatbot creation, performance optimization, responsive design, Docker containerization!",
    
    "🚀 **Latest Content:** Recent posts về Next.js 15 features, advanced TypeScript patterns, AI chatbot development, portfolio building strategies, responsive design mastery, career advancement tips, coding interview prep, web performance optimization!",
    
    "💡 **Tutorial Format:** Comprehensive guides với code examples, screenshots, step-by-step instructions, troubleshooting tips, best practices, performance considerations, real-world applications, và practical exercises for hands-on learning!",
    
    "🔥 **Most Read Articles:** Full-stack portfolio development, React best practices, career tips for developers, advanced TypeScript usage, AI chatbot implementation, responsive design techniques, interview preparation guides, performance optimization strategies!",
    
    "📊 **Content Categories:** Technical tutorials (40%), Career development (25%), Web development tips (20%), Tool reviews (10%), Personal experiences (5%). All content focuses on practical value và actionable insights!",
    
    "🎪 **Interactive Content:** Live coding examples, CodePen demos, step-by-step tutorials với screenshots, troubleshooting guides, before/after comparisons, performance benchmarks, real project case studies!",
    
    "🌟 **Value Proposition:** Practical knowledge sharing từ real development experience, beginner-friendly explanations of complex concepts, career insights từ industry experience, up-to-date content về latest technologies!"
  ],

  // Blog Writing & Process (71-80)
  writing_process: [
    "📝 **Content Planning:** Research trending topics, analyze developer pain points, gather real-world examples, create comprehensive outlines, prepare code samples, design visual aids, plan publication schedule!",
    
    "✨ **Writing Approach:** Start với clear problem statement, provide step-by-step solutions, include practical examples, add troubleshooting tips, explain complex concepts simply, use visual aids effectively!",
    
    "🔍 **Research Process:** Follow industry trends, test new technologies hands-on, gather community feedback, analyze popular questions, study documentation thoroughly, verify all code examples!",
    
    "🎯 **Quality Standards:** Technical accuracy, practical relevance, clear explanations, working code examples, proper formatting, SEO optimization, accessibility compliance, mobile responsiveness!",
    
    "📊 **Content Analytics:** Track reader engagement, monitor popular topics, analyze search keywords, measure social shares, gather feedback, adjust content strategy based on data!",
    
    "🤝 **Community Engagement:** Respond to comments promptly, encourage discussions, answer reader questions, collaborate với other developers, participate in tech communities!",
    
    "🔄 **Content Updates:** Keep articles current với latest framework versions, update deprecated code examples, fix broken links, improve explanations based on feedback, add new insights!",
    
    "📅 **Publishing Schedule:** Regular content updates, timely coverage of new releases, seasonal programming topics, career-focused content during hiring seasons, tutorial series for comprehensive coverage!",
    
    "🎨 **Visual Design:** Clean typography, syntax-highlighted code blocks, helpful screenshots, clear diagrams, responsive images, consistent styling, accessible color schemes!",
    
    "🚀 **Content Promotion:** Social media sharing, developer community engagement, newsletter distribution, SEO optimization, cross-platform syndication, collaboration với other creators!"
  ],

  // Blog Topics & Tutorials (81-100)
  tutorial_topics: [
    "⚛️ **React Tutorials:** Component patterns, hooks usage, state management, performance optimization, testing strategies, TypeScript integration, best practices, common pitfalls!",
    
    "🚀 **Next.js Guides:** App Router usage, Server Components, API routes, deployment strategies, performance optimization, SEO implementation, authentication, database integration!",
    
    "💎 **TypeScript Content:** Type safety, advanced patterns, generic usage, utility types, error handling, configuration, integration với frameworks, migration strategies!",
    
    "🎨 **Frontend Topics:** Responsive design, CSS Grid/Flexbox, animation techniques, accessibility, browser compatibility, progressive enhancement, performance optimization!",
    
    "🔧 **Backend Development:** API design, database optimization, authentication systems, caching strategies, error handling, security best practices, scalability patterns!",
    
    "🐳 **DevOps & Deployment:** Docker usage, CI/CD pipelines, cloud deployment, monitoring setup, performance tracking, security configurations, automation strategies!",
    
    "💼 **Career Development:** Skill progression, interview preparation, portfolio building, networking strategies, salary negotiation, remote work, professional growth!",
    
    "🤖 **AI & Machine Learning:** Chatbot development, API integration, natural language processing, machine learning basics, AI tool usage, automation possibilities!",
    
    "🔍 **Testing & Quality:** Unit testing, integration testing, E2E testing, code quality, debugging techniques, performance testing, accessibility testing!",
    
    "📱 **Mobile Development:** React Native, Progressive Web Apps, responsive design, mobile performance, touch interfaces, app store deployment, cross-platform development!"
  ]
};

// Intent detection for blog queries
function detectBlogIntent(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Check for specific blog topics
  const specificBlogKeywords = [
    'react best practices', 'nextjs 15', 'typescript advanced', 'ai chatbot', 
    'fullstack portfolio', 'career tips', 'coding interview', 'responsive design',
    'web performance', 'docker containerization', 'react', 'nextjs', 'typescript',
    'career', 'interview', 'design', 'performance', 'docker', 'ai', 'chatbot'
  ];
  
  if (specificBlogKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return 'specific_blogs';
  }
  
  // Check for writing process questions
  const writingKeywords = ['writing', 'content', 'publish', 'planning', 'research', 'quality'];
  if (writingKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return 'writing_process';
  }
  
  // Check for tutorial-related queries
  const tutorialKeywords = ['tutorial', 'guide', 'learn', 'how to', 'step by step', 'example'];
  if (tutorialKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return 'tutorial_topics';
  }
  
  // Default to general blog questions
  return 'blog_general';
}

// Find specific blog response based on query
function findSpecificBlogResponse(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  
  for (const blog of BLOG_PROMPTS.specific_blogs) {
    if (lowerQuery.includes(blog.q.toLowerCase()) || 
        blog.q.toLowerCase().split(' ').some(word => lowerQuery.includes(word))) {
      return blog.a;
    }
  }
  
  return null;
}

// Calculate similarity score
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().split(' ');
  const words2 = str2.toLowerCase().split(' ');
  const intersection = words1.filter(word => words2.includes(word));
  return intersection.length / Math.max(words1.length, words2.length);
}

// Generate enhanced blog response
function generateBlogResponse(query: string, intent: string, blogPosts: any[]): string {
  let response = '';
  
  // Try to find specific blog response first
  const specificResponse = findSpecificBlogResponse(query);
  if (specificResponse) {
    response = specificResponse;
  } else {
    // Use intent-based responses
    const prompts = BLOG_PROMPTS[intent as keyof typeof BLOG_PROMPTS] as string[];
    if (prompts && prompts.length > 0) {
      // Find best matching response
      let bestMatch = prompts[0];
      let bestScore = 0;
      
      for (const prompt of prompts) {
        const score = calculateSimilarity(query, prompt);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = prompt;
        }
      }
      
      response = bestMatch;
    } else {
      response = "📚 **Blog Content:** Tôi viết về web development, career tips, và technology insights. Topics bao gồm React, Next.js, TypeScript, full-stack development, AI integration, performance optimization, career advice, interview prep, và industry best practices!";
    }
  }
  
  // Add real blog posts information
  if (blogPosts.length > 0) {
    const recentPosts = blogPosts.map((p: { title: string; slug: string; excerpt: string | null; createdAt: Date; tags: string[] }) => 
      `"${p.title}"`
    ).join(', ');
    response += `\n\n**📖 Recent Posts:** ${recentPosts}`;
    response += `\n\n✨ Total ${blogPosts.length} published articles. Visit Blog section để đọc full content!`;
  } else {
    response += `\n\n🚀 Blog đang được phát triển với exciting content sắp tới. Stay tuned!`;
  }
  
  // Add blog categories
  const categories = [
    "💻 **Technical Tutorials:** Step-by-step guides, code examples",
    "🚀 **Performance:** Optimization techniques, best practices", 
    "🔧 **Tools & Workflows:** Development efficiency, productivity",
    "📈 **Career Growth:** Professional development, skill building",
    "🌟 **Industry Insights:** Trends, technology analysis"
  ];
  
  response += `\n\n**📂 Blog Categories:**\n${categories.join('\n')}`;
  
  return response;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';
    
    // Detect intent
    const intent = detectBlogIntent(query);
    
    // Lấy thông tin blog posts từ database
    const blogPosts = await prisma.blogPost.findMany({
      select: { 
        title: true, 
        excerpt: true, 
        slug: true,
        createdAt: true,
        tags: true
      },
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    // Generate enhanced response
    const response = generateBlogResponse(query, intent, blogPosts);

    return NextResponse.json({ 
      response,
      intent: intent,
      source: 'blog_service',
      blogPostsCount: blogPosts.length
    });

  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { error: 'Failed to get blog information' },
      { status: 500 }
    );
  }
}
