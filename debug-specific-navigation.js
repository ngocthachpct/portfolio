// Debug specific navigation issue
async function debugSpecificNavigation() {
  console.log('🔍 Debugging "chuyển tới projects" intent detection...\n');
  
  const testMessage = 'chuyển tới projects';
  
  try {
    const response = await fetch('http://localhost:3000/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: testMessage,
        sessionId: `debug_${Date.now()}`
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Message: "${testMessage}"`);
      console.log(`Detected Intent: ${data.intent}`);
      console.log(`Expected Intent: navigate_projects`);
      console.log(`Source: ${data.source}`);
      console.log(`Navigation Action: ${data.navigationAction || 'none'}`);
      console.log(`Response: ${data.response.substring(0, 100)}...`);
      
      if (data.intent === 'navigate_projects') {
        console.log('\n✅ Navigation intent detected correctly');
      } else {
        console.log('\n❌ Navigation intent not detected');
        console.log('This suggests the keyword matching is not working as expected');
      }
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

debugSpecificNavigation().catch(console.error);
