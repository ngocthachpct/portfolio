// Test script for enhanced about chatbot service with owner info
const testAboutOwnerChatbot = async () => {
  const baseUrl = 'http://localhost:3000/api/chatbot/about';
  
  // Test queries for owner information
  const testQueries = [
    // Owner info queries (Vietnamese)
    { query: 'tên bạn là gì', expectedIntent: 'owner_info' },
    { query: 'bạn là ai', expectedIntent: 'owner_info' },
    { query: 'giới thiệu về bạn', expectedIntent: 'owner_info' },
    { query: 'bạn ở đâu', expectedIntent: 'owner_info' },
    { query: 'chủ sở hữu của website này', expectedIntent: 'owner_info' },
    { query: 'thông tin cá nhân', expectedIntent: 'owner_info' },
    { query: 'sở thích của bạn', expectedIntent: 'owner_info' },
    
    // Owner info queries (English)
    { query: 'what is your name', expectedIntent: 'owner_info' },
    { query: 'who are you', expectedIntent: 'owner_info' },
    { query: 'introduce yourself', expectedIntent: 'owner_info' },
    { query: 'where are you located', expectedIntent: 'owner_info' },
    { query: 'personal information', expectedIntent: 'owner_info' },
    { query: 'owner of this website', expectedIntent: 'owner_info' },
    
    // Other intents to ensure they still work
    { query: 'kinh nghiệm làm việc', expectedIntent: 'experience' },
    { query: 'học vấn', expectedIntent: 'education' },
    { query: 'giá trị', expectedIntent: 'values' },
    { query: 'mục tiêu tương lai', expectedIntent: 'future_goals' },
    { query: 'general about', expectedIntent: 'about_general' }
  ];
  
  console.log('🧪 Testing Enhanced About Chatbot with Owner Info...\n');
  
  for (const test of testQueries) {
    try {
      const response = await fetch(`${baseUrl}?query=${encodeURIComponent(test.query)}`);
      const data = await response.json();
      
      console.log(`\n👤 Query: "${test.query}"`);
      console.log(`🎯 Expected Intent: ${test.expectedIntent}`);
      console.log(`✅ Actual Intent: ${data.intent}`);
      console.log(`📊 Intent Match: ${data.intent === test.expectedIntent ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`📖 Response Length: ${data.response.length} characters`);
      console.log(`🔍 Source: ${data.source}`);
      
      // Show first 150 characters of response for owner_info
      if (data.intent === 'owner_info') {
        const preview = data.response.substring(0, 150) + (data.response.length > 150 ? '...' : '');
        console.log(`📄 Owner Info Preview: ${preview}`);
      }
      console.log('─'.repeat(80));
      
    } catch (error) {
      console.error(`❌ Error testing query "${test.query}":`, error.message);
      console.log('─'.repeat(80));
    }
  }
  
  console.log('\n🎉 About chatbot with owner info testing completed!');
};

// Run the test
testAboutOwnerChatbot();
