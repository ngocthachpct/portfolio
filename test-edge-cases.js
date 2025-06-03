// Extended test for edge cases
const edgeCaseMessages = [
  'What can you do?',
  'chuyển sang light mode',
  'system theme',
  'các dự án nổi bật',
  'kỹ năng lập trình',
  'thông tin liên lạc',
  'giới thiệu bản thân',
  'bài viết blog',
  'random question that should fallback'
];

async function testEdgeCases() {
  console.log('🧪 Testing Edge Cases and Fallback...\n');
  
  for (const message of edgeCaseMessages) {
    try {
      console.log(`📝 Testing: "${message}"`);
      
      const response = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: `test_edge_${Date.now()}`
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
        console.log(`   Response: ${data.response.substring(0, 80)}...`);
        
        // Check if response is meaningful
        if (data.response.length > 10 && data.confidence > 0.3) {
          console.log('   ✅ SUCCESS\n');
        } else {
          console.log('   ⚠️  LOW QUALITY RESPONSE\n');
        }
      } else {
        console.log(`   ❌ HTTP Error: ${response.status}\n`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
}

testEdgeCases().catch(console.error);
