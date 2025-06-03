import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Helper function to fetch dynamic owner information from APIs
async function fetchOwnerInfo() {
  try {
    // Use correct base URL for production or development
    let baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    if (process.env.NODE_ENV === 'production') {
      baseUrl = 'https://portfolio-thacjs-projects.vercel.app';
    }
    // Fetch home content (for name from title), about content and contact info from database
    const [homeResponse, aboutResponse, contactResponse] = await Promise.all([
      fetch(`${baseUrl}/api/home`),
      fetch(`${baseUrl}/api/about`),
      fetch(`${baseUrl}/api/contact-info`)
    ]);

    const homeData = homeResponse.ok ? await homeResponse.json() : null;
    const aboutData = aboutResponse.ok ? await aboutResponse.json() : null;
    const contactData = contactResponse.ok ? await contactResponse.json() : null;    // Extract name from homepage title (e.g., "Hi, I'm Thach Nguyen" -> "Thach Nguyen")
    let extractedName = 'Portfolio Owner';
    if (homeData?.title) {
      const titleMatch = homeData.title.match(/(?:Hi,?\s*I'?m\s*|Hello,?\s*I'?m\s*|I'?m\s*|My name is\s*|Hello,?\s*I am\s*)(.+)|(.+)$/i);
      if (titleMatch) {
        // Take the first non-empty captured group
        extractedName = titleMatch[1] || titleMatch[2] || 'Portfolio Owner';
        extractedName = extractedName.trim();
      }
    }

    return {
      name: extractedName,
      title: homeData?.title || '',
      subtitle: homeData?.subtitle || '',
      email: contactData?.email || '',
      location: contactData?.address || 'Not specified',
      skills: aboutData?.skills || '',
      experience: aboutData?.experience || '',
      education: aboutData?.education || '',
      description: aboutData?.aboutDescription || homeData?.description || '',
      github: contactData?.githubUrl || '',
      linkedin: contactData?.linkedinUrl || '',
      twitter: contactData?.twitterUrl || ''
    };
  } catch (error) {
    console.error('Error fetching owner info:', error);
    // Return fallback data if API calls fail
    return {
      name: 'Portfolio Owner',
      title: '',
      subtitle: '',
      email: '',
      location: 'Not specified',
      skills: '',
      experience: '',
      education: '',
      description: '',
      github: '',
      linkedin: '',
      twitter: ''
    };
  }
}

// 120+ About-related prompts organized by categories
const ABOUT_PROMPTS = {
  // About General (1-20): Personal introduction and overview
  about_general: [
    "Tôi là một full-stack developer đam mê công nghệ với kinh nghiệm phát triển ứng dụng web hiện đại.",
    "Passionate developer với focus vào creating meaningful digital experiences through code.",
    "Có background trong computer science và kinh nghiệm thực tế trong software development.",
    "Self-motivated learner luôn tìm hiểu và áp dụng latest technologies vào projects.",
    "Problem solver với analytical mindset và creative approach to development challenges.",
    "Detail-oriented developer với passion for clean maintainable code và user-centric design.",
    "Tech enthusiast với curiosity about emerging technologies và their practical applications.",
    "Professional developer với strong foundation trong computer science fundamentals.",
    "Creative problem solver luôn tìm innovative solutions cho complex challenges.",
    "Collaborative team player với excellent communication skills và leadership potential.",
    "Continuous learner với growth mindset và dedication to professional development.",
    "Quality-focused developer với emphasis on performance security và accessibility.",
    "Adaptable professional với experience trong diverse industries và project types.",
    "Innovation-driven developer với interest trong cutting-edge technologies.",
    "Client-focused professional với understanding of business needs và user requirements.",
    "Reliable team member với strong work ethic và commitment to excellence.",
    "Analytical thinker với systematic approach to problem-solving và solution design.",
    "Technology advocate với passion for knowledge sharing và community contribution.",
    "Results-oriented developer với track record of successful project delivery.",
    "Versatile professional với expertise across full-stack development spectrum."  ],
  // Owner/Personal Information (21-40): Dynamic owner details from database
  generateOwnerInfo: (ownerData: any) => [
    `👤 **Tên:** ${ownerData.name} - Full-stack Developer với passion for technology và innovation.`,
    `📍 **Địa điểm:** ${ownerData.location || 'Việt Nam'}, open to remote opportunities worldwide.`,
    `📧 **Email liên hệ:** ${ownerData.email || 'Vui lòng liên hệ qua form contact'}`,
    `🎂 **Background:** Passionate developer với strong foundation trong computer science và practical experience.`,
    `🌟 **Chuyên môn:** ${ownerData.skills || 'Full-stack web development với expertise trong React, Next.js, TypeScript, Node.js, và modern web technologies.'}`,
    `💼 **Kinh nghiệm:** ${ownerData.experience || 'Freelance developer và personal project creator với focus vào innovative web solutions.'}`,
    `📚 **Học vấn:** ${ownerData.education || 'Computer Science background với continuous learning trong latest technologies.'}`,
    `🎯 **Sở thích cá nhân:** Technology exploration, coding challenges, learning new frameworks, và contributing to open source.`,
    `📚 **Học tập:** Continuous learner luôn update với latest technology trends và best practices trong development.`,
    `🤝 **Tính cách:** Friendly, collaborative, detail-oriented với strong communication skills và team spirit.`,
    `⚡ **Năng lượng:** High energy individual với enthusiasm for problem-solving và creating impactful digital experiences.`,
    `🌍 **Tầm nhìn:** Aspiring to become technical leader với global impact through innovative technology solutions.`,
    `🔥 **Đam mê:** Passionate về clean code, user experience, performance optimization, và cutting-edge technologies.`,
    `💡 **Khả năng:** Quick learner với ability to adapt to new technologies và work effectively trong diverse environments.`,
    `🎨 **Sáng tạo:** Creative problem solver với eye for design và focus on user-centric development approaches.`,
    `📈 **Mục tiêu:** Building meaningful digital products that solve real-world problems và create positive impact.`,
    `🚀 **Động lực:** Driven by curiosity về technology và desire to continuously improve skills và deliver excellence.`,
    `🏆 **Thành tựu:** Successfully delivered multiple projects từ conception to deployment với high quality standards.`,
    `💻 **Liên hệ:** ${ownerData.github ? `GitHub: ${ownerData.github}` : ''} ${ownerData.linkedin ? `LinkedIn: ${ownerData.linkedin}` : ''} ${ownerData.twitter ? `Twitter: ${ownerData.twitter}` : ''}`,
    `🌱 **Phát triển:** Always growing professionally through learning, practice, và engagement với developer community.`
  ],

  // Experience (41-60): Professional experience and work history
  experience: [
    "Kinh nghiệm làm việc từ junior đến senior developer với diverse project portfolio.",
    "Freelance experience với clients từ startups đến established businesses.",
    "Team collaboration trong agile environments với cross-functional teams.",
    "Remote work experience với international clients và distributed teams.",
    "Leadership experience trong technical decision making và project management.",
    "5+ years experience trong web development với focus on modern frameworks.",
    "Proven track record trong delivering high-quality software solutions on time.",
    "Experience với enterprise-level applications và scalable architecture design.",
    "Client relationship management với focus on long-term partnerships.",
    "Mentoring experience với junior developers và knowledge transfer.",
    "Cross-industry experience từ e-commerce đến healthcare applications.",
    "Startup environment experience với rapid development và iterative processes.",
    "Consulting experience với technical advisory và architecture recommendations.",
    "Full project lifecycle experience từ planning đến deployment và maintenance.",
    "Team lead experience với responsibility for technical decisions và code quality.",
    "International project experience với diverse cultural và technical requirements.",
    "Agile/Scrum experience với sprint planning stand-ups và retrospectives.",
    "Code review experience với focus on best practices và team learning.",
    "Performance optimization experience với large-scale application tuning.",
    "DevOps experience với CI/CD setup deployment automation và monitoring."
  ],
  // Education (61-80): Educational background and continuous learning
  education: [
    "Học vấn: Computer Science degree với focus vào software engineering và web development.",
    "Continuous learner với online courses từ platforms như Coursera Udemy Pluralsight.",
    "Certifications trong cloud computing database management và modern frameworks.",
    "Workshop attendance tech conferences và industry meetups for knowledge sharing.",
    "Self-study trong emerging technologies: AI/ML blockchain cloud architecture.",
    "Bachelor's degree trong Computer Science với specialization in software engineering.",
    "Professional certifications: AWS Azure Google Cloud Platform MongoDB.",
    "Online education través Coursera edX Udacity với completed specializations.",
    "Technical training programs trong enterprise technologies và frameworks.",
    "Conference attendance: React Conf Node.js Interactive JSConf tech meetups.",
    "Bootcamp completion trong full-stack development với hands-on projects.",
    "University projects trong algorithms data structures và software architecture.",
    "Research experience trong computer science topics và emerging technologies.",
    "Peer learning through study groups coding challenges và collaborative projects.",
    "Industry certification programs với focus on cloud technologies và DevOps.",
    "Hackathon participation với focus on rapid prototyping và innovation.",
    "Technical book reading: Clean Code Design Patterns System Design primers.",
    "YouTube channels podcasts blogs for staying current với technology trends.",
    "Open source contribution học hỏi from real-world codebases và projects.",
    "Language learning programs để improve communication trong international teams."
  ],
  // Values (81-100): Personal values and work approach
  values: [
    "Believe trong clean code principles maintainable architecture user-centric design.",
    "Advocate cho accessibility performance optimization security best practices.",
    "Test-driven development approach với comprehensive testing strategies.",
    "Agile methodology enthusiast với focus vào iterative improvement.",
    "Open source contributor với belief trong knowledge sharing community.",
    "Integrity trong code quality honest communication reliable delivery.",
    "Innovation through creative problem solving và exploring new approaches.",
    "Collaboration over competition với team-first mentality.",
    "Quality over quantity với focus on sustainable maintainable solutions.",
    "Learning mindset với humility và openness to feedback.",
    "Transparency trong project progress challenges và solution communication.",
    "Inclusivity và accessibility trong design decisions và team interactions.",
    "Sustainability trong development practices avoiding technical debt accumulation.",
    "User empathy với focus on creating meaningful usable experiences.",
    "Professional ethics với honest estimation clear communication reliable behavior.",
    "Knowledge sharing culture với documentation mentoring và community contribution.",
    "Work-life balance advocacy với sustainable development practices.",
    "Diversity appreciation với respect for different perspectives và approaches.",
    "Continuous improvement philosophy với regular reflection và skill assessment.",
    "Environmental consciousness trong efficient coding và resource optimization."
  ],
  // Future Goals (101-120): Career aspirations and future plans
  future_goals: [
    "Goal: become technical architect với expertise trong scalable system design.",
    "Interest trong AI/ML integration với web applications.",
    "Aspiration to contribute to open source projects tech community.",
    "Plan to expand into mobile development cloud architecture.",
    "Long-term vision: tech leadership role với team management responsibilities.",
    "Career progression toward senior technical leadership positions.",
    "Specialization goal trong machine learning và artificial intelligence applications.",
    "Entrepreneurship interest với tech startup founding và product development.",
    "Public speaking goals cho conferences meetups và knowledge sharing events.",
    "Writing goals: technical blog tutorial series possibly technical book authoring.",
    "Teaching aspirations through bootcamps workshops hoặc university guest lectures.",
    "Industry recognition goal through portfolio contributions và thought leadership.",
    "Global expansion với international client base và remote team leadership.",
    "Technology consulting business development với expertise trong modern solutions.",
    "Research interest trong emerging technologies và their practical applications.",
    "Community leadership role trong developer organizations hoặc open source projects.",
    "Certification goals trong advanced cloud architecture và DevOps practices.",
    "Skill diversification into blockchain development IoT hoặc cybersecurity.",
    "Long-term learning goal: Master's degree trong Computer Science hoặc related field.",
    "Legacy goal: contribute to meaningful projects that positively impact society."
  ]
};

function detectIntent(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Owner/Personal information related
  if (lowerQuery.includes('tên') || lowerQuery.includes('name') || 
      lowerQuery.includes('owner') || lowerQuery.includes('chủ sở hữu') ||
      lowerQuery.includes('bạn là ai') || lowerQuery.includes('who are you') ||
      lowerQuery.includes('giới thiệu') || lowerQuery.includes('introduce') ||
      lowerQuery.includes('cá nhân') || lowerQuery.includes('personal') ||
      lowerQuery.includes('sở thích') || lowerQuery.includes('hobby') ||
      lowerQuery.includes('địa điểm') || lowerQuery.includes('location') ||
      lowerQuery.includes('ở đâu') || lowerQuery.includes('where')) {
    return 'owner_info';
  }
  
  // Experience related
  if (lowerQuery.includes('experience') || lowerQuery.includes('kinh nghiệm') || 
      lowerQuery.includes('work') || lowerQuery.includes('job') || 
      lowerQuery.includes('career') || lowerQuery.includes('làm việc')) {
    return 'experience';
  }
  
  // Education related  
  if (lowerQuery.includes('education') || lowerQuery.includes('học vấn') ||
      lowerQuery.includes('study') || lowerQuery.includes('học tập') ||
      lowerQuery.includes('degree') || lowerQuery.includes('certification')) {
    return 'education';
  }
  
  // Values related
  if (lowerQuery.includes('value') || lowerQuery.includes('principle') ||
      lowerQuery.includes('approach') || lowerQuery.includes('philosophy') ||
      lowerQuery.includes('belief') || lowerQuery.includes('giá trị')) {
    return 'values';
  }
  
  // Future related
  if (lowerQuery.includes('future') || lowerQuery.includes('goal') ||
      lowerQuery.includes('plan') || lowerQuery.includes('aspiration') ||
      lowerQuery.includes('tương lai') || lowerQuery.includes('mục tiêu')) {
    return 'future_goals';
  }
  
  // Default to general about
  return 'about_general';
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
    
    // Fetch dynamic owner information
    const ownerData = await fetchOwnerInfo();
    
    // Detect intent từ query
    const intent = detectIntent(query);
    
    // Get prompts cho detected intent
    let prompts;
    if (intent === 'owner_info') {
      // Generate dynamic owner info prompts
      prompts = ABOUT_PROMPTS.generateOwnerInfo(ownerData);
    } else {
      prompts = ABOUT_PROMPTS[intent as keyof typeof ABOUT_PROMPTS];
      // Handle case where prompts might be a function (shouldn't happen for other categories)
      if (typeof prompts === 'function') {
        prompts = prompts(ownerData);
      }
    }
    
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

    // Lấy thông tin about từ database (if exists)
    let aboutContent;
    try {
      aboutContent = await prisma.aboutContent.findFirst();
    } catch (dbError) {
      console.log('Database not available, using static responses');
    }

    // Build response với database info nếu có
    let response = selectedPrompt;
    if (aboutContent) {
      if ((intent === 'education' || query.includes('education')) && aboutContent.education) {
        response += `\n\n📚 Education: ${aboutContent.education}`;
      }
      if ((intent === 'experience' || query.includes('experience')) && aboutContent.experience) {
        response += `\n\n💼 Experience: ${aboutContent.experience}`;
      }
      if (query.includes('skills') && aboutContent.skills) {
        response += `\n\n⚡ Skills: ${aboutContent.skills}`;
      }
    }

    return NextResponse.json({ 
      response,
      intent,
      source: 'about_service',
      category: intent,
      hasPersonalInfo: !!aboutContent
    });

  } catch (error) {
    console.error('About API error:', error);
    return NextResponse.json(
      { 
        response: "Tôi là một passionate developer luôn học hỏi và phát triển các ứng dụng web hiện đại. Có kinh nghiệm trong full-stack development với focus vào user experience và code quality.",
        intent: 'about_general',
        source: 'about_service',
        error: 'Fallback response used'
      },
      { status: 200 }
    );
  }
}
