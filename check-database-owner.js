// Check and update database owner information
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndUpdateOwnerInfo() {
  console.log('📊 Checking Current Database Owner Information...\n');

  try {
    // Check about content
    const aboutContent = await prisma.aboutContent.findFirst();
    console.log('👤 ABOUT CONTENT:');
    console.log(`Heading: ${aboutContent?.heading || 'Not found'}`);
    console.log(`Description: ${aboutContent?.aboutDescription?.substring(0, 100) || 'Not found'}...`);
    console.log(`Skills: ${aboutContent?.skills?.substring(0, 50) || 'Not found'}...`);
    console.log('');

    // Check contact info
    const contactInfo = await prisma.contactInfo.findFirst();
    console.log('📧 CONTACT INFO:');
    console.log(`Email: ${contactInfo?.email || 'Not found'}`);
    console.log(`Phone: ${contactInfo?.phone || 'Not found'}`);
    console.log(`Address: ${contactInfo?.address || 'Not found'}`);
    console.log(`GitHub: ${contactInfo?.githubUrl || 'Not found'}`);
    console.log(`LinkedIn: ${contactInfo?.linkedinUrl || 'Not found'}`);
    console.log('');

    // If "Your Name" is found, ask if we should update it
    if (aboutContent?.heading.includes('Your Name')) {
      console.log('⚠️  DETECTED: Default "Your Name" in database');
      console.log('💡 RECOMMENDATION: Update database with actual owner information');
      console.log('');
      console.log('🔧 SUGGESTED UPDATES:');
      console.log('1. About Content heading: "Hi, I\'m [Actual Name]"');
      console.log('2. About Description: More specific personal description');
      console.log('3. Contact Info: Real contact details');
      console.log('');
      console.log('📝 You can update this via:');
      console.log('- Prisma Studio (npx prisma studio)');
      console.log('- Admin panel (/admin/about and /admin/contact)');
      console.log('- Direct API calls to /api/about and /api/contact-info');
    } else {
      console.log('✅ Database contains specific owner information');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkAndUpdateOwnerInfo();
