// Simple local chatbot test
async function testLocalChatbot() {
  console.log('🤖 Testing Local Chatbot with Error Handling...\n');

  const testMessages = [
    'Xin chào',
    'Hãy kể về projects',
    'Skills của bạn là gì?'
  ];

  for (const message of testMessages) {
    try {
      console.log(`📤 Testing: "${message}"`);
      
      const response = await fetch('http://localhost:3000/api/chatbot', {
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
        console.log(`✅ Success: Intent="${result.intent}", Source="${result.source}"`);
        console.log(`📋 Response: ${result.response.substring(0, 100)}...`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Error ${response.status}: ${errorText}`);
      }
      
      console.log('─'.repeat(80));
      
    } catch (error) {
      console.log(`💥 Request failed: ${error.message}`);
      console.log('─'.repeat(80));
    }
  }

  console.log('\n🏁 Local Chatbot Test Complete!');
}

// Run if called directly
if (typeof window === 'undefined') {
  testLocalChatbot().catch(console.error);
}
