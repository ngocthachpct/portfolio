// Debug navigation response
async function debugNavigationResponse() {
  console.log('🔍 Debugging Navigation API Response...\n');
  
  const testMessage = 'tới trang chủ';
  
  try {
    console.log(`Testing message: "${testMessage}"`);
    
    // Make API request
    const response = await fetch('http://localhost:3000/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: testMessage,
        sessionId: `debug_nav_${Date.now()}`
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Log full API response
      console.log('\n📌 API Response:');
      console.log(JSON.stringify(data, null, 2));
      
      // Check specific navigation fields
      console.log('\n🔎 Navigation Check:');
      console.log(`  Intent: ${data.intent}`);
      console.log(`  NavigationAction: ${data.navigationAction || 'MISSING!'}`);
      console.log(`  Response excerpt: ${data.response.substring(0, 60)}...`);
      
      if (data.navigationAction) {
        console.log('\n✅ NavigationAction is present in the API response.');
      } else {
        console.log('\n❌ NavigationAction is MISSING in the API response!');
      }
    } else {
      console.log(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

debugNavigationResponse().catch(console.error);
