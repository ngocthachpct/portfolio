import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 100 prompts về Contact Information
const CONTACT_RESPONSES = [
  // Email communication
  "📧 Email là cách tốt nhất để thảo luận về cơ hội nghề nghiệp và technical discussions chi tiết.",
  "Thường phản hồi emails trong vòng 24 giờ, sẵn sàng schedule calls hoặc meetings.",
  "Email phù hợp cho: job opportunities, project discussions, technical consultations.",
  "Professional email communication với detailed responses về requirements và proposals.",
  "Prefer email cho formal discussions, documentation, và follow-up communications.",
  
  // Phone communication
  "📞 Phone calls available cho urgent discussions hoặc real-time problem solving.",
  "Best time để call: business hours (9 AM - 6 PM) hoặc schedule trước.",
  "Phone consultations cho: technical issues, project planning, quick clarifications.",
  "Voice calls preferred cho complex discussions requiring immediate feedback.",
  "International calling available cho remote collaborations và global clients.",
  
  // Social media presence
  "🌐 LinkedIn cho professional networking, industry updates, career opportunities.",
  "GitHub showcases code quality, project contributions, open source involvement.",
  "Twitter cho tech discussions, industry trends, quick updates.",
  "Professional social media presence với regular updates về projects và achievements.",
  "Social platforms offer different communication styles cho various purposes.",
  
  // Response time commitments
  "⚡ Email responses within 24 hours for all professional inquiries.",
  "Phone availability during business hours với scheduled calls preferred.",
  "Social media monitoring với responses trong reasonable timeframes.",
  "Emergency contact available cho urgent project issues hoặc critical bugs.",
  "Weekend availability cho urgent client needs hoặc production issues.",
  
  // Preferred communication methods
  "Email best cho: detailed discussions, documentation, formal proposals.",
  "Phone ideal cho: brainstorming sessions, complex explanations, immediate feedback.",
  "Video calls excellent cho: demos, screen sharing, collaborative planning.",
  "Chat platforms useful cho: quick questions, status updates, informal discussions.",
  "In-person meetings available cho local clients, major project kickoffs.",
  
  // Professional networking
  "LinkedIn connections welcome từ industry professionals, potential collaborators.",
  "GitHub followers appreciated, code reviews và contributions encouraged.",
  "Professional community participation through meetups, conferences, workshops.",
  "Industry networking for knowledge sharing, collaboration opportunities.",
  "Mentor relationships với junior developers, career guidance discussions.",
  
  // Project inquiry process
  "Initial contact: brief project description, timeline, budget considerations.",
  "Follow-up meeting: detailed requirements, technical specifications, deliverables.",
  "Proposal phase: timeline, milestones, pricing, terms of engagement.",
  "Contract discussion: legal terms, payment schedule, revision processes.",
  "Project kickoff: communication protocols, progress reporting, feedback cycles.",
  
  // Collaboration preferences
  "Remote collaboration preferred với flexible timezone accommodations.",
  "Regular check-ins through video calls, progress reports, milestone reviews.",
  "Collaborative tools: Slack, Discord, Microsoft Teams cho team communication.",
  "Project management: Trello, Asana, Jira cho task tracking, progress monitoring.",
  "Code collaboration: GitHub, GitLab với pull request workflows.",
  
  // Meeting scheduling
  "Calendar availability shared cho easy meeting scheduling.",
  "Time zone flexibility cho international clients, distributed teams.",
  "Meeting agenda preparation cho productive discussions, clear outcomes.",
  "Recording availability cho reference, team members unable to attend.",
  "Follow-up documentation với action items, decisions, next steps.",
  
  // Technical support
  "Post-launch support available cho bug fixes, feature enhancements.",
  "Emergency technical support cho critical production issues.",
  "Training sessions available cho team onboarding, knowledge transfer.",
  "Documentation provided cho system maintenance, future development.",
  "Long-term relationship building với ongoing support và improvements.",
  
  // Consultation services
  "Technical consultations cho architecture decisions, technology selection.",
  "Code reviews available cho quality assurance, best practices guidance.",
  "Performance audits cho existing systems, optimization recommendations.",
  "Security assessments với vulnerability identification, remediation plans.",
  "Training workshops cho team skill development, technology adoption.",
  
  // Communication etiquette
  "Professional communication standards với clear, concise messaging.",
  "Respectful response times acknowledging receipt, setting expectations.",
  "Constructive feedback delivery với positive, solution-oriented approach.",
  "Cultural sensitivity trong international communications, diverse teams.",
  "Confidentiality respect cho client information, proprietary details.",
  
  // Contact form usage
  "📝 Contact form provides structured way to submit detailed inquiries.",
  "Form submissions reviewed daily với personalized responses.",
  "Preferred cho: initial project inquiries, service requests, general questions.",
  "Automatic confirmation sent với response timeline expectations.",
  "Follow-up communications moved to email cho detailed discussions.",
  
  // Location và availability
  "📍 Remote work available globally với timezone considerations.",
  "Local meetings possible trong specific geographic areas.",
  "Travel available cho major projects, on-site consultations.",
  "Flexible scheduling accommodating different time zones, work schedules.",
  "Holiday schedule communicated in advance với coverage arrangements.",
  
  // Language preferences
  "🗣️ English và Vietnamese communication available cho diverse clients.",
  "Technical documentation provided trong preferred language.",
  "Translation services available cho international collaborations.",
  "Cultural adaptation trong communication styles, business practices.",
  "Multilingual support enhancing global client relationships.",
  
  // Emergency contact
  "🚨 Emergency contact available cho production issues, critical bugs.",
  "Escalation procedures defined cho different severity levels.",
  "Response time commitments cho various emergency categories.",
  "Backup contact information provided cho team continuity.",
  "Emergency procedures documented cho client reference.",
  
  // Privacy và security
  "🔒 Secure communication channels cho sensitive information.",
  "Confidentiality agreements respected, NDA compliance maintained.",
  "Data protection protocols followed cho client information.",
  "Secure file sharing platforms cho document exchange.",
  "Privacy preferences respected trong communication choices.",
  
  // Feedback và testimonials
  "⭐ Client feedback encouraged cho service improvement.",
  "Testimonials available từ previous clients, collaborators.",
  "Reference contacts provided cho verification purposes.",
  "Case studies available demonstrating successful collaborations.",
  "Portfolio evidence supporting communication effectiveness.",
  
  // Follow-up processes
  "📋 Systematic follow-up ensuring no communications missed.",
  "Progress updates provided at regular intervals.",
  "Milestone celebrations with client acknowledgment.",
  "Project completion follow-up với satisfaction assessment.",
  "Long-term relationship maintenance với periodic check-ins.",
  
  // Communication tools
  "💬 Modern communication tools utilized cho efficient interactions.",
  "Video conferencing: Zoom, Google Meet, Microsoft Teams.",
  "Instant messaging: Slack, Discord, WhatsApp cho quick updates.",
  "Project collaboration: Notion, Confluence cho documentation.",
  "Screen sharing capabilities cho demonstrations, troubleshooting.",
  
  // Professional boundaries
  "⏰ Business hours respected với clear availability windows.",
  "Response time expectations set và consistently met.",
  "Professional tone maintained across all communication channels.",
  "Scope boundaries established cho project discussions.",
  "Payment terms discussed upfront avoiding future complications.",
  
  // International clients
  "🌍 International client experience với global business practices.",
  "Currency considerations cho international invoicing.",
  "Legal compliance với international regulations, standards.",
  "Cultural awareness enhancing cross-border collaborations.",
  "Time zone coordination cho real-time collaboration needs.",
  
  // Client onboarding
  "🎯 Structured onboarding process cho new client relationships.",
  "Initial discovery sessions understanding business needs.",
  "Expectation setting cho deliverables, timelines, communication.",
  "Tool setup assistance cho collaboration platforms.",
  "Relationship establishment with key stakeholders.",
  
  // Contact verification
  "✅ Contact information regularly updated ensuring accuracy.",
  "Multiple contact methods provided cho redundancy.",
  "Contact preference accommodation cho client comfort.",
  "Verification processes preventing miscommunications.",
  "Regular contact information audits maintaining current details.",
  
  // Referral network
  "🤝 Professional referral network cho specialized services.",
  "Partner recommendations cho complementary skills.",
  "Subcontractor network cho larger project requirements.",
  "Industry connections cho business development opportunities.",
  "Collaboration opportunities với other professionals.",
  
  // Digital presence
  "💻 Professional website maintained với current contact information.",
  "Portfolio constantly updated với recent work examples.",
  "Blog maintained cho industry insights, technical tutorials.",
  "Professional profiles consistent across platforms.",
  "Digital footprint managed cho professional credibility.",
  
  // Contact analytics
  "📊 Response time tracking ensuring quality service.",
  "Communication effectiveness measured through client feedback.",
  "Contact method preferences analyzed cho service optimization.",
  "Client satisfaction metrics tracked improving service delivery.",
  "Communication patterns analyzed enhancing client experience.",
  
  // Alternative contact methods
  "📱 Messaging apps available cho informal communications.",
  "Social media DMs monitored cho quick questions.",
  "Professional forums participation cho community discussions.",
  "Industry events attendance providing networking opportunities.",
  "Online presence maintained across relevant platforms.",
  
  // Contact security
  "🛡️ Secure contact methods preferred cho sensitive communications.",
  "Encrypted email available cho confidential discussions.",
  "Secure meeting platforms cho privacy-critical conversations.",
  "Contact information protection từ unauthorized access.",
  "Professional communication security protocols followed.",
  
  // Client relationship management
  "📈 CRM system utilized cho systematic client relationship management.",
  "Contact history maintained cho continuity across interactions.",
  "Preference tracking ensuring personalized communication approaches.",
  "Relationship milestones celebrated with clients.",
  "Long-term value focus rather than transactional relationships.",
  
  // Communication innovation
  "🚀 Latest communication technologies explored cho enhanced client experience.",
  "AI-assisted communication tools evaluated cho efficiency improvements.",
  "Automation balanced với personal touch trong client interactions.",
  "Innovation adoption balanced với reliability và familiarity.",
  "Future communication trends considered cho service enhancement."
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';
    
    // Lấy thông tin contact từ database
    const contactInfo = await prisma.contactInfo.findFirst();

    // Filter responses dựa trên query
    let relevantResponses = CONTACT_RESPONSES;
    
    if (query.includes('email') || query.includes('mail')) {
      relevantResponses = CONTACT_RESPONSES.filter((_, index) => 
        index >= 0 && index <= 9 // Email communication section
      );
    } else if (query.includes('phone') || query.includes('điện thoại')) {
      relevantResponses = CONTACT_RESPONSES.filter((_, index) => 
        index >= 5 && index <= 14 // Phone communication section
      );
    } else if (query.includes('social') || query.includes('linkedin') || query.includes('github')) {
      relevantResponses = CONTACT_RESPONSES.filter((_, index) => 
        index >= 10 && index <= 19 // Social media section
      );
    } else if (query.includes('form') || query.includes('contact form')) {
      relevantResponses = CONTACT_RESPONSES.filter((_, index) => 
        index >= 60 && index <= 69 // Contact form section
      );
    }

    // Chọn random response
    const randomResponse = relevantResponses[Math.floor(Math.random() * relevantResponses.length)];

    // Thêm thông tin contact thực tế
    let response = randomResponse;
    if (contactInfo) {
      const contactDetails = [];
      if (contactInfo.email) contactDetails.push(`📧 Email: ${contactInfo.email}`);
      if (contactInfo.phone) contactDetails.push(`📞 Phone: ${contactInfo.phone}`);
      if (contactInfo.address) contactDetails.push(`📍 Address: ${contactInfo.address}`);
      
      const socialLinks = [];
      if (contactInfo.githubUrl) socialLinks.push(`GitHub: ${contactInfo.githubUrl}`);
      if (contactInfo.linkedinUrl) socialLinks.push(`LinkedIn: ${contactInfo.linkedinUrl}`);
      if (contactInfo.twitterUrl) socialLinks.push(`Twitter: ${contactInfo.twitterUrl}`);
      
      if (contactDetails.length > 0) {
        response += `\n\n**Contact Information:**\n${contactDetails.join('\n')}`;
      }
      
      if (socialLinks.length > 0) {
        response += `\n\n**Social Links:**\n${socialLinks.join('\n')}`;
      }
    }

    return NextResponse.json({ 
      response,
      intent: 'contact',
      source: 'contact_service',
      hasContactInfo: !!contactInfo
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to get contact information' },
      { status: 500 }
    );
  }
}
