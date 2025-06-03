// Test navigation functionality
async function testNavigation() {
  console.log('🧪 Testing Navigation Commands...\n');
  
  const navigationTests = [
    'tới trang chủ',
    'go to home',
    'chuyển tới about',
    'navigate to projects',
    'vào trang blog',
    'go to contact',
    'trang chủ',
    'about page'
  ];
  
  for (const message of navigationTests) {
    try {
      console.log(`📝 Testing: "${message}"`);
      
      const response = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: `nav_test_${Date.now()}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   Intent: ${data.intent}`);
        console.log(`   Source: ${data.source}`);
        console.log(`   Navigation Action: ${data.navigationAction || 'none'}`);
        console.log(`   Response: ${data.response.substring(0, 80)}...`);
        console.log('');
      } else {
        console.log(`   ❌ HTTP Error: ${response.status}\n`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
}

testNavigation().catch(console.error);
