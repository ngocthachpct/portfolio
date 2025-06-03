// Test chatbot in production environment
async function testProductionChatbot() {
  console.log('🤖 Testing Production Chatbot...\n');

  const testMessages = [
    'Xin chào',
    'Hãy kể về projects',
    'Skills của bạn là gì?',
    'Thông tin liên hệ',
    'Blog có gì hay?',
    'About yourself'
  ];

  // Replace with your actual Vercel domain
  const productionUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://your-domain.vercel.app';

  console.log(`Testing URL: ${productionUrl}/api/chatbot\n`);

  for (const message of testMessages) {
    try {
      console.log(`📤 Testing: "${message}"`);
      
      const response = await fetch(`${productionUrl}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId: `test_${Date.now()}`,
          userId: 'test_user'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Success: Intent="${result.intent}", Source="${result.source}", Confidence=${result.confidence}`);
        console.log(`📋 Response: ${result.response.substring(0, 100)}...`);
        console.log(`⏱️  Response Time: ${result.responseTime}ms`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Error ${response.status}: ${errorText}`);
      }
      
      console.log('─'.repeat(80));
      
      // Wait between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`💥 Request failed: ${error.message}`);
      console.log('─'.repeat(80));
    }
  }

  console.log('\n🏁 Production Chatbot Test Complete!');
  console.log('\n📊 Summary:');
  console.log('- All endpoints should return 200 status');
  console.log('- Responses should be contextually relevant');
  console.log('- Error handling should provide graceful fallbacks');
  console.log('- Database errors should not crash the API');
}

// Run the test if called directly
if (typeof window === 'undefined' && require.main === module) {
  testProductionChatbot().catch(console.error);
}

module.exports = { testProductionChatbot };
