import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 100 Skills-related prompts organized by categories
const SKILLS_PROMPTS = {
  // Frontend Skills (1-25): Frontend technologies and frameworks
  frontend: [
    "Frontend expertise: React, Next.js, TypeScript với modern development practices.",
    "Advanced React hooks, context API, state management với Redux và Zustand.",
    "Next.js mastery: SSR, SSG, ISR, App Router, API routes với performance optimization.",
    "TypeScript proficiency với type safety, interfaces, generics trong large applications.",
    "Modern CSS: Tailwind CSS, CSS Modules, Styled Components, responsive design.",
    "JavaScript ES6+: async/await, destructuring, modules, arrow functions, closures.",
    "HTML5 semantic markup với accessibility best practices và SEO optimization.",
    "CSS Grid và Flexbox mastery cho complex layouts và responsive design.",
    "Frontend build tools: Webpack, Vite, ESBuild với module bundling optimization.",
    "Component libraries: Material-UI, Ant Design, Chakra UI customization.",
    "State management patterns: Redux Toolkit, Zustand, Jotai, React Query.",
    "Form handling: React Hook Form, Formik với validation và error handling.",
    "Animation libraries: Framer Motion, React Spring cho smooth user interactions.",
    "Testing frontend: Jest, React Testing Library, Cypress cho component testing.",
    "Progressive Web Apps: Service Workers, manifest files, offline functionality.",
    "Browser APIs: Local Storage, Session Storage, IndexedDB, Geolocation.",
    "Frontend performance: Code splitting, lazy loading, image optimization.",
    "CSS preprocessors: Sass, Less với variables, mixins, nested rules.",
    "Frontend security: XSS prevention, CSRF protection, content security policy.",
    "Responsive design: Mobile-first approach, breakpoints, flexible layouts.",
    "Web accessibility: ARIA labels, keyboard navigation, screen reader support.",
    "Frontend debugging: Chrome DevTools, React DevTools, performance profiling.",
    "Module federation với micro-frontends architecture cho scalable applications.",
    "Frontend deployment: Vercel, Netlify, AWS CloudFront với CI/CD integration.",
    "Design systems implementation với consistent UI components và style guides."
  ],

  // Backend Skills (26-50): Backend technologies and server-side development
  backend: [
    "Backend proficiency: Node.js, Express.js với RESTful API development.",
    "Database expertise: PostgreSQL, MongoDB, MySQL với query optimization.",
    "API design: REST, GraphQL, OpenAPI documentation với best practices.",
    "Authentication: JWT, OAuth, session management, password hashing với bcrypt.",
    "Server-side rendering với Next.js API routes và middleware implementation.",
    "Database ORMs: Prisma, Sequelize, Mongoose với schema design.",
    "Microservices architecture với service communication và load balancing.",
    "Caching strategies: Redis, Memcached, CDN implementation cho performance.",
    "Message queues: RabbitMQ, Apache Kafka cho asynchronous processing.",
    "Server deployment: Docker containerization, Kubernetes orchestration.",
    "API security: Rate limiting, input validation, SQL injection prevention.",
    "Background jobs: Bull Queue, Agenda.js cho scheduled tasks.",
    "File upload handling: Multer, AWS S3 integration với image processing.",
    "Real-time communication: WebSockets, Socket.io cho live features.",
    "Server monitoring: Logging, error tracking với Winston, Sentry.",
    "Database migrations: Schema versioning, data seeding với automated scripts.",
    "API testing: Postman, Jest, Supertest cho endpoint validation.",
    "Server optimization: Connection pooling, query optimization, indexing.",
    "Environment configuration: dotenv, config management cho multiple environments.",
    "CORS handling, request parsing, middleware composition trong Express.",
    "Serverless functions: AWS Lambda, Vercel Functions với event-driven architecture.",
    "Database relationships: Foreign keys, joins, transactions với ACID properties.",
    "API versioning strategies và backward compatibility maintenance.",
    "Server-side validation với schema validation libraries như Joi, Yup.",
    "Backend logging và monitoring với structured logging và observability."
  ],

  // DevOps Skills (51-75): Deployment, CI/CD, and infrastructure
  devops: [
    "DevOps proficiency: CI/CD pipelines với GitHub Actions, GitLab CI.",
    "Docker containerization: Dockerfile, docker-compose, multi-stage builds.",
    "Cloud platforms: AWS, Azure, Google Cloud với infrastructure management.",
    "Kubernetes orchestration: Pods, Services, Deployments với scalability.",
    "Infrastructure as Code: Terraform, AWS CloudFormation cho reproducible deployments.",
    "Version control: Git workflows, branching strategies, code review processes.",
    "Monitoring và logging: Prometheus, Grafana, ELK stack cho system observability.",
    "Load balancing: Nginx, Apache, AWS ALB với traffic distribution.",
    "Database administration: Backup strategies, replication, performance tuning.",
    "Security practices: SSL/TLS, firewall configuration, vulnerability scanning.",
    "Automated testing: Unit, integration, end-to-end testing trong CI pipelines.",
    "Environment management: Development, staging, production với configuration.",
    "Performance monitoring: APM tools, metrics collection, alerting systems.",
    "Disaster recovery: Backup strategies, failover mechanisms, RTO/RPO planning.",
    "Container registries: Docker Hub, AWS ECR với image versioning.",
    "Serverless deployment: AWS Lambda, Azure Functions với event triggers.",
    "CDN configuration: CloudFlare, AWS CloudFront cho global content delivery.",
    "Database scaling: Read replicas, sharding, connection pooling strategies.",
    "Secret management: AWS Secrets Manager, HashiCorp Vault cho sensitive data.",
    "Network configuration: VPC, subnets, security groups trong cloud environments.",
    "Continuous monitoring: Health checks, uptime monitoring, performance metrics.",
    "Blue-green deployments và canary releases cho zero-downtime updates.",
    "Log aggregation và analysis với centralized logging solutions.",
    "Cost optimization: Resource monitoring, auto-scaling, reserved instances.",
    "Compliance và security auditing trong cloud environments."
  ],

  // Tools & Technologies (76-100): Development tools and emerging technologies
  tools_tech: [
    "Development tools: VS Code, Git, npm/yarn, ESLint, Prettier configuration.",
    "Design tools: Figma, Adobe XD integration với developer handoff workflows.",
    "Project management: Jira, Trello, Notion với agile methodology implementation.",
    "Code quality: SonarQube, CodeClimate với automated code analysis.",
    "Documentation: Markdown, JSDoc, Storybook cho component documentation.",
    "Package management: npm, yarn, pnpm với dependency management.",
    "Build tools: Webpack, Rollup, ESBuild với optimization configurations.",
    "Testing frameworks: Jest, Mocha, Chai với comprehensive test suites.",
    "API documentation: Swagger, Postman với interactive API exploration.",
    "Performance tools: Lighthouse, WebPageTest, Bundle Analyzer.",
    "Database tools: pgAdmin, MongoDB Compass, DataGrip.",
    "Communication: Slack, Discord, Microsoft Teams integration.",
    "Browser extensions development với manifest v3 và cross-browser compatibility.",
    "Chrome DevTools advanced usage: Performance profiling, memory analysis.",
    "Command line proficiency: Bash, PowerShell scripting automation.",
    "Regular expressions: Pattern matching, text processing, validation.",
    "JSON manipulation: Parsing, transformation, schema validation.",
    "HTTP protocols: Request/response cycles, status codes, headers.",
    "Web standards: W3C guidelines, semantic HTML, progressive enhancement.",
    "Code editors: Custom configurations, extensions, productivity workflows.",
    "Debugging techniques: Breakpoints, stack traces, error handling strategies.",
    "Data formats: JSON, XML, CSV processing với parsing libraries.",
    "Web scraping: Puppeteer, Cheerio cho automated data extraction.",
    "Mobile development: React Native, responsive design principles.",
    "Emerging technologies: Web3, AI/ML integration, PWA development."
  ]
};

function detectIntent(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Frontend related
  if (lowerQuery.includes('frontend') || lowerQuery.includes('react') || 
      lowerQuery.includes('javascript') || lowerQuery.includes('css') ||
      lowerQuery.includes('html') || lowerQuery.includes('ui') ||
      lowerQuery.includes('component') || lowerQuery.includes('nextjs')) {
    return 'frontend';
  }
  
  // Backend related
  if (lowerQuery.includes('backend') || lowerQuery.includes('server') ||
      lowerQuery.includes('api') || lowerQuery.includes('database') ||
      lowerQuery.includes('nodejs') || lowerQuery.includes('express') ||
      lowerQuery.includes('mongodb') || lowerQuery.includes('postgresql')) {
    return 'backend';
  }
  
  // DevOps related
  if (lowerQuery.includes('devops') || lowerQuery.includes('deploy') ||
      lowerQuery.includes('docker') || lowerQuery.includes('cloud') ||
      lowerQuery.includes('aws') || lowerQuery.includes('ci/cd') ||
      lowerQuery.includes('kubernetes') || lowerQuery.includes('infrastructure')) {
    return 'devops';
  }
  
  // Tools & Tech related
  if (lowerQuery.includes('tool') || lowerQuery.includes('technology') ||
      lowerQuery.includes('framework') || lowerQuery.includes('library') ||
      lowerQuery.includes('software') || lowerQuery.includes('development')) {
    return 'tools_tech';
  }
  
  // Default to frontend
  return 'frontend';
}

function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  return intersection.length / union.length;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';
    
    // Detect intent từ query
    const intent = detectIntent(query);
    
    // Get prompts cho detected intent
    const prompts = SKILLS_PROMPTS[intent as keyof typeof SKILLS_PROMPTS];
    
    // Find most relevant prompt based on similarity
    let selectedPrompt = prompts[0]; // default
    if (query.trim()) {
      let maxSimilarity = 0;
      for (const prompt of prompts) {
        const similarity = calculateSimilarity(query, prompt);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          selectedPrompt = prompt;
        }
      }
    } else {
      // Random selection if no specific query
      selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    }

    // Lấy skills data từ database (if exists)
    let skillsData;
    try {
      // Note: Assuming you have a skills table, adjust if different
      skillsData = await prisma.$queryRaw`SELECT * FROM skills ORDER BY proficiency DESC LIMIT 10`;
    } catch (dbError) {
      console.log('Database not available, using static responses');
      skillsData = [];
    }

    // Build response với database info nếu có
    let response = selectedPrompt;
    if (Array.isArray(skillsData) && skillsData.length > 0) {
      const topSkills = skillsData.slice(0, 5).map((skill: any) => 
        `${skill.name} (${skill.proficiency}%)`
      ).join(', ');
      response += `\n\n🚀 Top Skills: ${topSkills}`;
    }

    return NextResponse.json({ 
      response,
      intent,
      source: 'skills_service',
      category: intent,
      skillsCount: Array.isArray(skillsData) ? skillsData.length : 0
    });

  } catch (error) {
    console.error('Skills API error:', error);
    return NextResponse.json(
      { 
        response: "Tôi có expertise trong full-stack development với strong skills trong React, Node.js, TypeScript, và modern web technologies. Luôn học hỏi và cập nhật những technology mới nhất.",
        intent: 'frontend',
        source: 'skills_service',
        error: 'Fallback response used'
      },
      { status: 200 }
    );
  }
}
