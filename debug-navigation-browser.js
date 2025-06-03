// Debug navigation with console logging
async function debugNavigation() {
  console.log('🔍 Debugging Navigation with Console Logging...\n');
  
  // Open browser dev tools to see console logs from this script
  console.log('Please check your browser console for additional logs when this test runs');
  
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
      console.log('Got API response:', data);
      
      // Log specific navigation fields
      console.log(`Intent: ${data.intent}`);
      console.log(`NavigationAction: ${data.navigationAction || 'MISSING!'}`);
      
      // Attempt to manually navigate (this will only work in browser context)
      if (typeof window !== 'undefined' && window.location && data.navigationAction) {
        console.log('Attempting manual navigation to:', data.navigationAction);
        setTimeout(() => {
          console.log('Navigation timeout triggered, redirecting now...');
          window.location.href = data.navigationAction;
        }, 2000);
      }
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

debugNavigation().catch(console.error);

// This script needs to be run in the browser context to test navigation
