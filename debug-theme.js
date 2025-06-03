// Simple debug test for theme detection
const testSingleTheme = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Simple Theme Detection Test...\n');

  try {
    const response = await fetch(`${baseUrl}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "dark mode",
        sessionId: `debug_${Date.now()}`
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response received:');
      console.log(`   Message: "dark mode"`);
      console.log(`   Intent: ${data.intent}`);
      console.log(`   Source: ${data.source}`);
      console.log(`   Theme Action: ${data.themeAction || 'none'}`);
      console.log(`   Confidence: ${data.confidence}`);
      console.log(`   Response: ${data.response.substring(0, 150)}...`);
    } else {
      console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
};

testSingleTheme().catch(console.error);
