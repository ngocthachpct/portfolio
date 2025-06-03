// Test direct functionality
const testMessages = [
  'Hello',
  'Tell me about projects',
  'What are your skills?',
  'Contact information',
  'About yourself',
  'Show me your blog',
  'bật dark mode' // This should work
];

async function testDirectFunctionality() {
  console.log('🧪 Testing Direct Functionality...\n');
  
  for (const message of testMessages) {
    try {
      console.log(`📝 Testing: "${message}"`);
      
      const response = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: `test_${Date.now()}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   Intent: ${data.intent}`);
        console.log(`   Source: ${data.source}`);
        console.log(`   Confidence: ${data.confidence}`);
        if (data.themeAction) {
          console.log(`   Theme Action: ${data.themeAction}`);
        }
        console.log(`   Response: ${data.response.substring(0, 100)}...`);
        console.log('   ✅ SUCCESS\n');
      } else {
        console.log(`   ❌ HTTP Error: ${response.status}`);
        const errorText = await response.text();
        console.log(`   Error: ${errorText.substring(0, 200)}\n`);
      }
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}\n`);
    }
  }
}

testDirectFunctionality().catch(console.error);
