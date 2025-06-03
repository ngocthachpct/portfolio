import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 100+ Project-related prompts organized by categories
const PROJECT_PROMPTS = {
  // Specific Project Details (1-50)
  specific_projects: [
    // Portfolio Website Project
    { q: "portfolio website", a: "🌟 **Portfolio Website with AI Chatbot**\n\n**Mô tả:** Website portfolio cá nhân với AI chatbot thông minh tích hợp\n\n🔧 **Tech Stack:**\n• Frontend: Next.js 15, React, TypeScript, Tailwind CSS\n• Backend: Node.js, PostgreSQL, Prisma ORM\n• AI: Custom NLP, Machine Learning algorithms\n• Deploy: Vercel, Docker\n\n✨ **Features:**\n• AI Chatbot với learning capabilities\n• Admin dashboard quản lý content\n• Blog system với markdown support\n• Responsive design cho mọi device\n• Real-time chat với database storage\n• Performance optimization\n\n🎯 **Highlights:** Đây là dự án showcase comprehensive full-stack skills với AI integration!" },
    
    { q: "weather dashboard", a: "🌤️ **Weather Dashboard Application**\n\n**Mô tả:** Ứng dụng thời tiết real-time với charts và forecasting\n\n🔧 **Tech Stack:**\n• Frontend: React, Chart.js, Styled Components\n• API: OpenWeatherMap API, geolocation API\n• State: Redux Toolkit\n• Tools: Axios, Moment.js\n\n✨ **Features:**\n• Real-time weather data cho multiple cities\n• 7-day weather forecast\n• Interactive weather charts\n• Geolocation-based weather\n• Favorite cities management\n• Responsive mobile design\n• Dark/Light theme toggle\n\n🎯 **Challenges:** API integration, data visualization, performance optimization với large datasets" },
    
    { q: "e-commerce platform", a: "🛒 **E-commerce Platform**\n\n**Mô tả:** Full-stack e-commerce solution với payment integration\n\n🔧 **Tech Stack:**\n• Frontend: Next.js, TypeScript, Tailwind CSS\n• Backend: Node.js, Express, MongoDB\n• Payment: Stripe API\n• Auth: JWT, bcrypt\n• Deploy: AWS EC2, S3\n\n✨ **Features:**\n• Product catalog với search và filtering\n• Shopping cart và checkout process\n• User authentication và profiles\n• Admin dashboard cho inventory management\n• Order tracking system\n• Payment processing với Stripe\n• Email notifications\n• Reviews và ratings system\n\n🎯 **Learning:** Payment integration, security best practices, scalable architecture" },
    
    { q: "task management app", a: "📋 **Task Management Application**\n\n**Mô tả:** Productivity app với team collaboration features\n\n🔧 **Tech Stack:**\n• Frontend: React, Material-UI, Framer Motion\n• Backend: Node.js, GraphQL, PostgreSQL\n• Real-time: Socket.io\n• State: Apollo Client\n\n✨ **Features:**\n• Drag-and-drop task boards (Kanban style)\n• Team collaboration với real-time updates\n• Task assignment và deadline tracking\n• File attachments và comments\n• Time tracking functionality\n• Project analytics và reporting\n• Mobile-responsive design\n• Offline capability với sync\n\n🎯 **Innovation:** Real-time collaboration, intuitive UX/UI, performance optimization" },
    
    { q: "social media app", a: "📱 **Social Media Application**\n\n**Mô tả:** Social platform với real-time messaging và content sharing\n\n🔧 **Tech Stack:**\n• Frontend: React Native, Expo\n• Backend: Node.js, Socket.io, Redis\n• Database: MongoDB, Cloudinary\n• Real-time: WebSocket connections\n\n✨ **Features:**\n• User profiles với photo/video sharing\n• Real-time messaging và group chats\n• News feed với like, comment, share\n• Story features với 24h expiry\n• Push notifications\n• Image/video upload với optimization\n• Follow/unfollow system\n• Search users và content\n\n🎯 **Complexity:** Real-time features, media handling, scalable architecture cho nhiều users" },
    
    { q: "blog platform", a: "✍️ **Blog Publishing Platform**\n\n**Mô tả:** CMS platform cho bloggers với advanced features\n\n🔧 **Tech Stack:**\n• Frontend: Next.js, MDX, Tailwind CSS\n• Backend: Node.js, PostgreSQL\n• Editor: Rich text editor với markdown\n• SEO: Next.js built-in optimization\n\n✨ **Features:**\n• Rich text editor với markdown support\n• SEO optimization cho better ranking\n• Comment system với moderation\n• Tag và category management\n• Author profiles và multi-author support\n• Newsletter subscription\n• Analytics dashboard\n• Social media integration\n\n🎯 **Focus:** Content management, SEO optimization, user experience cho both writers và readers" },
    
    { q: "cryptocurrency tracker", a: "💰 **Cryptocurrency Tracker**\n\n**Mô tả:** Real-time crypto monitoring với portfolio management\n\n🔧 **Tech Stack:**\n• Frontend: React, Chart.js, Styled Components\n• API: CoinGecko API, WebSocket\n• State: Context API, Local Storage\n• Charts: TradingView widgets\n\n✨ **Features:**\n• Real-time price tracking cho 1000+ cryptocurrencies\n• Portfolio management với P&L calculation\n• Price alerts và notifications\n• Historical data charts\n• Market analysis tools\n• News integration\n• Watchlist functionality\n• Mobile-responsive design\n\n🎯 **Challenges:** Real-time data handling, complex calculations, data visualization" },
    
    { q: "recipe app", a: "👨‍🍳 **Recipe Sharing Application**\n\n**Mô tả:** Platform chia sẻ công thức nấu ăn với community features\n\n🔧 **Tech Stack:**\n• Frontend: React, Material-UI\n• Backend: Node.js, Express, MongoDB\n• Image: Cloudinary integration\n• Search: Elasticsearch\n\n✨ **Features:**\n• Recipe creation với photo upload\n• Advanced search với ingredients, cuisine, difficulty\n• Rating và review system\n• Meal planning calendar\n• Shopping list generator\n• Nutrition information\n• Social features: follow chefs, share recipes\n• Recipe collections và favorites\n\n🎯 **Innovation:** Smart search algorithms, user-generated content management, community building" },
    
    { q: "fitness tracker", a: "💪 **Fitness Tracking Application**\n\n**Mô tả:** Health và fitness monitoring với workout planning\n\n🔧 **Tech Stack:**\n• Frontend: React Native, NativeBase\n• Backend: Node.js, PostgreSQL\n• Charts: Victory Native\n• Health: HealthKit/Google Fit integration\n\n✨ **Features:**\n• Workout tracking với exercise database\n• Progress charts và analytics\n• Meal logging với calorie counting\n• Goal setting và achievement tracking\n• Social challenges với friends\n• Wearable device integration\n• Custom workout plans\n• Health data visualization\n\n🎯 **Learning:** Mobile development, health data integration, user motivation features" },
    
    { q: "music streaming app", a: "🎵 **Music Streaming Platform**\n\n**Mô tả:** Music streaming service với playlist management\n\n🔧 **Tech Stack:**\n• Frontend: React, Web Audio API\n• Backend: Node.js, Express, AWS S3\n• Database: MongoDB, Redis caching\n• Real-time: Socket.io\n\n✨ **Features:**\n• Music streaming với high-quality audio\n• Playlist creation và sharing\n• Music discovery algorithms\n• Offline download capability\n• Social features: follow artists, share music\n• Audio visualization\n• Lyrics integration\n• Cross-platform synchronization\n\n🎯 **Complexity:** Audio streaming optimization, recommendation algorithms, large-scale data handling" }  ],

  // General Projects Questions
  projects_general: [
    { q: "Bạn có những dự án gì?", a: "Tôi có nhiều dự án thú vị bao gồm web applications, mobile apps, và các tools hữu ích. Bạn muốn xem dự án nào cụ thể?" },
    { q: "Show me your projects", a: "I have several exciting projects including full-stack web applications, AI-powered tools, and mobile applications. Which type interests you most?" },
    { q: "Dự án nào hay nhất?", a: "Mỗi dự án đều có điểm mạnh riêng! Portfolio website này showcase full-stack skills, trong khi AI chatbot demonstrate machine learning capabilities." },
    { q: "What's your best project?", a: "My portfolio website with AI chatbot is quite comprehensive, showcasing both technical skills and user experience design. Would you like to see the details?" },
    { q: "Có bao nhiêu dự án?", a: "Hiện tại tôi có khoảng 10+ dự án hoàn thiện và đang phát triển thêm. Từ web apps đến mobile apps và AI tools!" },
    { q: "How many projects do you have?", a: "I have 10+ completed projects and several in development, ranging from web applications to AI-powered tools and mobile apps." },
    { q: "Dự án mới nhất là gì?", a: "Dự án mới nhất là AI Portfolio Chatbot này - một chatbot thông minh có khả năng học hỏi và cải thiện từ các cuộc hội thoại!" },
    { q: "What's your latest project?", a: "My latest project is this AI Portfolio Chatbot - an intelligent assistant that learns and improves from conversations!" },
    { q: "Portfolio website có gì đặc biệt?", a: "Portfolio này có AI chatbot tích hợp, responsive design, admin dashboard, blog system, và learning capabilities!" },
    { q: "What makes your portfolio special?", a: "This portfolio features an AI chatbot, responsive design, admin dashboard, blog system, and self-learning capabilities!" },
    { q: "Dự án nào khó nhất?", a: "AI Chatbot với learning system là thách thức lớn nhất - phải implement natural language processing, machine learning, và database optimization." },
    { q: "Which project was most challenging?", a: "The AI Chatbot with learning system was the most challenging - implementing NLP, machine learning, and database optimization." },
    { q: "Có làm dự án nhóm không?", a: "Có! Tôi đã tham gia nhiều dự án nhóm, học được collaboration, git workflow, và team communication skills." },
    { q: "Any team projects?", a: "Yes! I've participated in several team projects, learning collaboration, git workflow, and team communication skills." },
    { q: "Dự án nào được nhiều người dùng nhất?", a: "Portfolio website này đang được nhiều recruiters và developers quan tâm, đặc biệt là tính năng AI chatbot!" },
    { q: "Which project has most users?", a: "This portfolio website is getting attention from recruiters and developers, especially the AI chatbot feature!" },
    { q: "Có open source projects không?", a: "Có nhiều projects open source trên GitHub! Tôi tin vào việc sharing knowledge và contribute to community." },
    { q: "Any open source projects?", a: "Yes, many projects are open source on GitHub! I believe in sharing knowledge and contributing to the community." },
    { q: "Dự án có responsive design không?", a: "Tất cả dự án đều responsive và mobile-friendly! UX/UI luôn là priority trong development process." },
    { q: "Are your projects responsive?", a: "All projects are responsive and mobile-friendly! UX/UI is always a priority in my development process." }
  ],

  // Technology Stack Questions
  techstack: [
    { q: "Dùng công nghệ gì?", a: "Tech stack chính: React, Next.js, TypeScript, Node.js, PostgreSQL, Prisma, Tailwind CSS, và nhiều tools khác!" },
    { q: "What technologies do you use?", a: "Main tech stack: React, Next.js, TypeScript, Node.js, PostgreSQL, Prisma, Tailwind CSS, and many other tools!" },
    { q: "Frontend framework nào?", a: "Chủ yếu sử dụng React với Next.js cho SSR/SSG, TypeScript cho type safety, và Tailwind CSS cho styling." },
    { q: "What frontend frameworks?", a: "Primarily React with Next.js for SSR/SSG, TypeScript for type safety, and Tailwind CSS for styling." },
    { q: "Backend technology?", a: "Node.js với Express/Next.js API routes, PostgreSQL database, Prisma ORM, và các authentication systems." },
    { q: "Database nào?", a: "PostgreSQL cho production, với Prisma ORM để type-safe database queries và migrations." },
    { q: "What database?", a: "PostgreSQL for production, with Prisma ORM for type-safe database queries and migrations." },
    { q: "Có dùng cloud services?", a: "Có! AWS, Vercel, Netlify cho deployment, Cloudinary cho image management, và các CDN services." },
    { q: "Any cloud services?", a: "Yes! AWS, Vercel, Netlify for deployment, Cloudinary for image management, and various CDN services." },
    { q: "Mobile development?", a: "React Native cho cross-platform mobile apps, cũng có experience với Flutter và native development." },
    { q: "UI/UX tools?", a: "Figma cho design, Tailwind CSS cho styling, Framer Motion cho animations, và nhiều UI libraries." },
    { q: "Testing frameworks?", a: "Jest, React Testing Library, Cypress cho E2E testing, và Postman cho API testing." },
    { q: "DevOps tools?", a: "Docker cho containerization, GitHub Actions cho CI/CD, và various monitoring tools." },
    { q: "Version control?", a: "Git với GitHub/GitLab, follow gitflow workflow, và có experience với collaborative development." },
    { q: "API development?", a: "RESTful APIs với Express/Next.js, GraphQL, webhook integrations, và API documentation." },
    { q: "State management?", a: "Redux Toolkit, Zustand, React Context, và server state với React Query/SWR." },
    { q: "CSS frameworks?", a: "Tailwind CSS primarily, cũng có experience với Bootstrap, Material-UI, và custom CSS." },
    { q: "Build tools?", a: "Webpack, Vite, Next.js built-in bundling, và various optimization tools." },
    { q: "Authentication?", a: "NextAuth.js, JWT tokens, OAuth integrations, và secure session management." },
    { q: "Performance optimization?", a: "Code splitting, lazy loading, image optimization, caching strategies, và performance monitoring." }
  ],

  // GitHub & Source Code Questions
  github: [
    { q: "GitHub profile?", a: "Bạn có thể xem tất cả projects trên GitHub của tôi! Có nhiều open source projects và contributions." },
    { q: "Source code available?", a: "Most projects have source code available on GitHub! I believe in open source and knowledge sharing." },
    { q: "Can I see the code?", a: "Absolutely! Check out my GitHub repositories for detailed code examples and documentation." },
    { q: "GitHub contributions?", a: "I'm actively contributing to open source projects and maintaining my own repositories with regular commits." },
    { q: "Code quality?", a: "I follow best practices: clean code, proper documentation, testing, and code reviews." },
    { q: "Repository organization?", a: "Repos are well-organized with README files, proper folder structure, and clear documentation." },
    { q: "Collaboration experience?", a: "Extensive experience with pull requests, code reviews, issue management, và team workflows." },
    { q: "Git workflow?", a: "Follow gitflow methodology với feature branches, proper commit messages, và merge strategies." },
    { q: "Documentation?", a: "Comprehensive documentation in README files, inline comments, và API documentation." },
    { q: "Code reviews?", a: "Regular code reviews for quality assurance, knowledge sharing, và maintaining standards." },
    { q: "Issue tracking?", a: "Use GitHub Issues for bug tracking, feature requests, và project management." },
    { q: "Deployment from GitHub?", a: "CI/CD pipelines with GitHub Actions for automated testing và deployment." },
    { q: "License usage?", a: "Proper licensing for open source projects, usually MIT or Apache licenses." },
    { q: "Fork contributions?", a: "Active in forking và contributing to other open source projects." },
    { q: "Repository maintenance?", a: "Regular updates, dependency management, security patches, và feature additions." },
    { q: "Branch management?", a: "Proper branch naming conventions, feature branches, và clean merge history." },
    { q: "Commit messages?", a: "Descriptive commit messages following conventional commit format." },
    { q: "GitHub Pages?", a: "Some projects deployed on GitHub Pages for easy demonstration và testing." },
    { q: "Repository templates?", a: "Created reusable templates for quick project setup và best practices." },
    { q: "GitHub stars?", a: "Several repositories have received stars và positive feedback from community." }
  ],

  // Demo & Live Projects Questions
  demo: [
    { q: "Có demo live không?", a: "Có! Portfolio này chính là demo live, bạn đang tương tác với AI chatbot real-time!" },
    { q: "Can I see live demo?", a: "Yes! This portfolio is a live demo, you're interacting with the AI chatbot in real-time!" },
    { q: "Live website?", a: "Portfolio website này đang live, với đầy đủ features: chatbot, blog, admin dashboard!" },
    { q: "Working examples?", a: "All projects have working examples - từ simple web apps đến complex AI systems!" },
    { q: "Demo environment?", a: "Demo environments available for testing without affecting production data." },
    { q: "Test the features?", a: "Feel free to test all features! Chat with AI, browse projects, read blog posts!" },
    { q: "Interactive demo?", a: "This chatbot is interactive demo - ask questions và see AI responses in real-time!" },
    { q: "Mobile demo?", a: "Portfolio is mobile-responsive, try accessing on different devices!" },
    { q: "Performance demo?", a: "Notice the fast loading times và smooth interactions - optimized for performance!" },
    { q: "Feature showcase?", a: "Every feature is showcased: responsive design, AI chat, admin panel, blog system!" },
    { q: "Real-time features?", a: "AI chatbot provides real-time responses với learning capabilities!" },
    { q: "Demo data?", a: "Using real portfolio data với sample projects và blog posts for authentic experience." },
    { q: "User experience demo?", a: "Navigate through different sections to experience the full UX/UI design!" },
    { q: "API demo?", a: "APIs powering this chatbot và other features are working live!" },
    { q: "Database demo?", a: "Real database operations - messages are saved và chatbot learns from interactions!" },
    { q: "Responsive demo?", a: "Try resizing browser window to see responsive design in action!" },
    { q: "Speed demo?", a: "Notice the fast page loads thanks to Next.js optimization và performance tuning!" },
    { q: "Search demo?", a: "Use the search functionality to find specific projects or blog posts!" },
    { q: "Admin demo?", a: "Admin dashboard available for content management (restricted access)." },
    { q: "Integration demo?", a: "Various integrations working: email, social media, analytics, monitoring!" }
  ],

  // Project Details Questions
  project_details: [
    { q: "Chi tiết dự án?", a: "Mỗi dự án có detailed documentation, tech stack, features, và learning outcomes!" },
    { q: "Project architecture?", a: "Follow modern architecture patterns: component-based, modular design, clean code principles!" },
    { q: "Development process?", a: "Agile methodology với planning, development, testing, deployment, và iteration phases!" },
    { q: "Project timeline?", a: "Typical project timeline: 2-8 weeks depending on complexity và scope." },
    { q: "Team size?", a: "Solo projects và team projects with 2-5 members, each with defined roles." },
    { q: "Budget considerations?", a: "Cost-effective solutions using free/open source tools where possible." },
    { q: "Scalability?", a: "Projects designed for scalability với proper architecture và optimization." },
    { q: "Security measures?", a: "Security best practices: authentication, authorization, data encryption, input validation!" },
    { q: "Testing approach?", a: "Comprehensive testing: unit tests, integration tests, E2E testing, user acceptance testing!" },
    { q: "Deployment strategy?", a: "Modern deployment: CI/CD pipelines, containerization, cloud hosting, monitoring!" },
    { q: "User feedback?", a: "Positive user feedback highlighting usability, performance, và feature completeness!" },
    { q: "Lessons learned?", a: "Each project teaches new skills: technical knowledge, problem-solving, user experience!" },
    { q: "Future improvements?", a: "Continuous improvement plans: new features, performance optimization, user experience!" },
    { q: "Maintenance plan?", a: "Regular maintenance: updates, security patches, feature additions, bug fixes!" },
    { q: "Documentation quality?", a: "Comprehensive documentation: technical specs, user guides, API documentation!" },
    { q: "Code structure?", a: "Clean, modular code structure with proper separation of concerns!" },
    { q: "Error handling?", a: "Robust error handling với user-friendly messages và logging for debugging!" },
    { q: "Performance metrics?", a: "Great performance metrics: fast loading, smooth interactions, efficient queries!" },
    { q: "Browser compatibility?", a: "Cross-browser compatibility ensuring consistent experience across platforms!" },    { q: "Accessibility features?", a: "Accessibility considerations: keyboard navigation, screen reader support, WCAG compliance!" }
  ]
};

// Get projects from database
async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Enhanced intent detection for projects
function detectProjectIntent(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Check for specific project names
  if (lowerQuery.includes('portfolio') || lowerQuery.includes('website') || lowerQuery.includes('chatbot')) {
    return 'specific_projects';
  }
  if (lowerQuery.includes('weather') || lowerQuery.includes('thời tiết')) {
    return 'specific_projects';
  }
  if (lowerQuery.includes('e-commerce') || lowerQuery.includes('shop') || lowerQuery.includes('bán hàng')) {
    return 'specific_projects';
  }
  if (lowerQuery.includes('task') || lowerQuery.includes('todo') || lowerQuery.includes('công việc')) {
    return 'specific_projects';
  }
  if (lowerQuery.includes('social media') || lowerQuery.includes('mạng xã hội')) {
    return 'specific_projects';
  }
  if (lowerQuery.includes('blog') || lowerQuery.includes('viết')) {
    return 'specific_projects';
  }
  if (lowerQuery.includes('crypto') || lowerQuery.includes('bitcoin') || lowerQuery.includes('tiền ảo')) {
    return 'specific_projects';
  }
  if (lowerQuery.includes('recipe') || lowerQuery.includes('món ăn') || lowerQuery.includes('nấu ăn')) {
    return 'specific_projects';
  }
  if (lowerQuery.includes('fitness') || lowerQuery.includes('gym') || lowerQuery.includes('tập gym')) {
    return 'specific_projects';
  }
  if (lowerQuery.includes('music') || lowerQuery.includes('nhạc') || lowerQuery.includes('streaming')) {
    return 'specific_projects';
  }
  
  if (lowerQuery.includes('demo') || lowerQuery.includes('live') || lowerQuery.includes('xem')) {
    return 'demo';
  }
  if (lowerQuery.includes('github') || lowerQuery.includes('source') || lowerQuery.includes('code')) {
    return 'github';
  }
  if (lowerQuery.includes('tech') || lowerQuery.includes('công nghệ') || lowerQuery.includes('framework')) {
    return 'techstack';
  }
  if (lowerQuery.includes('chi tiết') || lowerQuery.includes('detail') || lowerQuery.includes('architecture')) {
    return 'project_details';
  }
  
  return 'projects_general';
}

// Find best matching response for specific projects
function findSpecificProjectResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Portfolio/Website/Chatbot
  if (lowerQuery.includes('portfolio') || lowerQuery.includes('website') || lowerQuery.includes('chatbot')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('portfolio website'))?.a || "Portfolio project info not found";
  }
  
  // Weather Dashboard
  if (lowerQuery.includes('weather') || lowerQuery.includes('thời tiết')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('weather dashboard'))?.a || "Weather dashboard project info not found";
  }
  
  // E-commerce
  if (lowerQuery.includes('e-commerce') || lowerQuery.includes('shop') || lowerQuery.includes('bán hàng')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('e-commerce platform'))?.a || "E-commerce project info not found";
  }
  
  // Task Management
  if (lowerQuery.includes('task') || lowerQuery.includes('todo') || lowerQuery.includes('công việc')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('task management'))?.a || "Task management project info not found";
  }
  
  // Social Media
  if (lowerQuery.includes('social media') || lowerQuery.includes('mạng xã hội')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('social media'))?.a || "Social media project info not found";
  }
  
  // Blog Platform
  if (lowerQuery.includes('blog') || lowerQuery.includes('viết')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('blog platform'))?.a || "Blog platform project info not found";
  }
  
  // Cryptocurrency
  if (lowerQuery.includes('crypto') || lowerQuery.includes('bitcoin') || lowerQuery.includes('tiền ảo')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('cryptocurrency'))?.a || "Cryptocurrency project info not found";
  }
  
  // Recipe App
  if (lowerQuery.includes('recipe') || lowerQuery.includes('món ăn') || lowerQuery.includes('nấu ăn')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('recipe'))?.a || "Recipe app project info not found";
  }
  
  // Fitness Tracker
  if (lowerQuery.includes('fitness') || lowerQuery.includes('gym') || lowerQuery.includes('tập gym')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('fitness'))?.a || "Fitness tracker project info not found";
  }
  
  // Music Streaming
  if (lowerQuery.includes('music') || lowerQuery.includes('nhạc') || lowerQuery.includes('streaming')) {
    return PROJECT_PROMPTS.specific_projects.find(p => p.q.includes('music streaming'))?.a || "Music streaming project info not found";
  }
  
  return "Tôi chưa có thông tin chi tiết về dự án này. Bạn có thể hỏi về: Portfolio Website, Weather Dashboard, E-commerce Platform, Task Management App, Social Media App, Blog Platform, Cryptocurrency Tracker, Recipe App, Fitness Tracker, hoặc Music Streaming App.";
}

// Find best matching response
function findBestResponse(query: string, intent: string) {
  // Handle specific project queries
  if (intent === 'specific_projects') {
    return findSpecificProjectResponse(query);
  }
  
  const prompts = PROJECT_PROMPTS[intent as keyof typeof PROJECT_PROMPTS] || PROJECT_PROMPTS.projects_general;
  
  // Try to find exact or partial match
  for (const prompt of prompts) {
    const similarity = calculateSimilarity(query.toLowerCase(), prompt.q.toLowerCase());
    if (similarity > 0.3) {
      return prompt.a;
    }
  }
  
  // Return random response from category
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  return randomPrompt.a;
}

// Calculate text similarity
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  return intersection.length / union.length;
}

// Enhanced response with project data
async function generateProjectResponse(query: string, intent: string) {
  const baseResponse = findBestResponse(query, intent);
  const projects = await getProjects();
  
  let enhancedResponse = baseResponse;
  
  // For specific project queries, return detailed response directly
  if (intent === 'specific_projects') {
    enhancedResponse += "\n\n💡 **Muốn biết thêm?** Hỏi về:\n";
    enhancedResponse += "• Tech stack chi tiết\n";
    enhancedResponse += "• Demo live hoặc source code\n";
    enhancedResponse += "• Challenges và solutions\n";
    enhancedResponse += "• Các dự án khác";
    return enhancedResponse;
  }
  
  // Add project list for general queries
  if (intent === 'projects_general' && projects.length > 0) {
    enhancedResponse += "\n\n📂 **Recent Projects:**\n";
    projects.slice(0, 3).forEach((project, index) => {
      enhancedResponse += `${index + 1}. **${project.title}** - ${project.description}\n`;
    });
    enhancedResponse += "\n💬 **Dự án bạn muốn biết chi tiết:**\n";
    enhancedResponse += "• Portfolio Website (với AI Chatbot)\n";
    enhancedResponse += "• Weather Dashboard\n";
    enhancedResponse += "• E-commerce Platform\n";
    enhancedResponse += "• Task Management App\n";
    enhancedResponse += "• Social Media App\n";
    enhancedResponse += "• Blog Platform\n";
    enhancedResponse += "• Cryptocurrency Tracker\n";
    enhancedResponse += "• Recipe App\n";
    enhancedResponse += "• Fitness Tracker\n";
    enhancedResponse += "• Music Streaming App\n";
    enhancedResponse += "\nVí dụ: 'Cho tôi thông tin về Weather Dashboard'";
  }
  
  // Add tech stack info
  if (intent === 'techstack') {
    enhancedResponse += "\n\n⚡ **Main Tech Stack:**\n";
    enhancedResponse += "• Frontend: React, Next.js, TypeScript, Tailwind CSS\n";
    enhancedResponse += "• Backend: Node.js, PostgreSQL, Prisma\n";
    enhancedResponse += "• Tools: Docker, GitHub Actions, Vercel\n";
    enhancedResponse += "• AI/ML: OpenAI API, Custom Learning System";
  }
  
  return enhancedResponse;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    if (!query) {
      return NextResponse.json({ 
        error: 'Query parameter required' 
      }, { status: 400 });
    }

    const intent = detectProjectIntent(query);
    const response = await generateProjectResponse(query, intent);
    
    return NextResponse.json({
      response,
      intent,
      source: 'projects_service',
      confidence: 0.9,
      category: 'projects'
    });

  } catch (error) {
    console.error('Projects service error:', error);
    return NextResponse.json({
      response: "Xin lỗi, tôi gặp lỗi khi lấy thông tin projects. Hãy thử lại!",
      intent: 'error',
      source: 'projects_error',
      confidence: 0.1
    }, { status: 500 });
  }
}
